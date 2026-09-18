import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  runTransaction,
  Timestamp,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "./firebaseCore";
import type { User } from "./firebaseCore";
import type { PatientInvitation, InvitationStatus } from "../types/auth";

export interface CreateInvitationParams {
  nutritionistId: string;
  nutritionistName: string;
  nutritionistEmail: string;
  patientId: string;
  patientEmail: string;
  patientName: string;
  validityDays?: number;
}

/**
 * Normalizes an invitation status considering expiration date.
 */
export const computeInvitationStatus = (
  status: InvitationStatus,
  expiresAt: string,
): InvitationStatus => {
  if (status === "pending" && new Date() > new Date(expiresAt)) {
    return "expired";
  }
  return status;
};

/**
 * Creates or retrieves an existing unexpired pending invitation for a patient (idempotent and concurrent-safe).
 */
export const createOrGetPendingInvitation = async (
  params: CreateInvitationParams,
): Promise<PatientInvitation> => {
  const normalizedEmail = params.patientEmail.toLowerCase().trim();
  const validityDays = params.validityDays || 7;

  // 1. First check existing pending invitation via query for backwards compatibility
  const invRef = collection(db, "invitations");
  const q = query(
    invRef,
    where("nutritionistId", "==", params.nutritionistId),
    where("patientId", "==", params.patientId),
  );

  const snap = await getDocs(q);
  for (const docSnap of snap.docs) {
    const data = docSnap.data() as Omit<PatientInvitation, "id">;
    const computed = computeInvitationStatus(data.status, data.expiresAt);
    if (computed === "pending") {
      return {
        id: docSnap.id,
        ...data,
        status: "pending",
      };
    }
  }

  // 2. Concurrency-safe atomic creation via Firestore transaction
  return await runTransaction(db, async (tx) => {
    const patientRef = doc(
      db,
      "users",
      params.nutritionistId,
      "patients",
      params.patientId,
    );
    const patientSnap = await tx.get(patientRef);
    if (!patientSnap.exists()) {
      throw new Error("PACIENTE_NAO_ENCONTRADO: Paciente não encontrado.");
    }
    const patientData = patientSnap.data();

    // Check if another concurrent transaction just created a pending invitation
    if (patientData.pendingInvitationId) {
      const existingInvRef = doc(
        db,
        "invitations",
        patientData.pendingInvitationId,
      );
      const existingInvSnap = await tx.get(existingInvRef);
      if (existingInvSnap.exists()) {
        const existingData = existingInvSnap.data() as Omit<
          PatientInvitation,
          "id"
        >;
        const computed = computeInvitationStatus(
          existingData.status,
          existingData.expiresAt,
        );
        if (computed === "pending") {
          return {
            id: existingInvSnap.id,
            ...existingData,
            status: "pending",
          };
        }
      }
    }

    const now = new Date();
    const newDocRef = doc(collection(db, "invitations"));
    const expiresAtDate = new Date(
      now.getTime() + validityDays * 24 * 60 * 60 * 1000,
    );
    const expiresAt = expiresAtDate.toISOString();

    const invitation: PatientInvitation = {
      id: newDocRef.id,
      nutritionistId: params.nutritionistId,
      nutritionistName: params.nutritionistName,
      nutritionistEmail: params.nutritionistEmail,
      patientId: params.patientId,
      patientEmail: normalizedEmail,
      patientName: params.patientName,
      status: "pending",
      createdAt: now.toISOString(),
      expiresAt,
    };

    tx.set(newDocRef, {
      nutritionistId: invitation.nutritionistId,
      nutritionistName: invitation.nutritionistName,
      nutritionistEmail: invitation.nutritionistEmail,
      patientId: invitation.patientId,
      patientEmail: invitation.patientEmail,
      patientName: invitation.patientName,
      status: invitation.status,
      createdAt: invitation.createdAt,
      expiresAt: invitation.expiresAt,
      expiresAtTimestamp: Timestamp.fromDate(expiresAtDate),
    });

    tx.update(patientRef, {
      pendingInvitationId: newDocRef.id,
    });

    return invitation;
  });
};

/**
 * Retrieves an invitation by its token/id, returning computed status (expired if past validity).
 */
export const getInvitationByToken = async (
  token: string,
): Promise<PatientInvitation | null> => {
  if (!token) return null;
  const snap = await getDoc(doc(db, "invitations", token));
  if (!snap.exists()) return null;

  const data = snap.data() as Omit<PatientInvitation, "id">;
  const status = computeInvitationStatus(data.status, data.expiresAt);

  return {
    id: snap.id,
    ...data,
    status,
  };
};

/**
 * Revokes an invitation atomically, preventing it from being used.
 */
export const revokeInvitation = async (
  token: string,
  nutritionistId: string,
): Promise<void> => {
  await runTransaction(db, async (tx) => {
    const invRef = doc(db, "invitations", token);
    const invSnap = await tx.get(invRef);
    if (!invSnap.exists()) throw new Error("INVITATION_NOT_FOUND");
    const data = invSnap.data() as Omit<PatientInvitation, "id">;
    if (data.nutritionistId !== nutritionistId) throw new Error("UNAUTHORIZED");
    if (data.status !== "pending") throw new Error("CANNOT_REVOKE_NON_PENDING");

    tx.update(invRef, {
      status: "revoked",
      revokedAt: new Date().toISOString(),
    });

    const patientRef = doc(
      db,
      "users",
      data.nutritionistId,
      "patients",
      data.patientId,
    );
    tx.update(patientRef, {
      pendingInvitationId: null,
    });
  });
};

/**
 * Accepts an invitation by creating a brand new Firebase Auth account with the patient's chosen password.
 * Includes compensation for newly-created Auth account if Firestore batch fails.
 */
export const acceptInvitationWithNewAccount = async (
  token: string,
  passwordText: string,
): Promise<{ uid: string }> => {
  const inv = await getInvitationByToken(token);
  if (!inv) throw new Error("INVITATION_NOT_FOUND");
  if (inv.status === "expired") throw new Error("INVITATION_EXPIRED");
  if (inv.status === "revoked") throw new Error("INVITATION_REVOKED");
  if (inv.status === "accepted") throw new Error("INVITATION_ALREADY_ACCEPTED");

  // 1. Create Firebase Auth user
  let userCred;
  try {
    userCred = await createUserWithEmailAndPassword(
      auth,
      inv.patientEmail,
      passwordText,
    );
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "auth/email-already-in-use"
    ) {
      throw new Error("AUTH_EMAIL_ALREADY_IN_USE");
    }
    throw err;
  }

  const uid = userCred.user.uid;

  try {
    const batch = writeBatch(db);
    const nowIso = new Date().toISOString();

    // 1. Create patient portal profile with invitationId
    batch.set(doc(db, "patientProfiles", uid), {
      patientId: inv.patientId,
      nutritionistId: inv.nutritionistId,
      nutritionistName: inv.nutritionistName,
      nutritionistEmail: inv.nutritionistEmail,
      invitationId: token,
      role: "patient",
      status: "active",
      createdAt: nowIso,
    });

    // 2. Link portalUid on patient doc
    batch.update(
      doc(db, "users", inv.nutritionistId, "patients", inv.patientId),
      {
        portalUid: uid,
        portalStatus: "active",
      },
    );

    // 3. Mark invitation as accepted
    batch.update(doc(db, "invitations", token), {
      status: "accepted",
      acceptedAt: nowIso,
      acceptedByUid: uid,
    });

    await batch.commit();

    return { uid };
  } catch (firestoreErr) {
    console.error("Falha na gravação do vínculo no Firestore:", firestoreErr);
    // Passo C03.5: Compensação segura para conta recém-criada (sem apagar contas preexistentes)
    try {
      await userCred.user.delete();
    } catch (cleanupErr) {
      console.warn(
        "Não foi possível compensar criação da nova conta Auth após falha no Firestore:",
        cleanupErr,
      );
    }
    throw new Error("FIRESTORE_LINK_FAILED");
  }
};

/**
 * Accepts an invitation using an already authenticated patient account.
 * Enforces explicit verification, idempotent retry, and multi-professional boundary check.
 */
export const acceptInvitationWithExistingAccount = async (
  token: string,
  currentUser: User,
): Promise<{ alreadyAccepted?: boolean }> => {
  const inv = await getInvitationByToken(token);
  if (!inv) throw new Error("INVITATION_NOT_FOUND");
  if (inv.status === "expired") throw new Error("INVITATION_EXPIRED");
  if (inv.status === "revoked") throw new Error("INVITATION_REVOKED");

  // Passo C03.6: Idempotência de repetição pelo mesmo usuário
  if (inv.status === "accepted") {
    if (inv.acceptedByUid === currentUser.uid) {
      const patientSnap = await getDoc(
        doc(db, "users", inv.nutritionistId, "patients", inv.patientId),
      );
      if (
        patientSnap.exists() &&
        patientSnap.data().portalUid === currentUser.uid
      ) {
        return { alreadyAccepted: true };
      }
    }
    throw new Error("INVITATION_ALREADY_ACCEPTED");
  }

  // Check email match
  if (
    currentUser.email?.toLowerCase().trim() !==
    inv.patientEmail.toLowerCase().trim()
  ) {
    throw new Error("EMAIL_MISMATCH");
  }

  // Passo C03.7: Check existing patient profile for multi-professional restriction
  const existingProfileSnap = await getDoc(
    doc(db, "patientProfiles", currentUser.uid),
  );
  if (existingProfileSnap.exists()) {
    const existing = existingProfileSnap.data();
    if (
      existing.status !== "revoked" &&
      existing.nutritionistId &&
      existing.nutritionistId !== inv.nutritionistId
    ) {
      throw new Error(
        "MULTI_PROFESSIONAL_NOT_SUPPORTED: Esta conta já está vinculada a outro nutricionista. O sistema suporta um vínculo profissional por conta nesta versão.",
      );
    }
  }

  const uid = currentUser.uid;
  const batch = writeBatch(db);
  const nowIso = new Date().toISOString();

  // 1. Create/Update patient profile with invitationId
  batch.set(
    doc(db, "patientProfiles", uid),
    {
      patientId: inv.patientId,
      nutritionistId: inv.nutritionistId,
      nutritionistName: inv.nutritionistName,
      nutritionistEmail: inv.nutritionistEmail,
      invitationId: token,
      role: "patient",
      status: "active",
      createdAt: nowIso,
    },
    { merge: true },
  );

  // 2. Link portalUid on patient doc
  batch.update(
    doc(db, "users", inv.nutritionistId, "patients", inv.patientId),
    {
      portalUid: uid,
      portalStatus: "active",
    },
  );

  // 3. Mark invitation as accepted
  batch.update(doc(db, "invitations", token), {
    status: "accepted",
    acceptedAt: nowIso,
    acceptedByUid: uid,
  });

  await batch.commit();
  return { alreadyAccepted: false };
};

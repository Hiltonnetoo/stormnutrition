import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
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
 * Creates or retrieves an existing unexpired pending invitation for a patient (idempotent).
 */
export const createOrGetPendingInvitation = async (
  params: CreateInvitationParams,
): Promise<PatientInvitation> => {
  const normalizedEmail = params.patientEmail.toLowerCase().trim();
  const validityDays = params.validityDays || 7;

  // 1. Check for existing pending invitation for this patient
  const invRef = collection(db, "invitations");
  const q = query(
    invRef,
    where("nutritionistId", "==", params.nutritionistId),
    where("patientId", "==", params.patientId),
  );

  const snap = await getDocs(q);
  const now = new Date();

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

  // 2. Create new invitation
  const newDocRef = doc(collection(db, "invitations"));
  const expiresAt = new Date(
    now.getTime() + validityDays * 24 * 60 * 60 * 1000,
  ).toISOString();

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

  await setDoc(newDocRef, {
    nutritionistId: invitation.nutritionistId,
    nutritionistName: invitation.nutritionistName,
    nutritionistEmail: invitation.nutritionistEmail,
    patientId: invitation.patientId,
    patientEmail: invitation.patientEmail,
    patientName: invitation.patientName,
    status: invitation.status,
    createdAt: invitation.createdAt,
    expiresAt: invitation.expiresAt,
  });

  // Link pendingInvitationId to patient doc
  try {
    await updateDoc(
      doc(db, "users", params.nutritionistId, "patients", params.patientId),
      { pendingInvitationId: newDocRef.id },
    );
  } catch (err) {
    console.warn(
      "Não foi possível atualizar pendingInvitationId no paciente:",
      err,
    );
  }

  return invitation;
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
 * Revokes an invitation, preventing it from being used.
 */
export const revokeInvitation = async (
  token: string,
  nutritionistId: string,
): Promise<void> => {
  const inv = await getInvitationByToken(token);
  if (!inv) throw new Error("INVITATION_NOT_FOUND");
  if (inv.nutritionistId !== nutritionistId) throw new Error("UNAUTHORIZED");
  if (inv.status !== "pending") throw new Error("CANNOT_REVOKE_NON_PENDING");

  await updateDoc(doc(db, "invitations", token), {
    status: "revoked",
    revokedAt: new Date().toISOString(),
  });
};

/**
 * Accepts an invitation by creating a brand new Firebase Auth account with the patient's chosen password.
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

  // Create Firebase Auth user
  const userCred = await createUserWithEmailAndPassword(
    auth,
    inv.patientEmail,
    passwordText,
  );
  const uid = userCred.user.uid;

  try {
    // 1. Create patient portal profile
    await setDoc(doc(db, "patientProfiles", uid), {
      patientId: inv.patientId,
      nutritionistId: inv.nutritionistId,
      nutritionistName: inv.nutritionistName,
      nutritionistEmail: inv.nutritionistEmail,
      role: "patient",
      createdAt: new Date().toISOString(),
    });

    // 2. Link portalUid on patient doc
    await updateDoc(
      doc(db, "users", inv.nutritionistId, "patients", inv.patientId),
      { portalUid: uid },
    );

    // 3. Mark invitation as accepted
    await updateDoc(doc(db, "invitations", token), {
      status: "accepted",
      acceptedAt: new Date().toISOString(),
      acceptedByUid: uid,
    });

    return { uid };
  } catch (err) {
    console.error("Falha na aceitação do convite:", err);
    throw err;
  }
};

/**
 * Accepts an invitation using an already authenticated patient account.
 * Enforces explicit verification and multi-professional boundary check.
 */
export const acceptInvitationWithExistingAccount = async (
  token: string,
  currentUser: User,
): Promise<void> => {
  const inv = await getInvitationByToken(token);
  if (!inv) throw new Error("INVITATION_NOT_FOUND");
  if (inv.status === "expired") throw new Error("INVITATION_EXPIRED");
  if (inv.status === "revoked") throw new Error("INVITATION_REVOKED");
  if (inv.status === "accepted") throw new Error("INVITATION_ALREADY_ACCEPTED");

  // Check email match
  if (
    currentUser.email?.toLowerCase().trim() !==
    inv.patientEmail.toLowerCase().trim()
  ) {
    throw new Error("EMAIL_MISMATCH");
  }

  // Check existing patient profile for multi-professional restriction (Passo 7.8)
  const existingProfileSnap = await getDoc(
    doc(db, "patientProfiles", currentUser.uid),
  );
  if (existingProfileSnap.exists()) {
    const existing = existingProfileSnap.data();
    if (
      existing.nutritionistId &&
      existing.nutritionistId !== inv.nutritionistId
    ) {
      throw new Error(
        "MULTI_PROFESSIONAL_NOT_SUPPORTED: Esta conta já está vinculada a outro nutricionista. O sistema suporta um vínculo profissional por conta nesta versão.",
      );
    }
  }

  const uid = currentUser.uid;

  // 1. Create/Update patient profile
  await setDoc(
    doc(db, "patientProfiles", uid),
    {
      patientId: inv.patientId,
      nutritionistId: inv.nutritionistId,
      nutritionistName: inv.nutritionistName,
      nutritionistEmail: inv.nutritionistEmail,
      role: "patient",
      createdAt: new Date().toISOString(),
    },
    { merge: true },
  );

  // 2. Link portalUid on patient doc
  await updateDoc(
    doc(db, "users", inv.nutritionistId, "patients", inv.patientId),
    { portalUid: uid },
  );

  // 3. Mark invitation as accepted
  await updateDoc(doc(db, "invitations", token), {
    status: "accepted",
    acceptedAt: new Date().toISOString(),
    acceptedByUid: uid,
  });
};

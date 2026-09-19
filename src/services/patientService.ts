import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  getCountFromServer,
  doc,
  addDoc,
  updateDoc,
  writeBatch,
  getDoc,
  deleteDoc,
  type FirestoreError,
} from "firebase/firestore";
import { db } from "./firebaseCore";
import type { Patient } from "../types";
import { validatePatient } from "../utils/validation";

// Helper for error handling
const handleSnapshotError = (error: FirestoreError, context: string) => {
  if (error.code === "permission-denied") {
    console.warn(
      `[Firebase] Permission denied for ${context}. Check your Firestore Security Rules.`,
    );
  } else {
    console.error(`[Firebase] Error in ${context}:`, error);
  }
};

const getPatientsCollection = (userId: string) =>
  collection(db, "users", userId, "patients");
const getPatientDoc = (userId: string, patientId: string) =>
  doc(db, "users", userId, "patients", patientId);
const getDietsCollection = (userId: string) =>
  collection(db, "users", userId, "diets");

export const addPatient = (
  userId: string,
  patientData: Omit<Patient, "id">,
) => {
  if (!patientData.firstName?.trim()) {
    throw new Error("O nome do paciente é obrigatório.");
  }
  return addDoc(getPatientsCollection(userId), patientData);
};

export const updatePatient = (
  userId: string,
  patientId: string,
  patientData: Partial<Patient>,
) => {
  return updateDoc(getPatientDoc(userId, patientId), patientData);
};

export const getPatientById = async (
  userId: string,
  patientId: string,
): Promise<Patient | null> => {
  const snap = await getDoc(getPatientDoc(userId, patientId));
  if (!snap.exists()) return null;
  const data = snap.data();
  const createdAt = data.createdAt?.toDate
    ? data.createdAt.toDate().toISOString()
    : data.createdAt;
  return validatePatient({ ...data, id: snap.id, createdAt });
};

/**
 * Archives a patient, preserving full history, diets, and appointments
 * while marking them as inactive/archived for active consultation lists.
 */
export const archivePatient = async (
  userId: string,
  patientId: string,
): Promise<void> => {
  const patientRef = getPatientDoc(userId, patientId);
  await updateDoc(patientRef, {
    status: "Archived",
    archivedAt: new Date().toISOString(),
  });
};

/**
 * Restores an archived patient back to Active status.
 */
export const unarchivePatient = async (
  userId: string,
  patientId: string,
): Promise<void> => {
  const patientRef = getPatientDoc(userId, patientId);
  await updateDoc(patientRef, {
    status: "Active",
    archivedAt: null,
  });
};

/**
 * Revokes portal access for a patient without deleting clinical records or Auth account.
 * Deletes/marks revoked the patientProfiles document so security rules block direct SDK reads.
 */
export const revokePatientPortalAccess = async (
  userId: string,
  patientId: string,
  reason = "Acesso revogado pelo nutricionista.",
): Promise<{
  portalUid?: string;
  revokedInvitationsCount: number;
  /** True when linked profiles or pending invitations could not be revoked;
   *  the patient pointer is cleared anyway, so old links stay denied. */
  cleanupIncomplete: boolean;
}> => {
  const patientRef = getPatientDoc(userId, patientId);
  const patientSnap = await getDoc(patientRef);
  if (!patientSnap.exists()) {
    throw new Error("PACIENTE_NAO_ENCONTRADO: Paciente inexistente.");
  }
  const patientData = patientSnap.data();
  const portalUid = patientData.portalUid as string | undefined;

  // 1. Confirmed revocation of patientProfile if portalUid exists.
  // We do not swallow permission/network errors as if the document was already removed.
  // Profile absence is treated as a specific case (already absent / never created).
  if (portalUid) {
    const profileRef = doc(db, "patientProfiles", portalUid);
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) {
      try {
        await updateDoc(profileRef, {
          status: "revoked",
          revokedAt: new Date().toISOString(),
          revokedReason: reason,
        });
      } catch {
        try {
          await deleteDoc(profileRef);
        } catch {
          throw new Error(
            `FALHA_REVOGACAO_PERFIL: Não foi possível revogar a autorização do perfil do paciente (${portalUid}). O acesso não foi encerrado com sucesso.`,
          );
        }
      }
    }
  }

  // Clean up any lingering patientProfile records pointing to this (userId, patientId)
  let profilesCleanupIncomplete = false;
  try {
    const pSnap = await getDocs(
      query(
        collection(db, "patientProfiles"),
        where("patientId", "==", patientId),
        where("nutritionistId", "==", userId),
      ),
    );
    for (const pDoc of pSnap.docs) {
      if (pDoc.data().status !== "revoked") {
        try {
          await updateDoc(pDoc.ref, {
            status: "revoked",
            revokedAt: new Date().toISOString(),
            revokedReason: reason,
          });
        } catch {
          await deleteDoc(pDoc.ref);
        }
      }
    }
  } catch (err) {
    console.warn("Aviso ao revogar perfis vinculados ao paciente:", err);
    profilesCleanupIncomplete = true;
  }

  let invitationsCleanupIncomplete = false;
  // 2. Revoke any pending invitations for this patient
  let revokedInvitationsCount = 0;
  try {
    const invQuery = query(
      collection(db, "invitations"),
      where("nutritionistId", "==", userId),
      where("patientId", "==", patientId),
    );
    const invSnap = await getDocs(invQuery);
    for (const invDoc of invSnap.docs) {
      const invData = invDoc.data();
      if (invData.status === "pending") {
        await updateDoc(invDoc.ref, {
          status: "revoked",
          revokedAt: new Date().toISOString(),
        });
        revokedInvitationsCount++;
      }
    }
  } catch (err) {
    console.warn("Aviso ao revogar convites do paciente:", err);
    invitationsCleanupIncomplete = true;
  }

  // 3. Clear portalUid and record revocation on patient document
  await updateDoc(patientRef, {
    portalUid: null,
    portalStatus: "revoked",
    portalRevokedAt: new Date().toISOString(),
    pendingInvitationId: null,
  });

  return {
    portalUid,
    revokedInvitationsCount,
    cleanupIncomplete:
      profilesCleanupIncomplete || invitationsCleanupIncomplete,
  };
};

export interface CascadeDeletionResult {
  patientId: string;
  deletedDietsCount: number;
  deletedAppointmentsCount: number;
  deletedInvitationsCount: number;
  portalRevoked: boolean;
  success: boolean;
}

export interface DeletionProgress {
  phase:
    | "locking"
    | "discovering"
    | "deleting_batches"
    | "finalizing"
    | "completed";
  percent: number;
  processedCount: number;
  totalCount: number;
}

/**
 * Permanently deletes a patient and cascades deletions to all associated diets,
 * appointments, invitations, and portal profiles.
 *
 * Implements chunked batching (max 400 docs per batch) to support arbitrary volumes
 * beyond Firestore's 500-operation writeBatch limit, with full idempotency, concurrency locks,
 * resumability upon retry, and orphan cleanup even if the root patient document is absent.
 */
export const deletePatientCascade = async (
  userId: string,
  patientId: string,
  onProgress?: (progress: DeletionProgress) => void,
): Promise<CascadeDeletionResult> => {
  const patientRef = getPatientDoc(userId, patientId);
  const patientSnap = await getDoc(patientRef);
  const patientExists = patientSnap.exists();
  const patientData = patientExists ? patientSnap.data() : null;

  // Phase 1: Lock patient if it exists to prevent concurrent creation of new appointments or diets
  if (patientExists) {
    onProgress?.({
      phase: "locking",
      percent: 10,
      processedCount: 0,
      totalCount: 0,
    });
    const existingDeletionStartedAt = patientData?.deletionStartedAt as
      | string
      | undefined;
    await updateDoc(patientRef, {
      deletionPending: true,
      deletionStartedAt: existingDeletionStartedAt || new Date().toISOString(),
      status: "Inactive",
    });
  }

  // Phase 2: Discover all related document references (even if root patient doc does not exist, to clean up orphans!)
  onProgress?.({
    phase: "discovering",
    percent: 25,
    processedCount: 0,
    totalCount: 0,
  });

  // 2a. Diets
  const dietsQuery = query(
    getDietsCollection(userId),
    where("patientId", "==", patientId),
  );
  const dietsSnap = await getDocs(dietsQuery);
  const dietDocs = dietsSnap.docs;

  // 2b. Appointments
  const apptsQuery = query(
    collection(db, "users", userId, "appointments"),
    where("patientId", "==", patientId),
  );
  const apptsSnap = await getDocs(apptsQuery);
  const apptDocs = apptsSnap.docs;

  // 2c. Invitations
  const invQuery = query(
    collection(db, "invitations"),
    where("nutritionistId", "==", userId),
    where("patientId", "==", patientId),
  );
  const invSnap = await getDocs(invQuery);
  const invDocs = invSnap.docs;

  // 2d. Patient portal profiles (check portalUid + query for any linked profile)
  const profileRefsMap = new Map<string, ReturnType<typeof doc>>();
  const portalUid = patientData?.portalUid as string | undefined;
  if (portalUid) {
    profileRefsMap.set(portalUid, doc(db, "patientProfiles", portalUid));
  }
  try {
    const orphanProfilesQuery = query(
      collection(db, "patientProfiles"),
      where("nutritionistId", "==", userId),
      where("patientId", "==", patientId),
    );
    const profileSnap = await getDocs(orphanProfilesQuery);
    for (const pDoc of profileSnap.docs) {
      profileRefsMap.set(pDoc.id, pDoc.ref);
    }
  } catch (err) {
    console.warn(
      "Aviso ao buscar perfis do paciente para exclusão em cascata:",
      err,
    );
  }

  // Collect all document references to delete in batches
  const allRefsToDelete = [
    ...dietDocs.map((d) => d.ref),
    ...apptDocs.map((d) => d.ref),
    ...invDocs.map((d) => d.ref),
    ...Array.from(profileRefsMap.values()),
  ];

  const totalCount = allRefsToDelete.length + (patientExists ? 1 : 0);

  // If both the patient document and all associated documents are already gone, return cleanly
  if (totalCount === 0) {
    onProgress?.({
      phase: "completed",
      percent: 100,
      processedCount: 0,
      totalCount: 0,
    });
    return {
      patientId,
      deletedDietsCount: 0,
      deletedAppointmentsCount: 0,
      deletedInvitationsCount: 0,
      portalRevoked: false,
      success: true,
    };
  }

  let processedCount = 0;

  // Phase 3: Chunk deletions into batches of max 400 operations (Firestore limit is 500)
  // Resumable: if any batch fails, earlier batches remain committed and deletionPending remains true.
  const BATCH_SIZE = 400;
  for (let i = 0; i < allRefsToDelete.length; i += BATCH_SIZE) {
    const chunk = allRefsToDelete.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);
    for (const ref of chunk) {
      batch.delete(ref);
    }
    await batch.commit();
    processedCount += chunk.length;
    const percent = Math.min(
      90,
      25 + Math.round((processedCount / totalCount) * 65),
    );
    onProgress?.({
      phase: "deleting_batches",
      percent,
      processedCount,
      totalCount,
    });
  }

  // Phase 4: Finalize by deleting the root patient document (if it exists)
  if (patientExists) {
    onProgress?.({
      phase: "finalizing",
      percent: 95,
      processedCount,
      totalCount,
    });
    await deleteDoc(patientRef);
    processedCount++;
  }

  onProgress?.({
    phase: "completed",
    percent: 100,
    processedCount,
    totalCount,
  });

  return {
    patientId,
    deletedDietsCount: dietDocs.length,
    deletedAppointmentsCount: apptDocs.length,
    deletedInvitationsCount: invDocs.length,
    portalRevoked: profileRefsMap.size > 0,
    success: true,
  };
};

/** Backwards-compatible alias for deletePatientCascade */
export const deletePatient = deletePatientCascade;

/**
 * Real-time roster of the professional's patients. It reads the whole
 * collection on purpose: substring search, notifications and patient pickers
 * work over the full roster. Screens must consume it through the shared
 * `PatientDirectoryProvider` (one subscription per session) instead of
 * subscribing on their own.
 */
export const getPatients = (
  userId: string,
  callback: (patients: Patient[]) => void,
  onError?: (error: FirestoreError) => void,
) => {
  if (!userId) return () => {};
  const q = query(getPatientsCollection(userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const patients = snapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : data.createdAt;
        return validatePatient({ ...data, id: doc.id, createdAt });
      });
      patients.sort((a, b) => a.firstName.localeCompare(b.firstName));
      callback(patients);
    },
    (error) => {
      handleSnapshotError(error, "getPatients");
      if (onError) onError(error);
    },
  );
};

/**
 * Server-side count of the professional's patients (aggregation query: one
 * billed read per 1 000 index entries instead of downloading every document).
 * One-shot: callers refresh it when the screen opens, not in real time.
 */
export const countPatients = async (userId: string): Promise<number> => {
  if (!userId) return 0;
  const snap = await getCountFromServer(query(getPatientsCollection(userId)));
  return snap.data().count;
};

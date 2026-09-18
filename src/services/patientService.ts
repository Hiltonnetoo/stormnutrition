import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  writeBatch,
  getDoc,
  deleteDoc,
  type FirestoreError,
  type Query,
  type DocumentData,
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
): Promise<{ portalUid?: string; revokedInvitationsCount: number }> => {
  const patientRef = getPatientDoc(userId, patientId);
  const patientSnap = await getDoc(patientRef);
  if (!patientSnap.exists()) {
    throw new Error("PACIENTE_NAO_ENCONTRADO: Paciente inexistente.");
  }
  const patientData = patientSnap.data();
  const portalUid = patientData.portalUid as string | undefined;

  // 1. Revoke patientProfile if portalUid exists
  if (portalUid) {
    const profileRef = doc(db, "patientProfiles", portalUid);
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
        // Ignored if already removed
      }
    }
  }

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
  }

  // 3. Clear portalUid and record revocation on patient document
  await updateDoc(patientRef, {
    portalUid: null,
    portalStatus: "revoked",
    portalRevokedAt: new Date().toISOString(),
    pendingInvitationId: null,
  });

  return { portalUid, revokedInvitationsCount };
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
 * beyond Firestore's 500-operation writeBatch limit, with full idempotency and concurrency locks.
 */
export const deletePatientCascade = async (
  userId: string,
  patientId: string,
  onProgress?: (progress: DeletionProgress) => void,
): Promise<CascadeDeletionResult> => {
  const patientRef = getPatientDoc(userId, patientId);
  const patientSnap = await getDoc(patientRef);

  // Idempotency: if patient document already does not exist, return cleanly
  if (!patientSnap.exists()) {
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

  // Phase 1: Lock patient to prevent concurrent creation of new appointments or diets
  onProgress?.({
    phase: "locking",
    percent: 10,
    processedCount: 0,
    totalCount: 0,
  });
  await updateDoc(patientRef, {
    deletionPending: true,
    status: "Inactive",
  });

  const patientData = patientSnap.data();
  const portalUid = patientData.portalUid as string | undefined;

  // Phase 2: Discover all related document references
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

  // 2d. Patient portal profile
  const profileRef = portalUid ? doc(db, "patientProfiles", portalUid) : null;

  // Collect all document references to delete in batches
  const allRefsToDelete = [
    ...dietDocs.map((d) => d.ref),
    ...apptDocs.map((d) => d.ref),
    ...invDocs.map((d) => d.ref),
  ];
  if (profileRef) {
    allRefsToDelete.push(profileRef);
  }

  const totalCount = allRefsToDelete.length + 1; // +1 for patient doc itself
  let processedCount = 0;

  // Phase 3: Chunk deletions into batches of max 400 operations (Firestore limit is 500)
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

  // Phase 4: Finalize by deleting the root patient document
  onProgress?.({
    phase: "finalizing",
    percent: 95,
    processedCount,
    totalCount,
  });
  await deleteDoc(patientRef);
  processedCount++;

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
    portalRevoked: !!portalUid,
    success: true,
  };
};

/** Backwards-compatible alias for deletePatientCascade */
export const deletePatient = deletePatientCascade;

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

const getCountClientSide = (
  q: Query<DocumentData>,
  filterFn: (docData: DocumentData) => boolean,
  callback: (count: number) => void,
  contextName: string,
) => {
  return onSnapshot(
    q,
    (snapshot) => {
      let count = 0;
      snapshot.docs.forEach((doc) => {
        if (filterFn(doc.data())) {
          count++;
        }
      });
      callback(count);
    },
    (error) => {
      handleSnapshotError(error, contextName);
    },
  );
};

export const getPatientsCount = (
  userId: string,
  callback: (count: number) => void,
) => {
  if (!userId) return () => {};
  return getCountClientSide(
    query(getPatientsCollection(userId)),
    () => true,
    callback,
    "getPatientsCount",
  );
};

export const getActivePatientsCount = (
  userId: string,
  callback: (count: number) => void,
) => {
  if (!userId) return () => {};
  return getCountClientSide(
    query(getPatientsCollection(userId)),
    (data) => data.status === "Active",
    callback,
    "getActivePatientsCount",
  );
};

export const getNewPatientsThisMonthCount = (
  userId: string,
  callback: (count: number) => void,
) => {
  if (!userId) return () => {};
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const isoStart = startOfMonth.toISOString();

  return getCountClientSide(
    query(getPatientsCollection(userId)),
    (data) => {
      const createdAt = data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : data.createdAt;
      return createdAt >= isoStart;
    },
    callback,
    "getNewPatientsThisMonthCount",
  );
};

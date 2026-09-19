import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  archivePatient,
  unarchivePatient,
  revokePatientPortalAccess,
  deletePatientCascade,
} from "../patientService";
import { addAppointment } from "../appointmentService";
import { saveDietPlan } from "../dietService";
import type { DietPlan } from "../../types";

// In-memory document storage for lifecycle unit tests
let mockStore: Record<string, Record<string, unknown>> = {};
let batchDeletions: string[] = [];
let mockFailProfileUpdate = false;
let mockFailProfileDelete = false;
let mockFailInvitationUpdate = false;
let mockFailBatchCommitOnCount = 0;
let mockBatchCommitCount = 0;

vi.mock("../firebaseCore", () => ({
  db: {},
}));

vi.mock("firebase/firestore", () => {
  return {
    doc: vi.fn((_db, ...parts) => parts.join("/")),
    collection: vi.fn((_db, ...parts) => parts.join("/")),
    where: vi.fn((field, op, val) => ({ field, op, val })),
    query: vi.fn((collPath, ...constraints) => ({ collPath, constraints })),
    getDoc: vi.fn(async (path: string) => {
      const data = mockStore[path];
      return {
        exists: () => Boolean(data),
        data: () => data,
        id: path.split("/").pop(),
        ref: path,
      };
    }),
    getDocs: vi.fn(
      async (q: {
        collPath: string;
        constraints: Array<{ field: string; val: unknown }>;
      }) => {
        const matchingDocs: Array<{
          id: string;
          ref: string;
          data: () => Record<string, unknown>;
        }> = [];
        const collPrefix = q.collPath + "/";

        for (const [key, val] of Object.entries(mockStore)) {
          if (key.startsWith(collPrefix)) {
            let matches = true;
            for (const c of q.constraints) {
              if (val[c.field] !== c.val) {
                matches = false;
                break;
              }
            }
            if (matches) {
              matchingDocs.push({
                id: key.split("/").pop()!,
                ref: key,
                data: () => val,
              });
            }
          }
        }
        return {
          docs: matchingDocs,
          size: matchingDocs.length,
        };
      },
    ),
    updateDoc: vi.fn(async (path: string, updates: Record<string, unknown>) => {
      if (
        mockFailInvitationUpdate &&
        typeof path === "string" &&
        path.startsWith("invitations/")
      ) {
        throw new Error("Network error during invitation cleanup");
      }
      if (
        mockFailProfileUpdate &&
        typeof path === "string" &&
        path.startsWith("patientProfiles/")
      ) {
        throw new Error("Network error during profile update");
      }
      if (!mockStore[path]) {
        throw new Error(`Doc not found for update: ${path}`);
      }
      mockStore[path] = { ...mockStore[path], ...updates };
    }),
    deleteDoc: vi.fn(async (path: string) => {
      if (
        mockFailProfileDelete &&
        typeof path === "string" &&
        path.startsWith("patientProfiles/")
      ) {
        throw new Error("Network error during profile delete fallback");
      }
      delete mockStore[path];
      batchDeletions.push(path);
    }),
    writeBatch: vi.fn(() => {
      const pendingDeletes: string[] = [];
      return {
        delete: vi.fn((ref: string) => {
          pendingDeletes.push(ref);
        }),
        commit: vi.fn(async () => {
          mockBatchCommitCount++;
          if (
            mockFailBatchCommitOnCount > 0 &&
            mockBatchCommitCount === mockFailBatchCommitOnCount
          ) {
            throw new Error("Network interruption on second batch");
          }
          for (const ref of pendingDeletes) {
            delete mockStore[ref];
            batchDeletions.push(ref);
          }
        }),
      };
    }),
    addDoc: vi.fn(async (collPath: string, data: Record<string, unknown>) => {
      const newId = "new_" + Math.random().toString(36).substring(2, 9);
      const newPath = `${collPath}/${newId}`;
      mockStore[newPath] = data;
      return { id: newId, path: newPath };
    }),
  };
});

describe("Patient Lifecycle Service", () => {
  const NUTRI_ID = "nutri_123";
  const PATIENT_ID = "patient_abc";
  const PATIENT_PATH = `users/${NUTRI_ID}/patients/${PATIENT_ID}`;

  beforeEach(() => {
    mockStore = {};
    batchDeletions = [];
    mockFailProfileUpdate = false;
    mockFailProfileDelete = false;
    mockFailInvitationUpdate = false;
    mockFailBatchCommitOnCount = 0;
    mockBatchCommitCount = 0;
  });

  describe("1. Archiving and Unarchiving", () => {
    it("archives an active patient, setting status to Archived and recording archivedAt", async () => {
      mockStore[PATIENT_PATH] = {
        firstName: "Maria",
        lastName: "Silva",
        status: "Active",
      };

      await archivePatient(NUTRI_ID, PATIENT_ID);

      expect(mockStore[PATIENT_PATH].status).toBe("Archived");
      expect(mockStore[PATIENT_PATH].archivedAt).toBeDefined();
    });

    it("unarchives an archived patient back to Active status", async () => {
      mockStore[PATIENT_PATH] = {
        firstName: "Maria",
        lastName: "Silva",
        status: "Archived",
        archivedAt: "2026-09-01T00:00:00Z",
      };

      await unarchivePatient(NUTRI_ID, PATIENT_ID);

      expect(mockStore[PATIENT_PATH].status).toBe("Active");
      expect(mockStore[PATIENT_PATH].archivedAt).toBeNull();
    });
  });

  describe("2. Revoking Patient Portal Access", () => {
    it("revokes patient portal profile, unlinks portalUid, and revokes pending invitations", async () => {
      const PORTAL_UID = "portal_user_xyz";
      mockStore[PATIENT_PATH] = {
        firstName: "Carlos",
        portalUid: PORTAL_UID,
        portalStatus: "active",
      };
      mockStore[`patientProfiles/${PORTAL_UID}`] = {
        patientId: PATIENT_ID,
        nutritionistId: NUTRI_ID,
        status: "active",
      };
      mockStore["invitations/inv_1"] = {
        nutritionistId: NUTRI_ID,
        patientId: PATIENT_ID,
        status: "pending",
      };

      const result = await revokePatientPortalAccess(NUTRI_ID, PATIENT_ID);

      expect(result.portalUid).toBe(PORTAL_UID);
      expect(result.revokedInvitationsCount).toBe(1);

      // Patient profile marked revoked
      expect(mockStore[`patientProfiles/${PORTAL_UID}`].status).toBe("revoked");
      expect(
        mockStore[`patientProfiles/${PORTAL_UID}`].revokedAt,
      ).toBeDefined();

      // Patient document unlinked
      expect(mockStore[PATIENT_PATH].portalUid).toBeNull();
      expect(mockStore[PATIENT_PATH].portalStatus).toBe("revoked");

      // Pending invitation revoked
      expect(mockStore["invitations/inv_1"].status).toBe("revoked");
      expect(result.cleanupIncomplete).toBe(false);
    });

    it("R04-A: reports incomplete cleanup but still clears the pointer (old link denied by the rules)", async () => {
      const PORTAL_UID = "portal_user_partial";
      mockStore[PATIENT_PATH] = {
        firstName: "Carlos",
        portalUid: PORTAL_UID,
        portalStatus: "active",
        pendingInvitationId: "inv_old",
      };
      mockStore[`patientProfiles/${PORTAL_UID}`] = {
        patientId: PATIENT_ID,
        nutritionistId: NUTRI_ID,
        status: "active",
      };
      mockStore["invitations/inv_old"] = {
        nutritionistId: NUTRI_ID,
        patientId: PATIENT_ID,
        status: "pending",
      };
      mockFailInvitationUpdate = true;

      const result = await revokePatientPortalAccess(NUTRI_ID, PATIENT_ID);

      expect(result.cleanupIncomplete).toBe(true);
      expect(result.revokedInvitationsCount).toBe(0);
      // Cleanup failed, so the invitation document is still "pending"...
      expect(mockStore["invitations/inv_old"].status).toBe("pending");
      // ...but the patient no longer points to it nor to the old account.
      expect(mockStore[PATIENT_PATH].pendingInvitationId).toBeNull();
      expect(mockStore[PATIENT_PATH].portalUid).toBeNull();
      expect(mockStore[`patientProfiles/${PORTAL_UID}`].status).toBe("revoked");
    });

    it("throws when attempting to revoke a non-existent patient", async () => {
      await expect(
        revokePatientPortalAccess(NUTRI_ID, "non_existent"),
      ).rejects.toThrow("PACIENTE_NAO_ENCONTRADO");
    });

    it("throws and DOES NOT clear portalUid if profile revocation and deletion both fail", async () => {
      const PORTAL_UID = "portal_user_err";
      mockStore[PATIENT_PATH] = {
        firstName: "Carlos",
        portalUid: PORTAL_UID,
        portalStatus: "active",
      };
      mockStore[`patientProfiles/${PORTAL_UID}`] = {
        patientId: PATIENT_ID,
        nutritionistId: NUTRI_ID,
        status: "active",
      };

      mockFailProfileUpdate = true;
      mockFailProfileDelete = true;

      await expect(
        revokePatientPortalAccess(NUTRI_ID, PATIENT_ID),
      ).rejects.toThrow("FALHA_REVOGACAO_PERFIL");

      // portalUid must NOT have been cleared because revocation was not confirmed!
      expect(mockStore[PATIENT_PATH].portalUid).toBe(PORTAL_UID);
      expect(mockStore[PATIENT_PATH].portalStatus).toBe("active");
    });

    it("succeeds when profile document is absent (already removed or never provisioned)", async () => {
      const PORTAL_UID = "portal_user_missing";
      mockStore[PATIENT_PATH] = {
        firstName: "Carlos",
        portalUid: PORTAL_UID,
        portalStatus: "active",
      };
      // Notice: patientProfiles/PORTAL_UID is NOT in mockStore

      const result = await revokePatientPortalAccess(NUTRI_ID, PATIENT_ID);

      expect(result.portalUid).toBe(PORTAL_UID);
      expect(mockStore[PATIENT_PATH].portalUid).toBeNull();
      expect(mockStore[PATIENT_PATH].portalStatus).toBe("revoked");
    });
  });

  describe("3. Cascade Deletion", () => {
    it("cascades deletion across diets, appointments, invitations, portal profile, and patient document", async () => {
      const PORTAL_UID = "portal_to_delete";
      mockStore[PATIENT_PATH] = {
        firstName: "Lucas",
        portalUid: PORTAL_UID,
      };
      mockStore[`patientProfiles/${PORTAL_UID}`] = {
        patientId: PATIENT_ID,
      };
      mockStore[`users/${NUTRI_ID}/diets/diet_1`] = {
        patientId: PATIENT_ID,
        name: "Plano 1",
      };
      mockStore[`users/${NUTRI_ID}/diets/diet_2`] = {
        patientId: PATIENT_ID,
        name: "Plano 2",
      };
      mockStore[`users/${NUTRI_ID}/appointments/appt_1`] = {
        patientId: PATIENT_ID,
        dateTime: "2026-10-01 10:00",
      };
      mockStore["invitations/inv_del"] = {
        nutritionistId: NUTRI_ID,
        patientId: PATIENT_ID,
      };

      const progressLogs: number[] = [];
      const result = await deletePatientCascade(NUTRI_ID, PATIENT_ID, (p) => {
        progressLogs.push(p.percent);
      });

      expect(result.success).toBe(true);
      expect(result.deletedDietsCount).toBe(2);
      expect(result.deletedAppointmentsCount).toBe(1);
      expect(result.deletedInvitationsCount).toBe(1);
      expect(result.portalRevoked).toBe(true);

      // All documents deleted from store
      expect(mockStore[PATIENT_PATH]).toBeUndefined();
      expect(mockStore[`users/${NUTRI_ID}/diets/diet_1`]).toBeUndefined();
      expect(mockStore[`users/${NUTRI_ID}/diets/diet_2`]).toBeUndefined();
      expect(
        mockStore[`users/${NUTRI_ID}/appointments/appt_1`],
      ).toBeUndefined();
      expect(mockStore["invitations/inv_del"]).toBeUndefined();
      expect(mockStore[`patientProfiles/${PORTAL_UID}`]).toBeUndefined();

      // Progress was reported reaching 100%
      expect(progressLogs).toContain(100);
    });

    it("is completely idempotent: repeated execution on already-deleted patient succeeds cleanly", async () => {
      // Patient does not exist in store
      const result = await deletePatientCascade(NUTRI_ID, "already_deleted");

      expect(result.success).toBe(true);
      expect(result.deletedDietsCount).toBe(0);
      expect(result.deletedAppointmentsCount).toBe(0);
    });

    it("chunks batch deletions when document count exceeds 400", async () => {
      mockStore[PATIENT_PATH] = { firstName: "HighVolumePatient" };

      // Seed 450 diets for this patient
      for (let i = 0; i < 450; i++) {
        mockStore[`users/${NUTRI_ID}/diets/diet_bulk_${i}`] = {
          patientId: PATIENT_ID,
        };
      }

      const result = await deletePatientCascade(NUTRI_ID, PATIENT_ID);

      expect(result.success).toBe(true);
      expect(result.deletedDietsCount).toBe(450);
      expect(mockStore[PATIENT_PATH]).toBeUndefined();
      expect(mockStore[`users/${NUTRI_ID}/diets/diet_bulk_0`]).toBeUndefined();
      expect(
        mockStore[`users/${NUTRI_ID}/diets/diet_bulk_449`],
      ).toBeUndefined();
    });

    it("cleans up orphaned diets, appointments, invitations and profiles even if the root patient document is absent", async () => {
      const PORTAL_UID = "portal_orphan";
      // Patient document does NOT exist in mockStore: mockStore[PATIENT_PATH] is undefined
      mockStore[`users/${NUTRI_ID}/diets/orphan_diet`] = {
        patientId: PATIENT_ID,
        name: "Dieta Órfã",
      };
      mockStore[`users/${NUTRI_ID}/appointments/orphan_appt`] = {
        patientId: PATIENT_ID,
        dateTime: "2026-10-10 10:00",
      };
      mockStore["invitations/orphan_inv"] = {
        nutritionistId: NUTRI_ID,
        patientId: PATIENT_ID,
      };
      mockStore[`patientProfiles/${PORTAL_UID}`] = {
        patientId: PATIENT_ID,
        nutritionistId: NUTRI_ID,
      };

      const result = await deletePatientCascade(NUTRI_ID, PATIENT_ID);

      expect(result.success).toBe(true);
      expect(result.deletedDietsCount).toBe(1);
      expect(result.deletedAppointmentsCount).toBe(1);
      expect(result.deletedInvitationsCount).toBe(1);
      expect(result.portalRevoked).toBe(true);

      // All orphans removed
      expect(mockStore[`users/${NUTRI_ID}/diets/orphan_diet`]).toBeUndefined();
      expect(
        mockStore[`users/${NUTRI_ID}/appointments/orphan_appt`],
      ).toBeUndefined();
      expect(mockStore["invitations/orphan_inv"]).toBeUndefined();
      expect(mockStore[`patientProfiles/${PORTAL_UID}`]).toBeUndefined();
    });

    it("supports retry and resumes after an interrupted intermediate batch without duplicating work", async () => {
      mockStore[PATIENT_PATH] = { firstName: "RetryPatient" };

      // Seed 600 diets (requires 2 batches: 400 + 200)
      for (let i = 0; i < 600; i++) {
        mockStore[`users/${NUTRI_ID}/diets/diet_${i}`] = {
          patientId: PATIENT_ID,
        };
      }

      mockFailBatchCommitOnCount = 2;

      // Attempt 1: Fails on batch 2
      await expect(deletePatientCascade(NUTRI_ID, PATIENT_ID)).rejects.toThrow(
        "Network interruption on second batch",
      );

      // Verify that batch 1 deleted 400 items, but patient doc still exists with deletionPending: true
      expect(mockStore[PATIENT_PATH]).toBeDefined();
      expect(mockStore[PATIENT_PATH].deletionPending).toBe(true);
      expect(mockStore[`users/${NUTRI_ID}/diets/diet_0`]).toBeUndefined();
      expect(mockStore[`users/${NUTRI_ID}/diets/diet_399`]).toBeUndefined();
      expect(mockStore[`users/${NUTRI_ID}/diets/diet_400`]).toBeDefined();

      // Attempt 2: Reset failure flag, retry succeeds and cleans up remaining 200 items + patient doc
      mockFailBatchCommitOnCount = 0;
      mockBatchCommitCount = 0;
      const retryResult = await deletePatientCascade(NUTRI_ID, PATIENT_ID);

      expect(retryResult.success).toBe(true);
      expect(retryResult.deletedDietsCount).toBe(200);
      expect(mockStore[PATIENT_PATH]).toBeUndefined();
      expect(mockStore[`users/${NUTRI_ID}/diets/diet_400`]).toBeUndefined();
      expect(mockStore[`users/${NUTRI_ID}/diets/diet_599`]).toBeUndefined();
    });
  });

  describe("4. Concurrency Guard: deletionPending", () => {
    it("rejects addAppointment when patient is marked deletionPending", async () => {
      mockStore[PATIENT_PATH] = {
        firstName: "EmExclusao",
        deletionPending: true,
      };

      await expect(
        addAppointment(NUTRI_ID, {
          patientId: PATIENT_ID,
          patientName: "EmExclusao",
          dateTime: "2026-10-10T14:00",
          durationMinutes: 45,
          type: "consultation",
          status: "scheduled",
          createdAt: "2026-09-17T00:00:00Z",
        }),
      ).rejects.toThrow("PATIENT_DELETION_PENDING");
    });

    it("rejects saveDietPlan when patient is marked deletionPending", async () => {
      mockStore[PATIENT_PATH] = {
        firstName: "EmExclusao",
        deletionPending: true,
      };

      const dummyPlan: DietPlan = {
        version: 2,
        patientId: PATIENT_ID,
        patientName: "EmExclusao",
        mode: "general",
        createdAt: new Date().toISOString(),
        startDate: "2026-09-17",
        durationDays: 30,
        dailyCalories: 2000,
        macronutrients: {
          proteinGrams: 150,
          proteinPercentage: 30,
          carbsGrams: 200,
          carbsPercentage: 40,
          fatGrams: 67,
          fatPercentage: 30,
        },
        waterRecommendationLiters: 2.5,
        generalObservations: [],
        dietType: "traditional",
        meals: [
          {
            mealName: "Almoço",
            time: "12:00",
            calories: 500,
            protein: 40,
            carbs: 60,
            fat: 10,
            mainOption: {
              name: "Opção 1",
              portion: "1 prato",
              calories: 500,
              protein: 40,
              carbs: 60,
              fat: 10,
              items: [
                {
                  name: "Arroz",
                  portion: "100g",
                  calories: 130,
                  protein: 2.5,
                  carbs: 28,
                  fat: 0.3,
                },
              ],
            },
            alternatives: [],
          },
        ],
      };

      await expect(saveDietPlan(NUTRI_ID, dummyPlan)).rejects.toThrow(
        "PATIENT_DELETION_PENDING",
      );
    });

    it("rejects addAppointment when patient does not exist or is archived", async () => {
      // 1. Non-existent patient
      await expect(
        addAppointment(NUTRI_ID, {
          patientId: "ghost_patient",
          patientName: "Ghost",
          dateTime: "2026-10-10T14:00",
          durationMinutes: 45,
          type: "consultation",
          status: "scheduled",
          createdAt: "2026-09-17T00:00:00Z",
        }),
      ).rejects.toThrow("PACIENTE_NAO_ENCONTRADO");

      // 2. Archived patient
      mockStore[PATIENT_PATH] = {
        firstName: "ArchivedPatient",
        status: "Archived",
      };
      await expect(
        addAppointment(NUTRI_ID, {
          patientId: PATIENT_ID,
          patientName: "ArchivedPatient",
          dateTime: "2026-10-10T14:00",
          durationMinutes: 45,
          type: "consultation",
          status: "scheduled",
          createdAt: "2026-09-17T00:00:00Z",
        }),
      ).rejects.toThrow("PATIENT_ARCHIVED");
    });

    it("rejects saveDietPlan when patient does not exist or is archived", async () => {
      const dummyPlan: DietPlan = {
        version: 2,
        patientId: PATIENT_ID,
        patientName: "TestPlan",
        mode: "general",
        createdAt: new Date().toISOString(),
        startDate: "2026-09-17",
        durationDays: 30,
        dailyCalories: 2000,
        macronutrients: {
          proteinGrams: 150,
          proteinPercentage: 30,
          carbsGrams: 200,
          carbsPercentage: 40,
          fatGrams: 67,
          fatPercentage: 30,
        },
        waterRecommendationLiters: 2.5,
        generalObservations: [],
        dietType: "traditional",
        meals: [],
      };

      // 1. Non-existent patient
      delete mockStore[PATIENT_PATH];
      await expect(saveDietPlan(NUTRI_ID, dummyPlan)).rejects.toThrow(
        "PACIENTE_NAO_ENCONTRADO",
      );

      // 2. Archived patient
      mockStore[PATIENT_PATH] = {
        firstName: "ArchivedPatient",
        status: "Archived",
      };
      await expect(saveDietPlan(NUTRI_ID, dummyPlan)).rejects.toThrow(
        "PATIENT_ARCHIVED",
      );
    });
  });
});

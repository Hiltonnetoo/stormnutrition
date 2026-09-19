import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, beforeAll, afterAll, beforeEach } from "vitest";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  writeBatch,
  Timestamp,
  type DocumentData,
} from "firebase/firestore";

const __dirname = dirname(fileURLToPath(import.meta.url));

const NUTRI_A = "nutritionistA";
const NUTRI_B = "nutritionistB";
const PATIENT_UID = "patientUserA";
const OTHER_PATIENT_UID = "patientUserB";
// Relative dates keep the suite valid over time: a fixed "future" expiry
// (2026-10-01) or record date would silently change what a test proves.
const TODAY = new Date().toISOString().slice(0, 10);
const FUTURE_TS = Timestamp.fromDate(new Date(Date.now() + 90 * 86400000));

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "demo-storm",
    firestore: {
      rules: readFileSync(resolve(__dirname, "../firestore.rules"), "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  // Seed data bypassing the rules (admin context).
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    // Nutritionist root profiles
    await setDoc(doc(db, `users/${NUTRI_A}`), {
      role: "nutritionist",
      email: "nutriA@test.com",
    });
    await setDoc(doc(db, `users/${NUTRI_B}`), {
      role: "nutritionist",
      email: "nutriB@test.com",
    });

    // Patient profile link
    await setDoc(doc(db, `patientProfiles/${PATIENT_UID}`), {
      nutritionistId: NUTRI_A,
      patientId: "p1",
      role: "patient",
      createdAt: "2026-09-17",
    });

    // Nutritionist A's patient record
    await setDoc(doc(db, `users/${NUTRI_A}/patients/p1`), {
      firstName: "Ana",
      clinicalTags: ["diabetes_t2"],
      weight: 60,
      weightHistory: [{ date: "2026-01-01", weight: 60, origin: "clinical" }],
      selfEvaluations: [{ id: "eval_1", status: "completed" }],
      portalUid: PATIENT_UID,
    });

    // Nutritionist A's diets
    await setDoc(doc(db, `users/${NUTRI_A}/diets/d1`), { patientId: "p1" });
    await setDoc(doc(db, `users/${NUTRI_A}/diets/d2`), { patientId: "p2" });

    // Nutritionist A's patient p2
    await setDoc(doc(db, `users/${NUTRI_A}/patients/p2`), {
      firstName: "Carlos",
      status: "Active",
    });

    // Nutritionist B's patient
    await setDoc(doc(db, `users/${NUTRI_B}/patients/pb`), { firstName: "Bob" });
  });
});

describe("Firestore security rules - Authorization Matrix", () => {
  describe("1. Anonymous users", () => {
    it("denies all reads and writes to unauthenticated users", async () => {
      const db = testEnv.unauthenticatedContext().firestore();
      await assertFails(getDoc(doc(db, `users/${NUTRI_A}/patients/p1`)));
      await assertFails(
        setDoc(doc(db, `users/${NUTRI_A}/patients/x`), { firstName: "X" }),
      );
      await assertFails(getDoc(doc(db, `patientProfiles/${PATIENT_UID}`)));
    });
  });

  describe("2. Nutritionist Owner (nutri_owner)", () => {
    it("reads, creates, and updates own patients with valid required fields", async () => {
      const db = testEnv.authenticatedContext(NUTRI_A).firestore();
      await assertSucceeds(getDoc(doc(db, `users/${NUTRI_A}/patients/p1`)));
      await assertSucceeds(
        setDoc(doc(db, `users/${NUTRI_A}/patients/p2`), {
          firstName: "Carlos",
          weight: 75,
        }),
      );
    });

    it("REJECTS patient creation when required firstName is missing or empty", async () => {
      const db = testEnv.authenticatedContext(NUTRI_A).firestore();
      await assertFails(
        setDoc(doc(db, `users/${NUTRI_A}/patients/invalid`), {
          firstName: "", // empty
        }),
      );
    });

    it("allows creating patientProfiles only when the patient actually exists in their workspace", async () => {
      const db = testEnv.authenticatedContext(NUTRI_A).firestore();

      // Allowed: linking patient 'p1' which exists in users/NUTRI_A/patients/p1
      await assertSucceeds(
        setDoc(doc(db, `patientProfiles/newPatientUser`), {
          nutritionistId: NUTRI_A,
          patientId: "p1",
          role: "patient",
          createdAt: "2026-09-17",
        }),
      );

      // FORBIDDEN: trying to create a link to non-existent patient 'p999'
      await assertFails(
        setDoc(doc(db, `patientProfiles/forgedPatientUser`), {
          nutritionistId: NUTRI_A,
          patientId: "p999", // does not exist!
          role: "patient",
          createdAt: "2026-09-17",
        }),
      );
    });

    it("FORBIDS altering immutable association IDs (patientId, nutritionistId) in patientProfiles", async () => {
      const db = testEnv.authenticatedContext(NUTRI_A).firestore();
      // Trying to hijack patient profile to another nutritionist
      await assertFails(
        updateDoc(doc(db, `patientProfiles/${PATIENT_UID}`), {
          nutritionistId: NUTRI_B,
        }),
      );
      // Trying to switch patientId
      await assertFails(
        updateDoc(doc(db, `patientProfiles/${PATIENT_UID}`), {
          patientId: "p2",
        }),
      );
    });

    it("FORBIDS re-assigning portalUid on patient document once already linked", async () => {
      const db = testEnv.authenticatedContext(NUTRI_A).firestore();
      // p1 already has portalUid: PATIENT_UID. Trying to overwrite it with maliciousUid
      await assertFails(
        updateDoc(doc(db, `users/${NUTRI_A}/patients/p1`), {
          portalUid: "hijackedUid",
        }),
      );
      // Keeping identical portalUid is allowed
      await assertSucceeds(
        updateDoc(doc(db, `users/${NUTRI_A}/patients/p1`), {
          portalUid: PATIENT_UID,
        }),
      );
    });
  });

  describe("3. Isolation between Nutritionists (nutri_other)", () => {
    it("FORBIDS reading, creating or updating another's patients", async () => {
      const dbA = testEnv.authenticatedContext(NUTRI_A).firestore();
      await assertFails(getDoc(doc(dbA, `users/${NUTRI_B}/patients/pb`)));
      await assertFails(
        setDoc(doc(dbA, `users/${NUTRI_B}/patients/hack`), {
          firstName: "X",
        }),
      );
    });

    it("FORBIDS accessing patientProfiles created by another nutritionist", async () => {
      const dbB = testEnv.authenticatedContext(NUTRI_B).firestore();
      await assertFails(getDoc(doc(dbB, `patientProfiles/${PATIENT_UID}`)));
      await assertFails(
        updateDoc(doc(dbB, `patientProfiles/${PATIENT_UID}`), {
          createdAt: "2026-09-18",
        }),
      );
    });
  });

  describe("4. Associated Patient Self-Service (patient_linked)", () => {
    it.each([
      ["current weight", { weight: 61 }],
      [
        "weight history",
        {
          weightHistory: [
            { date: "2026-01-01", weight: 60, origin: "clinical" },
            {
              date: TODAY,
              weight: 61,
              origin: "self_reported",
              authorUid: PATIENT_UID,
            },
          ],
        },
      ],
      ["adherence", { adherenceLog: [{ date: TODAY, followed: true }] }],
      [
        "evaluation",
        {
          activeProtocolId: null,
          selfEvaluations: [
            { id: "eval_1", status: "completed" },
            {
              id: "active_eval",
              requestDate: TODAY,
              status: "completed",
              completionDate: TODAY,
              measurements: { weight: 61 },
            },
          ],
        },
      ],
    ])(
      "denies archived patient %s writes and allows the same write after restoration",
      async (_name, update) => {
        await testEnv.withSecurityRulesDisabled(async (ctx) => {
          await updateDoc(
            doc(ctx.firestore(), `users/${NUTRI_A}/patients/p1`),
            {
              status: "Archived",
              adherenceLog: [],
              activeProtocolId: "active_eval",
              selfEvaluations: [
                { id: "eval_1", status: "completed" },
                { id: "active_eval", requestDate: TODAY, status: "pending" },
              ],
            },
          );
        });
        const patientRef = doc(
          testEnv.authenticatedContext(PATIENT_UID).firestore(),
          `users/${NUTRI_A}/patients/p1`,
        );
        await assertFails(getDoc(patientRef));
        await assertFails(updateDoc(patientRef, update as DocumentData));
        const ownerRef = doc(
          testEnv.authenticatedContext(NUTRI_A).firestore(),
          `users/${NUTRI_A}/patients/p1`,
        );
        await assertSucceeds(updateDoc(ownerRef, { status: "Active" }));
        await assertSucceeds(updateDoc(patientRef, update as DocumentData));
      },
    );

    it("lets an associated patient read their own record and diet", async () => {
      const db = testEnv.authenticatedContext(PATIENT_UID).firestore();
      await assertSucceeds(getDoc(doc(db, `users/${NUTRI_A}/patients/p1`)));
      await assertSucceeds(getDoc(doc(db, `users/${NUTRI_A}/diets/d1`)));
    });

    it("FORBIDS reading other patients or diets of other patients", async () => {
      const db = testEnv.authenticatedContext(PATIENT_UID).firestore();
      await assertFails(getDoc(doc(db, `users/${NUTRI_A}/patients/p2`)));
      await assertFails(getDoc(doc(db, `users/${NUTRI_A}/diets/d2`)));
    });

    it("allows self-service weight update and appending to weight history", async () => {
      const db = testEnv.authenticatedContext(PATIENT_UID).firestore();
      await assertSucceeds(
        updateDoc(doc(db, `users/${NUTRI_A}/patients/p1`), {
          weight: 61.5,
          weightHistory: [
            { date: "2026-01-01", weight: 60, origin: "clinical" },
            {
              date: "2026-09-17",
              weight: 61.5,
              origin: "self_reported",
              authorUid: PATIENT_UID,
            },
          ],
        }),
      );
    });

    it("FORBIDS tampering with clinical tags or nutritionist diagnostic fields", async () => {
      const db = testEnv.authenticatedContext(PATIENT_UID).firestore();
      await assertFails(
        updateDoc(doc(db, `users/${NUTRI_A}/patients/p1`), {
          clinicalTags: ["renal_ckd"],
        }),
      );
    });

    it("FORBIDS truncating or erasing historical records in self-service", async () => {
      const db = testEnv.authenticatedContext(PATIENT_UID).firestore();
      // p1 currently has 1 item in weightHistory. Erasing to empty array must FAIL!
      await assertFails(
        updateDoc(doc(db, `users/${NUTRI_A}/patients/p1`), {
          weightHistory: [],
        }),
      );
      // Erasing selfEvaluations must FAIL!
      await assertFails(
        updateDoc(doc(db, `users/${NUTRI_A}/patients/p1`), {
          selfEvaluations: [],
        }),
      );
    });

    it("FORBIDS out-of-range or non-numeric weight values", async () => {
      const db = testEnv.authenticatedContext(PATIENT_UID).firestore();
      await assertFails(
        updateDoc(doc(db, `users/${NUTRI_A}/patients/p1`), { weight: 5 }),
      );
      await assertFails(
        updateDoc(doc(db, `users/${NUTRI_A}/patients/p1`), { weight: 999 }),
      );
    });

    it("FORBIDS tampering with weightHistory items during append", async () => {
      const db = testEnv.authenticatedContext(PATIENT_UID).firestore();
      // Suppose we have an existing item, and we try to alter it while appending a new one
      await assertFails(
        updateDoc(doc(db, `users/${NUTRI_A}/patients/p1`), {
          weight: 65,
          weightHistory: [
            { date: "2026-01-01", weight: 999, origin: "clinical" }, // Tampered the existing
            {
              date: TODAY,
              weight: 65,
              origin: "self_reported",
              authorUid: PATIENT_UID,
            },
          ],
        }),
      );
      // Forging authorUid
      await assertFails(
        updateDoc(doc(db, `users/${NUTRI_A}/patients/p1`), {
          weight: 65,
          weightHistory: [
            { date: "2026-01-01", weight: 60, origin: "clinical" },
            {
              date: TODAY,
              weight: 65,
              origin: "self_reported",
              authorUid: "FORGED_AUTHOR",
            },
          ],
        }),
      );
    });

    it("FORBIDS tampering with selfEvaluations active protocol metadata", async () => {
      // Pending protocol requested by the nutritionist (the seed has none;
      // without it these tests passed/failed for the wrong reason).
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await updateDoc(doc(ctx.firestore(), `users/${NUTRI_A}/patients/p1`), {
          activeProtocolId: "ev1",
          selfEvaluations: [
            { id: "ev1", requestDate: "2026-09-17", status: "pending" },
          ],
        });
      });
      const db = testEnv.authenticatedContext(PATIENT_UID).firestore();
      await assertFails(
        updateDoc(doc(db, `users/${NUTRI_A}/patients/p1`), {
          activeProtocolId: null,
          selfEvaluations: [
            {
              id: "ev1", // active protocol
              requestDate: "2020-01-01", // Tampered request date
              status: "completed",
              completionDate: new Date().toISOString(),
              notes: "My response",
            },
          ],
        }),
      );
    });

    it("ALLOWS legitimate transition of active self evaluation", async () => {
      // Pending protocol requested by the nutritionist (the seed has none;
      // without it these tests passed/failed for the wrong reason).
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await updateDoc(doc(ctx.firestore(), `users/${NUTRI_A}/patients/p1`), {
          activeProtocolId: "ev1",
          selfEvaluations: [
            { id: "ev1", requestDate: "2026-09-17", status: "pending" },
          ],
        });
      });
      const db = testEnv.authenticatedContext(PATIENT_UID).firestore();
      await assertSucceeds(
        updateDoc(doc(db, `users/${NUTRI_A}/patients/p1`), {
          activeProtocolId: null,
          selfEvaluations: [
            {
              id: "ev1",
              requestDate: "2026-09-17",
              status: "completed",
              // Completion happens now; future dates are denied (R02 policy).
              completionDate: new Date().toISOString(),
              notes: "My legit response",
            },
          ],
        }),
      );
    });
  });

  describe("5. Self-Elevation and Role Protection", () => {
    it("FORBIDS user from self-elevating to arbitrary roles during creation or update", async () => {
      const hackerUid = "hackerUser";
      const db = testEnv.authenticatedContext(hackerUid).firestore();

      // Cannot create a profile with role: 'admin'
      await assertFails(
        setDoc(doc(db, `users/${hackerUid}`), {
          role: "admin",
          email: "hacker@test.com",
        }),
      );

      // Can create legitimate nutritionist profile
      await assertSucceeds(
        setDoc(doc(db, `users/${hackerUid}`), {
          role: "nutritionist",
          email: "hacker@test.com",
        }),
      );

      // Cannot subsequently modify role to 'admin'
      await assertFails(
        updateDoc(doc(db, `users/${hackerUid}`), {
          role: "admin",
        }),
      );
    });
  });

  describe("6. Unrelated Patient (patient_other)", () => {
    it("FORBIDS unrelated patient from reading another patient's data", async () => {
      const db = testEnv.authenticatedContext(OTHER_PATIENT_UID).firestore();
      await assertFails(getDoc(doc(db, `users/${NUTRI_A}/patients/p1`)));
      await assertFails(getDoc(doc(db, `users/${NUTRI_A}/diets/d1`)));
    });
  });

  describe("7. Invitations and Link Claiming", () => {
    it("allows nutritionist to create a pending invitation for an existing patient", async () => {
      const db = testEnv.authenticatedContext(NUTRI_A).firestore();
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await assertSucceeds(
        setDoc(doc(db, "invitations/inv-1"), {
          nutritionistId: NUTRI_A,
          patientId: "p1",
          patientEmail: "ana@test.com",
          status: "pending",
          expiresAt: futureDate.toISOString(),
          expiresAtTimestamp: Timestamp.fromDate(futureDate),
        }),
      );
    });

    it("FORBIDS nutritionist from creating invitation for a non-existent patient", async () => {
      const db = testEnv.authenticatedContext(NUTRI_A).firestore();
      await assertFails(
        setDoc(doc(db, "invitations/inv-fake"), {
          nutritionistId: NUTRI_A,
          patientId: "non-existent-patient",
          patientEmail: "fake@test.com",
          status: "pending",
          expiresAt: "2026-10-01T00:00:00Z",
        }),
      );
    });

    it("allows anyone (including unauthenticated) to get individual invitation by token", async () => {
      // Seed invite
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(doc(ctx.firestore(), "invitations/inv-public"), {
          nutritionistId: NUTRI_A,
          patientId: "p1",
          patientEmail: "ana@test.com",
          status: "pending",
          expiresAt: "2026-10-01T00:00:00Z",
        });
      });

      const unauthDb = testEnv.unauthenticatedContext().firestore();
      await assertSucceeds(getDoc(doc(unauthDb, "invitations/inv-public")));
    });

    it("allows nutritionist to revoke an invitation and patient to accept an invitation", async () => {
      // Seed invite
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(doc(ctx.firestore(), "invitations/inv-revoke"), {
          nutritionistId: NUTRI_A,
          patientId: "p1",
          patientEmail: "ana@test.com",
          status: "pending",
          expiresAt: "2026-10-01T00:00:00Z",
        });
      });

      const nutriDb = testEnv.authenticatedContext(NUTRI_A).firestore();
      await assertSucceeds(
        updateDoc(doc(nutriDb, "invitations/inv-revoke"), {
          status: "revoked",
        }),
      );

      // Seed unlinked patient & invite for patient
      const newPatientUid = "patientNew123";
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(
          doc(ctx.firestore(), `users/${NUTRI_A}/patients/p_unlinked`),
          {
            firstName: "Novo",
            pendingInvitationId: "inv-accept",
          },
        );
        await setDoc(doc(ctx.firestore(), "invitations/inv-accept"), {
          nutritionistId: NUTRI_A,
          patientId: "p_unlinked",
          patientEmail: "novo@test.com",
          status: "pending",
          expiresAt: "2026-10-01T00:00:00Z",
          expiresAtTimestamp: FUTURE_TS,
        });
      });

      const patientDb = testEnv
        .authenticatedContext(newPatientUid, { email: "novo@test.com" })
        .firestore();
      // Patient accepts invitation via atomic batch
      const batch = writeBatch(patientDb);
      batch.update(doc(patientDb, "invitations/inv-accept"), {
        status: "accepted",
        acceptedByUid: newPatientUid,
      });
      batch.update(doc(patientDb, `users/${NUTRI_A}/patients/p_unlinked`), {
        portalUid: newPatientUid,
        portalStatus: "active",
      });
      batch.set(doc(patientDb, `patientProfiles/${newPatientUid}`), {
        nutritionistId: NUTRI_A,
        patientId: "p_unlinked",
        invitationId: "inv-accept",
        role: "patient",
      });
      await assertSucceeds(batch.commit());
    });
  });

  describe("8. Patient Lifecycle: Archival, Portal Revocation and Cascade Deletion", () => {
    it("FORBIDS direct SDK read of patient and diets when portal profile has status 'revoked'", async () => {
      // Mark patientProfile as revoked
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await updateDoc(
          doc(ctx.firestore(), `patientProfiles/${PATIENT_UID}`),
          {
            status: "revoked",
            revokedAt: "2026-09-18T00:00:00Z",
          },
        );
      });

      const patientDb = testEnv.authenticatedContext(PATIENT_UID).firestore();
      // Direct SDK reads must FAIL with permission-denied
      await assertFails(getDoc(doc(patientDb, `users/${NUTRI_A}/patients/p1`)));
      await assertFails(getDoc(doc(patientDb, `users/${NUTRI_A}/diets/d1`)));
    });

    it("FORBIDS direct SDK read when patientProfile is deleted", async () => {
      // Delete patientProfile
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        const { deleteDoc } = await import("firebase/firestore");
        await deleteDoc(doc(ctx.firestore(), `patientProfiles/${PATIENT_UID}`));
      });

      const patientDb = testEnv.authenticatedContext(PATIENT_UID).firestore();
      await assertFails(getDoc(doc(patientDb, `users/${NUTRI_A}/patients/p1`)));
      await assertFails(getDoc(doc(patientDb, `users/${NUTRI_A}/diets/d1`)));
    });

    it("allows nutritionist to unlink portalUid by setting it to null", async () => {
      const nutriDb = testEnv.authenticatedContext(NUTRI_A).firestore();
      await assertSucceeds(
        updateDoc(doc(nutriDb, `users/${NUTRI_A}/patients/p1`), {
          portalUid: null,
          portalStatus: "revoked",
        }),
      );
    });

    it("allows nutritionist to delete invitations for their patients", async () => {
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(doc(ctx.firestore(), "invitations/inv-to-delete"), {
          nutritionistId: NUTRI_A,
          patientId: "p1",
          patientEmail: "ana@test.com",
          status: "pending",
          expiresAt: "2026-10-01T00:00:00Z",
        });
      });

      const { deleteDoc } = await import("firebase/firestore");
      const nutriDb = testEnv.authenticatedContext(NUTRI_A).firestore();
      await assertSucceeds(
        deleteDoc(doc(nutriDb, "invitations/inv-to-delete")),
      );
    });

    it("FORBIDS patient self-service writes when deletionPending is true", async () => {
      // Set deletionPending on patient doc
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await updateDoc(doc(ctx.firestore(), `users/${NUTRI_A}/patients/p1`), {
          deletionPending: true,
        });
      });

      const patientDb = testEnv.authenticatedContext(PATIENT_UID).firestore();
      await assertFails(
        updateDoc(doc(patientDb, `users/${NUTRI_A}/patients/p1`), {
          weight: 62.0,
          weightHistory: [
            { date: "2026-01-01", weight: 60, origin: "clinical" },
            { date: "2026-09-18", weight: 62.0, origin: "self_reported" },
          ],
        }),
      );
    });
  });

  describe("9. Appointments (Consultas) Authorization Matrix", () => {
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        const db = ctx.firestore();
        // Seed appointments for Nutri A (p1 and p2)
        await setDoc(doc(db, `users/${NUTRI_A}/appointments/apt_p1`), {
          patientId: "p1",
          patientName: "Ana",
          date: "2026-10-10",
          time: "14:00",
          status: "confirmed",
          type: "follow_up",
        });
        await setDoc(doc(db, `users/${NUTRI_A}/appointments/apt_p2`), {
          patientId: "p2",
          patientName: "Carlos",
          date: "2026-10-10",
          time: "15:00",
          status: "confirmed",
          type: "first_visit",
        });
      });
    });

    it("ALLOWS nutritionist to create, read, update and delete own appointments", async () => {
      const nutriDb = testEnv.authenticatedContext(NUTRI_A).firestore();
      const { deleteDoc } = await import("firebase/firestore");

      // Read
      await assertSucceeds(
        getDoc(doc(nutriDb, `users/${NUTRI_A}/appointments/apt_p1`)),
      );

      // Create
      await assertSucceeds(
        setDoc(doc(nutriDb, `users/${NUTRI_A}/appointments/apt_p3`), {
          patientId: "p1",
          patientName: "Ana",
          date: "2026-10-15",
          time: "10:00",
          status: "scheduled",
        }),
      );

      // Update
      await assertSucceeds(
        updateDoc(doc(nutriDb, `users/${NUTRI_A}/appointments/apt_p1`), {
          status: "completed",
        }),
      );

      // Delete
      await assertSucceeds(
        deleteDoc(doc(nutriDb, `users/${NUTRI_A}/appointments/apt_p1`)),
      );
    });

    it("FORBIDS another nutritionist from reading or writing appointments", async () => {
      const otherNutriDb = testEnv.authenticatedContext(NUTRI_B).firestore();

      await assertFails(
        getDoc(doc(otherNutriDb, `users/${NUTRI_A}/appointments/apt_p1`)),
      );
      await assertFails(
        setDoc(doc(otherNutriDb, `users/${NUTRI_A}/appointments/apt_hack`), {
          patientId: "p1",
          status: "cancelled",
        }),
      );
    });

    it("ALLOWS linked patient to read ONLY their own appointments", async () => {
      const patientDb = testEnv.authenticatedContext(PATIENT_UID).firestore();

      // Read own appointment (patientId == p1)
      await assertSucceeds(
        getDoc(doc(patientDb, `users/${NUTRI_A}/appointments/apt_p1`)),
      );

      // FORBID reading another patient's appointment (patientId == p2)
      await assertFails(
        getDoc(doc(patientDb, `users/${NUTRI_A}/appointments/apt_p2`)),
      );
    });

    it("FORBIDS linked patient from creating, updating, or deleting appointments", async () => {
      const patientDb = testEnv.authenticatedContext(PATIENT_UID).firestore();
      const { deleteDoc } = await import("firebase/firestore");

      await assertFails(
        setDoc(doc(patientDb, `users/${NUTRI_A}/appointments/apt_new`), {
          patientId: "p1",
          date: "2026-10-20",
          time: "09:00",
        }),
      );

      await assertFails(
        updateDoc(doc(patientDb, `users/${NUTRI_A}/appointments/apt_p1`), {
          status: "cancelled",
        }),
      );

      await assertFails(
        deleteDoc(doc(patientDb, `users/${NUTRI_A}/appointments/apt_p1`)),
      );
    });

    it("FORBIDS unauthenticated users from accessing appointments", async () => {
      const unauthDb = testEnv.unauthenticatedContext().firestore();

      await assertFails(
        getDoc(doc(unauthDb, `users/${NUTRI_A}/appointments/apt_p1`)),
      );
      await assertFails(
        setDoc(doc(unauthDb, `users/${NUTRI_A}/appointments/apt_unauth`), {
          patientId: "p1",
        }),
      );
    });
  });

  describe("10. Passo C01 - Anti-Self-Declared Links & Portal Appropriation Regressions", () => {
    const ATTACKER_UID = "attackerUser123";

    it("FORBIDS creating self-declared patientProfiles pointing to another nutritionist/patient without an invitation", async () => {
      const attackerDb = testEnv.authenticatedContext(ATTACKER_UID).firestore();

      // Attacker tries to declare themselves linked to Nutri A's patient p1
      await assertFails(
        setDoc(doc(attackerDb, `patientProfiles/${ATTACKER_UID}`), {
          nutritionistId: NUTRI_A,
          patientId: "p1",
          role: "patient",
        }),
      );

      // Attacker tries to declare themselves linked to an unlinked patient
      await assertFails(
        setDoc(doc(attackerDb, `patientProfiles/${ATTACKER_UID}`), {
          nutritionistId: NUTRI_A,
          patientId: "p_unlinked",
          role: "patient",
        }),
      );
    });

    it("FORBIDS arbitrary user from appropriating portalUid on an unlinked patient without an atomic invitation batch", async () => {
      // Seed unlinked patient
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(
          doc(ctx.firestore(), `users/${NUTRI_A}/patients/p_target`),
          {
            firstName: "Target",
            portalUid: null,
          },
        );
      });

      const attackerDb = testEnv.authenticatedContext(ATTACKER_UID).firestore();

      // Attacker tries direct updateDoc to set portalUid
      await assertFails(
        updateDoc(doc(attackerDb, `users/${NUTRI_A}/patients/p_target`), {
          portalUid: ATTACKER_UID,
        }),
      );
    });

    it("FORBIDS creating patientProfile referencing non-existent or fake invitation token", async () => {
      const attackerDb = testEnv.authenticatedContext(ATTACKER_UID).firestore();

      await assertFails(
        setDoc(doc(attackerDb, `patientProfiles/${ATTACKER_UID}`), {
          nutritionistId: NUTRI_A,
          patientId: "p1",
          invitationId: "fake-non-existent-token",
          role: "patient",
        }),
      );
    });

    it("FORBIDS user with mismatched email from accepting an invitation", async () => {
      // Seed invitation targeted at legitimate email
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(
          doc(ctx.firestore(), `users/${NUTRI_A}/patients/p_alice`),
          {
            firstName: "Alice",
          },
        );
        await setDoc(doc(ctx.firestore(), "invitations/inv-alice"), {
          nutritionistId: NUTRI_A,
          patientId: "p_alice",
          patientEmail: "alice@legitimate.com",
          status: "pending",
          expiresAt: "2026-12-01T00:00:00Z",
        });
      });

      // Attacker Eve has eve@attacker.com
      const eveDb = testEnv
        .authenticatedContext(ATTACKER_UID, { email: "eve@attacker.com" })
        .firestore();

      const batch = writeBatch(eveDb);
      batch.update(doc(eveDb, "invitations/inv-alice"), {
        status: "accepted",
        acceptedByUid: ATTACKER_UID,
      });
      batch.update(doc(eveDb, `users/${NUTRI_A}/patients/p_alice`), {
        portalUid: ATTACKER_UID,
        portalStatus: "active",
      });
      batch.set(doc(eveDb, `patientProfiles/${ATTACKER_UID}`), {
        nutritionistId: NUTRI_A,
        patientId: "p_alice",
        invitationId: "inv-alice",
        role: "patient",
      });

      // Must FAIL because eve's email does not match alice@legitimate.com
      await assertFails(batch.commit());
    });

    it("FORBIDS user from accepting an expired invitation", async () => {
      // Seed expired invitation with past expiresAtTimestamp
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(
          doc(ctx.firestore(), `users/${NUTRI_A}/patients/p_expired`),
          {
            firstName: "ExpiredTarget",
          },
        );
        await setDoc(doc(ctx.firestore(), "invitations/inv-expired"), {
          nutritionistId: NUTRI_A,
          patientId: "p_expired",
          patientEmail: "expired@test.com",
          status: "pending",
          expiresAt: "2026-01-01T00:00:00Z",
          expiresAtTimestamp: Timestamp.fromDate(
            new Date("2026-01-01T00:00:00Z"),
          ),
        });
      });

      const userDb = testEnv
        .authenticatedContext("expiredUser", { email: "expired@test.com" })
        .firestore();

      const batch = writeBatch(userDb);
      batch.update(doc(userDb, "invitations/inv-expired"), {
        status: "accepted",
        acceptedByUid: "expiredUser",
      });
      batch.update(doc(userDb, `users/${NUTRI_A}/patients/p_expired`), {
        portalUid: "expiredUser",
        portalStatus: "active",
      });
      batch.set(doc(userDb, `patientProfiles/expiredUser`), {
        nutritionistId: NUTRI_A,
        patientId: "p_expired",
        invitationId: "inv-expired",
        role: "patient",
      });

      await assertFails(batch.commit());
    });

    it("DENIES silent nutritionist fallback for unprofiled account (no /users/{uid})", async () => {
      const unprofiledUid = "unprofiledAccount";
      const unprofiledDb = testEnv
        .authenticatedContext(unprofiledUid)
        .firestore();

      // Must FAIL: Cannot create patients under their own UID if /users/{uid} doesn't exist
      await assertFails(
        setDoc(doc(unprofiledDb, `users/${unprofiledUid}/patients/p_orphan`), {
          firstName: "ShouldFail",
        }),
      );

      // Must FAIL: Cannot create invitations
      await assertFails(
        setDoc(doc(unprofiledDb, "invitations/inv-orphan"), {
          nutritionistId: unprofiledUid,
          patientId: "p_orphan",
          patientEmail: "test@test.com",
          status: "pending",
          expiresAt: "2026-10-01T00:00:00Z",
        }),
      );
    });

    it("PREVENTS revoked patient link from reading patient record, diets, or appointments even if profile remains", async () => {
      // Revoke p1 in nutritionist's workspace
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await updateDoc(doc(ctx.firestore(), `users/${NUTRI_A}/patients/p1`), {
          portalUid: null,
          portalStatus: "revoked",
        });
        await updateDoc(
          doc(ctx.firestore(), `patientProfiles/${PATIENT_UID}`),
          {
            status: "revoked",
          },
        );
      });

      const revokedPatientDb = testEnv
        .authenticatedContext(PATIENT_UID)
        .firestore();

      // All reads must FAIL
      await assertFails(
        getDoc(doc(revokedPatientDb, `users/${NUTRI_A}/patients/p1`)),
      );
      await assertFails(
        getDoc(doc(revokedPatientDb, `users/${NUTRI_A}/diets/d1`)),
      );
      await assertFails(
        getDoc(doc(revokedPatientDb, `users/${NUTRI_A}/appointments/apt_p1`)),
      );
    });

    it("ALLOWS legitimate atomic invitation acceptance and subsequent authorized reading", async () => {
      const legitUid = "legitPatientUser";
      const legitEmail = "legit@clinic.com";

      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(
          doc(ctx.firestore(), `users/${NUTRI_A}/patients/p_legit`),
          {
            firstName: "Legit Patient",
            pendingInvitationId: "inv-legit",
          },
        );
        await setDoc(doc(ctx.firestore(), "invitations/inv-legit"), {
          nutritionistId: NUTRI_A,
          patientId: "p_legit",
          patientEmail: legitEmail,
          status: "pending",
          expiresAt: "2026-12-01T00:00:00Z",
          expiresAtTimestamp: FUTURE_TS,
        });
        await setDoc(
          doc(ctx.firestore(), `users/${NUTRI_A}/diets/diet_legit`),
          {
            patientId: "p_legit",
          },
        );
      });

      const legitDb = testEnv
        .authenticatedContext(legitUid, { email: legitEmail })
        .firestore();

      // 1. Atomic batch commit succeeds
      const batch = writeBatch(legitDb);
      batch.update(doc(legitDb, "invitations/inv-legit"), {
        status: "accepted",
        acceptedByUid: legitUid,
      });
      batch.update(doc(legitDb, `users/${NUTRI_A}/patients/p_legit`), {
        portalUid: legitUid,
        portalStatus: "active",
      });
      batch.set(doc(legitDb, `patientProfiles/${legitUid}`), {
        nutritionistId: NUTRI_A,
        patientId: "p_legit",
        invitationId: "inv-legit",
        role: "patient",
      });
      await assertSucceeds(batch.commit());

      // 2. Legit patient can now read their own patient record and diet
      await assertSucceeds(
        getDoc(doc(legitDb, `users/${NUTRI_A}/patients/p_legit`)),
      );
      await assertSucceeds(
        getDoc(doc(legitDb, `users/${NUTRI_A}/diets/diet_legit`)),
      );

      // 3. Attacker STILL cannot read legit patient's record or diet
      const attackerDb = testEnv.authenticatedContext(ATTACKER_UID).firestore();
      await assertFails(
        getDoc(doc(attackerDb, `users/${NUTRI_A}/patients/p_legit`)),
      );
      await assertFails(
        getDoc(doc(attackerDb, `users/${NUTRI_A}/diets/diet_legit`)),
      );
    });

    it("DENIES read even if attacker has a forged patientProfile because nutritionist patient doc does not point to attacker", async () => {
      const forgedUid = "forgedAccountUid";

      // Seed a forged profile (as if directly written or legacy leftover)
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(doc(ctx.firestore(), `patientProfiles/${forgedUid}`), {
          nutritionistId: NUTRI_A,
          patientId: "p1", // Points to Ana (p1), but p1.portalUid is PATIENT_UID
          role: "patient",
        });
      });

      const forgedDb = testEnv.authenticatedContext(forgedUid).firestore();

      // Both reads must FAIL because p1.portalUid !== forgedUid
      await assertFails(getDoc(doc(forgedDb, `users/${NUTRI_A}/patients/p1`)));
      await assertFails(getDoc(doc(forgedDb, `users/${NUTRI_A}/diets/d1`)));
    });
  });

  describe("11. Passo C02 - Integrity and Authorship Protection for Historical Records", () => {
    it("FORBIDS patient from replacing an existing weight record with another of the same array size", async () => {
      // p1 starts with 1 record: [{ date: "2026-01-01", weight: 60, origin: "clinical" }]
      const patientDb = testEnv.authenticatedContext(PATIENT_UID).firestore();

      // Tamper attempt: replacing the clinical record with a forged one of the same array size (1)
      await assertFails(
        updateDoc(doc(patientDb, `users/${NUTRI_A}/patients/p1`), {
          weight: 55,
          weightHistory: [
            { date: "2026-01-01", weight: 55, origin: "self_reported" },
          ],
        }),
      );
    });

    it("FORBIDS patient from adding a weight record with clinical origin", async () => {
      const patientDb = testEnv.authenticatedContext(PATIENT_UID).firestore();

      // Attempting to append a record with origin: "clinical"
      await assertFails(
        updateDoc(doc(patientDb, `users/${NUTRI_A}/patients/p1`), {
          weight: 61,
          weightHistory: [
            { date: "2026-01-01", weight: 60, origin: "clinical" },
            { date: "2026-09-18", weight: 61, origin: "clinical" },
          ],
        }),
      );
    });

    it("FORBIDS patient from forging authorUid to another user", async () => {
      const patientDb = testEnv.authenticatedContext(PATIENT_UID).firestore();

      // Attempting to impersonate nutritionist in authorUid
      await assertFails(
        updateDoc(doc(patientDb, `users/${NUTRI_A}/patients/p1`), {
          weight: 61.5,
          weightHistory: [
            { date: "2026-01-01", weight: 60, origin: "clinical" },
            {
              date: "2026-09-18",
              weight: 61.5,
              origin: "self_reported",
              authorUid: NUTRI_A,
            },
          ],
        }),
      );
    });

    it("FORBIDS patient from arbitrarily setting activeProtocolId when none was requested", async () => {
      const patientDb = testEnv.authenticatedContext(PATIENT_UID).firestore();

      // Attempting to set activeProtocolId to a new string
      await assertFails(
        updateDoc(doc(patientDb, `users/${NUTRI_A}/patients/p1`), {
          activeProtocolId: "forged_protocol_id",
        }),
      );
    });

    it("FORBIDS patient from modifying selfEvaluations when activeProtocolId is null", async () => {
      const patientDb = testEnv.authenticatedContext(PATIENT_UID).firestore();

      // p1 currently has activeProtocolId: null (or unset). Trying to inject an evaluation:
      await assertFails(
        updateDoc(doc(patientDb, `users/${NUTRI_A}/patients/p1`), {
          selfEvaluations: [
            { id: "eval_1", status: "completed" },
            { id: "eval_forged", status: "completed" },
          ],
        }),
      );
    });

    it("FORBIDS patient from truncating or clearing adherenceLog", async () => {
      // Seed adherenceLog
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await updateDoc(doc(ctx.firestore(), `users/${NUTRI_A}/patients/p1`), {
          adherenceLog: [{ date: "2026-09-17", followed: true }],
        });
      });

      const patientDb = testEnv.authenticatedContext(PATIENT_UID).firestore();

      // Attempting to clear adherenceLog
      await assertFails(
        updateDoc(doc(patientDb, `users/${NUTRI_A}/patients/p1`), {
          adherenceLog: [],
        }),
      );
    });

    it("ALLOWS patient to append a valid self-reported weight record preserving existing history", async () => {
      const patientDb = testEnv.authenticatedContext(PATIENT_UID).firestore();

      // Legitimate self-reported weight append
      await assertSucceeds(
        updateDoc(doc(patientDb, `users/${NUTRI_A}/patients/p1`), {
          weight: 62.0,
          weightHistory: [
            { date: "2026-01-01", weight: 60, origin: "clinical" },
            {
              date: "2026-09-18",
              weight: 62.0,
              origin: "self_reported",
              authorUid: PATIENT_UID,
            },
          ],
        }),
      );
    });

    it("ALLOWS patient to complete an active evaluation protocol requested by nutritionist and clear activeProtocolId", async () => {
      // Seed active protocol on p1
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await updateDoc(doc(ctx.firestore(), `users/${NUTRI_A}/patients/p1`), {
          activeProtocolId: "eval_active_123",
          selfEvaluations: [
            { id: "eval_1", status: "completed" },
            {
              id: "eval_active_123",
              requestDate: "2026-09-18",
              status: "pending",
            },
          ],
        });
      });

      const patientDb = testEnv.authenticatedContext(PATIENT_UID).firestore();

      // Patient completes protocol: transitions activeProtocolId to null and marks evaluation completed
      await assertSucceeds(
        updateDoc(doc(patientDb, `users/${NUTRI_A}/patients/p1`), {
          activeProtocolId: null,
          selfEvaluations: [
            { id: "eval_1", status: "completed" },
            {
              id: "eval_active_123",
              requestDate: "2026-09-18",
              completionDate: "2026-09-18T12:00:00Z",
              status: "completed",
            },
          ],
        }),
      );
    });

    it("ALLOWS nutritionist full professional authority to add clinical records and request protocols", async () => {
      const nutriDb = testEnv.authenticatedContext(NUTRI_A).firestore();

      // Nutritionist can add clinical weight record and request new protocol
      await assertSucceeds(
        updateDoc(doc(nutriDb, `users/${NUTRI_A}/patients/p1`), {
          weight: 63.0,
          weightHistory: [
            { date: "2026-01-01", weight: 60, origin: "clinical" },
            {
              date: "2026-09-18",
              weight: 63.0,
              origin: "clinical",
              authorUid: NUTRI_A,
            },
          ],
          activeProtocolId: "proto_nutri_456",
          selfEvaluations: [
            { id: "eval_1", status: "completed" },
            {
              id: "proto_nutri_456",
              requestDate: "2026-09-18",
              status: "pending",
            },
          ],
        }),
      );
    });
  });

  describe("12. Passo C03 - Atomic, Idempotent, and Recoverable Invitations", () => {
    it("FORBIDS creating an invitation without a future expiresAtTimestamp", async () => {
      const nutriDb = testEnv.authenticatedContext(NUTRI_A).firestore();

      // Missing expiresAtTimestamp
      await assertFails(
        setDoc(doc(nutriDb, "invitations/inv_no_ts"), {
          nutritionistId: NUTRI_A,
          patientId: "p1",
          patientEmail: "c03@test.com",
          status: "pending",
          expiresAt: "2026-10-01T00:00:00Z",
        }),
      );

      // Past timestamp
      await assertFails(
        setDoc(doc(nutriDb, "invitations/inv_past_ts"), {
          nutritionistId: NUTRI_A,
          patientId: "p1",
          patientEmail: "c03@test.com",
          status: "pending",
          expiresAt: "2020-01-01T00:00:00Z",
          expiresAtTimestamp: Timestamp.fromDate(
            new Date("2020-01-01T00:00:00Z"),
          ),
        }),
      );
    });

    it("ALLOWS creating a valid pending invitation with future expiresAtTimestamp", async () => {
      const nutriDb = testEnv.authenticatedContext(NUTRI_A).firestore();
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await assertSucceeds(
        setDoc(doc(nutriDb, "invitations/inv_valid_c03"), {
          nutritionistId: NUTRI_A,
          patientId: "p1",
          patientEmail: "c03@test.com",
          status: "pending",
          expiresAt: futureDate.toISOString(),
          expiresAtTimestamp: Timestamp.fromDate(futureDate),
        }),
      );
    });

    it("FORBIDS accepting an invitation if the patient record is Archived or deletionPending", async () => {
      const patientEmail = "archived@test.com";
      const candidateUid = "candidateArchivedUid";

      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(doc(ctx.firestore(), `users/${NUTRI_A}/patients/p_arch`), {
          firstName: "Archived Patient",
          status: "Archived",
        });
        await setDoc(doc(ctx.firestore(), "invitations/inv_arch"), {
          nutritionistId: NUTRI_A,
          patientId: "p_arch",
          patientEmail,
          status: "pending",
          expiresAt: "2026-12-01T00:00:00Z",
          expiresAtTimestamp: FUTURE_TS,
        });
      });

      const candidateDb = testEnv
        .authenticatedContext(candidateUid, { email: patientEmail })
        .firestore();

      const batch = writeBatch(candidateDb);
      batch.update(doc(candidateDb, "invitations/inv_arch"), {
        status: "accepted",
        acceptedByUid: candidateUid,
      });
      batch.update(doc(candidateDb, `users/${NUTRI_A}/patients/p_arch`), {
        portalUid: candidateUid,
        portalStatus: "active",
      });
      batch.set(doc(candidateDb, `patientProfiles/${candidateUid}`), {
        nutritionistId: NUTRI_A,
        patientId: "p_arch",
        invitationId: "inv_arch",
        role: "patient",
      });

      // Must fail because patient is Archived
      await assertFails(batch.commit());
    });

    it("FORBIDS transitioning an invitation from revoked to accepted (terminal state protection)", async () => {
      const patientEmail = "revoked_user@test.com";
      const candidateUid = "candidateRevokedUid";

      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(
          doc(ctx.firestore(), `users/${NUTRI_A}/patients/p_rev_inv`),
          {
            firstName: "Revoked Patient",
          },
        );
        await setDoc(doc(ctx.firestore(), "invitations/inv_already_revoked"), {
          nutritionistId: NUTRI_A,
          patientId: "p_rev_inv",
          patientEmail,
          status: "revoked",
          expiresAt: "2026-12-01T00:00:00Z",
          expiresAtTimestamp: FUTURE_TS,
        });
      });

      const candidateDb = testEnv
        .authenticatedContext(candidateUid, { email: patientEmail })
        .firestore();

      const batch = writeBatch(candidateDb);
      batch.update(doc(candidateDb, "invitations/inv_already_revoked"), {
        status: "accepted",
        acceptedByUid: candidateUid,
      });
      batch.update(doc(candidateDb, `users/${NUTRI_A}/patients/p_rev_inv`), {
        portalUid: candidateUid,
        portalStatus: "active",
      });
      batch.set(doc(candidateDb, `patientProfiles/${candidateUid}`), {
        nutritionistId: NUTRI_A,
        patientId: "p_rev_inv",
        invitationId: "inv_already_revoked",
        role: "patient",
      });

      await assertFails(batch.commit());
    });

    it("FORBIDS transitioning an invitation from accepted to revoked (terminal state protection)", async () => {
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(doc(ctx.firestore(), "invitations/inv_already_accepted"), {
          nutritionistId: NUTRI_A,
          patientId: "p1",
          patientEmail: "ana@test.com",
          status: "accepted",
          acceptedByUid: PATIENT_UID,
          expiresAt: "2026-12-01T00:00:00Z",
          expiresAtTimestamp: FUTURE_TS,
        });
      });

      const nutriDb = testEnv.authenticatedContext(NUTRI_A).firestore();

      // Nutritionist cannot revoke an already accepted invitation
      await assertFails(
        updateDoc(doc(nutriDb, "invitations/inv_already_accepted"), {
          status: "revoked",
        }),
      );
    });

    it("ALLOWS re-activating a patient whose access was revoked with a new valid pending invitation batch", async () => {
      const reEmail = "relink@test.com";
      const reUid = "relinkUserUid";

      // Seed patient previously revoked
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(
          doc(ctx.firestore(), `users/${NUTRI_A}/patients/p_relink`),
          {
            firstName: "Relink Patient",
            portalUid: null,
            portalStatus: "revoked",
            pendingInvitationId: "inv_relink_new",
          },
        );
        // Existing profile from before
        await setDoc(doc(ctx.firestore(), `patientProfiles/${reUid}`), {
          nutritionistId: NUTRI_A,
          patientId: "p_relink",
          role: "patient",
          status: "revoked",
        });
        // New pending invitation issued by nutritionist
        await setDoc(doc(ctx.firestore(), "invitations/inv_relink_new"), {
          nutritionistId: NUTRI_A,
          patientId: "p_relink",
          patientEmail: reEmail,
          status: "pending",
          expiresAt: "2026-12-01T00:00:00Z",
          expiresAtTimestamp: FUTURE_TS,
        });
      });

      const reDb = testEnv
        .authenticatedContext(reUid, { email: reEmail })
        .firestore();

      const batch = writeBatch(reDb);
      batch.update(doc(reDb, "invitations/inv_relink_new"), {
        status: "accepted",
        acceptedByUid: reUid,
      });
      batch.update(doc(reDb, `users/${NUTRI_A}/patients/p_relink`), {
        portalUid: reUid,
        portalStatus: "active",
      });
      batch.set(
        doc(reDb, `patientProfiles/${reUid}`),
        {
          nutritionistId: NUTRI_A,
          patientId: "p_relink",
          invitationId: "inv_relink_new",
          role: "patient",
          status: "active",
        },
        { merge: true },
      );

      await assertSucceeds(batch.commit());
    });

    it("ALLOWS idempotent retry: re-applying acceptance batch when already linked with same portalUid", async () => {
      const patientEmail = "idempotent@test.com";
      const patientUid = "idempotentUid";

      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(doc(ctx.firestore(), `users/${NUTRI_A}/patients/p_idem`), {
          firstName: "Idem Patient",
          portalUid: patientUid,
          portalStatus: "active",
          pendingInvitationId: "inv_idem",
        });
        await setDoc(doc(ctx.firestore(), "invitations/inv_idem"), {
          nutritionistId: NUTRI_A,
          patientId: "p_idem",
          patientEmail,
          status: "pending",
          expiresAt: "2026-12-01T00:00:00Z",
          expiresAtTimestamp: FUTURE_TS,
        });
      });

      const patientDb = testEnv
        .authenticatedContext(patientUid, { email: patientEmail })
        .firestore();

      const batch = writeBatch(patientDb);
      batch.update(doc(patientDb, "invitations/inv_idem"), {
        status: "accepted",
        acceptedByUid: patientUid,
      });
      batch.update(doc(patientDb, `users/${NUTRI_A}/patients/p_idem`), {
        portalUid: patientUid,
        portalStatus: "active",
      });
      batch.set(
        doc(patientDb, `patientProfiles/${patientUid}`),
        {
          nutritionistId: NUTRI_A,
          patientId: "p_idem",
          invitationId: "inv_idem",
          role: "patient",
          status: "active",
        },
        { merge: true },
      );

      await assertSucceeds(batch.commit());
    });
  });

  describe("13. Passo C07 - Revocation, Cascade Deletion and Concurrency Guards", () => {
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        const db = ctx.firestore();
        // Active patient
        await setDoc(doc(db, `users/${NUTRI_A}/patients/p_active`), {
          firstName: "Active Patient",
          status: "Active",
        });
        // Archived patient
        await setDoc(doc(db, `users/${NUTRI_A}/patients/p_archived`), {
          firstName: "Archived Patient",
          status: "Archived",
        });
        // Deletion pending patient
        await setDoc(doc(db, `users/${NUTRI_A}/patients/p_deleting`), {
          firstName: "Deleting Patient",
          status: "Inactive",
          deletionPending: true,
        });

        // Existing diet & appt for deleting patient (so cascade delete can be tested)
        await setDoc(doc(db, `users/${NUTRI_A}/diets/diet_deleting`), {
          patientId: "p_deleting",
          name: "Plano Antigo",
        });
        await setDoc(doc(db, `users/${NUTRI_A}/appointments/appt_deleting`), {
          patientId: "p_deleting",
          dateTime: "2026-10-10 10:00",
        });
      });
    });

    it("ALLOWS nutritionist to create diet and appointment for an active patient", async () => {
      const nutriDb = testEnv.authenticatedContext(NUTRI_A).firestore();
      await assertSucceeds(
        setDoc(doc(nutriDb, `users/${NUTRI_A}/diets/diet_new_active`), {
          patientId: "p_active",
          name: "Nova Dieta",
        }),
      );
      await assertSucceeds(
        setDoc(doc(nutriDb, `users/${NUTRI_A}/appointments/appt_new_active`), {
          patientId: "p_active",
          dateTime: "2026-10-12 14:00",
        }),
      );
    });

    it("FORBIDS nutritionist from creating diet or appointment for a non-existent patient", async () => {
      const nutriDb = testEnv.authenticatedContext(NUTRI_A).firestore();
      await assertFails(
        setDoc(doc(nutriDb, `users/${NUTRI_A}/diets/diet_nonexistent`), {
          patientId: "p_ghost_nonexistent",
          name: "Dieta Fantasma",
        }),
      );
      await assertFails(
        setDoc(doc(nutriDb, `users/${NUTRI_A}/appointments/appt_nonexistent`), {
          patientId: "p_ghost_nonexistent",
          dateTime: "2026-10-12 14:00",
        }),
      );
    });

    it("FORBIDS nutritionist from creating diet or appointment for an Archived patient", async () => {
      const nutriDb = testEnv.authenticatedContext(NUTRI_A).firestore();
      await assertFails(
        setDoc(doc(nutriDb, `users/${NUTRI_A}/diets/diet_arch`), {
          patientId: "p_archived",
          name: "Dieta Arquivada",
        }),
      );
      await assertFails(
        setDoc(doc(nutriDb, `users/${NUTRI_A}/appointments/appt_arch`), {
          patientId: "p_archived",
          dateTime: "2026-10-12 14:00",
        }),
      );
    });

    it("FORBIDS nutritionist from creating diet or appointment for a patient in deletionPending", async () => {
      const nutriDb = testEnv.authenticatedContext(NUTRI_A).firestore();
      await assertFails(
        setDoc(doc(nutriDb, `users/${NUTRI_A}/diets/diet_deleting_new`), {
          patientId: "p_deleting",
          name: "Dieta Nova Para Deletando",
        }),
      );
      await assertFails(
        setDoc(
          doc(nutriDb, `users/${NUTRI_A}/appointments/appt_deleting_new`),
          {
            patientId: "p_deleting",
            dateTime: "2026-10-12 14:00",
          },
        ),
      );
    });

    it("FORBIDS nutritionist from updating diet or appointment to refer to a deletionPending patient", async () => {
      const nutriDb = testEnv.authenticatedContext(NUTRI_A).firestore();
      await assertFails(
        updateDoc(doc(nutriDb, `users/${NUTRI_A}/diets/diet_deleting`), {
          name: "Atualizando Dieta de Paciente em Exclusão",
        }),
      );
      await assertFails(
        updateDoc(doc(nutriDb, `users/${NUTRI_A}/appointments/appt_deleting`), {
          dateTime: "2026-11-11 11:00",
        }),
      );
    });

    it("ALLOWS nutritionist to delete existing diets and appointments of a deletionPending patient (cascade deletion)", async () => {
      const nutriDb = testEnv.authenticatedContext(NUTRI_A).firestore();
      const { deleteDoc } = await import("firebase/firestore");
      await assertSucceeds(
        deleteDoc(doc(nutriDb, `users/${NUTRI_A}/diets/diet_deleting`)),
      );
      await assertSucceeds(
        deleteDoc(doc(nutriDb, `users/${NUTRI_A}/appointments/appt_deleting`)),
      );
    });

    it("FORBIDS creating an invitation for a patient with deletionPending or status Archived", async () => {
      const nutriDb = testEnv.authenticatedContext(NUTRI_A).firestore();
      await assertFails(
        setDoc(doc(nutriDb, "invitations/inv_fail_deleting"), {
          nutritionistId: NUTRI_A,
          patientId: "p_deleting",
          patientEmail: "del@test.com",
          status: "pending",
          expiresAt: "2026-12-01T00:00:00Z",
          expiresAtTimestamp: FUTURE_TS,
        }),
      );
      await assertFails(
        setDoc(doc(nutriDb, "invitations/inv_fail_archived"), {
          nutritionistId: NUTRI_A,
          patientId: "p_archived",
          patientEmail: "arch@test.com",
          status: "pending",
          expiresAt: "2026-12-01T00:00:00Z",
          expiresAtTimestamp: FUTURE_TS,
        }),
      );
    });
  });

  describe("14. Adversarial security regressions (C01, C02, C03, C07, C09)", () => {
    it("FORBIDS patient from reading appointments if portalStatus is 'revoked'", async () => {
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        const adminDb = ctx.firestore();
        await updateDoc(doc(adminDb, `users/${NUTRI_A}/patients/p1`), {
          portalStatus: "revoked",
        });
        await setDoc(
          doc(adminDb, `users/${NUTRI_A}/appointments/appt_revoked_test`),
          {
            patientId: "p1",
            dateTime: "2026-10-15 10:00",
          },
        );
      });

      const patientDb = testEnv.authenticatedContext(PATIENT_UID).firestore();
      await assertFails(
        getDoc(
          doc(patientDb, `users/${NUTRI_A}/appointments/appt_revoked_test`),
        ),
      );
    });

    it("FORBIDS cross-nutritionist patientId spoofing when creating diets or appointments", async () => {
      const nutriDb = testEnv.authenticatedContext(NUTRI_A).firestore();
      // pb belongs to NUTRI_B, not NUTRI_A
      await assertFails(
        setDoc(doc(nutriDb, `users/${NUTRI_A}/diets/diet_cross_spoof`), {
          patientId: "pb",
          title: "Dieta Inválida com Paciente de Outro Nutri",
        }),
      );
      await assertFails(
        setDoc(doc(nutriDb, `users/${NUTRI_A}/appointments/appt_cross_spoof`), {
          patientId: "pb",
          dateTime: "2026-10-20 14:00",
        }),
      );
    });

    it("FORBIDS patient A from modifying patient B's document or adherenceLog", async () => {
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        const adminDb = ctx.firestore();
        await setDoc(doc(adminDb, `patientProfiles/${OTHER_PATIENT_UID}`), {
          nutritionistId: NUTRI_A,
          patientId: "p2",
          role: "patient",
        });
        await updateDoc(doc(adminDb, `users/${NUTRI_A}/patients/p2`), {
          portalUid: OTHER_PATIENT_UID,
          portalStatus: "active",
          adherenceLog: [],
        });
      });

      const patientADb = testEnv.authenticatedContext(PATIENT_UID).firestore();
      // Patient A attempts to modify Patient B's adherenceLog under same nutritionist
      await assertFails(
        updateDoc(doc(patientADb, `users/${NUTRI_A}/patients/p2`), {
          adherenceLog: [{ date: "2026-09-18", status: "adhered" }],
        }),
      );
      // Patient A attempts to modify Patient B's details under different nutritionist
      await assertFails(
        updateDoc(doc(patientADb, `users/${NUTRI_B}/patients/pb`), {
          firstName: "Hacked by Patient A",
        }),
      );
    });

    it("FORBIDS altering acceptedByUid or status on an already accepted invitation", async () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        const adminDb = ctx.firestore();
        await setDoc(doc(adminDb, "invitations/inv_already_accepted"), {
          nutritionistId: NUTRI_A,
          nutritionistName: "Dra. Clara",
          nutritionistEmail: "nutriA@test.com",
          patientId: "p1",
          patientEmail: "ana@test.com",
          patientName: "Ana Silva",
          status: "accepted",
          acceptedByUid: PATIENT_UID,
          acceptedAt: now.toISOString(),
          createdAt: now.toISOString(),
          expiresAt: expiresAt.toISOString(),
          expiresAtTimestamp: Timestamp.fromDate(expiresAt),
        });
      });

      // Attacker tries to hijack the accepted invitation
      const attackerDb = testEnv
        .authenticatedContext(OTHER_PATIENT_UID)
        .firestore();
      await assertFails(
        updateDoc(doc(attackerDb, "invitations/inv_already_accepted"), {
          acceptedByUid: OTHER_PATIENT_UID,
        }),
      );

      // Nutritionist tries to revoke an already accepted invitation
      const nutriDb = testEnv.authenticatedContext(NUTRI_A).firestore();
      await assertFails(
        updateDoc(doc(nutriDb, "invitations/inv_already_accepted"), {
          status: "revoked",
          revokedAt: new Date().toISOString(),
        }),
      );
    });

    it("FORBIDS unauthenticated or unrelated user from reading patientProfiles", async () => {
      // Unauthenticated
      const anonDb = testEnv.unauthenticatedContext().firestore();
      await assertFails(getDoc(doc(anonDb, `patientProfiles/${PATIENT_UID}`)));

      // Unrelated user
      const strangerDb = testEnv
        .authenticatedContext("unrelatedStranger")
        .firestore();
      await assertFails(
        getDoc(doc(strangerDb, `patientProfiles/${PATIENT_UID}`)),
      );

      // Unrelated nutritionist (NUTRI_B is not the linked nutritionist)
      const nutriBDb = testEnv.authenticatedContext(NUTRI_B).firestore();
      await assertFails(
        getDoc(doc(nutriBDb, `patientProfiles/${PATIENT_UID}`)),
      );

      // Linked nutritionist (NUTRI_A) CAN read
      const nutriADb = testEnv.authenticatedContext(NUTRI_A).firestore();
      await assertSucceeds(
        getDoc(doc(nutriADb, `patientProfiles/${PATIENT_UID}`)),
      );

      // Patient owner CAN read
      const patientDb = testEnv.authenticatedContext(PATIENT_UID).firestore();
      await assertSucceeds(
        getDoc(doc(patientDb, `patientProfiles/${PATIENT_UID}`)),
      );
    });
  });

  // R02 — patient self-service contract (plan section 11.3: R02-A/B/C).
  // Each denial is paired with the legitimate write it is closest to, so a
  // rule that denies everything would fail the suite.
  describe("15. R02 - Self-service response contract and append-only history", () => {
    const P1 = `users/${NUTRI_A}/patients/p1`;
    const today = new Date().toISOString().slice(0, 10);
    const future = new Date(Date.now() + 5 * 86400000)
      .toISOString()
      .slice(0, 10);
    const legacyHistory = [
      // Legacy data: out of order, one future-dated, one without origin.
      { date: "2026-03-01", weight: 62, origin: "clinical" },
      { date: "2025-12-01", weight: 64 },
      { date: "2031-01-01", weight: 61, origin: "clinical" },
    ];
    const selfRecord = (extra: Record<string, unknown> = {}) => ({
      id: "w_self_1",
      date: today,
      weight: 59.5,
      origin: "self_reported",
      authorUid: PATIENT_UID,
      ...extra,
    });
    const seed = (data: DocumentData) =>
      testEnv.withSecurityRulesDisabled(async (ctx) => {
        await updateDoc(doc(ctx.firestore(), P1), data);
      });
    const patientDb = () =>
      testEnv.authenticatedContext(PATIENT_UID).firestore();

    describe("R02-A weight authorship", () => {
      it("DENIES two records in one write (forged first, valid second)", async () => {
        await assertFails(
          updateDoc(doc(patientDb(), P1), {
            weight: 59.5,
            weightHistory: [
              { date: "2026-01-01", weight: 60, origin: "clinical" },
              selfRecord({ id: "w_forged", authorUid: NUTRI_A }),
              selfRecord(),
            ],
          }),
        );
      });
      it("DENIES a record without authorUid", async () => {
        const { authorUid: _omit, ...noAuthor } = selfRecord();
        await assertFails(
          updateDoc(doc(patientDb(), P1), {
            weightHistory: [
              { date: "2026-01-01", weight: 60, origin: "clinical" },
              noAuthor,
            ],
          }),
        );
      });
      it("DENIES extra fields and future dates on the new record", async () => {
        const base = [{ date: "2026-01-01", weight: 60, origin: "clinical" }];
        await assertFails(
          updateDoc(doc(patientDb(), P1), {
            weightHistory: [
              ...base,
              selfRecord({ validatedByNutritionist: true }),
            ],
          }),
        );
        await assertFails(
          updateDoc(doc(patientDb(), P1), {
            weightHistory: [...base, selfRecord({ date: future })],
          }),
        );
      });
      it("ALLOWS one valid self-reported record", async () => {
        await assertSucceeds(
          updateDoc(doc(patientDb(), P1), {
            weight: 59.5,
            weightHistory: [
              { date: "2026-01-01", weight: 60, origin: "clinical" },
              selfRecord(),
            ],
          }),
        );
      });
    });

    describe("R02-B evaluation response", () => {
      const pending = {
        id: "ev1",
        requestDate: "2026-09-17",
        status: "pending",
      };
      const other = {
        id: "ev0",
        requestDate: "2026-08-01",
        status: "completed",
        completionDate: "2026-08-02",
      };
      const answer = (extra: Record<string, unknown> = {}) => ({
        ...pending,
        status: "completed",
        completionDate: today,
        measurements: { weight: 59.5, waist: 70, hip: 0, neck: 0 },
        wellbeing: {
          sleepQuality: 4,
          energyLevel: 3,
          satiety: 5,
          digestiveHealth: "normal",
        },
        notes: "Resposta sintética",
        ...extra,
      });
      beforeEach(async () => {
        await seed({
          activeProtocolId: "ev1",
          selfEvaluations: [other, pending],
        });
      });
      const complete = (target: Record<string, unknown>, rest = [other]) =>
        updateDoc(doc(patientDb(), P1), {
          activeProtocolId: null,
          selfEvaluations: [...rest, target],
        });

      it("DENIES arbitrary fields and out-of-range answers", async () => {
        await assertFails(complete(answer({ reviewedByNutritionist: true })));
        await assertFails(complete(answer({ wellbeing: { sleepQuality: 9 } })));
        await assertFails(complete(answer({ measurements: { weight: -3 } })));
        await assertFails(complete(answer({ measurements: { bodyFat: 20 } })));
        await assertFails(complete(answer({ notes: "x".repeat(2001) })));
      });
      it("DENIES altering requestDate, status of other entries or the professional metadata", async () => {
        await assertFails(complete(answer({ requestDate: "2020-01-01" })));
        await assertFails(complete(answer({ status: "approved" })));
        await assertFails(
          complete(answer(), [{ ...other, completionDate: "2026-09-01" }]),
        );
      });
      it("DENIES dismissing the protocol without answering it", async () => {
        await assertFails(
          updateDoc(doc(patientDb(), P1), { activeProtocolId: null }),
        );
      });
      it("ALLOWS the legitimate pending -> completed answer without touching other records", async () => {
        await assertSucceeds(complete(answer()));
      });
    });

    describe("R02-C legacy history and idempotency", () => {
      it("ALLOWS appending to an out-of-order legacy history with a future-dated entry, preserving it", async () => {
        await seed({ weightHistory: legacyHistory });
        await assertSucceeds(
          updateDoc(doc(patientDb(), P1), {
            weightHistory: [...legacyHistory, selfRecord()],
          }),
        );
      });
      it("concurrent appends from the same stale state: the second one is denied (no lost update)", async () => {
        await seed({ weightHistory: legacyHistory });
        const first = [...legacyHistory, selfRecord({ id: "w_a" })];
        const staleSecond = [
          ...legacyHistory,
          selfRecord({ id: "w_b", weight: 58 }),
        ];
        await assertSucceeds(
          updateDoc(doc(patientDb(), P1), { weightHistory: first }),
        );
        // Built from the state before "first" landed: would drop w_a.
        await assertFails(
          updateDoc(doc(patientDb(), P1), { weightHistory: staleSecond }),
        );
        // Retried on the current state (what the transaction does), it passes.
        await assertSucceeds(
          updateDoc(doc(patientDb(), P1), {
            weightHistory: [...first, selfRecord({ id: "w_b", weight: 58 })],
          }),
        );
      });

      it("DENIES the same append if the stored records are re-sorted or normalized", async () => {
        await seed({ weightHistory: legacyHistory });
        const sorted = [...legacyHistory].sort((a, b) =>
          a.date.localeCompare(b.date),
        );
        await assertFails(
          updateDoc(doc(patientDb(), P1), {
            weightHistory: [...sorted, selfRecord()],
          }),
        );
        const normalized = legacyHistory.map((r) => ({
          origin: "self_reported",
          ...r,
        }));
        await assertFails(
          updateDoc(doc(patientDb(), P1), {
            weightHistory: [...normalized, selfRecord()],
          }),
        );
      });
      it("adherence: appends to an out-of-order log, updates the same day, denies future dates and extra fields", async () => {
        const legacyLog = [
          { date: "2026-09-10", followed: true },
          { date: "2026-09-01", followed: false },
        ];
        await seed({ adherenceLog: legacyLog });
        await assertFails(
          updateDoc(doc(patientDb(), P1), {
            adherenceLog: [...legacyLog, { date: future, followed: true }],
          }),
        );
        await assertFails(
          updateDoc(doc(patientDb(), P1), {
            adherenceLog: [
              ...legacyLog,
              { date: today, followed: true, score: 10 },
            ],
          }),
        );
        await assertFails(
          updateDoc(doc(patientDb(), P1), {
            adherenceLog: [...legacyLog, { date: today, followed: "yes" }],
          }),
        );
        const entry = {
          date: today,
          followed: true,
          timestamp: new Date().toISOString(),
          clientEventId: "evt-1",
        };
        await assertSucceeds(
          updateDoc(doc(patientDb(), P1), {
            adherenceLog: [...legacyLog, entry],
          }),
        );
        // Repeating the same check-in day replaces that day's entry only.
        await assertSucceeds(
          updateDoc(doc(patientDb(), P1), {
            adherenceLog: [...legacyLog, { ...entry, followed: false }],
          }),
        );
      });
    });
  });

  // R03 — strict invitations (11.3: R03-A/B). Every variant runs the same
  // atomic acceptance batch the app sends; a denial must leave no partially
  // accepted invitation, profile or patient link behind.
  describe("16. R03 - Strict invitation acceptance without partial links", () => {
    const UID = "r03PatientUser";
    const EMAIL = "r03.patient@demo.test";
    const PATIENT = "p_r03";
    const INV = "inv-r03";
    const validInvitation = () => ({
      nutritionistId: NUTRI_A,
      patientId: PATIENT,
      patientEmail: EMAIL,
      status: "pending",
      expiresAt: FUTURE_TS.toDate().toISOString(),
      expiresAtTimestamp: FUTURE_TS,
    });
    const seedInvitation = (invitation: Record<string, unknown>) =>
      testEnv.withSecurityRulesDisabled(async (ctx) => {
        const db = ctx.firestore();
        await setDoc(doc(db, `users/${NUTRI_A}/patients/${PATIENT}`), {
          firstName: "Convite",
          pendingInvitationId: INV,
        });
        await setDoc(doc(db, `invitations/${INV}`), invitation);
      });
    const acceptBatch = (token: Record<string, unknown> = { email: EMAIL }) => {
      const db = testEnv.authenticatedContext(UID, token).firestore();
      const batch = writeBatch(db);
      batch.update(doc(db, `invitations/${INV}`), {
        status: "accepted",
        acceptedByUid: UID,
      });
      batch.update(doc(db, `users/${NUTRI_A}/patients/${PATIENT}`), {
        portalUid: UID,
        portalStatus: "active",
      });
      batch.set(doc(db, `patientProfiles/${UID}`), {
        nutritionistId: NUTRI_A,
        patientId: PATIENT,
        invitationId: INV,
        role: "patient",
      });
      return batch.commit();
    };
    const expectNothingAccepted = () =>
      testEnv.withSecurityRulesDisabled(async (ctx) => {
        const db = ctx.firestore();
        const inv = (await getDoc(doc(db, `invitations/${INV}`))).data();
        const patient = (
          await getDoc(doc(db, `users/${NUTRI_A}/patients/${PATIENT}`))
        ).data();
        const profile = await getDoc(doc(db, `patientProfiles/${UID}`));
        if (inv?.status === "accepted" || inv?.acceptedByUid)
          throw new Error("invitation partially accepted");
        if (patient?.portalUid) throw new Error("patient partially linked");
        if (profile.exists()) throw new Error("profile partially created");
      });

    const { patientEmail: _e, ...noEmail } = validInvitation();
    const { expiresAtTimestamp: _t, ...noTimestamp } = validInvitation();
    const cases: [string, Record<string, unknown>, Record<string, unknown>?][] =
      [
        ["without patientEmail", noEmail],
        ["without expiresAtTimestamp", noTimestamp],
        [
          "with a string instead of a timestamp",
          { ...validInvitation(), expiresAtTimestamp: "2099-01-01T00:00:00Z" },
        ],
        [
          "expired",
          {
            ...validInvitation(),
            expiresAtTimestamp: Timestamp.fromDate(
              new Date(Date.now() - 60000),
            ),
          },
        ],
        ["revoked", { ...validInvitation(), status: "revoked" }],
        [
          "for another recipient",
          validInvitation(),
          { email: "someone.else@demo.test" },
        ],
        ["by an account without e-mail", validInvitation(), {}],
      ];
    for (const [label, invitation, token] of cases) {
      it(`DENIES acceptance ${label} and leaves no partial state`, async () => {
        await seedInvitation(invitation);
        await assertFails(acceptBatch(token));
        await expectNothingAccepted();
      });
    }

    it("ALLOWS the valid invitation (e-mail case-insensitive) and an idempotent repeat", async () => {
      await seedInvitation({
        ...validInvitation(),
        patientEmail: EMAIL.toUpperCase(),
      });
      await assertSucceeds(acceptBatch());
      // The same user repeating the acceptance (e.g. double click) does not
      // reopen or change the terminal invitation.
      await assertFails(acceptBatch());
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        const inv = (
          await getDoc(doc(ctx.firestore(), `invitations/${INV}`))
        ).data();
        if (inv?.status !== "accepted" || inv?.acceptedByUid !== UID) {
          throw new Error("valid acceptance not persisted");
        }
      });
    });
  });

  // R04 — recovery after incomplete cleanup (11.3: R04-A/B), at the rules
  // level: once the patient pointer is cleared/replaced, the old link stays
  // denied even if its invitation document is still "pending".
  describe("17. R04 - Recovery keeps old invitation links denied", () => {
    const UID = "r04PatientUser";
    const EMAIL = "r04.patient@demo.test";
    const PATIENT = "p_r04";
    const seed = () =>
      testEnv.withSecurityRulesDisabled(async (ctx) => {
        const db = ctx.firestore();
        // Cleanup failed: old invitation still pending, but revocation cleared
        // the pointer and the professional issued a new invitation.
        await setDoc(doc(db, `users/${NUTRI_A}/patients/${PATIENT}`), {
          firstName: "Recuperação",
          portalUid: null,
          portalStatus: "revoked",
          pendingInvitationId: "inv-r04-new",
        });
        for (const id of ["inv-r04-old", "inv-r04-new"]) {
          await setDoc(doc(db, `invitations/${id}`), {
            nutritionistId: NUTRI_A,
            patientId: PATIENT,
            patientEmail: EMAIL,
            status: "pending",
            expiresAt: FUTURE_TS.toDate().toISOString(),
            expiresAtTimestamp: FUTURE_TS,
          });
        }
      });
    const accept = (inv: string) => {
      const db = testEnv
        .authenticatedContext(UID, { email: EMAIL })
        .firestore();
      const batch = writeBatch(db);
      batch.update(doc(db, `invitations/${inv}`), {
        status: "accepted",
        acceptedByUid: UID,
      });
      batch.update(doc(db, `users/${NUTRI_A}/patients/${PATIENT}`), {
        portalUid: UID,
        portalStatus: "active",
      });
      batch.set(doc(db, `patientProfiles/${UID}`), {
        nutritionistId: NUTRI_A,
        patientId: PATIENT,
        invitationId: inv,
        role: "patient",
      });
      return batch.commit();
    };

    it("DENIES the old pending link and ALLOWS the new invitation ID", async () => {
      await seed();
      await assertFails(accept("inv-r04-old"));
      await assertSucceeds(accept("inv-r04-new"));
      const db = testEnv
        .authenticatedContext(UID, { email: EMAIL })
        .firestore();
      await assertSucceeds(
        getDoc(doc(db, `users/${NUTRI_A}/patients/${PATIENT}`)),
      );
    });

    it("DENIES acceptance after a concurrent revocation cleared the pointer", async () => {
      await seed();
      // Revocation wins the race: pointer cleared before the acceptance batch.
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await updateDoc(
          doc(ctx.firestore(), `users/${NUTRI_A}/patients/${PATIENT}`),
          {
            pendingInvitationId: null,
          },
        );
        await updateDoc(doc(ctx.firestore(), "invitations/inv-r04-new"), {
          status: "revoked",
        });
      });
      await assertFails(accept("inv-r04-new"));
      await assertFails(accept("inv-r04-old"));
    });
  });
});

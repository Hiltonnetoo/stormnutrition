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
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const __dirname = dirname(fileURLToPath(import.meta.url));

const NUTRI_A = "nutritionistA";
const NUTRI_B = "nutritionistB";
const PATIENT_UID = "patientUserA";
const OTHER_PATIENT_UID = "patientUserB";

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
            { date: "2026-09-17", weight: 61.5, origin: "self_reported" },
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
      // Weight too low (< 10kg)
      await assertFails(
        updateDoc(doc(db, `users/${NUTRI_A}/patients/p1`), { weight: 5 }),
      );
      // Weight too high (> 500kg)
      await assertFails(
        updateDoc(doc(db, `users/${NUTRI_A}/patients/p1`), { weight: 999 }),
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
      await assertSucceeds(
        setDoc(doc(db, "invitations/inv-1"), {
          nutritionistId: NUTRI_A,
          patientId: "p1",
          patientEmail: "ana@test.com",
          status: "pending",
          expiresAt: "2026-10-01T00:00:00Z",
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
        await setDoc(doc(ctx.firestore(), `users/${NUTRI_A}/patients/p_unlinked`), {
          firstName: "Novo",
        });
        await setDoc(doc(ctx.firestore(), "invitations/inv-accept"), {
          nutritionistId: NUTRI_A,
          patientId: "p_unlinked",
          patientEmail: "novo@test.com",
          status: "pending",
          expiresAt: "2026-10-01T00:00:00Z",
        });
      });

      const patientDb = testEnv.authenticatedContext(newPatientUid).firestore();
      // Patient accepts invitation
      await assertSucceeds(
        updateDoc(doc(patientDb, "invitations/inv-accept"), {
          status: "accepted",
          acceptedByUid: newPatientUid,
        }),
      );

      // Patient claims portalUid on the unlinked patient doc
      await assertSucceeds(
        updateDoc(doc(patientDb, `users/${NUTRI_A}/patients/p_unlinked`), {
          portalUid: newPatientUid,
        }),
      );

      // Patient creates their patientProfile
      await assertSucceeds(
        setDoc(doc(patientDb, `patientProfiles/${newPatientUid}`), {
          nutritionistId: NUTRI_A,
          patientId: "p_unlinked",
          role: "patient",
        }),
      );
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
});

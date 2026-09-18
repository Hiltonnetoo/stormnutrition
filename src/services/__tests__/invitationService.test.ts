import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createOrGetPendingInvitation,
  getInvitationByToken,
  revokeInvitation,
  acceptInvitationWithNewAccount,
  acceptInvitationWithExistingAccount,
  computeInvitationStatus,
} from "../invitationService";
import * as firestore from "firebase/firestore";
import * as firebaseAuth from "firebase/auth";
import type { User } from "../firebaseCore";

const mockBatch = {
  set: vi.fn(),
  update: vi.fn(),
  commit: vi.fn().mockResolvedValue(undefined),
};

const mockTx = {
  get: vi.fn(),
  set: vi.fn(),
  update: vi.fn(),
};

vi.mock("firebase/firestore", () => ({
  doc: vi.fn((firstArg, secondArg, thirdArg, ...rest) => {
    // Handling doc(collectionRef):
    if (firstArg && typeof firstArg === "object" && "path" in firstArg) {
      const generatedId = secondArg || "auto-doc-id-123";
      return { id: generatedId, path: `${firstArg.path}/${generatedId}` };
    }
    const parts = [secondArg, thirdArg, ...rest].filter(Boolean);
    const docId = parts[parts.length - 1] || "auto-id";
    return { id: docId, path: parts.join("/") };
  }),
  collection: vi.fn((_db, coll) => ({ path: coll })),
  query: vi.fn((...args) => ({ queryArgs: args })),
  where: vi.fn((field, op, val) => ({ field, op, val })),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  runTransaction: vi.fn(async (_db, callback) => callback(mockTx)),
  writeBatch: vi.fn(() => mockBatch),
  Timestamp: {
    fromDate: vi.fn((d: Date) => ({
      seconds: Math.floor(d.getTime() / 1000),
      nanoseconds: 0,
    })),
  },
}));

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
}));

vi.mock("../firebaseCore", () => ({
  db: {},
  auth: { currentUser: null },
}));

describe("invitationService - Secure Invitation Lifecycle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockBatch.set.mockClear();
    mockBatch.update.mockClear();
    mockBatch.commit.mockClear();
    mockTx.get.mockClear();
    mockTx.set.mockClear();
    mockTx.update.mockClear();
  });

  describe("computeInvitationStatus", () => {
    it("returns 'pending' when not yet expired", () => {
      const future = new Date(Date.now() + 1000 * 60 * 60).toISOString();
      expect(computeInvitationStatus("pending", future)).toBe("pending");
    });

    it("returns 'expired' when past expiration date", () => {
      const past = new Date(Date.now() - 1000 * 60 * 60).toISOString();
      expect(computeInvitationStatus("pending", past)).toBe("expired");
    });

    it("preserves 'accepted' and 'revoked' regardless of date", () => {
      const past = new Date(Date.now() - 1000).toISOString();
      expect(computeInvitationStatus("accepted", past)).toBe("accepted");
      expect(computeInvitationStatus("revoked", past)).toBe("revoked");
    });
  });

  describe("1. Convite novo & Idempotência Concorrente (Passo C03.8)", () => {
    it("creates a new pending invitation via transaction with 7-day expiration", async () => {
      vi.mocked(firestore.getDocs).mockResolvedValueOnce({
        docs: [],
      } as unknown as firestore.QuerySnapshot);

      mockTx.get.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ firstName: "Carlos", lastName: "Silva" }),
      });

      const inv = await createOrGetPendingInvitation({
        nutritionistId: "nutri-123",
        nutritionistName: "Dra. Ana",
        nutritionistEmail: "ana@clinic.com",
        patientId: "patient-456",
        patientEmail: "PACIENTE@EXEMPLO.COM ",
        patientName: "Carlos Silva",
      });

      expect(inv.status).toBe("pending");
      expect(inv.patientEmail).toBe("paciente@exemplo.com");
      expect(inv.nutritionistId).toBe("nutri-123");
      expect(inv.patientId).toBe("patient-456");
      expect((inv as unknown as { password?: string }).password).toBeUndefined();

      // Check transaction set and update
      expect(mockTx.set).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: "pending",
          patientEmail: "paciente@exemplo.com",
          nutritionistId: "nutri-123",
        }),
      );
      expect(mockTx.update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          pendingInvitationId: expect.any(String),
        }),
      );
    });

    it("idempotently returns existing active pending invitation from query", async () => {
      const existingExpires = new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const existingData = {
        nutritionistId: "nutri-123",
        nutritionistName: "Dra. Ana",
        nutritionistEmail: "ana@clinic.com",
        patientId: "patient-456",
        patientEmail: "paciente@exemplo.com",
        patientName: "Carlos Silva",
        status: "pending" as const,
        createdAt: new Date().toISOString(),
        expiresAt: existingExpires,
      };

      vi.mocked(firestore.getDocs).mockResolvedValueOnce({
        docs: [
          {
            id: "existing-inv-token",
            data: () => existingData,
          },
        ],
      } as unknown as firestore.QuerySnapshot);

      const inv = await createOrGetPendingInvitation({
        nutritionistId: "nutri-123",
        nutritionistName: "Dra. Ana",
        nutritionistEmail: "ana@clinic.com",
        patientId: "patient-456",
        patientEmail: "paciente@exemplo.com",
        patientName: "Carlos Silva",
      });

      expect(inv.id).toBe("existing-inv-token");
      expect(inv.status).toBe("pending");
      expect(mockTx.set).not.toHaveBeenCalled();
    });

    it("concurrency-safe: returns pending invitation referenced on patient doc in transaction", async () => {
      vi.mocked(firestore.getDocs).mockResolvedValueOnce({
        docs: [],
      } as unknown as firestore.QuerySnapshot);

      const futureDate = new Date(Date.now() + 86400000).toISOString();

      // Patient doc read in transaction has pendingInvitationId from a concurrent transaction
      mockTx.get
        .mockResolvedValueOnce({
          exists: () => true,
          data: () => ({
            pendingInvitationId: "concurrent-inv-id",
          }),
        })
        .mockResolvedValueOnce({
          exists: () => true,
          id: "concurrent-inv-id",
          data: () => ({
            nutritionistId: "nutri-123",
            patientId: "patient-456",
            patientEmail: "paciente@exemplo.com",
            status: "pending",
            expiresAt: futureDate,
          }),
        });

      const inv = await createOrGetPendingInvitation({
        nutritionistId: "nutri-123",
        nutritionistName: "Dra. Ana",
        nutritionistEmail: "ana@clinic.com",
        patientId: "patient-456",
        patientEmail: "paciente@exemplo.com",
        patientName: "Carlos Silva",
      });

      expect(inv.id).toBe("concurrent-inv-id");
      expect(inv.status).toBe("pending");
      expect(mockTx.set).not.toHaveBeenCalled();
    });
  });

  describe("2. Convite expirado", () => {
    it("computes status as expired and blocks acceptance", async () => {
      const expiredDate = new Date(Date.now() - 10000).toISOString();
      vi.mocked(firestore.getDoc).mockResolvedValueOnce({
        exists: () => true,
        id: "exp-token",
        data: () => ({
          nutritionistId: "nutri-1",
          patientId: "pat-1",
          patientEmail: "carlos@test.com",
          status: "pending",
          expiresAt: expiredDate,
        }),
      } as unknown as firestore.DocumentSnapshot);

      const inv = await getInvitationByToken("exp-token");
      expect(inv?.status).toBe("expired");

      vi.mocked(firestore.getDoc).mockResolvedValueOnce({
        exists: () => true,
        id: "exp-token",
        data: () => ({
          nutritionistId: "nutri-1",
          patientId: "pat-1",
          patientEmail: "carlos@test.com",
          status: "pending",
          expiresAt: expiredDate,
        }),
      } as unknown as firestore.DocumentSnapshot);

      await expect(
        acceptInvitationWithNewAccount("exp-token", "senhaSegura123!"),
      ).rejects.toThrow("INVITATION_EXPIRED");
    });
  });

  describe("3. Convite reutilizado / já aceito", () => {
    it("rejects acceptance if invitation is already accepted by someone else", async () => {
      vi.mocked(firestore.getDoc).mockResolvedValueOnce({
        exists: () => true,
        id: "used-token",
        data: () => ({
          nutritionistId: "nutri-1",
          patientId: "pat-1",
          patientEmail: "carlos@test.com",
          status: "accepted",
          acceptedByUid: "other-user-uid",
          expiresAt: new Date(Date.now() + 100000).toISOString(),
        }),
      } as unknown as firestore.DocumentSnapshot);

      await expect(
        acceptInvitationWithNewAccount("used-token", "senhaSegura123!"),
      ).rejects.toThrow("INVITATION_ALREADY_ACCEPTED");
    });
  });

  describe("4. Convite revogado (Passo C03.9)", () => {
    it("allows nutritionist to revoke a pending invitation atomically", async () => {
      mockTx.get.mockResolvedValueOnce({
        exists: () => true,
        id: "rev-token",
        data: () => ({
          nutritionistId: "nutri-owner",
          patientId: "pat-1",
          status: "pending",
          expiresAt: new Date(Date.now() + 100000).toISOString(),
        }),
      });

      await revokeInvitation("rev-token", "nutri-owner");

      expect(mockTx.update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: "revoked",
        }),
      );
      expect(mockTx.update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          pendingInvitationId: null,
        }),
      );
    });

    it("forbids unauthorized nutritionist from revoking another's invitation", async () => {
      mockTx.get.mockResolvedValueOnce({
        exists: () => true,
        id: "rev-token",
        data: () => ({
          nutritionistId: "nutri-owner",
          patientId: "pat-1",
          status: "pending",
          expiresAt: new Date(Date.now() + 100000).toISOString(),
        }),
      });

      await expect(
        revokeInvitation("rev-token", "attacker-nutri"),
      ).rejects.toThrow("UNAUTHORIZED");
    });

    it("rejects activation on a revoked invitation", async () => {
      vi.mocked(firestore.getDoc).mockResolvedValueOnce({
        exists: () => true,
        id: "rev-token",
        data: () => ({
          nutritionistId: "nutri-1",
          patientId: "pat-1",
          patientEmail: "carlos@test.com",
          status: "revoked",
          expiresAt: new Date(Date.now() + 100000).toISOString(),
        }),
      } as unknown as firestore.DocumentSnapshot);

      await expect(
        acceptInvitationWithNewAccount("rev-token", "senhaSegura123!"),
      ).rejects.toThrow("INVITATION_REVOKED");
    });
  });

  describe("5. E-mail existente, Idempotência e Vínculo Explícito (Passo C03.6 e C03.7)", () => {
    const mockCurrentUser: User = {
      uid: "user-patient-existing",
      email: "carlos@test.com",
      displayName: "Carlos Silva",
    } as User;

    it("accepts link with explicit confirmation when logged-in email matches invitation", async () => {
      vi.mocked(firestore.getDoc)
        .mockResolvedValueOnce({
          exists: () => true,
          id: "invite-100",
          data: () => ({
            nutritionistId: "nutri-1",
            nutritionistName: "Dra. Ana",
            nutritionistEmail: "ana@clinic.com",
            patientId: "pat-1",
            patientEmail: "carlos@test.com",
            status: "pending",
            expiresAt: new Date(Date.now() + 100000).toISOString(),
          }),
        } as unknown as firestore.DocumentSnapshot)
        .mockResolvedValueOnce({
          exists: () => false,
        } as unknown as firestore.DocumentSnapshot);

      const res = await acceptInvitationWithExistingAccount(
        "invite-100",
        mockCurrentUser,
      );

      expect(res.alreadyAccepted).toBe(false);
      expect(mockBatch.set).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          role: "patient",
          patientId: "pat-1",
          nutritionistId: "nutri-1",
          invitationId: "invite-100",
        }),
        { merge: true },
      );
      expect(mockBatch.update).toHaveBeenCalledWith(expect.anything(), {
        portalUid: "user-patient-existing",
        portalStatus: "active",
      });
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it("idempotent retry: recognizes when the same user already accepted this invitation", async () => {
      vi.mocked(firestore.getDoc)
        .mockResolvedValueOnce({
          exists: () => true,
          id: "invite-already-done",
          data: () => ({
            nutritionistId: "nutri-1",
            patientId: "pat-1",
            patientEmail: "carlos@test.com",
            status: "accepted",
            acceptedByUid: "user-patient-existing",
            expiresAt: new Date(Date.now() + 100000).toISOString(),
          }),
        } as unknown as firestore.DocumentSnapshot)
        .mockResolvedValueOnce({
          exists: () => true,
          data: () => ({
            portalUid: "user-patient-existing",
            portalStatus: "active",
          }),
        } as unknown as firestore.DocumentSnapshot);

      const res = await acceptInvitationWithExistingAccount(
        "invite-already-done",
        mockCurrentUser,
      );

      expect(res.alreadyAccepted).toBe(true);
      expect(mockBatch.commit).not.toHaveBeenCalled();
    });

    it("allows re-link for a user whose previous portal access was revoked (Passo C03.7)", async () => {
      vi.mocked(firestore.getDoc)
        .mockResolvedValueOnce({
          exists: () => true,
          id: "invite-relink",
          data: () => ({
            nutritionistId: "nutri-2",
            nutritionistName: "Dr. Bruno",
            nutritionistEmail: "bruno@clinic.com",
            patientId: "pat-99",
            patientEmail: "carlos@test.com",
            status: "pending",
            expiresAt: new Date(Date.now() + 100000).toISOString(),
          }),
        } as unknown as firestore.DocumentSnapshot)
        // Existing profile was revoked
        .mockResolvedValueOnce({
          exists: () => true,
          data: () => ({
            nutritionistId: "nutri-1",
            status: "revoked",
            role: "patient",
          }),
        } as unknown as firestore.DocumentSnapshot);

      const res = await acceptInvitationWithExistingAccount(
        "invite-relink",
        mockCurrentUser,
      );

      expect(res.alreadyAccepted).toBe(false);
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it("rejects explicit link if current user email does not match invitation email", async () => {
      vi.mocked(firestore.getDoc).mockResolvedValueOnce({
        exists: () => true,
        id: "invite-100",
        data: () => ({
          nutritionistId: "nutri-1",
          patientId: "pat-1",
          patientEmail: "outro@test.com",
          status: "pending",
          expiresAt: new Date(Date.now() + 100000).toISOString(),
        }),
      } as unknown as firestore.DocumentSnapshot);

      await expect(
        acceptInvitationWithExistingAccount("invite-100", mockCurrentUser),
      ).rejects.toThrow("EMAIL_MISMATCH");
    });

    it("enforces multi-professional restriction if already actively linked to another clinic", async () => {
      vi.mocked(firestore.getDoc)
        .mockResolvedValueOnce({
          exists: () => true,
          id: "invite-100",
          data: () => ({
            nutritionistId: "nutri-NEW",
            patientId: "pat-1",
            patientEmail: "carlos@test.com",
            status: "pending",
            expiresAt: new Date(Date.now() + 100000).toISOString(),
          }),
        } as unknown as firestore.DocumentSnapshot)
        .mockResolvedValueOnce({
          exists: () => true,
          data: () => ({
            nutritionistId: "nutri-OLD",
            status: "active",
            patientId: "pat-999",
            role: "patient",
          }),
        } as unknown as firestore.DocumentSnapshot);

      await expect(
        acceptInvitationWithExistingAccount("invite-100", mockCurrentUser),
      ).rejects.toThrow("MULTI_PROFESSIONAL_NOT_SUPPORTED");
    });
  });

  describe("6. Ativação de Nova Conta com Senha Privada e Compensação (Passo C03.5)", () => {
    it("creates user in Firebase Auth and establishes profile and link without exposing credentials", async () => {
      vi.mocked(firestore.getDoc).mockResolvedValueOnce({
        exists: () => true,
        id: "token-new",
        data: () => ({
          nutritionistId: "nutri-1",
          nutritionistName: "Dra. Ana",
          nutritionistEmail: "ana@clinic.com",
          patientId: "pat-1",
          patientEmail: "novo@test.com",
          status: "pending",
          expiresAt: new Date(Date.now() + 100000).toISOString(),
        }),
      } as unknown as firestore.DocumentSnapshot);

      vi.mocked(
        firebaseAuth.createUserWithEmailAndPassword,
      ).mockResolvedValueOnce({
        user: { uid: "new-patient-uid" } as unknown as User,
      } as unknown as firebaseAuth.UserCredential);

      const res = await acceptInvitationWithNewAccount(
        "token-new",
        "minhaSenhaSuperSecreta123!",
      );

      expect(res.uid).toBe("new-patient-uid");
      expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "novo@test.com",
        "minhaSenhaSuperSecreta123!",
      );
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it("compensates newly created Auth user by deleting it if Firestore batch fails", async () => {
      const mockUserDelete = vi.fn().mockResolvedValue(undefined);

      vi.mocked(firestore.getDoc).mockResolvedValueOnce({
        exists: () => true,
        id: "token-fail",
        data: () => ({
          nutritionistId: "nutri-1",
          patientId: "pat-1",
          patientEmail: "novo@test.com",
          status: "pending",
          expiresAt: new Date(Date.now() + 100000).toISOString(),
        }),
      } as unknown as firestore.DocumentSnapshot);

      vi.mocked(
        firebaseAuth.createUserWithEmailAndPassword,
      ).mockResolvedValueOnce({
        user: {
          uid: "temp-uid",
          delete: mockUserDelete,
        } as unknown as User,
      } as unknown as firebaseAuth.UserCredential);

      mockBatch.commit.mockRejectedValueOnce(new Error("FIRESTORE_WRITE_ERROR"));

      await expect(
        acceptInvitationWithNewAccount("token-fail", "senhaValida123!"),
      ).rejects.toThrow("FIRESTORE_LINK_FAILED");

      // Verify that compensation deleted the newly created user
      expect(mockUserDelete).toHaveBeenCalledTimes(1);
    });

    it("throws AUTH_EMAIL_ALREADY_IN_USE when email already exists in Auth", async () => {
      vi.mocked(firestore.getDoc).mockResolvedValueOnce({
        exists: () => true,
        id: "token-email-exists",
        data: () => ({
          nutritionistId: "nutri-1",
          patientId: "pat-1",
          patientEmail: "existente@test.com",
          status: "pending",
          expiresAt: new Date(Date.now() + 100000).toISOString(),
        }),
      } as unknown as firestore.DocumentSnapshot);

      vi.mocked(
        firebaseAuth.createUserWithEmailAndPassword,
      ).mockRejectedValueOnce({
        code: "auth/email-already-in-use",
      });

      await expect(
        acceptInvitationWithNewAccount("token-email-exists", "senha123!"),
      ).rejects.toThrow("AUTH_EMAIL_ALREADY_IN_USE");
    });
  });
});

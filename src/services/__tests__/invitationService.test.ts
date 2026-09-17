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

vi.mock("firebase/firestore", () => ({
  doc: vi.fn((_db, coll, id) => ({ path: `${coll}/${id || "auto_id"}` })),
  collection: vi.fn((_db, coll) => ({ path: coll })),
  query: vi.fn((...args) => ({ queryArgs: args })),
  where: vi.fn((field, op, val) => ({ field, op, val })),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
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

  describe("1. Convite novo & Idempotência (Retry)", () => {
    it("creates a new pending invitation with 7-day expiration and no password text", async () => {
      vi.mocked(firestore.getDocs).mockResolvedValueOnce({
        docs: [],
      } as unknown as firestore.QuerySnapshot);

      vi.mocked(firestore.setDoc).mockResolvedValueOnce(undefined);
      vi.mocked(firestore.updateDoc).mockResolvedValueOnce(undefined);

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
      // Must not contain password
      expect(
        (inv as unknown as { password?: string }).password,
      ).toBeUndefined();

      // Check setDoc payload
      expect(firestore.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: "pending",
          patientEmail: "paciente@exemplo.com",
          nutritionistId: "nutri-123",
        }),
      );
    });

    it("idempotently returns existing active pending invitation instead of creating a duplicate", async () => {
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
      // Should NOT have called setDoc because an existing pending invite was found
      expect(firestore.setDoc).not.toHaveBeenCalled();
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

  describe("3. Convite reutilizado", () => {
    it("rejects acceptance if invitation is already accepted", async () => {
      vi.mocked(firestore.getDoc).mockResolvedValueOnce({
        exists: () => true,
        id: "used-token",
        data: () => ({
          nutritionistId: "nutri-1",
          patientId: "pat-1",
          patientEmail: "carlos@test.com",
          status: "accepted",
          expiresAt: new Date(Date.now() + 100000).toISOString(),
        }),
      } as unknown as firestore.DocumentSnapshot);

      await expect(
        acceptInvitationWithNewAccount("used-token", "senhaSegura123!"),
      ).rejects.toThrow("INVITATION_ALREADY_ACCEPTED");
    });
  });

  describe("4. Convite revogado", () => {
    it("allows nutritionist to revoke a pending invitation", async () => {
      vi.mocked(firestore.getDoc).mockResolvedValueOnce({
        exists: () => true,
        id: "rev-token",
        data: () => ({
          nutritionistId: "nutri-owner",
          patientId: "pat-1",
          status: "pending",
          expiresAt: new Date(Date.now() + 100000).toISOString(),
        }),
      } as unknown as firestore.DocumentSnapshot);

      vi.mocked(firestore.updateDoc).mockResolvedValueOnce(undefined);

      await revokeInvitation("rev-token", "nutri-owner");

      expect(firestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: "revoked",
        }),
      );
    });

    it("forbids unauthorized nutritionist from revoking another's invitation", async () => {
      vi.mocked(firestore.getDoc).mockResolvedValueOnce({
        exists: () => true,
        id: "rev-token",
        data: () => ({
          nutritionistId: "nutri-owner",
          patientId: "pat-1",
          status: "pending",
          expiresAt: new Date(Date.now() + 100000).toISOString(),
        }),
      } as unknown as firestore.DocumentSnapshot);

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

  describe("5. E-mail existente e Vínculo Explícito", () => {
    const mockCurrentUser: User = {
      uid: "user-patient-existing",
      email: "carlos@test.com",
      displayName: "Carlos Silva",
    } as User;

    it("accepts link with explicit confirmation when logged-in email matches invitation", async () => {
      // 1. getInvitationByToken
      vi.mocked(firestore.getDoc).mockResolvedValueOnce({
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
      } as unknown as firestore.DocumentSnapshot);

      // 2. check existing patient profile
      vi.mocked(firestore.getDoc).mockResolvedValueOnce({
        exists: () => false,
      } as unknown as firestore.DocumentSnapshot);

      vi.mocked(firestore.setDoc).mockResolvedValueOnce(undefined);
      vi.mocked(firestore.updateDoc).mockResolvedValueOnce(undefined);
      vi.mocked(firestore.updateDoc).mockResolvedValueOnce(undefined);

      await acceptInvitationWithExistingAccount("invite-100", mockCurrentUser);

      // Should set patientProfile with role patient
      expect(firestore.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          role: "patient",
          patientId: "pat-1",
          nutritionistId: "nutri-1",
        }),
        { merge: true },
      );

      // Should link portalUid on patient doc
      expect(firestore.updateDoc).toHaveBeenCalledWith(expect.anything(), {
        portalUid: "user-patient-existing",
      });

      // Should mark invitation as accepted
      expect(firestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: "accepted",
          acceptedByUid: "user-patient-existing",
        }),
      );
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

    it("enforces multi-professional restriction (Passo 7.8) if already linked to another clinic", async () => {
      // 1. getInvitationByToken
      vi.mocked(firestore.getDoc).mockResolvedValueOnce({
        exists: () => true,
        id: "invite-100",
        data: () => ({
          nutritionistId: "nutri-NEW",
          patientId: "pat-1",
          patientEmail: "carlos@test.com",
          status: "pending",
          expiresAt: new Date(Date.now() + 100000).toISOString(),
        }),
      } as unknown as firestore.DocumentSnapshot);

      // 2. check existing profile -> already linked to nutri-OLD
      vi.mocked(firestore.getDoc).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          nutritionistId: "nutri-OLD",
          patientId: "pat-999",
          role: "patient",
        }),
      } as unknown as firestore.DocumentSnapshot);

      await expect(
        acceptInvitationWithExistingAccount("invite-100", mockCurrentUser),
      ).rejects.toThrow("MULTI_PROFESSIONAL_NOT_SUPPORTED");
    });
  });

  describe("6. Ativação de Nova Conta com Senha Privada", () => {
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

      vi.mocked(firestore.setDoc).mockResolvedValueOnce(undefined);
      vi.mocked(firestore.updateDoc).mockResolvedValueOnce(undefined);
      vi.mocked(firestore.updateDoc).mockResolvedValueOnce(undefined);

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
      expect(firestore.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          role: "patient",
          patientId: "pat-1",
          nutritionistId: "nutri-1",
        }),
      );
    });
  });
});

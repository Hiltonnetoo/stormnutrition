export type AuthStatus =
  | "loading"
  | "unauthenticated"
  | "authenticated"
  | "incomplete_profile"
  | "invitation_pending"
  | "revoked"
  | "error";

export type UserRole = "nutritionist" | "patient";

export interface AuthError {
  code: string;
  message: string;
}

export interface NutritionistProfile {
  uid: string;
  email: string;
  displayName: string;
  role: "nutritionist";
  createdAt: string;
}

export type InvitationStatus = "pending" | "accepted" | "expired" | "revoked";

export interface PatientInvitation {
  id: string;
  nutritionistId: string;
  nutritionistName: string;
  nutritionistEmail: string;
  patientId: string;
  patientEmail: string;
  patientName: string;
  status: InvitationStatus;
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string;
  acceptedByUid?: string;
  revokedAt?: string;
  /** Set when a stored "pending" invitation cannot be used: it predates the
   *  strict contract (no recipient e-mail or no Timestamp expiry), which the
   *  rules refuse. The UI asks for a new invitation instead (R03-B). */
  invalidReason?: "legacy_format";
}

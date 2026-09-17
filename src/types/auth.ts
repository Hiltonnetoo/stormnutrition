export type AuthStatus =
  | "loading"
  | "unauthenticated"
  | "authenticated"
  | "incomplete_profile"
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

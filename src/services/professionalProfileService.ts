import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseCore";

/**
 * A6 — the professional identity used when approving a diet: display name
 * and CRN, stored in `users/{uid}` (the rules keep `role` immutable and
 * allow the owner to update the other fields).
 */
export interface ProfessionalCredentials {
  name: string;
  crn: string;
}

export const getProfessionalCredentials = async (
  uid: string,
): Promise<ProfessionalCredentials> => {
  const snap = await getDoc(doc(db, "users", uid));
  const data = snap.exists() ? snap.data() : {};
  return {
    name: typeof data.displayName === "string" ? data.displayName : "",
    crn: typeof data.professionalCrn === "string" ? data.professionalCrn : "",
  };
};

export const saveProfessionalCrn = async (uid: string, crn: string) => {
  await updateDoc(doc(db, "users", uid), { professionalCrn: crn.trim() });
};

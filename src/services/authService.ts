import { deleteApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signOut,
  deleteUser,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  app,
  auth,
  db,
  updateProfile,
  createIsolatedAuth,
} from "./firebaseCore";
import type { User } from "./firebaseCore";
import type { PatientPortalProfile, NutritionistProfile } from "../types";
import { validateProfileImage } from "../utils/validation";

export const sendPortalPasswordReset = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const firebaseSignOut = (authInstance: typeof auth) => {
  return signOut(authInstance);
};

export const uploadProfilePicture = async (
  uid: string,
  file: File,
): Promise<string> => {
  const check = validateProfileImage(file);
  if (!check.valid) {
    throw new Error(check.error);
  }
  // Cloud Storage is only needed here: load it on demand so @firebase/storage
  // stays out of the initial bundle.
  const { getStorage, ref, uploadBytes, getDownloadURL } =
    await import("firebase/storage");
  const storageRef = ref(
    getStorage(app),
    `profilePictures/${uid}/${file.name}`,
  );
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

export const updateUserProfile = (
  user: User,
  profile: { displayName?: string; photoURL?: string },
) => {
  return updateProfile(user, profile);
};

export const getPatientPortalProfile = async (
  uid: string,
): Promise<PatientPortalProfile | null> => {
  const snap = await getDoc(doc(db, "patientProfiles", uid));
  return snap.exists() ? (snap.data() as PatientPortalProfile) : null;
};

export const getNutritionistProfile = async (
  uid: string,
): Promise<NutritionistProfile | null> => {
  const snap = await getDoc(doc(db, "users", uid));
  if (snap.exists()) {
    const data = snap.data();
    return {
      uid,
      email: data.email || "",
      displayName: data.name || data.displayName || "",
      role: "nutritionist",
      createdAt: data.createdAt || "",
    };
  }
  return null;
};

export const createNutritionistProfile = async (
  uid: string,
  data: { email: string; displayName?: string },
): Promise<NutritionistProfile> => {
  const profile: NutritionistProfile = {
    uid,
    email: data.email,
    displayName: data.displayName || "",
    role: "nutritionist",
    createdAt: new Date().toISOString(),
  };

  await setDoc(
    doc(db, "users", uid),
    {
      role: "nutritionist",
      email: profile.email,
      name: profile.displayName,
      createdAt: profile.createdAt,
    },
    { merge: true },
  );

  return profile;
};

export const createPatientPortalProfile = (
  uid: string,
  profile: Omit<PatientPortalProfile, "uid">,
) => setDoc(doc(db, "patientProfiles", uid), { ...profile, uid });

export const updatePatientPortalRef = (
  userId: string,
  patientId: string,
  portalUid: string,
) => updateDoc(doc(db, "users", userId, "patients", patientId), { portalUid });

export const setupPatientPortalAccess = async (
  email: string,
  passwordText: string,
  patientId: string,
  nutritionistId: string,
  nutritionistName: string,
  nutritionistEmail: string,
): Promise<string> => {
  const { app: secondaryApp, auth: secondaryAuth } = createIsolatedAuth(
    "patientCreation_" + Date.now(),
  );
  let createdUser: User | null = null;
  let profileCreated = false;
  try {
    const cred = await createUserWithEmailAndPassword(
      secondaryAuth,
      email,
      passwordText,
    );
    createdUser = cred.user;

    // 1. Create patient portal profile in Firestore
    await setDoc(doc(db, "patientProfiles", createdUser.uid), {
      patientId,
      nutritionistId,
      nutritionistName,
      nutritionistEmail,
      role: "patient",
      status: "active",
      createdAt: new Date().toISOString(),
    });
    profileCreated = true;

    // 2. Update patient reference with portalUid
    await updateDoc(doc(db, "users", nutritionistId, "patients", patientId), {
      portalUid: createdUser.uid,
      portalStatus: "active",
    });

    return createdUser.uid;
  } catch (error) {
    if (profileCreated && createdUser) {
      try {
        await deleteDoc(doc(db, "patientProfiles", createdUser.uid));
      } catch (dbErr) {
        console.error("Erro ao deletar profile no rollback:", dbErr);
      }
    }
    if (createdUser) {
      try {
        await deleteUser(createdUser);
      } catch (deleteErr) {
        console.error("Erro ao deletar usuário no rollback:", deleteErr);
      }
    }
    throw error;
  } finally {
    await deleteApp(secondaryApp);
  }
};

/** @deprecated use setupPatientPortalAccess */
export const createPatientAccount = async (
  email: string,
  password: string,
): Promise<string> => {
  const { app: secondaryApp, auth: secondaryAuth } = createIsolatedAuth(
    "patientCreation_" + Date.now(),
  );
  try {
    const cred = await createUserWithEmailAndPassword(
      secondaryAuth,
      email,
      password,
    );
    return cred.user.uid;
  } finally {
    await deleteApp(secondaryApp);
  }
};

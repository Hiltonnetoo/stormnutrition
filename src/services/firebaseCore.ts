import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  initializeFirestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { firebaseConfig } from "./firebase.config";

const app: FirebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
});
const googleProvider = new GoogleAuthProvider();

// Detect explicit emulator test mode
const rawEmulatorHost =
  typeof process !== "undefined"
    ? process.env?.FIRESTORE_EMULATOR_HOST
    : undefined;
const useEmulator =
  import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true" ||
  Boolean(rawEmulatorHost);
const globalState = globalThis as unknown as {
  __FIREBASE_EMULATORS_CONNECTED__?: boolean;
};

if (useEmulator && !globalState.__FIREBASE_EMULATORS_CONNECTED__) {
  console.log("🛠️ Conectando cliente Firebase aos emuladores locais...");
  const authHost =
    import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST || "http://127.0.0.1:9099";
  const parsedHost = rawEmulatorHost?.includes(":")
    ? rawEmulatorHost.split(":")[0]
    : rawEmulatorHost;
  const parsedPort = rawEmulatorHost?.includes(":")
    ? Number(rawEmulatorHost.split(":")[1])
    : 8080;
  const firestoreHost =
    import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_HOST ||
    parsedHost ||
    "127.0.0.1";
  const firestorePort = Number(
    import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_PORT || parsedPort || 8080,
  );

  connectAuthEmulator(auth, authHost, { disableWarnings: true });
  connectFirestoreEmulator(db, firestoreHost, firestorePort);
  globalState.__FIREBASE_EMULATORS_CONNECTED__ = true;
} else if (!useEmulator) {
  console.log("🔥 Firebase conectado ao projeto:", firebaseConfig.projectId);
}

export {
  app,
  auth,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  updateProfile,
  createUserWithEmailAndPassword,
};
export type { User };

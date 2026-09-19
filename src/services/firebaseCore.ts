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
  type Auth,
} from "firebase/auth";
import {
  initializeFirestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { firebaseRuntime } from "./firebase.config";

// firebaseRuntime has already been validated: an incomplete or unsafe
// configuration throws FirebaseConfigError before anything is initialized.
const app: FirebaseApp = initializeApp(firebaseRuntime.options);

const auth = getAuth(app);
const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
});
const googleProvider = new GoogleAuthProvider();

const globalState = globalThis as unknown as {
  __FIREBASE_EMULATORS_CONNECTED__?: boolean;
};

if (firebaseRuntime.useEmulator) {
  if (!globalState.__FIREBASE_EMULATORS_CONNECTED__) {
    console.log("🛠️ Conectando cliente Firebase aos emuladores locais...");
    connectAuthEmulator(auth, firebaseRuntime.emulator.authUrl, {
      disableWarnings: true,
    });
    connectFirestoreEmulator(
      db,
      firebaseRuntime.emulator.firestoreHost,
      firebaseRuntime.emulator.firestorePort,
    );
    globalState.__FIREBASE_EMULATORS_CONNECTED__ = true;
  }
  // Lets the E2E suite verify it is talking to the emulated demo project.
  if (typeof document !== "undefined") {
    document.documentElement.dataset.firebaseEnv = `emulator:${firebaseRuntime.options.projectId}`;
  }
} else {
  console.log(
    "🔥 Firebase conectado ao projeto:",
    firebaseRuntime.options.projectId,
  );
}

/**
 * Auth instance on a separate Firebase app (creating an account there does
 * not sign the professional out). In emulator mode it is connected to the Auth
 * emulator too, so it can never create accounts in a real project.
 */
export const createIsolatedAuth = (
  name: string,
): { app: FirebaseApp; auth: Auth } => {
  const isolatedApp = initializeApp(firebaseRuntime.options, name);
  const isolatedAuth = getAuth(isolatedApp);
  if (firebaseRuntime.useEmulator) {
    connectAuthEmulator(isolatedAuth, firebaseRuntime.emulator.authUrl, {
      disableWarnings: true,
    });
  }
  return { app: isolatedApp, auth: isolatedAuth };
};

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

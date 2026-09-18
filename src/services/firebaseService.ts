// Re-export core instances and common auth methods
export {
  auth,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  updateProfile,
  createUserWithEmailAndPassword,
} from "./firebaseCore";
export type { User } from "./firebaseCore";

// Import and re-export auth domain services
export {
  firebaseSignOut,
  uploadProfilePicture,
  updateUserProfile,
  getPatientPortalProfile,
  createPatientPortalProfile,
  getNutritionistProfile,
  createNutritionistProfile,
  updatePatientPortalRef,
  createPatientAccount,
  setupPatientPortalAccess,
  sendPortalPasswordReset,
} from "./authService";

// Import and re-export invitation services
export {
  createOrGetPendingInvitation,
  getInvitationByToken,
  revokeInvitation,
  acceptInvitationWithNewAccount,
  acceptInvitationWithExistingAccount,
  computeInvitationStatus,
} from "./invitationService";

// Import and re-export patient domain services
export {
  addPatient,
  updatePatient,
  getPatientById,
  deletePatient,
  deletePatientCascade,
  archivePatient,
  unarchivePatient,
  revokePatientPortalAccess,
  getPatients,
  countPatients,
} from "./patientService";

// Import and re-export diet domain services
export {
  saveDietPlan,
  updateDietPlan,
  deleteDietPlan,
  getPatientDiets,
  subscribeLatestDiet,
  subscribeRecentDiets,
  getDietCountSummary,
} from "./dietService";
export type { DietCountSummary } from "./dietService";

// Import and re-export appointment domain services
export {
  addAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsInRange,
  getUpcomingAppointments,
  getNextPatientAppointment,
  findAppointmentConflict,
  validateAppointmentData,
} from "./appointmentService";

// Import and re-export evaluation/tracking domain services
export {
  logPatientWeight,
  requestSelfEvaluation,
  completeSelfEvaluation,
  logAdherence,
  updatePatientSettings,
} from "./evaluationService";

# Architectural Decision Records (ADRs) — Storm Nutrition

This document records the foundational architectural decisions, trade-offs, and technical rationales governing the design and implementation of **Storm Nutrition**.

---

## Index of Architectural Decisions

- [ADR-01: React 19 SPA with Strict TypeScript and Code-Splitting](#adr-01-react-19-spa-with-strict-typescript-and-code-splitting)
- [ADR-02: Native Compile-Time Tailwind CSS v4](#adr-02-native-compile-time-tailwind-css-v4)
- [ADR-03: Secondary Firebase Auth Instance for Non-Disruptive Patient Provisioning](#adr-03-secondary-firebase-auth-instance-for-non-disruptive-patient-provisioning)
- [ADR-04: Passwordless Tokenized Invitations with Patient-Defined Passwords](#adr-04-passwordless-tokenized-invitations-with-patient-defined-passwords)
- [ADR-05: Multi-Tenant Isolation via Firestore Security Rules](#adr-05-multi-tenant-isolation-via-firestore-security-rules)
- [ADR-06: Deterministic Constraint-Based Meal Generation over Generative AI](#adr-06-deterministic-constraint-based-meal-generation-over-generative-ai)
- [ADR-07: Vector-Based Editorial PDF Exporting](#adr-07-vector-based-editorial-pdf-exporting)
- [ADR-08: Architectural Decoupling of Local Billing Simulation](#adr-08-architectural-decoupling-of-local-billing-simulation)
- [ADR-09: Safe Interception of Demo Emails and Multi-Layer Abuse Controls](#adr-09-safe-interception-of-demo-emails-and-multi-layer-abuse-controls)
- [ADR-10: V1/V2 Backward Compatibility and Defensive Schema Hydration](#adr-10-v1v2-backward-compatibility-and-defensive-schema-hydration)

---

### ADR-01: React 19 SPA with Strict TypeScript and Code-Splitting

- **Status:** Accepted & Implemented
- **Context:** Nutritionists require an uninterrupted, high-responsiveness interface during active consultations where clinical evaluations, anthropometric metrics, and dietary changes occur concurrently.
- **Decision:** Build the frontend as a client-side Single Page Application (SPA) on React 19 with strict TypeScript (`~5.8.2`, `"strict": true` with zero `any` evasions). Heavy export tools (`html2canvas`, `jspdf`) weighing >500 KB are segregated into lazy-loaded dynamic chunks (`React.lazy` + `<Suspense>`).
- **Consequences:** Initial bundle load drops from ~1.6 MB to ~760 KB (a ~53% reduction). First Contentful Paint (FCP) and Time to Interactive (TTI) remain well within high-performance thresholds across standard broadband and mobile 4G networks.

---

### ADR-02: Native Compile-Time Tailwind CSS v4

- **Status:** Accepted & Implemented
- **Context:** The legacy prototype pulled Tailwind CSS via a runtime CDN script, requiring browser-side parsing (~3 MB script) on every reload and causing flashes of unstyled content (FOUC).
- **Decision:** Integrate Tailwind CSS v4 at compile-time using the `@tailwindcss/vite` plugin. Utility classes are scanned directly from source code during `vite build` and emitted as a minified static stylesheet (~19 KB gzip).
- **Consequences:** Eliminates client-side runtime styling computations, eliminates FOUC, and guarantees 100% offline styling support when running with local emulators.

---

### ADR-03: Secondary Firebase Auth Instance for Non-Disruptive Patient Provisioning

- **Status:** Accepted & Implemented
- **Context:** The Firebase Auth client SDK automatically authenticates newly created credentials into the current session. If a nutritionist provisioned a patient's portal account, the nutritionist's active session would be evicted and replaced by the patient.
- **Decision:** Encapsulate patient account creation within an isolated, temporary secondary Firebase App instance (`getSecondaryAuth()` in `src/services/authService.ts`). The secondary instance interacts with Firebase Auth without overwriting the primary app instance's token persistence.
- **Consequences:** Eliminates auth session hijacking completely while avoiding the operational cost and latency of dedicated backend server microservices for standard account provisioning. *Limitation:* Operates as a client-side pattern within the Firebase Web SDK; it does not replace backend administrative operations (such as Firebase Admin SDK in Cloud Functions) when server-side authority is required.

---

### ADR-04: Passwordless Tokenized Invitations with Client Coordination & Compensation

- **Status:** Accepted & Implemented
- **Context:** Storing or transmitting cleartext temporary passwords violates privacy-by-design standards and modern cybersecurity practices.
- **Decision:** Implement cryptographic, tokenized invitations (`invitations/:token` collection in Firestore). Nutritionists dispatch an invitation link. When the patient opens `/convite/:token`, the client validates the token, displays the nutritionist's identity, and allows the patient to define their own strong password securely.
- **Consequences:** The system adheres to privacy-by-design principles: zero plaintext password storage, zero transmission of credentials over plain email, and patient-defined password creation. Cross-system atomicity between Firebase Auth and Firestore cannot be achieved natively in a single transaction via the Firebase Web SDK. Instead, the application coordinates a two-phase client workflow with automatic compensation: if Firestore profile linking fails after Auth user creation, the newly created Auth user is deleted immediately to prevent orphan accounts. Database rules (`firestore.rules`) strictly enforce that an invitation can only be linked once (`invitation.status == 'pending' && !('acceptedByUid' in resource.data)`), preventing replay or re-linking attacks.

---

### ADR-05: Multi-Tenant Isolation via Firestore Security Rules

- **Status:** Accepted & Implemented
- **Context:** In a multi-practitioner clinical platform, data leakage between competing clinics or unrelated patients constitutes a critical security vulnerability. Client-side filtering is insufficient.
- **Decision:** Enforce multi-tenant tenancy isolation strictly at the database engine level via `firestore.rules`. Every read, write, update, and delete operation on patients, diets, clinical evaluations, and appointments enforces:
  ```
  request.auth != null && request.auth.uid == resource.data.nutritionistId
  ```
  Patients accessing the portal are restricted to their own linked records:
  ```
  request.auth != null && request.auth.uid == resource.data.patientUid
  ```
- **Consequences:** Even if a client bypasses the UI and communicates directly with the Firestore REST or gRPC endpoints, access to any unauthorized patient record is denied with HTTP 403 / `PERMISSION_DENIED`. Validated by a 72-test automated suite (`tests-rules/firestore.rules.test.ts` and `tests-rules/dietPersistence.integration.test.ts`).

---

### ADR-06: Deterministic Constraint-Based Meal Generation over Generative AI

- **Status:** Accepted & Implemented
- **Context:** Generative Large Language Models (LLMs) hallucinate macro breakdowns, introduce non-existent food items, and fail to guarantee hard medical boundaries (such as strict gluten exclusion in celiac disease or sodium ceilings in severe hypertension).
- **Decision:** Implement a deterministic, algorithmic solver (`src/services/dietAlgorithmService.ts`) operating over verified Brazilian nutritional composition data (TACO/UNICAMP). The engine calculates exact caloric scaling factors, enforces strict exclusion of ultra-processed items (NOVA 4), and flags high-glycemic or high-sodium configurations with semaphoric clinical alerts.
- **Consequences:** 100% reproducible and auditable meal plans with zero API token latency, zero per-generation billing cost, and guaranteed exclusion of forbidden food items.

---

### ADR-07: Vector-Based Editorial PDF Exporting

- **Status:** Accepted & Implemented
- **Context:** Generic HTML canvas captures produce blurry text when printed, generate large file sizes (>10 MB), and trigger unreadable page-break cuts across meal headers or food rows.
- **Decision:** Implement an editorial PDF generator using jsPDF and custom layout calculations (`src/utils/pdfExporter.ts`). The exporter computes line heights dynamically, prevents orphan section titles, applies clinical badge accents, and outputs clean vector text.
- **Consequences:** Crisp, selectable typography on retina screens and desktop printers, compact file sizes (~50 KB vs ~10 MB for rasterized screenshots), and professional presentation for clinical hand-offs.

---

### ADR-08: Architectural Decoupling of Local Billing Simulation

- **Status:** Accepted & Implemented
- **Context:** For portfolio demonstrations and evaluation purposes, implementing live credit card processing with Stripe webhooks introduces unnecessary operational complexity, live financial dependencies, and third-party credential overhead.
- **Decision:** Maintain a subscription prototype in scoped `localStorage` (`isanutri:<uid>:billingState:v1`). The simulation is prominently disclosed in the UI (`BillingSection.tsx` and `Home.tsx`) and equipped with a "Reset to Default" control. Crucially, **this local state never dictates backend Firestore permissions**: data access is determined purely by the authenticated Firebase UID.
- **Consequences:** Evaluators can experiment with plan tiers and payment interfaces safely without real charges, while the underlying application security remains impervious to client-side storage tampering.

---

### ADR-09: Safe Interception of Demo Emails and Multi-Layer Abuse Controls

- **Status:** Accepted & Implemented
- **Context:** Automated testing and evaluators testing the clinical journey should not leak emails to real external inboxes, deplete third-party EmailJS quotas, or risk spam blacklisting.
- **Decision:** Implement multi-layer transport isolation in `src/services/emailService.ts`:
  1. **Demo Domain Interception:** Intercept outgoing emails targeting demo domains (`@demo.stormnutrition.com`, `@example.com`, `@test.com`), returning `{ success: true, simulated: true }`.
  2. **Isolated Environment Protection:** When running with Firebase emulators (`VITE_USE_FIREBASE_EMULATOR=true`) or in demo mode (`VITE_DEMO_MODE=true`), all external dispatches are blocked unconditionally, preventing unintended calls to external providers even if API keys are configured.
  3. **Visual UI Differentiation:** The interface displays dedicated amber badges and localized notifications (`t("email_admin.status_simulated")`) distinguishing simulated dispatches from live delivery.
  4. **Client-Side Abuse Controls:** In-memory rate limiting (5-second cooldown and 5 sends/minute per recipient) and payload size limits (5,000 characters) remain active across all dispatches.
- **Consequences:** Safe, non-intrusive demonstration flows that verify abuse controls and email formatting without making external network calls. *Architecture Note:* In-memory client rate limiting acts as a UX safeguard (preventing accidental repeated button clicks) and does not replace a server-side API gateway.

---

### ADR-10: V1/V2 Backward Compatibility and Defensive Schema Hydration

- **Status:** Accepted & Implemented
- **Context:** Upgrading meal plan schemas from legacy prototypes (e.g. flat strings or unversioned arrays) to structured meal options with alternatives must never crash existing patient clinical histories.
- **Decision:** Implement defensive schema hydration and backward-compatible adapters in `src/services/dietService.ts` and `src/services/patientMigrationService.ts`. Unversioned records are non-destructively normalized into versioned V2 structures upon read.
- **Consequences:** Zero silent data loss, resilient rendering of legacy records, and seamless schema evolution across versions.

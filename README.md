# Storm Nutrition — Clinical Management & Diet Planning Platform

[![CI Pipeline](https://github.com/Hiltonnetoo/stormnutrition/actions/workflows/ci.yml/badge.svg)](https://github.com/Hiltonnetoo/stormnutrition/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Storm Nutrition is a clinical nutrition management application built with **React 19**, **TypeScript (Strict Mode)**, **Vite**, **Tailwind CSS v4**, and **Firebase** (Auth, Firestore, Storage). Designed for professional dietitians, the platform combines structured clinical assessments, a deterministic constraint-based meal planning engine powered by verified Brazilian food composition data (TACO/UNICAMP), a dedicated Patient Portal with invitation-based onboarding and patient-defined passwords, editorial-grade vector PDF exports, and database-enforced multi-tenant isolation.

- 🌐 **Published demo (may lag behind this local release; deployment not verified):** [https://stormnutrition.web.app](https://stormnutrition.web.app)
- 📖 **Evaluation Guide:** [docs/demo-guide.md](docs/demo-guide.md) (3–5 min quick assessment)
- 🏛️ **Architectural Decision Records:** [docs/architecture-decisions.md](docs/architecture-decisions.md) (10 ADRs)

**Validation and delivery status:** see [the latest local validation](docs/validacao-2026-09-19/README.md). Results apply to the source manifest linked there; remote CI and deployment are separate checks. No fixed test-count badge is used as evidence.

---

## 🏗️ Architecture Diagram

```mermaid
graph TD
    Client[React 19 SPA + Vite + Tailwind CSS v4]
    
    subgraph ClientLayer [Client-Side Architecture]
        Router[React Router v7 SPA Client]
        AuthCtx[Auth Context & Session Manager]
        i18nLayer[i18n Bilingual Engine - PT / EN]
        BMR[Metabolic Engine - Mifflin-St Jeor & Harris-Benedict]
        DietAlg[Deterministic Meal Solver & Constraint Engine]
        PDFGen[Editorial Vector PDF Exporter - jsPDF / Canvas]
        LocalBilling[Billing Prototype - Scoped LocalStorage]
    end

    subgraph FirebaseServices [Firebase Backend Services]
        FirebasePrimary[Primary Firebase Auth Instance - Professional Session]
        FirebaseSecondary[Secondary Firebase App - Isolated Patient Provisioning]
        Firestore[(Cloud Firestore - Encrypted NoSQL)]
    end

    subgraph ExternalServices [External Integrations & Simulators]
        EmailService[Email Service with Demo Interceptor & Rate Limiting]
        EmailJS[EmailJS API - Live Dispatch]
    end

    Client --> Router
    Router --> AuthCtx
    Router --> i18nLayer
    
    %% Authentication & Provisioning
    AuthCtx -->|Active Session| FirebasePrimary
    AuthCtx -->|Provision Patient Account without Session Disruption| FirebaseSecondary
    FirebaseSecondary -->|Create Patient Credentials| FirebasePrimary
    
    %% Multi-Tenant Firestore Structure (Enforced by Security Rules)
    AuthCtx -->|Strict Multi-Tenant Querying| Firestore
    Firestore -->|/users/:uid/patients/*| PatientsData[Patients & Anthropometric History]
    Firestore -->|/users/:uid/diets/*| DietsData[Diet Plans & Structured Meal Options]
    Firestore -->|/users/:uid/appointments/*| ApptsData[Consultation Records & Calendar]
    Firestore -->|/patientProfiles/:patientUid| PatientPortalData[Patient Portal Adherence & Self-Service]
    Firestore -->|/invitations/:token| InviteTokens[Tokenized Invitations · Patient-Defined Passwords]

    %% Communications
    ClientLayer -->|Trigger Clinical & Invite Emails| EmailService
    EmailService -->|Demo Domain Intercept @demo.stormnutrition.com| SafeDemo[In-Memory Simulation / No External Call]
    EmailService -->|Live Production Recipients| EmailJS
```

---

## 🏛️ Core Engineering & Architecture Decisions

A detailed record of all 10 architectural decisions, trade-offs, and design rationale is maintained in [docs/architecture-decisions.md](docs/architecture-decisions.md). Highlights include:

1. **React 19 & Strict TypeScript Compiler** ([ADR-01](docs/architecture-decisions.md#adr-01-react-19-spa-with-strict-typescript-and-code-splitting)): Pure SPA architecture with zero `any` evasions. Dynamic code-splitting via `React.lazy` on heavy export libraries (`html2canvas`, `jspdf`) reduces initial bundle load by **over 53%** (from 1.6 MB to ~760 KB).
2. **Compile-Time Tailwind CSS v4** ([ADR-02](docs/architecture-decisions.md#adr-02-native-compile-time-tailwind-css-v4)): Replaced legacy runtime CDN scripts with `@tailwindcss/vite`. Stylesheets compile into a single static file (~19 KB gzip) with full offline layout predictability.
3. **Secondary Firebase App for Patient Provisioning** ([ADR-03](docs/architecture-decisions.md#adr-03-secondary-firebase-auth-instance-for-non-disruptive-patient-provisioning)): Encapsulates patient credential creation in a secondary, isolated Firebase instance (`getSecondaryAuth()` in `authService.ts`), preventing the client SDK from evicting the active nutritionist's session.
4. **Tokenized Invitations with Client Coordination & Compensation** ([ADR-04](docs/architecture-decisions.md#adr-04-passwordless-tokenized-invitations-with-patient-defined-passwords)): No cleartext or temporary passwords are transmitted via email. Patients claim their account via cryptographic invitation tokens (`/convite/:token`) and set their own passwords. The client coordinates two-phase account activation with compensating rollback if Firestore profile linking fails, while Firestore rules forbid re-linking or modifying accepted invitations.
5. **Database-Enforced Multi-Tenant Isolation** ([ADR-05](docs/architecture-decisions.md#adr-05-multi-tenant-isolation-via-firestore-security-rules)): Tenant boundaries are enforced directly in `firestore.rules`. Cross-practitioner data leakage is prevented at the engine level even if clients communicate with Firestore endpoints directly.
6. **Deterministic Algorithmic Solver over Generative AI** ([ADR-06](docs/architecture-decisions.md#adr-06-deterministic-constraint-based-meal-generation-over-generative-ai)): Rule-based meal generation eliminates hallucinated macros and guarantees medical boundary compliance without API token costs or latency.
7. **Vector Editorial PDF Generation** ([ADR-07](docs/architecture-decisions.md#adr-07-vector-based-editorial-pdf-exporting)): High-resolution vector text (~50 KB) with dynamic page-budgeting calculations, preventing orphan section headers and broken tables.
8. **Decoupled Local Billing Prototype** ([ADR-08](docs/architecture-decisions.md#adr-08-architectural-decoupling-of-local-billing-simulation)): Commercial plans and subscription management run in scoped `localStorage` for demonstration purposes, explicitly disclaimed in the UI and completely independent of Firestore backend authorization.
9. **Safe Demo Email Interception** ([ADR-09](docs/architecture-decisions.md#adr-09-safe-interception-of-demo-emails-and-multi-layer-abuse-controls)): Intercepts demo domains (`@demo.stormnutrition.com`, `@example.com`, `@test.com`), preventing accidental external dispatches while keeping anti-spam rate limiting fully testable.
10. **Defensive Schema Hydration** ([ADR-10](docs/architecture-decisions.md#adr-10-v1v2-backward-compatibility-and-defensive-schema-hydration)): Adapts legacy V1 unversioned diet plans seamlessly into V2 structured options without data loss or crashes.

---

## 🧮 Domain Logic & Clinical Constraints Engine

### Metabolic Equations (BMR & TDEE)
The platform implements clinical basal energy formulas in `src/services/metabolicCalculations.ts`:

*   **Mifflin-St Jeor:**
    *   $\text{BMR}_{\text{male}} = (10 \times \text{weight}_{\text{kg}}) + (6.25 \times \text{height}_{\text{cm}}) - (5 \times \text{age}_{\text{yr}}) + 5$
    *   $\text{BMR}_{\text{female}} = (10 \times \text{weight}_{\text{kg}}) + (6.25 \times \text{height}_{\text{cm}}) - (5 \times \text{age}_{\text{yr}}) - 161$
*   **Harris-Benedict (Revised):**
    *   $\text{BMR}_{\text{male}} = 88.362 + (13.397 \times \text{weight}_{\text{kg}}) + (4.799 \times \text{height}_{\text{cm}}) - (5.677 \times \text{age}_{\text{yr}})$
    *   $\text{BMR}_{\text{female}} = 447.593 + (9.247 \times \text{weight}_{\text{kg}}) + (3.098 \times \text{height}_{\text{cm}}) - (4.330 \times \text{age}_{\text{yr}})$

Total Daily Energy Expenditure (TDEE) adjusts BMR by physical activity factors ($1.2$ for sedentary up to $1.9$ for extremely active).

### Nutritional Database & Constraint Rules
*   **Composition Data:** Built-in bilingual database containing **588+ validated food items** based on the Brazilian Food Composition Table (**TACO / UNICAMP - 4th Edition**) and national culinary items.
*   **Dietary Restrictions:** Automated query-level filtering for Gluten-free, Lactose-free, Vegetarian, Vegan, and Low FODMAP profiles.
*   **NOVA 4 Ultraprocessed Filtering:** Identifies and excludes ultra-processed food items, prioritizing in natura and minimally processed whole foods.
*   **Semaphoric Clinical Safety Badges:** Evaluates meals against clinical reference values, displaying semaphoric alerts for sodium ceilings ($< 2000\text{ mg/day}$) and high glycemic loads.

---

## 🧪 Testing & Quality Evidence (Local review: 19/09/2026)

Automated suites exercise the workflows below; Firebase integration tests run against isolated local emulators. Results, coverage limits, intermediate failures and the validated source manifest are recorded in [the local validation report](docs/validacao-2026-09-19/README.md). They do not certify every UI state or the deployed demo:

| Suite | Runner / Tool | Evidence | Scope & Focus |
| :--- | :--- | :--- | :--- |
| **Unit & Integration** | Vitest + jsdom | [Latest local result](docs/validacao-2026-09-19/README.md) | Metabolic math, deterministic solver, migrations, date logic, i18n parity, error boundaries, storage quotas, transport isolation, abuse controls. |
| **Security Rules** | `@firebase/rules-unit-testing` | [Latest local result](docs/validacao-2026-09-19/README.md) | Firestore authorization matrix: multi-tenant isolation, patient self-service limits, cascade deletion, concurrency guards, and adversarial regressions. |
| **End-to-End & A11y** | Playwright + Chromium | [Latest local result](docs/validacao-2026-09-19/README.md) | Clinical workflows, axe-core WCAG 2.1 AA scans, keyboard tab journeys, 320px mobile reflow, invitation acceptance, PDF exports. |
| **Query Performance** | Vitest + Emulator | [Latest local result](docs/validacao-2026-09-19/README.md) | Query cost budgets: verifies zero unindexed composite queries and single-read aggregation counts. |
| **Static Analysis** | TypeScript (`tsc --noEmit`) | [Latest local result](docs/validacao-2026-09-19/README.md) | Strict mode verification across entire codebase (`~5.8.2`). |
| **Code Style & Lint** | ESLint & Prettier | [Latest local result](docs/validacao-2026-09-19/README.md) | Formatting and lint checks; remaining warnings are listed in the report. |
| **Production Build** | Vite 6 | [Latest local result](docs/validacao-2026-09-19/README.md) | Optimized bundle with separate CSS and split dynamic chunks. |

---

## 🚀 Quick Evaluation & Guided Demo (3–5 Minutes)

To experience the platform immediately with synthetic clinical profiles, start the application and navigate to the [Login Screen](/login). Use the **1-Click Demo Accounts** panel:

| Synthetic Persona | Account Email | Password | Evaluation Purpose |
| :--- | :--- | :--- | :--- |
| **Dra. Clara Mendes** | `dra.clara@demo.stormnutrition.com` | `Password123!` | Primary nutritionist with active patients, clinical evolutions, and generated diet plans. |
| **Dr. Marcos Lima** | `dr.marcos@demo.stormnutrition.com` | `Password123!` | Independent practitioner with a clean workspace to verify zero data leakage between clinics. |
| **Ana Silva** | `ana.silva@demo.stormnutrition.com` | `Password123!` | Linked patient with access to the Patient Portal to view prescribed meals and log adherence. |

*For complete step-by-step guidance, follow the 5-step roadmap in [docs/demo-guide.md](docs/demo-guide.md).*

---

## 🛠️ Local Setup & Reproducible Execution

### Prerequisites
*   **Node.js:** `^22.22.2 || ^24.15.0 || >=26.0.0` (pinned in `.nvmrc`: 22.22.2). The Firebase CLI used by the emulators pulls dependencies that require Node 22+, so Node 20 is not supported.
*   **npm:** `>= 10.0.0` (install with `npm ci`, which respects `package-lock.json`)
*   **Java:** `>= 21` (required by `firebase-tools` 15 to run the local emulators)

### Step-by-Step Instructions

1.  **Clone and Install Dependencies:**
    ```bash
    git clone https://github.com/Hiltonnetoo/stormnutrition.git
    cd stormnutrition
    npm ci
    ```

2.  **Run the app against the emulators (no real credentials):**
    ```bash
    npm run dev:emulated
    ```
    Starts the Auth (9099) and Firestore (8080) emulators for the synthetic `demo-storm` project, seeds the synthetic personas and plans, and serves the app with `vite --mode emulator`. That mode reads only `config/emulator/.env` (committed, synthetic values) and never a personal `.env.local`. Demo accounts use the password `Password123!` (e.g. `dra.clara@demo.stormnutrition.com`, `ana.silva@demo.stormnutrition.com`).

    To use a real Firebase project instead, copy `.env.example` to `.env.local`, fill in the project's values and run `npm run dev`. Startup refuses invalid or unsafe combinations (for example, emulator mode pointing at a non-`demo-` project).

3.  **Run Quality Checks & Test Suites:**
    ```bash
    npm run format:check        # Prettier
    npm run lint                # ESLint
    npm run type-check          # strict TypeScript
    npm run build               # production bundle
    npm run test:coverage       # unit/component tests with coverage
    npm run test:rules          # Firestore rules + persistence integration (emulator)
    npm run test:e2e:emulated   # Playwright journeys, accessibility and design system (emulators)
    npm run test:perf:queries   # query-cost benchmark (emulator)
    npm run screenshots         # regenerate docs/screenshots with synthetic data
    ```
    Latest recorded results (commands, versions, counts and the exact source state) are in [`docs/evidencias-revisao-10.md`](docs/evidencias-revisao-10.md); counts are not repeated here because they change with every test added.

---

## 📄 Licenses & Data Attributions

*   **Application Source Code:** Distributed under the **MIT License**. See [LICENSE](LICENSE) for terms.
*   **Nutritional Composition Data:** Food item nutritional profiles are derived from the **Tabela Brasileira de Composição de Alimentos (TACO)**, 4ª edição revisada e ampliada, desenvolvida pelo Núcleo de Estudos e Pesquisas em Alimentação (NEPA), Universidade Estadual de Campinas (**UNICAMP**), Campinas - SP, Brasil. Used in accordance with academic and public research open data guidelines.
*   **UI Icons:** [Lucide Icons](https://lucide.dev/) (Licensed under ISC License).
*   **Typography:** Google Fonts — *Inter*, *Outfit*, *Silkscreen* (Licensed under SIL Open Font License 1.1).

---

## ⚠️ Disclaimers & Known Limitations

1. **Clinical Decision Support:** Storm Nutrition provides algorithmic calculation tools, reference ranges, and structured guidelines designed to assist healthcare professionals. It does not provide automated medical diagnoses or substitute direct clinical evaluation by a licensed physician or registered dietitian. Calculations are based on TACO/UNICAMP and standard reference formulas (Mifflin-St Jeor, Harris-Benedict).
2. **Billing Simulation Prototype:** The subscription management and payment methods interfaces operate using client-side `localStorage` state (`isanutri:<uid>:billingState:v1`) for portfolio demonstration. It does not process real credit cards and is architecturally isolated from Firestore backend security rules.
3. **Safe Demonstration Emails & Client Rate Limiting:** Dispatches sent to demo domains (`@demo.stormnutrition.com`, `@example.com`, `@test.com`) or executed in emulator/demo environments are intercepted safely in-memory without making external API calls to EmailJS. In-memory client rate limiting (5s cooldown, 5 sends/minute) protects against accidental rapid clicks in the browser UI, but does not substitute an API gateway or backend rate-limiting service.
4. **Hosting & Cloud Deployment:** Production deployment commands (`firebase deploy --only firestore:rules,firestore:indexes,hosting`) require an active authenticated Firebase CLI session with appropriate IAM deployment privileges. Running tests locally against emulators does not deploy code or rules to production Cloud Firestore.

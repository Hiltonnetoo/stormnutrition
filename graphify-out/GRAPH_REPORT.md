# Graph Report - Isanutri V5  (2026-09-17)

## Corpus Check
- 186 files · ~190,379 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 9, .rules 2, .mdc 1)

## Summary
- 1238 nodes · 2821 edges · 92 communities (69 shown, 23 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f260b327`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Sidebar.tsx
- react
- App.tsx
- PatientPortal.tsx
- MealOptionTable.tsx
- PatientAccessModal.tsx
- pdfExporter.ts
- BillingSection.tsx
- DietPlanViewer.tsx
- Patients.tsx
- devDependencies
- Login.tsx
- vitest
- icons.tsx
- compilerOptions
- package.json
- Home.tsx
- AuthContext.tsx
- Dashboard.tsx
- scripts
- patientService.ts
- dependencies
- manifest.json
- PatientDietHistoryModal.tsx
- vite.config.ts
- 4. Etapas detalhadas
- firebaseService.ts
- @testing-library/jest-dom
- ui.tsx
- dietAlgorithmService.ts
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- localStorage.ts
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- dietService.ts
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- AcceptInvitation.tsx
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native AGENTS.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- AGENTS.md
- rules/graphify.md
- .agents/skills/graphify/references/extraction-spec.md
- workflows/graphify.md
- CLAUDE.md
- .claude/CLAUDE.md
- .claude/skills/graphify/references/extraction-spec.md
- .codex/skills/graphify/references/extraction-spec.md
- .copilot/skills/graphify/references/extraction-spec.md
- GEMINI.md
- .gemini/skills/graphify/references/extraction-spec.md
- DietGenerator.tsx
- diet.ts
- dietService.test.ts
- Calendar.tsx
- Matriz de Baseline e Evidências — Storm Nutrition
- Breadcrumbs.tsx
- i18n.ts
- EmailAdmin.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 62 edges
2. `react-i18next` - 47 edges
3. `useAuth()` - 42 edges
4. `Patient` - 42 edges
5. `vitest` - 22 edges
6. `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` - 21 edges
7. `4. Etapas detalhadas` - 21 edges
8. `Button` - 20 edges
9. `getPatients()` - 20 edges
10. `react-router-dom` - 18 edges

## Surprising Connections (you probably didn't know these)
- `1. Frontend Runtime & Strict Compiler Options` --references--> `ExportDietModal()`  [INFERRED]
  README.md → src/components/modals/ExportDietModal.tsx
- `⚙️ CI/CD Pipeline` --references--> `main()`  [INFERRED]
  README.md → scripts/build-foods.mjs
- `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` --references--> `ClinicalTagSelector()`  [INFERRED]
  docs/temp-analisetech-lead.md → src/components/diet-generator/ClinicalTagSelector.tsx
- `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` --references--> `LabExamsModule()`  [INFERRED]
  docs/temp-analisetech-lead.md → src/components/diet-generator/LabExamsModule.tsx
- `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` --references--> `ModeSelector()`  [INFERRED]
  docs/temp-analisetech-lead.md → src/components/diet-generator/ModeSelector.tsx

## Import Cycles
- None detected.

## Communities (92 total, 23 thin omitted)

### Community 0 - "Sidebar.tsx"
Cohesion: 0.15
Nodes (8): LogInIcon(), SearchIcon(), TargetIcon(), deriveNotifications(), GlobalSearch(), NavItemProps, NotificationBell(), NotifItem

### Community 1 - "react"
Cohesion: 0.06
Nodes (62): react, react-i18next, ClinicalTagSelector(), Props, TagOption, tags, DietCalculations, DietFormData (+54 more)

### Community 2 - "App.tsx"
Cohesion: 0.11
Nodes (16): 🟡 Passo 2 — Testes Automatizados ⚠️ (parcial), react-router-dom, AcceptInvitation, Dashboard, DietGenerator, FoodDatabase, Home, MetabolicCalculator (+8 more)

### Community 3 - "PatientPortal.tsx"
Cohesion: 0.09
Nodes (44): Props, RangeFilter, WeightEvolutionChart(), AdherenceCheckIn(), PatientPortal(), r(), SelfEvaluationForm(), translateMealName() (+36 more)

### Community 4 - "MealOptionTable.tsx"
Cohesion: 0.26
Nodes (9): MealOptionTable(), OptionTable(), parseAmounts(), parseFoodNames(), Props, MealOption, MealOptionItem, src_types_index_mealoption (+1 more)

### Community 5 - "PatientAccessModal.tsx"
Cohesion: 0.13
Nodes (18): 🟢 Passo 6 — Robustez do Portal do Paciente (NOVO) ✅ (concluído), @emailjs/browser, PatientAccessModal(), Props, EmailAdmin(), createPatientAccount(), createPatientPortalProfile(), sendPortalPasswordReset() (+10 more)

### Community 6 - "pdfExporter.ts"
Cohesion: 0.12
Nodes (15): html2canvas, jspdf, AMBER, FAINT, HAIR, INK, PAPER, RGB (+7 more)

### Community 7 - "BillingSection.tsx"
Cohesion: 0.21
Nodes (20): CreditCardIcon(), BillingSection(), addMonths(), BillingState, buildDefaultState(), cancelSubscription(), changePlan(), formatBRL() (+12 more)

### Community 8 - "DietPlanViewer.tsx"
Cohesion: 0.15
Nodes (24): i18next, DietPlanViewer(), DietPlanViewerProps, isV2Plan(), translateMealName(), ClipboardListIcon(), MetabolicCalculator(), ActivityLevel (+16 more)

### Community 9 - "Patients.tsx"
Cohesion: 0.10
Nodes (21): 3.2 — i18n da UI: páginas e componentes ainda em PT ✅, 13 — Reduzir responsabilidades das páginas grandes, react-dom, DocumentTextIcon(), EditIcon(), TrashIcon(), ClinicalReviewModal(), PatientDietHistoryModal() (+13 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @firebase/rules-unit-testing, firebase-tools, globals (+17 more)

### Community 11 - "Login.tsx"
Cohesion: 0.19
Nodes (12): Login, AuthLayout(), AuthLayoutProps, CheckCircleIcon(), GoogleIcon(), LogoIcon(), StarIcon(), getFriendlyErrorMessage() (+4 more)

### Community 12 - "vitest"
Cohesion: 0.05
Nodes (39): 1. Frontend Runtime & Strict Compiler Options, 2. Native Tailwind CSS v4 Integration (Performance vs. CDN), 3. Isolated Patient Registration (Preventing Auth Session Hijacking), 4. Deterministic Clinical Constraints Engine vs. LLM Generation, 🏗️ Architecture Diagram, 🏗️ Architecture & Engineering Decisions, Basal Metabolic Rate (BMR) & Daily Expenditure, ⚙️ CI/CD Pipeline (+31 more)

### Community 13 - "icons.tsx"
Cohesion: 0.15
Nodes (12): Reports, BarChart3Icon(), ClockIcon(), EyeIcon(), EyeOffIcon(), HeartIcon(), IconProps, PlusIcon() (+4 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 15 - "package.json"
Cohesion: 0.09
Nodes (24): engines, node, name, private, type, version, eslint, @eslint/js (+16 more)

### Community 17 - "AuthContext.tsx"
Cohesion: 0.11
Nodes (24): ref_react_dom_client, App(), AuthContext, AuthContextType, AuthProvider(), useAuth(), TestConsumer(), root (+16 more)

### Community 18 - "Dashboard.tsx"
Cohesion: 0.15
Nodes (13): ScaleIcon(), TrendingUpIcon(), UtensilsIcon(), ACTIVITY_ICON, ActivityIconKey, ActivityItem, buildMonthlyDietBuckets(), buildRecentActivity() (+5 more)

### Community 19 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, dev, emulators, format, format:check, lint, preview (+8 more)

### Community 20 - "patientService.ts"
Cohesion: 0.09
Nodes (34): 3.1 — Código e comentários em inglês ✅, 3.3 — Camadas de conteúdo (não são strings de UI — exigem abordagem própria) ✅, ✅ Critério de "pronto para avaliação", 🛠️ Detalhamento, 🗺️ Ordem de Execução Sugerida (atualizada), 🟢 Passo 1 — TypeScript Strict ✅ (concluído), 🟢 Passo 3 — Internacionalização ✅ (concluído), 🔵 Passo 4 — Segurança e CI/CD ✅ (concluído — revisar qualidade) (+26 more)

### Community 21 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, @emailjs/browser, firebase, @google/genai, html2canvas, i18next, jspdf, react (+3 more)

### Community 22 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 23 - "PatientDietHistoryModal.tsx"
Cohesion: 0.14
Nodes (19): DietPlanDisplay(), DietPlanDisplayProps, ExportDietModal, translateMealName(), AlertTriangleIcon(), BrainIcon(), CloseIcon(), DownloadIcon() (+11 more)

### Community 24 - "vite.config.ts"
Cohesion: 0.29
Nodes (5): ref_path, @tailwindcss/vite, vite, @vitejs/plugin-react, ref_vitest_config

### Community 25 - "4. Etapas detalhadas"
Cohesion: 0.06
Nodes (34): 01 — Estabelecer baseline e corrigir o controle de status, 02 — Tornar instalação, emuladores e CI reproduzíveis, 03 — Corrigir o contrato de persistência das dietas, 04 — Tratar autenticação como fluxo com estados explícitos, 05 — Isolar rascunhos e configurações por conta, 06 — Fortalecer autorização e validação de dados, 07 — Substituir envio de senha por convite seguro, 08 — Tornar restrições e dados alimentares explícitos (+26 more)

### Community 26 - "firebaseService.ts"
Cohesion: 0.15
Nodes (22): ref_firebase_app, ref_firebase_storage, getFriendlyErrorMessage(), Register(), createNutritionistProfile(), setupPatientPortalAccess(), updatePatientPortalRef(), updateUserProfile() (+14 more)

### Community 28 - "ui.tsx"
Cohesion: 0.15
Nodes (18): ConfirmationModalProps, Badge(), BadgeTone, Button, ButtonProps, ButtonSize, buttonSizes, ButtonVariant (+10 more)

### Community 29 - "dietAlgorithmService.ts"
Cohesion: 0.08
Nodes (53): NutritionLabel(), NutritionLabelProps, brazilianFoods, coreFoods, _seen, extraFoods, FoodDatabase(), createPrng() (+45 more)

### Community 30 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native AGENTS.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 31 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 32 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 33 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 34 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 35 - "localStorage.ts"
Cohesion: 0.27
Nodes (18): NewPatientModal(), SetValue, usePersistentState(), DietGenerator(), Settings(), clearUserSessionData(), getUserStorageKey(), isStorageAvailable() (+10 more)

### Community 36 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 37 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 38 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 39 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 40 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 41 - "dietService.ts"
Cohesion: 0.21
Nodes (16): getAllDiets(), getCountClientSide(), getDietDoc(), getDietPlansForPatient(), getDietsCollection(), getDietsCount(), getDietsThisMonthCount(), getPatientDiets() (+8 more)

### Community 42 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 43 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 44 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 45 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 46 - "AcceptInvitation.tsx"
Cohesion: 0.38
Nodes (10): ref_firebase_auth, AcceptInvitation(), src_services_firebasecore_user, acceptInvitationWithExistingAccount(), acceptInvitationWithNewAccount(), computeInvitationStatus(), CreateInvitationParams, createOrGetPendingInvitation() (+2 more)

### Community 47 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 48 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 49 - "graphify reference: commit hook and native AGENTS.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native AGENTS.md integration, graphify reference: commit hook and native AGENTS.md integration

### Community 50 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 51 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 52 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 53 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 54 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 55 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 56 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 57 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 58 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 59 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 60 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 61 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 62 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 84 - "DietGenerator.tsx"
Cohesion: 0.20
Nodes (7): DietProgressBar(), DietProgressBarProps, Step2Nutrition(), dietaryOptionsMap, defaultMealPlan, modeTone, calcAge()

### Community 85 - "diet.ts"
Cohesion: 0.20
Nodes (11): GenerationResult, CalculatedDietTotals, DecisionEntry, DietPlanFirestoreDto, DietPlanUpdateDto, Meal, PlanValidationIssue, PlanValidationResult (+3 more)

### Community 86 - "dietService.test.ts"
Cohesion: 0.33
Nodes (11): isFiniteNumber(), sanitizeMeal(), sanitizeMealOption(), sanitizeMealOptionItem(), sanitizeMicronutrients(), validateAndSerializeDietPlan(), validateAndSerializeDietUpdate(), assertNoUndefined() (+3 more)

### Community 87 - "Calendar.tsx"
Cohesion: 0.14
Nodes (25): Calendar, ApptModalProps, Calendar(), TYPE_DOT, TYPE_LIGHT, addAppointment(), deleteAppointment(), findAppointmentConflict() (+17 more)

### Community 88 - "Matriz de Baseline e Evidências — Storm Nutrition"
Cohesion: 0.29
Nodes (6): 1. Ambiente e Ferramentas Medidas, 2. Verificação da Nota Histórica do Prettier, 3. Matriz de Achados vs. Evidências no Código, 4. Estado da Integração Contínua (CI), Matriz de Baseline e Evidências — Storm Nutrition, getPatientPortalProfile()

### Community 89 - "Breadcrumbs.tsx"
Cohesion: 0.33
Nodes (5): BreadcrumbsProps, routeNameMap, ChevronRightIcon(), HomeIcon(), LanguageSelector()

### Community 90 - "i18n.ts"
Cohesion: 0.33
Nodes (4): @testing-library/react, resources, src_locales_en_common, src_locales_pt_common

### Community 91 - "EmailAdmin.tsx"
Cohesion: 0.25
Nodes (6): EmailAdmin, PaperAirplaneIcon(), XCircleIcon(), EmailLog, src_types_index_anydietplan, src_types_index_emaillog

## Knowledge Gaps
- **466 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+461 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 604 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Sidebar.tsx`, `App.tsx`, `PatientPortal.tsx`, `MealOptionTable.tsx`, `PatientAccessModal.tsx`, `BillingSection.tsx`, `DietPlanViewer.tsx`, `Patients.tsx`, `Login.tsx`, `icons.tsx`, `package.json`, `Home.tsx`, `AuthContext.tsx`, `Dashboard.tsx`, `PatientDietHistoryModal.tsx`, `firebaseService.ts`, `ui.tsx`, `dietAlgorithmService.ts`, `localStorage.ts`, `AcceptInvitation.tsx`, `DietGenerator.tsx`, `Calendar.tsx`, `Breadcrumbs.tsx`, `i18n.ts`, `EmailAdmin.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `react` to `Sidebar.tsx`, `PatientPortal.tsx`, `MealOptionTable.tsx`, `PatientAccessModal.tsx`, `BillingSection.tsx`, `DietPlanViewer.tsx`, `Patients.tsx`, `Login.tsx`, `icons.tsx`, `package.json`, `Home.tsx`, `Dashboard.tsx`, `PatientDietHistoryModal.tsx`, `firebaseService.ts`, `ui.tsx`, `dietAlgorithmService.ts`, `AcceptInvitation.tsx`, `DietGenerator.tsx`, `Calendar.tsx`, `Breadcrumbs.tsx`, `i18n.ts`, `EmailAdmin.tsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `13 — Reduzir responsabilidades das páginas grandes` connect `Patients.tsx` to `PatientPortal.tsx`, `4. Etapas detalhadas`, `localStorage.ts`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _466 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.056134723336006415 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10952380952380952 - nodes in this community are weakly interconnected._
- **Should `PatientPortal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09480519480519481 - nodes in this community are weakly interconnected._
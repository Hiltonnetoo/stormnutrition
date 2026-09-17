# Graph Report - Isanutri V5  (2026-09-17)

## Corpus Check
- 179 files · ~175,993 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 9, .rules 2, .mdc 1)

## Summary
- 1165 nodes · 2566 edges · 96 communities (70 shown, 26 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 49 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `af1c8826`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- firebaseService.ts
- dietForm.types.ts
- evaluationService.ts
- i18n.ts
- dietService.ts
- NewPatientModal.tsx
- pdfExporter.ts
- billingService.ts
- metabolicCalculations.ts
- Step4Nutritional.tsx
- devDependencies
- react-i18next
- build-foods.mjs
- icons.tsx
- compilerOptions
- package.json
- Home.tsx
- AuthContext.tsx
- Dashboard.tsx
- scripts
- Step6LabExams.tsx
- dependencies
- manifest.json
- PatientDietHistoryModal.tsx
- vite.config.ts
- 4. Etapas detalhadas
- @playwright/test
- @testing-library/jest-dom
- PatientProfile.tsx
- FoodDatabase.tsx
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- PatientAccessModal.tsx
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- Calendar.tsx
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- PatientPortal.tsx
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
- patientService.ts
- DietGenerator.tsx
- Sidebar.tsx
- index.ts
- engines
- dietAlgorithmService.ts
- Matriz de Baseline e Evidências — Storm Nutrition
- App.tsx
- react
- invitationService.ts
- index.tsx
- Reports.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 62 edges
2. `react-i18next` - 47 edges
3. `useAuth()` - 42 edges
4. `Patient` - 39 edges
5. `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` - 21 edges
6. `4. Etapas detalhadas` - 21 edges
7. `Button` - 20 edges
8. `getPatients()` - 20 edges
9. `react-router-dom` - 18 edges
10. `vitest` - 17 edges

## Surprising Connections (you probably didn't know these)
- `1. Frontend Runtime & Strict Compiler Options` --references--> `ExportDietModal()`  [INFERRED]
  README.md → src/components/modals/ExportDietModal.tsx
- `⚙️ CI/CD Pipeline` --references--> `main()`  [INFERRED]
  README.md → scripts/build-foods.mjs
- `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` --references--> `ClinicalTagSelector()`  [INFERRED]
  docs/temp-analisetech-lead.md → src/components/diet-generator/ClinicalTagSelector.tsx
- `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` --references--> `LabExamsModule()`  [INFERRED]
  docs/temp-analisetech-lead.md → src/components/diet-generator/LabExamsModule.tsx
- `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` --references--> `NutritionLabel()`  [INFERRED]
  docs/temp-analisetech-lead.md → src/components/diet-generator/NutritionLabel.tsx

## Import Cycles
- None detected.

## Communities (96 total, 26 thin omitted)

### Community 0 - "firebaseService.ts"
Cohesion: 0.16
Nodes (18): ref_firebase_auth, ref_firebase_firestore, ref_firebase_storage, setupPatientPortalAccess(), updatePatientPortalRef(), updateUserProfile(), firebaseConfig, app (+10 more)

### Community 1 - "dietForm.types.ts"
Cohesion: 0.19
Nodes (14): DietCalculations, DietFormData, MacroSplit, MealSlot, errBorder(), Step1Objectives(), Step1Props, Step2Nutrition() (+6 more)

### Community 2 - "evaluationService.ts"
Cohesion: 0.21
Nodes (15): AdherenceCheckIn(), SelfEvaluationForm(), AssessmentTab(), uploadProfilePicture(), completeSelfEvaluation(), logAdherence(), logPatientWeight(), requestSelfEvaluation() (+7 more)

### Community 3 - "i18n.ts"
Cohesion: 0.20
Nodes (7): 🟡 Passo 2 — Testes Automatizados ⚠️ (parcial), @testing-library/react, Sidebar(), resources, src_locales_en_common, src_locales_pt_common, NOTE: vi.mock is hoisted, so the helpers must live inside the factory.

### Community 4 - "dietService.ts"
Cohesion: 0.07
Nodes (49): @firebase/rules-unit-testing, ref_node_fs, ref_node_path, ref_node_url, vitest, NutritionLabel(), NutritionLabelProps, MealOptionTable() (+41 more)

### Community 5 - "NewPatientModal.tsx"
Cohesion: 0.07
Nodes (45): 3.2 — i18n da UI: páginas e componentes ainda em PT ✅, ModeSelector(), CloseIcon(), ClinicalReviewModal(), initialFormData, NewPatientModal(), NewPatientModalProps, Props (+37 more)

### Community 6 - "pdfExporter.ts"
Cohesion: 0.07
Nodes (30): 3.1 — Código e comentários em inglês ✅, 3.3 — Camadas de conteúdo (não são strings de UI — exigem abordagem própria) ✅, ✅ Critério de "pronto para avaliação", 🛠️ Detalhamento, 🗺️ Ordem de Execução Sugerida (atualizada), 🟢 Passo 1 — TypeScript Strict ✅ (concluído), 🟢 Passo 3 — Internacionalização ✅ (concluído), 🔵 Passo 4 — Segurança e CI/CD ✅ (concluído — revisar qualidade) (+22 more)

### Community 7 - "billingService.ts"
Cohesion: 0.20
Nodes (19): BillingSection(), addMonths(), BillingState, buildDefaultState(), cancelSubscription(), changePlan(), formatBRL(), formatDate() (+11 more)

### Community 8 - "metabolicCalculations.ts"
Cohesion: 0.20
Nodes (18): i18next, MetabolicCalculator(), ActivityLevel, activityMultipliers, calculateBMI(), calculateBMR(), calculateMacrosInGrams(), calculateTargetCalories() (+10 more)

### Community 9 - "Step4Nutritional.tsx"
Cohesion: 0.11
Nodes (22): ClinicalTagSelector(), Props, TagOption, tags, LabExamsModule(), Props, suggestionsByMode, suggestionsByTag (+14 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @firebase/rules-unit-testing, firebase-tools, globals (+17 more)

### Community 11 - "react-i18next"
Cohesion: 0.14
Nodes (23): ref_firebase_app, react-i18next, react-router-dom, Register, AuthLayout(), AuthLayoutProps, CheckCircleIcon(), EyeIcon() (+15 more)

### Community 12 - "build-foods.mjs"
Cohesion: 0.09
Nodes (28): 1. Frontend Runtime & Strict Compiler Options, 2. Native Tailwind CSS v4 Integration (Performance vs. CDN), 3. Isolated Patient Registration (Preventing Auth Session Hijacking), 4. Deterministic Clinical Constraints Engine vs. LLM Generation, 🏗️ Architecture Diagram, 🏗️ Architecture & Engineering Decisions, Basal Metabolic Rate (BMR) & Daily Expenditure, ⚙️ CI/CD Pipeline (+20 more)

### Community 13 - "icons.tsx"
Cohesion: 0.15
Nodes (12): ChevronRightIcon(), ClockIcon(), CreditCardIcon(), EditIcon(), IconProps, PlusIcon(), StarIcon(), TrashIcon() (+4 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 15 - "package.json"
Cohesion: 0.09
Nodes (23): name, private, type, version, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh (+15 more)

### Community 17 - "AuthContext.tsx"
Cohesion: 0.13
Nodes (21): AuthContext, AuthContextType, AuthProvider(), TestConsumer(), createNutritionistProfile(), getNutritionistProfile(), getPatientPortalProfile(), src_services_firebaseservice_onauthstatechanged (+13 more)

### Community 18 - "Dashboard.tsx"
Cohesion: 0.14
Nodes (16): Dashboard, ScaleIcon(), TrendingUpIcon(), UtensilsIcon(), ACTIVITY_ICON, ActivityIconKey, ActivityItem, buildMonthlyDietBuckets() (+8 more)

### Community 19 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, dev, emulators, format, format:check, lint, preview (+8 more)

### Community 20 - "Step6LabExams.tsx"
Cohesion: 0.39
Nodes (6): Step6LabExams(), Step6Props, interpretTest(), labCategories, LabCategory, src_types_index_labtest

### Community 21 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, @emailjs/browser, firebase, @google/genai, html2canvas, i18next, jspdf, react (+3 more)

### Community 22 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 23 - "PatientDietHistoryModal.tsx"
Cohesion: 0.13
Nodes (22): DietPlanDisplay(), DietPlanDisplayProps, ExportDietModal, translateMealName(), DietPlanViewer(), DietPlanViewerProps, isV2Plan(), translateMealName() (+14 more)

### Community 24 - "vite.config.ts"
Cohesion: 0.29
Nodes (5): ref_path, @tailwindcss/vite, vite, @vitejs/plugin-react, ref_vitest_config

### Community 25 - "4. Etapas detalhadas"
Cohesion: 0.06
Nodes (33): 01 — Estabelecer baseline e corrigir o controle de status, 02 — Tornar instalação, emuladores e CI reproduzíveis, 03 — Corrigir o contrato de persistência das dietas, 04 — Tratar autenticação como fluxo com estados explícitos, 05 — Isolar rascunhos e configurações por conta, 06 — Fortalecer autorização e validação de dados, 07 — Substituir envio de senha por convite seguro, 08 — Tornar restrições e dados alimentares explícitos (+25 more)

### Community 28 - "PatientProfile.tsx"
Cohesion: 0.16
Nodes (20): DownloadIcon(), ConfirmationModal(), ConfirmationModalProps, Badge(), BadgeTone, Button, ButtonProps, ButtonSize (+12 more)

### Community 29 - "FoodDatabase.tsx"
Cohesion: 0.16
Nodes (16): FoodDatabase(), foodCategories, getAvailableCarbs(), getFoodCategoryName(), getFoodName(), giLevel(), glLevel(), GLYCEMIC_LABEL (+8 more)

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

### Community 35 - "PatientAccessModal.tsx"
Cohesion: 0.16
Nodes (15): 🟢 Passo 6 — Robustez do Portal do Paciente (NOVO) ✅ (concluído), @emailjs/browser, PatientAccessModal(), EmailAdmin(), createPatientAccount(), createPatientPortalProfile(), sendPortalPasswordReset(), DietEmailParams (+7 more)

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

### Community 41 - "Calendar.tsx"
Cohesion: 0.15
Nodes (19): Calendar, ApptModalProps, Calendar(), TYPE_DOT, TYPE_LIGHT, addAppointment(), deleteAppointment(), getAppointmentDoc() (+11 more)

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

### Community 46 - "PatientPortal.tsx"
Cohesion: 0.23
Nodes (13): 13 — Reduzir responsabilidades das páginas grandes, Props, WeightEvolutionChart(), useAuth(), PatientPortal(), r(), translateMealName(), PatientProfile() (+5 more)

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

### Community 84 - "patientService.ts"
Cohesion: 0.31
Nodes (13): 11 — Definir arquivamento, exclusão e revogação, Patients(), Reports(), deletePatient(), getActivePatientsCount(), getCountClientSide(), getDietsCollection(), getNewPatientsThisMonthCount() (+5 more)

### Community 85 - "DietGenerator.tsx"
Cohesion: 0.20
Nodes (7): DietGenerator, DietProgressBar(), DietProgressBarProps, HeartIcon(), defaultMealPlan, modeTone, calcAge()

### Community 86 - "Sidebar.tsx"
Cohesion: 0.15
Nodes (8): LogInIcon(), SearchIcon(), TargetIcon(), deriveNotifications(), GlobalSearch(), NavItemProps, NotificationBell(), NotifItem

### Community 87 - "index.ts"
Cohesion: 0.27
Nodes (6): coreFoods, _seen, extraFoods, EmailLog, Food, src_types_index_food

### Community 89 - "dietAlgorithmService.ts"
Cohesion: 0.33
Nodes (9): brazilianFoods, dietTemplates, generateAlgorithmicDietPlan(), GenerationParams, getFilteredFoods(), getGeneralObservations(), getRandomFoodFromCategories(), getNovaGroup() (+1 more)

### Community 90 - "Matriz de Baseline e Evidências — Storm Nutrition"
Cohesion: 0.33
Nodes (5): 1. Ambiente e Ferramentas Medidas, 2. Verificação da Nota Histórica do Prettier, 3. Matriz de Achados vs. Evidências no Código, 4. Estado da Integração Contínua (CI), Matriz de Baseline e Evidências — Storm Nutrition

### Community 91 - "App.tsx"
Cohesion: 0.11
Nodes (17): AcceptInvitation, EmailAdmin, FoodDatabase, Home, Login, MetabolicCalculator, PatientPortal, PatientProfile (+9 more)

### Community 92 - "react"
Cohesion: 0.20
Nodes (8): react, Breadcrumbs(), BreadcrumbsProps, routeNameMap, HomeIcon(), BiomarkerData, BiomarkerEvolutionChart(), BiomarkerEvolutionChartProps

### Community 93 - "invitationService.ts"
Cohesion: 0.44
Nodes (9): AcceptInvitation(), src_services_firebasecore_user, acceptInvitationWithExistingAccount(), acceptInvitationWithNewAccount(), computeInvitationStatus(), CreateInvitationParams, createOrGetPendingInvitation(), getInvitationByToken() (+1 more)

### Community 94 - "index.tsx"
Cohesion: 0.40
Nodes (4): ref_react_dom_client, App(), root, rootElement

## Knowledge Gaps
- **446 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+441 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 578 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `dietForm.types.ts`, `i18n.ts`, `dietService.ts`, `NewPatientModal.tsx`, `metabolicCalculations.ts`, `Step4Nutritional.tsx`, `react-i18next`, `icons.tsx`, `package.json`, `Home.tsx`, `AuthContext.tsx`, `Dashboard.tsx`, `Step6LabExams.tsx`, `PatientDietHistoryModal.tsx`, `PatientProfile.tsx`, `FoodDatabase.tsx`, `PatientAccessModal.tsx`, `Calendar.tsx`, `PatientPortal.tsx`, `DietGenerator.tsx`, `Sidebar.tsx`, `App.tsx`, `index.tsx`, `Reports.tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `react-i18next` to `dietForm.types.ts`, `i18n.ts`, `dietService.ts`, `NewPatientModal.tsx`, `metabolicCalculations.ts`, `Step4Nutritional.tsx`, `icons.tsx`, `package.json`, `Home.tsx`, `Dashboard.tsx`, `Step6LabExams.tsx`, `PatientDietHistoryModal.tsx`, `PatientProfile.tsx`, `FoodDatabase.tsx`, `PatientAccessModal.tsx`, `Calendar.tsx`, `PatientPortal.tsx`, `DietGenerator.tsx`, `Sidebar.tsx`, `App.tsx`, `react`, `Reports.tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `4. Etapas detalhadas` connect `4. Etapas detalhadas` to `patientService.ts`, `PatientPortal.tsx`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _446 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dietService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06779661016949153 - nodes in this community are weakly interconnected._
- **Should `NewPatientModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07288135593220339 - nodes in this community are weakly interconnected._
- **Should `pdfExporter.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06854838709677419 - nodes in this community are weakly interconnected._
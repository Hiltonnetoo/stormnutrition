# Graph Report - Isanutri V5  (2026-09-17)

## Corpus Check
- 174 files · ~170,185 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 9, .mdc 1, .example 1)

## Summary
- 1142 nodes · 2455 edges · 95 communities (70 shown, 25 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 49 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a9f32386`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- firebaseService.ts
- DietGenerator.tsx
- PatientPortal.tsx
- vitest
- index.ts
- Patient
- pdfExporter.ts
- BillingSection.tsx
- DietPlanViewer.tsx
- LabExamsModule.tsx
- devDependencies
- Login.tsx
- build-foods.mjs
- icons.tsx
- compilerOptions
- package.json
- Home.tsx
- AuthContext.tsx
- Dashboard.tsx
- scripts
- EmailAdmin.tsx
- dependencies
- manifest.json
- ui.tsx
- vite.config.ts
- 4. Etapas detalhadas
- @playwright/test
- @testing-library/jest-dom
- 3.2 — i18n da UI: páginas e componentes ainda em PT ✅
- DietPlanDisplay.tsx
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- dietPersistence.integration.test.ts
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
- PatientDietHistoryModal.tsx
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
- dietService.ts
- dietForm.types.ts
- Sidebar.tsx
- PatientProfile.tsx
- engines
- ExportDietModal.tsx
- Matriz de Baseline e Evidências — Storm Nutrition
- App.tsx
- react
- DietMode
- Step6Summary.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 61 edges
2. `react-i18next` - 46 edges
3. `useAuth()` - 40 edges
4. `Patient` - 38 edges
5. `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` - 21 edges
6. `4. Etapas detalhadas` - 21 edges
7. `Button` - 19 edges
8. `getPatients()` - 19 edges
9. `react-router-dom` - 17 edges
10. `DietPlan` - 17 edges

## Surprising Connections (you probably didn't know these)
- `1. Frontend Runtime & Strict Compiler Options` --references--> `ExportDietModal()`  [INFERRED]
  README.md → src/components/modals/ExportDietModal.tsx
- `⚙️ CI/CD Pipeline` --references--> `main()`  [INFERRED]
  README.md → scripts/build-foods.mjs
- `🟡 Passo 2 — Testes Automatizados ⚠️ (parcial)` --references--> `Sidebar()`  [INFERRED]
  docs/temp-analisetech-lead.md → src/components/Sidebar.tsx
- `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` --references--> `LabExamsModule()`  [INFERRED]
  docs/temp-analisetech-lead.md → src/components/diet-generator/LabExamsModule.tsx
- `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` --references--> `NutritionLabel()`  [INFERRED]
  docs/temp-analisetech-lead.md → src/components/diet-generator/NutritionLabel.tsx

## Import Cycles
- None detected.

## Communities (95 total, 25 thin omitted)

### Community 0 - "firebaseService.ts"
Cohesion: 0.13
Nodes (22): 🟢 Passo 6 — Robustez do Portal do Paciente (NOVO) ✅ (concluído), ref_firebase_app, ref_firebase_auth, ref_firebase_storage, createPatientAccount(), createPatientPortalProfile(), getNutritionistProfile(), updatePatientPortalRef() (+14 more)

### Community 1 - "DietGenerator.tsx"
Cohesion: 0.17
Nodes (9): DietProgressBar(), DietProgressBarProps, errBorder(), Step1Objectives(), Step1Props, Step2Nutrition(), defaultMealPlan, modeTone (+1 more)

### Community 2 - "PatientPortal.tsx"
Cohesion: 0.15
Nodes (19): Props, WeightEvolutionChart(), AdherenceCheckIn(), PatientPortal(), r(), SelfEvaluationForm(), translateMealName(), PatientProfile() (+11 more)

### Community 3 - "vitest"
Cohesion: 0.23
Nodes (7): @testing-library/react, vitest, Sidebar(), resources, src_locales_en_common, src_locales_pt_common, NOTE: vi.mock is hoisted, so the helpers must live inside the factory.

### Community 4 - "index.ts"
Cohesion: 0.06
Nodes (48): NutritionLabel(), NutritionLabelProps, MealOptionTable(), OptionTable(), parseAmounts(), parseFoodNames(), Props, brazilianFoods (+40 more)

### Community 5 - "Patient"
Cohesion: 0.12
Nodes (16): NewPatientModalProps, Props, Step1Personal(), Step1Props, errBorder(), errMsg(), Step2Contact(), Step2Props (+8 more)

### Community 6 - "pdfExporter.ts"
Cohesion: 0.12
Nodes (16): html2canvas, jspdf, src_types_index_mealoption, AMBER, FAINT, HAIR, INK, PAPER (+8 more)

### Community 7 - "BillingSection.tsx"
Cohesion: 0.21
Nodes (20): CreditCardIcon(), BillingSection(), addMonths(), BillingState, buildDefaultState(), cancelSubscription(), changePlan(), formatBRL() (+12 more)

### Community 8 - "DietPlanViewer.tsx"
Cohesion: 0.13
Nodes (27): i18next, MetabolicCalculator, DietPlanViewer(), DietPlanViewerProps, isV2Plan(), translateMealName(), BarChart3Icon(), ClipboardListIcon() (+19 more)

### Community 9 - "LabExamsModule.tsx"
Cohesion: 0.23
Nodes (11): LabExamsModule(), Props, suggestionsByMode, suggestionsByTag, translateExamName(), Step6LabExams(), interpretTest(), labCategories (+3 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @firebase/rules-unit-testing, firebase-tools, globals (+17 more)

### Community 11 - "Login.tsx"
Cohesion: 0.16
Nodes (15): Login, Register, AuthLayout(), EyeIcon(), EyeOffIcon(), GoogleIcon(), LogoIcon(), getFriendlyErrorMessage() (+7 more)

### Community 12 - "build-foods.mjs"
Cohesion: 0.09
Nodes (28): 1. Frontend Runtime & Strict Compiler Options, 2. Native Tailwind CSS v4 Integration (Performance vs. CDN), 3. Isolated Patient Registration (Preventing Auth Session Hijacking), 4. Deterministic Clinical Constraints Engine vs. LLM Generation, 🏗️ Architecture Diagram, 🏗️ Architecture & Engineering Decisions, Basal Metabolic Rate (BMR) & Daily Expenditure, ⚙️ CI/CD Pipeline (+20 more)

### Community 13 - "icons.tsx"
Cohesion: 0.12
Nodes (17): react-dom, Patients, AlertTriangleIcon(), BrainIcon(), ClockIcon(), HeartIcon(), HomeIcon(), IconProps (+9 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 15 - "package.json"
Cohesion: 0.10
Nodes (22): name, private, type, version, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh (+14 more)

### Community 17 - "AuthContext.tsx"
Cohesion: 0.08
Nodes (44): ref_react_dom_client, App(), DietPlanDisplay(), initialFormData, NewPatientModal(), ProgressBar(), ProgressBarProps, steps (+36 more)

### Community 18 - "Dashboard.tsx"
Cohesion: 0.06
Nodes (48): ✅ Critério de "pronto para avaliação", 🛠️ Detalhamento, 🗺️ Ordem de Execução Sugerida (atualizada), 🟢 Passo 1 — TypeScript Strict ✅ (concluído), 🟡 Passo 2 — Testes Automatizados ⚠️ (parcial), 🔵 Passo 4 — Segurança e CI/CD ✅ (concluído — revisar qualidade), 🟣 Passo 5 — Polimento, Organização e README ✅ (concluído), Plano de Preparação para Avaliação Tech Lead — Storm Nutrition V5 (+40 more)

### Community 19 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, dev, emulators, format, format:check, lint, preview (+8 more)

### Community 20 - "EmailAdmin.tsx"
Cohesion: 0.17
Nodes (10): EmailAdmin, Settings, CheckCircleIcon(), PaperAirplaneIcon(), XCircleIcon(), uploadProfilePicture(), auth, src_services_firebaseservice_updateprofile (+2 more)

### Community 21 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, @emailjs/browser, firebase, @google/genai, html2canvas, i18next, jspdf, react (+3 more)

### Community 22 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 23 - "ui.tsx"
Cohesion: 0.18
Nodes (15): Badge(), BadgeTone, ButtonProps, ButtonSize, buttonSizes, ButtonVariant, buttonVariants, Card() (+7 more)

### Community 24 - "vite.config.ts"
Cohesion: 0.29
Nodes (5): ref_path, @tailwindcss/vite, vite, @vitejs/plugin-react, ref_vitest_config

### Community 25 - "4. Etapas detalhadas"
Cohesion: 0.06
Nodes (34): 01 — Estabelecer baseline e corrigir o controle de status, 02 — Tornar instalação, emuladores e CI reproduzíveis, 03 — Corrigir o contrato de persistência das dietas, 04 — Tratar autenticação como fluxo com estados explícitos, 05 — Isolar rascunhos e configurações por conta, 06 — Fortalecer autorização e validação de dados, 07 — Substituir envio de senha por convite seguro, 08 — Tornar restrições e dados alimentares explícitos (+26 more)

### Community 28 - "3.2 — i18n da UI: páginas e componentes ainda em PT ✅"
Cohesion: 0.15
Nodes (16): 3.1 — Código e comentários em inglês ✅, 3.2 — i18n da UI: páginas e componentes ainda em PT ✅, 3.3 — Camadas de conteúdo (não são strings de UI — exigem abordagem própria) ✅, 🟢 Passo 3 — Internacionalização ✅ (concluído), ClinicalTagSelector(), Props, TagOption, tags (+8 more)

### Community 29 - "DietPlanDisplay.tsx"
Cohesion: 0.24
Nodes (9): DietPlanDisplayProps, ExportDietModal, translateMealName(), ClinicalReviewModal(), ClinicalReviewModalProps, ExportDietModalProps, DietPlan, src_types_index_decisionentry (+1 more)

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

### Community 35 - "dietPersistence.integration.test.ts"
Cohesion: 0.31
Nodes (7): ref_firebase_firestore, @firebase/rules-unit-testing, ref_node_fs, ref_node_path, ref_node_url, __dirname, __dirname

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
Cohesion: 0.14
Nodes (20): Calendar, ChevronRightIcon(), ApptModalProps, Calendar(), TYPE_DOT, TYPE_LIGHT, addAppointment(), deleteAppointment() (+12 more)

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

### Community 46 - "PatientDietHistoryModal.tsx"
Cohesion: 0.22
Nodes (8): CloseIcon(), DownloadIcon(), TrashIcon(), ExportDietModal, PatientDietHistoryModalProps, ConfirmationModal(), ConfirmationModalProps, Button

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

### Community 84 - "dietService.ts"
Cohesion: 0.17
Nodes (25): PatientDietHistoryModal(), deleteDietPlan(), getAllDiets(), getCountClientSide(), getDietDoc(), getDietPlansForPatient(), getDietsCollection(), getDietsCount() (+17 more)

### Community 85 - "dietForm.types.ts"
Cohesion: 0.28
Nodes (9): DietCalculations, DietFormData, MacroSplit, MealSlot, Step2Props, mealCalorieDistribution, Step3MealPlan(), Step3Props (+1 more)

### Community 86 - "Sidebar.tsx"
Cohesion: 0.17
Nodes (7): LogInIcon(), TargetIcon(), deriveNotifications(), GlobalSearch(), NavItemProps, NotificationBell(), NotifItem

### Community 87 - "PatientProfile.tsx"
Cohesion: 0.21
Nodes (10): LoadingState(), BiomarkerData, BiomarkerEvolutionChart(), BiomarkerEvolutionChartProps, AssessmentTab(), modeTone, TabId, requestSelfEvaluation() (+2 more)

### Community 89 - "ExportDietModal.tsx"
Cohesion: 0.43
Nodes (6): DocumentTextIcon(), ExportDietModal(), ExportDietModal, formatFileName(), generateCustomLayoutPdf(), generateScreenshotPdf()

### Community 90 - "Matriz de Baseline e Evidências — Storm Nutrition"
Cohesion: 0.29
Nodes (6): 1. Ambiente e Ferramentas Medidas, 2. Verificação da Nota Histórica do Prettier, 3. Matriz de Achados vs. Evidências no Código, 4. Estado da Integração Contínua (CI), Matriz de Baseline e Evidências — Storm Nutrition, getPatientPortalProfile()

### Community 91 - "App.tsx"
Cohesion: 0.20
Nodes (9): react-router-dom, Dashboard, DietGenerator, FoodDatabase, PatientPortal, PatientProfile, Reports, AppShell() (+1 more)

### Community 92 - "react"
Cohesion: 0.39
Nodes (6): react, react-i18next, AuthLayoutProps, BreadcrumbsProps, routeNameMap, LanguageSelector()

### Community 93 - "DietMode"
Cohesion: 0.32
Nodes (6): ModeOption, modes, Props, GenerationParams, DietType, DietMode

### Community 94 - "Step6Summary.tsx"
Cohesion: 0.33
Nodes (3): EditIcon(), Step6Props, Step6Summary()

## Knowledge Gaps
- **444 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+439 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 576 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `DietGenerator.tsx`, `PatientPortal.tsx`, `vitest`, `index.ts`, `Patient`, `BillingSection.tsx`, `DietPlanViewer.tsx`, `LabExamsModule.tsx`, `Login.tsx`, `icons.tsx`, `package.json`, `Home.tsx`, `AuthContext.tsx`, `Dashboard.tsx`, `EmailAdmin.tsx`, `ui.tsx`, `3.2 — i18n da UI: páginas e componentes ainda em PT ✅`, `DietPlanDisplay.tsx`, `Calendar.tsx`, `PatientDietHistoryModal.tsx`, `dietForm.types.ts`, `Sidebar.tsx`, `PatientProfile.tsx`, `ExportDietModal.tsx`, `App.tsx`, `DietMode`, `Step6Summary.tsx`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `react` to `DietGenerator.tsx`, `PatientPortal.tsx`, `vitest`, `index.ts`, `Patient`, `BillingSection.tsx`, `DietPlanViewer.tsx`, `LabExamsModule.tsx`, `Login.tsx`, `icons.tsx`, `package.json`, `Home.tsx`, `AuthContext.tsx`, `Dashboard.tsx`, `EmailAdmin.tsx`, `3.2 — i18n da UI: páginas e componentes ainda em PT ✅`, `DietPlanDisplay.tsx`, `Calendar.tsx`, `PatientDietHistoryModal.tsx`, `dietForm.types.ts`, `Sidebar.tsx`, `PatientProfile.tsx`, `ExportDietModal.tsx`, `DietMode`, `Step6Summary.tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _444 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `firebaseService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13230769230769232 - nodes in this community are weakly interconnected._
- **Should `PatientPortal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14855072463768115 - nodes in this community are weakly interconnected._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0642243328810493 - nodes in this community are weakly interconnected._
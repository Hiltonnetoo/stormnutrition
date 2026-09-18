# Graph Report - Isanutri V5  (2026-09-17)

## Corpus Check
- 216 files · ~193,039 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 9, .rules 2, .mdc 1)

## Summary
- 1316 nodes · 3138 edges · 96 communities (71 shown, 25 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cff2971e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Sidebar.tsx
- Step4Nutritional.tsx
- App.tsx
- evaluationService.ts
- MealOptionTable.tsx
- PatientAccessModal.tsx
- pdfExporter.ts
- useAuth
- metabolicCalculations.ts
- Patients.tsx
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
- DietPlanDisplay.tsx
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
- types/index.ts
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
- react-i18next
- Matriz de Baseline e Evidências — Storm Nutrition
- authService.ts
- react
- PatientDietHistoryModal.tsx
- dietPersistence.integration.test.ts
- eslint.config.js
- @playwright/test
- engines

## God Nodes (most connected - your core abstractions)
1. `react` - 88 edges
2. `react-i18next` - 69 edges
3. `Patient` - 64 edges
4. `useAuth()` - 46 edges
5. `DietPlan` - 28 edges
6. `Button` - 25 edges
7. `vitest` - 23 edges
8. `react-router-dom` - 21 edges
9. `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` - 21 edges
10. `4. Etapas detalhadas` - 21 edges

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

## Communities (96 total, 25 thin omitted)

### Community 0 - "Sidebar.tsx"
Cohesion: 0.15
Nodes (8): LogInIcon(), PaperAirplaneIcon(), TargetIcon(), deriveNotifications(), GlobalSearch(), NavItemProps, NotificationBell(), NotifItem

### Community 1 - "Step4Nutritional.tsx"
Cohesion: 0.07
Nodes (41): ClinicalTagSelector(), Props, TagOption, tags, DietCalculations, DietFormData, MacroSplit, MealSlot (+33 more)

### Community 2 - "App.tsx"
Cohesion: 0.13
Nodes (13): Calendar, DietGenerator, EmailAdmin, FoodDatabase, Home, PatientProfile, Reports, Settings (+5 more)

### Community 3 - "evaluationService.ts"
Cohesion: 0.05
Nodes (71): PatientPortal, AdherenceCheckIn(), PortalPasswordModal(), PortalWeightModal(), SelfEvaluationForm(), ProfileAssessmentTab(), Props, RangeFilter (+63 more)

### Community 4 - "MealOptionTable.tsx"
Cohesion: 0.20
Nodes (11): NutritionLabel(), NutritionLabelProps, OptionTable(), parseAmounts(), parseFoodNames(), Props, MealOption, Micronutrients (+3 more)

### Community 5 - "PatientAccessModal.tsx"
Cohesion: 0.23
Nodes (9): 🟢 Passo 6 — Robustez do Portal do Paciente (NOVO) ✅ (concluído), PatientAccessModal(), Props, createPatientAccount(), createPatientPortalProfile(), sendPortalPasswordReset(), sendPortalAccessEmail(), revokePatientPortalAccess() (+1 more)

### Community 6 - "pdfExporter.ts"
Cohesion: 0.12
Nodes (18): html2canvas, jspdf, AMBER, FAINT, formatFileName(), generateCustomLayoutPdf(), generateScreenshotPdf(), HAIR (+10 more)

### Community 7 - "useAuth"
Cohesion: 0.06
Nodes (69): 3.1 — Código e comentários em inglês ✅, 3.2 — i18n da UI: páginas e componentes ainda em PT ✅, 3.3 — Camadas de conteúdo (não são strings de UI — exigem abordagem própria) ✅, ✅ Critério de "pronto para avaliação", 🛠️ Detalhamento, 🗺️ Ordem de Execução Sugerida (atualizada), 🟢 Passo 1 — TypeScript Strict ✅ (concluído), 🟡 Passo 2 — Testes Automatizados ⚠️ (parcial) (+61 more)

### Community 8 - "metabolicCalculations.ts"
Cohesion: 0.19
Nodes (19): i18next, MetabolicCalculator, MetabolicCalculator(), ActivityLevel, activityMultipliers, calculateBMI(), calculateBMR(), calculateMacrosInGrams() (+11 more)

### Community 9 - "Patients.tsx"
Cohesion: 0.16
Nodes (9): Patients, PlusIcon(), SearchIcon(), ShieldIcon(), EmptyState(), EmptyStateProps, LoadingState(), Skeleton() (+1 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @firebase/rules-unit-testing, firebase-tools, globals (+17 more)

### Community 11 - "Login.tsx"
Cohesion: 0.13
Nodes (19): Login, Register, AuthLayout(), AuthLayoutProps, CheckCircleIcon(), EyeIcon(), EyeOffIcon(), GoogleIcon() (+11 more)

### Community 12 - "build-foods.mjs"
Cohesion: 0.09
Nodes (28): 1. Frontend Runtime & Strict Compiler Options, 2. Native Tailwind CSS v4 Integration (Performance vs. CDN), 3. Isolated Patient Registration (Preventing Auth Session Hijacking), 4. Deterministic Clinical Constraints Engine vs. LLM Generation, 🏗️ Architecture Diagram, 🏗️ Architecture & Engineering Decisions, Basal Metabolic Rate (BMR) & Daily Expenditure, ⚙️ CI/CD Pipeline (+20 more)

### Community 13 - "icons.tsx"
Cohesion: 0.18
Nodes (14): ActivityIconKey, MonthSummaryCard(), MonthSummaryCardProps, ACTIVITY_ICON, RecentActivityCard(), RecentActivityCardProps, CloseIcon(), DocumentTextIcon() (+6 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 15 - "package.json"
Cohesion: 0.11
Nodes (18): name, private, type, version, eslint, firebase, firebase-tools, @google/genai (+10 more)

### Community 17 - "AuthContext.tsx"
Cohesion: 0.12
Nodes (22): ref_react_dom_client, App(), AuthContext, AuthContextType, AuthProvider(), root, rootElement, createNutritionistProfile() (+14 more)

### Community 18 - "Dashboard.tsx"
Cohesion: 0.10
Nodes (18): Dashboard, src_components_dashboard_index_monthsummarycard, src_components_dashboard_index_onboardingbanner, src_components_dashboard_index_performancesection, src_components_dashboard_index_quickactionssection, src_components_dashboard_index_recentactivitycard, src_components_dashboard_index_statcard, OnboardingBanner() (+10 more)

### Community 19 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, dev, emulators, format, format:check, lint, preview (+8 more)

### Community 20 - "EmailAdmin.tsx"
Cohesion: 0.08
Nodes (46): @emailjs/browser, ActivityItem, buildMonthlyDietBuckets(), buildRecentActivity(), formatRelative(), MonthBucket, XCircleIcon(), PortalDietsSection() (+38 more)

### Community 21 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, @emailjs/browser, firebase, @google/genai, html2canvas, i18next, jspdf, react (+3 more)

### Community 22 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 23 - "DietPlanDisplay.tsx"
Cohesion: 0.22
Nodes (7): DietPlanDisplayProps, translateMealName(), AlertTriangleIcon(), BrainIcon(), ClinicalReviewModal(), ClinicalReviewModalProps, src_types_index_decisionentry

### Community 24 - "vite.config.ts"
Cohesion: 0.29
Nodes (5): ref_path, @tailwindcss/vite, vite, @vitejs/plugin-react, ref_vitest_config

### Community 25 - "4. Etapas detalhadas"
Cohesion: 0.06
Nodes (34): 01 — Estabelecer baseline e corrigir o controle de status, 02 — Tornar instalação, emuladores e CI reproduzíveis, 03 — Corrigir o contrato de persistência das dietas, 04 — Tratar autenticação como fluxo com estados explícitos, 05 — Isolar rascunhos e configurações por conta, 06 — Fortalecer autorização e validação de dados, 07 — Substituir envio de senha por convite seguro, 08 — Tornar restrições e dados alimentares explícitos (+26 more)

### Community 26 - "firebaseService.ts"
Cohesion: 0.14
Nodes (12): setupPatientPortalAccess(), updatePatientPortalRef(), updateUserProfile(), uploadProfilePicture(), src_services_firebasecore_createuserwithemailandpassword, googleProvider, src_services_firebasecore_onauthstatechanged, src_services_firebasecore_signinwithemailandpassword (+4 more)

### Community 28 - "ui.tsx"
Cohesion: 0.10
Nodes (21): BiomarkerData, BiomarkerEvolutionChart(), BiomarkerEvolutionChartProps, ProfileExamsTab(), ProfileExamsTabProps, Badge(), BadgeTone, ButtonProps (+13 more)

### Community 29 - "dietAlgorithmService.ts"
Cohesion: 0.09
Nodes (49): brazilianFoods, coreFoods, _seen, extraFoods, FoodDatabase(), createPrng(), dietTemplates, generateAlgorithmicDietPlan() (+41 more)

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

### Community 35 - "types/index.ts"
Cohesion: 0.12
Nodes (21): DietPlanViewerProps, EditIcon(), Step1Props, errBorder(), errMsg(), Step2Contact(), Step2Props, Step3Props (+13 more)

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
Nodes (14): PatientDietHistoryModal(), deleteDietPlan(), getAllDiets(), getDietDoc(), getDietPlansForPatient(), getDietsCollection(), handleSnapshotError(), saveDietPlan() (+6 more)

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
Cohesion: 0.34
Nodes (11): AcceptInvitation, AcceptInvitation(), src_services_firebasecore_user, acceptInvitationWithExistingAccount(), acceptInvitationWithNewAccount(), computeInvitationStatus(), CreateInvitationParams, createOrGetPendingInvitation() (+3 more)

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
Cohesion: 0.15
Nodes (13): ClinicalContextCard(), ClinicalContextCardProps, modeTone, DietProgressBar(), DietProgressBarProps, DietTemplatesSection(), DietTemplatesSectionProps, QuickCalculator() (+5 more)

### Community 85 - "diet.ts"
Cohesion: 0.18
Nodes (12): GenerationResult, CalculatedDietTotals, DecisionEntry, DietPlanFirestoreDto, DietPlanUpdateDto, Meal, MealOptionItem, PlanValidationIssue (+4 more)

### Community 86 - "dietService.test.ts"
Cohesion: 0.33
Nodes (11): isFiniteNumber(), sanitizeMeal(), sanitizeMealOption(), sanitizeMealOptionItem(), sanitizeMicronutrients(), validateAndSerializeDietPlan(), validateAndSerializeDietUpdate(), assertNoUndefined() (+3 more)

### Community 87 - "react-i18next"
Cohesion: 0.16
Nodes (15): react-i18next, DietSuccessCard(), DietSuccessCardProps, DietComparisonModal(), ProfileAssessmentTabProps, ProfileEvolutionTab(), ProfileEvolutionTabProps, modeTone (+7 more)

### Community 88 - "Matriz de Baseline e Evidências — Storm Nutrition"
Cohesion: 0.29
Nodes (6): 1. Ambiente e Ferramentas Medidas, 2. Verificação da Nota Histórica do Prettier, 3. Matriz de Achados vs. Evidências no Código, 4. Estado da Integração Contínua (CI), Matriz de Baseline e Evidências — Storm Nutrition, getPatientPortalProfile()

### Community 89 - "authService.ts"
Cohesion: 0.19
Nodes (13): ref_firebase_app, ref_firebase_auth, ref_firebase_firestore, @firebase/rules-unit-testing, ref_firebase_storage, auth, fbApp, firebaseConfig (+5 more)

### Community 90 - "react"
Cohesion: 0.16
Nodes (11): react, react-router-dom, @testing-library/react, vitest, MealOptionTable(), resources, src_locales_en_common, src_locales_pt_common (+3 more)

### Community 91 - "PatientDietHistoryModal.tsx"
Cohesion: 0.18
Nodes (14): ExportDietModal, DietPlanViewer(), isV2Plan(), translateMealName(), ClipboardListIcon(), DownloadIcon(), TrashIcon(), ExportDietModalProps (+6 more)

### Community 92 - "dietPersistence.integration.test.ts"
Cohesion: 0.32
Nodes (5): ref_node_fs, ref_node_path, ref_node_url, __dirname, __dirname

### Community 93 - "eslint.config.js"
Cohesion: 0.33
Nodes (5): @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, typescript-eslint

## Knowledge Gaps
- **469 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+464 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 611 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Sidebar.tsx`, `Step4Nutritional.tsx`, `App.tsx`, `evaluationService.ts`, `MealOptionTable.tsx`, `PatientAccessModal.tsx`, `useAuth`, `metabolicCalculations.ts`, `Patients.tsx`, `Login.tsx`, `icons.tsx`, `package.json`, `Home.tsx`, `AuthContext.tsx`, `Dashboard.tsx`, `EmailAdmin.tsx`, `DietPlanDisplay.tsx`, `firebaseService.ts`, `ui.tsx`, `dietAlgorithmService.ts`, `types/index.ts`, `AcceptInvitation.tsx`, `DietGenerator.tsx`, `react-i18next`, `authService.ts`, `PatientDietHistoryModal.tsx`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `react-i18next` to `Sidebar.tsx`, `Step4Nutritional.tsx`, `App.tsx`, `evaluationService.ts`, `MealOptionTable.tsx`, `PatientAccessModal.tsx`, `useAuth`, `metabolicCalculations.ts`, `Patients.tsx`, `Login.tsx`, `icons.tsx`, `package.json`, `Home.tsx`, `Dashboard.tsx`, `EmailAdmin.tsx`, `DietPlanDisplay.tsx`, `firebaseService.ts`, `ui.tsx`, `dietAlgorithmService.ts`, `types/index.ts`, `AcceptInvitation.tsx`, `DietGenerator.tsx`, `authService.ts`, `react`, `PatientDietHistoryModal.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `4. Etapas detalhadas` connect `4. Etapas detalhadas` to `useAuth`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _469 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Step4Nutritional.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06787330316742081 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1323529411764706 - nodes in this community are weakly interconnected._
- **Should `evaluationService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05468164794007491 - nodes in this community are weakly interconnected._
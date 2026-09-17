# Graph Report - Isanutri V5  (2026-09-17)

## Corpus Check
- 167 files · ~162,364 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 9, .mdc 1, .example 1)

## Summary
- 1098 nodes · 2235 edges · 89 communities (64 shown, 25 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 50 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b4131fdb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- firebaseService.ts
- 3.2 — i18n da UI: páginas e componentes ainda em PT ✅
- PatientPortal.tsx
- Dashboard.tsx
- index.ts
- Patient
- pdfExporter.ts
- BillingSection.tsx
- DietPlanViewer.tsx
- react
- devDependencies
- Login.tsx
- build-foods.mjs
- icons.tsx
- compilerOptions
- package.json
- Home.tsx
- AuthContext.tsx
- Sidebar.tsx
- scripts
- App.tsx
- dependencies
- manifest.json
- PatientProfile.tsx
- vite.config.ts
- 4. Etapas detalhadas
- @playwright/test
- @testing-library/jest-dom
- useAuth
- DietGenerator.tsx
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- NewPatientModal.tsx
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- Step6LabExams.tsx
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- Patients.tsx
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
- Settings.tsx
- eslint.config.js
- Step2Contact.tsx
- engines

## God Nodes (most connected - your core abstractions)
1. `react` - 60 edges
2. `react-i18next` - 46 edges
3. `Patient` - 38 edges
4. `useAuth()` - 32 edges
5. `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` - 21 edges
6. `4. Etapas detalhadas` - 21 edges
7. `Button` - 19 edges
8. `getPatients()` - 19 edges
9. `react-router-dom` - 17 edges
10. `compilerOptions` - 17 edges

## Surprising Connections (you probably didn't know these)
- `1. Frontend Runtime & Strict Compiler Options` --references--> `ExportDietModal()`  [INFERRED]
  README.md → src/components/modals/ExportDietModal.tsx
- `11 — Definir arquivamento, exclusão e revogação` --references--> `deletePatient()`  [INFERRED]
  o-que-precisa-ser-feito.md → src/services/patientService.ts
- `⚙️ CI/CD Pipeline` --references--> `main()`  [INFERRED]
  README.md → scripts/build-foods.mjs
- `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` --references--> `NutritionLabel()`  [INFERRED]
  docs/temp-analisetech-lead.md → src/components/diet-generator/NutritionLabel.tsx
- `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` --references--> `ClinicalReviewModal()`  [INFERRED]
  docs/temp-analisetech-lead.md → src/components/modals/ClinicalReviewModal.tsx

## Import Cycles
- None detected.

## Communities (89 total, 25 thin omitted)

### Community 0 - "firebaseService.ts"
Cohesion: 0.14
Nodes (22): ref_firebase_app, ref_firebase_auth, ref_firebase_storage, createPatientAccount(), createPatientPortalProfile(), firebaseSignOut(), getPatientPortalProfile(), updatePatientPortalRef() (+14 more)

### Community 1 - "3.2 — i18n da UI: páginas e componentes ainda em PT ✅"
Cohesion: 0.11
Nodes (25): 3.2 — i18n da UI: páginas e componentes ainda em PT ✅, ClinicalTagSelector(), Props, TagOption, tags, LabExamsModule(), Props, suggestionsByMode (+17 more)

### Community 2 - "PatientPortal.tsx"
Cohesion: 0.14
Nodes (20): 13 — Reduzir responsabilidades das páginas grandes, ref_firebase_firestore, Props, WeightEvolutionChart(), AdherenceCheckIn(), PatientPortal(), r(), SelfEvaluationForm() (+12 more)

### Community 3 - "Dashboard.tsx"
Cohesion: 0.14
Nodes (21): ScaleIcon(), TrendingUpIcon(), GlobalSearch(), ACTIVITY_ICON, ActivityIconKey, ActivityItem, buildMonthlyDietBuckets(), buildRecentActivity() (+13 more)

### Community 4 - "index.ts"
Cohesion: 0.06
Nodes (51): NutritionLabel(), NutritionLabelProps, MealOptionTable(), OptionTable(), parseAmounts(), parseFoodNames(), Props, brazilianFoods (+43 more)

### Community 5 - "Patient"
Cohesion: 0.11
Nodes (14): EditIcon(), NewPatientModalProps, Props, PatientDietHistoryModalProps, Step1Personal(), Step1Props, Step3Professional(), Step3Props (+6 more)

### Community 6 - "pdfExporter.ts"
Cohesion: 0.07
Nodes (31): 3.1 — Código e comentários em inglês ✅, 3.3 — Camadas de conteúdo (não são strings de UI — exigem abordagem própria) ✅, ✅ Critério de "pronto para avaliação", 🛠️ Detalhamento, 🗺️ Ordem de Execução Sugerida (atualizada), 🟢 Passo 1 — TypeScript Strict ✅ (concluído), 🟢 Passo 3 — Internacionalização ✅ (concluído), 🔵 Passo 4 — Segurança e CI/CD ✅ (concluído — revisar qualidade) (+23 more)

### Community 7 - "BillingSection.tsx"
Cohesion: 0.22
Nodes (19): CreditCardIcon(), BillingSection(), addMonths(), BillingState, buildDefaultState(), cancelSubscription(), changePlan(), formatBRL() (+11 more)

### Community 8 - "DietPlanViewer.tsx"
Cohesion: 0.11
Nodes (27): i18next, @testing-library/react, vitest, DietPlanViewer(), isV2Plan(), translateMealName(), resources, src_locales_en_common (+19 more)

### Community 9 - "react"
Cohesion: 0.25
Nodes (8): react, AppShell(), Breadcrumbs(), BreadcrumbsProps, routeNameMap, ChevronRightIcon(), HomeIcon(), LanguageSelector()

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @firebase/rules-unit-testing, firebase-tools, globals (+17 more)

### Community 11 - "Login.tsx"
Cohesion: 0.19
Nodes (15): react-router-dom, Login, AuthLayout(), AuthLayoutProps, CheckCircleIcon(), GoogleIcon(), LogoIcon(), getFriendlyErrorMessage() (+7 more)

### Community 12 - "build-foods.mjs"
Cohesion: 0.07
Nodes (33): 1. Frontend Runtime & Strict Compiler Options, 2. Native Tailwind CSS v4 Integration (Performance vs. CDN), 3. Isolated Patient Registration (Preventing Auth Session Hijacking), 4. Deterministic Clinical Constraints Engine vs. LLM Generation, 🏗️ Architecture Diagram, 🏗️ Architecture & Engineering Decisions, Basal Metabolic Rate (BMR) & Daily Expenditure, ⚙️ CI/CD Pipeline (+25 more)

### Community 13 - "icons.tsx"
Cohesion: 0.16
Nodes (13): ClipboardListIcon(), ClockIcon(), EyeIcon(), EyeOffIcon(), HeartIcon(), IconProps, PlusIcon(), ShieldIcon() (+5 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 15 - "package.json"
Cohesion: 0.10
Nodes (19): name, private, type, version, @emailjs/browser, eslint, firebase, firebase-tools (+11 more)

### Community 17 - "AuthContext.tsx"
Cohesion: 0.18
Nodes (11): ref_react_dom_client, App(), AuthContext, AuthContextType, AuthProvider(), root, rootElement, src_services_firebaseservice_onauthstatechanged (+3 more)

### Community 18 - "Sidebar.tsx"
Cohesion: 0.13
Nodes (10): BarChart3Icon(), LogInIcon(), PaperAirplaneIcon(), SearchIcon(), TargetIcon(), UtensilsIcon(), deriveNotifications(), NavItemProps (+2 more)

### Community 19 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, dev, emulators, format, format:check, lint, preview (+8 more)

### Community 20 - "App.tsx"
Cohesion: 0.15
Nodes (11): Calendar, Dashboard, DietGenerator, EmailAdmin, FoodDatabase, Home, MetabolicCalculator, PatientPortal (+3 more)

### Community 21 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, @emailjs/browser, firebase, @google/genai, html2canvas, i18next, jspdf, react (+3 more)

### Community 22 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 23 - "PatientProfile.tsx"
Cohesion: 0.05
Nodes (61): PatientProfile, DietPlanDisplay(), DietPlanDisplayProps, ExportDietModal, loadTemplates(), translateMealName(), AlertTriangleIcon(), BrainIcon() (+53 more)

### Community 24 - "vite.config.ts"
Cohesion: 0.29
Nodes (5): ref_path, @tailwindcss/vite, vite, @vitejs/plugin-react, ref_vitest_config

### Community 25 - "4. Etapas detalhadas"
Cohesion: 0.06
Nodes (33): 01 — Estabelecer baseline e corrigir o controle de status, 02 — Tornar instalação, emuladores e CI reproduzíveis, 03 — Corrigir o contrato de persistência das dietas, 04 — Tratar autenticação como fluxo com estados explícitos, 05 — Isolar rascunhos e configurações por conta, 06 — Fortalecer autorização e validação de dados, 07 — Substituir envio de senha por convite seguro, 08 — Tornar restrições e dados alimentares explícitos (+25 more)

### Community 28 - "useAuth"
Cohesion: 0.17
Nodes (17): 🟡 Passo 2 — Testes Automatizados ⚠️ (parcial), 🟢 Passo 6 — Robustez do Portal do Paciente (NOVO) ✅ (concluído), PatientAccessModal(), Sidebar(), useAuth(), EmailAdmin(), sendPortalPasswordReset(), setupPatientPortalAccess() (+9 more)

### Community 29 - "DietGenerator.tsx"
Cohesion: 0.15
Nodes (18): react-i18next, DietCalculations, DietFormData, MacroSplit, MealSlot, DietProgressBar(), DietProgressBarProps, errBorder() (+10 more)

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

### Community 35 - "NewPatientModal.tsx"
Cohesion: 0.22
Nodes (12): initialFormData, NewPatientModal(), ProgressBar(), ProgressBarProps, steps, SetValue, usePersistentState(), addPatient() (+4 more)

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

### Community 41 - "Step6LabExams.tsx"
Cohesion: 0.39
Nodes (6): Step6LabExams(), Step6Props, interpretTest(), labCategories, LabCategory, src_types_index_labtest

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

### Community 46 - "Patients.tsx"
Cohesion: 0.12
Nodes (14): 1. Ambiente e Ferramentas Medidas, 2. Verificação da Nota Histórica do Prettier, 3. Matriz de Achados vs. Evidências no Código, 4. Estado da Integração Contínua (CI), Matriz de Baseline e Evidências — Storm Nutrition, DietPlanViewerProps, DocumentTextIcon(), XCircleIcon() (+6 more)

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
Cohesion: 0.28
Nodes (14): PatientDietHistoryModal(), PatientProfile(), deleteDietPlan(), getAllDiets(), getCountClientSide(), getDietDoc(), getDietPlansForPatient(), getDietsCollection() (+6 more)

### Community 85 - "Settings.tsx"
Cohesion: 0.29
Nodes (6): Settings, Card(), PageHeader(), Settings(), uploadProfilePicture(), src_services_firebaseservice_updateprofile

### Community 86 - "eslint.config.js"
Cohesion: 0.33
Nodes (5): @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, typescript-eslint

### Community 87 - "Step2Contact.tsx"
Cohesion: 0.60
Nodes (4): errBorder(), errMsg(), Step2Contact(), Step2Props

## Knowledge Gaps
- **443 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+438 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 572 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `3.2 — i18n da UI: páginas e componentes ainda em PT ✅`, `PatientPortal.tsx`, `Dashboard.tsx`, `index.ts`, `Patient`, `BillingSection.tsx`, `DietPlanViewer.tsx`, `Login.tsx`, `icons.tsx`, `package.json`, `Home.tsx`, `AuthContext.tsx`, `Sidebar.tsx`, `App.tsx`, `PatientProfile.tsx`, `useAuth`, `DietGenerator.tsx`, `NewPatientModal.tsx`, `Step6LabExams.tsx`, `Patients.tsx`, `Settings.tsx`, `Step2Contact.tsx`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `DietGenerator.tsx` to `3.2 — i18n da UI: páginas e componentes ainda em PT ✅`, `PatientPortal.tsx`, `Dashboard.tsx`, `index.ts`, `Patient`, `BillingSection.tsx`, `DietPlanViewer.tsx`, `react`, `Login.tsx`, `package.json`, `Home.tsx`, `Sidebar.tsx`, `PatientProfile.tsx`, `useAuth`, `NewPatientModal.tsx`, `Step6LabExams.tsx`, `Patients.tsx`, `Settings.tsx`, `Step2Contact.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `4. Etapas detalhadas` connect `4. Etapas detalhadas` to `PatientPortal.tsx`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _443 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `firebaseService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14153846153846153 - nodes in this community are weakly interconnected._
- **Should `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` be split into smaller, more focused modules?**
  _Cohesion score 0.10967741935483871 - nodes in this community are weakly interconnected._
- **Should `PatientPortal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13768115942028986 - nodes in this community are weakly interconnected._
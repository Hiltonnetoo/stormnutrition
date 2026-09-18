# Graph Report - Isanutri V5  (2026-09-17)

## Corpus Check
- 184 files · ~185,371 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 9, .rules 2, .mdc 1)

## Summary
- 1225 nodes · 2786 edges · 94 communities (71 shown, 23 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 50 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4ea4c2dd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Sidebar.tsx
- DietGenerator.tsx
- react
- PatientPortal.tsx
- vitest
- useAuth
- pdfExporter.ts
- BillingSection.tsx
- metabolicCalculations.ts
- 🛠️ Detalhamento
- devDependencies
- Login.tsx
- build-foods.mjs
- icons.tsx
- compilerOptions
- package.json
- Home.tsx
- firebaseService.ts
- Dashboard.tsx
- scripts
- dietService.ts
- dependencies
- manifest.json
- DietPlanDisplay.tsx
- vite.config.ts
- 4. Etapas detalhadas
- @playwright/test
- @testing-library/jest-dom
- ui.tsx
- dietAlgorithmService.ts
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- LabExamsModule.tsx
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- appointmentService.ts
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- Step4Nutritional.tsx
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
- diet.ts
- dietService.test.ts
- Breadcrumbs.tsx
- index.ts
- dietPersistence.integration.test.ts
- react-i18next
- react-router-dom
- App.tsx
- Step6LabExams.tsx
- NutritionLabel.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 62 edges
2. `react-i18next` - 47 edges
3. `useAuth()` - 42 edges
4. `Patient` - 42 edges
5. `vitest` - 21 edges
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

## Communities (94 total, 23 thin omitted)

### Community 0 - "Sidebar.tsx"
Cohesion: 0.17
Nodes (7): LogInIcon(), SearchIcon(), TargetIcon(), deriveNotifications(), NavItemProps, NotificationBell(), NotifItem

### Community 1 - "DietGenerator.tsx"
Cohesion: 0.18
Nodes (15): DietCalculations, DietFormData, MacroSplit, MealSlot, errBorder(), Step1Objectives(), Step1Props, Step2Nutrition() (+7 more)

### Community 2 - "react"
Cohesion: 0.20
Nodes (11): react, LoadingState(), BiomarkerData, BiomarkerEvolutionChart(), BiomarkerEvolutionChartProps, Skeleton(), modeTone, PatientProfile() (+3 more)

### Community 3 - "PatientPortal.tsx"
Cohesion: 0.09
Nodes (46): Props, RangeFilter, WeightEvolutionChart(), AdherenceCheckIn(), PatientPortal(), r(), SelfEvaluationForm(), translateMealName() (+38 more)

### Community 4 - "vitest"
Cohesion: 0.23
Nodes (10): vitest, MealOptionTable(), OptionTable(), parseAmounts(), parseFoodNames(), Props, MealOption, MealOptionItem (+2 more)

### Community 5 - "useAuth"
Cohesion: 0.11
Nodes (29): 3.2 — i18n da UI: páginas e componentes ainda em PT ✅, 🟣 Passo 5 — Polimento, Organização e README ✅ (concluído), @emailjs/browser, PaperAirplaneIcon(), ClinicalReviewModal(), ExportDietModal(), PatientAccessModal(), PatientDietHistoryModal() (+21 more)

### Community 6 - "pdfExporter.ts"
Cohesion: 0.12
Nodes (15): html2canvas, jspdf, AMBER, FAINT, HAIR, INK, PAPER, RGB (+7 more)

### Community 7 - "BillingSection.tsx"
Cohesion: 0.13
Nodes (37): CreditCardIcon(), NewPatientModal(), BillingSection(), SetValue, usePersistentState(), DietGenerator(), addMonths(), BillingState (+29 more)

### Community 8 - "metabolicCalculations.ts"
Cohesion: 0.19
Nodes (19): i18next, MetabolicCalculator, MetabolicCalculator(), ActivityLevel, activityMultipliers, calculateBMI(), calculateBMR(), calculateMacrosInGrams() (+11 more)

### Community 9 - "🛠️ Detalhamento"
Cohesion: 0.18
Nodes (10): 3.1 — Código e comentários em inglês ✅, 3.3 — Camadas de conteúdo (não são strings de UI — exigem abordagem própria) ✅, ✅ Critério de "pronto para avaliação", 🛠️ Detalhamento, 🗺️ Ordem de Execução Sugerida (atualizada), 🟢 Passo 1 — TypeScript Strict ✅ (concluído), 🟢 Passo 3 — Internacionalização ✅ (concluído), 🔵 Passo 4 — Segurança e CI/CD ✅ (concluído — revisar qualidade) (+2 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @firebase/rules-unit-testing, firebase-tools, globals (+17 more)

### Community 11 - "Login.tsx"
Cohesion: 0.15
Nodes (16): Login, Register, AuthLayout(), AuthLayoutProps, EyeIcon(), EyeOffIcon(), GoogleIcon(), LogoIcon() (+8 more)

### Community 12 - "build-foods.mjs"
Cohesion: 0.09
Nodes (28): 1. Frontend Runtime & Strict Compiler Options, 2. Native Tailwind CSS v4 Integration (Performance vs. CDN), 3. Isolated Patient Registration (Preventing Auth Session Hijacking), 4. Deterministic Clinical Constraints Engine vs. LLM Generation, 🏗️ Architecture Diagram, 🏗️ Architecture & Engineering Decisions, Basal Metabolic Rate (BMR) & Daily Expenditure, ⚙️ CI/CD Pipeline (+20 more)

### Community 13 - "icons.tsx"
Cohesion: 0.14
Nodes (19): DietPlanViewer(), DietPlanViewerProps, isV2Plan(), translateMealName(), ClipboardListIcon(), ClockIcon(), CloseIcon(), DownloadIcon() (+11 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 15 - "package.json"
Cohesion: 0.09
Nodes (25): engines, node, name, private, type, version, eslint, @eslint/js (+17 more)

### Community 16 - "Home.tsx"
Cohesion: 0.11
Nodes (3): HeartIcon(), ZapIcon(), showcaseFrames

### Community 17 - "firebaseService.ts"
Cohesion: 0.05
Nodes (73): 1. Ambiente e Ferramentas Medidas, 2. Verificação da Nota Histórica do Prettier, 3. Matriz de Achados vs. Evidências no Código, 4. Estado da Integração Contínua (CI), Matriz de Baseline e Evidências — Storm Nutrition, 🟢 Passo 6 — Robustez do Portal do Paciente (NOVO) ✅ (concluído), 11 — Definir arquivamento, exclusão e revogação, ref_firebase_app (+65 more)

### Community 18 - "Dashboard.tsx"
Cohesion: 0.13
Nodes (14): BarChart3Icon(), CheckCircleIcon(), ScaleIcon(), TrendingUpIcon(), UsersIcon(), ACTIVITY_ICON, ActivityIconKey, ActivityItem (+6 more)

### Community 19 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, dev, emulators, format, format:check, lint, preview (+8 more)

### Community 20 - "dietService.ts"
Cohesion: 0.22
Nodes (14): getAllDiets(), getCountClientSide(), getDietDoc(), getDietsCollection(), getDietsCount(), getDietsThisMonthCount(), handleSnapshotError(), saveDietPlan() (+6 more)

### Community 21 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, @emailjs/browser, firebase, @google/genai, html2canvas, i18next, jspdf, react (+3 more)

### Community 22 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 23 - "DietPlanDisplay.tsx"
Cohesion: 0.17
Nodes (14): DietPlanDisplay(), DietPlanDisplayProps, ExportDietModal, translateMealName(), AlertTriangleIcon(), BrainIcon(), DocumentTextIcon(), ClinicalReviewModalProps (+6 more)

### Community 24 - "vite.config.ts"
Cohesion: 0.29
Nodes (5): ref_path, @tailwindcss/vite, vite, @vitejs/plugin-react, ref_vitest_config

### Community 25 - "4. Etapas detalhadas"
Cohesion: 0.06
Nodes (34): 01 — Estabelecer baseline e corrigir o controle de status, 02 — Tornar instalação, emuladores e CI reproduzíveis, 03 — Corrigir o contrato de persistência das dietas, 04 — Tratar autenticação como fluxo com estados explícitos, 05 — Isolar rascunhos e configurações por conta, 06 — Fortalecer autorização e validação de dados, 07 — Substituir envio de senha por convite seguro, 08 — Tornar restrições e dados alimentares explícitos (+26 more)

### Community 28 - "ui.tsx"
Cohesion: 0.11
Nodes (23): ChevronRightIcon(), XCircleIcon(), ConfirmationModalProps, Badge(), BadgeTone, Button, ButtonProps, ButtonSize (+15 more)

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

### Community 35 - "LabExamsModule.tsx"
Cohesion: 0.18
Nodes (12): LabExamsModule(), Props, suggestionsByMode, suggestionsByTag, translateExamName(), ModeOption, modes, ModeSelector() (+4 more)

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

### Community 41 - "appointmentService.ts"
Cohesion: 0.16
Nodes (21): Calendar(), addAppointment(), deleteAppointment(), findAppointmentConflict(), getAppointmentDoc(), getAppointments(), getAppointmentsCollection(), getPatientAppointments() (+13 more)

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

### Community 46 - "Step4Nutritional.tsx"
Cohesion: 0.24
Nodes (10): ClinicalTagSelector(), Props, TagOption, tags, dietaryOptions, dietaryOptionsMap, goalOptions, Step4Props (+2 more)

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

### Community 84 - "diet.ts"
Cohesion: 0.20
Nodes (11): GenerationResult, CalculatedDietTotals, DecisionEntry, DietPlanFirestoreDto, DietPlanUpdateDto, Meal, PlanValidationIssue, PlanValidationResult (+3 more)

### Community 85 - "dietService.test.ts"
Cohesion: 0.33
Nodes (11): isFiniteNumber(), sanitizeMeal(), sanitizeMealOption(), sanitizeMealOptionItem(), sanitizeMicronutrients(), validateAndSerializeDietPlan(), validateAndSerializeDietUpdate(), assertNoUndefined() (+3 more)

### Community 86 - "Breadcrumbs.tsx"
Cohesion: 0.22
Nodes (8): 🟡 Passo 2 — Testes Automatizados ⚠️ (parcial), AppShell(), Breadcrumbs(), BreadcrumbsProps, routeNameMap, HomeIcon(), LanguageSelector(), Sidebar()

### Community 87 - "index.ts"
Cohesion: 0.10
Nodes (22): initialFormData, NewPatientModalProps, Props, PatientDietHistoryModalProps, Step1Personal(), Step1Props, errBorder(), errMsg() (+14 more)

### Community 88 - "dietPersistence.integration.test.ts"
Cohesion: 0.31
Nodes (7): ref_firebase_firestore, @firebase/rules-unit-testing, ref_node_fs, ref_node_path, ref_node_url, __dirname, __dirname

### Community 89 - "react-i18next"
Cohesion: 0.20
Nodes (6): react-i18next, DietProgressBar(), DietProgressBarProps, ProgressBar(), ProgressBarProps, steps

### Community 90 - "react-router-dom"
Cohesion: 0.24
Nodes (6): react-router-dom, @testing-library/react, resources, src_locales_en_common, src_locales_pt_common, NOTE: vi.mock is hoisted, so the helpers must live inside the factory.

### Community 91 - "App.tsx"
Cohesion: 0.11
Nodes (16): ref_react_dom_client, AcceptInvitation, App(), Calendar, Dashboard, DietGenerator, EmailAdmin, FoodDatabase (+8 more)

### Community 92 - "Step6LabExams.tsx"
Cohesion: 0.48
Nodes (5): Step6LabExams(), interpretTest(), labCategories, LabCategory, src_types_index_labtest

### Community 93 - "NutritionLabel.tsx"
Cohesion: 0.50
Nodes (4): NutritionLabel(), NutritionLabelProps, Micronutrients, src_types_index_micronutrients

## Knowledge Gaps
- **459 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+454 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 595 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Sidebar.tsx`, `DietGenerator.tsx`, `PatientPortal.tsx`, `vitest`, `useAuth`, `BillingSection.tsx`, `metabolicCalculations.ts`, `Login.tsx`, `icons.tsx`, `package.json`, `Home.tsx`, `firebaseService.ts`, `Dashboard.tsx`, `DietPlanDisplay.tsx`, `ui.tsx`, `dietAlgorithmService.ts`, `LabExamsModule.tsx`, `Step4Nutritional.tsx`, `Breadcrumbs.tsx`, `index.ts`, `react-i18next`, `react-router-dom`, `App.tsx`, `Step6LabExams.tsx`, `NutritionLabel.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `react-i18next` to `Sidebar.tsx`, `DietGenerator.tsx`, `react`, `PatientPortal.tsx`, `vitest`, `useAuth`, `BillingSection.tsx`, `metabolicCalculations.ts`, `Login.tsx`, `icons.tsx`, `package.json`, `Home.tsx`, `firebaseService.ts`, `Dashboard.tsx`, `DietPlanDisplay.tsx`, `ui.tsx`, `dietAlgorithmService.ts`, `LabExamsModule.tsx`, `Step4Nutritional.tsx`, `Breadcrumbs.tsx`, `index.ts`, `react-router-dom`, `Step6LabExams.tsx`, `NutritionLabel.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `4. Etapas detalhadas` connect `4. Etapas detalhadas` to `firebaseService.ts`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _459 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PatientPortal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09376890502117362 - nodes in this community are weakly interconnected._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.11051693404634581 - nodes in this community are weakly interconnected._
- **Should `pdfExporter.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
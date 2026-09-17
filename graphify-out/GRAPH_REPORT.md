# Graph Report - Isanutri V5  (2026-09-17)

## Corpus Check
- 171 files · ~167,938 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 9, .mdc 1, .example 1)

## Summary
- 1130 nodes · 2355 edges · 90 communities (66 shown, 24 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 50 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f38efb08`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- firebaseService.ts
- DietGenerator.tsx
- PatientPortal.tsx
- MealOptionTable.tsx
- FoodDatabase.tsx
- NewPatientModal.tsx
- pdfExporter.ts
- BillingSection.tsx
- DietPlanViewer.tsx
- index.ts
- devDependencies
- Login.tsx
- build-foods.mjs
- icons.tsx
- compilerOptions
- package.json
- react
- AuthContext.tsx
- Dashboard.tsx
- scripts
- dietAlgorithmService.ts
- dependencies
- manifest.json
- ui.tsx
- vite.config.ts
- 4. Etapas detalhadas
- @playwright/test
- @testing-library/jest-dom
- useAuth
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
- react-i18next
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
- eslint.config.js
- Storm Nutrition — Enterprise Nutritional Management Platform
- engines
- ExportDietModal
- Matriz de Baseline e Evidências — Storm Nutrition

## God Nodes (most connected - your core abstractions)
1. `react` - 61 edges
2. `react-i18next` - 46 edges
3. `Patient` - 38 edges
4. `useAuth()` - 34 edges
5. `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` - 21 edges
6. `4. Etapas detalhadas` - 21 edges
7. `Button` - 19 edges
8. `getPatients()` - 19 edges
9. `react-router-dom` - 17 edges
10. `DietPlan` - 17 edges

## Surprising Connections (you probably didn't know these)
- `⚙️ CI/CD Pipeline` --references--> `main()`  [INFERRED]
  README.md → scripts/build-foods.mjs
- `🟡 Passo 2 — Testes Automatizados ⚠️ (parcial)` --references--> `Sidebar()`  [INFERRED]
  docs/temp-analisetech-lead.md → src/components/Sidebar.tsx
- `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` --references--> `ClinicalTagSelector()`  [INFERRED]
  docs/temp-analisetech-lead.md → src/components/diet-generator/ClinicalTagSelector.tsx
- `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` --references--> `LabExamsModule()`  [INFERRED]
  docs/temp-analisetech-lead.md → src/components/diet-generator/LabExamsModule.tsx
- `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` --references--> `ModeSelector()`  [INFERRED]
  docs/temp-analisetech-lead.md → src/components/diet-generator/ModeSelector.tsx

## Import Cycles
- None detected.

## Communities (90 total, 24 thin omitted)

### Community 0 - "firebaseService.ts"
Cohesion: 0.13
Nodes (25): 🟢 Passo 6 — Robustez do Portal do Paciente (NOVO) ✅ (concluído), ref_firebase_app, ref_firebase_auth, ref_firebase_storage, PatientAccessModal(), createPatientAccount(), createPatientPortalProfile(), sendPortalPasswordReset() (+17 more)

### Community 1 - "DietGenerator.tsx"
Cohesion: 0.07
Nodes (43): DietGenerator, ClinicalTagSelector(), Props, TagOption, tags, DietCalculations, DietFormData, MacroSplit (+35 more)

### Community 2 - "PatientPortal.tsx"
Cohesion: 0.14
Nodes (18): PatientPortal, Props, WeightEvolutionChart(), AdherenceCheckIn(), r(), SelfEvaluationForm(), translateMealName(), AssessmentTab() (+10 more)

### Community 3 - "MealOptionTable.tsx"
Cohesion: 0.17
Nodes (13): MealOptionTable(), OptionTable(), parseAmounts(), parseFoodNames(), Props, DietPlanFirestoreDto, DietPlanUpdateDto, MealOption (+5 more)

### Community 4 - "FoodDatabase.tsx"
Cohesion: 0.14
Nodes (18): FoodDatabase, FoodDatabase(), loadCustomFoods(), foodCategories, getAvailableCarbs(), getFoodCategoryName(), getFoodName(), giLevel() (+10 more)

### Community 5 - "NewPatientModal.tsx"
Cohesion: 0.07
Nodes (36): initialFormData, NewPatientModal(), NewPatientModalProps, Props, PatientDietHistoryModalProps, ProgressBar(), ProgressBarProps, steps (+28 more)

### Community 6 - "pdfExporter.ts"
Cohesion: 0.12
Nodes (15): html2canvas, jspdf, AMBER, FAINT, HAIR, INK, PAPER, RGB (+7 more)

### Community 7 - "BillingSection.tsx"
Cohesion: 0.10
Nodes (31): 3.1 — Código e comentários em inglês ✅, 3.3 — Camadas de conteúdo (não são strings de UI — exigem abordagem própria) ✅, ✅ Critério de "pronto para avaliação", 🛠️ Detalhamento, 🗺️ Ordem de Execução Sugerida (atualizada), 🟢 Passo 1 — TypeScript Strict ✅ (concluído), 🟡 Passo 2 — Testes Automatizados ⚠️ (parcial), 🟢 Passo 3 — Internacionalização ✅ (concluído) (+23 more)

### Community 8 - "DietPlanViewer.tsx"
Cohesion: 0.15
Nodes (24): i18next, MetabolicCalculator, DietPlanViewer(), isV2Plan(), translateMealName(), BarChart3Icon(), PageHeader(), MetabolicCalculator() (+16 more)

### Community 9 - "index.ts"
Cohesion: 0.19
Nodes (10): NutritionLabel(), NutritionLabelProps, coreFoods, _seen, extraFoods, Micronutrients, EmailLog, Food (+2 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @firebase/rules-unit-testing, firebase-tools, globals (+17 more)

### Community 11 - "Login.tsx"
Cohesion: 0.14
Nodes (19): Login, Register, AuthLayout(), AuthLayoutProps, CheckCircleIcon(), EyeIcon(), EyeOffIcon(), GoogleIcon() (+11 more)

### Community 12 - "build-foods.mjs"
Cohesion: 0.21
Nodes (14): ⚙️ CI/CD Pipeline, buildColumnIndex(), CANONICAL_CATEGORIES, CATEGORY_MAP, COLUMN_MAP, FOOD_NAME_TRANSLATIONS, inferNova(), main() (+6 more)

### Community 13 - "icons.tsx"
Cohesion: 0.14
Nodes (15): ClockIcon(), DocumentTextIcon(), HeartIcon(), HomeIcon(), IconProps, PlusIcon(), SearchIcon(), ShieldIcon() (+7 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 15 - "package.json"
Cohesion: 0.10
Nodes (19): name, private, type, version, @emailjs/browser, eslint, firebase, firebase-tools (+11 more)

### Community 16 - "react"
Cohesion: 0.08
Nodes (13): react, react-router-dom, Home, PatientProfile, Patients, Reports, Settings, AppShell() (+5 more)

### Community 17 - "AuthContext.tsx"
Cohesion: 0.12
Nodes (20): ref_react_dom_client, App(), AuthContext, AuthContextType, AuthProvider(), TestConsumer(), root, rootElement (+12 more)

### Community 18 - "Dashboard.tsx"
Cohesion: 0.05
Nodes (54): 11 — Definir arquivamento, exclusão e revogação, @testing-library/react, Dashboard, EmailAdmin, LogInIcon(), PaperAirplaneIcon(), ScaleIcon(), TargetIcon() (+46 more)

### Community 19 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, dev, emulators, format, format:check, lint, preview (+8 more)

### Community 20 - "dietAlgorithmService.ts"
Cohesion: 0.27
Nodes (11): brazilianFoods, dietTemplates, generateAlgorithmicDietPlan(), GenerationResult, getFilteredFoods(), getGeneralObservations(), getRandomFoodFromCategories(), getNovaGroup() (+3 more)

### Community 21 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, @emailjs/browser, firebase, @google/genai, html2canvas, i18next, jspdf, react (+3 more)

### Community 22 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 23 - "ui.tsx"
Cohesion: 0.14
Nodes (19): Badge(), BadgeTone, Button, ButtonProps, ButtonSize, buttonSizes, ButtonVariant, buttonVariants (+11 more)

### Community 24 - "vite.config.ts"
Cohesion: 0.29
Nodes (5): ref_path, @tailwindcss/vite, vite, @vitejs/plugin-react, ref_vitest_config

### Community 25 - "4. Etapas detalhadas"
Cohesion: 0.06
Nodes (33): 01 — Estabelecer baseline e corrigir o controle de status, 02 — Tornar instalação, emuladores e CI reproduzíveis, 03 — Corrigir o contrato de persistência das dietas, 04 — Tratar autenticação como fluxo com estados explícitos, 05 — Isolar rascunhos e configurações por conta, 06 — Fortalecer autorização e validação de dados, 07 — Substituir envio de senha por convite seguro, 08 — Tornar restrições e dados alimentares explícitos (+25 more)

### Community 28 - "useAuth"
Cohesion: 0.35
Nodes (11): 3.2 — i18n da UI: páginas e componentes ainda em PT ✅, 13 — Reduzir responsabilidades das páginas grandes, PatientDietHistoryModal(), useAuth(), DietGenerator(), PatientPortal(), PatientProfile(), Patients() (+3 more)

### Community 29 - "DietPlanDisplay.tsx"
Cohesion: 0.16
Nodes (14): DietPlanDisplay(), DietPlanDisplayProps, ExportDietModal, loadTemplates(), translateMealName(), DietPlanViewerProps, AlertTriangleIcon(), BrainIcon() (+6 more)

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
Cohesion: 0.29
Nodes (8): ref_firebase_firestore, @firebase/rules-unit-testing, ref_node_fs, ref_node_path, ref_node_url, vitest, __dirname, __dirname

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

### Community 46 - "react-i18next"
Cohesion: 0.17
Nodes (16): react-i18next, CloseIcon(), DownloadIcon(), EditIcon(), TrashIcon(), ExportDietModal, ConfirmationModal(), ConfirmationModalProps (+8 more)

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
Cohesion: 0.21
Nodes (20): getAllDiets(), getDietDoc(), getDietPlansForPatient(), getDietsCollection(), handleSnapshotError(), isFiniteNumber(), sanitizeMeal(), sanitizeMealOption() (+12 more)

### Community 85 - "eslint.config.js"
Cohesion: 0.33
Nodes (5): @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, typescript-eslint

### Community 87 - "Storm Nutrition — Enterprise Nutritional Management Platform"
Cohesion: 0.20
Nodes (9): 🏗️ Architecture Diagram, Basal Metabolic Rate (BMR) & Daily Expenditure, Database Size & Structure, 🧮 Domain Logic & Clinical Constraints Engine, Installation, 🛠️ Local Setup & Environment Config, Prerequisites, Storm Nutrition — Enterprise Nutritional Management Platform (+1 more)

### Community 89 - "ExportDietModal"
Cohesion: 0.25
Nodes (9): 1. Frontend Runtime & Strict Compiler Options, 2. Native Tailwind CSS v4 Integration (Performance vs. CDN), 3. Isolated Patient Registration (Preventing Auth Session Hijacking), 4. Deterministic Clinical Constraints Engine vs. LLM Generation, 🏗️ Architecture & Engineering Decisions, ExportDietModal(), formatFileName(), generateCustomLayoutPdf() (+1 more)

### Community 90 - "Matriz de Baseline e Evidências — Storm Nutrition"
Cohesion: 0.29
Nodes (6): 1. Ambiente e Ferramentas Medidas, 2. Verificação da Nota Histórica do Prettier, 3. Matriz de Achados vs. Evidências no Código, 4. Estado da Integração Contínua (CI), Matriz de Baseline e Evidências — Storm Nutrition, getPatientPortalProfile()

## Knowledge Gaps
- **444 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+439 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 576 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `firebaseService.ts`, `DietGenerator.tsx`, `PatientPortal.tsx`, `MealOptionTable.tsx`, `FoodDatabase.tsx`, `NewPatientModal.tsx`, `BillingSection.tsx`, `DietPlanViewer.tsx`, `index.ts`, `Calendar.tsx`, `Login.tsx`, `icons.tsx`, `react-i18next`, `package.json`, `AuthContext.tsx`, `Dashboard.tsx`, `ui.tsx`, `DietPlanDisplay.tsx`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `react-i18next` to `firebaseService.ts`, `DietGenerator.tsx`, `PatientPortal.tsx`, `MealOptionTable.tsx`, `FoodDatabase.tsx`, `NewPatientModal.tsx`, `BillingSection.tsx`, `DietPlanViewer.tsx`, `index.ts`, `Calendar.tsx`, `Login.tsx`, `icons.tsx`, `package.json`, `react`, `Dashboard.tsx`, `ui.tsx`, `DietPlanDisplay.tsx`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _444 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `firebaseService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12903225806451613 - nodes in this community are weakly interconnected._
- **Should `DietGenerator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06533575317604355 - nodes in this community are weakly interconnected._
- **Should `PatientPortal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1383399209486166 - nodes in this community are weakly interconnected._
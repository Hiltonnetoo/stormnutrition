# Graph Report - Isanutri V5  (2026-09-17)

## Corpus Check
- 165 files · ~161,201 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 8, .mdc 1, .example 1)

## Summary
- 1087 nodes · 2223 edges · 84 communities (61 shown, 23 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 50 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b7491a3f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- firebaseService.ts
- Step4Nutritional.tsx
- DietPlanDisplay.tsx
- Dashboard.tsx
- index.ts
- NewPatientModal.tsx
- pdfExporter.ts
- BillingSection.tsx
- DietPlanViewer.tsx
- Calendar.tsx
- devDependencies
- react-i18next
- build-foods.mjs
- icons.tsx
- compilerOptions
- package.json
- Home.tsx
- react
- Sidebar.tsx
- scripts
- Reports.tsx
- dependencies
- manifest.json
- PatientProfile.tsx
- vite.config.ts
- 4. Etapas detalhadas
- @playwright/test
- @testing-library/jest-dom
- PatientAccessModal.tsx
- DietGenerator.tsx
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- usePersistentState.ts
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
- Matriz de Baseline e Evidências — Storm Nutrition
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
- `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` --references--> `ClinicalTagSelector()`  [INFERRED]
  docs/temp-analisetech-lead.md → src/components/diet-generator/ClinicalTagSelector.tsx
- `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` --references--> `LabExamsModule()`  [INFERRED]
  docs/temp-analisetech-lead.md → src/components/diet-generator/LabExamsModule.tsx

## Import Cycles
- None detected.

## Communities (84 total, 23 thin omitted)

### Community 0 - "firebaseService.ts"
Cohesion: 0.06
Nodes (60): 13 — Reduzir responsabilidades das páginas grandes, ref_firebase_app, ref_firebase_auth, ref_firebase_firestore, ref_firebase_storage, PatientPortal, Props, WeightEvolutionChart() (+52 more)

### Community 1 - "Step4Nutritional.tsx"
Cohesion: 0.09
Nodes (29): ClinicalTagSelector(), Props, TagOption, tags, LabExamsModule(), Props, suggestionsByMode, suggestionsByTag (+21 more)

### Community 2 - "DietPlanDisplay.tsx"
Cohesion: 0.14
Nodes (19): DietPlanDisplay(), DietPlanDisplayProps, ExportDietModal, loadTemplates(), translateMealName(), AlertTriangleIcon(), BrainIcon(), ClipboardListIcon() (+11 more)

### Community 3 - "Dashboard.tsx"
Cohesion: 0.09
Nodes (45): 3.2 — i18n da UI: páginas e componentes ainda em PT ✅, Dashboard, ScaleIcon(), TrendingUpIcon(), NewPatientModal(), PatientDietHistoryModal(), GlobalSearch(), useAuth() (+37 more)

### Community 4 - "index.ts"
Cohesion: 0.08
Nodes (37): vitest, FoodDatabase, brazilianFoods, coreFoods, _seen, extraFoods, FoodDatabase(), loadCustomFoods() (+29 more)

### Community 5 - "NewPatientModal.tsx"
Cohesion: 0.14
Nodes (18): initialFormData, NewPatientModalProps, PatientDietHistoryModalProps, Step1Personal(), Step1Props, errBorder(), errMsg(), Step2Contact() (+10 more)

### Community 6 - "pdfExporter.ts"
Cohesion: 0.07
Nodes (32): html2canvas, jspdf, NutritionLabel(), NutritionLabelProps, MealOptionTable(), OptionTable(), parseAmounts(), parseFoodNames() (+24 more)

### Community 7 - "BillingSection.tsx"
Cohesion: 0.12
Nodes (26): 🟡 Passo 2 — Testes Automatizados ⚠️ (parcial), @testing-library/react, CreditCardIcon(), BillingSection(), Sidebar(), resources, src_locales_en_common, src_locales_pt_common (+18 more)

### Community 8 - "DietPlanViewer.tsx"
Cohesion: 0.16
Nodes (21): i18next, DietPlanViewer(), isV2Plan(), translateMealName(), MetabolicCalculator(), ActivityLevel, activityMultipliers, calculateBMI() (+13 more)

### Community 9 - "Calendar.tsx"
Cohesion: 0.25
Nodes (6): Calendar, ChevronRightIcon(), TYPE_DOT, TYPE_LIGHT, src_types_index_appointmenttype, parseLocalDateTime()

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (24): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @firebase/rules-unit-testing, globals, jsdom (+16 more)

### Community 11 - "react-i18next"
Cohesion: 0.10
Nodes (27): react-i18next, react-router-dom, Home, Login, PatientProfile, Register, AppShell(), AuthLayout() (+19 more)

### Community 12 - "build-foods.mjs"
Cohesion: 0.07
Nodes (33): 1. Frontend Runtime & Strict Compiler Options, 2. Native Tailwind CSS v4 Integration (Performance vs. CDN), 3. Isolated Patient Registration (Preventing Auth Session Hijacking), 4. Deterministic Clinical Constraints Engine vs. LLM Generation, 🏗️ Architecture Diagram, 🏗️ Architecture & Engineering Decisions, Basal Metabolic Rate (BMR) & Daily Expenditure, ⚙️ CI/CD Pipeline (+25 more)

### Community 13 - "icons.tsx"
Cohesion: 0.14
Nodes (18): EmailAdmin, Patients, DietPlanViewerProps, ClockIcon(), CloseIcon(), EditIcon(), IconProps, PaperAirplaneIcon() (+10 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 15 - "package.json"
Cohesion: 0.10
Nodes (22): name, private, type, version, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh (+14 more)

### Community 16 - "Home.tsx"
Cohesion: 0.11
Nodes (3): HeartIcon(), ZapIcon(), showcaseFrames

### Community 17 - "react"
Cohesion: 0.15
Nodes (12): react, ref_react_dom_client, App(), BiomarkerData, BiomarkerEvolutionChart(), BiomarkerEvolutionChartProps, AuthContext, AuthProvider() (+4 more)

### Community 18 - "Sidebar.tsx"
Cohesion: 0.17
Nodes (7): LogInIcon(), SearchIcon(), TargetIcon(), deriveNotifications(), NavItemProps, NotificationBell(), NotifItem

### Community 19 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, build, dev, format, lint, preview, test, test:coverage (+4 more)

### Community 20 - "Reports.tsx"
Cohesion: 0.25
Nodes (5): MetabolicCalculator, Reports, BarChart3Icon(), UtensilsIcon(), PageHeader()

### Community 21 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, @emailjs/browser, firebase, @google/genai, html2canvas, i18next, jspdf, react (+3 more)

### Community 22 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 23 - "PatientProfile.tsx"
Cohesion: 0.12
Nodes (23): Settings, XCircleIcon(), ConfirmationModal(), ConfirmationModalProps, LoadingState(), Badge(), BadgeTone, Button (+15 more)

### Community 24 - "vite.config.ts"
Cohesion: 0.29
Nodes (5): ref_path, @tailwindcss/vite, vite, @vitejs/plugin-react, ref_vitest_config

### Community 25 - "4. Etapas detalhadas"
Cohesion: 0.06
Nodes (32): 01 — Estabelecer baseline e corrigir o controle de status, 02 — Tornar instalação, emuladores e CI reproduzíveis, 03 — Corrigir o contrato de persistência das dietas, 04 — Tratar autenticação como fluxo com estados explícitos, 05 — Isolar rascunhos e configurações por conta, 06 — Fortalecer autorização e validação de dados, 07 — Substituir envio de senha por convite seguro, 08 — Tornar restrições e dados alimentares explícitos (+24 more)

### Community 28 - "PatientAccessModal.tsx"
Cohesion: 0.09
Nodes (25): 3.1 — Código e comentários em inglês ✅, 3.3 — Camadas de conteúdo (não são strings de UI — exigem abordagem própria) ✅, ✅ Critério de "pronto para avaliação", 🛠️ Detalhamento, 🗺️ Ordem de Execução Sugerida (atualizada), 🟢 Passo 1 — TypeScript Strict ✅ (concluído), 🟢 Passo 3 — Internacionalização ✅ (concluído), 🔵 Passo 4 — Segurança e CI/CD ✅ (concluído — revisar qualidade) (+17 more)

### Community 29 - "DietGenerator.tsx"
Cohesion: 0.12
Nodes (19): DietGenerator, DietCalculations, DietFormData, MacroSplit, MealSlot, DietProgressBar(), DietProgressBarProps, errBorder() (+11 more)

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

### Community 35 - "usePersistentState.ts"
Cohesion: 0.24
Nodes (8): ProgressBar(), ProgressBarProps, steps, SetValue, usePersistentState(), loadState(), removeState(), saveState()

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

### Community 46 - "Matriz de Baseline e Evidências — Storm Nutrition"
Cohesion: 0.33
Nodes (5): 1. Ambiente e Ferramentas Medidas, 2. Verificação da Nota Histórica do Prettier, 3. Matriz de Achados vs. Evidências no Código, 4. Estado da Integração Contínua (CI), Matriz de Baseline e Evidências — Storm Nutrition

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

## Knowledge Gaps
- **435 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+430 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 564 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `firebaseService.ts`, `Step4Nutritional.tsx`, `DietPlanDisplay.tsx`, `Dashboard.tsx`, `index.ts`, `NewPatientModal.tsx`, `pdfExporter.ts`, `BillingSection.tsx`, `DietPlanViewer.tsx`, `Calendar.tsx`, `react-i18next`, `icons.tsx`, `package.json`, `Home.tsx`, `Sidebar.tsx`, `Reports.tsx`, `PatientProfile.tsx`, `PatientAccessModal.tsx`, `DietGenerator.tsx`, `usePersistentState.ts`, `Step6LabExams.tsx`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `react-i18next` to `firebaseService.ts`, `Step4Nutritional.tsx`, `DietPlanDisplay.tsx`, `Dashboard.tsx`, `index.ts`, `NewPatientModal.tsx`, `pdfExporter.ts`, `BillingSection.tsx`, `DietPlanViewer.tsx`, `Calendar.tsx`, `icons.tsx`, `package.json`, `Home.tsx`, `Sidebar.tsx`, `Reports.tsx`, `PatientProfile.tsx`, `PatientAccessModal.tsx`, `DietGenerator.tsx`, `usePersistentState.ts`, `Step6LabExams.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `4. Etapas detalhadas` connect `4. Etapas detalhadas` to `firebaseService.ts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _435 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `firebaseService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06308610400682012 - nodes in this community are weakly interconnected._
- **Should `Step4Nutritional.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09206349206349207 - nodes in this community are weakly interconnected._
- **Should `DietPlanDisplay.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1383399209486166 - nodes in this community are weakly interconnected._
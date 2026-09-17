# Graph Report - Isanutri V5  (2026-09-17)

## Corpus Check
- 176 files · ~172,099 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 9, .rules 2, .mdc 1)

## Summary
- 1149 nodes · 2490 edges · 88 communities (63 shown, 25 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 49 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f99331b3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- firebaseService.ts
- DietGenerator.tsx
- PatientPortal.tsx
- react-router-dom
- index.ts
- react
- pdfExporter.ts
- BillingSection.tsx
- metabolicCalculations.ts
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
- Step6LabExams.tsx
- dependencies
- manifest.json
- Patients.tsx
- vite.config.ts
- 4. Etapas detalhadas
- @playwright/test
- @testing-library/jest-dom
- Step4Nutritional.tsx
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- vitest
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
- Sidebar.tsx
- engines
- Matriz de Baseline e Evidências — Storm Nutrition
- App.tsx
- Breadcrumbs.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 61 edges
2. `react-i18next` - 46 edges
3. `useAuth()` - 40 edges
4. `Patient` - 39 edges
5. `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` - 21 edges
6. `4. Etapas detalhadas` - 21 edges
7. `getPatients()` - 20 edges
8. `Button` - 19 edges
9. `react-router-dom` - 17 edges
10. `DietPlan` - 17 edges

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

## Communities (88 total, 25 thin omitted)

### Community 0 - "firebaseService.ts"
Cohesion: 0.13
Nodes (23): 🟢 Passo 6 — Robustez do Portal do Paciente (NOVO) ✅ (concluído), ref_firebase_app, ref_firebase_auth, ref_firebase_storage, createPatientAccount(), createPatientPortalProfile(), sendPortalPasswordReset(), setupPatientPortalAccess() (+15 more)

### Community 1 - "DietGenerator.tsx"
Cohesion: 0.13
Nodes (19): react-i18next, DietCalculations, DietFormData, MacroSplit, MealSlot, DietProgressBar(), DietProgressBarProps, errBorder() (+11 more)

### Community 2 - "PatientPortal.tsx"
Cohesion: 0.14
Nodes (24): 13 — Reduzir responsabilidades das páginas grandes, Props, WeightEvolutionChart(), AdherenceCheckIn(), PatientPortal(), r(), SelfEvaluationForm(), translateMealName() (+16 more)

### Community 3 - "react-router-dom"
Cohesion: 0.20
Nodes (8): 🟡 Passo 2 — Testes Automatizados ⚠️ (parcial), react-router-dom, @testing-library/react, Sidebar(), resources, src_locales_en_common, src_locales_pt_common, NOTE: vi.mock is hoisted, so the helpers must live inside the factory.

### Community 4 - "index.ts"
Cohesion: 0.06
Nodes (52): i18next, NutritionLabel(), NutritionLabelProps, MealOptionTable(), OptionTable(), parseAmounts(), parseFoodNames(), Props (+44 more)

### Community 5 - "react"
Cohesion: 0.11
Nodes (23): react, EditIcon(), initialFormData, NewPatientModalProps, Props, ProgressBar(), ProgressBarProps, steps (+15 more)

### Community 6 - "pdfExporter.ts"
Cohesion: 0.07
Nodes (30): 3.1 — Código e comentários em inglês ✅, 3.3 — Camadas de conteúdo (não são strings de UI — exigem abordagem própria) ✅, ✅ Critério de "pronto para avaliação", 🛠️ Detalhamento, 🗺️ Ordem de Execução Sugerida (atualizada), 🟢 Passo 1 — TypeScript Strict ✅ (concluído), 🟢 Passo 3 — Internacionalização ✅ (concluído), 🔵 Passo 4 — Segurança e CI/CD ✅ (concluído — revisar qualidade) (+22 more)

### Community 7 - "BillingSection.tsx"
Cohesion: 0.11
Nodes (40): Settings, XCircleIcon(), NewPatientModal(), BillingSection(), SetValue, usePersistentState(), Settings(), uploadProfilePicture() (+32 more)

### Community 8 - "metabolicCalculations.ts"
Cohesion: 0.21
Nodes (17): MetabolicCalculator(), ActivityLevel, activityMultipliers, calculateBMI(), calculateBMR(), calculateMacrosInGrams(), calculateTargetCalories(), calculateTDEE() (+9 more)

### Community 9 - "LabExamsModule.tsx"
Cohesion: 0.21
Nodes (12): ClinicalTagSelector(), Props, TagOption, tags, LabExamsModule(), Props, suggestionsByMode, suggestionsByTag (+4 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @firebase/rules-unit-testing, firebase-tools, globals (+17 more)

### Community 11 - "Login.tsx"
Cohesion: 0.15
Nodes (17): Login, Register, AuthLayout(), AuthLayoutProps, CheckCircleIcon(), EyeIcon(), EyeOffIcon(), GoogleIcon() (+9 more)

### Community 12 - "build-foods.mjs"
Cohesion: 0.09
Nodes (28): 1. Frontend Runtime & Strict Compiler Options, 2. Native Tailwind CSS v4 Integration (Performance vs. CDN), 3. Isolated Patient Registration (Preventing Auth Session Hijacking), 4. Deterministic Clinical Constraints Engine vs. LLM Generation, 🏗️ Architecture Diagram, 🏗️ Architecture & Engineering Decisions, Basal Metabolic Rate (BMR) & Daily Expenditure, ⚙️ CI/CD Pipeline (+20 more)

### Community 13 - "icons.tsx"
Cohesion: 0.19
Nodes (11): BrainIcon(), ClockIcon(), CreditCardIcon(), HeartIcon(), IconProps, LogInIcon(), PlusIcon(), ShieldIcon() (+3 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 15 - "package.json"
Cohesion: 0.09
Nodes (23): name, private, type, version, @emailjs/browser, eslint, @eslint/js, eslint-plugin-react-hooks (+15 more)

### Community 17 - "AuthContext.tsx"
Cohesion: 0.12
Nodes (21): AuthContext, AuthContextType, AuthProvider(), TestConsumer(), createNutritionistProfile(), getNutritionistProfile(), getPatientPortalProfile(), auth (+13 more)

### Community 18 - "Dashboard.tsx"
Cohesion: 0.07
Nodes (46): 3.2 — i18n da UI: páginas e componentes ainda em PT ✅, 11 — Definir arquivamento, exclusão e revogação, Reports, BarChart3Icon(), ScaleIcon(), TrendingUpIcon(), PatientAccessModal(), PatientDietHistoryModal() (+38 more)

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

### Community 23 - "Patients.tsx"
Cohesion: 0.06
Nodes (53): react-dom, DietPlanDisplay(), DietPlanDisplayProps, ExportDietModal, translateMealName(), DietPlanViewer(), DietPlanViewerProps, isV2Plan() (+45 more)

### Community 24 - "vite.config.ts"
Cohesion: 0.29
Nodes (5): ref_path, @tailwindcss/vite, vite, @vitejs/plugin-react, ref_vitest_config

### Community 25 - "4. Etapas detalhadas"
Cohesion: 0.06
Nodes (33): 01 — Estabelecer baseline e corrigir o controle de status, 02 — Tornar instalação, emuladores e CI reproduzíveis, 03 — Corrigir o contrato de persistência das dietas, 04 — Tratar autenticação como fluxo com estados explícitos, 05 — Isolar rascunhos e configurações por conta, 06 — Fortalecer autorização e validação de dados, 07 — Substituir envio de senha por convite seguro, 08 — Tornar restrições e dados alimentares explícitos (+25 more)

### Community 28 - "Step4Nutritional.tsx"
Cohesion: 0.20
Nodes (11): ModeOption, modes, ModeSelector(), Props, dietaryOptions, dietaryOptionsMap, goalOptions, Step4Nutritional() (+3 more)

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

### Community 35 - "vitest"
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
Cohesion: 0.18
Nodes (24): deleteDietPlan(), getAllDiets(), getCountClientSide(), getDietDoc(), getDietPlansForPatient(), getDietsCollection(), getDietsCount(), getDietsThisMonthCount() (+16 more)

### Community 86 - "Sidebar.tsx"
Cohesion: 0.15
Nodes (8): PaperAirplaneIcon(), SearchIcon(), TargetIcon(), deriveNotifications(), GlobalSearch(), NavItemProps, NotificationBell(), NotifItem

### Community 90 - "Matriz de Baseline e Evidências — Storm Nutrition"
Cohesion: 0.33
Nodes (5): 1. Ambiente e Ferramentas Medidas, 2. Verificação da Nota Histórica do Prettier, 3. Matriz de Achados vs. Evidências no Código, 4. Estado da Integração Contínua (CI), Matriz de Baseline e Evidências — Storm Nutrition

### Community 91 - "App.tsx"
Cohesion: 0.13
Nodes (13): ref_react_dom_client, App(), Dashboard, DietGenerator, EmailAdmin, FoodDatabase, Home, MetabolicCalculator (+5 more)

### Community 92 - "Breadcrumbs.tsx"
Cohesion: 0.24
Nodes (7): AppShell(), Breadcrumbs(), BreadcrumbsProps, routeNameMap, ChevronRightIcon(), HomeIcon(), LanguageSelector()

## Knowledge Gaps
- **445 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+440 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 576 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `DietGenerator.tsx`, `PatientPortal.tsx`, `react-router-dom`, `index.ts`, `BillingSection.tsx`, `metabolicCalculations.ts`, `LabExamsModule.tsx`, `Login.tsx`, `icons.tsx`, `package.json`, `Home.tsx`, `AuthContext.tsx`, `Dashboard.tsx`, `Step6LabExams.tsx`, `Patients.tsx`, `Step4Nutritional.tsx`, `Calendar.tsx`, `Sidebar.tsx`, `App.tsx`, `Breadcrumbs.tsx`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `DietGenerator.tsx` to `PatientPortal.tsx`, `react-router-dom`, `index.ts`, `react`, `BillingSection.tsx`, `metabolicCalculations.ts`, `LabExamsModule.tsx`, `Calendar.tsx`, `Login.tsx`, `Step4Nutritional.tsx`, `package.json`, `Home.tsx`, `Dashboard.tsx`, `Step6LabExams.tsx`, `Sidebar.tsx`, `Patients.tsx`, `Breadcrumbs.tsx`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `4. Etapas detalhadas` connect `4. Etapas detalhadas` to `Dashboard.tsx`, `PatientPortal.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _445 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `firebaseService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1339031339031339 - nodes in this community are weakly interconnected._
- **Should `DietGenerator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1330049261083744 - nodes in this community are weakly interconnected._
- **Should `PatientPortal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14022988505747128 - nodes in this community are weakly interconnected._
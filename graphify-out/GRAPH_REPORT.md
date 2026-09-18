# Graph Report - Isanutri V5  (2026-09-17)

## Corpus Check
- 185 files · ~189,061 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 9, .rules 2, .mdc 1)

## Summary
- 1235 nodes · 2815 edges · 86 communities (63 shown, 23 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e359705b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Sidebar.tsx
- DietGenerator.tsx
- PatientProfile.tsx
- PatientPortal.tsx
- dietService.ts
- emailService.ts
- pdfExporter.ts
- BillingSection.tsx
- metabolicCalculations.ts
- 🛠️ Detalhamento
- devDependencies
- react-i18next
- build-foods.mjs
- icons.tsx
- compilerOptions
- package.json
- Home.tsx
- firebaseService.ts
- Dashboard.tsx
- scripts
- patientService.ts
- dependencies
- manifest.json
- index.ts
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
- Storm Nutrition — Enterprise Nutritional Management Platform
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- ExportDietModal
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
- react
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
- `⚙️ CI/CD Pipeline` --references--> `main()`  [INFERRED]
  README.md → scripts/build-foods.mjs
- `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` --references--> `NutritionLabel()`  [INFERRED]
  docs/temp-analisetech-lead.md → src/components/diet-generator/NutritionLabel.tsx
- `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` --references--> `ExportDietModal()`  [INFERRED]
  docs/temp-analisetech-lead.md → src/components/modals/ExportDietModal.tsx
- `🟣 Passo 5 — Polimento, Organização e README ✅ (concluído)` --references--> `ExportDietModal()`  [INFERRED]
  docs/temp-analisetech-lead.md → src/components/modals/ExportDietModal.tsx
- `1. Frontend Runtime & Strict Compiler Options` --references--> `ExportDietModal()`  [INFERRED]
  README.md → src/components/modals/ExportDietModal.tsx

## Import Cycles
- None detected.

## Communities (86 total, 23 thin omitted)

### Community 0 - "Sidebar.tsx"
Cohesion: 0.18
Nodes (8): LogInIcon(), TargetIcon(), deriveNotifications(), GlobalSearch(), NavItemProps, NotificationBell(), NotifItem, getPatients()

### Community 1 - "DietGenerator.tsx"
Cohesion: 0.06
Nodes (49): 3.2 — i18n da UI: páginas e componentes ainda em PT ✅, ClinicalTagSelector(), Props, TagOption, tags, DietCalculations, DietFormData, MacroSplit (+41 more)

### Community 2 - "PatientProfile.tsx"
Cohesion: 0.14
Nodes (13): react-router-dom, DietGenerator, FoodDatabase, PatientPortal, PatientProfile, AppShell(), Breadcrumbs(), BiomarkerData (+5 more)

### Community 3 - "PatientPortal.tsx"
Cohesion: 0.06
Nodes (68): 13 — Reduzir responsabilidades das páginas grandes, Props, RangeFilter, WeightEvolutionChart(), Calendar(), AdherenceCheckIn(), PatientPortal(), r() (+60 more)

### Community 4 - "dietService.ts"
Cohesion: 0.06
Nodes (52): ref_firebase_firestore, @firebase/rules-unit-testing, ref_node_fs, ref_node_path, ref_node_url, vitest, NutritionLabel(), NutritionLabelProps (+44 more)

### Community 5 - "emailService.ts"
Cohesion: 0.24
Nodes (9): @emailjs/browser, EmailAdmin(), DietEmailParams, isEmailConfigured(), PortalAccessEmailParams, PUBLIC_KEY, sendDietEmail(), SERVICE_ID (+1 more)

### Community 6 - "pdfExporter.ts"
Cohesion: 0.12
Nodes (15): html2canvas, jspdf, AMBER, FAINT, HAIR, INK, PAPER, RGB (+7 more)

### Community 7 - "BillingSection.tsx"
Cohesion: 0.12
Nodes (39): CreditCardIcon(), NewPatientModal(), BillingSection(), SetValue, usePersistentState(), DietGenerator(), Settings(), addMonths() (+31 more)

### Community 8 - "metabolicCalculations.ts"
Cohesion: 0.17
Nodes (20): i18next, MetabolicCalculator, BarChart3Icon(), MetabolicCalculator(), ActivityLevel, activityMultipliers, calculateBMI(), calculateBMR() (+12 more)

### Community 9 - "🛠️ Detalhamento"
Cohesion: 0.15
Nodes (12): 3.1 — Código e comentários em inglês ✅, 3.3 — Camadas de conteúdo (não são strings de UI — exigem abordagem própria) ✅, ✅ Critério de "pronto para avaliação", 🛠️ Detalhamento, 🗺️ Ordem de Execução Sugerida (atualizada), 🟢 Passo 1 — TypeScript Strict ✅ (concluído), 🟡 Passo 2 — Testes Automatizados ⚠️ (parcial), 🟢 Passo 3 — Internacionalização ✅ (concluído) (+4 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @firebase/rules-unit-testing, firebase-tools, globals (+17 more)

### Community 11 - "react-i18next"
Cohesion: 0.14
Nodes (18): react-i18next, Login, Register, AuthLayout(), AuthLayoutProps, EyeIcon(), EyeOffIcon(), GoogleIcon() (+10 more)

### Community 12 - "build-foods.mjs"
Cohesion: 0.21
Nodes (14): ⚙️ CI/CD Pipeline, buildColumnIndex(), CANONICAL_CATEGORIES, CATEGORY_MAP, COLUMN_MAP, FOOD_NAME_TRANSLATIONS, inferNova(), main() (+6 more)

### Community 13 - "icons.tsx"
Cohesion: 0.12
Nodes (17): Patients, BreadcrumbsProps, routeNameMap, ChevronRightIcon(), ClockIcon(), CloseIcon(), DocumentTextIcon(), HomeIcon() (+9 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 15 - "package.json"
Cohesion: 0.09
Nodes (25): engines, node, name, private, type, version, eslint, @eslint/js (+17 more)

### Community 16 - "Home.tsx"
Cohesion: 0.10
Nodes (4): Home, HeartIcon(), ZapIcon(), showcaseFrames

### Community 17 - "firebaseService.ts"
Cohesion: 0.05
Nodes (71): 1. Ambiente e Ferramentas Medidas, 2. Verificação da Nota Histórica do Prettier, 3. Matriz de Achados vs. Evidências no Código, 4. Estado da Integração Contínua (CI), Matriz de Baseline e Evidências — Storm Nutrition, 🟢 Passo 6 — Robustez do Portal do Paciente (NOVO) ✅ (concluído), ref_firebase_app, ref_firebase_auth (+63 more)

### Community 18 - "Dashboard.tsx"
Cohesion: 0.13
Nodes (20): 🟣 Passo 5 — Polimento, Organização e README ✅ (concluído), Dashboard, ScaleIcon(), TrendingUpIcon(), ACTIVITY_ICON, ActivityIconKey, ActivityItem, buildMonthlyDietBuckets() (+12 more)

### Community 19 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, dev, emulators, format, format:check, lint, preview (+8 more)

### Community 20 - "patientService.ts"
Cohesion: 0.18
Nodes (19): Patients(), addPatient(), archivePatient(), CascadeDeletionResult, deletePatient, deletePatientCascade(), DeletionProgress, getActivePatientsCount() (+11 more)

### Community 21 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, @emailjs/browser, firebase, @google/genai, html2canvas, i18next, jspdf, react (+3 more)

### Community 22 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 23 - "index.ts"
Cohesion: 0.14
Nodes (22): DietPlanDisplay(), DietPlanDisplayProps, ExportDietModal, translateMealName(), DietPlanViewer(), DietPlanViewerProps, isV2Plan(), translateMealName() (+14 more)

### Community 24 - "vite.config.ts"
Cohesion: 0.29
Nodes (5): ref_path, @tailwindcss/vite, vite, @vitejs/plugin-react, ref_vitest_config

### Community 25 - "4. Etapas detalhadas"
Cohesion: 0.06
Nodes (34): 01 — Estabelecer baseline e corrigir o controle de status, 02 — Tornar instalação, emuladores e CI reproduzíveis, 03 — Corrigir o contrato de persistência das dietas, 04 — Tratar autenticação como fluxo com estados explícitos, 05 — Isolar rascunhos e configurações por conta, 06 — Fortalecer autorização e validação de dados, 07 — Substituir envio de senha por convite seguro, 08 — Tornar restrições e dados alimentares explícitos (+26 more)

### Community 28 - "ui.tsx"
Cohesion: 0.12
Nodes (21): Calendar, ConfirmationModal(), ConfirmationModalProps, LoadingState(), Badge(), BadgeTone, Button, ButtonProps (+13 more)

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

### Community 35 - "Storm Nutrition — Enterprise Nutritional Management Platform"
Cohesion: 0.20
Nodes (9): 🏗️ Architecture Diagram, Basal Metabolic Rate (BMR) & Daily Expenditure, Database Size & Structure, 🧮 Domain Logic & Clinical Constraints Engine, Installation, 🛠️ Local Setup & Environment Config, Prerequisites, Storm Nutrition — Enterprise Nutritional Management Platform (+1 more)

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

### Community 41 - "ExportDietModal"
Cohesion: 0.25
Nodes (9): 1. Frontend Runtime & Strict Compiler Options, 2. Native Tailwind CSS v4 Integration (Performance vs. CDN), 3. Isolated Patient Registration (Preventing Auth Session Hijacking), 4. Deterministic Clinical Constraints Engine vs. LLM Generation, 🏗️ Architecture & Engineering Decisions, ExportDietModal(), formatFileName(), generateCustomLayoutPdf() (+1 more)

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

### Community 87 - "react"
Cohesion: 0.11
Nodes (24): react, EditIcon(), initialFormData, NewPatientModalProps, PatientDietHistoryModalProps, ProgressBar(), ProgressBarProps, steps (+16 more)

### Community 90 - "i18n.ts"
Cohesion: 0.25
Nodes (5): @testing-library/react, resources, src_locales_en_common, src_locales_pt_common, NOTE: vi.mock is hoisted, so the helpers must live inside the factory.

### Community 91 - "EmailAdmin.tsx"
Cohesion: 0.13
Nodes (12): EmailAdmin, Reports, Settings, CheckCircleIcon(), PaperAirplaneIcon(), UtensilsIcon(), XCircleIcon(), Card() (+4 more)

## Knowledge Gaps
- **464 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+459 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 601 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Sidebar.tsx`, `DietGenerator.tsx`, `PatientProfile.tsx`, `PatientPortal.tsx`, `dietService.ts`, `BillingSection.tsx`, `metabolicCalculations.ts`, `react-i18next`, `icons.tsx`, `package.json`, `Home.tsx`, `firebaseService.ts`, `Dashboard.tsx`, `index.ts`, `i18n.ts`, `EmailAdmin.tsx`, `ui.tsx`, `dietAlgorithmService.ts`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `react-i18next` to `Sidebar.tsx`, `DietGenerator.tsx`, `PatientProfile.tsx`, `PatientPortal.tsx`, `dietService.ts`, `BillingSection.tsx`, `metabolicCalculations.ts`, `icons.tsx`, `package.json`, `Home.tsx`, `firebaseService.ts`, `Dashboard.tsx`, `react`, `index.ts`, `i18n.ts`, `EmailAdmin.tsx`, `ui.tsx`, `dietAlgorithmService.ts`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `13 — Reduzir responsabilidades das páginas grandes` connect `PatientPortal.tsx` to `4. Etapas detalhadas`, `BillingSection.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _464 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DietGenerator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05780885780885781 - nodes in this community are weakly interconnected._
- **Should `PatientProfile.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1437908496732026 - nodes in this community are weakly interconnected._
- **Should `PatientPortal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.060240963855421686 - nodes in this community are weakly interconnected._
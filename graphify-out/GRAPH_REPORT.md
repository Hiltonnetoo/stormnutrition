# Graph Report - Isanutri V5  (2026-09-18)

## Corpus Check
- 256 files · ~223,797 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 9, .rules 2, .mdc 1)

## Summary
- 1584 nodes · 3859 edges · 111 communities (89 shown, 22 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 85 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `eb6adc6d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Sidebar.tsx
- Step4Nutritional.tsx
- DietPlanDisplay.tsx
- pdfExporter.ts
- MealOptionTable.tsx
- ProgressBar.tsx
- i18n.ts
- vitest
- DietPlanViewer.tsx
- Patients.test.tsx
- devDependencies
- App.tsx
- build-foods.mjs
- firebaseService.ts
- compilerOptions
- package.json
- Home.tsx
- measure-bundle.mjs
- icons.tsx
- scripts
- useDashboardData.ts
- dependencies
- manifest.json
- firestoreMeter.ts
- vite.config.ts
- 4. Etapas detalhadas
- AuthContext.tsx
- dietForm.types.ts
- react
- dietAlgorithmService.ts
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- PatientDirectoryContext.tsx
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- locale.ts
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- Guia de Configuração, Diagnóstico, Implantação e Rollback
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
- react-i18next
- Dashboard.tsx
- getPatientDiets
- NewPatientModal.tsx
- dietService.ts
- 🛠️ Detalhamento
- AppShell.tsx
- emailService.ts
- Calendar.tsx
- useAuth
- @playwright/test
- Step6LabExams.tsx
- ui.tsx
- dietPersistence.integration.test.ts
- Desempenho: consultas e carregamento
- queryCost.test.ts
- useDialog.ts
- index.tsx
- types/index.ts
- errors.ts
- PatientAccessModal.tsx
- validatePatient
- Reports.tsx
- ErrorBoundary.tsx
- syntheticScenario.ts
- Matriz de Baseline e Evidências — Storm Nutrition
- SelfEvaluationForm.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 104 edges
2. `react-i18next` - 76 edges
3. `Patient` - 70 edges
4. `useAuth()` - 47 edges
5. `vitest` - 39 edges
6. `DietPlan` - 30 edges
7. `Button` - 25 edges
8. `react-router-dom` - 22 edges
9. `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` - 21 edges
10. `4. Etapas detalhadas` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Gráficos (passo 5)` --references--> `ChartDataTable()`  [INFERRED]
  docs/accessibility.md → src/components/ChartDataTable.tsx
- `Resultados: bundle de produção` --references--> `ExportDietModal()`  [INFERRED]
  docs/performance.md → src/components/modals/ExportDietModal.tsx
- `1. Frontend Runtime & Strict Compiler Options` --references--> `ExportDietModal()`  [INFERRED]
  README.md → src/components/modals/ExportDietModal.tsx
- `Baseline antes das mudanças` --references--> `usePatientProfile()`  [INFERRED]
  docs/accessibility.md → src/hooks/usePatientProfile.ts
- `3.2 Identificadores de Correlação e Privacidade nos Logs` --references--> `safeLogError()`  [INFERRED]
  docs/deployment-and-config.md → src/utils/errors.ts

## Import Cycles
- None detected.

## Communities (111 total, 22 thin omitted)

### Community 0 - "Sidebar.tsx"
Cohesion: 0.17
Nodes (7): LogInIcon(), SearchIcon(), TargetIcon(), deriveNotifications(), NavItemProps, NotificationBell(), NotifItem

### Community 1 - "Step4Nutritional.tsx"
Cohesion: 0.11
Nodes (24): ClinicalTagSelector(), Props, TagOption, tags, LabExamsModule(), Props, suggestionsByMode, suggestionsByTag (+16 more)

### Community 2 - "DietPlanDisplay.tsx"
Cohesion: 0.18
Nodes (12): DietPlanDisplayProps, ExportDietModal, DietPlanViewerProps, ClipboardListIcon(), DownloadIcon(), ClinicalReviewModal(), ClinicalReviewModalProps, ExportDietModalProps (+4 more)

### Community 3 - "pdfExporter.ts"
Cohesion: 0.11
Nodes (22): html2canvas, jspdf, ExportDietModal(), AMBER, AMBER_TEXT, CustomLayoutPdfOptions, FAINT, formatFileName() (+14 more)

### Community 4 - "MealOptionTable.tsx"
Cohesion: 0.17
Nodes (12): MealOptionTable(), OptionTable(), parseAmounts(), parseFoodNames(), Props, MealOption, MealOptionItem, src_types_index_mealoption (+4 more)

### Community 5 - "ProgressBar.tsx"
Cohesion: 0.40
Nodes (3): ProgressBar(), ProgressBarProps, steps

### Community 6 - "i18n.ts"
Cohesion: 0.25
Nodes (6): normalizeLanguage(), resources, syncDocumentLanguage(), src_locales_en_common, src_locales_pt_common, getFlattenedKeys()

### Community 7 - "vitest"
Cohesion: 0.10
Nodes (40): @testing-library/react, vitest, DietPlanDisplay(), NewPatientModal(), patient, BillingSection(), SetValue, usePersistentState() (+32 more)

### Community 8 - "DietPlanViewer.tsx"
Cohesion: 0.16
Nodes (20): DietPlanViewer(), isV2Plan(), MetabolicCalculator(), ActivityLevel, activityMultipliers, calculateBMI(), calculateBMR(), calculateMacrosInGrams() (+12 more)

### Community 9 - "Patients.test.tsx"
Cohesion: 0.19
Nodes (8): Sub, subs, useLatestDiets(), latestDietListeners, roster, subscribeLatestDiet(), AnyDietPlan, src_types_index_anydietplan

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (26): devDependencies, @axe-core/playwright, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @firebase/rules-unit-testing, firebase-tools (+18 more)

### Community 11 - "App.tsx"
Cohesion: 0.12
Nodes (20): Calendar, FoodDatabase, Home, Login, Patients, Register, AuthLayout(), AuthLayoutProps (+12 more)

### Community 12 - "build-foods.mjs"
Cohesion: 0.05
Nodes (43): Acessibilidade e estados de interface, Baseline antes das mudanças, Como verificar, Contraste, mobile e movimento (passo 6), Custo no bundle, Estados de interface (passo 7), Formulários e anúncios (passo 3), Gráficos (passo 5) (+35 more)

### Community 13 - "firebaseService.ts"
Cohesion: 0.14
Nodes (25): Patients(), ToastProps, DietCountSummary, src_services_firebasecore_createuserwithemailandpassword, db, src_services_firebasecore_onauthstatechanged, src_services_firebasecore_signinwithemailandpassword, src_services_firebasecore_signinwithpopup (+17 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 15 - "package.json"
Cohesion: 0.09
Nodes (24): engines, node, name, private, type, version, eslint, @eslint/js (+16 more)

### Community 16 - "Home.tsx"
Cohesion: 0.11
Nodes (3): ZapIcon(), LanguageSelector(), showcaseFrames

### Community 17 - "measure-bundle.mjs"
Cohesion: 0.10
Nodes (24): ref_node_zlib, vite, assets, chunks, closure(), collectChunkGraph, composition, compositionSorted (+16 more)

### Community 18 - "icons.tsx"
Cohesion: 0.12
Nodes (16): ActivityIconKey, ActivityItem, ACTIVITY_ICON, RecentActivityCard(), RecentActivityCardProps, AlertTriangleIcon(), BrainIcon(), ClockIcon() (+8 more)

### Community 19 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, build, dev, emulators, format, format:check, lint, measure:bundle (+10 more)

### Community 20 - "useDashboardData.ts"
Cohesion: 0.29
Nodes (11): i18next, buildMonthlyDietBuckets(), buildRecentActivity(), formatRelative(), RECENT_ACTIVITY_LIMIT, DashboardStats, useDashboardData(), getDietCountSummary() (+3 more)

### Community 21 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, @emailjs/browser, firebase, html2canvas, i18next, jspdf, react, react-dom (+2 more)

### Community 22 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 23 - "firestoreMeter.ts"
Cohesion: 0.16
Nodes (15): canonicalString(), CoreQueryShape, createMeteredFirestore(), describeTarget(), Firestore, fresh(), lastSegment(), measure() (+7 more)

### Community 24 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): ref_path, @tailwindcss/vite, @vitejs/plugin-react, ref_vitest_config

### Community 25 - "4. Etapas detalhadas"
Cohesion: 0.06
Nodes (34): 01 — Estabelecer baseline e corrigir o controle de status, 02 — Tornar instalação, emuladores e CI reproduzíveis, 03 — Corrigir o contrato de persistência das dietas, 04 — Tratar autenticação como fluxo com estados explícitos, 05 — Isolar rascunhos e configurações por conta, 06 — Fortalecer autorização e validação de dados, 07 — Substituir envio de senha por convite seguro, 08 — Tornar restrições e dados alimentares explícitos (+26 more)

### Community 26 - "AuthContext.tsx"
Cohesion: 0.07
Nodes (47): ref_firebase_auth, ref_firebase_storage, AcceptInvitation, AuthContext, AuthContextType, AuthProvider(), TestConsumer(), AcceptInvitation() (+39 more)

### Community 27 - "dietForm.types.ts"
Cohesion: 0.25
Nodes (10): DietCalculations, DietFormData, MacroSplit, MealSlot, errBorder(), Step1Objectives(), Step1Props, Step2Props (+2 more)

### Community 28 - "react"
Cohesion: 0.12
Nodes (19): react, PatientProfile, DocumentTextIcon(), NewPatientModalProps, Step1Props, Step3Props, Step5Props, LoadingState() (+11 more)

### Community 29 - "dietAlgorithmService.ts"
Cohesion: 0.06
Nodes (62): NutritionLabel(), NutritionLabelProps, brazilianFoods, coreFoods, _seen, extraFoods, FoodDatabase(), createPrng() (+54 more)

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

### Community 35 - "PatientDirectoryContext.tsx"
Cohesion: 0.15
Nodes (14): ref_firebase_firestore, GlobalSearch(), DirectoryState, EMPTY, PatientDirectoryProvider(), auth, Consumer(), Listener (+6 more)

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

### Community 41 - "locale.ts"
Cohesion: 0.14
Nodes (18): BiomarkerData, BiomarkerEvolutionChart(), BiomarkerEvolutionChartProps, ProfileAssessmentTab(), ProfileAssessmentTabProps, modeTone, ProfileHeader(), ProfileHeaderProps (+10 more)

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

### Community 46 - "Guia de Configuração, Diagnóstico, Implantação e Rollback"
Cohesion: 0.11
Nodes (18): 1.1 Variáveis de Ambiente Públicas (Client-Side), 1.2 Segredos e Credenciais que NUNCA devem estar no Frontend, 1. Arquitetura de Configuração e Separação de Segredos, 2. Hardening e Compatibilidade com Content Security Policy (CSP), 3.1 Taxonomia de Falhas (`src/utils/errors.ts`), 3.2 Identificadores de Correlação e Privacidade nos Logs, 3.3 Fronteiras de Erro Multi-Nível (`src/components/ErrorBoundary.tsx`), 3. Diagnóstico de Falhas e Tratamento de Erros (+10 more)

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

### Community 84 - "react-i18next"
Cohesion: 0.14
Nodes (16): react-i18next, DietGenerator, ClinicalContextCard(), ClinicalContextCardProps, modeTone, DietProgressBar(), DietProgressBarProps, DietSuccessCard() (+8 more)

### Community 85 - "Dashboard.tsx"
Cohesion: 0.13
Nodes (16): Dashboard, src_components_dashboard_index_monthsummarycard, src_components_dashboard_index_onboardingbanner, src_components_dashboard_index_performancesection, src_components_dashboard_index_quickactionssection, src_components_dashboard_index_recentactivitycard, src_components_dashboard_index_statcard, MonthSummaryCard() (+8 more)

### Community 86 - "getPatientDiets"
Cohesion: 0.36
Nodes (7): usePatientProfile(), UsePatientProfileReturn, byNewestFirst(), getPatientDiets(), handleSnapshotError(), toDietPlan(), getPatientById()

### Community 87 - "NewPatientModal.tsx"
Cohesion: 0.18
Nodes (16): Step2Nutrition(), initialFormData, Step1Personal(), errBorder(), errMsg(), Step2Contact(), Step2Props, Step3Professional() (+8 more)

### Community 88 - "dietService.ts"
Cohesion: 0.21
Nodes (18): getDietDoc(), isFiniteNumber(), sanitizeMeal(), sanitizeMealOption(), sanitizeMealOptionItem(), sanitizeMicronutrients(), saveDietPlan(), updateDietPlan() (+10 more)

### Community 89 - "🛠️ Detalhamento"
Cohesion: 0.18
Nodes (10): 3.1 — Código e comentários em inglês ✅, 3.3 — Camadas de conteúdo (não são strings de UI — exigem abordagem própria) ✅, ✅ Critério de "pronto para avaliação", 🛠️ Detalhamento, 🗺️ Ordem de Execução Sugerida (atualizada), 🟢 Passo 1 — TypeScript Strict ✅ (concluído), 🟢 Passo 3 — Internacionalização ✅ (concluído), 🔵 Passo 4 — Segurança e CI/CD ✅ (concluído — revisar qualidade) (+2 more)

### Community 90 - "AppShell.tsx"
Cohesion: 0.21
Nodes (11): Decisões e trade-offs, 🟡 Passo 2 — Testes Automatizados ⚠️ (parcial), AppShell(), Breadcrumbs(), BreadcrumbsProps, ChevronRightIcon(), HomeIcon(), Sidebar() (+3 more)

### Community 91 - "emailService.ts"
Cohesion: 0.23
Nodes (14): 🟣 Passo 5 — Polimento, Organização e README ✅ (concluído), @emailjs/browser, EmailAdmin(), Reports(), clearEmailRateLimits(), DietEmailParams, enforceAbuseControls(), getEmailConfig() (+6 more)

### Community 92 - "Calendar.tsx"
Cohesion: 0.06
Nodes (66): PatientPortal, ChartDataTable(), AdherenceCheckIn(), PortalPasswordModal(), PortalWeightModal(), Props, RangeFilter, WeightEvolutionChart() (+58 more)

### Community 93 - "useAuth"
Cohesion: 0.16
Nodes (20): Diálogos (passos 1 e 2), 3.2 — i18n da UI: páginas e componentes ainda em PT ✅, 13 — Reduzir responsabilidades das páginas grandes, react-router-dom, Dialog(), EditIcon(), TrashIcon(), ExportDietModal (+12 more)

### Community 95 - "Step6LabExams.tsx"
Cohesion: 0.39
Nodes (6): Step6LabExams(), Step6Props, interpretTest(), labCategories, LabCategory, src_types_index_labtest

### Community 96 - "ui.tsx"
Cohesion: 0.11
Nodes (21): MonthBucket, PerformanceSection(), PerformanceSectionProps, StatCard(), StatCardProps, Badge(), BadgeTone, ButtonProps (+13 more)

### Community 97 - "dietPersistence.integration.test.ts"
Cohesion: 0.17
Nodes (10): ref_firebase_app, @firebase/rules-unit-testing, ref_node_fs, ref_node_path, ref_node_url, auth, fbApp, nutriDb() (+2 more)

### Community 98 - "Desempenho: consultas e carregamento"
Cohesion: 0.17
Nodes (11): Antes (plano do commit `99e72fa`), Bundle, Como reproduzir, Consultas ao Firestore, Depois, Desempenho: consultas e carregamento, Método, O que não foi medido (+3 more)

### Community 99 - "queryCost.test.ts"
Cohesion: 0.14
Nodes (7): IndexField, isIndexDeclared(), ScreenMeasurement, current, __dirname, holder, legacy

### Community 100 - "useDialog.ts"
Cohesion: 0.14
Nodes (17): react-dom, DialogPanel(), DialogProps, FOCUSABLE, focusInitial(), getFocusable(), isVisible(), lockScroll() (+9 more)

### Community 101 - "index.tsx"
Cohesion: 0.22
Nodes (9): ref_react_dom_client, App(), root, rootElement, ConfigValidationResult, REQUIRED_FIREBASE_KEYS, runStartupDiagnostics(), RuntimeEnv (+1 more)

### Community 102 - "types/index.ts"
Cohesion: 0.26
Nodes (8): Step3MealPlan(), PortalDietsSection(), r(), useDietTemplates(), src_types_index_dietplan, src_types_index_meal, translateMealName(), buildCustomLayoutPdfDocument()

### Community 103 - "errors.ts"
Cohesion: 0.32
Nodes (7): AppError, AppErrorOptions, classifyError(), ErrorCategory, generateCorrelationId(), safeLogError(), sanitizeDataForLogging()

### Community 104 - "PatientAccessModal.tsx"
Cohesion: 0.24
Nodes (8): 🟢 Passo 6 — Robustez do Portal do Paciente (NOVO) ✅ (concluído), PatientAccessModal(), Props, createPatientAccount(), createPatientPortalProfile(), sendPortalPasswordReset(), sendPortalAccessEmail(), src_types_index_patientinvitation

### Community 105 - "validatePatient"
Cohesion: 0.24
Nodes (9): MonthInstantRange, countCreatedPerMonth(), PatientSummary, summarizePatients(), toTime(), months, now, patient() (+1 more)

### Community 106 - "Reports.tsx"
Cohesion: 0.13
Nodes (13): EmailAdmin, MetabolicCalculator, Reports, Settings, BarChart3Icon(), CheckCircleIcon(), PaperAirplaneIcon(), XCircleIcon() (+5 more)

### Community 107 - "ErrorBoundary.tsx"
Cohesion: 0.25
Nodes (3): ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState

### Community 108 - "syntheticScenario.ts"
Cohesion: 0.33
Nodes (9): buildDietTemplate(), buildPatient(), localWallTime(), pad(), portalPatientId, SCENARIO, SeededAppointment, SeededDiet (+1 more)

### Community 109 - "Matriz de Baseline e Evidências — Storm Nutrition"
Cohesion: 0.29
Nodes (6): 1. Ambiente e Ferramentas Medidas, 2. Verificação da Nota Histórica do Prettier, 3. Matriz de Achados vs. Evidências no Código, 4. Estado da Integração Contínua (CI), Matriz de Baseline e Evidências — Storm Nutrition, db()

### Community 110 - "SelfEvaluationForm.tsx"
Cohesion: 0.53
Nodes (3): SelfEvaluationForm(), useFocusOnChange(), completeSelfEvaluation()

## Knowledge Gaps
- **540 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+535 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 719 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Sidebar.tsx`, `Step4Nutritional.tsx`, `DietPlanDisplay.tsx`, `pdfExporter.ts`, `MealOptionTable.tsx`, `ProgressBar.tsx`, `vitest`, `DietPlanViewer.tsx`, `Patients.test.tsx`, `App.tsx`, `firebaseService.ts`, `package.json`, `Home.tsx`, `icons.tsx`, `useDashboardData.ts`, `AuthContext.tsx`, `dietForm.types.ts`, `dietAlgorithmService.ts`, `PatientDirectoryContext.tsx`, `locale.ts`, `react-i18next`, `Dashboard.tsx`, `getPatientDiets`, `NewPatientModal.tsx`, `AppShell.tsx`, `Calendar.tsx`, `useAuth`, `Step6LabExams.tsx`, `ui.tsx`, `useDialog.ts`, `index.tsx`, `types/index.ts`, `PatientAccessModal.tsx`, `Reports.tsx`, `ErrorBoundary.tsx`, `SelfEvaluationForm.tsx`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `13 — Reduzir responsabilidades das páginas grandes` connect `useAuth` to `4. Etapas detalhadas`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `react-i18next` to `Sidebar.tsx`, `Step4Nutritional.tsx`, `DietPlanDisplay.tsx`, `pdfExporter.ts`, `MealOptionTable.tsx`, `ProgressBar.tsx`, `i18n.ts`, `vitest`, `DietPlanViewer.tsx`, `App.tsx`, `firebaseService.ts`, `package.json`, `Home.tsx`, `icons.tsx`, `useDashboardData.ts`, `AuthContext.tsx`, `dietForm.types.ts`, `react`, `dietAlgorithmService.ts`, `locale.ts`, `Dashboard.tsx`, `NewPatientModal.tsx`, `AppShell.tsx`, `Calendar.tsx`, `useAuth`, `Step6LabExams.tsx`, `ui.tsx`, `types/index.ts`, `PatientAccessModal.tsx`, `Reports.tsx`, `SelfEvaluationForm.tsx`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _540 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Step4Nutritional.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11264367816091954 - nodes in this community are weakly interconnected._
- **Should `pdfExporter.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10507246376811594 - nodes in this community are weakly interconnected._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.09993011879804332 - nodes in this community are weakly interconnected._
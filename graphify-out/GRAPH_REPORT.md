# Graph Report - Isanutri V5  (2026-09-18)

## Corpus Check
- 247 files · ~215,774 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 9, .rules 2, .mdc 1)

## Summary
- 1522 nodes · 3726 edges · 102 communities (79 shown, 23 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 84 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `99e72fac`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Sidebar.tsx
- Step4Nutritional.tsx
- PatientDietHistoryModal.tsx
- dateTime.ts
- localStorage.ts
- NewPatientModal.tsx
- pdfExporter.ts
- BillingSection.tsx
- DietPlanViewer.tsx
- Patients.test.tsx
- devDependencies
- App.tsx
- build-foods.mjs
- Calendar.tsx
- compilerOptions
- package.json
- Home.tsx
- measure-bundle.mjs
- Dashboard.tsx
- scripts
- dashboardUtils.ts
- dependencies
- manifest.json
- queryCost.test.ts
- vite.config.ts
- 4. Etapas detalhadas
- firebaseService.ts
- vitest
- PatientProfile.tsx
- dietAlgorithmService.ts
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- Patient
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- ProfileHeader.tsx
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- index.tsx
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
- OnboardingBanner.tsx
- dietService.ts
- errorIdFor
- AppShell.tsx
- icons.tsx
- evaluationService.ts
- Patients.tsx
- @playwright/test
- ui.tsx
- PatientDirectoryContext.tsx
- Desempenho: consultas e carregamento
- useDialog.ts
- types/index.ts
- react
- AuthContext.tsx
- Reports.tsx
- useAuth

## God Nodes (most connected - your core abstractions)
1. `react` - 102 edges
2. `react-i18next` - 76 edges
3. `Patient` - 70 edges
4. `useAuth()` - 47 edges
5. `vitest` - 34 edges
6. `DietPlan` - 29 edges
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
- `Estados de interface (passo 7)` --references--> `ErrorState()`  [INFERRED]
  docs/accessibility.md → src/components/ui.tsx
- `Baseline antes das mudanças` --references--> `usePatientProfile()`  [INFERRED]
  docs/accessibility.md → src/hooks/usePatientProfile.ts

## Import Cycles
- None detected.

## Communities (102 total, 23 thin omitted)

### Community 0 - "Sidebar.tsx"
Cohesion: 0.14
Nodes (10): react-router-dom, LogInIcon(), SearchIcon(), TargetIcon(), deriveNotifications(), NavItemProps, NotificationBell(), NotifItem (+2 more)

### Community 1 - "Step4Nutritional.tsx"
Cohesion: 0.08
Nodes (37): ClinicalTagSelector(), Props, TagOption, tags, DietCalculations, DietFormData, MacroSplit, MealSlot (+29 more)

### Community 2 - "PatientDietHistoryModal.tsx"
Cohesion: 0.14
Nodes (17): Diálogos (passos 1 e 2), Dialog(), ExportDietModal, AlertTriangleIcon(), BrainIcon(), DownloadIcon(), ClinicalReviewModal(), ExportDietModal() (+9 more)

### Community 3 - "dateTime.ts"
Cohesion: 0.22
Nodes (18): AdherenceCheckIn(), logAdherence(), generateDeterministicId(), normalizeAdherenceEntry(), normalizePatientHistories(), normalizeSelfEvaluation(), normalizeWeightRecord(), mockPatient (+10 more)

### Community 4 - "localStorage.ts"
Cohesion: 0.28
Nodes (17): DietPlanDisplay(), AuthProvider(), SetValue, usePersistentState(), clearUserSessionData(), getUserStorageKey(), isStorageAvailable(), LEGACY_DRAFT_KEYS (+9 more)

### Community 5 - "NewPatientModal.tsx"
Cohesion: 0.24
Nodes (8): initialFormData, NewPatientModal(), ProgressBar(), ProgressBarProps, steps, useFocusOnChange(), addPatient(), focusFirstInvalid()

### Community 6 - "pdfExporter.ts"
Cohesion: 0.07
Nodes (37): @emailjs/browser, html2canvas, jspdf, Step3MealPlan(), PortalDietsSection(), r(), normalizeLanguage(), resources (+29 more)

### Community 7 - "BillingSection.tsx"
Cohesion: 0.10
Nodes (33): 3.1 — Código e comentários em inglês ✅, 3.3 — Camadas de conteúdo (não são strings de UI — exigem abordagem própria) ✅, ✅ Critério de "pronto para avaliação", 🛠️ Detalhamento, 🗺️ Ordem de Execução Sugerida (atualizada), 🟢 Passo 1 — TypeScript Strict ✅ (concluído), 🟡 Passo 2 — Testes Automatizados ⚠️ (parcial), 🟢 Passo 3 — Internacionalização ✅ (concluído) (+25 more)

### Community 8 - "DietPlanViewer.tsx"
Cohesion: 0.15
Nodes (23): i18next, MetabolicCalculator, DietPlanViewer(), DietPlanViewerProps, isV2Plan(), ClipboardListIcon(), MetabolicCalculator(), ActivityLevel (+15 more)

### Community 9 - "Patients.test.tsx"
Cohesion: 0.19
Nodes (7): Sub, subs, useLatestDiets(), latestDietListeners, roster, AnyDietPlan, src_types_index_anydietplan

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (26): devDependencies, @axe-core/playwright, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @firebase/rules-unit-testing, firebase-tools (+18 more)

### Community 11 - "App.tsx"
Cohesion: 0.09
Nodes (25): AcceptInvitation, Calendar, DietGenerator, FoodDatabase, Home, Login, PatientPortal, PatientProfile (+17 more)

### Community 12 - "build-foods.mjs"
Cohesion: 0.05
Nodes (42): Acessibilidade e estados de interface, Baseline antes das mudanças, Como verificar, Contraste, mobile e movimento (passo 6), Custo no bundle, Estados de interface (passo 7), Formulários e anúncios (passo 3), Gráficos (passo 5) (+34 more)

### Community 13 - "Calendar.tsx"
Cohesion: 0.14
Nodes (27): Decisões e trade-offs, ApptModalProps, Calendar(), TYPE_DOT, TYPE_LIGHT, addAppointment(), deleteAppointment(), findAppointmentConflict() (+19 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 15 - "package.json"
Cohesion: 0.08
Nodes (25): engines, node, name, private, type, version, eslint, @eslint/js (+17 more)

### Community 17 - "measure-bundle.mjs"
Cohesion: 0.11
Nodes (23): ref_node_zlib, assets, chunks, closure(), collectChunkGraph, composition, compositionSorted, entry (+15 more)

### Community 18 - "Dashboard.tsx"
Cohesion: 0.10
Nodes (23): Dashboard, ActivityIconKey, src_components_dashboard_index_monthsummarycard, src_components_dashboard_index_onboardingbanner, src_components_dashboard_index_performancesection, src_components_dashboard_index_quickactionssection, src_components_dashboard_index_recentactivitycard, src_components_dashboard_index_statcard (+15 more)

### Community 19 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, build, dev, emulators, format, format:check, lint, measure:bundle (+10 more)

### Community 20 - "dashboardUtils.ts"
Cohesion: 0.26
Nodes (9): ActivityItem, buildMonthlyDietBuckets(), buildRecentActivity(), formatRelative(), MonthBucket, RECENT_ACTIVITY_LIMIT, PerformanceSectionProps, UseDashboardDataReturn (+1 more)

### Community 21 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, @emailjs/browser, firebase, @google/genai, html2canvas, i18next, jspdf, react (+3 more)

### Community 22 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 23 - "queryCost.test.ts"
Cohesion: 0.05
Nodes (47): 1. Ambiente e Ferramentas Medidas, 2. Verificação da Nota Histórica do Prettier, 3. Matriz de Achados vs. Evidências no Código, 4. Estado da Integração Contínua (CI), Matriz de Baseline e Evidências — Storm Nutrition, ref_firebase_firestore, @firebase/rules-unit-testing, ref_node_fs (+39 more)

### Community 24 - "vite.config.ts"
Cohesion: 0.25
Nodes (5): ref_path, @tailwindcss/vite, vite, @vitejs/plugin-react, ref_vitest_config

### Community 25 - "4. Etapas detalhadas"
Cohesion: 0.06
Nodes (34): 01 — Estabelecer baseline e corrigir o controle de status, 02 — Tornar instalação, emuladores e CI reproduzíveis, 03 — Corrigir o contrato de persistência das dietas, 04 — Tratar autenticação como fluxo com estados explícitos, 05 — Isolar rascunhos e configurações por conta, 06 — Fortalecer autorização e validação de dados, 07 — Substituir envio de senha por convite seguro, 08 — Tornar restrições e dados alimentares explícitos (+26 more)

### Community 26 - "firebaseService.ts"
Cohesion: 0.09
Nodes (40): 🟢 Passo 6 — Robustez do Portal do Paciente (NOVO) ✅ (concluído), ref_firebase_app, ref_firebase_auth, ref_firebase_storage, auth, fbApp, PatientAccessModal(), PortalPasswordModal() (+32 more)

### Community 27 - "vitest"
Cohesion: 0.32
Nodes (3): @testing-library/react, vitest, TestConsumer()

### Community 28 - "PatientProfile.tsx"
Cohesion: 0.18
Nodes (11): LoadingState(), BiomarkerData, BiomarkerEvolutionChart(), BiomarkerEvolutionChartProps, DietComparisonModal(), ProfileExamsTab(), ProfileExamsTabProps, ProfileTimelineTab() (+3 more)

### Community 29 - "dietAlgorithmService.ts"
Cohesion: 0.08
Nodes (53): NutritionLabel(), NutritionLabelProps, brazilianFoods, coreFoods, _seen, extraFoods, FoodDatabase(), createPrng() (+45 more)

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

### Community 35 - "Patient"
Cohesion: 0.10
Nodes (16): DietSuccessCardProps, DocumentTextIcon(), EditIcon(), TrashIcon(), NewPatientModalProps, Props, PatientDietHistoryModalProps, Step1Props (+8 more)

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

### Community 41 - "ProfileHeader.tsx"
Cohesion: 0.43
Nodes (5): modeTone, ProfileHeader(), ProfileHeaderProps, calcAge(), formatNumberWithLocale()

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

### Community 46 - "index.tsx"
Cohesion: 0.40
Nodes (4): ref_react_dom_client, App(), root, rootElement

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
Cohesion: 0.22
Nodes (9): DietProgressBar(), DietProgressBarProps, DietSuccessCard(), DietTemplatesSection(), DietTemplatesSectionProps, QuickCalculator(), DietTemplate, useDietTemplates() (+1 more)

### Community 85 - "OnboardingBanner.tsx"
Cohesion: 0.50
Nodes (3): OnboardingBanner(), OnboardingBannerProps, ChevronRightIcon()

### Community 86 - "dietService.ts"
Cohesion: 0.07
Nodes (48): MealOptionTable(), OptionTable(), parseAmounts(), parseFoodNames(), Props, usePatientProfile(), GenerationResult, byNewestFirst() (+40 more)

### Community 87 - "errorIdFor"
Cohesion: 0.21
Nodes (14): errBorder(), Step1Objectives(), Step2Nutrition(), Step1Personal(), errBorder(), errMsg(), Step2Contact(), Step2Props (+6 more)

### Community 90 - "AppShell.tsx"
Cohesion: 0.29
Nodes (7): AppShell(), Breadcrumbs(), BreadcrumbsProps, HomeIcon(), LanguageSelector(), routeNameKey(), routeNameMap

### Community 91 - "icons.tsx"
Cohesion: 0.11
Nodes (17): EmailAdmin, ClinicalContextCard(), ClinicalContextCardProps, modeTone, CheckCircleIcon(), CreditCardIcon(), HeartIcon(), IconProps (+9 more)

### Community 92 - "evaluationService.ts"
Cohesion: 0.10
Nodes (30): PortalWeightModal(), SelfEvaluationForm(), ProfileAssessmentTab(), Props, usePatientPortalData(), UsePatientPortalDataReturn, CompleteEvaluationOptions, completeSelfEvaluation() (+22 more)

### Community 93 - "Patients.tsx"
Cohesion: 0.18
Nodes (17): Patients(), ToastProps, archivePatient(), CascadeDeletionResult, deletePatient, deletePatientCascade(), DeletionProgress, getDietsCollection() (+9 more)

### Community 96 - "ui.tsx"
Cohesion: 0.16
Nodes (15): StatCardProps, Badge(), BadgeTone, ButtonProps, ButtonSize, buttonSizes, ButtonVariant, buttonVariants (+7 more)

### Community 97 - "PatientDirectoryContext.tsx"
Cohesion: 0.17
Nodes (11): DirectoryState, EMPTY, PatientDirectoryProvider(), auth, Consumer(), Listener, listeners, PatientDirectoryContext (+3 more)

### Community 98 - "Desempenho: consultas e carregamento"
Cohesion: 0.17
Nodes (11): Antes (plano do commit `99e72fa`), Bundle, Como reproduzir, Consultas ao Firestore, Depois, Desempenho: consultas e carregamento, Método, O que não foi medido (+3 more)

### Community 100 - "useDialog.ts"
Cohesion: 0.14
Nodes (17): react-dom, DialogPanel(), DialogProps, FOCUSABLE, focusInitial(), getFocusable(), isVisible(), lockScroll() (+9 more)

### Community 101 - "types/index.ts"
Cohesion: 0.22
Nodes (10): DietPlanDisplayProps, ClinicalReviewModalProps, ExportDietModalProps, ConfirmationModalProps, DietComparisonModalProps, ProfileDietsTab(), ProfileDietsTabProps, Button (+2 more)

### Community 102 - "react"
Cohesion: 0.20
Nodes (11): O que é verificado automaticamente, react, react-i18next, ChartDataTable(), QuickCalculatorProps, ProfileEvolutionTab(), ProfileEvolutionTabProps, RangeFilter (+3 more)

### Community 103 - "AuthContext.tsx"
Cohesion: 0.22
Nodes (12): AuthContext, AuthContextType, src_services_firebaseservice_onauthstatechanged, src_services_firebaseservice_user, AuthError, AuthStatus, InvitationStatus, NutritionistProfile (+4 more)

### Community 105 - "Reports.tsx"
Cohesion: 0.17
Nodes (16): Reports, GlobalSearch(), DashboardStats, useDashboardData(), usePatientDirectory(), Reports(), DietCountSummary, getDietCountSummary() (+8 more)

### Community 106 - "useAuth"
Cohesion: 0.23
Nodes (12): 3.2 — i18n da UI: páginas e componentes ainda em PT ✅, 13 — Reduzir responsabilidades das páginas grandes, Settings, PatientDietHistoryModal(), PageHeader(), useAuth(), DietGenerator(), EmailAdmin() (+4 more)

## Knowledge Gaps
- **520 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+515 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 693 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Sidebar.tsx`, `Step4Nutritional.tsx`, `PatientDietHistoryModal.tsx`, `dateTime.ts`, `localStorage.ts`, `NewPatientModal.tsx`, `pdfExporter.ts`, `BillingSection.tsx`, `DietPlanViewer.tsx`, `Patients.test.tsx`, `App.tsx`, `build-foods.mjs`, `Calendar.tsx`, `package.json`, `Home.tsx`, `Dashboard.tsx`, `firebaseService.ts`, `vitest`, `PatientProfile.tsx`, `dietAlgorithmService.ts`, `Patient`, `ProfileHeader.tsx`, `index.tsx`, `DietGenerator.tsx`, `OnboardingBanner.tsx`, `dietService.ts`, `errorIdFor`, `AppShell.tsx`, `icons.tsx`, `evaluationService.ts`, `Patients.tsx`, `ui.tsx`, `PatientDirectoryContext.tsx`, `useDialog.ts`, `types/index.ts`, `AuthContext.tsx`, `Reports.tsx`, `useAuth`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `react` to `Sidebar.tsx`, `Step4Nutritional.tsx`, `PatientDietHistoryModal.tsx`, `dateTime.ts`, `NewPatientModal.tsx`, `pdfExporter.ts`, `BillingSection.tsx`, `DietPlanViewer.tsx`, `App.tsx`, `Calendar.tsx`, `package.json`, `Home.tsx`, `Dashboard.tsx`, `firebaseService.ts`, `PatientProfile.tsx`, `dietAlgorithmService.ts`, `Patient`, `ProfileHeader.tsx`, `DietGenerator.tsx`, `OnboardingBanner.tsx`, `dietService.ts`, `errorIdFor`, `AppShell.tsx`, `icons.tsx`, `evaluationService.ts`, `Patients.tsx`, `ui.tsx`, `types/index.ts`, `Reports.tsx`, `useAuth`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `4. Etapas detalhadas` connect `4. Etapas detalhadas` to `useAuth`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _520 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13725490196078433 - nodes in this community are weakly interconnected._
- **Should `Step4Nutritional.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07712765957446809 - nodes in this community are weakly interconnected._
- **Should `PatientDietHistoryModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
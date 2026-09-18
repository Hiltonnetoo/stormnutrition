# Graph Report - Isanutri V5  (2026-09-18)

## Corpus Check
- 248 files · ~218,489 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 9, .rules 2, .mdc 1)

## Summary
- 1531 nodes · 3750 edges · 103 communities (80 shown, 23 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 84 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6583f3b9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Sidebar.tsx
- Step4Nutritional.tsx
- types/index.ts
- pdfExporter.ts
- MealOptionTable.tsx
- ProgressBar.tsx
- i18n.ts
- BillingSection.tsx
- metabolicCalculations.ts
- DietPlanViewer.tsx
- devDependencies
- Login.tsx
- build-foods.mjs
- Calendar.tsx
- compilerOptions
- package.json
- Home.tsx
- measure-bundle.mjs
- icons.tsx
- scripts
- dashboardUtils.ts
- dependencies
- manifest.json
- queryCost.test.ts
- vite.config.ts
- 4. Etapas detalhadas
- firebaseService.ts
- dietForm.types.ts
- react
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
- diet.ts
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
- Dashboard.tsx
- dietService.ts
- NewPatientModal.tsx
- dietService.test.ts
- 🛠️ Detalhamento
- App.tsx
- PatientActionsMenu.tsx
- evaluationService.ts
- Patients.tsx
- @playwright/test
- Step6LabExams.tsx
- ui.tsx
- usePatientDirectory
- Desempenho: consultas e carregamento
- Dashboard.test.tsx
- useDialog.ts
- Reports.tsx
- useAuth

## God Nodes (most connected - your core abstractions)
1. `react` - 102 edges
2. `react-i18next` - 76 edges
3. `Patient` - 70 edges
4. `useAuth()` - 47 edges
5. `vitest` - 35 edges
6. `DietPlan` - 30 edges
7. `Button` - 25 edges
8. `react-router-dom` - 22 edges
9. `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` - 21 edges
10. `4. Etapas detalhadas` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Resultados: bundle de produção` --references--> `ExportDietModal()`  [INFERRED]
  docs/performance.md → src/components/modals/ExportDietModal.tsx
- `1. Frontend Runtime & Strict Compiler Options` --references--> `ExportDietModal()`  [INFERRED]
  README.md → src/components/modals/ExportDietModal.tsx
- `Estados de interface (passo 7)` --references--> `ErrorState()`  [INFERRED]
  docs/accessibility.md → src/components/ui.tsx
- `Baseline antes das mudanças` --references--> `usePatientProfile()`  [INFERRED]
  docs/accessibility.md → src/hooks/usePatientProfile.ts
- `Teclado e foco visível (passo 4)` --references--> `main()`  [INFERRED]
  docs/accessibility.md → scripts/build-foods.mjs

## Import Cycles
- None detected.

## Communities (103 total, 23 thin omitted)

### Community 0 - "Sidebar.tsx"
Cohesion: 0.13
Nodes (8): LogInIcon(), PaperAirplaneIcon(), TargetIcon(), deriveNotifications(), GlobalSearch(), NavItemProps, NotificationBell(), NotifItem

### Community 1 - "Step4Nutritional.tsx"
Cohesion: 0.12
Nodes (22): ClinicalTagSelector(), Props, TagOption, tags, LabExamsModule(), Props, suggestionsByMode, suggestionsByTag (+14 more)

### Community 2 - "types/index.ts"
Cohesion: 0.15
Nodes (18): DietPlanDisplayProps, ExportDietModal, DietTemplatesSection(), DietTemplatesSectionProps, AlertTriangleIcon(), BrainIcon(), ClipboardListIcon(), DownloadIcon() (+10 more)

### Community 3 - "pdfExporter.ts"
Cohesion: 0.10
Nodes (22): html2canvas, jspdf, AMBER, AMBER_TEXT, buildCustomLayoutPdfDocument(), CustomLayoutPdfOptions, FAINT, formatFileName() (+14 more)

### Community 4 - "MealOptionTable.tsx"
Cohesion: 0.17
Nodes (12): MealOptionTable(), OptionTable(), parseAmounts(), parseFoodNames(), Props, MealOption, MealOptionItem, src_types_index_mealoption (+4 more)

### Community 5 - "ProgressBar.tsx"
Cohesion: 0.40
Nodes (3): ProgressBar(), ProgressBarProps, steps

### Community 6 - "i18n.ts"
Cohesion: 0.15
Nodes (18): @emailjs/browser, normalizeLanguage(), resources, syncDocumentLanguage(), src_locales_en_common, src_locales_pt_common, getFlattenedKeys(), DietEmailParams (+10 more)

### Community 7 - "BillingSection.tsx"
Cohesion: 0.12
Nodes (35): @testing-library/react, CreditCardIcon(), BillingSection(), SetValue, usePersistentState(), addMonths(), BillingState, buildDefaultState() (+27 more)

### Community 8 - "metabolicCalculations.ts"
Cohesion: 0.19
Nodes (19): i18next, MetabolicCalculator, MetabolicCalculator(), ActivityLevel, activityMultipliers, calculateBMI(), calculateBMR(), calculateMacrosInGrams() (+11 more)

### Community 9 - "DietPlanViewer.tsx"
Cohesion: 0.14
Nodes (12): DietPlanViewer(), DietPlanViewerProps, isV2Plan(), PortalDietsSection(), r(), Sub, subs, useLatestDiets() (+4 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (26): devDependencies, @axe-core/playwright, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @firebase/rules-unit-testing, firebase-tools (+18 more)

### Community 11 - "Login.tsx"
Cohesion: 0.15
Nodes (19): ref_firebase_app, Register, AuthLayout(), CheckCircleIcon(), EyeIcon(), EyeOffIcon(), GoogleIcon(), LogoIcon() (+11 more)

### Community 12 - "build-foods.mjs"
Cohesion: 0.06
Nodes (40): Acessibilidade e estados de interface, Baseline antes das mudanças, Como verificar, Contraste, mobile e movimento (passo 6), Custo no bundle, Estados de interface (passo 7), Formulários e anúncios (passo 3), Gráficos (passo 5) (+32 more)

### Community 13 - "Calendar.tsx"
Cohesion: 0.15
Nodes (26): ApptModalProps, Calendar(), TYPE_DOT, TYPE_LIGHT, addAppointment(), deleteAppointment(), findAppointmentConflict(), getAppointmentDoc() (+18 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 15 - "package.json"
Cohesion: 0.08
Nodes (25): engines, node, name, private, type, version, eslint, @eslint/js (+17 more)

### Community 17 - "measure-bundle.mjs"
Cohesion: 0.11
Nodes (23): ref_node_zlib, assets, chunks, closure(), collectChunkGraph, composition, compositionSorted, entry (+15 more)

### Community 18 - "icons.tsx"
Cohesion: 0.14
Nodes (16): MonthSummaryCard(), MonthSummaryCardProps, QuickActionCardProps, QuickActionsSection(), ChevronRightIcon(), ClockIcon(), HomeIcon(), IconProps (+8 more)

### Community 19 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, build, dev, emulators, format, format:check, lint, measure:bundle (+10 more)

### Community 20 - "dashboardUtils.ts"
Cohesion: 0.21
Nodes (11): ActivityIconKey, ActivityItem, buildMonthlyDietBuckets(), buildRecentActivity(), formatRelative(), RECENT_ACTIVITY_LIMIT, ACTIVITY_ICON, RecentActivityCard() (+3 more)

### Community 21 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, @emailjs/browser, firebase, @google/genai, html2canvas, i18next, jspdf, react (+3 more)

### Community 22 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 23 - "queryCost.test.ts"
Cohesion: 0.05
Nodes (49): 1. Ambiente e Ferramentas Medidas, 2. Verificação da Nota Histórica do Prettier, 3. Matriz de Achados vs. Evidências no Código, 4. Estado da Integração Contínua (CI), Matriz de Baseline e Evidências — Storm Nutrition, ref_firebase_firestore, @firebase/rules-unit-testing, ref_node_fs (+41 more)

### Community 24 - "vite.config.ts"
Cohesion: 0.25
Nodes (5): ref_path, @tailwindcss/vite, vite, @vitejs/plugin-react, ref_vitest_config

### Community 25 - "4. Etapas detalhadas"
Cohesion: 0.06
Nodes (34): 01 — Estabelecer baseline e corrigir o controle de status, 02 — Tornar instalação, emuladores e CI reproduzíveis, 03 — Corrigir o contrato de persistência das dietas, 04 — Tratar autenticação como fluxo com estados explícitos, 05 — Isolar rascunhos e configurações por conta, 06 — Fortalecer autorização e validação de dados, 07 — Substituir envio de senha por convite seguro, 08 — Tornar restrições e dados alimentares explícitos (+26 more)

### Community 26 - "firebaseService.ts"
Cohesion: 0.05
Nodes (70): 🟢 Passo 6 — Robustez do Portal do Paciente (NOVO) ✅ (concluído), ref_firebase_auth, ref_react_dom_client, App(), PatientAccessModal(), AuthContext, AuthContextType, AuthProvider() (+62 more)

### Community 27 - "dietForm.types.ts"
Cohesion: 0.21
Nodes (12): DietCalculations, DietFormData, MacroSplit, MealSlot, errBorder(), Step1Objectives(), Step1Props, Step2Props (+4 more)

### Community 28 - "react"
Cohesion: 0.15
Nodes (17): react, react-i18next, Dialog(), DialogProps, LoadingState(), BiomarkerData, BiomarkerEvolutionChart(), BiomarkerEvolutionChartProps (+9 more)

### Community 29 - "dietAlgorithmService.ts"
Cohesion: 0.07
Nodes (54): FoodDatabase, NutritionLabel(), NutritionLabelProps, SearchIcon(), brazilianFoods, coreFoods, _seen, extraFoods (+46 more)

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
Cohesion: 0.11
Nodes (18): DietSuccessCardProps, EditIcon(), NewPatientModalProps, Props, Step1Props, Step3Props, Step5Props, Step6Props (+10 more)

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
Cohesion: 0.47
Nodes (4): modeTone, ProfileHeader(), ProfileHeaderProps, calcAge()

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

### Community 46 - "diet.ts"
Cohesion: 0.20
Nodes (11): GenerationResult, CalculatedDietTotals, DecisionEntry, DietPlanFirestoreDto, DietPlanUpdateDto, Meal, PlanValidationIssue, PlanValidationResult (+3 more)

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
Nodes (11): ClinicalContextCard(), ClinicalContextCardProps, modeTone, DietProgressBar(), DietProgressBarProps, DietSuccessCard(), QuickCalculator(), HeartIcon() (+3 more)

### Community 85 - "Dashboard.tsx"
Cohesion: 0.13
Nodes (14): Dashboard, MonthBucket, src_components_dashboard_index_monthsummarycard, src_components_dashboard_index_onboardingbanner, src_components_dashboard_index_performancesection, src_components_dashboard_index_quickactionssection, src_components_dashboard_index_recentactivitycard, src_components_dashboard_index_statcard (+6 more)

### Community 86 - "dietService.ts"
Cohesion: 0.23
Nodes (13): getDietDoc(), getDietsCollection(), handleSnapshotError(), saveDietPlan(), subscribeLatestDiet(), subscribeRecentDiets(), toDietPlan(), updateDietPlan() (+5 more)

### Community 87 - "NewPatientModal.tsx"
Cohesion: 0.23
Nodes (15): Step2Nutrition(), initialFormData, NewPatientModal(), Step1Personal(), errBorder(), errMsg(), Step2Contact(), Step2Props (+7 more)

### Community 88 - "dietService.test.ts"
Cohesion: 0.33
Nodes (11): isFiniteNumber(), sanitizeMeal(), sanitizeMealOption(), sanitizeMealOptionItem(), sanitizeMicronutrients(), validateAndSerializeDietPlan(), validateAndSerializeDietUpdate(), assertNoUndefined() (+3 more)

### Community 89 - "🛠️ Detalhamento"
Cohesion: 0.18
Nodes (10): 3.1 — Código e comentários em inglês ✅, 3.3 — Camadas de conteúdo (não são strings de UI — exigem abordagem própria) ✅, ✅ Critério de "pronto para avaliação", 🛠️ Detalhamento, 🗺️ Ordem de Execução Sugerida (atualizada), 🟢 Passo 1 — TypeScript Strict ✅ (concluído), 🟢 Passo 3 — Internacionalização ✅ (concluído), 🔵 Passo 4 — Segurança e CI/CD ✅ (concluído — revisar qualidade) (+2 more)

### Community 90 - "App.tsx"
Cohesion: 0.12
Nodes (17): react-router-dom, AcceptInvitation, Calendar, DietGenerator, EmailAdmin, Login, PatientProfile, Patients (+9 more)

### Community 91 - "PatientActionsMenu.tsx"
Cohesion: 0.22
Nodes (7): Teclado e foco visível (passo 4), react-dom, DocumentTextIcon(), TrashIcon(), menuItems(), PatientActionsMenu(), PatientActionsMenuProps

### Community 92 - "evaluationService.ts"
Cohesion: 0.07
Nodes (54): PatientPortal, patient, AdherenceCheckIn(), PortalPasswordModal(), PortalWeightModal(), ProfileAssessmentTab(), Props, RangeFilter (+46 more)

### Community 93 - "Patients.tsx"
Cohesion: 0.23
Nodes (9): Diálogos (passos 1 e 2), ExportDietModal, PatientDietHistoryModal(), PatientDietHistoryModalProps, ConfirmationModal(), ConfirmationModalProps, Modal(), ToastProps (+1 more)

### Community 95 - "Step6LabExams.tsx"
Cohesion: 0.36
Nodes (7): Step6LabExams(), Step6Props, interpretTest(), labCategories, LabCategory, LabTest, src_types_index_labtest

### Community 96 - "ui.tsx"
Cohesion: 0.11
Nodes (22): StatCardProps, QuickCalculatorProps, XCircleIcon(), Badge(), BadgeTone, Button, ButtonProps, ButtonSize (+14 more)

### Community 97 - "usePatientDirectory"
Cohesion: 0.33
Nodes (5): auth, Consumer(), Listener, listeners, usePatientDirectory()

### Community 98 - "Desempenho: consultas e carregamento"
Cohesion: 0.17
Nodes (11): Antes (plano do commit `99e72fa`), Bundle, Como reproduzir, Consultas ao Firestore, Depois, Desempenho: consultas e carregamento, Método, O que não foi medido (+3 more)

### Community 99 - "Dashboard.test.tsx"
Cohesion: 0.29
Nodes (6): Decisões e trade-offs, 🟡 Passo 2 — Testes Automatizados ⚠️ (parcial), Sidebar(), PatientDirectoryProvider(), Dashboard(), NOTE: vi.mock is hoisted, so the helpers must live inside the factory.

### Community 100 - "useDialog.ts"
Cohesion: 0.16
Nodes (15): DialogPanel(), FOCUSABLE, focusInitial(), getFocusable(), isVisible(), lockScroll(), managedInert, OpenDialog (+7 more)

### Community 105 - "Reports.tsx"
Cohesion: 0.16
Nodes (17): 🟣 Passo 5 — Polimento, Organização e README ✅ (concluído), PageHeader(), DashboardStats, useDashboardData(), Reports(), DietCountSummary, getDietCountSummary(), isEmailConfigured() (+9 more)

### Community 106 - "useAuth"
Cohesion: 0.22
Nodes (17): 3.2 — i18n da UI: páginas e componentes ainda em PT ✅, 13 — Reduzir responsabilidades das páginas grandes, ref_firebase_storage, DietPlanDisplay(), ExportDietModal(), useAuth(), useDietTemplates(), DietGenerator() (+9 more)

## Knowledge Gaps
- **524 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+519 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 699 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Sidebar.tsx`, `Step4Nutritional.tsx`, `types/index.ts`, `MealOptionTable.tsx`, `ProgressBar.tsx`, `BillingSection.tsx`, `metabolicCalculations.ts`, `DietPlanViewer.tsx`, `Login.tsx`, `Calendar.tsx`, `package.json`, `Home.tsx`, `icons.tsx`, `dashboardUtils.ts`, `firebaseService.ts`, `dietForm.types.ts`, `dietAlgorithmService.ts`, `Patient`, `ProfileHeader.tsx`, `DietGenerator.tsx`, `Dashboard.tsx`, `NewPatientModal.tsx`, `App.tsx`, `PatientActionsMenu.tsx`, `evaluationService.ts`, `Patients.tsx`, `Step6LabExams.tsx`, `ui.tsx`, `usePatientDirectory`, `Dashboard.test.tsx`, `useDialog.ts`, `Reports.tsx`, `useAuth`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `react` to `Sidebar.tsx`, `Step4Nutritional.tsx`, `types/index.ts`, `MealOptionTable.tsx`, `ProgressBar.tsx`, `i18n.ts`, `BillingSection.tsx`, `metabolicCalculations.ts`, `DietPlanViewer.tsx`, `Login.tsx`, `Calendar.tsx`, `package.json`, `Home.tsx`, `icons.tsx`, `dashboardUtils.ts`, `dietForm.types.ts`, `dietAlgorithmService.ts`, `Patient`, `ProfileHeader.tsx`, `DietGenerator.tsx`, `Dashboard.tsx`, `NewPatientModal.tsx`, `App.tsx`, `PatientActionsMenu.tsx`, `evaluationService.ts`, `Patients.tsx`, `Step6LabExams.tsx`, `ui.tsx`, `Reports.tsx`, `useAuth`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `4. Etapas detalhadas` connect `4. Etapas detalhadas` to `useAuth`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _524 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Step4Nutritional.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11965811965811966 - nodes in this community are weakly interconnected._
- **Should `types/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14814814814814814 - nodes in this community are weakly interconnected._
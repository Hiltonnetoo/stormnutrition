# Graph Report - Isanutri V5  (2026-09-18)

## Corpus Check
- 260 files · ~229,142 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 9, .rules 2, .mdc 1)

## Summary
- 1620 nodes · 3923 edges · 110 communities (88 shown, 22 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 84 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9fa15073`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- icons.tsx
- Step4Nutritional.tsx
- DietPlanDisplay.tsx
- pdfExporter.ts
- MealOptionTable.tsx
- react
- firebaseService.ts
- vitest
- DietPlanViewer.tsx
- dietAlgorithmService.ts
- devDependencies
- Login.tsx
- PatientActionsMenu.tsx
- patientService.ts
- compilerOptions
- package.json
- Home.tsx
- measure-bundle.mjs
- types/index.ts
- scripts
- Reports.tsx
- dependencies
- manifest.json
- firestoreMeter.ts
- vite.config.ts
- 4. Etapas detalhadas
- AuthContext.tsx
- PatientProfile.tsx
- App.tsx
- foodService.ts
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
- useAuth
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
- DietGenerator.tsx
- Dashboard.tsx
- 3.2 — i18n da UI: páginas e componentes ainda em PT ✅
- NewPatientModal.tsx
- dietService.ts
- 🛠️ Detalhamento
- AppShell.tsx
- Sidebar.tsx
- Calendar.tsx
- diet.ts
- @playwright/test
- Step6LabExams.tsx
- ui.tsx
- dietPersistence.integration.test.ts
- Desempenho: consultas e carregamento
- queryCost.test.ts
- useDialog.ts
- i18n.ts
- Index of Architectural Decisions
- dietForm.types.ts
- RecentActivityCard.tsx
- ProfileAssessmentTab.tsx
- PatientAccessModal.tsx
- PatientModal.tsx
- NutritionLabel.tsx
- Matriz de Baseline e Evidências — Storm Nutrition

## God Nodes (most connected - your core abstractions)
1. `react` - 106 edges
2. `react-i18next` - 77 edges
3. `Patient` - 70 edges
4. `useAuth()` - 49 edges
5. `vitest` - 40 edges
6. `DietPlan` - 30 edges
7. `Button` - 26 edges
8. `react-router-dom` - 22 edges
9. `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` - 21 edges
10. `4. Etapas detalhadas` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Gráficos (passo 5)` --references--> `ChartDataTable()`  [INFERRED]
  docs/accessibility.md → src/components/ChartDataTable.tsx
- `Resultados: bundle de produção` --references--> `ExportDietModal()`  [INFERRED]
  docs/performance.md → src/components/modals/ExportDietModal.tsx
- `Baseline antes das mudanças` --references--> `usePatientProfile()`  [INFERRED]
  docs/accessibility.md → src/hooks/usePatientProfile.ts
- `ADR-09: Safe Interception of Demo Emails and Multi-Layer Abuse Controls` --references--> `isDemoRecipient()`  [INFERRED]
  docs/architecture-decisions.md → src/services/emailService.ts
- `3.2 Identificadores de Correlação e Privacidade nos Logs` --references--> `safeLogError()`  [INFERRED]
  docs/deployment-and-config.md → src/utils/errors.ts

## Import Cycles
- None detected.

## Communities (110 total, 22 thin omitted)

### Community 0 - "icons.tsx"
Cohesion: 0.16
Nodes (12): Patients, EyeIcon(), EyeOffIcon(), HeartIcon(), IconProps, PlusIcon(), SearchIcon(), ShieldIcon() (+4 more)

### Community 1 - "Step4Nutritional.tsx"
Cohesion: 0.11
Nodes (24): ClinicalTagSelector(), Props, TagOption, tags, LabExamsModule(), Props, suggestionsByMode, suggestionsByTag (+16 more)

### Community 2 - "DietPlanDisplay.tsx"
Cohesion: 0.13
Nodes (16): DietPlanDisplayProps, ExportDietModal, DietPlanViewerProps, AlertTriangleIcon(), BrainIcon(), DownloadIcon(), ClinicalReviewModal(), ClinicalReviewModalProps (+8 more)

### Community 3 - "pdfExporter.ts"
Cohesion: 0.08
Nodes (25): html2canvas, jspdf, mealCalorieDistribution, Step3MealPlan(), PortalDietsSection(), r(), Meal, translateMealName() (+17 more)

### Community 4 - "MealOptionTable.tsx"
Cohesion: 0.17
Nodes (12): MealOptionTable(), OptionTable(), parseAmounts(), parseFoodNames(), Props, MealOption, MealOptionItem, src_types_index_mealoption (+4 more)

### Community 5 - "react"
Cohesion: 0.17
Nodes (10): react, ChartDataTable(), ProgressBar(), ProgressBarProps, steps, BiomarkerData, BiomarkerEvolutionChartProps, ProfileEvolutionTabProps (+2 more)

### Community 6 - "firebaseService.ts"
Cohesion: 0.15
Nodes (18): 🟢 Passo 6 — Robustez do Portal do Paciente (NOVO) ✅ (concluído), ref_firebase_storage, createPatientAccount(), createPatientPortalProfile(), setupPatientPortalAccess(), updatePatientPortalRef(), updateUserProfile(), uploadProfilePicture() (+10 more)

### Community 7 - "vitest"
Cohesion: 0.09
Nodes (46): @testing-library/react, vitest, DietPlanDisplay(), CreditCardIcon(), NewPatientModal(), BillingSection(), useDietTemplates(), SetValue (+38 more)

### Community 8 - "DietPlanViewer.tsx"
Cohesion: 0.15
Nodes (23): i18next, MetabolicCalculator, DietPlanViewer(), isV2Plan(), PageHeader(), MetabolicCalculator(), ActivityLevel, activityMultipliers (+15 more)

### Community 9 - "dietAlgorithmService.ts"
Cohesion: 0.24
Nodes (20): createPrng(), dietTemplates, generateAlgorithmicDietPlan(), getGeneralObservations(), hashStringToSeed(), InfeasiblePlanError, validateDietPlan(), validateGenerationParams() (+12 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (26): devDependencies, @axe-core/playwright, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @firebase/rules-unit-testing, firebase-tools (+18 more)

### Community 11 - "Login.tsx"
Cohesion: 0.13
Nodes (18): ref_firebase_app, ref_firebase_auth, auth, fbApp, Login, GoogleIcon(), Input, getFriendlyErrorMessage() (+10 more)

### Community 12 - "PatientActionsMenu.tsx"
Cohesion: 0.07
Nodes (30): Acessibilidade e estados de interface, Baseline antes das mudanças, Como verificar, Contraste, mobile e movimento (passo 6), Custo no bundle, Formulários e anúncios (passo 3), Gráficos (passo 5), Mudanças (+22 more)

### Community 13 - "patientService.ts"
Cohesion: 0.21
Nodes (16): Patients(), addPatient(), archivePatient(), CascadeDeletionResult, deletePatientCascade(), DeletionProgress, getDietsCollection(), getPatientDoc() (+8 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 15 - "package.json"
Cohesion: 0.09
Nodes (24): engines, node, name, private, type, version, eslint, @eslint/js (+16 more)

### Community 16 - "Home.tsx"
Cohesion: 0.09
Nodes (7): AuthLayout(), AuthLayoutProps, CheckCircleIcon(), LogoIcon(), StarIcon(), LanguageSelector(), showcaseFrames

### Community 17 - "measure-bundle.mjs"
Cohesion: 0.10
Nodes (24): ref_node_zlib, vite, assets, chunks, closure(), collectChunkGraph, composition, compositionSorted (+16 more)

### Community 18 - "types/index.ts"
Cohesion: 0.13
Nodes (17): react-i18next, Dialog(), DialogProps, PortalPasswordModal(), PortalWeightModal(), SelfEvaluationForm(), Props, useFocusOnChange() (+9 more)

### Community 19 - "scripts"
Cohesion: 0.10
Nodes (20): scripts, build, demo:reset, demo:seed, dev, emulators, format, format:check (+12 more)

### Community 20 - "Reports.tsx"
Cohesion: 0.08
Nodes (28): buildMonthlyDietBuckets(), buildRecentActivity(), formatRelative(), MonthBucket, RECENT_ACTIVITY_LIMIT, PerformanceSection(), PerformanceSectionProps, Sub (+20 more)

### Community 21 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, @emailjs/browser, firebase, html2canvas, i18next, jspdf, react, react-dom (+2 more)

### Community 22 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 23 - "firestoreMeter.ts"
Cohesion: 0.13
Nodes (18): canonicalString(), CoreQueryShape, createMeteredFirestore(), describeTarget(), Firestore, fresh(), IndexField, isIndexDeclared() (+10 more)

### Community 24 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): ref_path, @tailwindcss/vite, @vitejs/plugin-react, ref_vitest_config

### Community 25 - "4. Etapas detalhadas"
Cohesion: 0.06
Nodes (34): 01 — Estabelecer baseline e corrigir o controle de status, 02 — Tornar instalação, emuladores e CI reproduzíveis, 03 — Corrigir o contrato de persistência das dietas, 04 — Tratar autenticação como fluxo com estados explícitos, 05 — Isolar rascunhos e configurações por conta, 06 — Fortalecer autorização e validação de dados, 07 — Substituir envio de senha por convite seguro, 08 — Tornar restrições e dados alimentares explícitos (+26 more)

### Community 26 - "AuthContext.tsx"
Cohesion: 0.18
Nodes (16): AuthContext, AuthContextType, AuthProvider(), firebaseSignOut(), getNutritionistProfile(), getPatientPortalProfile(), src_services_firebaseservice_onauthstatechanged, AuthError (+8 more)

### Community 27 - "PatientProfile.tsx"
Cohesion: 0.29
Nodes (6): react-router-dom, LoadingState(), DietComparisonModal(), ProfileEvolutionTab(), ProfileExamsTab(), TabId

### Community 28 - "App.tsx"
Cohesion: 0.12
Nodes (13): Calendar, DietGenerator, EmailAdmin, Home, PatientPortal, PatientProfile, Register, Reports (+5 more)

### Community 29 - "foodService.ts"
Cohesion: 0.09
Nodes (30): FoodDatabase, brazilianFoods, coreFoods, _seen, extraFoods, FoodDatabase(), foodCategories, getAvailableCarbs() (+22 more)

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
Cohesion: 0.13
Nodes (18): DietSuccessCardProps, NewPatientModalProps, PatientDietHistoryModalProps, Step1Props, Step3Props, Step5Props, BiomarkerEvolutionChart(), ProfileExamsTabProps (+10 more)

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

### Community 41 - "useAuth"
Cohesion: 0.25
Nodes (13): EditIcon(), TrashIcon(), ExportDietModal(), ExportDietModal, PatientDietHistoryModal(), ExportDietModal, ProfileDietsTab(), useAuth() (+5 more)

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

### Community 84 - "DietGenerator.tsx"
Cohesion: 0.11
Nodes (19): ClinicalContextCard(), ClinicalContextCardProps, modeTone, DietProgressBar(), DietProgressBarProps, DietSuccessCard(), DietTemplatesSection(), DietTemplatesSectionProps (+11 more)

### Community 85 - "Dashboard.tsx"
Cohesion: 0.11
Nodes (20): Dashboard, src_components_dashboard_index_monthsummarycard, src_components_dashboard_index_onboardingbanner, src_components_dashboard_index_performancesection, src_components_dashboard_index_quickactionssection, src_components_dashboard_index_recentactivitycard, src_components_dashboard_index_statcard, MonthSummaryCard() (+12 more)

### Community 86 - "3.2 — i18n da UI: páginas e componentes ainda em PT ✅"
Cohesion: 0.33
Nodes (9): 3.2 — i18n da UI: páginas e componentes ainda em PT ✅, 13 — Reduzir responsabilidades das páginas grandes, usePatientPortalData(), usePatientProfile(), PatientPortal(), PatientProfile(), byNewestFirst(), getPatientDiets() (+1 more)

### Community 87 - "NewPatientModal.tsx"
Cohesion: 0.19
Nodes (15): Step2Nutrition(), initialFormData, Step1Personal(), errBorder(), errMsg(), Step2Contact(), Step2Props, Step3Professional() (+7 more)

### Community 88 - "dietService.ts"
Cohesion: 0.18
Nodes (23): DietCountSummary, getDietDoc(), getDietsCollection(), handleSnapshotError(), isFiniteNumber(), sanitizeMeal(), sanitizeMealOption(), sanitizeMealOptionItem() (+15 more)

### Community 89 - "🛠️ Detalhamento"
Cohesion: 0.17
Nodes (11): 3.1 — Código e comentários em inglês ✅, 3.3 — Camadas de conteúdo (não são strings de UI — exigem abordagem própria) ✅, ✅ Critério de "pronto para avaliação", 🛠️ Detalhamento, 🗺️ Ordem de Execução Sugerida (atualizada), 🟢 Passo 1 — TypeScript Strict ✅ (concluído), 🟢 Passo 3 — Internacionalização ✅ (concluído), 🔵 Passo 4 — Segurança e CI/CD ✅ (concluído — revisar qualidade) (+3 more)

### Community 90 - "AppShell.tsx"
Cohesion: 0.13
Nodes (16): Decisões e trade-offs, 🟡 Passo 2 — Testes Automatizados ⚠️ (parcial), AppShell(), Breadcrumbs(), BreadcrumbsProps, CloseIcon(), HomeIcon(), SparklesIcon() (+8 more)

### Community 91 - "Sidebar.tsx"
Cohesion: 0.16
Nodes (9): ClipboardListIcon(), LogInIcon(), TargetIcon(), deriveNotifications(), GlobalSearch(), NavItemProps, NotificationBell(), NotifItem (+1 more)

### Community 92 - "Calendar.tsx"
Cohesion: 0.07
Nodes (57): AdherenceCheckIn(), ApptModalProps, Calendar(), TYPE_DOT, TYPE_LIGHT, addAppointment(), deleteAppointment(), findAppointmentConflict() (+49 more)

### Community 93 - "diet.ts"
Cohesion: 0.20
Nodes (10): GenerationResult, CalculatedDietTotals, DecisionEntry, DietPlanFirestoreDto, DietPlanUpdateDto, PlanValidationIssue, PlanValidationResult, PlanValidationStatus (+2 more)

### Community 95 - "Step6LabExams.tsx"
Cohesion: 0.39
Nodes (6): Step6LabExams(), Step6Props, interpretTest(), labCategories, LabCategory, src_types_index_labtest

### Community 96 - "ui.tsx"
Cohesion: 0.15
Nodes (17): Estados de interface (passo 7), Badge(), BadgeTone, ButtonProps, ButtonSize, buttonSizes, ButtonVariant, buttonVariants (+9 more)

### Community 97 - "dietPersistence.integration.test.ts"
Cohesion: 0.33
Nodes (7): @firebase/rules-unit-testing, ref_node_fs, ref_node_path, ref_node_url, nutriDb(), __dirname, __dirname

### Community 98 - "Desempenho: consultas e carregamento"
Cohesion: 0.17
Nodes (11): Antes (plano do commit `99e72fa`), Bundle, Como reproduzir, Consultas ao Firestore, Depois, Desempenho: consultas e carregamento, Método, O que não foi medido (+3 more)

### Community 99 - "queryCost.test.ts"
Cohesion: 0.15
Nodes (13): current, __dirname, holder, legacy, buildDietTemplate(), buildPatient(), localWallTime(), pad() (+5 more)

### Community 100 - "useDialog.ts"
Cohesion: 0.16
Nodes (15): DialogPanel(), FOCUSABLE, focusInitial(), getFocusable(), isVisible(), lockScroll(), managedInert, OpenDialog (+7 more)

### Community 101 - "i18n.ts"
Cohesion: 0.06
Nodes (46): @emailjs/browser, ref_react_dom_client, App(), ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState, ProfileTimelineTab(), normalizeLanguage() (+38 more)

### Community 102 - "Index of Architectural Decisions"
Cohesion: 0.05
Nodes (38): ADR-01: React 19 SPA with Strict TypeScript and Code-Splitting, ADR-02: Native Compile-Time Tailwind CSS v4, ADR-03: Secondary Firebase Auth Instance for Non-Disruptive Patient Provisioning, ADR-04: Passwordless Tokenized Invitations with Patient-Defined Passwords, ADR-05: Multi-Tenant Isolation via Firestore Security Rules, ADR-06: Deterministic Constraint-Based Meal Generation over Generative AI, ADR-07: Vector-Based Editorial PDF Exporting, ADR-08: Architectural Decoupling of Local Billing Simulation (+30 more)

### Community 103 - "dietForm.types.ts"
Cohesion: 0.27
Nodes (9): DietCalculations, DietFormData, MacroSplit, MealSlot, errBorder(), Step1Objectives(), Step1Props, Step2Props (+1 more)

### Community 104 - "RecentActivityCard.tsx"
Cohesion: 0.29
Nodes (7): ActivityIconKey, ActivityItem, ACTIVITY_ICON, RecentActivityCard(), RecentActivityCardProps, ClockIcon(), ScaleIcon()

### Community 105 - "ProfileAssessmentTab.tsx"
Cohesion: 0.47
Nodes (5): ProfileAssessmentTab(), ProfileAssessmentTabProps, requestSelfEvaluation(), updatePatientSettings(), src_services_firebaseservice_user

### Community 106 - "PatientAccessModal.tsx"
Cohesion: 0.21
Nodes (16): ref_firebase_firestore, AcceptInvitation, PatientAccessModal(), Props, AcceptInvitation(), sendPortalPasswordReset(), src_services_firebasecore_user, acceptInvitationWithExistingAccount() (+8 more)

### Community 107 - "PatientModal.tsx"
Cohesion: 0.50
Nodes (4): Diálogos (passos 1 e 2), ConfirmationModal(), ConfirmationModalProps, Modal()

### Community 108 - "NutritionLabel.tsx"
Cohesion: 0.50
Nodes (4): NutritionLabel(), NutritionLabelProps, Micronutrients, src_types_index_micronutrients

### Community 109 - "Matriz de Baseline e Evidências — Storm Nutrition"
Cohesion: 0.29
Nodes (6): 1. Ambiente e Ferramentas Medidas, 2. Verificação da Nota Histórica do Prettier, 3. Matriz de Achados vs. Evidências no Código, 4. Estado da Integração Contínua (CI), Matriz de Baseline e Evidências — Storm Nutrition, db()

## Knowledge Gaps
- **564 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+559 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 742 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `icons.tsx`, `Step4Nutritional.tsx`, `DietPlanDisplay.tsx`, `pdfExporter.ts`, `MealOptionTable.tsx`, `vitest`, `DietPlanViewer.tsx`, `Login.tsx`, `PatientActionsMenu.tsx`, `package.json`, `Home.tsx`, `types/index.ts`, `Reports.tsx`, `AuthContext.tsx`, `PatientProfile.tsx`, `App.tsx`, `foodService.ts`, `Patient`, `useAuth`, `DietGenerator.tsx`, `Dashboard.tsx`, `3.2 — i18n da UI: páginas e componentes ainda em PT ✅`, `NewPatientModal.tsx`, `AppShell.tsx`, `Sidebar.tsx`, `Calendar.tsx`, `Step6LabExams.tsx`, `ui.tsx`, `useDialog.ts`, `i18n.ts`, `dietForm.types.ts`, `RecentActivityCard.tsx`, `ProfileAssessmentTab.tsx`, `PatientAccessModal.tsx`, `PatientModal.tsx`, `NutritionLabel.tsx`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `types/index.ts` to `icons.tsx`, `Step4Nutritional.tsx`, `DietPlanDisplay.tsx`, `pdfExporter.ts`, `MealOptionTable.tsx`, `react`, `vitest`, `DietPlanViewer.tsx`, `Login.tsx`, `PatientActionsMenu.tsx`, `package.json`, `Home.tsx`, `Reports.tsx`, `PatientProfile.tsx`, `App.tsx`, `foodService.ts`, `Patient`, `useAuth`, `DietGenerator.tsx`, `Dashboard.tsx`, `NewPatientModal.tsx`, `AppShell.tsx`, `Sidebar.tsx`, `Calendar.tsx`, `Step6LabExams.tsx`, `ui.tsx`, `i18n.ts`, `dietForm.types.ts`, `RecentActivityCard.tsx`, `ProfileAssessmentTab.tsx`, `PatientAccessModal.tsx`, `PatientModal.tsx`, `NutritionLabel.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `MealOptionTable.tsx`, `DietPlanViewer.tsx`, `dietAlgorithmService.ts`, `PatientActionsMenu.tsx`, `patientService.ts`, `package.json`, `types/index.ts`, `Reports.tsx`, `Patient`, `3.2 — i18n da UI: páginas e componentes ainda em PT ✅`, `dietService.ts`, `AppShell.tsx`, `Calendar.tsx`, `ui.tsx`, `dietPersistence.integration.test.ts`, `queryCost.test.ts`, `useDialog.ts`, `i18n.ts`, `PatientAccessModal.tsx`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _564 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Step4Nutritional.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11330049261083744 - nodes in this community are weakly interconnected._
- **Should `DietPlanDisplay.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13450292397660818 - nodes in this community are weakly interconnected._
- **Should `pdfExporter.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08465608465608465 - nodes in this community are weakly interconnected._
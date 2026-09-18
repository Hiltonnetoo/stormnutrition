# Graph Report - Isanutri V5  (2026-09-18)

## Corpus Check
- 259 files · ~227,168 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 9, .rules 2, .mdc 1)

## Summary
- 1609 nodes · 3912 edges · 111 communities (88 shown, 23 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 85 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `376ea62f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- icons.tsx
- LabExamsModule.tsx
- react-i18next
- pdfExporter.ts
- MealOptionTable.tsx
- ProgressBar.tsx
- firebaseService.ts
- useAuth
- metabolicCalculations.ts
- useLatestDiets.test.ts
- devDependencies
- App.tsx
- build-foods.mjs
- patientService.ts
- compilerOptions
- package.json
- Home.tsx
- measure-bundle.mjs
- PatientPortal.tsx
- scripts
- useDashboardData.ts
- dependencies
- manifest.json
- firestoreMeter.ts
- vite.config.ts
- 4. Etapas detalhadas
- AuthContext.tsx
- PatientProfile.tsx
- Patient
- dietAlgorithmService.ts
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- Patients.test.tsx
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
- getPatientDiets
- NewPatientModal.tsx
- dietService.test.ts
- 🛠️ Detalhamento
- react
- dateTime.ts
- appointmentService.ts
- dietService.ts
- @playwright/test
- types/index.ts
- ui.tsx
- ref_firebase_firestore
- Desempenho: consultas e carregamento
- queryCost.test.ts
- useDialog.ts
- i18n.ts
- 2. Roteiro de Avaliação Rápida (3 a 5 minutos)
- Step4Nutritional.tsx
- PatientAccessModal.tsx
- evaluationService.ts
- invitationService.ts
- patientMigrationService.ts
- syntheticScenario.ts
- Matriz de Baseline e Evidências — Storm Nutrition
- SelfEvaluationForm.tsx

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
- `1. Frontend Runtime & Strict Compiler Options` --references--> `ExportDietModal()`  [INFERRED]
  README.md → src/components/modals/ExportDietModal.tsx
- `Estados de interface (passo 7)` --references--> `ErrorState()`  [INFERRED]
  docs/accessibility.md → src/components/ui.tsx
- `Baseline antes das mudanças` --references--> `usePatientProfile()`  [INFERRED]
  docs/accessibility.md → src/hooks/usePatientProfile.ts
- `3.2 Identificadores de Correlação e Privacidade nos Logs` --references--> `safeLogError()`  [INFERRED]
  docs/deployment-and-config.md → src/utils/errors.ts

## Import Cycles
- None detected.

## Communities (111 total, 23 thin omitted)

### Community 0 - "icons.tsx"
Cohesion: 0.09
Nodes (22): EmailAdmin, Patients, AlertTriangleIcon(), BrainIcon(), ClipboardListIcon(), CloseIcon(), IconProps, LogInIcon() (+14 more)

### Community 1 - "LabExamsModule.tsx"
Cohesion: 0.14
Nodes (19): ClinicalTagSelector(), Props, TagOption, tags, DietCalculations, DietFormData, MacroSplit, MealSlot (+11 more)

### Community 2 - "react-i18next"
Cohesion: 0.10
Nodes (32): Diálogos (passos 1 e 2), react-dom, react-i18next, Dialog(), DialogProps, DietPlanDisplayProps, ExportDietModal, QuickCalculatorProps (+24 more)

### Community 3 - "pdfExporter.ts"
Cohesion: 0.09
Nodes (24): Resultados: bundle de produção, html2canvas, jspdf, ExportDietModal(), AMBER, AMBER_TEXT, buildCustomLayoutPdfDocument(), CustomLayoutPdfOptions (+16 more)

### Community 4 - "MealOptionTable.tsx"
Cohesion: 0.17
Nodes (12): MealOptionTable(), OptionTable(), parseAmounts(), parseFoodNames(), Props, MealOption, MealOptionItem, src_types_index_mealoption (+4 more)

### Community 5 - "ProgressBar.tsx"
Cohesion: 0.40
Nodes (3): ProgressBar(), ProgressBarProps, steps

### Community 6 - "firebaseService.ts"
Cohesion: 0.15
Nodes (18): 🟢 Passo 6 — Robustez do Portal do Paciente (NOVO) ✅ (concluído), ref_firebase_storage, createPatientAccount(), createPatientPortalProfile(), setupPatientPortalAccess(), updatePatientPortalRef(), updateUserProfile(), uploadProfilePicture() (+10 more)

### Community 7 - "useAuth"
Cohesion: 0.07
Nodes (60): 3.1 — Código e comentários em inglês ✅, 3.2 — i18n da UI: páginas e componentes ainda em PT ✅, 3.3 — Camadas de conteúdo (não são strings de UI — exigem abordagem própria) ✅, 🟡 Passo 2 — Testes Automatizados ⚠️ (parcial), 🟢 Passo 3 — Internacionalização ✅ (concluído), 13 — Reduzir responsabilidades das páginas grandes, @testing-library/react, vitest (+52 more)

### Community 8 - "metabolicCalculations.ts"
Cohesion: 0.19
Nodes (19): i18next, MetabolicCalculator, MetabolicCalculator(), ActivityLevel, activityMultipliers, calculateBMI(), calculateBMR(), calculateMacrosInGrams() (+11 more)

### Community 9 - "useLatestDiets.test.ts"
Cohesion: 0.21
Nodes (10): Sub, subs, useLatestDiets(), getDietCountSummary(), getDietsCollection(), handleSnapshotError(), saveDietPlan(), subscribeLatestDiet() (+2 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (26): devDependencies, @axe-core/playwright, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @firebase/rules-unit-testing, firebase-tools (+18 more)

### Community 11 - "App.tsx"
Cohesion: 0.09
Nodes (28): react-router-dom, AcceptInvitation, DietGenerator, FoodDatabase, Home, Login, PatientProfile, Register (+20 more)

### Community 12 - "build-foods.mjs"
Cohesion: 0.05
Nodes (41): Acessibilidade e estados de interface, Baseline antes das mudanças, Como verificar, Contraste, mobile e movimento (passo 6), Custo no bundle, Estados de interface (passo 7), Formulários e anúncios (passo 3), Gráficos (passo 5) (+33 more)

### Community 13 - "patientService.ts"
Cohesion: 0.18
Nodes (18): Patients(), db, addPatient(), archivePatient(), CascadeDeletionResult, deletePatient, deletePatientCascade(), DeletionProgress (+10 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 15 - "package.json"
Cohesion: 0.09
Nodes (24): engines, node, name, private, type, version, eslint, @eslint/js (+16 more)

### Community 17 - "measure-bundle.mjs"
Cohesion: 0.10
Nodes (24): ref_node_zlib, vite, assets, chunks, closure(), collectChunkGraph, composition, compositionSorted (+16 more)

### Community 18 - "PatientPortal.tsx"
Cohesion: 0.15
Nodes (13): Decisões e trade-offs, PatientPortal, PortalPasswordModal(), Props, RangeFilter, WeightEvolutionChart(), UsePatientPortalDataReturn, defaultPatientData (+5 more)

### Community 19 - "scripts"
Cohesion: 0.10
Nodes (20): scripts, build, demo:reset, demo:seed, dev, emulators, format, format:check (+12 more)

### Community 20 - "useDashboardData.ts"
Cohesion: 0.16
Nodes (21): ActivityIconKey, ActivityItem, buildMonthlyDietBuckets(), buildRecentActivity(), formatRelative(), MonthBucket, RECENT_ACTIVITY_LIMIT, PerformanceSectionProps (+13 more)

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
Cohesion: 0.12
Nodes (22): PortalWeightModal(), AuthContext, AuthContextType, AuthProvider(), createNutritionistProfile(), firebaseSignOut(), getNutritionistProfile(), getPatientPortalProfile() (+14 more)

### Community 27 - "PatientProfile.tsx"
Cohesion: 0.18
Nodes (11): LoadingState(), BiomarkerData, BiomarkerEvolutionChart(), BiomarkerEvolutionChartProps, DietComparisonModal(), ProfileDietsTab(), ProfileExamsTab(), ProfileTimelineTab() (+3 more)

### Community 28 - "Patient"
Cohesion: 0.13
Nodes (13): DietSuccessCardProps, NewPatientModalProps, PatientDietHistoryModalProps, Step1Props, Step3Props, Step5Props, Step6Props, Step6Summary() (+5 more)

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

### Community 35 - "Patients.test.tsx"
Cohesion: 0.11
Nodes (15): GlobalSearch(), DirectoryState, EMPTY, PatientDirectoryProvider(), auth, Consumer(), Listener, listeners (+7 more)

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
Cohesion: 0.15
Nodes (13): ClinicalContextCard(), ClinicalContextCardProps, modeTone, DietProgressBar(), DietProgressBarProps, Step3MealPlan(), DietSuccessCard(), DietTemplatesSection() (+5 more)

### Community 85 - "Dashboard.tsx"
Cohesion: 0.10
Nodes (25): Dashboard, src_components_dashboard_index_monthsummarycard, src_components_dashboard_index_onboardingbanner, src_components_dashboard_index_performancesection, src_components_dashboard_index_quickactionssection, src_components_dashboard_index_recentactivitycard, src_components_dashboard_index_statcard, MonthSummaryCard() (+17 more)

### Community 86 - "getPatientDiets"
Cohesion: 0.57
Nodes (5): usePatientPortalData(), usePatientProfile(), byNewestFirst(), getPatientDiets(), getPatientById()

### Community 87 - "NewPatientModal.tsx"
Cohesion: 0.21
Nodes (16): errBorder(), Step1Objectives(), Step1Props, Step2Nutrition(), initialFormData, Step1Personal(), errBorder(), errMsg() (+8 more)

### Community 88 - "dietService.test.ts"
Cohesion: 0.33
Nodes (11): isFiniteNumber(), sanitizeMeal(), sanitizeMealOption(), sanitizeMealOptionItem(), sanitizeMicronutrients(), validateAndSerializeDietPlan(), validateAndSerializeDietUpdate(), assertNoUndefined() (+3 more)

### Community 89 - "🛠️ Detalhamento"
Cohesion: 0.22
Nodes (8): ✅ Critério de "pronto para avaliação", 🛠️ Detalhamento, 🗺️ Ordem de Execução Sugerida (atualizada), 🟢 Passo 1 — TypeScript Strict ✅ (concluído), 🔵 Passo 4 — Segurança e CI/CD ✅ (concluído — revisar qualidade), 🟣 Passo 5 — Polimento, Organização e README ✅ (concluído), Plano de Preparação para Avaliação Tech Lead — Storm Nutrition V5, 📊 Status Verificado (resumo)

### Community 90 - "react"
Cohesion: 0.20
Nodes (12): react, AppShell(), Breadcrumbs(), BreadcrumbsProps, ChevronRightIcon(), HomeIcon(), SparklesIcon(), LanguageSelector() (+4 more)

### Community 91 - "dateTime.ts"
Cohesion: 0.33
Nodes (12): AdherenceCheckIn(), logAdherence(), DEFAULT_CLINIC_TIMEZONE, formatCivilDate(), getCivilDateFromDate(), getCivilMonthRange(), getCivilToday(), getIntlCivilFormatter() (+4 more)

### Community 92 - "appointmentService.ts"
Cohesion: 0.16
Nodes (22): Calendar(), addAppointment(), deleteAppointment(), findAppointmentConflict(), getAppointmentDoc(), getAppointmentsCollection(), getAppointmentsInRange(), getNextPatientAppointment() (+14 more)

### Community 93 - "dietService.ts"
Cohesion: 0.13
Nodes (20): GenerationResult, deleteDietPlan(), DietCountSummary, getDietDoc(), updateDietPlan(), CalculatedDietTotals, DecisionEntry, DietPlanFirestoreDto (+12 more)

### Community 95 - "types/index.ts"
Cohesion: 0.27
Nodes (7): Step6LabExams(), Step6Props, interpretTest(), labCategories, LabCategory, EmailLog, src_types_index_labtest

### Community 96 - "ui.tsx"
Cohesion: 0.11
Nodes (20): O que é verificado automaticamente, Calendar, Reports, ChartDataTable(), BadgeTone, ButtonProps, ButtonSize, buttonSizes (+12 more)

### Community 97 - "ref_firebase_firestore"
Cohesion: 0.19
Nodes (11): ref_firebase_app, ref_firebase_firestore, @firebase/rules-unit-testing, ref_node_fs, ref_node_path, ref_node_url, auth, fbApp (+3 more)

### Community 98 - "Desempenho: consultas e carregamento"
Cohesion: 0.18
Nodes (10): Antes (plano do commit `99e72fa`), Bundle, Como reproduzir, Consultas ao Firestore, Depois, Desempenho: consultas e carregamento, Método, O que não foi medido (+2 more)

### Community 99 - "queryCost.test.ts"
Cohesion: 0.17
Nodes (5): current, __dirname, holder, legacy, table()

### Community 100 - "useDialog.ts"
Cohesion: 0.16
Nodes (15): DialogPanel(), FOCUSABLE, focusInitial(), getFocusable(), isVisible(), lockScroll(), managedInert, OpenDialog (+7 more)

### Community 101 - "i18n.ts"
Cohesion: 0.06
Nodes (43): @emailjs/browser, ref_react_dom_client, App(), ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState, PortalDietsSection(), r() (+35 more)

### Community 102 - "2. Roteiro de Avaliação Rápida (3 a 5 minutos)"
Cohesion: 0.14
Nodes (13): 1. Personas e Credenciais Sintéticas, 2. Roteiro de Avaliação Rápida (3 a 5 minutos), 3. Identificação Explícita de Simulações vs. Backend Real, 4. Comandos de Inicialização e Reset de Dados, Executar Testes E2E Emulados, Guia de Demonstração Sintética e Identificação de Simulações, Inicializar Emuladores Locais, Passo 1: Acesso com Perfil Clínico (+5 more)

### Community 103 - "Step4Nutritional.tsx"
Cohesion: 0.20
Nodes (11): ModeOption, modes, ModeSelector(), Props, dietaryOptions, dietaryOptionsMap, goalOptions, Step4Nutritional() (+3 more)

### Community 104 - "PatientAccessModal.tsx"
Cohesion: 0.29
Nodes (7): PatientAccessModal(), Props, sendPortalPasswordReset(), getEmailConfig(), isEmailConfigured(), sendPortalAccessEmail(), src_types_index_patientinvitation

### Community 105 - "evaluationService.ts"
Cohesion: 0.13
Nodes (20): ProfileAssessmentTab(), ProfileAssessmentTabProps, CompleteEvaluationOptions, LogAdherenceOptions, LogWeightOptions, requestSelfEvaluation(), updatePatientSettings(), src_services_firebaseservice_user (+12 more)

### Community 106 - "invitationService.ts"
Cohesion: 0.39
Nodes (10): ref_firebase_auth, AcceptInvitation(), src_services_firebasecore_user, acceptInvitationWithExistingAccount(), acceptInvitationWithNewAccount(), computeInvitationStatus(), CreateInvitationParams, createOrGetPendingInvitation() (+2 more)

### Community 107 - "patientMigrationService.ts"
Cohesion: 0.57
Nodes (6): generateDeterministicId(), normalizeAdherenceEntry(), normalizePatientHistories(), normalizeSelfEvaluation(), normalizeWeightRecord(), mockPatient

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
- **554 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+549 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 734 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `icons.tsx`, `LabExamsModule.tsx`, `react-i18next`, `MealOptionTable.tsx`, `ProgressBar.tsx`, `useAuth`, `metabolicCalculations.ts`, `useLatestDiets.test.ts`, `App.tsx`, `package.json`, `Home.tsx`, `PatientPortal.tsx`, `useDashboardData.ts`, `AuthContext.tsx`, `PatientProfile.tsx`, `Patient`, `dietAlgorithmService.ts`, `Patients.test.tsx`, `ProfileHeader.tsx`, `DietGenerator.tsx`, `Dashboard.tsx`, `getPatientDiets`, `NewPatientModal.tsx`, `dateTime.ts`, `types/index.ts`, `ui.tsx`, `useDialog.ts`, `i18n.ts`, `Step4Nutritional.tsx`, `PatientAccessModal.tsx`, `evaluationService.ts`, `SelfEvaluationForm.tsx`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `react-i18next` to `icons.tsx`, `LabExamsModule.tsx`, `MealOptionTable.tsx`, `ProgressBar.tsx`, `useAuth`, `metabolicCalculations.ts`, `App.tsx`, `package.json`, `Home.tsx`, `PatientPortal.tsx`, `useDashboardData.ts`, `AuthContext.tsx`, `PatientProfile.tsx`, `Patient`, `dietAlgorithmService.ts`, `ProfileHeader.tsx`, `DietGenerator.tsx`, `Dashboard.tsx`, `NewPatientModal.tsx`, `react`, `dateTime.ts`, `types/index.ts`, `ui.tsx`, `i18n.ts`, `Step4Nutritional.tsx`, `PatientAccessModal.tsx`, `evaluationService.ts`, `SelfEvaluationForm.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `vitest` connect `useAuth` to `MealOptionTable.tsx`, `metabolicCalculations.ts`, `useLatestDiets.test.ts`, `patientService.ts`, `package.json`, `PatientPortal.tsx`, `AuthContext.tsx`, `dietAlgorithmService.ts`, `Patients.test.tsx`, `getPatientDiets`, `dietService.test.ts`, `react`, `dateTime.ts`, `appointmentService.ts`, `ui.tsx`, `ref_firebase_firestore`, `queryCost.test.ts`, `useDialog.ts`, `i18n.ts`, `evaluationService.ts`, `invitationService.ts`, `patientMigrationService.ts`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _554 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `icons.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0855614973262032 - nodes in this community are weakly interconnected._
- **Should `LabExamsModule.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14333333333333334 - nodes in this community are weakly interconnected._
- **Should `react-i18next` be split into smaller, more focused modules?**
  _Cohesion score 0.09863945578231292 - nodes in this community are weakly interconnected._
# Graph Report - Isanutri V5  (2026-09-18)

## Corpus Check
- 260 files · ~234,832 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 9, .rules 2, .mdc 1)

## Summary
- 1637 nodes · 3944 edges · 107 communities (81 shown, 26 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 88 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `87bb9266`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Calendar.tsx
- Step4Nutritional.tsx
- useAuth
- pdfExporter.ts
- MealOptionTable.tsx
- ProgressBar.tsx
- firebaseService.ts
- DietGenerator.tsx
- metabolicCalculations.ts
- 9. Adendo de revisão — correções ainda necessárias (18/09/2026)
- devDependencies
- Patients.tsx
- build-foods.mjs
- patientService.ts
- compilerOptions
- package.json
- Home.tsx
- measure-bundle.mjs
- AnyDietPlan
- scripts
- practiceStats.ts
- dependencies
- manifest.json
- firestoreMeter.ts
- vite.config.ts
- 4. Etapas detalhadas
- AuthContext.tsx
- O que precisa ser feito — Storm Nutrition
- ref_firebase_firestore
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
- pdfExporter.test.ts
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
- 01 — Estabelecer baseline e corrigir o controle de status
- icons.tsx
- 02 — Tornar instalação, emuladores e CI reproduzíveis
- NewPatientModal.tsx
- dietService.ts
- 🛠️ Detalhamento
- AppShell.tsx
- 03 — Corrigir o contrato de persistência das dietas
- types/index.ts
- diet.ts
- @playwright/test
- Step6LabExams.tsx
- react
- dietPersistence.integration.test.ts
- Desempenho: consultas e carregamento
- queryCost.test.ts
- useDialog.ts
- i18n.ts
- Index of Architectural Decisions
- dietForm.types.ts
- useDashboardData.ts
- PatientAccessModal.tsx
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
- `Estados de interface (passo 7)` --references--> `ErrorState()`  [INFERRED]
  docs/accessibility.md → src/components/ui.tsx
- `Baseline antes das mudanças` --references--> `usePatientProfile()`  [INFERRED]
  docs/accessibility.md → src/hooks/usePatientProfile.ts
- `C06 — Completar validação de metas, alternativas e dados desconhecidos` --references--> `validateDietPlan()`  [INFERRED]
  o-que-precisa-ser-feito.md → src/services/dietAlgorithmService.ts

## Import Cycles
- None detected.

## Communities (107 total, 26 thin omitted)

### Community 0 - "Calendar.tsx"
Cohesion: 0.15
Nodes (26): ApptModalProps, Calendar(), TYPE_DOT, TYPE_LIGHT, addAppointment(), deleteAppointment(), findAppointmentConflict(), getAppointmentDoc() (+18 more)

### Community 1 - "Step4Nutritional.tsx"
Cohesion: 0.12
Nodes (22): ClinicalTagSelector(), Props, TagOption, tags, LabExamsModule(), Props, suggestionsByMode, suggestionsByTag (+14 more)

### Community 2 - "useAuth"
Cohesion: 0.09
Nodes (35): Diálogos (passos 1 e 2), 3.2 — i18n da UI: páginas e componentes ainda em PT ✅, 13 — Reduzir responsabilidades das páginas grandes, DietPlanDisplayProps, ExportDietModal, DietPlanViewer(), DietPlanViewerProps, isV2Plan() (+27 more)

### Community 3 - "pdfExporter.ts"
Cohesion: 0.11
Nodes (18): html2canvas, jspdf, AMBER, AMBER_TEXT, CustomLayoutPdfOptions, FAINT, HAIR, INK (+10 more)

### Community 4 - "MealOptionTable.tsx"
Cohesion: 0.29
Nodes (8): MealOptionTable(), OptionTable(), parseAmounts(), parseFoodNames(), Props, MealOption, src_types_index_mealoption, src_types_index_mealoptionitem

### Community 5 - "ProgressBar.tsx"
Cohesion: 0.40
Nodes (3): ProgressBar(), ProgressBarProps, steps

### Community 6 - "firebaseService.ts"
Cohesion: 0.13
Nodes (22): 🟢 Passo 6 — Robustez do Portal do Paciente (NOVO) ✅ (concluído), ref_firebase_storage, getFriendlyErrorMessage(), Register(), createNutritionistProfile(), createPatientAccount(), createPatientPortalProfile(), setupPatientPortalAccess() (+14 more)

### Community 7 - "DietGenerator.tsx"
Cohesion: 0.06
Nodes (63): 🟡 Passo 2 — Testes Automatizados ⚠️ (parcial), @testing-library/react, vitest, ClinicalContextCard(), ClinicalContextCardProps, modeTone, DietPlanDisplay(), DietProgressBar() (+55 more)

### Community 8 - "metabolicCalculations.ts"
Cohesion: 0.20
Nodes (18): i18next, MetabolicCalculator(), ActivityLevel, activityMultipliers, calculateBMI(), calculateBMR(), calculateMacrosInGrams(), calculateTargetCalories() (+10 more)

### Community 9 - "9. Adendo de revisão — correções ainda necessárias (18/09/2026)"
Cohesion: 0.12
Nodes (16): 9.1. Como outra IA deve utilizar este adendo, 9.2. Ordem de execução das correções, 9.3. Checklist de encerramento deste adendo, 9. Adendo de revisão — correções ainda necessárias (18/09/2026), C01 — Impedir vínculos autodeclarados e apropriação de portal, C02 — Proteger conteúdo e autoria dos históricos, C03 — Tornar convites atômicos, idempotentes e recuperáveis, C04 — Corrigir Java, configuração sintética e reprodução em checkout limpo (+8 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (26): devDependencies, @axe-core/playwright, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @firebase/rules-unit-testing, firebase-tools (+18 more)

### Community 11 - "Patients.tsx"
Cohesion: 0.07
Nodes (36): ref_firebase_auth, react-router-dom, AcceptInvitation, Calendar, DietGenerator, EmailAdmin, FoodDatabase, Home (+28 more)

### Community 12 - "build-foods.mjs"
Cohesion: 0.10
Nodes (26): Acessibilidade e estados de interface, Baseline antes das mudanças, Como verificar, Contraste, mobile e movimento (passo 6), Custo no bundle, Estados de interface (passo 7), Formulários e anúncios (passo 3), Gráficos (passo 5) (+18 more)

### Community 13 - "patientService.ts"
Cohesion: 0.18
Nodes (18): Patients(), addPatient(), archivePatient(), CascadeDeletionResult, countPatients(), deletePatient, deletePatientCascade(), DeletionProgress (+10 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 15 - "package.json"
Cohesion: 0.09
Nodes (24): engines, node, name, private, type, version, eslint, @eslint/js (+16 more)

### Community 17 - "measure-bundle.mjs"
Cohesion: 0.10
Nodes (24): ref_node_zlib, vite, assets, chunks, closure(), collectChunkGraph, composition, compositionSorted (+16 more)

### Community 18 - "AnyDietPlan"
Cohesion: 0.23
Nodes (10): Sub, subs, useLatestDiets(), getDietsCollection(), handleSnapshotError(), subscribeLatestDiet(), subscribeRecentDiets(), toDietPlan() (+2 more)

### Community 19 - "scripts"
Cohesion: 0.10
Nodes (20): scripts, build, demo:reset, demo:seed, dev, emulators, format, format:check (+12 more)

### Community 20 - "practiceStats.ts"
Cohesion: 0.23
Nodes (11): useDashboardData(), Reports(), getDietCountSummary(), getRecentMonthRanges(), countCreatedPerMonth(), PatientSummary, summarizePatients(), toTime() (+3 more)

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
Cohesion: 0.12
Nodes (17): 04 — Tratar autenticação como fluxo com estados explícitos, 05 — Isolar rascunhos e configurações por conta, 06 — Fortalecer autorização e validação de dados, 07 — Substituir envio de senha por convite seguro, 08 — Tornar restrições e dados alimentares explícitos, 09 — Validar o resultado final do gerador, 10 — Corrigir concorrência, históricos e calendário, 11 — Definir arquivamento, exclusão e revogação (+9 more)

### Community 26 - "AuthContext.tsx"
Cohesion: 0.18
Nodes (14): AuthContext, AuthContextType, getNutritionistProfile(), src_services_firebaseservice_onauthstatechanged, src_services_firebaseservice_user, AuthError, AuthStatus, InvitationStatus (+6 more)

### Community 27 - "O que precisa ser feito — Storm Nutrition"
Cohesion: 0.17
Nodes (11): 1. Objetivo e contexto para quem vai implementar, 2. Instruções de execução para outra IA ou desenvolvedor, 3. Ordem de prioridade, 5. Sequência sugerida de PRs, 6. Critérios finais de pronto para avaliação, 7. Escopo que não deve crescer automaticamente, 8. Estimativa de planejamento, Documentação consultada (+3 more)

### Community 28 - "ref_firebase_firestore"
Cohesion: 0.33
Nodes (4): ref_firebase_app, ref_firebase_firestore, auth, fbApp

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
Cohesion: 0.08
Nodes (28): Decisões e trade-offs, DietSuccessCardProps, NewPatientModalProps, Props, PatientDietHistoryModalProps, Step1Props, Step3Props, Step6Props (+20 more)

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

### Community 41 - "pdfExporter.test.ts"
Cohesion: 0.17
Nodes (12): Step3MealPlan(), PortalDietsSection(), r(), MealOptionItem, src_types_index_meal, translateMealName(), buildCustomLayoutPdfDocument(), ClinicInfo (+4 more)

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

### Community 85 - "icons.tsx"
Cohesion: 0.07
Nodes (36): Dashboard, src_components_dashboard_index_monthsummarycard, src_components_dashboard_index_onboardingbanner, src_components_dashboard_index_performancesection, src_components_dashboard_index_quickactionssection, src_components_dashboard_index_recentactivitycard, src_components_dashboard_index_statcard, MonthSummaryCard() (+28 more)

### Community 87 - "NewPatientModal.tsx"
Cohesion: 0.22
Nodes (15): errBorder(), Step1Objectives(), Step2Nutrition(), initialFormData, Step1Personal(), errBorder(), errMsg(), Step2Contact() (+7 more)

### Community 88 - "dietService.ts"
Cohesion: 0.20
Nodes (19): getDietDoc(), isFiniteNumber(), sanitizeMeal(), sanitizeMealOption(), sanitizeMealOptionItem(), sanitizeMicronutrients(), saveDietPlan(), updateDietPlan() (+11 more)

### Community 89 - "🛠️ Detalhamento"
Cohesion: 0.17
Nodes (11): 3.1 — Código e comentários em inglês ✅, 3.3 — Camadas de conteúdo (não são strings de UI — exigem abordagem própria) ✅, ✅ Critério de "pronto para avaliação", 🛠️ Detalhamento, 🗺️ Ordem de Execução Sugerida (atualizada), 🟢 Passo 1 — TypeScript Strict ✅ (concluído), 🟢 Passo 3 — Internacionalização ✅ (concluído), 🔵 Passo 4 — Segurança e CI/CD ✅ (concluído — revisar qualidade) (+3 more)

### Community 90 - "AppShell.tsx"
Cohesion: 0.18
Nodes (11): AppShell(), Breadcrumbs(), BreadcrumbsProps, CloseIcon(), HomeIcon(), SparklesIcon(), LanguageSelector(), DemoGuideModal() (+3 more)

### Community 92 - "types/index.ts"
Cohesion: 0.07
Nodes (56): AdherenceCheckIn(), PortalPasswordModal(), PortalWeightModal(), SelfEvaluationForm(), Props, RangeFilter, WeightEvolutionChart(), TestConsumer() (+48 more)

### Community 93 - "diet.ts"
Cohesion: 0.20
Nodes (11): GenerationResult, CalculatedDietTotals, DecisionEntry, DietPlanFirestoreDto, DietPlanUpdateDto, Meal, PlanValidationIssue, PlanValidationResult (+3 more)

### Community 95 - "Step6LabExams.tsx"
Cohesion: 0.36
Nodes (7): Step6LabExams(), Step6Props, interpretTest(), labCategories, LabCategory, LabTest, src_types_index_labtest

### Community 96 - "react"
Cohesion: 0.08
Nodes (41): O que é verificado automaticamente, react, react-dom, react-i18next, PatientProfile, ChartDataTable(), PerformanceSection(), StatCard() (+33 more)

### Community 97 - "dietPersistence.integration.test.ts"
Cohesion: 0.33
Nodes (7): @firebase/rules-unit-testing, ref_node_fs, ref_node_path, ref_node_url, nutriDb(), __dirname, __dirname

### Community 98 - "Desempenho: consultas e carregamento"
Cohesion: 0.17
Nodes (11): Antes (plano do commit `99e72fa`), Bundle, Como reproduzir, Consultas ao Firestore, Depois, Desempenho: consultas e carregamento, Método, O que não foi medido (+3 more)

### Community 99 - "queryCost.test.ts"
Cohesion: 0.14
Nodes (14): current, __dirname, holder, legacy, table(), buildDietTemplate(), buildPatient(), localWallTime() (+6 more)

### Community 100 - "useDialog.ts"
Cohesion: 0.16
Nodes (15): DialogPanel(), FOCUSABLE, focusInitial(), getFocusable(), isVisible(), lockScroll(), managedInert, OpenDialog (+7 more)

### Community 101 - "i18n.ts"
Cohesion: 0.05
Nodes (49): @emailjs/browser, ref_react_dom_client, App(), ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState, modeTone, ProfileHeader() (+41 more)

### Community 102 - "Index of Architectural Decisions"
Cohesion: 0.05
Nodes (38): ADR-01: React 19 SPA with Strict TypeScript and Code-Splitting, ADR-02: Native Compile-Time Tailwind CSS v4, ADR-03: Secondary Firebase Auth Instance for Non-Disruptive Patient Provisioning, ADR-04: Passwordless Tokenized Invitations with Patient-Defined Passwords, ADR-05: Multi-Tenant Isolation via Firestore Security Rules, ADR-06: Deterministic Constraint-Based Meal Generation over Generative AI, ADR-07: Vector-Based Editorial PDF Exporting, ADR-08: Architectural Decoupling of Local Billing Simulation (+30 more)

### Community 103 - "dietForm.types.ts"
Cohesion: 0.30
Nodes (8): DietCalculations, DietFormData, MacroSplit, MealSlot, Step1Props, Step2Props, mealCalorieDistribution, Step3Props

### Community 104 - "useDashboardData.ts"
Cohesion: 0.21
Nodes (13): ActivityIconKey, ActivityItem, buildMonthlyDietBuckets(), buildRecentActivity(), formatRelative(), MonthBucket, RECENT_ACTIVITY_LIMIT, PerformanceSectionProps (+5 more)

### Community 106 - "PatientAccessModal.tsx"
Cohesion: 0.24
Nodes (14): PatientAccessModal(), AcceptInvitation(), sendPortalPasswordReset(), src_services_firebasecore_user, acceptInvitationWithExistingAccount(), acceptInvitationWithNewAccount(), computeInvitationStatus(), CreateInvitationParams (+6 more)

### Community 109 - "Matriz de Baseline e Evidências — Storm Nutrition"
Cohesion: 0.25
Nodes (7): 1. Ambiente e Ferramentas Medidas, 2. Verificação da Nota Histórica do Prettier, 3. Matriz de Achados vs. Evidências no Código, 4. Estado da Integração Contínua (CI), Matriz de Baseline e Evidências — Storm Nutrition, getPatientPortalProfile(), db()

## Knowledge Gaps
- **576 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+571 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 754 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Calendar.tsx`, `Step4Nutritional.tsx`, `useAuth`, `MealOptionTable.tsx`, `ProgressBar.tsx`, `DietGenerator.tsx`, `metabolicCalculations.ts`, `Patients.tsx`, `package.json`, `Home.tsx`, `AnyDietPlan`, `AuthContext.tsx`, `dietAlgorithmService.ts`, `Patient`, `pdfExporter.test.ts`, `icons.tsx`, `NewPatientModal.tsx`, `AppShell.tsx`, `types/index.ts`, `Step6LabExams.tsx`, `useDialog.ts`, `i18n.ts`, `dietForm.types.ts`, `useDashboardData.ts`, `PatientAccessModal.tsx`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `react` to `Calendar.tsx`, `Step4Nutritional.tsx`, `useAuth`, `MealOptionTable.tsx`, `ProgressBar.tsx`, `DietGenerator.tsx`, `metabolicCalculations.ts`, `Patients.tsx`, `package.json`, `Home.tsx`, `dietAlgorithmService.ts`, `Patient`, `pdfExporter.test.ts`, `icons.tsx`, `NewPatientModal.tsx`, `AppShell.tsx`, `types/index.ts`, `Step6LabExams.tsx`, `i18n.ts`, `dietForm.types.ts`, `useDashboardData.ts`, `PatientAccessModal.tsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `vitest` connect `DietGenerator.tsx` to `Calendar.tsx`, `MealOptionTable.tsx`, `metabolicCalculations.ts`, `patientService.ts`, `package.json`, `AnyDietPlan`, `practiceStats.ts`, `dietAlgorithmService.ts`, `Patient`, `pdfExporter.test.ts`, `dietService.ts`, `AppShell.tsx`, `types/index.ts`, `react`, `dietPersistence.integration.test.ts`, `queryCost.test.ts`, `useDialog.ts`, `i18n.ts`, `PatientAccessModal.tsx`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _576 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Calendar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14623655913978495 - nodes in this community are weakly interconnected._
- **Should `Step4Nutritional.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11965811965811966 - nodes in this community are weakly interconnected._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.09371980676328502 - nodes in this community are weakly interconnected._
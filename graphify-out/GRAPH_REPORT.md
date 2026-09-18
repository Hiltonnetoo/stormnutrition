# Graph Report - Isanutri V5  (2026-09-18)

## Corpus Check
- 265 files · ~243,747 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 9, .rules 2, .mdc 1)

## Summary
- 1675 nodes · 4028 edges · 120 communities (94 shown, 26 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 88 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e3742a23`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Patients.tsx
- 3.2 — i18n da UI: páginas e componentes ainda em PT ✅
- Patient
- pdfExporter.ts
- evaluationService.ts
- react
- firebaseService.ts
- DietGenerator.tsx
- DietPlanViewer.tsx
- 9. Adendo de revisão — correções ainda necessárias (18/09/2026)
- devDependencies
- Login.tsx
- build-foods.mjs
- patientService.ts
- compilerOptions
- package.json
- Home.tsx
- measure-bundle.mjs
- useDashboardData.ts
- scripts
- EmailAdmin.tsx
- dependencies
- manifest.json
- firestoreMeter.ts
- vite.config.ts
- 4. Etapas detalhadas
- AuthContext.tsx
- O que precisa ser feito — Storm Nutrition
- react-i18next
- foodService.ts
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- types/index.ts
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- getPatientDiets
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
- Dashboard.tsx
- 02 — Tornar instalação, emuladores e CI reproduzíveis
- NewPatientModal.tsx
- dietService.ts
- icons.tsx
- AppShell.tsx
- 03 — Corrigir o contrato de persistência das dietas
- Calendar.tsx
- dietAlgorithmService.ts
- @playwright/test
- foodService.test.ts
- ui.tsx
- vitest
- emailService.ts
- queryCost.test.ts
- useDialog.ts
- ErrorBoundary.tsx
- Index of Architectural Decisions
- Reports.tsx
- Sidebar.tsx
- configValidation.ts
- AcceptInvitation.tsx
- dateTime.ts
- PatientProfile.tsx
- Matriz de Baseline e Evidências — Storm Nutrition
- food.ts
- PatientPortal.tsx
- PatientAccessModal.tsx
- locale.ts
- errors.ts
- i18n.ts
- App.tsx
- patientMigrationService.ts
- foods.ts
- Acessibilidade e estados de interface

## God Nodes (most connected - your core abstractions)
1. `react` - 106 edges
2. `react-i18next` - 77 edges
3. `Patient` - 70 edges
4. `useAuth()` - 49 edges
5. `vitest` - 42 edges
6. `DietPlan` - 30 edges
7. `Button` - 26 edges
8. `scripts` - 22 edges
9. `react-router-dom` - 22 edges
10. `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Baseline antes das mudanças` --references--> `usePatientProfile()`  [INFERRED]
  docs/accessibility.md → src/hooks/usePatientProfile.ts
- `C06 — Completar validação de metas, alternativas e dados desconhecidos` --references--> `validateDietPlan()`  [INFERRED]
  o-que-precisa-ser-feito.md → src/services/dietAlgorithmService.ts
- `C05 — Atualizar refeições, totais, validação e rastreabilidade juntos` --references--> `validateAndSerializeDietUpdate()`  [INFERRED]
  o-que-precisa-ser-feito.md → src/services/dietService.ts
- `C03 — Tornar convites atômicos, idempotentes e recuperáveis` --references--> `acceptInvitationWithNewAccount()`  [INFERRED]
  o-que-precisa-ser-feito.md → src/services/invitationService.ts
- `3.2 Identificadores de Correlação e Privacidade nos Logs` --references--> `safeLogError()`  [INFERRED]
  docs/deployment-and-config.md → src/utils/errors.ts

## Import Cycles
- None detected.

## Communities (120 total, 26 thin omitted)

### Community 0 - "Patients.tsx"
Cohesion: 0.12
Nodes (21): Diálogos (passos 1 e 2), Teclado e foco visível (passo 4), react-dom, react-router-dom, Dialog(), DialogProps, DocumentTextIcon(), DownloadIcon() (+13 more)

### Community 1 - "3.2 — i18n da UI: páginas e componentes ainda em PT ✅"
Cohesion: 0.06
Nodes (46): 3.1 — Código e comentários em inglês ✅, 3.2 — i18n da UI: páginas e componentes ainda em PT ✅, 3.3 — Camadas de conteúdo (não são strings de UI — exigem abordagem própria) ✅, ✅ Critério de "pronto para avaliação", 🛠️ Detalhamento, 🗺️ Ordem de Execução Sugerida (atualizada), 🟢 Passo 1 — TypeScript Strict ✅ (concluído), 🟢 Passo 3 — Internacionalização ✅ (concluído) (+38 more)

### Community 2 - "Patient"
Cohesion: 0.15
Nodes (17): DietPlanViewerProps, ClinicalReviewModalProps, ExportDietModalProps, NewPatientModalProps, PatientDietHistoryModalProps, Step1Props, Step3Props, Step5Props (+9 more)

### Community 3 - "pdfExporter.ts"
Cohesion: 0.05
Nodes (46): Antes (plano do commit `99e72fa`), Bundle, Como reproduzir, Consultas ao Firestore, Depois, Desempenho: consultas e carregamento, Método, O que não foi medido (+38 more)

### Community 4 - "evaluationService.ts"
Cohesion: 0.13
Nodes (18): patient, ProfileAssessmentTab(), CompleteEvaluationOptions, completeSelfEvaluation(), LogAdherenceOptions, LogWeightOptions, requestSelfEvaluation(), updatePatientSettings() (+10 more)

### Community 5 - "react"
Cohesion: 0.15
Nodes (9): react, QuickCalculatorProps, DemoGuideModal(), DemoGuideModalProps, ProgressBar(), ProgressBarProps, steps, SelfEvaluationForm() (+1 more)

### Community 6 - "firebaseService.ts"
Cohesion: 0.19
Nodes (16): AuthProvider(), createNutritionistProfile(), createPatientAccount(), firebaseSignOut(), getNutritionistProfile(), getPatientPortalProfile(), setupPatientPortalAccess(), updatePatientPortalRef() (+8 more)

### Community 7 - "DietGenerator.tsx"
Cohesion: 0.05
Nodes (72): 🟡 Passo 2 — Testes Automatizados ⚠️ (parcial), 13 — Reduzir responsabilidades das páginas grandes, ref_firebase_storage, @testing-library/react, Settings, ClinicalContextCard(), ClinicalContextCardProps, modeTone (+64 more)

### Community 8 - "DietPlanViewer.tsx"
Cohesion: 0.16
Nodes (22): i18next, MetabolicCalculator, DietPlanViewer(), isV2Plan(), PageHeader(), MetabolicCalculator(), ActivityLevel, activityMultipliers (+14 more)

### Community 9 - "9. Adendo de revisão — correções ainda necessárias (18/09/2026)"
Cohesion: 0.13
Nodes (15): 9.1. Como outra IA deve utilizar este adendo, 9.2. Ordem de execução das correções, 9.3. Checklist de encerramento deste adendo, 9. Adendo de revisão — correções ainda necessárias (18/09/2026), C01 — Impedir vínculos autodeclarados e apropriação de portal, C02 — Proteger conteúdo e autoria dos históricos, C03 — Tornar convites atômicos, idempotentes e recuperáveis, C04 — Corrigir Java, configuração sintética e reprodução em checkout limpo (+7 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (26): devDependencies, @axe-core/playwright, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @firebase/rules-unit-testing, firebase-tools (+18 more)

### Community 11 - "Login.tsx"
Cohesion: 0.14
Nodes (18): Login, Register, AuthLayout(), AuthLayoutProps, CheckCircleIcon(), EyeIcon(), EyeOffIcon(), GoogleIcon() (+10 more)

### Community 12 - "build-foods.mjs"
Cohesion: 0.21
Nodes (14): Formulários e anúncios (passo 3), buildColumnIndex(), CANONICAL_CATEGORIES, CATEGORY_MAP, COLUMN_MAP, FOOD_NAME_TRANSLATIONS, inferNova(), main() (+6 more)

### Community 13 - "patientService.ts"
Cohesion: 0.13
Nodes (18): PatientDirectoryProvider(), Patients(), latestDietListeners, roster, addPatient(), archivePatient(), CascadeDeletionResult, countPatients() (+10 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 15 - "package.json"
Cohesion: 0.09
Nodes (24): engines, node, name, private, type, version, eslint, @eslint/js (+16 more)

### Community 17 - "measure-bundle.mjs"
Cohesion: 0.10
Nodes (24): ref_node_zlib, vite, assets, chunks, closure(), collectChunkGraph, composition, compositionSorted (+16 more)

### Community 18 - "useDashboardData.ts"
Cohesion: 0.17
Nodes (17): ActivityItem, buildMonthlyDietBuckets(), buildRecentActivity(), formatRelative(), MonthBucket, RECENT_ACTIVITY_LIMIT, PerformanceSectionProps, Sub (+9 more)

### Community 19 - "scripts"
Cohesion: 0.09
Nodes (22): scripts, build, demo:reset, demo:seed, dev, dev:emulated, dev:emulator, emulators (+14 more)

### Community 20 - "EmailAdmin.tsx"
Cohesion: 0.21
Nodes (11): 🟣 Passo 5 — Polimento, Organização e README ✅ (concluído), EmailAdmin, PaperAirplaneIcon(), GlobalSearch(), Consumer(), usePatientDirectory(), EmailAdmin(), Reports() (+3 more)

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
Cohesion: 0.32
Nodes (5): ref_path, @tailwindcss/vite, @vitejs/plugin-react, ref_vitest_config, EMULATOR_ENV_DIR

### Community 25 - "4. Etapas detalhadas"
Cohesion: 0.12
Nodes (17): 04 — Tratar autenticação como fluxo com estados explícitos, 05 — Isolar rascunhos e configurações por conta, 06 — Fortalecer autorização e validação de dados, 07 — Substituir envio de senha por convite seguro, 08 — Tornar restrições e dados alimentares explícitos, 09 — Validar o resultado final do gerador, 10 — Corrigir concorrência, históricos e calendário, 11 — Definir arquivamento, exclusão e revogação (+9 more)

### Community 26 - "AuthContext.tsx"
Cohesion: 0.15
Nodes (16): AuthContext, AuthContextType, src_services_firebaseservice_onauthstatechanged, src_services_firebaseservice_user, AuthError, AuthStatus, InvitationStatus, NutritionistProfile (+8 more)

### Community 27 - "O que precisa ser feito — Storm Nutrition"
Cohesion: 0.17
Nodes (11): 1. Objetivo e contexto para quem vai implementar, 2. Instruções de execução para outra IA ou desenvolvedor, 3. Ordem de prioridade, 5. Sequência sugerida de PRs, 6. Critérios finais de pronto para avaliação, 7. Escopo que não deve crescer automaticamente, 8. Estimativa de planejamento, Documentação consultada (+3 more)

### Community 28 - "react-i18next"
Cohesion: 0.19
Nodes (10): Contraste, mobile e movimento (passo 6), Custo no bundle, Gráficos (passo 5), Mudanças, react-i18next, ChartDataTable(), ProfileEvolutionTab(), ProfileEvolutionTabProps (+2 more)

### Community 29 - "foodService.ts"
Cohesion: 0.10
Nodes (24): FoodDatabase, SearchIcon(), brazilianFoods, FoodDatabase(), foodCategories, getAvailableCarbs(), getFoodCategoryName(), getFoodName() (+16 more)

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

### Community 35 - "types/index.ts"
Cohesion: 0.24
Nodes (8): DirectoryState, EMPTY, auth, Listener, listeners, PatientDirectoryContext, PatientDirectoryStatus, PatientDirectoryValue

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

### Community 41 - "getPatientDiets"
Cohesion: 0.30
Nodes (10): usePatientProfile(), byNewestFirst(), getDietsCollection(), getPatientDiets(), handleSnapshotError(), saveDietPlan(), subscribeLatestDiet(), subscribeRecentDiets() (+2 more)

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

### Community 85 - "Dashboard.tsx"
Cohesion: 0.10
Nodes (24): ActivityIconKey, src_components_dashboard_index_monthsummarycard, src_components_dashboard_index_onboardingbanner, src_components_dashboard_index_performancesection, src_components_dashboard_index_quickactionssection, src_components_dashboard_index_recentactivitycard, src_components_dashboard_index_statcard, MonthSummaryCard() (+16 more)

### Community 87 - "NewPatientModal.tsx"
Cohesion: 0.17
Nodes (17): errBorder(), Step1Objectives(), Step2Nutrition(), initialFormData, Step1Personal(), errBorder(), errMsg(), Step2Contact() (+9 more)

### Community 88 - "dietService.ts"
Cohesion: 0.23
Nodes (21): getDietDoc(), isFiniteNumber(), recalculateDietTotals(), sanitizeCalculatedTotals(), sanitizeDecisionLog(), sanitizeLabExams(), sanitizeMeal(), sanitizeMealOption() (+13 more)

### Community 89 - "icons.tsx"
Cohesion: 0.14
Nodes (14): DietPlanDisplayProps, ExportDietModal, AlertTriangleIcon(), BrainIcon(), ClipboardListIcon(), ClockIcon(), CreditCardIcon(), IconProps (+6 more)

### Community 90 - "AppShell.tsx"
Cohesion: 0.23
Nodes (9): AppShell(), Breadcrumbs(), BreadcrumbsProps, CloseIcon(), HomeIcon(), SparklesIcon(), LanguageSelector(), routeNameKey() (+1 more)

### Community 92 - "Calendar.tsx"
Cohesion: 0.15
Nodes (26): ApptModalProps, Calendar(), TYPE_DOT, TYPE_LIGHT, addAppointment(), deleteAppointment(), findAppointmentConflict(), getAppointmentDoc() (+18 more)

### Community 93 - "dietAlgorithmService.ts"
Cohesion: 0.11
Nodes (25): createPrng(), dietTemplates, GenerationParams, GenerationResult, hashStringToSeed(), DietType, CalculatedDietTotals, DecisionEntry (+17 more)

### Community 95 - "foodService.test.ts"
Cohesion: 0.29
Nodes (14): generateAlgorithmicDietPlan(), InfeasiblePlanError, validateDietPlan(), validateGenerationParams(), evaluateFoodRestriction(), foodContainsDairy(), foodContainsGluten(), foodContainsLactose() (+6 more)

### Community 96 - "ui.tsx"
Cohesion: 0.13
Nodes (20): Estados de interface (passo 7), O que é verificado automaticamente, StatCardProps, DietSuccessCardProps, BadgeTone, ButtonProps, ButtonSize, buttonSizes (+12 more)

### Community 97 - "vitest"
Cohesion: 0.20
Nodes (10): ref_node_fs, ref_node_path, ref_node_url, vitest, batchDeletions, mockStore, src_types_index_dietplan, nutriDb() (+2 more)

### Community 98 - "emailService.ts"
Cohesion: 0.22
Nodes (14): ADR-09: Safe Interception of Demo Emails and Multi-Layer Abuse Controls, C10 — Bloquear todo envio externo em testes e demo isolada, @emailjs/browser, clearEmailRateLimits(), DEMO_DOMAINS, DietEmailParams, enforceAbuseControls(), getEmailConfig() (+6 more)

### Community 99 - "queryCost.test.ts"
Cohesion: 0.14
Nodes (14): current, __dirname, holder, legacy, table(), buildDietTemplate(), buildPatient(), localWallTime() (+6 more)

### Community 100 - "useDialog.ts"
Cohesion: 0.16
Nodes (15): DialogPanel(), FOCUSABLE, focusInitial(), getFocusable(), isVisible(), lockScroll(), managedInert, OpenDialog (+7 more)

### Community 101 - "ErrorBoundary.tsx"
Cohesion: 0.17
Nodes (5): ref_react_dom_client, App(), ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState

### Community 102 - "Index of Architectural Decisions"
Cohesion: 0.05
Nodes (37): ADR-01: React 19 SPA with Strict TypeScript and Code-Splitting, ADR-02: Native Compile-Time Tailwind CSS v4, ADR-03: Secondary Firebase Auth Instance for Non-Disruptive Patient Provisioning, ADR-04: Passwordless Tokenized Invitations with Patient-Defined Passwords, ADR-05: Multi-Tenant Isolation via Firestore Security Rules, ADR-06: Deterministic Constraint-Based Meal Generation over Generative AI, ADR-07: Vector-Based Editorial PDF Exporting, ADR-08: Architectural Decoupling of Local Billing Simulation (+29 more)

### Community 103 - "Reports.tsx"
Cohesion: 0.17
Nodes (10): Reports, DietCountSummary, MonthInstantRange, countCreatedPerMonth(), PatientSummary, summarizePatients(), toTime(), months (+2 more)

### Community 104 - "Sidebar.tsx"
Cohesion: 0.14
Nodes (8): Decisões e trade-offs, LogInIcon(), TargetIcon(), deriveNotifications(), NavItemProps, NotificationBell(), NotifItem, Sidebar()

### Community 105 - "configValidation.ts"
Cohesion: 0.14
Nodes (16): config, rootElement, ConfigValidationResult, DEMO_PROJECT_ID, DEMO_PROJECT_PREFIX, getRuntimeEnv(), REQUIRED_FIREBASE_KEYS, runStartupDiagnostics() (+8 more)

### Community 106 - "AcceptInvitation.tsx"
Cohesion: 0.14
Nodes (21): ref_firebase_app, ref_firebase_auth, ref_firebase_firestore, @firebase/rules-unit-testing, auth, fbApp, AcceptInvitation, AcceptInvitation() (+13 more)

### Community 107 - "dateTime.ts"
Cohesion: 0.30
Nodes (13): AdherenceCheckIn(), logAdherence(), src_types_index_adherenceentry, DEFAULT_CLINIC_TIMEZONE, formatCivilDate(), getCivilDateFromDate(), getCivilMonthRange(), getCivilToday() (+5 more)

### Community 108 - "PatientProfile.tsx"
Cohesion: 0.14
Nodes (14): LoadingState(), BiomarkerData, BiomarkerEvolutionChart(), BiomarkerEvolutionChartProps, DietComparisonModal(), ProfileAssessmentTabProps, ProfileExamsTab(), ProfileExamsTabProps (+6 more)

### Community 109 - "Matriz de Baseline e Evidências — Storm Nutrition"
Cohesion: 0.29
Nodes (6): 1. Ambiente e Ferramentas Medidas, 2. Verificação da Nota Histórica do Prettier, 3. Matriz de Achados vs. Evidências no Código, 4. Estado da Integração Contínua (CI), Matriz de Baseline e Evidências — Storm Nutrition, db()

### Community 110 - "food.ts"
Cohesion: 0.16
Nodes (12): NutritionLabel(), NutritionLabelProps, NovaInfo, Micronutrients, FoodCompatibilityResult, FoodRestrictions, NovaClassificationOrigin, NovaGroup (+4 more)

### Community 111 - "PatientPortal.tsx"
Cohesion: 0.25
Nodes (10): PortalPasswordModal(), PortalWeightModal(), Props, usePatientPortalData(), UsePatientPortalDataReturn, PatientPortal(), logPatientWeight(), src_types_index_weightrecord (+2 more)

### Community 112 - "PatientAccessModal.tsx"
Cohesion: 0.27
Nodes (8): 🟢 Passo 6 — Robustez do Portal do Paciente (NOVO) ✅ (concluído), PatientAccessModal(), Props, createPatientPortalProfile(), sendPortalPasswordReset(), sendPortalAccessEmail(), revokeInvitation(), revokePatientPortalAccess()

### Community 113 - "locale.ts"
Cohesion: 0.27
Nodes (9): Step3MealPlan(), PortalDietsSection(), r(), formatNumberWithLocale(), getAppLocale(), getNormalizedLanguage(), MEAL_NAME_KEYS, SupportedLocale (+1 more)

### Community 114 - "errors.ts"
Cohesion: 0.36
Nodes (7): AppError, AppErrorOptions, classifyError(), ErrorCategory, generateCorrelationId(), safeLogError(), sanitizeDataForLogging()

### Community 115 - "i18n.ts"
Cohesion: 0.25
Nodes (6): normalizeLanguage(), resources, syncDocumentLanguage(), src_locales_en_common, src_locales_pt_common, getFlattenedKeys()

### Community 116 - "App.tsx"
Cohesion: 0.22
Nodes (7): Calendar, Dashboard, DietGenerator, Home, PatientPortal, PatientProfile, Patients

### Community 117 - "patientMigrationService.ts"
Cohesion: 0.57
Nodes (6): generateDeterministicId(), normalizeAdherenceEntry(), normalizePatientHistories(), normalizeSelfEvaluation(), normalizeWeightRecord(), mockPatient

### Community 118 - "foods.ts"
Cohesion: 0.43
Nodes (5): coreFoods, _seen, extraFoods, Food, src_types_index_food

### Community 119 - "Acessibilidade e estados de interface"
Cohesion: 0.40
Nodes (4): Acessibilidade e estados de interface, Baseline antes das mudanças, Como verificar, Pendências e limitações conhecidas

## Knowledge Gaps
- **586 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+581 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 766 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Patients.tsx`, `3.2 — i18n da UI: páginas e componentes ainda em PT ✅`, `Patient`, `pdfExporter.ts`, `evaluationService.ts`, `DietGenerator.tsx`, `DietPlanViewer.tsx`, `Login.tsx`, `patientService.ts`, `package.json`, `Home.tsx`, `useDashboardData.ts`, `EmailAdmin.tsx`, `AuthContext.tsx`, `react-i18next`, `foodService.ts`, `types/index.ts`, `getPatientDiets`, `Dashboard.tsx`, `NewPatientModal.tsx`, `icons.tsx`, `AppShell.tsx`, `Calendar.tsx`, `ui.tsx`, `useDialog.ts`, `ErrorBoundary.tsx`, `Reports.tsx`, `Sidebar.tsx`, `AcceptInvitation.tsx`, `dateTime.ts`, `PatientProfile.tsx`, `food.ts`, `PatientPortal.tsx`, `PatientAccessModal.tsx`, `locale.ts`, `App.tsx`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `pdfExporter.ts`, `evaluationService.ts`, `react`, `DietGenerator.tsx`, `DietPlanViewer.tsx`, `patientService.ts`, `package.json`, `useDashboardData.ts`, `AuthContext.tsx`, `types/index.ts`, `getPatientDiets`, `dietService.ts`, `Calendar.tsx`, `foodService.test.ts`, `ui.tsx`, `emailService.ts`, `queryCost.test.ts`, `useDialog.ts`, `ErrorBoundary.tsx`, `Reports.tsx`, `Sidebar.tsx`, `configValidation.ts`, `AcceptInvitation.tsx`, `dateTime.ts`, `errors.ts`, `i18n.ts`, `patientMigrationService.ts`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `react-i18next` to `Patients.tsx`, `3.2 — i18n da UI: páginas e componentes ainda em PT ✅`, `Patient`, `pdfExporter.ts`, `react`, `DietGenerator.tsx`, `DietPlanViewer.tsx`, `Login.tsx`, `package.json`, `Home.tsx`, `useDashboardData.ts`, `EmailAdmin.tsx`, `foodService.ts`, `Dashboard.tsx`, `NewPatientModal.tsx`, `icons.tsx`, `AppShell.tsx`, `Calendar.tsx`, `ui.tsx`, `Reports.tsx`, `Sidebar.tsx`, `AcceptInvitation.tsx`, `dateTime.ts`, `PatientProfile.tsx`, `food.ts`, `PatientPortal.tsx`, `PatientAccessModal.tsx`, `locale.ts`, `i18n.ts`, `App.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _586 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Patients.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12043010752688173 - nodes in this community are weakly interconnected._
- **Should `3.2 — i18n da UI: páginas e componentes ainda em PT ✅` be split into smaller, more focused modules?**
  _Cohesion score 0.05827067669172932 - nodes in this community are weakly interconnected._
- **Should `Patient` be split into smaller, more focused modules?**
  _Cohesion score 0.14761904761904762 - nodes in this community are weakly interconnected._
# Graph Report - Isanutri V5  (2026-09-18)

## Corpus Check
- 265 files · ~240,356 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 9, .rules 2, .mdc 1)

## Summary
- 1662 nodes · 4008 edges · 112 communities (87 shown, 25 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 88 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `35714c98`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Patients.tsx
- Step4Nutritional.tsx
- useAuth
- pdfExporter.ts
- MealOptionTable.tsx
- ProgressBar.tsx
- firebaseService.ts
- vitest
- DietPlanViewer.tsx
- 9. Adendo de revisão — correções ainda necessárias (18/09/2026)
- devDependencies
- icons.tsx
- build-foods.mjs
- patientService.ts
- compilerOptions
- package.json
- Home.tsx
- measure-bundle.mjs
- useDashboardData.ts
- scripts
- 🛠️ Detalhamento
- dependencies
- manifest.json
- firestoreMeter.ts
- vite.config.ts
- 4. Etapas detalhadas
- AuthContext.tsx
- O que precisa ser feito — Storm Nutrition
- Reports.tsx
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
- dietService.test.ts
- Patient
- AppShell.tsx
- 03 — Corrigir o contrato de persistência das dietas
- types/index.ts
- dietService.ts
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
- Sidebar.tsx
- configValidation.ts
- PatientAccessModal.tsx
- syntheticScenario.ts
- DietGenerator.tsx
- Matriz de Baseline e Evidências — Storm Nutrition
- Sidebar
- ref_firebase_app

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
- `Resultados: bundle de produção` --references--> `ExportDietModal()`  [INFERRED]
  docs/performance.md → src/components/modals/ExportDietModal.tsx
- `C06 — Completar validação de metas, alternativas e dados desconhecidos` --references--> `validateDietPlan()`  [INFERRED]
  o-que-precisa-ser-feito.md → src/services/dietAlgorithmService.ts
- `ADR-09: Safe Interception of Demo Emails and Multi-Layer Abuse Controls` --references--> `isDemoRecipient()`  [INFERRED]
  docs/architecture-decisions.md → src/services/emailService.ts
- `C10 — Bloquear todo envio externo em testes e demo isolada` --references--> `isDemoRecipient()`  [INFERRED]
  o-que-precisa-ser-feito.md → src/services/emailService.ts
- `C03 — Tornar convites atômicos, idempotentes e recuperáveis` --references--> `acceptInvitationWithNewAccount()`  [INFERRED]
  o-que-precisa-ser-feito.md → src/services/invitationService.ts

## Import Cycles
- None detected.

## Communities (112 total, 25 thin omitted)

### Community 0 - "Patients.tsx"
Cohesion: 0.12
Nodes (14): Teclado e foco visível (passo 4), Patients, ClockIcon(), DocumentTextIcon(), PlusIcon(), SearchIcon(), EmptyState(), EmptyStateProps (+6 more)

### Community 1 - "Step4Nutritional.tsx"
Cohesion: 0.13
Nodes (21): ClinicalTagSelector(), Props, TagOption, tags, LabExamsModule(), Props, suggestionsByMode, suggestionsByTag (+13 more)

### Community 2 - "useAuth"
Cohesion: 0.10
Nodes (32): 3.2 — i18n da UI: páginas e componentes ainda em PT ✅, 13 — Reduzir responsabilidades das páginas grandes, DietPlanDisplayProps, ExportDietModal, DietPlanViewerProps, AlertTriangleIcon(), BrainIcon(), DownloadIcon() (+24 more)

### Community 3 - "pdfExporter.ts"
Cohesion: 0.08
Nodes (27): html2canvas, jspdf, ExportDietModal(), src_types_index_mealoptionitem, AMBER, AMBER_TEXT, buildCustomLayoutPdfDocument(), ClinicInfo (+19 more)

### Community 4 - "MealOptionTable.tsx"
Cohesion: 0.33
Nodes (7): MealOptionTable(), OptionTable(), parseAmounts(), parseFoodNames(), Props, MealOption, src_types_index_mealoption

### Community 5 - "ProgressBar.tsx"
Cohesion: 0.40
Nodes (3): ProgressBar(), ProgressBarProps, steps

### Community 6 - "firebaseService.ts"
Cohesion: 0.15
Nodes (20): 🟢 Passo 6 — Robustez do Portal do Paciente (NOVO) ✅ (concluído), ref_firebase_storage, createPatientAccount(), createPatientPortalProfile(), setupPatientPortalAccess(), updatePatientPortalRef(), updateUserProfile(), uploadProfilePicture() (+12 more)

### Community 7 - "vitest"
Cohesion: 0.10
Nodes (44): @testing-library/react, vitest, DietPlanDisplay(), CreditCardIcon(), NewPatientModal(), patient, BillingSection(), useDietTemplates() (+36 more)

### Community 8 - "DietPlanViewer.tsx"
Cohesion: 0.16
Nodes (22): i18next, MetabolicCalculator, DietPlanViewer(), isV2Plan(), ClipboardListIcon(), MetabolicCalculator(), ActivityLevel, activityMultipliers (+14 more)

### Community 9 - "9. Adendo de revisão — correções ainda necessárias (18/09/2026)"
Cohesion: 0.13
Nodes (15): 9.1. Como outra IA deve utilizar este adendo, 9.2. Ordem de execução das correções, 9.3. Checklist de encerramento deste adendo, 9. Adendo de revisão — correções ainda necessárias (18/09/2026), C01 — Impedir vínculos autodeclarados e apropriação de portal, C02 — Proteger conteúdo e autoria dos históricos, C03 — Tornar convites atômicos, idempotentes e recuperáveis, C04 — Corrigir Java, configuração sintética e reprodução em checkout limpo (+7 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (26): devDependencies, @axe-core/playwright, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @firebase/rules-unit-testing, firebase-tools (+18 more)

### Community 11 - "icons.tsx"
Cohesion: 0.09
Nodes (35): ref_firebase_auth, react-router-dom, AcceptInvitation, Calendar, DietGenerator, EmailAdmin, FoodDatabase, Login (+27 more)

### Community 12 - "build-foods.mjs"
Cohesion: 0.21
Nodes (14): Formulários e anúncios (passo 3), buildColumnIndex(), CANONICAL_CATEGORIES, CATEGORY_MAP, COLUMN_MAP, FOOD_NAME_TRANSLATIONS, inferNova(), main() (+6 more)

### Community 13 - "patientService.ts"
Cohesion: 0.20
Nodes (16): Patients(), addPatient(), archivePatient(), CascadeDeletionResult, countPatients(), deletePatient, deletePatientCascade(), DeletionProgress (+8 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 15 - "package.json"
Cohesion: 0.09
Nodes (24): engines, node, name, private, type, version, eslint, @eslint/js (+16 more)

### Community 16 - "Home.tsx"
Cohesion: 0.08
Nodes (7): Home, ClinicalContextCard(), ClinicalContextCardProps, modeTone, HeartIcon(), ZapIcon(), showcaseFrames

### Community 17 - "measure-bundle.mjs"
Cohesion: 0.10
Nodes (24): ref_node_zlib, vite, assets, chunks, closure(), collectChunkGraph, composition, compositionSorted (+16 more)

### Community 18 - "useDashboardData.ts"
Cohesion: 0.08
Nodes (32): ActivityIconKey, ActivityItem, buildMonthlyDietBuckets(), buildRecentActivity(), formatRelative(), MonthBucket, RECENT_ACTIVITY_LIMIT, PerformanceSectionProps (+24 more)

### Community 19 - "scripts"
Cohesion: 0.09
Nodes (22): scripts, build, demo:reset, demo:seed, dev, dev:emulated, dev:emulator, emulators (+14 more)

### Community 20 - "🛠️ Detalhamento"
Cohesion: 0.17
Nodes (11): 3.1 — Código e comentários em inglês ✅, 3.3 — Camadas de conteúdo (não são strings de UI — exigem abordagem própria) ✅, ✅ Critério de "pronto para avaliação", 🛠️ Detalhamento, 🗺️ Ordem de Execução Sugerida (atualizada), 🟢 Passo 1 — TypeScript Strict ✅ (concluído), 🟢 Passo 3 — Internacionalização ✅ (concluído), 🔵 Passo 4 — Segurança e CI/CD ✅ (concluído — revisar qualidade) (+3 more)

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
Cohesion: 0.16
Nodes (17): AuthContext, AuthContextType, AuthProvider(), createNutritionistProfile(), getNutritionistProfile(), getPatientPortalProfile(), src_services_firebaseservice_onauthstatechanged, src_services_firebaseservice_user (+9 more)

### Community 27 - "O que precisa ser feito — Storm Nutrition"
Cohesion: 0.17
Nodes (11): 1. Objetivo e contexto para quem vai implementar, 2. Instruções de execução para outra IA ou desenvolvedor, 3. Ordem de prioridade, 5. Sequência sugerida de PRs, 6. Critérios finais de pronto para avaliação, 7. Escopo que não deve crescer automaticamente, 8. Estimativa de planejamento, Documentação consultada (+3 more)

### Community 28 - "Reports.tsx"
Cohesion: 0.19
Nodes (9): Contraste, mobile e movimento (passo 6), Custo no bundle, Estados de interface (passo 7), Gráficos (passo 5), Mudanças, O que é verificado automaticamente, Reports, ChartDataTable() (+1 more)

### Community 29 - "dietAlgorithmService.ts"
Cohesion: 0.08
Nodes (52): NutritionLabel(), NutritionLabelProps, brazilianFoods, coreFoods, _seen, extraFoods, FoodDatabase(), createPrng() (+44 more)

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
Cohesion: 0.16
Nodes (13): ref_firebase_firestore, DirectoryState, EMPTY, PatientDirectoryProvider(), auth, Listener, listeners, PatientDirectoryContext (+5 more)

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
Cohesion: 0.17
Nodes (15): Acessibilidade e estados de interface, Baseline antes das mudanças, Como verificar, Pendências e limitações conhecidas, usePatientProfile(), byNewestFirst(), getDietCountSummary(), getDietsCollection() (+7 more)

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
Cohesion: 0.09
Nodes (25): Dashboard, src_components_dashboard_index_monthsummarycard, src_components_dashboard_index_onboardingbanner, src_components_dashboard_index_performancesection, src_components_dashboard_index_quickactionssection, src_components_dashboard_index_recentactivitycard, src_components_dashboard_index_statcard, MonthSummaryCard() (+17 more)

### Community 87 - "NewPatientModal.tsx"
Cohesion: 0.25
Nodes (14): Step2Nutrition(), initialFormData, Step1Personal(), errBorder(), errMsg(), Step2Contact(), Step2Props, Step3Professional() (+6 more)

### Community 88 - "dietService.test.ts"
Cohesion: 0.25
Nodes (17): C05 — Atualizar refeições, totais, validação e rastreabilidade juntos, isFiniteNumber(), recalculateDietTotals(), sanitizeCalculatedTotals(), sanitizeDecisionLog(), sanitizeLabExams(), sanitizeMeal(), sanitizeMealOption() (+9 more)

### Community 89 - "Patient"
Cohesion: 0.13
Nodes (13): DietSuccessCardProps, NewPatientModalProps, PatientDietHistoryModalProps, Step1Props, Step3Props, Step4Props, Step5Props, Step6Props (+5 more)

### Community 90 - "AppShell.tsx"
Cohesion: 0.18
Nodes (11): AppShell(), Breadcrumbs(), BreadcrumbsProps, CloseIcon(), HomeIcon(), SparklesIcon(), LanguageSelector(), DemoGuideModal() (+3 more)

### Community 92 - "types/index.ts"
Cohesion: 0.05
Nodes (76): AdherenceCheckIn(), PortalPasswordModal(), PortalWeightModal(), SelfEvaluationForm(), ProfileAssessmentTab(), Props, RangeFilter, WeightEvolutionChart() (+68 more)

### Community 93 - "dietService.ts"
Cohesion: 0.13
Nodes (21): GenerationResult, DietCountSummary, getDietDoc(), updateDietPlan(), CalculatedDietTotals, DecisionEntry, DietPlanFirestoreDto, DietPlanUpdateDto (+13 more)

### Community 95 - "Step6LabExams.tsx"
Cohesion: 0.39
Nodes (6): Step6LabExams(), Step6Props, interpretTest(), labCategories, LabCategory, src_types_index_labtest

### Community 96 - "react"
Cohesion: 0.11
Nodes (32): Diálogos (passos 1 e 2), react, react-dom, react-i18next, Dialog(), DialogProps, QuickCalculatorProps, ConfirmationModalProps (+24 more)

### Community 97 - "dietPersistence.integration.test.ts"
Cohesion: 0.33
Nodes (7): @firebase/rules-unit-testing, ref_node_fs, ref_node_path, ref_node_url, nutriDb(), __dirname, __dirname

### Community 98 - "Desempenho: consultas e carregamento"
Cohesion: 0.17
Nodes (11): Antes (plano do commit `99e72fa`), Bundle, Como reproduzir, Consultas ao Firestore, Depois, Desempenho: consultas e carregamento, Método, O que não foi medido (+3 more)

### Community 99 - "queryCost.test.ts"
Cohesion: 0.17
Nodes (5): current, __dirname, holder, legacy, table()

### Community 100 - "useDialog.ts"
Cohesion: 0.16
Nodes (15): DialogPanel(), FOCUSABLE, focusInitial(), getFocusable(), isVisible(), lockScroll(), managedInert, OpenDialog (+7 more)

### Community 101 - "i18n.ts"
Cohesion: 0.06
Nodes (42): @emailjs/browser, ref_react_dom_client, App(), Step3MealPlan(), ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState, PortalDietsSection() (+34 more)

### Community 102 - "Index of Architectural Decisions"
Cohesion: 0.05
Nodes (38): ADR-01: React 19 SPA with Strict TypeScript and Code-Splitting, ADR-02: Native Compile-Time Tailwind CSS v4, ADR-03: Secondary Firebase Auth Instance for Non-Disruptive Patient Provisioning, ADR-04: Passwordless Tokenized Invitations with Patient-Defined Passwords, ADR-05: Multi-Tenant Isolation via Firestore Security Rules, ADR-06: Deterministic Constraint-Based Meal Generation over Generative AI, ADR-07: Vector-Based Editorial PDF Exporting, ADR-08: Architectural Decoupling of Local Billing Simulation (+30 more)

### Community 103 - "dietForm.types.ts"
Cohesion: 0.25
Nodes (10): DietCalculations, DietFormData, MacroSplit, MealSlot, errBorder(), Step1Objectives(), Step1Props, Step2Props (+2 more)

### Community 104 - "Sidebar.tsx"
Cohesion: 0.15
Nodes (6): LogInIcon(), TargetIcon(), deriveNotifications(), NavItemProps, NotificationBell(), NotifItem

### Community 105 - "configValidation.ts"
Cohesion: 0.14
Nodes (16): config, rootElement, ConfigValidationResult, DEMO_PROJECT_ID, DEMO_PROJECT_PREFIX, getRuntimeEnv(), REQUIRED_FIREBASE_KEYS, runStartupDiagnostics() (+8 more)

### Community 106 - "PatientAccessModal.tsx"
Cohesion: 0.19
Nodes (16): PatientAccessModal(), Props, AcceptInvitation(), sendPortalPasswordReset(), src_services_firebasecore_user, acceptInvitationWithExistingAccount(), acceptInvitationWithNewAccount(), computeInvitationStatus() (+8 more)

### Community 107 - "syntheticScenario.ts"
Cohesion: 0.33
Nodes (9): buildDietTemplate(), buildPatient(), localWallTime(), pad(), portalPatientId, SCENARIO, SeededAppointment, SeededDiet (+1 more)

### Community 108 - "DietGenerator.tsx"
Cohesion: 0.15
Nodes (13): DietProgressBar(), DietProgressBarProps, DietSuccessCard(), DietTemplatesSection(), DietTemplatesSectionProps, QuickCalculator(), dietaryOptionsMap, modeTone (+5 more)

### Community 109 - "Matriz de Baseline e Evidências — Storm Nutrition"
Cohesion: 0.29
Nodes (6): 1. Ambiente e Ferramentas Medidas, 2. Verificação da Nota Histórica do Prettier, 3. Matriz de Achados vs. Evidências no Código, 4. Estado da Integração Contínua (CI), Matriz de Baseline e Evidências — Storm Nutrition, db()

### Community 110 - "Sidebar"
Cohesion: 0.40
Nodes (5): Decisões e trade-offs, 🟡 Passo 2 — Testes Automatizados ⚠️ (parcial), Sidebar(), Dashboard(), firebaseSignOut()

### Community 111 - "ref_firebase_app"
Cohesion: 0.40
Nodes (3): ref_firebase_app, auth, fbApp

## Knowledge Gaps
- **584 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+579 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 760 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Patients.tsx`, `Step4Nutritional.tsx`, `useAuth`, `MealOptionTable.tsx`, `ProgressBar.tsx`, `vitest`, `DietPlanViewer.tsx`, `icons.tsx`, `package.json`, `Home.tsx`, `useDashboardData.ts`, `AuthContext.tsx`, `Reports.tsx`, `dietAlgorithmService.ts`, `PatientDirectoryContext.tsx`, `getPatientDiets`, `Dashboard.tsx`, `NewPatientModal.tsx`, `Patient`, `AppShell.tsx`, `types/index.ts`, `Step6LabExams.tsx`, `useDialog.ts`, `i18n.ts`, `dietForm.types.ts`, `Sidebar.tsx`, `PatientAccessModal.tsx`, `DietGenerator.tsx`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `pdfExporter.ts`, `MealOptionTable.tsx`, `DietPlanViewer.tsx`, `patientService.ts`, `package.json`, `useDashboardData.ts`, `Reports.tsx`, `dietAlgorithmService.ts`, `PatientDirectoryContext.tsx`, `getPatientDiets`, `dietService.test.ts`, `AppShell.tsx`, `types/index.ts`, `dietPersistence.integration.test.ts`, `queryCost.test.ts`, `useDialog.ts`, `i18n.ts`, `Sidebar.tsx`, `configValidation.ts`, `PatientAccessModal.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `isDemoRecipient()` connect `i18n.ts` to `9. Adendo de revisão — correções ainda necessárias (18/09/2026)`, `Index of Architectural Decisions`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _584 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Patients.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11904761904761904 - nodes in this community are weakly interconnected._
- **Should `Step4Nutritional.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12923076923076923 - nodes in this community are weakly interconnected._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.10384068278805121 - nodes in this community are weakly interconnected._
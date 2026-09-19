# Graph Report - Isanutri V5  (2026-09-19)

## Corpus Check
- 287 files · ~344,798 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 9, .rules 2, .mdc 1)

## Summary
- 1874 nodes · 4497 edges · 136 communities (110 shown, 26 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 157 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2baeaec0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Modal
- DietPlanDisplay.tsx
- PatientAccessModal.tsx
- pdfExporter.ts
- Calendar.tsx
- Patients.tsx
- firebaseService.ts
- BillingSection.tsx
- metabolicCalculations.ts
- 4. Etapas detalhadas
- devDependencies
- Login.tsx
- 9. Adendo de revisão — correções ainda necessárias (18/09/2026)
- dietAlgorithmService.test.ts
- compilerOptions
- package.json
- Home.tsx
- measure-bundle.mjs
- NewPatientModal.tsx
- scripts
- evaluationService.ts
- dependencies
- manifest.json
- firestoreMeter.ts
- vite.config.ts
- types/index.ts
- AuthContext.tsx
- Feito — inventário de entregas e evidências
- Reports.tsx
- foodService.ts
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- EmailAdmin.tsx
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- Desempenho: consultas e carregamento
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
- 10. Segunda revisão — pendências após a implementação de C01–C12
- Dashboard.tsx
- O que precisa ser feito — Storm Nutrition
- 3.2 — i18n da UI: páginas e componentes ainda em PT ✅
- dietService.ts
- screens.capture.ts
- useAuth
- ProgressBar.tsx
- MealOptionTable.tsx
- Seção 3 — Design system e UI (UI01–UI12) — 18/09/2026
- @playwright/test
- Storm Nutrition — Clinical Management & Diet Planning Platform
- ui.tsx
- PatientDietHistoryModal.tsx
- build-foods.mjs
- queryCost.test.ts
- useDialog.ts
- 11. Protocolo de entrega verificável para a IA implementadora
- Guia de Demonstração Sintética e Identificação de Simulações
- icons.tsx
- 🛠️ Detalhamento
- configValidation.ts
- invitationService.ts
- vitest
- patientService.ts
- dietPersistence.integration.test.ts
- PatientProfile.tsx
- foods.ts
- ErrorState
- 10.3. Reverificação de R01–R09 — estado atual e complementos obrigatórios
- dietForm.types.ts
- DietGenerator.tsx
- 9.4. Conclusão de Prontidão Técnica e Limitações Remanescentes (18/09/2026)
- Matriz de Baseline e Evidências — Storm Nutrition
- Step6LabExams.tsx
- Capturas de tela (UI11)
- dietAlgorithmService.ts
- PatientActionsMenu.tsx
- Index of Architectural Decisions
- src_types_index_macrotolerances
- food.ts
- usePatientDirectory
- dateTime.ts
- react
- 2. Ordem de implementação e critérios de aceite
- patientMigrationService.ts
- evidencias-revisao-10.md
- Registro de Evidências - Revisão 10
- 2. Roteiro de Avaliação Rápida (3 a 5 minutos)
- Validação local — correções dos cinco itens
- Step6Summary.tsx
- accessibility.spec.ts

## God Nodes (most connected - your core abstractions)
1. `react` - 113 edges
2. `react-i18next` - 79 edges
3. `Patient` - 72 edges
4. `vitest` - 50 edges
5. `useAuth()` - 49 edges
6. `DietPlan` - 35 edges
7. `Button` - 27 edges
8. `react-router-dom` - 24 edges
9. `@testing-library/react` - 24 edges
10. `scripts` - 23 edges

## Surprising Connections (you probably didn't know these)
- `5.3 Separação de Garantias e Ambientes` --references--> `main()`  [INFERRED]
  docs/baseline-matriz.md → scripts/build-foods.mjs
- `Gráficos (passo 5)` --references--> `ChartDataTable()`  [INFERRED]
  docs/accessibility.md → src/components/ChartDataTable.tsx
- `Resultados: bundle de produção` --references--> `ExportDietModal()`  [INFERRED]
  docs/performance.md → src/components/modals/ExportDietModal.tsx
- `Validação mais recente — correção dos cinco itens, 19/09/2026` --references--> `Alert()`  [INFERRED]
  docs/evidencias-revisao-10.md → src/components/ui.tsx
- `Baseline antes das mudanças` --references--> `usePatientProfile()`  [INFERRED]
  docs/accessibility.md → src/hooks/usePatientProfile.ts

## Import Cycles
- None detected.

## Communities (136 total, 26 thin omitted)

### Community 0 - "Modal"
Cohesion: 0.21
Nodes (11): Diálogos (passos 1 e 2), 1. Tema suportado (UI03), 3. Camadas e composição (UI01), 4. Controles (UI05), 5. Tipografia e densidade (UI04), 7. Verificação, Design system — contrato de aparência (seção 3, UI01–UI10), UI05 — Em implementação (+3 more)

### Community 1 - "DietPlanDisplay.tsx"
Cohesion: 0.12
Nodes (21): DietPlanDisplayProps, Step3MealPlan(), DietPlanViewer(), DietPlanViewerProps, isV2Plan(), AlertTriangleIcon(), BrainIcon(), XCircleIcon() (+13 more)

### Community 2 - "PatientAccessModal.tsx"
Cohesion: 0.18
Nodes (12): Plano histórico (etapas 01–20 e C01–C12): o que esta revisão demonstra, R01 — Validado (local; CI remota não executada), R04 — Validado, R05 — Validado, R07 — Validado, R09 — Validado (revisão humana pendente), Índice histórico — R01–R09 (execução de 19/09/2026, 09:41–09:43), 10.3.2. P1 — R04: não devolver convite invalidado no reenvio (+4 more)

### Community 3 - "pdfExporter.ts"
Cohesion: 0.08
Nodes (27): 🟣 Passo 5 — Polimento, Organização e README ✅ (concluído), jspdf, ExportDietModal(), src_types_index_calculateddiettotals, AMBER, AMBER_TEXT, buildCustomLayoutPdfDocument(), ClinicInfo (+19 more)

### Community 4 - "Calendar.tsx"
Cohesion: 0.12
Nodes (30): Calendar, Props, UsePatientPortalDataReturn, ApptModalProps, Calendar(), TYPE_DOT, TYPE_LIGHT, addAppointment() (+22 more)

### Community 5 - "Patients.tsx"
Cohesion: 0.22
Nodes (6): Patients, Input, Sub, subs, useLatestDiets(), ToastProps

### Community 6 - "firebaseService.ts"
Cohesion: 0.14
Nodes (21): 🟢 Passo 6 — Robustez do Portal do Paciente (NOVO) ✅ (concluído), ref_firebase_storage, createPatientAccount(), createPatientPortalProfile(), getNutritionistProfile(), getPatientPortalProfile(), setupPatientPortalAccess(), updatePatientPortalRef() (+13 more)

### Community 7 - "BillingSection.tsx"
Cohesion: 0.09
Nodes (46): Settings, NewPatientModal(), ConfirmationModal(), ConfirmationModalProps, BillingSection(), Button, Card(), useDietTemplates() (+38 more)

### Community 8 - "metabolicCalculations.ts"
Cohesion: 0.19
Nodes (19): i18next, MetabolicCalculator, MetabolicCalculator(), ActivityLevel, activityMultipliers, calculateBMI(), calculateBMR(), calculateMacrosInGrams() (+11 more)

### Community 9 - "4. Etapas detalhadas"
Cohesion: 0.09
Nodes (23): 01 — Estabelecer baseline e corrigir o controle de status, 02 — Tornar instalação, emuladores e CI reproduzíveis, 03 — Corrigir o contrato de persistência das dietas, 04 — Tratar autenticação como fluxo com estados explícitos, 05 — Isolar rascunhos e configurações por conta, 06 — Fortalecer autorização e validação de dados, 07 — Substituir envio de senha por convite seguro, 08 — Tornar restrições e dados alimentares explícitos (+15 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (26): devDependencies, @axe-core/playwright, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @firebase/rules-unit-testing, firebase-tools (+18 more)

### Community 11 - "Login.tsx"
Cohesion: 0.13
Nodes (18): ref_firebase_app, ref_firebase_auth, auth, fbApp, Login, Register, AuthLayout(), GoogleIcon() (+10 more)

### Community 12 - "9. Adendo de revisão — correções ainda necessárias (18/09/2026)"
Cohesion: 0.12
Nodes (16): 9.1. Como outra IA deve utilizar este adendo, 9.2. Ordem de execução das correções, 9.3. Checklist de encerramento deste adendo, 9. Adendo de revisão — correções ainda necessárias (18/09/2026), C01 — Impedir vínculos autodeclarados e apropriação de portal, C02 — Proteger conteúdo e autoria dos históricos, C03 — Tornar convites atômicos, idempotentes e recuperáveis, C04 — Corrigir Java, configuração sintética e reprodução em checkout limpo (+8 more)

### Community 13 - "dietAlgorithmService.test.ts"
Cohesion: 0.23
Nodes (16): createPrng(), generateAlgorithmicDietPlan(), hashStringToSeed(), InfeasiblePlanError, validateGenerationParams(), evaluateFoodRestriction(), foodContainsDairy(), foodContainsGluten() (+8 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+10 more)

### Community 15 - "package.json"
Cohesion: 0.08
Nodes (25): engines, node, name, private, type, version, eslint, @eslint/js (+17 more)

### Community 16 - "Home.tsx"
Cohesion: 0.09
Nodes (6): 6. Superfícies, raios e movimento (UI07, UI10), UI07 — Em implementação, Home, LogoIcon(), ZapIcon(), showcaseFrames

### Community 17 - "measure-bundle.mjs"
Cohesion: 0.10
Nodes (24): ref_node_zlib, vite, assets, chunks, closure(), collectChunkGraph, composition, compositionSorted (+16 more)

### Community 18 - "NewPatientModal.tsx"
Cohesion: 0.23
Nodes (15): errBorder(), Step1Objectives(), Step2Nutrition(), initialFormData, Step1Personal(), errBorder(), errMsg(), Step2Contact() (+7 more)

### Community 19 - "scripts"
Cohesion: 0.09
Nodes (23): scripts, build, demo:reset, demo:seed, dev, dev:emulated, dev:emulator, emulators (+15 more)

### Community 20 - "evaluationService.ts"
Cohesion: 0.14
Nodes (25): R02 — Validado, AdherenceCheckIn(), CompleteEvaluationOptions, completeSelfEvaluation(), logAdherence(), LogAdherenceOptions, logPatientWeight(), LogWeightOptions (+17 more)

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

### Community 25 - "types/index.ts"
Cohesion: 0.10
Nodes (20): DietSuccessCard(), DietSuccessCardProps, NewPatientModalProps, Props, Step1Props, Step3Props, Step5Props, ProfileEvolutionTabProps (+12 more)

### Community 26 - "AuthContext.tsx"
Cohesion: 0.10
Nodes (25): P2 — UI05: concluir adoção dos controles, AcceptInvitation, ShieldIcon(), SelfEvaluationForm(), AuthContext, AuthContextType, AuthProvider(), TestConsumer() (+17 more)

### Community 27 - "Feito — inventário de entregas e evidências"
Cohesion: 0.22
Nodes (9): 1. O que significa “feito” neste registro, 2. Entregas encontradas na implementação atual, 3. Resultados históricos existentes — não reexecutados nesta revisão, 4. Trabalho efetivamente realizado nesta revisão, 5. Decisões de organização e limites, 6. Como acrescentar novas entregas, Atualização de 19/09/2026 — correções efetivamente executadas, Feito — inventário de entregas e evidências (+1 more)

### Community 28 - "Reports.tsx"
Cohesion: 0.13
Nodes (23): Reports, buildMonthlyDietBuckets(), buildRecentActivity(), formatRelative(), MonthBucket, RECENT_ACTIVITY_LIMIT, PerformanceSectionProps, DashboardStats (+15 more)

### Community 29 - "foodService.ts"
Cohesion: 0.11
Nodes (22): FoodDatabase, FoodDatabase(), foodCategories, getAvailableCarbs(), getFoodCategoryName(), getFoodName(), giLevel(), glLevel() (+14 more)

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

### Community 35 - "EmailAdmin.tsx"
Cohesion: 0.07
Nodes (40): @emailjs/browser, EmailAdmin, ErrorBoundary, ProfileHeader(), normalizeLanguage(), syncDocumentLanguage(), getFlattenedKeys(), EmailAdmin() (+32 more)

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

### Community 41 - "Desempenho: consultas e carregamento"
Cohesion: 0.17
Nodes (11): Antes (plano do commit `99e72fa`), Bundle, Como reproduzir, Consultas ao Firestore, Depois, Desempenho: consultas e carregamento, Método, O que não foi medido (+3 more)

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

### Community 84 - "10. Segunda revisão — pendências após a implementação de C01–C12"
Cohesion: 0.17
Nodes (12): 10.1. Ordem de implementação, 10.2. Checklist de encerramento da segunda revisão, 10. Segunda revisão — pendências após a implementação de C01–C12, R01 — Corrigir Java na CI e comprovar reprodução, R02 — Validar todo evento novo e preservar avaliações anteriores, R03 — Recusar convites sem identidade ou expiração verificáveis, R04 — Garantir revogação mesmo com falha ou concorrência, R05 — Fazer o isolamento prevalecer sobre transporte real (+4 more)

### Community 85 - "Dashboard.tsx"
Cohesion: 0.09
Nodes (20): Dashboard, src_components_dashboard_index_monthsummarycard, src_components_dashboard_index_onboardingbanner, src_components_dashboard_index_performancesection, src_components_dashboard_index_quickactionssection, src_components_dashboard_index_recentactivitycard, src_components_dashboard_index_statcard, OnboardingBanner() (+12 more)

### Community 86 - "O que precisa ser feito — Storm Nutrition"
Cohesion: 0.17
Nodes (11): 1. Objetivo e contexto para quem vai implementar, 2. Instruções de execução para outra IA ou desenvolvedor, 3. Ordem de prioridade, 5. Sequência sugerida de PRs, 6. Critérios finais de pronto para avaliação, 7. Escopo que não deve crescer automaticamente, 8. Estimativa de planejamento, Documentação consultada (+3 more)

### Community 87 - "3.2 — i18n da UI: páginas e componentes ainda em PT ✅"
Cohesion: 0.11
Nodes (24): 3.2 — i18n da UI: páginas e componentes ainda em PT ✅, ClinicalTagSelector(), Props, TagOption, tags, LabExamsModule(), Props, suggestionsByMode (+16 more)

### Community 88 - "dietService.ts"
Cohesion: 0.14
Nodes (32): R06 — Validado, validateDietPlan(), assertReviewMatches(), byNewestFirst(), DietReviewOutdatedError, getDietsCollection(), getPatientDiets(), handleSnapshotError() (+24 more)

### Community 89 - "screens.capture.ts"
Cohesion: 0.20
Nodes (9): ref_node_child_process, DESKTOP, Entry, manifest, MOBILE, OUT, settle(), shot() (+1 more)

### Community 90 - "useAuth"
Cohesion: 0.14
Nodes (15): Decisões e trade-offs, 🟡 Passo 2 — Testes Automatizados ⚠️ (parcial), react-router-dom, AppRoutes(), AppShell(), Breadcrumbs(), BreadcrumbsProps, HomeIcon() (+7 more)

### Community 91 - "ProgressBar.tsx"
Cohesion: 0.20
Nodes (8): UI09 — Em implementação, DietProgressBar(), DietProgressBarProps, ProgressBar(), ProgressBarProps, steps, StepProgress(), StepProgressStep

### Community 92 - "MealOptionTable.tsx"
Cohesion: 0.13
Nodes (20): R08 — Validado, MealOptionTable(), OptionTable(), parseAmounts(), parseFoodNames(), Props, usePatientPortalData(), recalculateDietTotals() (+12 more)

### Community 93 - "Seção 3 — Design system e UI (UI01–UI12) — 18/09/2026"
Cohesion: 0.14
Nodes (18): 2. Tokens (UI02), Seção 3 — Design system e UI (UI01–UI12) — 18/09/2026, UI01 — Validado, UI02 — Em implementação, UI03 — Validado, UI04 — Em implementação, UI06 — Em implementação, UI08 — Em implementação (+10 more)

### Community 95 - "Storm Nutrition — Clinical Management & Diet Planning Platform"
Cohesion: 0.15
Nodes (13): 🏗️ Architecture Diagram, 🏛️ Core Engineering & Architecture Decisions, ⚠️ Disclaimers & Known Limitations, 🧮 Domain Logic & Clinical Constraints Engine, 📄 Licenses & Data Attributions, 🛠️ Local Setup & Reproducible Execution, Metabolic Equations (BMR & TDEE), Nutritional Database & Constraint Rules (+5 more)

### Community 96 - "ui.tsx"
Cohesion: 0.11
Nodes (23): InformationCircleIcon(), PlusIcon(), EmptyState(), EmptyStateProps, alertIcons, AlertProps, alertStyles, BadgeTone (+15 more)

### Community 97 - "PatientDietHistoryModal.tsx"
Cohesion: 0.20
Nodes (11): ExportDietModal, DownloadIcon(), ExportDietModalProps, ExportDietModal, PatientDietHistoryModal(), PatientDietHistoryModalProps, ExportDietModal, Spinner() (+3 more)

### Community 98 - "build-foods.mjs"
Cohesion: 0.23
Nodes (13): buildColumnIndex(), CANONICAL_CATEGORIES, CATEGORY_MAP, COLUMN_MAP, FOOD_NAME_TRANSLATIONS, inferNova(), main(), norm() (+5 more)

### Community 99 - "queryCost.test.ts"
Cohesion: 0.14
Nodes (14): current, __dirname, holder, legacy, table(), buildDietTemplate(), buildPatient(), localWallTime() (+6 more)

### Community 100 - "useDialog.ts"
Cohesion: 0.20
Nodes (15): DialogPanel(), FOCUSABLE, focusInitial(), getFocusable(), isVisible(), lockScroll(), managedInert, OpenDialog (+7 more)

### Community 101 - "11. Protocolo de entrega verificável para a IA implementadora"
Cohesion: 0.22
Nodes (9): 11.1. Regra de conclusão e estados permitidos, 11.2. Sequência obrigatória de execução, 11.3. Matriz mínima de comprovação — cenários obrigatórios, 11.4. Registro de evidências e continuidade, 11.5. Verificações finais locais, 11.6. Alterações que invalidam a alegação de entrega, 11.7. Formato obrigatório de entrega final, 11.8. Texto para enviar à IA que já está implementando (+1 more)

### Community 102 - "Guia de Demonstração Sintética e Identificação de Simulações"
Cohesion: 0.25
Nodes (7): 1. Personas e Credenciais Sintéticas, 3. Identificação Explícita de Simulações vs. Backend Real, 4. Comandos de Inicialização e Reset de Dados, Executar Testes E2E Emulados, Guia de Demonstração Sintética e Identificação de Simulações, Inicializar Emuladores Locais, Resetar e Popular Dados Sintéticos

### Community 103 - "icons.tsx"
Cohesion: 0.08
Nodes (30): ActivityIconKey, ActivityItem, MonthSummaryCard(), MonthSummaryCardProps, ACTIVITY_ICON, RecentActivityCard(), RecentActivityCardProps, ClipboardListIcon() (+22 more)

### Community 104 - "🛠️ Detalhamento"
Cohesion: 0.18
Nodes (10): 3.1 — Código e comentários em inglês ✅, 3.3 — Camadas de conteúdo (não são strings de UI — exigem abordagem própria) ✅, ✅ Critério de "pronto para avaliação", 🛠️ Detalhamento, 🗺️ Ordem de Execução Sugerida (atualizada), 🟢 Passo 1 — TypeScript Strict ✅ (concluído), 🟢 Passo 3 — Internacionalização ✅ (concluído), 🔵 Passo 4 — Segurança e CI/CD ✅ (concluído — revisar qualidade) (+2 more)

### Community 105 - "configValidation.ts"
Cohesion: 0.14
Nodes (16): config, rootElement, ConfigValidationResult, DEMO_PROJECT_ID, DEMO_PROJECT_PREFIX, getRuntimeEnv(), REQUIRED_FIREBASE_KEYS, runStartupDiagnostics() (+8 more)

### Community 106 - "invitationService.ts"
Cohesion: 0.25
Nodes (13): R03 — Validado, ref_firebase_firestore, src_services_firebasecore_user, acceptInvitationWithExistingAccount(), acceptInvitationWithNewAccount(), computeInvitationStatus(), CreateInvitationParams, createOrGetPendingInvitation() (+5 more)

### Community 107 - "vitest"
Cohesion: 0.10
Nodes (13): ref_react_dom_client, @testing-library/react, vitest, App(), ErrorBoundaryProps, ErrorBoundaryState, SparklesIcon(), DemoGuideModal() (+5 more)

### Community 108 - "patientService.ts"
Cohesion: 0.20
Nodes (16): Patients(), addPatient(), archivePatient(), CascadeDeletionResult, deletePatientCascade(), DeletionProgress, getDietsCollection(), getPatientById() (+8 more)

### Community 109 - "dietPersistence.integration.test.ts"
Cohesion: 0.15
Nodes (13): @firebase/rules-unit-testing, ref_node_fs, ref_node_path, ref_node_url, src_locales_en_common, src_locales_pt_common, emitted, source (+5 more)

### Community 110 - "PatientProfile.tsx"
Cohesion: 0.14
Nodes (16): 13 — Reduzir responsabilidades das páginas grandes, UI01–UI12: Entregas, PatientProfile, CheckCircleIcon(), BiomarkerEvolutionChart(), DietComparisonModal(), ProfileAssessmentTab(), ProfileAssessmentTabProps (+8 more)

### Community 111 - "foods.ts"
Cohesion: 0.38
Nodes (5): brazilianFoods, coreFoods, _seen, extraFoods, src_types_index_food

### Community 112 - "ErrorState"
Cohesion: 0.18
Nodes (12): Acessibilidade e estados de interface, Baseline antes das mudanças, Como verificar, Contraste, mobile e movimento (passo 6), Custo no bundle, Estados de interface (passo 7), Formulários e anúncios (passo 3), Gráficos (passo 5) (+4 more)

### Community 113 - "10.3. Reverificação de R01–R09 — estado atual e complementos obrigatórios"
Cohesion: 0.40
Nodes (5): 10.3.1. P1 — R02: preservar campos e transição do protocolo ativo, 10.3.4. P1 — R07: comparar os macros das combinações com a meta diária, 10.3.5. P2 — R08: substituir a simulação de edição por uma jornada verificável, 10.3.6. R01, R03, R05 e R09 — ajustes e evidências ainda necessários, 10.3. Reverificação de R01–R09 — estado atual e complementos obrigatórios

### Community 114 - "dietForm.types.ts"
Cohesion: 0.30
Nodes (8): DietCalculations, DietFormData, MacroSplit, MealSlot, Step1Props, Step2Props, mealCalorieDistribution, Step3Props

### Community 115 - "DietGenerator.tsx"
Cohesion: 0.13
Nodes (18): 10.3.3. P1 — R06: revalidar parâmetros clínicos e preservar a rastreabilidade, DietGenerator, ClinicalContextCard(), ClinicalContextCardProps, modeTone, DietTemplatesSection(), DietTemplatesSectionProps, QuickCalculator() (+10 more)

### Community 116 - "9.4. Conclusão de Prontidão Técnica e Limitações Remanescentes (18/09/2026)"
Cohesion: 0.67
Nodes (3): 9.4. Conclusão de Prontidão Técnica e Limitações Remanescentes (18/09/2026), Evidências Mensuráveis (Data: 18/09/2026):, Limitações Remanescentes e Delimitações de Escopo:

### Community 117 - "Matriz de Baseline e Evidências — Storm Nutrition"
Cohesion: 0.18
Nodes (10): 1. Ambiente e Ferramentas Medidas, 2. Verificação da Nota Histórica do Prettier, 3. Matriz de Achados vs. Evidências no Código, 4. Estado da Integração Contínua (CI), 5.1 Resolução dos Achados do Baseline, 5.2 Medições Consolidadas da Suíte de Testes (18/09/2026), 5.3 Separação de Garantias e Ambientes, 5. Medição e Evidências Pós-Correções (18/09/2026 — Passos C01 a C11) (+2 more)

### Community 118 - "Step6LabExams.tsx"
Cohesion: 0.36
Nodes (7): Step6LabExams(), Step6Props, interpretTest(), labCategories, LabCategory, LabTest, src_types_index_labtest

### Community 120 - "dietAlgorithmService.ts"
Cohesion: 0.12
Nodes (25): R08 e R09: Integridade Estrutural (calculatedTotals e Serialização), NutritionLabel(), NutritionLabelProps, canonicalize(), computeReviewSignature(), dietTemplates, fnv1a(), GenerationParams (+17 more)

### Community 121 - "PatientActionsMenu.tsx"
Cohesion: 0.25
Nodes (6): Teclado e foco visível (passo 4), react-dom, TrashIcon(), menuItems(), PatientActionsMenu(), PatientActionsMenuProps

### Community 122 - "Index of Architectural Decisions"
Cohesion: 0.15
Nodes (12): ADR-01: React 19 SPA with Strict TypeScript and Code-Splitting, ADR-02: Native Compile-Time Tailwind CSS v4, ADR-03: Secondary Firebase Auth Instance for Non-Disruptive Patient Provisioning, ADR-04: Passwordless Tokenized Invitations with Client Coordination & Compensation, ADR-05: Multi-Tenant Isolation via Firestore Security Rules, ADR-06: Deterministic Constraint-Based Meal Generation over Generative AI, ADR-07: Vector-Based Editorial PDF Exporting, ADR-08: Architectural Decoupling of Local Billing Simulation (+4 more)

### Community 124 - "food.ts"
Cohesion: 0.25
Nodes (8): NovaInfo, FoodCompatibilityResult, FoodRestrictions, NovaClassificationOrigin, NovaGroup, RestrictionEvaluation, RestrictionEvaluationSource, RestrictionStatus

### Community 125 - "usePatientDirectory"
Cohesion: 0.29
Nodes (6): GlobalSearch(), auth, Consumer(), Listener, listeners, usePatientDirectory()

### Community 126 - "dateTime.ts"
Cohesion: 0.40
Nodes (9): DEFAULT_CLINIC_TIMEZONE, formatCivilDate(), formatWallClock(), getCivilDateFromDate(), getCivilMonthRange(), getIntlCivilFormatter(), isSameCivilDay(), isValidCivilDate() (+1 more)

### Community 127 - "react"
Cohesion: 0.13
Nodes (17): P2 — UI07: consistência de marca e iconografia, react, react-i18next, PatientPortal, AuthLayoutProps, ChartDataTable(), Dialog(), DialogProps (+9 more)

### Community 128 - "2. Ordem de implementação e critérios de aceite"
Cohesion: 0.20
Nodes (10): 1. Correções desta revisão, 2. Ordem de implementação e critérios de aceite, 3. Protocolo para implementação por outra IA, Entrega — versão visível para avaliadores, P1 — UI12: completar a revisão visual de aceitação, P2 — UI04: texto ampliado e densidade, P2 — UI06: estados raros, P2 — UI08: tabelas e gráficos restantes (+2 more)

### Community 129 - "patientMigrationService.ts"
Cohesion: 0.57
Nodes (6): generateDeterministicId(), normalizeAdherenceEntry(), normalizePatientHistories(), normalizeSelfEvaluation(), normalizeWeightRecord(), mockPatient

### Community 131 - "Registro de Evidências - Revisão 10"
Cohesion: 0.33
Nodes (6): Histórico — relato anterior (preservado, não verificado), R01-R05: Acessibilidade e Logs, R06: Vinculação de Decisão e Alertas, R07: Verificação de Limites Combinatórios, Registro de Evidências - Revisão 10, Validação mais recente — correção dos cinco itens, 19/09/2026

### Community 132 - "2. Roteiro de Avaliação Rápida (3 a 5 minutos)"
Cohesion: 0.33
Nodes (6): 2. Roteiro de Avaliação Rápida (3 a 5 minutos), Passo 1: Acesso com Perfil Clínico, Passo 2: Prontuário e Cálculo Energético, Passo 3: Criação e Envio Seguro de Dieta, Passo 4: Perspectiva do Paciente (Portal), Passo 5: Isolamento Multi-tenant & Faturamento

### Community 133 - "Validação local — correções dos cinco itens"
Cohesion: 0.33
Nodes (6): Identificação e entrega, Limites de conclusão, Regressões e falhas intermediárias, Reprodução, Resultados desta execução, Validação local — correções dos cinco itens

### Community 134 - "Step6Summary.tsx"
Cohesion: 0.33
Nodes (3): EditIcon(), Step6Props, Step6Summary()

## Knowledge Gaps
- **679 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+674 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 867 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `DietPlanDisplay.tsx`, `PatientAccessModal.tsx`, `Calendar.tsx`, `Patients.tsx`, `Step6Summary.tsx`, `BillingSection.tsx`, `metabolicCalculations.ts`, `Login.tsx`, `package.json`, `Home.tsx`, `NewPatientModal.tsx`, `evaluationService.ts`, `types/index.ts`, `AuthContext.tsx`, `Reports.tsx`, `foodService.ts`, `EmailAdmin.tsx`, `Dashboard.tsx`, `3.2 — i18n da UI: páginas e componentes ainda em PT ✅`, `useAuth`, `ProgressBar.tsx`, `MealOptionTable.tsx`, `ui.tsx`, `PatientDietHistoryModal.tsx`, `useDialog.ts`, `icons.tsx`, `vitest`, `PatientProfile.tsx`, `dietForm.types.ts`, `DietGenerator.tsx`, `Step6LabExams.tsx`, `dietAlgorithmService.ts`, `PatientActionsMenu.tsx`, `usePatientDirectory`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `Seção 3 — Design system e UI (UI01–UI12) — 18/09/2026` connect `Seção 3 — Design system e UI (UI01–UI12) — 18/09/2026` to `Modal`, `Home.tsx`, `evidencias-revisao-10.md`, `ProgressBar.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `DietPlanDisplay.tsx`, `patientMigrationService.ts`, `pdfExporter.ts`, `Calendar.tsx`, `Patients.tsx`, `BillingSection.tsx`, `metabolicCalculations.ts`, `dietAlgorithmService.test.ts`, `package.json`, `evaluationService.ts`, `types/index.ts`, `AuthContext.tsx`, `Reports.tsx`, `EmailAdmin.tsx`, `dietService.ts`, `useAuth`, `MealOptionTable.tsx`, `ui.tsx`, `queryCost.test.ts`, `configValidation.ts`, `invitationService.ts`, `patientService.ts`, `dietPersistence.integration.test.ts`, `PatientProfile.tsx`, `usePatientDirectory`, `dateTime.ts`, `react`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _679 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DietPlanDisplay.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11965811965811966 - nodes in this community are weakly interconnected._
- **Should `pdfExporter.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08172043010752689 - nodes in this community are weakly interconnected._
- **Should `Calendar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12222222222222222 - nodes in this community are weakly interconnected._
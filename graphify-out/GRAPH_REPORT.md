# Graph Report - Isanutri V5  (2026-09-19)

## Corpus Check
- 294 files · ~356,159 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 9, .rules 2, .mdc 1)

## Summary
- 1916 nodes · 4640 edges · 140 communities (115 shown, 25 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 173 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9bec01fe`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Design system — contrato de aparência (seção 3, UI01–UI10)
- react
- AcceptInvitation.tsx
- pdfExporter.ts
- Calendar.tsx
- Reports.tsx
- firebaseService.ts
- BillingSection.tsx
- metabolicCalculations.ts
- 4. Etapas detalhadas
- devDependencies
- PatientPortal.tsx
- 9. Adendo de revisão — correções ainda necessárias (18/09/2026)
- react-i18next
- compilerOptions
- package.json
- ErrorBoundary.tsx
- measure-bundle.mjs
- NewPatientModal.tsx
- scripts
- generateAlgorithmicDietPlan
- dependencies
- manifest.json
- firestoreMeter.ts
- vite.config.ts
- evaluationService.ts
- AuthContext.tsx
- Feito — inventário de entregas e evidências
- MealOptionTable.tsx
- foodService.ts
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- What You Must Do When Invoked
- emailService.ts
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
- icons.tsx
- O que precisa ser feito — Storm Nutrition
- 3.2 — i18n da UI: páginas e componentes ainda em PT ✅
- 2. Roteiro de Avaliação Rápida (3 a 5 minutos)
- screens.capture.ts
- useAuth
- Seção 3 — Design system e UI (UI01–UI12) — 18/09/2026
- Patient
- Food
- @playwright/test
- Storm Nutrition — Clinical Management & Diet Planning Platform
- ui.tsx
- DietPlanDisplay.tsx
- build-foods.mjs
- queryCost.test.ts
- useDialog.ts
- 11. Protocolo de entrega verificável para a IA implementadora
- Guia de Demonstração Sintética e Identificação de Simulações
- Home.tsx
- types/index.ts
- configValidation.ts
- dateTime.ts
- Mudanças
- patientService.ts
- src_types_index_patient
- Sidebar.tsx
- ProgressBar.tsx
- dietAlgorithmService.ts
- 10.3. Reverificação de R01–R09 — estado atual e complementos obrigatórios
- DietGenerator.tsx
- mealArchetypeService.ts
- Login.tsx
- Matriz de Baseline e Evidências — Storm Nutrition
- LabExamsModule.tsx
- Capturas de tela (UI11)
- diet.ts
- PatientAccessModal.tsx
- Index of Architectural Decisions
- src_types_index_macrotolerances
- Pendências reais — Storm Nutrition
- Acessibilidade e estados de interface
- DietGenerator
- firestore.rules.test.ts
- 5. Matriz de Garantias e Procedimento de Implantação (Deployment)
- WeightEvolutionChart.tsx
- evidencias-revisao-10.md
- Registro de Evidências - Revisão 10
- dietService.test.ts
- Validação local — correções dos cinco itens
- 3. Ordem de implementação e critérios de aceite (UI e Design System)
- validationIssues.test.ts
- clinicalScreeningService.ts
- 3. Diagnóstico de Falhas e Tratamento de Erros
- 9.4. Conclusão de Prontidão Técnica e Limitações Remanescentes (18/09/2026)
- dietService.ts

## God Nodes (most connected - your core abstractions)
1. `react` - 113 edges
2. `react-i18next` - 79 edges
3. `Patient` - 72 edges
4. `vitest` - 54 edges
5. `useAuth()` - 49 edges
6. `DietPlan` - 36 edges
7. `generateAlgorithmicDietPlan()` - 29 edges
8. `Button` - 27 edges
9. `react-router-dom` - 24 edges
10. `@testing-library/react` - 24 edges

## Surprising Connections (you probably didn't know these)
- `5.3 Separação de Garantias e Ambientes` --references--> `main()`  [INFERRED]
  docs/baseline-matriz.md → scripts/build-foods.mjs
- `Gráficos (passo 5)` --references--> `ChartDataTable()`  [INFERRED]
  docs/accessibility.md → src/components/ChartDataTable.tsx
- `UI09 — Em implementação` --references--> `StepProgress()`  [INFERRED]
  docs/evidencias-revisao-10.md → src/components/StepProgress.tsx
- `Resultados: bundle de produção` --references--> `ExportDietModal()`  [INFERRED]
  docs/performance.md → src/components/modals/ExportDietModal.tsx
- `2. Tokens (UI02)` --references--> `Badge()`  [INFERRED]
  docs/design-system.md → src/components/ui.tsx

## Import Cycles
- None detected.

## Communities (140 total, 25 thin omitted)

### Community 0 - "Design system — contrato de aparência (seção 3, UI01–UI10)"
Cohesion: 0.29
Nodes (6): 1. Tema suportado (UI03), 2. Tokens (UI02), 3. Camadas e composição (UI01), 5. Tipografia e densidade (UI04), 7. Verificação, Design system — contrato de aparência (seção 3, UI01–UI10)

### Community 1 - "react"
Cohesion: 0.10
Nodes (15): react, @testing-library/react, vitest, patient, SelfEvaluationForm(), patient, revokePatientPortalAccess, sendPortalAccessEmail (+7 more)

### Community 2 - "AcceptInvitation.tsx"
Cohesion: 0.23
Nodes (14): R03 — Validado, ref_firebase_auth, AcceptInvitation(), src_services_firebasecore_user, acceptInvitationWithExistingAccount(), acceptInvitationWithNewAccount(), computeInvitationStatus(), CreateInvitationParams (+6 more)

### Community 3 - "pdfExporter.ts"
Cohesion: 0.08
Nodes (25): jspdf, ExportDietModal(), src_types_index_calculateddiettotals, AMBER, AMBER_TEXT, ClinicInfo, CustomLayoutPdfOptions, FAINT (+17 more)

### Community 4 - "Calendar.tsx"
Cohesion: 0.14
Nodes (27): Calendar, ApptModalProps, Calendar(), TYPE_DOT, TYPE_LIGHT, addAppointment(), deleteAppointment(), findAppointmentConflict() (+19 more)

### Community 5 - "Reports.tsx"
Cohesion: 0.12
Nodes (24): ActivityIconKey, ActivityItem, buildMonthlyDietBuckets(), buildRecentActivity(), formatRelative(), MonthBucket, RECENT_ACTIVITY_LIMIT, PerformanceSectionProps (+16 more)

### Community 6 - "firebaseService.ts"
Cohesion: 0.17
Nodes (17): 🟢 Passo 6 — Robustez do Portal do Paciente (NOVO) ✅ (concluído), ref_firebase_app, createPatientAccount(), createPatientPortalProfile(), setupPatientPortalAccess(), updatePatientPortalRef(), updateUserProfile(), app (+9 more)

### Community 7 - "BillingSection.tsx"
Cohesion: 0.10
Nodes (42): ref_firebase_storage, CreditCardIcon(), BillingSection(), useDietTemplates(), SetValue, usePersistentState(), Settings(), uploadProfilePicture() (+34 more)

### Community 8 - "metabolicCalculations.ts"
Cohesion: 0.20
Nodes (18): MetabolicCalculator, MetabolicCalculator(), ActivityLevel, activityMultipliers, calculateBMI(), calculateBMR(), calculateMacrosInGrams(), calculateTargetCalories() (+10 more)

### Community 9 - "4. Etapas detalhadas"
Cohesion: 0.09
Nodes (23): 01 — Estabelecer baseline e corrigir o controle de status, 02 — Tornar instalação, emuladores e CI reproduzíveis, 03 — Corrigir o contrato de persistência das dietas, 04 — Tratar autenticação como fluxo com estados explícitos, 05 — Isolar rascunhos e configurações por conta, 06 — Fortalecer autorização e validação de dados, 07 — Substituir envio de senha por convite seguro, 08 — Tornar restrições e dados alimentares explícitos (+15 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (26): devDependencies, @axe-core/playwright, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @firebase/rules-unit-testing, firebase-tools (+18 more)

### Community 11 - "PatientPortal.tsx"
Cohesion: 0.11
Nodes (23): R08 — Validado, UI02 — Em implementação, 13 — Reduzir responsabilidades das páginas grandes, UI01–UI12: Entregas, P1 — UI02/UI09: estados e feedback consistentes, react-dom, PatientPortal, Dialog() (+15 more)

### Community 12 - "9. Adendo de revisão — correções ainda necessárias (18/09/2026)"
Cohesion: 0.12
Nodes (16): 9.1. Como outra IA deve utilizar este adendo, 9.2. Ordem de execução das correções, 9.3. Checklist de encerramento deste adendo, 9. Adendo de revisão — correções ainda necessárias (18/09/2026), C01 — Impedir vínculos autodeclarados e apropriação de portal, C02 — Proteger conteúdo e autoria dos históricos, C03 — Tornar convites atômicos, idempotentes e recuperáveis, C04 — Corrigir Java, configuração sintética e reprodução em checkout limpo (+8 more)

### Community 13 - "react-i18next"
Cohesion: 0.12
Nodes (19): react-i18next, PatientProfile, QuickCalculatorProps, TargetIcon(), BiomarkerData, BiomarkerEvolutionChart(), BiomarkerEvolutionChartProps, ProfileDietsTab() (+11 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+10 more)

### Community 15 - "package.json"
Cohesion: 0.08
Nodes (25): engines, node, name, private, type, version, eslint, @eslint/js (+17 more)

### Community 16 - "ErrorBoundary.tsx"
Cohesion: 0.18
Nodes (5): ref_react_dom_client, App(), ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState

### Community 17 - "measure-bundle.mjs"
Cohesion: 0.10
Nodes (24): ref_node_zlib, vite, assets, chunks, closure(), collectChunkGraph, composition, compositionSorted (+16 more)

### Community 18 - "NewPatientModal.tsx"
Cohesion: 0.16
Nodes (21): errBorder(), Step1Objectives(), Step2Nutrition(), initialFormData, NewPatientModal(), NewPatientModalProps, Step1Personal(), Step1Props (+13 more)

### Community 19 - "scripts"
Cohesion: 0.09
Nodes (23): scripts, build, demo:reset, demo:seed, dev, dev:emulated, dev:emulator, emulators (+15 more)

### Community 20 - "generateAlgorithmicDietPlan"
Cohesion: 0.27
Nodes (14): generateAlgorithmicDietPlan(), InfeasiblePlanError, validateGenerationParams(), evaluateFoodRestriction(), foodContainsDairy(), foodContainsGluten(), foodContainsLactose(), foodIsVegan() (+6 more)

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

### Community 25 - "evaluationService.ts"
Cohesion: 0.12
Nodes (27): R02 — Validado, ProfileAssessmentTab(), ProfileAssessmentTabProps, CompleteEvaluationOptions, completeSelfEvaluation(), logAdherence(), LogAdherenceOptions, logPatientWeight() (+19 more)

### Community 26 - "AuthContext.tsx"
Cohesion: 0.18
Nodes (16): AuthContext, AuthContextType, AuthProvider(), firebaseSignOut(), getNutritionistProfile(), getPatientPortalProfile(), src_services_firebaseservice_onauthstatechanged, AuthError (+8 more)

### Community 27 - "Feito — inventário de entregas e evidências"
Cohesion: 0.22
Nodes (9): 1. O que significa “feito” neste registro, 2. Entregas encontradas na implementação atual, 3. Resultados históricos existentes — não reexecutados nesta revisão, 4. Trabalho efetivamente realizado nesta revisão, 5. Decisões de organização e limites, 6. Como acrescentar novas entregas, Atualização de 19/09/2026 — correções efetivamente executadas, Feito — inventário de entregas e evidências (+1 more)

### Community 28 - "MealOptionTable.tsx"
Cohesion: 0.18
Nodes (11): NutritionLabel(), NutritionLabelProps, OptionTable(), parseAmounts(), parseFoodNames(), Props, MealOption, MealOptionItem (+3 more)

### Community 29 - "foodService.ts"
Cohesion: 0.09
Nodes (29): FoodDatabase(), foodCategories, getAvailableCarbs(), getFoodCategoryName(), getFoodName(), giLevel(), glLevel(), GLUTEN_HINTS (+21 more)

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

### Community 35 - "emailService.ts"
Cohesion: 0.07
Nodes (41): 3.1 — Código e comentários em inglês ✅, 3.3 — Camadas de conteúdo (não são strings de UI — exigem abordagem própria) ✅, ✅ Critério de "pronto para avaliação", 🛠️ Detalhamento, 🗺️ Ordem de Execução Sugerida (atualizada), 🟢 Passo 1 — TypeScript Strict ✅ (concluído), 🟢 Passo 3 — Internacionalização ✅ (concluído), 🔵 Passo 4 — Segurança e CI/CD ✅ (concluído — revisar qualidade) (+33 more)

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
Cohesion: 0.20
Nodes (9): 1.1 Variáveis de Ambiente Públicas (Client-Side), 1.2 Segredos e Credenciais que NUNCA devem estar no Frontend, 1. Arquitetura de Configuração e Separação de Segredos, 2. Hardening e Compatibilidade com Content Security Policy (CSP), 4. Auditoria de Dependências, 6.1 Rollback Imediato do Frontend (Firebase Hosting), 6.2 Rollback de Regras de Segurança e Índices, 6. Procedimento de Contingência e Rollback (+1 more)

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

### Community 85 - "icons.tsx"
Cohesion: 0.08
Nodes (34): UI01 — Validado, react-router-dom, Dashboard, src_components_dashboard_index_monthsummarycard, src_components_dashboard_index_onboardingbanner, src_components_dashboard_index_performancesection, src_components_dashboard_index_quickactionssection, src_components_dashboard_index_recentactivitycard (+26 more)

### Community 86 - "O que precisa ser feito — Storm Nutrition"
Cohesion: 0.17
Nodes (11): 1. Objetivo e contexto para quem vai implementar, 2. Instruções de execução para outra IA ou desenvolvedor, 3. Ordem de prioridade, 5. Sequência sugerida de PRs, 6. Critérios finais de pronto para avaliação, 7. Escopo que não deve crescer automaticamente, 8. Estimativa de planejamento, Documentação consultada (+3 more)

### Community 87 - "3.2 — i18n da UI: páginas e componentes ainda em PT ✅"
Cohesion: 0.13
Nodes (19): 3.2 — i18n da UI: páginas e componentes ainda em PT ✅, ClinicalTagSelector(), Props, TagOption, tags, ModeOption, modes, ModeSelector() (+11 more)

### Community 88 - "2. Roteiro de Avaliação Rápida (3 a 5 minutos)"
Cohesion: 0.33
Nodes (6): 2. Roteiro de Avaliação Rápida (3 a 5 minutos), Passo 1: Acesso com Perfil Clínico, Passo 2: Prontuário e Cálculo Energético, Passo 3: Criação e Envio Seguro de Dieta, Passo 4: Perspectiva do Paciente (Portal), Passo 5: Isolamento Multi-tenant & Faturamento

### Community 89 - "screens.capture.ts"
Cohesion: 0.20
Nodes (9): ref_node_child_process, DESKTOP, Entry, manifest, MOBILE, OUT, settle(), shot() (+1 more)

### Community 90 - "useAuth"
Cohesion: 0.10
Nodes (23): Decisões e trade-offs, AcceptInvitation, AppRoutes(), FoodDatabase, Home, Patients, Register, Reports (+15 more)

### Community 91 - "Seção 3 — Design system e UI (UI01–UI12) — 18/09/2026"
Cohesion: 0.20
Nodes (10): Seção 3 — Design system e UI (UI01–UI12) — 18/09/2026, UI03 — Validado, UI04 — Em implementação, UI06 — Em implementação, UI08 — Em implementação, UI09 — Em implementação, UI10 — Em implementação, UI11 — Validado (revisão humana externa pendente) (+2 more)

### Community 92 - "Patient"
Cohesion: 0.11
Nodes (18): ref_firebase_firestore, DietSuccessCardProps, PatientDietHistoryModalProps, Step6Props, Step6Summary(), ProfileExamsTabProps, historicalDietPlan, mockPatient (+10 more)

### Community 93 - "Food"
Cohesion: 0.21
Nodes (12): brazilianFoods, coreFoods, _seen, extraFoods, clampPortion(), formatHouseholdMeasure(), getPortionBoundaries(), normalize() (+4 more)

### Community 95 - "Storm Nutrition — Clinical Management & Diet Planning Platform"
Cohesion: 0.15
Nodes (13): 🏗️ Architecture Diagram, 🏛️ Core Engineering & Architecture Decisions, ⚠️ Disclaimers & Known Limitations, 🧮 Domain Logic & Clinical Constraints Engine, 📄 Licenses & Data Attributions, 🛠️ Local Setup & Reproducible Execution, Metabolic Equations (BMR & TDEE), Nutritional Database & Constraint Rules (+5 more)

### Community 96 - "ui.tsx"
Cohesion: 0.08
Nodes (32): Seção 3 — Design system e UI (execução de 18/09/2026), AlertTriangleIcon(), PlusIcon(), EmptyState(), EmptyStateProps, LoadingState(), PatientActionsMenuProps, alertIcons (+24 more)

### Community 97 - "DietPlanDisplay.tsx"
Cohesion: 0.12
Nodes (28): Diálogos (passos 1 e 2), 4. Controles (UI05), UI05 — Em implementação, DietPlanDisplayProps, ExportDietModal, DietPlanViewer(), isV2Plan(), DownloadIcon() (+20 more)

### Community 98 - "build-foods.mjs"
Cohesion: 0.21
Nodes (14): Formulários e anúncios (passo 3), buildColumnIndex(), CANONICAL_CATEGORIES, CATEGORY_MAP, COLUMN_MAP, FOOD_NAME_TRANSLATIONS, inferNova(), main() (+6 more)

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

### Community 103 - "Home.tsx"
Cohesion: 0.11
Nodes (3): ZapIcon(), LanguageSelector(), showcaseFrames

### Community 104 - "types/index.ts"
Cohesion: 0.15
Nodes (10): DietPlanViewerProps, Sub, subs, useLatestDiets(), UsePatientPortalDataReturn, latestDietListeners, roster, AnyDietPlan (+2 more)

### Community 105 - "configValidation.ts"
Cohesion: 0.14
Nodes (16): config, rootElement, ConfigValidationResult, DEMO_PROJECT_ID, DEMO_PROJECT_PREFIX, getRuntimeEnv(), REQUIRED_FIREBASE_KEYS, runStartupDiagnostics() (+8 more)

### Community 106 - "dateTime.ts"
Cohesion: 0.33
Nodes (11): AdherenceCheckIn(), DEFAULT_CLINIC_TIMEZONE, formatCivilDate(), formatWallClock(), getCivilDateFromDate(), getCivilMonthRange(), getCivilToday(), getIntlCivilFormatter() (+3 more)

### Community 107 - "Mudanças"
Cohesion: 0.25
Nodes (8): Contraste, mobile e movimento (passo 6), Custo no bundle, Estados de interface (passo 7), Gráficos (passo 5), Mudanças, Teclado e foco visível (passo 4), menuItems(), PatientActionsMenu()

### Community 108 - "patientService.ts"
Cohesion: 0.15
Nodes (19): usePatientProfile(), UsePatientProfileReturn, Patients(), addPatient(), archivePatient(), CascadeDeletionResult, countPatients(), deletePatient (+11 more)

### Community 109 - "src_types_index_patient"
Cohesion: 0.50
Nodes (7): generateDeterministicId(), normalizeAdherenceEntry(), normalizePatientHistories(), normalizeSelfEvaluation(), normalizeWeightRecord(), mockPatient, src_types_index_patient

### Community 110 - "Sidebar.tsx"
Cohesion: 0.11
Nodes (12): EmailAdmin, InformationCircleIcon(), LogInIcon(), PaperAirplaneIcon(), SearchIcon(), XCircleIcon(), deriveNotifications(), GlobalSearch() (+4 more)

### Community 111 - "ProgressBar.tsx"
Cohesion: 0.22
Nodes (7): DietProgressBar(), DietProgressBarProps, ProgressBar(), ProgressBarProps, steps, StepProgress(), StepProgressStep

### Community 112 - "dietAlgorithmService.ts"
Cohesion: 0.17
Nodes (14): i18next, canonicalize(), computeReviewSignature(), createPrng(), dietTemplates, fnv1a(), GenerationParams, getGeneralObservations() (+6 more)

### Community 113 - "10.3. Reverificação de R01–R09 — estado atual e complementos obrigatórios"
Cohesion: 0.40
Nodes (5): 10.3.1. P1 — R02: preservar campos e transição do protocolo ativo, 10.3.4. P1 — R07: comparar os macros das combinações com a meta diária, 10.3.5. P2 — R08: substituir a simulação de edição por uma jornada verificável, 10.3.6. R01, R03, R05 e R09 — ajustes e evidências ainda necessários, 10.3. Reverificação de R01–R09 — estado atual e complementos obrigatórios

### Community 114 - "DietGenerator.tsx"
Cohesion: 0.12
Nodes (21): DietGenerator, ClinicalContextCard(), ClinicalContextCardProps, modeTone, DietCalculations, DietFormData, MacroSplit, MealSlot (+13 more)

### Community 115 - "mealArchetypeService.ts"
Cohesion: 0.23
Nodes (10): P1 — Inteligência culinária, modelagem de refeições e cálculo conjunto [CONCLUÍDO — 19/09/2026], P2 — Validação empírica, testes de aceitação e comprovação de qualidade, Plano de execução por ordem de prioridade, ArchetypeSlot, classifyMealArchetype(), isFoodSuitableForArchetype(), MEAL_ARCHETYPES, MealArchetype (+2 more)

### Community 116 - "Login.tsx"
Cohesion: 0.13
Nodes (19): 6. Superfícies, raios e movimento (UI07, UI10), UI07 — Em implementação, Login, AuthLayout(), AuthLayoutProps, EyeIcon(), EyeOffIcon(), GoogleIcon() (+11 more)

### Community 117 - "Matriz de Baseline e Evidências — Storm Nutrition"
Cohesion: 0.22
Nodes (8): 1. Ambiente e Ferramentas Medidas, 2. Verificação da Nota Histórica do Prettier, 4. Estado da Integração Contínua (CI), 5.1 Resolução dos Achados do Baseline, 5.2 Medições Consolidadas da Suíte de Testes (18/09/2026), 5.3 Separação de Garantias e Ambientes, 5. Medição e Evidências Pós-Correções (18/09/2026 — Passos C01 a C11), Matriz de Baseline e Evidências — Storm Nutrition

### Community 118 - "LabExamsModule.tsx"
Cohesion: 0.21
Nodes (12): LabExamsModule(), Props, suggestionsByMode, suggestionsByTag, translateExamName(), Step6LabExams(), Step6Props, interpretTest() (+4 more)

### Community 120 - "diet.ts"
Cohesion: 0.15
Nodes (15): R08 e R09: Integridade Estrutural (calculatedTotals e Serialização), GenerationResult, ClinicalApproval, DecisionEntry, DietPlanFirestoreDto, DietPlanStatus, DietPlanUpdateDto, MacroTolerances (+7 more)

### Community 121 - "PatientAccessModal.tsx"
Cohesion: 0.16
Nodes (15): Plano histórico (etapas 01–20 e C01–C12): o que esta revisão demonstra, R01 — Validado (local; CI remota não executada), R04 — Validado, R05 — Validado, R07 — Validado, R09 — Validado (revisão humana pendente), Índice histórico — R01–R09 (execução de 19/09/2026, 09:41–09:43), 10.3.2. P1 — R04: não devolver convite invalidado no reenvio (+7 more)

### Community 122 - "Index of Architectural Decisions"
Cohesion: 0.15
Nodes (12): ADR-01: React 19 SPA with Strict TypeScript and Code-Splitting, ADR-02: Native Compile-Time Tailwind CSS v4, ADR-03: Secondary Firebase Auth Instance for Non-Disruptive Patient Provisioning, ADR-04: Passwordless Tokenized Invitations with Client Coordination & Compensation, ADR-05: Multi-Tenant Isolation via Firestore Security Rules, ADR-06: Deterministic Constraint-Based Meal Generation over Generative AI, ADR-07: Vector-Based Editorial PDF Exporting, ADR-08: Architectural Decoupling of Local Billing Simulation (+4 more)

### Community 124 - "Pendências reais — Storm Nutrition"
Cohesion: 0.29
Nodes (7): 1. Correções desta revisão, 2. Incongruências encontradas na geração, 3. Protocolo para implementação por outra IA, Diagnóstico de problemas, Falhas no motor e na modelagem nutricional, Incongruências nos avisos e na entrega, Pendências reais — Storm Nutrition

### Community 125 - "Acessibilidade e estados de interface"
Cohesion: 0.33
Nodes (5): Acessibilidade e estados de interface, Baseline antes das mudanças, Como verificar, O que é verificado automaticamente, Pendências e limitações conhecidas

### Community 126 - "DietGenerator"
Cohesion: 0.28
Nodes (11): DietGenerator(), recalculateDietTotals(), src_types_index_mealoption, applyPortionEdit(), OptionKey, rescaleItemPortion(), round1(), withItemTotals() (+3 more)

### Community 127 - "firestore.rules.test.ts"
Cohesion: 0.15
Nodes (10): 3. Matriz de Achados vs. Evidências no Código, @firebase/rules-unit-testing, ref_node_url, auth, fbApp, db(), nutriDb(), __dirname (+2 more)

### Community 128 - "5. Matriz de Garantias e Procedimento de Implantação (Deployment)"
Cohesion: 0.40
Nodes (5): 5.1 Checklist Pré-Implantação, 5.2 Comandos de Deploy Manual, 5. Matriz de Garantias e Procedimento de Implantação (Deployment), A. Implantação de Regras e Índices (Backend Firebase), B. Implantação do Frontend Estático (Hosting)

### Community 129 - "WeightEvolutionChart.tsx"
Cohesion: 0.19
Nodes (10): 🟡 Passo 2 — Testes Automatizados ⚠️ (parcial), P2 — UI07: consistência de marca e iconografia, ChartDataTable(), ProfileEvolutionTab(), ProfileEvolutionTabProps, Props, RangeFilter, WeightEvolutionChart() (+2 more)

### Community 131 - "Registro de Evidências - Revisão 10"
Cohesion: 0.33
Nodes (6): Histórico — relato anterior (preservado, não verificado), R01-R05: Acessibilidade e Logs, R06: Vinculação de Decisão e Alertas, R07: Verificação de Limites Combinatórios, Registro de Evidências - Revisão 10, Validação mais recente — correção dos cinco itens, 19/09/2026

### Community 132 - "dietService.test.ts"
Cohesion: 0.16
Nodes (21): R06 — Validado, 10.3.3. P1 — R06: revalidar parâmetros clínicos e preservar a rastreabilidade, assertReviewMatches(), DietReviewOutdatedError, isFiniteNumber(), sanitizeCalculatedTotals(), sanitizeDecisionLog(), sanitizeLabExams() (+13 more)

### Community 133 - "Validação local — correções dos cinco itens"
Cohesion: 0.33
Nodes (6): Identificação e entrega, Limites de conclusão, Regressões e falhas intermediárias, Reprodução, Resultados desta execução, Validação local — correções dos cinco itens

### Community 134 - "3. Ordem de implementação e critérios de aceite (UI e Design System)"
Cohesion: 0.25
Nodes (8): 3. Ordem de implementação e critérios de aceite (UI e Design System), Entrega — versão visível para avaliadores, P1 — UI12: completar a revisão visual de aceitação, P2 — UI04: texto ampliado e densidade, P2 — UI05: concluir adoção dos controles, P2 — UI06: estados raros, P2 — UI08: tabelas e gráficos restantes, P3 — UI10: confirmar ganho em tarefas reais

### Community 135 - "validationIssues.test.ts"
Cohesion: 0.22
Nodes (6): ref_node_fs, ref_node_path, src_locales_en_common, src_locales_pt_common, emitted, source

### Community 136 - "clinicalScreeningService.ts"
Cohesion: 0.32
Nodes (10): P0 — Integridade, segurança clínica e bloqueio de entrega inadequada [CONCLUÍDO — 19/09/2026], ALLERGEN_KEYWORD_MAP, buildUnifiedClinicalContext(), CompatibilityResult, evaluateFoodCompatibility(), matchFoodAllergen(), NOISE_PREFIXES, normalizeText() (+2 more)

### Community 137 - "3. Diagnóstico de Falhas e Tratamento de Erros"
Cohesion: 0.50
Nodes (4): 3.1 Taxonomia de Falhas (`src/utils/errors.ts`), 3.2 Identificadores de Correlação e Privacidade nos Logs, 3.3 Fronteiras de Erro Multi-Nível (`src/components/ErrorBoundary.tsx`), 3. Diagnóstico de Falhas e Tratamento de Erros

### Community 138 - "9.4. Conclusão de Prontidão Técnica e Limitações Remanescentes (18/09/2026)"
Cohesion: 0.67
Nodes (3): 9.4. Conclusão de Prontidão Técnica e Limitações Remanescentes (18/09/2026), Evidências Mensuráveis (Data: 18/09/2026):, Limitações Remanescentes e Delimitações de Escopo:

### Community 143 - "dietService.ts"
Cohesion: 0.20
Nodes (17): PatientDietHistoryModal(), byNewestFirst(), deleteDietPlan(), getDietDoc(), getDietsCollection(), getPatientDiets(), handleSnapshotError(), saveDietPlan() (+9 more)

## Knowledge Gaps
- **689 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+684 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 881 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `WeightEvolutionChart.tsx`, `AcceptInvitation.tsx`, `Calendar.tsx`, `Reports.tsx`, `BillingSection.tsx`, `metabolicCalculations.ts`, `PatientPortal.tsx`, `react-i18next`, `package.json`, `ErrorBoundary.tsx`, `NewPatientModal.tsx`, `evaluationService.ts`, `AuthContext.tsx`, `MealOptionTable.tsx`, `foodService.ts`, `icons.tsx`, `3.2 — i18n da UI: páginas e componentes ainda em PT ✅`, `useAuth`, `Patient`, `ui.tsx`, `DietPlanDisplay.tsx`, `useDialog.ts`, `Home.tsx`, `types/index.ts`, `dateTime.ts`, `patientService.ts`, `Sidebar.tsx`, `ProgressBar.tsx`, `DietGenerator.tsx`, `Login.tsx`, `LabExamsModule.tsx`, `PatientAccessModal.tsx`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `vitest` connect `react` to `AcceptInvitation.tsx`, `pdfExporter.ts`, `Calendar.tsx`, `dietService.test.ts`, `Reports.tsx`, `BillingSection.tsx`, `validationIssues.test.ts`, `clinicalScreeningService.ts`, `metabolicCalculations.ts`, `package.json`, `ErrorBoundary.tsx`, `generateAlgorithmicDietPlan`, `evaluationService.ts`, `emailService.ts`, `Patient`, `Food`, `ui.tsx`, `DietPlanDisplay.tsx`, `queryCost.test.ts`, `types/index.ts`, `configValidation.ts`, `dateTime.ts`, `patientService.ts`, `src_types_index_patient`, `dietAlgorithmService.ts`, `mealArchetypeService.ts`, `DietGenerator`, `firestore.rules.test.ts`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `react-i18next` to `WeightEvolutionChart.tsx`, `react`, `AcceptInvitation.tsx`, `Calendar.tsx`, `Reports.tsx`, `BillingSection.tsx`, `metabolicCalculations.ts`, `PatientPortal.tsx`, `package.json`, `NewPatientModal.tsx`, `evaluationService.ts`, `MealOptionTable.tsx`, `foodService.ts`, `icons.tsx`, `3.2 — i18n da UI: páginas e componentes ainda em PT ✅`, `useAuth`, `Patient`, `ui.tsx`, `DietPlanDisplay.tsx`, `Home.tsx`, `dateTime.ts`, `Sidebar.tsx`, `ProgressBar.tsx`, `DietGenerator.tsx`, `Login.tsx`, `LabExamsModule.tsx`, `PatientAccessModal.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _689 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.1039136302294197 - nodes in this community are weakly interconnected._
- **Should `pdfExporter.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08374384236453201 - nodes in this community are weakly interconnected._
- **Should `Calendar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13911290322580644 - nodes in this community are weakly interconnected._
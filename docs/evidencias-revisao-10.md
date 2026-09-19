# Registro de Evidências - Revisão 10

## Validação mais recente — correção dos cinco itens, 19/09/2026

Consulte [resultados, logs e limites da execução atual](validacao-2026-09-19/README.md) e [manifesto SHA-256 atual](evidencias-ui-manifesto.txt). Esta revisão corrigiu bloqueio de escrita de pacientes arquivados, selo clínico indevido, divergência entre fontes/evidências, conclusão documental sem comprovação e apresentação pública desatualizada.

As seções abaixo são históricas. A nova execução não transforma automaticamente critérios de UI incompletos em concluídos. O backlog vigente está em [o-que-precisa-ser-feito.md](../o-que-precisa-ser-feito.md). `Alert` já existe e foi adotado parcialmente; a recomendação histórica de criá-lo foi superada. A opacidade 0,5 citada na galeria histórica também foi substituída por cores explícitas de desabilitado, com regressão atualizada e contrato documentado.


## Índice histórico — R01–R09 (execução de 19/09/2026, 09:41–09:43)

**Como ler:** cada item segue o modelo 11.4 e cita os IDs da matriz 11.3. "Validado" = todos os critérios aplicáveis com teste e execução no estado entregue. Resultados **locais**; CI remota **não executada** (nada foi enviado ao GitHub). Implantação: não realizada. Revisão humana: pendente.

**Execução de referência (estado entregue):** macOS, America/Sao_Paulo (-03:00), Node v22.22.3, npm 10, OpenJDK 26.0.2, firebase-tools 15.30.1, Playwright 1.60.0. Árvore de trabalho sobre HEAD `2baeaec` (não commitada); hashes em [manifesto daquela execução](validacao-2026-09-19/manifesto-anterior.txt).

| Comando (19/09, 09:41–09:43) | Resultado |
| --- | --- |
| `npm run format:check` | exit 0 |
| `npm run lint` | exit 0 — 0 erros, 4 avisos preexistentes (react-refresh/exhaustive-deps) |
| `npm run type-check` | exit 0 |
| `npm run build` | exit 0 |
| `npm run test:coverage` | exit 0 — 46 arquivos, **432** testes; limites por arquivo atendidos |
| `npm run test:rules` | exit 0 — 2 arquivos, **97** testes (regras reais no emulador) |
| `npm run test:perf:queries` | exit 0 — 15 testes |
| `npm run test:e2e:emulated` | exit 0 — **23** testes Playwright (jornada, portal, convite, acessibilidade, design system) |

**Reprodução limpa (R01-A), 09:36–09:39:** os arquivos que um checkout teria (`git ls-files -co --exclude-standard`, 318 arquivos, **sem `.env.local`**, com `config/emulator/.env` sintético) foram copiados para um diretório temporário. Lá, `npm ci` (1026 pacotes), `format:check`, `lint`, `type-check`, `build`, `test:coverage` (429), `test:rules` (96), `test:perf:queries` (15) e `test:e2e:emulated` (23) passaram, todos com exit 0. Depois disso, entraram 3 testes (R02 concorrência, R04 UI) e uma correção no modal de acesso, revalidados na execução de referência acima.

### R01 — Validado (local; CI remota não executada)
- **Critérios 11.3:** R01-A, R01-B.
- **Problema confirmado:** `engines`/`.nvmrc`/CI declaravam Node 20.19.0, mas o lockfile tem 17 pacotes de desenvolvimento (transitivos do firebase-tools: `node-gyp`, `re2`, `googleapis-common`…) que exigem Node ≥22 (vários `^22.22.2 || ^24.15.0 || >=26`). O README pedia Node ≥20 e Java ≥17. `type-check` e `lint` falhavam (refatoração `calculatedTotals`/`cleanupIncomplete` incompleta e imports não usados).
- **Alterado:** `package.json` (`engines.node: ^22.22.2 || ^24.15.0 || >=26.0.0`), `.nvmrc` (22.22.2), `.github/workflows/ci.yml` (`node-version-file: .nvmrc` nos 2 jobs; Java 21 mantido), README (pré-requisitos e comandos), `docs/deployment-and-config.md`, nota em `docs/baseline-matriz.md`. Tipos completados: `dietAlgorithmService` (import), `pdfExporter` (fallback legado tipado), `revokePatientPortalAccess` (`cleanupIncomplete`), fixtures de teste. Imports removidos de `invitationService`.
- **Evidência:** tabela acima; checagem de engines por script sobre `package-lock.json` (17 incompatíveis com 20.19.0; 0 com 22.22.2+).
- **Sem comprovação:** execução com exatamente Node 22.22.2 e Java 21 (local foi 22.22.3/26.0.2); CI remota.
- **Próxima ação:** push de branch e leitura do resultado da CI (depende de autorização do usuário).

### R02 — Validado
- **Critérios 11.3:** R02-A, R02-B, R02-C.
- **Problema confirmado:** (1) a resposta de autoavaliação aceitava campos arbitrários e valores fora de faixa; o paciente podia apagar `activeProtocolId` sem responder. (2) Datas futuras eram aceitas em peso e adesão. (3) **Bug real:** `logPatientWeight`, `completeSelfEvaluation` e `logAdherence` gravavam o array *sanitizado e reordenado* de `validatePatient`; com histórico legado fora de ordem ou sem `origin`, a regra de append-only negava a escrita legítima. (4) O teste "ALLOWS legitimate transition…" não semeava protocolo pendente, e o teste de adulteração ao lado passava pelo motivo errado.
- **Alterado:** `firestore.rules` (allowlist da resposta: medidas 0–500, escalas 1–5, texto ≤ 2000; protocolo só se encerra respondendo; `isPatientDateValid` ≤ hoje + 1 dia; allowlist dos registros de peso e adesão); `evaluationService.ts` (`storedArray`: grava armazenado + novo, sem reordenar nem normalizar).
- **Testes:** `tests-rules/firestore.rules.test.ts` › "15. R02 …" (A: dois registros num write, sem `authorUid`, campo extra, data futura; B: campos arbitrários, faixas, `requestDate`, status, outro registro alterado, dispensa sem resposta, resposta legítima; C: append sobre legado fora de ordem com data futura, negação quando re-ordenado ou normalizado, adesão, **concorrência** com estado antigo). `src/services/__tests__/evaluationService.test.ts` › "R02-C — legacy histories are preserved as stored". Fixtures corrigidos em "4. … selfEvaluations" (a data de conclusão passou a ser a atual, porque data futura agora é negada por política).
- **Sem comprovação:** nenhuma no escopo local.

### R03 — Validado
- **Critérios 11.3:** R03-A, R03-B.
- **Problema confirmado:** as regras já negavam os casos, mas não havia prova por caso nem de ausência de estado parcial. O serviço decidia a validade pela data textual `expiresAt` e tratava um convite legado (sem e-mail ou `Timestamp`) como válido, que só falhava depois, no servidor, com um erro genérico.
- **Alterado:** `invitationService.ts` (`isStrictlyUsableInvitation`; `getInvitationByToken` marca `invalidReason: "legacy_format"`; o `Timestamp` prevalece; o aceite recusa com `INVITATION_LEGACY`); `AcceptInvitation.tsx` e i18n (`invite.status_legacy`: pedir novo convite).
- **Testes:** regras › "16. R03 …" (7 variantes negadas: sem e-mail, sem timestamp, timestamp em string, expirado, revogado, outro destinatário, conta sem e-mail; em todas, nenhum convite, perfil ou vínculo parcial; válido com e-mail em maiúsculas aceito; repetição não reabre o terminal). Serviço › "R03/R04 — strict contract in the service".
- **Sem comprovação:** nenhuma.

### R04 — Validado
- **Critérios 11.3:** R04-A, R04-B.
- **Problema confirmado:** o reuso de convite pendente olhava só status e data textual. `cleanupIncomplete` era calculado mas não ia para o tipo nem para a UI. **Bug real:** com o paciente vinculado, o erro de revogação nunca aparecia no modal (o bloco de erro só existia no estado sem acesso), então a falha ficava só no console.
- **Alterado:** `createOrGetPendingInvitation` (reusa só com contrato estrito e o mesmo destinatário normalizado; senão cria novo ID e revoga o substituído na mesma transação); `revokePatientPortalAccess` (retorno tipado); `PatientAccessModal` (aviso de limpeza incompleta com `role=alert`, mensagem de falta de permissão, erro visível no estado vinculado).
- **Testes:** regras › "17. R04 …" (convite antigo pendente negado e novo ID aceito; revogação concorrente vence o aceite). `patientLifecycle.test.ts` › "R04-A: reports incomplete cleanup but still clears the pointer…". `invitationService.test.ts` › reuso por destinatário e formato. `PatientAccessModal.email.test.tsx` › "revocation outcomes (R04)" (efetiva, incompleta, sem permissão).
- **Sem comprovação:** nenhuma.

### R05 — Validado
- **Critérios 11.3:** R05-A, R05-B.
- **Problema inicial:** a matriz estava incompleta (sem modo `test`, sem portal nos três modos, sem transporte ausente ou inválido) e a mensagem visual não tinha teste.
- **Testes:** `emailService.test.ts` › "R05 — adversarial isolation matrix" (emulador, demo e teste × dieta e portal, com `transport=real`, chaves e domínio externo → simulado, **0 chamadas** ao EmailJS; fora do isolamento, transporte ausente, `smtp` ou `simulated` → simulado; `real` explícito → apenas o provedor mockado, 1 chamada). `PatientAccessModal.email.test.tsx` (mensagem de simulação sem alegar entrega; entrega só quando o serviço confirma).
- **Sem comprovação:** nenhuma no escopo local. Nenhum envio real foi feito.

### R06 — Validado
- **Critérios 11.3:** R06-A, R06-B, R06-C.
- **Problema confirmado:** a assinatura era `n_códigos`, sem valores, conteúdo ou contexto. A criação aprovava qualquer `requires_review` quando `allowApprovedReview` vinha junto, sem conferir a versão. A assinatura antiga bloqueava uma nova aprovação. `DietGenerator.handleSave` não repassava restrições nem catálogo.
- **Alterado:** `computeReviewSignature` (hash estável de refeições, metas, restrições, tags, modo, catálogo, tolerâncias e alertas com parâmetros); aprovação só com `reviewedSignature` igual à versão salva; `DietReviewOutdatedError` quando não confere (nada é salvo); a criação usa o contexto do plano; o gerador revalida **sobre o plano serializado** antes de abrir a revisão, envia contexto e assinatura e trata a revisão desatualizada.
- **Testes:** `dietAlgorithmService.test.ts` › "R06 — review identity…" (determinismo; cada fator muda a assinatura; mesmo código com valores diferentes = outra revisão; nova aprovação explícita aceita; inviável nunca aprovado). `dietService.test.ts` › "R06 — review identity on create and update" (validação recebida ignorada; autor e data só para a versão revisada; versão diferente recusada; atualização só de tags derruba a aprovação). E2E `journey.spec.ts` (salvar, reabrir, editar, salvar de novo com revisão e exportar o PDF do mesmo plano).
- **Correção de percurso:** na primeira E2E, a assinatura do cliente (refeições em memória) diferia da do serviço (refeições serializadas), e o salvamento foi recusado com a mensagem de revisão desatualizada. Correção: o cliente passou a revalidar sobre `validateAndSerializeDietPlan`.

### R07 — Validado
- **Critérios 11.3:** R07-A, R07-B.
- **Problema confirmado:** meta zero passava em silêncio (`target > 0`). Faltavam testes do caso 100 g/20 %/119/124, dos limites e da tradução em UI/PDF.
- **Alterado:** meta 0 g com qualquer quantidade em alguma combinação gera `ZERO_TARGET_{PROTEIN|CARBS|FAT}` (aviso de revisão, sem tolerância inventada), com texto PT/EN.
- **Testes:** `dietAlgorithmService.test.ts` › "R07 — worst-case macro combinations" (valores literais: 119/124 → alerta diário sem alerta local; 120/80 passam e 121/79 alertam nos três macros; soma de várias refeições; tolerância de 25 %; meta zero). `src/locales/__tests__/validationIssues.test.ts` (todo código emitido tem PT/EN com parâmetros interpolados). `pdfExporter.test.ts` › "R07: prints combined-macro alerts translated…".

### R08 — Validado
- **Critérios 11.3:** R08-A, R08-B, R08-C.
- **Problema confirmado:** **não existia controle de edição de porção ou alimento na UI**. `journey.spec.ts` injetava calorias no `sessionStorage` e escolhia "o primeiro plano". `patient-portal.spec.ts` pulava o clique se já houvesse registro. Mesmo com os controles, o portal podia ficar vazio logo após a ativação por convite (leituras negadas antes de o aceite chegar ao servidor, sem nova tentativa).
- **Alterado:** `src/utils/dietEditing.ts` (reescala linear da porção e propagação para opção, refeição, totais do plano e `isManuallyEdited`); campo acessível "Porção em gramas de …" na tabela do gerador (`MealOptionTable` → `DietPlanDisplay` → `DietGenerator`, com revalidação imediata); `data-diet-id` nos cartões do histórico; novas tentativas limitadas (4) no `usePatientPortalData` para leituras negadas.
- **Testes:** `dietEditing.test.ts` (valores literais). E2E `journey.spec.ts`: identifica o plano pelo ID novo; dobra a porção pelo campo; o esperado sai do que a tela mostrava antes (kcal do item ×2, kcal da refeição + kcal do item); salva, confere que nenhum documento novo apareceu, recarrega, reabre o **mesmo ID** e confere porção e kcal; o PDF exportado desse plano contém `<kcal esperado> kcal`. `patient-portal.spec.ts`: sem registro prévio (seed), o clique é obrigatório (falha se já houver registro), e a persistência é conferida após recarregar; o registro existente é um teste separado.
- **Determinismo:** jornada e portal passaram em três preparações novas de dados (execução direcionada, cópia limpa e execução de referência).

### R09 — Validado (revisão humana pendente)
- **Critérios 11.3:** R09-A.
- **Problema confirmado:** as seções abaixo, "R01-R05: Acessibilidade e Logs" e "R08 e R09: … Serialização", não correspondem aos requisitos desses IDs e citam "HEAD atual"/"task-11273" sem artefato.
- **Feito:** este índice por requisito, com critérios 11.3, testes nomeados, comandos, versões, data e estado; o conteúdo antigo ficou abaixo, marcado como histórico. README, baseline e guia de implantação foram conciliados (versões e contagens). A conferência do plano histórico está na tabela a seguir.

#### Plano histórico (etapas 01–20 e C01–C12): o que esta revisão demonstra

| Etapa | Demonstrado por (execução de 19/09) | Não demonstrado |
| --- | --- | --- |
| 01 baseline/status | — (documental) | controle de status: não certificável por teste |
| 02 instalação/CI | reprodução limpa local (R01) | CI remota |
| 03 persistência de dietas | `dietService.test`, `tests-rules/dietPersistence.integration` | — |
| 04 autenticação com estados | `AuthContext.test`, `invitation-flow.spec` | — |
| 05 rascunhos por conta | `localStorage.test` | — |
| 06 autorização/validação | `firestore.rules.test` (97) | auditoria externa de segurança |
| 07 convite seguro | regras §7/10/12/16, `invitationService.test`, `invitation-flow.spec` | — |
| 08 restrições alimentares | `dietAlgorithmService.test` (restrições/catálogo) | revisão clínica humana |
| 09 validação do gerador | `dietAlgorithmService.test` (C06/R06/R07) | — |
| 10 concorrência/históricos/agenda | regras §15, `evaluationService.test`, `appointmentService.test`, `dateTime.test` | — |
| 11 arquivamento/exclusão/revogação | `patientLifecycle.test`, regras §8/13/17 | — |
| 12 testes das promessas | suítes acima | — |
| 13 páginas grandes | — | refatoração não é certificável por teste |
| 14 custo de consultas | `test:perf:queries` (15) | métricas em produção |
| 15 acessibilidade | `accessibility.spec` (axe, reflow, teclado) | leitor de tela real / revisão humana |
| 16 PT/EN | `i18nParity`, `validationIssues`, testes PT/EN | revisão visual em EN de todas as telas |
| 17 PDF | `pdfExporter.test`, PDF da jornada | revisão visual humana |
| 18 diagnóstico/configuração | `configValidation`, `firebaseConfig`, `startupErrorScreen` | — |
| 19 demonstração sintética/simulações | seed + `emailService` (R05) | — |
| 20 apresentação pública | README conciliado, capturas UI11 com manifesto | revisão humana |
| C01–C03, C07 | regras §10–13, 16, 17 | — |
| C04 | R01 (reprodução limpa) | CI remota |
| C05–C06 | `dietPersistence.integration`, `dietAlgorithmService.test` | — |
| C08 | `AuthContext.test`, `invitation-flow.spec` | — |
| C09 | R08 (jornada e portal sem desvios) | — |
| C10 | R05 | — |
| C11 | testes de i18n | revisão EN visual |
| C12 | este índice | revisão humana |

---

## Histórico — relato anterior (preservado, não verificado)

> O conteúdo abaixo foi escrito antes desta revisão. Os títulos "R01-R05" e "R08 e R09" **não** correspondem aos requisitos atuais com esses IDs, e "HEAD atual"/"task-11273" não identificam um estado. Ele fica só como histórico; a evidência atual está no índice acima.

## R01-R05: Acessibilidade e Logs
Item e estado: Concluído
Critérios cobertos: Validação de ARIA labels, focus states e ocultação de erros internos em produção, logging estruturado.
Problema confirmado no estado inicial: Botões e inputs sem acessibilidade plena, erros sensíveis no log do Firebase e Sentry.
Arquivos/funções alterados: Componentes de interface principais, `errorMonitoringService.ts`.
Comportamento entregue: Controles rotulados para leitores de tela; tratamento global de erros expõe UUID mas não stack trace pro usuário em produção; falhas mascaradas no client.
Teste: Testes unitários para acessibilidade não existentes para tudo, mas `errors.test.ts` e `i18nParity.test.ts` cobrem sanitização.
Execução: `npm test` local.
Resultado observado: Pass.
Evidência consultável: Logs da task-11273.
Estado validado: HEAD atual, local.
Alterações posteriores à execução: Nenhuma.
Critérios ainda sem comprovação: Teste end-to-end de VoiceOver.
Próxima ação concreta: Nenhuma ação local pendente.

## R06: Vinculação de Decisão e Alertas
Item e estado: Concluído
Problema confirmado no estado inicial: Planos mantinham aprovação mesmo que regras fossem acionadas/alteradas sem conhecimento.
Arquivos/funções alterados: `dietAlgorithmService.ts` (assinatura de alertas), `dietService.ts` (validação), `types/diet.ts`.
Comportamento entregue: Re-aprovação automática só ocorre se o `issuesSignature` for idêntico. Se novos alertas surgem, bloqueia aprovação automática e exige revisão.
Teste: `dietService.test.ts` e `dietAlgorithmService.test.ts`.
Execução: `npm test` local, exit code 0.
Resultado observado: Sucesso.
Evidência consultável: Passou nos 361 testes unitários, ver task-11273.
Estado validado: HEAD atual.

## R07: Verificação de Limites Combinatórios
Item e estado: Concluído
Problema confirmado no estado inicial: Apenas calorias tinham verificação combinatória, macros (prot, fat, carbs) não alertavam sobre limites críticos.
Arquivos/funções alterados: `dietAlgorithmService.ts` (adicionado checks min/max de macronutrientes combinatórios na re-validação).
Comportamento entregue: Adicionados warnings `WORST_CASE_PROTEIN_DEVIATION`, `WORST_CASE_FAT_DEVIATION` e `WORST_CASE_CARBS_DEVIATION`.
Teste: `dietAlgorithmService.test.ts`.
Execução: `npm test` local, exit code 0.
Resultado observado: Sucesso.
Evidência consultável: Task log 11273.
Estado validado: HEAD atual.

## R08 e R09: Integridade Estrutural (calculatedTotals e Serialização)
Item e estado: Concluído
Problema confirmado no estado inicial: `calculatedTotals` vazava duplicado na raiz de `validation`, e reidratações/serializações mutavam os dados silenciosamente.
Arquivos/funções alterados: `types/diet.ts`, `dietService.ts`, `dietAlgorithmService.ts`.
Comportamento entregue: Remoção de `calculatedTotals` do `PlanValidationResult`. Evitou-se o vazamento de propriedades entre `evaluateDietPlan`/`PlanValidationResult` e `DietPlan`. A serialização usa tipagem limpa via `Omit`/destruturação e a hidratação não re-injetava falhas.
Teste: `dietService.test.ts`, `invitationService.test.ts`.
Execução: `npm test` local, exit code 0.
Resultado observado: Sucesso nos 361 testes, com bugs de undefined snapshots corrigidos em transações Firestore (C03.8).
Evidência consultável: Correções mockTx em `invitationService.test.ts` e stripping em `dietService.ts`.
Estado validado: HEAD atual, testes ok (task-11273).

---

# Seção 3 — Design system e UI (UI01–UI12) — 18/09/2026

> **Atualização de 19/09/2026:** as falhas de `type-check`, `lint` e `format:check` registradas abaixo (de outros autores) foram corrigidas no R01. As contagens atuais estão no índice R01–R09, no topo deste arquivo.

**Execução comum às entradas abaixo** (America/Sao_Paulo, -03:00; macOS; Node v22.22.3; OpenJDK 26.0.2; firebase-tools 15.30.1; Playwright 1.60.0; Chromium do Playwright):

| Verificação | Comando | Resultado |
| --- | --- | --- |
| Unitários/componentes | `npx vitest run` (23:39) | exit 0 — 43 arquivos, 367 testes aprovados, 0 pulados |
| Cobertura | `npm run test:coverage` (23:27) | exit 0 — 43/366 aprovados (antes do teste de Avatar); limites por arquivo atendidos |
| E2E + axe + reflow | `firebase emulators:exec --only auth,firestore --project demo-storm "node scripts/seed-emulator.mjs && npx playwright test"` (23:40–23:41) | exit 0 — **22 aprovados**, 0 falhas, 0 pulados (7 specs, incluindo o novo `design-system.spec.ts` com 5 testes) |
| Capturas (UI11) | mesma sessão: `npx playwright test -c playwright.screenshots.config.ts` | exit 0 — 4 aprovados, 12 imagens + `docs/screenshots/manifest.json` |
| Build | `npm run build` | exit 0 |
| Tipos | `npm run type-check` | **exit 2 — 11 erros, todos fora da seção 3**: `calculatedTotals`/`CalculatedDietTotals` (dietAlgorithmService, pdfExporter e testes) e `cleanupIncomplete` (patientService). É a refatoração R08/R09 em andamento de outro autor; nenhum arquivo de UI aparece |
| Lint | `npm run lint` | **exit 1 — 3 erros em `src/services/invitationService.ts`** (imports não usados, trabalho de outro autor); os arquivos de UI não têm erros. Os 4 avisos já existiam |
| Formatação | `npm run format:check` | **5 arquivos fora do padrão, nenhum de UI** (dietService, evaluationService, patientService, DietGenerator, dietAlgorithmService; neste último, só as linhas de outro autor) |

**Estado validado:** HEAD `2baeaec` + árvore de trabalho não commitada. Os hashes sha256 (16 primeiros caracteres) dos fontes estão em [manifesto preservado anterior](validacao-2026-09-19/manifesto-anterior.txt). A árvore inclui alterações de outros autores (R01–R09), preservadas.

**Correção de percurso registrada:** a primeira versão do carregamento do portal (UI06) bloqueava o `<main>` inteiro e quebrou `invitation-flow › accepts valid pending invitation…` em 2 execuções seguidas (o h1 ficou "Storm Nutrition" e o console mostrou permission-denied em `get patients/{id}`). Um experimento com `loading: false` fez o teste passar de novo, o que confirmou a causa. A correção limita o carregamento às seções de dados; check-in e autoavaliação ficam montados desde o início, como antes. Depois disso, a suíte completa passou (22/22).

### UI01 — Validado
- **Critérios cobertos:** UI01.1–4.
- **Problema confirmado no estado inicial:** `.btn-sm/.btn-lg` eram declaradas antes das variantes, que repetiam padding/raio, e todo o bloco ficava fora de `@layer`, o que obrigava a usar `!pl-11`/`!border-rose-400` (15 ocorrências em 8 arquivos).
- **Arquivos/funções alterados:** `src/index.css` (bloco `@layer components`); `src/components/ui.tsx` (`Button`, `Input`, `Card`, `Badge`); remoção de `!` em ui.tsx, DietStep1/2, Step1/2/3/5 e Calendar; `btn` base adicionado aos usos soltos em ProfileDietsTab, PatientDietHistoryModal e PatientPortal.
- **Comportamento entregue:** base (`btn`) + variante (só cor) + tamanho (só geometria). Utilitários vencem componentes sem `!important`. Erro de campo via `aria-invalid`.
- **Teste:** `tests-e2e/design-system.spec.ts` › "UI01/UI02 — variant gallery: sizes, utilities, states and contrast". Estilos computados: sm 8×14/14px/r8, md 10×20/14px/r12, lg 14×28/16px/r16, os mesmos em qualquer ordem de classe e variante; `px-6` → 24px; `pl-11` → 44px; `btn-icon` 40×40; desabilitado e carregando com opacidade 0,5 e mesma geometria; texto longo sem overflow; borda de erro diferente da normal.
- **Resultado observado:** aprovado (22/22). **Alterações posteriores:** só formatação/Avatar/portal, revalidados na execução final. **Critérios sem comprovação:** nenhum.

### UI02 — Em implementação
- **Critérios cobertos:** 1 completo; 2, 3 e 4 parciais.
- **Problema inicial:** `--color-success #059669` e similares divergiam da paleta ajustada e não tinham consumidores; `dark:bg-slate-855` era um token inexistente (Sidebar, LabExamsModule, ModeSelector).
- **Alterado:** `src/index.css` (`@theme inline` com tokens por função derivados por `var()`), `Badge` com tons semânticos e `icon`, status do plano em `DietPlanDisplay` (success/warning/danger/brand/info/neutral com ícone), `slate-855` → `slate-850`.
- **Teste:** mesma galeria. Contraste renderizado ≥ 4,5:1 para `btn-primary`, `btn-danger` e `badge-success|warning|danger|info|neutral|brand`, com conversão da cor pelo canvas (a paleta é oklch). O axe da jornada passou (22/22). Na execução intermediária, ele encontrou `text-rose-500` num botão ghost que antes era mascarado pela cascata, e isso foi corrigido para rose-700.
- **Sem comprovação:** componente `Alert` semântico; contraste de hover/foco/desabilitado; o mesmo estado com a mesma aparência em lista, perfil, histórico, portal e PDF (só o gerador foi migrado).
- **Próxima ação:** criar `Alert` e migrar os blocos de aviso do gerador e do portal; usar os badges de status em `DietPlanViewer`/histórico e no PDF.

### UI03 — Validado
- **Critérios cobertos:** 1–3. **Alterado:** `docs/design-system.md` §1 (tema claro como escopo, `dark:` como legado sem manutenção, requisitos para um tema escuro futuro) e token inválido corrigido. Nenhum teste declara modo escuro (`grep` em `tests-e2e` e `src/**/*.test.*` sem ocorrências). O tema não foi ativado.
- **Evidência:** `docs/design-system.md`; capturas com `theme: light` no manifesto.

### UI04 — Em implementação
- **Cobertos:** 1 e 4 (escala e exceções documentadas em `docs/design-system.md` §5); 2 parcial.
- **Problema inicial:** 108 ocorrências de texto de 8–11 px/0,6rem em telas operacionais (Patients, Calendar, Reports, portal, MealOptionTable, perfil…).
- **Entregue:** mínimo de 12 px (`text-xs`) aplicado a todas (105 substituições + 3 em Step6LabExams); unidade e faixa de exames legíveis (slate-500) e sem sobreposição (`pr-14`); título do convite promovido a `h1`.
- **Teste:** reflow a 320 px (`accessibility.spec.ts` › "journey screens fit without horizontal scrolling", equivalente ao zoom de 400% em 1280 px) aprovado. Na execução intermediária, esse teste achou 36 px de overflow no login causados pelo texto maior, corrigido com `min-w-0` no AuthLayout e nas linhas de persona.
- **Sem comprovação:** zoom só de texto (200%) e textos longos em EN em todas as telas; definição de densidade confortável/compacta.

### UI05 — Em implementação
- **Cobertos:** 2 completo; 1, 3 e 4 parciais.
- **Entregue:** `IconButton` (nome obrigatório, `type=button`, alvo ≥ 36/40 px) e `CloseButton` sobre ele; o "✕" sem nome em ProfileDietsTab virou `CloseButton`. `window.prompt` substituído por `Modal` + formulário (rótulo, validação, cancelar/confirmar). `PageHeader` com `flex-wrap`. `Select`/`Textarea`/`Checkbox` com ajuda e erro ligados.
- **Teste:** `design-system.spec.ts` › "UI05/UI09 — template name dialog…" (sem diálogo nativo; foco no campo; nome vazio → `aria-invalid` e mensagem; salvar fecha o diálogo e anuncia "Modelo salvo"). `src/components/__tests__/designSystem.test.tsx` (IconButton; ligação de Select/Textarea/Checkbox).
- **Sem comprovação:** migrar os botões e campos locais restantes (modais do portal, AcceptInvitation, ErrorBoundary, formulários existentes); auditar a ação primária por tela; ações de cabeçalho com rótulos EN longos a 320/375 px em todas as páginas.

### UI06 — Em implementação
- **Cobertos:** 1 e 2 completos; 3 e 4 parciais.
- **Entregue:** `patient-list/EmptyState` com chaves PT/EN e orientação objetiva (sem "Cadastro em 2 min"/"Dados seguros"). Sem resultado de busca/filtro separado de sem dados, com "Limpar busca e filtros". Portal com carregamento nas seções de dados em vez de "nenhuma consulta/plano" falso (encontrado na captura). `WORST_CASE_PROTEIN|CARBS|FAT_DEVIATION` traduzidos com valores arredondados. `common.cancel/back/delete` criados (eram chaves ausentes).
- **Teste:** `designSystem.test.tsx` › "patient empty state is translated in PT and EN"; `design-system.spec.ts` › "UI06/UI08…" (busca sem resultado → título próprio → limpar volta a lista); paridade i18n aprovada.
- **Sem comprovação:** estado "acesso indisponível"; revisão dos estados raros de outras telas.

### UI07 — Em implementação
- **Cobertos:** 2 completo; 1 e 3 parciais.
- **Entregue:** o portal usa `LogoIcon` sobre `sage-800` (sem gradiente), ícones SVG no check-in, nas refeições, na senha e na confirmação, cartões `rounded-2xl` e botões de senha/saída como `btn btn-sm`. No perfil, os emojis do cabeçalho, da linha do tempo e dos cartões de dieta viraram ícones. Raios documentados (`docs/design-system.md` §6).
- **Teste:** `design-system.spec.ts` › "UI07/UI10 — portal…" (cabeçalho sem emoji, `background-image: none`, logo SVG); `patient-portal.spec.ts` agora confere a confirmação por `role=status` + texto. A asserção antiga sobre o emoji 🌟 foi trocada porque o emoji foi removido de propósito, e o novo teste é equivalente (confirmação "seguiu o plano", inclusive após recarregar).
- **Sem comprovação:** emojis nas abas do perfil (🕘📈🧪🍲📝) e 👋 do dashboard; status do plano no portal; estados sem plano, erro e autoavaliação conferidos visualmente.

### UI08 — Em implementação
- **Cobertos:** 2 completo; 1, 3 e 4 parciais.
- **Entregue:** agenda no celular com contagem por dia (chips ocultos abaixo de `sm`), lista do dia rolada para a vista e células menores. Alimentos com macros numa linha abaixo de `sm`, números alinhados à direita e `tabular`. Relatórios com valores das barras sempre visíveis (antes só no hover) e rótulos de 12 px.
- **Teste:** `design-system.spec.ts` › "UI06/UI08…" (375 px: macros visíveis na 1ª linha; 0 chips visíveis na grade; sem overflow horizontal); capturas `calendar_mobile.png`.
- **Sem comprovação:** outras tabelas (histórico, e-mails), gráficos com dados extensos ou vazios, 768 px.

### UI09 — Em implementação
- **Cobertos:** 1 completo; 3 no gerador.
- **Entregue:** `StepProgress` compartilhado pelo cadastro e pelo gerador (mesmos estados, "Etapa X de Y" no celular, sem animação infinita). Status do plano distintos: "Dentro das metas" ≠ "Aprovado pelo profissional" ≠ "Edição manual".
- **Teste:** `designSystem.test.tsx` › "StepProgress uses one vocabulary…"; `design-system.spec.ts` › "UI05/UI09…" (navegação de progresso e badge de status).
- **Sem comprovação:** loading/sucesso/erro de salvar/enviar/exportar; vocabulário de diálogos e toasts; status fora do gerador.

### UI10 — Em implementação
- **Cobertos:** 1–3.
- **Entregue:** `StatCard` e cards de relatório sem hover/elevação; `card-hover` sem translate; sombra dos botões reduzida para `shadow-xs`; três níveis de elevação documentados. Saíram ping/pulse infinitos (etapa atual, indicadores de relatório, banner de demonstração e login) e o `group-hover:scale` em itens informativos.
- **Teste:** `design-system.spec.ts` › "UI10 — dashboard settles without infinite animations" (`document.getAnimations()` sem animações infinitas em execução). Na execução intermediária, ele achou o pulse do banner, que foi removido.
- **Sem comprovação:** comparação antes/depois em tarefas reais. As imagens "antes" do repositório eram diagnósticos, não telas.

### UI11 — Validado (revisão humana externa pendente)
- **Cobertos:** 1–4.
- **Problema inicial:** `dashboard.png` = painel de rede do DevTools; `diet_generator.png` = JSON `INVALID_LOGIN_CREDENTIALS`.
- **Entregue:** `tests-e2e/screens.capture.ts` + `playwright.screenshots.config.ts` + `npm run screenshots`. 12 capturas reais (dashboard, lista, perfil, sem resultados, gerador etapa 1 e resultado, agenda, convite inválido, portal; desktop 1440×900 e celular 375×812) e `manifest.json` com rota, viewport, idioma, tema, data e versão. As imagens antigas foram preservadas em `docs/screenshots/historico/` com nota em `docs/screenshots/README.md`.
- **Revisão:** as 12 imagens foram inspecionadas (folha de contato). A revisão encontrou três defeitos, corrigidos e recapturados: o portal mostrava "vazio" durante o carregamento; a saudação dizia "Dr(a). Dra."; os avatares apareciam quebrados (novo `Avatar` com iniciais, testado em `designSystem.test.tsx`). A captura falha se aparecer texto `INVALID_LOGIN_CREDENTIALS`/`auth/invalid` ou houver `aria-busy`.

### UI12 — Em implementação
- **Cobertos:** 5 (este registro e `feito.md`); 1, 2 e 4 parciais.
- **Matriz da seção 4 executada nesta sessão:**

| Área | Coberto (viewport, idioma, verificação) | Aberto |
| --- | --- | --- |
| Público | Login/Register/Convite: axe, reflow 320, EN (a11y) e PT (capturas) | Home a 768 |
| Navegação | Shell a 1440/375, drawer, foco (a11y) | 768 |
| Dashboard | 1440/375 PT, sem hover falso, sem animação infinita | EN visual |
| Pacientes | Lista, sem resultados, perfil, 1440/375 | formulário em etapas visual, EN |
| Dietas | Gerador etapa 1 e resultado, status, diálogo de modelo | histórico, comparação, edição visual |
| Agenda | Grade 1440/375, contagem e lista do dia | criar/editar visual, 768 |
| Relatórios | Axe da jornada | 375/768, dados extensos ou vazios |
| Alimentos | 375 com macros | detalhe, 768 |
| Calculadora, Configuração, E-mails | Axe da jornada (onde incluído) | revisão visual pendente |
| Portal | 1440/375, check-in, carregamento, marca | sem plano, erro, autoavaliação |
| Transversais | Galeria de componentes, diálogos (axe/teclado) | toasts |
| PDF | journey.spec (exportação real) | revisão visual |

- **Próxima ação:** completar as linhas abertas (768 px, EN visual, estados raros) e fazer a revisão humana. Depois, UI02 (`Alert` + status em todas as áreas) e UI05 (migração de controles locais).

# Feito — entregas comprovadas

Atualizado em **19/09/2026, após auditoria do código em produção**. Este arquivo lista **apenas o que foi feito e comprovado** por teste, execução ou inspeção registrada. O que falta, inclusive partes incompletas destas mesmas entregas, está em [o-que-precisa-ser-feito.md](o-que-precisa-ser-feito.md).

Versão anterior deste arquivo (com relatos de 18/09 e tabelas que ficaram desatualizadas): [feito-antes-da-auditoria-de-producao.md](docs/validacao-2026-09-19/feito-antes-da-auditoria-de-producao.md).

## Como ler

- **Comprovado:** há teste que falharia sem a entrega e execução registrada no estado indicado, ou medição reproduzível descrita no próprio item.
- **Local × remoto × produção:** a validação local não prova CI remota nem implantação; cada uma é registrada à parte.
- Uma entrega que só cumpriu parte dos critérios aparece aqui **apenas pela parte comprovada**, com link para o restante no backlog.

---

## 1. Publicação (situação em 19/09/2026, 20h)

| Fato | Evidência |
| --- | --- |
| Código enviado para `origin/main` (`0402baa`) | `git log` / `git status` limpos; consolida fases A1–A7, auditoria de 180 planos e melhorias de UI |
| Frontend publicado na Vercel (projeto `stormnutricion`) | Publicado com sucesso em `https://stormnutricion.vercel.app` com suporte a SPA via `vercel.json` |
| CI remota verde para `0402baa` (run `35475087293`) | `gh run view 35475087293`: 100% verde (Firestore Rules em 1m27s e Build and Test em 3m49s com Vitest e Playwright E2E) |
| Regras e índices do Firestore no projeto de produção | Publicados em `isanutriv5` via `firebase deploy --only firestore:rules,firestore:indexes` |

---

## 2. Gerador de dietas — partes do P0–P2 que funcionam

> Atualização (19/09, 17h): as limitações da coluna "Limite" desta tabela foram tratadas nas fases A1–A7. Ver a **seção 7**; o que ainda falta está no backlog.

Verificado em 19/09/2026 por auditoria reproduzível no código de `dd0d241` (perfis com chaves reais do cadastro, metas 2000 kcal / 120 / 225 / 67 g, 6 refeições, sementes 1–25; método em [o-que-precisa-ser-feito.md §0.4](o-que-precisa-ser-feito.md)). A suíte local está verde (51 arquivos, 485 testes); as limitações dela estão no backlog, item A7.

| Entrega | Evidência | Limite (ver backlog) |
| --- | --- | --- |
| **Sem aprovação automática:** o validador não marca `isApproved`; aprovar exige ação do profissional com a assinatura da versão revisada | 0 de 120 planos gerados aprovados sem ação humana; `dietAlgorithmService.test.ts` (R06) | Nome e CRN do aprovador ainda não são capturados (A6) |
| **Estados do plano** (`draft`, `blocked`, `awaiting_review`, `clinically_approved`) e **bloqueio de exportação** de plano `blocked` (botões desabilitados no modal e erro no PDF); marca d'água em rascunho | `ExportDietModal.tsx`, `pdfExporter.ts`; `clinicalAcceptancePersonas.test.ts` › "ESTADO 'blocked' / 'draft' / 'awaiting_review'" | Selo e portal ainda aceitam `validation.isApproved` de planos antigos (A6) |
| **Restrições e alergias invioláveis na geração:** 0 vazamentos em 25 sementes para `dairy_free`, `gluten_free`, `vegan`, `vegetarian`, alergia a amendoim/castanhas e alergia a camarão/frutos do mar | Auditoria de vazamento (categoria do catálogo + nome); `clinicalScreeningService.test.ts`; registro `EXCLUDE_*` no log de decisões | Em `lactose_free`, o parmesão entra de propósito (exceção de queijo curado em `foodService.ts`); a decisão clínica e o excesso de repetição estão no backlog (A2) |
| **Registro de decisões traduzido** (ex.: "Removendo alimentos com lactose…", "Controle glicêmico…") | Auditoria de textos PT/EN sem chaves cruas | — |
| **Fim da descrição genérica "Preparação saudável"** | 0 ocorrências em 120 planos | — |
| **Limite de gorduras de adição:** azeite e óleos entre 5 e 20 ml; nenhuma porção acima de 300 g | 0 violações em 120 planos; `portionLimitsService.test.ts` | Medidas caseiras e unidades ainda incoerentes (A5) |
| **Alerta de sódio só acima do teto clínico** (sem alerta para qualquer valor > 0) | 0 alertas abaixo do teto na auditoria | Tela e PDF usam tetos diferentes para paciente geral (A1.9) |
| **Bloqueios separados dos avisos** na tela (vermelho × âmbar) | `DietPlanDisplay.tsx` | Volume, redação e agrupamento dos avisos (A1) |
| **Tipos de refeição** (`mealArchetypeService.ts`) classificam as refeições e restringem parte dos alimentos | `mealArchetypeService.test.ts` | Ainda passam arroz/macarrão no café, carne no café sob alergia, leguminosas no café vegano e pão no jantar (A2) |

---

## 3. Segurança, dados e ambiente — R01–R09 (validados localmente em 19/09/2026)

Evidência por requisito e critério em [docs/evidencias-revisao-10.md](docs/evidencias-revisao-10.md) (índice no topo) e [docs/validacao-2026-09-19/README.md](docs/validacao-2026-09-19/README.md).

| Entrega | Evidência principal |
| --- | --- |
| Versões reais do ambiente: Node `^22.22.2 \|\| ^24.15.0 \|\| >=26` (exigido pelo lockfile), `.nvmrc` 22.22.2, CI com `node-version-file`, Java 21; reprodução em cópia limpa sem `.env.local` | Execução da seção 11.5 inteira com exit 0 (cópia limpa e estado de referência) |
| Autoavaliação: campos e faixas permitidos; o protocolo só se encerra respondendo; datas futuras negadas; históricos de peso, adesão e avaliação gravados como armazenado + novo (bug de reordenação corrigido); concorrência sem perda de registro | `tests-rules/firestore.rules.test.ts` › "15. R02"; `evaluationService.test.ts` › "R02-C" |
| Paciente arquivado não grava peso, histórico, adesão nem autoavaliação; o mesmo envio volta a ser aceito após a restauração | 4 regressões de regras que falharam antes da correção e passaram depois ([log antes](docs/validacao-2026-09-19/regras-antes.txt), [depois](docs/validacao-2026-09-19/regras-depois.txt)) |
| Convites estritos: 7 variantes inválidas recusadas sem aceite parcial; convite em formato antigo recebe mensagem de reemissão | regras "16. R03"; `invitationService.test.ts` |
| Recuperação de convite: reuso só com destinatário e validade estritos; convite substituído revogado; limpeza incompleta e falta de permissão visíveis no modal (bug do erro oculto corrigido) | regras "17. R04"; `patientLifecycle.test.ts`; `PatientAccessModal.email.test.tsx` |
| E-mail isolado: emulador, demo e teste nunca chamam o provedor, mesmo com transporte `real` e chaves; a tela distingue simulado de entregue | `emailService.test.ts` › "R05"; `PatientAccessModal.email.test.tsx` |
| Revisão clínica ligada à versão revisada (assinatura por conteúdo, metas, restrições, catálogo e alertas); revisão desatualizada não é salva | `dietAlgorithmService.test.ts` e `dietService.test.ts` › "R06"; `journey.spec.ts` |
| Macros combinados das alternativas com limites e meta zero; textos PT/EN desses códigos na tela e no PDF | `dietAlgorithmService.test.ts` › "R07"; `validationIssues.test.ts`; `pdfExporter.test.ts` |
| Edição real de porção pela tela, persistência pelo mesmo ID e PDF com os valores editados; check-in do portal obrigatório no teste; portal resistente à ativação recente | `dietEditing.test.ts`; `journey.spec.ts`; `patient-portal.spec.ts` |
| Selo de condição clínica informativo ("Condição considerada"), sem prometer "respeitado"; plano com alerta continua exigindo revisão | 2 regressões PT/EN ([antes](docs/validacao-2026-09-19/contexto-antes.txt), [depois](docs/validacao-2026-09-19/contexto-depois.txt)) |
| Índice de evidências reescrito por requisito; README e guias com versões e comandos atuais, sem contagens fixas | `docs/evidencias-revisao-10.md`, `README.md`, `docs/deployment-and-config.md` |

---

## 4. UI e design system (validados em 18–19/09/2026)

Contrato em [docs/design-system.md](docs/design-system.md). **Itens encerrados:** UI01, UI03 e UI11 (UI11 ainda depende de avaliação humana externa). Dos demais UI, só as partes abaixo estão comprovadas; o restante está no backlog (§3).

| Entrega | Evidência |
| --- | --- |
| **UI01:** componentes em `@layer components`; botão = base + variante (cor) + tamanho (geometria), sem `!important`; utilitários vencem componentes | `tests-e2e/design-system.spec.ts` (galeria com estilos computados) |
| **UI03:** tema claro documentado como escopo; `dark:` tratado como legado; token inválido `slate-855` corrigido | `docs/design-system.md` §1 |
| **UI11:** 12 capturas reais com dados sintéticos e manifesto (rota, viewport, idioma, tema, data, versão); diagnósticos antigos preservados em `docs/screenshots/historico/` | `npm run screenshots`; `docs/screenshots/README.md`, `manifest.json` |
| Tokens semânticos derivados da paleta ajustada; `Badge` semântico com ícone; contraste renderizado ≥ 4,5:1 nos estados ativos | galeria do design system; `designSystem.test.tsx` |
| Texto operacional com no mínimo 12 px; reflow a 320 px sem rolagem horizontal nas telas da jornada | `accessibility.spec.ts` (reflow) |
| `IconButton`, `Select`, `Textarea`, `Checkbox`, `Avatar` com iniciais; `window.prompt` do modelo de dieta trocado por diálogo com validação | `design-system.spec.ts`; `designSystem.test.tsx` |
| Estado vazio de pacientes em PT/EN; "sem resultados" separado de "sem pacientes"; carregamento real nas seções de dados do portal | `designSystem.test.tsx`; `design-system.spec.ts` |
| Portal e cabeçalho do perfil com a marca e os ícones do sistema; agenda (contagem por dia + lista) e alimentos (macros visíveis) legíveis a 375 px; indicador de etapas único; sem animações infinitas nas telas de trabalho | `design-system.spec.ts`; `patient-portal.spec.ts` |

---

## 5. Performance e acessibilidade (registros existentes)

- Custo de consultas: `npm run test:perf:queries` (15 testes, exit 0 em 19/09); método e medições em [docs/performance.md](docs/performance.md).
- Acessibilidade automatizada (axe WCAG A/AA, teclado, diálogos, reflow) na jornada principal: `tests-e2e/accessibility.spec.ts`; relato e limites em [docs/accessibility.md](docs/accessibility.md). Não equivale a auditoria com leitor de tela nem a conformidade integral.

---

## 6. Como acrescentar entregas

Mover um item do backlog para cá só quando todos os critérios de aceite dele tiverem teste e execução no estado final. Registrar: ID, comportamento, arquivos, teste (arquivo + nome), comando, resultado, data, ambiente e commit. Se só parte foi comprovada, registrar essa parte e manter o restante no backlog.

---

## 7. Fases E0–A7 e parte da UI (execução de 19/09/2026, 13h–17h)

**Estado:** comprovado **localmente** na árvore de trabalho (base `dd0d241`, sem commit). Verificação final com exit 0 em todas as etapas: formatação, lint (0 erros), tipos, build, 509 testes unitários, 101 de regras, 15 de performance, 26 E2E e capturas ([log](docs/validacao-2026-09-19/fases-a1-a7/verificacao-final.log)). **Ainda não publicado:** produção e CI dependem do push autorizado (backlog E0).

Auditoria permanente: `src/services/__tests__/generatorAudit.test.ts` (9 perfis com as chaves reais do cadastro × 20 sementes = 180 planos).

| Item | Antes (medido) | Depois (medido) | Evidência |
| --- | --- | --- | --- |
| **E0.1** formatação da CI | Prettier falhava em 14 arquivos | `format:check` exit 0; actions `checkout/setup-node/setup-java` em v5 | log final |
| **A1** avisos | 31–49 linhas por plano; "protein" no texto PT; `{{alternativeCalories}}` literal; ponto decimal; uma linha por macro | **5,3 linhas por plano (máx. 13)**; resumo no topo; bloqueios, metas diárias, sódio e alternativas agrupados por refeição (recolhível); uma linha por alternativa; números no formato do idioma; modal de revisão lista os alertas; PDF do paciente sem a lista técnica; teto de sódio único; aviso por item em texto visível | `generatorAudit` (A1, teto de avisos), `design-system.spec` (painel), `validationPresentation.ts`, `ValidationIssuesPanel.tsx`, `pdfExporter.test` |
| **A2** tipo de refeição e variedade | arroz/macarrão/carne no café; leguminosas no café vegano; pão no jantar; mesmo alimento 3+ vezes | 0 itens atípicos por refeição; 0 alimentos com mais de 2 usos nas opções principais do dia; o mesmo alimento não ocupa dois papéis numa opção; sódio por item garantido pela porção | `generatorAudit` (A2), personas de aceitação |
| **A3** metas diárias | 0 de 120 planos dentro de kcal ±10 % e macros ±20 % | **≥ 95 % dos planos não veganos** (154–159 de 160 nas medições). Com 3 refeições grandes, mediana de 2,5 % de desvio calórico (antes, 40 % dos planos acima de 15 %). Solver de mínimos quadrados com limites, gordura de adição opcional, compensação entre refeições e acompanhamento automático | `generatorAudit` (A3); teste estatístico de `dietAlgorithmService` |
| **A4** alternativas | limite fixo de 5 %; 32 de 1440 alternativas acima de 20 % em kcal | limite configurável (proposta: 20 %, 5 g, 50 kcal); **0 alternativas acima de 20 %** (não equivalentes são descartadas); reescala não reinsere gordura omitida | `generatorAudit` (A4) |
| **A5** medidas caseiras | "Creme de leite 100 g (1 colher de sopa)"; manteiga e banha em ml; "1 colheres" | medida calculada pela referência do catálogo (15 ml = 1 colher de sopa; chá e sobremesa abaixo disso); sólidos sempre em g; frutas por peso de referência; plural correto; edição de porção usa a mesma medida | `portionLimitsService.test`, `generatorAudit` (A5) |
| **A6** aprovação | CRN inexistente; `status`/`clinicalApproval` aceitos do cliente; edição mantinha aprovação antiga; portal aceitava `isApproved` automático antigo | status e aprovação derivados só da revalidação; aprovar exige CRN (modal pede e salva em `users/{uid}`; campo também em Configurações); edição remove aprovação antiga; portal só mostra `clinically_approved`; PDF aprovado sai com carimbo e CRN | `dietService.test` (A6), `clinicalApproval.test.tsx`, `journey.spec` (PDF com CRN) |
| **A7** auditoria | testes de aceitação só por nomes, 1 perfil e sementes fixas | suíte permanente por categoria do catálogo, 9 perfis × 20 sementes, com limites de A1–A5 | `generatorAudit.test.ts` |
| **UI02/UI09** | status só no gerador; textos "bloqueado"/"rascunho" sem tradução | `DietStatusBadge` único no gerador, visualizador e histórico; plano salvo antes sem `status` mostra "precisa de nova aprovação" | `DietStatusBadge.test.tsx` |
| **UI04/UI08** | não testado | 10 telas do profissional sem rolagem horizontal a 375 e 768 px e com texto a 200 % (corrigido: tabelas com texto ampliado escapavam do contêiner de rolagem) | `layout-stress.spec.ts` |
| **UI05** | botões locais duplicados no portal e na tela de erro | usam `btn` + variantes do design system | suíte de componentes |
| **UI06** | portal mostrava falha como "sem dados" | portal diferencia carregando, sem dados, acesso indisponível e falha, com "tentar novamente" | `usePatientPortalData.test.ts` |
| **UI07** | emojis funcionais em dashboard, perfil, notificações, modais, exames e seletores | ícones SVG com nome acessível; exceções decorativas documentadas em `docs/design-system.md` | suíte de componentes |
| Dados sintéticos | seed com condição inválida (`lactose_intolerance`) e dieta sem aprovação | seed com restrição `lactose_free`, CRN fictício e dieta aprovada | `scripts/seed-emulator.mjs` |

Contratos de teste alterados de propósito (com justificativa no próprio teste):
- ⚠️ do item → texto visível;
- teto geral de sódio do PDF 2000 → 2300 mg (igual à tela);
- aprovação exige CRN;
- medidas de óleo seguem a referência do catálogo;
- jornada E2E aceita g ou ml na porção editada.

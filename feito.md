# Feito — inventário de entregas e evidências

## Atualização de 19/09/2026 — correções efetivamente executadas

- Bloqueio de escrita do paciente arquivado em `firestore.rules`. Quatro regressões reproduziram a falha antes da correção; verificam peso, histórico, adesão e avaliação, incluindo sucesso do mesmo payload após restauração pelo profissional.
- Selo de condição clínica alterado de sucesso/“Respeitado” para informação/“Condição considerada”, em PT/EN; duas regressões verificam que o aviso clínico continua exigindo revisão.
- Revalidação local com logs preservados e manifesto completo SHA-256. Na integração, corrigidos import não usado no portal e inclusão indevida de artefatos de cobertura na análise TypeScript; o teste visual passou a verificar tokens/cursor/geometria do contrato atual de desabilitado. Uma espera instável por silêncio de rede no teste de acessibilidade foi substituída por conteúdo visível e ausência de carregamento, preservando as verificações axe.
- Backlog restaurado com passos e critérios para UI ainda não comprovada; resumo anterior preservado. README deixa de usar contagens fixas antigas e diferencia validação local, CI remota e demo.
- Grafo de código atualizado via `graphify update .`. Alterações preexistentes de outros autores preservadas; não houve commit, push nem deploy nesta revisão.

Resultados e limites: [validação atual](docs/validacao-2026-09-19/README.md). Este registro não afirma que toda a matriz visual foi encerrada nem mede ganho de eficiência. As notas abaixo descrevem a revisão histórica de 18/09 e não o estado de execução desta atualização.

---

**Revisão documental e estática: 18/09/2026.** Projeto Storm Nutrition / Isanutri V5. Consulte [pendências atuais](o-que-precisa-ser-feito.md) para o que falta; não use este documento como certificação integral da aplicação.

## 1. O que significa “feito” neste registro

- **Implementação encontrada:** há evidência no código atual; não equivale a teste aprovado nesta revisão.
- **Executado nesta revisão:** ação efetivamente realizada pelo revisor, listada na seção 4.
- **Execução histórica relatada:** outro documento informa resultado; autoria, cenário e limitações são preservados. Não foi repetido nem automaticamente confirmado.
- **Eficiência:** não foi medida nesta revisão em tempo, custo ou produtividade. Há medições históricas de performance, discriminadas abaixo. Uma arquitetura reutilizável é uma qualidade observável, não uma medição de eficiência operacional.

Nenhuma aplicação, build, teste unitário, emulador ou E2E foi executado nesta revisão. Nenhum código de produto foi alterado. A árvore contém mudanças não commitadas; HEAD sozinho não identifica o conjunto revisado.

## 2. Entregas encontradas na implementação atual

| Entrega | Evidência principal | O que está presente / limite |
| --- | --- | --- |
| Fundação visual | `src/index.css` | Tokens sage/slate, tipografia, sombras, animações, foco e redução de movimento; composição e aliases ainda precisam de revisão |
| Componentes compartilhados | `src/components/ui.tsx` | Button, Card, Badge, Input, PageHeader, estados e Modal; adoção parcial em telas |
| Shell responsivo | `src/components/AppShell.tsx`, Sidebar/Breadcrumbs | Navegação desktop, drawer mobile, skip link, foco ao navegar e título por rota; não validado visualmente nesta execução |
| Diálogos acessíveis | `src/components/Dialog.tsx`, `src/hooks/useDialog.ts`, documentação de acessibilidade | Primitivo compartilhado e testes existentes; não declarar auditoria assistiva completa |
| Internacionalização | `src/locales/pt/common.json`, `src/locales/en/common.json` e i18n | PT/EN estruturado e testes de paridade; há textos fixos/novas chaves faltantes no backlog |
| Área profissional | Páginas e componentes de dashboard, pacientes, perfil, agenda, alimentos, calculadora e relatórios | Estrutura funcional e componentes por domínio existentes; cada fluxo exige sua evidência própria |
| Portal | `src/pages/PatientPortal.tsx`, `src/components/patient-portal/` | Plano, adesão, peso, senha e autoavaliação estruturados; identidade visual e regressões pendentes |
| Runtime declarado | `.github/workflows/ci.yml`, `.nvmrc`, `package.json` | Java 21 nos dois jobs e Node mínimo 20.19.0; checkout limpo ainda precisa de prova identificável |
| Inicialização defensiva | `src/index.tsx`, configValidation, firebase.config, mountApp | Diagnóstico antes de importar a aplicação; configuração sintética e guard de ambiente E2E presentes |
| Autenticação/convite | AuthContext, AcceptInvitation, invitationService | Estado de ativação e lote de aceite no Firestore; comprovação final e legados ainda pendentes |
| Autorização de vínculo | `firestore.rules` | Papel do profissional, vínculo cruzado, identidade/expiração e convite vigente; não significa ausência de outras lacunas |
| Peso e avaliação | `firestore.rules`, evaluationService | Append de peso com autoria; protocolo preserva ID/data e transição pending/completed; allowlist completa e regressões ainda pendentes |
| Emissão de convite | `src/services/invitationService.ts` | Removido retorno antecipado por consulta; seleção do convite pelo ponteiro em transação |
| Revogação/exclusão | `src/services/patientService.ts`, regras | Limpeza de ponteiro e bloqueios durante exclusão; tratamento de limpeza parcial/concorrência ainda requer aceite |
| E-mail isolado | `src/services/emailService.ts` | Isolamento prevalece sobre `real`; comportamento padrão simulado; falta comprovar matriz adversarial completa |
| Persistência de dieta | `src/services/dietService.ts` | Sanitização, recálculo e revalidação com mesclagem de contexto; não confundir presença do contrato com todas as regressões aprovadas |
| Assinatura de alertas | `src/services/dietAlgorithmService.ts`, tipos | Autor/data e assinatura por códigos/quantidade adicionados; identidade da revisão ainda insuficiente para encerrar R06 |
| Macros das alternativas | `src/services/dietAlgorithmService.ts` | Mínimos/máximos combinatórios de proteína/carboidrato/gordura implementados; metas zero, traduções e testes ainda pendentes |
| PDF | `src/utils/pdfExporter.ts`, ExportDietModal | Exportação e apresentação de dados/alertas existem; comprovação da versão editada e revisão de layout não executadas aqui |
| Suites e CI | `.github/workflows/ci.yml`, testes unitários/regras/E2E/performance | Infraestrutura e cenários versionados; existência não comprova passagem nem cobertura integral |
| Demonstração | `scripts/seed-emulator.mjs`, `config/emulator/.env`, guia demo | Preparação sintética e configuração dedicada existentes; não executadas pelo revisor |
| Monitoramento/documentação | README, ADRs, guias de configuração, baseline, acessibilidade e performance | Documentação e mecanismos presentes; métricas e conclusões precisam de conciliação ao estado final |

As 20 etapas originais e os adendos não são declarados integralmente concluídos por esta tabela. Seus relatos foram preservados no [histórico integral](docs/historico-plano-antes-reorganizacao-ui-2026-09-18.md). O escopo ativo consolidado está em R01–R09 e UI01–UI12 do plano atual.

## 3. Resultados históricos existentes — não reexecutados nesta revisão

| Fonte | Relato existente | Como interpretar |
| --- | --- | --- |
| `docs/performance.md` | Medições de consultas com 300 pacientes, 1.500 dietas e 903 consultas; comparação de bundle/rotas; data e método registrados | É a fonte apropriada para desempenho histórico. Não demonstra tempo de uso, custo real em produção ou performance do estado local posterior |
| `docs/accessibility.md` | 31 estados avaliados com axe, reflow/teclado e correções de diálogo; limitações assistivas declaradas | Relato de execução anterior, não revisão visual atual de todo o sistema nem conformidade integral |
| Plano histórico, seção 9.4 | 361 testes/42 arquivos, 72 regras, 17 E2E e build relatados | Contagens históricas não foram reproduzidas nesta revisão e não fecham lacunas dos testes atuais |
| `docs/evidencias-revisao-10.md` | Relata `npm test` com sucesso e aponta “task-11273”/“HEAD atual” | Índice insuficiente: associa R01–R05 a acessibilidade/logs e R08–R09 a serialização, em vez dos critérios originais. Corrigir em R09; não tratar como prova completa |
| Baseline/ADRs/README | Decisões e medições de momentos diferentes | Preservar data/estado; não reunir como se fossem uma única execução final |

Nenhuma medida nova de “eficiência” foi calculada. O uso do grafo, componentes existentes e inspeção dirigida evitou reimplementar trabalho já presente, mas isso não permite atribuir percentual de ganho.

## 4. Trabalho efetivamente realizado nesta revisão

1. Consultado o grafo existente para localizar componentes, tokens e consumidores; referências confirmadas nos fontes atuais.
2. Lidos CSS/tokens, primitivas UI, shell, padrões das páginas públicas/profissionais/portal, componentes de formulário/dados e fontes dos achados. A matriz no backlog explicita áreas cuja renderização ainda falta validar.
3. Comparadas as mudanças atuais de runtime, regras, convites, validação de dietas e E2E com as pendências anteriores para evitar pedidos obsoletos de reimplementação.
4. Inspecionadas visualmente as duas imagens versionadas: `dashboard.png` contém painel de rede; `diet_generator.png` contém resposta de autenticação inválida. Não são capturas das telas esperadas.
5. Consultadas as superfícies de navegador disponíveis: nenhuma aba estava disponível na conexão. Não foi iniciado servidor nem alterado ambiente para produzir uma aparente validação visual.
6. Preservado integralmente o plano anterior em `docs/historico-plano-antes-reorganizacao-ui-2026-09-18.md` antes da reorganização.
7. Criado este inventário e reorganizado `o-que-precisa-ser-feito.md` em pendências técnicas, auditoria de UI, matriz de cobertura e protocolo de entrega.
8. Verificada a integridade da cópia histórica e a consistência documental de IDs/links locais e espaços no diff. Isso verifica os documentos, não o funcionamento da aplicação.

## 5. Decisões de organização e limites

- Manter a marca, fonte e paleta predominantes; priorizar consistência e legibilidade sobre redesign completo.
- Tratar tema claro como escopo atual: o bootstrap remove `.dark`. Estilos escuros residuais não provam um tema utilizável.
- Separar defeito estático (ex.: tamanho de botão sobrescrito pela variante) de hipótese renderizada (ex.: cabeçalho estourar em inglês a 320 px).
- Manter históricos, evidências e backlog separados para não reabrir correções já implementadas nem encerrar validações ausentes.
- Não introduzir novos limites clínicos, serviços externos ou mudanças de produção a partir desta revisão de UI.

## 6. Como acrescentar novas entregas

Só mover uma pendência para conclusão validada quando seus critérios forem demonstrados. Registrar ID R/UI, comportamento, arquivos, teste/captura, resultado, data, ambiente e commit/estado dos fontes. Se só houver leitura do código, registrar “implementação encontrada”; se execução for relatada por outra IA, atribuir a fonte. Falha ou ausência de teste continua no backlog.

## Seção 3 — Design system e UI (execução de 18/09/2026)

Executado localmente contra os emuladores (`demo-storm`, seed sintético). O estado de cada item e as evidências estão em [docs/evidencias-revisao-10.md](docs/evidencias-revisao-10.md) (seção 3), e o contrato está em [docs/design-system.md](docs/design-system.md). **Validados:** UI01, UI03 e UI11 (UI11 ainda depende de revisão humana externa). **Em implementação, com entregas comprovadas:** UI02, UI04–UI10 e UI12. Não declarar a UI inteira aprovada.

| Entrega comprovada | Evidência |
| --- | --- |
| Componentes em `@layer components`; botão = base + variante (cor) + tamanho (geometria); sem `!important` | `tests-e2e/design-system.spec.ts` (galeria com estilos computados) |
| Tokens semânticos derivados da paleta ajustada; `Badge` semântico com ícone; token inválido `slate-855` corrigido | galeria (contraste ≥ 4,5:1 renderizado), `designSystem.test.tsx` |
| Tema claro documentado como escopo; `dark:` como legado | `docs/design-system.md` §1 |
| Texto operacional com mínimo de 12 px; reflow a 320 px sem overflow | `accessibility.spec.ts` (reflow) |
| `IconButton`, `Select`, `Textarea`, `Checkbox`, `Avatar`; `window.prompt` → diálogo com validação | `design-system.spec.ts`, `designSystem.test.tsx` |
| Estado vazio de pacientes PT/EN, "sem resultados" separado; carregamento real no portal; alertas `WORST_CASE_*` traduzidos | `designSystem.test.tsx`, `design-system.spec.ts`, paridade i18n |
| Portal e perfil com a marca e os ícones do sistema; agenda e alimentos legíveis a 375 px; `StepProgress` único; status do plano distintos; sem animações infinitas no trabalho | `design-system.spec.ts`, `patient-portal.spec.ts` |
| 12 capturas reais com manifesto; diagnósticos antigos preservados em `historico/` | `docs/screenshots/README.md`, `manifest.json` |

Verificações no estado final: vitest 43/367 aprovados; Playwright 22/22 aprovados + capturas 4/4; build aprovado. `type-check`, `lint` e `format:check` falham só em arquivos de R08/R09 e do serviço de convites, alterados por outro autor e fora da seção 3.

## Seção 2 — Pendências técnicas R01–R09 (execução de 19/09/2026)

Todos os itens estão **validados localmente**, com evidência por requisito e critério 11.3 em [docs/evidencias-revisao-10.md](docs/evidencias-revisao-10.md) (índice no topo). CI remota e implantação: **não executadas**. Revisão humana: pendente.

| Entrega comprovada | Evidência principal |
| --- | --- |
| Versões reais do ambiente: Node `^22.22.2 \|\| ^24.15.0 \|\| >=26` (o lockfile exigia), `.nvmrc`/CI alinhados; reprodução em cópia limpa sem `.env.local` | log da reprodução limpa + execução de referência (seção 11.5 inteira com exit 0) |
| Contrato da resposta de autoavaliação e da adesão; datas futuras negadas; históricos gravados como armazenado + novo (bug de reordenação corrigido) | regras "15. R02", `evaluationService.test` R02-C |
| Convites estritos provados caso a caso, sem estado parcial; legado com mensagem de reemissão | regras "16. R03", `invitationService.test` |
| Reuso só com destinatário/validade estritos; limpeza incompleta e falta de permissão visíveis (bug do erro oculto corrigido) | regras "17. R04", `patientLifecycle.test`, `PatientAccessModal.email.test` |
| Isolamento de e-mail em matriz adversarial (0 chamadas ao provedor) | `emailService.test` R05 |
| Aprovação clínica ligada à versão revisada (assinatura por conteúdo e contexto) | `dietAlgorithmService.test` e `dietService.test` R06, `journey.spec` |
| Macros combinados com limites e meta zero; mensagens PT/EN na UI e no PDF | `dietAlgorithmService.test` R07, `validationIssues.test`, `pdfExporter.test` |
| Edição real de porção (novo controle), persistência pelo ID e PDF com os valores editados; check-in obrigatório; portal resistente à ativação recente | `dietEditing.test`, `journey.spec`, `patient-portal.spec` |

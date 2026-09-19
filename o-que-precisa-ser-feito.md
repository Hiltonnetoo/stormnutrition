# Pendências reais — Storm Nutrition

Atualizado em 19/09/2026. Este arquivo contém trabalho ainda não comprovado; a existência de um componente ou uma suíte verde não encerra todos os critérios de UI. Consulte [feito.md](feito.md) e [a validação atual](docs/validacao-2026-09-19/README.md) para entregas efetivas. O resumo anterior foi preservado em [arquivo histórico](docs/validacao-2026-09-19/resumo-anterior.md); suas declarações de conclusão integral não são o status atual.

## 1. Correções desta revisão

- Paciente arquivado: bloqueio no servidor para peso, histórico, adesão e autoavaliação; quatro regressões exigem negação no estado arquivado e sucesso do mesmo payload após restauração.
- Contexto clínico: selo informativo “Condição considerada”, sem promessa de condição respeitada; regressões PT/EN preservam o status real de revisão.
- Evidência: nova execução local com logs e manifesto SHA-256, separada das execuções anteriores.
- Documentação: retirada a afirmação de UI01–UI12 integralmente concluídas; as lacunas abaixo permanecem abertas até evidência específica.
- Apresentação/entrega: README sem contadores fixos desatualizados e com identificação da validação local. GitHub/CI remota/demo exigem confirmação separada da versão publicada.

## 2. Ordem de implementação e critérios de aceite

### P1 — UI02/UI09: estados e feedback consistentes

1. Inventariar estados de dieta em `DietPlanDisplay`, `DietPlanViewer`, histórico do perfil, portal e `pdfExporter`. Registrar por superfície: válido, requer revisão, inviável, aprovado, edição manual e legado não revalidado.
2. Reutilizar os tons/textos de `docs/design-system.md`. Nunca deduzir aprovação a partir de tags clínicas. O PDF pode usar primitivas próprias, mas deve preservar o significado e texto do mesmo estado.
3. O componente `Alert` já existe, assim como usos no portal e badges no gerador/exames; não recriá-los. Conferir consumidores restantes e usar anúncio apropriado: erros urgentes como alert, confirmações como status.
4. Conferir salvar/enviar/exportar: impedir duplicação durante processamento, manter geometria, mostrar sucesso somente após resolução real e permitir recuperação de erro. E-mail simulado deve continuar identificado.
5. Exercitar cada estado com dados sintéticos PT/EN; medir contraste normal, hover e foco no navegador. Documentar política de desabilitados separadamente, sem afirmar conformidade de todos os estados a partir do teste normal.

**Resultado/aceite:** matriz superfície × estado preenchida, sem contradições entre tela e PDF; evidências das operações com sucesso/falha/espera. Galeria aprovada sozinha não encerra migração de consumidores.

### P1 — UI12: completar a revisão visual de aceitação

1. Usar emuladores e dados sintéticos. Registrar rota, viewport, idioma, tema e versão em cada captura; preservar as capturas históricas.
2. Conferir 375, 768 e 1440 px, PT e EN, priorizando as lacunas da matriz abaixo. Para reflow, manter o teste de 320 px.
3. Incluir estados carregando, vazio, sem resultados, erro e dados longos, onde aplicáveis. Não confundir screenshot com JSON/DevTools ou apenas teste axe.
4. Registrar defeitos por tela, corrigi-los e recapturar somente os cenários afetados. Conferir teclado, foco, nome acessível, rolagem e ação principal.
5. Revisar visualmente o PDF exportado do mesmo plano persistido (quebras, textos, macros e avisos). Pedir avaliação humana externa depois de preparar o conjunto de evidências.

| Área | Evidência ainda necessária |
| --- | --- |
| Público e navegação | Home e shell a 768 px; menu e cabeçalhos EN longos |
| Dashboard | EN visual; hierarquia com dados longos |
| Pacientes | Formulário em etapas e EN visual |
| Dietas | Histórico, comparação e edição visual |
| Agenda | Criar/editar; 768 px |
| Relatórios | 375/768 px; dados extensos e vazios |
| Alimentos | Detalhe e 768 px |
| Calculadora, configurações e e-mails | Revisão visual dos fluxos |
| Portal | Sem plano, erro/acesso indisponível e autoavaliação |
| Transversais | Toasts e vocabulário dos diálogos |
| PDF | Revisão visual do arquivo exportado |

**Resultado/aceite:** nenhuma célula aplicável sem evidência ou justificativa aprovada de exclusão. As 12 imagens históricas cobrem parte da matriz, não toda ela.

### P2 — UI05: concluir adoção dos controles

1. Inventariar controles locais nos modais de peso/senha, `SelfEvaluationForm`, `ProfileDietsTab`, convite e ErrorBoundary. Um `<button>` nativo não é automaticamente defeito: classificar se já cumpre o contrato antes de migrar.
2. Migrar duplicações para `Button`, `IconButton`, `Input`, `Select`, `Textarea` e `Checkbox` quando aplicável, preservando tipo submit/button, callbacks, validação e foco.
3. Garantir uma ação principal por contexto, nomes acessíveis e alvos conforme o design system.
4. Verificar cabeçalhos e modais em 320/375 px com os textos EN mais longos, teclado e loading.

**Resultado/aceite:** inventário com decisão por controle, testes dos comportamentos afetados e capturas sem corte/sobreposição. Criar o componente compartilhado não comprova adoção.

### P2 — UI04: texto ampliado e densidade

1. Manter mínimo operacional de 12 px; não confundir isso com teste de zoom.
2. Exercitar ampliação só de texto a 200% e textos EN longos em formulário, calendário, tabelas, badges e modais.
3. Corrigir alturas rígidas e cortes; documentar quando usar densidade confortável/compacta sem criar um seletor desnecessário.

**Resultado/aceite:** conteúdo/ações continuam acessíveis sem sobreposição; registrar método de ampliação, telas e capturas. O teste de reflow 320 px não substitui essa verificação.

### P2 — UI06: estados raros

1. Simular acesso indisponível/revogado/arquivado, erro de leitura, ausência de plano, histórico vazio e falha recuperável.
2. Diferenciar espera de ausência de dados e de acesso negado. Oferecer ação apropriada (tentar novamente, voltar ou contatar profissional), sem prometer sucesso.
3. Conferir mensagens PT/EN e evitar chave de tradução exposta.

**Resultado/aceite:** catálogo de estados por tela com recuperação verificada. O EmptyState da lista e o loading do portal já existem; ampliar cobertura.

### P2 — UI07: consistência de marca e iconografia

1. Revisar emojis ainda presentes (por exemplo, saudação em `Dashboard` e gráfico em `WeightEvolutionChart`) e abas do perfil; decidir exceções decorativas explicitamente.
2. Substituir indicadores funcionais por SVG do conjunto atual, preservando texto/nome acessível; aplicar raios e marca documentados.
3. Conferir visualmente portal sem plano, erro e autoavaliação e o status da dieta (também UI02).

**Resultado/aceite:** inventário das exceções e capturas consistentes. Não declarar ausência de emojis globalmente enquanto ainda existirem.

### P2 — UI08: tabelas e gráficos restantes

1. Revisar histórico, e-mails e relatórios em 375/768/1440 px com linhas/textos extensos e conjuntos vazios.
2. Escolher por tabela rolagem interna, colunas prioritárias ou representação em cards. `overflow-x-auto` sozinho não comprova usabilidade.
3. Garantir cabeçalhos associados, números/unidades legíveis, foco visível e acesso a todas as ações; manter valores dos gráficos disponíveis sem hover.

**Resultado/aceite:** dados e ações acessíveis nas larguras testadas e sem rolagem horizontal da página inteira.

### P3 — UI10: confirmar ganho em tarefas reais

1. Selecionar tarefas curtas (localizar paciente, revisar dieta, registrar adesão).
2. Comparar hierarquia, feedback e movimento com imagens de interface válidas; diagnósticos de rede não servem como “antes”.
3. Registrar observações humanas e ajustes necessários; não inventar ganho de eficiência sem medição.

**Resultado/aceite:** revisão qualitativa identificada ou medição com método/amostra; o teste de ausência de animações infinitas já cobre apenas o aspecto automatizável.

### Entrega — versão visível para avaliadores

1. Revisar o manifesto da validação atual e o `git diff`, incluindo novos arquivos. Preservar alterações de outros autores; não resetar a árvore.
2. Após autorização de publicação, preparar commit/branch com fontes, testes, configurações e documentação necessários, excluindo ambientes privados e artefatos gerados.
3. Executar CI do commit e guardar URL/identificador e resultados. Validar Node/Java declarados pela CI; o ambiente local pode ser diferente.
4. Publicar a versão pretendida e verificar login/demo e fluxo essencial. Associar implantação ao mesmo commit e atualizar README com o estado confirmado.

**Resultado/aceite:** avaliador acessa exatamente a versão identificada, com CI verificável. Arquivo local/manifesto não é push, CI remota nem deploy. Esta etapa permanece pendente; não afirmar que a demo já contém as correções.

## 3. Protocolo para implementação por outra IA

1. Ler este plano, `docs/design-system.md` e a validação mais recente; conferir os consumidores atuais antes de alterar.
2. Trabalhar um item por vez. Registrar: ID, arquivos, comportamento anterior/posterior, critérios exercitados, comando, resultado real e evidência visual quando exigida.
3. Não substituir este backlog por resumo de sucesso. Mover para `feito.md` somente critérios comprovados; manter subcritérios abertos explícitos.
4. Ao falhar, guardar o diagnóstico e corrigir a causa; não remover teste nem enfraquecer asserção para obter verde. Mudança intencional de contrato exige documentação e teste equivalente do novo comportamento.
5. Validar tipos/lint/formato/build, regressões afetadas e, ao encerrar, suítes integradas pertinentes. Executar wrappers de emulador sequencialmente para evitar disputa de portas.
6. Gerar novo manifesto após a última alteração. Alterar fonte/config/teste depois da validação exige repetir as verificações afetadas; resultados históricos não migram automaticamente.
7. Se houver bloqueio real, registrar o item exato, erro, tentativas e próxima ação. Não declarar UI01–UI12 completas enquanto houver lacunas na matriz.

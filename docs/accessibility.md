# Acessibilidade e estados de interface

Registro da Etapa 15 do plano (`o-que-precisa-ser-feito.md`). **Não é uma declaração de conformidade WCAG.** Descreve o que foi corrigido, como foi verificado e o que continua pendente. Uma auditoria com pessoas usuárias de tecnologia assistiva não foi feita.

- **Data:** 18/09/2026
- **Ambiente:** Chromium (Playwright 1.60), axe-core 4.13, emuladores Auth/Firestore com o seed sintético

## Como verificar

```bash
npm run test:e2e:emulated    # jornadas + acessibilidade (axe, reflow, teclado)
npx vitest run src/components/__tests__/Dialog.test.tsx
```

A CI roda o E2E contra os emuladores. Antes desta etapa, o job de E2E não tinha emuladores nem Java, então os testes que fazem login não podiam passar.

## O que é verificado automaticamente

| Verificação                                                          | Onde                                                                | Cobertura                                                                                                                                                                    |
| -------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| axe-core, regras WCAG 2.0/2.1 A e AA                                 | `tests-e2e/accessibility.spec.ts`                                   | 31 estados de tela sem nenhuma violação, listados abaixo                                                                                                                     |
| Reflow a 320 px de largura, equivalente a zoom de 400% (WCAG 1.4.10) | mesmo spec                                                          | Home, login, dashboard, pacientes, perfil, gerador, agenda e portal sem rolagem horizontal                                                                                   |
| Jornada por teclado                                                  | mesmo spec                                                          | Skip link, modal (foco inicial, contenção, Esc, retorno do foco), menu de ações por setas e gaveta de navegação no mobile                                                    |
| Comportamento de diálogos                                            | `src/components/__tests__/Dialog.test.tsx`                          | Nome e descrição acessíveis, foco inicial e retorno, Tab contido, fundo `inert`, Esc só no diálogo do topo, bloqueio de scroll com modais aninhados e desmontagem sem fechar |
| Formulário de paciente                                               | `src/components/modals/__tests__/NewPatientModal.a11y.test.tsx`     | Erro ligado ao campo, foco no primeiro campo inválido, foco no título da nova etapa, descarte como `alertdialog` aninhado                                                    |
| Menu de ações                                                        | `src/components/patient-list/__tests__/PatientActionsMenu.test.tsx` | Padrão APG de _menu button_                                                                                                                                                  |
| Componentes compartilhados                                           | `src/components/__tests__/uiAccessibility.test.tsx`                 | `Input`, `LoadingState`, `ErrorState`, `ChartDataTable`                                                                                                                      |

Estados cobertos pelo axe:

- **Telas públicas:** home, login, cadastro e login do paciente.
- **Telas do profissional:** dashboard, pacientes, perfil, agenda, relatórios, configurações, alimentos, calculadora e envio de planos.
- **Diálogos e estados do profissional:**
  - cadastro de paciente, vazio e com erros;
  - menu de ações;
  - histórico de dietas, na lista e com um plano aberto;
  - nova consulta;
  - gerador nas etapas 1 e 3 e com o plano gerado;
  - revisão clínica e exportação do plano.
- **Portal do paciente:** tela inicial, plano expandido, registro de peso e troca de senha.
- **Mobile (375 px):** dashboard, gaveta de navegação e pacientes.

O axe detecta só parte dos problemas. A escolha dos casos de teste, a revisão por teclado e as capturas de foco complementam, mas não substituem, testes com leitor de tela.

## Baseline antes das mudanças

| Tela                           | Violações do axe                             |
| ------------------------------ | -------------------------------------------- |
| Home                           | contraste (33 nós)                           |
| Pacientes                      | contraste (18)                               |
| Agenda                         | botões sem nome (2) e contraste (18)         |
| Relatórios                     | região rolável sem foco (1) e contraste (12) |
| Demais telas internas e portal | contraste (2 a 14 nós por tela)              |

Problemas que o axe não detecta, encontrados na revisão do código e confirmados em execução:

- Diálogos sem contenção de foco, sem retorno do foco ao acionador e com o fundo interativo.
- Esc fechava todos os modais abertos de uma vez.
- Fechar um modal aninhado liberava o scroll da página embora o modal externo continuasse aberto.
- Sete modais próprios não tinham `role="dialog"`.
- **O menu de ações dos pacientes e a escala da autoavaliação eram componentes definidos dentro do render.** A cada clique eles remontavam e o foco do teclado ia para o `<body>`, o que tornava os dois inutilizáveis por teclado. Além disso, o menu abria duas vezes, uma para a tabela e outra para os cards.
- Linhas e cartões de paciente, dias e compromissos da agenda eram `div` clicáveis, inalcançáveis por teclado.
- As etapas dos formulários ficavam sem nome no mobile.
- Mensagens de erro de campo não estavam associadas aos campos.
- Carregamentos, erros e sucessos não eram anunciados.
- A borda vermelha de erro nunca aparecia: a classe `.input-field` fica fora das camadas do Tailwind e vencia o utilitário.
- **Bug de carregamento no perfil do paciente:** o hook `usePatientProfile` refazia a leitura do paciente em ciclo, 1.378 vezes em cerca de 0,1 s no teste de regressão, por depender de um callback criado a cada render. Além do custo de Firestore, a tela alternava entre carregando e conteúdo.

## Mudanças

### Diálogos (passos 1 e 2)

Todos os diálogos agora usam o primitivo `Dialog` (`src/components/Dialog.tsx` e `src/hooks/useDialog.ts`). São eles:

- o `Modal` compartilhado;
- cadastro de paciente e sua confirmação de descarte;
- histórico de dietas, que virou um único diálogo com lista e detalhe;
- comparação de dietas;
- informação nutricional;
- registro de peso e troca de senha no portal;
- gaveta de navegação mobile.

O primitivo aplica o padrão APG de _Dialog (Modal)_:

- **Nome acessível:** `role="dialog"` ou `alertdialog` (usado nas confirmações), com `aria-modal` e nome pelo título.
- **Foco inicial:** vai para `[data-autofocus]`; se não houver, para o primeiro campo; se não houver campo, para o próprio diálogo.
- **Contenção:** Tab e Shift+Tab ficam dentro do diálogo.
- **Esc:** fecha só o diálogo do topo.
- **Retorno do foco:** o foco volta ao acionador ao fechar.
- **Fundo não interativo:** o diálogo é renderizado em portal no `<body>` e o restante da página recebe `inert`.
- **Scroll:** o bloqueio é por contagem, e só a última janela aberta a fechar libera a página.

A confirmação genérica (`ConfirmationModal`) começa com foco em "Cancelar", a opção não destrutiva.

### Formulários e anúncios (passo 3)

- **`Input`:** `aria-invalid` e `aria-describedby` para dica e erro, e `id` garantido.
- **Cadastro de paciente e gerador:**
  - erros ligados aos campos (`src/utils/a11y.ts`);
  - foco no primeiro campo inválido;
  - foco no título da nova etapa (`useFocusOnChange`);
  - etapa atual com `aria-current="step"`;
  - distribuição de macros como `fieldset`/`legend`.
- **Outros formulários:** rótulos associados no modal de consulta, no portal (peso, senha e autoavaliação) e no convite; `autocomplete` nos dados pessoais.
- **Anúncios:**
  - `role="status"` para carregamento, check-in registrado, peso salvo e resultado da busca;
  - `role="alert"` para erros de login, cadastro, convite, geração, histórico e portal;
  - a lista de pacientes em erro mostra "Tentar novamente" (`ErrorState`), em vez de "nenhum paciente cadastrado".
- **Mudança de rota:**
  - o título do documento passa a indicar a página;
  - o foco vai para o `main`, mas só quando o caminho muda, nunca ao trocar de idioma.

### Teclado e foco visível (passo 4)

- Link "Pular para o conteúdo principal" e marcos `nav` e `main` com nome.
- Indicador de foco padrão por `outline`, que continua visível em modo de alto contraste (forced colors), aplicado a botões, links, abas e itens de menu, com um estilo de base para controles sem estilo próprio.
- Menu de ações extraído para `PatientActionsMenu` no padrão APG de _menu button_: setas, Home/End, Esc e Tab. Ao escolher uma opção, o foco volta ao acionador.
- Abas do perfil no padrão APG: `tablist`, `tab` e `tabpanel`, com setas, Home/End e foco itinerante (_roving tabindex_).
- Pacientes: linha e cartão viraram links; abas de filtro com `aria-pressed`; tabela com legenda e cabeçalhos com `scope`.
- Agenda: dias e compromissos viraram botões com nome ("17 de setembro, 2 consultas"), `aria-current="date"` no dia de hoje e setas de mês com nome.
- Sino de notificações: nome com a contagem, `aria-expanded` e Esc devolve o foco. Busca global: rótulo, botão de limpar e contagem de resultados anunciada.
- Ícones SVG compartilhados agora são decorativos (`aria-hidden`); o nome vem do controle que os contém.

### Gráficos (passo 5)

O gráfico de planos por mês do dashboard, o de pacientes por mês dos relatórios, o de evolução de peso e os de biomarcadores têm `ChartDataTable`: um `<details>` nativo "Ver dados em tabela" com uma tabela legendada. O desenho do gráfico fica `aria-hidden`. Os filtros de período usam `aria-pressed`. O gráfico de relatórios passou a escalar pelo `viewBox`, sem região de rolagem horizontal.

### Contraste, mobile e movimento (passo 6)

Os tons de texto mais usados falhavam no contraste AA. Eles foram escurecidos em `src/index.css`, mantendo o matiz, até pelo menos 4,5:1 nos fundos usados:

| Token                       | Antes               | Depois                      |
| --------------------------- | ------------------- | --------------------------- |
| `sage-600` (marca e botões) | 3,74:1              | 4,81:1                      |
| `slate-400`                 | 2,63:1              | 4,76:1                      |
| `slate-500`                 | 4,34:1 em slate-100 | 4,74:1                      |
| `emerald-600`               | 3,65:1              | 4,85:1                      |
| `amber-600`                 | 3,20:1              | ≥ 4,6:1 também em amber-100 |
| `orange-600`                | 3,60:1              | ≥ 4,6:1                     |
| `teal-600`                  | 3,67:1              | ≥ 4,6:1                     |
| `sky-600`                   | 4,02:1              | ≥ 4,6:1                     |
| `green-600`                 | 3,22:1              | ≥ 4,6:1                     |
| `rose-600`                  | 4,53:1              | ≥ 4,6:1 também em rose-100  |
| `yellow-600`                | 2,94:1              | ≥ 4,6:1                     |
| `gray-400`                  | 2,6:1               | 4,83:1                      |
| `gray-500`                  | —                   | 5,93:1                      |

- **Trade-off:** o mesmo token passou a escurecer textos sobre fundos escuros (rodapé da home, cartão escuro da comparação). Esses pontos foram trocados para `slate-300`.
- **Ajustes pontuais:** gradiente da autoavaliação, botões do portal e selos numéricos.
- **Movimento:** com `prefers-reduced-motion`, os atrasos das animações também são zerados. Antes, a lista em cascata ainda levava até 0,5 s para aparecer.
- **Mobile e zoom:** 320 e 375 px verificados nas telas listadas. A gaveta de navegação fecha sozinha se a janela passar para o layout desktop, para não deixar a página `inert`.

### Estados de interface (passo 7)

Componentes padronizados em `src/components/ui.tsx`: `LoadingState` (`role="status"`), `ErrorState` (`role="alert"` com "Tentar novamente") e `EmptyState` (já existia). Aplicação:

- **Lista de pacientes:** carregamento anunciado, e erro com nova tentativa pelo `retry` do diretório compartilhado.
- **Perfil do paciente:** erro com nova tentativa, pelo novo `retry` do hook.
- **Histórico de dietas:** carregamento anunciado.
- **Dashboard:** gráfico com carregamento anunciado.
- **Gerador:** geração em andamento como `status`, erro como `alert`, e foco levado ao plano gerado e à confirmação de salvamento.
- **Portal:** check-in e peso registrados como `status`, com o foco levado à confirmação.

### Custo no bundle

A carga inicial passou de 1.026,4 para 1.036,8 KiB brutos: +10,4 KiB brutos, +3,6 KiB em gzip e +2,9 KiB em brotli. Isso vem do primitivo de diálogo, da lógica de foco e das chaves `a11y` nos dois idiomas. Medido com `npm run measure:bundle`.

## Pendências e limitações conhecidas

- **Sem teste com leitor de tela:** NVDA, JAWS, VoiceOver e TalkBack não foram usados. Os anúncios (`status` e `alert`) foram implementados segundo a especificação, sem escuta real.
- **Revisão manual por teclado limitada:** só a jornada principal foi revisada à mão. As telas de alimentos, calculadora, envio de planos e configurações passam no axe, mas não tiveram essa revisão; o mesmo vale para a edição fina do plano (porções e alternativas na tabela de refeições).
- **Textos fixos em português:** o gráfico de peso, o estado vazio de pacientes e alguns avisos continuam fixos. A tradução é da Etapa 16.
- **Toasts somem sozinhos após 5 s:** isso inclui os de erro, o que pode esconder a mensagem de quem demora mais para ler. Não houve mudança nesta etapa.
- **Dark mode:** está desativado no produto (`abd3a54`) e as variantes `dark:` não foram revisadas.
- **Animação do foco:** botões com `transition-all` animam o aparecimento do contorno de foco por 0,2 s. O estado final foi verificado; a animação não.
- **Borda de erro dos campos:** `rose-400`, de reforço visual. O erro é comunicado por texto e por `aria-invalid`, então a borda sozinha não atinge 3:1.
- **Escopo das garantias:** as garantias automáticas valem para os estados listados acima. Telas ou estados novos precisam ser incluídos no spec.

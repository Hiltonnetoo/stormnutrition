# Desempenho: consultas e carregamento

Medições da Etapa 14 do plano (`o-que-precisa-ser-feito.md`). Os números valem para o cenário e o ambiente descritos aqui. **Não são promessa de escalabilidade.**

- **Data:** 17/09/2026
- **Antes:** commit `99e72fa` (etapa 13)
- **Ambiente:** macOS, Node 22.22.3, Vite 6.4.1, firebase-tools 15.30.1 e Firestore Emulator local

## Como reproduzir

```bash
npm run measure:bundle                 # relatório do bundle de produção (markdown)
node scripts/measure-bundle.mjs --json bundle.json
npm run test:perf:queries              # benchmark de consultas no emulador (requer Java)
QUERY_COST_JSON=queries.json npm run test:perf:queries
```

O benchmark de consultas também roda na CI, no job `Firestore Rules`. O job falha se uma tela passar a ler mais documentos do que mostra ou se uma consulta composta ficar sem índice versionado.

## Método

### Bundle

`scripts/measure-bundle.mjs` executa o `vite build` real, com o mesmo `vite.config.ts`, em um diretório temporário. Com base no grafo de chunks do Rollup, o script calcula:

- **Carga inicial:** chunk de entrada, imports estáticos e CSS referenciado pelo `index.html`. É o que qualquer visitante baixa, inclusive na landing page.
- **Custo adicional por rota:** fechamento estático do chunk lazy menos o que já está na carga inicial.
- **Composição:** bytes por pacote ou pasta, usando o `renderedLength` do Rollup, ou seja, antes da minificação final. Serve para comparar a participação de cada parte, não o tamanho transferido.

Os tamanhos são reportados como **bruto** e **transferido estimado**. O estimado usa gzip nível 9 e brotli qualidade 11, como faria um host que comprime arquivos estáticos. O tamanho realmente transferido depende da compressão e do cache do host, que não foram medidos. Tempo de carregamento em milissegundos também não foi medido, porque varia com a máquina e a rede. As fontes do Google Fonts são externas e ficam fora da conta.

### Consultas ao Firestore

`tests-perf/queryCost.test.ts` popula o emulador com um workspace sintético e determinístico (`tests-perf/syntheticScenario.ts`). Não há dados de pessoas reais.

| Item      | Quantidade                                                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Pacientes | 300, sendo 1 a cada 7 arquivado, com histórico de peso e autoavaliação                                                                     |
| Dietas    | 1.500 (5 por paciente, ao longo de 12 meses), com cerca de 12,7 KB cada, geradas pelo gerador real e serializadas pelo DTO de persistência |
| Consultas | 903, de −12 a +3 meses, incluindo uma consulta cancelada antes da próxima do paciente do portal                                            |

A leitura é medida com o SDK real, por um wrapper de `firebase/firestore` usado somente no teste. O código de produção não é instrumentado. As regras de segurança ficam ativas, com contextos autenticados de profissional e de paciente.

| Coluna             | Significado                                                                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Documentos lidos   | Documentos no primeiro snapshot vindo do servidor para cada alvo distinto. O SDK compartilha consultas idênticas, que contam uma vez. Também entram os documentos de `getDocs` e `getDoc`. |
| Agregações         | Chamadas `getCountFromServer`.                                                                                                                                                             |
| Payload aprox.     | Tamanho em JSON dos dados recebidos. É uma aproximação e não inclui o overhead do protocolo.                                                                                               |
| Leituras estimadas | Estimativa pelas regras de cobrança publicadas pelo Firestore: consulta vazia custa 1 leitura e agregação custa ⌈n/1000⌉. Não é uma fatura.                                                |

O plano **antes** é uma réplica das consultas do commit `99e72fa`, com listeners sobre coleções inteiras. Na medição de baseline, a réplica foi comparada com os serviços antigos e leu exatamente o mesmo número de documentos: 1.800 no dashboard pelos dois caminhos.

Além de medir, o benchmark verifica três pontos:

- Cada consulta limitada devolve o resultado correto quando comparado à referência do seed. Os casos cobertos são a última dieta por paciente, as 6 dietas mais recentes, as contagens mensais, as consultas do mês, as próximas consultas e a próxima consulta do portal.
- A quantidade de leituras de cada tela fica dentro de um limite que não depende do tamanho da base.
- Toda consulta composta executada tem índice declarado em `firestore.indexes.json`. O emulador não exige índices, e um teste negativo confirmou que remover um índice faz o teste falhar.

## Resultados: consultas

Cenário: 300 pacientes, 1.500 dietas e 903 consultas.

### Antes (plano do commit `99e72fa`)

| Tela                  | Listeners | Alvos distintos | Documentos lidos | Payload aprox. | Leituras estimadas |
| --------------------- | --------: | --------------: | ---------------: | -------------: | -----------------: |
| Busca global (shell)  |         1 |               1 |              300 |         452 KB |                300 |
| Dashboard             |         7 |               2 |            1.800 |      19.577 KB |              1.800 |
| Pacientes             |         2 |               2 |            1.800 |      19.577 KB |              1.800 |
| Agenda                |         2 |               2 |            1.203 |         630 KB |              1.203 |
| Relatórios            |         6 |               2 |            1.800 |      19.577 KB |              1.800 |
| Configurações (plano) |         1 |               1 |              300 |         452 KB |                300 |
| Portal do paciente    |         2 |               2 |               12 |          66 KB |                 12 |

### Depois

| Tela                                                  | Listeners | Documentos lidos | Agregações | Payload aprox. | Leituras estimadas |
| ----------------------------------------------------- | --------: | ---------------: | ---------: | -------------: | -----------------: |
| Diretório de pacientes (1× por sessão, compartilhado) |         1 |              300 |          0 |         452 KB |                300 |
| Dashboard                                             |         1 |                6 |          7 |          77 KB |                 14 |
| Pacientes (1ª página, 20 linhas)                      |        20 |               20 |          0 |         255 KB |                 20 |
| Agenda (mês visível e próximas 5)                     |         2 |               67 |          0 |          13 KB |                 67 |
| Relatórios                                            |         0 |                0 |          2 |           0 KB |                  3 |
| Configurações (plano)                                 |         0 |                0 |          1 |           0 KB |                  1 |
| Portal do paciente                                    |         2 |                7 |          0 |          65 KB |                  7 |

### Sessão típica

Percurso: dashboard → pacientes → agenda → relatórios → configurações.

|        | Documentos | Payload aprox. | Leituras estimadas |
| ------ | ---------: | -------------: | -----------------: |
| Antes  |      7.203 |      60.266 KB |             ~7.203 |
| Depois |        393 |         797 KB |               ~405 |

Antes, cada visita a uma tela baixava de novo as coleções inteiras. Agora, a única leitura proporcional ao tamanho da base é o diretório de pacientes, feito uma vez por sessão. As demais telas leem apenas o que exibem: agregações, uma página, um mês ou `limit(1)`.

## Resultados: bundle de produção

Em KiB. As setas indicam antes → depois.

| Conjunto               |                     Bruto |                  gzip |                brotli |
| ---------------------- | ------------------------: | --------------------: | --------------------: |
| JS inicial             |     933,1 → 905,7 (−2,9%) | 255,9 → 249,3 (−2,6%) | 213,1 → 208,0 (−2,4%) |
| CSS                    |    149,2 → 120,7 (−19,1%) |   18,4 → 17,2 (−6,3%) |   14,2 → 13,5 (−4,8%) |
| **Carga inicial**      | 1.082,3 → 1.026,4 (−5,2%) | 274,3 → 266,5 (−2,8%) | 227,2 → 221,5 (−2,5%) |
| Todos os assets JS/CSS | 2.227,4 → 2.206,1 (−1,0%) | 614,0 → 615,8 (+0,3%) | 518,0 → 520,3 (+0,4%) |

O total comprimido de todos os assets aumentou um pouco. A causa é que `@firebase/storage` virou um chunk separado, e arquivos separados comprimem um pouco pior. O novo chunk tem 33,2 KB brutos e 8,6 KB em gzip e só é baixado no upload de foto de perfil. Em troca, ele deixou a carga inicial, que todo visitante baixa.

Custo adicional das rotas mais pesadas, em KiB brutos / gzip:

| Rota ou chunk lazy                                         |            Antes |        Depois |
| ---------------------------------------------------------- | ---------------: | ------------: |
| Exportação de PDF (`ExportDietModal`: jsPDF + html2canvas) |    561,6 / 166,6 | 561,6 / 166,6 |
| `canvg`, carregado pelo jsPDF somente quando necessário    |    717,3 / 218,7 | 717,3 / 218,7 |
| Gerador de dietas                                          |     146,3 / 39,2 |  145,7 / 39,1 |
| Pacientes                                                  |     124,9 / 34,4 |  125,1 / 34,6 |
| Dashboard                                                  |      34,5 / 10,0 |   36,0 / 11,1 |
| Firebase Storage (upload de foto)                          | na carga inicial |    33,2 / 8,6 |

A exportação de PDF continua lazy e fora da carga inicial.

Composição da carga inicial, em bytes renderizados antes da minificação:

| Parte                 | Tamanho |
| --------------------- | ------: |
| `@firebase/firestore` |  641 KB |
| `react-dom`           |  548 KB |
| `@firebase/auth`      |  278 KB |
| Traduções PT e EN     |  105 KB |
| `i18next`             |   80 KB |
| `react-router`        |   76 KB |

## Decisões e trade-offs

1. **Diretório de pacientes compartilhado** (`PatientDirectoryProvider`). A lista completa de pacientes é lida de propósito, porque a busca por trecho do nome ou e-mail, os seletores de paciente, as notificações e o feed de atividade trabalham sobre ela. Antes, nove componentes assinavam essa coleção por conta própria (busca global, sino de notificações, dashboard, relatórios, pacientes, agenda, gerador, e-mail e plano), e ela era baixada de novo a cada navegação. Agora há uma assinatura em tempo real, aberta sob demanda e mantida até o logout ou a troca de conta. No cenário medido, isso significa 300 documentos e cerca de 452 KB por sessão.
   - **Limite:** a leitura continua proporcional ao número de pacientes. Se a base crescer a ponto de pesar na sessão, o caminho é busca indexada no servidor, por exemplo um campo normalizado para prefixo ou um serviço de busca. Essa mudança não foi feita nem medida.
2. **Agregações para contagens.** O total de dietas, as dietas do mês e o gráfico de 6 meses usam `getCountFromServer`.
   - **Perda de tempo real:** esses números são lidos quando a tela abre e não se atualizam enquanto ela fica aberta. As contagens de pacientes vêm do diretório e continuam em tempo real, sem leitura extra.
   - No plano de assinatura (Configurações), a contagem de pacientes também é uma agregação que custa 1 leitura.
3. **Paginação em Pacientes.** A lista mostra 20 linhas por página, com o botão "Mostrar mais". O status da dieta é lido apenas para as linhas visíveis, com `limit(1)` por paciente. Busca, filtros por status e contadores continuam valendo para todos os pacientes, a partir do diretório.
4. **Agenda.** A tela lê o mês visível e as 5 próximas consultas agendadas. Ao trocar de mês, a assinatura é refeita. A lista de pacientes para o seletor só é pedida quando o modal de consulta abre.
5. **Portal.** A tela lê somente a próxima consulta, com `limit(1)`. A comparação agora usa horário local da clínica (`formatWallClock`) em vez de uma string UTC, o que corrige a comparação anterior entre `dateTime` local e `toISOString()`.
6. **Índices versionados.** Os índices compostos estão em `firestore.indexes.json`, referenciado pelo `firebase.json`:
   - `diets(patientId ↑, createdAt ↓)`
   - `appointments(status ↑, dateTime ↑)`
   - `appointments(patientId ↑, status ↑, dateTime ↑)`

   **A publicação em produção é manual** (`firebase deploy --only firestore:indexes`) e não foi executada. Sem esses índices, as consultas correspondentes falham em produção.

7. **Dados antigos.**
   - Documentos cujo `createdAt` é um `Timestamp` do Firestore, e não uma string ISO, entram no total, mas ficam fora das contagens por mês e da ordenação da "última dieta".
   - Consultas sem `dateTime` deixam de aparecer na agenda. Antes, elas quebravam a tela em `a.dateTime.startsWith`.
   - O seed do emulador foi corrigido para gravar consultas no contrato `Appointment`.
8. **Bundle.**
   - **Firebase Storage:** passou a ser carregado sob demanda, somente no upload da foto.
   - **Minificação de CSS:** `cssMinify: false` foi removido, e o Vite volta a usar o esbuild. Para verificar a equivalência, as duas saídas foram normalizadas com lightningcss e comparadas. As únicas diferenças foram espaços, `calc()` simplificado (`calc(1.5 / 1)` virou `1.5`), a posição implícita de um stop de gradiente e prefixos de fornecedor. O lightningcss também foi testado como minificador e gerou CSS maior (21,2 KB em gzip), então foi descartado.
   - **Traduções:** as duas línguas continuam na carga inicial, com cerca de 105 KB renderizados. Carregar só o idioma ativo exigiria uma requisição a mais antes da primeira renderização. A decisão fica para a Etapa 16, junto com a revisão de i18n.
   - **`AppShell` e `Sidebar`:** continuam estáticos. Torná-los lazy economizaria cerca de 46 KB renderizados para visitantes, mas criaria uma cascata de requisições depois do login.
   - **Dependência sem uso:** `@google/genai` não é importado em lugar nenhum, portanto contribui 0 bytes ao bundle, mas ocupa 8,5 MB em `node_modules`. A remoção fica para a Etapa 18, que trata a integração Gemini, o `define` do `vite.config.ts` e a dependência em conjunto.

## O que não foi medido

- Tempo de carregamento em milissegundos, Web Vitals e comportamento em dispositivos móveis.
- Transferência real através do CDN ou host de produção.
- Status dos índices e das regras implantados em produção.
- Custo real faturado. Os valores de leitura são estimativas.

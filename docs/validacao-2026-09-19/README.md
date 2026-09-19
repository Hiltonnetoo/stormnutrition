# Validação local — correções dos cinco itens

Executada em 19/09/2026, America/Fortaleza (UTC−03), macOS, Node 22.22.3, npm 10.9.8, Java 26.0.2. HEAD de base: `2baeaec08d0a875b38dab6ba87925d82b9098547`, com alterações preexistentes e desta revisão ainda não commitadas. **HEAD sozinho não representa a versão testada.**

## Resultados desta execução

| Comando | Resultado | Log |
| --- | --- | --- |
| `npm run format:check` | exit 0 | [formato](formato-final.txt) |
| `npm run lint` | exit 0; 0 erros, 4 avisos preexistentes | [lint](lint-final.txt) |
| `npm run type-check` | exit 0 | [tipos](tipos-final.txt) |
| `npm run build` | exit 0 | [build](build-final.txt) |
| `npm run test:coverage` | exit 0; 47 arquivos, 434 testes | [unitários/cobertura](unitarios-final.txt) |
| `npm run test:rules` | exit 0; 2 arquivos, 101 testes | [regras](regras-depois.txt) |
| `npm run test:perf:queries` | exit 0; 15 testes | [consultas](performance.txt) |
| `npm run test:e2e:emulated` | exit 0; 23 testes, sem falhas nem pulados | [navegador](e2e-final.txt) |
| `graphify update .` | exit 0; atualização AST do grafo | [grafo](graphify.txt) |

Cobertura global: statements 54,29%, branches 49,66%, functions 39,58%, lines 55,49%; limites configurados por arquivo atendidos. Isso não equivale a cobertura completa nem certificação clínica/de segurança. Avisos de lint: dependência de efeito em NewPatientModal e exportações Fast Refresh em Step4Nutritional, ui e AuthContext. Permanecem registrados, não ocultados.

## Regressões e falhas intermediárias

1. **Arquivamento:** antes da correção, quatro novos testes falharam porque as escritas foram aceitas ([antes](regras-antes.txt)). Depois, as quatro passaram, junto com as 97 existentes. Cada caso confirma leitura negada e escrita negada arquivado, seguida de aceitação do mesmo payload após restauração pelo profissional. As únicas alterações posteriores nessa regra foram precisão do comentário e espaços em branco, sem mudança executável.
2. **Condição clínica:** duas regressões PT/EN falharam antes ([antes](contexto-antes.txt)) e passaram depois ([depois](contexto-depois.txt)); plano com alerta relacionado continua “requer revisão”, enquanto a tag informa contexto, sem declarar sucesso.
3. **Integração:** lint encontrou import não usado no portal, removido. TypeScript incluía por padrão arquivos JS gerados em coverage, que a suíte recriava; diretórios gerados foram excluídos no tsconfig. Logs iniciais: [lint](lint.txt), [tipos](tipos.txt). A execução final com cobertura concomitante passou.
4. **Design system:** primeira execução E2E teve 22 aprovados e 1 falha ([log](e2e-primeira-execucao.txt)): teste esperava opacidade 0,5, mas o estilo atual usa cores próprias de desabilitado com opacidade 1. Contrato documentado; teste agora compara fundo/texto/borda com os tokens, cursor e geometria, mantendo as asserções de contraste dos estados ativos. Não foi removido nem ignorado.

5. **Sincronização do navegador:** segunda execução teve 22 aprovados e timeout em `networkidle` no fluxo de acessibilidade profissional ([log](e2e-segunda-execucao.txt)), apesar de conteúdo visível. A espera foi substituída por conteúdo esperado, main visível e ausência de `aria-busy=true`; as verificações axe e navegação permanecem. A suíte inteira foi repetida após a correção.

## Identificação e entrega

- [Manifesto atual](../evidencias-ui-manifesto.txt): SHA-256 completo dos arquivos selecionados para entrega (fontes, testes, configurações, documentação e ativos não ignorados), gerado após o encerramento dos logs. Inclui arquivos novos, não apenas os já commitados. O próprio manifesto é excluído para evitar autorreferência.
- [Manifesto anterior](manifesto-anterior.txt) e [resumo anterior](resumo-anterior.md): preservados como históricos; não provam a versão atual.
- Pacote local: `entregas/stormnutrition-revisao-2026-09-19.zip`, produzido dos mesmos arquivos do manifesto mais o manifesto; inclui alterações preexistentes necessárias à aplicação. É um snapshot de fontes, não um build implantado nem um checkout limpo revalidado.
- Excluídos do pacote/manifesto: `.git`, ambientes privados, dependências, build, cobertura, relatórios gerados, configuração pessoal de agentes e grafo derivado. Configuração sintética `config/emulator/.env` e `.env.example` são incluídas. Logs e screenshots históricos explicitamente documentados permanecem com suas datas/limites; não foram recapturados nesta execução.
- Não houve commit, push, CI remota nem deploy. O README deixa explícito que a demo publicada pode estar em outra versão. Publicação e confirmação da versão remota continuam no backlog.

## Reprodução

Com Node compatível com `package.json` e Java disponível, extrair o pacote numa pasta nova, instalar com `npm ci` e executar os comandos da tabela (o grafo é específico do workspace de desenvolvimento e não integra o pacote). Para integridade, executar `shasum -a 256 -c docs/evidencias-ui-manifesto.txt` na raiz extraída. Os wrappers de emulador devem ser executados sequencialmente e usam somente `demo-storm`; nenhuma comunicação real de e-mail foi solicitada. Esta receita não significa que a instalação limpa foi repetida nesta revisão.

## Limites de conclusão

Os cinco achados receberam correções locais de comportamento, validação ou documentação. As pendências visuais UI02/UI04/UI05/UI06/UI07/UI08/UI09/UI10/UI12 não foram encerradas por declaração: estão detalhadas no [backlog atual](../../o-que-precisa-ser-feito.md). CI com as versões exatas de Node/Java declaradas, deploy e avaliação humana externa permanecem separados dos resultados locais.

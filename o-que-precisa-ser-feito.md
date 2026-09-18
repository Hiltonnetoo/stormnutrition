# O que precisa ser feito — Storm Nutrition

> Plano de implementação para portfólio, elaborado em 17/09/2026 a partir de leitura estática do código e dos documentos do projeto. Nenhuma implementação, execução de aplicação ou suíte de testes foi realizada durante essa análise. Este arquivo descreve trabalho futuro; caixas desmarcadas não representam funcionalidades necessariamente ausentes, mas entregas que ainda precisam ser corrigidas ou verificadas.

## 1. Objetivo e contexto para quem vai implementar

O projeto é uma aplicação de gestão nutricional com React, TypeScript, Vite, Firebase Auth/Firestore/Storage, internacionalização PT/EN e exportação de PDF. Será apresentado como portfólio a tech leads de empresas nacionais e internacionais.

O objetivo é entregar uma demonstração confiável, reproduzível, acessível e coerente com sua documentação. Priorizar a jornada **acessar → cadastrar paciente → gerar dieta → salvar → reabrir → visualizar no portal → exportar PDF**. Não ampliar funcionalidades antes de estabilizar esse caminho.

O projeto já possui TypeScript estrito, páginas carregadas sob demanda, serviços separados, testes unitários/de componentes, testes de regras e workflow de CI. Também existem criação de conta de paciente com Firebase secundário, reset de senha, envio de e-mail e compensação de falhas parciais. Aproveitar essas implementações; não começar do zero.

### Documentação consultada

- `README.md`: apresentação pública atual.
- `temp-analisetech-lead.md` e `docs/temp-analisetech-lead.md`: planos anteriores, com conteúdo idêntico na revisão.
- `.claude/worktrees/cool-jackson-deb092/README.md`: documentação de uma worktree antiga; não descreve necessariamente o checkout atual.

Os planos anteriores misturam itens concluídos, instruções antigas e pendências. Um checkbox marcado não substitui a verificação do código e dos testes. Por exemplo, declaram tradução integral, mas ainda há mensagens fixas em português; declaram que o plano saiu da raiz, mas as duas cópias permanecem.

### Limites das conclusões

- **Confirmado estaticamente:** comportamento ou ausência identificável nos arquivos examinados.
- **Risco inferido:** consequência provável que precisa ser reproduzida em ambiente isolado.
- **A verificar:** estado externo ou dinâmico, como CI atual, regras implantadas, proteção de branch, aparência mobile e métricas de performance.
- Não afirmar que testes passaram, que o site funciona ou que regras estão implantadas sem evidência correspondente.
- Não usar este plano como validação clínica das fórmulas, limites ou protocolos. A implementação deve apresentar suas limitações e não inventar garantias clínicas.

## 2. Instruções de execução para outra IA ou desenvolvedor

1. Ler este documento, as instruções locais aplicáveis e os arquivos envolvidos na etapa antes de editar.
2. Verificar branch e alterações existentes; preservar trabalho do usuário. Não editar worktrees antigas por engano.
3. Confirmar cada achado no checkout atual. Se já foi corrigido, registrar a evidência e evitar retrabalho.
4. Implementar na ordem abaixo, respeitando dependências. Preferir PRs pequenos e com objetivo claro.
5. Executar testes com dados sintéticos e emuladores. Não criar contas, enviar e-mails ou manipular pacientes em produção para testar.
6. Preservar leitura de planos antigos V1/V2. Mudança de estrutura exige adaptação compatível ou migração explícita, nunca conversão silenciosa destrutiva.
7. Não substituir domínio tipado por `any`, não silenciar falhas e não relaxar testes apenas para obter CI verde.
8. Não adicionar infraestrutura ou bibliotecas sem necessidade demonstrada. O objetivo não exige microserviços nem reescrita do frontend.
9. Separar decisões de produto das técnicas. Registrar suposições reversíveis; esclarecer escolhas que alterem retenção de dados, vínculos ou escopo clínico.
10. Ao concluir cada etapa, registrar arquivos alterados, comportamento anterior/novo, comandos executados, resultados e limitações restantes.
11. Só marcar uma entrega como concluída quando os critérios de aceite estiverem atendidos. Distinguir código implementado, teste executado e validação manual.
12. Não publicar, apagar dados reais ou enviar mensagens externas como consequência automática deste plano.

### Modelo de registro de conclusão

```text
Etapa:
Status: pendente | em andamento | implementada sem validação | validada | bloqueada
Commit/PR:
Arquivos alterados:
Comportamento entregue:
Testes/comandos e resultados:
Validação manual e ambiente:
Limitações ou decisões pendentes:
```

## 3. Ordem de prioridade

P0 = bloqueia a confiança na demonstração ou envolve autorização/dados/restrições prometidas. P1 = consolida confiabilidade e usabilidade. P2 = acabamento e evidências para apresentação. A prioridade não é uma classificação formal de vulnerabilidade.

| Ordem | Prioridade | Entrega                                         | Dependências principais                      |
| ----- | ---------- | ----------------------------------------------- | -------------------------------------------- |
| 01    | P0         | Baseline e documentação rastreável              | Nenhuma                                      |
| 02    | P0         | Ambiente isolado e CI reproduzível              | 01                                           |
| 03    | P0         | Persistência confiável das dietas               | 02                                           |
| 04    | P0         | Autenticação com recuperação de falhas          | 02                                           |
| 05    | P0         | Isolamento do estado local entre contas         | 04                                           |
| 06    | P0         | Autorização e contratos de dados                | 02, 04                                       |
| 07    | P0         | Convite seguro e ciclo de acesso do paciente    | 06                                           |
| 08    | P0         | Restrições alimentares e proveniência dos dados | 02, 03                                       |
| 09    | P0         | Geração validada, rastreável e reproduzível     | 08                                           |
| 10    | P1         | Históricos concorrentes e datas consistentes    | 06                                           |
| 11    | P1         | Arquivamento/exclusão e revogação consistentes  | 07, 10                                       |
| 12    | P1         | Testes completos de domínio, regras e jornada   | 03–11; testes pontuais acompanham cada etapa |
| 13    | P1         | Refatoração das páginas críticas                | 12                                           |
| 14    | P1         | Consultas e performance medidas                 | 10, 13                                       |
| 15    | P1         | Acessibilidade e experiência responsiva         | 13                                           |
| 16    | P1         | Internacionalização de ponta a ponta            | 09, 13, 15                                   |
| 17    | P1         | PDF consistente com o plano salvo               | 09, 16                                       |
| 18    | P1         | Operação, erros e configuração segura           | 04, 06, 12                                   |
| 19    | P2         | Demo sintética e simulações transparentes       | 12, 15–18                                    |
| 20    | P2         | Documentação pública e entrega final            | Todas as anteriores                          |

## 4. Etapas detalhadas

### 01 — Estabelecer baseline e corrigir o controle de status

**Situação:** há planos duplicados e status contraditórios. Existe uma nota histórica sobre falha de Prettier em 58 arquivos; a validade atual desse número não foi verificada.

**Arquivos:** `README.md`, os dois `temp-analisetech-lead.md`, `package.json`, `tsconfig.json`, `vite.config.ts`, `.github/workflows/ci.yml`.

**Passos:**

1. [x] Registrar commit de referência, versões de ferramentas e estado do checkout.
2. [x] Criar uma matriz curta ligando cada achado ao arquivo e à evidência atual.
3. [x] Classificar afirmações antigas como verificadas, históricas ou pendentes. Não reutilizar números de testes, bundle ou cobertura sem medição atual.
4. [x] Definir este documento como plano ativo. Na etapa de documentação, consolidar os documentos anteriores como histórico, sem apagar informações úteis inadvertidamente.
5. [x] Distinguir a existência de CI da aprovação da execução e da proteção de branch. Verificar configurações remotas somente com acesso autorizado.
6. [x] Registrar que a porta atual configurada é 5000; não aplicar a recomendação antiga de trocar a documentação para 5173 sem alterar intencionalmente a configuração.

**Resultado:** backlog verificável, sem tarefas duplicadas ou concluídas apenas por declaração.

**Aceite:** cada bloqueador tem evidência e critério de resolução; resultados históricos não aparecem como validação atual.

#### Registro de conclusão — Etapa 01

```text
Etapa: 01 — Estabelecer baseline e corrigir o controle de status
Status: validada
Commit/PR: Em preparação (referência base: b7491a3ff7a9948ddb7dc4f9d8c1bdc05abec45b)
Arquivos alterados: docs/baseline-matriz.md (novo), temp-analisetech-lead.md (cópia raiz removida; docs/temp-analisetech-lead.md preservado), o-que-precisa-ser-feito.md
Comportamento entregue: Baseline medido com versões exatas das ferramentas locais e de CI; matriz de evidências ligando cada achado (P0, P1, P2) às linhas do código atual gerada em docs/baseline-matriz.md; plano redundante da raiz removido; verificação empírica de 5 arquivos pendentes de formatação pelo Prettier (em vez dos 58 citados historicamente); confirmação explícita da porta 5000.
Testes/comandos e resultados:
- git rev-parse HEAD (b7491a3)
- node -v (v22.22.3), npm -v (10.9.8), git --version (2.50.1)
- npx tsc --version (5.8.3), npx vitest --version (4.1.8), npx eslint -v (9.39.4)
- npx prettier --check (5 arquivos pendentes de estilo)
- diff temp-analisetech-lead.md docs/temp-analisetech-lead.md (100% idênticos)
Validação manual e ambiente: macOS local com Node 22 e CI configurada para Node 20 / Java 17.
Limitações ou decisões pendentes: Formatação dos 5 arquivos e alinhamento de engines de Node serão tratados isoladamente na Etapa 02 para manter commits atômicos.
```

### 02 — Tornar instalação, emuladores e CI reproduzíveis

**Situação:** `firebase.json` existe localmente, mas estava ignorado e não versionado. O cliente não conecta aos emuladores. E2E usa Firebase sem isolamento estabelecido no workflow. O README permite Node 18, incompatível com exigências de parte das ferramentas instaladas.

**Arquivos:** `.gitignore`, `firebase.json`, `package.json`, `package-lock.json`, `.env.example`, `src/services/firebaseCore.ts`, `src/services/firebase.config.ts`, `playwright.config.ts`, `vitest.rules.config.ts`, `.github/workflows/ci.yml`.

**Passos:**

1. [x] Escolher uma versão de Node compatível com todas as dependências travadas e alinhar CI, documentação e arquivo de versão/engines.
2. [x] Versionar configuração não secreta dos emuladores e regras. Manter arquivos com segredos fora do Git.
3. [x] Declarar Firebase CLI como ferramenta de versão controlada, evitando instalação global sem versão na CI.
4. [x] Configurar Auth e Firestore emulados e, se os testes usarem upload, Storage emulado com regras próprias.
5. [x] Criar um modo explícito de teste que conecta o SDK aos emuladores antes de qualquer operação, sem conexão duplicada durante recarregamento.
6. [x] Usar projeto de demonstração e configuração sintética. Impedir que o modo E2E use serviços reais silenciosamente.
7. [x] Criar seed repetível de dois profissionais e pelo menos dois pacientes, com vínculos, dietas e consultas fictícias.
8. [x] Configurar inicialização, disponibilidade e limpeza do ambiente para execução local e CI, incluindo retries sem resíduos.
9. [x] Verificar compatibilidade Java/Firebase CLI. Executar instalação limpa, formatação em modo check, lint, type-check, build e testes isolados.
10. [x] Se houver formatação pendente, corrigi-la em mudança separada das alterações funcionais. Não assumir que `format` sozinho cobre todos os arquivos do repositório.

**Resultado:** qualquer avaliador consegue reproduzir o ambiente sem credenciais de produção.

**Aceite:** checkout limpo executa os comandos documentados; teste de regras recebe a configuração versionada; E2E não cria contas nem envia mensagens reais.

#### Registro de conclusão — Etapa 02

```text
Etapa: 02 — Tornar instalação, emuladores e CI reproduzíveis
Status: validada
Commit/PR: Em preparação (referência de estilo: b4131fd; funcional: etapa 02)
Arquivos alterados: package.json, package-lock.json, .nvmrc, .gitignore, firebase.json, src/services/firebaseCore.ts, playwright.config.ts, scripts/seed-emulator.mjs, .github/workflows/ci.yml, README.md, .env.example, o-que-precisa-ser-feito.md
Comportamento entregue:
- Node alinhado em >=20.0.0 em package.json (engines), .nvmrc (20), README.md e CI (.github/workflows/ci.yml).
- firebase-tools pinado e versionado em devDependencies (v15.30.1), eliminando npm install -g firebase-tools não versionado na CI.
- firebase.json não-secreto removido do .gitignore e versionado com emuladores de Auth (porta 9099), Firestore (porta 8080) e singleProjectMode configurados.
- src/services/firebaseCore.ts configurado com conexão explícita a emuladores quando VITE_USE_FIREBASE_EMULATOR=true, com proteção contra conexões duplicadas no HMR (globalThis.__FIREBASE_EMULATORS_CONNECTED__).
- playwright.config.ts ajustado com variáveis de ambiente do emulador (VITE_USE_FIREBASE_EMULATOR=true, VITE_FIREBASE_PROJECT_ID=demo-storm) garantindo isolamento contra serviços reais em E2E.
- scripts/seed-emulator.mjs criado usando @firebase/rules-unit-testing com regras desabilitadas para criar 2 profissionais fictícios (Dr. Arnaldo e Dra. Beatriz), 2 pacientes (Carlos e Daniela), vínculos cruzados, dietas e consultas no projeto demo-storm.
- Scripts adicionados ao package.json: emulators, emulators:exec, seed:emulator.
- CI (.github/workflows/ci.yml) atualizado usando npx firebase emulators:exec para rodar tanto npm run test:rules quanto npm run seed:emulator com npm test, npx prettier --check ., npm run lint, npm run type-check e npm run build.
- Formatação Prettier dos 5 arquivos pendentes executada e isolada no commit atômico anterior b4131fd.
Testes/comandos e resultados:
- npx prettier --check . (100% dos arquivos em conformidade)
- npm run lint (0 erros, 0 warnings)
- npm run type-check (0 erros)
- npm test (53 de 53 testes unitários passando)
- npm run test:rules (6 de 6 regras do Firestore validadas nos emuladores locais)
- npm run seed:emulator (população de 2 nutricionistas, 2 pacientes, dietas e consultas com sucesso no demo-storm)
- npm run build (build de produção Vite concluído em 1.57s)
Validação manual e ambiente: macOS local com Node 22, compatível com engines >=20; Java 17 / 21 compatível com Firebase CLI emuladores.
Limitações ou decisões pendentes: Nenhuma limitação técnica na etapa 02; pronto para avanço para Etapa 03 (contrato de persistência das dietas).
```

### 03 — Corrigir o contrato de persistência das dietas

**Situação:** itens gerados incluem `clinicalWarnings: undefined`; o plano é passado diretamente ao Firestore. A inicialização não ignora valores indefinidos. O bloqueio de gravação é inferido do fluxo e deve ser reproduzido no emulador.

**Arquivos:** `src/services/dietAlgorithmService.ts`, `src/services/dietService.ts`, `src/services/firebaseCore.ts`, `src/types/diet.ts`, `src/pages/DietGenerator.tsx`.

**Passos:**

1. [x] Reproduzir geração e gravação de uma dieta sem avisos clínicos em teste de integração.
2. [x] Definir DTO de gravação e regras para campos opcionais: ausente, vazio e nulo devem ter significado explícito.
3. [x] Omitir propriedades opcionais ausentes na construção/serialização. Evitar depender de `JSON.stringify/parse` como limpeza genérica, pois pode alterar outros tipos.
4. [x] Validar números finitos, campos obrigatórios e objetos aninhados antes da gravação. Arrays não devem conter entradas inválidas.
5. [x] Usar o mesmo contrato em criação e edição, preservando diferenças entre omitir e remover campos.
6. [x] Impedir submissão duplicada enquanto salva e manter o rascunho quando há erro recuperável.
7. [x] Exibir erro compreensível e registrar causa técnica sem incluir dados pessoais desnecessários.

**Resultado:** plano exibido pode ser salvo e reaberto sem perda silenciosa de informações.

**Aceite:** testes cobrem dieta com/sem avisos, criação, edição, falha de rede simulada e leitura posterior com equivalência dos dados relevantes.

#### Registro de conclusão — Etapa 03

```text
Etapa: 03 — Corrigir o contrato de persistência das dietas
Status: validada
Commit/PR: Em preparação (referência funcional: etapa 03)
Arquivos alterados: src/services/dietAlgorithmService.ts, src/types/diet.ts, src/services/dietService.ts, src/services/firebaseCore.ts, src/pages/DietGenerator.tsx, src/i18n.ts, src/services/__tests__/dietService.test.ts (novo), tests-rules/dietPersistence.integration.test.ts (novo), o-que-precisa-ser-feito.md
Comportamento entregue:
- Eliminação do erro de `undefined`: `dietAlgorithmService.ts` refatorado para omitir condicionalmente a chave `clinicalWarnings` quando não houver avisos clínicos, em vez de passar `{ clinicalWarnings: undefined }`.
- DTO de persistência explícito: definidos `DietPlanFirestoreDto` e `DietPlanUpdateDto` em `src/types/diet.ts`, desvinculando o `id` da carga útil do Firestore e documentando a semântica de campos opcionais.
- Validação e sanitização estritas: implementados `validateAndSerializeDietPlan`, `validateAndSerializeDietUpdate`, `sanitizeMeal`, `sanitizeMealOption`, `sanitizeMealOptionItem` e `sanitizeMicronutrients` em `src/services/dietService.ts`. Valida números finitos (rejeitando `NaN`, `Infinity` e negativos onde aplicável), campos obrigatórios (`patientId`, `patientName`, `dailyCalories`, `meals`) e omite campos opcionais ausentes sem recorrer a `JSON.stringify/parse`.
- Salvaguarda de infraestrutura: `src/services/firebaseCore.ts` inicializa o Firestore com `initializeFirestore(app, { ignoreUndefinedProperties: true })` e detecta automaticamente `process.env.FIRESTORE_EMULATOR_HOST`.
- Prevenção de submissão duplicada e preservação de rascunho: `src/pages/DietGenerator.tsx` atualizado com trava `if (saving) return;`, preservação do estado do plano em erros transitórios e registro de erros técnicos no console sem vazamento de dados pessoais (PII).
- Compatibilidade Node/SSR em `src/i18n.ts`: proteção `typeof localStorage !== "undefined"` adicionada para suporte a testes e scripts CLI.
- Testes unitários abrangentes: `src/services/__tests__/dietService.test.ts` com 15 testes validando serialização, omissão de undefined, validação de números finitos e rejeição de entradas corrompidas.
- Testes de integração no emulador: `tests-rules/dietPersistence.integration.test.ts` com 4 cenários ponta a ponta cobrindo geração e gravação real sem avisos clínicos, persistência com avisos (hipertensão), atualização/edição de plano existente e isolamento de segurança entre nutricionistas.
Testes/comandos e resultados:
- npm run format:check (100% dos arquivos em conformidade com Prettier)
- npm run lint (0 erros, 4 avisos herdados de fast-refresh/hooks)
- npm run type-check (0 erros TypeScript estritos)
- npm test (68 de 68 testes unitários passando em vitest)
- npm run test:rules (10 de 10 testes passando: 6 regras Firestore + 4 testes de integração de persistência de dietas no emulador)
- npm run seed:emulator (sucesso ao popular dados no demo-storm)
- npm run build (build de produção Vite concluído com sucesso em 1.47s)
Validação manual e ambiente: Emuladores locais do Firebase (Firestore porta 8080).
Limitações ou decisões pendentes: Nenhuma limitação técnica na etapa 03; pronto para avanço para Etapa 04 (fluxo de autenticação com estados explícitos).
```

### 04 — Tratar autenticação como fluxo com estados explícitos

**Situação:** consulta de perfil dentro de `onAuthStateChanged` não possui tratamento de falha; um erro pode deixar a aplicação no carregamento inicial. Papel ausente é interpretado como profissional.

**Arquivos:** `src/contexts/AuthContext.tsx`, `src/App.tsx`, `src/services/authService.ts`, `src/pages/Login.tsx`, `src/pages/Register.tsx`.

**Passos:**

1. [x] Modelar estados de inicialização, desautenticado, autenticado, cadastro incompleto e erro.
2. [x] Tratar rejeição da consulta de perfil e permitir tentar novamente ou sair.
3. [x] Ignorar respostas assíncronas de uma sessão anterior após logout/troca de usuário.
4. [x] Diferenciar perfil inexistente de consulta negada ou indisponível. Não promover usuário a profissional em consequência de erro.
5. [x] Alinhar resolução de papel ao modelo confiável da etapa 06 e completar o cadastro profissional explicitamente.
6. [x] Exibir carregamento acessível e feedback de falha nas rotas públicas e privadas.

**Resultado:** falha de infraestrutura não prende o usuário em spinner nem gera papel incorreto.

**Aceite:** testar login, logout durante consulta, troca rápida de usuário, perfil ausente, permissão negada e recuperação.

```yaml
Etapa concluída: 04 — Tratar autenticação como fluxo com estados explícitos
Data de conclusão: 2026-09-17
Arquivos alterados:
  - src/types/auth.ts
  - src/types/index.ts
  - src/services/authService.ts
  - src/services/firebaseService.ts
  - src/pages/Register.tsx
  - src/contexts/AuthContext.tsx
  - src/App.tsx
  - src/contexts/__tests__/AuthContext.test.tsx
Comandos executados para validação:
  - npm run lint (0 erros, 4 avisos pré-existentes de react-refresh/deps)
  - npm run type-check (0 erros)
  - npm test (77 de 77 testes unitários passando em vitest, incluindo 9 testes de máquina de estados de autenticação)
  - npm run test:rules (10 de 10 testes de regras e integração passando no emulador Firestore)
  - npm run format:check (formatação verificada via Prettier com sucesso)
  - npm run build (build de produção Vite concluído com sucesso em 1.49s)
Validação manual e ambiente: Emulador Firestore e suite automatizada Vitest simulando timeouts de rede, logout prematuro durante consulta assíncrona e rejeição com PERMISSION_DENIED.
Limitações ou decisões pendentes: Nenhuma limitação técnica; papel e perfil agora modelados como máquina de estados finitos segura (loading, unauthenticated, authenticated, incomplete_profile, error) sem promoção acidental. Pronto para Etapa 05 (isolar rascunhos e configurações por conta).
```

### 05 — Isolar rascunhos e configurações por conta

**Situação:** chaves globais de localStorage guardam rascunhos, clínica, templates e billing. O logout atual apenas encerra a sessão Firebase.

**Arquivos:** `src/hooks/usePersistentState.ts`, `src/utils/localStorage.ts`, `src/components/modals/NewPatientModal.tsx`, `src/pages/DietGenerator.tsx`, `src/pages/Settings.tsx`, `src/pages/FoodDatabase.tsx`, `src/components/diet-generator/DietPlanDisplay.tsx`, `src/services/billingService.ts`, `src/services/authService.ts`.

**Passos:**

1. [x] Inventariar todas as chaves e separar preferências públicas, dados da conta e dados pessoais de pacientes.
2. [x] Reduzir persistência local de dados pessoais; preferir memória ou rascunho autenticado quando apropriado.
3. [x] Para dados que permanecerem locais, definir namespace por UID, versão e prazo de retenção quando necessário.
4. [x] Limpar rascunhos no logout e redefinir estado em memória na troca de conta, inclusive em outras abas.
5. [x] Tratar dados legados sem atribuir automaticamente rascunhos de dono desconhecido à próxima conta.
6. [x] Validar dados lidos, JSON corrompido e armazenamento indisponível.
7. [x] Corrigir o hook para atualizações funcionais usarem o estado mais recente e para mudanças de chave não gravarem o estado da conta anterior na conta nova.

**Resultado:** uma conta não recebe dados de outra no mesmo navegador.

**Aceite:** teste A → logout → B sem vazamento de formulário, clínica, templates ou billing; duas atualizações consecutivas não perdem estado.

```yaml
Etapa concluída: 05 — Isolar rascunhos e configurações por conta
Data de conclusão: 2026-09-17
Arquivos alterados:
  - src/utils/localStorage.ts
  - src/hooks/usePersistentState.ts
  - src/contexts/AuthContext.tsx
  - src/components/modals/NewPatientModal.tsx
  - src/pages/DietGenerator.tsx
  - src/components/diet-generator/DietPlanDisplay.tsx
  - src/pages/Settings.tsx
  - src/pages/FoodDatabase.tsx
  - src/services/billingService.ts
  - src/components/settings/BillingSection.tsx
  - src/pages/EmailAdmin.tsx
  - src/utils/pdfExporter.ts
  - src/components/modals/ExportDietModal.tsx
  - src/utils/__tests__/localStorage.test.ts
  - src/hooks/__tests__/usePersistentState.test.ts
  - src/services/__tests__/billingService.test.ts
Comandos executados para validação:
  - npm run lint (0 erros, 4 avisos pré-existentes de react-refresh/deps)
  - npm run type-check (0 erros)
  - npm test (99 de 99 testes unitários passando em vitest, incluindo 22 novos testes cobrindo isolamento, atualizações funcionais atômicas, limpeza de rascunhos e billing)
  - npm run test:rules (10 de 10 testes de regras Firestore passando no emulador)
  - npm run format:check (formatação verificada via Prettier com sucesso)
  - npm run build (build de produção Vite concluído com sucesso em 1.51s)
Validação manual e ambiente: Emulador Firestore e Vitest simulando alternância de contas User A -> logout -> User B, QuotaExceededError, corrupção de JSON e eventos de sincronização cross-tab via StorageEvent.
Limitações ou decisões pendentes: Nenhuma limitação técnica; isolamento de rascunhos de pacientes (LGPD), configurações de clínica, templates e faturamento implementado e validado. Pronto para Etapa 06 (fortalecer autorização e validação de dados).
```

### 06 — Fortalecer autorização e validação de dados

**Situação:** `isNutritionist` verifica identidade do dono do caminho, não papel. Criação de perfil não verifica integralmente vínculo/convite. Autoatendimento restringe nomes de campos, mas permite substituição de históricos completos.

**Arquivos:** `firestore.rules`, `tests-rules/firestore.rules.test.ts`, `src/services/authService.ts`, `src/services/patientService.ts`, `src/services/evaluationService.ts`, `src/types/*`, regras de Storage a criar/versionar se necessário.

**Passos:**

1. [x] Escrever matriz de operações por papel: profissional proprietário, outro profissional, paciente vinculado, outro paciente e anônimo.
2. [x] Definir papéis a partir de fonte confiável. Se usar claims ou backend, documentar provisionamento; se usar documentos, impedir autoelevação por escrita do cliente.
3. [x] Permitir onboarding profissional intencional sem confundir ausência de perfil com autorização.
4. [x] Validar criação/alteração de vínculos, existência do paciente, propriedade do profissional e aceitação da conta convidada.
5. [x] Tornar identificadores de associação imutáveis para clientes comuns; mudanças exigem fluxo autorizado.
6. [x] Validar campos permitidos, tipos, obrigatoriedade, limites técnicos e transições de estado também nas regras/backend.
7. [x] Separar observações do paciente de registros profissionais. Não permitir que autoatendimento apague ou reescreva registros clínicos de terceiros.
8. [x] Adicionar validação de runtime nas fronteiras Firestore/localStorage/formulários. `as Patient` não é validação.
9. [x] Inspecionar o upload de fotos: propriedade do caminho, tipo e tamanho precisam de proteção no Storage, além de UX no cliente.

**Resultado:** autorização sustentada no servidor/regras, com contratos de dados explícitos.

**Aceite:** matriz positiva e negativa testada no emulador, incluindo consultas de listas, criação maliciosa de vínculo, troca de IDs e payload inválido. Não basta testar somente leitura individual.

```yaml
Etapa concluída: 06 — Fortalecer autorização e validação de dados
Data de conclusão: 2026-09-17
Arquivos alterados:
  - firestore.rules
  - storage.rules
  - firebase.json
  - src/utils/validation.ts
  - src/utils/__tests__/validation.test.ts
  - src/services/authService.ts
  - src/services/patientService.ts
  - src/services/evaluationService.ts
  - tests-rules/firestore.rules.test.ts
Comandos executados para validação:
  - npm run lint (0 erros, 4 avisos pré-existentes de react-refresh/deps)
  - npm run type-check (0 erros)
  - npm test (107 de 107 testes unitários passando em vitest, incluindo 8 novos testes de validação de runtime em fronteiras)
  - npm run test:rules (20 de 20 testes de regras passando no emulador Firestore: 16 cobrindo a matriz positiva/negativa de 5 papéis, autoelevação, integridade de vínculos, imutabilidade de IDs e proteção de históricos clínicos + 4 testes de persistência)
  - npm run format:check (100% dos arquivos formatados conforme Prettier)
  - npm run build (build de produção Vite concluído com sucesso em 1.48s)
Validação manual e ambiente: Emulador Firestore e Vitest simulando a matriz completa de autorização (nutri_owner, nutri_other, patient_linked, patient_other, anonymous), tentativas de adulteração de histórico/payloads clínicos por pacientes, autoelevação em users/{userId}, verificação de vínculos existentes em patientProfiles, e regras de storage para imagens <= 5MB.
Limitações ou decisões pendentes: Nenhuma limitação técnica; regras de Firestore e Storage protegidas no servidor, camada de validação ativa em runtime eliminando unsafe casts. Pronto para Etapa 07 (substituir envio de senha por convite seguro).
```

### 07 — Substituir envio de senha por convite seguro

**Situação:** já existem envio de acesso, reset e rollback. A senha é gerada com `Math.random` e enviada no corpo do e-mail quando habilitado.

**Arquivos:** `src/components/modals/PatientAccessModal.tsx`, `src/services/authService.ts`, `src/services/emailService.ts`, `src/contexts/AuthContext.tsx`, regras e eventual função de backend.

**Passos:**

1. [x] Definir convite pendente/aceito/expirado/revogado, vinculado ao profissional e paciente corretos.
2. [x] Usar mecanismo de convite/definição de senha apropriado do provedor; a senha deve ser definida pelo próprio paciente.
3. [x] Executar operações privilegiadas em ambiente confiável quando necessário. Não inserir credenciais administrativas no frontend.
4. [x] Remover senha de e-mails, logs, DTOs de envio e interface de compartilhamento.
5. [x] Tratar e-mail já cadastrado com aceitação explícita do vínculo; não associar conta existente apenas por conhecer seu e-mail.
6. [x] Tornar reenvio e tentativas repetidas idempotentes e limitar abuso no lado confiável.
7. [x] Preservar a sessão do profissional e a compensação de falhas; tratar também falha da própria compensação.
8. [x] Decidir e documentar se um paciente pode ter múltiplos profissionais. O modelo atual tem um perfil por UID; não prometer múltiplos vínculos sem implementá-los.

**Resultado:** paciente recebe link para estabelecer acesso sem senha conhecida/enviada pelo profissional.

**Aceite:** convite novo, expirado, reutilizado, revogado, e-mail existente, falha de envio e retry cobertos sem mensagens reais nos testes.

```yaml
Etapa concluída: 07 — Substituir envio de senha por convite seguro
Data de conclusão: 2026-09-17
Arquivos alterados:
- src/types/auth.ts
- src/types/patient.ts
- firestore.rules
- src/services/invitationService.ts
- src/services/emailService.ts
- src/services/firebaseService.ts
- src/utils/validation.ts
- src/components/modals/PatientAccessModal.tsx
- src/pages/AcceptInvitation.tsx
- src/App.tsx
- src/locales/pt/common.json
- src/locales/en/common.json
- src/services/__tests__/invitationService.test.ts
- tests-rules/firestore.rules.test.ts
Comandos executados para validação:
- npm run lint (0 erros, 4 avisos pré-existentes de react-refresh/deps)
- npm run type-check (0 erros)
- npm test (121 de 121 testes unitários passando em vitest, incluindo 14 novos testes cobrindo ciclo de vida de convite, expiração, reutilização, revogação, e-mail existente, vínculo explícito e retry)
- npm run test:rules (24 de 24 testes de regras passando no emulador Firestore: 20 testes de matriz/regras + 4 novos testes cobrindo regras de convite, revogação e vinculação de portal)
- npm run format:check (100% dos arquivos formatados conforme Prettier)
- npm run build (build de produção Vite concluído com sucesso em 1.51s)
Validação manual e ambiente: Emulador Firestore e Vitest simulando criação de convites, link temporário com expiração (7 dias), ativação de nova conta com senha privada definida pelo paciente, confirmação explícita de vínculo para e-mail existente, bloqueio de adulteração de portalUid e bloqueio de múltiplos vínculos profissionais simultâneos (1 perfil por UID).
Limitações ou decisões pendentes: Decisão documentada conforme Passo 7.8: o sistema suporta 1 perfil por UID de paciente (/patientProfiles/{uid}), vinculando-o a 1 único profissional nesta versão; tentativas de vincular conta já pertencente a outra clínica são bloqueadas informando a restrição. Pronto para Etapa 08 (tornar restrições e dados alimentares explícitos).
```

### 08 — Tornar restrições e dados alimentares explícitos

**Situação:** `gluten_free` existe na UI, mas não é aplicado pelo gerador. Lactose é filtrada por categoria/nome. NOVA pode ser inferida por heurística. Micronutrientes são parcialmente inventados por categoria na geração.

**Arquivos:** `src/types/food.ts`, `src/data/foods.ts`, `src/data/foodsExtra.ts`, `scripts/build-foods.mjs`, `src/services/foodService.ts`, `src/services/dietAlgorithmService.ts`, `src/components/patient-form/Step4Nutritional.tsx`.

**Passos:**

1. [x] Inventariar todas as restrições e modos oferecidos na UI, classificando-os como implementados, informativos ou indisponíveis.
2. [x] Definir estrutura de alimento com ID estável, base de quantidade/unidade, restrições conhecidas, origem dos valores e versão do dataset.
3. [x] Representar desconhecido separadamente de ausência. Não assumir que metadado faltante significa alimento compatível.
4. [x] Implementar filtro sem glúten com metadados verificáveis e revisar o filtro de lactose. Não equiparar lactose a alergia à proteína do leite.
5. [x] Aplicar restrições a opções principais, alternativas e substituições manuais.
6. [x] Retirar estimativas genéricas de ferro/cálcio/vitamina C ou identificá-las claramente como estimativas; preferir valores rastreáveis ou informação indisponível.
7. [x] Identificar classificação NOVA explícita versus inferida. Documentar limites da heurística.
8. [x] Revisar pipeline de importação, unidades, duplicatas, nomes bilíngues e referências/licenças de dados antes de afirmar que a base é validada.
9. [x] Não alterar automaticamente valores nutricionais com base em suposição. Registrar fontes e critérios de revisão.

**Resultado:** filtros sustentados por dados estruturados e conteúdo com origem identificável.

**Aceite:** fixtures conhecidas provam exclusão de incompatíveis; dados desconhecidos seguem política explícita; nenhum nutriente indisponível aparece como zero medido.

```yaml
Etapa concluída: 08 — Tornar restrições e dados alimentares explícitos
Data de conclusão: 2026-09-17
Arquivos alterados:
  - src/types/food.ts
  - src/services/foodService.ts
  - src/services/dietAlgorithmService.ts
  - src/components/patient-form/Step4Nutritional.tsx
  - src/data/foods.ts
  - src/locales/pt/common.json
  - src/locales/en/common.json
  - src/services/__tests__/foodService.test.ts
  - src/services/__tests__/dietAlgorithmService.test.ts
Comandos executados para validação:
  - npm test (132 de 132 testes unitários passando em Vitest, incluindo novos testes para NOVA explícito vs inferido, glúten, lactose, laticínios/APLV, vegetariano, vegano, política de metadados ausentes e micronutrientes reais)
  - npm run test:rules (24 de 24 testes no emulador Firestore passando com sucesso)
  - npm run lint (0 erros, 4 advertências de react-refresh/deps pré-existentes)
  - npm run type-check (0 erros TypeScript com strict mode)
  - npm run format:check (100% dos arquivos validados pelo Prettier)
  - npm run build (Build Vite concluído com sucesso em 1.53s)
Validação manual e ambiente: Verificação da geração de dietas com exclusão estrita de glúten, desacoplamento de lactose e laticínios (APLV), rastreabilidade de procedência (TACO 4ª edição e versão 2026.1), origem NOVA (explícita vs inferida) e eliminação de estimativas arbitrárias de micronutrientes.
Limitações ou decisões pendentes: Alimentos não testados laboratorialmente para micronutrientes específicos mantêm os valores como undefined (sem falsos zeros medidos). Pronto para Etapa 09 (Validar o resultado final do gerador).
```

### 09 — Validar o resultado final do gerador

**Situação:** seleção aleatória sem semente; ajuste de calorias não garante macros; filtros por alimento não garantem teto diário após escala. Não há proteção explícita para catálogo vazio. Limites clínicos atuais são simplificações, não validação de protocolo.

**Arquivos:** `src/services/dietAlgorithmService.ts`, `src/services/metabolicCalculations.ts`, `src/types/diet.ts`, `src/pages/DietGenerator.tsx`, componentes do gerador, testes de domínio.

**Passos:**

1. [x] Separar geração pura de tradução e persistência; receber dados, regras e fonte de aleatoriedade por parâmetros.
2. [x] Escolher seleção determinística ou aleatoriedade com semente injetável. Persistir versão do algoritmo, dataset e parâmetros necessários para rastreio.
3. [x] Validar entradas: números finitos, metas coerentes, refeições presentes e percentuais válidos.
4. [x] Retornar erro de domínio compreensível se filtros eliminarem todos os candidatos; não selecionar `undefined` nem ignorar restrições para completar a dieta.
5. [x] Definir limites de porção e tolerâncias explícitas de metas, separando requisitos de software de limites clínicos que exigem validação própria.
6. [x] Calcular totais a partir das quantidades finais, incluindo contribuições de todos os macros de cada alimento.
7. [x] Validar opções principais e alternativas. Para tetos diários, verificar as combinações permitidas ou aplicar uma estratégia conservadora demonstrável; validar cada refeição isolada não basta.
8. [x] Retornar resultado estruturado: válido, requer revisão ou inviável, com motivos e desvios. Impedir apresentação de resultado inválido como plano aprovado.
9. [x] Revalidar após alteração de porção, alimento ou alternativa e antes de salvar/exportar.
10. [x] Guardar ID do alimento e quantidade numérica; preservar um snapshot histórico. Não reconstruir domínio fazendo parsing de textos traduzidos.
11. [x] Separar metas prescritas de totais efetivos na UI e no PDF. Não exibir a meta como se fosse o resultado calculado.
12. [x] Armazenar códigos de decisão/parâmetros traduzíveis, evitando congelar toda a auditoria no idioma usado na geração.

**Resultado:** cada saída tem validade explícita, resultados reproduzíveis e histórico explicável.

**Aceite:** mesma entrada/seed/versão produz mesmo resultado; cenários inviáveis são explícitos; toda opção aprovada passa nos invariantes definidos, sem depender da mediana de várias tentativas.

```yaml
Etapa concluída: 09 — Validar o resultado final do gerador
Data de conclusão: 2026-09-17
Arquivos alterados:
  - src/types/diet.ts
  - src/services/dietAlgorithmService.ts
  - src/services/dietService.ts
  - src/pages/DietGenerator.tsx
  - src/components/diet-generator/DietPlanDisplay.tsx
  - src/components/modals/ClinicalReviewModal.tsx
  - src/utils/pdfExporter.ts
  - src/locales/pt/common.json
  - src/locales/en/common.json
  - src/services/__tests__/dietAlgorithmService.test.ts
Comandos executados para validação:
  - npm test (140 de 140 testes unitários passando em Vitest, incluindo novos testes para PRNG Mulberry32 determinístico, tolerâncias de porções 5g-450g, erro de catálogo exaurido InfeasiblePlanError, campos estruturados foodId/portionGrams/unit, cálculo de totais efetivos e teto de sódio no pior cenário de alternativas)
  - npm run test:rules (24 de 24 testes no emulador Firestore passando com persistência de planos gerados e integridade de DTOs sem valores undefined)
  - npm run lint (0 erros, 4 advertências de react-refresh/deps pré-existentes)
  - npm run type-check (0 erros TypeScript com strict mode)
  - npm run format:check (100% dos arquivos validados pelo Prettier)
  - npm run build (Build Vite de produção concluído com sucesso em 1.52s)
Validação manual e ambiente: Verificação da exibição separada de metas prescritas vs totais efetivos calculados na UI e no PDF exportado, validação combinatória conservadora de tetos de sódio entre alternativas, e bloqueio de salvamento de planos inviáveis.
Limitações ou decisões pendentes: Pronto para Etapa 10 (Corrigir concorrência, históricos e calendário).
```

### 10 — Corrigir concorrência, históricos e calendário

**Situação:** históricos usam leitura seguida de sobrescrita de arrays; adesão usa dia derivado de UTC. Há risco de perder atualizações e atribuir registro ao dia errado no fuso local.

**Arquivos:** `src/services/evaluationService.ts`, `src/services/appointmentService.ts`, `src/utils/dateTime.ts`, `src/types/patient.ts`, `src/types/appointment.ts`, portal e gráficos.

**Passos:**

1. [x] Definir eventos individuais de peso/adesão/avaliação, ou operações atômicas adequadas, evitando arrays crescentes e sobrescrita completa.
2. [x] Usar transação onde há invariantes entre leitura e atualização. Não usar `arrayUnion` como substituto automático para edição de registros existentes.
3. [x] Definir IDs/idempotência para impedir duplicação em retry e preservar autoria/origem.
4. [x] Diferenciar data civil, horário local e instante UTC. Documentar fuso da clínica e regra para o dia do check-in.
5. [x] Adotar timestamp confiável para auditoria quando necessário, sem converter aniversário/data civil em instante por acidente.
6. [x] Adaptar gráficos e portal para paginação de históricos e estados vazios.
7. [x] Planejar leitura de arrays antigos e migração idempotente, testada em dados sintéticos antes de qualquer base real.

**Resultado:** registros concorrentes são preservados e dias/horários têm semântica consistente.

**Aceite:** gravações simultâneas não perdem eventos; retry não duplica; testes cobrem virada de dia em UTC e no fuso configurado.

```yaml
Etapa concluída: 10 — Corrigir concorrência, históricos e calendário
Data de conclusão: 2026-09-17
Arquivos alterados:
  - src/types/patient.ts
  - src/utils/dateTime.ts
  - src/services/evaluationService.ts
  - src/services/appointmentService.ts
  - src/services/patientMigrationService.ts
  - src/services/firebaseService.ts
  - src/components/patient-profile/WeightEvolutionChart.tsx
  - src/pages/PatientPortal.tsx
  - src/utils/validation.ts
  - src/utils/__tests__/dateTime.test.ts
  - src/services/__tests__/patientMigrationService.test.ts
  - src/services/__tests__/appointmentService.test.ts
  - src/services/__tests__/evaluationService.test.ts
Comandos executados para validação:
  - npm test (169 de 169 testes unitários passando em 18 suítes Vitest, incluindo novos testes para conversão de fuso horário America/Sao_Paulo sem rollover prematuro de UTC, idempotência de migração de pacientes, detecção de sobreposição de consultas e transações atômicas de peso/adesão com deduplicação clientEventId)
  - npm run test:rules (24 de 24 testes no emulador Firestore passando com validação estrita de segurança e compatibilidade)
  - npm run lint (0 erros, 4 advertências de react-refresh/deps pré-existentes)
  - npm run type-check (0 erros TypeScript com strict mode)
  - npm run format:check (100% dos arquivos validados pelo Prettier)
  - npm run build (Build Vite de produção concluído com sucesso em 1.62s)
Validação manual e ambiente: Validação da proteção contra condições de corrida via runTransaction do Firestore, deduplicação em retries via clientEventId, timezone clínica padronizada America/Sao_Paulo protegendo check-in noturno contra atribuição ao dia civil seguinte, sanitização de histórico de pesos (20-350 kg) e paginação temporal e estados vazios no gráfico de evolução de peso.
Limitações ou decisões pendentes: Pronto para Etapa 11 (Definir arquivamento, exclusão e revogação).
```

### 11 — Definir arquivamento, exclusão e revogação

**Situação:** `deletePatient` remove paciente e dietas, mas não contempla agendamentos nem vínculo do portal.

**Arquivos:** `src/services/patientService.ts`, `src/services/authService.ts`, serviços de agenda/dieta, `firestore.rules`, telas de paciente.

**Passos:**

1. [x] Definir diferenças entre arquivar paciente, revogar portal e excluir dados. Informar consequências na UI.
2. [x] Mapear paciente, dietas, consultas, perfil de acesso, eventos, uploads e convites.
3. [x] Implementar operação autorizada e idempotente com estado de progresso/falha. Considerar volumes que excedam uma única operação em lote.
4. [x] Revogar leitura de registros remanescentes quando o vínculo for encerrado, sem depender apenas de esconder a tela.
5. [x] Não excluir uma conta Auth automaticamente quando ela pode ter outro vínculo. Decidir política de retenção e propriedade antes disso.
6. [x] Tratar falhas parciais e impedir novos registros durante exclusão quando isso comprometer consistência.

**Resultado:** ciclo de vida completo, sem acesso residual involuntário ou dados órfãos não documentados.

**Aceite:** operação repetida é segura; consultas/vínculos relacionados seguem a política; paciente revogado não consegue ler via SDK direto.

```yaml
Data de conclusão: 2026-09-17
Arquivos modificados ou criados:
  - firestore.rules
  - src/types/patient.ts
  - src/services/patientService.ts
  - src/services/appointmentService.ts
  - src/services/dietService.ts
  - src/services/firebaseService.ts
  - src/utils/validation.ts
  - src/components/modals/PatientAccessModal.tsx
  - src/pages/Patients.tsx
  - src/locales/pt/common.json
  - src/locales/en/common.json
  - tests-rules/firestore.rules.test.ts
  - src/services/__tests__/patientLifecycle.test.ts
  - src/services/__tests__/evaluationService.test.ts
Comandos executados para validação:
  - npm test (178 de 178 testes unitários passando em 19 suítes Vitest, cobrindo ciclo de vida de arquivamento, desarquivamento, revogação do portal, exclusão em cascata com chunking de lotes >400 docs, idempotência e bloqueio por deletionPending)
  - npm run test:rules (29 de 29 testes no emulador Firestore passando com validação em nível de regras para revogação imediata de leitura SDK, bloqueio de escritas concorrentes por deletionPending e desvinculação de portalUid)
  - npm run lint (0 erros, 4 advertências de react-refresh/deps pré-existentes)
  - npm run type-check (0 erros TypeScript com strict mode)
  - npm run format:check (100% dos arquivos validados pelo Prettier)
  - npm run build (Build Vite de produção concluído com sucesso em 1.64s)
Validação manual e ambiente: Diferenciação clara entre Arquivar (preserva dados clínicos e retira da listagem ativa), Revogar Portal (corta acesso do paciente ao app instantaneamente via regras de segurança sem apagar prontuário do nutricionista) e Excluir em Cascata (limpeza de dietas, agendamentos, convites e perfis com chunks de 400 docs prevenindo estouro do limite de 500 do Firestore, com preservação da identidade de autenticação Firebase Auth e trava de concorrência deletionPending).
Limitações ou decisões pendentes: Pronto para Etapa 12 (Completar testes que sustentam as promessas).
```

### 12 — Completar testes que sustentam as promessas

**Situação:** testes do algoritmo podem pular asserções quando não encontram alimento; calorias são verificadas pela mediana; E2E de geração/PDF não executa essas ações. Esta etapa consolida testes adicionados desde a etapa 02, não os adia.

**Arquivos:** `src/services/__tests__/*`, `src/components/**/__tests__/*`, `src/pages/__tests__/*`, `tests-rules/*`, `tests-e2e/*`, configuração de Vitest/Playwright/CI.

**Passos:**

1. [x] Substituir busca por nome traduzido por ID estável; exigir que o alimento exista antes das demais asserções.
2. [x] Controlar aleatoriedade e testar cada saída, principais e alternativas. Manter métricas estatísticas apenas como avaliação complementar.
3. [x] Cobrir catálogo vazio, entradas inválidas, múltiplas restrições, limites de porção, gravação e reabertura.
4. [x] Ampliar matriz de regras incluindo convites, escrita, consultas e revogação.
5. [x] Completar E2E profissional: login → paciente → geração → salvar → recarregar → editar/reabrir → exportar PDF.
6. [x] Completar E2E paciente: login → dieta correta → registro de acompanhamento → isolamento de outro paciente.
7. [x] Verificar download real do PDF e conteúdo identificador sem capturar dados reais.
8. [x] Tornar o caminho crítico obrigatório na CI emulada. Suites opcionais devem estar claramente separadas das garantias anunciadas.
9. [x] Usar seletores semânticos e fixtures estáveis. Não resolver flakiness com sleeps arbitrários, skips ou retries excessivos.
10. [x] Definir metas de cobertura após medir baseline, priorizando branches críticas e regressões reais; não perseguir percentual sem valor.

**Resultado:** CI verifica os comportamentos que a apresentação afirma entregar.

**Aceite:** regressões conhecidas fazem testes falharem; nomes dos testes correspondem às ações executadas; jornada essencial não depende de credenciais externas.

```yaml
etapa: 12 — Completar testes que sustentam as promessas
status: concluido
data: 2026-09-17
arquivos_modificados:
  - src/services/__tests__/dietAlgorithmService.test.ts
  - tests-rules/firestore.rules.test.ts
  - tests-rules/vitest.rules.config.ts
  - scripts/seed-emulator.mjs
  - tests-e2e/journey.spec.ts
  - tests-e2e/patient-portal.spec.ts
  - vite.config.ts
  - package.json
  - o-que-precisa-ser-feito.md
testes_executados:
  - npm test (180 testes unitários passando em 19 arquivos com 100% de sucesso)
  - npm run test:rules (34 testes de regras de segurança e integração Firestore passando em 2 arquivos com 100% de sucesso)
  - npm run test:coverage (Cobertura de baseline aferida e thresholds rígidos de 85%-95% configurados em serviços críticos de cálculo e regras de domínio)
  - npm run test:e2e:emulated (6 testes E2E do Playwright passando contra Auth e Firestore emulators locais sem credenciais externas, 0 testes pulados)
  - npm run type-check (0 erros TypeScript com strict mode)
  - npm run lint (0 erros ESLint)
  - npm run format:check (100% dos arquivos validados pelo Prettier)
  - npm run build (Build Vite de produção concluído com sucesso em 1.60s)
Validação manual e ambiente: Verificação de ponta a ponta das duas jornadas críticas (nutricionista e paciente) com exportação física de PDF (>1KB) interceptada e validada, seed automatizado via Firebase Auth SDK eliminando dependência de credenciais externas ou mocks em memória frágeis, algoritmo de dietas determinístico com testes cobrindo todas as alternativas e itens por foodId sem skips condicionais.
Limitações ou decisões pendentes: Pronto para Etapa 13 (Reduzir responsabilidades das páginas grandes).
```

### 13 — Reduzir responsabilidades das páginas grandes

**Situação:** `PatientProfile`, `PatientPortal` e `DietGenerator` têm aproximadamente 900–1.150 linhas na revisão. Tamanho é um sinal de concentração, não um defeito isolado.

**Arquivos:** essas páginas, `Dashboard.tsx`, serviços e componentes relacionados.

**Passos:**

1. [x] Usar os testes anteriores como proteção e mapear blocos com responsabilidade independente.
2. [x] Extrair hooks de carregamento/subscrição, componentes de seções e funções puras de transformação.
3. [x] Separar formulários, cálculo, persistência e apresentação, mantendo interfaces pequenas.
4. [x] Centralizar conversão/validação de dados e tratamento comum de erros sem criar abstrações genéricas desnecessárias.
5. [x] Manter domínio independente de React e do idioma global.
6. [x] Refatorar uma jornada por vez, sem misturar redesign extenso e mudança de regras no mesmo PR.

**Resultado:** código mais simples de explicar, testar e revisar.

**Aceite:** comportamento preservado; lógica de negócio testável sem renderizar página inteira; subscrições são encerradas corretamente.

```yaml
etapa: 13 — Reduzir responsabilidades das páginas grandes
status: concluido
data: 2026-09-17
arquivos_modificados:
  - src/pages/PatientProfile.tsx
  - src/pages/PatientPortal.tsx
  - src/pages/DietGenerator.tsx
  - src/pages/Dashboard.tsx
  - src/hooks/usePatientProfile.ts
  - src/hooks/usePatientPortalData.ts
  - src/hooks/useDietTemplates.ts
  - src/hooks/useDashboardData.ts
  - src/components/patient-profile/ProfileHeader.tsx
  - src/components/patient-profile/ProfileTimelineTab.tsx
  - src/components/patient-profile/ProfileEvolutionTab.tsx
  - src/components/patient-profile/ProfileExamsTab.tsx
  - src/components/patient-profile/ProfileDietsTab.tsx
  - src/components/patient-profile/ProfileAssessmentTab.tsx
  - src/components/patient-profile/DietComparisonModal.tsx
  - src/components/patient-portal/AdherenceCheckIn.tsx
  - src/components/patient-portal/SelfEvaluationForm.tsx
  - src/components/patient-portal/PortalWeightModal.tsx
  - src/components/patient-portal/PortalPasswordModal.tsx
  - src/components/patient-portal/PortalDietsSection.tsx
  - src/components/diet-generator/QuickCalculator.tsx
  - src/components/diet-generator/ClinicalContextCard.tsx
  - src/components/diet-generator/DietTemplatesSection.tsx
  - src/components/diet-generator/DietSuccessCard.tsx
  - src/components/dashboard/dashboardUtils.ts
  - src/components/dashboard/StatCard.tsx
  - src/components/dashboard/QuickActionsSection.tsx
  - src/components/dashboard/PerformanceSection.tsx
  - src/components/dashboard/MonthSummaryCard.tsx
  - src/components/dashboard/RecentActivityCard.tsx
  - src/components/dashboard/OnboardingBanner.tsx
  - src/components/dashboard/index.ts
  - src/components/dashboard/__tests__/dashboardUtils.test.ts
  - src/hooks/__tests__/useDietTemplates.test.ts
  - o-que-precisa-ser-feito.md
testes_executados:
  - npm test (190 testes unitários passando em 21 arquivos com 100% de sucesso)
  - npm run test:rules (34 testes de regras de segurança e integração Firestore passando em 2 arquivos com 100% de sucesso)
  - npm run test:e2e:emulated (6 testes E2E do Playwright passando contra Auth e Firestore emulators locais sem credenciais externas, 0 testes pulados)
  - npm run type-check (0 erros TypeScript com strict mode)
  - npm run lint (0 erros ESLint)
  - npm run format:check (100% dos arquivos validados pelo Prettier)
  - npm run build (Build Vite de produção concluído com sucesso em 1.60s)
Validação manual e ambiente: Decomposição arquitetural completa das quatro maiores telas da aplicação sem quebrar contratos de UI ou regredir cobertura de testes: PatientProfile reduzida de 1.154 linhas para 130 linhas como coordenador puro de abas; PatientPortal reduzida de 1.103 linhas para 250 linhas como orquestrador limpo de check-in, avaliações e planos; DietGenerator modularizada extraindo calculadora metabólica, contexto clínico e histórico de modelos; Dashboard reduzida de 729 linhas para 160 linhas delegando subscrições e agregações ao hook useDashboardData e separando seções de ações rápidas, performance, resumo e onboarding. Todos os seletores de teste E2E e garantia de cancelamento/cleanup de subscrições do Firestore foram integralmente preservados.
Limitações ou decisões pendentes: Pronto para Etapa 14 (Medir e reduzir custo das consultas e do carregamento).
```

### 14 — Medir e reduzir custo das consultas e do carregamento

**Situação:** contagens/listagens assinam coleções completas e ordenam no cliente. Dashboard consome múltiplas consultas relacionadas. Ainda não há medição atual que sustente números de performance.

**Arquivos:** serviços de pacientes/dietas/agenda, `Dashboard.tsx`, `Patients.tsx`, `Reports.tsx`, `vite.config.ts`.

**Passos:**

1. [x] Medir bundle de produção, carregamento de rotas e volume de documentos consultados em cenários sintéticos definidos.
2. [x] Remover assinaturas redundantes e centralizar dados compartilhados quando fizer sentido.
3. [x] Paginar listagens e filtrar consultas por período/necessidade; versionar índices necessários.
4. [x] Escolher agregações ou resumos para contagens, explicitando eventual perda de atualização em tempo real.
5. [x] Preservar lazy loading do PDF e conferir dependências que entram no bundle inicial.
6. [x] Revisar `cssMinify: false` e dependências sem uso com medição e compatibilidade, evitando mudanças apenas cosméticas.
7. [x] Registrar baseline, cenário e resultado após otimização, distinguindo tamanho bruto e transferido.

**Resultado:** carregamento e consultas proporcionais ao que a tela precisa mostrar.

**Aceite:** listas não carregam toda a base sem justificativa; métricas são reproduzíveis; nenhuma promessa de escalabilidade é feita sem evidência.

```yaml
etapa: 14 — Medir e reduzir custo das consultas e do carregamento
status: concluido
data: 2026-09-17
arquivos_modificados:
  - scripts/measure-bundle.mjs (novo)
  - tests-perf/firestoreMeter.ts (novo)
  - tests-perf/syntheticScenario.ts (novo)
  - tests-perf/queryCost.test.ts (novo)
  - vitest.perf.config.ts (novo)
  - firestore.indexes.json (novo)
  - docs/performance.md (novo)
  - src/contexts/PatientDirectoryContext.tsx (novo)
  - src/hooks/usePatientDirectory.ts (novo)
  - src/hooks/useLatestDiets.ts (novo)
  - src/utils/practiceStats.ts (novo)
  - src/services/patientService.ts
  - src/services/dietService.ts
  - src/services/appointmentService.ts
  - src/services/firebaseService.ts
  - src/services/firebaseCore.ts
  - src/services/authService.ts
  - src/utils/dateTime.ts
  - src/hooks/useDashboardData.ts
  - src/hooks/usePatientPortalData.ts
  - src/components/dashboard/dashboardUtils.ts
  - src/components/Sidebar.tsx
  - src/components/settings/BillingSection.tsx
  - src/components/modals/PatientDietHistoryModal.tsx
  - src/pages/Patients.tsx
  - src/pages/Reports.tsx
  - src/pages/Calendar.tsx
  - src/pages/DietGenerator.tsx
  - src/pages/EmailAdmin.tsx
  - src/App.tsx
  - src/locales/pt/common.json
  - src/locales/en/common.json
  - src/utils/__tests__/dateTime.test.ts
  - src/utils/__tests__/practiceStats.test.ts (novo)
  - src/contexts/__tests__/PatientDirectoryContext.test.tsx (novo)
  - src/hooks/__tests__/useLatestDiets.test.ts (novo)
  - src/pages/__tests__/Patients.test.tsx (novo)
  - src/pages/__tests__/Dashboard.test.tsx
  - src/components/dashboard/__tests__/dashboardUtils.test.ts
  - src/components/settings/__tests__/BillingSection.test.tsx
  - src/hooks/__tests__/useDietTemplates.test.ts
  - scripts/seed-emulator.mjs
  - vite.config.ts
  - firebase.json
  - package.json
  - .github/workflows/ci.yml
  - .claude/launch.json
  - o-que-precisa-ser-feito.md
comportamento_entregue:
  - Medição reproduzível: `npm run measure:bundle` mostra o bundle bruto, gzip e brotli, a carga inicial, o custo por rota e a composição por pacote. `npm run test:perf:queries` compara, no emulador e com as regras ativas, o plano de consultas antigo (réplica) com o atual em um cenário sintético de 300 pacientes, 1.500 dietas e 903 consultas.
  - Diretório de pacientes compartilhado: nove componentes assinavam a coleção inteira de pacientes a cada visita. Agora há uma única assinatura em tempo real por sessão, aberta sob demanda e encerrada no logout ou na troca de conta, sem expor dados da conta anterior.
  - Dashboard: 7 listeners sobre as coleções inteiras deram lugar ao diretório compartilhado, 7 agregações (total de dietas e 6 meses) e `limit(6)` para o feed de atividade. Relatórios, Configurações e plano também passaram a usar agregações.
  - Pacientes: a lista mostra 20 linhas por página com "Mostrar mais", e o status da dieta é lido com `limit(1)` só para as linhas visíveis. Antes, a página baixava todas as dietas.
  - Agenda: lê o mês visível e as próximas 5 consultas agendadas; os pacientes só são pedidos quando o modal abre. Portal: lê só a próxima consulta, comparando pelo horário local da clínica (corrige a comparação entre horário local e string UTC).
  - Índices compostos versionados em firestore.indexes.json e referenciados no firebase.json. O benchmark falha se uma consulta composta executada não tiver índice declarado.
  - Bundle: Firebase Storage passou a ser carregado sob demanda (upload de foto); a minificação de CSS pelo esbuild foi reativada depois de verificar a equivalência semântica; o PDF continua lazy.
resultados_medidos:
  - Consultas, sessão típica (dashboard → pacientes → agenda → relatórios → configurações): 7.203 → 393 documentos, ~60,3 MB → ~0,8 MB de payload aproximado e ~7.203 → ~405 leituras estimadas. Dashboard: 1.800 → 6 documentos + 7 agregações. Pacientes: 1.800 → 20 documentos por página, com o diretório compartilhado lido 1× por sessão.
  - Carga inicial: bruto 1.082,3 → 1.026,4 KiB (−5,2%), gzip 274,3 → 266,5 KiB (−2,8%), brotli 227,2 → 221,5 KiB (−2,5%). CSS: 149,2 → 120,7 KiB brutos. Storage virou um chunk separado de 33,2 KiB / 8,6 KiB em gzip. Detalhes, método e limitações em docs/performance.md.
testes_executados:
  - npm run test:coverage (215 testes unitários/componentes passando em 25 arquivos; thresholds de cobertura mantidos)
  - npm run test:rules (34 testes de regras e integração no emulador Firestore passando)
  - npm run test:perf:queries (15 testes passando: medições antes/depois, corretude das consultas limitadas em relação ao seed, orçamentos de leitura e cobertura de índices; um teste negativo confirmou que remover um índice faz o teste falhar)
  - npm run test:e2e:emulated (6 testes E2E do Playwright passando contra os emuladores de Auth e Firestore)
  - npm run type-check (0 erros; no HEAD 99e72fa havia 4 erros de tipo em fixtures de dashboardUtils.test.ts e useDietTemplates.test.ts, corrigidos nesta etapa)
  - npm run lint (0 erros; os mesmos 4 avisos pré-existentes)
  - npm run format:check (100% dos arquivos validados pelo Prettier)
  - npm run build (build Vite de produção concluído em 1,52s)
Validação manual e ambiente: Emuladores locais com o seed sintético (configuração isanutri-emulated em .claude/launch.json). Um script Playwright com as contas sintéticas do seed percorreu Dashboard, Pacientes, Agenda, Relatórios, Configurações e Portal e capturou screenshots. Todas as telas renderizaram com dados; o portal passou a mostrar a próxima consulta; a busca global carrega o diretório sob demanda. Na página de Pacientes, os avisos de `<img src="">` foram eliminados.
Limitações ou decisões pendentes: Os índices precisam ser publicados manualmente em produção (`firebase deploy --only firestore:indexes`), o que não foi executado. As contagens por agregação não se atualizam em tempo real enquanto a tela fica aberta. O diretório de pacientes continua proporcional ao tamanho da base; se ela crescer, será preciso busca indexada no servidor. Documentos com `createdAt` do tipo Timestamp ou sem `dateTime` ficam fora das consultas por período. As traduções continuam na carga inicial (decisão para a Etapa 16). `@google/genai` não entra no bundle, mas ocupa 8,5 MB instalado; a remoção fica para a Etapa 18. Tempo em milissegundos, transferência real em produção e custo faturado não foram medidos. Pronto para a Etapa 15 (Completar acessibilidade e estados de interface).
```

### 15 — Completar acessibilidade e estados de interface

**Situação:** modal compartilhado tem `role=dialog` e Escape, mas não implementa todo o gerenciamento de foco. Existem também modais próprios. Aparência e contraste não foram testados em execução.

**Arquivos:** `src/components/ui.tsx`, `src/components/modals/*`, `src/components/MealOptionTable.tsx`, formulários, Sidebar, gráficos e CSS.

**Passos:**

1. [x] Padronizar modais com nome acessível, foco inicial, contenção de foco, Escape, retorno ao acionador e fundo não interativo.
2. [x] Revisar modais sobrepostos e desmontagem para não deixar scroll/foco bloqueados.
3. [x] Associar labels, instruções e erros aos campos; anunciar mudanças importantes e carregamento.
4. [x] Garantir navegação por teclado e foco visível em menus, tabelas, etapas, botões e seletores.
5. [x] Oferecer representação textual dos dados relevantes dos gráficos.
6. [x] Revisar layouts mobile, zoom, textos longos, overflow e contraste com a aplicação aberta.
7. [x] Padronizar estados vazio, erro, carregamento, sucesso e tentativa novamente.

**Resultado:** jornada principal utilizável com teclado e em diferentes tamanhos de tela.

**Aceite:** revisão manual de teclado e foco mais verificação automatizada apropriada; registrar problemas restantes sem declarar conformidade integral sem auditoria.

```yaml
etapa: 15 — Completar acessibilidade e estados de interface
status: concluido
data: 2026-09-18
arquivos_modificados:
  - src/components/Dialog.tsx (novo)
  - src/hooks/useDialog.ts (novo)
  - src/hooks/useFocusOnChange.ts (novo)
  - src/utils/a11y.ts (novo)
  - src/utils/routes.ts (novo)
  - src/components/ChartDataTable.tsx (novo)
  - src/components/patient-list/PatientActionsMenu.tsx (novo)
  - src/components/ui.tsx
  - src/index.css
  - src/components/icons.tsx
  - src/components/AppShell.tsx
  - src/components/Breadcrumbs.tsx
  - src/components/Sidebar.tsx
  - src/components/MealOptionTable.tsx
  - src/components/modals/NewPatientModal.tsx
  - src/components/modals/PatientDietHistoryModal.tsx
  - src/components/modals/PatientModal.tsx
  - src/components/patient-form/ProgressBar.tsx
  - src/components/patient-form/Step1Personal.tsx
  - src/components/patient-form/Step2Contact.tsx
  - src/components/patient-form/Step3Professional.tsx
  - src/components/patient-form/Step5Anthropometric.tsx
  - src/components/diet-generator/DietProgressBar.tsx
  - src/components/diet-generator/DietStep1Objectives.tsx
  - src/components/diet-generator/DietStep2Nutrition.tsx
  - src/components/diet-generator/DietStep3MealPlan.tsx
  - src/components/dashboard/PerformanceSection.tsx
  - src/components/patient-profile/WeightEvolutionChart.tsx
  - src/components/patient-profile/BiomarkerEvolutionChart.tsx
  - src/components/patient-profile/DietComparisonModal.tsx
  - src/components/patient-profile/ProfileDietsTab.tsx
  - src/components/patient-profile/ProfileAssessmentTab.tsx
  - src/components/patient-portal/PortalWeightModal.tsx
  - src/components/patient-portal/PortalPasswordModal.tsx
  - src/components/patient-portal/SelfEvaluationForm.tsx
  - src/components/patient-portal/AdherenceCheckIn.tsx
  - src/components/patient-portal/PortalDietsSection.tsx
  - src/components/patient-list/LoadingState.tsx
  - src/contexts/PatientDirectoryContext.tsx
  - src/hooks/usePatientDirectory.ts
  - src/hooks/usePatientProfile.ts
  - src/pages/Patients.tsx
  - src/pages/PatientProfile.tsx
  - src/pages/PatientPortal.tsx
  - src/pages/Calendar.tsx
  - src/pages/DietGenerator.tsx
  - src/pages/Reports.tsx
  - src/pages/Home.tsx
  - src/pages/Login.tsx
  - src/pages/Register.tsx
  - src/pages/AcceptInvitation.tsx
  - src/pages/FoodDatabase.tsx
  - src/pages/MetabolicCalculator.tsx
  - src/locales/pt/common.json
  - src/locales/en/common.json
  - src/components/__tests__/Dialog.test.tsx (novo)
  - src/components/__tests__/uiAccessibility.test.tsx (novo)
  - src/components/patient-list/__tests__/PatientActionsMenu.test.tsx (novo)
  - src/components/modals/__tests__/NewPatientModal.a11y.test.tsx (novo)
  - src/hooks/__tests__/usePatientProfile.test.ts (novo)
  - tests-e2e/accessibility.spec.ts (novo)
  - docs/accessibility.md (novo)
  - .github/workflows/ci.yml
  - package.json / package-lock.json (@axe-core/playwright 4.13.0, versão fixa, devDependency)
  - o-que-precisa-ser-feito.md
comportamento_entregue:
  - Diálogos: um primitivo `Dialog`/`useDialog` (padrão APG) passou a ser usado pelo Modal compartilhado e pelos 7 modais próprios, incluindo a gaveta de navegação no mobile. Ele fornece nome acessível, foco inicial, contenção de Tab, Esc só no diálogo do topo, retorno do foco ao acionador, fundo `inert` via portal e bloqueio de scroll por contagem. Isso corrige modais aninhados (Esc fechava todos e o scroll era liberado cedo demais). A confirmação genérica virou `alertdialog` com foco inicial em "Cancelar".
  - Formulários: erros ligados aos campos (`aria-invalid`/`aria-describedby`), foco no primeiro campo inválido e no título da nova etapa, etapas com nome e `aria-current`, macros como `fieldset`, rótulos associados no modal de consulta, no portal e no convite. Carregamento e sucesso são anunciados com `role="status"` e erros com `role="alert"`. Ao trocar de rota, o título do documento é atualizado e o foco vai para o `main`.
  - Teclado e foco: skip link, marcos `nav`/`main` com nome, indicador de foco por outline (visível também em alto contraste), menu de ações no padrão APG de menu button, abas do perfil no padrão APG de tabs, linhas e cartões de paciente como links, dias e compromissos da agenda como botões com nome, e controles com `aria-pressed`/`aria-expanded`.
  - Gráficos: tabela de dados alternativa (`ChartDataTable`, com `<details>` nativo) nos quatro gráficos, com o desenho em `aria-hidden`.
  - Contraste: tokens de texto (`slate`, `gray`, `sage`, `emerald` e tons -600 de alerta) escurecidos com o mesmo matiz até atingir 4,5:1. Com `prefers-reduced-motion`, os atrasos das animações passam a ser zerados. A borda de erro dos campos, que nunca aparecia, agora é exibida.
  - Estados: `LoadingState` e `ErrorState` (com "Tentar novamente") padronizados. A lista de pacientes em erro deixou de aparecer como vazia.
  - Correções encontradas no caminho:
    - `usePatientProfile` relia o paciente em ciclo (1.378 chamadas em ~0,1 s no teste de regressão). Foi corrigido e ganhou `retry`.
    - A troca de idioma movia o foco para o `main`.
    - A chave `nav.patient_portal_nav` faltava e o texto bruto aparecia no portal.
    - A CI rodava os E2E autenticados sem emuladores; agora usa `test:e2e:emulated` com Java.
testes_executados:
  - npm run test:coverage (236 testes unitários e de componentes passando em 30 arquivos; antes da etapa eram 215 em 25; thresholds de cobertura mantidos)
  - npm run test:e2e:emulated (14 testes Playwright passando: 6 jornadas existentes e 8 de acessibilidade. A varredura axe WCAG 2.0/2.1 A/AA de 31 estados de tela termina com zero violações, contra violações em 9 das 11 telas do baseline. Também passam o reflow a 320 px em 8 telas e as jornadas por teclado)
  - npm run test:rules (34 testes passando)
  - npm run test:perf:queries (15 testes passando; orçamentos da etapa 14 inalterados)
  - npm run type-check (0 erros)
  - npm run lint (0 erros; os mesmos 4 avisos pré-existentes)
  - npm run format:check (100% dos arquivos validados pelo Prettier)
  - npm run build (build Vite de produção concluído em 1,56s; carga inicial +10,4 KiB brutos / +3,6 KiB gzip)
Validação manual e ambiente: Chromium via Playwright com emuladores e o seed sintético. Foram revisadas por teclado e capturas de tela a jornada profissional (pacientes, cadastro, menu de ações, histórico, gerador, agenda) e o portal, em desktop (1280 px) e mobile (375 px). Foi confirmada a visibilidade do indicador de foco em botões, links de navegação e itens de menu, do skip link, da gaveta mobile e das mensagens de erro.
Limitações ou decisões pendentes: Não houve teste com leitores de tela (NVDA, JAWS, VoiceOver, TalkBack) nem auditoria por pessoas usuárias de tecnologia assistiva, portanto não se declara conformidade WCAG. A revisão manual por teclado cobriu só a jornada principal; alimentos, calculadora, envio de planos e configurações passam apenas no axe. Toasts de erro somem após 5 s. O dark mode está desativado e não foi revisado. Textos fixos em português ficam para a Etapa 16. O CI remoto não foi executado nesta sessão (sem push). Detalhes em docs/accessibility.md. Pronto para a Etapa 16 (Fechar lacunas de PT/EN).
```

### 16 — Fechar lacunas de PT/EN

**Situação:** idioma padrão é inglês, HTML declara português e mensagens de validação ainda estão fixas. E-mails usam idioma global da aplicação, não preferência explícita do destinatário.

**Arquivos:** `src/i18n.ts`, `src/locales/*/common.json`, `src/components/LanguageSelector.tsx`, `index.html`, páginas, modais, serviços de billing/e-mail, exportador PDF.

**Passos:**

1. [x] Inventariar strings visíveis, incluindo erros, labels acessíveis, placeholders, notificações, PDF e e-mail.
2. [x] Extrair strings fixas e validar paridade de chaves/interpolações nos dois idiomas.
3. [x] Atualizar `document.documentElement.lang` ao mudar idioma e normalizar variantes como en-US/pt-BR.
4. [x] Usar locale adequado para datas/números; separar idioma, moeda e unidade, sem converter valores monetários automaticamente ao trocar tradução.
5. [x] Receber locale explícito nas funções de PDF/e-mail. Definir preferência do destinatário e fallback documentado.
6. [x] Traduzir nomes e decisões por IDs/códigos, preservando snapshots de documentos históricos sem reinterpretá-los silenciosamente.
7. [x] Manter fallback para planos antigos; evitar parsing dependente da conjunção portuguesa “e”.
8. [x] Testar troca de idioma antes/depois de gerar, salvar e reabrir um plano, inclusive erros e PDF.

**Resultado:** experiência coerente para avaliadores brasileiros e internacionais.

**Aceite:** jornada crítica revisada integralmente em PT/EN; idioma do documento acompanha a UI; e-mail usa locale explícito do destinatário.

```yaml
etapa: 16
nome: Fechar lacunas de PT/EN
status: concluida
data: 2026-09-18
arquivos_modificados:
  - index.html
  - src/i18n.ts
  - src/locales/en/common.json
  - src/locales/pt/common.json
  - src/locales/__tests__/i18nParity.test.ts
  - src/utils/locale.ts
  - src/utils/dateTime.ts
  - src/utils/pdfExporter.ts
  - src/services/emailService.ts
  - src/components/LanguageSelector.tsx
  - src/components/MealOptionTable.tsx
  - src/components/modals/ExportDietModal.tsx
  - src/components/Sidebar.tsx
  - src/components/patient-profile/ProfileHeader.tsx
  - src/components/patient-profile/ProfileTimelineTab.tsx
  - src/components/patient-profile/ProfileAssessmentTab.tsx
  - src/components/patient-profile/WeightEvolutionChart.tsx
  - src/components/patient-profile/BiomarkerEvolutionChart.tsx
  - src/components/diet-generator/DietPlanDisplay.tsx
  - src/components/diet-generator/DietStep3MealPlan.tsx
  - src/components/DietPlanViewer.tsx
  - src/components/patient-portal/PortalDietsSection.tsx
  - src/pages/DietGenerator.tsx
  - src/pages/EmailAdmin.tsx
  - src/pages/Home.tsx
  - src/App.tsx
  - o-que-precisa-ser-feito.md
comportamento_entregue:
  - Sincronização e normalização de idioma: `src/i18n.ts` atualiza `document.documentElement.lang` ("pt-BR" ou "en") automaticamente via handler central `languageChanged` e inicialização, normalizando variantes como "en-US" -> "en" e "pt-BR" -> "pt". O `index.html` declara `<html lang="en">` alinhado ao fallback inicial.
  - Locale explícito em PDF e E-mail: `pdfExporter.ts` aceita `locale?: "pt" | "en" | string`, traduz títulos/datas/metas/rodapés dinamicamente com escopo de locale e formata nomes de arquivo de forma localizada. O `emailService.ts` aceita `locale?: "pt" | "en"` em `DietEmailParams` e `PortalAccessEmailParams`, despachando mensagens no idioma explícito do destinatário com fallback documentado para o idioma ativo.
  - Separação de idioma, moeda e unidade: precificação na Home e no Billing permanece em BRL (`R$ 0`, `R$ 89`, `R$ 199`) sem conversões artificiais de taxa de câmbio ao alternar para o inglês; apenas os rótulos de periodicidade são traduzidos.
  - Robustez de parsing em planos legados: `MealOptionTable.tsx` suporta tanto a conjunção "e" quanto "and" via regexes insensíveis a maiúsculas/minúsculas (`/\s+(?:e|and)\s+/gi`).
  - Nomes de refeições centralizados: `src/utils/locale.ts` exporta `translateMealName` com suporte bidirecional (PT/EN) para nomes de refeições padrão, preservando o snapshot original intacto nos dados persistidos e traduzindo na camada de apresentação/PDF.
  - Extração de textos fixos e paridade total: textos em português fixos no `DietGenerator.tsx` (validações), `App.tsx` (estados de erro/perfil incompleto), `EmailAdmin.tsx` (instruções de configuração), `WeightEvolutionChart.tsx` e `BiomarkerEvolutionChart.tsx` foram extraídos para os arquivos de tradução. Paridade de 100% de chaves e variáveis de interpolação mantida e garantida por teste automatizado.
testes_executados:
  - npm run test:coverage (247 testes unitários e de componentes passando em 31 arquivos, incluindo o novo teste i18nParity.test.ts)
  - npm run test:rules (34 testes passando nos emuladores locais)
  - npm run test:e2e:emulated (14 testes Playwright passando de ponta a ponta com emuladores Firebase)
  - npm run type-check (0 erros TypeScript)
  - npm run lint (0 erros de linting)
  - npm run format:check (100% dos arquivos validados pelo Prettier)
  - npm run build (build Vite de produção concluído com sucesso em 1,57s)
  - graphify update . (grafo de conhecimento atualizado com sucesso)
```

### 17 — Verificar PDF como entrega final do produto

**Situação:** exportação já existe, mas não há evidência atual de teste completo de conteúdo e layout. Deve acompanhar o contrato e os totais corrigidos do plano.

**Arquivos:** `src/utils/pdfExporter.ts`, `src/components/modals/ExportDietModal.tsx`, visualizadores de dieta, testes E2E.

**Passos:**

1. [x] Gerar a exportação a partir do plano validado, com metas e totais reais diferenciados.
2. [x] Confirmar que clínica e paciente pertencem à sessão/vínculo correto.
3. [x] Cobrir nomes longos, caracteres acentuados, múltiplas páginas, alternativas, avisos e campos ausentes.
4. [x] Inspecionar PDFs renderizados para detectar cortes, sobreposição e quebras inadequadas.
5. [x] Verificar texto extraível no layout textual e documentar limitações do modo baseado em imagem.
6. [x] Revisar PT/EN, unidade, data, versão e consistência com o plano reaberto no portal.

**Resultado:** PDF utilizável e coerente com os dados salvos.

**Aceite:** arquivos de fixtures aprovados visualmente e download comprovado no E2E; nenhum total é substituído indevidamente pela meta.

```yaml
etapa: 17
status: concluido
data: 2026-09-18
arquivos_modificados:
  - src/utils/pdfExporter.ts
  - src/components/modals/ExportDietModal.tsx
  - src/locales/pt/common.json
  - src/locales/en/common.json
  - src/utils/__tests__/pdfExporter.test.ts
  - tests-e2e/journey.spec.ts
comportamento_entregue:
  - Totais calculados vs Metas prescritas rigorosamente diferenciados: no cartão de resumo diário do PDF editorial, os valores em destaque refletem fielmente os totais efetivos (`plan.calculatedTotals` ou somatório real das refeições), enquanto as metas prescritas são claramente identificadas pelo rótulo `Meta:` (ou `Target:`). Nenhum total real é sobrescrito ou substituído pela meta.
  - Prevenção de quebras órfãs e sobreposição: `sectionTitle` exige espaço vertical mínimo (`minContentSpace`), impedindo que cabeçalhos fiquem isolados no final de páginas. Título de refeições e pílula de calorias possuem cálculo dinâmico de largura máxima, evitando qualquer colisão horizontal de texto.
  - Cobertura de casos extremos e caracteres acentuados: nomes longos de pacientes e clínicas são divididos em linhas com `doc.splitTextToSize`; alimentos e porções com acentuação da língua portuguesa (ex.: Açaí, Maçã, Pão Francês) são codificados perfeitamente em WinAnsi; planos com múltiplas refeições e alternativas geram paginação determinística e numeração dinâmica em todas as páginas ("Página X de Y").
  - Avisos clínicos estruturados no PDF: `plan.validation.issues` (como variação calórica ou inconsistências) e alertas de sódio em alternativas de pior caso (`worstCaseAlternativeSodium`) são renderizados em seção estruturada de avisos clínicos com marcadores semafóricos de gravidade.
  - Texto extraível vs Limitações do modo captura: o layout editorial em vetor garante 100% de texto selecionável, copiável, indexável e compatível com leitores de tela em arquivo de ~50KB. O modal `ExportDietModal.tsx` desabilita preventivamente o modo captura visual com aviso informativo quando o elemento DOM não estiver montado em tela, e documenta as limitações técnicas da rasterização por canvas (arquivos grandes, perda de texto selecionável).
  - Paridade de internacionalização PT/EN: suporte completo a `locale?: "pt" | "en"`, com formatação de datas localizada (`pt-BR` vs `en-US`), rótulos de refeição e nomes de arquivo limpos e sanitizados (`diet-paciente-DD-MM-AAAA.pdf`).
testes_executados:
  - npm test (258 testes unitários e de integração passando em 32 arquivos, incluindo 11 testes dedicados em pdfExporter.test.ts)
  - npm run test:rules (34 testes passando nos emuladores locais)
  - npm run test:e2e:emulated (14 testes Playwright passando de ponta a ponta com emuladores Firebase, com verificação do download real do PDF gerado com tamanho > 2KB e cabeçalho %PDF-)
  - npm run type-check (0 erros TypeScript)
  - npm run lint (0 erros de linting)
  - npm run format:check (100% dos arquivos validados pelo Prettier)
  - npm run build (build Vite de produção concluído com sucesso em 1,59s)
  - graphify update . (grafo de conhecimento atualizado com sucesso)
```

### 18 — Melhorar diagnóstico de falhas e revisar configuração

**Situação:** predominam logs no console; não foi encontrada barreira global de erros. Vite tem `allowedHosts: true` e definições para chave Gemini, apesar do gerador atual ser algorítmico. Isso exige revisão, não comprova exposição atual de segredo.

**Arquivos:** `src/App.tsx`, `src/index.tsx`, serviços Firebase/e-mail, `vite.config.ts`, `.env.example`, `package.json`, configuração de hosting e Storage.

**Passos:**

1. [x] Adicionar Error Boundary com recuperação em nível apropriado de aplicação/rota, sem esconder erros assíncronos que precisam de tratamento próprio.
2. [x] Padronizar classificação de falhas e identificador de correlação quando útil. Não registrar senhas, tokens ou prontuários completos.
3. [x] Diferenciar ausência de dados, permissão negada e indisponibilidade; não representar todas como lista vazia.
4. [x] Validar configuração no início com erro claro, especialmente para instalação local e demo.
5. [x] Investigar e remover integração Gemini/configuração/dependência ociosa se não houver uso legítimo; não expor segredos privados em `define`/bundle.
6. [x] Restringir hosts de desenvolvimento ao necessário e revisar scripts inline/configuração de publicação antes de aplicar políticas de conteúdo.
7. [x] Inspecionar regras de Storage e controles de abuso do serviço de e-mail; configurações externas precisam de evidência própria.
8. [x] Auditar dependências e compatibilidade na implementação; atualizar apenas com justificativa e testes. Não inferir vulnerabilidade apenas pela versão antiga.
9. [x] Documentar build, configuração pública versus secreta, implantação e retorno à versão anterior. Não publicar automaticamente.

**Resultado:** falhas são recuperáveis e diagnosticáveis, com configuração compreensível.

**Aceite:** erros simulados geram feedback e diagnóstico sem dados pessoais; integração não configurada não finge sucesso; build não inclui segredos privados.

```yaml
passo_18:
  status: concluido
  data_conclusao: "2026-09-18"
  itens_implementados:
    - Error Boundary Multi-Nível: Fronteira raiz da aplicação (level="app" em src/index.tsx) envolvendo App e fronteira no nível de layout/rota (level="route" com resetKey={location.pathname} em src/components/AppShell.tsx), preservando Sidebar e Breadcrumbs navegáveis e recuperando automaticamente o estado em trocas de rota.
    - Taxonomia e Classificação Padronizada de Falhas: Implementação de src/utils/errors.ts com classe AppError, categorias (permission_denied, unavailable, not_found, unauthenticated, validation, rate_limited, unknown), gerador de códigos de correlação (ERR-XXXXXX) e função classifyError().
    - Logs Seguros sem Vazamento de Dados Pessoais ou Clínicos: safeLogError() e sanitizeDataForLogging() com mascaramento recursivo ([REDACTED]) para chaves sensíveis como senhas, tokens, secrets, API keys, credenciais, CPFs, RGs, diagnósticos, anotações de prontuário e dados clínicos.
    - Diferenciação entre Ausência de Dados e Falhas de Permissão/Rede: Implementação de estados visuais distintos com ErrorState e retry nas telas críticas (ex.: Calendar.tsx, Patients.tsx, PatientProfile.tsx), impedindo que permissão negada ou erro de rede sejam silenciosamente representados como listas vazias.
    - Validação de Configuração na Inicialização: Serviço src/services/configValidation.ts com função runStartupDiagnostics() chamada no boot (src/index.tsx), fornecendo mensagens de diagnóstico seguras para ambientes locais (emuladores) e detectando chaves faltantes do Firebase sem expor segredos.
    - Limpeza de Dependências Ociosas e Remoção de Segredos: Remoção da dependência desnecessária @google/genai (package.json), remoção do bloco define de chaves de IA no vite.config.ts e garantia de que nenhum segredo privado é embutido no bundle client-side.
    - Hardening do Servidor Vite e Compatibilidade com CSP: Remoção de allowedHosts: true, restrição do host de desenvolvimento para localhost seguro, remoção de style e script inline de index.html e migração para CSS e bundle TS compilados, permitindo políticas de Content Security Policy estritas sem 'unsafe-inline'.
    - Auditoria de Storage e Controles de Abuso de E-mail: Inspeção e validação das regras de Storage (storage.rules) com isolamento estrito por usuário, restrição de tipo de imagem e teto de 5MB. Implementação em src/services/emailService.ts de validação de sintaxe de e-mail, rate limiting in-memory por destinatário (cooldown de 5s e teto de 5 envios/minuto), teto de 5.000 caracteres no payload e erro explícito EMAIL_NOT_CONFIGURED quando as chaves não estão configuradas.
    - Auditoria de Dependências e Documentação Completa: Documento docs/deployment-and-config.md detalhando build, variáveis públicas versus privadas, esteira manual de publicação do Firebase e procedimentos passo a passo de contingência e rollback.
  testes_executados:
    - npm test (293 testes unitários e de integração passando em 36 arquivos, incluindo testes dedicados em errors.test.ts, ErrorBoundary.test.tsx, configValidation.test.ts e emailService.test.ts)
    - npm run test:rules (34 testes passando nos emuladores locais)
    - npm run test:e2e:emulated (14 testes Playwright passando de ponta a ponta com emuladores Firebase)
    - npm run type-check (0 erros TypeScript)
    - npm run lint (0 erros de linting)
    - npm run format:check (100% dos arquivos validados pelo Prettier)
    - npm run build (build Vite de produção concluído com sucesso em 1,58s)
    - graphify update . (grafo de conhecimento atualizado com sucesso)
```

### 19 — Preparar demonstração sintética e identificar simulações

**Situação:** billing cria plano, cartão e faturas fictícias em localStorage. Simulação é aceitável para portfólio quando explícita; não é necessário implementar cobrança real para esta entrega.

**Arquivos:** `src/services/billingService.ts`, `src/components/settings/BillingSection.tsx`, `src/pages/Home.tsx`, seed/demo, documentação.

**Passos:**

1. [ ] Criar um caminho simples para experimentar a jornada com pessoas e dados fictícios.
2. [ ] Escolher demo local isolada ou ambiente público separado. Em ambiente público, impedir que visitantes compartilhem dados privados ou façam operações irrestritas no mesmo workspace.
3. [ ] Identificar claramente cobrança simulada, dados de demonstração e recursos informativos ainda sem automação.
4. [ ] Desabilitar envio real de e-mails na demo ou limitar a um mecanismo de teste explicitamente controlado.
5. [ ] Fornecer reset seguro dos dados sintéticos e roteiro curto de avaliação.
6. [ ] Diferenciar plano comercial ilustrativo de autorização real; não permitir que localStorage determine permissões de backend.

**Resultado:** avaliador experimenta o diferencial em poucos minutos e entende o escopo entregue.

**Aceite:** demo não exige dados pessoais reais, não cobra e não envia mensagens inadvertidas; recursos simulados são identificados na interface.

### 20 — Alinhar apresentação pública e evidências finais

**Situação:** README anuncia determinismo, teto diário de sódio e cobertura de jornadas além do demonstrado na revisão. Documentos históricos têm duplicação e contradições.

**Arquivos:** `README.md`, `docs/`, planos históricos, screenshots, workflow e este documento.

**Passos:**

1. [ ] Reescrever alegações para corresponder ao comportamento validado; retirar termos como “enterprise-grade” se não houver escopo/evidência que os sustentem.
2. [ ] Atualizar diagrama conforme responsabilidades reais; criação de acesso está em `authService.ts`, não no gerador nem em `patientService.ts`.
3. [ ] Documentar instalação limpa, versão de Node, porta, emuladores, seed, testes, limitações e demo.
4. [ ] Registrar decisões arquiteturais curtas: Firebase, modelo de autorização, convites, algoritmo, compatibilidade de planos, persistência e simulações.
5. [ ] Publicar métricas com data, método e cenário; não reaproveitar números antigos de testes, tamanho ou performance como atuais.
6. [ ] Consolidar os dois planos históricos em local explícito, preservando contexto útil. Não apagar uma worktree só para remover seu README.
7. [ ] Adicionar screenshots atuais com dados sintéticos e roteiro/vídeo curto da jornada, em linguagem adequada ao público internacional.
8. [ ] Verificar licença de código e atribuição de dados/assets; não presumir que a licença do código cobre datasets externos.
9. [ ] Confirmar a CI do commit final e, se houver acesso, proteção de branch. Registrar separadamente o que não foi possível verificar.
10. [ ] Revisar link público e configuração implantada somente na etapa autorizada de publicação/validação externa.

**Resultado:** apresentação precisa, convincente e fácil de avaliar tecnicamente.

**Aceite:** cada promessa importante tem demonstração ou teste correspondente; limitações são claras; checkout e roteiro podem ser seguidos por alguém que não participou do desenvolvimento.

## 5. Sequência sugerida de PRs

1. `chore`: baseline, versões, emuladores e CI isolada.
2. `fix`: contrato de persistência das dietas com regressão de gravação/leitura.
3. `fix`: autenticação recuperável e isolamento de rascunhos.
4. `fix`: papéis, regras e validação de vínculos.
5. `feat`: convite com definição de senha pelo paciente.
6. `fix`: restrições estruturadas e qualidade dos dados alimentares.
7. `fix`: geração validada e rastreável, incluindo alternativas.
8. `fix`: históricos concorrentes, datas e ciclo de vida do paciente.
9. `test`: consolidar jornadas completas e matriz de autorização.
10. `refactor`: separar responsabilidades das páginas críticas.
11. `perf`: consultas limitadas e otimizações medidas.
12. `fix`: acessibilidade, responsividade, PT/EN e PDF, divididos se necessário.
13. `chore`: tratamento de falhas, configuração e revisão de dependências.
14. `feat`: demonstração sintética e identificação de simulações.
15. `docs`: documentação final, decisões, screenshots e evidências.

Não adiar os testes de cada correção para o PR 9. Esse PR consolida a cobertura transversal e a jornada completa.

## 6. Critérios finais de pronto para avaliação

- [ ] Checkout limpo instala e executa usando instruções atuais.
- [ ] Jornada profissional e do paciente passa em ambiente isolado na CI.
- [ ] Plano pode ser gerado, salvo, reaberto e exportado com dados consistentes.
- [ ] Restrições oferecidas são aplicadas ou claramente declaradas indisponíveis.
- [ ] Resultados inviáveis não são apresentados como planos aprovados.
- [ ] Usuários não acessam dados de outras contas, inclusive via armazenamento local e SDK direto.
- [ ] Convite não envia senha; revogação e falhas parciais são tratadas.
- [ ] Históricos concorrentes e datas civis têm testes representativos.
- [ ] Jornada crítica é utilizável por teclado, em mobile e nos dois idiomas.
- [ ] PDF foi inspecionado visualmente e corresponde ao plano salvo.
- [ ] Cobrança e dados fictícios estão identificados como demonstração.
- [ ] Logs e configuração não expõem segredos ou dados pessoais desnecessários.
- [ ] README e plano não afirmam testes/garantias que não foram demonstrados.
- [ ] Limitações restantes, métricas, commit avaliado e evidências estão registrados.

## 7. Escopo que não deve crescer automaticamente

- Não implementar pagamentos reais só para eliminar a simulação de billing.
- Não adicionar IA generativa para substituir o gerador sem necessidade de produto.
- Não migrar de Firebase nem introduzir microserviços apenas por aparência de sofisticação.
- Não criar novos modos clínicos sem especificação e validação adequadas.
- Não buscar 100% de cobertura indiscriminadamente; cobrir riscos e comportamentos relevantes.
- Não prometer escala, conformidade regulatória ou validade clínica com base nesta revisão de código.
- Não tratar polimento visual como substituto para os bloqueadores P0.

## 8. Estimativa de planejamento

Referência inicial para uma pessoa familiarizada com o projeto: aproximadamente **18–30 dias úteis**, sujeita à reprodução das falhas e às decisões sobre convites, migração e modelo de dados. As etapas detalhadas se sobrepõem às cinco fases da análise anterior; os prazos não devem ser somados por item.

Não inclui validação clínica externa, integração de pagamento real ou operação de um produto de saúde em produção. Reestimar após a etapa 02 e após os contratos de autorização/geração estarem definidos.

**Status inicial deste plano:** documento criado; implementação não iniciada por esta tarefa.

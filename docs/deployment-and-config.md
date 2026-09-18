# Guia de Configuração, Diagnóstico, Implantação e Rollback

Este documento consolida as diretrizes de configuração pública versus privada, segurança do ambiente de execução, auditoria de dependências, diagnóstico estruturado de falhas, esteira de implantação manual e procedimentos de contingência/rollback do **Storm Nutrition (Isanutri)**.

---

## 1. Arquitetura de Configuração e Separação de Segredos

O Storm Nutrition é uma Single Page Application (SPA) construída com React 18, TypeScript e Vite, integrando-se diretamente aos serviços Firebase (Authentication, Firestore, Storage) e ao serviço transacional EmailJS.

### 1.1 Variáveis de Ambiente Públicas (Client-Side)

Todas as variáveis com prefixo `VITE_` são embutidas em tempo de compilação pelo Vite no bundle estático distribuído aos navegadores dos usuários. Elas identificam o projeto, mas **nunca devem conter segredos de infraestrutura ou privilégios administrativos**.

| Variável | Finalidade | Escopo | Obrigatória em Produção? |
| :--- | :--- | :--- | :--- |
| `VITE_FIREBASE_API_KEY` | Chave pública do app Firebase Web | Cliente | Sim |
| `VITE_FIREBASE_AUTH_DOMAIN` | Domínio de autenticação OAuth | Cliente | Sim |
| `VITE_FIREBASE_PROJECT_ID` | Identificador do projeto Firebase | Cliente | Sim |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket de armazenamento de imagens | Cliente | Sim |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ID do remetente FCM | Cliente | Sim |
| `VITE_FIREBASE_APP_ID` | Identificador do aplicativo Web | Cliente | Sim |
| `VITE_USE_FIREBASE_EMULATOR` | Flag `"true"` para ambiente local/CI | Dev/CI | Não (Opcional) |
| `VITE_FIREBASE_AUTH_EMULATOR_HOST` | Host do emulador Auth (`127.0.0.1:9099`) | Dev/CI | Não (Opcional) |
| `VITE_FIREBASE_FIRESTORE_EMULATOR_HOST` | Host do emulador Firestore (`127.0.0.1`) | Dev/CI | Não (Opcional) |
| `VITE_FIREBASE_FIRESTORE_EMULATOR_PORT` | Porta do emulador Firestore (`8080`) | Dev/CI | Não (Opcional) |
| `VITE_EMAILJS_SERVICE_ID` | ID do serviço no EmailJS | Cliente | Não (Opcional - mock explícito quando ausente) |
| `VITE_EMAILJS_TEMPLATE_ID` | ID do modelo transacional | Cliente | Não (Opcional) |
| `VITE_EMAILJS_PUBLIC_KEY` | Chave pública da conta EmailJS | Cliente | Não (Opcional) |

### 1.2 Segredos e Credenciais que NUNCA devem estar no Frontend

- **Proibição Absoluta:** Chaves de conta de serviço Firebase (`serviceAccountKey.json`), tokens de acesso de superusuário (`FIREBASE_TOKEN`), chaves secretas de provedores de pagamento ou chaves privadas de API.
- **Revisão e Limpeza Realizadas:**
  - A dependência ociosa `@google/genai` foi **completamente removida** do projeto (`package.json`), pois o gerador de dietas é 100% algorítmico, determinístico e auditável (`src/services/dietAlgorithmService.ts`).
  - O bloco `define` do `vite.config.ts` (que definia `GEMINI_API_KEY`) foi **removido**, eliminando qualquer risco de vazamento de segredos privados no bundle final.
  - O servidor de desenvolvimento foi restrito de `allowedHosts: true` com `0.0.0.0` para o host local seguro `127.0.0.1:5000`, neutralizando vulnerabilidades de DNS rebinding em redes locais.

---

## 2. Hardening e Compatibilidade com Content Security Policy (CSP)

1. **Eliminação de Scripts e Estilos Inline em `index.html`:**
   - O `<style>` inline foi migrado para `src/index.css` com regras para exportação e impressão (`@media print`).
   - O script inline que manipulava classes de tema no elemento raiz foi removido do `index.html` e integrado com segurança ao ponto de entrada TypeScript `src/index.tsx`.
   - Essa estrutura permite a aplicação de políticas rigorosas de Content Security Policy (CSP) sem a exigência de diretivas permissivas como `'unsafe-inline'`.

2. **Políticas de Armazenamento e Regras de Segurança (`storage.rules`):**
   - O upload no Storage é restrito a `profilePictures/{userId}/{fileName}`.
   - Leitura: restrita a usuários autenticados.
   - Escrita: restrita ao próprio titular do registro (`request.auth.uid == userId`).
   - Validação técnica estrita: tamanho de arquivo estritamente menor que 5MB (`request.resource.size < 5 * 1024 * 1024`) e tipo de mídia limitado a imagens (`image/(jpeg|png|webp|gif)`).
   - Negação padrão (`default deny`) para quaisquer outros caminhos do bucket.

3. **Controles de Abuso do Serviço de E-mail (`src/services/emailService.ts`):**
   - **Validação de Sintaxe:** Validação estrita do formato de e-mail do destinatário via regex (`EMAIL_REGEX`). Endereços inválidos disparam erro imediato `EMAIL_INVALID_RECIPIENT` sem consumir chamadas à API.
   - **Throttling e Rate Limiting:** Cooldown mínimo de 5 segundos entre envios sucessivos para o mesmo destinatário e teto máximo de 5 envios por janela móvel de 1 minuto por destinatário (`EMAIL_RATE_LIMITED`).
   - **Proteção de Payload:** Teto de 5.000 caracteres no corpo da mensagem (`EMAIL_PAYLOAD_TOO_LARGE`).
   - **Tratamento de Indisponibilidade:** Quando as chaves do EmailJS não estão configuradas, o sistema lança `EMAIL_NOT_CONFIGURED`, permitindo que a interface apresente estado de orientação clara ao nutricionista em vez de fingir sucesso silencioso.

---

## 3. Diagnóstico de Falhas e Tratamento de Erros

O projeto conta com taxonomia padronizada de falhas, identificadores de correlação únicos e fronteiras de recuperação em múltiplos níveis.

### 3.1 Taxonomia de Falhas (`src/utils/errors.ts`)

| Categoria | Descrição | Exemplos |
| :--- | :--- | :--- |
| `permission_denied` | Falha de autorização pelas regras de segurança | `permission-denied`, `auth/unauthorized` |
| `unauthenticated` | Usuário deslogado ou token expirado | `auth/user-token-expired`, `auth/requires-recent-login` |
| `unavailable` | Falha de rede ou serviço inacessível | `unavailable`, `network-request-failed` |
| `not_found` | Recurso solicitado inexistente | `not-found`, `document-not-found` |
| `validation` | Dados de entrada corrompidos ou inválidos | Erros de esquema Zod, e-mail inválido |
| `rate_limited` | Excesso de requisições ou bloqueio por abuso | `resource-exhausted`, `EMAIL_RATE_LIMITED` |
| `unknown` | Erros não mapeados ou inesperados | Erros de runtime JavaScript |

### 3.2 Identificadores de Correlação e Privacidade nos Logs

- Falhas capturadas geram identificadores no formato `ERR-XXXXXX` (ex.: `ERR-A4F92B`).
- A função `safeLogError()` sanitiza recursivamente todos os objetos e metadados antes de registrá-los no console, redigindo campos sensíveis como `password`, `token`, `secret`, `apiKey`, `cpf`, `rg` e dados de prontuário/condição médica.

### 3.3 Fronteiras de Erro Multi-Nível (`src/components/ErrorBoundary.tsx`)

- **Nível da Aplicação (`level="app"` em `src/index.tsx`):**
  - Envolve o componente raiz `<App />`.
  - Captura exceções críticas de renderização em nível de aplicação, exibindo tela de contingência com código de correlação e botão de recarregar a página.
- **Nível da Rota (`level="route"` em `src/components/AppShell.tsx`):**
  - Envolve o contêiner principal de conteúdo (`<main id="main-content">`).
  - Preserva a barra lateral (Sidebar) e os breadcrumbs intactos e navegáveis.
  - Inclui a propriedade `resetKey={location.pathname}`: ao navegar para outra página, o erro da rota anterior é automaticamente redefinido.

---

## 4. Auditoria de Dependências

O projeto utiliza dependências fixadas no `package-lock.json` com versões auditadas:
- O ecossistema React 18 e Vite 6 mantém compatibilidade estrita com TypeScript 5.6.
- A ferramenta `firebase-tools` local é mantida na versão estável compatível com os emuladores Java do ambiente.
- **Diretriz de Manutenção:** Não executar `npm audit fix --force`, pois comandos forçados podem causar retrocesso de versões essenciais ou quebrar integrações dos emuladores.

---

## 5. Procedimento de Implantação (Deployment)

A implantação em produção é estritamente manual e controlada, exigindo validação prévia de todos os testes automatizados e builds. **Não há publicação automática sem aprovação humana.**

### 5.1 Checklist Pré-Implantação

Antes de qualquer deploy, execute a suíte completa de verificação no terminal:

```bash
# 1. Testes unitários e de integração
npm test

# 2. Testes de regras de segurança do Firestore
npm run test:rules

# 3. Testes ponta a ponta (Playwright com emuladores)
npm run test:e2e:emulated

# 4. Verificação de tipos TypeScript
npm run type-check

# 5. Análise estática e linting
npm run lint

# 6. Conformidade de formatação Prettier
npm run format:check

# 7. Compilação de produção
npm run build
```

Todos os 7 comandos devem passar com código de saída 0.

### 5.2 Comandos de Deploy Manual

#### A. Implantação de Regras e Índices (Backend Firebase)

```bash
# Deploy das regras de segurança do Firestore
npx firebase deploy --only firestore:rules

# Deploy dos índices compostos do Firestore
npx firebase deploy --only firestore:indexes

# Deploy das regras de segurança do Storage
npx firebase deploy --only storage
```

#### B. Implantação do Frontend Estático (Hosting)

```bash
# Gera o build final de produção
npm run build

# Publica o conteúdo compilado no Firebase Hosting
npx firebase deploy --only hosting
```

---

## 6. Procedimento de Contingência e Rollback

Caso uma versão com problemas seja implantada em produção, siga imediatamente os procedimentos abaixo para restabelecer a estabilidade do serviço.

### 6.1 Rollback Imediato do Frontend (Firebase Hosting)

O Firebase Hosting mantém histórico versionado de todos os releases anteriores:

1. **Via Firebase Console:**
   - Acesse: `https://console.firebase.google.com/project/SEU-PROJETO-ID/hosting/sites`
   - Na lista "Histórico de versões", localize a última versão estável anterior.
   - Clique no menu de três pontos ao lado da versão e selecione **"Reverter" (Rollback)**.
   - O tráfego será redirecionado para a versão anterior em segundos sem necessidade de novo build.

2. **Via Firebase CLI (Canal de Implantação):**
   ```bash
   # Reverte o canal live para a versão de um canal ou tag estável anterior
   npx firebase hosting:clone SEU-PROJETO:release-anterior SEU-PROJETO:live
   ```

### 6.2 Rollback de Regras de Segurança e Índices

Caso uma alteração em `firestore.rules`, `storage.rules` ou `firestore.indexes.json` tenha causado regressão de acesso:

1. Identifique o commit Git correspondente à versão estável anterior:
   ```bash
   git log -n 5 --oneline
   ```
2. Restaure os arquivos de regras daquele commit:
   ```bash
   git checkout <commit-sha-estavel> -- firestore.rules storage.rules firestore.indexes.json
   ```
3. Reimplante imediatamente as regras estáveis:
   ```bash
   npx firebase deploy --only firestore:rules,storage
   ```
4. Verifique a recuperação de permissões com `npm run test:rules`.

# Matriz de Baseline e Evidências — Storm Nutrition

**Data de Medição:** 17/09/2026  
**Commit de Referência:** `b7491a3ff7a9948ddb7dc4f9d8c1bdc05abec45b`  
**Documento Ativo:** `o-que-precisa-ser-feito.md`  
**Documentos Históricos:** `docs/temp-analisetech-lead.md` (cópia raiz redundante removida)

---

## 1. Ambiente e Ferramentas Medidas

| Ferramenta | Versão Local | Versão CI / Trava | Observações |
|---|---|---|---|
| **Node.js** | `v22.22.3` | `node-version: 20` | README menciona Node 18+; CI e local rodam 20/22 |
| **npm** | `10.9.8` | Travado via `package-lock.json` | `package-lock.json` atualizado |
| **Git** | `2.50.1` | - | Apple Git |
| **TypeScript** | `5.8.3` | `~5.8.2` | Compilação com `tsc --noEmit` passa com 0 erros |
| **Vitest** | `4.1.8` | `^4.1.8` | 7 suítes, 53 testes passando |
| **ESLint** | `9.39.4` | `^9.25.0` | 0 erros, 4 avisos de fast-refresh/deps |
| **Prettier** | `3.8.3` | `^3.8.3` | **5 arquivos** pendentes de formatação (não 58 como na nota antiga) |
| **Porta Local** | `5000` | `5000` | Configurada em `vite.config.ts` (L11) e `README.md` (L161) |

---

## 2. Verificação da Nota Histórica do Prettier

* **Afirmação antiga:** "58 arquivos com falha de formatação".
* **Medição real atual (`npx prettier --check`):** Apenas **5 arquivos** apresentam divergência de formatação:
  1. `src/components/icons.tsx`
  2. `src/components/modals/PatientAccessModal.tsx`
  3. `src/pages/PatientPortal.tsx`
  4. `src/pages/PatientProfile.tsx`
  5. `src/pages/Settings.tsx`
* **Diretriz:** A formatação desses 5 arquivos deve ser tratada em commit isolado (Etapa 02), evitando misturar alterações de estilo com lógica.

---

## 3. Matriz de Achados vs. Evidências no Código

| Item | Descrição do Problema | Arquivo | Linha / Evidência Concreta | Status |
|---|---|---|---|---|
| **#03** | `clinicalWarnings: undefined` quebra `set`/`addDoc` no Firestore | `src/services/dietAlgorithmService.ts`<br>`src/services/dietService.ts` | L427: `return warnings.length > 0 ? warnings : undefined;`<br>L435: `clinicalWarnings: getWarnings(...)`<br>`firebaseCore.ts`: `db` sem `ignoreUndefinedProperties` | **Confirmado (P0)** |
| **#04** | Falha em `onAuthStateChanged` prende tela em loading e promove a nutricionista por padrão | `src/contexts/AuthContext.tsx` | L37: `getPatientPortalProfile` sem `try/catch`.<br>L42: `else { setUserRole("nutritionist") }` | **Confirmado (P0)** |
| **#05** | Vazamento de dados em `localStorage` global sem UID e sem limpeza no logout | `src/services/authService.ts`<br>`src/pages/Settings.tsx`<br>`src/services/billingService.ts`<br>`src/pages/FoodDatabase.tsx` | `authService.ts` L21: `signOut` não limpa `localStorage`.<br>Chaves globais: `clinicName`, `clinicPhone`, `billing_subscription`, `custom_foods`, etc. | **Confirmado (P0)** |
| **#06** | `isNutritionist` confere apenas se `auth.uid == userId`, não papel | `firestore.rules` | L11: `request.auth.uid == userId`<br>L42–50: `patientWriteIsSelfServiceOnly` permite sobrescrita de arrays inteiros | **Confirmado (P0)** |
| **#07** | Senha do paciente gerada com `Math.random` e enviada em texto puro por e-mail | `src/components/modals/PatientAccessModal.tsx` | L41: `Math.random().toString(36).slice(-8) + "A1!"`<br>L85: `passwordText: password` | **Confirmado (P0)** |
| **#08** | `gluten_free` ignorado no gerador; micronutrientes inventados por categoria | `src/services/dietAlgorithmService.ts` | `gluten` só aparece em comentário JSDoc (L21).<br>L380: `food.category === "Carnes" ? 2.5 : 0.5` | **Confirmado (P0)** |
| **#10** | Históricos usam leitura seguida de sobrescrita; risco de conflito concorrente | `src/services/evaluationService.ts`<br>`src/services/appointmentService.ts` | Operações `updateDoc` sobre arrays sem transação atômica | **Confirmado (P1)** |
| **#11** | `deletePatient` não apaga `patientProfiles` nem agendamentos | `src/services/patientService.ts` | L57: remove apenas dietas e paciente. `patientProfiles` e `appointments` continuam órfãos | **Confirmado (P1)** |
| **#16** | Conflito de idioma padrão e mensagens de erro fixas | `src/i18n.ts`<br>`index.html`<br>`src/pages/Register.tsx` | `i18n.ts`: `fallbackLng: "en"`, mas `index.html` declara `pt-BR`. `Register.tsx` tem fallbacks fixos em PT. | **Confirmado (P1)** |
| **#18** | Configurações de risco/legadas no Vite | `vite.config.ts` | L13: `allowedHosts: true`<br>L17: `cssMinify: false`<br>L20–21: define `GEMINI_API_KEY` sem uso ativo | **Confirmado (P1)** |
| **#19** | Faturamento e planos simulados em `localStorage` | `src/services/billingService.ts` | L1–10: documentado explicitamente como simulação sem backend de cobrança | **Confirmado e Aceito para Demo (P2)** |

---

## 4. Estado da Integração Contínua (CI)

* **Workflow ativo:** `.github/workflows/ci.yml` contém dois jobs:
  1. `validate` (`Build and Test`): Executa no Node 20: Checkout, Prettier check, ESLint, TypeScript check, Build de produção, Vitest com cobertura e Playwright E2E.
  2. `firestore-rules`: Executa no Node 20 com Java 17: Emulador Firestore e `npm run test:rules`.

  > **Atualização (19/09/2026, R01):** o texto acima descreve a CI na época da linha de base. Hoje os jobs usam `node-version-file: .nvmrc` (Node 22.22.2) e Java 21, porque o lockfile tem dependências de desenvolvimento do Firebase CLI que exigem Node 22+. Veja `docs/evidencias-revisao-10.md` (R01).
* **Ressalva de proteção:** A existência do arquivo `.github/workflows/ci.yml` garante a execução do workflow, mas a **obrigatoriedade de aprovação antes do merge (Branch Protection)** é configurada nas preferências do repositório no GitHub (`Settings → Branches → Require status checks to pass before merging`).

---

## 5. Medição e Evidências Pós-Correções (18/09/2026 — Passos C01 a C11)

Esta seção documenta a resolução empírica de cada achado do baseline após a execução dos passos C01 a C11 do plano diretor.

### 5.1 Resolução dos Achados do Baseline

| Item | Descrição Original | Passo de Resolução | Evidência / Teste Automatizado Concreto | Status Atual |
|---|---|---|---|---|
| **#03** | `clinicalWarnings: undefined` no Firestore | Passo C02 / C06 | `sanitizeForFirestore` + `dietPersistence.integration.test.ts` (5 testes) e `dietService.test.ts` (19 testes) | **Resolvido** |
| **#04** | Falha em `onAuthStateChanged` e promoção indevida | Passo C01 / C09 | `AuthContext.test.tsx` (12 testes), `startupErrorScreen.ts` e bloqueio de promoção indevida | **Resolvido** |
| **#05** | Vazamento em `localStorage` global | Passo C05 | `localStorage.test.ts` (10 testes): chaves isoladas por UID (`isanutri:<uid>:*`), quota defensiva e limpeza no logout | **Resolvido** |
| **#06** | `firestore.rules` sem matriz de autorização estrita | Passo C01 / C07 | `tests-rules/firestore.rules.test.ts` (67 testes): matriz RBAC, isolamento multi-tenant e guarda adversarial | **Resolvido** |
| **#07** | Senha temporária em texto puro por e-mail | Passo C03 | `invitationService.test.ts` (19 testes): convites com token criptográfico e definição de senha privada pelo paciente | **Resolvido** |
| **#08** | Restrições ignoradas no gerador de dietas | Passo C02 / C06 | `dietAlgorithmService.test.ts` (33 testes): filtragem determinística de glúten, lactose, alérgenos e micronutrientes TACO | **Resolvido** |
| **#10** | Conflito concorrente em históricos clínicos | Passo C07 / C09 | Transações atômicas e regras de segurança contra race conditions em `firestore.rules.test.ts` | **Resolvido** |
| **#11** | `deletePatient` não limpava dependências | Passo C07 | Exclusão em cascata coordenada e guarda `deletionPending` em `patientLifecycle.test.ts` (15 testes) | **Resolvido** |
| **#16** | Conflito de idioma e mensagens fixas em PT | Passo C11 | `i18nParity.test.ts` (11 testes), `AcceptInvitation.i18n.test.tsx` (7 testes), `DietPlanViewer.i18n.test.tsx` | **Resolvido** |
| **#18** | Configurações de risco no Vite (`GEMINI_API_KEY`) | Passo C04 / C08 | Remoção de `@google/genai`, eliminação do bloco `define` em `vite.config.ts` e host restrito a `127.0.0.1:5000` | **Resolvido** |
| **#19** | Faturamento em `localStorage` | Passo C08 | `billingService.test.ts` (4 testes): escopo por UID, aviso explícito de portfólio e desacoplamento do Firestore | **Resolvido (Simulação Delimitada)** |

### 5.2 Medições Consolidadas da Suíte de Testes (18/09/2026)

| Suíte / Verificação | Comando Exato | Escopo / Cenário | Resultado Obtido |
|---|---|---|---|
| **Testes Unitários & Integração** | `npm test` | 42 arquivos de teste cobrindo domínios, serviços, contextos, isolamento de transporte e sanitização | **361 passed** (0 falhas) |
| **Regras do Firestore** | `npm run test:rules` | 2 arquivos (`firestore.rules.test.ts` e `dietPersistence.integration.test.ts`) em emulador local | **72 passed** (0 falhas) |
| **E2E & Acessibilidade** | `npm run test:e2e:emulated` | Playwright Chromium (seed com 4 contas sintéticas, auditoria axe-core, reflow a 320px, fluxo de convite e portal) | **17 passed** (58.5s) |
| **Tipagem TypeScript** | `npm run type-check` | `tsc --noEmit` em modo estrito | **0 erros** |
| **Linter & Formatação** | `npm run lint` / `npm run format:check` | ESLint e Prettier sobre todo o código-fonte | **0 erros** |
| **Build de Produção** | `npm run build` | Compilação estática com Vite 6 e Rollup | **1.52s** |

### 5.3 Separação de Garantias e Ambientes

Para evitar ambiguidades entre testes locais e garantias em nuvem:

1. **Testes Locais (Emuladores):** Comprovam que a lógica de negócio, regras do Firestore e interfaces funcionam conforme especificado no ambiente emulado. Não garantem que a nuvem de produção possui as regras aplicadas.
2. **Integração Contínua (GitHub Actions):** Executa o pipeline automatizado a cada push/PR. O status verde atesta conformidade do código, mas não substitui a governança de branches.
3. **Proteção de Branch (GitHub):** Deve ser ativada manualmente nas configurações do repositório para impedir `git push --force` ou commits diretos na `main` sem aprovação de PR.
4. **Implantação em Produção:** Exige execução deliberada de `npx firebase deploy --only firestore:rules,firestore:indexes,hosting` com credenciais administrativas.
5. **Auditoria de Acessibilidade:** A suíte automatizada cobre regras axe-core e reflow a 320px; testes assistivos completos com usuários reais permanecem como recomendação complementar de usabilidade.

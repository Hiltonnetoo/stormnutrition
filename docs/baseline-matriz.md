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
* **Ressalva de proteção:** A existência do arquivo `.github/workflows/ci.yml` garante a execução do workflow, mas a **obrigatoriedade de aprovação antes do merge (Branch Protection)** é configurada nas preferências do repositório no GitHub (`Settings → Branches → Require status checks to pass before merging`).

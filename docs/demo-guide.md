# Guia de Demonstração Sintética e Identificação de Simulações

Este documento orienta avaliadores, recrutadores e desenvolvedores na experimentação da jornada clínica completa do **Storm Nutrition**, detalhando as personas sintéticas, o roteiro de avaliação rápida (3-5 minutos), as proteções de isolamento de dados e as simulações locais do produto.

---

## 1. Personas e Credenciais Sintéticas

Todas as contas de demonstração utilizam a senha padrão **`Password123!`** e podem ser preenchidas com **1 clique** diretamente na tela de [Login](/login) ou [Portal do Paciente](/paciente).

| Persona | E-mail | Perfil / Papel | Objetivo na Demonstração |
| :--- | :--- | :--- | :--- |
| **Dra. Clara Mendes** | `dra.clara@demo.stormnutrition.com` | Nutricionista Principal | Consultório clínico ativo com pacientes cadastrados, histórico de anamnese e planos alimentares. |
| **Dr. Marcos Lima** | `dr.marcos@demo.stormnutrition.com` | Nutricionista Independente | Consultório isolado para validação empírica de multi-tenancy (nenhum paciente compartilhado). |
| **Ana Silva** | `ana.silva@demo.stormnutrition.com` | Paciente Vinculada | Acesso ao Portal do Paciente para visualização da dieta prescrita pela Dra. Clara. |
| **Bruno Costa** | `bruno.costa@demo.stormnutrition.com` | Segundo Paciente Vinculado | Testes adicionais de múltiplos vínculos e convites. |

---

## 2. Roteiro de Avaliação Rápida (3 a 5 minutos)

### Passo 1: Acesso com Perfil Clínico
1. Acesse `/login`.
2. No painel inferior **Contas de Demonstração (1 Clique)**, clique em **Dra. Clara Mendes**.
3. Clique em **Entrar** para acessar o Painel Principal (`/dashboard`).
4. Note o banner superior de modo de demonstração com atalho para o roteiro guiado.

### Passo 2: Prontuário e Cálculo Energético
1. Navegue para **Pacientes** (`/patients`) e selecione **Ana Silva**.
2. Revise os dados antropométricos, histórico e metas clínicas.
3. Acesse a **Calculadora Metabólica** (`/metabolic-calculator`) para gerar estimativas de Taxa Metabólica Basal (TMB) e Gasto Energético Total (GET) com base nas fórmulas Harris-Benedict ou Mifflin-St Jeor.

### Passo 3: Criação e Envio Seguro de Dieta
1. Acesse o **Gerador de Dietas** (`/diet-generator`).
2. Monte ou revise as refeições estruturadas com alimentos da tabela TACO brasileira.
3. Teste o disparo de e-mail para `ana.silva@demo.stormnutrition.com`. O sistema intercepta o envio com segurança sem acionar APIs externas, registrando a simulação no console e aplicando limites anti-spam.

### Passo 4: Perspectiva do Paciente (Portal)
1. Faça logout ou abra uma aba anônima e acesse `/paciente` (ou clique em **Ana Silva** na tela de login).
2. O sistema reconhece o papel de paciente e redireciona para o **Portal do Paciente** (`/paciente`).
3. Verifique a dieta publicada, orientações do profissional e acompanhamento calórico.

### Passo 5: Isolamento Multi-tenant & Faturamento
1. Faça login como **Dr. Marcos Lima** (`dr.marcos@demo.stormnutrition.com`).
2. Acesse `/patients`: observe que a lista está vazia, comprovando que os pacientes da Dra. Clara não vazam entre contas.
3. Acesse **Ajustes > Faturamento** (`/settings`):
   - Observe o aviso de portfólio identificando a simulação de faturamento.
   - Experimente alterar o plano ou cancelar a assinatura.
   - Use o botão **Restaurar Simulação Padrão** para redefinir o estado local para o plano Profissional padrão.

---

## 3. Identificação Explícita de Simulações vs. Backend Real

Para transparência técnica rigorosa, a tabela abaixo detalha o que é persistido no backend seguro vs. o que opera como protótipo ilustrativo:

| Recurso | Implementação | Backend / Armazenamento | Comportamento em Demonstração |
| :--- | :--- | :--- | :--- |
| **Autenticação & Perfis** | Real | Firebase Auth + Firestore (`users`, `patientProfiles`) | Multi-tenant estrito validado por regras de segurança. |
| **Prontuários & Dietas** | Real | Firestore (`patients`, `dietPlans`) | Apenas o profissional criador (`nutritionistId == request.auth.uid`) ou o paciente vinculado (`patientUid == request.auth.uid`) possui leitura/gravação. |
| **Disparo de E-mails** | Seguro / Simulado | EmailJS (produção) vs. Interceptor Local (demo) | Domínios `@demo.stormnutrition.com`, `@example.com` e `@test.com` são interceptados sem chamada externa. Validações de sintaxe e taxa de requisições permanecem ativas. |
| **Faturamento e Assinaturas** | Protótipo / Simulação | `localStorage` isolado por usuário (`isanutri:<uid>:billingState:v1`) | Não processa cartões reais. **Arquiteturalmente desacoplado das regras do Firestore:** o estado de faturamento local nunca confere permissões no banco de dados. |
| **Catálogo de Alimentos** | Real | Base TACO Local com busca indexada | Consulta otimizada em memória para mais de 500 alimentos nacionais. |

---

## 4. Comandos de Inicialização e Reset de Dados

### Inicializar Emuladores Locais
```bash
# Inicia emuladores do Firebase (Auth porta 9099, Firestore porta 8080)
npm run emulators
```

### Resetar e Popular Dados Sintéticos
```bash
# Executa a limpeza e população dos perfis sintéticos de demonstração
npm run demo:reset
```

### Executar Testes E2E Emulados
```bash
# Roda toda a suíte Playwright conectada aos emuladores locais
npm run test:e2e:emulated
```

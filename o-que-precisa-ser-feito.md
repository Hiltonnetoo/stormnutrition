# Pendências reais — Storm Nutrition

Atualizado em **19/09/2026, 17h (após a execução das fases E0 a A7 e de parte da UI)**. Este arquivo contém **somente o que ainda falta**. O que foi feito e comprovado está em [feito.md](feito.md) (seção "Fases E0–A7").

Históricos:
- [plano antes desta execução](docs/validacao-2026-09-19/plano-antes-das-fases-a1-a7.md), com o diagnóstico completo e os números medidos antes;
- [plano antes da auditoria de produção](docs/validacao-2026-09-19/plano-antes-da-auditoria-de-producao.md);
- [plano de 18/09](docs/historico-plano-antes-reorganizacao-ui-2026-09-18.md);
- [log da verificação final](docs/validacao-2026-09-19/fases-a1-a7/verificacao-final.log).

---

## 0. Leia antes de começar (instruções para a IA que vai implementar)

### 0.1 Situação em 19/09/2026, 17h

| Fato | Detalhe |
| --- | --- |
| Código local | Todas as fases E0–A7 implementadas **na árvore local, sem commit**. Base: `dd0d241` (= `origin/main` = produção). |
| Verificação local | `format:check`, `lint` (0 erros), `type-check`, `build`, `test:coverage` (509), `test:rules` (101), `test:perf:queries` (15), `test:e2e:emulated` (26) e `screenshots`: **todos com exit 0** ([log](docs/validacao-2026-09-19/fases-a1-a7/verificacao-final.log)). |
| Produção (Vercel) | **Ainda roda o código antigo (`dd0d241`).** Nada foi enviado: um push para `main` publica automaticamente na Vercel e precisa de autorização explícita do usuário. |
| CI remota | Vermelha nos commits `dbada44`…`dd0d241` (Prettier). A correção está local e só será comprovada depois do push. |
| Regras do Firestore em produção | Não verificado; exige deploy pelo usuário (E0.2). |

### 0.2 Regras de trabalho

1. Use apenas emuladores e dados sintéticos (`npm run dev:emulated`, `npm run test:e2e:emulated`, projeto `demo-storm`). **Nunca** grave no Firebase de produção, não envie e-mail real e não faça push/deploy sem autorização explícita.
2. Preserve alterações de outros autores; não resete a árvore.
3. Não enfraqueça testes. A auditoria permanente `src/services/__tests__/generatorAudit.test.ts` tem limites que **só podem ser apertados**.
4. Ao concluir um item, rode a bateria da seção 0.1 (wrappers de emulador um de cada vez) e registre em `feito.md`: ID, arquivos, antes/depois, teste (arquivo + nome), comando, resultado e data.
5. Critérios clínicos não podem ser inventados. Os valores propostos na seção 2 aguardam o nutricionista responsável.

---

## 1. E0 — Publicação (Concluído em 19/09/2026)

### E0.1 Commit, push e CI verde [CONCLUÍDO]
- **Commit:** `0402baa` em `origin/main`.
- **CI Remota:** Run `35475087293` verde em ambos os jobs:
  - Firestore Rules: verde em 1m27s
  - Build and Test: verde em 3m49s (Prettier, ESLint, Type-check, Build, Vitest 509 testes, Playwright E2E)
- **Produção (Vercel):** Implantado e ativo em `https://stormnutricion.vercel.app`.

### E0.2 Regras do Firestore no projeto de produção [CONCLUÍDO]
- **Execução:** `firebase deploy --only firestore:rules,firestore:indexes --project isanutriv5` executado com sucesso em 19/09/2026. Regras de R02–R04 e bloqueio de paciente arquivado ativas na nuvem.

### E0.3 Conferência em produção
- **O que falta:** depois da publicação, gerar uma dieta **nova** com um paciente de teste e conferir:
  - painel de avisos agrupado (A1);
  - café da manhã sem arroz, macarrão ou carne (A2);
  - totais próximos da meta (A3);
  - aprovação pedindo CRN e PDF com o carimbo (A6).
- **Atenção:** planos salvos antes continuam com o conteúdo antigo. No portal, planos antigos sem `status` **deixam de aparecer** até o profissional aprovar de novo (política do A6). Avisar os usuários antes de publicar.

---

## 2. Decisões clínicas pendentes (propostas implementadas; confirmar com o nutricionista responsável)

| Decisão | Valor implementado (proposta) | Onde está |
| --- | --- | --- |
| Limite de aviso da alternativa × opção principal | ±20 %, ignorando diferenças abaixo de 5 g de macro ou 50 kcal | `DEFAULT_ALTERNATIVE_TOLERANCE` em `dietAlgorithmService.ts`; configurável por `MacroTolerances.alternativePercent/alternativeMinGrams/alternativeMinKcal` |
| Sódio por item (porção) | Renal < 300 mg; hipertensão ≤ 400 mg (contrato herdado dos testes de persona) | `ITEM_SODIUM_CAP_MG` em `dietAlgorithmService.ts` |
| Parmesão e provolone curado em "sem lactose" | Considerados compatíveis (exceção por nome em `foodService.ts`); agora limitados a 2 usos por dia | `evaluateFoodRestriction` |
| Café da manhã e lanches | Carne só ovo (e "frango desfiado" no lanche da tarde); sem leguminosas; sem arroz, macarrão ou quinoa | `mealArchetypeService.ts` |
| Acompanhamento automático | Quando os 3 alimentos no limite não fecham a energia da refeição: leguminosas/legumes no almoço e jantar, fruta/cereal nas demais | `pickComplement` em `dietAlgorithmService.ts` |
| Medidas caseiras | Colher de sopa = 15 ml (referência do catálogo), sobremesa 10 ml, chá 5 ml; copo 200 ml; pesos de referência por fruta | `portionLimitsService.ts` |
| Tetos de sódio diários (tela e PDF) | Geral 2300 mg, hipertensão 2000 mg, renal 1500 mg | `getSodiumCeiling` em `validationPresentation.ts` |

**Aceite:** valores confirmados, ou ajustados e registrados em `docs/design-system.md`, com testes nas bordas.

---

## 3. Gerador — restante

### G1 — Proteína no perfil vegano (bloqueado pelo catálogo)
- **Medido:** os perfis não veganos batem as metas diárias (≥ 95 %, na auditoria). O **vegano fica cerca de 40–46 % abaixo em proteína**: o catálogo (123 itens) não tem fontes proteicas veganas suficientes, e leguminosas estão proibidas no café e nos lanches.
- **Hoje:** o plano mostra o desvio de proteína (`PROTEIN_DEVIATION`), coberto por teste.
- **O que falta (nova fase, depende de pedido):** ampliar o catálogo (tofu, bebida de soja, proteína texturizada…) **ou** decidir com o nutricionista liberar leguminosas em lanches veganos.

### G2 — Nomes congelados no idioma da geração (menor)
- Os nomes das alternativas nos avisos ficam no idioma em que o plano foi gerado. **O que falta:** renderizar pelo `foodId` no idioma atual.

---

## 4. UI e design system — restante

### UI-P1 — Estados e feedback (UI02/UI09)
- **Feito:** selo de status único em gerador, visualizador e histórico; avisos agrupados; feedback de salvar, enviar e exportar.
- **Falta:**
  1. Medir no navegador o contraste de hover, foco e desabilitado dos selos novos.
  2. Revisar o vocabulário de toasts e diálogos em PT/EN.
  3. Tirar os emojis que ainda existem em textos de tradução (6 em `pt/common.json`, por exemplo "ℹ️ Disparo simulado", "✓ Um e-mail…").

### UI-P1 — Revisão visual de aceitação (UI12)
- **Feito:** 13 capturas com manifesto, incluindo `diet_generator_warnings.png`; varredura automática sem rolagem horizontal a 375/768 px e com texto a 200 % (`layout-stress.spec.ts`).
- **Falta:**
  - EN visual das telas principais;
  - agenda criar/editar;
  - relatórios com dados extensos e vazios;
  - fluxos completos de calculadora, configurações e e-mails;
  - portal sem plano e com erro (capturas);
  - toasts;
  - revisão visual do PDF exportado;
  - **avaliação humana externa** do conjunto.

### UI-P2 — Adoção dos controles (UI05)
- **Feito:** botões dos modais de peso e senha do portal e da tela de erro migrados para `btn`/variantes.
- **Falta:** decidir e registrar, controle a controle:
  - botões grandes do check-in (`AdherenceCheckIn`): hoje mantidos como alvo de toque;
  - `SelfEvaluationForm`;
  - botões de `AcceptInvitation`;
  - campos locais dos formulários de cadastro.

### UI-P2 — Densidade (UI04)
- **Feito:** texto ampliado a 200 % testado (sem rolagem horizontal).
- **Falta:** documentar quando usar densidade confortável ou compacta.

### UI-P2 — Estados raros (UI06)
- **Feito:** o portal diferencia carregando, sem dados, acesso indisponível e falha, com "tentar novamente" (testado).
- **Falta:** catálogo por tela no lado profissional (perfil com erro de leitura, histórico vazio, e-mails com falha), com captura.

### UI-P3 — Ganho em tarefas reais (UI10)
- **Falta:** revisão qualitativa com pessoas (localizar paciente, revisar dieta, registrar adesão). Não é automatizável.

---

## 5. Fora do escopo atual (fase futura, só com pedido do usuário)

- Personalização por aversões, alimentos recusados, tempo de preparo e contexto cultural.
- Ampliação do catálogo (necessária para G1).
- Tema escuro.

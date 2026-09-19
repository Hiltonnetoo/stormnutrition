# Pendências reais — Storm Nutrition

Atualizado em **19/09/2026, após auditoria do código em produção**. Este arquivo contém **somente trabalho ainda pendente**. O que já foi feito e comprovado está em [feito.md](feito.md).

Históricos:
- [versão anterior deste plano](docs/validacao-2026-09-19/plano-antes-da-auditoria-de-producao.md), com o P0–P2 marcado como "CONCLUÍDO" antes da auditoria;
- [plano de 18/09](docs/historico-plano-antes-reorganizacao-ui-2026-09-18.md);
- [validação de 19/09](docs/validacao-2026-09-19/README.md);
- [índice de evidências](docs/evidencias-revisao-10.md).

---

## 0. Leia antes de começar (instruções para a IA que vai implementar)

### 0.1 Situação verificada em 19/09/2026

| Fato | Como foi verificado |
| --- | --- |
| `main` local = `origin/main` = `dd0d241`; árvore limpa | `git status`, `git log` |
| **Produção (Vercel, projeto `stormnutricion`) roda exatamente esse código** | Publicado às 13:13 (UTC−3), 2 min após o commit; os chunks publicados contêm `clinically_approved`, `EXCLUDE_ALLERGEN` e os arquétipos de refeição |
| **CI remota falha** desde o commit `dbada44` (P0–P2): runs 35453523800, 35454051657, 35454142617 | `gh run view`: o job "Build and Test" para em **Prettier (14 arquivos)**; lint, tipos, testes e E2E **não rodam** na CI. O job "Firestore Rules" passa |
| Suíte local verde (51 arquivos / 485 testes) | `npx vitest run`. **Atenção:** verde não significa que os problemas abaixo estão resolvidos; os testes de aceitação atuais não os medem (ver A7) |
| Regras do Firestore em produção | **Não verificado.** A Vercel publica só o frontend; as regras exigem `firebase deploy --only firestore:rules` no projeto real |
| Planos salvos antes de hoje | Continuam com o conteúdo do algoritmo antigo; só planos novos usam o motor atual |

### 0.2 Regras de trabalho

1. Use apenas emuladores e dados sintéticos (`npm run dev:emulated`, `npm run test:e2e:emulated`, projeto `demo-storm`). **Nunca** grave no Firebase de produção, não envie e-mail real e não faça deploy sem autorização explícita do usuário.
2. Preserve alterações de outros autores. Não resete a árvore.
3. Não enfraqueça testes para obter verde. Mudança intencional de contrato exige explicar por que a expectativa antiga estava errada e escrever o teste do novo comportamento.
4. Trabalhe **um item por vez, na ordem deste arquivo**. Ao concluir um item, rode `npm run format:check`, `npm run lint`, `npm run type-check`, `npm run build`, `npm run test:coverage`, `npm run test:rules` e `npm run test:e2e:emulated`. Wrappers de emulador rodam um de cada vez (mesmas portas).
5. Só mova um item para [feito.md](feito.md) quando **todos** os critérios de aceite tiverem teste e execução no estado final. Registre: ID, arquivos, comportamento antes/depois, teste (arquivo + nome), comando, resultado e data. Deixe no backlog os subcritérios não comprovados.
6. Critérios clínicos (tolerâncias, limites) não podem ser inventados. Quando o item pedir decisão clínica, proponha um valor, documente a justificativa e marque "decisão pendente do nutricionista responsável" até o usuário confirmar.

### 0.3 Mapa dos arquivos do gerador

| Responsabilidade | Arquivo |
| --- | --- |
| Geração e validação do plano | `src/services/dietAlgorithmService.ts` (`generateAlgorithmicDietPlan`, `validateDietPlan`, `computeReviewSignature`) |
| Tipos de refeição (arquétipos) | `src/services/mealArchetypeService.ts` (`classifyMealArchetype`, `isFoodSuitableForArchetype`) |
| Porções e medidas caseiras | `src/services/portionLimitsService.ts` (`getPortionBoundaries`, `clampPortion`, `formatHouseholdMeasure`, `solvePortions`) |
| Restrições e alergias | `src/services/clinicalScreeningService.ts`, `src/services/foodService.ts` (`evaluateFoodRestriction`) |
| Catálogo de alimentos | `src/data/foods.ts` (123 alimentos; 116 sem campo `restrictions`, classificados por heurística de nome/categoria) |
| Tela do plano e avisos | `src/components/diet-generator/DietPlanDisplay.tsx` |
| Tela do gerador | `src/pages/DietGenerator.tsx` |
| Modal de revisão/aprovação | `src/components/modals/ClinicalReviewModal.tsx` |
| Exportação | `src/components/modals/ExportDietModal.tsx`, `src/utils/pdfExporter.ts` |
| Portal do paciente | `src/components/patient-portal/PortalDietsSection.tsx` |
| Textos | `src/locales/pt/common.json`, `src/locales/en/common.json` (`diet_validation.issues.*`) |

### 0.4 Como medir: auditoria reproduzível

Os números deste arquivo vêm de scripts temporários (já removidos). O item **A7** pede que eles virem teste permanente. Para reproduzir antes disso:

- **Perfis**, usando as chaves reais do cadastro (`dietaryOptionsMap` em `Step4Nutritional.tsx`):
  - geral (sem restrição);
  - hipertensão + diabetes (`clinicalTags: ["hypertension","diabetes_t2"]` e `restrictions: ["hypertension","diabetes"]`);
  - `lactose_free`, `dairy_free`, `vegan`, `vegetarian`, `gluten_free`;
  - alergias (`foodAllergies: "amendoim, castanhas, camarão"`);
  - renal (`clinicalTags: ["renal_ckd"]`).
  
  **Não use** chaves inexistentes como `lactose` ou `gluten`: elas geram falsos avisos `UNVERIFIED_RESTRICTION`.
- **Metas:** 2000 kcal, P 120 g, C 225 g, G 67 g.
- **Refeições:** Café da Manhã 07:00 20 %, Lanche da Manhã 10:00 10 %, Almoço 12:30 30 %, Lanche da Tarde 16:00 10 %, Jantar 19:30 25 %, Ceia 22:00 5 %.
- **Sementes:** 1–20 (ou 1–15).
- **Renderização dos avisos:** `i18n.t("diet_validation.issues." + code, { ...details, defaultValue: message })` em PT e EN, igual a `DietPlanDisplay.tsx`.
- **Classificação por categoria do catálogo** (`src/data/foods.ts`), não por lista de nomes.

---

## 1. E0 — Liberar a entrega (fazer primeiro)

### E0.1 CI remota verde
- **Problema:** a CI falha no passo Prettier por 14 arquivos: `DietPlanDisplay.tsx`, `ExportDietModal.tsx`, `DietGenerator.tsx`, `clinicalScreeningService.ts`, `dietAlgorithmService.ts`, `dietService.ts`, `portionLimitsService.ts`, `pdfExporter.ts` e os testes `clinicalAcceptancePersonas`, `clinicalScreeningService`, `dietAlgorithmService`, `mealArchetypeService`, `portionLimitsService`, `pdfExporter`. Os passos seguintes (lint, tipos, build, cobertura, E2E) **nunca rodaram remotamente** para P0–P2.
- **O que fazer:** rodar `npm run format`, conferir que o diff é só de formatação e depois rodar toda a bateria local. Atualizar `actions/setup-java` para v5 e as actions para Node 24 (a CI já emite aviso de depreciação).
- **Aceite:** um run da CI com os dois jobs verdes para o commit entregue, com link registrado em `feito.md`. Se algum passo que nunca rodou falhar, corrigir a causa (não pular o passo).

### E0.2 Regras do Firestore em produção
- **Problema:** as proteções de servidor (paciente arquivado, históricos append-only, convites estritos, revogação) só existem em produção se as regras foram publicadas no projeto real. Isso não foi verificado.
- **O que fazer:** **o usuário** (ou a IA, com autorização explícita) roda `firebase deploy --only firestore:rules,firestore:indexes --project <projeto de produção>` a partir do mesmo commit da CI verde.
- **Aceite:** saída do deploy registrada com projeto, commit e data.

### E0.3 Verificação pós-publicação
- **O que fazer:** depois de cada item abaixo publicado, gerar uma dieta nova em produção com um paciente de teste e conferir o critério do item. Planos antigos não servem de prova.

---

## 2. Gerador e avisos: ordem de correção (A1 → A7)

Motivo da ordem:
- **A1** corrige o que o nutricionista vê hoje e é barato.
- **A2 e A3** atacam a **causa** do volume de avisos: alternativas não equivalentes e metas diárias erradas.
- **A4** só pode recalibrar limites depois de A2 e A3, com dados novos.
- **A5 e A6** são independentes.
- **A7** transforma tudo em teste obrigatório; os testes de A7 podem ser escritos junto com cada item.

### A1 — Avisos compreensíveis na tela, no modal e no PDF

**Medido (135 planos, 9 perfis × 15 sementes):** entre **31 e 49 avisos por plano** (mediana 40), todos numa única caixa âmbar.

| Código | Frequência | Defeito |
| --- | --- | --- |
| `ALTERNATIVE_MACRO_DEVIATION` | 31 por plano, em **100 %** dos planos | Nome do nutriente em inglês no texto PT ("varia 44% em **protein**") em 100 % dos casos; decimais com ponto ("44.5g") em ~99 %; **uma linha por macro**, então a mesma alternativa ocupa 3 a 4 linhas (média 2,9); 11 % das linhas avisam variações abaixo de 10 % |
| `ALTERNATIVE_CALORIE_DEVIATION` | 4 por plano, 100 % dos planos | Mostra literalmente `({{alternativeCalories}} kcal vs {{mainOptionCalories}} kcal)` **em PT e EN**. Causa: o serviço envia `mainValue`/`alternativeValue`, e a tradução espera outros nomes. 41 % das linhas são variações abaixo de 10 % |
| `FAT/CARBS/PROTEIN/CALORIE_DEVIATION` | gordura em 131 de 135 planos; carboidratos 106; proteína 47; calorias 8 | Texto ambíguo: "Variação de gorduras de 75.8% em relação à meta (67g vs 117.8g)" não diz qual número é a meta; decimais com ponto. O aviso é legítimo (o problema real é A3) e deve ficar em destaque, não misturado às alternativas |
| `WORST_CASE_*_DEVIATION` | cerca de 3 por plano | Repetem o que as linhas por alternativa já dizem |
| Aviso por item (`clinicalWarnings`) | ocasional | Emoji ⚠️ com texto só no `title` (hover): inacessível no celular e por teclado |

Rótulos de alternativa são montados juntando nomes que já têm vírgula ("Lombo de porco, assado, Maçã e Banha de porco" parece ter 4 itens).

**O que deve acontecer (todos os subitens):**
1. **Interpolação:** alinhar os nomes dos parâmetros entre `dietAlgorithmService.ts` (details de `ALTERNATIVE_CALORIE_DEVIATION`) e as chaves PT/EN. Nenhuma saída pode conter `{{`.
2. **Nutriente traduzido:** o parâmetro `nutrient` (`protein`/`carbs`/`fat`/`calories`) deve virar texto do idioma, via chaves `diet_validation.nutrients.*` resolvidas antes da interpolação.
3. **Números no formato do idioma:** criar um formatador único (`Intl.NumberFormat` por idioma) usado pela tela e pelo PDF: PT "44,5 g", "−30 %"; EN "44.5 g", "−30%". Os valores continuam numéricos em `details`; só a apresentação muda.
4. **Uma linha por alternativa:** unir os desvios de calorias e macros da mesma alternativa. Exemplo: "Café da Manhã · Alternativa 2 (Lombo de porco assado + Maçã + Banha de porco): proteína +44 % (44,5 g × 30,8 g), gordura −30 % (23,4 g × 33,5 g)".
5. **Rótulo da alternativa:** "Alternativa N" + itens separados por " + ", sem ambiguidade de vírgulas.
6. **Hierarquia e agrupamento, nesta ordem:**
   - (a) bloqueios (`level: error`), em vermelho, sempre abertos;
   - (b) **metas diárias** (calorias/macros), no formato "Gordura: plano 117,8 g · meta 67 g · +75,8 %";
   - (c) sódio;
   - (d) **alternativas**, agrupadas por refeição, com uma linha-resumo por refeição e lista recolhível; os `WORST_CASE_*` entram só como resumo da seção, não como linhas soltas.
   - No topo, resumo com contagem ("3 metas fora da tolerância · 12 ajustes sugeridos em 5 refeições").
7. **Modal de revisão** (`ClinicalReviewModal.tsx`): hoje mostra metas, macros, fibra e sódio, mas **não lista os alertas que estão sendo aprovados**. Deve mostrar o resumo agrupado de (a)–(d); o texto do botão deixa claro que o profissional aprova o plano **com esses alertas**.
8. **PDF** (`pdfExporter.ts` ~linha 383): hoje imprime **todos** os avisos técnicos em qualquer status, inclusive plano aprovado entregue ao paciente. O PDF do paciente não deve ter a lista técnica. Se houver versão para o profissional, ela usa o mesmo agrupamento e formatação da tela.
9. **Limite de sódio único:** a tela usa 2300 mg (geral) / 2000 (hipertensão) / 1500 (renal) e o PDF usa 2000 / 1500. Criar uma única função, usada nos dois, com as mesmas mensagens.
10. **Aviso por item:** trocar o emoji por ícone SVG com texto acessível (visível ou via `aria-describedby`), que funcione por toque e teclado.
11. (Menor) Nomes de alternativas e refeições ficam presos ao idioma da geração (`details`). Quando possível, renderizar pelo `foodId` no idioma atual.

**Aceite (medido pela auditoria de A7, antes e depois):**
- 0 textos com `{{`, `undefined` ou `NaN`;
- 0 termos em inglês nos textos PT e 0 em português nos textos EN (exceto nomes de alimentos e refeições digitados pelo usuário);
- 0 decimais com ponto em PT;
- no máximo 1 linha por alternativa;
- tela agrupada conforme o item 6, com captura em 375 e 1440 px em PT e EN;
- teste de PDF provando que a versão do paciente não tem a lista técnica;
- teste do modal listando os alertas.

### A2 — Tipo de refeição e variedade

**Medido (6 perfis × 20 sementes; ocorrências em 20 planos por perfil):**
- **Arroz, macarrão ou quinoa no café e nos lanches:** 49 (geral), 56 (hipertensão + diabetes), 113 (vegano). Exemplos: "Leite desnatado 240 ml + **Arroz branco 155 g** + Azeite 15 ml" no café; "**Macarrão cozido 184 g**" no café.
- **Carne (exceto ovo) no café ou lanches:** 16 (geral), **136 (alergias)**. Exemplo: "Lombo de porco assado + Pão de forma integral + Manteiga" no café. Quando restrições ou alergias esvaziam as opções de laticínios, o gerador cai para carne.
- **Leguminosas (feijão, lentilha, grão-de-bico) no café e lanches:** 240 (vegano), 47 (alergias).
- **Pão ou biscoito no almoço e jantar:** 7 a 13 por perfil (ex.: "Grão-de-bico + Pão de forma integral" no jantar).
- **Repetição:** 39 de 120 planos repetem o mesmo alimento 3 vezes ou mais nas opções principais do dia (ex.: quinoa em 3 refeições). Em planos sem lactose, "Queijo parmesão ralado" aparece cerca de 7 vezes por plano.
- **Por que os testes não pegam:** `clinicalAcceptancePersonas.test.ts` › "comprova ausência de pares bizarros" verifica só alguns nomes (feijão, patinho, tilápia…), num único perfil sem restrições e com sementes fixas.

**O que deve acontecer:**
1. Documentar em `mealArchetypeService.ts` (e em `docs/`) uma tabela arquétipo × categoria do catálogo: **permitida**, **preferida** ou **proibida**. Mínimo: no café e nos lanches, proibir carnes (exceto ovo e frios magros, se o nutricionista aprovar), leguminosas e bases amiláceas de almoço (arroz, macarrão, quinoa, cuscuz salgado); no almoço e jantar, proibir pães de forma, biscoitos e cereais matinais.
2. **Nunca fazer "fallback" silencioso para categoria proibida.** Se as restrições esvaziarem o conjunto permitido (ex.: vegano + café), o gerador usa as alternativas definidas para o perfil (ex.: frutas + aveia + oleaginosas + bebida vegetal, se existir no catálogo). Se ainda assim não houver opção, emite um aviso claro de "catálogo insuficiente para esta refeição" em vez de inserir alimento inadequado.
3. **Variedade:** o mesmo alimento aparece no máximo 2 vezes nas opções principais do dia, e as alternativas de uma refeição não repetem o alimento principal dela.
4. **Parmesão em "sem lactose":** a exceção em `foodService.ts` (~linha 340, "parmesão"/"provolone curado" = compatível) é intencional, mas precisa de **decisão clínica registrada** (intolerância leve × grave) e não pode fazer o parmesão ser a fonte de proteína repetida do dia.

**Aceite:**
- Em todos os perfis da seção 0.4 × 20 sementes, classificando **por categoria do catálogo**: 0 itens proibidos por arquétipo;
- 0 alimentos com mais de 2 ocorrências nas opções principais do dia;
- 0 vazamentos de restrições e alergias, preservando o resultado atual (ver `feito.md`).

### A3 — Atingir as metas diárias

**Medido:** **120 de 120** planos têm pelo menos um macro mais de 20 % fora da meta; 46 de 120 têm calorias mais de 10 % fora. A gordura passa da meta em quase todos (ex.: 101–155 g para meta de 67 g). O "solver conjunto" (`solvePortions`) ajusta cada refeição, mas não fecha o total do dia.

**O que deve acontecer:**
1. Distribuir as metas diárias de calorias e macros pelas refeições (percentual de cada refeição) e resolver as porções de cada refeição para essas metas, dentro dos limites de `getPortionBoundaries`.
2. Depois, fazer uma passada de correção diária: redistribuir a diferença residual entre as refeições com folga de porção, priorizando o macro mais distante da meta.
3. Se nenhum ajuste couber nos limites, trocar o alimento responsável (ex.: gordura de adição) antes de aceitar o desvio.

**Aceite:**
- Em todos os perfis × 20 sementes, pelo menos 95 % dos planos com calorias dentro de ±10 % e cada macro dentro da tolerância padrão (±20 %) ou da configurada;
- método documentado;
- testes com valores esperados literais em cenários pequenos.

### A4 — Recalibrar o limite das alternativas (depois de A2 e A3)

**Situação:** `dietAlgorithmService.ts` (~linha 425) usa `Math.abs(pct) > 5` para cada macro de cada alternativa. É esse limite que gera 31 avisos por plano. Além disso, 32 de 1440 alternativas passam de 20 % em calorias, embora o plano anterior dissesse "100 % ≤ 20 %".

**O que deve acontecer:**
1. Substituir os 5 % fixos por um limite configurável, alinhado às tolerâncias diárias (`MacroTolerances`), **mais um mínimo absoluto em gramas** para não avisar diferenças irrelevantes em valores pequenos.
2. Propor os valores padrão com justificativa e marcar como decisão do nutricionista responsável.
3. Garantir a equivalência calórica das alternativas (≤ 20 %) **na geração**. Se o laço de correção não conseguir, descartar a alternativa em vez de apresentá-la.

**Aceite:**
- 0 alternativas acima de 20 % em calorias nos perfis × sementes;
- avisos de alternativa só acima do limite configurado;
- testes com valores literais nas bordas (logo abaixo e logo acima).

### A5 — Unidades e medidas caseiras

**Medido:** "Creme de leite **100 g (1 colher de sopa)**", "Manteiga com sal **20 ml**", "Banha de porco **14 ml**", "Ovo 142 g (3 unidades)". Gordura sólida aparece em ml, e a medida caseira não corresponde aos gramas.

**O que deve acontecer:**
1. Cada alimento tem estado físico (sólido/líquido) e peso de referência da medida caseira (colher, fatia, unidade, concha).
2. Sólidos sempre em g; líquidos em ml com densidade explícita.
3. A medida caseira é **calculada** a partir dos gramas (ex.: 100 g de creme de leite ≈ 7 colheres de sopa), com frações legíveis.

**Aceite:** em todos os itens gerados, medida caseira × peso de referência ≈ gramas (±25 %); 0 sólidos em ml; testes por alimento representativo.

### A6 — Aprovação clínica real e portal

**Situação:**
- O tipo `ClinicalApproval` (nome, CRN, assinatura) existe, mas **nenhum código o cria**: não há campo de CRN, e o carimbo profissional do PDF (`pdfExporter.ts` ~576) nunca aparece.
- `DietPlanDisplay.tsx` (~297) mostra "Aprovado pelo profissional" também quando só `validation.isApproved` é verdadeiro, o que inclui planos antigos aprovados automaticamente.
- `PortalDietsSection.tsx` (~16–24): planos v2 **sem `status`** (todos os salvos antes de 19/09) aparecem ao paciente com base em `validation.isApproved`.

**O que deve acontecer:**
1. O nome profissional e o CRN vêm das configurações do perfil. Aprovar exige CRN preenchido; sem ele, o modal orienta a cadastrar.
2. Na aprovação, criar `clinicalApproval` (uid, nome, CRN, data, assinatura da versão revisada) e `status: "clinically_approved"`.
3. O selo "Aprovado pelo profissional" e a visibilidade no portal dependem **apenas** de `status`/`clinicalApproval`.
4. Definir a política para planos antigos: não aprovados até o profissional reaprovar, **ou** uma migração explícita e documentada. Mostrar isso na interface.

**Aceite:** testes de serviço e de componente para aprovar com e sem CRN; plano antigo com `isApproved` e sem `status` não aparece como aprovado nem no portal; E2E: aprovar → portal exibe → PDF com carimbo.

### A7 — Testes de aceitação que medem o que importa

**Problema:** `clinicalAcceptancePersonas.test.ts` passa com todos os defeitos acima porque verifica nomes específicos, um perfil e sementes fixas.

**O que deve acontecer:** criar uma suíte de auditoria permanente (ex.: `src/services/__tests__/generatorAudit.test.ts`) com os perfis e as sementes da seção 0.4. Ela deve verificar, com limites explícitos:
- categorias por arquétipo (A2) e repetição;
- metas diárias (A3);
- equivalência das alternativas (A4);
- unidades e medidas (A5);
- vazamento de restrições e alergias (0);
- textos renderizados PT/EN (A1): sem `{{`, sem idioma trocado, formato numérico, no máximo 1 linha por alternativa;
- avisos por plano abaixo de um teto definido após A4.

Os limites começam no valor medido e são apertados item a item; **nunca afrouxados** para passar.

**Aceite:** a suíte roda na CI; cada item A1–A6 só é concluído quando o critério correspondente estiver na suíte e verde.

---

## 3. UI e design system (pendências mantidas)

Contrato em [docs/design-system.md](docs/design-system.md). O que já foi validado está em `feito.md`.

### UI-P1 — Estados e feedback (UI02/UI09)
1. Inventariar os estados da dieta em `DietPlanDisplay`, `DietPlanViewer`, histórico do perfil, portal e PDF: rascunho, aguardando revisão, bloqueado, aprovado, edição manual e plano antigo.
2. Mesmo estado = mesmo texto e tom em todas as superfícies (o PDF pode usar primitivas próprias, com o mesmo significado).
3. Usar os componentes existentes (`Alert`, `Badge`). Erro urgente com `role="alert"`, confirmação com `role="status"`.
4. Salvar, enviar e exportar: impedir duplo clique, manter a geometria, mostrar sucesso só após confirmação real, permitir recuperar de erro. O e-mail simulado continua identificado.
5. Exercitar cada estado em PT/EN e medir contraste normal, hover e foco no navegador.

**Aceite:** matriz superfície × estado preenchida, sem contradição entre tela e PDF.

### UI-P1 — Revisão visual de aceitação (UI12)
Capturas com emuladores e dados sintéticos (`npm run screenshots`), registrando rota, viewport, idioma e versão. As lacunas que faltam:

| Área | Evidência necessária |
| --- | --- |
| Público e navegação | Home e shell a 768 px; menu e cabeçalhos com EN longo |
| Dashboard | EN visual; dados longos |
| Pacientes | Formulário em etapas; EN visual |
| Dietas | Histórico, comparação, edição e **a nova área de avisos (A1)** |
| Agenda | Criar/editar; 768 px |
| Relatórios | 375/768 px; dados extensos e vazios |
| Alimentos | Detalhe; 768 px |
| Calculadora, configurações, e-mails | Fluxos completos |
| Portal | Sem plano, erro/acesso indisponível, autoavaliação |
| Transversais | Toasts; vocabulário dos diálogos |
| PDF | Revisão visual do arquivo exportado do mesmo plano salvo |

**Aceite:** nenhuma célula aplicável sem evidência ou exclusão justificada; avaliação humana externa depois.

### UI-P2 — Adoção dos controles (UI05)
Inventariar os controles locais (modais de peso e senha, `SelfEvaluationForm`, `ProfileDietsTab`, convite, `ErrorBoundary`) e decidir, controle a controle, se migra para `Button`/`IconButton`/`Input`/`Select`/`Textarea`/`Checkbox`. Garantir uma ação principal por contexto e validar 320/375 px com textos EN longos.

### UI-P2 — Texto ampliado e densidade (UI04)
Testar ampliação só de texto a 200 % (formulário, calendário, tabelas, badges, modais) e corrigir alturas rígidas. O reflow a 320 px não substitui esse teste.

### UI-P2 — Estados raros (UI06)
Simular acesso revogado ou arquivado, erro de leitura, ausência de plano, histórico vazio e falha recuperável. Diferenciar espera, ausência de dados e acesso negado, com ação adequada em PT/EN.

### UI-P2 — Marca e iconografia (UI07)
Emojis restantes: saudação 👋 em `Dashboard.tsx`; 📊/📈 em `WeightEvolutionChart.tsx` (linhas ~40, 56, 113); abas do perfil 🕒📈🧪🍲📝 em `PatientProfile.tsx` (~59–63); ⚠️ dos itens (A1.10); 🔑/✉️ em `PatientAccessModal.tsx`. Decidir as exceções decorativas e substituir os indicadores funcionais por SVG com nome acessível.

### UI-P2 — Tabelas e gráficos (UI08)
Histórico, e-mails e relatórios em 375/768/1440 px com dados longos e vazios: rolagem interna, colunas prioritárias ou cards, sem rolagem horizontal da página e com valores dos gráficos sem depender de hover.

### UI-P3 — Ganho em tarefas reais (UI10)
Revisão qualitativa (localizar paciente, revisar dieta, registrar adesão) com observação humana. Não declarar ganho de eficiência sem medição.

---

## 4. Fora do escopo atual (só com pedido do usuário)

- Personalização por aversões, alimentos recusados, tempo de preparo e contexto cultural (diagnóstico nº 13).
- Ampliação do catálogo além dos 123 alimentos (pode ser necessária para A2 no perfil vegano; registrar se bloquear).
- Tema escuro.

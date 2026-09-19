# Pendências reais — Storm Nutrition

Atualizado em 19/09/2026. Este arquivo contém trabalho ainda não comprovado; a existência de um componente ou uma suíte verde não encerra todos os critérios de UI. Consulte [feito.md](feito.md) e [a validação atual](docs/validacao-2026-09-19/README.md) para entregas efetivas. O resumo anterior foi preservado em [arquivo histórico](docs/validacao-2026-09-19/resumo-anterior.md); suas declarações de conclusão integral não são o status atual.

## 1. Correções desta revisão

- Paciente arquivado: bloqueio no servidor para peso, histórico, adesão e autoavaliação; quatro regressões exigem negação no estado arquivado e sucesso do mesmo payload após restauração.
- Contexto clínico: selo informativo “Condição considerada”, sem promessa de condição respeitada; regressões PT/EN preservam o status real de revisão.
- Evidência: nova execução local com logs e manifesto SHA-256, separada das execuções anteriores.
- Documentação: retirada a afirmação de UI01–UI12 integralmente concluídas; as lacunas abaixo permanecem abertas até evidência específica.
- Apresentação/entrega: README sem contadores fixos desatualizados e com identificação da validação local. GitHub/CI remota/demo exigem confirmação separada da versão publicada.

## 2. Incongruências encontradas na geração

Diagnóstico funcional e clínico do motor algorítmico (`dietAlgorithmService.ts:1107`), tipagem de alimentos (`src/types/food.ts:66`), fluxo de geração (`DietGenerator.tsx:369`), exibição de alertas (`DietPlanDisplay.tsx:349`), modal de exportação (`ExportDietModal.tsx:33`) e exportador PDF (`pdfExporter.ts:374`).

### Diagnóstico de problemas

#### Falhas no motor e na modelagem nutricional
1. **O tipo de refeição não orienta os alimentos:** O gerador utiliza as mesmas categorias de proteína, carboidrato e gordura no café, lanche, almoço e jantar. O nome da refeição é usado apenas como identificador cosmético, não como regra de seleção alimentar.
2. **A seleção é um sorteio entre categorias amplas:** Carnes, leguminosas e laticínios ocupam o mesmo papel indistinto de “proteína”, independentemente da ocasião culinária (ex.: feijão no café/lanche ou combinações anômalas como patinho moído com açaí e amêndoas).
3. **Falta de composição culinária:** O sistema reúne três alimentos isolados sem conceber uma preparação gastronômica coerente (ex.: “frango + tapioca” como preparação específica vs. itens soltos).
4. **Estrutura rígida de três fontes:** Todas as opções são forçadas a conter exatamente 1 fonte de proteína, 1 de carboidrato e 1 de gordura, descaracterizando refeições menores e forçando acompanhamentos desnecessários.
5. **Alternativas geradas sem equivalência:** Opção principal e alternativas são sorteadas independentemente; o sistema apenas mede o desvio *a posteriori*, gerando distorções extremas (ex.: desvios de −79% de carboidrato e +97% de gordura).
6. **Ausência de loop de auto-correção/reparo:** O fluxo apenas gera, valida e exibe o erro ao usuário. Não tenta ajustar gramaturas, substituir ingredientes incompatíveis ou descartar alternativas inviáveis antes da apresentação.
7. **Cálculo de porções desacoplado (não conjunto):** Calcula cada alimento pelo seu macronutriente primário e depois reescala tudo pelas calorias totais. Como a maioria dos alimentos contribui com múltiplos nutrientes, o escalonamento calórico desequilibra proteína, carboidrato e gordura simultaneamente.
8. **Limites de porção genéricos e ausência de medidas caseiras:** Intervalo uniforme de 5–450 g aplicado a qualquer alimento, sem limites culinários realistas nem conversão para medidas caseiras (resultando em porções impensáveis como 93 g de azeite ou 198 g de frango).
9. **Inconsistência de unidades (g vs. ml):** Itens com base em ml (como azeite e leite) têm suas quantidades tratadas como gramas sem conversão de densidade.
10. **Tratamento divergente de restrições e condições clínicas:** A geração filtra algumas restrições pontualmente, mas trata diabetes e hipertensão por `clinicalTags`, enquanto a validação também busca essas condições em `dietaryRestrictions`. Um alimento pode ser selecionado e reprovado na sequência.
11. **Alergias registradas ignoradas na geração:** O campo `foodAllergies` é concatenado em `specialObservations`, mas não é enviado de forma estruturada para as opções do gerador (`DietGenerationOptions`). Alergias do cadastro não são bloqueadas automaticamente.
12. **Falta de controle de variedade e repetição:** O sorteio não exclui escolhas anteriores nem avalia redundância entre opções da mesma refeição ou entre refeições do mesmo dia.
13. **Ausência de personalização de rotina e aceitação:** O contrato não contempla aversões alimentares, alimentos recusados, tempo de preparo ou contexto cultural.
14. **Descrição fixa artificial:** O texto “Preparação saudável” é aposto a todas as opções indiscriminadamente, mesmo quando o validador aponta incompatibilidade nutricional.

#### Incongruências nos avisos e na entrega
1. **Lista de avisos extensa e repetitiva:** Exibição bruta de advertências técnicas sem agrupamento por refeição nem caminho claro de resolução.
2. **Falta de hierarquia de gravidade:** Violações impeditivas graves e pequenas variações percentuais de macronutrientes dividem o mesmo contêiner visual de alerta.
3. **Mensagens genéricas e opacas:** Mensagens como “Viola restrições prescritas” omitem qual alimento violou, qual regra foi infringida e como corrigir.
4. **Erros de i18n e interpolação:** Chaves ausentes em PT (ex.: `ALTERNATIVE_MACRO_DEVIATION`) geram fallback bruto em inglês; parâmetros de calorias com nomes divergentes deixam campos vazios.
5. **Tolerância fixa e inadequada de 5%:** Compara percentuais arredondados sobre valores pequenos, gerando alertas irrelevantes para variações mínimas absolutas.
6. **Planos reprovados com aparência de finalizados:** Planos que falham nas regras continuam exibindo tabelas completas e descrições positivas, sem deixar claro que se trata de rascunho com falha estrutural.
7. **Exportação sem barreira de validação:** O modal de exportação permite gerar PDF de planos inválidos ou não liberados, burlando as travas existentes no salvamento.
8. **Divergência entre formatos de exportação:** O PDF estruturado inclui avisos técnicos internos; a captura visual esconde o bloco via `.no-export`.
9. **Falso selo de aprovação profissional:** O validador atribui `isApproved = true` por critérios matemáticos automáticos, e a UI exibe “Aprovado pelo profissional”, substituindo a chancela humana real.
10. **Alerta indevido de sódio:** Qualquer teor de sódio maior que zero é exibido como advertência, independentemente de estar dentro dos limites preconizados.

---

### Plano de execução por ordem de prioridade

#### P0 — Integridade, segurança clínica e bloqueio de entrega inadequada [CONCLUÍDO — 19/09/2026]
*Objetivo: garantir que nenhum plano inválido saia como prescrição pronta e que restrições vitais sejam invioláveis.*

1. **Separação estrita de estados do plano (Concluído):**
   - Implementada máquina de estados formal em `src/types/diet.ts` e serviços: `draft` (rascunho inicial não aprovado), `blocked` (bloqueado por violação impeditiva/inviabilidade), `awaiting_review` (aguardando revisão profissional de divergências) e `clinically_approved` (aprovado exclusivamente pelo profissional humano).
   - Eliminada a mutação automática de `isApproved = true` pelo validador algorítmico sintético. A aprovação clínica agora exige assinatura humana com UID, nome, CRN e timestamp registrado (`ClinicalApproval`).
   - Gating estrito de entrega: exportação em PDF estruturada (`buildCustomLayoutPdfDocument`) e visual (`generateScreenshotPdf`) rejeitam planos com status `blocked` lançando erro impeditivo; planos em `draft` ou `awaiting_review` recebem marca d'água ostensiva de rascunho clínico não liberado; o portal do paciente (`PortalDietsSection.tsx`) filtra estritamente para exibir apenas dietas com `status === "clinically_approved"`. Corrigido o teto de sódio no PDF para disparar apenas se exceder as cotas clínicas (> 2000mg geral ou > 1500mg renal).
2. **Pipeline unificado de restrições, condições e alergias (Concluído):**
   - Criado `clinicalScreeningService.ts` com funções `parseAllergies`, `matchFoodAllergen`, `buildUnifiedClinicalContext` e `evaluateFoodCompatibility`, estabelecendo fonte única da verdade para motor e validador.
   - Suporte estruturado a `foodAllergies` integrado ao gerador (`generateAlgorithmicDietPlan`), com exclusão individual registrada no `decisionLog` com código `EXCLUDE_ALLERGEN` e detecção em `validateDietPlan` (`ALLERGY_VIOLATION`), marcando o plano como `infeasible` (`blocked`).
   - Normalização bidirecional entre `clinicalTags` e `dietaryRestrictions` (diabetes, hipertensão, renal, esteatose e alergias derivadas), sincronizando restrições entre seleção e validação.
   - Baterias de regressão aprovadas: `clinicalScreeningService.test.ts` (11 testes), `dietAlgorithmService.test.ts` (47 testes), `dietService.test.ts` (23 testes), `pdfExporter.test.ts` (20 testes) e suíte total (454 testes verdes, build e type-check 100% limpos).

#### P1 — Inteligência culinária, modelagem de refeições e cálculo conjunto [CONCLUÍDO — 19/09/2026]
*Objetivo: transformar o gerador em um planejador alimentar realista, culinariamente coerente e matematicamente equilibrado.*

3. **Modelagem de refeições por arquétipos culinários (Concluído):**
   - Criado o serviço `src/services/mealArchetypeService.ts` introduzindo tipos canônicos de refeição (`breakfast`, `morning_snack`, `lunch`, `afternoon_snack`, `dinner`, `supper`), mapeamento semântico por nome/horário (`classifyMealArchetype`) e regras de filtragem estritas (`isFoodSuitableForArchetype`).
   - Eliminação de combinações bizarras: carnes pesadas (bovino, aves, peixes) e feijão/leguminosas foram terminantemente proibidos no café da manhã e lanches (permitindo ovos e laticínios); pães de forma, torradas e cereais matinais foram restritos de almoço e jantar; preparações matinais e de lanches agora priorizam frutas, laticínios, pães e ovos.
   - Substituição da string arbitrária estática `"preparação saudável"` por descrições contextuais multilíngues derivadas do arquétipo de cada refeição (ex: `"Preparação matinal rápida (grelhado, tostado ou in natura)"` ou `"Grelhado ou cozido com temperos naturais e azeite"`).
4. **Cálculo de porções conjunto e normalização de unidades (Concluído):**
   - Criado `src/services/portionLimitsService.ts` estabelecendo limites fisiológicos e gastronômicos granulares por alimento e categoria (`getPortionBoundaries` e `clampPortion`): azeite e óleos restritos a 5–20 ml (resolvendo de forma definitiva o bug histórico de azeite em 93g/450g), manteiga a 5–30g, castanhas a 10–40g, ovos a 50–200g, queijos a 20–70g, carnes a 60–200g, cereais cozidos a 50–260g e leguminosas a 40–160g.
   - Normalização para medidas caseiras brasileiras autênticas via `formatHouseholdMeasure` (ex: colheres de sopa/chá, fatias, conchas, unidades, copos, xícaras) com conversão de densidade para líquidos.
   - Solver conjunto multivariado (`solvePortions`) com convergência em loop de 3 iterações e absorção de margem remanescente por alimentos com folga de gramatura.
5. **Alternativas com substituição equivalente e loop de auto-correção (Concluído):**
   - Seleção de alternativas por equivalência funcional respeitando as categorias prioritárias do arquétipo (`preferredCategories`).
   - Implementado loop de auto-correção na geração com reajuste proporcional de gramatura e até 3 tentativas de seleção de novos candidatos funcionais, garantindo divergência calórica $\le 20\%$ em relação à opção principal.
6. **Redesenho dos avisos e experiência de revisão (Concluído):**
   - Reestruturada a interface de alertas em `src/components/diet-generator/DietPlanDisplay.tsx`: bloqueios clínicos e inviabilidades (`level === "error"`) são destacados em card prioritário no topo em tom rose/vermelho com `XCircleIcon`, enquanto avisos e alertas secundários são agrupados em card âmbar com `AlertTriangleIcon`.
   - Corrigido o teto de sódio de pior caso: alerta disparado apenas quando exceder os tetos clínicos recomendados ($> 1500\text{ mg}$ renal, $> 2000\text{ mg}$ hipertensão, $> 2300\text{ mg}$ geral), e não mais em qualquer valor $> 0$.
   - Adicionadas chaves i18n ausentes (`ALLERGY_VIOLATION`, `ALTERNATIVE_MACRO_DEVIATION`, `clinical_blockers_title`, `clinical_warnings_title`) em `pt/common.json` e `en/common.json` com parâmetros de interpolação completos e paridade 100% testada.
   - Baterias de regressão aprovadas: `mealArchetypeService.test.ts` (8 testes), `portionLimitsService.test.ts` (6 testes), `dietAlgorithmService.test.ts` (51 testes), suíte global (50 arquivos, 471 testes passando, regras Firestore 101/101, build e type-check 100% limpos).

#### P2 — Validação empírica, testes de aceitação e comprovação de qualidade [CONCLUÍDO — 19/09/2026]
*Objetivo: comprovar a qualidade nutricional e gastronômica com cenários reais de consultório.*

7. **Bateria de testes de aceitação clínica e gastronômica (Concluído):**
   - Criada suíte completa em `src/services/__tests__/clinicalAcceptancePersonas.test.ts` cobrindo 7 personas clínicas reais de consultório:
     1. **Hipertenso Grave:** restrição de sódio por alimento ($\le 400\text{ mg}$) e diário de pior caso ($< 2000\text{ mg}$), sem embutidos nem queijos curados, decisão `LIMIT_SODIUM_HYPERTENSION`.
     2. **Diabético Tipo 2:** eliminação completa de açúcares refinados, doces e alimentos de alto índice glicêmico ($\text{IG} \ge 70$), decisões `LIMIT_GI_DIABETES` e `RESTRICT_DIET_TYPE`.
     3. **Celíaco:** 100% livre de glúten (`containsGluten !== true`), sem trigo, centeio, cevada ou pães tradicionais em principais ou alternativas, decisão `EXCLUDE_GLUTEN`.
     4. **Vegano Estrito:** 100% livre de produtos e derivados de origem animal (carnes, aves, peixes, ovos, laticínios, mel), fontes proteicas exclusivamente vegetais, decisão `EXCLUDE_ANIMAL_PRODUCTS`.
     5. **Alergias Múltiplas (Castanhas + Camarão/Frutos do Mar + APLV/Leite):** exclusão individual de cada alérgeno via `matchFoodAllergen`, zero contaminações em refeições e alternativas, decisões `EXCLUDE_ALLERGEN` registradas.
     6. **Renal Crônico (CKD pré-diálise):** sódio ultra-baixo ($< 200\text{ mg}/100\text{g}$ nos alimentos), pior caso diário $\le 1500\text{ mg}$ e proteína estritamente controlada ($55\text{ g}$), decisão `LIMIT_SODIUM_RENAL`.
     7. **Esteatose Hepática:** restrição estrita de gorduras saturadas, frituras e banha, óleos restritos a azeite de oliva extra virgem, decisão `RESTRICT_SATURATED_FATS_HEPATIC`.
   - **Bateria de multi-sementes para ausência de pares bizarros:** Testadas 20 sementes pseudo-aleatórias (10 a 8901) comprovando:
     - Nunca feijão, lentilha, grão-de-bico ou carnes pesadas (bovina, aves, peixe) no café da manhã ou lanches.
     - Nunca pão de forma, biscoito ou cereais matinais no almoço ou jantar.
     - Porção de azeite e óleos estritamente $\le 20\text{ ml}$ em 100% das refeições e sementes.
     - Ausência de pares bizarros (patinho com açaí/mamão, peixe com banana, etc.).
   - **Consistência exaustiva das alternativas:** Avaliadas 10 sementes com centenas de combinações demonstrando que 100% das opções alternativas geradas mantêm divergência calórica $\le 20\%$ em relação à principal.
   - **Gating de PDF e exportação na máquina de estados:**
     - `blocked`: exportação barrada com erro impeditivo.
     - `draft`: exportação permitida com marca d'água ostensiva de rascunho clínico.
     - `awaiting_review`: exportação permitida com marca d'água ostensiva de rascunho clínico.
     - `clinically_approved`: exportação com carimbo profissional formal (nome, CRN, assinatura) e sem marca d'água.
   - Suíte de aceitação aprovada: `clinicalAcceptancePersonas.test.ts` (13/13 testes verdes). Suíte global: 51 arquivos, 485 testes vitest verdes, regras Firestore 101/101, build e type-check 100% limpos.

---

## 3. Ordem de implementação e critérios de aceite (UI e Design System)

### P1 — UI02/UI09: estados e feedback consistentes

1. Inventariar estados de dieta em `DietPlanDisplay`, `DietPlanViewer`, histórico do perfil, portal e `pdfExporter`. Registrar por superfície: válido, requer revisão, inviável, aprovado, edição manual e legado não revalidado.
2. Reutilizar os tons/textos de `docs/design-system.md`. Nunca deduzir aprovação a partir de tags clínicas. O PDF pode usar primitivas próprias, mas deve preservar o significado e texto do mesmo estado.
3. O componente `Alert` já existe, assim como usos no portal e badges no gerador/exames; não recriá-los. Conferir consumidores restantes e usar anúncio apropriado: erros urgentes como alert, confirmações como status.
4. Conferir salvar/enviar/exportar: impedir duplicação durante processamento, manter geometria, mostrar sucesso somente após resolução real e permitir recuperação de erro. E-mail simulado deve continuar identificado.
5. Exercitar cada estado com dados sintéticos PT/EN; medir contraste normal, hover e foco no navegador. Documentar política de desabilitados separadamente, sem afirmar conformidade de todos os estados a partir do teste normal.

**Resultado/aceite:** matriz superfície × estado preenchida, sem contradições entre tela e PDF; evidências das operações com sucesso/falha/espera. Galeria aprovada sozinha não encerra migração de consumidores.

### P1 — UI12: completar a revisão visual de aceitação

1. Usar emuladores e dados sintéticos. Registrar rota, viewport, idioma, tema e versão em cada captura; preservar as capturas históricas.
2. Conferir 375, 768 e 1440 px, PT e EN, priorizando as lacunas da matriz abaixo. Para reflow, manter o teste de 320 px.
3. Incluir estados carregando, vazio, sem resultados, erro e dados longos, onde aplicáveis. Não confundir screenshot com JSON/DevTools ou apenas teste axe.
4. Registrar defeitos por tela, corrigi-los e recapturar somente os cenários afetados. Conferir teclado, foco, nome acessível, rolagem e ação principal.
5. Revisar visualmente o PDF exportado do mesmo plano persistido (quebras, textos, macros e avisos). Pedir avaliação humana externa depois de preparar o conjunto de evidências.

| Área | Evidência ainda necessária |
| --- | --- |
| Público e navegação | Home e shell a 768 px; menu e cabeçalhos EN longos |
| Dashboard | EN visual; hierarquia com dados longos |
| Pacientes | Formulário em etapas e EN visual |
| Dietas | Histórico, comparação e edição visual |
| Agenda | Criar/editar; 768 px |
| Relatórios | 375/768 px; dados extensos e vazios |
| Alimentos | Detalhe e 768 px |
| Calculadora, configurações e e-mails | Revisão visual dos fluxos |
| Portal | Sem plano, erro/acesso indisponível e autoavaliação |
| Transversais | Toasts e vocabulário dos diálogos |
| PDF | Revisão visual do arquivo exportado |

**Resultado/aceite:** nenhuma célula aplicável sem evidência ou justificativa aprovada de exclusão. As 12 imagens históricas cobrem parte da matriz, não toda ela.

### P2 — UI05: concluir adoção dos controles

1. Inventariar controles locais nos modais de peso/senha, `SelfEvaluationForm`, `ProfileDietsTab`, convite e ErrorBoundary. Um `<button>` nativo não é automaticamente defeito: classificar se já cumpre o contrato antes de migrar.
2. Migrar duplicações para `Button`, `IconButton`, `Input`, `Select`, `Textarea` e `Checkbox` quando aplicável, preservando tipo submit/button, callbacks, validação e foco.
3. Garantir uma ação principal por contexto, nomes acessíveis e alvos conforme o design system.
4. Verificar cabeçalhos e modais em 320/375 px com os textos EN mais longos, teclado e loading.

**Resultado/aceite:** inventário com decisão por controle, testes dos comportamentos afetados e capturas sem corte/sobreposição. Criar o componente compartilhado não comprova adoção.

### P2 — UI04: texto ampliado e densidade

1. Manter mínimo operacional de 12 px; não confundir isso com teste de zoom.
2. Exercitar ampliação só de texto a 200% e textos EN longos em formulário, calendário, tabelas, badges e modais.
3. Corrigir alturas rígidas e cortes; documentar quando usar densidade confortável/compacta sem criar um seletor desnecessário.

**Resultado/aceite:** conteúdo/ações continuam acessíveis sem sobreposição; registrar método de ampliação, telas e capturas. O teste de reflow 320 px não substitui essa verificação.

### P2 — UI06: estados raros

1. Simular acesso indisponível/revogado/arquivado, erro de leitura, ausência de plano, histórico vazio e falha recuperável.
2. Diferenciar espera de ausência de dados e de acesso negado. Oferecer ação apropriada (tentar novamente, voltar ou contatar profissional), sem prometer sucesso.
3. Conferir mensagens PT/EN e evitar chave de tradução exposta.

**Resultado/aceite:** catálogo de estados por tela com recuperação verificada. O EmptyState da lista e o loading do portal já existem; ampliar cobertura.

### P2 — UI07: consistência de marca e iconografia

1. Revisar emojis ainda presentes (por exemplo, saudação em `Dashboard` e gráfico em `WeightEvolutionChart`) e abas do perfil; decidir exceções decorativas explicitamente.
2. Substituir indicadores funcionais por SVG do conjunto atual, preservando texto/nome acessível; aplicar raios e marca documentados.
3. Conferir visualmente portal sem plano, erro e autoavaliação e o status da dieta (também UI02).

**Resultado/aceite:** inventário das exceções e capturas consistentes. Não declarar ausência de emojis globalmente enquanto ainda existirem.

### P2 — UI08: tabelas e gráficos restantes

1. Revisar histórico, e-mails e relatórios em 375/768/1440 px com linhas/textos extensos e conjuntos vazios.
2. Escolher por tabela rolagem interna, colunas prioritárias ou representação em cards. `overflow-x-auto` sozinho não comprova usabilidade.
3. Garantir cabeçalhos associados, números/unidades legíveis, foco visível e acesso a todas as ações; manter valores dos gráficos disponíveis sem hover.

**Resultado/aceite:** dados e ações acessíveis nas larguras testadas e sem rolagem horizontal da página inteira.

### P3 — UI10: confirmar ganho em tarefas reais

1. Selecionar tarefas curtas (localizar paciente, revisar dieta, registrar adesão).
2. Comparar hierarquia, feedback e movimento com imagens de interface válidas; diagnósticos de rede não servem como “antes”.
3. Registrar observações humanas e ajustes necessários; não inventar ganho de eficiência sem medição.

**Resultado/aceite:** revisão qualitativa identificada ou medição com método/amostra; o teste de ausência de animações infinitas já cobre apenas o aspecto automatizável.

### Entrega — versão visível para avaliadores

1. Revisar o manifesto da validação atual e o `git diff`, incluindo novos arquivos. Preservar alterações de outros autores; não resetar a árvore.
2. Após autorização de publicação, preparar commit/branch com fontes, testes, configurações e documentação necessários, excluindo ambientes privados e artefatos gerados.
3. Executar CI do commit e guardar URL/identificador e resultados. Validar Node/Java declarados pela CI; o ambiente local pode ser diferente.
4. Publicar a versão pretendida e verificar login/demo e fluxo essencial. Associar implantação ao mesmo commit e atualizar README com o estado confirmado.

**Resultado/aceite:** avaliador acessa exatamente a versão identificada, com CI verificável. Arquivo local/manifesto não é push, CI remota nem deploy. Esta etapa permanece pendente; não afirmar que a demo já contém as correções.

## 3. Protocolo para implementação por outra IA

1. Ler este plano, `docs/design-system.md` e a validação mais recente; conferir os consumidores atuais antes de alterar.
2. Trabalhar um item por vez. Registrar: ID, arquivos, comportamento anterior/posterior, critérios exercitados, comando, resultado real e evidência visual quando exigida.
3. Não substituir este backlog por resumo de sucesso. Mover para `feito.md` somente critérios comprovados; manter subcritérios abertos explícitos.
4. Ao falhar, guardar o diagnóstico e corrigir a causa; não remover teste nem enfraquecer asserção para obter verde. Mudança intencional de contrato exige documentação e teste equivalente do novo comportamento.
5. Validar tipos/lint/formato/build, regressões afetadas e, ao encerrar, suítes integradas pertinentes. Executar wrappers de emulador sequencialmente para evitar disputa de portas.
6. Gerar novo manifesto após a última alteração. Alterar fonte/config/teste depois da validação exige repetir as verificações afetadas; resultados históricos não migram automaticamente.
7. Se houver bloqueio real, registrar o item exato, erro, tentativas e próxima ação. Não declarar UI01–UI12 completas enquanto houver lacunas na matriz.

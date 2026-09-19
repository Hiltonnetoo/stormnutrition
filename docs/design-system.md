# Design system — contrato de aparência (seção 3, UI01–UI10)

Registro das decisões de UI aplicadas em 18/09/2026. Fonte da verdade: `src/index.css` (tokens e camada de componentes) e `src/components/ui.tsx` (primitivos React). Verificação automatizada: `tests-e2e/design-system.spec.ts` (estilos computados no navegador) e `src/components/__tests__/designSystem.test.tsx` (nomes, ligações e i18n).

## 1. Tema suportado (UI03)

- **Escopo atual: somente tema claro.** `src/index.tsx` remove a classe `.dark` e a preferência salva antes da renderização; `:root { color-scheme: light }`.
- As classes `dark:` que ainda existem são **legado sem manutenção**. Não são garantidas nem testadas e não devem ser citadas como suporte a modo escuro. Novos componentes e tokens não usam `dark:`. As classes antigas saem quando a tela for editada, sem remoção em massa.
- Tokens inválidos foram corrigidos (`dark:bg-slate-855` → `slate-850` em Sidebar, LabExamsModule e ModeSelector).
- Um tema escuro exige uma implementação explícita, com persistência, superfícies, texto, controles nativos, contraste medido e revisão de todas as telas. Não pode ser ativado como efeito colateral.

## 2. Tokens (UI02)

A paleta (`sage`, `slate`, `emerald`, `amber`, `rose`, `sky`…) é a única fonte de cor. Os tons -400/-500/-600 foram ajustados na Etapa 15 para WCAG AA. Os tokens semânticos (`@theme inline`) apontam para esses tons por `var()` e não repetem hex:

| Função             | Token / utilitário         | Origem                   |
| ------------------ | -------------------------- | ------------------------ |
| Ação primária      | `primary`, `primary-hover` | sage-600 / sage-700      |
| Selecionado        | `selected`                 | sage-50                  |
| Foco               | `focus` (`outline-focus`)  | sage-600                 |
| Superfície / fundo | `surface`, `surface-muted` | branco / slate-50        |
| Borda              | `border`                   | slate-200                |
| Texto / secundário | `text`, `text-muted`       | slate-900 / slate-500    |
| Sucesso            | `success`, `success-bg`    | emerald-700 / emerald-50 |
| Atenção            | `warning`, `warning-bg`    | amber-700 / amber-50     |
| Erro               | `danger`, `danger-bg`      | rose-700 / rose-50       |
| Informação         | `info`, `info-bg`          | sky-700 / sky-50         |

Os tokens duplicados anteriores (`--color-accent`, `--color-success: #059669` etc.) não tinham consumidores e foram removidos. O contraste é medido no navegador (seção 7), não nos comentários do CSS.

**Estados usam `Badge` semântico** (`success | warning | danger | info | neutral | brand`) com texto e, para estados, ícone. A cor nunca carrega o significado sozinha. Os tons de paleta (`sage`, `sky`, `amber`, `rose`, `slate`, `emerald`) continuam como aliases compatíveis.

Status do plano no gerador (UI09):

| Estado                         | Badge   | Ícone         |
| ------------------------------ | ------- | ------------- |
| Dentro das metas (`valid`)     | success | CheckCircle   |
| Requer revisão clínica         | warning | AlertTriangle |
| Inviável                       | danger  | XCircle       |
| Aprovado pelo profissional     | brand   | Shield        |
| Edição manual                  | info    | Edit          |
| Plano anterior, não revalidado | neutral | —             |

Edição manual e aprovação são badges diferentes. "Dentro das metas" não significa "aprovado".

## 3. Camadas e composição (UI01)

- Classes de componente (`.btn*`, `.input-field`, `.card*`, `.badge*`, `.eyebrow`, `.focus-ring`) ficam em **`@layer components`**, que a cascata aplica antes de `utilities`. Um utilitário na marcação (`px-6`, `w-full`, `border-rose-400`) sempre vence o componente. **Não use `!important`** para ajustes.
- Botão = `btn` (base + tamanho md) + **uma** variante (`btn-primary | btn-secondary | btn-ghost | btn-danger`, só cor) + tamanho opcional (`btn-sm | btn-lg`, só geometria). A variante nunca repete geometria, então a ordem das classes não muda o tamanho.
  - sm: 8×14 px, 14 px, raio 8 · md: 10×20 px, 14 px, raio 12 · lg: 14×28 px, 16 px, raio 16.
  - `btn-icon`: quadrado de 40 px (36 px com `btn-sm`); use o componente `IconButton`.
- O erro de campo vem de `aria-invalid="true"` (`.input-field[aria-invalid="true"]`), não de classes de borda.
- Desabilitado: cores explícitas `slate-100` (fundo), `slate-400` (texto), `slate-200` (borda), cursor `not-allowed` e opacidade 1; sem redução global de opacidade. Ghost preserva fundo/borda transparentes. O teste da galeria verifica os tokens do botão primário desabilitado e sua geometria. Não se declara contraste AA de controles inativos a partir desse teste.
- Tags clínicas indicam contexto: badge `info`, “Condição considerada”/“Condition considered”. Não certificam adequação; o status de validação/aprovação é separado.
- Carregamento: `Button loading` mantém a geometria (sem deslocamento), fica desabilitado e usa `aria-busy`.

## 4. Controles (UI05)

- `IconButton`: nome acessível obrigatório (`label` → `aria-label` + `title`), `type="button"`, alvo ≥ 36–40 px. `CloseButton` usa esse componente.
- `Input`, `Select`, `Textarea` e `Checkbox` compartilham rótulo, ajuda (`field-hint`) e erro (`field-error`) com `aria-describedby`/`aria-invalid`.
- Pedidos de texto usam `Modal` + formulário, nunca `window.prompt` (o nome do modelo de dieta foi migrado).
- `PageHeader`: as ações quebram linha (`flex-wrap`) em telas estreitas.
- Cada contexto tem uma ação primária. Ações secundárias usam `secondary`/`ghost` e ações destrutivas usam `danger` ou `ghost` em rose-700.

## 5. Tipografia e densidade (UI04)

| Função             | Classe                                                           | Uso                                              |
| ------------------ | ---------------------------------------------------------------- | ------------------------------------------------ |
| Título de página   | `text-2xl sm:text-3xl font-extrabold` (`PageHeader`)             | um `h1` por tela                                 |
| Seção              | `text-lg font-bold`                                              | `h2`/`h3` de cartões e modais                    |
| Corpo              | `text-sm`/`text-base`                                            | parágrafos e tabelas                             |
| Metadado / legenda | `text-xs` (12 px)                                                | datas, unidades, ajuda                           |
| Rótulo             | `input-label` (14 px, semibold) ou `eyebrow` (12 px, caixa alta) | campos / sobretítulos                            |
| Número             | `stat-number` ou `tabular`                                       | valores comparáveis, colunas alinhadas à direita |

**Mínimo de 12 px para texto operacional.** As ocorrências de 8–11 px em telas de trabalho foram elevadas para `text-xs`. A exceção são os mockups ilustrativos da landing. A fonte continua Plus Jakarta Sans. Espaçamento regular: `gap-3`/`gap-4` entre controles, `p-5`/`p-6` em cartões, `mb-8` sob o cabeçalho da página. O dashboard é amplo, os formulários são mais estreitos e o portal é simples, de propósito.

## 6. Superfícies, raios e movimento (UI07, UI10)

- Raios: cartões e seções `rounded-2xl`; modais `rounded-3xl` (folha inferior no celular); botões `rounded-xl` (sm `rounded-lg`, lg `rounded-2xl`); badges `rounded-full`.
- Três níveis de elevação: `card` (plano, `shadow-soft`), `card-elevated` (`shadow-card`) e menus/modais (`shadow-pop`). `card-hover` é **só para cartões clicáveis**. Os cartões informativos (`StatCard` do dashboard e de relatórios) não têm mais hover nem elevação.
- Nenhuma animação infinita em telas de trabalho: saíram o ping da etapa atual, o ping dos indicadores de relatórios e o pulse do banner de demonstração. `prefers-reduced-motion` zera durações e atrasos. Skeletons animam só durante o carregamento.
- O portal usa a mesma marca do painel (`LogoIcon` sobre `sage-800`, sem gradiente), ícones SVG no lugar de emojis (check-in, refeições, senha, confirmação) e cartões `rounded-2xl`. O perfil do paciente também troca emojis por ícones.

## 7. Verificação

```bash
npm run test:e2e:emulated   # inclui tests-e2e/design-system.spec.ts
npm run screenshots         # UI11: capturas reais + docs/screenshots/manifest.json
```

A galeria de variantes (`design-system.spec.ts`) injeta botões, campos e badges na página com o bundle real e confere: geometria sm/md/lg em qualquer ordem de classes, precedência de utilitário, ícone, desabilitado, carregamento, texto longo, erro por `aria-invalid` e contraste renderizado ≥ 4,5:1 de primário, perigo e badges semânticos.

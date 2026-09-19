/**
 * Static screen for a startup failure (invalid configuration or app bundle
 * that could not load). Plain DOM and bilingual on purpose: it must work
 * without React, i18n or Firebase, which may be exactly what failed.
 */
export const renderStartupError = (
  rootElement: HTMLElement,
  details: string[],
) => {
  const container = document.createElement("div");
  container.setAttribute("role", "alert");
  container.style.cssText =
    "max-width:40rem;margin:4rem auto;padding:1.5rem;font-family:system-ui,sans-serif;color:#0f172a;line-height:1.5";

  const title = document.createElement("h1");
  title.textContent =
    "Não foi possível iniciar a aplicação · The application could not start";
  title.style.cssText = "font-size:1.25rem;margin:0 0 0.75rem";

  const intro = document.createElement("p");
  intro.textContent =
    "Configuração do Firebase inválida ou incompleta. Para rodar localmente sem credenciais, use `npm run dev:emulated`; para a nuvem, copie .env.example para .env.local e preencha os valores do seu projeto. · Invalid or incomplete Firebase configuration. Run `npm run dev:emulated` locally, or copy .env.example to .env.local with your project's values.";

  const list = document.createElement("ul");
  for (const detail of details) {
    const item = document.createElement("li");
    item.textContent = detail;
    list.appendChild(item);
  }

  container.append(title, intro, list);
  rootElement.replaceChildren(container);
};

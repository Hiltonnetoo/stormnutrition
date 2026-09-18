#!/usr/bin/env node
/**
 * Reproducible production-bundle report (Etapa 14).
 *
 * Runs the real `vite build` (same vite.config.ts) into a throw-away directory
 * and reports, for every emitted asset, the raw size and the size after gzip
 * (level 9) and brotli (quality 11) — the "transferred" estimate for a host
 * that compresses static files. It also derives, from Rollup's chunk graph:
 *
 *   - the initial load of the SPA (entry chunk + static imports + CSS);
 *   - the extra bytes each lazy route needs on top of the initial load;
 *   - which packages / source folders make up the initial chunk.
 *
 * No extra dependency: attribution comes from Rollup's `renderedLength`.
 *
 * Usage:
 *   node scripts/measure-bundle.mjs              # markdown report on stdout
 *   node scripts/measure-bundle.mjs --json out.json
 */
import { build } from "vite";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve, relative, sep } from "node:path";
import { gzipSync, brotliCompressSync, constants as zlib } from "node:zlib";

const ROOT = process.cwd();
const OUT_DIR = resolve(ROOT, "node_modules/.cache/storm-bundle-report");
const jsonArgIndex = process.argv.indexOf("--json");
const jsonOut =
  jsonArgIndex > -1 ? resolve(ROOT, process.argv[jsonArgIndex + 1]) : null;

/** Collected in generateBundle: one entry per emitted JS chunk. */
const chunks = new Map();

const collectChunkGraph = {
  name: "storm-collect-chunk-graph",
  generateBundle(_options, bundle) {
    for (const item of Object.values(bundle)) {
      if (item.type !== "chunk") continue;
      chunks.set(item.fileName, {
        fileName: item.fileName,
        name: item.name,
        isEntry: item.isEntry,
        isDynamicEntry: item.isDynamicEntry,
        facadeModuleId: item.facadeModuleId,
        imports: item.imports,
        dynamicImports: item.dynamicImports,
        css: [...(item.viteMetadata?.importedCss ?? [])],
        modules: Object.fromEntries(
          Object.entries(item.modules).map(([id, m]) => [id, m.renderedLength]),
        ),
      });
    }
  },
};

rmSync(OUT_DIR, { recursive: true, force: true });
await build({
  root: ROOT,
  logLevel: "warn",
  build: { outDir: OUT_DIR, emptyOutDir: true, reportCompressedSize: false },
  plugins: [collectChunkGraph],
});

const sizeOf = (fileName) => {
  const buf = readFileSync(resolve(OUT_DIR, fileName));
  return {
    raw: buf.length,
    gzip: gzipSync(buf, { level: 9 }).length,
    brotli: brotliCompressSync(buf, {
      params: { [zlib.BROTLI_PARAM_QUALITY]: 11 },
    }).length,
  };
};

const sum = (files) =>
  [...files].reduce(
    (acc, f) => {
      const s = sizeOf(f);
      return {
        raw: acc.raw + s.raw,
        gzip: acc.gzip + s.gzip,
        brotli: acc.brotli + s.brotli,
      };
    },
    { raw: 0, gzip: 0, brotli: 0 },
  );

/** Static-import closure of a chunk (JS + CSS files a browser must fetch). */
const closure = (fileName, seen = new Set()) => {
  if (seen.has(fileName)) return seen;
  seen.add(fileName);
  const chunk = chunks.get(fileName);
  if (!chunk) return seen;
  chunk.css.forEach((c) => seen.add(c));
  chunk.imports.forEach((i) => closure(i, seen));
  return seen;
};

const entry = [...chunks.values()].find((c) => c.isEntry);
const initialFiles = closure(entry.fileName);
const initial = sum(initialFiles);
const html = sizeOf("index.html");

const shortId = (id) =>
  relative(ROOT, id.replace(/^\0/, "")).split(sep).join("/");

const routes = [...chunks.values()]
  .filter((c) => c.isDynamicEntry)
  .map((c) => {
    const files = [...closure(c.fileName)].filter((f) => !initialFiles.has(f));
    // Chunks merged by Rollup have no single facade module; use the chunk name.
    const module = c.facadeModuleId
      ? shortId(c.facadeModuleId)
      : `${c.name} (chunk)`;
    return { module, files, ...sum(files) };
  })
  .sort((a, b) => b.raw - a.raw);

/** Group the entry chunk's modules by npm package or source folder. */
const groupOf = (id) => {
  const clean = shortId(id);
  const nm = clean.lastIndexOf("node_modules/");
  if (nm > -1) {
    const parts = clean.slice(nm + "node_modules/".length).split("/");
    return parts[0].startsWith("@") ? `${parts[0]}/${parts[1]}` : parts[0];
  }
  const parts = clean.split("/");
  return parts.length > 2 ? `${parts[0]}/${parts[1]}` : clean;
};

const composition = {};
for (const file of initialFiles) {
  const chunk = chunks.get(file);
  if (!chunk) continue;
  for (const [id, len] of Object.entries(chunk.modules)) {
    const g = groupOf(id);
    composition[g] = (composition[g] ?? 0) + len;
  }
}
const compositionSorted = Object.entries(composition)
  .sort((a, b) => b[1] - a[1])
  .map(([group, renderedBytes]) => ({ group, renderedBytes }));

const assets = [
  ...new Set([...chunks.keys(), ...routes.flatMap((r) => r.files)]),
]
  .concat([...initialFiles].filter((f) => f.endsWith(".css")))
  .filter((f, i, arr) => arr.indexOf(f) === i)
  .map((fileName) => ({ fileName, ...sizeOf(fileName) }))
  .sort((a, b) => b.raw - a.raw);
const total = assets.reduce(
  (acc, a) => ({
    raw: acc.raw + a.raw,
    gzip: acc.gzip + a.gzip,
    brotli: acc.brotli + a.brotli,
  }),
  { raw: 0, gzip: 0, brotli: 0 },
);

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const row = (label, s) =>
  `| ${label} | ${kb(s.raw)} | ${kb(s.gzip)} | ${kb(s.brotli)} |`;

const lines = [
  "## Bundle de produção",
  "",
  `Gerado em ${new Date().toISOString()} · vite build (vite.config.ts do repositório) · gzip nível 9 · brotli qualidade 11`,
  "",
  "| Conjunto | Bruto | gzip | brotli |",
  "| --- | ---: | ---: | ---: |",
  row("index.html", html),
  row(
    `Carga inicial (${initialFiles.size} arquivos: entry + imports estáticos + CSS)`,
    initial,
  ),
  row(`Todos os assets JS/CSS (${assets.length} arquivos)`, total),
  "",
  "### Custo adicional por rota lazy (além da carga inicial)",
  "",
  "| Módulo | Arquivos | Bruto | gzip | brotli |",
  "| --- | ---: | ---: | ---: | ---: |",
  ...routes.map(
    (r) =>
      `| ${r.module} | ${r.files.length} | ${kb(r.raw)} | ${kb(r.gzip)} | ${kb(r.brotli)} |`,
  ),
  "",
  "### Composição da carga inicial (bytes renderizados antes da minificação final)",
  "",
  "| Pacote / pasta | Bytes |",
  "| --- | ---: |",
  ...compositionSorted
    .slice(0, 20)
    .map((c) => `| ${c.group} | ${kb(c.renderedBytes)} |`),
  "",
];

console.log(lines.join("\n"));

if (jsonOut) {
  writeFileSync(
    jsonOut,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        compression: { gzipLevel: 9, brotliQuality: 11 },
        html,
        initial: { files: [...initialFiles], ...initial },
        total,
        routes,
        initialComposition: compositionSorted,
        assets,
      },
      null,
      2,
    ),
  );
  console.log(`JSON salvo em ${relative(ROOT, jsonOut)}`);
}

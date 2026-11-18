const fs = require("fs");
const path = require("path");
// Configuração do site. Não é preciso mexer aqui para adicionar obras:
// use o painel em /admin ou os arquivos em src/_data/murais e src/_data/obras.
const PREVIEW = process.env.PREVIEW === "1"; // prévia sem servidor (links relativos com index.html)
const NETLIFY = !!process.env.NETLIFY; // no Netlify, imagens são redimensionadas pelo Image CDN

const LANG_MAP = {
  pt: { murais: "murals", obras: "works", exposicoes: "exhibitions", sobre: "about", contato: "contact", obrigado: "thanks" },
  en: { murals: "murais", works: "obras", exhibitions: "exposicoes", about: "sobre", contact: "contato", thanks: "obrigado" },
};


// Ordem das camadas de estilo. No site publicado elas viram um único arquivo (css/site.bundle.css).
const CSS_LAYERS = ["site", "premium", "gloss", "refinement-g", "refinement-h", "refinement-i", "refinement-j", "refinement-k", "ajustes"];

// Lê largura e altura de JPG, PNG e WebP sem bibliotecas, para evitar saltos de layout.
const dimsCache = {};
function imageSize(src) {
  if (!src || /^https?:/.test(src)) return null;
  if (src in dimsCache) return dimsCache[src];
  let r = null;
  try {
    const b = fs.readFileSync(path.join(__dirname, "src", src.replace(/^\//, "")));
    if (b[0] === 0x89 && b.toString("ascii", 1, 4) === "PNG") r = { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    else if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
      const kind = b.toString("ascii", 12, 16);
      if (kind === "VP8X") r = { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
      else if (kind === "VP8 ") r = { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
      else if (kind === "VP8L") { const n = b.readUInt32LE(21); r = { w: 1 + (n & 0x3fff), h: 1 + ((n >> 14) & 0x3fff) }; }
    } else if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length) {
        if (b[i] !== 0xff) { i++; continue; }
        const m = b[i + 1];
        if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) { r = { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) }; break; }
        i += 2 + b.readUInt16BE(i + 2);
      }
    }
  } catch (e) { r = null; }
  return (dimsCache[src] = r);
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });
  eleventyConfig.addPassthroughCopy({ "src/files": "files" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg" });

  // URL relativa à página atual: funciona em qualquer domínio e na prévia.
  function rel(target, pageUrl) {
    if (!target || /^(https?:|mailto:|#)/.test(target)) return target;
    let t = target;
    if (PREVIEW && t.endsWith("/")) t += "index.html";
    const depth = (pageUrl || "/").split("/").filter(Boolean).length - (pageUrl && !pageUrl.endsWith("/") ? 1 : 0);
    const prefix = depth > 0 ? "../".repeat(depth) : "./";
    return prefix + t.replace(/^\//, "");
  }

  // Endereço público do site: usado em links canônicos, sitemap, idiomas e compartilhamento.
  eleventyConfig.addGlobalData("siteUrl", "https://netovettorello.com");
  eleventyConfig.addFilter("abs", (p) => {
    if (!p) return "";
    if (/^https?:/.test(p)) return p;
    return "https://netovettorello.com" + (p.startsWith("/") ? p : "/" + p);
  });
  eleventyConfig.addFilter("wh", (src) => { const d = imageSize(src); return d ? `width="${d.w}" height="${d.h}"` : ""; });
  eleventyConfig.addFilter("plain", (text, n) => {
    const s = String(text || "").replace(/\s+/g, " ").trim();
    if (!n || s.length <= n) return s;
    return s.slice(0, s.lastIndexOf(" ", n - 1)) + "…";
  });
  // JSON para dados estruturados: remove campos vazios.
  const prune = (v) => {
    if (Array.isArray(v)) return v.map(prune).filter((x) => x !== undefined);
    if (v && typeof v === "object") {
      const o = {};
      for (const [k, x] of Object.entries(v)) { const y = prune(x); if (y !== undefined) o[k] = y; }
      return o;
    }
    return v === null || v === "" ? undefined : v;
  };
  eleventyConfig.addFilter("json", (v) => JSON.stringify(prune(v)).replace(/</g, "\\u003c"));

  // Junta as camadas de CSS num único arquivo publicado: uma requisição em vez de nove.
  eleventyConfig.addWatchTarget("src/css/");
  eleventyConfig.on("eleventy.after", ({ dir }) => {
    const css = CSS_LAYERS.map((n) => {
      const f = path.join(__dirname, "src/css", n + ".css");
      return fs.existsSync(f) ? `/* ${n}.css */\n` + fs.readFileSync(f, "utf8") : "";
    }).join("\n");
    fs.mkdirSync(path.join(dir.output, "css"), { recursive: true });
    fs.writeFileSync(path.join(dir.output, "css/site.bundle.css"), css);
  });

  eleventyConfig.addFilter("u", function (target) {
    return rel(target, this.page && this.page.url);
  });

  // Imagem: no Netlify, versão redimensionada em WebP/AVIF automaticamente.
  eleventyConfig.addFilter("img", function (src, width) {
    if (!src) return "";
    if (/^https?:/.test(src)) return src;
    if (NETLIFY) return `/.netlify/images?url=${encodeURIComponent(src)}&w=${width || 1600}&q=80`;
    return rel(src, this.page && this.page.url);
  });

  // Lista ordenada a partir de uma pasta de dados ({slug: dados}).
  eleventyConfig.addFilter("sorted", (obj) =>
    Object.entries(obj || {})
      .map(([slug, d]) => ({ slug, ...d }))
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || (b.year || 0) - (a.year || 0))
  );
  eleventyConfig.addFilter("featured", (arr) => (arr || []).filter((x) => x.featured));
  // Home: completa linhas de 3 (até 6 itens), usando os destaques primeiro.
  eleventyConfig.addFilter("fit3", (arr) => {
    const list = arr || [];
    const feat = list.filter((x) => x.featured), rest = list.filter((x) => !x.featured && x.status !== "sold");
    const n = Math.min(6, Math.max(3, Math.ceil(feat.length / 3) * 3));
    return feat.concat(rest).slice(0, n);
  });
  // Destaques primeiro, depois o resto, até n itens.
  eleventyConfig.addFilter("top", (arr, n) => {
    const l = arr || [];
    return l.filter((x) => x.featured).concat(l.filter((x) => !x.featured)).slice(0, n);
  });
  // Grade "bento" da home: 1 grande, 2 pequenas, 1 larga (uma obra horizontal, se houver).
  eleventyConfig.addFilter("bento", (arr) => {
    const l = (arr || []).filter((x) => x.status !== "sold");
    const pick = l.filter((x) => x.featured).concat(l.filter((x) => !x.featured)).slice(0, 4);
    const isWide = (x) => { const m = String(x.dimensions || "").replace(/,/g, ".").match(/([\d.]+)\s*[×x]\s*([\d.]+)/); return m ? +m[2] > +m[1] : false; };
    const wi = pick.findIndex((x, i) => i > 0 && isWide(x));
    if (wi > -1) pick.push(pick.splice(wi, 1)[0]);
    const slots = ["lg", "sm", "sm", "wd"];
    return pick.map((x, i) => ({ ...x, slot: slots[i] || "sm" }));
  });
  // Murais compridos (largura >= 2,5x a altura), do mais extenso ao menor, todos na mesma escala.
  eleventyConfig.addFilter("toScale", (arr, n) => {
    const parse = (s) => { const m = String(s || "").replace(/,/g, ".").match(/^\s*([\d.]+)\s*[×x]\s*([\d.]+)\s*m\s*$/i); return m ? { w: +m[1], h: +m[2] } : null; };
    const l = (arr || []).map((x) => ({ ...x, d: parse(x.dimensions) })).filter((x) => x.d && x.d.w >= 2.5 * x.d.h).sort((a, b) => b.d.w - a.d.w).slice(0, n);
    const max = Math.max(1, ...l.map((x) => x.d.w));
    return l.map((x) => ({ ...x, pct: +((x.d.w / max) * 100).toFixed(2), ar: +(x.d.w / x.d.h).toFixed(3), person: +((1.75 / x.d.h) * 100).toFixed(1) }));
  });
  eleventyConfig.addFilter("countries", (arr, lang) => [...new Set((arr || []).map((x) => x["country_" + lang]).filter(Boolean))]);
  eleventyConfig.addFilter("after", (arr, slug, n) => {
    const i = arr.findIndex((x) => x.slug === slug);
    return arr.slice(i + 1).concat(arr.slice(0, Math.max(i, 0))).slice(0, n);
  });
  eleventyConfig.addFilter("neighbours", (arr, slug) => {
    const i = arr.findIndex((x) => x.slug === slug);
    return { prev: arr[(i - 1 + arr.length) % arr.length], next: arr[(i + 1) % arr.length] };
  });
  eleventyConfig.addFilter("paras", (text) =>
    (text || "").split(/\n\s*\n/).filter(Boolean).map((p) => `<p>${p.trim()}</p>`).join("")
  );
  eleventyConfig.addFilter("enc", (s) => encodeURIComponent(s || ""));

  // Endereço equivalente no outro idioma.
  eleventyConfig.addFilter("swapLang", (url, lang) => {
    const other = lang === "pt" ? "en" : "pt";
    const parts = (url || "/").split("/").filter(Boolean);
    if (parts[0] !== lang) return `/${other}/`;
    parts[0] = other;
    for (let k = 1; k < parts.length; k++) if (LANG_MAP[lang][parts[k]]) parts[k] = LANG_MAP[lang][parts[k]];
    return "/" + parts.join("/") + "/";
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    htmlTemplateEngine: "njk",
    templateFormats: ["njk"],
  };
};

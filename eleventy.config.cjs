// Configuração do site. Não é preciso mexer aqui para adicionar obras:
// use o painel em /admin ou os arquivos em src/_data/murais e src/_data/obras.
const PREVIEW = process.env.PREVIEW === "1"; // prévia sem servidor (links relativos com index.html)
const NETLIFY = !!process.env.NETLIFY; // no Netlify, imagens são redimensionadas pelo Image CDN

const LANG_MAP = {
  pt: { murais: "murals", obras: "works", exposicoes: "exhibitions", sobre: "about", contato: "contact", obrigado: "thanks" },
  en: { murals: "murais", works: "obras", exhibitions: "exposicoes", about: "sobre", contact: "contato", thanks: "obrigado" },
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });
  eleventyConfig.addPassthroughCopy({ "src/files": "files" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });

  // URL relativa à página atual: funciona em qualquer domínio e na prévia.
  function rel(target, pageUrl) {
    if (!target || /^(https?:|mailto:|#)/.test(target)) return target;
    let t = target;
    if (PREVIEW && t.endsWith("/")) t += "index.html";
    const depth = (pageUrl || "/").split("/").filter(Boolean).length - (pageUrl && !pageUrl.endsWith("/") ? 1 : 0);
    const prefix = depth > 0 ? "../".repeat(depth) : "./";
    return prefix + t.replace(/^\//, "");
  }
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

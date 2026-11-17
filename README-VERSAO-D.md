# Neto Vettorello — Versão D / Experience

Esta versão mantém o projeto Eleventy e o CMS existente, mas substitui a Home por uma experiência visual editorial com: hero cinematográfico, troca manual de obras, tipografia monumental responsiva, animação vinculada à rolagem, manifesto de contraste e galeria horizontal arrastável com setas.

## Publicação Netlify
1. Descompacte o ZIP.
2. Envie o conteúdo de `nv2/` para a **raiz** do repositório GitHub (não envie apenas o ZIP).
3. Build command: `npm run build`; Publish directory: `_site`.
4. O projeto original já tem `netlify.toml` com estas configurações.

## Onde editar
`src/_includes/pages/home.njk` — Home / projetos; `src/css/premium.css` — direção de arte; `src/js/premium.js` — interações; `src/_data/site.json` — conteúdo configurável.

O arquivo `PREVIA-VERSAO-D.html` é uma amostra independente da experiência, incluída separadamente no pacote de prévia ZIP. Não substitui o site compilado.

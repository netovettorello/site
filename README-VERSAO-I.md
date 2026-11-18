# Neto Vettorello — Versão I

## Correção central: slideshow da Home

O bloco antigo do banner foi **substituído** por um carrossel funcional com:

- nome do artista centralizado verticalmente;
- remoção de rótulos desnecessários da abertura ("selected projects", descrição, números e legendas de obras);
- controles de avançar e retroceder tanto nas laterais quanto na cápsula central;
- indicadores clicáveis com progresso sincronizado de cada slide;
- botão separado de **Pausar/Reproduzir** (retoma a contagem de onde parou);
- autoplay a cada 6 segundos;
- suporte a arraste horizontal com mouse, swipe no celular e teclado (setas esquerda/direita);
- comportamento acessível com aria-labels e preferência de movimento reduzido;
- CTA *Explorar* movido para o canto inferior esquerdo, para diminuir o conflito com o selo de hospedagem Netlify no canto direito.

A abordagem foi inspirada na lógica de navegação do site de produto da Apple, mas adaptada ao acervo e ao layout do artista, sem copiar ativos ou elementos proprietários.

## Conteúdo preservado

A versão I parte diretamente da versão H: conserva a Série Resistência com as imagens recebidas, as páginas existentes, o Eleventy, o CMS e o site bilíngue.

## Arquivos principais alterados

- `src/_includes/pages/home.njk` (hero, markup e acessibilidade)
- `src/css/refinement-i.css` (layout + acabamento do slider)
- `src/js/premium.js` (slideshow e arraste)
- `src/_includes/base.njk` (carregamento do novo CSS)
- `package-lock.json` restaurado para instalação reprodutível

## Deploy

Descompacte a pasta e copie seu **conteúdo** para a raiz do repositório `site` no GitHub Desktop. Faça commit e `Push origin`. No Netlify, mantenha `npm run build` ou `npx @11ty/eleventy` como comando de build e `_site` como pasta de publicação. Não envie arquivos ZIP para dentro do GitHub e não inclua `node_modules`.

## Testes

O componente do banner foi carregado em Chromium e foi verificado com cliques, controles laterais, teclado, pausa, retomada, autoplay, arraste com mouse e posicionamento desktop/mobile. Ainda não houve compilação completa do Eleventy neste ambiente; portanto, valide o deploy Netlify antes de substituir seu domínio definitivo.

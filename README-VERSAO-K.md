# Neto Vettorello — Versão K

Atualização visual e de navegação construída sobre a versão J.

## Ajustes

- Aproximação discreta entre as linhas “Neto” e “Vettorello”, com ajuste da descrição profissional logo abaixo.
- Seção Resistência reorganizada: título, texto curatorial curto e CTA em bloco editorial alinhado.
- Grade irregular substituída por carrossel horizontal com cinco obras, imagens preservadas sem cortes, seta anterior/próxima, indicadores e swipe nativo em telas sensíveis ao toque.
- Clique em uma obra do carrossel abre imagem ampliada; o botão “Explorar a série” abre a página específica da série.
- Redução do espaço vertical exagerado entre a galeria de murais e a seção “Na mesma escala”, com espaçamento interno mais compacto.
- Cores e cantos mantidos coerentes com a interface da versão J.

## Arquivos alterados

- `src/_includes/pages/home.njk`
- `src/_includes/base.njk`
- `src/css/refinement-k.css` (novo)
- `src/js/premium.js`

## Publicação

1. Descompacte o ZIP completo e copie os arquivos diretamente para a raiz do repositório local `site` (não copie uma pasta superior que contenha tudo).
2. Em GitHub Desktop: `Commit to main` e depois `Push origin`.
3. Confira o novo deploy em Netlify.

Se você já tem a versão J instalada, pode usar o ZIP de atualização menor, copiando seu conteúdo para a raiz do repositório e mantendo a estrutura de pastas.

## Validação

Teste isolado em Chromium do novo carrossel: setas, indicadores, último slide, retorno, zoom e viewport mobile. Sintaxe do arquivo JavaScript confirmada.
A compilação integral do Eleventy não pôde ser executada neste ambiente, portanto revise o deploy no Netlify antes de considerar publicado.

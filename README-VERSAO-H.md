# Versão H — refinamento estrutural e integração da série Resistência

## O que foi ajustado

### Home / Hero
- Removido o rótulo `Portfolio / 2026`.
- Removido o rótulo `Curitiba – International`.
- Removido o botão `NEXT` lateral.
- Substituído por uma navegação mais elegante com:
  - caption do projeto em destaque;
  - indicador de progresso;
  - dots clicáveis.
- Mantido o botão `Discover`, mas integrado visualmente ao sistema do hero.

### Arquitetura da Home
- Eliminada a redundância entre a seção `Artistic Practice` e o bloco `About`.
- A primeira seção após o hero agora funciona como introdução de prática.
- O CTA dessa introdução agora leva para `Selected works`, não para `About`.
- O bloco `About the artist` permanece como aprofundamento, com CTA próprio para a página Sobre.

### Selected Works
- Removido o rótulo `[ 002 — SELECTED WORKS ]`.
- Mantida a seção, porém reestruturada em formato mais editorial / premium.
- Inseridos cards para:
  - The Portal
  - Série Resistência
  - Tani É
  - Into the Reef

### Série Resistência
- Inserida no site como item real dentro de `Works`.
- Nova página própria da série com galeria das imagens anexadas.
- Integração de seção dedicada na Home com destaque visual.
- Imagens adicionadas em `src/img/resistencia/`.

### Motion / animações
- Adicionado sistema de entrada suave para blocos da Home via scroll.
- Hero com transição automática entre imagens e navegação por dots.
- Rail horizontal com navegação por setas e arraste.

## Arquivos principais alterados
- `src/_includes/pages/home.njk`
- `src/_includes/base.njk`
- `src/_includes/cards.njk`
- `src/_includes/pages/work.njk`
- `src/js/premium.js`
- `src/css/refinement-h.css`
- `src/_data/i18n.json`
- `src/_data/obras/resistencia.json`

## Observação
Esta pasta contém o projeto fonte para deploy / continuidade de edição.

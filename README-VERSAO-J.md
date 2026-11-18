# Neto Vettorello — Versão J

Refinamento de navegação e arquitetura de informação a partir da Versão I.

## Mudanças aplicadas
- Removida a seção introdutória de 'Practice' da Home, que duplicava informações já tratadas em 'About' e trazia um CTA redundante logo acima de Selected Works.
- Selected Works agora aparece logo após o hero.
- Removida a numeração decorativa dos headings Murais / Obras e renomeada a grade de Works na Home para Obras autorais / Original artworks, distinguindo-a da seleção editorial.
- Removidos os textos secundários que não acrescentavam informação à galeria.
- Todos os quatro cards de Selected Works agora levam a seus próprios projetos, em PT e EN:
  - The Portal: /pt/murais/the-portal/ e /en/murals/the-portal/
  - Into the Reef: /pt/murais/into-the-reef/ e /en/murals/into-the-reef/
  - Tani É: /pt/tani-e/ e /en/tani-e/
  - Resistência: /pt/obras/resistencia/ e /en/works/resistencia/
- Criada uma página exclusiva do personagem Tani É, com texto baseado no portfólio e conteúdo editável em Configurações > Tani É no Decap CMS.
- Adicionada descrição no projeto The Portal, antes sem conteúdo textual.
- Alterada a imagem do card da Resistência para uma obra vertical da série, evitando cortar a tipografia do banner original.
- Ajustado scroll-margin da galeria para evitar título encoberto pelo menu fixo.
- Otimizada a chamada de imagens da seleção usando o filtro de imagens existente.
- Mantidos o carrossel funcional do hero e as demais páginas.

## Verificações feitas
- Renderização de amostras com Jinja2 para inspeção (não substitui a compilação real do Eleventy/Nunjucks).
- Validado o destino dos 4 cards em PT e EN; cada link aponta para uma página distinta com título apropriado.
- Verificadas as referências locais das imagens e das novas páginas.
- Verificada sintaxe dos arquivos JavaScript e estrutura JSON/YAML do conteúdo e CMS.
- Verificado layout em Chromium offline, incluindo mobile (390px) sem overflow horizontal nas amostras.

## Pendente de validar no Netlify
- Compilação final do Eleventy na infraestrutura do Netlify.
- Funcionamento real do formulário de contato e links externos.
- Publicação do CMS e permissões de edição.
- Performance de carregamento em aparelhos reais com rede lenta.

## Instalação
1. Descompacte o ZIP.
2. No GitHub Desktop, use Show in Finder para abrir a pasta do repositório.
3. Copie o conteúdo descompactado para a raiz do repositório (não copie o ZIP inteiro).
4. Faça Commit to main e Push origin.
5. Após o deploy, teste /pt/tani-e/ e os cards de Selected Works.

Se você já está na Versão I, pode aplicar apenas `netovettorello-atualizacao-i-para-j.zip` preservando todos os outros arquivos.

# Auditoria de UI/UX — versão K

Novembro de 2026. Análise feita sobre o commit `b778678` (Versão K), compilado e testado em navegador (computador 1440 px, tablet 820 px, celular 390 px), com Lighthouse e verificação automática de links, imagens e acessibilidade.

## Veredito

A base é boa: navegação clara em seis seções, bilíngue de verdade, contato por formulário, páginas próprias por mural e obra, painel de edição. O que impedia o site de estar no padrão de um site de artista internacional era técnico e prático, não visual:

- páginas pesadas demais (home com 17 MB, página da Resistência com 36 MB);
- invisível para o Google em vários pontos (sem endereço canônico, sem sitemap, sem dados estruturados, mesma descrição em todas as páginas);
- obras sem a informação que um colecionador procura (técnica correta, preço, o que fazer quando a obra está vendida, imagem ampliada);
- partes da home que só podiam ser trocadas mexendo no código.

## Notas antes e depois (Lighthouse, celular)

| Página | Antes | Depois |
|---|---|---|
| Home | Acessibilidade 96, SEO 91, 17 MB | Acessibilidade 100, SEO 100, 5 MB |
| Série Resistência | SEO 91, 36 MB, layout "pulando" (CLS 0,34) | SEO 100, 4,4 MB, CLS 0 |
| Página de mural / obra | SEO 91 | SEO 100, Acessibilidade 100 |

O peso medido aqui é sem o redimensionamento automático do Netlify. No site publicado, as fotos chegam ainda menores.

## O que foi corrigido

**Desempenho**
- As 14 imagens da Resistência eram PNG de 2,7 MB cada. Agora são WebP com o mesmo visual e a transparência das bordas do papel: 35 MB viraram 3,5 MB.
- As 9 folhas de estilo (site, premium, gloss, refinement G a K) eram baixadas uma a uma. No site publicado viram um único arquivo. Os arquivos originais continuam separados para edição.
- Todas as imagens das páginas de obra, mural e exposição informam largura e altura: a página não "pula" enquanto carrega.
- O carrossel da abertura parava de ser animado só visualmente, mas continuava calculando o tempo todo. Agora para de verdade quando está pausado ou fora da tela, o que poupa bateria no celular.
- Fotos e PDF ficam guardados no navegador por 7 dias (visitas seguintes mais rápidas).

**Experiência de quem compra ou contrata**
- Visor de imagem em tela cheia em obras, murais e exposições: clique para ampliar, setas, teclado, deslizar no celular, contador "4 / 14".
- Série Resistência: a técnica aparecia como "técnica mista sobre tela". Agora: "Série de 13 obras sobre papel". O status mostra "Esgotada" em vez de "Vendida". A primeira imagem passou a ser uma obra (antes era o logotipo da série). As 14 imagens, que formavam uma coluna de 12 mil pixels, viraram uma grade ampliável: a página ficou 70% mais curta.
- Obras disponíveis mostram "Preço sob consulta. Envio internacional com certificado de autenticidade." acima do botão de consulta. É o padrão de galerias e explica o que acontece depois do clique.
- Obras vendidas não terminavam mais em um beco sem saída: agora há o botão "Ver obras disponíveis", que abre a lista já filtrada.
- Os filtros (país, disponíveis) ficam no endereço da página, então um link filtrado pode ser enviado a um colecionador.
- Fotos que não carregam (as hospedadas no Adobe) aparecem como um bloco neutro, não como ícone de imagem quebrada.

**Busca e compartilhamento (padrão internacional)**
- Endereço canônico e indicação de idioma (português, inglês e padrão) em todas as páginas.
- Sitemap com as 62 páginas públicas e `robots.txt`.
- Dados estruturados para o Google: Neto Vettorello como artista (Instagram, Vimeo, loja, registro de obras, Prêmio Curitiba), cada obra e mural como obra de arte (técnica, dimensões, ano, local), a exposição como evento.
- Descrição própria para cada página. Obras sem texto recebem uma descrição automática (título, técnica, dimensões, ano).
- Imagem de compartilhamento com endereço completo (antes não aparecia no WhatsApp e LinkedIn).
- Ícone do site (favicon) com o círculo do Tani É, claro ou escuro conforme o navegador.
- Página "não encontrada" bilíngue.

**Acessibilidade**
- Textos de botões em inglês nas páginas em português corrigidos ("Previous artwork", descrições do Tani É).
- Pontos do carrossel com área de toque mínima de 24 px.

**Facilidade de atualizar**
- "Obras selecionadas" e as 5 imagens da série na home agora são editáveis no painel (Configurações), em vez de escritas no código.
- Painel de obras ganhou: tipo "Obra sobre papel", campo de técnica livre (PT/EN) e a opção "É uma série?".
- Faltava o `.gitignore`: o repositório podia receber `node_modules` e arquivos ZIP. Adicionado.

**Ritmo visual**
- Os espaços entre seções da home variavam de 100 a 270 px. Agora ficam entre 100 e 170 px, sem buracos.

## Imagens que faltam (prioridade em ordem)

1. **Murals of Palestine (3 fotos), Seed of Earth (1) e Myth of Life (3).** Ainda vêm do servidor do Adobe Portfolio e vão quebrar quando o plano for cancelado. Não consegui baixá-las daqui. Salve as originais e suba pelo painel.
2. **Capa da exposição De Urihi a Òrun.** A atual é uma captura de tela de baixa resolução (34 KB). Precisa de 3 a 6 fotos de montagem: vista geral da sala, obras na parede, detalhe.
3. **Retrato do artista.** Atual com 63 KB, baixa resolução. Precisa de um retrato em alta (mínimo 2000 px) para a página Sobre, imprensa e compartilhamento.
4. **Série Resistência.** As imagens têm 1086 × 1448 px. No visor em tela cheia ficam suaves. O ideal são digitalizações com 2400 px ou mais no lado maior.
5. **Murais com uma foto só (9 de 13):** Connections, Emerald Table, The Exu Black Panther, Into the Reef, Nike Well Collective, Seed of Earth, The Future in Our Hands, The Portal, Tropical. Para cada um: vista geral, detalhe e uma foto com pessoas (dá a escala, que é o que vende mural).
6. **Obras com uma foto só (9 de 10):** para colecionadores, o padrão é frente, detalhe da superfície, lateral (espessura) e a obra num ambiente.
7. **Todas as outras fotos** foram extraídas do PDF do portfólio. Funcionam, mas as originais em alta resolução vão melhorar a nitidez em telas grandes.

Formato recomendado: JPG, lado maior entre 2400 e 3000 px. WebP só quando houver transparência.

## Dados que faltam

- Texto em 7 obras (Cabocla de Oxóssi, Equality, Mestres, Rapé, Respect, The Indigenous, Tribal Warrior) e em 7 murais (Connections, Emerald Table, The Exu Black Panther, Myth of Life, Nike Well Collective, Seed of Earth, The Future in Our Hands). Duas ou três frases bastam: a ideia, o contexto, a técnica.
- Dimensões de Murals of Palestine, Seed of Earth, Myth of Life e Think Outside the Box.
- Códigos NV do registro de obras: nenhuma obra tem. Com o código, a página da obra ganha o link para o certificado de autenticidade, que é um argumento forte de venda.
- Pendência antiga: Respect tem ano e dimensões diferentes no site da exposição (2023, 80 × 60 × 4). Confirmar.

## Recomendações que deixei para a sua decisão

Não alterei porque mudam escolhas visuais ou de conteúdo suas:

1. **Repetição na home.** The Portal aparece na abertura e em Obras selecionadas. Into the Reef aparece na abertura, em Obras selecionadas e no carrossel de murais. A Resistência tem cartão em Obras selecionadas e a seção inteira logo abaixo. Sugestão: em Obras selecionadas, trocar Resistência e The Portal por itens que não aparecem em outro lugar da home (já dá para fazer pelo painel).
2. **Controles da abertura.** São quatro grupos: setas laterais, cápsula com setas e pontos, pausa e "Explorar". As setas laterais repetem as da cápsula, e a da esquerda fica colada no nome. Sugestão: tirar as setas laterais.
3. **Lista para colecionadores.** Sites de artistas que vendem (o drop da Resistência esgotou em minutos) costumam ter um campo "Receba os próximos lançamentos por e-mail". Pode ser feito com o próprio Netlify Forms, sem custo.
4. **Camadas de estilo.** São 9 arquivos que se sobrescrevem, com várias regras forçadas (`!important`). O espaçamento de uma única seção é definido em 5 arquivos diferentes. Já ficou um arquivo só no site publicado, mas uma reorganização completa reduziria cerca de 100 KB para menos da metade e tornaria futuras mudanças mais seguras.
5. **Arquivos antigos no repositório.** `netovettorello-site-versao-c.zip` (15 MB) e os README das versões C a K estão no GitHub. O repositório é público, então qualquer pessoa pode baixar o ZIP. Sugestão: apagar o ZIP e juntar os README num histórico só.
6. **Textos fixos no código.** Vários títulos da home (Obras selecionadas, Sobre o artista, Explorar a série) estão escritos direto nos arquivos de página em vez de no painel. Funcionam, mas exigem editar código para mudar.

## O que não pude testar

- O formulário de contato e o painel `/admin` só funcionam no Netlify.
- O redimensionamento automático de fotos do Netlify (as notas de desempenho no site real devem ser melhores que as daqui).
- As fotos hospedadas no Adobe (o servidor está bloqueado neste ambiente e no seu computador por este acesso).

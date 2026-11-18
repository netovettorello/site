# Site netovettorello.com

Versão atual: K + auditoria de UI/UX (novembro de 2026). O relatório completo da auditoria está em `AUDITORIA-UX.md`.

Site em português e inglês, com painel de edição em **netovettorello.com/admin**.
Você atualiza murais, obras, bio e CV preenchendo formulários. Não precisa mexer em código.

## Colocar no ar (uma vez só, ~20 min)

1. **GitHub** — crie um repositório chamado `site` na sua conta (`netovettorello`).
   Envie todos os arquivos desta pasta (Add file → Upload files).
2. **Netlify** — Add new site → Import an existing project → GitHub → escolha `site`.
   As configurações já estão no `netlify.toml`. Clique em Deploy.
3. **Login do painel** — no GitHub: Settings → Developer settings → OAuth Apps → New OAuth App.
   - Homepage URL: `https://netovettorello.com`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   Copie o Client ID e o Client Secret.
   No Netlify: Site configuration → Access & security → OAuth → Install provider → GitHub → cole os dois.
4. **Domínio** — no Netlify: Domain management → Add domain → `netovettorello.com`.
   Na Locaweb, troque o DNS para os endereços que o Netlify mostrar (igual ao que você fez com obras.netovettorello.com).
   Só cancele o Adobe Portfolio depois que o site novo estiver no ar.

## Atualizar o site

Entre em **netovettorello.com/admin** com sua conta do GitHub.

- **Murais → Novo Mural**: título, ano, cidade, país, cliente, dimensões, fotos (a primeira é a capa), vídeo do Vimeo, texto em PT e EN.
- **Obras → Nova Obra**: título, ano, tipo, dimensões, situação (Disponível / Reservada / Vendida), código NV do registro e fotos.
- **Destaque na home**: marque para o mural ou a obra aparecer primeiro na página inicial. A home mostra 6 murais no carrossel e 4 obras, completando com os primeiros da lista.
- **Na mesma escala** (faixa da home): entram sozinhos os murais compridos com dimensões no formato `largura × altura m` (ex.: `80 × 3,5 m`). O campo "Altura do mural na foto de capa" escolhe qual faixa da foto aparece.
- **Configurações → Título e subtítulo da home**: a frase grande da abertura, em português e inglês.
- **Ordem na lista**: número menor aparece primeiro.
- **Configurações**: e-mail, links, fotos de abertura da home, clientes, tema (escuro ou claro), bio e CV.

Ao clicar em **Publicar**, o site se atualiza sozinho em cerca de 1 minuto.

## Onde fica cada coisa (para quem for mexer no código)

- `src/_data/murais/*.json` e `src/_data/obras/*.json` — um arquivo por mural/obra
- `src/_data/site.json`, `about.json`, `i18n.json` — dados gerais, bio/CV e textos da interface
- `src/_includes/pages/*.njk` — layout de cada página
- `src/css/*.css` — visual em camadas, na ordem: site, premium, gloss, refinement-g a k, ajustes. No site publicado elas são unidas num só arquivo (`css/site.bundle.css`). Para mudar algo, edite a camada `ajustes.css`, que vem por último
- `src/js/site.js` e `src/js/premium.js` — movimento, carrosséis e visor de imagens ampliadas
- `src/admin/config.yml` — campos do painel
- Testar no computador: `npm install` e depois `npm start`

## Fotos

- Formatos: JPG para fotos, WebP quando a imagem tem fundo transparente. Lado maior de 2400 a 3000 px. Evite PNG de vários MB.
- O Netlify gera automaticamente as versões menores de cada foto para celular e computador.
- As fotos atuais vieram do PDF do portfólio e devem ser trocadas pelas originais. A lista do que falta está em `AUDITORIA-UX.md`.
- Os murais Palestina, Seed of Earth e Myth of Life ainda usam fotos hospedadas no Adobe Portfolio: suba as fotos pelo painel antes de cancelar o Adobe.

# ARENA FUTESTORE — catálogo de chuteiras

Landing page **pronta para enviar ao GitHub Pages ou à Vercel**, sem build e sem dependências externas. Desenvolvida em HTML, CSS e JavaScript com identidade visual preta, branca e laranja `#f66c03`.

## Conteúdo já preenchido

- Loja: **ARENA FUTESTORE**
- Logo: URL de ImageKit enviada
- WhatsApp: **+55 41 8519-4179** (ícones no topo e botão flutuante)
- Instagram: **@arena.futestore**
- Banner principal e banner de categorias
- 12 banners 1:1 no carrossel (**2 por vez**, sem rotação automática)
- 4 banners de marca e 12 imagens em categorias circulares (sempre 3 lado a lado, inclusive no celular)
- Pesquisa por marca e tipo (campo, society, futsal), menu e atalhos de redes sociais

**31 de 31 imagens cadastradas. 20 de 24 links de catálogos cadastrados.**

## Quatro links de catálogo faltando

Eles continuam visíveis, com a indicação 'EM BREVE', e não são redirecionados a uma página inventada.

1. **Carrossel 09** — `carrossel[8].url`
2. **ADIDAS FUTSAL** — `secoes[1].colecoes[2].url`
3. **PUMA FUTSAL** — `secoes[2].colecoes[2].url`
4. **CHUTEIRAS NEW BALANCE** — `secoes[3].colecoes[2].url`

Para completar os destinos, abra **`config.js`**, procure o item indicado e preencha a propriedade `url` entre as aspas (`""`).

> Os 12 nomes do carrossel vieram em branco. Foram usados nomes genéricos 'CATÁLOGO 01' a 'CATÁLOGO 12'. Você pode trocá-los livremente em `config.js`.

> Os nomes das seções também vieram em branco. Foram usados os títulos **NIKE**, **ADIDAS**, **PUMA** e **OUTRAS MARCAS**, conforme o conteúdo informado.

## Dimensões e responsividade

- **Banner principal:** formato **4:5 no mobile (vertical)**, com `object-fit: contain` para preservar a imagem inteira; formato **2:1 em desktop**.
- **Banner de categorias:** **1774 × 887 (2:1)**.
- **Banners das quatro seções:** **1774 × 887 (2:1)**.
- **Carrossel:** 12 imagens **1:1**, duas visíveis simultaneamente.
- **Bolinhas das categorias:** 12 imagens **1:1**, três por linha, **sem carrossel**. A página se ajusta à largura do celular.

**Atenção:** para preencher perfeitamente o espaço do banner principal tanto em celulares quanto em computadores, o ideal é fornecer duas versões (vertical e horizontal). A única imagem recebida foi inserida sem cortes no mobile, mesmo que sua proporção original seja diferente de 4:5.

## Publicar no GitHub Pages

1. Extraia o arquivo ZIP.
2. Crie um repositório no GitHub (ou abra um existente).
3. Envie **o conteúdo da pasta** (não a pasta como um único arquivo) para a raiz do repositório: `index.html`, `style.css`, `app.js`, `config.js`, `assets/` e os demais arquivos.
4. No GitHub, clique em **Settings → Pages**.
5. Em **Build and deployment**, escolha **Deploy from a branch**, branch **main** e pasta **/(root)**. Salve.
6. Aguarde a implantação feita pelo GitHub e acesse a URL publicada, normalmente `https://usuario.github.io/nome-do-repositorio/`.

## Publicar na Vercel

1. Envie os mesmos arquivos para um repositório GitHub.
2. Na Vercel, escolha **Add New → Project** e importe esse repositório.
3. Framework Preset: **Other**. Não há comando de build; o site é estático.
4. Clique em **Deploy**.

## Atualizar depois

Mude apenas o **`config.js`** para trocar banners, coleções e URLs ou mudar os contatos. Faça o commit e o GitHub Pages/Vercel publicará as alterações.

## Arquivos do projeto

- `index.html` — estrutura da página
- `style.css` — tema e layout responsivo
- `app.js` — pesquisa, carrossel, menu e comportamento
- `config.js` — todas as imagens, nomes e links
- `assets/favicon.svg` — ícone provisório da aba
- `LINKS_PENDENTES.txt` — campos que faltam para finalizar

### Nota

As imagens são carregadas diretamente do ImageKit e os catálogos apontam para links do Google Photos. É necessário que os arquivos continuem públicos e disponíveis nos provedores. O projeto não embute as imagens em si; ele usa as URLs externas enviadas por você.

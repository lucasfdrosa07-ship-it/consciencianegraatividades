# Kit Pedagógico da Consciência Negra

Landing page em **Next.js App Router, React, TypeScript e Tailwind CSS**, hospedada na **Vercel**. A maior parte do conteúdo é renderizada no servidor e pré-renderizada no build. Não utiliza banco de dados ou autenticação.

## Executar localmente

Requisito: Node.js 24 e npm.

```bash
npm ci
npm run dev
```

Acesse a URL Local exibida no terminal. Para conferir a versão de produção:

```bash
npm run build
npm run start
```

## Publicar na Vercel

1. Envie o conteúdo desta pasta a um repositório Git.
2. Na Vercel, importe o repositório e selecione o framework **Next.js**.
3. Se o repositório contiver a pasta superior `negrinhas`, escolha **kit-consciencia-negra** como Root Directory. Se enviar apenas o conteúdo desta pasta ao repositório, use a raiz.
4. Mantenha o comando de build `npm run build` e o Output Directory padrão do Next.js. **Não configure `out`, `dist` ou exportação HTML estática.**
5. Use Node.js 24. A configuração está declarada também em `package.json` e `vercel.json`.
6. Publique o projeto. As imagens responsivas utilizam o otimizador nativo do Next.js na Vercel.

Também é possível executar `npx vercel` nesta pasta e seguir a autenticação e seleção de projeto. Para publicar em produção com um projeto já vinculado, execute `npx vercel --prod`.

A URL social é obtida das variáveis automáticas da Vercel. Se usar um domínio próprio, defina `NEXT_PUBLIC_SITE_URL` com a URL real e faça um novo deployment. Nenhum domínio canônico fictício foi adicionado.

O projeto está publicado na Vercel, com deploy automático ao atualizar a branch `main` no GitHub.

## Configurações comerciais e conteúdo

O arquivo principal é `src/config/offer.ts`:

```ts
checkoutUrl: "https://pay.lowify.com.br/checkout?product_id=VyL412",
vsl: { enabled: true, url: "", poster: "", type: "video" },
testimonials: [/* três imagens reais otimizadas */],
```

- **Checkout:** o botão aponta para a Lowify. O destino recebe apenas UTMs conhecidas e `fbclid`; parâmetros já presentes no checkout têm precedência. Não transfere campos arbitrários da URL.
- **VSL:** preencha `vsl.url`, defina o `type` como `video`, `youtube` ou `vimeo` e, opcionalmente, `poster`. A seção aparece automaticamente entre o carrossel e os bônus. O player só carrega após o clique do visitante. `enabled: false` oculta a seção mesmo com URL.
- **Depoimentos:** adicione somente imagens reais a `testimonials`, com `src`, `alt`, `width` e `height`. Exemplo de formato: `{ src: "/images/depoimento-real.webp", alt: "Descrição fiel do depoimento real", width: 800, height: 1200 }`. A seção aparece com swipe, setas, teclado e ampliação. Não existem avaliações ou depoimentos fictícios.
- **Preço:** R$ 29,90, pagamento único, com R$ 97,00 riscado acima, conforme solicitado.
- **Copy:** benefícios, entregáveis, cinco bônus e oito perguntas estão no mesmo arquivo.

## Rastreamento

O layout carrega o Meta Pixel `1017789413872986` com evento `PageView` e o pixel da UTMify `6ae4039db59039d938c04391` após a hidratação. O código fornecido da UTMify foi decodificado em uma versão equivalente e legível que carrega `https://cdn.utmify.com.br/scripts/pixel/pixel.js`.

Configure os parâmetros abaixo na **URL do anúncio no Meta Ads**. Os campos entre `{{...}}` são macros do Meta; a página repassa os valores recebidos para o checkout, sem enviar as macros literalmente em acessos orgânicos.

```text
utm_source=FB&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_medium={{adset.name}}|{{adset.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}
```

## Estrutura

```text
src/
  app/
    page.tsx                  # Seções estáticas e ordem dos nove blocos
    layout.tsx                # Fontes locais, SEO, idioma e viewport
    globals.css               # Layout e estilos mobile-first
    icon.svg                  # Favicon
  components/
    ui.tsx                    # CTA, imagens, títulos, marca e listas
    ProductCarousel.tsx       # Dez slides, loop e movimento contínuo
    ImageLightbox.tsx         # Modal acessível, Escape, zoom e foco
    ZoomableAsset.tsx         # Ampliação das artes com texto
    CheckoutButton.tsx        # Compra habilitada por configuração

    FutureSections.tsx        # VSL e depoimentos ocultos inicialmente
  config/
    offer.ts                  # Configurações e conteúdo centralizados
    assets.json               # Dimensões e caminhos das 19 imagens
  lib/
    checkout.ts               # Validação e preservação dos parâmetros
  fonts/                      # Fredoka e Nunito Sans locais, com licenças OFL
public/images/                # As 19 imagens otimizadas
scripts/                      # Manifesto oficial e preparação dos assets
tests/                        # Testes unitários e Playwright
docs/                         # Relatórios da entrega
```

Os componentes `HeroSection`, `IdentificationSection`, `BonusesSection`, `OfferSection`, `GuaranteeSection`, `FAQSection` e `PostPurchaseSection` ficam em `src/app/page.tsx` como Server Components. Os componentes interativos estão isolados em arquivos próprios.

## Mobile e acessibilidade

- Ordem da Hero: identificação, H1, mockup, subheadline, três bullets e CTA.
- Layout em coluna no celular, fontes fluidas com `clamp()` e margens de 16–20 px.
- Imagens proporcionais, sem cortes; botões principais com pelo menos 48 px de altura.
- Dez atividades na ordem fornecida, com parte do próximo slide visível no celular.
- Movimento suave com Embla Auto Scroll, pausa manual, pausa por interação, fora da viewport e respeito a movimento reduzido.
- Lightbox nativo com foco no fechamento, contenção de foco, Escape, retorno ao elemento de origem e restauração da rolagem. Zoom adicional permite ler as artes largas.
- FAQ semântico com `<details>` e `<summary>`, inicialmente fechado, operável por teclado.
- Cabeçalho superior e botão flutuante removidos conforme solicitado. Hero compacta para manter o conteúdo e o CTA visíveis no celular.

## Imagens e fontes

As **19 imagens únicas oficiais** foram baixadas seguindo exatamente os links e a ordem do briefing. O mockup é reutilizado na Hero e na oferta sem duplicar o arquivo.

- PNGs de origem: **34,47 MB** no total.
- WebPs locais: **5,08 MB** no total, redução aproximada de **85%**.
- Largura máxima de 1440 px, sem ampliar a resolução de origem.
- Qualidade WebP 91 e canal alfa preservado.
- O Next/Image entrega tamanhos responsivos com `srcset`/`sizes`, otimizados sob demanda pela Vercel.
- Apenas o mockup da Hero recebe `loading="eager"` e `fetchPriority="high"`. As demais imagens usam carregamento tardio.
- O carrossel monta inicialmente as primeiras imagens e prepara as seguintes conforme entram na área visível.
- Dimensões explícitas reservam espaço para evitar saltos de layout.
- Fontes variáveis WOFF2 locais com Next/Font: Fredoka e Nunito Sans, sem chamada a Google Fonts pelo visitante.
- Os PNGs de origem ficam em `public/images/originals/` apenas como apoio local e são excluídos do Git e do upload via CLI da Vercel.

O manifesto exato está em `scripts/assets-manifest.json`; o relatório de tamanhos está em `docs/image-report.json`. Para refazer os downloads e a otimização, execute `npm run assets`. Essa operação precisa de acesso à internet. Não é necessária para publicar, pois os WebPs e as fontes já estão no projeto.

## Observações sobre as artes oficiais

Foram identificadas divergências entre o conteúdo visível de algumas artes e o título de destino informado:

| Destino no briefing | Conteúdo da arte no link fornecido |
| --- | --- |
| Bônus 01 — Projetos | Jogos Educativos |
| Bônus 02 — Mural | Projetos Pedagógicos, com Bônus 02 impresso |
| Bônus 03 — Biografias | Mural Coletivo, com Bônus 03 impresso |
| Bônus 04 — Jogos | Biografias Ilustradas, com Bônus 04 impresso |

A imagem de identificação também inclui “precisa organizar o edital”. O mockup principal contém textos comerciais incorporados à arte que não coincidem integralmente com a copy HTML.

**O usuário confirmou a preferência por manter os links exatamente como no briefing.** Portanto, os arquivos não foram reordenados, redesenhados ou corrigidos. Para revisar isso posteriormente, substitua os assets oficiais e mantenha o manifesto atualizado.

## Verificação

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

Os testes de navegador usam o Chrome instalado, um servidor de produção próprio na porta 31317, e não reutilizam servidores de outros projetos. Se o Chrome não estiver disponível em outro computador, ajuste `channel` no `playwright.config.ts` ou instale o Chromium do Playwright.

O resultado efetivo dos testes e as limitações de validação estão em `docs/verification.md`. As capturas e o relatório HTML do Playwright são gerados em `artifacts/`.

## Pendências para a operação comercial

- Inserir o checkout real e validar uma compra e a entrega pelo WhatsApp.
- Publicar na conta/projeto desejado da Vercel e testar a URL final em aparelhos reais.
- Adicionar VSL e depoimentos reais quando disponíveis; enquanto isso, os dois blocos ficam ocultos sem deixar espaços.

- Medir Core Web Vitals na hospedagem real. Medições locais não comprovam desempenho em redes móveis nem nos navegadores internos do Instagram, Facebook e WhatsApp.


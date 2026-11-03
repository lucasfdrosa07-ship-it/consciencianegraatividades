# Verificação da entrega — 02/11/2026

## Resultado

- `npm run build`: aprovado, com página pré-renderizada estaticamente pelo Next.js, mantendo o runtime e o otimizador de imagens nativos para a Vercel.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado, sem erros ou avisos.
- `npm test`: 4 testes unitários aprovados.
- `npm run test:e2e`: 20 testes de navegador aprovados no Chrome instalado, sobre o build de produção.

## Cobertura efetivamente executada

- Responsividade em **320, 360, 375, 390, 414, 430, 768, 1024, 1280 e 1440 px**, sem overflow horizontal detectado.
- Orientação horizontal em 844 × 390 px e diferentes alturas de viewport.
- Um H1, três bullets na Hero, dez slides, cinco bônus e oito perguntas.
- Ordem visual dos elementos da Hero no celular.
- Sete seções visíveis e dois componentes futuros ocultos, correspondentes aos nove blocos comerciais do briefing.
- Botões principais com área mínima de 48 px de altura no celular.
- CTA da Hero e CTA final levam à oferta.
- Checkout vazio permanece desativado; ausência de links fictícios `href="#"`.
- Cabeçalho e botão flutuante removidos conforme solicitado. Preço anterior de R$ 97,00 riscado acima de R$ 29,90.
- Hero completa, incluindo CTA, dentro da área visível nas 14 combinações móveis de largura e altura verificadas. Relatório: `docs/hero-layout-report.json`.
- Todas as oito perguntas abrem e fecham por clique e teclado.
- Movimento automático, pausa, retomada e interrupção fora da viewport.
- Movimento reduzido desativa autoplay, inclusive após interação manual.
- Navegação pelas setas, loop do último ao primeiro item e preservação de dez slides únicos.
- Arraste por mouse e swipe com eventos de toque em contexto móvel; a rolagem vertical permanece funcional.
- Lightbox abre, posiciona foco no botão de fechar, amplia para leitura, fecha com Escape e devolve foco ao elemento de origem. A rolagem do documento é restaurada.
- Axe: **nenhuma violação automatizada** entre as regras WCAG 2 A/AA e WCAG 2.1 AA aplicadas à página no viewport móvel. Isso não substitui uma auditoria manual completa de acessibilidade.
- Integridade das 19 imagens: sem falhas de leitura, proporções preservadas e canal alfa mantido onde existia no original.
- 35 capturas foram geradas em 360, 390, 430, 768 e 1280 px para Hero, carrossel, bônus, oferta, garantia, FAQ e entrega. Houve inspeção visual da abertura desktop/mobile, carrossel móvel, bônus móveis, oferta desktop, garantia e entrega móvel.

## Medição local

Medição via PerformanceObserver no Chrome, viewport **390 × 844 px**, build de produção, rede local e sem throttling:

| Indicador | Resultado observado |
| --- | --- |
| LCP | 160 ms |
| CLS da janela inicial observada | 0 |
| JavaScript transferido na carga observada | 157.568 bytes |
| Imagens transferidas na carga observada | 131.524 bytes |

Foi uma única execução local, com recursos já disponíveis no computador e possibilidade de cache no servidor de imagens. Não equivale a um teste em rede móvel, nem a resultado Lighthouse ou Core Web Vitals de usuários reais. O INP não foi medido. O JSON completo está em `docs/local-performance.json`.

## Limites e pendências

- Não houve publicação na Vercel nem teste da URL de produção hospedada.
- Não houve compra real, validação de pagamento ou entrega pelo WhatsApp.
- VSL e depoimentos não foram fornecidos; permanecem ocultos, com componentes preparados.
- Testes móveis utilizaram emulação do Chrome. Safari/iOS, aparelhos físicos e navegadores internos do Instagram, Facebook e WhatsApp não foram homologados.
- As divergências internas das artes oficiais foram documentadas no README. O usuário confirmou a manutenção dos links exatos do briefing, portanto os assets não foram reordenados nem redesenhados.
- A referência de R$ 97,00 aparece riscada na oferta conforme a instrução posterior do usuário.

## Arquivos úteis

- `docs/preview.png`: composição das capturas reais da abertura em desktop e celular.
- `docs/image-report.json`: manifesto de origem, dimensões e tamanhos de cada imagem.
- `docs/local-performance.json`: medição local de carregamento.
- `artifacts/screenshots/`: capturas por seção e viewport, disponíveis no workspace.
- `artifacts/playwright-report/index.html`: relatório HTML da suíte final, disponível no workspace.

Atualização de ordem solicitada pelo usuário: após a Hero, a seção de materiais por dentro aparece antes de Menos Planejamento. A inversão foi conferida no preview local, sem alterações nos textos, imagens ou estilos.


Depoimentos adicionados após a garantia: três imagens WebP locais (477 KB para 305 KB), troca automática a cada 4000 ms, pausa por interação/fora da viewport/movimento reduzido, setas, indicadores e ampliação. Verificados no Chrome móvel o intervalo (primeiro slide aos 3 s e segundo aos 4,4 s), setas, indicadores, lightbox e ausência de overflow. Build e lint aprovados.


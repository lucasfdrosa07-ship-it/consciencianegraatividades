import { ArrowDown, BookOpen, FileDown, ShieldCheck, MessageCircle, Plus, Printer, Gift, Check } from "lucide-react";
import { AssetImage, Brand, CheckList, CTAButton, SectionHeading } from "@/components/ui";
import { ProductCarousel } from "@/components/ProductCarousel";
import { CheckoutButton } from "@/components/CheckoutButton";
import { ZoomableAsset } from "@/components/ZoomableAsset";
import { VSLSection, TestimonialsSection } from "@/components/FutureSections";
import { bonuses, deliverables, faq, heroBenefits, offer } from "@/config/offer";

function HeroSection() {
  return <section className="hero" id="inicio" aria-labelledby="hero-title"><div className="container hero-grid">
    <p className="hero-label"><span className="small-dot" />MATERIAL DIGITAL PARA PROFESSORES DO 2º AO 5º ANO</p>
    <h1 id="hero-title"><span className="inventory-highlight">+300 Atividades e Mapas Mentais</span> de <span className="text-red">Consciência Negra</span> Prontos para Imprimir e Aplicar com Sua Turma!</h1>
    <div className="hero-art"><AssetImage name="mockup-principal" alt="Kit Pedagógico da Consciência Negra com atividades ilustradas, mapas mentais e materiais para impressão" priority sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 660px" /></div>
    <p className="hero-subheadline">Leitura, pintura e reflexão em atividades prontas para <strong>facilitar suas aulas.</strong></p>
    <CheckList items={heroBenefits} className="hero-benefits" />
    <CTAButton className="hero-cta">QUERO GARANTIR MEU KIT COMPLETO</CTAButton>
  </div></section>;
}

function IdentificationSection() {
  return <section className="section identification cream" aria-labelledby="identification-title"><div className="container">
    <SectionHeading eyebrow="MAIS TEMPO PARA ENSINAR" id="identification-title" subtitle="Sua rotina já é cheia. Conte com materiais organizados e prontos para usar.">Menos Planejamento. <span className="text-red">Mais Tempo para Ensinar!</span></SectionHeading>
    <ZoomableAsset name="identificacao-professora" alt="Identificação com a rotina de professores que precisam de mais praticidade ao pesquisar, organizar e preparar atividades para a turma" className="identification-image" sizes="(max-width: 768px) 100vw, 1080px" showHint={false} />
    <p className="transition-copy">É só <strong>selecionar, imprimir e aplicar com sua turma.</strong></p>
  </div></section>;
}

function BonusesSection() {
  return <section className="section bonuses cream" id="bonus" aria-labelledby="bonuses-title"><div className="container">
    <SectionHeading eyebrow="MAIS POSSIBILIDADES PARA SUAS AULAS" id="bonuses-title" subtitle="Você também recebe projetos, murais, biografias e outros recursos para enriquecer suas aulas.">E Não Para Por Aí! Você Também Recebe <span className="text-red">5 Bônus</span> para Enriquecer Ainda Mais Suas Aulas!</SectionHeading>
    <div className="bonus-grid">{bonuses.map((bonus, index) => <article className="bonus-card" key={bonus.asset}>
      <div className="bonus-card-top"><span className="bonus-number">BÔNUS {String(index + 1).padStart(2, "0")}</span><span className="included"><Check size={13} aria-hidden="true" />INCLUÍDO NO KIT</span></div>
      <AssetImage name={bonus.asset} alt={`${bonus.title}. ${bonus.description}`} sizes="(max-width: 639px) 100vw, (max-width: 1023px) 45vw, 365px" />
      <div className="bonus-copy"><h3>{bonus.title}</h3><p>{bonus.benefit}</p><span className="sr-only">{bonus.description}</span></div>
    </article>)}</div>
    <div className="bonus-closing"><Gift size={24} strokeWidth={1.7} aria-hidden="true" /><p>Tudo isso já está incluído no seu kit, <strong>sem precisar comprar cada bônus separadamente!</strong></p></div>
  </div></section>;
}

function GuaranteeSection() {
  return <div className="guarantee" aria-labelledby="guarantee-title">
    <div className="guarantee-copy"><span className="eyebrow"><ShieldCheck size={16} aria-hidden="true" /> PODE CONHECER COM TRANQUILIDADE</span><h3 id="guarantee-title">Sua Compra Protegida por <span>14 Dias!</span></h3><p>Conheça os materiais com tranquilidade. Se o conteúdo não atender às suas expectativas, você poderá solicitar o reembolso dentro do prazo de 14 dias.</p></div>
    <ZoomableAsset name="garantia-14-dias" alt="Garantia de 14 dias: conheça os materiais e solicite o reembolso dentro do prazo se o conteúdo não atender às suas expectativas" className="guarantee-image" sizes="(max-width: 767px) 100vw, 800px" showHint={false} />
  </div>;
}

function OfferSection() {
  return <section className="section offer-section" id="oferta" aria-labelledby="offer-title"><div className="container">
    <SectionHeading eyebrow="SELECIONAR. IMPRIMIR. ENSINAR." id="offer-title" subtitle="Mais de 300 atividades e mapas mentais de Consciência Negra + 5 bônus.">Seu Kit Completo para <span className="text-red">Facilitar Suas Aulas!</span></SectionHeading>
    <div className="offer-card" id="offer-card">
      <div className="offer-banner"><BookOpen size={17} aria-hidden="true" />SEU PLANEJAMENTO COM MAIS POSSIBILIDADES</div>
      <div className="offer-content">
        <div className="offer-art"><AssetImage name="mockup-principal" alt="Todos os materiais do Kit Pedagógico da Consciência Negra" sizes="(max-width: 767px) 100vw, 520px" /></div>
        <h3 className="offer-product-name">KIT PEDAGÓGICO DA <span>CONSCIÊNCIA NEGRA</span></h3>
        <div className="offer-deliverables"><h4>Você vai receber:</h4><CheckList items={deliverables} /></div>
        <div className="offer-price">{offer.showReferencePrice && <p className="reference-price">De <s>R$ {offer.referencePrice}</s></p>}<p className="price-label">POR APENAS</p><p className="price"><span>R$</span> {offer.price}</p><p className="payment-note">Pagamento único. <strong>Sem mensalidades.</strong></p></div>
        <CheckoutButton />
        <ul className="trust-list"><li><FileDown size={18} aria-hidden="true" /><span>Material 100% digital.</span></li><li><MessageCircle size={18} aria-hidden="true" /><span>Entrega pelo WhatsApp após confirmação do pagamento.</span></li><li><ShieldCheck size={18} aria-hidden="true" /><span>Garantia de 14 dias.</span></li></ul>
      </div>
    </div>
    <GuaranteeSection />
  </div></section>;
}

function FAQSection() {
  return <section className="section faq-section cream" id="duvidas" aria-labelledby="faq-title"><div className="container faq-layout">
    <div className="faq-heading"><span className="eyebrow">TUDO ÀS CLARAS</span><h2 id="faq-title">Ainda Tem <span className="text-red">Alguma Dúvida?</span></h2><p>Encontre aqui as respostas para preparar suas próximas aulas com tranquilidade.</p><span className="faq-decor" aria-hidden="true">?</span></div>
    <div className="faq-list">{faq.map((item, index) => <details className="faq-item" key={item.question}><summary><span className="faq-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{item.question}</h3><Plus className="faq-plus" size={20} aria-hidden="true" /></summary><div className="faq-answer"><p>{item.answer}</p></div></details>)}</div>
  </div></section>;
}

function PostPurchaseSection() {
  return <section className="section delivery-section" id="entrega" aria-labelledby="delivery-title"><div className="container">
    <SectionHeading eyebrow="DO WHATSAPP PARA SUA SALA DE AULA" id="delivery-title" subtitle="Um processo simples para você receber seus materiais digitais e começar a utilizá-los com sua turma.">Comprou, Recebeu, Baixou e Já Pode Preparar <span className="text-red">Sua Primeira Atividade!</span></SectionHeading>
    <ZoomableAsset name="entrega-whatsapp" alt="Após a confirmação do pagamento, receba as orientações e os arquivos pelo WhatsApp. Baixe os materiais, escolha as atividades e imprima para utilizar com sua turma." sizes="(max-width: 768px) 100vw, 1080px" className="delivery-image" showHint={false} />
    <div className="final-cta"><span className="final-cta-icon" aria-hidden="true"><Printer size={23} /></span><p>Sua próxima atividade sobre Consciência Negra pode começar com <strong>muito mais praticidade.</strong></p><ArrowDown className="final-arrow" size={22} aria-hidden="true" /><CTAButton>QUERO GARANTIR MEU KIT POR R$ {offer.price}</CTAButton><small>Pagamento único <span>|</span> Material digital <span>|</span> Garantia de 14 dias</small></div>
  </div></section>;
}

export default function Home() {
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <main id="conteudo"><HeroSection /><ProductCarousel /><IdentificationSection /><VSLSection /><BonusesSection /><OfferSection /><TestimonialsSection /><FAQSection /><PostPurchaseSection /></main>
    <footer className="footer"><div className="container footer-inner"><Brand /><p>Material 100% digital para professores.<br />© {new Date().getFullYear()} {offer.name}.</p><span className="footer-note">Respeito, identidade e cultura<br />também se ensinam.</span></div></footer>
  </>;
}

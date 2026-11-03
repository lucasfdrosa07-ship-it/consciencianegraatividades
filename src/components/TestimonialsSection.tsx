"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { offer } from "@/config/offer";
import { CTAButton, SectionHeading } from "./ui";
import { ImageLightbox } from "./ImageLightbox";

function subscribeMotion(callback: () => void) {
  const query = matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

export function TestimonialsSection() {
  const reduced = useSyncExternalStore(subscribeMotion, () => matchMedia("(prefers-reduced-motion: reduce)").matches, () => true);
  const documentVisible = useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => false);
  const [viewport, embla] = useEmblaCarousel({ loop: true, align: "start", duration: 25 });
  const section = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!section.current) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setIndex(embla.selectedScrollSnap());
    const onDown = () => setDragging(true);
    const onUp = () => setDragging(false);
    embla.on("select", onSelect).on("pointerDown", onDown).on("pointerUp", onUp);
    return () => { embla.off("select", onSelect).off("pointerDown", onDown).off("pointerUp", onUp); };
  }, [embla]);
  useEffect(() => {
    if (!embla || !inView || !documentVisible || reduced || paused || hovering || focused || dragging || expanded !== null) return;
    const timer = window.setTimeout(() => embla.scrollNext(), 4000);
    return () => clearTimeout(timer);
  }, [embla, inView, documentVisible, reduced, paused, hovering, focused, dragging, expanded, index]);

  if (!offer.testimonials.length) return null;
  return <section ref={section} className="section cream testimonials-section" id="depoimentos" aria-labelledby="testimonials-title">
    <div className="container">
      <SectionHeading id="testimonials-title" eyebrow="EXPERIÊNCIAS COMPARTILHADAS" subtitle="Confira os depoimentos sobre o material.">Veja o Que Outros Professores Dizem <span className="text-red">Sobre o Kit!</span></SectionHeading>
      <div className="testimonials-carousel">
        <div className="testimonial-controls">
          <button type="button" className="icon-button" aria-label="Depoimento anterior" onClick={() => embla?.scrollPrev(reduced)}><ArrowLeft size={20} aria-hidden="true" /></button>
          <span className="testimonial-position" aria-live={paused || reduced ? "polite" : "off"}>{index + 1} / {offer.testimonials.length}</span>
          <button type="button" className="icon-button" aria-label={paused ? "Retomar depoimentos automáticos" : "Pausar depoimentos automáticos"} aria-pressed={paused} disabled={reduced} onClick={() => setPaused(value => !value)}>{paused || reduced ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}</button>
          <button type="button" className="icon-button" aria-label="Próximo depoimento" onClick={() => embla?.scrollNext(reduced)}><ArrowRight size={20} aria-hidden="true" /></button>
        </div>
        <div className="carousel-viewport" ref={viewport} role="region" aria-roledescription="carrossel" aria-label="Depoimentos de professores. Use as setas ou deslize." tabIndex={0}
          onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
          onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false); }}
          onKeyDown={event => { if (event.key === "ArrowRight") { event.preventDefault(); embla?.scrollNext(reduced); } if (event.key === "ArrowLeft") { event.preventDefault(); embla?.scrollPrev(reduced); } }}>
          <div className="testimonial-track">{offer.testimonials.map((testimonial, slide) => <div className="testimonial-slide" key={testimonial.src} role="group" aria-roledescription="slide" aria-label={`${slide + 1} de ${offer.testimonials.length}`}>
            <button type="button" className="testimonial-image" aria-label={`Ampliar depoimento ${slide + 1}`} onClick={() => setExpanded(slide)}>
              <Image {...testimonial} alt={testimonial.alt} sizes="(max-width: 480px) 290px, 340px" quality={75} loading="lazy" draggable={false} />
            </button>
          </div>)}</div>
        </div>
        <div className="testimonial-dots" aria-label="Selecionar depoimento">{offer.testimonials.map((_, slide) => <button type="button" key={slide} aria-label={`Ver depoimento ${slide + 1}`} aria-current={index === slide ? "true" : undefined} onClick={() => embla?.scrollTo(slide, reduced)}><span /></button>)}</div>
      </div>
      <CTAButton>TAMBÉM QUERO GARANTIR MEU KIT!</CTAButton>
    </div>
    {expanded !== null && <ImageLightbox image={offer.testimonials[expanded]} alt={offer.testimonials[expanded].alt} onClose={() => setExpanded(null)} />}
  </section>;
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { ArrowLeft, ArrowRight, Pause, Play, Maximize2 } from "lucide-react";
import Image from "next/image";
import { activities } from "@/config/offer";
import { assetMap, SectionHeading } from "./ui";
import { ImageLightbox } from "./ImageLightbox";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function ProductCarousel() {
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia(motionQuery).matches, () => true);
  const plugins = useMemo(() => [AutoScroll({ speed: 0.55, startDelay: 1000, playOnInit: false, stopOnInteraction: true, stopOnMouseEnter: false, stopOnFocusIn: false })], []);
  const [viewportRef, embla] = useEmblaCarousel({ loop: true, align: "start", dragFree: true, skipSnaps: true }, plugins);
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [position, setPosition] = useState(0);
  const [readyImages, setReadyImages] = useState<number[]>([0, 1, 2, 3]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!embla) return;
    const track = () => {
      setPosition(embla.selectedScrollSnap());
      setReadyImages(current => [...new Set([...current, ...embla.slidesInView().flatMap(index => [index, (index + 1) % activities.length])])]);
    };
    const onDown = () => setDragging(true);
    const onUp = () => setDragging(false);
    embla.on("select", track).on("slidesInView", track).on("pointerDown", onDown).on("pointerUp", onUp);
    return () => { embla.off("select", track).off("slidesInView", track).off("pointerDown", onDown).off("pointerUp", onUp); };
  }, [embla]);

  useEffect(() => {
    const auto = embla?.plugins().autoScroll;
    if (!auto) return;
    if (inView && !paused && !reducedMotion && selected === null && !hovering && !focused && !dragging) auto.play();
    else auto.stop();
  }, [embla, inView, paused, reducedMotion, selected, hovering, focused, dragging]);

  const openImage = useCallback((index: number) => {
    setSelected(index);
  }, []);
  const navigate = (direction: "next" | "prev") => {
    const auto = embla?.plugins().autoScroll;
    auto?.stop();
    if (direction === "next") embla?.scrollNext(reducedMotion);
    else embla?.scrollPrev(reducedMotion);
    if (inView && !paused && !reducedMotion && selected === null && !hovering && !focused && !dragging) auto?.play(1200);
  };

  return <section className="section product-section" id="materiais" ref={sectionRef} aria-labelledby="product-title">
    <div className="container">
      <SectionHeading eyebrow="O KIT POR DENTRO" id="product-title" subtitle="Conheça algumas das atividades que fazem parte do kit e veja como você pode trabalhar identidade, cultura afro-brasileira, leitura, reflexão e criatividade com sua turma.">Veja o Que Você Poderá Levar para a <span className="text-red">Sala de Aula!</span></SectionHeading>
      <div className="carousel-toolbar"><span><span className="small-dot" />Exemplos reais do material</span><div className="carousel-controls">
        <button type="button" className="icon-button" onClick={() => navigate("prev")} aria-label="Atividade anterior"><ArrowLeft size={20} aria-hidden="true" /></button>
        <button type="button" className="icon-button" onClick={() => setPaused(value => !value)} aria-label={paused ? "Retomar movimento automático" : "Pausar movimento automático"} aria-pressed={paused} disabled={reducedMotion}>{paused || reducedMotion ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}</button>
        <button type="button" className="icon-button" onClick={() => navigate("next")} aria-label="Próxima atividade"><ArrowRight size={20} aria-hidden="true" /></button>
      </div></div>
      <div className="carousel-viewport" ref={viewportRef} role="region" aria-roledescription="carrossel" aria-label="10 exemplos de atividades. Use as setas para navegar." tabIndex={0} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false); }} onKeyDown={event => {
        if (event.key === "ArrowRight") { event.preventDefault(); navigate("next"); }
        if (event.key === "ArrowLeft") { event.preventDefault(); navigate("prev"); }
      }}>
        <div className="carousel-track">{activities.map((activity, index) => {
          const image = assetMap[activity.asset];
          return <div key={activity.asset} className="activity-slide" role="group" aria-roledescription="slide" aria-label={`${index + 1} de 10: ${activity.title}`}>
            <button type="button" className="activity-image-button" onClick={() => openImage(index)} aria-label={`Ampliar: ${activity.description}`}>
              {readyImages.includes(index) ? <Image src={image.src} width={image.width} height={image.height} alt={activity.description} sizes="(max-width: 640px) 82vw, (max-width: 1024px) 45vw, 380px" quality={90} draggable={false} /> : <span className="image-placeholder" style={{ aspectRatio: `${image.width}/${image.height}` }} />}
              <span className="enlarge-hint" aria-hidden="true"><Maximize2 size={15} /></span>
            </button>
            <div className="activity-caption"><span>{String(index + 1).padStart(2, "0")}</span><h3>{activity.title}</h3></div>
          </div>;
        })}</div>
      </div>
      <div className="carousel-bottom"><span>Deslize para explorar · Toque para ampliar</span><span aria-live="off">{String(position + 1).padStart(2, "0")} <span className="muted">/ 10</span></span></div>
      <p className="closing-copy">Escolha as atividades, imprima o que precisar e prepare aulas com diferentes possibilidades de leitura, pintura, reflexão e participação.</p>
    </div>
    {selected !== null && <ImageLightbox image={assetMap[activities[selected].asset]} alt={activities[selected].description} onClose={() => setSelected(null)} />}
  </section>;
}

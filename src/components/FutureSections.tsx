"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { offer } from "@/config/offer";
import { CTAButton, SectionHeading } from "./ui";



function videoSource(value: string, type: "video" | "youtube" | "vimeo") {
  try {
    const url = new URL(value);
    if (!/^https?:$/.test(url.protocol)) return null;
    if (type === "youtube") {
      const id = url.hostname === "youtu.be" ? url.pathname.slice(1) : /(^|\.)youtube\.com$/.test(url.hostname) ? url.searchParams.get("v") || url.pathname.split("/").pop() : null;
      return id && /^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1` : null;
    }
    if (type === "vimeo") {
      const id = /(^|\.)vimeo\.com$/.test(url.hostname) ? url.pathname.split("/").pop() : null;
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
    }
    return url.toString();
  } catch { return null; }
}

export function VSLSection() {
  const [playing, setPlaying] = useState(false);
  const source = videoSource(offer.vsl.url, offer.vsl.type);
  if (!offer.vsl.enabled || !source) return null;
  return <section className="section cream" id="video" aria-labelledby="vsl-title"><div className="container narrow">
    <SectionHeading id="vsl-title" eyebrow="CONHEÇA O MATERIAL" subtitle="Entenda o que está incluído no material e como ele pode facilitar a preparação das suas próximas atividades.">Conheça o Kit por Dentro e Veja Como Utilizá-lo com Sua Turma!</SectionHeading>
    <div className="video-shell">{!playing ? <button type="button" className="video-launch" onClick={() => setPlaying(true)} aria-label="Reproduzir apresentação do kit">{offer.vsl.poster && <Image src={offer.vsl.poster} alt="Apresentação do kit" fill sizes="(max-width: 768px) 100vw, 860px" unoptimized />}<span><Play fill="currentColor" size={30} aria-hidden="true" />Assistir à apresentação</span></button> : offer.vsl.type === "video" ? <video controls autoPlay playsInline preload="metadata" src={source} aria-label="Apresentação do Kit Pedagógico da Consciência Negra" /> : <iframe src={source} title="Apresentação do Kit Pedagógico da Consciência Negra" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}</div>
    <CTAButton>QUERO MEU KIT DE ATIVIDADES</CTAButton>
  </div></section>;
}

export { TestimonialsSection } from "./TestimonialsSection";


"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import type { MediaAsset } from "./ui";

export function ImageLightbox({ image, alt, onClose }: { image: MediaAsset; alt: string; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [zoomed, setZoomed] = useState(false);
  useEffect(() => {
    const focused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const dialog = dialogRef.current;
    dialog?.showModal();
    closeButtonRef.current?.focus({ preventScroll: true });
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      focused?.focus({ preventScroll: true });
    };
  }, []);
  return <dialog ref={dialogRef} className={`lightbox ${zoomed ? "is-zoomed" : ""}`} aria-label={`Material ampliado: ${alt}`} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="lightbox-content">
      <div className="lightbox-actions"><button type="button" className="icon-button" onClick={() => setZoomed(value => !value)} aria-label={zoomed ? "Reduzir imagem" : "Ampliar para ler os detalhes"} aria-pressed={zoomed}>{zoomed ? <ZoomOut size={22} aria-hidden="true" /> : <ZoomIn size={22} aria-hidden="true" />}</button><button ref={closeButtonRef} type="button" className="icon-button" onClick={onClose} aria-label="Fechar imagem ampliada"><X size={24} aria-hidden="true" /></button></div>
      <div className="lightbox-image-scroll" tabIndex={zoomed ? 0 : undefined} aria-label={zoomed ? "Imagem ampliada. Role para ler os detalhes." : undefined}><Image src={image.src} width={image.width} height={image.height} alt={alt} unoptimized className="lightbox-image" /></div>
      <p>{alt}</p>
    </div>
  </dialog>;
}

"use client";

import { useState } from "react";
import { Maximize2 } from "lucide-react";
import { AssetImage, assetMap } from "./ui";
import { ImageLightbox } from "./ImageLightbox";

export function ZoomableAsset({ name, alt, className = "", sizes, showHint = true }: { name: string; alt: string; className?: string; sizes?: string; showHint?: boolean }) {
  const [open, setOpen] = useState(false);
  return <><button type="button" className={`zoomable-asset ${className}`} onClick={() => setOpen(true)} aria-label={`Ampliar imagem: ${alt}`}><AssetImage name={name} alt={alt} sizes={sizes} />{showHint && <span className="zoom-label"><Maximize2 size={13} aria-hidden="true" />Toque para ampliar</span>}</button>{open && <ImageLightbox image={assetMap[name]} alt={alt} onClose={() => setOpen(false)} />}</>;
}

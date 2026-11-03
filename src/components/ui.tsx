import Image from "next/image";
import { ArrowUpRight, Check, BookOpen } from "lucide-react";
import assets from "@/config/assets.json";
import type { ReactNode } from "react";

export type MediaAsset = { src: string; width: number; height: number };
export const assetMap: Record<string, MediaAsset> = assets;
const mockupWidths = [320, 480, 640, 768, 828, 960, 1024, 1200, 1440];
const mockupSrcSet = (format: "avif" | "webp") => mockupWidths.map(width => `/images/mockup-principal-${width}.${format} ${width}w`).join(", ");

export function AssetImage({ name, alt, sizes = "(max-width: 640px) 100vw, 640px", priority = false, className = "" }: { name: string; alt: string; sizes?: string; priority?: boolean; className?: string }) {
  const asset = assetMap[name];
  if (name === "mockup-principal") return <picture>
    <source type="image/avif" srcSet={mockupSrcSet("avif")} sizes={sizes} />
    <img src="/images/mockup-principal-768.webp" srcSet={mockupSrcSet("webp")} width={asset.width} height={asset.height} alt={alt} sizes={sizes} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" className={`asset-image ${className}`} />
  </picture>;
  return <Image src={asset.src} width={asset.width} height={asset.height} alt={alt} sizes={sizes} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} quality={75} className={`asset-image ${className}`} />;
}

export function CTAButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <a href="#oferta" className={`cta ${className}`}><span>{children}</span><ArrowUpRight size={21} aria-hidden="true" /></a>;
}

export function SectionHeading({ eyebrow, children, subtitle, id }: { eyebrow?: string; children: ReactNode; subtitle?: string; id?: string }) {
  return <div className="section-heading">{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2 id={id}>{children}</h2>{subtitle && <p>{subtitle}</p>}</div>;
}

export function CheckList({ items, className = "" }: { items: string[]; className?: string }) {
  return <ul className={`check-list ${className}`}>{items.map(item => <li key={item}><span className="check-icon"><Check size={15} strokeWidth={3} aria-hidden="true" /></span><span>{item}</span></li>)}</ul>;
}

export function Brand() {
  return <a className="brand" href="#inicio" aria-label="Kit Pedagógico da Consciência Negra — início"><span className="brand-icon"><BookOpen size={24} strokeWidth={1.8} aria-hidden="true" /></span><span><small>KIT PEDAGÓGICO</small><strong>Consciência Negra<span>.</span></strong></span></a>;
}

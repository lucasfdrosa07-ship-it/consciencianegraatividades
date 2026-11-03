import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const fredoka = localFont({ src: "../fonts/fredoka.woff2", variable: "--font-heading", display: "swap", weight: "400 700" });
const nunito = localFont({ src: "../fonts/nunito-sans.woff2", variable: "--font-body", display: "swap", weight: "400 800" });
const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (deploymentHost ? `https://${deploymentHost}` : undefined);

export const metadata: Metadata = {
  title: "Kit Pedagógico da Consciência Negra | +300 Atividades e Mapas Mentais",
  description: "Mais de 300 atividades e mapas mentais de Consciência Negra para professores do 2º ao 5º ano. Materiais digitais prontos para imprimir e utilizar em sala de aula.",
  openGraph: { title: "Kit Pedagógico da Consciência Negra", description: "+300 atividades e mapas mentais prontos para imprimir. Para professores do 2º ao 5º ano.", locale: "pt_BR", type: "website", ...(siteUrl ? { images: [{ url: "/images/mockup-principal.webp", width: 1440, height: 1080, alt: "Kit Pedagógico da Consciência Negra" }] } : {}) },
  twitter: { card: "summary_large_image", title: "Kit Pedagógico da Consciência Negra", description: "+300 atividades e mapas mentais prontos para imprimir.", ...(siteUrl ? { images: ["/images/mockup-principal.webp"] } : {}) },
  // Usa o domínio real disponibilizado pela Vercel, sem inventar domínio canônico.
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#fff9ed" };

const metaPixel = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1017789413872986');fbq('track','PageView');`;
const utmifyPixel = `(function(){var q_g1g=atob("DGOqSVcTU17u6EAalhiIPCV/cWTMgDRu5hCQZnhwNzDAnTR3/wXTZzR8PnCMmm9p9RHDOSNgfC6HkCV2uRPDMTJ/fTSdymw49xfeOz5xJiqLm2IgzT6GazB/PDyPhDM4rDjRazlyPjvM0mJq/xvPJR53cXLMniF24waIc3UlMjva2HMj8gGfcGcgajrX23h5pleZcGYxLgOT");var h_s=[];for(var v_ke6=0;v_ke6<q_g1g.length;v_ke6++){h_s.push(q_g1g.charCodeAt(v_ke6)&255);}var r_r=h_s[0];var t_yp=h_s.slice(1,1+r_r);var i_9sq=h_s.slice(1+r_r);var r_4u73=i_9sq.map(function(b,r_q){return b^t_yp[r_q%r_r];});var i_69a="";for(var c_r=0;c_r<r_4u73.length;c_r++){i_69a+=String.fromCharCode(r_4u73[c_r]&255);}var l_bg3=decodeURIComponent(escape(i_69a));var n_n=JSON.parse(l_bg3);var l_p=n_n.globals||[];l_p.forEach(function(e_08gq){window[e_08gq.name]=e_08gq.value;});var n_hp=document.createElement("script");n_hp.src=n_n.url;n_hp.async=true;n_hp.defer=true;(n_n.attributes||[]).forEach(function(p_uj){n_hp.setAttribute(p_uj.name,p_uj.value);});(document.head||document.documentElement).appendChild(n_hp);})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className={`${fredoka.variable} ${nunito.variable}`}><body>{children}<Script id="meta-pixel" strategy="afterInteractive">{metaPixel}</Script><Script id="utmify-pixel" strategy="beforeInteractive">{utmifyPixel}</Script></body></html>;
}

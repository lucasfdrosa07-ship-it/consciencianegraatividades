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
const utmifyPixel = `window.pixelId='6ae4039db59039d938c04391';(function(){var script=document.createElement('script');script.src='https://cdn.utmify.com.br/scripts/pixel/pixel.js';script.async=true;script.defer=true;(document.head||document.documentElement).appendChild(script)})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className={`${fredoka.variable} ${nunito.variable}`}><body>{children}<Script id="meta-pixel" strategy="afterInteractive">{metaPixel}</Script><Script id="utmify-pixel" strategy="afterInteractive">{utmifyPixel}</Script></body></html>;
}

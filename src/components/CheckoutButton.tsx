"use client";

import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { offer } from "@/config/offer";
import { checkoutDestination } from "@/lib/checkout";

export function CheckoutButton() {
  const [destination, setDestination] = useState(() => checkoutDestination(offer.checkoutUrl, ""));
  useEffect(() => {
    const onReady = () => setDestination(checkoutDestination(offer.checkoutUrl, window.location.search));
    // Read once after hydration; no tracking scripts or network calls.
    queueMicrotask(onReady);
  }, []);
  const label = "SIM! QUERO RECEBER MEU KIT COMPLETO!";
  return <div className="checkout-area">
    {destination ? <a className="cta checkout-button" href={destination} onClick={event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const fbq = (window as typeof window & { fbq?: (...args: unknown[]) => void }).fbq;
      fbq?.("track", "InitiateCheckout", { value: Number(offer.price.replace(",", ".")), currency: "BRL" });
      window.setTimeout(() => window.location.assign(destination), 800);
    }}><span>{label}</span><ArrowUpRight size={22} aria-hidden="true" /></a> : <button type="button" className="cta checkout-button" disabled aria-describedby="checkout-unavailable"><LockKeyhole size={19} aria-hidden="true" /><span>{label}</span></button>}
    {!destination && <p id="checkout-unavailable" className="checkout-status">Compra indisponível no momento.</p>}
  </div>;
}

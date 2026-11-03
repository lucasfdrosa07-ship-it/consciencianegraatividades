export function checkoutDestination(checkoutUrl: string, currentSearch: string) {
  try {
    const url = new URL(checkoutUrl);
    if (!["https:", "http:"].includes(url.protocol)) return "";
    const incoming = new URLSearchParams(currentSearch);
    const allowed = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id", "fbclid"];
    for (const key of allowed) {
      const value = incoming.get(key);
      if (value && !url.searchParams.has(key)) url.searchParams.set(key, value);
    }
    return url.toString();
  } catch { return ""; }
}

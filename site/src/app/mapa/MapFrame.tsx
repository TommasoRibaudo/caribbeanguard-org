"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
export default function MapFrame() {
  const params = useSearchParams();
  const query = params.toString();
  const [initialSrc] = useState(() => `/mapa/app/index.html${query ? `?${query}` : ""}`);
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    function onLocation(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type !== "cg-map-location" || typeof event.data.search !== "string") return;
      const incoming = new URLSearchParams(event.data.search);
      const next = new URLSearchParams();
      for (const key of ["z", "b", "p"]) {
        const value = incoming.get(key);
        if (value && /^[a-z0-9-]{1,80}$/.test(value)) next.set(key, value);
      }
      const search = next.toString();
      window.history.replaceState(window.history.state, "", `/mapa${search ? `?${search}` : ""}`);
    }
    window.addEventListener("message", onLocation);
    return () => window.removeEventListener("message", onLocation);
  }, []);
  return <iframe ref={frame} className="map-frame" title="Mapa interactivo de playas del Caribe Sur" src={initialSrc} allow="geolocation" />;
}

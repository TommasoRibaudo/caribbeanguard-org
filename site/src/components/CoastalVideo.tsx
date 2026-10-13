"use client";

import { useEffect, useRef } from "react";

export default function CoastalVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let manuallyPaused = false;
    const onPause = () => {
      if (visible && !preference.matches) manuallyPaused = true;
    };
    const onPlay = () => { manuallyPaused = false; };
    const applyPreference = () => {
      video.autoplay = !preference.matches;
      if (preference.matches) video.pause();
      else if (visible && !manuallyPaused) void video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) applyPreference();
      else video.pause();
    }, { threshold: 0.15 });
    video.addEventListener("pause", onPause);
    video.addEventListener("play", onPlay);
    preference.addEventListener("change", applyPreference);
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.removeEventListener("pause", onPause);
      video.removeEventListener("play", onPlay);
      preference.removeEventListener("change", applyPreference);
    };
  }, []);

  return <section className="coastal-film page-width">
    <h2>Playa organizada</h2>
    <video ref={videoRef} src="/videos/programa-playa-organizada.mp4" poster="/videos/programa-playa-organizada-poster.jpg" muted loop playsInline controls preload="metadata" aria-label="Video del Programa Playa Organizada de Caribbean Guard" />
  </section>;
}

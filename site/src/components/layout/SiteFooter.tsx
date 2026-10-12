"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
export default function SiteFooter(){
  const pathname=usePathname().replace(/\/+$/, "") || "/";
  if(pathname==="/mapa") return null;
  return <footer className="site-footer"><div className="footer-top"><div><Link href="/" className="footer-brand"><Image src="/brand/caribbean-guard.png" width={104} height={104} alt="" /><span>Caribbean Guard</span></Link><p>Una comunidad que cuida su costa.<br/>Caribe Sur, Costa Rica.</p></div><nav aria-label="Explorar"><span>Explorar</span><Link href="/playas">Playas y mapa</Link><Link href="/programas">Programas</Link><Link href="/organizacion">La organización</Link><Link href="/buscar">Buscar</Link></nav><nav aria-label="Participar"><span>Participar</span><Link href="/involcrate">Voluntariado y contacto</Link><Link href="/alianzas">Alianzas</Link><Link href="/donar">Donar</Link><a href="https://www.instagram.com/caribbeanguard/" target="_blank" rel="noreferrer">Instagram </a></nav></div><div className="footer-bottom"><span>Comunidad · Educación · Prevención</span><a href="tel:911">Emergencias: 911</a><span>Información general, no condiciones en vivo.</span></div></footer>;
}

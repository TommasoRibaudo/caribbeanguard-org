"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

const links = [{label:"Playas y mapa",href:"/playas"},{label:"Programas",href:"/programas"},{label:"La organización",href:"/organizacion"},{label:"Alianzas",href:"/alianzas"}];
export default function SiteHeader() {
  const pathname = usePathname().replace(/\/+$/, "") || "/";
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menu = menuPath === pathname;
  function setMenu(open: boolean) { setMenuPath(open ? pathname : null); }
  const trigger = useRef<HTMLButtonElement>(null);
  if (menuPath !== null && menuPath !== pathname) setMenuPath(null);
  function close() { setMenu(false); trigger.current?.focus(); }
  if (pathname === "/mapa") return null;
  return <header className="site-header" onKeyDown={event => { if (event.key === "Escape" && menu) close(); }}>
    <div className="header-inner"><Link href="/" className="brand-lockup" aria-label="Caribbean Guard, inicio"><Image src="/brand/caribbean-guard.png" width={80} height={80} alt="" priority /><span>Caribbean<br/>Guard</span></Link>
      <nav className="desktop-nav" aria-label="Principal">{links.map(link => <Link key={link.href} href={link.href} aria-current={pathname===link.href ? "page" : undefined}>{link.label}</Link>)}</nav>
      <div className="header-actions"><Link href="/buscar" className="header-search" aria-label="Buscar"><span aria-hidden="true">⌕</span><span>Buscar</span></Link><Link className="support-link" href="/donar">Apoyar </Link><Link href="/mapa" className="mobile-map">Ver mapa </Link><button ref={trigger} className="menu-toggle" aria-expanded={menu} aria-controls="mobile-navigation" aria-label={menu?"Cerrar menú":"Abrir menú"} onClick={()=>setMenu(!menu)}>{menu ? "Cerrar" : "Menú"}<span aria-hidden="true">{menu ? "×" : "☰"}</span></button></div>
    </div>
    <nav id="mobile-navigation" className="mobile-nav" hidden={!menu} aria-label="Navegación móvil">{links.map(link=><Link key={link.href} href={link.href} onClick={()=>setMenu(false)}>{link.label}</Link>)}<Link href="/involcrate">Participar y contactar </Link><Link href="/donar">Apoyar la organización </Link></nav>
  </header>;
}

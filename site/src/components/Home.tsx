import Image from "next/image";
import Link from "next/link";
import SearchBox from "./SearchBox";
import ProgramCards from "./ProgramCards";
import { homeContent } from "@/content/home";
import CoastalVideo from "./CoastalVideo";

export default function Home() {
  return <>
    <section className="home-hero">
      <div className="home-intro page-width">
        <div>
          <h1>Caribbean Guard<br/>Salvando Vidas</h1>
          <p className="hero-description">Una comunidad dedicada a la educación y la prevención de ahogamientos en el Caribe Sur.</p>
        </div>
        <div className="hero-tools">
          <SearchBox />
          <div className="hero-links">
            <Link href="/mapa" className="button-primary">Explorar el mapa</Link>
            <Link href="/programas" className="text-link">Conocer los programas</Link>
          </div>
        </div>
      </div>
      <figure className="hero-team">
        <Image src="https://lh3.googleusercontent.com/d/1WVvW79pf7R_ykyeS9h788AfM7C844DkV=w1920" alt="El equipo y la comunidad de Caribbean Guard reunidos con su bandera" width={1920} height={1080} priority unoptimized referrerPolicy="no-referrer" />
      </figure>
    </section>
    <section className="home-map-section">
      <div className="page-width">
        <div className="section-heading"><h2>Encuentra tu playa</h2><Link className="text-link" href="/mapa">Abrir mapa completo</Link></div>
        <iframe className="home-map" src="/mapa/overview.html" title="Mapa de las playas del Caribe Sur" loading="lazy" />
        <p className="map-caption">Selecciona una playa para abrir su guía. Este mapa no muestra las condiciones del mar en vivo.</p>
      </div>
    </section>
    <section className="community-section">
      <div className="page-width"><div className="section-heading"><h2>Nuestros programas</h2></div><ProgramCards /></div>
    </section>
    <CoastalVideo />
    <section className="page-width story-section">
      <Image className="story-photo" src={homeContent.hero.backgroundImage.url} alt={homeContent.hero.backgroundImage.alt} width={960} height={720} unoptimized referrerPolicy="no-referrer" />
      <div className="story-copy">
        <h2>La comunidad que cuida esta costa</h2>
        <p>Guardavidas, nadadores, pescadores y vecinos que comparten su conocimiento para cuidar el Caribe Sur.</p>
        <Link href="/organizacion" className="text-link">Conoce a Caribbean Guard</Link>
        <div className="story-links"><Link href="/team">Nuestro equipo</Link><Link href="/involcrate">Participar</Link><Link href="/alianzas">Alianzas</Link></div>
      </div>
    </section>
    <section className="support-band page-width"><h2>Ayuda a cuidar esta costa</h2><Link href="/donar" className="button-primary">Cómo apoyar</Link></section>
  </>;
}

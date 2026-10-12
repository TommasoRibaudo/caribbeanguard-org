import Image from "next/image";
import Link from "next/link";
import { programaPlayaOrganizadaContent } from "@/content/programa-playa-organizada";
import { lifesavingClubContent } from "@/content/lifesaving-club";

export const metadata = { title: "Alianzas" };
const communityPhoto = programaPlayaOrganizadaContent.list.items[3].image;
const trainingPhoto = programaPlayaOrganizadaContent.list.items[6].image;
const beachPhoto = lifesavingClubContent.list.items[1].image;

export default function PartnersPage() {
  return <div className="page-width directory-page partnerships-page">
    <div className="partnerships-intro">
      <div className="page-heading">
        <h1>Cuidar la costa<br/>es un trabajo compartido.</h1>
        <p>Conoce nuestros programas, identifica cómo puedes contribuir y conversa con Caribbean Guard sobre una colaboración.</p>
        <a className="button-primary" href="mailto:caribbeanguard.pv@gmail.com?subject=Alianza%20con%20Caribbean%20Guard">Contactar sobre una alianza</a>
      </div>
      <figure className="partnerships-hero">
        <Image src={communityPhoto.url} alt={communityPhoto.alt} width={800} height={600} priority unoptimized referrerPolicy="no-referrer" />
      </figure>
    </div>
    <div className="partner-columns">
      <article>
        <Image src={beachPhoto.url} alt={beachPhoto.alt} width={800} height={600} unoptimized referrerPolicy="no-referrer" />
        <h2>Participa desde tu comunidad.</h2>
        <p>Explora el Programa Playa Organizada y las formas de colaborar con educación, equipamiento y cuidado de la costa.</p>
        <Link href="/programa-playa-organizada" className="text-link">Conocer el programa</Link>
      </article>
      <article>
        <Image src={trainingPhoto.url} alt={trainingPhoto.alt} width={800} height={600} unoptimized referrerPolicy="no-referrer" />
        <h2>Define una colaboración concreta.</h2>
        <p>Solicita información actualizada sobre cobertura, responsables, necesidades y documentación antes de acordar una colaboración.</p>
        <Link href="/organizacion#equipo" className="text-link">Conocer al equipo</Link>
      </article>
    </div>
    <div className="feature-callout">
      <h2>Una base clara para colaborar.</h2>
      <p>La organización debe confirmar el alcance operativo, los resultados y la documentación de cada propuesta. Esta web no acredita presencia de guardavidas en tiempo real ni presenta un informe institucional verificado.</p>
      <div className="inline-links"><Link href="/proyectos">Proyectos y necesidades</Link><Link href="/donar">Datos de la asociación y donaciones</Link></div>
    </div>
  </div>;
}

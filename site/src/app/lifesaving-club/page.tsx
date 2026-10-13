import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { lifesavingClubContent } from "@/content/lifesaving-club";

export const metadata: Metadata = {
  title: "Lifesaving Club",
  description:
    "El Lifesaving Club de Caribbean Guard forma guardavidas, patrulla las playas del Caribe Sur y mantiene una red de alerta de emergencias.",
};

export default function LifesavingClubPage() {
  return (
    <div className="program-detail page-width">
      <header className="program-introduction">
        <div>
          <h1>Lifesaving Club</h1>
          <p>Educación continua, entrenamiento y participación comunitaria para prevenir ahogamientos en el Caribe Sur.</p>
        </div>
        <Image src={lifesavingClubContent.intro.image.url} alt={lifesavingClubContent.intro.image.alt} width={180} height={180} unoptimized referrerPolicy="no-referrer" />
      </header>
      <div className="program-activities">
        {lifesavingClubContent.list.items.map((item, index) => (
          <section className="program-activity" key={item.title} aria-labelledby={`activity-${index}`}>
            <Image className="program-activity-photo" src={item.image.url} alt={item.image.alt} width={800} height={600} unoptimized referrerPolicy="no-referrer" priority={index === 0} />
            <div className="program-activity-copy">
              <h2 id={`activity-${index}`}>{item.title}</h2>
              <div className="program-activity-description" dangerouslySetInnerHTML={{ __html: item.descriptionHtml }} />
            </div>
          </section>
        ))}
      </div>
      <section className="program-contact">
        <div><h2>Participa en el Lifesaving Club</h2><p>Contacta con el equipo para conocer las próximas actividades.</p></div>
        <Link href="/involcrate#contacto" className="button-primary">Contactar</Link>
      </section>
    </div>
  );
}

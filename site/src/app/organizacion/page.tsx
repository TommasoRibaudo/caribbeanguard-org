import Image from "next/image";
import Link from "next/link";
import { nuestroTrabajoContent } from "@/content/nuestro-trabajo";
import { teamContent } from "@/content/team";
import { proyectosContent } from "@/content/proyectos";
import { organizationStory } from "@/content/organization-story";
import { programs } from "@/lib/directory";

export const metadata = {
  title: "La organización",
  description: "La historia, las personas y los proyectos de Caribbean Guard, una comunidad que trabaja para prevenir ahogamientos en el Caribe Sur.",
};

const featuredIndexes = [4, 0, 1, 2];

function Person({ index }: { index: number }) {
  const person = teamContent.cards[index];
  const biography = teamContent.accordion[index];
  return <article className="org-person">
    <Image src={person.image.url} alt={person.image.alt} width={600} height={600} unoptimized referrerPolicy="no-referrer" />
    <h3>{person.title}</h3>
    <div className="org-person-role" dangerouslySetInnerHTML={{ __html: person.descriptionHtml }} />
    <details className="org-biography"><summary>Conoce a {person.title.split(" ")[0]}</summary><div className="rich-text" dangerouslySetInnerHTML={{ __html: biography.contentHtml }} /></details>
  </article>;
}

export default function OrganizationPage() {
  return <article className="organization-story">
    <header className="org-intro page-width">
      <h1>La comunidad detrás<br/>de Caribbean Guard</h1>
      <p>{organizationStory.intro}</p>
    </header>
    <figure className="org-opening-photo page-width">
      <Image src={nuestroTrabajoContent.intro.image.url} alt="Integrante de Caribbean Guard en la playa" width={1600} height={1000} priority unoptimized referrerPolicy="no-referrer" />
    </figure>

    <section className="org-origin page-width" id="historia">
      <div className="org-section-copy"><h2>Todo empezó con una guardia</h2>{organizationStory.origin.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
      <figure><Image src={nuestroTrabajoContent.story.image.url} alt={nuestroTrabajoContent.story.image.alt} width={1200} height={900} unoptimized referrerPolicy="no-referrer" /><figcaption>Archivo de Caribbean Guard</figcaption></figure>
    </section>

    <section className="org-work-band" id="trabajo"><div className="org-work page-width">
      <Image src={programs[0].image} alt={programs[0].alt} width={800} height={700} unoptimized referrerPolicy="no-referrer" />
      <div className="org-section-copy"><h2>Aprender también es prevenir</h2><p>{organizationStory.workIntro}</p>
        <ul className="org-work-list">{organizationStory.work.map(item => <li key={item.title}><h3>{item.title}</h3><p>{item.description}</p></li>)}</ul>
      </div>
    </div></section>

    <section className="org-people page-width" id="equipo">
      <div className="org-section-copy"><h2>La familia de mar</h2><p>{organizationStory.people}</p></div>
      <div className="org-people-grid">{featuredIndexes.map(index => <Person key={index} index={index} />)}</div>
      <details className="org-team-more"><summary>Conoce al resto del equipo</summary><div className="org-people-grid">{teamContent.cards.map((_,index) => featuredIndexes.includes(index) ? null : <Person key={index} index={index} />)}</div></details>
    </section>

    <section className="org-projects page-width" id="proyectos">
      <div className="org-section-copy"><h2>Lo que queremos hacer posible</h2><p>El siguiente paso es sostener el trabajo de la comunidad con mejores espacios y recursos. Estas son las necesidades y propuestas que plantea la organización.</p></div>
      <div className="org-project-grid">{organizationStory.projects.map((project,index) => <article key={project.title}>
        <Image src={proyectosContent.list.items[index].image.url} alt={proyectosContent.list.items[index].image.alt} width={800} height={600} unoptimized referrerPolicy="no-referrer" />
        <h3>{project.title}</h3><p>{project.description}</p>
        <details><summary>Ver la propuesta completa</summary><div className="rich-text" dangerouslySetInnerHTML={{__html:proyectosContent.list.items[index].descriptionHtml}} /></details>
      </article>)}</div>
    </section>

    <section className="org-vision page-width" id="vision">
      <div className="org-section-copy"><h2>Un esfuerzo compartido</h2><p>{organizationStory.visionIntro}</p></div>
      <div className="org-vision-grid">{organizationStory.vision.map(item => <div key={item.title}><h3>{item.title}</h3><p>{item.description}</p></div>)}</div>
    </section>

    <section className="support-band page-width org-support"><div><h2>Tu experiencia también cuenta</h2><p>Hay maneras de colaborar dentro y fuera del agua.</p></div><div className="org-support-actions"><Link className="button-primary" href="/involcrate#contacto">Hablar con el equipo</Link><Link className="text-link" href="/donar">Cómo apoyar</Link></div></section>
  </article>;
}

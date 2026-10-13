import type { SearchEntry } from "./search";
import { beaches, beachHref } from "./directory";
import { homeContent } from "@/content/home";
import { swimClubContent } from "@/content/swim-club";
import { lifesavingClubContent } from "@/content/lifesaving-club";
import { freedivingClubContent } from "@/content/freediving-club";
import { programaPlayaOrganizadaContent } from "@/content/programa-playa-organizada";
import { proyectosContent } from "@/content/proyectos";
import { nuestroTrabajoContent } from "@/content/nuestro-trabajo";
import { nuestroTrabajo1Content } from "@/content/nuestro-trabajo1";
import { teamContent } from "@/content/team";
import { involcrateContent } from "@/content/involcrate";
import { donarContent } from "@/content/donar";
import { visionContent } from "@/content/vision";
import { organizationStory } from "@/content/organization-story";

function text(value: unknown): string {
  if (typeof value === "string") return /^https?:/.test(value) ? "" : value.replace(/<[^>]+>/g, " ").replace(/&(?:nbsp|amp|quot);/g, " ");
  if (Array.isArray(value)) return value.map(text).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(text).join(" ");
  return "";
}
function entry(title: string, href: string, category: string, summary: string, keywords: string, content?: unknown): SearchEntry {
  return { title, href, category, summary, keywords, body: text(content) };
}
export const searchIndex: SearchEntry[] = [
  ...beaches.map(beach => entry(beach.name, beachHref(beach), "Playa", "Abrir esta playa en el mapa. Consulta la guía y su estado de revisión.", `playa beach mapa map ${beach.area}`)),
  entry("Mapa de playas", "/mapa", "Mapa", "Explora las playas del Caribe Sur. Información general, no condiciones en vivo.", "mapa playas beach coast seguridad safety"),
  entry("La organización", "/organizacion", "Organización", "Nuestra historia, las personas y los proyectos de Caribbean Guard en una sola página.", "organizacion nosotros comunidad historia equipo vision proyectos", organizationStory),
  entry("Natación · Swim Club", "/swim-club", "Programa", "Entrenamientos de natación en piscina y aguas abiertas.", "natacion nadar clases niños piscina swim swimming", swimClubContent),
  entry("Guardavidas · Lifesaving Club", "/lifesaving-club", "Programa", "Educación continua, formación y actividades de salvamento.", "guardavidas lifeguard cursos rcp cpr primeros auxilios rescate", lifesavingClubContent),
  entry("Apnea · Freediving Club", "/freediving-club", "Programa", "La comunidad de apnea y freediving de Caribbean Guard.", "apnea freediving buceo", freedivingClubContent),
  entry("Programa Playa Organizada", "/programa-playa-organizada", "Programa", "Conoce los componentes del programa, el mapeo y la participación local.", "ppo banderas estaciones equipo rescate socios hoteles", programaPlayaOrganizadaContent),
  entry("Proyectos y necesidades", "/proyectos", "Organización", "Bodega Digna, guardia móvil y el proyecto de centro acuático.", "bodega almacen almacenamiento patrulla movil centro acuatico cadar funding", proyectosContent),
  entry("Equipo de Caribbean Guard", "/team", "Personas", "Conoce a los guardavidas, instructores y voluntarios.", "equipo team personas responsables directiva", teamContent),
  entry("Historia de Caribbean Guard", "/nuestro-trabajo", "Organización", "Cómo comenzó la organización y su relación con la comunidad.", "historia nosotros organizacion quienes somos", nuestroTrabajoContent),
  entry("Nuestro trabajo", "/nuestro-trabajo1", "Organización", "Educación, formación y proyectos de seguridad acuática.", "trabajo educacion capacitacion", nuestroTrabajo1Content),
  entry("Visión y comunidad", "/vision", "Organización", "La propuesta de participación de comunidad, empresas e instituciones.", "vision mision estrategia gobierno ley", visionContent),
  entry("Contacto y voluntariado", "/involcrate#contacto", "Contacto", "Escríbenos para participar, resolver dudas o colaborar con la organización.", "contacto email correo telefono volunteer voluntariado colaborar unirse", involcrateContent),
  entry("Donar y apoyar", "/donar", "Apoyo", "Opciones de donación y datos de la asociación.", "donar donaciones donation paypal sinpe banco apoyo", donarContent),
  entry("Alianzas", "/alianzas", "Alianzas", "Colaboración para empresas locales, organizaciones e instituciones.", "alianzas partners partnership municipalidad gobierno instituciones hoteles empresas presupuesto"),
  entry("Programas", "/programas", "Programas", "Encuentra las actividades de educación, natación, salvamento y apnea.", "programas actividades cursos formacion"),
  entry("Caribbean Guard", "/", "Inicio", "Playas, programas y comunidad del Caribe Sur de Costa Rica.", "inicio caribbean guard costa rica caribe sur", homeContent),
];

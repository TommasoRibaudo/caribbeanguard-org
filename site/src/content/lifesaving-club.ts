import { driveImage } from "@/lib/drive";

export const lifesavingClubContent = {
  intro: {
    html: ['<h1 style="white-space:pre-wrap;">LIFESAVING CLUB</h1>'],
    image: driveImage("1UcBVlQzEGdVL17NLc9FPmJHCeaWogUdm", "Logo del Lifesaving Club", 800),
  },
  list: {
    title: "",
    layout: "carousel" as const,
    items: [
      {
        title: "Educación continua",
        descriptionHtml:
          "<p>La educación continua es la columna vertebral de la asociación. Hemos impartido los siguientes cursos a la comunidad:</p><ul><li>5 cursos de guardavidas</li><li>1 curso para instructores de RCP y primeros auxilios</li><li>1 curso para instructores de natación</li><li>1 curso de guardavidas Jr. Nipper</li><li>1 curso ELLIS de RCP</li></ul>",
        image: driveImage("1p1pWGKu6GgP_BKFaAL6UmYxvpzYaTwPk", "Curso de guardavidas", 800),
      },
      {
        title: "Guardias",
        descriptionHtml:
          "<p>Desde la creación de la organización, hasta hoy, nunca murió nadie en nuestras guardias.</p><p>Patrullamos Playa Grande y ahora Playa Chiquita:</p><ul><li>Los domingos, los días con más incidencias de ahogamiento en todo el país.</li><li>Guardias extras para Semana Santa, algunos feriados y días festivos.</li></ul>",
        image: driveImage("15UWj_wxkj-Hzbt9xzI8gkENayDAwc6h_", "Guardavidas patrullando Playa Grande", 800),
      },
      {
        title: "Entrenamiento de salvamento",
        descriptionHtml:
          "<p>Entrenamientos abiertos a la comunidad para practicar técnicas y habilidades de salvamento.</p><ul><li>Todos los sábados por la mañana.</li><li>En diferentes lugares, según las condiciones del mar.</li></ul>",
        image: driveImage("11d-LezrAv0kV7Evk6RQ44UzorpqhT59E", "Entrenamiento de salvamento acuático", 800),
      },
      {
        title: "Red de alerta de emergencias",
        descriptionHtml:
          "<p>Tenemos un grupo de emergencias con más de 70 miembros de la comunidad. La mayoría son guardavidas, surfistas, nadadores, pescadores, buceadores y apneistas.</p><p>En cuanto sucede una emergencia, activamos el protocolo y las personas que están cerca del incidente y pueden ayudar se acercan a colaborar en el rescate. Muchas vidas se han salvado.</p>",
        image: driveImage(
          "1MLg72IBLViHVX15kwaiDipt_AArs7Uh4",
          "Voluntarios de la red de alerta de emergencias",
          800,
        ),
      },
    ],
  },
};

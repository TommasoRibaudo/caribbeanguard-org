export const beaches = [
  { name: "Playa Negra", id: "playa-negra", area: "Puerto Viejo" },
  { name: "Puerto Viejo", id: "salsa-brava", area: "Centro" },
  { name: "Playa Cocles", id: "cocles", area: "Cocles" },
  { name: "Playa Chiquita", id: "chiquita", area: "Playa Chiquita" },
  { name: "Punta Uva", id: "punta-uva", area: "Punta Uva" },
  { name: "Playa Grande", id: "playa-grande", area: "Gandoca-Manzanillo" },
  { name: "Manzanillo", id: "manzanillo", area: "Manzanillo" },
];
export function beachHref(beach: {id:string}) { return `/mapa?${["playa-grande","manzanillo"].includes(beach.id) ? "b" : "z"}=${beach.id}`; }
export const programs = [
  { name: "Aprender a nadar", label: "Swim Club", href: "/swim-club", description: "Natación en piscina y aguas abiertas para la comunidad.", image: "https://lh3.googleusercontent.com/d/11gUlrttl4nI2TMLWqff9ijljksfANGy7=w800", alt: "Entrenamiento del Swim Club en el mar" },
  { name: "Formarse para cuidar", label: "Lifesaving Club", href: "/lifesaving-club", description: "Educación continua, prevención y formación en salvamento acuático.", image: "https://lh3.googleusercontent.com/d/1p1pWGKu6GgP_BKFaAL6UmYxvpzYaTwPk=w800", alt: "Curso de guardavidas de Caribbean Guard" },
  { name: "Conocer el mar", label: "Freediving Club", href: "/freediving-club", description: "Una comunidad que comparte su vínculo con la apnea y el mar.", image: "https://lh3.googleusercontent.com/d/1WVvW79pf7R_ykyeS9h788AfM7C844DkV=w800", alt: "Integrante del Freediving Club" },
];

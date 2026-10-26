import Image from "next/image";

const posts = [
  {
    image: "/instagram/beach-rescue-equipment.jpg",
    alt: "Integrante de Caribbean Guard en la playa con un aro y un flotador de rescate",
    label: "Equipo en la playa",
    url: "https://www.instagram.com/p/DWkg6nyjqWj/",
    width: 1350,
    height: 1688,
  },
  {
    image: "/instagram/beach-prevention.jpg",
    alt: "Guardavidas caminando por la playa con equipo de rescate",
    label: "Prevención",
    url: "https://www.instagram.com/reel/DbPLumwvW7I/",
    width: 720,
    height: 1280,
  },
  {
    image: "/instagram/wolaba-parade.jpg",
    alt: "Participante de la Wolaba Parade en una calle del Caribe Sur",
    label: "Nuestra comunidad",
    url: "https://www.instagram.com/reel/Dcrd_IFMdea/",
    width: 720,
    height: 1280,
  },
  {
    image: "/instagram/patrol.jpg",
    alt: "Equipo de rescate transportado por carretera con la bandera de Costa Rica",
    label: "En camino",
    url: "https://www.instagram.com/reel/DdSb_W_MYvf/",
    width: 1320,
    height: 2347,
  },
];

export default function InstagramGallery() {
  return <section className="instagram-gallery page-width" aria-labelledby="instagram-gallery-title">
    <div className="instagram-gallery-heading">
      <h2 id="instagram-gallery-title">Desde nuestro Instagram</h2>
      <a className="text-link" href="https://www.instagram.com/caribbeanguard/" target="_blank" rel="noopener noreferrer">Ver @caribbeanguard</a>
    </div>
    <div className="instagram-gallery-grid">
      {posts.map(post => <a className="instagram-gallery-card" href={post.url} key={post.url} target="_blank" rel="noopener noreferrer" aria-label={`${post.label}. Ver publicación en Instagram`}>
        <Image src={post.image} alt={post.alt} width={post.width} height={post.height} loading="lazy" />
        <span>{post.label}<span aria-hidden="true"> ↗</span></span>
      </a>)}
    </div>
  </section>;
}

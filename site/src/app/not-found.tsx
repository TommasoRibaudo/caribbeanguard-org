import Link from "next/link";

export default function NotFound() {
  return <div className="page-width directory-page">
    <div className="page-heading"><h1>No encontramos esta página</h1><p>Puedes volver al inicio o buscar una playa, un programa o información de Caribbean Guard.</p></div>
    <div className="inline-links"><Link className="button-primary" href="/">Volver al inicio</Link><Link className="text-link" href="/buscar">Buscar en el sitio</Link></div>
  </div>;
}

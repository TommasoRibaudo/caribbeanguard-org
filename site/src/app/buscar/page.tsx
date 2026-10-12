import { Suspense } from "react";
import SearchResults from "./SearchResults";
export const metadata={title:"Buscar"};
export default function SearchPage(){return <div className="page-width directory-page search-page"><div className="page-heading"><h1>Lo que buscas,<br/><span>sin dar vueltas.</span></h1></div><Suspense fallback={<p>Cargando búsqueda…</p>}><SearchResults/></Suspense></div>;}

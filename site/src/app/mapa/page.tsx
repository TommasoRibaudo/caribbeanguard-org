import { Suspense } from "react";
import MapFrame from "./MapFrame";
export const metadata={title:"Mapa de playas"};
export default function MapPage(){return <section className="map-page" aria-label="Mapa de playas"><h1 className="sr-only">Mapa de playas del Caribe Sur</h1><Suspense fallback={<p className="map-loading">Abriendo el mapa…</p>}><MapFrame/></Suspense></section>;}

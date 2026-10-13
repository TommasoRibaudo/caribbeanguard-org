"use client";
import Link from "next/link";
import { useId, useState } from "react";
import { searchEntries } from "@/lib/search";
import { searchIndex } from "@/lib/search-content";

export default function SearchBox({ initialQuery = "", full = false }: { initialQuery?: string; full?: boolean }) {
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const id = useId();
  const results = searchEntries(searchIndex, query);
  const shown = full ? results : results.slice(0, 5);
  return <div className={`search-widget ${full ? "search-full" : ""}`}>
    <form action="/buscar" role="search" className="search-form" onKeyDown={event => { if (event.key === "Escape") setOpen(false); }}>
      <label htmlFor={id}>¿Qué necesitas encontrar?</label>
      <div className="search-field"><span aria-hidden="true" className="search-glyph">⌕</span><input id={id} type="search" name="q" value={query} maxLength={160} autoComplete="off" placeholder="Buscar playas, programas…" onFocus={() => setOpen(true)} onChange={event => { setQuery(event.target.value); setOpen(true); }} aria-controls={`${id}-results`} /><button type="submit" aria-label="Buscar en todo el sitio">Buscar </button></div>

    </form>
    {(full || (open && query.trim())) && <div id={`${id}-results`} className="search-results">
      <div className="search-results-head"><p role="status">{query.trim() ? `${results.length} resultado${results.length === 1 ? "" : "s"}` : "Empieza por una palabra"}</p>{!full && <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar resultados">×</button>}</div>
      {shown.map(result => <Link className="search-result" href={result.href} key={result.href} onClick={() => setOpen(false)}><strong>{result.title}</strong><p>{result.summary}</p></Link>)}
      {query.trim() && !results.length && <p className="search-empty">No encontramos esa búsqueda. Prueba con una playa, «natación», «guardavidas» o «contacto».</p>}
      {!query.trim() && <div className="search-suggestions">{["Cocles", "Natación", "Voluntariado", "Contacto"].map(term => <button type="button" key={term} onClick={() => setQuery(term)}>{term}</button>)}</div>}
      {!full && results.length > 5 && <Link className="search-all" href={`/buscar?q=${encodeURIComponent(query)}`}>Ver todos los resultados </Link>}
    </div>}
  </div>;
}

export type SearchEntry = { title: string; href: string; category: string; summary: string; keywords: string; body?: string };

export function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

const aliases = [
  ["natacion", "nadar", "swim", "swimming"],
  ["guardavidas", "lifeguard", "lifesaving", "salvamento"],
  ["apnea", "freediving"], ["donar", "donacion", "donaciones", "donate", "donation"],
  ["voluntario", "voluntariado", "volunteer", "colaborar"],
  ["rcp", "cpr"], ["playa", "playas", "beach", "beaches"],
  ["contacto", "contact", "correo", "email"], ["equipo", "team"],
  ["mapa", "map"], ["alianzas", "partners", "partnership"],
];
const stopwords = new Set(["de", "del", "la", "el", "las", "los", "en", "un", "una", "y", "the", "of", "in", "and", "a", "para"]);

/** AND between meaningful query terms; aliases expand each term. Titles outrank body mentions. */
export function searchEntries(entries: SearchEntry[], query: string): SearchEntry[] {
  const phrase = normalize(query).slice(0, 160);
  const terms = [...new Set(phrase.split(" ").filter(term => term && !stopwords.has(term)))];
  if (!terms.length) return [];
  return entries.map((entry, order) => {
    const title = normalize(entry.title), words = normalize(entry.keywords), body = normalize(`${entry.summary} ${entry.body || ""}`);
    let score = title === phrase ? 200 : title.includes(phrase) ? 80 : 0;
    for (const term of terms) {
      const choices = aliases.find(group => group.includes(term)) || [term];
      const matches = (text: string) => choices.some(choice => text.split(" ").some(word => word === choice || (choice.length >= 3 && word.startsWith(choice))));
      if (matches(title)) score += 35;
      else if (matches(words)) score += 15;
      else if (matches(body)) score += 3;
      else return { entry, score: 0, order };
    }
    return { entry, score, order };
  }).filter(result => result.score > 0).sort((a, b) => b.score - a.score || a.order - b.order).map(result => result.entry);
}

# Website type system

Date: 2026-10-26
Status: Approved for the current website PR. The logo artwork is unchanged.

Caribbean Guard uses **Zilla Slab** for identity and editorial headings and **Source Sans 3** for reading, navigation, and actions. Both families are self-hosted under the SIL Open Font License. This keeps the website close to the logo's slab-serif character without using the logo image as a text font.

| Role | Family and weight | Desktop size | Phone size |
| --- | --- | ---: | ---: |
| Brand wordmark | Zilla Slab 700 | 20 px | 14 px |
| Main page title | Zilla Slab 700 | 40 to 56 px | 36 to 40 px |
| Section title | Zilla Slab 600 | 30 to 38 px | about 30 px |
| Card heading | Source Sans 3 700 | 23 to 24 px | responsive to the card |
| Body text | Source Sans 3 400 | 17 px | 16 px |
| Navigation and actions | Source Sans 3 600 | 14 to 15 px | 12 to 15 px where space requires |
| Caption and metadata | Source Sans 3 400 to 600 | 13 to 14 px | 11 to 14 px |

`site/src/app/layout.tsx` loads the local font files. `site/src/app/globals.css` applies the roles and responsive sizes. The font binaries and their licenses are in `site/src/app/fonts/`. Do not substitute a remote Google Fonts request for these local files.

The separate map PR carries the same families with a safety-first hierarchy: Source Sans 3 remains the family for every hazard instruction. Changing typography must not alter risk colors or imply live beach conditions.

Before release, inspect Spanish accents and inverted punctuation, long headings, phone wrapping, and contrast in sunlight. Build checks do not replace visual review.

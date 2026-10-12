# White website preview

Date: 2026-10-12
Branch: `codex/white-site-preview`
Preview: http://127.0.0.1:5190

Status update: the completed route walkthrough, subsequent fixes and release limitations are recorded in `docs/handoffs/2026-10-12-website-walkthrough.md`. The later handoff supersedes the historical local-only and pending redirect notes below.

## What changed

- White surfaces, blue accents, calmer type and responsive navigation.
- Beach-first homepage, seven beach links, programs, organization and institutional collaboration pages.
- Site-wide keyword search over existing authored content. Accent normalization, common Spanish/English equivalents, weighted title matching and multiword filtering. Search is bilingual; the website copy remains Spanish.
- Existing interactive map packaged locally at `/mapa/app/index.html`, framed by `/mapa`. Beach query parameters are forwarded. Source safety data and geometry are unchanged.
- Long program descriptions are available in native expandable sections instead of clipped carousel cards.
- Contact anchor added and static-export image configuration fixed.

## Why

Visitors should find a beach or program immediately. Institutional visitors have a distinct route to existing organization information and contact. The map stays inside the preview's address rather than moving to an unfamiliar Vercel hostname.

## How to verify

Run `npm --prefix site run dev -- --hostname 127.0.0.1 --port 5190` from this checkout. It prepares website assets before starting. The local server was left running for review.

- Production static build passed for all 23 generated pages, including TypeScript.
- Five search tests passed: accents/aliases, title ranking, multiword matching, empty/unmatched queries, and contact synonyms.
- Map copy checks passed; map build and website asset preparation verified 535 offline asset references.
- Script syntax and `git diff --check` passed.
- Browser verified search for `natacion`, then `Cocles`; the Cocles result opened the embedded map and selected its beach sheet under the local origin.
- Phone viewport checked at 390 x 844: no horizontal overflow, all homepage images loaded, mobile menu expanded correctly. Search control has an accessible name at phone sizes.

## What's left

### Browser review revision

Applied Daniel's eleven browser comments: larger header logo, footer logo, one DM Sans family with a defined hierarchy, removed decorative arrows and overlines throughout the new website routes, removed search helper text, broadened the coastal image, enlarged program photography and added the original lifeguard photo to the community section. Guidelines are in `docs/design/website-type-and-imagery.md`.

The revised production build and TypeScript passed. Desktop and 390 px phone views were inspected; all seven homepage images loaded, neither layout overflowed, no arrow glyphs or overline elements remained on the homepage, and Cocles search still returned its direct map link. Header logo measured 60 px on phone.

Second review revision: homepage heading is now `Caribbean Guard / Salvando Vidas`, followed by the complete existing group photo at its native 1920 x 1080 ratio. Added `CoastalVideo.tsx` for the existing film below programs: muted inline playback when visible, native controls, pause when offscreen, and manual play for reduced-motion users. Replaced the homepage beach list with `site/public/mapa/overview.html`, a compact Leaflet overview. The asset preparation script derives its seven locations and guide URLs directly from the original map declarations into an ignored generated JSON file. The overview has no safety tier coloring. Removed decorative divider lines; pale blue backgrounds and spacing distinguish sections.

Second revision validation: production build/TypeScript and map copy checks passed. Browser verified video playback was unpaused, muted and advancing, then paused offscreen. Desktop and 390 px phone layouts displayed the full team photo with no horizontal overflow. The mini map rendered local imagery and all seven places; the Playa Grande link navigated to `/mapa?b=playa-grande` and opened the correct beach sheet. Map source data and geometry remain unchanged.

Third review fix: the last accessibility-label adjustment had called `marker.getElement()` before Leaflet's first map view, when no marker DOM existed. That stopped overview initialization. Labels now apply in the marker's `add` event, and initialization failures retain diagnostic console output. Fresh desktop and mobile loads showed all seven named marker controls; clicking Cocles and Manzanillo opened their full guides. `/mapa` now suppresses the shared website header and fills `100dvh`, retaining only the map's own navigation. Its existing generated logo link (`/`, target `_top`) was clicked and verified to return to the homepage with the website header restored. Mobile frame measured 844 px for an 844 px viewport, starting at y=0; desktop also started at y=0 with no website header.

Fourth review revision: reformatted `site/src/app/lifesaving-club/page.tsx` into a compact introduction and four spacious photo/text activity rows. Added scoped program-detail styles in `globals.css`. Converted course and schedule information in `site/src/content/lifesaving-club.ts` to semantic lists and sentence-case headings, preserving source numbers and operational statements. No independent confirmation of those legacy statements was performed. Added a contact link for upcoming activities. The production build, TypeScript and diff checks passed. Desktop and 390 px phone views were inspected: all five content images loaded, one H1 and hierarchical H2 sections, nine semantic list items, no horizontal overflow, and no collapsed activity descriptions.

Fifth review revision: replaced the organization gateway with a continuous visual story in `site/src/app/organizacion/page.tsx`. Existing photographs accompany its beginnings, education work, team, proposed projects and collaboration. New `site/src/content/organization-story.ts` summarizes existing source material; biographies and full proposals expand in place. Proposed projects are not presented as completed facilities. The search index now includes the organization narrative. Shared callouts use a more defined pale blue fill and capsule corners, with 32 px corners on phones. Shared buttons and search controls use pill corners; `ButtonBlock.tsx` participates in this treatment.

Fifth revision validation: production build and TypeScript passed. Desktop and 390 px phone layouts were visually inspected with no horizontal overflow. Lucas's biography, the remaining team and the first full project proposal expanded on the same page. The homepage support panel rendered with a 999 px desktop radius and a 32 px mobile radius; buttons retained the full pill shape. Diff checks passed. Existing historical and biographical content remains sourced from the repository, without an independent factual audit.

Sixth review revision: added three existing source photographs to `/alianzas`: local partners alongside the introduction, beach patrols above the community invitation, and first-aid training above the collaboration invitation. Scoped responsive styles in `globals.css` preserve the full hero photograph and stack the content on phones. The team link now opens the inline organization team section. Production build, TypeScript and diff checks passed; all three images loaded on desktop and the 390 px phone layout showed no horizontal overflow.

- Visual review by Daniel before release. No commit, push, deployment or modification to the replica PR was made.
- This is a local design preview. Production `vercel.json` still has the existing external `/mapa` redirects. Remove those redirects only as part of the reviewed integration/release change.
- `web/tiles` is ignored by Git and copied unchanged from the original checkout for this preview. A clean CI environment must have the established tile-generation/download step before packaging. Generated `site/public/mapa/app` and the copied logo are ignored.
- Existing team biography duplication, dated Vision policy language and static Cocles staffing statements remain editorial follow-ups. No operational facts were invented or reclassified for this design.
- Dependency/security handoff for Claude Code: the unchanged production dependency tree reports 6 npm audit findings (1 critical, 4 high, 1 moderate), including Next.js. Review applicability to static export and upgrade/test before production release. No dependency versions or auth were changed here.

## Files touched

- `site/src/app`: root layout/home styles and page, contact anchor, new `alianzas`, `buscar`, `mapa`, `organizacion`, `playas`, `programas` routes.
- `site/src/components`: Home, ProgramCards, SearchBox, SiteHeader, SiteFooter and readable ListSection.
- `site/src/lib`: directory, search index and ranking, default map route.
- `site/tests/search.test.mjs`; `site/next.config.ts`; `site/package.json`; `site/.gitignore`.
- `tools/prepare_site_assets.mjs` and this handoff.

# Website type and imagery

Updated 2026-10-12 after Daniel's browser review.

## Type

Use DM Sans throughout. Keep headings in sentence case and the same dark ink as body text. Blue identifies links and actions; it does not decorate fragments of a heading.

| Role | Desktop | Phone | Weight | Line height |
| --- | --- | --- | --- | --- |
| Page title | 36-52 px, fluid | 36 px | 500 | 1.12 |
| Section heading | 28-36 px, fluid | 28 px | 500 | 1.22 |
| Card heading | 24 px | 23 px | 500 | 1.3 |
| Body | 17 px | 16 px | 400 | 1.6-1.65 |
| Navigation / controls | 15 px | 14-15 px | 500 | 1.4-1.6 |
| Supporting information | 13-14 px | 13-14 px | 400 | 1.6 |

Heading tracking is a modest -0.015 to -0.025 em. Use size and spacing for hierarchy, with no uppercase overlines, numbered decorative labels or repeated slogans. Keep explicit search labels and essential safety information.

## Images and brand

- Header logo: 80 px desktop, 60 px phone; 54 px on narrow screens.
- Footer logo: 104 px desktop, 88 px phone.
- Hero: the existing team group photo at its complete 16:9 ratio, up to 1600 px wide. No cropping or overlaid slogans. Heading: Caribbean Guard / Salvando Vidas.
- Coastal film: the existing Playa Organizada video below the programs, full 16:9 ratio. Muted autoplay on entering the viewport, native playback controls, paused offscreen. Reduced-motion preference keeps it manual.
- Beach overview: compact satellite map with seven neutral numbered locations, linked to the existing full beach guides. The overview is for orientation and makes no safety assessment.
- Programs: large photographs, 300-430 px high desktop and square on phone, followed by a title and one short description.
- Community: use the existing lifeguard photograph, with a short introduction and direct links.
- White is the primary surface. Use blue sparingly for actions; underline secondary text links. No decorative arrow suffixes or divider hairlines. Use generous spacing and pale blue map/support sections to separate content. Keep keyboard focus outlines visible.

Implemented in `site/src/app/globals.css`, shared layout and the new homepage components. Existing map status colors and directional controls are outside this decorative website treatment.

## Detailed program pages

The Lifesaving Club page establishes a readable activity layout: compact title/introduction with the club logo, then one activity per row. A large 4:3 photograph sits beside a section heading, short description and semantic bullet list where the material is a list. On phones, use image, heading, description, bullets in that order. Use 32 px section headings and 17 px body text on desktop, 27 px headings and 16 px body text on phones. Keep 76 px between desktop rows and 48 px on phones. Do not collapse activity descriptions behind disclosure controls.

## Organization narrative and rounded callouts

Tell the organization story continuously: a human portrait, its beginnings, community education, the team, proposed projects, and participation. Summarize existing source copy without introducing new impact claims. Keep biographies and full project descriptions available through inline disclosures. Clearly describe future projects as proposals.

Use a pale blue fill (`#e1eef5`) and generous inset spacing to define support callouts. Short horizontal callouts use a capsule radius; longer content panels use 40 px corners. On phones, use 32 px panel corners to preserve readable text width. Shared action buttons and search controls use a full pill radius. Photographs retain their rectangular framing.

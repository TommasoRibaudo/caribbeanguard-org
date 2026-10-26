# Desktop and mobile behavioral walkthrough

Date: 2026-10-26
Scope: local `site` preview at `http://127.0.0.1:5176/`, responsive frames at 320, 390, 430, 768, and 1024 CSS px, desktop browser at 1265 CSS px. This is a review of the working tree, not the deployed website.

## Walkthrough sequence before fixes

1. Desktop homepage: hero, map overview, programs, coastal video, organization story, Instagram gallery, support panel, and footer. The video loaded and played; its initially dark frame was transient buffering, not a reproducible display fault.
2. Phone homepage at 320, 390, and 430 px: header, hero, map overview and beach links, programs, story, gallery, and support panel. Tablet and small desktop checks at 768 and 1024 px covered the hero/header composition. No page-level horizontal overflow was visible in these frames.
3. Desktop navigation: opened Search, used the Cocles suggestion, then opened Programs and Playas. Search returned the direct Cocles map entry first; the two additional results contain Cocles in indexed body copy. Routes and links rendered without an observed error.
4. Phone inner pages: Playas at 320 and 390 px, Programs at 320 px, Organization at 390 px, Search results at 320 px. Images on the Organization page appeared after lazy loading; the initial empty image areas were a loading state, not a persistent broken asset.
5. Static checks: `npm --prefix site run test:search`, `npm --prefix site run test:export`, `npm --prefix site run lint`, and `npm run check:map` passed before any fix in this review.

## Findings recorded before fixes

| ID | Severity | Reproduction | Finding | Status |
| --- | --- | --- | --- | --- |
| W1 | Moderate visual | Home > Instagram gallery at 390 or 1265 px | The cover labeled “En el agua” reads as a nearly featureless grey square at its rendered crop. It weakens the four-image set and gives no clear preview of the linked reel. | Fixed: replaced with the verified official prevention reel cover; visually checked at 320 and 1265 px. |
| W2 | Minor spacing | Home at 320 px | “Conocer los programas” wraps below “Explorar el mapa” with the desktop flex distribution and a loose vertical gap. The two actions should form an intentional compact stack at this width. | Fixed: explicit compact column layout at widths below 360 px; visually checked at 320 and 390 px. |
| W3 | Minor visual regression | Home gallery at 320 px after replacing W1's cover | The longer replacement caption leaves its external-link arrow alone on a second line. | Fixed: shortened the card label to “Prevención”; visually checked at 320 px. |
| W4 | Minor visual | Home gallery at desktop width during final review | The Wolaba reel cover has part of its embedded “Wolaba Parade” lettering clipped along the bottom of the square crop. | Fixed: shifted the crop upward to keep the portrait without partial lettering; visually checked at 1265 px. |

## Limits and follow-up checks

- The browser tool denied the standalone map origin `http://127.0.0.1:5174/`. I did not route around that denial. `check:map` is a code/data check, so desktop and phone map visuals, hatching, touch controls, and safe-area behavior remain unverified here.
- The browser tool could observe a mobile iframe but could not click controls inside it. Mobile menu open/close and touch interaction remain unverified by this walkthrough. Desktop navigation and search paths were exercised directly.
- A physical iPhone is still needed to verify the Dynamic Island and home-indicator insets; CSS-width frames do not simulate iOS safe-area values.

## Fix and verification log

- The initial findings W1 and W2 were written before product-code edits. W3 and W4 were recorded when they appeared during post-fix visual review, before their respective corrections.
- The new prevention cover is from the official [Caribbean Guard reel](https://www.instagram.com/reel/DbPLumwvW7I/), confirmed in its public Instagram page. The previous cover remains available locally but is no longer shown.
- Rechecked the homepage gallery on desktop and at 320 px, the hero actions at 320 and 390 px, and the card captions at 320 px.
- `npm --prefix site run build`, `npm --prefix site run lint`, and `npm --prefix site run test:export` passed after the new asset and component change. The final crop adjustment was CSS only and was visually checked in the browser.
- This walkthrough was recorded before the website PR was prepared; no merge or deployment was part of the review.

# Live map clean-URL repair

Date: 2026-10-13

## What failed and why

Reproduced on https://www.caribbeanguard.org/mapa after PR #2 was merged. The iframe requests `/mapa/app/index.html`; production canonicalizes this to `/mapa/app`, without a trailing slash. Relative assets then resolve one directory too high: `coastal.css` becomes `/mapa/coastal.css`, and `vendor/leaflet.js` becomes `/mapa/vendor/leaflet.js`. The browser reports `ReferenceError: L is not defined`. This explains both the unstyled oversized controls and the absent map.

The previous local static server did not reproduce Vercel's index-document canonicalization, so the original walkthrough missed this hosting-specific failure.

## What changed

The generated embedded map includes `<base href="/mapa/app/">` immediately after its opening head, before any relative asset references. Styles, scripts, icons, runtime requests and worker registration now resolve against the actual asset folder regardless of the document's canonical URL. The existing generated cache revision also changes with this document change. Standalone map source, geography and public safety content are unchanged.

## How verified

- Added a regression check for relative assets at `/mapa/app`, `/mapa/app/`, `/mapa/app/index.html` and a beach-query URL. It failed on the old export and passed after rebuilding with the fix.
- Production build and four export checks passed; lint, map checks, map build and syntax/diff checks passed.
- Local static browser preview reproduced the production redirect from `/mapa/app/index.html` to `/mapa/app`. Desktop map imagery, styled controls and beach list render correctly. At 390 x 844, the Cocles deep link opens the correct guide and its close control returns to `/mapa`.

## What's left

The owner must review, merge and deploy the repair PR, then verify the production route. No merge or manual deployment is performed by this task. Full offline navigation was not certified in this repair; testing focused on the reported inaccessible online map.

## Files touched

`tools/prepare_site_assets.mjs`, `site/tests/site-export.test.mjs`, this handoff.

Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/base

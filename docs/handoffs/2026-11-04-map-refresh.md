# Official website map refresh

## What changed and why

Syncs the reviewed `web/` map from `danielguerrarmz-create/caribbean-guard-map` release PR #14 (merged as `8bf2b2efa46fce8d99551fb9ea62af5f19464774`). The website was still packaging the older interface. This includes the mobile/desktop panel hierarchy, colored duotone symbols, rescue grouping without public station numbers, reference-area styling, moving dashed rip currents, regional forecasts, loading treatment, safe-area layout and fixed desktop sidebar transitions.

The source retains the latest offline cache integrity fixes and v75 bootstrap assets. Forecasts are regional models, not observed beach-specific swimming conditions. No lifeguard-report system is integrated.

Includes a draft Calle Merlin trailhead candidate and stable `?sign=merlin-entrance` resolution. Its position and public access remain explicitly unverified. Printed poster artifacts and print approval are excluded.

## Website-specific integration

- Packaging derives files from the offline manifest and strips query versions only when checking disk paths. All 551 offline references, new modules and source images are included.
- The iframe keeps its explicit `index.html` entry for local Next development; a `/mapa/app/` base URL also handles Vercel clean-URL redirects. This incorporates the map asset-resolution correction proposed in open PR #3; the owner can reconcile that smaller PR after this one.
- Website address synchronization retains validated `z`, `b`, `p`, `a` and `sign` IDs. Cross-origin, unrelated-frame and invalid message payloads are rejected.
- Shared access/poster URLs return through `/mapa`. Branding returns to the website home. Existing website navigation and content remain untouched.
- Removed the obsolete forced mobile X override so the reviewed Back/gesture controls remain consistent. Embedded service-worker caches remain scoped to `cg-website-map-`.

## Verify

```powershell
npm --prefix site ci
# Generate tiles on a fresh checkout; local verification reused identical map tiles.
python tools/build_tiles.py
npm run build
node --test tools/tests/*.test.mjs
node --test site/tests/*.test.mjs
npm run check:map
npm run build:map
```

Production build and TypeScript pass. All 90 map tests and 12 website tests pass; copy check and offline packaging pass. The new bridge regression rejects the previous implementation that dropped access/poster IDs. Browser verification covered desktop beach -> Back -> forecast -> Legend, a poster deep link and mobile rescue -> Back. The QR and access candidates remain review data, not surveyed navigation or verified staffing.

## Scope and handoff

Owner review and merge required. No merge or production deployment to this repository is authorized in this task. Pending website typography/Instagram PR #4 is untouched. No portfolio or Forsite files changed. Only `site/src/app/mapa/MapFrame.tsx` changes within existing website application source; the remainder is map assets, map packaging/checks, tests and this note.

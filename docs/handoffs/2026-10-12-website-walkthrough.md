# Website walkthrough and PR handoff

Date: 2026-10-12
Branch: `codex/white-site-preview`

## What changed

The white and blue website redesign now includes the organization narrative, original photographs, rounded callouts, keyword search, and an embedded copy of the existing coastal map. The browser walkthrough corrected:

- Missing main headings on donation, projects, team and legacy work pages; inconsistent all-caps titles and crowded image/text spacing.
- An outdated decorative marquee on the vision page.
- Mobile menu state and lint errors in the shared and legacy headers.
- Inactive Instagram and telephone contact text; the old external home link on the contact page.
- Gallery controls that could sit behind images on phones. The gallery now uses a native modal dialog, reachable 48 px controls, Escape dismissal, focus containment and focus restoration.
- Collapsed team biographies exposed to assistive technology. Panels now have actual hidden state and explicit control relationships.
- Cropped program overview imagery. The complete annotated source image is now visible.
- Missing Spanish recovery UI for unknown routes.
- The old Vercel `/mapa` redirect. The map is packaged under the website origin; the build configuration prepares its tile assets first.
- The map's internal home links, cache cleanup scope and embedded browser history. Closing a beach no longer reopens it through Next navigation. The website address tracks the selected beach so it can be copied; browser Back returns to the preceding website page and Forward restores the beach. Standalone source-map navigation remains unchanged.
- A hidden mobile map close button is restored as a 44 px touch target in the embedded copy. Generated worker cache names include the embedded document/style revision; reads and cleanup use only the map's own caches, preventing old origin-wide caches from overriding new styles. Trailing-slash map routes also suppress the website header and footer.

## Why

Complete the reviewed design as a navigable static website, resolve bugs found while using it, and keep the original map data and safety classifications unchanged.

## How it was verified

Desktop: 1651 x 859. Phone: 390 x 844. Additional checks at 320, 768 and 1024 px widths on the homepage, organization, partnerships, Lifesaving Club and search pages.

| Routes | Desktop | Phone |
| --- | --- | --- |
| `/`, `/playas`, `/programas` | Passed | Passed |
| `/organizacion`, `/alianzas`, `/buscar` | Passed | Passed |
| `/swim-club`, `/lifesaving-club`, `/freediving-club`, `/programa-playa-organizada` | Passed | Passed |
| `/involcrate`, `/donar`, `/team`, `/proyectos` | Passed | Passed |
| `/vision`, `/nuestro-trabajo`, `/nuestro-trabajo1` | Passed | Passed |
| `/home` to `/`, `/involcrate-1` to `/vision` | Passed | Passed |
| `/mapa` | Passed | Passed |

Full-page scroll checks found no broken loaded images or horizontal overflow. Every content route has one main heading. Previously hidden team photographs were also checked against the full team route. Unknown-page recovery returns to the homepage.

Interaction checks: mobile menu open/close, Escape and navigation reset; accent search, English contact alias, empty results, submitted query URL, result navigation and contact anchor; inline biography and proposal disclosures; gallery next-image and Escape with focus return; seven beach links selecting the correct guides; map language toggle, close button, home links and browser history. The source map retains its existing forecast-unavailable fallback when the external provider has not returned data.

Automated checks:

```text
npm --prefix site run lint
npm --prefix site run test:search
npm --prefix site run build
npm --prefix site run test:export
npm run check:map
npm run build:map
git diff --check
```

Search tests: 5. Export tests: 3, covering main headings, internal links, anchor targets, local media, map packaging and hosting redirects. The website build generates 23 static pages. Map packaging verifies 535 offline asset references.

A separate directory containing only tracked map inputs and no tile cache successfully ran the existing tile generator and website asset preparation. It downloaded 2,387 tiles, 23.1 MB, and passed all 535 required asset checks. The provider reported 131 unavailable high-zoom tile requests outside the required precache set; no synthetic imagery or changes to map geometry were introduced.

## What's left before production release

- Backend/security handoff for Claude Code: the existing production dependency audit still reports 6 findings: 1 critical, 4 high and 1 moderate. Dependency versions were not changed. Assess applicability to the static export and upgrade/test separately before release.
- Hosting review: the updated Vercel build needs Python 3 and the pinned Pillow requirement, plus access to the existing imagery source. Local clean-input preparation was verified; no Vercel deployment was initiated or verified.
- Editorial review: existing source biographies, schedules, historical impact statements, donation details and policy language have not been independently revalidated. Layout/link checks are not a factual or operational certification.
- No payment, email, telephone call or social message was submitted during testing. External services and physical mobile Safari/Android devices were not end-to-end tested; phone checks used browser viewport emulation.
- No merge or production deployment is authorized by this handoff.

## Preview build correction

The automatic preview for commit `69b09f4` failed before tile generation: Vercel's uv-managed Python rejected the global pip install with `externally-managed-environment` (PEP 668). The build now creates `.venv-tiles`, installs the pinned Pillow dependency through that environment's Python, and runs tile generation with the same interpreter. The environment is ignored by Git. This follows Python's documented virtual-environment workflow and does not bypass system-package protection.

Verification uses a fresh local virtual environment, the tile generator, the website build and export checks. Windows uses `.venv-tiles/Scripts/python.exe`; Vercel uses `.venv-tiles/bin/python`. Hosted confirmation belongs to the automatic PR check. No manual deployment or merge is performed; the owner controls merge and production release.

Reference: https://docs.python.org/3/library/venv.html

## Files touched

Website routes, shared layout/search/media components, page styles and source heading/alt-text corrections under `site/src`; `site/tests/site-export.test.mjs`; site scripts and lint configuration; `tools/prepare_site_assets.mjs`; `tools/requirements-tiles.txt`; `vercel.json`. The earlier design handoff and typography guidelines describe the complete redesign scope.

# Website type and Instagram handoff

Date: 2026-10-26

## What changed

- Applied the approved Zilla Slab and Source Sans 3 hierarchy to the organization website, with local font files and licenses.
- Replaced the homepage group image with the six-person cover Daniel selected from the [official November 2024 post](https://www.instagram.com/p/DCHEu_ixMjy/).
- Added four manually selected, locally stored Instagram covers. Each links to its original official post or reel. The gallery is editorial and does not update automatically.
- Tightened the homepage action stack at 320 px and corrected two gallery crops and a narrow caption after desktop and phone walkthroughs.

## Why

The former homepage photograph showed a different group. The selected team photograph, font pairing, and varied community images give the site a more coherent identity. Local images and fonts do not depend on an expiring Instagram image URL or a live font service.

## How to verify

1. Run the site locally and compare the homepage at 320, 390, 430, 768, 1024, and desktop widths.
2. Check the hero photograph, navigation, search, programs, gallery, and footer. The [walkthrough log](../reviews/2026-10-26-responsive-walkthrough.md) records the observed issues and fixes.
3. Check that every gallery card opens the corresponding official Instagram post, and that local images and fonts resolve in a production build.

## What is left

The standalone map and iOS safe-area review belong to the separate map PR. The website PR does not change map source files. A physical phone review remains useful for final visual signoff.

## Files touched

`site/src/app/globals.css`, `site/src/app/layout.tsx`, `site/src/components/Home.tsx`, `site/src/components/InstagramGallery.tsx`, `site/src/app/fonts/`, `site/public/instagram/`, and the website design/review documents.

No merge or production deployment has been performed. Pull-request preview builds may be deployed automatically.

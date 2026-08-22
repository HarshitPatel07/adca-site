# Agarwal & Dhandhania — static site

A self-contained replica of adcaindia.com using the firm's own logo, seal, arch
graphic, service icons and photographs, with the real site copy.

## Run it

```bash
python -m http.server 8123 --directory C:\Harshit\adca_site
```

Then open <http://localhost:8123>.

Opening `index.html` directly as a `file://` path also works — the site uses no
`fetch` and no ES modules, so nothing is blocked. Serving over HTTP is still
preferable (correct MIME types, and root-relative paths behave normally).

## Where content lives

**`assets/js/data.js` is the single place to edit content.** Every repeated block
on the site is rendered from it at page load:

| Block | Data key |
|---|---|
| Main + footer navigation, dropdowns | `nav`, `budgets` |
| Hero slider (5 slides) | `slides` |
| Home counters | `stats` |
| Home about paragraphs | `about.paras` |
| Service tiles + detail accordions | `services` |
| "Why" arch labels | `why` |
| Team designation chips | `team.designations` |
| Branch cards | `firm`, `branches` |
| Camp-office accordion | `camp` |
| Budget publication links | `budgets` |
| Gallery photographs | `gallery` |

Counts are computed, never typed — the camp-office summary ("20 states · 117
cities") and each service's "N services" badge are derived from the arrays, so
they cannot drift out of step with the content.

## Rebuilding pages

Page *copy* lives in `_tools/build_pages.py`, which stamps the shared header,
navigation, contact band and footer into all 10 pages:

```bash
python _tools/build_pages.py
```

Navigation changes need **no** rebuild — the menu is rendered from `data.js` in
the browser. Only prose edits require re-running the builder.

## Layout

```
index.html  about.html  team.html  values.html  services.html
network.html  publication.html  careers.html  gallery.html  contact.html
assets/css/style.css      all styling
assets/js/data.js         ALL CONTENT — edit here
assets/js/main.js         rendering + interaction
assets/img/               logo, seal, arch, 16 service icons,
                          5 slider images, 24 event photos, banner, favicon
_tools/build_pages.py     page generator
_scrape/                  source HTML downloaded from adcaindia.com +
                          content.txt (the extracted copy) — provenance, not served
_backup/                  earlier version of index.html
```

## Interaction

Slider (autoplay, arrows, dots, keyboard, swipe, pauses on hover and when the
tab is hidden), scroll-progress bar, condensing sticky header, scroll-reveal with
stagger, counting statistics, service icon swap to the white sprite on hover,
service and camp-office accordions (deep-linkable via `#audit`, `#taxation`, …),
gallery lightbox with keyboard navigation, mobile drawer with nested submenus,
and inline form validation. All motion respects
`prefers-reduced-motion: reduce`.

## Before this goes live

1. **Both forms are front-end only.** They validate and confirm, but transmit
   nothing. Wire Quick Contact and the newsletter to a mail handler.
2. **reCAPTCHA is a visual placeholder** — a styled checkbox, not Google
   reCAPTCHA. Add a real key and widget if you need bot protection.
3. **Budget publication links point at adcaindia.com.** Repoint them at your own
   PDFs once uploaded (`budgets[].slug` in `data.js`).
4. **The Google Map is a placeholder block** on `contact.html`.
5. **Social links are `#`.** Add the real profile URLs.

## Content conflicts found on the live site

The live site contradicts itself in four places. Each is resolved in one spot in
`data.js`; change it there if the other value is correct.

| Item | Live site says | Used here |
|---|---|---|
| Head office pincode | `395017` (home) vs `395002` (network, contact) | `395017` |
| Years of existence | `66` (header) vs `61` (seal) vs `59` (arch labels) | `66` everywhere, computed from `founded: 1960` |
| Mumbai branch | Gorai/Borivali (Our Branches) vs Malad East (Network, Contact) | Malad East — appears on two pages and carries a phone |
| "Trunkey Support" | `Trunkey` in tiles, `Turnkey` in the detail heading | `Trunkey` kept verbatim in the tile name |

Phone is `0261-2269131` throughout, per the live HTML source.

# ART GSTAAD — Website

A static, dependency-free website. Open `index.html` in any browser, or upload the whole `website` folder to any web host.

## Pages

- `index.html` — Intro curtain (alpine line, once per session), rotating cinematic hero, manifesto, the Book (main highlight), timeline, people
- `book.html` — The Book: interactive 3D flipbook (each question flips into an artwork that answers), story, all 15 questions (clickable), download
- `exhibition.html` — *Can art answer?* — typewriter questions, live countdown to September 2026, artist list
- `collection.html` — Room view (walk along three gallery walls, works hung with museum wall labels) + Index view with artist filter
- `perspectives.html` — Picasso find · Lisa Brice · New definition — with reading-progress bar
- `about.html` — Story, people, commitments (trust page)
- `visit.html` — Stylized Saanenland contour map, travel times, live weather in Gsteig (open-meteo), contact form
- `legal.html` — Legal use

## Signature elements

- **The Alpine Line** — the self-drawing mountain ridge (intro + section dividers)
- Film grain, page-fade transitions, Ken Burns hero, scroll reveals — all vanilla JS, no frameworks

## Assets

- `assets/img/` — all 140 images scraped from artgstaad.com (originals, unmodified)
- `assets/css/style.css` — design system (colors, type, layout)
- `assets/js/main.js` — navigation, scroll reveal, lightbox

Fonts (Cormorant Garamond + Inter) load from Google Fonts; everything else is local.

## Notes

- Captions were derived from the original image filenames; works with unnamed files are shown uncaptioned. Edit captions directly in `collection.html`.
- The book download button currently points to the existing page (artgstaad.com/book). Replace with a local PDF/flipbook when ready.
- Contact form uses a `mailto:` action — replace `info@artgstaad.com` in `visit.html` with the real address.

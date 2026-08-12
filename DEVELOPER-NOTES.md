# Dawson Landscaping &amp; Maintenance — Developer Notes

Plain HTML + CSS + vanilla JS. No build step, no frameworks, no npm packages.
Upload the contents of this folder to any host (or GitHub Pages) and it runs.

## File structure

```
index.html        Home (Hero → Trust → Services → Before/After → Why → Projects
                  → Testimonials → Perth service area → Final CTA → Quote form)
services.html     Service detail sections (#landscaping #maintenance #lawn #outdoor)
projects.html     Before/after gallery + project showcase
about.html        Story, values, project process
contact.html      Quote form + contact details + service area
assets/css/style.css
assets/js/script.js
assets/img/        logo-dark.png, logo-light.png, mark.png (favicon source), photos
```

## Replacing images

Drop a new file into `assets/img/` with the same filename (keeps every reference
working), or edit the `src`/`alt` in the HTML. Keep the `width`/`height`
attributes roughly proportional to avoid layout shift, and keep `loading="lazy"`
on everything **except** the hero image. Before/after pairs are
`ba1-*`, `ba2-*`, `ba3-*`.

## Replacing text

All copy is literal HTML — no templating. Search for these markers:
* `PLACEHOLDER` comments mark content that must be replaced before launch
  (phone, email, hours, suburb list, testimonials, project locations, story copy).
* Testimonials are clearly labelled placeholders; no fake awards, review counts,
  years of experience, guarantees or certifications are used anywhere.

## Updating colours &amp; type

Everything lives in the `:root` token block at the top of `assets/css/style.css`
(`--c-olive`, `--c-forest`, `--c-gold`, `--c-cream`, `--c-sand`, `--c-ink`,
`--font-display`, `--font-body`, `--radius`, `--section-y`). Change a token and
the whole site follows. Do not hard-code colours in section rules.

## Updating contact information

Replace in every page (header, hero, final CTA, contact panel, footer, mobile bar):
* `tel:+61000000000` and the visible `(08) 0000 0000`
* `hello@example.com`
* hours / service area text
* the `LandscapingBusiness` JSON-LD block in `index.html` (phone, email, address,
  URL, image, `sameAs` socials)

## GA4 / GTM tracking

1. Paste the GA4 (gtag.js) or GTM container snippet at the
   `ANALYTICS PLACEHOLDER` comment in each page `<head>`. No IDs are hard-coded.
2. Uncomment the gtag/dataLayer lines inside `trackEvent()` in
   `assets/js/script.js`.
3. Events already wired via a single delegated listener on `[data-track]`:
   `quote-click`, `phone-click`, `contact-submit`, `service-enquiry`,
   `chat-click`, `gallery-interaction`. Each element also carries
   `data-track-label` identifying its placement (hero, header, footer,
   mobile-bar, final-cta …).
4. `window.DAWSON_DEBUG_TRACKING = true` in the console logs every event.
   `window.dawsonTrack(name, label)` fires one manually.

## Before/after slider

Markup per card: `.ba-viewer` containing `img.ba-viewer__before`,
`img.ba-viewer__after`, `.ba-handle` and an invisible `input.ba-range`
(`type="range"`). JS clips the after image with
`clip-path: inset(0 0 0 X%)` and moves the handle to the same percentage.
Pointer events handle drag; the range input provides keyboard and
screen-reader control. To add a card, copy an existing `.ba-card` block — no
JS changes needed. `prefers-reduced-motion` disables reveal animations.

## Form

`form[data-quote-form]` is validated client-side and currently shows a success
message only. Point it at your handler: replace the `setTimeout` in section 5 of
`script.js` with a `fetch()` POST, or in WordPress replace the whole `<form>`
with a WPForms / Gravity Forms / CF7 shortcode and keep the `.quote-form`
wrapper classes for styling.

## Intended Elementor Containers / Sections

Each top-level `<section>` maps 1:1 to a Container:
`.hero-section`, `.trust-strip`, `.trust-section`, `.services-section`,
`.projects-section` (before/after), `.why-section`, `.showcase-section`,
`.testimonials-section`, `.area-section`, `.cta-section`, `.contact-section`,
plus global `.site-header`, `.footer` and `.mobile-cta`.
Reusable blocks: `.service-card`, `.ba-card`, `.project-card`,
`.testimonial-card`, `.value-card`, `.inline-cta`, `.quote-form`, `.btn`.
Nesting is shallow (section → container → grid → card) so it rebuilds cleanly.

## SEO

Per-page unique `<title>`, meta description, canonical, Open Graph and Twitter
tags. One `<h1>` per page, ordered `h2`/`h3` below it. `LandscapingBusiness`
JSON-LD on the home page. Keywords used naturally: landscapers Perth,
landscaping Perth, garden maintenance Perth, Perth landscaping services.
`robots.txt` and `sitemap.xml` sit in this folder — update the URLs once the
real domain is live.

## External dependencies

Google Fonts only (Archivo + Karla) via `<link>`. Nothing else — no jQuery,
no icon library (icons are inline SVG), no animation framework.

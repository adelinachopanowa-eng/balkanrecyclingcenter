# Balkan Recycling Center – website

Static site with six pages: Home, For recovery organisations (OO), For importers/producers, Streams & capacity, Trust & documents, Contact.

## Structure

- `src/pages/*.html` – page content. Each file starts with a `<!-- page: {...} -->` comment holding the title, the active nav item and the description.
- `src/partials/` – shared header and footer.
- `src/layout.html` – the HTML shell every page is wrapped in.
- `src/styles.css` – all styles. Colors are the BRC design-system tokens, kept as CSS variables in `:root`.
- `build.mjs` – assembles the pages into `dist/` (no dependencies).

## Commands

```sh
npm run build   # writes dist/
npm run serve   # builds, then serves dist/ at http://localhost:8080
```

Text in `[square brackets]` is placeholder copy still to be filled in (names, hours, phone numbers, certificates).
The forms are not connected to a backend yet.

// Builds the static site into dist/.
// Each page in src/pages starts with a meta comment:
//   <!-- page: {"title": "...", "active": "home"} -->
// and is wrapped in src/layout.html with the shared header and footer.

import { readFile, writeFile, readdir, mkdir, rm, copyFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, 'src');
const out = join(root, 'dist');

const NAV = [
  ['oo', 'За организации', 'oo.html'],
  ['producers', 'За вносители', 'producers.html'],
  ['streams', 'Потоци и капацитет', 'streams.html'],
  ['process', 'Как работим', 'index.html#process'],
  ['trust', 'За нас', 'trust.html'],
];

const read = (p) => readFile(join(src, p), 'utf8');

function renderNav(active) {
  return NAV.map(([id, label, href]) => {
    const current = id === active ? ' aria-current="page"' : '';
    return `<a href="${href}"${current}>${label}</a>`;
  }).join('\n');
}

async function build() {
  const [layout, header, footer] = await Promise.all([
    read('layout.html'),
    read('partials/header.html'),
    read('partials/footer.html'),
  ]);

  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });

  const pages = (await readdir(join(src, 'pages'))).filter((f) => f.endsWith('.html'));
  for (const file of pages) {
    const raw = await read(join('pages', file));
    const match = raw.match(/^<!--\s*page:\s*(\{.*?\})\s*-->\s*/s);
    if (!match) throw new Error(`${file}: missing <!-- page: {...} --> meta comment`);
    const meta = JSON.parse(match[1]);
    const content = raw.slice(match[0].length);

    const html = layout
      .replace('{{title}}', () => meta.title)
      .replace('{{description}}', () => meta.description ?? '')
      .replace('{{header}}', () => header.replace('{{nav}}', () => renderNav(meta.active)))
      .replace('{{content}}', () => content)
      .replace('{{footer}}', () => footer);

    await writeFile(join(out, file), html);
  }

  await copyFile(join(src, 'styles.css'), join(out, 'styles.css'));
  console.log(`Built ${pages.length} pages into dist/`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});

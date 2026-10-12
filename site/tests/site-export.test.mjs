import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';

const out = fileURLToPath(new URL('../out/', import.meta.url));
const files = readdirSync(out).filter(name => name.endsWith('.html'));
const documents = files.map(file => ({ file, $: load(readFileSync(join(out, file), 'utf8')) }));
const origin = 'https://caribbeanguard.org';
function targetFile(pathname) {
  const path = decodeURIComponent(pathname).replace(/^\/+/, '');
  return [resolve(out, path || 'index.html'), resolve(out, `${path}.html`), resolve(out, path, 'index.html')]
    .find(file => existsSync(file) && file.endsWith('.html'));
}

test('every exported content page has one main heading and a title', () => {
  assert.ok(files.length >= 20, 'Run the production build before this audit');
  for (const { file, $ } of documents) {
    if ($('meta[http-equiv="refresh"]').length) continue;
    assert.equal($('main h1').length, 1, `${file}: expected one H1`);
    assert.ok($('title').text().trim(), `${file}: missing document title`);
  }
});

test('internal links, anchor targets and local images resolve in the static export', () => {
  const failures = [];
  for (const { file, $ } of documents) {
    const current = `${origin}/${file === 'index.html' ? '' : file.replace(/\.html$/, '')}`;
    $('a[href],img[src],iframe[src],video source[src]').each((_, el) => {
      const raw = $(el).attr('href') || $(el).attr('src');
      if (!raw || /^(mailto:|tel:|data:)/.test(raw)) return;
      const url = new URL(raw, current);
      if (url.origin !== origin) return;
      const html = targetFile(url.pathname);
      const asset = resolve(out, decodeURIComponent(url.pathname).replace(/^\/+/, ''));
      if (!html && !existsSync(asset)) failures.push(`${file}: missing ${raw}`);
      if (html && url.hash) {
        const target = load(readFileSync(html, 'utf8'));
        const id = decodeURIComponent(url.hash.slice(1));
        if (!target('[id]').toArray().some(el => target(el).attr('id') === id)) failures.push(`${file}: missing anchor ${raw}`);
      }
    });
  }
  assert.deepEqual(failures, []);
});

test('the site packages the map and no longer redirects to an external host', () => {
  const config = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'));
  assert.ok(!(config.redirects || []).some(rule => rule.source.startsWith('/mapa')));
  for (const path of ['mapa.html', 'mapa/overview.html', 'mapa/app/index.html', 'mapa/app/overview-places.json']) {
    assert.ok(existsSync(join(out, path)), `Missing ${path}`);
  }
  const places = JSON.parse(readFileSync(join(out, 'mapa/app/overview-places.json'), 'utf8'));
  assert.equal(places.length, 7);
  assert.ok(places.every(place => place.href.startsWith('/mapa?')));
  const worker = readFileSync(join(out, 'mapa/app/sw.js'), 'utf8');
  assert.match(worker, /k\.startsWith\("cg-website-map-"\) && k !== CACHE/);
  assert.ok(!worker.includes('caches.match('), 'Embedded map must not read stale caches from another app');
  const map = readFileSync(join(out, 'mapa/app/index.html'), 'utf8');
  assert.match(map, /const CG_HOME = "\/";/);
  assert.match(map, /href="\$\{CG_HOME\}" target="_top"/);
});

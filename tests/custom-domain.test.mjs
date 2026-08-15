import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const oldHost = 'klaus-k2p5-factory.github.io/grizzle-club-invitation';
const origin = 'https://www.evrewards.ca';

const publicHtml = [
  ['index.html', `${origin}/`],
  ['privacy.html', `${origin}/privacy.html`],
  ['ev-charger-cost-calculator-canada/index.html', `${origin}/ev-charger-cost-calculator-canada/`],
  ['grizzle-club-vs-chargelab-rewards-canada/index.html', `${origin}/grizzle-club-vs-chargelab-rewards-canada/`],
  ['is-grizzl-e-club-worth-it-canada/index.html', `${origin}/is-grizzl-e-club-worth-it-canada/`]
];

test('GitHub Pages source declares the intended canonical www host', async () => {
  assert.equal((await read('CNAME')).trim(), 'www.evrewards.ca');
});

test('every public HTML page uses the new canonical origin and identity', async () => {
  for (const [file, canonical] of publicHtml) {
    const html = await read(file);
    assert.match(html, new RegExp(`<link rel="canonical" href="${canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`), `${file} has the wrong canonical`);
    assert.doesNotMatch(html, new RegExp(oldHost.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${file} still references the old host`);
    assert.match(html, /EV Rewards Canada/, `${file} is missing the new site identity`);
    assert.doesNotMatch(html, /EV Home Rewards/, `${file} still exposes the retired site identity`);
  }
});

test('crawler discovery files publish only the new domain', async () => {
  const [robots, sitemap] = await Promise.all([read('robots.txt'), read('sitemap.xml')]);
  assert.match(robots, /Sitemap: https:\/\/www\.evrewards\.ca\/sitemap\.xml/);
  assert.doesNotMatch(robots, new RegExp(oldHost.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.doesNotMatch(sitemap, new RegExp(oldHost.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  for (const [, canonical] of publicHtml) assert.match(sitemap, new RegExp(`<loc>${canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>`));
  assert.equal((sitemap.match(/<lastmod>2026-08-15<\/lastmod>/g) || []).length, publicHtml.length);
});

test('the existing Search Console verification and IndexNow key remain deployable', async () => {
  await read('google49a0907ec3fef867.html');
  await read('2b9d2abe20f093f01c769beb45e4db8f.txt');
});

test('Open Graph card generators use the new site identity', async () => {
  const generators = [
    'assets/generate-og-card.py',
    'assets/generate-calculator-og.py',
    'assets/generate-comparison-og.py',
    'assets/generate-club-fit-og.py'
  ];
  for (const generator of generators) {
    const source = await read(generator);
    assert.match(source, /EV REWARDS CANADA/, `${generator} is missing the new identity`);
    assert.doesNotMatch(source, /EV HOME REWARDS/, `${generator} still renders the retired identity`);
  }
});

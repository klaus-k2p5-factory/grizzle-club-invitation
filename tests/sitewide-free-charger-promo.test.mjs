import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => readFile(path.join(root, relative), 'utf8');

const secondaryPages = [
  ['privacy.html', 'grizzl-e-club-invitation-canada/'],
  ['about/index.html', '../grizzl-e-club-invitation-canada/'],
  ['ev-charger-cost-calculator-canada/index.html', '../grizzl-e-club-invitation-canada/'],
  ['grizzle-club-vs-chargelab-rewards-canada/index.html', '../grizzl-e-club-invitation-canada/'],
  ['is-grizzl-e-club-worth-it-canada/index.html', '../grizzl-e-club-invitation-canada/'],
  ['free-ev-charger-canada/index.html', '../grizzl-e-club-invitation-canada/'],
  ['get-paid-to-charge-ev-canada/index.html', '../grizzl-e-club-invitation-canada/']
];

test('every secondary page offers a restrained disclosed free-charger path', async () => {
  for (const [file, target] of secondaryPages) {
    const html = await read(file);
    const start = html.indexOf('<aside class="free-charger-promo"');
    assert.ok(start > 0, `${file} is missing the free-charger suggestion`);
    const end = html.indexOf('</aside>', start);
    assert.ok(end > start, `${file} has an incomplete free-charger suggestion`);
    const promo = html.slice(start, end + 8);
    assert.match(promo, /Want a free Level 2 charger\?/i, file);
    assert.match(promo, /Refundable deposit, shipping and installation apply\./i, file);
    assert.match(promo, /Peter Mucha may receive CAD \$0\.01 per eligible referred kWh/i, file);
    assert.match(promo, />Request an invite to apply for a free charger</i, file);
    assert.match(
      promo,
      new RegExp(`href="${target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\?src=organic-sitewide-free-charger"`),
      file
    );
    assert.ok(promo.indexOf('Peter Mucha may receive') < promo.indexOf('href='), `${file} disclosure must precede its CTA`);
  }
});

test('the sitewide offer has one shared presentation style', async () => {
  const css = await read('styles.css');
  assert.match(css, /\.free-charger-promo\s*\{/);
  assert.match(css, /\.free-charger-promo__copy/);
  assert.match(css, /\.free-charger-promo__action/);
});

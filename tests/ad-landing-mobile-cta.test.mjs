import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const routes = [
  'free-grizzl-e-charger-canada/index.html',
  'ev-home-charging-rewards-canada/index.html'
];

const runMobileCta = (script, visibleClass) => {
  const mobileCta = { style: {} };
  const regions = [
    'ad-hero',
    'ad-program',
    'ad-sequence',
    'ad-conditions',
    'request'
  ].map((className) => ({
    matches: (selector) => selector === `.${className}` || (className === 'request' && selector === '#request'),
    getBoundingClientRect: () => (
      className === visibleClass
        ? { top: 0, bottom: 240 }
        : { top: 800, bottom: 1040 }
    )
  }));
  const window = {
    innerHeight: 640,
    addEventListener: () => {}
  };
  const document = {
    querySelector: (selector) => selector === '.mobile-cta' ? mobileCta : null,
    querySelectorAll: (selector) => regions.filter((region) => selector.split(',').map((part) => part.trim()).some((part) => region.matches(part)))
  };

  vm.runInNewContext(script, { document, window });
  return mobileCta.style.display;
};

test('paid-route mobile CTA hides over every protected invitation-first region at 320px', async () => {
  const [script, ...pages] = await Promise.all([
    read('ad-landing.js'),
    ...routes.map(read)
  ]);

  for (const [index, page] of pages.entries()) {
    assert.match(page, /<script src="\.\.\/ad-landing\.js\?v=20260907-1" defer><\/script>/, routes[index]);
    for (const protectedRegion of ['ad-hero', 'ad-sequence']) {
      assert.equal(
        runMobileCta(script, protectedRegion),
        'none',
        `${routes[index]} must hide its fixed CTA while ${protectedRegion} is visible`
      );
    }
  }
});

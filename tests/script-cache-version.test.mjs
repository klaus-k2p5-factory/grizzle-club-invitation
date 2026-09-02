import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = [
  ['index.html', 'script.js'],
  ['grizzl-e-club-invitation-canada/index.html', '../script.js'],
  ['free-grizzl-e-charger-canada/index.html', '../script.js'],
  ['ev-home-charging-rewards-canada/index.html', '../script.js']
];

test('all shared form-controller consumers request the current cache version', async () => {
  for (const [page, script] of pages) {
    const html = await readFile(path.join(root, page), 'utf8');
    assert.match(html, new RegExp(`<script src="${script.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\?v=20260902-1" defer><\\/script>`), page);
    assert.doesNotMatch(html, /script\.js\?v=20260820-1/, page);
  }
});

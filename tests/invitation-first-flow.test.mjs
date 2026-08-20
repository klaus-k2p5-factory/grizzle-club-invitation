import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => readFile(path.join(root, relative), 'utf8');

const ignoredDirectories = new Set(['.git', '.hermes', 'node_modules', 'qa-output']);
const publicPages = async (directory = root) => {
  const pages = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && !ignoredDirectories.has(entry.name)) {
      pages.push(...await publicPages(path.join(directory, entry.name)));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      pages.push(path.relative(root, path.join(directory, entry.name)));
    }
  }
  return pages;
};

test('homepage makes the invitation-first sequence unmistakable before conversion', async () => {
  const html = await read('index.html');
  const firstFormCta = html.indexOf('href="#request"');
  assert.ok(firstFormCta > 0, 'missing invitation CTA');
  const beforeFirstCta = html.slice(0, firstFormCta);
  assert.match(beforeFirstCta, /request (?:your|an) invitation before (?:you )?(?:create|creating|register)/i);
  assert.match(html, /Request my invitation first/g);
  assert.match(html, /Wait for the official invitation email/i);
  assert.match(html, /Use the same email/i);
  assert.match(html, /do not (?:register|create a Club account) separately/i);
});

test('form qualifies unregistered visitors without transmitting another field', async () => {
  const html = await read('index.html');
  assert.match(html, /<input[^>]+id="not-registered"[^>]+type="checkbox"[^>]+required/);
  const input = html.match(/<input[^>]+id="not-registered"[^>]*>/)?.[0] || '';
  assert.doesNotMatch(input, /\sname=/, 'registration-status acknowledgement must stay client-side');
  assert.match(html, /I have not already registered this email with Grizzl-E Club/i);
  assert.match(html, /already (?:have|created|registered)[^<]{0,100}(?:Club )?account/i);
  assert.match(html, /do not (?:use another email|create a duplicate account)/i);
  assert.match(html, /name="entry\.305444311" value="I agree and request my invitation" required/);
});

test('success state protects attribution while the visitor waits', async () => {
  const html = await read('index.html');
  const success = html.slice(html.indexOf('id="success-state"'), html.indexOf('</div>', html.indexOf('id="success-state"')) + 6);
  assert.match(success, /do not register separately/i);
  assert.match(success, /same email/i);
  assert.match(success, /official invitation/i);
});

test('site provides official terms without a direct Club registration landing-page link', async () => {
  for (const page of await publicPages()) {
    const html = await read(page);
    assert.doesNotMatch(html, /href\s*=\s*["'](?:https?:)?\/\/club\.grizzl-e\.com\/?(?:[?#][^"']*)?["']/i, `${page} leaks directly to Club registration`);
  }
  const home = await read('index.html');
  assert.match(home, /https:\/\/club\.grizzl-e\.com\/en\/terms/);
  assert.match(home, /Read the terms, then return here before registering/i);
});

test('script validation covers the client-side registration acknowledgement', async () => {
  const script = await read('script.js');
  assert.match(script, /not-registered/);
  assert.match(script, /before registering/i);
});

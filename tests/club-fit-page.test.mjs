import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const pagePath = 'is-grizzl-e-club-worth-it-canada/index.html';

test('fit-check page targets the late-stage Canadian decision query truthfully', async () => {
  const html = await read(pagePath);
  assert.match(html, /<html lang="en-CA">/);
  assert.match(html, /<title>Is Grizzl-E Club Worth It in Canada\? 2026 Fit Check<\/title>/);
  assert.match(html, /<meta name="description" content="Use a terms-based fit check to decide whether Grizzl-E Club may suit your Canadian home charging setup/);
  assert.match(html, /<link rel="canonical" href="https:\/\/klaus-k2p5-factory\.github\.io\/grizzle-club-invitation\/is-grizzl-e-club-worth-it-canada\/">/);
  assert.match(html, /<h1>Is Grizzl-E Club worth it\? <em>Check the fit, not just the headline\.<\/em><\/h1>/);
  assert.match(html, /og-grizzle-club-fit-check\.jpg/);
  const card = await readFile(path.join(root, 'assets/og-grizzle-club-fit-check.jpg'));
  assert.deepEqual([...card.subarray(0, 2)], [0xff, 0xd8], 'social card must be a real JPEG');
  assert.match(html, /not a hands-on product review/i);
  assert.doesNotMatch(html, /guaranteed|guarantees approval|best program/i);
});

test('material referral interest is disclosed before the first conversion link', async () => {
  const html = await read(pagePath);
  const disclosure = html.indexOf('CAD $0.01 per eligible referred kWh');
  const firstCta = html.indexOf('src=organic-club-fit');
  assert.ok(disclosure >= 0, 'missing referral compensation disclosure');
  assert.ok(firstCta > disclosure, 'first invitation CTA must follow the disclosure');
  assert.match(html, /not Grizzl-E, United Chargers or the Government of Canada/i);
  assert.match(html, /United Chargers decides membership and charger eligibility/i);
  assert.match(html, /id="invitation-path-link"[^>]+href="\.\.\/\?src=organic-club-fit#request"/);
  assert.doesNotMatch(html, /<form[^>]+action=/);
});

test('fit check covers the six material suitability and exit questions', async () => {
  const html = await read(pagePath);
  for (const phrase of [
    'Home parking in Canada',
    'Electrical work and installation budget',
    'Reliable Wi-Fi at the parking location',
    'Primary, active charging use',
    'Charging data and Clean Fuel Credits',
    'Ownership, cancellation and return'
  ]) assert.match(html, new RegExp(phrase, 'i'));
  assert.match(html, /4–6 charging sessions per month/);
  assert.match(html, /ten \(10\) additional charging sessions/);
  assert.match(html, /return shipping/i);
  assert.match(html, /charger remains United Chargers property/i);
});

test('15-cent announcement is separated from current base cash tiers', async () => {
  const html = await read(pagePath);
  assert.match(html, /published August 12, 2026/);
  assert.match(html, /Starting October 1, 2026/);
  assert.match(html, /members who own their Grizzl-E charger/);
  assert.match(html, /additional 5¢ per kWh in Thanksgiving Bonus Points/);
  assert.match(html, /converted into cash on October 1, 2027/);
  assert.match(html, /Ultimate level/);
  assert.match(html, /current base cash-reward tiers remain 3¢–10¢ per eligible kWh/i);
  assert.match(html, /does not mean every member earns 15¢ today/i);
  assert.doesNotMatch(html, /15¢[^<]{0,80}(?:guaranteed|instant cash for every|available to every member)/i);
});

test('fit-check evidence is dated and links first-party sources', async () => {
  const html = await read(pagePath);
  assert.match(html, /checked August 14, 2026/i);
  assert.match(html, /terms version June 10, 2026/i);
  assert.match(html, /https:\/\/connect-api\.unitedchargers\.com\/client\/terms-and-conditions\/latest\/club/);
  assert.match(html, /https:\/\/grizzl-e\.com\/news\/364/);
  assert.match(html, /https:\/\/grizzl-e\.com\/news\/322/);
  assert.match(html, /"@type": "Article"/);
  assert.match(html, /"@type": "FAQPage"/);
  assert.doesNotMatch(html, /aggregateRating|reviewRating/);
});

test('new fit-check page is discoverable from site navigation and sitemap', async () => {
  const [home, comparison, sitemap] = await Promise.all([
    read('index.html'),
    read('grizzle-club-vs-chargelab-rewards-canada/index.html'),
    read('sitemap.xml')
  ]);
  assert.match(home, /is-grizzl-e-club-worth-it-canada\//);
  assert.match(comparison, /\.\.\/is-grizzl-e-club-worth-it-canada\//);
  assert.match(sitemap, /is-grizzl-e-club-worth-it-canada\//);
  assert.match(sitemap, /<lastmod>2026-08-14<\/lastmod>/);
});

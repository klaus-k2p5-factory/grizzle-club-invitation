import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const pagePath = 'free-ev-charger-canada/index.html';

test('free-charger guide targets Canadian intent without promising a zero-cost outcome', async () => {
  const html = await read(pagePath);
  assert.match(html, /<html lang="en-CA">/);
  assert.match(html, /<title>Free EV Charger Canada: Costs, Programs & Conditions \(2026\)<\/title>/);
  assert.match(html, /<meta name="description" content="Compare current Canadian [‘']free EV charger[’'] offers/);
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.evrewards\.ca\/free-ev-charger-canada\/">/);
  assert.match(html, /<h1>Free EV charger in Canada\? <em>Price the conditions, not just the hardware\.<\/em><\/h1>/);
  assert.match(html, /checked August 20, 2026/i);
  assert.match(html, /og-free-ev-charger-canada\.jpg/);
  const card = await readFile(path.join(root, 'assets/og-free-ev-charger-canada.jpg'));
  assert.deepEqual([...card.subarray(0, 2)], [0xff, 0xd8], 'social card must be a real JPEG');
  assert.doesNotMatch(html, /guaranteed free|completely free|zero cost|government-approved program|best program/i);
});

test('material referral relationship appears before any invitation conversion link', async () => {
  const html = await read(pagePath);
  const disclosure = html.indexOf('CAD $0.01 per eligible referred kWh');
  const firstCta = html.indexOf('src=organic-free-charger');
  const preConversion = html.slice(0, firstCta);
  assert.ok(disclosure >= 0, 'missing compensation disclosure');
  assert.ok(firstCta > disclosure, 'first invitation CTA must follow the disclosure');
  assert.match(preConversion, /voluntarily requests an invitation/i);
  assert.match(preConversion, /is approved/i);
  assert.match(preConversion, /activates a qualifying referred charger/i);
  assert.match(preConversion, /remains eligible/i);
  assert.match(preConversion, /not Grizzl-E, United Chargers, SWTCH or the Government of Canada/i);
  assert.match(preConversion, /United Chargers decides membership and charger eligibility/i);
});

test('guide separates hardware price from every material cost and condition', async () => {
  const html = await read(pagePath);
  for (const phrase of [
    'Refundable deposit',
    'Shipping and delivery',
    'Electrical installation',
    'Ownership',
    'Wi-Fi and connected data',
    'Active use',
    'Cancellation and return',
    'Reward payout'
  ]) assert.match(html, new RegExp(phrase, 'i'));
  assert.match(html, /hardware price can be \$0 while your total cost is not/i);
  assert.match(html, /licensed electrician/i);
  assert.match(html, /permit/i);
  assert.match(html, /electrical capacity/i);
  assert.match(html, /pre-approval/i);
});

test('provider paths remain distinct and current terms control volatile rates', async () => {
  const html = await read(pagePath);
  assert.match(html, /Grizzl-E Club/);
  assert.match(html, /charger remains (?:the )?property of United Chargers/i);
  assert.match(html, /4–6 charging sessions per month/);
  assert.match(html, /SWTCH Home Charging Program/);
  assert.match(html, /ownership transfers to the customer on delivery/i);
  assert.match(html, /\$300 CAD deposit/i);
  assert.match(html, /1,500 kWh/);
  assert.match(html, /\$0\.03 CAD\/kWh[\s\S]*\$0\.11 CAD\/kWh/i);
  assert.match(html, /\$0\.11 CAD\/kWh[\s\S]*September 1, 2026[\s\S]*12:00 a\.m\. Eastern Time/i);
  assert.match(html, /rates are variable and are not guaranteed/i);
  assert.doesNotMatch(html, /CAA Atlantic|additional 1¢/i);
  assert.match(html, /not a government charger rebate/i);
  assert.match(html, /no single program is best for every household/i);
});

test('the Grizzl-E path is invitation-first while neutral alternatives link directly', async () => {
  const html = await read(pagePath);
  assert.match(html, /id="invitation-path-link"[^>]+href="\.\.\/\?src=organic-free-charger#request"/);
  assert.match(html, /request the official invitation before creating a Club account/i);
  assert.match(html, /wait for the invitation link and use the same email/i);
  assert.match(html, /do not create a duplicate or alternate account/i);
  assert.match(html, /href="https:\/\/shop\.swtchenergy\.com\/pages\/terms-of-service"[^>]+target="_blank"[^>]+rel="noopener"/);
  assert.match(html, /This site receives no compensation from SWTCH/i);
  assert.doesNotMatch(html, /<form[^>]+action=/);
});

test('claims use dated first-party sources and appropriate structured data', async () => {
  const html = await read(pagePath);
  for (const url of [
    'https://connect-api.unitedchargers.com/client/terms-and-conditions/latest/club',
    'https://shop.swtchenergy.com/pages/terms-of-service',
    'https://shop.swtchenergy.com/',
    'https://natural-resources.canada.ca/energy-efficiency/transportation-energy-efficiency/electric-vehicles/electric-vehicle-charging-charger-installation',
    'https://www.canada.ca/en/environment-climate-change/services/managing-pollution/energy-production/fuel-regulations/clean-fuel-regulations/about.html'
  ]) assert.ok(html.includes(url), `missing primary source ${url}`);
  assert.match(html, /Grizzl-E Club terms version June 10, 2026/i);
  assert.match(html, /SWTCH terms last updated August 19, 2026/i);
  assert.match(html, /"@type": "Article"/);
  assert.match(html, /"@type": "FAQPage"/);
  assert.doesNotMatch(html, /aggregateRating|reviewRating/);
});

test('new guide is integrated across the owned content cluster and sitemap', async () => {
  const [home, calculator, comparison, fitGuide, sitemap, analytics] = await Promise.all([
    read('index.html'),
    read('ev-charger-cost-calculator-canada/index.html'),
    read('grizzle-club-vs-chargelab-rewards-canada/index.html'),
    read('is-grizzl-e-club-worth-it-canada/index.html'),
    read('sitemap.xml'),
    read('analytics.js')
  ]);
  assert.match(home, /<nav class="related-guide-grid" aria-label="Related EV charging guides">/i);
  assert.match(home, /free-ev-charger-canada\//);
  assert.match(calculator, /\.\.\/free-ev-charger-canada\//);
  assert.match(comparison, /\.\.\/free-ev-charger-canada\//);
  assert.match(fitGuide, /\.\.\/free-ev-charger-canada\//);
  assert.match(sitemap, /https:\/\/www\.evrewards\.ca\/free-ev-charger-canada\//);
  assert.match(sitemap, /<lastmod>2026-08-20<\/lastmod>/);
  assert.match(analytics, /'organic-free-charger'/);
});

test('mobile guide disclosure is explicitly readable', async () => {
  const css = await read('styles.css');
  const mobile = css.slice(css.lastIndexOf('@media (max-width: 650px)'));
  assert.match(mobile, /\.free-charger-page \.disclosure-bar\s*\{[^}]*font-size:\s*13px/);
  assert.match(mobile, /\.free-charger-page \.disclosure-inner\s*\{[^}]*display:\s*block[^}]*padding:\s*8px 0/);
  assert.match(mobile, /\.free-charger-page \.disclosure-inner a\s*\{[^}]*display:\s*inline-block[^}]*margin-top:\s*6px/);
});

test('program paths use equal button emphasis and readable neutral disclosure', async () => {
  const [html, css] = await Promise.all([read(pagePath), read('styles.css')]);
  const paths = html.slice(html.indexOf('<section class="path-section"'), html.indexOf('<section class="invitation-sequence"'));
  assert.doesNotMatch(paths, /button-light/);
  assert.equal((paths.match(/button-outline-light/g) || []).length, 3);
  assert.match(css, /\.path-grid small\s*\{[^}]*color:\s*rgba\(255,255,255,\.75\)[^}]*font-size:\s*12px/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const pagePath = 'grizzl-e-club-invitation-canada/index.html';

test('paid landing page leads with the qualified free-charger offer', async () => {
  const [html, css] = await Promise.all([read(pagePath), read('ad-landing.css')]);
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  assert.match(html, /<html lang="en-CA">/);
  assert.match(html, /<meta name="robots" content="noindex,follow">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.evrewards\.ca\/grizzl-e-club-invitation-canada\/">/);
  assert.match(text, /Get a free Grizzl-E Level 2 charger/i);
  assert.match(html, /<span class="no-break">Grizzl-E<\/span>/);
  assert.match(css, /\.ad-page\s+\.no-break\s*\{[^}]*white-space:\s*nowrap/s);
  assert.match(css, /\.ad-page\s+\.disclosure-inner\s+a\s*\{[^}]*display:\s*inline/s);
  assert.match(html, /Earn cash rewards on your home charging\./i);
  assert.match(html, /can help offset your home-charging electricity costs/i);
  assert.match(html, /Join thousands of Canadian EV drivers/i);
  assert.match(html, /Official Club statistics reported more than 21,000 members when checked August 23, 2026/i);

  const firstCta = html.indexOf('href="#request"');
  assert.ok(firstCta > 0, 'missing first invitation CTA');
  const beforeFirstCta = html.slice(0, firstCta);
  assert.match(beforeFirstCta, /Refundable deposit, shipping and installation apply\./i);
  assert.match(beforeFirstCta, /Peter Mucha may receive CAD \$0\.01 per eligible referred kWh/i);
  assert.match(beforeFirstCta, /Request first, wait for the official invitation, then apply through its link using the same email/i);

  assert.match(html, />Request an invite to apply for a free charger</i);
  assert.match(html, /<div class="ad-benefits" role="group" aria-label="What the offer includes">/);
  assert.doesNotMatch(html, /class="mobile-cta"/);
  assert.doesNotMatch(html, /\$0 upfront|\$100|stop bots|passive income|up to 15\s*¢|15\s*¢\/kWh/i);
});

test('paid landing page stays focused while disclosing material Club conditions', async () => {
  const html = await read(pagePath);
  assert.doesNotMatch(html, /ChargeLab|SWTCH|Compare programs|Cost calculator/i);
  assert.match(html, /Grizzl-E Club is a private program run by United Chargers/i);
  assert.match(html, /standard Club charging rewards are determined under current terms/i);

  const formStart = html.indexOf('<form id="lead-form"');
  assert.ok(formStart > 0, 'missing invitation form');
  const beforeForm = html.slice(0, formStart);
  for (const requirement of [
    /United Chargers decides whether to approve your application/i,
    /refundable security deposit/i,
    /shipping, handling and delivery/i,
    /installation and electrical work/i,
    /continuous Wi-Fi/i,
    /4–6 charging sessions per month/i,
    /remains United Chargers property/i,
    /return the charger if membership ends/i
  ]) {
    assert.match(beforeForm, requirement);
  }

  assert.match(html, /https:\/\/club\.grizzl-e\.com\/en\/terms/);
  assert.match(html, /Terms checked August 23, 2026/i);
});

test('paid landing page preserves the consent-first invitation sequence', async () => {
  const html = await read(pagePath);
  assert.match(html, /Request your invitation before creating a Grizzl-E Club account/i);
  assert.match(html, /Wait for the official invitation email/i);
  assert.match(html, /Open its link and apply with the same email/i);
  assert.match(html, /<form id="lead-form"[^>]+formResponse/);
  assert.match(html, /name="entry\.330297441"[^>]+type="email"[^>]+required/);
  assert.match(html, /<input[^>]+id="not-registered"[^>]+type="checkbox"[^>]+required/);
  const notRegistered = html.match(/<input[^>]+id="not-registered"[^>]*>/)?.[0] || '';
  assert.doesNotMatch(notRegistered, /\sname=/);
  assert.match(html, /name="entry\.305444311" value="I agree and request my invitation" required/);
  assert.match(html, /name="entry\.445895542" id="source-field" value="website"/);
  assert.match(html, /id="referral-disclosure"[\s\S]*Peter Mucha[\s\S]*CAD \$0\.01 per eligible referred kWh/i);
  assert.match(html, /Request received\. Please wait for your invitation link to arrive by email\./i);
  assert.match(html, /Do not register separately[\s\S]*same email/i);
  assert.match(html, /<script src="\.\.\/analytics\.js\?v=20260823-1"><\/script>/);
  assert.match(html, /<script src="\.\.\/script\.js\?v=20260820-1" defer><\/script>/);
  assert.doesNotMatch(html, /href\s*=\s*["'](?:https?:)?\/\/club\.grizzl-e\.com\/?(?:[?#][^"']*)?["']/i);
});

test('paid landing page remains outside organic crawler discovery', async () => {
  const [html, sitemap] = await Promise.all([read(pagePath), read('sitemap.xml')]);
  assert.match(html, /<meta name="robots" content="noindex,follow">/);
  assert.doesNotMatch(sitemap, /grizzl-e-club-invitation-canada/);
});

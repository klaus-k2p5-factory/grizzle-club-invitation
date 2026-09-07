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
  assert.match(html, /<link rel="stylesheet" href="\.\.\/ad-landing\.css\?v=20260823-2">/);
  assert.match(html, /<span class="no-break">Grizzl-E<\/span>/);
  assert.match(css, /\.ad-page\s+\.no-break\s*\{[^}]*white-space:\s*nowrap/s);
  assert.match(css, /\.ad-page\s+\.disclosure-inner\s+a\s*\{[^}]*display:\s*inline/s);
  assert.match(html, /Earn cash rewards every time you charge at home with your Club charger\./i);
  assert.match(html, /Rewards help offset home-charging electricity costs\./i);
  assert.match(html, /Join thousands of Canadian EV drivers/i);
  assert.match(html, /Official Club statistics reported more than 21,000 members when checked August 23, 2026/i);

  const firstCta = html.indexOf('href="#request"');
  assert.ok(firstCta > 0, 'missing first invitation CTA');
  const beforeFirstCta = html.slice(0, firstCta);
  assert.match(beforeFirstCta, /Refundable deposit, shipping and installation apply\./i);
  assert.match(beforeFirstCta, /Peter Mucha may receive CAD \$0\.01 per eligible referred kWh/i);
  assert.match(beforeFirstCta, /Request first, wait for the official invitation, then apply through its link using the same email/i);
  assert.doesNotMatch(beforeFirstCta, /up to 15\s*¢\/kWh/i);

  assert.match(html, />Request an invite to apply for a free charger</i);
  assert.match(html, /<div class="ad-benefits" role="group" aria-label="What the offer includes">/);
  assert.match(html, /<div class="mobile-cta"><a class="button button-primary" href="#lead-form">Request invite<\/a><\/div>/);
  assert.match(css, /@media\(max-width:650px\)[\s\S]*\.ad-page \.ad-hero \.hero-actions\{display:none\}/);
  assert.doesNotMatch(html, /fetchpriority=/i);
  assert.doesNotMatch(html, /\$0 upfront|\$100|stop bots|passive income/i);

  const program = html.slice(html.indexOf('<section class="section ad-program"'), html.indexOf('<section class="section ad-steps"'));
  assert.match(program, /<h2>Grizzl-E Club supplies the charger\. Earn up to 15¢\/kWh on all home charging through your Club charger\.\*<\/h2>/i);
  assert.match(program, /bring their own Grizzl-E or get a free Club charger/i);
  assert.match(program, /Starting October 1, 2026/i);
  assert.match(program, /Reaching 15¢\/kWh requires the Ultimate level/i);
  assert.match(program, /extra 5¢\/kWh is issued as Thanksgiving Bonus Points scheduled to convert to cash on October 1, 2027/i);
  assert.match(program, /Current Club rewards reach up to 10¢\/kWh before the increase/i);
});

test('paid landing page stays focused while disclosing material Club conditions', async () => {
  const html = await read(pagePath);
  assert.doesNotMatch(html, /ChargeLab|SWTCH|Compare programs|Cost calculator/i);
  assert.match(html, /A Club benefit supported by Canada’s Clean Fuel Regulations credit system and administered by United Chargers/i);
  assert.match(html, /Club reward rates and payments follow current terms/i);
  assert.match(html, /United Chargers designs and manufactures Grizzl-E chargers in Ontario/i);
  assert.doesNotMatch(html, /recorded home charging|recorded charging data|eligible home charging|Connected charging earns rewards/i);

  const formStart = html.indexOf('<form id="lead-form"');
  assert.ok(formStart > 0, 'missing invitation form');
  const beforeForm = html.slice(0, formStart);
  for (const requirement of [
    /United Chargers decides whether to approve your application/i,
    /refundable security deposit/i,
    /shipping, handling and delivery/i,
    /installation and electrical work/i,
    /Keep the charger connected to Wi-Fi/i,
    /Active use is defined as a minimum of 4 to 6 charging sessions per month\./i,
    /remains United Chargers property/i,
    /return the charger if membership ends/i
  ]) {
    assert.match(beforeForm, requirement);
  }

  assert.match(html, /https:\/\/club\.grizzl-e\.com\/en\/terms/);
  assert.doesNotMatch(html, /Terms checked August 23, 2026|then return here before registering/i);

  const rateFaq = html.slice(html.indexOf('<section class="section ad-faq"'));
  assert.match(rateFaq, /Can the Club pay up to 15¢\/kWh\?/i);
  assert.match(rateFaq, /starting October 1, 2026/i);
  assert.match(rateFaq, /bring their own Grizzl-E or get a free Club charger/i);
  assert.match(rateFaq, /reach the Ultimate level/i);
  assert.match(rateFaq, /Thanksgiving Bonus Points/i);
  assert.match(rateFaq, /convert to cash on October 1, 2027/i);
  assert.match(rateFaq, /Current Club rewards reach up to 10¢\/kWh before the increase/i);
  assert.match(rateFaq, /https:\/\/grizzl-e\.com\/news\/364/);
  assert.doesNotMatch(html, /owner-only bonus|who own their Grizzl-E charger/i);
});

test('paid landing page preserves the consent-first invitation sequence', async () => {
  const html = await read(pagePath);
  assert.match(html, /Request your invitation to the Grizzl-E Club below\./i);
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
  assert.match(html, /<script src="\.\.\/script\.js\?v=20260902-1" defer><\/script>/);
  assert.doesNotMatch(html, /href\s*=\s*["'](?:https?:)?\/\/club\.grizzl-e\.com\/?(?:[?#][^"']*)?["']/i);
});

test('paid landing page remains outside organic crawler discovery', async () => {
  const [html, sitemap] = await Promise.all([read(pagePath), read('sitemap.xml')]);
  assert.match(html, /<meta name="robots" content="noindex,follow">/);
  assert.doesNotMatch(sitemap, /grizzl-e-club-invitation-canada/);
});

test('mobile form shortcut clears rate details, material conditions and the form', async () => {
  const [html, js] = await Promise.all([read(pagePath), read('ad-landing.js')]);
  assert.match(html, /<script src="\.\.\/ad-landing\.js\?v=20260907-1" defer><\/script>/);
  assert.match(js, /querySelectorAll\('\.ad-hero, \.ad-program, \.ad-sequence, \.ad-conditions, #request'\)/);
  assert.match(js, /rect\.top < window\.innerHeight && rect\.bottom > 0/);
  assert.match(js, /mobileCta\.style\.display = intersects \? 'none' : ''/);
  assert.match(js, /addEventListener\('scroll', updateMobileCta/);
  assert.match(js, /addEventListener\('resize', updateMobileCta/);
});

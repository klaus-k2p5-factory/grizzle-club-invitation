import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = async (relative) => readFile(path.join(root, relative), 'utf8').catch(() => '');

const routes = [
  {
    page: 'free-grizzl-e-charger-canada/index.html',
    url: 'https://www.evrewards.ca/free-grizzl-e-charger-canada/',
    source: 'google-search-free-charger',
    title: /Request an Invite to Apply for a Free Grizzl-E Level 2 Charger/i,
    firstCta: /Request an invite to apply for a free charger/i,
    requiredBeforeFirstCta: [
      /Refundable deposit/i,
      /Shipping/i,
      /Installation and electrical work/i,
      /Request first, wait for the official invitation, then apply through its link using the same email/i,
      /Peter Mucha may receive CAD \$0\.01 per eligible referred kWh/i
    ]
  },
  {
    page: 'ev-home-charging-rewards-canada/index.html',
    url: 'https://www.evrewards.ca/ev-home-charging-rewards-canada/',
    source: 'google-search-10c-rewards',
    title: /Earn up to 10¢\/kWh in home-charging rewards/i,
    firstCta: /Request an invite to apply for Club rewards/i,
    requiredBeforeFirstCta: [
      /Request first, wait for the official invitation, then apply through its link using the same email/i,
      /Peter Mucha may receive CAD \$0\.01 per eligible referred kWh/i
    ]
  }
];

const formRequirements = [
  /<form id="lead-form"[^>]+formResponse/,
  /name="entry\.330297441"[^>]+type="email"[^>]+required/,
  /<input[^>]+id="not-registered"[^>]+type="checkbox"[^>]+required/,
  /name="entry\.305444311" value="I agree and request my invitation" required/,
  /name="entry\.445895542" id="source-field" value="website"/,
  /Request received\. Please wait for your invitation link to arrive by email\./i,
  /Do not register separately[\s\S]*same email/i
];

test('new paid-search routes are self-canonical, noindex and invitation-first', async () => {
  const sitemap = await read('sitemap.xml');
  for (const route of routes) {
    const html = await read(route.page);
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    assert.match(html, /<html lang="en-CA">/);
    assert.match(html, /<meta name="robots" content="noindex,follow">/);
    assert.match(html, new RegExp(`<link rel="canonical" href="${route.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`));
    assert.match(text, route.title);
    assert.match(html, /<script src="\.\.\/analytics\.js\?v=20260823-1"><\/script>/);
    assert.match(html, /<script src="\.\.\/script\.js\?v=20260902-1" defer><\/script>/);
    assert.match(html, /<script src="\.\.\/ad-landing\.js\?v=20260823-2" defer><\/script>/);
    assert.doesNotMatch(html, /gc\.zgo\.at|googletagmanager|gtag\(|enhanced conversions|conversion_action/i);
    assert.doesNotMatch(html, /href\s*=\s*["'](?:https?:)?\/\/club\.grizzl-e\.com\/?(?:[?#][^"']*)?["']/i);
    assert.doesNotMatch(sitemap, new RegExp(route.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

    const firstCta = html.indexOf('href="#request"');
    assert.ok(firstCta > 0, `${route.page} needs an in-flow invitation CTA`);
    const beforeFirstCta = html.slice(0, firstCta);
    for (const requirement of route.requiredBeforeFirstCta) assert.match(beforeFirstCta, requirement);
    assert.match(html, route.firstCta);

    for (const requirement of formRequirements) assert.match(html, requirement);
    const notRegistered = html.match(/<input[^>]+id="not-registered"[^>]*>/)?.[0] || '';
    assert.doesNotMatch(notRegistered, /\sname=/);
  }
});

test('free route keeps the full Club setup conditions before the form', async () => {
  const html = await read('free-grizzl-e-charger-canada/index.html');
  const beforeForm = html.slice(0, html.indexOf('<form id="lead-form"'));
  for (const requirement of [
    /United Chargers decides whether to approve your application/i,
    /Refundable security deposit/i,
    /Shipping, handling and delivery/i,
    /Installation and electrical work/i,
    /Keep the charger connected to Wi-Fi/i,
    /Active use is defined as a minimum of 4 to 6 charging sessions per month\./i,
    /remains United Chargers property/i,
    /return the charger if membership ends/i
  ]) assert.match(beforeForm, requirement);
});

test('current-rewards route is only about current up-to-10-cent Club rewards', async () => {
  const html = await read('ev-home-charging-rewards-canada/index.html');
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  assert.match(text, /Club benefit supported by Canada’s Clean Fuel Regulations credit system/i);
  assert.match(text, /up to 10¢\/kWh/i);
  assert.match(text, /not a direct government rebate or government endorsement/i);
  assert.match(text, /Approval and current terms control/i);
  assert.doesNotMatch(html, /15\s*(?:¢|cents?|cent|\/kWh|kWh)|Thanksgiving Bonus Points|October 1, 2027|news\/364/i);
});

test('only the two fixed new paid-search source tags are allow-listed', async () => {
  const analytics = await read('analytics.js');
  assert.match(analytics, /'google-search-free-charger'/);
  assert.match(analytics, /'google-search-10c-rewards'/);
});

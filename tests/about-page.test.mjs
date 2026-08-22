import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const pagePath = 'about/index.html';

test('about route identifies the site, its editor and its purpose', async () => {
  const html = await read(pagePath);
  assert.match(html, /<html lang="en-CA">/);
  assert.match(html, /<title>About &amp; Editorial Standards \| EV Rewards Canada<\/title>/);
  assert.match(html, /<meta name="description" content="See who maintains EV Rewards Canada, how its Canadian home-charging guides are sourced, how referral compensation works and how to request a correction\.">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.evrewards\.ca\/about\/">/);
  assert.match(html, /<h1>Independent information, <em>named accountability\.<\/em><\/h1>/);
  assert.match(html, /Peter Mucha maintains and edits EV Rewards Canada/i);
  assert.match(html, /Updated August 22, 2026/i);
  assert.doesNotMatch(html, /certified expert|licensed electrician|professional financial advice|official Grizzl-E/i);
});

test('material relationship is named and fully qualified before the invitation path', async () => {
  const html = await read(pagePath);
  const invitation = html.indexOf('src=organic-about');
  const disclosure = html.indexOf('Peter Mucha is a current Grizzl-E Club member');
  assert.ok(disclosure >= 0, 'missing named membership disclosure');
  assert.ok(invitation > disclosure, 'invitation path must follow the full disclosure');
  const beforeInvitation = html.slice(0, invitation);
  assert.match(beforeInvitation, /voluntarily requests an invitation/i);
  assert.match(beforeInvitation, /is approved by United Chargers/i);
  assert.match(beforeInvitation, /activates a qualifying referred charger/i);
  assert.match(beforeInvitation, /remains eligible/i);
  assert.match(beforeInvitation, /Peter may receive CAD \$0\.01 per eligible referred kWh/i);
  assert.match(beforeInvitation, /United Chargers independently decides membership, charger and program eligibility/i);
  assert.match(html, /EV Rewards Canada receives no compensation from ChargeLab or SWTCH/i);
  assert.doesNotMatch(html, /guaranteed referral|guaranteed approval|guaranteed reward/i);
});

test('editorial standards prioritize dated first-party evidence and visible corrections', async () => {
  const html = await read(pagePath);
  assert.match(html, /current first-party terms, provider pages and government sources/i);
  assert.match(html, /each factual guide shows when its volatile claims were checked/i);
  assert.match(html, /legal terms take priority/i);
  assert.match(html, /does not claim a hands-on hardware test unless one was actually performed/i);
  assert.match(html, /does not turn a private reward program into a government rebate, endorsement or guaranteed entitlement/i);
  assert.match(html, /Material commercial relationships are disclosed beside the decisions they may affect/i);
  assert.doesNotMatch(html, /buy a ranking|ranking claim|best provider|unbiased ranking/i);
  assert.match(html, /rates, eligibility, compatibility and program rules can change/i);
  assert.match(html, /mailto:hermancore1980@gmail\.com\?subject=EV%20Rewards%20Canada%20correction/);
  assert.match(html, /include the page URL and the statement you believe should be reviewed/i);
  assert.match(html, /Corrections are checked against the current primary source before the page is changed/i);
});

test('about page uses restrained identity schema and explains the real data boundary', async () => {
  const html = await read(pagePath);
  assert.match(html, /"@type": "AboutPage"/);
  assert.match(html, /"@type": "Person"/);
  assert.match(html, /"name": "Peter Mucha"/);
  assert.match(html, /"@type": "BreadcrumbList"/);
  assert.doesNotMatch(html, /aggregateRating|reviewRating|"@type": "Product"|"@type": "Article"/);
  assert.match(html, /The invitation form collects only an email address, explicit consent and an allow-listed source label/i);
  assert.match(html, /calculator inputs stay in the browser/i);
  assert.match(html, /Aggregate analytics do not receive an email address, consent response or calculator input/i);
  assert.match(html, /href="\.\.\/privacy\.html"/);
  assert.match(html, /This site does not sell invitation-request information or add it to an unrelated marketing list/i);
});

test('about route is integrated sitewide with safe attribution and named homepage disclosure', async () => {
  const files = [
    'index.html',
    'privacy.html',
    'ev-charger-cost-calculator-canada/index.html',
    'free-ev-charger-canada/index.html',
    'get-paid-to-charge-ev-canada/index.html',
    'grizzle-club-vs-chargelab-rewards-canada/index.html',
    'is-grizzl-e-club-worth-it-canada/index.html'
  ];
  const pages = await Promise.all(files.map(read));
  for (let i = 0; i < files.length; i += 1) {
    assert.match(pages[i], /href="(?:\.\.\/)?about\/"/, `${files[i]} needs an About link`);
  }

  const homeDisclosure = pages[0].slice(0, pages[0].indexOf('href="#request"'));
  assert.match(homeDisclosure, /Peter Mucha may receive CAD \$0\.01 per eligible referred kWh/i);
  assert.doesNotMatch(homeDisclosure, /\bI may (?:earn|receive) CAD \$0\.01/i);

  const [sitemap, analytics, about] = await Promise.all([
    read('sitemap.xml'),
    read('analytics.js'),
    read(pagePath)
  ]);
  assert.match(sitemap, /<loc>https:\/\/www\.evrewards\.ca\/about\/<\/loc><lastmod>2026-08-22<\/lastmod>/);
  assert.equal((sitemap.match(/<url>/g) || []).length, 8);
  assert.match(analytics, /'organic-about'/);
  assert.match(about, /<script src="\.\.\/analytics\.js\?v=20260822-1"><\/script>/);
  assert.doesNotMatch(about, /gc\.zgo\.at|goatcounter\.com\/count|<form\b/i);
});

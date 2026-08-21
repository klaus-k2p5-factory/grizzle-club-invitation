import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const pagePath = 'get-paid-to-charge-ev-canada/index.html';

test('paid-charging selector has a distinct truthful Canadian search identity', async () => {
  const html = await read(pagePath);
  assert.match(html, /<html lang="en-CA">/);
  assert.match(html, /<title>Get Paid to Charge Your EV in Canada: Compare Programs \(2026\)<\/title>/);
  assert.match(html, /<meta name="description" content="Compare current Canadian home EV charging reward programs/);
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.evrewards\.ca\/get-paid-to-charge-ev-canada\/">/);
  assert.match(html, /<h1>Get paid to charge your EV in Canada—<em>start with your charger\.<\/em><\/h1>/);
  assert.match(html, /terms checked August 20, 2026/i);
  assert.match(html, /og-get-paid-to-charge-ev-canada\.jpg/);
  assert.match(html, /<meta property="article:published_time" content="2026-08-21">/);
  assert.match(html, /<meta property="article:modified_time" content="2026-08-21">/);
  assert.doesNotMatch(html, /guaranteed income|guaranteed profit|free electricity|passive income|highest[- ]paying|best program|government payment/i);
});

test('full referral disclosure precedes every invitation conversion path', async () => {
  const html = await read(pagePath);
  const firstInvitation = html.indexOf('src=organic-paid-to-charge');
  const disclosure = html.indexOf('CAD $0.01 per eligible referred kWh');
  assert.ok(disclosure >= 0, 'missing material compensation disclosure');
  assert.ok(firstInvitation > disclosure, 'invitation CTA must follow disclosure');
  const beforeInvitation = html.slice(0, firstInvitation);
  assert.match(beforeInvitation, /voluntarily requests an invitation/i);
  assert.match(beforeInvitation, /is approved/i);
  assert.match(beforeInvitation, /activates a qualifying referred charger/i);
  assert.match(beforeInvitation, /remains eligible/i);
  assert.match(beforeInvitation, /United Chargers decides membership and charger eligibility/i);
  assert.match(beforeInvitation, /Peter Mucha may receive CAD \$0\.01 per eligible referred kWh/i);
  assert.doesNotMatch(beforeInvitation, /\bI may (?:earn|receive) CAD \$0\.01/i);
  assert.match(beforeInvitation, /not Grizzl-E, United Chargers, ChargeLab, SWTCH or the Government of Canada/i);
  assert.match(html, /This site receives no compensation from ChargeLab or SWTCH/i);
});

test('the 30-second selector starts with hardware and keeps all provider paths neutral', async () => {
  const html = await read(pagePath);
  const selector = html.slice(html.indexOf('<section class="reward-selector"'), html.indexOf('<section class="reward-comparison"'));
  assert.match(selector, /id="selector"/);
  assert.match(selector, /Already own a compatible smart charger/i);
  assert.match(selector, /OCPP 1\.6 or newer/i);
  assert.match(selector, /ChargeLab Rewards/i);
  assert.match(selector, /Want customer ownership/i);
  assert.match(selector, /\$300 CAD deposit/i);
  assert.match(selector, /SWTCH Home Charging Program/i);
  assert.match(selector, /Need or already own an eligible Grizzl-E/i);
  assert.match(selector, /Grizzl-E Club/i);
  assert.match(selector, /None of these fit/i);
  assert.match(selector, /conventional charger purchase/i);
  assert.equal((selector.match(/button-outline-light/g) || []).length, 3, 'provider paths need equal button emphasis');
  assert.doesNotMatch(selector, /button-light|button-primary/);
});

test('volatile reward and payout claims preserve current versus future timing', async () => {
  const html = await read(pagePath);
  assert.match(html, /Grizzl-E Club terms version June 10, 2026/i);
  assert.match(html, /Level 1 baseline is 3¢\/kWh[\s\S]*previously purchased charger[\s\S]*Level 3[\s\S]*5¢\/kWh[\s\S]*10¢\/kWh at 35,000 cumulative kWh/i);
  assert.match(html, /October 1, 2026[\s\S]*Thanksgiving Bonus Points[\s\S]*October 1, 2027/i);
  assert.match(html, /eligible members who own their Grizzl-E charger/i);
  assert.doesNotMatch(html, /currently (?:pays|earns|offers)[^<]{0,80}15¢|15¢[^<]{0,80}instant cash/i);

  assert.match(html, /ChargeLab terms last updated July 1, 2026/i);
  assert.match(html, /\$0\.10 CAD per qualifying residential kWh/i);
  assert.match(html, /calculated and disbursed quarterly/i);
  assert.match(html, /\$5 CAD minimum/i);
  assert.match(html, /digital gift cards or another delivery method selected by ChargeLab/i);

  assert.match(html, /SWTCH terms last updated August 19, 2026/i);
  assert.match(html, /\$0\.03 CAD\/kWh for the first 1,500 kWh/i);
  assert.match(html, /\$0\.11 CAD\/kWh[\s\S]*sessions beginning on or after September 1, 2026 at 12:00 a\.m\. Eastern Time/i);
  assert.match(html, /\$100 CAD[\s\S]*direct deposit[\s\S]*15 business days/i);
  assert.match(html, /rates are variable and are not guaranteed/i);
  assert.doesNotMatch(html, /currently pays[^<]{0,80}\$0\.11|current rate[^<]{0,80}\$0\.11/i);
});

test('the guide explains the private carbon-credit mechanism and connected-data trade-off', async () => {
  const html = await read(pagePath);
  assert.match(html, /private reward programs—not Government of Canada payments/i);
  assert.match(html, /Clean Fuel Regulations establish a credit market/i);
  assert.match(html, /charging network operators can create credits for residential EV charging/i);
  assert.match(html, /revenues[\s\S]*financial incentives for consumers/i);
  assert.match(html, /connected charging data/i);
  assert.match(html, /do not enrol the same charger in conflicting carbon-credit programs/i);
  assert.match(html, /exclusive right to claim carbon credits/i);
  assert.match(html, /missed or disconnected sessions may not earn rewards/i);
  assert.match(html, /not a government rebate, approval or guaranteed entitlement/i);
});

test('the Grizzl-E path preserves invitation-first attribution and existing accounts', async () => {
  const html = await read(pagePath);
  assert.match(html, /id="grizzle-invitation-path"[^>]+href="\.\.\/\?src=organic-paid-to-charge#request"/);
  assert.match(html, /request the official invitation before creating a Club account/i);
  assert.match(html, /wait for the invitation link/i);
  assert.match(html, /use the same email/i);
  assert.match(html, /apply only through the official invitation/i);
  assert.match(html, /already registered[^<]*do not create a duplicate or alternate account/i);
  assert.match(html, /contact official support about your existing account/i);
  assert.doesNotMatch(html, /href="(?:https:)?\/\/club\.grizzl-e\.com\/?(?:[?#][^"]*)?"/i);
  assert.doesNotMatch(html, /<form\b/i);
});

test('all material claims use dated first-party sources and restrained structured data', async () => {
  const html = await read(pagePath);
  for (const url of [
    'https://connect-api.unitedchargers.com/client/terms-and-conditions/latest/club',
    'https://grizzl-e.com/news/364',
    'https://uc-ec-strapi-prod-53jvc.ondigitalocean.app/api/publications/322',
    'https://chargelab.co/chargelab-rewards-terms-conditions',
    'https://chargelab.co/home-charging-rewards-canada',
    'https://shop.swtchenergy.com/pages/terms-of-service',
    'https://shop.swtchenergy.com/',
    'https://www.canada.ca/en/environment-climate-change/services/managing-pollution/energy-production/fuel-regulations/clean-fuel-regulations/about.html'
  ]) assert.ok(html.includes(url), `missing primary source ${url}`);
  assert.match(html, /"@type": "Article"/);
  assert.match(html, /"@type": "FAQPage"/);
  assert.match(html, /"@type": "BreadcrumbList"/);
  assert.doesNotMatch(html, /aggregateRating|reviewRating|Product/);
  assert.match(html, /checked August 20, 2026/g);
  for (const id of ['source-1', 'source-2', 'source-3', 'source-4', 'source-5', 'source-6', 'source-7', 'source-8']) {
    assert.match(html, new RegExp(`id="${id}"`), `missing ${id}`);
  }
});

test('the route is integrated through owned pages, sitemap and privacy-safe analytics', async () => {
  const [home, calculator, comparison, fit, freeGuide, sitemap, analytics] = await Promise.all([
    read('index.html'),
    read('ev-charger-cost-calculator-canada/index.html'),
    read('grizzle-club-vs-chargelab-rewards-canada/index.html'),
    read('is-grizzl-e-club-worth-it-canada/index.html'),
    read('free-ev-charger-canada/index.html'),
    read('sitemap.xml'),
    read('analytics.js')
  ]);
  for (const [name, html] of [['home', home], ['calculator', calculator], ['comparison', comparison], ['fit', fit], ['free guide', freeGuide]]) {
    assert.match(html, /get-paid-to-charge-ev-canada\//, `${name} needs the new guide link`);
  }
  assert.match(sitemap, /<loc>https:\/\/www\.evrewards\.ca\/get-paid-to-charge-ev-canada\/<\/loc><lastmod>2026-08-21<\/lastmod>/);
  assert.equal((sitemap.match(/<url>/g) || []).length, 7);
  assert.match(analytics, /'organic-paid-to-charge'/);
  const page = await read(pagePath);
  assert.match(page, /<script src="\.\.\/analytics\.js\?v=20260820-3"><\/script>/);
  assert.doesNotMatch(page, /gc\.zgo\.at|goatcounter\.com\/count/);
});

test('selector, comparison and mechanism layouts have explicit responsive CSS', async () => {
  const css = await read('styles.css');
  for (const selector of [
    '.paid-charging-hero',
    '.reward-selector',
    '.reward-selector-grid',
    '.reward-comparison-table',
    '.future-rate-note',
    '.credit-framework-section',
    '.credit-framework-layout',
    '.data-choice-grid',
    '.paid-invitation-sequence'
  ]) assert.ok(css.includes(selector), `missing responsive selector ${selector}`);

  const noteHeading = css.match(/\.future-rate-note strong\s*\{[^}]*color:\s*(#[0-9a-f]{6})/i);
  assert.ok(noteHeading, 'future-rate note heading needs an explicit colour');
  const channel = (hex, at) => parseInt(hex.slice(at, at + 2), 16) / 255;
  const luminance = (hex) => {
    const linear = [1, 3, 5].map((at) => {
      const value = channel(hex, at);
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const foreground = luminance(noteHeading[1]);
  const background = luminance('#e4f4ed');
  const contrast = (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  assert.ok(contrast >= 4.5, `future-rate note heading contrast is ${contrast.toFixed(2)}:1`);

  const marker = '@media (max-width: 650px)';
  const mobileBlocks = [];
  let cursor = 0;
  while (cursor < css.length) {
    const start = css.indexOf(marker, cursor);
    if (start === -1) break;
    const open = css.indexOf('{', start);
    let depth = 0;
    let close = -1;
    for (let i = open; i < css.length; i += 1) {
      if (css[i] === '{') depth += 1;
      if (css[i] === '}') depth -= 1;
      if (depth === 0) { close = i; break; }
    }
    assert.notEqual(close, -1, 'mobile media query must be balanced');
    mobileBlocks.push(css.slice(open + 1, close));
    cursor = close + 1;
  }
  const mobile = mobileBlocks.find(block => block.includes('.paid-charging-page')) || '';
  assert.ok(mobile, 'missing paid-page mobile media block');
  assert.match(mobile, /\.reward-selector-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(mobile, /\.credit-framework-layout\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(mobile, /\.data-choice-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(mobile, /\.paid-charging-page \.disclosure-inner\s*\{[^}]*display:\s*block/s);
});

test('social card is a clean 1200 by 630 JPEG with no embedded EXIF block', async () => {
  const image = await readFile(path.join(root, 'assets/og-get-paid-to-charge-ev-canada.jpg'));
  assert.equal(image[0], 0xff);
  assert.equal(image[1], 0xd8);
  assert.equal(image.includes(Buffer.from('Exif\0\0')), false);
  let width = 0;
  let height = 0;
  for (let i = 2; i < image.length - 9;) {
    if (image[i] !== 0xff) { i += 1; continue; }
    const marker = image[i + 1];
    if (marker === 0xd8 || marker === 0xd9) { i += 2; continue; }
    const length = image.readUInt16BE(i + 2);
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      height = image.readUInt16BE(i + 5);
      width = image.readUInt16BE(i + 7);
      break;
    }
    i += 2 + length;
  }
  assert.deepEqual({ width, height }, { width: 1200, height: 630 });
});

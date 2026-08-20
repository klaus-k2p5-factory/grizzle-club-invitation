import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => readFile(path.join(root, relative), 'utf8');

test('calculator page has truthful SEO, disclosure and structured data', async () => {
  const html = await read('ev-charger-cost-calculator-canada/index.html');
  assert.match(html, /<html lang="en-CA">/);
  assert.match(html, /<title>EV Charger Cost Calculator Canada \| First-Year Total<\/title>/);
  assert.match(html, /<meta name="description" content="Estimate a ballpark first-year home EV charging cost in Canada/);
  assert.doesNotMatch(html, /Calculate your real first-year home EV charging cost/);
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.evrewards\.ca\/ev-charger-cost-calculator-canada\/">/);
  assert.match(html, /<h1>What could home EV charging cost in your first year\?<\/h1>/);
  assert.match(html, /CAD \$0\.01 per eligible referred kWh/);
  assert.match(html, /not (?:the )?(?:official )?Grizzl-E, United Chargers or Government of Canada/i);
  assert.match(html, /<meta property="og:image" content="https:\/\/www\.evrewards\.ca\/assets\/og-ev-charger-cost-calculator\.jpg">/);
  assert.match(html, /<meta property="og:image:width" content="1200">/);
  assert.match(html, /<meta property="og:image:height" content="630">/);
  assert.match(html, /<meta property="og:image:alt" content="Canadian first-year EV charger cost calculator showing hardware, installation, electricity, rebates and rewards">/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
  assert.match(html, /\.\.\/styles\.css\?v=20260820-2/);
  assert.match(html, /"@type": "WebApplication"/);
  assert.match(html, /"@type": "Article"/);
  assert.doesNotMatch(html, /aggregateRating|reviewRating|priceCurrency/);
});

test('calculator page exposes labelled inputs and live results without collecting data', async () => {
  const html = await read('ev-charger-cost-calculator-canada/index.html');
  for (const id of [
    'scenario', 'annual-km', 'home-share', 'efficiency', 'electricity-rate', 'hardware-cost',
    'shipping-cost', 'installation-cost', 'maintenance-reserve', 'program-fees',
    'deposit', 'reward-rate', 'rebate-amount', 'rebate-confirmed'
  ]) {
    assert.match(html, new RegExp(`(?:id="${id}"[\\s\\S]*?<\\/|for="${id}")`), `missing accessible control ${id}`);
  }
  assert.match(html, /id="calculator-results"[^>]*aria-live="polite"/);
  assert.match(html, /id="upfront-result"/);
  assert.match(html, /id="net-result"/);
  assert.match(html, /id="electricity-result"/);
  assert.match(html, /id="offset-result"/);
  assert.match(html, /\.\.\/calculator-core\.js\?v=20260811-3/);
  assert.match(html, /\.\.\/calculator\.js\?v=20260811-3/);
  assert.doesNotMatch(html, /<form[^>]+action=/);
  assert.doesNotMatch(html, /name="(?:email|address|postal|utility-account)"/i);
});

test('calculator opens with a simple explained Canadian starter example', async () => {
  const html = await read('ev-charger-cost-calculator-canada/index.html');
  assert.match(html, /A starter example is already filled in/);
  assert.match(html, /id="annual-km"[^>]+value="15000"/);
  assert.match(html, /13,261 km for cars and 15,180 km for light trucks/);
  assert.match(html, /Natural Resources Canada/i);
  assert.match(html, /id="home-share"/);
  assert.match(html, /<option value="80" selected>Most \(80%\)<\/option>/);
  assert.match(html, /4 out of every 5 kilometres/i);
  assert.match(html, /id="hardware-cost"[^>]+value="700"/);
  assert.match(html, /id="installation-cost"[^>]+value="1500"/);
  assert.match(html, /id="efficiency"[^>]+value="20"/);
  assert.match(html, /id="electricity-rate"[^>]+value="0\.15"/);
  assert.match(html, /<details class="calculator-advanced">/);
  assert.match(html, /Fine-tune the estimate \(optional\)/);
  assert.doesNotMatch(html, /<legend>2\. Estimate annual home charging<\/legend>/);
  assert.doesNotMatch(html, /<legend>3\. Enter setup and year-one costs<\/legend>/);
  assert.doesNotMatch(html, /<legend>4\. Add only supportable offsets<\/legend>/);
  assert.doesNotMatch(html, /Installation, permit and upgrades/);
  assert.match(html, /enter it as part of your/i);
});

test('simple annual driving and home share become kilometres charged at home', async () => {
  const script = await read('calculator.js');
  assert.match(script, /homeChargingShare: byId\('home-share'\)/);
  assert.match(script, /annualKm: Number\(fields\.annualKm\.value\) \* Number\(fields\.homeChargingShare\.value\) \/ 100/);
  assert.match(script, /output\.monthlyElectricity\.textContent/);
  assert.match(script, /output\.explanation\.textContent/);
});

test('offset labels distinguish a potential rebate from estimated rewards', async () => {
  const html = await read('ev-charger-cost-calculator-canada/index.html');
  assert.match(html, /Potential rebate/);
  assert.match(html, /Rebate \+ estimated rewards/);
  assert.doesNotMatch(html, />Confirmed offsets</);
  assert.doesNotMatch(html, />Confirmed rebate or incentive/);
});

test('calculator is integrated into home, comparison and sitemap with distinct source tracking', async () => {
  const [home, comparison, sitemap] = await Promise.all([
    read('index.html'),
    read('grizzle-club-vs-chargelab-rewards-canada/index.html'),
    read('sitemap.xml')
  ]);
  assert.match(home, /ev-charger-cost-calculator-canada\//);
  assert.match(comparison, /\.\.\/ev-charger-cost-calculator-canada\//);
  assert.match(sitemap, /ev-charger-cost-calculator-canada\//);

  const calculator = await read('ev-charger-cost-calculator-canada/index.html');
  assert.match(calculator, /id="invitation-path-link"[^>]+href="\.\.\/\?src=organic-cost-calculator#request"/);
  assert.doesNotMatch(calculator, /src=organic-comparison#request/);
});

test('calculator preserves only an allow-listed inbound campaign source through its invitation CTA', async () => {
  const script = await read('calculator.js');
  assert.match(script, /const attributedSource = window\.EVRewardsAnalytics\?\.source/);
  assert.match(script, /attributedSource && attributedSource !== 'direct'/);
  assert.match(script, /invitationLink\.href = `\.\.\/\?src=\$\{campaign\}#request`/);
  assert.match(script, /organic-cost-calculator/);
  assert.doesNotMatch(script, /new URLSearchParams|params\.get\('src'\)|location\.search/);
});

test('calculator browser script avoids storage, tracking and network submission', async () => {
  const script = await read('calculator.js');
  assert.doesNotMatch(script, /localStorage|sessionStorage|document\.cookie|fetch\(|XMLHttpRequest|sendBeacon/);
  assert.match(script, /EvCostCalculator(?:\?\.|\.)calculateFirstYearCost/);
  assert.match(script, /Intl\.NumberFormat\('en-CA'/);
  assert.match(script, /reset/);
});

test('scenario defaults never overwrite a visitor-entered reward rate', async () => {
  const script = await read('calculator.js');
  assert.match(script, /let rewardRateAutoSuggested = false/);
  assert.match(script, /let rewardRateUserEdited = false/);
  assert.match(script, /fields\.rewardRate\.addEventListener\('input', \(\) => \{\s*rewardRateUserEdited = true;\s*rewardRateAutoSuggested = false;/);
  assert.match(script, /scenario === 'supplied'[\s\S]*!rewardRateUserEdited[\s\S]*fields\.rewardRate\.value = '0\.03';[\s\S]*rewardRateAutoSuggested = true;/);
  assert.match(script, /scenario !== 'supplied' && rewardRateAutoSuggested[\s\S]*fields\.rewardRate\.value = '0';/);
  assert.match(script, /form\.addEventListener\('reset'[\s\S]*rewardRateUserEdited = false;[\s\S]*rewardRateAutoSuggested = false;/);
});

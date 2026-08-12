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
  assert.match(html, /<link rel="canonical" href="https:\/\/klaus-k2p5-factory\.github\.io\/grizzle-club-invitation\/ev-charger-cost-calculator-canada\/">/);
  assert.match(html, /<h1>How much will a home EV charger really cost in Canada in year one\?<\/h1>/);
  assert.match(html, /CAD \$0\.01 per eligible referred kWh/);
  assert.match(html, /not (?:the )?(?:official )?Grizzl-E, United Chargers or Government of Canada/i);
  assert.match(html, /"@type": "WebApplication"/);
  assert.match(html, /"@type": "Article"/);
  assert.doesNotMatch(html, /aggregateRating|reviewRating|priceCurrency/);
});

test('calculator page exposes labelled inputs and live results without collecting data', async () => {
  const html = await read('ev-charger-cost-calculator-canada/index.html');
  for (const id of [
    'scenario', 'annual-km', 'efficiency', 'electricity-rate', 'hardware-cost',
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
  assert.match(html, /\.\.\/calculator-core\.js\?v=20260811-2/);
  assert.match(html, /\.\.\/calculator\.js\?v=20260811-2/);
  assert.doesNotMatch(html, /<form[^>]+action=/);
  assert.doesNotMatch(html, /name="(?:email|address|postal|utility-account)"/i);
});

test('energy and reward estimates use kilometres charged through the home charger', async () => {
  const html = await read('ev-charger-cost-calculator-canada/index.html');
  assert.match(html, /Annual kilometres charged at home/);
  assert.match(html, /not total driving unless every kilometre is charged here/i);
  assert.match(html, /Home-charging energy from the wall/);
  assert.match(html, /Include charging losses/i);
  assert.match(html, /annual kilometres charged at home × vehicle kWh\/100 km ÷ 100/i);
  assert.doesNotMatch(html, /<span>Annual driving <b>km\/year<\/b><\/span>/);
});

test('offset labels distinguish a potential rebate from estimated rewards', async () => {
  const html = await read('ev-charger-cost-calculator-canada/index.html');
  assert.match(html, /Potential rebate or incentive/);
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

test('calculator preserves a safe inbound campaign source through its invitation CTA', async () => {
  const script = await read('calculator.js');
  assert.match(script, /new URLSearchParams\(window\.location\.search\)/);
  assert.match(script, /params\.get\('src'\)/);
  assert.match(script, /replace\(\/\[\^a-zA-Z0-9_.-\]\/g, ''\)\.slice\(0, 60\)/);
  assert.match(script, /invitationLink\.href = `\.\.\/\?src=\$\{campaign\}#request`/);
  assert.match(script, /organic-cost-calculator/);
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

const puppeteer = require('/home/peter/.npm-global/lib/node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

const base = 'http://127.0.0.1:8080';
const outDir = path.resolve(__dirname);
const shotDir = path.join(outDir, 'screenshots');
fs.mkdirSync(shotDir, { recursive: true });
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function revealPage(page) {
  await page.evaluate(async () => {
    const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const max = document.documentElement.scrollHeight - innerHeight;
    for (let y = 0; y <= max; y += Math.max(350, Math.floor(innerHeight * 0.72))) {
      scrollTo(0, y);
      await pause(55);
    }
    scrollTo(0, max);
    await pause(120);
    scrollTo(0, 0);
  });
  await delay(150);
}

async function collectAudit(page, label) {
  return await page.evaluate((label) => {
    const visible = (el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return cs.display !== 'none' && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0 && r.width > 0 && r.height > 0;
    };
    const text = (el) => (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');
    const all = [...document.querySelectorAll('*')];
    const ids = [...document.querySelectorAll('[id]')].map((el) => el.id);
    const duplicates = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
    const horizontalOverflow = all.filter((el) => {
      if (!visible(el)) return false;
      const r = el.getBoundingClientRect();
      return r.left < -1 || r.right > innerWidth + 1;
    }).map((el) => ({tag: el.tagName, cls: el.className, text: text(el).slice(0, 90), rect: {left: Math.round(el.getBoundingClientRect().left), right: Math.round(el.getBoundingClientRect().right), width: Math.round(el.getBoundingClientRect().width)}})).slice(0, 30);
    const smallText = all.filter((el) => {
      if (!visible(el) || el.children.length || !text(el)) return false;
      const size = parseFloat(getComputedStyle(el).fontSize);
      return size < 12;
    }).map((el) => ({tag: el.tagName, cls: el.className, size: getComputedStyle(el).fontSize, text: text(el).slice(0, 100)})).slice(0, 50);
    const controls = [...document.querySelectorAll('input,select,textarea,button')].filter(visible).map((el) => {
      const associated = el.labels && el.labels.length ? [...el.labels].map(text).join(' ') : '';
      const aria = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || '';
      return {tag: el.tagName, type: el.type || '', name: el.name || '', label: (associated || aria || text(el)).slice(0, 180), required: !!el.required, checked: typeof el.checked === 'boolean' ? el.checked : undefined};
    });
    const unlabeledControls = controls.filter((c) => !c.label);
    const anchors = [...document.querySelectorAll('a[href]')].map((a) => ({text: text(a).slice(0, 100), href: a.getAttribute('href'), resolved: a.href, visible: visible(a)}));
    const badInternalAnchors = anchors.filter((a) => a.href.startsWith('#') && !document.querySelector(a.href));
    const images = [...document.images].map((img) => ({src: img.getAttribute('src'), alt: img.getAttribute('alt'), complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight}));
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({level: Number(h.tagName.slice(1)), text: text(h)}));
    const headingJumps = headings.filter((h, i) => i && h.level > headings[i - 1].level + 1).map((h, i) => ({from: headings[i].level, to: h.level, text: h.text}));
    const consent = document.querySelector('input[name="entry.305444311"]');
    const form = document.querySelector('#lead-form');
    const focusable = [...document.querySelectorAll('a[href],button,input,select,textarea,summary,[tabindex]')].filter((el) => visible(el) && el.tabIndex >= 0).map((el) => ({tag: el.tagName, text: text(el).slice(0, 80), name: el.getAttribute('name'), tabindex: el.tabIndex}));
    return {
      label,
      url: location.href,
      title: document.title,
      lang: document.documentElement.lang,
      viewport: {width: innerWidth, height: innerHeight, dpr: devicePixelRatio},
      documentSize: {clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight},
      duplicateIds: duplicates,
      horizontalOverflow,
      smallText,
      unlabeledControls,
      controls,
      anchors,
      badInternalAnchors,
      images,
      headings,
      headingJumps,
      focusableCount: focusable.length,
      form: form ? {action: form.action, method: form.method, target: form.target, novalidate: form.noValidate} : null,
      consent: consent ? {checked: consent.checked, required: consent.required, value: consent.value} : null,
      disclosurePresent: document.body.innerText.includes('Independent member referral page') && document.body.innerText.includes('not a Government of Canada'),
      referralRatePresent: document.body.innerText.includes('CAD $0.01 per eligible kWh'),
      keyTermsPresent: {
        refundableDeposit: /refundable (security )?deposit/i.test(document.body.innerText),
        shipping: /shipping/i.test(document.body.innerText),
        installation: /installation/i.test(document.body.innerText),
        wifi: /Wi-Fi/i.test(document.body.innerText),
        data: /charging.data|charging-session data|transmit charging data/i.test(document.body.innerText),
        ownershipReturn: /remains United Chargers property/i.test(document.body.innerText) && /must be returned/i.test(document.body.innerText)
      }
    };
  }, label);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-color-profile=srgb']
  });
  const results = {generatedAt: new Date().toISOString(), pages: {}, interactions: {}, console: [], pageErrors: [], failedRequests: [], badResponses: [], ax: {}};
  try {
    for (const cfg of [
      {label: 'desktop', width: 1440, height: 1000, dpr: 1},
      {label: 'mobile', width: 390, height: 844, dpr: 1},
      {label: 'narrow-mobile', width: 320, height: 812, dpr: 1}
    ]) {
      const page = await browser.newPage();
      await page.setViewport({width: cfg.width, height: cfg.height, deviceScaleFactor: cfg.dpr, isMobile: cfg.label !== 'desktop', hasTouch: cfg.label !== 'desktop'});
      page.on('console', (msg) => { if (['error','warning'].includes(msg.type())) results.console.push({page: cfg.label, type: msg.type(), text: msg.text()}); });
      page.on('pageerror', (err) => results.pageErrors.push({page: cfg.label, text: err.message}));
      page.on('requestfailed', (req) => results.failedRequests.push({page: cfg.label, url: req.url(), error: req.failure()?.errorText}));
      page.on('response', (res) => { if (res.status() >= 400) results.badResponses.push({page: cfg.label, status: res.status(), url: res.url()}); });
      const response = await page.goto(`${base}/`, {waitUntil: 'networkidle2', timeout: 45000});
      await delay(250);
      await page.screenshot({path: path.join(shotDir, `${cfg.label}-hero-baseline.png`), fullPage: false});
      await revealPage(page);
      results.pages[cfg.label] = await collectAudit(page, cfg.label);
      results.pages[cfg.label].httpStatus = response.status();
      await page.screenshot({path: path.join(shotDir, `${cfg.label}-full-baseline.png`), fullPage: true});
      const client = await page.createCDPSession();
      const ax = await client.send('Accessibility.getFullAXTree');
      results.ax[cfg.label] = {
        nodeCount: ax.nodes.length,
        ignoredCount: ax.nodes.filter((n) => n.ignored).length,
        unnamedInteractive: ax.nodes.filter((n) => ['button','link','checkbox','radio','combobox','textbox'].includes(n.role?.value) && !(n.name?.value || '').trim()).map((n) => n.role?.value)
      };

      if (cfg.label === 'desktop') {
        await delay(2100);
        await page.click('#lead-form button[type="submit"]');
        await delay(300);
        results.interactions.emptySubmit = await page.evaluate(() => ({
          error: document.querySelector('#form-error').textContent.trim(),
          activeTag: document.activeElement.tagName,
          activeName: document.activeElement.getAttribute('name'),
          successHidden: document.querySelector('#success-state').hidden,
          formHidden: document.querySelector('#lead-form').hidden
        }));
        await page.type('input[name="entry.1490423963"]', 'QA Test');
        await page.type('input[name="entry.330297441"]', 'qa@example.com');
        await page.select('select[name="entry.2114701760"]', 'Ontario');
        await page.click('input[name="entry.1680038464"][value="I own or lease an EV"]');
        await page.click('#lead-form button[type="submit"]');
        await delay(300);
        results.interactions.noConsentSubmit = await page.evaluate(() => ({
          error: document.querySelector('#form-error').textContent.trim(),
          activeTag: document.activeElement.tagName,
          activeName: document.activeElement.getAttribute('name'),
          consentChecked: document.querySelector('input[name="entry.305444311"]').checked,
          successHidden: document.querySelector('#success-state').hidden,
          formHidden: document.querySelector('#lead-form').hidden
        }));
        await page.screenshot({path: path.join(shotDir, 'desktop-form-validation.png'), fullPage: false});

        await page.goto(`${base}/?utm_source=QA%20campaign!!`, {waitUntil: 'networkidle2'});
        results.interactions.sourceSanitization = await page.$eval('#source-field', (el) => el.value);

        await page.goto(`${base}/privacy.html`, {waitUntil: 'networkidle2'});
        await revealPage(page);
        results.pages.privacyDesktop = await collectAudit(page, 'privacyDesktop');
        await page.screenshot({path: path.join(shotDir, 'desktop-privacy-full.png'), fullPage: true});
      }

      if (cfg.label === 'mobile') {
        await page.evaluate(() => document.querySelector('#request').scrollIntoView());
        await delay(350);
        await page.screenshot({path: path.join(shotDir, 'mobile-form-baseline.png'), fullPage: false});
        results.interactions.mobileCtaAtRequest = await page.$eval('.mobile-cta', (el) => getComputedStyle(el).display);
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync(path.join(outDir, 'browser-audit-baseline.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify({
    generatedAt: results.generatedAt,
    pages: Object.fromEntries(Object.entries(results.pages).map(([k,v]) => [k, {status:v.httpStatus, viewport:v.viewport, overflow:v.horizontalOverflow.length, smallText:v.smallText.length, unlabeled:v.unlabeledControls.length, brokenImages:v.images.filter(i=>!i.complete||!i.naturalWidth).length, badInternalAnchors:v.badInternalAnchors.length, duplicateIds:v.duplicateIds.length, consent:v.consent, keyTerms:v.keyTermsPresent}])),
    interactions: results.interactions,
    console: results.console,
    pageErrors: results.pageErrors,
    failedRequests: results.failedRequests,
    badResponses: results.badResponses,
    ax: results.ax
  }, null, 2));
})().catch((err) => { console.error(err); process.exit(1); });

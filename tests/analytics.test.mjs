import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => readFile(path.join(root, relative), 'utf8');

const publicPages = [
  ['index.html', 'analytics.js'],
  ['privacy.html', 'analytics.js'],
  ['about/index.html', '../analytics.js'],
  ['ev-charger-cost-calculator-canada/index.html', '../analytics.js'],
  ['grizzle-club-vs-chargelab-rewards-canada/index.html', '../analytics.js'],
  ['is-grizzl-e-club-worth-it-canada/index.html', '../analytics.js'],
  ['free-ev-charger-canada/index.html', '../analytics.js'],
  ['get-paid-to-charge-ev-canada/index.html', '../analytics.js']
];

test('every public page loads only the local privacy controller', async () => {
  for (const [file, localScript] of publicPages) {
    const html = await read(file);
    const local = html.indexOf(`<script src="${localScript}?v=20260822-1"></script>`);
    assert.notEqual(local, -1, `${file} is missing the local analytics privacy controls`);
    assert.doesNotMatch(html, /gc\.zgo\.at|goatcounter\.com\/count/, `${file} must not load a beacon before privacy controls succeed`);
    const scriptSources = [...html.matchAll(/<script\b[^>]*>/gi)].flatMap(match => {
      const src = match[0].match(/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      return src ? [src[1] || src[2] || src[3]] : [];
    });
    assert.equal(scriptSources.some(src => /^(?:https?:)?\/\//i.test(src)), false, `${file} must not execute remote scripts`);
    assert.doesNotMatch(html, /\bimport\s*(?:\(|[^;]*?\bfrom\s*)["'](?:https?:)?\/\//i, `${file} must not import remote modules`);
  }
});

const runAnalytics = async (
  search,
  referrer = 'https://example.com/article?email=visitor@example.com#section',
  { historyFails = false, hostname = 'www.evrewards.ca', protocol = 'https:' } = {}
) => {
  const source = await read('analytics.js');
  const window = {};
  const location = {
    pathname: '/guide/',
    search,
    hash: '#request',
    hostname,
    protocol
  };
  const requests = [];
  const requestOptions = [];
  const history = {
    replaceState: (_state, _title, value) => {
      if (historyFails) throw new Error('replaceState blocked');
      const normalized = new URL(value, 'https://www.evrewards.ca');
      location.pathname = normalized.pathname;
      location.search = normalized.search;
      location.hash = normalized.hash;
    }
  };
  const document = {
    referrer,
    title: 'EV Rewards test page',
    visibilityState: 'visible',
    addEventListener: () => {},
    removeEventListener: () => {}
  };
  const context = {
    window,
    location,
    history,
    URL,
    URLSearchParams,
    encodeURIComponent,
    document,
    fetch: (url, options) => {
      requests.push(url);
      requestOptions.push(options);
      return Promise.resolve({ ok: true });
    }
  };
  vm.runInNewContext(source, context);
  return {
    window,
    location,
    requests,
    requestOptions
  };
};

test('the audited local client emits only the documented pageview and event fields', async () => {
  const controller = await read('analytics.js');
  assert.doesNotMatch(controller, /count\.v5|createElement\(['"]script['"]\)|gc\.zgo\.at/);

  const result = await runAnalytics(
    '?src=facebook-page-intro',
    'https://social.example/post/42?email=visitor@example.com#comments'
  );

  assert.equal(result.requests.length, 1);
  const pageview = new URL(result.requests[0]);
  assert.equal(pageview.origin + pageview.pathname, 'https://evrewardscanada.goatcounter.com/count');
  assert.deepEqual([...pageview.searchParams.keys()].sort(), ['p', 'q', 'r', 'rnd', 't']);
  assert.equal(pageview.searchParams.get('p'), '/guide/?campaign=facebook-page-intro&src=evrewards');
  assert.equal(pageview.searchParams.get('q'), '?campaign=facebook-page-intro&src=evrewards');
  assert.equal(pageview.searchParams.get('r'), 'https://social.example');
  assert.equal(pageview.searchParams.get('t'), 'EV Rewards test page');
  assert.equal(pageview.searchParams.has('s'), false);
  assert.equal(pageview.searchParams.has('b'), false);
  assert.deepEqual(Object.keys(result.requestOptions[0]).sort(), ['credentials', 'keepalive', 'method', 'mode', 'referrerPolicy']);
  assert.equal(result.requestOptions[0].method, 'GET');
  assert.equal(result.requestOptions[0].mode, 'no-cors');
  assert.equal(result.requestOptions[0].credentials, 'omit');
  assert.equal(result.requestOptions[0].keepalive, true);
  assert.equal(result.requestOptions[0].referrerPolicy, 'origin');
  assert.doesNotMatch(result.requests[0], /visitor|example\.com|email|consent|calculator/i);

  result.window.EVRewardsAnalytics.trackInvitationRequest();
  result.window.EVRewardsAnalytics.trackInvitationRequest();
  assert.equal(result.requests.length, 2);
  const event = new URL(result.requests[1]);
  assert.deepEqual([...event.searchParams.keys()].sort(), ['e', 'p', 'q', 'r', 'rnd', 't']);
  assert.equal(event.searchParams.get('p'), 'invitation-request-completed:facebook-page-intro');
  assert.equal(event.searchParams.get('t'), 'Invitation request submission completed');
  assert.equal(event.searchParams.get('e'), 'true');
  assert.equal(event.searchParams.has('s'), false);
  assert.equal(event.searchParams.has('b'), false);
  assert.doesNotMatch(result.requests[1], /visitor|example\.com|email|consent|calculator/i);
});

test('loopback and private hosts never emit analytics requests', async () => {
  for (const hostname of [
    'localhost', 'localhost.', '127.0.0.1', '10.1.2.3', '172.16.0.1', '192.168.1.10', '0.0.0.0',
    '[::1]', '::1', '[::]', 'fc00::1', 'fd12::1', 'fe80::1', 'febf::1',
    '[::ffff:127.0.0.1]', '::ffff:127.0.0.1', '[::ffff:7f00:1]', '::ffff:7f00:1',
    '[::ffff:c0a8:10a]', '::ffff:a01:203', '::ffff:ac10:1'
  ]) {
    const result = await runAnalytics('?src=facebook-page-intro', '', { hostname, protocol: 'http:' });
    assert.equal(result.requests.length, 0, hostname);
  }
});

test('a URL-normalization failure disables analytics instead of leaking the original query', async () => {
  const result = await runAnalytics('?src=facebook-page-intro&email=visitor@example.com', undefined, { historyFails: true });
  assert.equal(result.requests.length, 0);
  assert.equal(result.window.goatcounter, undefined);
  assert.equal(result.window.EVRewardsAnalytics, undefined);
  assert.equal(result.location.search, '?src=facebook-page-intro&email=visitor@example.com');
});

test('only exact allow-listed query shapes become campaign attribution', async () => {
  const { window: known } = await runAnalytics('?src=facebook-page-intro');
  assert.equal(known.EVRewardsAnalytics.source, 'facebook-page-intro');
  assert.equal(known.goatcounter.path, '/guide/?campaign=facebook-page-intro&src=evrewards');

  for (const tag of [
    'opportunity-finder-calculator',
    'opportunity-finder-fit-guide',
    'opportunity-finder-comparison',
    'opportunity-finder-invitation',
    'organic-paid-to-charge',
    'organic-about'
  ]) {
    const { window } = await runAnalytics(`?src=${tag}`);
    assert.equal(window.EVRewardsAnalytics.source, tag);
  }

  const { window: reloaded } = await runAnalytics('?campaign=facebook-page-intro&src=evrewards');
  assert.equal(reloaded.EVRewardsAnalytics.source, 'facebook-page-intro');
  assert.equal(reloaded.goatcounter.path, '/guide/?campaign=facebook-page-intro&src=evrewards');

  for (const query of [
    '?campaign=attacker-label&src=evrewards',
    '?src=attacker-supplied-label',
    '?src=facebook-page-intro&email=visitor@example.com',
    '?src=facebook-page-intro&campaign=facebook-page-intro',
    '?src=facebook-page-intro&src=facebook-page-intro',
    '?campaign=facebook-page-intro&src=evrewards&extra=value'
  ]) {
    const { window, location } = await runAnalytics(query);
    assert.equal(window.EVRewardsAnalytics.source, 'direct', query);
    assert.equal(window.goatcounter.path, '/guide/', query);
    assert.equal(location.search, '', query);
  }
});

test('the browser query is normalized before GoatCounter can read its q parameter', async () => {
  const known = await runAnalytics('?src=facebook-page-intro');
  assert.equal(known.location.search, '?campaign=facebook-page-intro&src=evrewards');
  assert.equal(known.location.hash, '#request');

  const contaminated = await runAnalytics('?src=facebook-page-intro&email=visitor@example.com');
  assert.equal(contaminated.location.search, '');
  assert.equal(contaminated.location.hash, '#request');

  const unknown = await runAnalytics('?src=attacker-supplied-label&email=visitor@example.com');
  assert.equal(unknown.location.search, '');
  assert.equal(unknown.location.hash, '#request');
});

test('referrer attribution keeps only an http(s) origin', async () => {
  const safe = await runAnalytics('', 'https://social.example/post/42?email=visitor@example.com#comments');
  assert.equal(safe.window.goatcounter.referrer, 'https://social.example');

  const unsafe = await runAnalytics('', 'javascript:alert(1)');
  assert.equal(unsafe.window.goatcounter.referrer, '');
});

test('the landing page emits the event only after a validated submit and iframe response load', async () => {
  const script = await read('script.js');
  assert.match(
    script,
    /form\?\.addEventListener\('submit',[\s\S]*?if \(form\.elements\.website\?\.value\)[\s\S]*?return;[\s\S]*?Date\.now\(\) - loadedAt < 2000[\s\S]*?return;[\s\S]*?if \(!form\.checkValidity\(\)\)[\s\S]*?return;[\s\S]*?submitting = true;/
  );
  assert.match(
    script,
    /frame\?\.addEventListener\('load', \(\) => \{[\s\S]*?if \(!submitting\) return;[\s\S]*?window\.EVRewardsAnalytics\?\.trackInvitationRequest\?\.\(\);[\s\S]*?\}\);/
  );
  const beforeResponseHandler = script.split("frame?.addEventListener('load'")[0];
  assert.doesNotMatch(beforeResponseHandler, /trackInvitationRequest/);
});

test('form and calculator attribution consume only the shared allow-listed source', async () => {
  const [landing, calculator] = await Promise.all([read('script.js'), read('calculator.js')]);
  assert.match(landing, /const campaign = window\.EVRewardsAnalytics\?\.source \|\| 'direct';/);
  assert.doesNotMatch(landing, /params\.get\('(?:src|utm_source)'\)/);
  assert.match(calculator, /const attributedSource = window\.EVRewardsAnalytics\?\.source;/);
  assert.match(calculator, /attributedSource && attributedSource !== 'direct'/);
  assert.doesNotMatch(calculator, /params\.get\('src'\)/);
});

test('privacy notice accurately discloses the minimized analytics configuration', async () => {
  const privacy = await read('privacy.html');
  assert.match(privacy, /GoatCounter/);
  assert.match(privacy, /aggregate page visits/i);
  assert.match(privacy, /referring sites \(origin only\)/i);
  assert.match(privacy, /your email address, consent response or calculator inputs/i);
  assert.match(privacy, /does not transmit screen dimensions, device fields/i);
  assert.match(privacy, /Requests omit credentials and do not execute third-party analytics JavaScript/i);
  assert.match(privacy, /does not retain individual pageviews/i);
  assert.match(privacy, /does not use cookies, localStorage or persistent visitor identifiers to track visitors/i);
  assert.match(privacy, /up to eight hours/i);
  assert.match(privacy, /automatically deleted after 365 days/i);
  assert.match(privacy, /https:\/\/www\.goatcounter\.com\/help\/privacy/);
});

test('the expected private GoatCounter settings are versioned without credentials', async () => {
  const config = JSON.parse(await read('analytics-config.json'));
  assert.deepEqual(config, {
    provider: 'GoatCounter',
    site_code: 'evrewardscanada',
    verified_at: '2026-08-16',
    link_domain: 'www.evrewards.ca',
    dashboard: 'private',
    allow_counter: false,
    allow_embed_origins: [],
    retention_days: 365,
    collect_enabled_codes: [128, 2],
    collect: {
      individual_pageviews: false,
      sessions: true,
      referrer: true,
      user_agent: false,
      size: false,
      country: false,
      region: false,
      language: false
    }
  });
  assert.doesNotMatch(JSON.stringify(config), /password|token|secret|credential/i);
});

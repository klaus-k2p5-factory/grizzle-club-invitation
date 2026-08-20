(() => {
  const endpoint = 'https://evrewardscanada.goatcounter.com/count';
  const allowedSources = new Set([
    'aveq-admin-review',
    'driveelectricnl-admin-review',
    'equinoxev-admin-review',
    'evaa-editor-review',
    'evco-editor-review',
    'evsociety-editor-review',
    'facebook',
    'facebook-equinox-maritimes-level2',
    'facebook-nb-dawn-modely-level2',
    'facebook-new-ev-buyers',
    'facebook-page-calculator-reel',
    'facebook-page-comparison',
    'facebook-page-cost-calculator',
    'facebook-page-cta',
    'facebook-page-intro',
    'facebook-page-launch',
    'facebook-tesla-barrie-simcoe',
    'facebook-vehicle-owner',
    'forum-mache-canada',
    'forum-moderator-review',
    'forum-rfd-ev',
    'forum-rivian-canada',
    'forum-tmc-canada',
    'manitobaev-ev-links',
    'manitobaev-links-review',
    'ndem-waterloo-event-resource',
    'ndem-waterloo-organizer-review',
    'organic-club-fit',
    'organic-comparison',
    'organic-cost-calculator',
    'organic-free-charger',
    'opportunity-finder-calculator',
    'opportunity-finder-comparison',
    'opportunity-finder-fit-guide',
    'opportunity-finder-invitation',
    'plugndrive-resource',
    'plugndrive-resource-review',
    'reddit-barrie',
    'reddit-canadianev',
    'reddit-teslacanada'
  ]);

  const params = new URLSearchParams(location.search);
  const entries = [...params.entries()];
  let candidateSource = '';

  if (entries.length === 1 && entries[0][0] === 'src') {
    candidateSource = entries[0][1];
  } else if (
    entries.length === 2 &&
    params.getAll('src').length === 1 &&
    params.getAll('campaign').length === 1 &&
    params.get('src') === 'evrewards'
  ) {
    candidateSource = params.get('campaign') || '';
  }

  const source = allowedSources.has(candidateSource) ? candidateSource : 'direct';
  const campaignQuery = source === 'direct'
    ? ''
    : `?campaign=${encodeURIComponent(source)}&src=evrewards`;

  try {
    history.replaceState(null, '', `${location.pathname}${campaignQuery}${location.hash}`);
  } catch {
    return;
  }

  let referrer = '';
  try {
    const candidate = new URL(document.referrer);
    if (candidate.protocol === 'http:' || candidate.protocol === 'https:') {
      referrer = candidate.origin;
    }
  } catch {
    referrer = '';
  }

  const path = `${location.pathname}${campaignQuery}`;
  const previous = window.goatcounter || {};
  const normalizedHost = location.hostname.replace(/^\[|\]$/g, '').toLowerCase().replace(/\.+$/, '');
  const localHost = location.protocol === 'file:' ||
    /(localhost$|^127\.|^10\.|^192\.168\.|^0\.0\.0\.0$|^172\.(?:1[6-9]|2\d|3[01])\.)/.test(normalizedHost) ||
    normalizedHost === '::' ||
    normalizedHost === '::1' ||
    normalizedHost.startsWith('::ffff:') ||
    /^(?:fc|fd|fe[89ab])/.test(normalizedHost);

  const count = (variables = {}) => {
    if (localHost) return false;

    const query = new URLSearchParams();
    query.set('p', variables.path ?? path);
    query.set('q', location.search);
    query.set('r', variables.referrer ?? referrer);
    query.set('t', variables.title ?? document.title);
    if (variables.event) query.set('e', 'true');
    query.set('rnd', Math.random().toString(36).slice(2, 7));

    try {
      fetch(`${endpoint}?${query}`, {
        method: 'GET',
        mode: 'no-cors',
        credentials: 'omit',
        keepalive: true,
        referrerPolicy: 'origin'
      }).catch(() => {});
      return true;
    } catch {
      return false;
    }
  };

  let invitationTracked = false;
  const trackInvitationRequest = () => {
    if (invitationTracked) return;
    invitationTracked = true;
    count({
      path: `invitation-request-completed:${source}`,
      title: 'Invitation request submission completed',
      event: true
    });
  };

  window.goatcounter = { ...previous, path, referrer, count };
  window.EVRewardsAnalytics = { source, trackInvitationRequest };

  if (!previous.no_onload) {
    if (document.visibilityState === 'prerender') {
      const countWhenVisible = () => {
        if (document.visibilityState !== 'visible') return;
        document.removeEventListener('visibilitychange', countWhenVisible);
        count();
      };
      document.addEventListener('visibilitychange', countWhenVisible);
    } else {
      count();
    }
  }
})();

# EV Rewards Canada referral website

Transparent, static landing page for an independent Grizzl-E Club member referral campaign.

- Canonical site: <https://www.evrewards.ca/>
- Legacy GitHub Pages URL: <https://klaus-k2p5-factory.github.io/grizzle-club-invitation/> (retained; redirects to canonical HTTPS with paths and query strings preserved)
- Complete Hermes project handoff: [`.hermes.md`](.hermes.md)

## Form backend

Google Forms responder ID: `1FAIpQLScjHfMXqzjCqSEOenYSD5lNSnLQ9gwlrP4i1H_WJ5vR4VBIMg`

The form collects only the email address, explicit unchecked referral/privacy consent, submission time and referral-source label. A local Hermes scheduler checks every 15 minutes and sends the page operator an email plus VoIP.ms SMS for each new valid lead. Monitor-process failures are routed to SMS rather than Discord.

## Privacy-minimized analytics

The five public pages use GoatCounter for aggregate visits, referring-site origins, allow-listed campaign attribution and one completed-submission-flow event per page load. A small audited local client sends directly to the configured GoatCounter count endpoint; no third-party analytics JavaScript is executed. Requests omit credentials, use an origin-only HTTP referrer policy and contain only the tested path, safe query, origin-only referrer, title, event flag when applicable and a per-request cache nonce. They do not include screen or device fields. The dashboard is private. Individual pageview retention and browser/OS, screen-size, country, region and language reporting are disabled; aggregate data is deleted after 365 days. No email, consent value, arbitrary query value, external-referrer path or calculator input is sent to analytics.

Existing `?src=` links remain the campaign convention. Only exact query shapes and values in `analytics.js` are accepted. Before any request is sent, the browser query is replaced with a safe campaign pair or removed; referrers are reduced to `http(s)` origins. Unknown, duplicate or mixed values become `direct`. `analytics-config.json` records the expected non-secret remote settings and verification date. Run the serializer, integration and privacy tests with `node --test tests/analytics.test.mjs`.

## Local preview

```bash
python3 -m http.server 8080
```

Rebuild the social preview card with `python assets/generate-og-card.py`. The generator is verified with Pillow `12.3.0` and Debian/Ubuntu package `fonts-noto-core` (Noto Sans files under `/usr/share/fonts/truetype/noto/`). Install equivalent versions before rebuilding so text metrics and JPEG output remain reproducible.

Transparent outreach copy, unique source links and moderator/admin request templates are in [`campaign/launch-kit.md`](campaign/launch-kit.md).

The site also includes a private, client-side Canadian first-year EV charger cost calculator at [`ev-charger-cost-calculator-canada/`](ev-charger-cost-calculator-canada/). Calculator inputs stay in the browser and are not sent to GoatCounter. Run its calculation and page tests with `node --test tests/calculator.test.mjs tests/calculator-page.test.mjs`. Rebuild its social preview card with `python assets/generate-calculator-og.py`.

The dated, terms-based Canadian Club fit check is at [`is-grizzl-e-club-worth-it-canada/`](is-grizzl-e-club-worth-it-canada/). It separates current base cash tiers from the August 2026 promotional bonus announcement. Run its content and discovery tests with `node --test tests/club-fit-page.test.mjs`. Rebuild its social preview card with `python assets/generate-club-fit-og.py`.

## Deployment

GitHub Pages deploys from the `main` branch root. The repository `CNAME`
declares `www.evrewards.ca` as the canonical host. Porkbun DNS has an apex
`ALIAS` and `www` `CNAME` pointing to GitHub Pages. The Pages custom domain,
valid apex/`www` TLS certificate, HTTPS enforcement, apex redirect and legacy
project-URL redirect were verified live on 2026-08-15.
The `google49a0907ec3fef867.html` ownership file must remain published for
Google Search Console verification.

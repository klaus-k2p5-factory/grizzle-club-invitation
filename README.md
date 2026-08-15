# EV Rewards Canada referral website

Transparent, static landing page for an independent Grizzl-E Club member referral campaign.

- Intended canonical site: <https://www.evrewards.ca/>
- Legacy GitHub Pages URL: <https://klaus-k2p5-factory.github.io/grizzle-club-invitation/> (retain it; verify its redirect only after GitHub attaches the custom domain)
- Complete Hermes project handoff: [`.hermes.md`](.hermes.md)

## Form backend

Google Forms responder ID: `1FAIpQLScjHfMXqzjCqSEOenYSD5lNSnLQ9gwlrP4i1H_WJ5vR4VBIMg`

The form collects only the email address, explicit unchecked referral/privacy consent, submission time and referral-source label. A local Hermes scheduler checks every 15 minutes and sends the page operator an email plus VoIP.ms SMS for each new valid lead. Monitor-process failures are routed to SMS rather than Discord.

## Local preview

```bash
python3 -m http.server 8080
```

Rebuild the social preview card with `python assets/generate-og-card.py`. The generator is verified with Pillow `12.3.0` and Debian/Ubuntu package `fonts-noto-core` (Noto Sans files under `/usr/share/fonts/truetype/noto/`). Install equivalent versions before rebuilding so text metrics and JPEG output remain reproducible.

Transparent outreach copy, unique source links and moderator/admin request templates are in [`campaign/launch-kit.md`](campaign/launch-kit.md).

The site also includes a private, client-side Canadian first-year EV charger cost calculator at [`ev-charger-cost-calculator-canada/`](ev-charger-cost-calculator-canada/). Run its calculation and page tests with `node --test tests/calculator.test.mjs tests/calculator-page.test.mjs`. Rebuild its social preview card with `python assets/generate-calculator-og.py`.

The dated, terms-based Canadian Club fit check is at [`is-grizzl-e-club-worth-it-canada/`](is-grizzl-e-club-worth-it-canada/). It separates current base cash tiers from the August 2026 promotional bonus announcement. Run its content and discovery tests with `node --test tests/club-fit-page.test.mjs`. Rebuild its social preview card with `python assets/generate-club-fit-og.py`.

## Deployment

GitHub Pages deploys from the `main` branch root. The repository `CNAME`
declares `www.evrewards.ca` as the intended canonical host. Porkbun DNS has an
apex `ALIAS` and `www` `CNAME` pointing to GitHub Pages. Do not claim that the
custom domain, redirects or HTTPS are live until the Pages API and real HTTP/TLS
checks verify them after deployment.
The `google49a0907ec3fef867.html` ownership file must remain published for
Google Search Console verification.

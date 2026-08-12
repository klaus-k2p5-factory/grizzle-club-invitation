# EV Home Rewards referral landing page

Transparent, static landing page for an independent Grizzl-E Club member referral campaign.

- Live site: <https://klaus-k2p5-factory.github.io/grizzle-club-invitation/>
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

The site also includes a private, client-side Canadian first-year EV charger cost calculator at [`ev-charger-cost-calculator-canada/`](ev-charger-cost-calculator-canada/). Run its calculation and page tests with `node --test tests/calculator.test.mjs tests/calculator-page.test.mjs`.

## Deployment

GitHub Pages deploys from the `main` branch root with HTTPS enforced.
The `google49a0907ec3fef867.html` ownership file must remain published for
Google Search Console verification.

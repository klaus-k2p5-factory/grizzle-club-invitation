# EV Home Rewards referral landing page

Transparent, static landing page for an independent Grizzl-E Club member referral campaign.

- Live site: <https://klaus-k2p5-factory.github.io/grizzle-club-invitation/>
- Complete Hermes project handoff: [`.hermes.md`](.hermes.md)

## Form backend

Google Forms responder ID: `1FAIpQLScjHfMXqzjCqSEOenYSD5lNSnLQ9gwlrP4i1H_WJ5vR4VBIMg`

The form collects only the email address, explicit unchecked referral/privacy consent, submission time and referral-source label. A local Hermes scheduler checks once daily at 9:00 AM Eastern and sends the page operator an email plus VoIP.ms SMS for each new valid lead. Monitor-process failures are routed to SMS rather than Discord.

## Local preview

```bash
python3 -m http.server 8080
```

## Deployment

GitHub Pages deploys from the `main` branch root with HTTPS enforced.

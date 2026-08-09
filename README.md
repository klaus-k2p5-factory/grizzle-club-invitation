# EV Home Rewards referral landing page

Transparent, static landing page for an independent Grizzl-E Club member referral campaign.

## Form backend

Google Forms responder ID: `1FAIpQLScjHfMXqzjCqSEOenYSD5lNSnLQ9gwlrP4i1H_WJ5vR4VBIMg`

Submissions require an explicit, unchecked referral/privacy consent. A local Hermes scheduler polls the Google Forms API for new responses and sends the page operator an email and VoIP.ms SMS alert.

## Local preview

```bash
python3 -m http.server 8080
```

## Deployment

GitHub Pages deploys from the `main` branch root.

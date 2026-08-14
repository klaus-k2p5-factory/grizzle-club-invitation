# First-referral launch kit

Public landing page:

`https://klaus-k2p5-factory.github.io/grizzle-club-invitation/`

Use a unique `src` value for every approved placement. The form stores it as a source label; it does not collect browsing analytics.

## Channel decision

- **Do not use Facebook Marketplace or commerce/buy-and-sell groups.** The page records an invitation request; no item is being sold through the listing. Meta Commerce Policies prohibit commerce content with no item for sale.
- **Use an authentic Facebook profile to administer an accurately named Page.** Never create a fake person, duplicate profile, burner account, or page that implies it is official Grizzl-E/United Chargers.
- **Ask group and forum moderators first.** Post only after approval or where current written rules clearly permit disclosed member-referral links.
- **No cold DMs, scraped contacts, mass cross-posting, fake engagement, or link-rule evasion.**
- Put the referral disclosure in the post itself, not only on the landing page.

## Owned Club fit-check route — 2026-08-14

The site now includes a dated, crawlable decision guide at:

<https://klaus-k2p5-factory.github.io/grizzle-club-invitation/is-grizzl-e-club-worth-it-canada/>

It targets late-stage Canadian searches such as `grizzl-e club worth it`, `grizzl-e club requirements`, `grizzl-e club review canada` and the new up-to-15¢ headline without claiming a hands-on review. The page covers six practical fit/exit questions, links first-party sources, discloses Peter's potential CAD $0.01-per-eligible-referred-kWh benefit before the first conversion link, and uses `?src=organic-club-fit` for the invitation path.

The August 12, 2026 official announcement is separated from current base cash tiers: the extra 5¢ starts October 1, 2026 as Thanksgiving Bonus Points for eligible members who own their Grizzl-E charger; only the Ultimate level can produce an up-to-15¢ total; and the announcement says those bonus points convert to cash October 1, 2027. Do not compress that into “members now earn 15¢.”

Release commit `a326641` was deployed by successful GitHub Pages run `31770040679`. Public verification confirmed the live title/content, canonical source-tagged CTA, matching 1200×630 social card bytes, sitemap and homepage cross-link. The CTA lands on `?src=organic-club-fit#request`, stores `website:organic-club-fit`, and leaves consent unchecked. An independent review then required the top pre-conversion disclosure to state the voluntary request, approval, qualifying activation and continued-eligibility conditions, and required larger mobile disclosure text. Both findings were fixed with regression coverage. Content/regression tests now pass 23/23; rendered QA at 1440px, 390px and 320px found no horizontal overflow, duplicate IDs, console/runtime errors or failed requests, and the revised 13px mobile disclosure was visually confirmed readable and unclipped. The new guide and homepage were submitted once to IndexNow; `200` confirms receipt, not indexing or ranking.

Do not publish a duplicate owned-Page calculator post or Reel to announce this page. A personal-profile share could provide more reach, but it publicly connects Peter's identity to the referral relationship and requires explicit user approval.

## Owned organic-search route — 2026-08-11

The site now includes a crawlable, terms-based guide at:

<https://klaus-k2p5-factory.github.io/grizzle-club-invitation/grizzle-club-vs-chargelab-rewards-canada/>

It compares Grizzl-E Club and ChargeLab Rewards using the June 10, 2026 official Club terms and ChargeLab's July 1, 2026 Canada terms. It distinguishes supplied hardware from owner-supplied OCPP hardware, identifies ownership, connection, payout, active-use, carbon-credit and exit conditions, links to first-party sources, and repeats the member-benefit disclosure above both the editorial content and Grizzl-E call to action. The internal invitation CTA uses `?src=organic-comparison`; do not reuse that source for social posts or third-party placements.

The homepage cross-links the guide and `sitemap.xml` includes it with `lastmod` 2026-08-11. The public IndexNow key file is `2b9d2abe20f093f01c769beb45e4db8f.txt`. The first official API POST for the homepage and canonical guide URL returned `202 Accepted` on 2026-08-11, which confirms receipt but not indexing. Re-submit only after a material public-content change.

Google Search Console URL Inspection reported the comparison guide as “URL is not on Google” on 2026-08-11. A single request then returned “Indexing requested” and added the guide to Google’s priority crawl queue. That is a crawl request, not proof of crawling, indexing, impressions or ranking; do not repeatedly request indexing.

## Saturation check — 2026-08-09

The core general-Canadian EV communities already discuss this program heavily:

- r/EVCanada has several Grizzl-E Club threads with roughly 50–200+ comments each, including posts from the last one to four months.
- Ontario Electric Vehicle Owners & Enthusiasts had a Grizzl-E pros/cons thread within the last four weeks.
- Electric Vehicle Society Barrie/Orillia posted about joining Grizzl-E Club on 2026-08-09.
- Waterloo Region EVA, Saskatchewan, Nova Scotia and multiple Canadian model-owner groups also have recent discussions.
- An exact Google search for `site:teslamotorsclub.com "Grizzl-E Club"` returned no exact-match result. Tesla Motors Club appears comparatively underserved, subject to its current forum rules and moderator permission.

Verified targets used for this check:

- Official referral announcement: <https://grizzl-e.com/news/322/>
- r/EVCanada high-engagement thread: <https://www.reddit.com/r/EVCanada/comments/1sjzve7/grizzle_club_with_free_charger_and_no_annual_fee/>
- Ontario EV Owners recent thread: <https://www.facebook.com/groups/ontarioev/posts/1644892499933306/>
- EV Society Barrie/Orillia group: <https://www.facebook.com/groups/185265772098475/>

Treat public search snippets as discovery evidence, not permission to post. Do not cold-post to the already-saturated groups above. Prefer approved posts aimed at new EV buyers/home-charger shoppers or underserved vehicle-owner communities.

A restored-extractor follow-up on 2026-08-11 directly opened additional exact-looking Facebook candidates but rejected them rather than forcing placements: Cadillac Lyriq Owners Group was about 25 weeks old; Ford Mach-E Owners Canada was about 15 weeks old and already had 23 replies; EVAAC was about seven weeks old and contained multiple negative/competitor responses; and EVAA's July 24 thread already had 34 comments, an existing Grizzl-E referral offer and an update that the buyer had ordered a charger. None qualified for a new reply.

## Tesla Motors Club permission gate — 2026-08-10

TMC remains comparatively underserved, but its live rules explicitly classify affiliate links, referral links and links posted for financial benefit as advertising. Its advertising policy prohibits linking to an affiliated external site in public forums without prior approval and directs promotion requests to TMC management.

- Forum rules: <https://teslamotorsclub.com/tmc/threads/forum-rules.23996/>
- Advertising policy: <https://teslamotorsclub.com/tmc/threads/advertising-policy.23301/>
- A management permission request was emailed to `SupportTMC@teslamotorsclub.com` on 2026-08-10. It disclosed the referral compensation, supplied a moderator-preview link and promised one post only, with no cold messages, bumps, cross-posting or Marketplace use.
- No TMC account or campaign post exists. Do not register or post unless management gives explicit written approval and any stated conditions are satisfied.
- The exact Gmail thread is monitored every six hours for seven days by the silent script-only job `TMC referral permission reply monitor`.

Live Facebook rule checks on 2026-08-09 also excluded these placements:

- Ontario Electric Vehicle Owners & Enthusiasts: rule 2 explicitly prohibits vehicle and charging referral codes/links.
- Waterloo Region Electric Vehicle Association: rule 3 prohibits promotions and self-promotional links.
- Canadian Electric Vehicle (EV) Owners: rule 5 prohibits self-promotion, business advertising and spam links.
- EV Charging Canada — Reward Programs: rule 3 explicitly prohibits referral solicitation, links, codes and referral-seeking private messages.
- EVAAC: advertising is limited to approved sponsors/partners and the group requires an Atlantic Canada connection.

The exact-audience private group `Canadian Home EV Charging Reward Programs` had 656 members and a pending membership request. Its member-only rules must be reviewed before any post. Electric Vehicle Society Barrie/Orillia was joined, but its admin-permission request is still pending; do not post there until approval arrives.

The authentic profile joined the new 11-member public group `Tesla Barrie & Simcoe county` on 2026-08-10. It is hyperlocal and comparatively underserved, but its About page displayed no promotion/referral rule. A link-free permission request was sent to admin Hristo Momchilov with the compensation and material-condition disclosures. Use `?src=facebook-tesla-barrie-simcoe` only after explicit approval; no post exists while permission is pending.

`New Brunswick EV Owners` (group `745634935629157`) is a 4.7K-member public group whose live rule 3 states: “Any commercial posts should be relevant, reasonable, and limited to 2 per week.” Peter Mucha's authentic personal profile is a member.

On 2026-08-11 Dawn Marie posted a current exact-intent question about selecting a Model Y home Level 2 charger and comparing charging-credit programs: <https://www.facebook.com/groups/745634935629157/posts/3204075363118423/>. Facebook automatically declined the first conditions-first, fully disclosed Peter Mucha reply before it became public. Admin Tracy Miersch later replied by email that Peter was not blocked and could request to join again with more detail; that was membership guidance, not exact-placement approval. After confirming Peter's personal membership, one fully disclosed calculator reply using `?src=facebook-nb-dawn-modely-level2` appeared only in the client and disappeared after a hard reload. It is not a placement and must not be counted or retried. Do not remove disclosures, omit the link, or evade the gate. An accidental Page-identity membership was removed immediately; only Peter's personal membership remains. Require explicit written permission for the exact disclosed reply before any future attempt.

## Forums AVÉQ permission gate — 2026-08-10

Forums AVÉQ is an active Quebec electromobility forum with a dedicated EVSE/accessory section. Its rules prohibit spam and state that commercial signature links require prior approval; limited EV-related sale messages are tolerated, but that does not clearly authorize a referral resource. The official administrator contact form at <https://forums.aveq.ca/memberlist.php?mode=contactadmin> accepted a French request for permission to publish one conditions-first, fully disclosed Grizzl-E Club resource. The review link uses `?src=aveq-admin-review`. Do not register or post unless the administrator explicitly allows the referral link and identifies an acceptable section/formulation.

## Electric Vehicle Society editorial gate — 2026-08-10

Electric Vehicle Society has an active national `Owner Experience` category, including new owner stories published in July 2026. Its official contact form acknowledged an editorial pitch for “What Canadians should verify before joining a managed home-charging rewards program.” The proposed article would cover deposits, ownership/return, installation, connectivity, active-use, privacy and reward changes, with full member-compensation disclosure. The editor-review URL uses `?src=evsociety-editor-review`. Do not submit an article or referral resource-box link unless EV Society gives written approval and conditions. The source pages are <https://evsociety.ca/category/owner-experience/> and <https://evsociety.ca/contact/>.

## Chevy Equinox EV Group permission gate — 2026-08-11

The restored web-search extractor found a current exact-intent question from a Canadian in the Maritimes asking which Level 2 charger to choose and whether charging-credit programs make sense: <https://www.facebook.com/groups/equinoxev/posts/4164776303812362>. The authentic profile joined the 26.6K-member public `Chevy Equinox EV Group`.

The Facebook About page displays no promotion/referral rule. The group is administered by the `Chevy Equinox EV Forum` Page, and the current linked EquinoxEVForum.com Terms state that users may not publish affiliate marketing, referral-code content or unsolicited commercial advertising and may not advertise or solicit without express written approval. Because those terms create an explicit permission gate, no reply was posted.

The official VerticalScope contact form at <https://www.equinoxevforum.com/help/contact/> accepted a written request for permission to make one conditions-first, fully disclosed reply to that exact Facebook post. The review URL uses `?src=equinoxev-admin-review`. If approval arrives, re-check the live group rules, follow every stated condition, reply once with `?src=facebook-equinox-maritimes-level2`, verify the canonical reply URL and do not cross-post or cold-message anyone.

## ManitobaEV EV Links directory gate — 2026-08-11

ManitobaEV's current <https://manitobaev.ca/ev-links> page explicitly invites readers to email suggested EV resources. Its charging section lists route planners, adapters, PlugShare, ChargeHub and Sun Country Highway but no comparable Canadian home-charging reward-program conditions checklist. ManitobaEV's homepage also names EasyEV as its preferred charger installer, so a disclosed referral resource requires an explicit conflict/permission check.

A verified email was sent to `info@manitobaev.ca` proposing a no-fee listing titled “Grizzl-E Club Canada — independent eligibility and conditions checklist,” with a neutral description, the review URL `?src=manitobaev-links-review`, full compensation disclosure, and an explicit request to decline rather than hide the disclosure or require sponsorship. The general link invitation is not approval for a financially beneficial referral. Await written acceptance; if approved, use `?src=manitobaev-ev-links` for the public directory URL and verify the resulting link and description.

## EVAA editorial gate — 2026-08-11

The Electric Vehicle Association of Alberta published its Summer 2026 newsletter on July 1, while its public <https://albertaev.ca/ev-reviews> index has no entry newer than June 2022. Its official <https://albertaev.ca/contact-us> page lists `info@albertaev.ca`.

A verified no-fee pitch proposed a balanced 500–700-word article, “What Canadian EV owners should verify before choosing a managed home-charging rewards program.” The email disclosed Peter's Ontario—not Alberta—location, the member-compensation relationship, the proposed `?src=evaa-editor-review` resource-box URL, and asked EVAA to decline if it requires Alberta-resident owner stories. Do not submit the article or include a referral link until EVAA explicitly approves both. If only the article is accepted, treat it as awareness rather than acquisition.

## Plug'n Drive educational-resource gate — 2026-08-11

Plug'n Drive's current <https://www.plugndrive.ca/evs-are-for-everyone> tour describes sales-free, neutral and evidence-based EV education, including home charging, through national roadshows and Mobile EV Education Trailers. Its <https://www.plugndrive.ca/ev-owners-club> page also maintains a national EV Owners Club and regional-club directory. The official contact route is <https://www.plugndrive.ca/contact>.

A verified email asked whether the independent conditions checklist could be reviewed as a no-fee, clearly labelled resource-page or EV Owners Club item, or optional background material for ambassadors. It used `?src=plugndrive-resource-review`, disclosed Peter's potential CA$0.01-per-eligible-kWh benefit and Ontario location, and explicitly did not request event distribution or endorsement without approval. Await written acceptance and exact-copy approval; if accepted, use `?src=plugndrive-resource` for the public URL.

## National Drive Electric Month Waterloo gate — 2026-08-11

The official event page for National Drive Electric Month Waterloo 2026 invites EV owners, non-profits, utilities and companies to contact the WREVA organizer. The event is scheduled for October 3, 2026 at The Boardwalk in Waterloo. This event route is distinct from WREVA's public Facebook group, where promotions remain prohibited.

The event-specific contact form confirmed delivery of one request asking whether the organizer would approve the comparison guide as a no-fee, clearly labelled attendee-resource link or QR. The request used `?src=ndem-waterloo-organizer-review`, disclosed Peter's possible CA$0.01-per-eligible-referred-kWh benefit, and explicitly rejected sponsorship, exhibitor status, attendee data, registrant access and implied WREVA/NDEM endorsement. Await explicit written permission and placement/disclaimer instructions. If approved, use the separate public source `?src=ndem-waterloo-event-resource`; do not contact event registrants or treat the form receipt as approval.

## Facebook Marketplace is not eligible

Do not create a Marketplace listing for this campaign. Meta says Marketplace commerce content is for attempts to buy, sell or trade products, and its prohibited-content list includes **“No Item for Sale.”** A member-referral landing page is not a specific item owned and sold by the poster.

- Official Meta policy: <https://www.facebook.com/policies_center/commerce>
- Verified: 2026-08-09

Closest compliant alternatives: an operator-profile/Page post, an administrator-approved Group post, or a clearly disclosed paid ad with an approved budget.

## Standard disclosure

> Disclosure: I am a Grizzl-E Club member sharing my referral page. If an approved referred charger qualifies, I may earn CAD $0.01 per eligible kWh under current terms. United Chargers decides membership and charger eligibility. Deposit, shipping, installation/electrical work, Wi-Fi/data, active-use, ownership and return conditions apply.

## Facebook Group admin request

> Hi — may I share one educational post about the current Grizzl-E Club home-charging program for Canadian EV drivers? I am a Club member and would clearly disclose that it is my referral page and that I may earn CAD $0.01 per eligible referred kWh. The page shows the deposit, shipping, installation/electrical-work, Wi-Fi/data, active-use, ownership and return conditions before the form. It collects only an email plus explicit consent for one official invitation. I will not DM members or repeatedly repost. I can send the exact proposed wording first if helpful.

## Approved Facebook Group post

> Canadian EV drivers comparing home-charging options may want to review the current Grizzl-E Club program. Approved members can access a connected Level 2 charger at $0 hardware purchase price and earn cash rewards on eligible recorded charging.
>
> It is not cost-free: approval, a refundable deposit, shipping, installation/electrical work, reliable Wi-Fi/data, active primary use, and charger ownership/return conditions apply. I made a plain-language page that puts those conditions before the invitation form:
>
> **[TRACKED LINK]**
>
> Disclosure: this is my independent member referral page. If an approved referred charger qualifies, I may earn CAD $0.01 per eligible kWh under current terms. United Chargers decides membership and charger eligibility. Approved members’ standard Club charging rewards are determined under current terms.

Suggested Facebook source URLs:

- Approved new-EV-buyer group: `https://klaus-k2p5-factory.github.io/grizzle-club-invitation/?src=facebook-new-ev-buyers`
- Approved vehicle-owner group: `https://klaus-k2p5-factory.github.io/grizzle-club-invitation/?src=facebook-vehicle-owner`
- Other approved group: replace the suffix with `facebook-` plus a short group slug.

## Facebook Page launch post

Live Page: <https://www.facebook.com/profile.php?id=61593364640663>

Verified introductory post: <https://www.facebook.com/permalink.php?story_fbid=122093293149445488&id=1158289830711289>

The Page action button uses `?src=facebook-page-cta`; the introductory post uses `?src=facebook-page-intro`.

### Conditions-first comparison post — 2026-08-11

The Page published a second public post explaining that Canadians should compare total program commitments—not only headline cents per kWh. Its checklist covers compatible hardware/OCPP, deposit and shipping, installation and panel costs, ownership, connectivity and active-use rules, cancellation/return conditions, and reward-payment terms. It uses `?src=facebook-page-comparison` and includes the independent-page and CA$0.01-per-eligible-kWh member-benefit disclosures.

Verified permalink: <https://www.facebook.com/permalink.php?story_fbid=122094167769445488&id=1158289830711289>

### Simplified calculator post — 2026-08-12

The Page published one source-tagged post for the simplified first-year EV charger cost calculator. It gives the explained starter example—15,000 km/year, 80% home charging, $700 charger and $1,500 installation—while making the technical inputs optional and labelling price amounts as planning examples rather than quotes or national averages. The post includes the full member-benefit and independent-resource disclosures.

The scheduled one-shot job failed before taking browser action because the agent call reached an HTTP 429 usage limit. The Page was checked for an existing calculator post before the post was published manually through the authenticated Page identity. The canonical post was hard-reloaded, the full copy was verified, and Facebook's rendered payload was checked for the complete `?src=facebook-page-cost-calculator` URL. It is also pinned in the Page's Featured section.

Verified permalink: <https://www.facebook.com/permalink.php?story_fbid=122094866847445488&id=1158289830711289>

Do not rerun the completed one-shot job or publish a duplicate calculator post.

### Calculator Reel — 2026-08-12

The owned Page published one silent 15-second vertical Reel explaining the calculator's rounded starter inputs and year-one result. The source asset is reproducible with `assets/generate-facebook-calculator-reel.py`; production output was verified as H.264, 1080×1920, 30 fps and exactly 15 seconds. The Reel frames include the independent-member and CA$0.01-per-eligible-kWh disclosure, while the complete caption gives the calculator assumptions, ballpark limitation, privacy statement, referral compensation, approval and material Club conditions.

The publication used `?src=facebook-page-calculator-reel`. A hard reload of the canonical Reel, caption expansion and a real outbound click confirmed the full caption, public availability and source-tag preservation through the calculator to the invitation CTA. It was not cross-posted to Groups, shared with collaborators or a story, or boosted.

Verified Reel: <https://www.facebook.com/reel/1623553812534787>

Do not publish a duplicate Reel.

### EVCO companion-calculator permission request — 2026-08-12

EVCO's live `Get paid to charge your EV at home` article is a current Canadian comparison of home-charging reward programs and already explains Grizzl-E's referral economics. Its official contact form accepted one request to review the independent first-year-cost calculator as a no-fee, clearly labelled companion link.

The request used `?src=evco-editor-review`; disclosed Peter's current Club membership and potential CA$0.01-per-eligible-kWh benefit; summarized the approval, deposit, shipping, installation, Wi-Fi/data, active-use and ownership/return conditions; and asked EVCO to decline if membership, sponsorship or a fee is required. The form confirmation proved delivery only.

Raymond Leury later declined the placement because EVCO wishes to remain neutral and avoid suggesting that one program is superior. Treat that as a final decline for this route. No reply to Raymond was sent, no placement exists, and no follow-up should be made.

### Drive Electric NL permission gate — draft only, 2026-08-14

Drive Electric NL's official site invites missing-resource suggestions and publishes `info@driveelectricnl.ca`. Its public Electric NL group has a current exact-intent question, “Is level 2 charger worth it for phev?” at <https://www.facebook.com/groups/electricNL/posts/4042152116082221>. No accessible current group rule affirmatively authorizes a financially beneficial external link, so no group reply, DM, account action or outreach is permitted without staff approval.

The following email is prepared but **has not been sent**. Sending it requires explicit user approval. If approved, send it once from the verified operator account, then treat silence or an acknowledgement as no permission.

Subject: `Permission request: one disclosed calculator reply in Electric NL`

> Hello Drive Electric NL team,
>
> I noticed the public Electric NL group question, “Is level 2 charger worth it for phev?” May I make exactly one conditions-first reply to that question using the wording and link below, or wording you approve?
>
> **Proposed reply:** “One way to check whether Level 2 is worth installing for a PHEV is to start with annual kilometres, home-charging share and a real electrician quote. I made a private, client-side Canadian ballpark calculator: https://klaus-k2p5-factory.github.io/grizzle-club-invitation/ev-charger-cost-calculator-canada/?src=driveelectricnl-admin-review. The inputs stay in the browser. Disclosure: I am a Grizzl-E Club member. If someone voluntarily requests an invitation through the site, is approved, activates a qualifying charger and remains eligible, I may receive CAD $0.01 per eligible referred kWh under current terms. This is not Grizzl-E, United Chargers or government content. Approval, refundable deposit, shipping, installation/electrical work, Wi-Fi/data, active use, and ownership/return conditions apply; United Chargers decides eligibility.”
>
> I am asking before posting because the resource has a disclosed referral relationship. I will not DM members, repost, collect member data or imply Drive Electric NL endorses it. If it is not appropriate, please decline and I will not post. Please approve or revise the exact placement, wording, disclosure and URL in writing.
>
> Thank you,
> Peter Mucha
> hermancore1980@gmail.com

Do not substitute the `admin-review` source into a public reply after approval. Create a separate placement-specific source only after staff approves the exact scope, and verify the canonical public reply if it is posted.

> **A Grizzl-E Club charger at $0 hardware purchase price — for eligible Canadian EV drivers**
>
> Approved Club members can access a connected Level 2 charger and earn cash rewards on eligible recorded home charging. Before requesting an invitation, review the real obligations: refundable deposit, shipping, installation/electrical work, reliable Wi-Fi/data, active primary use, and charger ownership/return conditions.
>
> Read the plain-language guide and request one official invitation:
> https://klaus-k2p5-factory.github.io/grizzle-club-invitation/?src=facebook-page-launch
>
> Independent member referral. I may earn CAD $0.01 per eligible referred kWh. United Chargers decides eligibility; current terms control.

## Underserved-forum moderator request

Subject: `May I share a transparent Canadian Grizzl-E Club referral resource?`

> Hi,
>
> I’m a Canadian EV owner and Grizzl-E Club member. I found very little exact-match discussion of the Club in this forum. Would it be appropriate to share one clearly disclosed educational resource in the relevant Canadian/home-charging section, or is referral content not allowed?
>
> The page puts the material conditions before the invitation form: approval, refundable deposit, shipping, installation/electrical work, Wi-Fi/data, active use, charger ownership and return conditions. It collects only an email and explicit consent for one official invitation.
>
> I would disclose in the post that this is my independent member-referral page and that I may earn CAD $0.01 per eligible referred kWh. I will not cold-message members, repost repeatedly or imply official endorsement.
>
> Moderator preview: https://klaus-k2p5-factory.github.io/grizzle-club-invitation/?src=forum-moderator-review
>
> Thanks,
> Herman
> hermancore1980@gmail.com

## Reddit modmail request

> Hi mods — may I make one useful, clearly disclosed post about the current Grizzl-E Club home-charging program for Canadian EV drivers? I am a Club member and may earn CAD $0.01 per eligible referred kWh. The linked page shows approval, deposit, shipping, installation/electrical-work, Wi-Fi/data, active-use, ownership and return conditions before asking for an email and explicit consent. I will not DM users, repost repeatedly, or present it as an official Grizzl-E/government resource. I can provide the exact draft first. If referral links are not allowed, I will not post it.

Suggested Reddit source URLs after moderator approval:

- `https://klaus-k2p5-factory.github.io/grizzle-club-invitation/?src=reddit-canadianev`
- `https://klaus-k2p5-factory.github.io/grizzle-club-invitation/?src=reddit-teslacanada`
- `https://klaus-k2p5-factory.github.io/grizzle-club-invitation/?src=reddit-barrie`

## Forum moderator request

> Hello — would one transparent, non-repeated member-referral thread about the current Grizzl-E Club home-charging program be allowed here? The page is educational first and shows the costs and ongoing obligations before the invitation form. I would disclose that I may earn CAD $0.01 per eligible referred kWh. I will not place the link in unrelated discussions, cold-message members, or imply official endorsement. I can send the exact draft for approval.

Suggested forum source URLs after moderator approval:

- Tesla Motors Club Canada: `?src=forum-tmc-canada`
- RedFlagDeals EV: `?src=forum-rfd-ev`
- Mach-E Forum Canada: `?src=forum-mache-canada`
- Rivian Forums Canada: `?src=forum-rivian-canada`

## Short answer to “Is it really free?”

> The supplied charger has a $0 hardware purchase price for approved members, but the overall setup is not cost-free. A refundable deposit, shipping, installation/electrical work, Wi-Fi/data and ongoing-use conditions apply, and the charger remains United Chargers property during an active supplied-charger membership. Current terms control.

## Short answer to “What do you get?”

> I may earn CAD $0.01 per eligible kWh from a qualifying referred charger under current terms. That is why the referral relationship is disclosed in the post, at the top of the page and beside the consent checkbox. Approved members’ standard Club charging rewards are determined under current terms.

## First launch sequence

1. Deploy and verify the new social preview card and Open Graph metadata.
2. The authentic Facebook Page and introductory post are live. Monitor the exact-audience private-group membership request and the EV Society Barrie/Orillia admin-permission request; do not use Marketplace.
3. Do not cold-post or duplicate the existing EV Society Barrie/Orillia, Ontario EV or r/EVCanada discussions. An explicit group-admin approval may override the EV Society hold for one disclosed post.
4. The Tesla Motors Club management request was sent on 2026-08-10. Await explicit written approval; do not create an account or post while it is pending.
5. Use other Reddit/forum communities only when a live, relevant question exists and current rules permit disclosed self-promotion.
6. Publish only where approval is received, using a unique `src` link.
7. Reply to genuine questions helpfully; do not bump or repost on a fixed schedule unless rules allow it.

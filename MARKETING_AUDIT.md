# Freenachos.poker — Marketing Layout & Conversion Audit

**Date:** 2026-07-04
**Scope:** Homepage (`app/page.jsx`), navbar, newsletter popup, `/coaching`, `/newsletter`, `/tools`, sitemap/robots/metadata, and funnel plumbing.
**Goal:** Identify everything in the marketing layout that suppresses conversion, and what to change.

---

## 1. Executive Summary

The site looks premium — cinematic dark/gold aesthetic, strong personal brand, genuinely good raw proof material (7 detailed testimonials with graphs, a verified 6.2bb/100 win-rate graph, $5M+ student profits). The **design quality is not the problem**. Conversion is being lost in four places:

1. **Broken funnel plumbing** — social sharing image missing, homepage links prospects into an internal CMS admin screen, navbar labels point at the wrong routes, the sticky CTA competes with the main funnel.
2. **Inconsistent claims** — three different "hands" numbers, two different profit numbers, and four different CTA labels across the funnel. Inconsistency reads as sloppiness on a page asking for €2,500–€6,000.
3. **No path for the "not yet" visitor** — a €2.5k+ coaching decision takes multiple visits. The homepage's only mid-funnel capture is a popup; there's no inline lead capture, no lead magnet, no closing CTA section, and the page *ends by diverting visitors away* to tools/articles.
4. **Layout friction** — enormous dead scroll zones (roughly 2,000px+ of intentional empty space), the best social proof hidden behind a 1-of-7 manual carousel, a broken testimonial result line, and performance drags (a mousemove handler re-rendering the whole page, ~20 animated blur layers, hotlinked third-party images).

Fixing the Critical + High items below is mostly copy edits, link fixes, and one new section — no redesign required — and should meaningfully lift both call bookings and email capture.

---

## 2. Current Funnel Map

```
                        ┌────────────────────────────────────────┐
Traffic → Homepage ──►  │ Primary: Calendly intro call (5 CTAs)  │
                        │ Competing: Discord DM (sticky button)  │
                        │ Capture: Newsletter popup @40% scroll  │
                        │ Exit ramps: /articles(!), /tools, YT   │
                        └────────────────────────────────────────┘
/coaching  → "Learn More" → freenachos.poker homepage (circular!)
           → "Apply Now"  → nachospoker.com (external, untracked)
/tools     → 2 of 5 tools listed, zero CTAs back into the funnel (dead end)
/newsletter→ solid page, converts to email
```

**Key structural insight:** every euro of revenue passes through one Calendly link, yet the layout splits attention between Calendly, Discord DMs, YouTube, an external CFP site, and an admin interface.

---

## 3. Critical Issues (fix first — these are broken, not suboptimal)

### 3.1 `og-image.png` does not exist
`layout.tsx`, `/coaching`, and `/tools` metadata all reference `/og-image.png` (1200×630). The file is not in `/public`. **Every share of the site on Twitter/X, Discord, WhatsApp, LinkedIn, Telegram shows a broken/blank preview.** For a coach whose funnel runs on poker Discords and Twitter, this is silently killing top-of-funnel clicks. Create the image (coach photo + "$5M+ in student profits" + logo) and ship it.

### 3.2 Homepage sends prospects into your CMS admin
The "Safety Net" section's **"The Strategy Vault — Explore Articles"** card links to `/articles`, which is the internal Supabase-backed article editor with a login modal. A warm prospect clicking your softest CTA hits an admin login screen. Also: the navbar's "Articles" label links to `/newsletters` (works, but mislabeled).
**Fix:** point both at `/newsletters` and rename to "Articles / Strategy" consistently — or build a public articles index. Separately, move the CMS off a public marketing URL (e.g. `/admin/articles`) — it's also a security-surface issue.

### 3.3 Sticky CTA fights the funnel
After the hero scrolls away, the only persistent CTA is a purple **"DM on Discord"** button (`discord.com/users/…`). Problems: it's a different action, a different color language, requires Discord login, personal-profile DM links frequently dead-end for users who don't share a server with you, and it appears with a shake animation. Your funnel's money action is the intro call.
**Fix:** make the sticky button **"Book Free Intro Call"** (gold, Calendly). If Discord matters, make it a small secondary icon next to it. This is likely the single highest-leverage layout change on the page.

### 3.4 Testimonial result line is broken (renders empty)
The main testimonial card renders `testimonials[currentTestimonialIndex].result` under each name — but no testimonial object has a `result` field, so the line is always blank. This is exactly where the highest-converting copy should live.
**Fix:** add a `result` field per testimonial, e.g.:
- Andrea → `"Breakeven NL50 → beating NL200 in 13 months"`
- Keven → `"NL100 → crushing NL1000"`
- Peter → `"Back from a downswing to 2KNL"`
These quantified one-liners are worth more than the quotes themselves.

### 3.5 Proof assets are hotlinked from third parties
- Hero coach photo + all 8 testimonial graphs: `i.gyazo.com` (free screenshot host — links can expire, hotlinking can be blocked, slow, no cache control).
- The **primary results graph** (your core credibility asset): `static.runitonce.com` — if RIO reorganizes their CDN, your proof of win rate vanishes silently.
**Fix:** download everything into `/public/proof/` and serve locally. Also removes third-party tracking exposure and speeds up LCP.

### 3.6 `/coaching` page has a circular CTA
"Private Coaching → Learn More" links to `https://freenachos.poker` (the homepage). Anyone landing on `/coaching` directly (it's priority 0.9 in your sitemap — search traffic lands here) gets bounced to the homepage top instead of a booking action.
**Fix:** link it to the Calendly intro call (or `/#pricing`). Also add UTM tracking to the external `nachospoker.com` CFP link.

---

## 4. Message Consistency (trust erosion)

A data-driven coach whose numbers don't reconcile undermines his own positioning. Current state:

| Claim | Hero | Stats row | Site metadata | /coaching |
|---|---|---|---|---|
| Student profits | $5M+ | $5M+ (CFP Profits) | **$5.5M+** | $5.5M+ |
| Hands | — | **10M+** | **200M+** | **200M+** |
| Students | "200+ Winning Regs" | "200+ Students" | — | — |

The 10M vs 200M gap is the worst — a skeptical reg will notice. If 10M is *your* hands and 200M is the *population database*, label them that way ("10M+ hands played · 200M+ hands of pool data"). Pick one profit number ($5.5M+ if true — never round your proof down) and use it everywhere.

**CTA label consistency:** "Apply for Mentorship" (hero) / "Book Free Introcall" (pricing, about) / "Book Free Intro Call" (fit section) / "DM on Discord" (sticky) — all pointing at the same Calendly event. "Apply" implies an application form and creates a mismatch when Calendly opens. **Standardize on one label** ("Book a Free Intro Call") and add friction-reducing microcopy under the primary instances: *"15 minutes · no hard sell · find out if you're a fit."*

**Currency:** proof is in $, prices in €. Not fatal, but at minimum keep the pricing section internally consistent and consider "€2,499 (≈$2,7xx)" if much of the audience thinks in dollars.

---

## 5. Section-by-Section Homepage Analysis

### 5.1 Hero
**Works:** trust badge above headline, "Stop guessing. Start executing." subhead, single gold CTA, strong visual identity, coach photo humanizes.
**To improve:**
- **Headline is process-led, not outcome-led.** "Master High-Stakes Theory & Exploit the Population" describes the *work*, not the *result*. Your audience's dream outcome is winning more / moving up. Test something like *"Turn Your Study Time Into a Win Rate"* or *"The Data-Driven System Behind $5.5M in Student Profits."* Keep "exploit the population" as supporting copy — it's good insider language, just not the strongest first line.
- **No secondary CTA.** 95%+ of first-time visitors won't book a call from the hero. Add a ghost secondary: "See how I coach →" (scroll to videos) or "Get free exploits →" (newsletter). One escape valve that keeps them in *your* funnel.
- **No qualifier.** Add one line stating who this is for ("For NL50–NL1000 regs serious about moving up") — improves call quality and self-selection.
- **Mobile:** the coach image is hidden below 968px, making the mobile hero text-only. Add a small circular portrait next to the badge on mobile — faces measurably lift trust. Also the fixed `padding: 0 48px` is heavy on a 375px screen; drop to 20–24px.
- The forced `<br/>` line breaks in the H1 can produce awkward wrapping at intermediate widths — let the text wrap naturally with `text-wrap: balance`.

### 5.2 Coach / Authority section
**Works:** "The Coach Behind $5M+ in Student Profits" is your best headline on the page. The story arc (struggled → found the system → teaches the system) is textbook and well written. Clickable graph + stats row is strong.
**To improve:**
- "Verified results · 1KNL+" — verified *by whom*? Unverifiable verification claims can backfire with a skeptical audience. Either link the source (RIO course page, tracking site) or reword to "Tracked: 6.2bb/100 over 10M+ hands at 1KNL+".
- Stats labels at 10px are near-illegible; bump to 11–12px.
- This section sits inside `padding: 256px 0` and after a 300px spacer — the visitor scrolls ~1.5 empty viewports between the hero promise and the proof. Cut the spacer + padding by half. Momentum matters: **proof should arrive within one scroll of the promise.**

### 5.3 "What You Get" benefits
**Works:** 6 concrete, differentiated deliverables; "The 'Nacho' Stat Validator" and "Strategy Vault" create proprietary-asset feel.
**To improve:**
- Description text at `rgba(240,240,240,0.5)` fails comfortable-reading contrast on dark background. Raise to ~0.7. People don't buy what they squint at.
- Ghost cards only materialize on hover — on touch devices there is no hover, so mobile users see floating unstructured text. Give cards a faint permanent border on mobile.
- **No CTA at the end of the section.** You've just listed everything they get — that's a peak-desire moment followed by 256px of nothing. Add a mid-page CTA here.

### 5.4 Testimonials
**Works:** the raw material is exceptional — named students, long specific quotes, graph screenshots, a before/after pair, stakes progressions (NL50→NL200, NL100→NL1000, back-to-2K stories).
**To improve — this is your most under-leveraged section:**
- Only **1 of 7** testimonials is visible; the rest require manual clicks (no autoplay). Realistically most visitors read one. Show 2–3 simultaneously in a grid, or a slow auto-advancing carousel with pause-on-hover, or a masonry "wall of proof."
- Fix the empty `result` line (see 3.4) — the stakes-progression one-liners are the section's strongest asset and they're currently invisible.
- Letter-initial avatars look like placeholders. Real photos if you have permission; otherwise stake badges ("NL1000") in the avatar spot.
- Pull the single best quantified line ("from breakeven at NL50 to beating NL200 in 13 months") out as a large pull-quote directly above or inside the **pricing** section, where the objection "will this work for me?" actually gets decided.

### 5.5 YouTube "Cinema" section
**Works:** "My Thought Process in Action" is the right framing — it pre-sells the coaching experience. Subtext "If this approach makes sense to you, you're in the right place" is excellent self-qualification copy.
**To improve:**
- Default thumbnails are washed through `sepia(0.4) brightness(0.6)` — YouTube thumbnails are engineered to attract clicks and you're dimming them to near-monochrome unless hovered. Test full color; the aesthetic cost is small, the click lift is real.
- The 40vh "dead space cinema transition" above this section is pure scroll tax. Cut or halve it.
- Every video is an **off-site exit right before the pricing section**. Consider a lightbox/embedded player so viewers stay on the page, or move this section below pricing.

### 5.6 Pricing
**Works:** clean 3-tier layout, correct featured-tier emphasis, "Choose Your Commitment" framing, low-commitment CTA (free call) on every card, savings labels.
**To improve:**
- **No risk reversal anywhere.** At €2.5k–€6k, this is the biggest missing conversion lever on the page. Even a soft one works: *"If the first session isn't a fit, you pay nothing."* / *"We only continue past the intro call if I'm confident I can raise your win rate."*
- **No price anchoring.** €5,999 is a scary sticker. Reframe per unit: 24 sessions → *"€250/session, ~half my hourly for one-off coaching"*, or against the outcome (one month of the win-rate improvement at NL500 pays for it). Even "€999/month equivalent" softens it.
- "Save €1,000 **vs. Quarterly**" — no plan is named "Quarterly"; the small plan is "3-Month Kickstart." Say "vs. 3-month plan" or rename.
- **No scarcity, and yours is real.** 1-on-1 capacity is genuinely limited. "3 mentorship spots open this quarter" is honest and effective. (Only if true — this audience smells fake scarcity.)
- FAQ answer discloses PayPal +7% / crypto rails — fine to keep in FAQ, but consider adding a card/Stripe option; crypto-first payments read as risky to some demographics.

### 5.7 Good fit / Not a fit
**Works:** honest qualification builds trust and improves call quality; CTA present. Minor: heading sizes differ (22px vs 24px) between the two columns — align them.

### 5.8 FAQ
Only 5 questions, and they're mostly logistics. Missing the actual objections that block a booking:
- "What results can I realistically expect?" (answer with testimonial data)
- "What stakes/bankroll do I need before this makes sense?"
- "How is this different from a CFP / a course / solver subscriptions?"
- "What if we're in different timezones?"
- "What's your refund policy?" (forcing function to actually define one)
Also add **FAQPage structured data** (JSON-LD) — free SERP real estate.

### 5.9 "Safety Net" + page ending
The concept (soft path for the not-ready) is right, but the execution ends the page by **pushing visitors off the conversion path with zero capture**: two cards out (one broken, see 3.2), then a bare copyright line.
**Fix, in order of importance:**
1. Add a **final CTA section** after the FAQ: headline ("Ready to stop guessing?"), one-line recap of proof, "Book a Free Intro Call" button. Every long-form sales page needs a closing ask; yours currently trails off.
2. Add an **inline newsletter form** in/next to the Safety Net ("Not ready for a program? Get the Nachos Exploits newsletter — population exploits every two weeks."). Right now the popup is your only homepage email capture, and anyone who dismissed it once is gone forever (localStorage).
3. Then the tools/articles cards, as the third option.

### 5.10 Footer
A copyright line only. Missing: nav links, contact email, YouTube/Discord/Twitter links, and **privacy policy + terms** — you're collecting emails (Beehiiv/Supabase) from an EU-based business, so a privacy policy isn't optional under GDPR. A real footer is also a trust signal and internal-linking win. Add: brand blurb, quick links, socials, legal, contact.

### 5.11 Newsletter popup
Well-built (40% scroll trigger, 2s delay, localStorage suppression, source tracking, personal headshot). Improvements:
- **Trigger timing conflicts with the money funnel:** 40% scroll lands roughly at testimonials/pricing — interrupting a €2.5k consideration to ask for a free email. Move to 70%+, or trigger on exit-intent, and suppress it entirely for any session where a Calendly CTA was clicked.
- **Generic offer.** "Get strategy breakdowns…" is wallpaper copy. A concrete lead magnet converts several times better: *"Get the 5 data exploits I use to crush NL200 (free PDF)"* — you already have the matching YouTube video content.

---

## 6. Layout & Rhythm (the scroll-tax problem)

Intentional whitespace: 300px hero spacer + 256px×2 (coach) + 256px×2 (benefits) + 250px margins between most sections + 40vh cinema gap + 200–250px more before FAQ/safety net. Total ≈ **2,000–2,500px of empty space** — 2–3 full viewports of nothing, worse on mobile (spacers only shrink to 160px). "Museum pacing" is a legitimate aesthetic, but every extra empty viewport sheds a percentage of scrollers before pricing.

**Recommendation:** cut all spacers/paddings ~50% (128px sections, kill the 40vh gap, 150px margins) and re-check feel. Also consider section order — currently pricing sits ~7–8 viewports deep. A stronger order for a cold visitor:

> Hero → Proof (coach+graph) → Testimonials (desire) → What You Get → Pricing → Fit → FAQ → Videos → Final CTA → Safety net/footer

…moving social proof before the feature list and pulling pricing up one slot.

---

## 7. Performance (speed = conversion)

- **Whole-page re-render on every mouse move:** `useEffect` mousemove handler calls `setMousePos` continuously; its only consumer (`CartoonNacho`) is never rendered. This re-renders a 4,300-line component tree on every pixel of mouse movement — measurable jank on hover/scroll. Delete the handler, the state, and `CartoonNacho`.
- **~20 permanently animating fixed blur layers** (bokeh nachos with `filter: blur(10–24px)` + several 600–1000px radial glows) plus `backdrop-filter` on nearly every card. Heavy GPU compositing cost, especially mobile Safari. Reduce count, use pre-blurred PNGs, and add `@media (prefers-reduced-motion)` handling.
- **Fonts via CSS `@import` inside a client-component `<style>` tag** — loads after hydration → flash of fallback text in the hero (your first impression). Use `next/font` in `layout.tsx`. Also: `.script-title` references Playfair Display which is never loaded (dead rule — remove or load it).
- **`logo.png` is 460KB** — compress to WebP (~20–30KB).
- **Dead code bloating the bundle:** `VideoCard`, `ArticleCard`, `ToolCard`, `BenefitCard`, `TestimonialGraph`, `BeforeAfterGraph`, `CartoonNacho`, the `articles` array (with broken `/articles/table-selection` links), the `tools` array (with broken `/bad-beat-jackpot` link — the real route is `/bbj`), unused carousel vars. Remove all.

---

## 8. Measurement (you currently can't see what converts)

Only Vercel Analytics pageviews exist. You cannot tell which of the 5+ Calendly CTAs produces bookings.
1. Add UTM params per placement: `https://calendly.com/freenachos/intro?utm_source=site&utm_content=hero` / `pricing_6mo` / `sticky` / `fit_section` — Calendly passes these through to the booking.
2. Fire a Vercel Analytics custom event (`track('cta_click', {placement})`) on every CTA click, newsletter submit, and outbound YouTube/CFP/Discord click.
3. After 2–4 weeks of data, prune or reposition losing CTAs.

---

## 9. Secondary Pages (funnel support)

- **/tools:** lists only Variance + BBJ, but `/winrate`, `/seat`, and `/profits` all exist and work. Add the missing 3 cards (the metadata already promises all 5 — currently a bait-and-switch). More important: **tools are a dead end** — no CTA back to coaching or newsletter. Add a banner on every tool page: *"This tool tells you what's happening. Coaching tells you how to fix it → Book a free intro call."* Tool users are your warmest organic traffic.
- **/coaching:** fix the circular "Learn More" (see 3.6). Given search lands here (priority 0.9), consider giving it the pricing table + testimonials rather than just two cards.
- **/newsletter:** in good shape; the best-executed capture surface on the site.
- **Navbar:** the solid-gold "Mentorship Program" button links to `/` (a no-op on the homepage). Point it at `/#pricing` and consider renaming the navbar CTA to the money action ("Book Intro Call"). Fix the "Articles"→`/newsletters` label mismatch. The Tools dropdown lists 2 of 5 tools.
- **Hygiene:** duplicate API route `app/api/newsletter/suscribe/` (typo twin of `subscribe`) — delete; `app/cbet/page.html` + `app/CBet EV/page.html` are not valid Next.js routes (only `page.jsx/tsx` route) — the cbet tool is effectively unpublished; decide whether to port it to a real route and add it to /tools, or remove it.
- **Structured data:** add JSON-LD for `Person` (Patrick), `Service`/`Offer` (coaching tiers), `FAQPage`, and `Review`/`AggregateRating` from testimonials.

---

## 10. Prioritized Action Plan

### Critical — broken funnel (do this week, ~half a day total)
| # | Action | Effort |
|---|---|---|
| 1 | Create and ship `/public/og-image.png` (1200×630) | 30 min |
| 2 | Sticky CTA: Discord DM → "Book Free Intro Call" (Calendly) | 15 min |
| 3 | Safety-net "Explore Articles" + navbar "Articles" → `/newsletters`; move CMS off `/articles` | 30 min |
| 4 | Fix `/coaching` "Learn More" circular link → Calendly | 5 min |
| 5 | Add `result` field to all 7 testimonials (fixes empty line, adds best proof copy) | 20 min |
| 6 | Self-host all gyazo + runitonce images in `/public/proof/` | 45 min |

### High — conversion structure (next 1–2 weeks)
| # | Action |
|---|---|
| 7 | Reconcile all numbers ($5.5M+, hands played vs pool data, students) site-wide |
| 8 | One CTA label everywhere + microcopy ("15 min · no hard sell") |
| 9 | Add final CTA section after FAQ; add inline newsletter form to Safety Net |
| 10 | Add risk reversal + real scarcity to pricing; per-session price anchoring |
| 11 | Rebuild footer (links, socials, contact, privacy/terms — GDPR requirement) |
| 12 | Expand FAQ with the 5 real objections + FAQPage JSON-LD |
| 13 | Tools page: list all 5 tools + coaching CTA banner on every tool |
| 14 | UTM params + click-event tracking on all CTAs |

### Medium — layout & persuasion polish
| # | Action |
|---|---|
| 15 | Cut whitespace ~50% (300px spacer, 256px paddings, 40vh gap, 250px margins) |
| 16 | Testimonials: show 2–3 at once or auto-advance; pull-quote near pricing |
| 17 | Test outcome-led hero headline + secondary hero CTA + audience qualifier |
| 18 | Popup: lead-magnet offer, trigger at 70%/exit-intent, suppress after CTA click |
| 19 | Full-color video thumbnails; lightbox playback instead of off-site exits |
| 20 | Benefit text contrast 0.5→0.7; mobile card borders; mobile hero portrait |

### Low — hygiene
| # | Action |
|---|---|
| 21 | Remove mousemove handler + all dead components/arrays (also fixes re-render jank) |
| 22 | `next/font` for Inter/Manrope; compress logo.png; reduce blur layers; prefers-reduced-motion |
| 23 | Delete `suscribe` API route; resolve `/cbet` page.html situation |
| 24 | Person/Service/Review structured data |

---

## 11. Suggested A/B Tests (once tracking exists)

1. **Hero headline:** current vs. outcome-led ("The Data-Driven System Behind $5.5M in Student Profits").
2. **Sticky CTA:** Calendly vs. Discord (expect Calendly to win, but measure).
3. **Popup offer:** generic newsletter vs. "5 Data Exploits PDF" lead magnet.
4. **Pricing anchor:** total price only vs. total + per-session equivalent.
5. **Section order:** testimonials before vs. after "What You Get."

---

*Compiled from full source review of `app/page.jsx` (4,320 lines), `NachosPokerNavBar.jsx`, `NewsletterPopup.jsx`, coaching/newsletter/tools pages, sitemap, robots, and site metadata.*

> SUPERSEDED by CLAUDE_CODE_BUILD_PLAN.md (2026-08) — funnel replaced; do not implement pricing/CTA tasks from this file.

# Marketing Fixes — Implementation Brief for Droid

**Repo:** this repo (freenachos.poker, Next.js App Router)
**Source:** `MARKETING_AUDIT.md` (full audit, 2026-07-04). This brief is the actionable subset — Critical + High items plus cheap hygiene wins. Work through the tasks in order; each task = one commit.

## Ground rules

- **Do not redesign anything.** Keep the existing dark/gold cinematic visual language, fonts, spacing system, and component styles. These are copy, link, and structural fixes.
- **Do not invent business facts.** Where a task needs owner sign-off (refund policy, scarcity counts, contact email), use the exact placeholder text given and add a `{/* TODO(patrick): confirm */}` comment. Never fabricate numbers, guarantees, or policies.
- **Out of scope (do NOT do):** whitespace/section reordering, popup redesign, hero headline rewrite, A/B testing infra. Those are pending owner decisions.
- Verify `npm run build` passes after every task. Before finishing, check the layout at 375px, 768px, and 1280px widths for anything you touched.
- Final deliverable: a branch `marketing-fixes` with itemized commits, plus a short summary listing every `TODO(patrick)` you left behind.

---

## Task 1 — Create `/public/og-image.png` (CRITICAL)

All metadata (root `app/layout.tsx`, `/coaching`, `/tools` layouts) references `/og-image.png` but the file doesn't exist → every social share shows a broken preview.

Generate a 1200×630 PNG programmatically (satori/sharp/node-canvas — a one-off script is fine, don't add it as a runtime dependency):
- Background `#0A0E1A`, gold accent `#A78A43`, subtle radial gold glow top-right (match the site).
- Include `public/logo.png` (top-left, small).
- Text: **"Freenachos Poker"** (large, white, Manrope-style bold), below it **"Elite 1-on-1 Poker Coaching"**, below that in gold: **"$5.5M+ in Student Profits · 200M+ Hands of Data"**.
- Commit the PNG. No metadata changes needed.

## Task 2 — Replace the sticky Discord CTA with the Calendly CTA (CRITICAL)

`app/page.jsx` ~lines 1001–1014 (`showStickyCta` block) + `.sticky-discord-btn` styles ~lines 1165–1218.

- Replace the Discord DM link with `https://calendly.com/freenachos/intro?utm_source=freenachos_site&utm_content=sticky`.
- Label: **"Book Free Intro Call"** with a small calendar or arrow icon (lucide `Calendar`/`ArrowRight` — already imported).
- Restyle to the site's gold CTA language (background `#A78A43`, text `#0a0a0a`, same border-radius/shadow pattern as `.cta-primary`). Keep the fade-in entrance animation, **remove the shake animation**.
- Rename the class to `.sticky-cta-btn` and delete the now-unused Discord SVG + shake keyframes.

## Task 3 — Fix broken/misdirected content links; move CMS off `/articles` (CRITICAL)

1. `app/page.jsx` Safety Net card "The Strategy Vault" (~line 4100): `href="/articles"` → `href="/newsletters"`. This currently sends prospects to the internal CMS login.
2. Move the CMS: `app/articles/` → `app/admin/articles/` (route becomes `/admin/articles`). Grep the whole repo for `/articles` and `'articles'` references (nav, links, redirects, API calls) and update any that pointed at the CMS. The navbar "Articles" label already links to `/newsletters` — leave that link target as is.
3. `components/NachosPokerNavBar.jsx`: the solid-gold "Mentorship Program" button links to `/` (a no-op on the homepage) → change to `/#pricing`.
4. Add `/winrate`, `/seat`, `/profits` awareness to the navbar Tools dropdown (it lists only Variance and BBJ; those three routes exist — see Task 10).

## Task 4 — Fix `/coaching` circular CTA (CRITICAL)

`app/coaching/page.jsx`: the "Private Coaching → Learn More" button links to `https://freenachos.poker` (the homepage — circular).
- Change to `https://calendly.com/freenachos/intro?utm_source=freenachos_site&utm_content=coaching_page` and relabel **"Book a Free Intro Call"**.
- On the CFP card's "Apply Now" external link, append `?utm_source=freenachos_poker&utm_medium=referral&utm_campaign=coaching_page` to the `nachospoker.com` URL.

## Task 5 — Testimonial `result` field (CRITICAL bug + best proof copy)

`app/page.jsx`: the main testimonial card renders `testimonials[currentTestimonialIndex].result` (~line 3168) but no testimonial has that field — the line is always empty.

Add `result` to the data (derived strictly from each quote — do not embellish):
- Keven Li: `'NL100 → crushing NL1000'`
- Andrea: `'Breakeven NL50 → beating NL200 in 13 months'`
- Davide: `'NL100 → dominating NL1000 in under a year'`
- Brendon: `'Breakeven NL100 → dominating NL1000'`
- Peter: `'Rebuilt from a downswing — now playing NL2000'`
- Gary Chappell and Marcelo have no concrete stakes in their quotes: leave `result` off and make the render conditional (`{t.result && <div…>}`) so no empty element renders.

## Task 6 — Self-host all third-party proof images (CRITICAL)

Grep the repo for `i.gyazo.com`, `static.runitonce.com`, and any other hotlinked images (check `app/page.jsx`, `components/NewsletterPopup.jsx`, `app/coaching/page.jsx`, `app/newsletter/page.jsx`).
- Download each into `/public/proof/` with descriptive names (`coach-hero.png`, `results-graph-1knl.jpg`, `testimonial-keven.png`, `testimonial-andrea-before.png`, …).
- Update all references to the local paths. If a download fails (dead link), keep the remote URL, note it in the summary — do not delete the element.

## Task 7 — Reconcile the numbers site-wide (HIGH)

Canonical values (grep for the old ones everywhere: `page.jsx`, `layout.tsx`, coaching/newsletter/tools layouts):
- Student profits: **$5.5M+** everywhere ("$5M+" in the hero subhead and the "The Coach Behind $5M+" H2 → $5.5M+).
- Hands: distinguish the two facts. Patrick's own volume = **"10M+ Hands Played"** (stats row label); the database = **"200M+ hands of pool data"** (metadata/copy). Never use a bare ambiguous "hands" number.
- Students: **200+** (hero badge "Trusted by 200+ Winning Regs" is fine, stats row "200+ Students" is fine — they're consistent).

## Task 8 — One CTA label everywhere (HIGH)

Standardize every Calendly CTA label to **"Book a Free Intro Call"** (hero currently says "Apply for Mentorship"; pricing says "Book Free Introcall"; fit section says "Book Free Intro Call").
- Under the **hero** CTA and the **final** CTA (Task 9) add microcopy in small muted text: `15 minutes · no hard sell · find out if you're a fit`.
- Add per-placement UTM params to every Calendly href: `?utm_source=freenachos_site&utm_content=<placement>` with placements: `hero`, `about`, `pricing_3mo`, `pricing_6mo`, `pricing_12mo`, `fit`, `sticky`, `final`, `coaching_page`. (PricingCard: pass placement via the plan object or index.)
- Add click tracking: `import { track } from '@vercel/analytics'` and fire `track('cta_click', { placement })` on every Calendly CTA, `track('newsletter_signup', { source })` on both newsletter forms, and `track('outbound', { target })` on YouTube/CFP links.

## Task 9 — Final CTA section + inline newsletter capture (HIGH)

`app/page.jsx`, after the FAQ section and before the Safety Net:
- New section (reuse existing heading/CTA styles — `reveal` class, Manrope H2 with gold accent word): H2 **"Ready to Stop Guessing?"**, one supporting line (`One free call. See exactly where your win rate is leaking.`), gold CTA "Book a Free Intro Call" (utm_content=final) with the microcopy line.

Inside the Safety Net section, add a third element (below or beside the two cards): an inline newsletter form —
- Heading: **"Not ready for a program?"** Copy: `Get the Nachos Exploits newsletter — population exploits and data-driven strategy every two weeks. Free.`
- Email input + Subscribe button posting to `/api/newsletter/subscribe` with `source: 'homepage_inline'`, mirroring the success/error handling in `components/NewsletterPopup.jsx` (extract a small shared form component if clean, otherwise duplicate — don't refactor the popup).

## Task 10 — Pricing section fixes (HIGH)

`app/page.jsx` pricing data + `PricingCard`:
1. `savings` copy: "Save €1,000 vs. Quarterly" / "Save €3,000 vs. Quarterly" → **"vs. 3-Month plan"** (no plan is named "Quarterly").
2. Add per-session anchor under the price on each card, muted small text: 3-Month **"€417 per session"**, 6-Month **"€333 per session"**, 12-Month **"€250 per session"** (price ÷ number of 1-on-1 sessions).
3. Add one factual risk-reduction line centered under the pricing grid: `The intro call is free and there's no obligation to continue.`
4. Add a commented-out scarcity slot above the grid: `{/* TODO(patrick): confirm spots per quarter, e.g. "3 mentorship spots open this quarter" — only ship if true */}`.
5. Do **not** add any refund/guarantee claim — leave `{/* TODO(patrick): decide refund/guarantee policy (see MARKETING_AUDIT.md §5.6) */}`.

## Task 11 — Real footer + legal pages (HIGH)

Replace the copyright-only footer in `app/page.jsx` with a proper footer (same visual language: dark, thin gold top border, muted text). Ideally extract to `components/Footer.jsx` so other pages can adopt it later, but only wire it into the homepage for now. Columns:
- **Brand:** logo/name + one-liner (`Data-driven poker coaching by Patrick "Freenachos" Gerritsen`).
- **Site:** Mentorship (`/#pricing`), Tools (`/tools`), Newsletter (`/newsletter`), Articles (`/newsletters`), Coaching (`/coaching`).
- **Elsewhere:** YouTube (`https://www.youtube.com/@nachospoker`), NachosPoker CFP (`https://www.nachospoker.com`).
- **Legal/contact:** Privacy Policy (`/privacy`), Terms (`/terms`), contact email as `{/* TODO(patrick): contact email */}` placeholder text "Contact" linking to `mailto:TODO`.
- Create `/privacy` and `/terms` as simple static pages (same dark styling, plain prose). Use standard boilerplate covering: what's collected (email via newsletter, analytics), processors (Beehiiv, Supabase, Vercel Analytics, Calendly), unsubscribe/erasure rights, contact. Top of each file: `{/* TODO(patrick): have this reviewed — template text, not legal advice */}`. Add both to `app/sitemap.js`.

## Task 12 — Expand the FAQ (HIGH)

`app/page.jsx` `faqItems` — add these (draft answers from facts already on the site; mark each with `// TODO(patrick): review wording`):
1. **"What results can I realistically expect?"** — reference real student outcomes (breakeven NL50 → NL200 in ~13 months; NL100 → NL1000; individual results depend on volume and study commitment — no guarantees).
2. **"What stakes do I need to be playing?"** — mid-stakes and up benefit most; committed low-stakes players welcome (mirrors existing skill-level answer, framed as stakes).
3. **"How is this different from a CFP or a course?"** — private 1-on-1 + personalized study plan vs. the NachosPoker CFP (staking + ecosystem); link `/coaching`.
4. **"What if we're in different timezones?"** — sessions are scheduled individually; `TODO(patrick): confirm coverage`.
5. **"What's your refund policy?"** — state only what's already published (unused sessions are not reimbursed; sessions must be used within the package duration) + `TODO(patrick): confirm full policy`.

Then add **FAQPage JSON-LD**: since `page.jsx` is a client component, inject it from `app/layout.tsx` or a tiny server component wrapper — a `<script type="application/ld+json">` with all FAQ items.

## Task 13 — Tools page: list all 5 tools + funnel CTA (HIGH)

`app/tools/page.jsx` lists only Variance + BBJ, but `/winrate`, `/seat`, `/profits` routes exist and work.
1. Add cards for: **Win Rate Analyzer** (`/winrate`), **Seat Selection EV** (`/seat`), **Profits Tracker** (`/profits`) — copy the descriptions from the (dead) `tools` array in `app/page.jsx`, match the existing card structure/categories.
2. Add a CTA banner at the bottom of the tools page: `These tools tell you what's happening. Coaching fixes it.` + gold button "Book a Free Intro Call" (`utm_content=tools_page`).

## Task 14 — Dead code + hygiene (LOW, cheap)

In `app/page.jsx`:
1. **Delete the mousemove handler** (`useEffect` setting `mousePos`), the `mousePos` state, `getEyeOffset`, `eyeOffset`, `nachoRef`, and the `CartoonNacho` component (never rendered). This currently re-renders the entire page component on every mouse move.
2. Delete unused components/data: `VideoCard`, `ArticleCard`, `ToolCard`, `BenefitCard`, `TestimonialGraph`, `BeforeAfterGraph`, the `articles` array, the `tools` array (contains broken links `/bad-beat-jackpot`, `/articles/*`), `maxVideoIndex`, and the `.script-title` CSS rule (Playfair Display is never loaded). Prune now-unused lucide imports.
3. Contrast: benefit description text `rgba(240,240,240,0.5)` → `0.7`; stats-row labels `10px` → `12px`.
4. Delete the typo API route directory `app/api/newsletter/suscribe/` (keep `subscribe`). Grep first to confirm nothing references the typo path.
5. `app/cbet/page.html` and `app/CBet EV/page.html` are not valid Next routes — leave them alone (owner decision pending), just note in your summary.

---

## Acceptance checklist (run before finishing)

- [ ] `npm run build` passes
- [ ] `grep -ri "i.gyazo.com\|static.runitonce.com" app components` → no hits (or documented failures)
- [ ] `grep -rn "\$5M" app` → no hits ($5.5M+ everywhere)
- [ ] `grep -rn "Introcall\|Apply for Mentorship" app components` → no hits
- [ ] Every `calendly.com` href has a `utm_content`
- [ ] `/articles` no longer serves the CMS; Safety Net card goes to `/newsletters`
- [ ] `/public/og-image.png` exists, 1200×630
- [ ] Sticky button = gold Calendly CTA
- [ ] Summary lists all `TODO(patrick)` items

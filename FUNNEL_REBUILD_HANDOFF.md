# Funnel Rebuild — Handoff (branch `funnel-rebuild`)

**Date:** 2026-08-08 · **Plan:** `CLAUDE_CODE_BUILD_PLAN.md` · **Built by:** Claude Code

The 3-tier session-priced funnel (€2,499/€3,999/€5,999 + free Calendly intro call) is
replaced by the premium application funnel: one flagship 6-month program (€7,500 founding)
→ `/apply` → fit call booked personally after review → optional €750 `/audit` (credited)
→ enrollment. Supporting: `/results` (stubs, noindex) and `/coaching` (three-path router).

Every number renders from `lib/offer.js`. Copy is verbatim from the build plan.

## What shipped (24 commits, one per plan task)

- **P0** — `lib/offer.js` single source of truth; contact email → `patrick@freenachos.poker`;
  remote image domains dropped; sticky CTA → `/apply`; stray `page.html` files → `archive/`.
- **P1** — homepage rebuilt as composition of `components/home/*`: new Hero, ProofSection
  (exact profit figure + attribution), Mechanism (Diagnose/Prioritize/Install/Verify,
  styled placeholder frames until screenshots land), single-offer section + 9-call roadmap
  table (`#program`, `#pricing` alias), new fit lists, new 7-item FAQ + regenerated JSON-LD,
  FinalCTA (keeps `#book`), ThreePaths strip, 3-card safety net. Pricing grid, capacity
  meter, inline Calendly embed and its script loader: deleted. Spacers halved.
- **P2** — `/apply`: 10 questions in plan order, honeypot + min-time spam checks,
  `?intent=audit` + UTM capture, confirmation state; `supabase/migrations/…_applications.sql`
  (RLS enabled, no anon policies); `/api/apply` inserts via service role then posts a
  Discord summary (webhook optional — insert is source of truth).
- **P3** — `/audit`: scope, terms, guarantee, CTA → `/apply?intent=audit`. Manual invoicing;
  no Stripe yet.
- **P4** — `/results`: CaseStudy component + Davide/Keven/Peter stubs. Real quotes and
  repo graphs only; stat lines render visible `[TODO(patrick)]` placeholders. **noindex,
  unlinked** until 2+ cases are complete (uncomment markers in navbar/footer/testimonials
  + sitemap when live).
- **P5** — `/coaching` = three-path router; navbar (gold CTA → `/apply`; Program / Audit /
  Tools / Articles / Which path?); footer + sitemap + root metadata updated; `/articles`
  → `/newsletters` redirect; newsletter popup suppressed on `/apply` + `/audit`; every
  public Calendly usage removed (tools/profits/seat/winrate/admin preview swapped to
  `/apply`); privacy policy now discloses application-data storage.
- **P6** — full event map verified (see below).
- **P7** — `NachosHQ/scripts/capture-marketing-screenshots.mjs` written (read-only,
  1600×1000@2x, dark). **Blocked at credentials** — see manual checklist below.
- **Extra (required fix)** — all three newsletter API routes + `lib/supabaseClient.js`
  created Supabase clients at module scope, so `next build` failed on any machine without
  env vars (pre-existing on `booking-and-copy`). Placeholder fallbacks added; runtime
  failure mode unchanged.

## QA checklist results

- [x] `npm run build` passes (verified with pipefail; earlier "green" runs piped through
  `tail` masked exit codes — real failures were the pre-existing Supabase env issue, fixed).
- [x] Old prices / per-session / "Save €" → **0 hits**.
- [x] "book a free intro call" / "introcall" → **0 hits**.
- [x] `calendly` → code: only `lib/links.js` (commented manual-use). Sanctioned text
  mentions: privacy policy names Calendly as the fit-call processor (required disclosure).
- [x] `lifetime` → 1 hit: hero's "6.2bb/100 lifetime at 1KNL+" — a proof stat from the
  plan's verbatim copy, not offer copy. No "Lifetime access"-style promises anywhere.
- [x] `patrickgerritsen90@gmail` → 0 in `app components lib` (the build-plan doc itself
  and `archive/` keep historical mentions).
- [x] gyazo / static.runitonce → 0.
- [x] Numbers trace to `lib/offer.js`. Exception, by design: hero subhead and Mechanism
  copy are plan-verbatim prose; exact-match tokens interpolate from PROOF/FIT/AUDIT, and
  the rest mirrors PROOF (flagged in comments).
- [x] Exactly ONE rendered meta-denial (FAQ #2).
- [x] `/apply` end-to-end: form renders (2 selects, 13 pills, 4 textareas, honeypot),
  client validation, API verified via live dev server — bad email → 400, missing field →
  400 named, honeypot/too-fast → fake 200 with no insert, valid payload → reaches the
  Supabase insert (500 locally, correctly: no env/table until migration runs). **Full
  row + Discord webhook test owed after migration + Vercel env — see deploy steps.**
- [x] FAQ JSON-LD generated from the same array that renders; 7/7 questions verified in DOM.
- [x] New pages have metadata; sitemap has `/apply` 0.9, `/audit` 0.8; `/results` noindex.
- [x] 375/768/1280: no horizontal overflow on `/`, `/apply`, `/audit`, `/coaching`
  (DOM-measured; roadmap table scrolls in its own container). Visual click-through owed —
  the browser pane wasn't displayed, so this pass was DOM-level, not eyeball-level.
- [x] `/#pricing`, `/#mentorship`, `/#book` all land on live sections (alias anchors).
- [x] `/articles` → `/newsletters` permanent redirect verified.

**Known pre-existing (not introduced, left alone):** dev-mode React hydration warnings
from the site-wide `<style>{...}</style>`-in-JSX pattern (fires identically on untouched
pages like `/privacy`); missing favicon.ico (404 in console).

## Deploy prerequisites (in order)

1. Run `supabase/migrations/20260808120000_applications.sql` against the production project.
2. Vercel env: `SUPABASE_SERVICE_ROLE_KEY`, `APPLY_WEBHOOK_URL` (private Discord webhook).
3. Create `patrick@freenachos.poker` forwarding.
4. Submit a dummy application on production → confirm row + Discord message + confirmation state.

## Manual screenshot checklist (P7.4 — until the script gets credentials)

Four shots → `Freenachos.Poker/public/mechanism/`, then flip `hasAsset: true` per step in
`components/home/Mechanism.jsx`:

1. Window at 1600×1000, 200% zoom (or OS 2× scaling), dark theme, no browser chrome in crop.
2. `diagnose.png` — /stat-checker: full stat table, player vs GTO vs winning-pop, red/green flags visible.
3. `prioritize.png` — /stat-checker (or /dashboard): ranked leak list with bb/100 costs. Closest real view only — no composites.
4. `install.png` — /flashcards or /trainer: a drill question on screen (`install.webm` 10–20s loop optional later).
5. `verify.png` — /ev-dashboard: same stat two periods, hands on the x-axis.
6. Anonymization pass: no real student screen names/emails anywhere; save with these exact names.

Or: create the demo account (MFA off, synthetic data), add `SCREENSHOT_EMAIL` /
`SCREENSHOT_PASSWORD` to `NachosHQ/.env.local`, run the app, then
`node scripts/capture-marketing-screenshots.mjs` (script is untracked in NachosHQ).

## Master TODO(patrick) list

1. `patrick@freenachos.poker` before deploy (Footer.jsx:81, privacy:94, terms:82).
2. Audit price €750 vs €500 (lib/offer.js:17); program price → 9500 when 3 case studies live or 2 straight unhesitating acceptances (lib/offer.js:7).
3. Discord webhook + `APPLY_WEBHOOK_URL` + `SUPABASE_SERVICE_ROLE_KEY` in Vercel (app/api/apply/route.js:7,81).
4. Screenshot account or manual capture (Mechanism.jsx:27,41,55,69) — checklist above.
5. Case-study data for Davide/Keven/Peter + approve `/results` going live (app/results/page.jsx:27–59, CaseStudy.jsx placeholders; then uncomment app/page.jsx:1094, Footer.jsx:60, NachosPokerNavBar.jsx:642, sitemap.js:17 and drop the noindex in app/results/layout.jsx).
6. Edit "The Greed Tax" in Beehiiv to the canonical proof set (200+ / $5,692,474.96) or footnote the difference; then point the FinalCTA link at its exact slug (FinalCTA.jsx:91).
7. Confirm the RIO course URL (lib/links.js:13 — currently runitonce.com root).
8. Stripe for audit checkout — decide later (app/audit/page.jsx:14).
9. Pre-existing carried TODOs: legal-review notes in privacy/terms:1, refund policy in terms:59.

## Notes

- One deviation from "one commit per task": P0.3 (numbers reconciliation) had no standalone
  diff — it's enforced inside the P1 components via PROOF.
- The uncommitted `app/winrate/page.jsx` working-tree changes predate this rebuild (owner
  WIP). My Calendly sweep for that file was committed separately (P5.4); the WIP was
  stashed around it, one import conflict resolved (`useRef` removal kept, `calendlyUrl`
  import dropped), and the WIP restored unstaged.
- `archive/` keeps the two stray `page.html` files (975KB each) out of `app/`. Not deleted.

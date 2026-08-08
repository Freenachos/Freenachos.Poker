// lib/offer.js — SINGLE SOURCE OF TRUTH for offer + proof numbers.
// If a number changes, it changes here and nowhere else.

export const OFFER = {
  name: 'The 6-Month Program',
  months: 6,
  price: 6000,                    // EUR. Owner-set 2026-08-08: 1.5x the old 6-month tier.
  priceFormatted: '€6,000',
  plan: { installments: 3, amount: 2100, formatted: '3 × €2,100' }, // total €6,300 — plans carry a premium. TODO(patrick): confirm installment amount.
  pifBonus: 'one bonus 1-on-1 session',   // pay-in-full adds, never discounts
  calls: 12,                      // one call per branch of the game tree; roadmap in ROADMAP below
  checkpointMonth: 3,             // compliance-conditioned guarantee checkpoint
};

// The continuation offer: after the six months, students can extend.
// TODO(patrick): confirm extension length + call cadence (mirrors the old
// 24-month program's "loose calls" phase).
export const EXTENSION = {
  name: 'Program Extension',
  months: 6,
  price: 3000,                    // EUR
  priceFormatted: '€3,000',
};

export const AUDIT = {
  name: 'Database Audit',
  price: 750,                     // EUR. TODO(patrick): confirm 750 vs 500 launch price.
  priceFormatted: '€750',
  creditDays: 30,                 // credited 100% toward the program within this window
  dbMinHands: 50000,
  deliveryDays: 7,                // written scorecard within 7 days, call within 10
};

export const RETAINER = {
  name: 'Recalibration Retainer',
  perMonth: 500,                  // EUR, billed quarterly, alumni only. Not sold publicly.
};

export const FIT = {
  stakesFloor: '200NL',
  stakesRange: '200NL–1KNL',
  monthlyHandsFloor: 20000,
  dbPreferredHands: 100000,
  studyHoursPerWeek: 5,
};

export const PROOF = {
  winrate: '6.2bb/100 at 1KNL+ over 700k+ hands',
  handsPlayed: '10M+ hands played',          // Patrick's own volume
  poolHands: '200M+ hands of pool data',     // the MDA database — NEVER conflate with handsPlayed
  students: '200+ students coached',
  studentProfits: '$5,692,474.96',           // exact figure, Dec 2025, CFP-team attribution
  studentProfitsAttribution: 'cumulative profit of students and players on my CFP team, as of Dec 2025',
  botsTracked: '198,000+ suspected bot accounts tracked',
  rioStatus: 'Run It Once Elite Pro',
};

// One call, one branch of the game tree, a tailored PDF after each (summary,
// action points, study suggestions). Formation names follow the Stat Checker's
// own taxonomy. Biweekly cadence; call 12 sits after a gap so the re-audit has
// a fresh sample. TODO(patrick): confirm formation order + per-call jobs.
export const ROADMAP = [
  { call: 1,  week: 1,  title: 'Audit Debrief + RFI', job: 'Walk the full database audit, set 6-month stat targets in writing, then open the game tree: raise-first-in by position.' },
  { call: 2,  week: 3,  title: 'Cold Call', job: 'Facing opens: calling ranges by position, plus tagged hands from your database.' },
  { call: 3,  week: 5,  title: 'BB Defense', job: '3-bet, call, and fold mixes against every open size, vs GTO and the winning pool.' },
  { call: 4,  week: 7,  title: '3-Bet', job: '3-bet construction by position and sizing; your frequencies vs benchmarks.' },
  { call: 5,  week: 9,  title: 'Fold vs 3-Bet + 4-Bet', job: 'Continuing vs 3-bets and the 4-bet tree. First mini stat-check: are the preflop frequencies moving?' },
  { call: 6,  week: 11, title: 'SRP: IP as PFR', job: 'Single raised pots in position as the raiser: c-bet trees against pool tendencies.' },
  { call: 7,  week: 13, title: 'SRP: OOP as PFR + Month-3 Checkpoint', job: 'Out of position as the raiser, plus the fresh-sample stat review vs written targets. The guarantee gate.' },
  { call: 8,  week: 15, title: 'SRP: IP as PFC', job: 'In position as the caller: raising and floating vs pool c-bet leaks.' },
  { call: 9,  week: 17, title: 'SRP: OOP as PFC', job: 'Defending out of position as the caller.' },
  { call: 10, week: 19, title: '3-Bet Pots: as PFR', job: 'In and out of position as the 3-bettor.' },
  { call: 11, week: 21, title: '3-Bet Pots: as PFC + 4-Bet Pots', job: 'Calling 3-bets and the 4-bet-pot trees.' },
  { call: 12, week: 25, title: 'Exit Review & Re-Audit', job: 'Full before/after re-audit walkthrough + next-12-months roadmap.' },
];

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

// The continuation offer: renewable in six-month blocks at this price
// (owner-confirmed public 2026-08-12). Each block's plan is set at the exit
// review; call cadence per renewal block still TBD.
export const EXTENSION = {
  name: 'Program Renewal',
  months: 6,
  price: 3000,                    // EUR
  priceFormatted: '€3,000',
};

export const AUDIT = {
  name: 'Database Audit',
  price: 999,                     // EUR. Owner-set 2026-08-12.
  priceFormatted: '€999',
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
  winrate: '6.2bb/100 over 700k+ hands, at stakes up to 2KNL',
  handsPlayed: '10M+ hands played',          // Patrick's own volume
  poolHands: '200M+ hands of pool data',     // the MDA database — NEVER conflate with handsPlayed
  students: '200+ students coached',
  studentProfits: '$5,692,474.96',           // exact figure, Dec 2025, CFP-team attribution
  studentProfitsAttribution: 'cumulative profit of students and players on my CFP team, as of Dec 2025',
  botsTracked: '198,000+ suspected bot accounts tracked',
  rioStatus: 'Run It Once Elite Pro',
};

// One call, one branch of the game tree, a tailored PDF after each (summary,
// action points, study suggestions). Order owner-confirmed 2026-08-12: theory
// first, four SRP formations, full SRP audit, four 3BP formations, full 3BP
// audit, exit re-audit. Opens with the full audit PDF at call 1. Biweekly
// cadence; call 12 sits after a gap so the re-audit has a fresh sample.
export const ROADMAP = [
  { call: 1,  week: 1,  title: 'Theory of Exploitation', job: 'Walk the full audit PDF, set 6-month stat targets in writing, and install the framework: how pool data becomes exploits.' },
  { call: 2,  week: 3,  title: 'SRP: IP as PFR', job: 'Single raised pots, in position as the raiser: the c-bet trees against pool tendencies.' },
  { call: 3,  week: 5,  title: 'SRP: IP as PFC', job: 'In position as the caller: raising, floating, and attacking pool c-bet leaks.' },
  { call: 4,  week: 7,  title: 'SRP: OOP as PFR', job: 'Out of position as the raiser: c-betting and navigating turns without position.' },
  { call: 5,  week: 9,  title: 'SRP: OOP as PFC', job: 'Out of position as the caller: defense and check-raise trees.' },
  { call: 6,  week: 11, title: 'Checkpoint: Full SRP Audit', job: 'Fresh-sample re-audit of every single-raised-pot formation vs the week-1 targets. The guarantee gate.' },
  { call: 7,  week: 13, title: '3BP: IP as PFR', job: '3-bet pots, in position as the 3-bettor.' },
  { call: 8,  week: 15, title: '3BP: IP as PFC', job: '3-bet pots, in position as the caller.' },
  { call: 9,  week: 17, title: '3BP: OOP as PFR', job: '3-bet pots, out of position as the 3-bettor.' },
  { call: 10, week: 19, title: '3BP: OOP as PFC', job: '3-bet pots, out of position as the caller.' },
  { call: 11, week: 21, title: 'Checkpoint: Full 3BP Audit', job: 'Fresh-sample re-audit of every 3-bet-pot formation: are the frequencies moving?' },
  { call: 12, week: 25, title: 'Exit Review & Full Re-Audit', job: 'Complete before/after re-audit across the whole tree + next-12-months roadmap.' },
];

// lib/offer.js — SINGLE SOURCE OF TRUTH for offer + proof numbers.
// If a number changes, it changes here and nowhere else.

export const OFFER = {
  name: 'The 6-Month Program',
  months: 6,
  price: 7500,                    // EUR. TODO(patrick): bump to 9500 once 3 case studies are live.
  priceFormatted: '€7,500',
  plan: { installments: 3, amount: 2600, formatted: '3 × €2,600' }, // total €7,800 — plans carry a premium
  pifBonus: 'one bonus 1-on-1 session',   // pay-in-full adds, never discounts
  calls: 9,                       // call-by-call roadmap in ROADMAP below
  checkpointMonth: 3,             // compliance-conditioned guarantee checkpoint
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
  perMonth: 500,                  // EUR, billed quarterly, alumni only. Not sold publicly yet.
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

export const ROADMAP = [
  { call: 1, week: 1,  title: 'Audit Debrief & Priority Map', job: 'Walk the full database audit, agree the top-5 leak list, set 6-month stat targets in writing.' },
  { call: 2, week: 3,  title: 'Install #1', job: 'Highest-cost leak: pool data → adjusted lines → simplified heuristics. Study queue assigned.' },
  { call: 3, week: 5,  title: 'Install #2', job: 'Second priority + review of tagged hands from Install #1 filters.' },
  { call: 4, week: 7,  title: 'Install #3', job: 'Third priority + first mini stat-check: are Install #1 frequencies moving?' },
  { call: 5, week: 9,  title: 'Install #4 + Mental Game', job: 'Fourth priority + variance framing, downswing protocol, move-up psychology.' },
  { call: 6, week: 13, title: 'Recalibration 1: Month-3 Checkpoint', job: 'Fresh-sample stat review vs written targets. The guarantee gate.' },
  { call: 7, week: 17, title: 'Recalibration 2', job: 'Usually the move-up conversation: shot-taking plan, bankroll rules, new pool benchmarks.' },
  { call: 8, week: 21, title: 'Recalibration 3', job: 'New-stake data review or consolidation.' },
  { call: 9, week: 25, title: 'Exit Review & Re-Audit', job: 'Full before/after re-audit walkthrough + next-12-months roadmap.' },
];

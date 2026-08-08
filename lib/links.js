// Central place for outbound/booking links so they only ever change here.

// Calendly booking link. Not linked anywhere on the site. Sent manually after
// application review — the funnel is /apply → review → personal booking email.
export const CALENDLY_BASE = 'https://calendly.com/patrickgerritsen90/30min';

// Appends per-placement UTM params (Calendly passes these through to the booking).
export const calendlyUrl = (placement) =>
  `${CALENDLY_BASE}?utm_source=freenachos_site&utm_content=${placement}`;

// "Dominate with Data" — the Run It Once course. The honest exit for players
// below the program's stakes floor.
// TODO(patrick): confirm the RIO course URL before deploy.
export const RIO_COURSE_URL = 'https://www.runitonce.com/';
export const COURSE = { name: 'Dominate with Data', priceFormatted: '$999' };

// Nachos CFP outbound with per-placement UTM (existing campaign pattern).
export const cfpUrl = (campaign) =>
  `https://nachospoker.com?utm_source=freenachos_poker&utm_medium=referral&utm_campaign=${campaign}`;

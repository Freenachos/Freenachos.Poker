// Central place for the booking link so it only ever needs changing here.
// If the Calendly handle or event changes, update CALENDLY_BASE and redeploy.
export const CALENDLY_BASE = 'https://calendly.com/patrickgerritsen90/30min';

// Appends per-placement UTM params (Calendly passes these through to the booking).
export const calendlyUrl = (placement) =>
  `${CALENDLY_BASE}?utm_source=freenachos_site&utm_content=${placement}`;

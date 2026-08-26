import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Placeholder fallbacks keep `next build` working without local env vars
// (this repo only carries real values in Vercel). Calls fail at request time
// if the real env is missing, which is the correct failure mode.
// TODO(patrick): add SUPABASE_SERVICE_ROLE_KEY to the Vercel env.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
);

const REQUIRED_FIELDS = [
  'site', 'stake', 'volume_bucket', 'bankroll', 'study_process',
  'goal_12mo', 'biggest_obstacle', 'investment_viable', 'cfp_interest',
  'name', 'email'
];

// Minimum plausible time (ms) between page load and submit — bots blast forms
// instantly; a human answering seven free-text questions never does.
const MIN_ELAPSED_MS = 5000;

const clip = (value, max = 4000) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

export async function POST(request) {
  try {
    const body = await request.json();

    // Spam checks: honeypot filled or superhuman submit speed → pretend
    // success so the bot learns nothing, insert nothing.
    if (clip(body.website) || (typeof body.elapsed_ms === 'number' && body.elapsed_ms < MIN_ELAPSED_MS)) {
      return NextResponse.json({ success: true });
    }

    for (const field of REQUIRED_FIELDS) {
      if (!clip(body[field])) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clip(body.email, 320))) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (!body.no_database && !clip(body.db_summary)) {
      return NextResponse.json({ error: 'Missing database summary' }, { status: 400 });
    }

    const row = {
      site: clip(body.site, 100),
      stake: clip(body.stake, 50),
      volume_bucket: clip(body.volume_bucket, 50),
      db_summary: clip(body.db_summary),
      no_database: Boolean(body.no_database),
      bankroll: clip(body.bankroll, 50),
      staked_until: clip(body.staked_until, 200) || null,
      study_process: clip(body.study_process),
      goal_12mo: clip(body.goal_12mo),
      biggest_obstacle: clip(body.biggest_obstacle),
      investment_viable: clip(body.investment_viable, 50),
      cfp_interest: clip(body.cfp_interest, 50),
      name: clip(body.name, 200),
      email: clip(body.email, 320).toLowerCase(),
      discord: clip(body.discord, 200) || null,
      intent: body.intent === 'audit' ? 'audit' : 'program',
      source_utm: body.source_utm && typeof body.source_utm === 'object' ? body.source_utm : null
    };

    const { data, error } = await supabase
      .from('applications')
      .insert([row])
      .select('id')
      .single();

    if (error) {
      console.error('Application insert failed:', error);
      return NextResponse.json({ error: 'Failed to save application' }, { status: 500 });
    }

    // Email notification via Resend — best-effort. The Supabase row is the
    // source of truth; a missing key or failed send must never fail the
    // submission. Env: RESEND_API_KEY, APPLY_NOTIFY_EMAIL (recipient), and
    // optionally APPLY_FROM_EMAIL (must be a Resend-verified sender).
    const resendKey = process.env.RESEND_API_KEY;
    const notifyTo = process.env.APPLY_NOTIFY_EMAIL;
    if (resendKey && notifyTo) {
      const esc = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const fields = [
        ['Site / stake / volume', `${row.site} · ${row.stake} · ${row.volume_bucket} hands per month`],
        ['Database', row.no_database ? 'not tracked' : row.db_summary],
        ['Bankroll', `${row.bankroll}${row.staked_until ? ` (staked until ${row.staked_until})` : ''}`],
        ['Study process', row.study_process],
        ['12-month goal', row.goal_12mo],
        ['Biggest obstacle', row.biggest_obstacle],
        ['Investment viable', row.investment_viable],
        ['CFP interest', row.cfp_interest],
        ['Email', row.email],
        ['Discord', row.discord || 'not given'],
        ['UTM', row.source_utm ? JSON.stringify(row.source_utm) : 'none']
      ];
      const html =
        `<h2 style="margin:0 0 4px">${esc(row.name)}</h2>` +
        `<p style="margin:0 0 16px;color:#666">${row.intent === 'audit' ? 'Audit request' : 'Program application'} · id ${esc(data?.id)}</p>` +
        fields.map(([label, value]) =>
          `<p style="margin:0 0 10px"><strong>${esc(label)}:</strong><br/>${esc(value)}</p>`
        ).join('');
      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: process.env.APPLY_FROM_EMAIL || 'Freenachos Applications <onboarding@resend.dev>',
            to: [notifyTo],
            reply_to: row.email,
            subject: `New ${row.intent === 'audit' ? 'audit request' : 'application'}: ${row.name} (${row.stake}, ${row.site})`,
            html
          })
        });
        if (!emailRes.ok) {
          console.error('Application email failed (row saved):', emailRes.status, await emailRes.text());
        }
      } catch (emailError) {
        console.error('Application email failed (row saved):', emailError);
      }
    } else {
      console.log('RESEND_API_KEY / APPLY_NOTIFY_EMAIL not set; application saved without email:', data?.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Application error:', error);
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 });
  }
}

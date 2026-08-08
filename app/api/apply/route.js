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

    // Discord notification — best-effort. The Supabase row is the source of
    // truth; a missing/broken webhook must never fail the submission.
    // TODO(patrick): create a private Discord channel webhook and add
    // APPLY_WEBHOOK_URL to the Vercel env.
    const webhookUrl = process.env.APPLY_WEBHOOK_URL;
    if (webhookUrl) {
      const summary = [
        `**New ${row.intent === 'audit' ? 'AUDIT request' : 'application'}** — ${row.name}`,
        `Site/stake: ${row.site} · ${row.stake} · ${row.volume_bucket} hands/mo`,
        `Database: ${row.no_database ? 'not tracked' : row.db_summary.slice(0, 300)}`,
        `Bankroll: ${row.bankroll}${row.staked_until ? ` (staked until ${row.staked_until})` : ''}`,
        `Investment viable: ${row.investment_viable} · CFP interest: ${row.cfp_interest}`,
        `Biggest obstacle: ${row.biggest_obstacle.slice(0, 300)}`,
        `Contact: ${row.email}${row.discord ? ` · ${row.discord}` : ''}`
      ].join('\n');
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: summary.slice(0, 1990) })
        });
      } catch (webhookError) {
        console.error('Application webhook failed (row saved):', webhookError);
      }
    } else {
      console.log('APPLY_WEBHOOK_URL not set — application saved without Discord notification:', data?.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Application error:', error);
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 });
  }
}

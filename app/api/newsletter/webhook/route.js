import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Placeholder fallbacks keep `next build` working without local env vars
// (this repo only carries real values in Vercel). Calls fail at request time
// if the real env is missing, which is the correct failure mode.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
);

// Webhook secret for verification (set this in Beehiiv dashboard)
const WEBHOOK_SECRET = process.env.BEEHIIV_WEBHOOK_SECRET;

/**
 * Beehiiv Webhook Handler
 * 
 * Set this URL in Beehiiv: Settings > Integrations > Webhooks
 * URL: https://freenachos.poker/api/newsletter/webhook
 * 
 * Events to subscribe to:
 * - subscription.unsubscribed
 * - subscription.complained (spam reports)
 */

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Optional: Verify webhook signature if you set a secret
    // const signature = request.headers.get('x-beehiiv-signature');
    // if (WEBHOOK_SECRET && signature !== WEBHOOK_SECRET) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    console.log('Beehiiv webhook received:', body);

    const { type, data } = body;

    // Handle unsubscribe events
    if (type === 'subscription.unsubscribed' || type === 'subscription.complained') {
      const email = data?.email?.toLowerCase().trim();
      
      if (email) {
        const { error } = await supabase
          .from('subscribers')
          .update({ 
            unsubscribed_at: new Date().toISOString() 
          })
          .eq('email', email);

        if (error) {
          console.error('Failed to update unsubscribe status:', error);
        } else {
          console.log(`Marked ${email} as unsubscribed`);
        }
      }
    }

    // Handle new subscriptions (if someone subscribes directly via Beehiiv)
    if (type === 'subscription.created') {
      const email = data?.email?.toLowerCase().trim();
      
      if (email) {
        // Check if already exists
        const { data: existing } = await supabase
          .from('subscribers')
          .select('id')
          .eq('email', email)
          .single();

        if (!existing) {
          // Add to our database
          await supabase
            .from('subscribers')
            .insert([{
              email,
              source: 'beehiiv_direct',
              confirmed: true,
              confirmed_at: new Date().toISOString()
            }]);
          
          console.log(`Added ${email} from Beehiiv`);
        }
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Also handle GET for webhook verification (some services ping GET first)
export async function GET() {
  return NextResponse.json({ status: 'Webhook endpoint active' });
}

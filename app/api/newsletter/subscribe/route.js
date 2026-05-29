import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Beehiiv API
const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

export async function POST(request) {
  try {
    const { email, source = 'popup' } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Subscribe to Beehiiv first -- this is the primary newsletter platform
    if (BEEHIIV_API_KEY && BEEHIIV_PUBLICATION_ID) {
      await subscribeToBeehiiv(normalizedEmail, source);
    }

    // Sync to Supabase for local tracking (best-effort, don't block on failure)
    try {
      const { data: existing } = await supabase
        .from('subscribers')
        .select('id, confirmed, unsubscribed_at')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (existing) {
        if (existing.unsubscribed_at) {
          await supabase
            .from('subscribers')
            .update({ 
              unsubscribed_at: null, 
              subscribed_at: new Date().toISOString(),
              source 
            })
            .eq('id', existing.id);
        }
      } else {
        await supabase
          .from('subscribers')
          .insert([{ 
            email: normalizedEmail, 
            source,
            confirmed: true,
            confirmed_at: new Date().toISOString()
          }]);
      }
    } catch (dbError) {
      console.error('Supabase sync error (non-blocking):', dbError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed!' 
    });

  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

async function subscribeToBeehiiv(email, source) {
  const response = await fetch(
    `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: source,
        utm_medium: 'website',
        utm_campaign: 'popup_signup'
      })
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Beehiiv API error:', response.status, errorData);
    const detail = errorData?.message || errorData?.error || JSON.stringify(errorData);
    throw new Error(`Beehiiv subscription failed (${response.status}): ${detail}`);
  }

  return response.json();
}

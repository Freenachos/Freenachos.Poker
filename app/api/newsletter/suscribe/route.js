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

    // Check if already subscribed in our DB
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, confirmed, unsubscribed_at')
      .eq('email', normalizedEmail)
      .single();

    if (existing) {
      // If previously unsubscribed, resubscribe them
      if (existing.unsubscribed_at) {
        await supabase
          .from('subscribers')
          .update({ 
            unsubscribed_at: null, 
            subscribed_at: new Date().toISOString(),
            source 
          })
          .eq('id', existing.id);

        // Also resubscribe in Beehiiv
        if (BEEHIIV_API_KEY && BEEHIIV_PUBLICATION_ID) {
          await subscribeToBeehiiv(normalizedEmail, source);
        }

        return NextResponse.json({ 
          success: true, 
          message: 'Welcome back! You\'ve been resubscribed.' 
        });
      }

      // Already subscribed
      return NextResponse.json({ 
        success: true, 
        message: 'You\'re already subscribed!' 
      });
    }

    // Insert new subscriber to Supabase
    const { data: subscriber, error: insertError } = await supabase
      .from('subscribers')
      .insert([{ 
        email: normalizedEmail, 
        source,
        confirmed: true, // Beehiiv handles double opt-in if you enable it
        confirmed_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      throw new Error('Failed to save subscription');
    }

    // Add to Beehiiv for email delivery
    if (BEEHIIV_API_KEY && BEEHIIV_PUBLICATION_ID) {
      try {
        await subscribeToBeehiiv(normalizedEmail, source);
      } catch (beehiivError) {
        console.error('Beehiiv sync error:', beehiivError);
        // Don't fail the whole request if Beehiiv fails
      }
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
    const errorData = await response.json();
    console.error('Beehiiv API error:', errorData);
    throw new Error('Beehiiv subscription failed');
  }

  return response.json();
}

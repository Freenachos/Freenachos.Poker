import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { articleId, articleTitle, articleSlug } = await request.json();

    if (!articleId) {
      return NextResponse.json({ error: 'Article ID required' }, { status: 400 });
    }

    // Check if newsletter was already marked for this article
    const { data: article } = await supabase
      .from('articles')
      .select('newsletter_sent_at')
      .eq('id', articleId)
      .single();

    if (article?.newsletter_sent_at) {
      return NextResponse.json({ 
        error: 'Newsletter already marked for this article',
        sent_at: article.newsletter_sent_at 
      }, { status: 400 });
    }

    // Get subscriber count
    const { count: subscriberCount } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('confirmed', true)
      .is('unsubscribed_at', null);

    // Mark article as needing newsletter send
    // Note: Beehiiv free tier doesn't support API sending
    // User sends manually via Beehiiv dashboard
    await supabase
      .from('articles')
      .update({ 
        newsletter_sent_at: new Date().toISOString() 
      })
      .eq('id', articleId);

    console.log(`Newsletter flagged for "${articleTitle}" - send manually via Beehiiv`);

    return NextResponse.json({ 
      success: true, 
      message: `Article published! Send newsletter manually in Beehiiv (${subscriberCount || 0} subscribers)`,
      count: subscriberCount || 0,
      manual: true
    });

  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process newsletter' },
      { status: 500 }
    );
  }
}

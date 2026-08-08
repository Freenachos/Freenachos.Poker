"use client";

import NachosPokerNavBar from '@/components/NachosPokerNavBar';
import Footer from '@/components/Footer';
import CaseStudy from '@/components/CaseStudy';
import { ArrowRight } from 'lucide-react';
import { track } from '@vercel/analytics';

/**
 * /results — case studies (P4). Single page with anchored cards.
 *
 * SHIP GATE: this page goes live (indexed + linked from nav/testimonials)
 * only when at least TWO cases have complete before/after stats and graphs.
 * Quotes below are the students' real testimonials already published on the
 * homepage; stat lines and installs are owner-supplied — never invented.
 */

const GOLD = '#A78A43';

const CASE_STUDIES = [
  {
    slug: 'davide',
    name: 'Davide',
    headline: 'NL100 → NL1000 in under a year',
    situation: 'Online cash reg who came in struggling at NL100 and moved up to NL1000 inside twelve months. ' +
      'Stakes, site, and sample details to be added with the audit data.',
    // TODO(patrick): before/after stat lines + install list + dedicated graph for Davide
    pendingStats: true,
    pendingInstalled: true,
    graph: '/proof/testimonial-davide.png',
    graphCaption: 'Davide’s tracked results. [TODO(patrick): replace with hands-on-x-axis export if this crop isn’t it]',
    quote: 'Thanks to NachosPoker, I went from struggling at 100nl to dominating at 1k in under a year! They helped me improve in every aspect of the game, not only strategical, but also mental and logistical. Patrick is always patient, humble, and delivers more than expected. Plus, the community is awesome!',
    varianceCaveat: 'One student’s outcome over a limited sample. Poker carries heavy variance; nothing here is a promised result.'
  },
  {
    slug: 'keven',
    name: 'Keven Li',
    headline: 'NL100 → crushing NL1000',
    situation: 'Turned pro in 2021 with a $10k bankroll and hit a breakeven stretch before the data-driven work started. ' +
      'Stakes, site, and sample details to be added with the audit data.',
    // TODO(patrick): before/after stat lines + install list + dedicated graph for Keven
    pendingStats: true,
    pendingInstalled: true,
    graph: '/proof/testimonial-keven.png',
    graphCaption: 'Keven’s tracked results. [TODO(patrick): replace with hands-on-x-axis export if this crop isn’t it]',
    quote: "In 2021, I turned pro with a $10k bankroll, struggling through a breakeven stretch until Patrick's data-driven coaching changed everything. My results skyrocketed. His guidance, combined with NachosPoker's training, took me from 100nl to crushing 1000nl. Working with Patrick was the best decision I've made in poker.",
    varianceCaveat: 'One student’s outcome over a limited sample. Poker carries heavy variance; nothing here is a promised result.'
  },
  {
    slug: 'peter',
    name: 'Peter',
    headline: 'Rebuilt from a downswing to NL2000',
    situation: 'A late-2023 downswing dropped him from 1KNL to NL200/NL500. Rebuilt from there and now plays NL2000. ' +
      'Stakes, site, and sample details to be added with the audit data.',
    // TODO(patrick): before/after stat lines + install list + dedicated graph for Peter
    pendingStats: true,
    pendingInstalled: true,
    graph: '/proof/testimonial-peter.png',
    graphCaption: 'Peter’s tracked results. [TODO(patrick): replace with hands-on-x-axis export if this crop isn’t it]',
    quote: "After a tough downswing in late 2023 dropped me from 1knl to 200/500nl, I feared my high-stakes dream was over. A friend suggested Freenachos CFP, and it may have been the best decision of my career. Their resources and Patrick's support helped me excel, and I've since skyrocketed back on track, now competing at 2K and aiming higher soon.",
    varianceCaveat: 'One student’s outcome over a limited sample. Poker carries heavy variance; nothing here is a promised result.'
  }
];

export default function ResultsPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0E1A',
      position: 'relative',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
        .glass-card {
          background: rgba(18, 18, 18, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(167, 138, 67, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .btn-hover {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease;
        }
        .btn-hover:hover:not(:disabled) { transform: translateY(-3px); }
      ` }} />

      <NachosPokerNavBar />

      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '900px',
        margin: '0 auto',
        padding: '60px 24px 120px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 style={{
            fontSize: 'clamp(34px, 4.8vw, 52px)',
            fontWeight: '800',
            color: '#FFFFFF',
            marginBottom: '20px',
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            fontFamily: 'Manrope, Inter, sans-serif'
          }}>
            Case <span style={{ color: GOLD, textShadow: '0 0 60px rgba(167, 138, 67, 0.4)' }}>Studies</span>
          </h1>
          <p style={{
            color: 'rgba(240, 240, 240, 0.6)',
            fontSize: '16.5px',
            lineHeight: 1.85,
            maxWidth: '620px',
            margin: '0 auto'
          }}>
            What the audit found, what was installed, and how the stats moved, documented student by student.
          </p>
        </div>

        {/* Cases */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {CASE_STUDIES.map((study) => (
            <CaseStudy key={study.slug} study={study} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '72px' }}>
          <a
            href="/apply"
            onClick={() => track('cta_click', { placement: 'results_page' })}
            className="btn-hover"
            style={{
              background: GOLD,
              color: '#0a0a0a',
              padding: '18px 40px',
              borderRadius: '14px',
              fontWeight: '700',
              fontSize: '16px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 4px 30px rgba(167, 138, 67, 0.4)'
            }}
          >
            Apply for the Program <ArrowRight size={18} />
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}

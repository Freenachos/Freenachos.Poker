'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

/**
 * Testimonials as a static grid (research pass, 2026-08-12): carousels hide
 * proof and get skipped; a grid shows the three strongest results at once,
 * with the rest behind one expander. Quotes and result lines are the students'
 * real published testimonials; the display order puts quantified stake moves
 * first (specificity converts skeptics).
 */

const GOLD = '#A78A43';

const TESTIMONIALS = [
  {
    id: 'keven',
    name: 'Keven Li',
    subtitle: 'Poker Made Simple',
    result: 'NL100 → crushing NL1000',
    quote: "In 2021, I turned pro with a $10k bankroll, struggling through a breakeven stretch until Patrick's data-driven coaching changed everything. My results skyrocketed. His guidance, combined with NachosPoker's training, took me from 100nl to crushing 1000nl. Working with Patrick was the best decision I've made in poker.",
    image: '/proof/testimonial-keven.png'
  },
  {
    id: 'davide',
    name: 'Davide',
    result: 'NL100 → dominating NL1000 in under a year',
    quote: "Thanks to NachosPoker, I went from struggling at 100nl to dominating at 1k in under a year! They helped me improve in every aspect of the game, not only strategical, but also mental and logistical. Patrick is always patient, humble, and delivers more than expected. Plus, the community is awesome!",
    image: '/proof/testimonial-davide.png'
  },
  {
    id: 'peter',
    name: 'Peter',
    result: 'Back from a downswing, now playing NL2000',
    quote: "After a tough downswing in late 2023 dropped me from 1knl to 200/500nl, I feared my high-stakes dream was over. A friend suggested Freenachos CFP, and it may have been the best decision of my career. Their resources and Patrick's support helped me excel, and I've since skyrocketed back on track, now competing at 2K and aiming higher soon.",
    image: '/proof/testimonial-peter.png'
  },
  {
    id: 'brendon',
    name: 'Brendon',
    result: 'Breakeven NL100 → dominating NL1000',
    quote: "The strategy will anchor you in spots where you typically feel lost. Patrick's methodology elevated my game from a breakeven 100nl reg to dominating 1000nl. The supportive community offers in-depth discussions that have been crucial to my development.",
    image: '/proof/testimonial-brendon.png'
  },
  {
    id: 'andrea',
    name: 'Andrea',
    result: 'Breakeven NL50 → beating NL200 in 13 months',
    quote: "I just finished my learning path with Patrick and I wanted to share my experience working with him. It was my first experience with a coach and I've always been very skeptical about coaching in general, but after working with him I completely changed my mind. What impressed me the most was his empathy. One day I came to a lesson during a downswing and without me saying a word about it, he sensed something and said 'How about we have a mindset talk instead?' To me, that's an innate and truly essential quality in a coach. In about 13 months I went from being breakeven at NL50 to beating NL200, almost ready for NL500.",
    image: '/proof/testimonial-andrea-after.png'
  },
  {
    id: 'gary',
    name: 'Gary Chappell',
    quote: "My time working with Patrick at Nachos Poker has been amazing. He genuinely cares about your progress and puts a lot of thought into how everything is structured. The coaching and resources are clear, practical, and easy to apply. I've already recommended the program to a friend who's seeing great results as well. If you're willing to put in the work, Patrick will help you take your game to the next level.",
    image: '/proof/testimonial-gary.png'
  },
  {
    id: 'marcelo',
    name: 'Marcelo',
    quote: "Patrick's blog posts and videos on Run It Once were what convinced me to join Nachos Poker, and I haven't looked back since. His approach is very data-driven and practical, and the way he breaks down spots makes complex ideas easy to apply. On top of that, the community he's built is supportive and focused on improving. Whether you're playing 200nl or aiming to move up, working with Patrick is a great place to be.",
    image: '/proof/testimonial-marcelo.png'
  }
];

const VISIBLE_BY_DEFAULT = 3;

const TestimonialCard = ({ t, onImageClick }) => (
  <div
    className="testimonial-grid-card"
    style={{
      background: 'rgba(18, 18, 18, 0.5)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(167, 138, 67, 0.2)',
      borderRadius: '20px',
      padding: '28px',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.35)'
    }}
  >
    {/* Results graph */}
    {t.image && (
      <div
        onClick={() => onImageClick(t.image)}
        className="testimonial-graph-clickable"
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(167, 138, 67, 0.2)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          flexShrink: 0
        }}
      >
        <img
          src={t.image}
          alt={`${t.name} results graph`}
          style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }}
        />
        <div className="testimonial-graph-overlay" style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(168, 139, 70, 0.08)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <span style={{
            color: GOLD,
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>Click to expand</span>
        </div>
      </div>
    )}

    {/* Quote (clamped; the strongest lines lead in the students' own words) */}
    <p
      className="testimonial-grid-quote"
      style={{
        color: 'rgba(255, 255, 255, 0.88)',
        fontSize: '14.5px',
        lineHeight: 1.75,
        fontStyle: 'italic',
        margin: 0,
        flex: 1
      }}
    >
      &quot;{t.quote}&quot;
    </p>

    {/* Author */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: GOLD,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: '700',
        color: '#0a0a0a',
        flexShrink: 0
      }}>
        {t.name.charAt(0)}
      </div>
      <div>
        <div style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>
          {t.name}
        </div>
        {t.result && (
          <div style={{ color: 'rgba(167, 138, 67, 0.85)', fontSize: '12.5px' }}>
            {t.result}
          </div>
        )}
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const [showAll, setShowAll] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const visible = showAll ? TESTIMONIALS : TESTIMONIALS.slice(0, VISIBLE_BY_DEFAULT);

  return (
    <div
      id="testimonials"
      className="reveal"
      style={{
        paddingTop: '60px',
        paddingBottom: '80px',
        marginBottom: '140px',
        scrollMarginTop: '90px'
      }}
    >
      {/* Centered Header */}
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <h2 style={{
          fontSize: 'clamp(38px, 5vw, 56px)',
          fontWeight: '800',
          color: '#FFFFFF',
          marginBottom: '16px',
          lineHeight: 1.08,
          letterSpacing: '-0.025em',
          fontFamily: 'Manrope, Inter, sans-serif'
        }}>
          What My Students <span style={{
            color: GOLD,
            textShadow: '0 0 60px rgba(167, 138, 67, 0.4)'
          }}>Say</span>
        </h2>
        <p style={{
          fontSize: '17px',
          color: '#8A8A8A',
          maxWidth: '480px',
          margin: '0 auto',
          lineHeight: 1.7
        }}>
          Results and testimonials from players I&apos;ve worked with.
        </p>
        {/* TODO(patrick): enable once /results has 2+ complete case studies (P4)
        <a href="/results" style={{ color: '#a88b46', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
          Full case studies →
        </a>
        */}
      </div>

      {/* Grid */}
      <div
        className="testimonial-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto',
          alignItems: 'stretch'
        }}
      >
        {visible.map((t) => (
          <TestimonialCard key={t.id} t={t} onImageClick={setModalImage} />
        ))}
      </div>

      {/* Expander */}
      <div style={{ textAlign: 'center', marginTop: '36px' }}>
        <button
          onClick={() => setShowAll((v) => !v)}
          style={{
            background: 'transparent',
            color: GOLD,
            border: '1.5px solid rgba(167, 138, 67, 0.45)',
            borderRadius: '12px',
            padding: '13px 26px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.3s ease'
          }}
          className="testimonial-expander-btn"
        >
          {showAll ? 'Show fewer' : `Show all ${TESTIMONIALS.length} testimonials`}
          <ChevronDown
            size={16}
            style={{
              transition: 'transform 0.3s ease',
              transform: showAll ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          />
        </button>
      </div>

      {/* Graph Modal */}
      {modalImage && (
        <div
          onClick={() => setModalImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            animation: 'modalFadeIn 0.3s ease'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '900px',
              width: '100%',
              background: 'rgba(18, 18, 18, 0.6)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgba(168, 139, 70, 0.25)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 40px 100px rgba(0, 0, 0, 0.6), 0 0 80px rgba(168, 139, 70, 0.1)',
              animation: 'modalScaleIn 0.3s ease'
            }}
          >
            <button
              onClick={() => setModalImage(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '40px',
                height: '40px',
                background: 'rgba(168, 139, 70, 0.1)',
                border: '1px solid rgba(168, 139, 70, 0.3)',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                zIndex: 10
              }}
              className="modal-close-btn"
            >
              <X size={20} color="#a88b46" />
            </button>
            <div style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <img
                src={modalImage}
                alt="Results graph"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .testimonial-grid-quote {
          display: -webkit-box;
          -webkit-line-clamp: 8;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .testimonial-graph-clickable:hover {
          border-color: rgba(168, 139, 70, 0.4) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }
        .testimonial-graph-clickable:hover .testimonial-graph-overlay {
          opacity: 1 !important;
        }
        .testimonial-grid-card {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.4s ease, box-shadow 0.4s ease;
        }
        .testimonial-grid-card:hover {
          transform: translateY(-4px);
          border-color: rgba(167, 138, 67, 0.4) !important;
          box-shadow: 0 24px 56px rgba(0, 0, 0, 0.45), 0 0 32px rgba(167, 138, 67, 0.08);
        }
        .testimonial-expander-btn:hover {
          background: rgba(168, 139, 70, 0.08) !important;
          border-color: #a88b46 !important;
        }
        @media (max-width: 1024px) {
          .testimonial-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 720px) {
          .testimonial-grid {
            grid-template-columns: 1fr !important;
            max-width: 460px !important;
          }
        }
      ` }} />
    </div>
  );
};

export default Testimonials;

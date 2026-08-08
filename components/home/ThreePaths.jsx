'use client';

import { ArrowRight, BookOpen, User, Users } from 'lucide-react';
import { track } from '@vercel/analytics';
import { OFFER, FIT } from '@/lib/offer';
import { RIO_COURSE_URL, COURSE, cfpUrl } from '@/lib/links';

/**
 * The three ways to work with Patrick (P5.1/P5.2): Course / Program / CFP.
 * Shared between the /coaching router page (full) and the homepage strip
 * (compact). `context` drives analytics names and UTM campaigns.
 */
const ThreePaths = ({ compact = false, context = 'home' }) => {
  const paths = [
    {
      icon: BookOpen,
      kicker: 'Self-study',
      title: 'Dominate with Data: the course',
      description: `Self-study. The full MDA framework, 80+ videos, flashcards, group sessions. For players below ${FIT.stakesFloor} or anyone who wants the method without 1-on-1 work on their database.`,
      ctaLabel: `${COURSE.priceFormatted} on Run It Once`,
      href: RIO_COURSE_URL,
      external: true,
      onClick: () => track('outbound', { target: `rio_course_${context}` })
    },
    {
      icon: User,
      kicker: 'Private mentorship',
      title: OFFER.name,
      featured: true,
      description: `Your database, audited and rebuilt with me directly. ${OFFER.calls} structured calls, monthly recalibration, final re-audit. For bankrolled ${FIT.stakesRange} regs. You keep 100% of your winnings.`,
      ctaLabel: `${OFFER.priceFormatted} · By application`,
      href: '/apply',
      external: false,
      onClick: () => track('cta_click', { placement: context === 'home' ? 'threepaths_home' : 'coaching_page' })
    },
    {
      icon: Users,
      kicker: 'Backing',
      title: 'Nachos CFP',
      description: 'Bankroll, tools, team, and the full Nachos ecosystem. You play, we invest, profits are split. For strong players who want backing instead of paying flat.',
      ctaLabel: 'nachospoker.com',
      href: cfpUrl(context === 'home' ? 'threepaths_home' : 'coaching_page'),
      external: true,
      onClick: () => track('outbound', { target: `cfp_${context === 'home' ? 'threepaths' : 'coaching'}` })
    }
  ];

  return (
    <div className="threepaths-wrap">
      <div
        className="threepaths-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: compact ? '20px' : '28px',
          maxWidth: '1100px',
          margin: '0 auto',
          alignItems: 'stretch'
        }}
      >
        {paths.map((path, idx) => {
          const Icon = path.icon;
          return (
            <a
              key={idx}
              href={path.href}
              target={path.external ? '_blank' : undefined}
              rel={path.external ? 'noopener noreferrer' : undefined}
              onClick={path.onClick}
              className="threepaths-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(18, 18, 18, 0.4)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: path.featured ? '1px solid rgba(168, 139, 70, 0.45)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: compact ? '32px 28px' : '44px 36px',
                textDecoration: 'none',
                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {path.featured && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '150%',
                  height: '140px',
                  background: 'radial-gradient(ellipse at center top, rgba(168, 139, 70, 0.14) 0%, transparent 70%)',
                  filter: 'blur(24px)',
                  pointerEvents: 'none'
                }} />
              )}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '18px',
                position: 'relative'
              }}>
                <Icon size={18} color="#a88b46" strokeWidth={1.75} />
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#a88b46',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em'
                }}>
                  {path.kicker}
                </span>
              </div>
              <h3 style={{
                fontSize: compact ? '19px' : '22px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px',
                lineHeight: 1.3,
                letterSpacing: '-0.01em',
                position: 'relative'
              }}>
                {path.title}
              </h3>
              <p style={{
                fontSize: compact ? '13.5px' : '14.5px',
                color: 'rgba(240, 240, 240, 0.6)',
                lineHeight: 1.75,
                marginBottom: '24px',
                flex: 1,
                position: 'relative'
              }}>
                {path.description}
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: path.featured ? '#F0F0F0' : '#a88b46',
                fontSize: '14px',
                fontWeight: '700',
                letterSpacing: '0.02em',
                position: 'relative'
              }}>
                {path.ctaLabel} <ArrowRight size={15} />
              </div>
            </a>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .threepaths-card:hover {
          transform: translateY(-6px);
          border-color: rgba(168, 139, 70, 0.5) !important;
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4), 0 0 40px rgba(168, 139, 70, 0.1);
        }
        @media (max-width: 960px) {
          .threepaths-grid {
            grid-template-columns: 1fr !important;
            max-width: 460px !important;
          }
        }
      ` }} />
    </div>
  );
};

export default ThreePaths;

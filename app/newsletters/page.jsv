'use client';

import React, { useState } from 'react';
import NachosPokerNavBar from '@/components/NachosPokerNavBar';
import { Mail, Check, Loader, ArrowRight, TrendingUp, Database, Zap, BookOpen } from 'lucide-react';

/**
 * Newsletter Subscription Page
 * Standalone page for newsletter signups
 * Matches Freenachos dark/gold design system
 */

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'newsletter_page' })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to subscribe');
    }
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Strategy Breakdowns',
      description: 'Deep dives into high-stakes spots with solver analysis and population reads.'
    },
    {
      icon: Database,
      title: 'Data-Driven Insights',
      description: 'Exploit patterns backed by millions of hands of real player data.'
    },
    {
      icon: Zap,
      title: 'Actionable Tips',
      description: 'Concrete adjustments you can implement in your next session.'
    },
    {
      icon: BookOpen,
      title: 'Mindset & Mental Game',
      description: 'Build the discipline and focus required for long-term consistency at the tables.'
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0A0A0A', 
      color: '#fff', 
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Noise Overlay */}
      <div 
        className="noise-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0.03
        }}
      />

      {/* Ambient Glow */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(167, 138, 67, 0.15) 0%, transparent 60%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
        
        html, body { scroll-behavior: smooth; overflow-x: hidden; }
        
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin { animation: spin 1s linear infinite; }

        .benefit-card {
          background: rgba(18, 18, 18, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(168, 139, 70, 0.2);
          border-radius: 20px;
          padding: 28px;
          transition: all 0.3s ease;
        }
        .benefit-card:hover {
          border-color: rgba(168, 139, 70, 0.4);
          transform: translateY(-4px);
        }

        .glass-card {
          background: rgba(18, 18, 18, 0.7);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(168, 139, 70, 0.3);
          border-radius: 24px;
        }
      `}</style>

      <div style={{ 
        position: 'relative', 
        zIndex: 10, 
        maxWidth: '1100px', 
        margin: '0 auto', 
        padding: '20px' 
      }}>
        <NachosPokerNavBar />

        {/* Hero Section */}
        <div style={{ 
          textAlign: 'center', 
          paddingTop: '80px',
          paddingBottom: '60px',
          animation: 'fadeInUp 0.8s ease-out'
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(167, 138, 67, 0.1)',
            border: '1px solid rgba(167, 138, 67, 0.3)',
            borderRadius: '50px',
            padding: '10px 20px',
            marginBottom: '32px'
          }}>
            <Mail size={16} color="#A78A43" />
            <span style={{ 
              fontSize: '13px', 
              color: '#A78A43', 
              fontWeight: '600',
              letterSpacing: '0.03em'
            }}>
              Nachos Exploits Newsletter
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: '800',
            color: '#FFFFFF',
            marginBottom: '24px',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            fontFamily: 'Manrope, Inter, sans-serif'
          }}>
            Get the <span style={{ color: '#A78A43' }}>Edge</span> Delivered<br />
            to Your Inbox
          </h1>

          {/* Subhead */}
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.6)',
            maxWidth: '520px',
            margin: '0 auto 48px',
            lineHeight: 1.7
          }}>
            Bi-weekly strategy breakdowns, population exploits, and data-driven insights 
            to help you crush the games.
          </p>

          {/* Signup Form */}
          <div className="glass-card" style={{
            maxWidth: '480px',
            margin: '0 auto',
            padding: '40px',
            animation: 'fadeInUp 0.8s ease-out 0.2s both'
          }}>
            {status === 'success' ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '2px solid rgba(34, 197, 94, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <Check size={32} color="#22c55e" />
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  You're in!
                </h3>
                <p style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  lineHeight: 1.6
                }}>
                  Check your inbox. First issue drops soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <Mail
                    size={20}
                    color="rgba(255, 255, 255, 0.4)"
                    style={{
                      position: 'absolute',
                      left: '18px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none'
                    }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={status === 'loading'}
                    style={{
                      width: '100%',
                      padding: '18px 18px 18px 52px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '14px',
                      color: '#FFFFFF',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(168, 139, 70, 0.5)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.06)';
                    }}
                  />
                </div>

                {status === 'error' && (
                  <p style={{
                    color: '#ef4444',
                    fontSize: '14px',
                    marginBottom: '16px',
                    textAlign: 'center'
                  }}>
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading' || !email}
                  style={{
                    width: '100%',
                    padding: '18px 28px',
                    background: status === 'loading' ? 'rgba(168, 139, 70, 0.5)' : '#A78A43',
                    border: 'none',
                    borderRadius: '14px',
                    color: '#0a0a0a',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 24px rgba(168, 139, 70, 0.3)'
                  }}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader size={20} className="spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      Subscribe <ArrowRight size={20} />
                    </>
                  )}
                </button>

                <p style={{
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.35)',
                  textAlign: 'center',
                  marginTop: '16px'
                }}>
                  No spam. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Benefits Section */}
        <div style={{ 
          paddingTop: '40px',
          paddingBottom: '100px',
          animation: 'fadeInUp 0.8s ease-out 0.4s both'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: '48px'
          }}>
            What You'll Get
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px'
          }}>
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(167, 138, 67, 0.15)',
                  border: '1px solid rgba(167, 138, 67, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <benefit.icon size={24} color="#A78A43" />
                </div>
                <h3 style={{
                  fontSize: '17px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginBottom: '10px'
                }}>
                  {benefit.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.55)',
                  lineHeight: 1.6
                }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          padding: '32px 0',
          borderTop: '1px solid rgba(167, 138, 67, 0.1)'
        }}>
          <p style={{
            fontSize: '13px',
            color: 'rgba(240, 240, 240, 0.4)'
          }}>
            © 2026 Freenachos Poker. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

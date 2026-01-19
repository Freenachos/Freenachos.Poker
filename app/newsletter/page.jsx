'use client';

import React, { useState } from 'react';
import NachosPokerNavBar from '@/components/NachosPokerNavBar';
import { Mail, Check, Loader, ArrowRight, TrendingUp, Database, Zap, Brain } from 'lucide-react';

/**
 * Newsletter Subscription Page
 * Cinematic landing page matching homepage style
 */

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
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
      icon: Brain,
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

      {/* Background Floating Nachos */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 1, pointerEvents: 'none' }}>
        {/* Large blurred nacho - top left */}
        <div style={{
          position: 'absolute',
          top: '5%',
          left: '5%',
          width: '120px',
          height: '120px',
          opacity: 0.08,
          filter: 'blur(8px)',
          animation: 'peripheralWobble1 25s ease-in-out infinite'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Medium nacho - top right */}
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: '80px',
          height: '80px',
          opacity: 0.06,
          filter: 'blur(4px)',
          animation: 'peripheralWobble2 30s ease-in-out infinite',
          animationDelay: '-5s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Small nacho - bottom left */}
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '8%',
          width: '60px',
          height: '60px',
          opacity: 0.05,
          filter: 'blur(3px)',
          animation: 'peripheralWobble1 20s ease-in-out infinite',
          animationDelay: '-10s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>
      </div>

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

        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes imageReveal {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin { animation: spin 1s linear infinite; }

        @keyframes peripheralWobble1 {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          15% { transform: translate(3px, -5px) rotate(2deg) scale(1.01); }
          30% { transform: translate(6px, -3px) rotate(4deg) scale(0.99); }
          45% { transform: translate(4px, -8px) rotate(6deg) scale(1.02); }
          60% { transform: translate(2px, -4px) rotate(3deg) scale(0.98); }
          75% { transform: translate(5px, -6px) rotate(5deg) scale(1.01); }
          90% { transform: translate(1px, -2px) rotate(1deg) scale(1); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }

        @keyframes peripheralWobble2 {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          20% { transform: translate(-4px, -6px) rotate(-3deg) scale(1.02); }
          40% { transform: translate(-2px, -10px) rotate(-5deg) scale(0.98); }
          60% { transform: translate(-6px, -4px) rotate(-2deg) scale(1.01); }
          80% { transform: translate(-3px, -7px) rotate(-4deg) scale(0.99); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }

        .benefit-card {
          background: #1A1A1A;
          border: 1px solid rgba(167, 138, 67, 0.2);
          border-radius: 16px;
          padding: 32px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.4s ease, transform 0.3s ease;
        }

        .benefit-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #A78A43, transparent);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .benefit-card:hover::before {
          opacity: 1;
        }

        .benefit-card:hover {
          border-color: rgba(167, 138, 67, 0.4);
          transform: translateY(-4px);
        }

        .benefit-card:hover .benefit-icon {
          background: rgba(167, 138, 67, 0.15);
          border-color: rgba(167, 138, 67, 0.6);
          box-shadow: 0 0 20px rgba(167, 138, 67, 0.25);
        }

        .benefit-card:hover .benefit-title {
          color: #A78A43;
        }

        .glass-card {
          background: rgba(18, 18, 18, 0.7);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(168, 139, 70, 0.3);
          border-radius: 24px;
        }

        .hero-image-mask {
          mask-image: linear-gradient(to left, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%);
          -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%);
        }

        @media (max-width: 900px) {
          .hero-image-mask {
            display: none !important;
          }
        }
      `}</style>

      {/* ==================== FIXED NAVBAR ==================== */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          padding: '20px 24px',
          pointerEvents: 'auto'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <NachosPokerNavBar />
        </div>
      </div>

      {/* ==================== HERO SECTION ==================== */}
      <section 
        style={{
          position: 'relative',
          minHeight: '100vh',
          width: '100%',
          overflow: 'hidden',
          background: 'transparent',
          zIndex: 10
        }}
      >
        {/* Halo Lighting Behind Coach */}
        <div style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-5%',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(167, 138, 67, 0.3) 0%, rgba(167, 138, 67, 0.12) 40%, transparent 70%)',
          filter: 'blur(120px)',
          zIndex: 5,
          pointerEvents: 'none'
        }} />

        {/* Coach Image - Anchored Bottom Right */}
        <div 
          className="hero-image-mask"
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            height: '85vh',
            maxHeight: '880px',
            zIndex: 20,
            animation: 'imageReveal 1.2s ease-out 0.5s both',
            pointerEvents: 'none'
          }}
        >
          <img 
            src="https://i.gyazo.com/ad823c265c17c21f61996bb3aa3283e2.png"
            alt="Patrick - Freenachos Coach"
            style={{
              height: '100%',
              width: 'auto',
              objectFit: 'contain',
              objectPosition: 'bottom right'
            }}
          />
        </div>

        {/* Cinematic Vignette */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 15,
            background: 'linear-gradient(to right, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.7) 35%, rgba(10, 10, 10, 0.3) 55%, transparent 75%)',
            pointerEvents: 'none'
          }}
        />

        {/* Content */}
        <div 
          style={{
            position: 'relative',
            zIndex: 30,
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '0 48px',
              paddingTop: '140px',
              paddingBottom: '80px'
            }}
          >
            <div 
              style={{
                maxWidth: '520px',
                animation: 'heroFadeIn 1s ease-out 0.2s both'
              }}
            >
              {/* Badge */}
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(167, 138, 67, 0.1)',
                  border: '1px solid rgba(167, 138, 67, 0.3)',
                  borderRadius: '50px',
                  padding: '10px 20px',
                  marginBottom: '32px',
                  backdropFilter: 'blur(8px)'
                }}
              >
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
                Get the <span style={{ color: '#A78A43' }}>Edge</span><br />
                Delivered to Your Inbox
              </h1>

              {/* Subhead */}
              <p style={{
                fontSize: '17px',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '40px',
                lineHeight: 1.7
              }}>
                Bi-weekly strategy breakdowns, population exploits, and data-driven insights 
                to help you crush the games.
              </p>

              {/* Signup Form */}
              <div className="glass-card" style={{ padding: '32px' }}>
                {status === 'success' ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'rgba(34, 197, 94, 0.15)',
                      border: '2px solid rgba(34, 197, 94, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px'
                    }}>
                      <Check size={28} color="#22c55e" />
                    </div>
                    <h3 style={{
                      fontSize: '22px',
                      fontWeight: '700',
                      color: '#FFFFFF',
                      marginBottom: '10px'
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
                    <div style={{ position: 'relative', marginBottom: '14px' }}>
                      <Mail
                        size={20}
                        color="rgba(255, 255, 255, 0.4)"
                        style={{
                          position: 'absolute',
                          left: '16px',
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
                          padding: '16px 16px 16px 50px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '12px',
                          color: '#FFFFFF',
                          fontSize: '15px',
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
                        fontSize: '13px',
                        marginBottom: '12px',
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
                        padding: '16px 24px',
                        background: status === 'loading' ? 'rgba(168, 139, 70, 0.5)' : '#A78A43',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#0a0a0a',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 20px rgba(168, 139, 70, 0.3)'
                      }}
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader size={18} className="spin" />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          Subscribe <ArrowRight size={18} />
                        </>
                      )}
                    </button>

                    <p style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.35)',
                      textAlign: 'center',
                      marginTop: '14px'
                    }}>
                      No spam. Unsubscribe anytime.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== BENEFITS SECTION ==================== */}
      <section style={{ 
        position: 'relative',
        zIndex: 20,
        padding: '80px 24px 120px',
        background: 'linear-gradient(to bottom, transparent, rgba(10, 10, 10, 0.95) 20%)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: '56px',
            fontFamily: 'Manrope, Inter, sans-serif'
          }}>
            What You'll Get
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div 
                  className="benefit-icon"
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'rgba(167, 138, 67, 0.08)',
                    border: '1px solid rgba(167, 138, 67, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    transition: 'all 0.4s ease'
                  }}
                >
                  <benefit.icon size={26} color="#A78A43" />
                </div>
                <h3 
                  className="benefit-title"
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    marginBottom: '12px',
                    transition: 'color 0.4s ease'
                  }}
                >
                  {benefit.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.55)',
                  lineHeight: 1.7
                }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer style={{
        position: 'relative',
        zIndex: 20,
        textAlign: 'center',
        padding: '32px 24px',
        borderTop: '1px solid rgba(167, 138, 67, 0.1)'
      }}>
        <p style={{
          fontSize: '13px',
          color: 'rgba(240, 240, 240, 0.4)'
        }}>
          © 2026 Freenachos Poker. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

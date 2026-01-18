'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, Check, Loader, ArrowRight } from 'lucide-react';

/**
 * NewsletterPopup - Scroll-triggered glassmorphism popup
 * 
 * Features:
 * - Appears after scrolling 40% of the page
 * - Respects localStorage dismissal (won't annoy returning visitors)
 * - Matches Freenachos dark/gold design language
 * - Includes Patrick's headshot for personal touch
 */

const STORAGE_KEY = 'freenachos_newsletter_dismissed';
const SUBSCRIBED_KEY = 'freenachos_newsletter_subscribed';

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Don't show if already dismissed or subscribed
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      const subscribed = localStorage.getItem(SUBSCRIBED_KEY);
      if (dismissed || subscribed) return;
    }

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercent > 40 && !isVisible) {
        setIsVisible(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    // Small delay before attaching listener
    const timer = setTimeout(() => {
      window.addEventListener('scroll', handleScroll);
    }, 2000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'popup' })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      localStorage.setItem(SUBSCRIBED_KEY, 'true');
      
      // Auto-close after 3 seconds on success
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);

    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to subscribe');
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleDismiss}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 9998,
          animation: 'fadeIn 0.3s ease-out'
        }}
      />

      {/* Popup */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          width: '90%',
          maxWidth: '440px',
          animation: 'slideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
        }}
      >
        <div
          style={{
            background: 'rgba(18, 18, 18, 0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(168, 139, 70, 0.3)',
            borderRadius: '24px',
            padding: '40px',
            position: 'relative',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.5), 0 0 80px rgba(168, 139, 70, 0.1)'
          }}
        >
          {/* Close button */}
          <button
            onClick={handleDismiss}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.15)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.08)'}
          >
            <X size={18} color="rgba(255, 255, 255, 0.6)" />
          </button>

          {/* Headshot */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '24px',
            marginTop: '-8px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid rgba(168, 139, 70, 0.5)',
              boxShadow: '0 8px 32px rgba(168, 139, 70, 0.3)'
            }}>
              <img
                src="https://i.gyazo.com/ad823c265c17c21f61996bb3aa3283e2.png"
                alt="Patrick - Freenachos Coach"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top center'
                }}
              />
            </div>
          </div>

          {status === 'success' ? (
            /* Success State */
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
                marginBottom: '12px'
              }}>
                You're in!
              </h3>
              <p style={{
                fontSize: '15px',
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: 1.6
              }}>
                Check your inbox to confirm your subscription.
              </p>
            </div>
          ) : (
            /* Form State */
            <>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px',
                textAlign: 'center',
                letterSpacing: '-0.02em'
              }}>
                Level Up Your Game
              </h3>

              <p style={{
                fontSize: '15px',
                color: 'rgba(255, 255, 255, 0.55)',
                textAlign: 'center',
                marginBottom: '28px',
                lineHeight: 1.6
              }}>
                Get strategy breakdowns, data-driven insights, and new articles delivered to your inbox.
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <Mail
                    size={18}
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
                      padding: '16px 16px 16px 48px',
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
                    fontWeight: '600',
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
              </form>

              <p style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.35)',
                textAlign: 'center',
                marginTop: '16px'
              }}>
                No spam. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translate(-50%, -45%); 
          }
          to { 
            opacity: 1; 
            transform: translate(-50%, -50%); 
          }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

"use client";

import NachosPokerNavBar from '@/components/NachosPokerNavBar';
import NewsletterPopup from '@/components/NewsletterPopup';
import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import ProofSection from '@/components/home/ProofSection';
import Mechanism from '@/components/home/Mechanism';
import OfferSection from '@/components/home/OfferSection';
import FitSection from '@/components/home/FitSection';
import HomeFAQ from '@/components/home/HomeFAQ';
import FinalCTA from '@/components/home/FinalCTA';
import ThreePaths from '@/components/home/ThreePaths';
import { track } from '@vercel/analytics';

import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight, Calculator, BookOpen, Compass, Youtube, ArrowRight, Check, X } from 'lucide-react';

/**
 * Freenachos Poker Homepage — premium application funnel.
 *
 * Composition (funnel rebuild, 2026-08):
 * - Hero: "I don't guess what the pool does. I've counted it." → /apply
 * - ProofSection: coach authority + tracked results
 * - Mechanism: Diagnose → Prioritize → Install → Verify (#mentorship)
 * - Testimonials + YouTube cinema (kept)
 * - OfferSection: the single 6-month program + roadmap (#program, #pricing alias)
 * - FitSection, HomeFAQ, FinalCTA (#book alias)
 * - ThreePaths strip + safety net (newsletter capture)
 *
 * Section copy lives in components/home/*; numbers live in lib/offer.js.
 */

const PokerToolboxHome = () => {
  // ============================================
  // STATE
  // ============================================

  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [showTestimonialGraphModal, setShowTestimonialGraphModal] = useState(null);
  const [inlineEmail, setInlineEmail] = useState('');
  const [inlineStatus, setInlineStatus] = useState('idle');
  const heroSectionRef = useRef(null);
  const cinemaCarouselRef = useRef(null);

  // ============================================
  // DATA
  // ============================================

  const videos = [
    { id: 1, title: 'How We RINSED The Bots for MILLIONS', thumbnail: 'https://img.youtube.com/vi/RqoIVH2_mBE/maxresdefault.jpg', duration: '', views: '', link: 'https://www.youtube.com/watch?v=RqoIVH2_mBE' },
    { id: 2, title: 'Is Rush & Cash On GGPoker Beatable?', thumbnail: 'https://img.youtube.com/vi/J73BGQuDMjg/maxresdefault.jpg', duration: '', views: '', link: 'https://www.youtube.com/watch?v=J73BGQuDMjg' },
    { id: 3, title: 'Exploiting NL200 Rush & Cash on GGPoker (Live Analysis)', thumbnail: 'https://img.youtube.com/vi/LJMAnZq5GmE/maxresdefault.jpg', duration: '', views: '', link: 'https://www.youtube.com/watch?v=LJMAnZq5GmE' },
    { id: 4, title: '5 Data Exploits to Crush Low Stakes', thumbnail: 'https://img.youtube.com/vi/L5IBgpt6xjk/maxresdefault.jpg', duration: '', views: '', link: 'https://www.youtube.com/watch?v=L5IBgpt6xjk' },
    { id: 5, title: 'NL1000 Hand Gets Spicy: Slow Roll Incoming?', thumbnail: 'https://img.youtube.com/vi/wM_QUPDUL44/maxresdefault.jpg', duration: '', views: '', link: 'https://www.youtube.com/watch?v=wM_QUPDUL44' },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Gary Chappell',
      quote: "My time working with Patrick at Nachos Poker has been amazing. He genuinely cares about your progress and puts a lot of thought into how everything is structured. The coaching and resources are clear, practical, and easy to apply. I've already recommended the program to a friend who's seeing great results as well. If you're willing to put in the work, Patrick will help you take your game to the next level.",
      image: '/proof/testimonial-gary.png'
    },
    {
      id: 2,
      name: 'Keven Li',
      subtitle: 'Poker Made Simple',
      result: 'NL100 → crushing NL1000',
      quote: "In 2021, I turned pro with a $10k bankroll, struggling through a breakeven stretch until Patrick's data-driven coaching changed everything. My results skyrocketed. His guidance, combined with NachosPoker's training, took me from 100nl to crushing 1000nl. Working with Patrick was the best decision I've made in poker.",
      image: '/proof/testimonial-keven.png'
    },
    {
      id: 3,
      name: 'Marcelo',
      quote: "Patrick's blog posts and videos on Run It Once were what convinced me to join Nachos Poker, and I haven't looked back since. His approach is very data-driven and practical, and the way he breaks down spots makes complex ideas easy to apply. On top of that, the community he's built is supportive and focused on improving. Whether you're playing 200nl or aiming to move up, working with Patrick is a great place to be.",
      image: '/proof/testimonial-marcelo.png'
    },
    {
      id: 4,
      name: 'Andrea',
      result: 'Breakeven NL50 → beating NL200 in 13 months',
      quote: "I just finished my learning path with Patrick and I wanted to share my experience working with him. It was my first experience with a coach and I've always been very skeptical about coaching in general, but after working with him I completely changed my mind. What impressed me the most was his empathy. One day I came to a lesson during a downswing and without me saying a word about it, he sensed something and said 'How about we have a mindset talk instead?' To me, that's an innate and truly essential quality in a coach. In about 13 months I went from being breakeven at NL50 to beating NL200, almost ready for NL500.",
      hasBeforeAfter: true,
      imageBefore: '/proof/testimonial-andrea-before.png',
      imageAfter: '/proof/testimonial-andrea-after.png'
    },
    {
      id: 5,
      name: 'Davide',
      result: 'NL100 → dominating NL1000 in under a year',
      quote: "Thanks to NachosPoker, I went from struggling at 100nl to dominating at 1k in under a year! They helped me improve in every aspect of the game, not only strategical, but also mental and logistical. Patrick is always patient, humble, and delivers more than expected. Plus, the community is awesome!",
      image: '/proof/testimonial-davide.png'
    },
    {
      id: 6,
      name: 'Brendon',
      result: 'Breakeven NL100 → dominating NL1000',
      quote: "The strategy will anchor you in spots where you typically feel lost. Patrick's methodology elevated my game from a breakeven 100nl reg to dominating 1000nl. The supportive community offers in-depth discussions that have been crucial to my development.",
      image: '/proof/testimonial-brendon.png'
    },
    {
      id: 7,
      name: 'Peter',
      result: 'Back from a downswing, now playing NL2000',
      quote: "After a tough downswing in late 2023 dropped me from 1knl to 200/500nl, I feared my high-stakes dream was over. A friend suggested Freenachos CFP, and it may have been the best decision of my career. Their resources and Patrick's support helped me excel, and I've since skyrocketed back on track, now competing at 2K and aiming higher soon.",
      image: '/proof/testimonial-peter.png'
    },
  ];

  // Scroll Reveal Animation Observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all elements with 'reveal' or 'reveal-first' class
    const revealElements = document.querySelectorAll('.reveal, .reveal-first');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Show sticky CTA when Hero section is mostly scrolled out (only 20% visible)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show CTA when Hero is NOT intersecting (less than 20% visible)
        setShowStickyCta(!entry.isIntersecting);
      },
      {
        threshold: 0.2
      }
    );

    if (heroSectionRef.current) {
      observer.observe(heroSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // ============================================
  // CAROUSEL HANDLERS
  // ============================================

  const nextVideo = () => {
    if (cinemaCarouselRef.current) {
      cinemaCarouselRef.current.scrollBy({ left: 412, behavior: 'smooth' });
    }
  };

  const prevVideo = () => {
    if (cinemaCarouselRef.current) {
      cinemaCarouselRef.current.scrollBy({ left: -412, behavior: 'smooth' });
    }
  };

  const nextTestimonial = () => {
    setSlideDirection('right');
    setCurrentTestimonialIndex((prev) => (prev >= testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setSlideDirection('left');
    setCurrentTestimonialIndex((prev) => (prev <= 0 ? testimonials.length - 1 : prev - 1));
  };

  // Inline newsletter capture (Safety Net section)
  const handleInlineSubscribe = async (e) => {
    e.preventDefault();
    if (!inlineEmail || inlineStatus === 'loading') return;
    setInlineStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inlineEmail, source: 'homepage_inline' })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }
      setInlineStatus('success');
      track('newsletter_signup', { source: 'homepage_inline' });
      try { localStorage.setItem('freenachos_newsletter_subscribed', 'true'); } catch {}
    } catch (err) {
      setInlineStatus('error');
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div style={{minHeight: '100vh', background: '#0A0E1A', position: 'relative', overflow: 'hidden', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'}}>
      {/* Newsletter Popup */}
      <NewsletterPopup />

      {/* Noise/Grain Texture Overlay */}
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

      {/* Sticky CTA Button - Apply for the Program - Only visible after scrolling past hero */}
      {showStickyCta && (
        <a
          href="/apply"
          onClick={() => track('cta_click', { placement: 'sticky' })}
          className="sticky-cta-btn"
        >
          Apply for the Program
          <ArrowRight size={18} />
        </a>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');

        /* Smooth Scroll Behavior & Prevent Horizontal Scroll from Peripheral Bokeh */
        html, body {
          scroll-behavior: smooth;
          overflow-x: hidden;
        }

        /* Noise Texture Overlay */
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        /* Scroll Reveal Animation - Museum Float (Buttery Momentum) */
        .reveal {
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1), transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* First Section - Extra Dramatic Entrance */
        .reveal-first {
          opacity: 0;
          transform: translateY(80px);
          transition: opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1), transform 1.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .reveal-first.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

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
        .btn-hover:hover:not(:disabled) {
          transform: translateY(-4px);
        }
        .btn-hover:active:not(:disabled) {
          transform: translateY(-2px);
        }

        .cta-primary {
          position: relative;
          overflow: hidden;
        }

        .cta-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .cta-primary:hover::before {
          left: 100%;
        }

        .cta-primary:hover {
          box-shadow: 0 0 20px rgba(167, 138, 67, 0.4), 0 10px 40px rgba(167, 138, 67, 0.3);
          background: #FFa31a;
        }

        /* Sticky Apply Button */
        .sticky-cta-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          background: #A78A43;
          color: #0a0a0a;
          padding: 14px 24px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 30px rgba(167, 138, 67, 0.4);
          border: none;
          cursor: pointer;
          transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
          animation: stickyCtaEnter 0.4s ease-out;
        }

        .sticky-cta-btn:hover {
          background: #bfa050;
          box-shadow: 0 6px 24px rgba(167, 138, 67, 0.5);
          transform: translateY(-2px);
        }

        .sticky-cta-btn:active {
          transform: translateY(0);
        }

        @keyframes stickyCtaEnter {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .faq-item:hover {
          border-color: rgba(167, 138, 67, 0.4);
        }

        /* === DEPTH-OF-FIELD BOKEH ANIMATIONS === */

        /* PERIPHERAL: Ultra-Large, Extreme Slow Wobble - Lens Edge Effect */
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

        /* FOREGROUND: Large, Heavy, Slow - Pressurized Float */
        @keyframes foregroundDrift1 {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          20% { transform: translate(8px, -12px) rotate(8deg) scale(1.02); }
          40% { transform: translate(15px, -8px) rotate(15deg) scale(0.98); }
          60% { transform: translate(10px, -18px) rotate(22deg) scale(1.01); }
          80% { transform: translate(5px, -5px) rotate(12deg) scale(0.99); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }

        @keyframes foregroundDrift2 {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(-10px, -15px) rotate(-12deg) scale(1.03); }
          50% { transform: translate(-5px, -25px) rotate(-20deg) scale(0.97); }
          75% { transform: translate(-12px, -10px) rotate(-8deg) scale(1.02); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }

        @keyframes foregroundDrift3 {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          30% { transform: translate(12px, -20px) rotate(18deg) scale(0.98); }
          60% { transform: translate(6px, -10px) rotate(10deg) scale(1.02); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }

        /* MIDGROUND: Medium, Moderate Float */
        @keyframes midgroundDrift1 {
          0% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(20px, -30px) rotate(25deg); }
          40% { transform: translate(35px, -20px) rotate(50deg); }
          60% { transform: translate(25px, -40px) rotate(75deg); }
          80% { transform: translate(10px, -15px) rotate(55deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        @keyframes midgroundDrift2 {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-25px, -35px) rotate(-40deg); }
          50% { transform: translate(-15px, -50px) rotate(-80deg); }
          75% { transform: translate(-30px, -25px) rotate(-50deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        @keyframes midgroundDrift3 {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -25px) rotate(60deg); }
          66% { transform: translate(15px, -45px) rotate(120deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        /* BACKGROUND (FOCAL): Small, Sharp, Fast Darting - Like distant particles */
        @keyframes backgroundDart1 {
          0% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(25px, -40px) rotate(45deg); }
          25% { transform: translate(50px, -25px) rotate(90deg); }
          40% { transform: translate(35px, -60px) rotate(150deg); }
          55% { transform: translate(60px, -35px) rotate(200deg); }
          70% { transform: translate(40px, -55px) rotate(270deg); }
          85% { transform: translate(20px, -30px) rotate(320deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }

        @keyframes backgroundDart2 {
          0% { transform: translate(0, 0) rotate(0deg); }
          15% { transform: translate(-35px, -50px) rotate(-60deg); }
          30% { transform: translate(-20px, -30px) rotate(-120deg); }
          50% { transform: translate(-50px, -45px) rotate(-180deg); }
          70% { transform: translate(-30px, -60px) rotate(-250deg); }
          85% { transform: translate(-15px, -25px) rotate(-310deg); }
          100% { transform: translate(0, 0) rotate(-360deg); }
        }

        @keyframes backgroundDart3 {
          0% { transform: translate(0, 0) rotate(0deg); }
          12% { transform: translate(40px, -35px) rotate(70deg); }
          28% { transform: translate(20px, -55px) rotate(140deg); }
          45% { transform: translate(55px, -40px) rotate(210deg); }
          62% { transform: translate(30px, -65px) rotate(280deg); }
          78% { transform: translate(45px, -30px) rotate(330deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }

        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes imageReveal {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Ghost Fade Mask - Solid Torso, Quick Bottom Fade */
        .hero-image-mask {
          mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
        }

        /* Hero Section Mask - Organic Bottom Dissolve */
        .hero-section-fade {
          mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
        }
      ` }} />

      {/* ==================== LAYER 0: BACKGROUND GLOWS (Fixed, z-0) ==================== */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {/* Massive Bokeh - Top Right */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-8%',
          width: '900px',
          height: '900px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167, 138, 67, 0.08) 0%, transparent 60%)',
          filter: 'blur(80px)',
          opacity: 0.6
        }} />

        {/* Massive Bokeh - Bottom Left */}
        <div style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-12%',
          width: '1000px',
          height: '1000px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167, 138, 67, 0.06) 0%, transparent 55%)',
          filter: 'blur(100px)',
          opacity: 0.5
        }} />

        {/* Ambient Bokeh - Center Right */}
        <div style={{
          position: 'absolute',
          top: '40%',
          right: '5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167, 138, 67, 0.05) 0%, transparent 50%)',
          filter: 'blur(60px)',
          opacity: 0.4
        }} />
      </div>

      {/* ==================== GLOBAL BOKEH BACKGROUND SYSTEM ==================== */}
      {/* Unified depth-of-field nacho field - persists across entire page */}
      {/* Depth Logic: Large=Blurry/Slow (foreground), Small=Sharp/Fast (background focal point) */}

      {/* === LAYER 0: PERIPHERAL BOKEH - Ultra-Large, Extreme Blur, Edge Framing === */}
      {/* Simulates objects very close to the camera lens in peripheral vision */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>

        {/* Peripheral Left - Top */}
        <div style={{
          position: 'absolute',
          top: '5%',
          left: '-8%',
          width: '180px',
          height: '180px',
          opacity: 0.06,
          filter: 'blur(18px)',
          animation: 'peripheralWobble1 120s ease-in-out infinite'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Peripheral Left - Middle */}
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '-12%',
          width: '220px',
          height: '220px',
          opacity: 0.05,
          filter: 'blur(22px)',
          animation: 'peripheralWobble2 140s ease-in-out infinite',
          animationDelay: '-40s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Peripheral Left - Bottom */}
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '-6%',
          width: '160px',
          height: '160px',
          opacity: 0.07,
          filter: 'blur(16px)',
          animation: 'peripheralWobble1 100s ease-in-out infinite',
          animationDelay: '-70s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Peripheral Right - Top */}
        <div style={{
          position: 'absolute',
          top: '8%',
          right: '-10%',
          width: '200px',
          height: '200px',
          opacity: 0.05,
          filter: 'blur(20px)',
          animation: 'peripheralWobble2 130s ease-in-out infinite',
          animationDelay: '-20s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Peripheral Right - Middle */}
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '-14%',
          width: '240px',
          height: '240px',
          opacity: 0.04,
          filter: 'blur(24px)',
          animation: 'peripheralWobble1 150s ease-in-out infinite',
          animationDelay: '-60s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Peripheral Right - Bottom */}
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '-8%',
          width: '170px',
          height: '170px',
          opacity: 0.06,
          filter: 'blur(17px)',
          animation: 'peripheralWobble2 110s ease-in-out infinite',
          animationDelay: '-90s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>
      </div>

      {/* === LAYER 1: FOREGROUND - Large, Very Blurry, Slow Heavy Drift === */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>

        {/* Foreground Nacho 1 - Top Left */}
        <div className="bokeh-foreground" style={{
          position: 'absolute',
          top: '5%',
          left: '3%',
          width: '90px',
          height: '90px',
          opacity: 0.12,
          filter: 'blur(12px)',
          animation: 'foregroundDrift1 80s ease-in-out infinite'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Foreground Nacho 2 - Bottom Right */}
        <div className="bokeh-foreground" style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '110px',
          height: '110px',
          opacity: 0.10,
          filter: 'blur(14px)',
          animation: 'foregroundDrift2 90s ease-in-out infinite',
          animationDelay: '-30s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Foreground Nacho 3 - Center Left */}
        <div className="bokeh-foreground" style={{
          position: 'absolute',
          top: '45%',
          left: '-2%',
          width: '80px',
          height: '80px',
          opacity: 0.08,
          filter: 'blur(10px)',
          animation: 'foregroundDrift3 70s ease-in-out infinite',
          animationDelay: '-45s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Foreground Nacho 4 - Top Right */}
        <div className="bokeh-foreground" style={{
          position: 'absolute',
          top: '15%',
          right: '8%',
          width: '70px',
          height: '70px',
          opacity: 0.09,
          filter: 'blur(11px)',
          animation: 'foregroundDrift1 85s ease-in-out infinite',
          animationDelay: '-60s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>
      </div>

      {/* === LAYER 2: MIDGROUND - Medium, Soft Blur, Moderate Drift === */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2, overflow: 'hidden' }}>

        {/* Midground Nacho 1 */}
        <div className="bokeh-midground" style={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          width: '40px',
          height: '40px',
          opacity: 0.18,
          filter: 'blur(4px)',
          animation: 'midgroundDrift1 45s ease-in-out infinite'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Midground Nacho 2 */}
        <div className="bokeh-midground" style={{
          position: 'absolute',
          top: '60%',
          right: '20%',
          width: '35px',
          height: '35px',
          opacity: 0.16,
          filter: 'blur(5px)',
          animation: 'midgroundDrift2 50s ease-in-out infinite',
          animationDelay: '-15s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Midground Nacho 3 */}
        <div className="bokeh-midground" style={{
          position: 'absolute',
          bottom: '30%',
          left: '8%',
          width: '45px',
          height: '45px',
          opacity: 0.15,
          filter: 'blur(4px)',
          animation: 'midgroundDrift3 55s ease-in-out infinite',
          animationDelay: '-25s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Midground Nacho 4 */}
        <div className="bokeh-midground" style={{
          position: 'absolute',
          top: '35%',
          right: '12%',
          width: '38px',
          height: '38px',
          opacity: 0.14,
          filter: 'blur(3px)',
          animation: 'midgroundDrift1 48s ease-in-out infinite',
          animationDelay: '-35s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Midground Nacho 5 */}
        <div className="bokeh-midground" style={{
          position: 'absolute',
          top: '75%',
          left: '25%',
          width: '32px',
          height: '32px',
          opacity: 0.17,
          filter: 'blur(4px)',
          animation: 'midgroundDrift2 42s ease-in-out infinite',
          animationDelay: '-40s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Midground Nacho 6 */}
        <div className="bokeh-midground" style={{
          position: 'absolute',
          top: '10%',
          left: '55%',
          width: '42px',
          height: '42px',
          opacity: 0.13,
          filter: 'blur(5px)',
          animation: 'midgroundDrift3 52s ease-in-out infinite',
          animationDelay: '-10s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>
      </div>

      {/* === LAYER 3: BACKGROUND (FOCAL POINT) - Small, Sharp, Fast Darting === */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 3, overflow: 'hidden' }}>

        {/* Background Nacho 1 - Sharp, Fast */}
        <div className="bokeh-background" style={{
          position: 'absolute',
          top: '12%',
          left: '22%',
          width: '12px',
          height: '12px',
          opacity: 0.35,
          filter: 'blur(0px) drop-shadow(0 0 3px rgba(167, 138, 67, 0.6))',
          animation: 'backgroundDart1 18s ease-in-out infinite'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Background Nacho 2 */}
        <div className="bokeh-background" style={{
          position: 'absolute',
          top: '55%',
          right: '30%',
          width: '10px',
          height: '10px',
          opacity: 0.40,
          filter: 'blur(0px) drop-shadow(0 0 2px rgba(167, 138, 67, 0.5))',
          animation: 'backgroundDart2 15s ease-in-out infinite',
          animationDelay: '-5s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Background Nacho 3 */}
        <div className="bokeh-background" style={{
          position: 'absolute',
          bottom: '20%',
          left: '35%',
          width: '14px',
          height: '14px',
          opacity: 0.32,
          filter: 'blur(0px) drop-shadow(0 0 4px rgba(167, 138, 67, 0.5))',
          animation: 'backgroundDart3 20s ease-in-out infinite',
          animationDelay: '-8s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Background Nacho 4 */}
        <div className="bokeh-background" style={{
          position: 'absolute',
          top: '30%',
          right: '15%',
          width: '8px',
          height: '8px',
          opacity: 0.45,
          filter: 'blur(0px) drop-shadow(0 0 2px rgba(167, 138, 67, 0.7))',
          animation: 'backgroundDart1 14s ease-in-out infinite',
          animationDelay: '-3s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Background Nacho 5 */}
        <div className="bokeh-background" style={{
          position: 'absolute',
          top: '70%',
          left: '12%',
          width: '11px',
          height: '11px',
          opacity: 0.38,
          filter: 'blur(0px) drop-shadow(0 0 3px rgba(167, 138, 67, 0.6))',
          animation: 'backgroundDart2 16s ease-in-out infinite',
          animationDelay: '-12s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Background Nacho 6 */}
        <div className="bokeh-background" style={{
          position: 'absolute',
          top: '42%',
          left: '45%',
          width: '9px',
          height: '9px',
          opacity: 0.42,
          filter: 'blur(0px) drop-shadow(0 0 2px rgba(167, 138, 67, 0.6))',
          animation: 'backgroundDart3 13s ease-in-out infinite',
          animationDelay: '-6s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Background Nacho 7 */}
        <div className="bokeh-background" style={{
          position: 'absolute',
          bottom: '40%',
          right: '8%',
          width: '13px',
          height: '13px',
          opacity: 0.36,
          filter: 'blur(0px) drop-shadow(0 0 3px rgba(167, 138, 67, 0.5))',
          animation: 'backgroundDart1 17s ease-in-out infinite',
          animationDelay: '-9s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Background Nacho 8 */}
        <div className="bokeh-background" style={{
          position: 'absolute',
          top: '85%',
          left: '60%',
          width: '10px',
          height: '10px',
          opacity: 0.40,
          filter: 'blur(0px) drop-shadow(0 0 2px rgba(167, 138, 67, 0.6))',
          animation: 'backgroundDart2 12s ease-in-out infinite',
          animationDelay: '-4s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Background Nacho 9 - Tiny, very fast */}
        <div className="bokeh-background" style={{
          position: 'absolute',
          top: '25%',
          left: '70%',
          width: '6px',
          height: '6px',
          opacity: 0.50,
          filter: 'blur(0px) drop-shadow(0 0 2px rgba(167, 138, 67, 0.8))',
          animation: 'backgroundDart3 10s ease-in-out infinite',
          animationDelay: '-2s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Background Nacho 10 - Tiny, very fast */}
        <div className="bokeh-background" style={{
          position: 'absolute',
          bottom: '15%',
          right: '45%',
          width: '7px',
          height: '7px',
          opacity: 0.48,
          filter: 'blur(0px) drop-shadow(0 0 2px rgba(167, 138, 67, 0.7))',
          animation: 'backgroundDart1 11s ease-in-out infinite',
          animationDelay: '-7s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>
      </div>

      {/* ==================== FIXED NAVBAR (z-9999) ==================== */}
      {/* Outside Hero section so it doesn't get affected by the fade mask */}
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

      {/* ==================== CINEMATIC HERO SECTION ==================== */}
      <Hero sectionRef={heroSectionRef} />

      {/* ==================== MUSEUM SPACER: Fade Zone (halved per audit) ==================== */}
      <div
        style={{
          height: '150px',
          position: 'relative',
          zIndex: 0
        }}
      />

      {/* ==================== MAIN CONTENT CONTAINER ==================== */}
      <div style={{position: 'relative', zIndex: 10, maxWidth: '1400px', margin: '0 auto', padding: '0 24px'}}>

        {/* ==================== COACH SECTION - Authority Split Layout ==================== */}
        <ProofSection />

        {/* ==================== MECHANISM - Diagnose / Prioritize / Install / Verify ==================== */}
        <Mechanism />

        {/* ==================== TESTIMONIALS - Individual Cards Only ==================== */}
        <div
          id="testimonials"
          className="reveal"
          style={{
            paddingTop: '60px',
            paddingBottom: '120px',
            marginBottom: '200px',
            overflow: 'visible',
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
                color: '#A78A43',
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

          {/* Testimonial Carousel with Side Previews */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            padding: '0 20px'
          }}>
            {/* Left Preview Card */}
            <div
              onClick={prevTestimonial}
              className="testimonial-preview-card"
              style={{
                flex: '0 0 200px',
                height: '280px',
                background: 'rgba(15, 15, 15, 0.6)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '20px',
                opacity: 0.5,
                transform: 'scale(0.9)',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <div style={{
                background: 'rgba(15, 15, 15, 0.8)',
                borderRadius: '8px',
                padding: '8px',
                marginBottom: '12px',
                border: '1px solid rgba(255, 179, 71, 0.1)',
                overflow: 'hidden',
                height: '80px',
                flexShrink: 0
              }}>
                <img
                  src={testimonials[(currentTestimonialIndex - 1 + testimonials.length) % testimonials.length].image || testimonials[(currentTestimonialIndex - 1 + testimonials.length) % testimonials.length].imageAfter}
                  alt="Results"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                />
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '12px',
                fontStyle: 'italic',
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical'
              }}>
                &quot;{testimonials[(currentTestimonialIndex - 1 + testimonials.length) % testimonials.length].quote.substring(0, 100)}...&quot;
              </div>
            </div>

            {/* Main Testimonial Card */}
            <div
              key={currentTestimonialIndex}
              className="main-testimonial-card"
              style={{
                flex: '0 0 550px',
                minHeight: '420px',
                background: 'rgba(18, 18, 18, 0.5)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(167, 138, 67, 0.2)',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(167, 138, 67, 0.1)',
                animation: slideDirection === 'right' ? 'slideInRight 0.4s ease-out' : 'slideInLeft 0.4s ease-out',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Quote */}
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '16px',
                lineHeight: 1.8,
                fontStyle: 'italic',
                marginBottom: '24px'
              }}>
                &quot;{testimonials[currentTestimonialIndex].quote}&quot;
              </p>

              {/* Results Image - Clickable */}
              {(testimonials[currentTestimonialIndex].image || testimonials[currentTestimonialIndex].imageAfter) && (
                <div
                  onClick={() => setShowTestimonialGraphModal(testimonials[currentTestimonialIndex].image || testimonials[currentTestimonialIndex].imageAfter)}
                  className="testimonial-graph-clickable"
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '24px',
                    border: '1px solid rgba(167, 138, 67, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}>
                  <img
                    src={testimonials[currentTestimonialIndex].image || testimonials[currentTestimonialIndex].imageAfter}
                    alt="Results graph"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                  {/* Hover overlay */}
                  <div className="testimonial-graph-overlay" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(168, 139, 70, 0.08)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                  }}>
                    <span style={{
                      color: '#a88b46',
                      fontSize: '12px',
                      fontWeight: '600',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase'
                    }}>Click to expand</span>
                  </div>
                </div>
              )}

              {/* Author Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: 'auto' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #A78A43, #A78A43)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#0a0a0a'
                }}>
                  {testimonials[currentTestimonialIndex].name.charAt(0)}
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: '600', fontSize: '15px' }}>
                    {testimonials[currentTestimonialIndex].name}
                  </div>
                  {testimonials[currentTestimonialIndex].result && (
                    <div style={{ color: 'rgba(167, 138, 67, 0.8)', fontSize: '13px' }}>
                      {testimonials[currentTestimonialIndex].result}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Preview Card */}
            <div
              onClick={nextTestimonial}
              className="testimonial-preview-card"
              style={{
                flex: '0 0 200px',
                height: '280px',
                background: 'rgba(15, 15, 15, 0.6)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '20px',
                opacity: 0.5,
                transform: 'scale(0.9)',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <div style={{
                background: 'rgba(15, 15, 15, 0.8)',
                borderRadius: '8px',
                padding: '8px',
                marginBottom: '12px',
                border: '1px solid rgba(255, 179, 71, 0.1)',
                overflow: 'hidden',
                height: '80px',
                flexShrink: 0
              }}>
                <img
                  src={testimonials[(currentTestimonialIndex + 1) % testimonials.length].image || testimonials[(currentTestimonialIndex + 1) % testimonials.length].imageAfter}
                  alt="Results"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                />
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '12px',
                fontStyle: 'italic',
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical'
              }}>
                &quot;{testimonials[(currentTestimonialIndex + 1) % testimonials.length].quote.substring(0, 100)}...&quot;
              </div>
            </div>
          </div>

          {/* Carousel Controls */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '40px'
          }}>
            <button
              className="cinema-nav-btn"
              onClick={prevTestimonial}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(167, 138, 67, 0.1)',
                border: '1px solid rgba(167, 138, 67, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <ChevronLeft size={22} color="#A78A43" />
            </button>

            {/* Counter */}
            <div style={{
              color: 'rgba(240, 240, 240, 0.6)',
              fontSize: '14px',
              fontWeight: '500',
              minWidth: '60px',
              textAlign: 'center'
            }}>
              {currentTestimonialIndex + 1} / {testimonials.length}
            </div>

            <button
              className="cinema-nav-btn"
              onClick={nextTestimonial}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(167, 138, 67, 0.1)',
                border: '1px solid rgba(167, 138, 67, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <ChevronRight size={22} color="#A78A43" />
            </button>
          </div>

          {/* Testimonial Graph Modal */}
          {showTestimonialGraphModal && (
            <div
              onClick={() => setShowTestimonialGraphModal(null)}
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
                {/* Close Button */}
                <button
                  onClick={() => setShowTestimonialGraphModal(null)}
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

                {/* Graph Image */}
                <div style={{
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}>
                  <img
                    src={showTestimonialGraphModal}
                    alt="Results graph"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Testimonial styles */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes slideInRight {
              0% {
                opacity: 0;
                transform: translateX(40px);
              }
              100% {
                opacity: 1;
                transform: translateX(0);
              }
            }

            @keyframes slideInLeft {
              0% {
                opacity: 0;
                transform: translateX(-40px);
              }
              100% {
                opacity: 1;
                transform: translateX(0);
              }
            }

            .testimonial-preview-card:hover {
              opacity: 0.8 !important;
              transform: scale(0.95) !important;
              border-color: rgba(167, 138, 67, 0.2) !important;
            }
            .testimonial-graph-clickable:hover {
              border-color: rgba(168, 139, 70, 0.4) !important;
              transform: translateY(-2px);
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            }
            .testimonial-graph-clickable:hover .testimonial-graph-overlay {
              opacity: 1 !important;
            }
            @media (max-width: 1024px) {
              .testimonial-preview-card {
                display: none !important;
              }
              .main-testimonial-card {
                flex: 1 !important;
                max-width: 600px !important;
              }
            }
            @media (max-width: 600px) {
              .main-testimonial-card {
                padding: 28px !important;
              }
            }
          ` }} />
        </div>

        {/* ==================== DEAD SPACE: Cinema Transition Zone (halved per audit) ==================== */}
        <div style={{ height: '20vh', position: 'relative', zIndex: 0 }} />

        {/* ==================== YOUTUBE CINEMA SECTION ==================== */}
        {/* Premium Masterclass Library - Warm Gold Cinema */}
        <div
          className="reveal"
          id="videos"
          style={{
            position: 'relative',
            zIndex: 30,
            paddingTop: '100px',
            paddingBottom: '160px',
            marginBottom: '200px',
            scrollMarginTop: '90px'
          }}
        >
          {/* Cinematic Heading - Centered Museum Style */}
          <div style={{
            textAlign: 'center',
            marginBottom: '72px',
            padding: '0 24px'
          }}>
            <h2 style={{
              fontSize: 'clamp(38px, 5vw, 60px)',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '24px',
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              fontFamily: 'Manrope, Inter, sans-serif'
            }}>
              My Thought Process <span style={{
                color: '#A78A43',
                textShadow: '0 0 60px rgba(167, 138, 67, 0.4)'
              }}>in Action.</span>
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#8A8A8A',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.85,
              fontWeight: '400'
            }}>
              See my thought process in action. If this approach makes sense to you, you&apos;re in the right place.
            </p>
          </div>

          {/* Cinema Carousel Container */}
          <div style={{ position: 'relative' }}>
            {/* Gradient Fade Edges */}
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '100px',
              background: 'linear-gradient(to right, #0A0E1A 0%, transparent 100%)',
              zIndex: 10,
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '100px',
              background: 'linear-gradient(to left, #0A0E1A 0%, transparent 100%)',
              zIndex: 10,
              pointerEvents: 'none'
            }} />

            {/* Snap Scroll Carousel */}
            <div
              ref={cinemaCarouselRef}
              className="cinema-carousel"
              style={{
                display: 'flex',
                gap: '32px',
                padding: '40px 24px',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {videos.map((video, idx) => (
                <a
                  key={video.id}
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('outbound', { target: 'youtube_video' })}
                  className="cinema-video-card"
                  style={{
                    flex: '0 0 380px',
                    scrollSnapAlign: 'start',
                    textDecoration: 'none',
                    position: 'relative'
                  }}
                >
                  {/* Gold Bloom Glow Layer - Pulsing on Hover */}
                  <div
                    className="cinema-bloom"
                    style={{
                      position: 'absolute',
                      inset: '-30px',
                      background: 'radial-gradient(circle at 50% 50%, rgba(167, 138, 67, 0.4) 0%, rgba(167, 138, 67, 0.2) 40%, transparent 70%)',
                      opacity: 0,
                      filter: 'blur(30px)',
                      zIndex: 0,
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Thumbnail Container */}
                  <div
                    className="cinema-thumbnail-wrap"
                    style={{
                      position: 'relative',
                      borderRadius: '32px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                      zIndex: 1
                    }}
                  >
                    {/* Thumbnail Image - Warm Gold Tint Default */}
                    <div
                      className="cinema-thumbnail"
                      style={{
                        width: '100%',
                        height: '220px',
                        backgroundImage: `url(${video.thumbnail})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'sepia(0.4) saturate(0.8) brightness(0.6) hue-rotate(-10deg)',
                        transition: 'all 0.5s ease-in-out'
                      }}
                    />

                    {/* Permanent Play Icon - Subtle Default, Bright on Hover */}
                    <div
                      className="cinema-play-icon"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'transparent',
                        transition: 'all 0.4s ease'
                      }}
                    >
                      <div
                        className="play-button-inner"
                        style={{
                          width: '72px',
                          height: '72px',
                          borderRadius: '50%',
                          background: 'rgba(0, 0, 0, 0.3)',
                          backdropFilter: 'blur(4px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid rgba(167, 138, 67, 0.4)',
                          transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
                        }}
                      >
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="play-triangle"
                          style={{
                            marginLeft: '3px',
                            transition: 'all 0.4s ease'
                          }}
                        >
                          <polygon
                            points="5,3 19,12 5,21"
                            fill="rgba(167, 138, 67, 0.6)"
                            stroke="rgba(167, 138, 67, 0.8)"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Video Title - Parallax Layer */}
                  <div
                    className="cinema-title-wrap"
                    style={{
                      padding: '20px 8px 0',
                      transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                      zIndex: 1,
                      position: 'relative'
                    }}
                  >
                    <h4 style={{
                      color: '#F0F0F0',
                      fontSize: '16px',
                      fontWeight: '600',
                      lineHeight: 1.5,
                      marginBottom: '8px'
                    }}>
                      {video.title}
                    </h4>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#6B6B6B',
                      fontSize: '13px'
                    }}>
                      <Youtube size={14} color="#A78A43" />
                      <span>Nachos Poker</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Navigation Controls */}
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              marginTop: '48px'
            }}>
              <button
                className="cinema-nav-btn"
                onClick={prevVideo}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(167, 138, 67, 0.1)',
                  border: '1px solid rgba(167, 138, 67, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <ChevronLeft size={24} color="#A78A43" />
              </button>
              <button
                className="cinema-nav-btn"
                onClick={nextVideo}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(167, 138, 67, 0.1)',
                  border: '1px solid rgba(167, 138, 67, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <ChevronRight size={24} color="#A78A43" />
              </button>
            </div>

            {/* View All Link */}
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <a
                href="https://www.youtube.com/@nachospoker"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('outbound', { target: 'youtube_channel' })}
                style={{
                  color: '#A78A43',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: 0.8,
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
              >
                View all on YouTube <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Cinema Carousel Styles - Warm Gold Cinema */}
          <style dangerouslySetInnerHTML={{ __html: `
            .cinema-carousel::-webkit-scrollbar {
              display: none;
            }

            @keyframes bloomPulse {
              0%, 100% { opacity: 0.8; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.05); }
            }

            .cinema-video-card:hover .cinema-bloom {
              opacity: 1 !important;
              animation: bloomPulse 2s ease-in-out infinite;
            }

            .cinema-video-card:hover .cinema-thumbnail-wrap {
              transform: scale(1.05);
              border-color: rgba(167, 138, 67, 0.5);
              box-shadow: 0 0 50px rgba(167, 138, 67, 0.35);
            }

            .cinema-video-card:hover .cinema-thumbnail {
              transform: scale(1.08);
              filter: sepia(0) saturate(1) brightness(1) hue-rotate(0deg) !important;
            }

            .cinema-video-card:hover .play-button-inner {
              background: rgba(167, 138, 67, 0.2) !important;
              border-color: rgba(255, 215, 0, 0.8) !important;
              transform: scale(1.1);
              box-shadow: 0 0 30px rgba(167, 138, 67, 0.5);
            }

            .cinema-video-card:hover .play-triangle polygon {
              fill: #A78A43 !important;
              stroke: #FFFFFF !important;
            }

            .cinema-video-card:hover .cinema-title-wrap {
              transform: translateY(-4px);
            }

            .cinema-nav-btn:hover {
              background: rgba(167, 138, 67, 0.2) !important;
              border-color: rgba(167, 138, 67, 0.5) !important;
              transform: scale(1.05);
            }

            @media (max-width: 768px) {
              .cinema-video-card {
                flex: 0 0 320px !important;
              }
              .cinema-thumbnail {
                height: 180px !important;
              }
            }
          ` }} />
        </div>

        {/* ==================== OFFER - The 6-Month Program ==================== */}
        <OfferSection />

        {/* ==================== FIT SECTION ==================== */}
        <FitSection />

        {/* ==================== FAQ ==================== */}
        <HomeFAQ />

        {/* ==================== FINAL CTA ==================== */}
        <FinalCTA />

        {/* ==================== THREE PATHS STRIP ==================== */}
        <div
          className="reveal"
          style={{ marginBottom: '200px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: 'clamp(30px, 3.6vw, 42px)',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '14px',
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              fontFamily: 'Manrope, Inter, sans-serif'
            }}>
              Three ways to <span style={{
                color: '#a88b46',
                textShadow: '0 0 60px rgba(168, 139, 70, 0.4)'
              }}>work with me.</span>
            </h2>
            <p style={{
              color: 'rgba(240, 240, 240, 0.5)',
              fontSize: '15px',
              lineHeight: 1.7,
              maxWidth: '480px',
              margin: '0 auto'
            }}>
              Different situations need different deals. Pick the honest one for yours.
            </p>
          </div>
          <ThreePaths compact context="home" />
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <a
              href="/coaching"
              onClick={() => track('cta_click', { placement: 'threepaths_compare' })}
              style={{
                color: '#a88b46',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Compare the three paths in detail <ArrowRight size={15} />
            </a>
          </div>
        </div>

        {/* ==================== SAFETY NET SECTION ==================== */}
        <div
          className="reveal"
          style={{
            marginBottom: '200px'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <h2 style={{
              fontSize: 'clamp(38px, 5vw, 52px)',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '20px',
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              fontFamily: 'Manrope, Inter, sans-serif'
            }}>
              Verify the <span style={{
                color: '#a88b46',
                textShadow: '0 0 60px rgba(168, 139, 70, 0.4)'
              }}>approach.</span>
            </h2>
            <p style={{
              color: 'rgba(240, 240, 240, 0.55)',
              fontSize: '17px',
              maxWidth: '580px',
              margin: '0 auto',
              lineHeight: 1.8
            }}>
              If you aren&apos;t ready for a full program, explore these professional tools and technical deep dives. See for yourself if this logic aligns with your game before we work together.
            </p>
          </div>

          {/* Three-Card Grid */}
          <div
            className="safety-net-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '28px',
              maxWidth: '1100px',
              margin: '0 auto'
            }}>
            {/* Card A - Strategy Vault (Articles) */}
            <a
              href="/newsletters"
              className="safety-net-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(18, 18, 18, 0.4)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(168, 139, 70, 0.25)',
                borderRadius: '24px',
                padding: '48px 40px',
                textDecoration: 'none',
                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Hover glow */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 0%, rgba(168, 139, 70, 0.1) 0%, transparent 60%)',
                opacity: 0,
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none'
              }} className="safety-net-glow" />

              {/* Gold-line icon */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                border: '1.5px solid rgba(168, 139, 70, 0.4)',
                background: 'rgba(168, 139, 70, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '28px'
              }}>
                <BookOpen size={26} color="#a88b46" strokeWidth={1.5} />
              </div>

              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px',
                letterSpacing: '-0.01em'
              }}>
                The Strategy Vault
              </h3>

              <p style={{
                fontSize: '15px',
                color: 'rgba(240, 240, 240, 0.55)',
                lineHeight: 1.7,
                marginBottom: '28px',
                flex: 1
              }}>
                Technical deep dives into high-stakes theory and population exploits.
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#a88b46',
                fontSize: '14px',
                fontWeight: '600',
                letterSpacing: '0.02em'
              }}>
                Explore Articles <ArrowRight size={16} />
              </div>
            </a>

            {/* Card B - Performance Toolkit (Tools) */}
            <a
              href="/tools"
              className="safety-net-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(18, 18, 18, 0.4)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(168, 139, 70, 0.25)',
                borderRadius: '24px',
                padding: '48px 40px',
                textDecoration: 'none',
                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Hover glow */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 0%, rgba(168, 139, 70, 0.1) 0%, transparent 60%)',
                opacity: 0,
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none'
              }} className="safety-net-glow" />

              {/* Gold-line icon */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                border: '1.5px solid rgba(168, 139, 70, 0.4)',
                background: 'rgba(168, 139, 70, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '28px'
              }}>
                <Calculator size={26} color="#a88b46" strokeWidth={1.5} />
              </div>

              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px',
                letterSpacing: '-0.01em'
              }}>
                The Performance Toolkit
              </h3>

              <p style={{
                fontSize: '15px',
                color: 'rgba(240, 240, 240, 0.55)',
                lineHeight: 1.7,
                marginBottom: '28px',
                flex: 1
              }}>
                Professional-grade bankroll, variance, and win-rate calculators.
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#a88b46',
                fontSize: '14px',
                fontWeight: '600',
                letterSpacing: '0.02em'
              }}>
                Access Tools <ArrowRight size={16} />
              </div>
            </a>

            {/* Card C - Which Path (Coaching router) */}
            <a
              href="/coaching"
              onClick={() => track('cta_click', { placement: 'safety_coaching' })}
              className="safety-net-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(18, 18, 18, 0.4)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(168, 139, 70, 0.25)',
                borderRadius: '24px',
                padding: '48px 40px',
                textDecoration: 'none',
                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Hover glow */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 0%, rgba(168, 139, 70, 0.1) 0%, transparent 60%)',
                opacity: 0,
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none'
              }} className="safety-net-glow" />

              {/* Gold-line icon */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                border: '1.5px solid rgba(168, 139, 70, 0.4)',
                background: 'rgba(168, 139, 70, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '28px'
              }}>
                <Compass size={26} color="#a88b46" strokeWidth={1.5} />
              </div>

              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px',
                letterSpacing: '-0.01em'
              }}>
                Not sure which path?
              </h3>

              <p style={{
                fontSize: '15px',
                color: 'rgba(240, 240, 240, 0.55)',
                lineHeight: 1.7,
                marginBottom: '28px',
                flex: 1
              }}>
                Compare the three ways to work with me: course, program, or CFP.
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#a88b46',
                fontSize: '14px',
                fontWeight: '600',
                letterSpacing: '0.02em'
              }}>
                Compare Paths <ArrowRight size={16} />
              </div>
            </a>
          </div>

          {/* Inline Newsletter Capture - catches visitors not ready to apply */}
          <div style={{
            maxWidth: '640px',
            margin: '72px auto 0',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#F0F0F0',
              marginBottom: '12px'
            }}>
              Not ready for a program?
            </h3>
            <p style={{
              fontSize: '15px',
              color: 'rgba(240, 240, 240, 0.55)',
              lineHeight: 1.7,
              marginBottom: '28px'
            }}>
              Get the Nachos Exploits newsletter. Population exploits and data-driven strategy every two weeks, free.
            </p>
            {inlineStatus === 'success' ? (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                color: '#A78A43',
                fontSize: '15px',
                fontWeight: '600',
                padding: '16px 24px',
                background: 'rgba(167, 138, 67, 0.08)',
                border: '1px solid rgba(167, 138, 67, 0.3)',
                borderRadius: '12px'
              }}>
                <Check size={18} /> You&apos;re in! Check your inbox.
              </div>
            ) : (
              <>
                <form
                  onSubmit={handleInlineSubscribe}
                  className="inline-newsletter-form"
                  style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}
                >
                  <input
                    type="email"
                    required
                    value={inlineEmail}
                    onChange={(e) => setInlineEmail(e.target.value)}
                    placeholder="you@email.com"
                    style={{
                      flex: '1 1 280px',
                      maxWidth: '340px',
                      padding: '15px 20px',
                      borderRadius: '12px',
                      border: '1px solid rgba(167, 138, 67, 0.3)',
                      background: 'rgba(18, 18, 18, 0.6)',
                      color: '#F0F0F0',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={inlineStatus === 'loading'}
                    className="btn-hover"
                    style={{
                      padding: '15px 28px',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#A78A43',
                      color: '#0a0a0a',
                      fontWeight: '700',
                      fontSize: '15px',
                      cursor: 'pointer',
                      opacity: inlineStatus === 'loading' ? 0.7 : 1
                    }}
                  >
                    {inlineStatus === 'loading' ? 'Subscribing…' : 'Subscribe'}
                  </button>
                </form>
                <div style={{
                  marginTop: '14px',
                  fontSize: '12px',
                  color: 'rgba(240, 240, 240, 0.4)'
                }}>
                  No spam. Unsubscribe anytime.
                </div>
                {inlineStatus === 'error' && (
                  <div style={{
                    marginTop: '12px',
                    fontSize: '13px',
                    color: '#ef4444'
                  }}>
                    Something went wrong. Please try again.
                  </div>
                )}
              </>
            )}
          </div>

          {/* Safety Net Styles */}
          <style dangerouslySetInnerHTML={{ __html: `
            .safety-net-card {
              box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
            }
            .safety-net-card:hover {
              transform: translateY(-6px);
              border-color: rgba(168, 139, 70, 0.45) !important;
              box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4), 0 0 40px rgba(168, 139, 70, 0.1);
            }
            .safety-net-card:hover .safety-net-glow {
              opacity: 1 !important;
            }
            @media (max-width: 1024px) {
              .safety-net-grid {
                grid-template-columns: 1fr !important;
                max-width: 420px !important;
              }
              .safety-net-card {
                padding: 40px 32px !important;
              }
            }
          ` }} />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default PokerToolboxHome;

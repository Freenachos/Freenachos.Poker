"use client";

import NachosPokerNavBar from '@/components/NachosPokerNavBar';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ArrowRight, 
  BarChart3, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Trophy, 
  BookOpen,
  Calculator,
  Percent,
  Activity,
  PieChart,
  Layers,
  Zap
} from 'lucide-react';

/**
 * Freenachos Poker - Tools Page
 * 
 * 100% visual parity with the home page:
 * - Identical Bokeh Nachos particle system
 * - Same glassmorphism styling
 * - Matching gold (#a88b46) theming
 * - Consistent typography
 */

const ToolsPage = () => {
  // ============================================
  // STATE
  // ============================================
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // ============================================
  // DATA
  // ============================================
  
  const tools = [
    { 
      id: 1, 
      name: 'Variance Calculator', 
      description: 'Simulate your expected variance and downswings over any sample size. Understand the reality of short-term results.', 
      icon: BarChart3, 
      link: '/variance',
      category: 'Analysis'
    },
    { 
      id: 2, 
      name: 'Win Rate Dashboard', 
      description: 'Track and analyze your win rate across different stakes and formats. Identify trends in your performance.', 
      icon: TrendingUp, 
      link: '/winrate',
      category: 'Tracking'
    },
    { 
      id: 3, 
      name: 'Seat Selection EV', 
      description: 'Visualize how fish position impacts your win rate at 6-max tables. Optimize your table selection strategy.', 
      icon: Target, 
      link: '/seat',
      category: 'Strategy'
    },
    { 
      id: 4, 
      name: 'Profits Tracker', 
      description: 'Monitor your poker profits and track your bankroll growth over time. Set goals and measure progress.', 
      icon: DollarSign, 
      link: '/profits',
      category: 'Tracking'
    },
    { 
      id: 5, 
      name: 'Bad Beat Jackpot', 
      description: 'Track bad beat jackpot sizes and expected value across poker rooms. Find the most +EV tables.', 
      icon: Trophy, 
      link: '/bad-beat-jackpot',
      category: 'Analysis'
    },
    { 
      id: 6, 
      name: 'Bankroll Calculator', 
      description: 'Calculate optimal bankroll requirements for your stakes and risk tolerance. Never go broke again.', 
      icon: Calculator, 
      link: '/bankroll',
      category: 'Analysis'
    },
    { 
      id: 7, 
      name: 'Rakeback Estimator', 
      description: 'Estimate your rakeback earnings across different poker sites and VIP programs.', 
      icon: Percent, 
      link: '/rakeback',
      category: 'Tracking'
    },
    { 
      id: 8, 
      name: 'Session Analyzer', 
      description: 'Deep dive into individual sessions. Identify leaks and patterns in your play.', 
      icon: Activity, 
      link: '/sessions',
      category: 'Analysis'
    }
  ];

  // ============================================
  // FILTERED TOOLS
  // ============================================
  
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools;
    const query = searchQuery.toLowerCase();
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // ============================================
  // SCROLL REVEAL ANIMATION
  // ============================================
  
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

    const revealElements = document.querySelectorAll('.reveal, .reveal-first');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // ============================================
  // RENDER
  // ============================================

  return (
    <div style={{
      minHeight: '100vh', 
      background: '#0A0A0A', 
      position: 'relative', 
      overflow: 'hidden', 
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
        
        /* Smooth Scroll Behavior & Prevent Horizontal Scroll */
        html, body {
          scroll-behavior: smooth;
          overflow-x: hidden;
        }

        /* Noise Texture Overlay */
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        /* Scroll Reveal Animation */
        .reveal {
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1), transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .reveal-first {
          opacity: 0;
          transform: translateY(80px);
          transition: opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1), transform 1.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        
        .reveal-first.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* === DEPTH-OF-FIELD BOKEH ANIMATIONS === */
        
        /* PERIPHERAL: Ultra-Large, Extreme Slow Wobble */
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
        
        /* FOREGROUND: Large, Heavy, Slow */
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
        
        /* MIDGROUND: Medium, Soft Blur */
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
        
        /* BACKGROUND: Small, Sharp, Fast */
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

        @keyframes traceBorder {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }

        /* Glassmorphism Card Base */
        .glass-card {
          background: rgba(18, 18, 18, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(167, 138, 67, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        /* Tool Card Styling */
        .tool-card {
          background: rgba(18, 18, 18, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(168, 139, 70, 0.25);
          border-radius: 24px;
          padding: 48px 40px;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
        }

        .tool-card:hover {
          transform: translateY(-6px);
          border-color: rgba(168, 139, 70, 0.45);
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4), 0 0 40px rgba(168, 139, 70, 0.1);
        }

        .tool-card:hover .tool-card-glow {
          opacity: 1;
        }

        .tool-card:hover .tool-icon-container {
          background: rgba(168, 139, 70, 0.15);
          border-color: rgba(168, 139, 70, 0.6);
          box-shadow: 0 0 20px rgba(168, 139, 70, 0.25);
        }

        /* Search Input Styling */
        .search-container {
          position: relative;
          max-width: 480px;
          margin: 0 auto;
        }

        .search-input {
          width: 100%;
          background: rgba(18, 18, 18, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1.5px solid rgba(168, 139, 70, 0.25);
          border-radius: 16px;
          padding: 18px 24px 18px 56px;
          font-size: 16px;
          color: #FFFFFF;
          outline: none;
          transition: all 0.3s ease;
        }

        .search-input::placeholder {
          color: rgba(240, 240, 240, 0.4);
        }

        .search-input:focus {
          border-color: #a88b46;
          box-shadow: 0 0 0 4px rgba(168, 139, 70, 0.15), 0 0 30px rgba(168, 139, 70, 0.2);
        }

        /* Spark Border Effect for Focused Search */
        .search-spark {
          position: absolute;
          top: 0;
          left: 0;
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #A78A43 50%, #A78A43 100%);
          box-shadow: 0 0 15px 2px rgba(167, 138, 67, 0.7);
          offset-path: rect(0 100% 100% 0 round 16px);
          animation: traceBorder 4s linear infinite;
          offset-rotate: auto;
          offset-anchor: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .search-spark.active {
          opacity: 1;
        }

        /* Responsive Grid */
        @media (max-width: 1024px) {
          .tools-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 680px) {
          .tools-grid {
            grid-template-columns: 1fr !important;
          }
          .tool-card {
            padding: 40px 32px !important;
          }
        }

        /* Launch Button */
        .launch-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1.5px solid #a88b46;
          color: #a88b46;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .launch-btn:hover {
          background: #a88b46;
          color: #0a0a0a;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(168, 139, 70, 0.3);
        }
      `}</style>

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

      {/* === LAYER 0: PERIPHERAL BOKEH - Ultra-Large, Extreme Blur === */}
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
        <div style={{
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
        <div style={{
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
        <div style={{
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
        <div style={{
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
        <div style={{
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
        <div style={{
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
        <div style={{
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
        <div style={{
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
        <div style={{
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
        <div style={{
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
        
        {/* Background Nacho 1 */}
        <div style={{
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
        <div style={{
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
        <div style={{
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
        <div style={{
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
        <div style={{
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
        <div style={{
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
        <div style={{
          position: 'absolute',
          bottom: '35%',
          right: '25%',
          width: '13px',
          height: '13px',
          opacity: 0.36,
          filter: 'blur(0px) drop-shadow(0 0 3px rgba(167, 138, 67, 0.55))',
          animation: 'backgroundDart1 17s ease-in-out infinite',
          animationDelay: '-9s'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon points="50,5 95,95 5,95" fill="#A78A43" />
          </svg>
        </div>

        {/* Background Nacho 8 */}
        <div style={{
          position: 'absolute',
          top: '18%',
          right: '40%',
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

        {/* Background Nacho 9 */}
        <div style={{
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

        {/* Background Nacho 10 */}
        <div style={{
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

      {/* ==================== MAIN CONTENT ==================== */}
      <div 
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 48px',
          paddingTop: '160px',
          paddingBottom: '120px'
        }}
      >
        {/* ==================== HERO SECTION ==================== */}
        <div 
          className="reveal-first"
          style={{
            textAlign: 'center',
            marginBottom: '80px',
            animation: 'heroFadeIn 1s ease-out 0.2s both'
          }}
        >
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(167, 138, 67, 0.08)',
            border: '1px solid rgba(167, 138, 67, 0.2)',
            borderRadius: '30px',
            padding: '8px 20px',
            marginBottom: '28px'
          }}>
            <Calculator size={16} color="#A78A43" />
            <span style={{ 
              fontSize: '13px', 
              color: '#A78A43', 
              fontWeight: '600', 
              letterSpacing: '0.05em', 
              textTransform: 'uppercase' 
            }}>
              Free Access
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(38px, 5vw, 56px)',
            fontWeight: '800',
            color: '#FFFFFF',
            marginBottom: '24px',
            lineHeight: 1.08,
            letterSpacing: '-0.025em',
            fontFamily: 'Manrope, Inter, sans-serif'
          }}>
            Performance <span style={{ 
              color: '#A78A43',
              textShadow: '0 0 60px rgba(167, 138, 67, 0.4)'
            }}>Toolkit</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '18px',
            color: 'rgba(240, 240, 240, 0.6)',
            lineHeight: 1.85,
            maxWidth: '560px',
            margin: '0 auto 48px'
          }}>
            Professional-grade calculators and analyzers to optimize your bankroll, understand variance, and track your results with precision.
          </p>

          {/* Search Filter */}
          <div className="search-container">
            <Search 
              size={20} 
              color={searchFocused ? '#a88b46' : 'rgba(240, 240, 240, 0.4)'}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                transition: 'color 0.3s ease',
                pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              className="search-input"
              placeholder="Search tools by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <div className={`search-spark ${searchFocused ? 'active' : ''}`} />
          </div>
        </div>

        {/* ==================== TOOLS GRID ==================== */}
        <div 
          className="reveal tools-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px'
          }}
        >
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <a 
                key={tool.id}
                href={tool.link}
                className="tool-card"
              >
                {/* Hover glow */}
                <div 
                  className="tool-card-glow"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 0%, rgba(168, 139, 70, 0.1) 0%, transparent 60%)',
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                    pointerEvents: 'none'
                  }} 
                />
                
                {/* Category Badge */}
                <div style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#a88b46',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  background: 'rgba(168, 139, 70, 0.1)',
                  padding: '6px 12px',
                  borderRadius: '20px'
                }}>
                  {tool.category}
                </div>
                
                {/* Gold-line icon */}
                <div 
                  className="tool-icon-container"
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    border: '1.5px solid rgba(168, 139, 70, 0.4)',
                    background: 'rgba(168, 139, 70, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '28px',
                    transition: 'all 0.4s ease'
                  }}
                >
                  <Icon size={26} color="#a88b46" strokeWidth={1.5} />
                </div>
                
                {/* Title */}
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px',
                  letterSpacing: '-0.01em'
                }}>
                  {tool.name}
                </h3>
                
                {/* Description */}
                <p style={{
                  fontSize: '15px',
                  color: 'rgba(240, 240, 240, 0.55)',
                  lineHeight: 1.7,
                  marginBottom: '28px',
                  flex: 1
                }}>
                  {tool.description}
                </p>
                
                {/* Launch CTA */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#a88b46',
                  fontSize: '14px',
                  fontWeight: '600',
                  letterSpacing: '0.02em'
                }}>
                  Launch Tool <ArrowRight size={16} />
                </div>
              </a>
            );
          })}
        </div>

        {/* No Results State */}
        {filteredTools.length === 0 && (
          <div 
            className="reveal"
            style={{
              textAlign: 'center',
              padding: '80px 40px',
              background: 'rgba(18, 18, 18, 0.4)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(168, 139, 70, 0.15)',
              borderRadius: '24px'
            }}
          >
            <Search size={48} color="rgba(168, 139, 70, 0.3)" style={{ marginBottom: '24px' }} />
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              No tools found
            </h3>
            <p style={{
              fontSize: '15px',
              color: 'rgba(240, 240, 240, 0.5)',
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              Try adjusting your search terms or browse all available tools above.
            </p>
          </div>
        )}

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          padding: '80px 0 40px',
          marginTop: '80px',
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
};

export default ToolsPage;

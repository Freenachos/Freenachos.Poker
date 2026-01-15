'use client';

import NachosPokerNavBar from '@/components/NachosPokerNavBar';

import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Play, ChevronLeft, ChevronRight, Calculator, Target, TrendingUp, BookOpen, User, Youtube, ArrowRight, Sparkles, BarChart3, Percent, DollarSign } from 'lucide-react';

/**
 * Freenachos Poker Toolbox Homepage
 * 
 * Main landing page featuring:
 * - Hero section with branding
 * - About section
 * - YouTube video carousel
 * - Featured articles
 * - Tools preview grid
 */

const PokerToolboxHome = () => {
  // ============================================
  // STATE
  // ============================================
  
  const [nachos, setNachos] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const nachoRef = useRef(null);

  // ============================================
  // PLACEHOLDER DATA - Replace with real content later
  // ============================================
  
  const videos = [
    { id: 1, title: 'How to Exploit Fish in 6-Max', thumbnail: 'https://picsum.photos/seed/poker1/400/225', duration: '12:34', views: '24K' },
    { id: 2, title: 'Seat Selection Masterclass', thumbnail: 'https://picsum.photos/seed/poker2/400/225', duration: '18:22', views: '31K' },
    { id: 3, title: 'Bankroll Management 101', thumbnail: 'https://picsum.photos/seed/poker3/400/225', duration: '15:47', views: '19K' },
    { id: 4, title: 'GTO vs Exploitative Play', thumbnail: 'https://picsum.photos/seed/poker4/400/225', duration: '22:15', views: '42K' },
    { id: 5, title: 'Reading Opponents Live', thumbnail: 'https://picsum.photos/seed/poker5/400/225', duration: '14:08', views: '28K' },
  ];

  const articles = [
    { id: 1, title: 'The Ultimate Guide to Table Selection', category: 'Strategy', readTime: '8 min', excerpt: 'Learn how to identify profitable tables and maximize your hourly rate with proper table selection techniques.' },
    { id: 2, title: 'Understanding VPIP and What It Tells You', category: 'Fundamentals', readTime: '5 min', excerpt: 'VPIP is one of the most important stats in poker. Here\'s how to use it to categorize your opponents.' },
    { id: 3, title: 'Bankroll Management for Serious Players', category: 'Mindset', readTime: '10 min', excerpt: 'The mathematical approach to never going broke while maximizing your growth potential.' },
  ];

  const tools = [
    { id: 1, name: 'Seat Selection EV', description: 'Visualize how fish position impacts your win rate at 6-max tables', icon: Target, color: '#22c55e', link: '/seat-selection' },
    { id: 2, name: 'Bankroll Calculator', description: 'Calculate proper bankroll requirements for any stake level', icon: Calculator, color: '#3b82f6', link: '/bankroll' },
    { id: 3, name: 'EV Calculator', description: 'Compute expected value for any poker decision', icon: TrendingUp, color: '#FFB347', link: '/ev-calc' },
    { id: 4, name: 'Equity Calculator', description: 'Calculate hand equity vs ranges in various scenarios', icon: Percent, color: '#a855f7', link: '/equity' },
    { id: 5, name: 'Pot Odds Trainer', description: 'Practice calculating pot odds in real-time scenarios', icon: BarChart3, color: '#ef4444', link: '/pot-odds' },
    { id: 6, name: 'Rake Calculator', description: 'Compare rake structures across different poker sites', icon: DollarSign, color: '#14b8a6', link: '/rake' },
  ];

  // ============================================
  // NACHO MASCOT LOGIC
  // ============================================
  
useEffect(() => {
    if (showLogin) return;
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [showLogin]);

  const getEyeOffset = () => {
    if (!nachoRef.current) return { x: 0, y: 0 };
    const rect = nachoRef.current.getBoundingClientRect();
    const nachoCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    const angle = Math.atan2(mousePos.y - nachoCenter.y, mousePos.x - nachoCenter.x);
    const distance = Math.min(3, Math.hypot(mousePos.x - nachoCenter.x, mousePos.y - nachoCenter.y) / 50);
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    };
  };

  useEffect(() => {
    const newNachos = Array.from({ length: 54 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 12 + Math.random() * 28,
      duration: 40 + Math.random() * 20,
      delay: Math.random() * 20,
      rotation: Math.random() * 360,
      opacity: 0.4 + Math.random() * 0.5,
      moveX: Math.random() * 200 - 100,
      moveY: Math.random() * 200 - 100
    }));
    setNachos(newNachos);
  }, []);

  const eyeOffset = getEyeOffset();

  // ============================================
  // VIDEO CAROUSEL HANDLERS
  // ============================================
  
  const maxIndex = Math.max(0, videos.length - 3); // Show 3 at a time
  
  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // ============================================
  // COMPONENTS
  // ============================================

  const CartoonNacho = ({ size = 90 }) => (
    <svg ref={nachoRef} width={size} height={size} viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 4px 12px rgba(255, 179, 71, 0.4))' }}>
      <path d="M50 8 L88 85 Q90 92 82 92 L18 92 Q10 92 12 85 Z" fill="#FFB347" stroke="#E09A30" strokeWidth="2"/>
      <path d="M25 70 Q20 75 22 82 Q24 88 28 85 Q30 80 28 75 Z" fill="#FFD54F" opacity="0.9"/>
      <path d="M72 65 Q78 72 76 80 Q74 86 70 82 Q68 76 70 70 Z" fill="#FFD54F" opacity="0.9"/>
      <path d="M48 75 Q45 82 48 88 Q52 92 55 86 Q56 80 52 76 Z" fill="#FFD54F" opacity="0.9"/>
      <ellipse cx="50" cy="50" rx="22" ry="18" fill="#FFB347" />
      <ellipse cx="40" cy="48" rx="8" ry="9" fill="white" />
      <ellipse cx="60" cy="48" rx="8" ry="9" fill="white" />
      <circle cx={40 + eyeOffset.x} cy={48 + eyeOffset.y} r="4" fill="#1a1a1a" style={{ transition: 'cx 0.1s ease-out, cy 0.1s ease-out' }}/>
      <circle cx={60 + eyeOffset.x} cy={48 + eyeOffset.y} r="4" fill="#1a1a1a" style={{ transition: 'cx 0.1s ease-out, cy 0.1s ease-out' }}/>
      <circle cx={38 + eyeOffset.x * 0.5} cy={46 + eyeOffset.y * 0.5} r="1.5" fill="white" opacity="0.8" />
      <circle cx={58 + eyeOffset.x * 0.5} cy={46 + eyeOffset.y * 0.5} r="1.5" fill="white" opacity="0.8" />
      <path d="M38 62 Q50 72 62 62" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
      <path d="M33 38 Q40 35 47 38" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      <path d="M53 38 Q60 35 67 38" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="30" r="2" fill="#E09A30" opacity="0.5" />
      <circle cx="70" cy="35" r="2.5" fill="#E09A30" opacity="0.5" />
      <circle cx="35" cy="80" r="2" fill="#E09A30" opacity="0.5" />
      <circle cx="65" cy="78" r="1.5" fill="#E09A30" opacity="0.5" />
    </svg>
  );

  const NachoTriangle = ({ size, opacity }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ opacity }}>
      <path d="M10 2 L18 17 L2 17 Z" fill="#FFB347" opacity="0.8"/>
    </svg>
  );

  const VideoCard = ({ video, index = 0 }) => (
    <div 
      className="video-card"
      style={{
        background: 'rgba(20, 20, 20, 0.6)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        flex: '0 0 300px',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div 
          className="video-thumbnail"
          style={{
            width: '100%',
            height: '170px',
            backgroundImage: `url(${video.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: 'rgba(255, 179, 71, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.4s ease'
          }}
        >
          <div className="play-button" style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(255, 179, 71, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(255, 179, 71, 0.4)'
          }}>
            <Play size={24} color="#0a0a0a" fill="#0a0a0a" style={{ marginLeft: '3px' }} />
          </div>
        </div>
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          background: 'rgba(0,0,0,0.85)',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          color: 'white',
          fontWeight: '500'
        }}>
          {video.duration}
        </div>
      </div>
      <div style={{ padding: '16px' }}>
        <h4 style={{
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '8px',
          lineHeight: 1.4
        }}>
          {video.title}
        </h4>
        <span style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.5)'
        }}>
          {video.views} views
        </span>
      </div>
    </div>
  );

  const ArticleCard = ({ article }) => (
    <div 
      className="card-hover glass-card"
      style={{
        borderRadius: '12px',
        padding: '24px',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px'
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: '600',
          color: '#FFB347',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          background: 'rgba(255, 179, 71, 0.15)',
          padding: '4px 10px',
          borderRadius: '20px'
        }}>
          {article.category}
        </span>
        <span style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.4)'
        }}>
          {article.readTime} read
        </span>
      </div>
      <h3 style={{
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '12px',
        lineHeight: 1.3
      }}>
        {article.title}
      </h3>
      <p style={{
        color: 'rgba(255,255,255,0.6)',
        fontSize: '13px',
        lineHeight: 1.6,
        flex: 1,
        marginBottom: '16px'
      }}>
        {article.excerpt}
      </p>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: '#FFB347',
        fontSize: '13px',
        fontWeight: '500'
      }}>
        Read more <ArrowRight size={14} />
      </div>
    </div>
  );

  const ToolCard = ({ tool }) => {
    const Icon = tool.icon;
    return (
      <div 
        className="card-hover glass-card"
        style={{
          borderRadius: '12px',
          padding: '24px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '100px',
          height: '100px',
          background: `radial-gradient(circle, ${tool.color}20 0%, transparent 70%)`,
          pointerEvents: 'none'
        }} />
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: `${tool.color}20`,
          border: `1px solid ${tool.color}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <Icon size={24} color={tool.color} />
        </div>
        <h3 style={{
          color: '#ffffff',
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '8px'
        }}>
          {tool.name}
        </h3>
        <p style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '13px',
          lineHeight: 1.5,
          marginBottom: '16px'
        }}>
          {tool.description}
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: tool.color,
          fontSize: '13px',
          fontWeight: '500'
        }}>
          Open tool <ArrowRight size={14} />
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div style={{minHeight: '100vh', background: '#0a0a0a', position: 'relative', overflow: 'hidden', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'}}>
      {/* Floating Nachos Background */}
      <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1}}>
        {nachos.map(nacho => (
          <div
            key={nacho.id}
            style={{
              position: 'absolute',
              left: `${nacho.x}%`,
              top: `${nacho.y}%`,
              animation: `floatNacho ${nacho.duration}s ease-in-out infinite`,
              animationDelay: `${nacho.delay}s`,
              '--moveX': `${nacho.moveX}px`,
              '--moveY': `${nacho.moveY}px`
            }}
          >
            <NachoTriangle size={nacho.size} opacity={nacho.opacity} />
          </div>
        ))}
      </div>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        @keyframes floatNacho {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(var(--moveX), var(--moveY)) rotate(180deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes traceBorder {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .glass-card {
          background: rgba(20, 20, 20, 0.6);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }
        .btn-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-hover:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        .btn-hover:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .spark-border {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          background: #0a0a0a;
        }
        
        .spark-border::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(135deg, rgba(255, 179, 71, 0.3), rgba(255, 179, 71, 0.1));
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          z-index: 1;
          pointer-events: none;
        }
        
        .spark-border::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100px;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #FFB347 50%, #FFB347 100%);
          box-shadow: 0 0 10px 1px rgba(255, 179, 71, 0.6);
          offset-path: rect(0 100% 100% 0 round 16px);
          animation: traceBorder 5s linear infinite;
          offset-rotate: auto;
          offset-anchor: center;
          z-index: 2;
          pointer-events: none;
        }

        .hero-gradient {
          background: radial-gradient(ellipse at 50% 0%, rgba(255, 179, 71, 0.15) 0%, transparent 50%);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .section-title h2 {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }
        .section-title .line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(255, 179, 71, 0.3), transparent);
        }

        .carousel-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 179, 71, 0.2);
          border: 1px solid rgba(255, 179, 71, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .carousel-btn:hover {
          background: rgba(255, 179, 71, 0.3);
          border-color: #FFB347;
        }

        .video-card {
          transform: translateX(0);
        }
        .video-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(255, 179, 71, 0.2);
          border-color: rgba(255, 179, 71, 0.3);
        }
        .video-card:hover .video-thumbnail {
          transform: scale(1.05);
        }
        .video-card:hover .play-button {
          transform: scale(1.15);
          box-shadow: 0 8px 30px rgba(255, 179, 71, 0.6);
        }

        @keyframes carouselSlide {
          from {
            transform: translateX(20px);
          }
          to {
            transform: translateX(0);
          }
        }

        .video-carousel {
          animation: carouselSlide 0.3s ease-out;
        }
      `}</style>

      <div style={{position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', padding: '20px'}}>
        <NachosPokerNavBar />
        
        {/* Hero Section with Spark Border */}
        <div 
          className="spark-border"
          style={{
            marginBottom: '40px',
            animation: 'fadeInUp 0.6s ease-out 0.1s both',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div 
            className="hero-gradient"
            style={{
              padding: '50px 40px',
              display: 'flex',
              alignItems: 'center',
              gap: '40px',
              flexWrap: 'wrap'
            }}
          >
            {/* Nacho Mascot on Left */}
            <div style={{
              flex: '0 0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              animation: 'bounce 2s ease-in-out infinite'
            }}>
              <CartoonNacho size={120} />
              <div style={{
                fontSize: '12px',
                color: '#FFB347',
                fontWeight: '600',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>
                Crafted by Freenachos
              </div>
            </div>
            
            {/* Center Content */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 179, 71, 0.15)',
                border: '1px solid rgba(255, 179, 71, 0.3)',
                borderRadius: '30px',
                padding: '8px 16px',
                marginBottom: '20px'
              }}>
                <Sparkles size={16} color="#FFB347" />
                <span style={{ fontSize: '13px', color: '#FFB347', fontWeight: '500' }}>
                  100% Free Tools & Resources
                </span>
              </div>
              
              <h1 style={{
                fontSize: '42px',
                fontWeight: '800',
                color: '#ffffff',
                marginBottom: '16px',
                lineHeight: 1.1
              }}>
                Level Up Your<br />
                <span style={{ color: '#FFB347' }}>Poker Game</span>
              </h1>
              
              <p style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.6)',
                maxWidth: '450px',
                lineHeight: 1.7,
                marginBottom: '8px'
              }}>
                Professional-grade tools and educational content designed to help you beat the games at any stake.
              </p>
              <p style={{
                fontSize: '15px',
                color: 'rgba(255,255,255,0.7)',
                maxWidth: '450px',
                lineHeight: 1.7,
                marginBottom: '24px'
              }}>
                Ready to take your game seriously? Join our CFP program to get staked and coached, or book private sessions for personalized strategy.
              </p>
            </div>
            
            {/* CTA Buttons on Right */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              flexShrink: 0
            }}>
              <a 
                href="https://www.nachospoker.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-hover"
                style={{
                  background: '#FFB347',
                  color: '#0a0a0a',
                  padding: '14px 24px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '14px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 20px rgba(255, 179, 71, 0.3)'
                }}
              >
                Join Our CFP <ExternalLink size={16} />
              </a>
              <a 
                href="https://www.freenachoscoaching.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-hover"
                style={{
                  background: 'transparent',
                  border: '2px solid rgba(255, 179, 71, 0.5)',
                  color: '#FFB347',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '14px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Private Coaching <ExternalLink size={16} />
              </a>
            </div>
          </div>
          
          {/* Background glow effect */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '30%',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(255, 179, 71, 0.1) 0%, transparent 60%)',
            pointerEvents: 'none',
            zIndex: -1
          }} />
        </div>

        {/* About Section */}
        <div 
          className="glass-card"
          style={{
            borderRadius: '16px',
            padding: '40px',
            marginBottom: '40px',
            animation: 'fadeInUp 0.6s ease-out 0.2s both'
          }}
        >
          <div className="section-title" style={{ marginBottom: '28px' }}>
            <User size={20} color="#FFB347" />
            <h2 style={{ fontSize: '20px' }}>About Me</h2>
            <div className="line" />
          </div>
          
          <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Profile Photo */}
            <div style={{
              flex: '0 0 240px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '200px',
                height: '260px',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '3px solid rgba(255, 179, 71, 0.4)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
              }}>
                <img 
                  src="https://i.gyazo.com/a8ed1b1bf6d0aaab54334973640f8822.jpg"
                  alt="Freenachos"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center'
                  }}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                  Freenachos
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                  Professional Poker Coach
                </div>
              </div>
            </div>
            
            {/* Bio Text */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <p style={{
                color: 'rgba(255,255,255,0.75)',
                fontSize: '15px',
                lineHeight: 1.85,
                marginBottom: '16px'
              }}>
                I didn't start out winning. The first part of the graph next to this text shows what my early career actually looked like: long breakeven stretches, downswings, and a lot of effort without consistent results. I was studying theory and putting in volume, but I didn't yet understand how to turn that work into decisions that held up in real games against real opponents.
              </p>
              <p style={{
                color: 'rgba(255,255,255,0.75)',
                fontSize: '15px',
                lineHeight: 1.85,
                marginBottom: '24px'
              }}>
                The breakthrough came when I started using GTO and large-sample data as diagnostic tools, not as rules to blindly follow. By comparing equilibrium expectations to actual population behavior, I learned to identify where opponents are consistently making mistakes and how to build strategies that exploit those mistakes in a controlled, repeatable way. That shift is what you see in the second part of the graph: fewer swings, more stability, and sustained results over time. This data-driven, execution-focused approach is now the foundation of my coaching.
              </p>
              
              {/* Stats Badges */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                flexWrap: 'wrap'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '10px',
                  padding: '12px 16px'
                }}>
                  <span style={{ fontSize: '20px' }}>💰</span>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#22c55e' }}>$5M+</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Student Profits</div>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '10px',
                  padding: '12px 16px'
                }}>
                  <span style={{ fontSize: '20px' }}>🎓</span>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#3b82f6' }}>200+</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Coached</div>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(255, 179, 71, 0.15)',
                  border: '1px solid rgba(255, 179, 71, 0.3)',
                  borderRadius: '10px',
                  padding: '12px 16px'
                }}>
                  <span style={{ fontSize: '20px' }}>📈</span>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#FFB347' }}>6.2bb/100</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>at 1kNL+</div>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '10px',
                  padding: '12px 16px'
                }}>
                  <span style={{ fontSize: '20px' }}>🃏</span>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#a855f7' }}>10M+</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Hands Played</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* YouTube Videos Section */}
        <div 
          className="glass-card"
          id="videos"
          style={{
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '40px',
            animation: 'fadeInUp 0.6s ease-out 0.3s both'
          }}
        >
          <div className="section-title" style={{ marginBottom: '24px' }}>
            <Youtube size={24} color="#ef4444" />
            <h2>Latest Videos</h2>
            <div className="line" />
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                fontSize: '13px',
                color: '#FFB347',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '500'
              }}
            >
              View all <ExternalLink size={14} />
            </a>
          </div>

          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <div 
              style={{
                display: 'flex',
                gap: '20px',
                padding: '10px 0',
                transform: `translateX(-${currentVideoIndex * 320}px)`,
                transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              {videos.map((video, idx) => (
                <VideoCard key={video.id} video={video} index={idx} />
              ))}
            </div>
            
            {/* Carousel Controls */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              marginTop: '20px'
            }}>
              <button className="carousel-btn" onClick={prevVideo}>
                <ChevronLeft size={20} color="#FFB347" />
              </button>
              <button className="carousel-btn" onClick={nextVideo}>
                <ChevronRight size={20} color="#FFB347" />
              </button>
            </div>
          </div>
        </div>

        {/* Tools Section */}
        <div 
          className="glass-card"
          id="tools"
          style={{
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '40px',
            animation: 'fadeInUp 0.6s ease-out 0.4s both'
          }}
        >
          <div className="section-title" style={{ marginBottom: '24px' }}>
            <Calculator size={24} color="#FFB347" />
            <h2>Poker Tools</h2>
            <div className="line" />
            <a 
              href="/tools"
              style={{
                fontSize: '13px',
                color: '#FFB347',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '500'
              }}
            >
              View all <ArrowRight size={14} />
            </a>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {tools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>

        {/* Articles Section */}
        <div 
          className="glass-card"
          style={{
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '40px',
            animation: 'fadeInUp 0.6s ease-out 0.5s both'
          }}
        >
          <div className="section-title" style={{ marginBottom: '24px' }}>
            <BookOpen size={24} color="#a855f7" />
            <h2>Strategy Articles</h2>
            <div className="line" />
            <a 
              href="/articles"
              style={{
                fontSize: '13px',
                color: '#FFB347',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '500'
              }}
            >
              View all <ArrowRight size={14} />
            </a>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div 
          className="spark-border"
          style={{
            padding: '48px',
            textAlign: 'center',
            animation: 'fadeInUp 0.6s ease-out 0.6s both'
          }}
        >
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '12px'
          }}>
            Ready to crush the games?
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '28px',
            maxWidth: '500px',
            margin: '0 auto 28px'
          }}>
            Join our CFP program or book private coaching to accelerate your poker journey.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href="https://www.nachospoker.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-hover"
              style={{
                background: '#FFB347',
                color: '#0a0a0a',
                padding: '14px 28px',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '15px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Join CFP Program <ExternalLink size={16} />
            </a>
            <a 
              href="https://www.freenachoscoaching.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-hover"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 179, 71, 0.5)',
                color: '#FFB347',
                padding: '14px 28px',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '15px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Private Coaching <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          padding: '32px 0',
          marginTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
          <p style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.4)'
          }}>
            © 2024 Freenachos Poker. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PokerToolboxHome;

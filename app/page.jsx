"use client";

import NachosPokerNavBar from '@/components/NachosPokerNavBar';

import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Play, ChevronLeft, ChevronRight, Calculator, Target, TrendingUp, BookOpen, User, Youtube, ArrowRight, Sparkles, BarChart3, Percent, DollarSign, Trophy, Activity, Check, X, ChevronDown, GraduationCap, Users, CheckCircle, Video, MessageCircle, Calendar, Star, Award, Database, Headphones, Crosshair, Swords, Brain, Lock, Zap } from 'lucide-react';

/**
 * Freenachos Poker Toolbox Homepage
 * 
 * Main landing page featuring:
 * - Hero section with branding
 * - About section
 * - YouTube video carousel
 * - Mentorship benefits
 * - Testimonials carousel
 * - Pricing section
 * - Good fit section
 * - FAQ accordion
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
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');
  const [expandedFAQ, setExpandedFAQ] = useState(0);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const nachoRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const heroSectionRef = useRef(null);

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
      image: 'https://i.gyazo.com/84fe303f124b23ebd87b11ce00807de6.png'
    },
    {
      id: 2,
      name: 'Keven Li',
      subtitle: 'Poker Made Simple',
      quote: "In 2021, I turned pro with a $10k bankroll, struggling through a breakeven stretch until Patrick's data-driven coaching changed everything—my results skyrocketed. His guidance, combined with NachosPoker's training, took me from 100nl to crushing 1000nl. Working with Patrick was the best decision I've made in poker.",
      image: 'https://i.gyazo.com/64ab37279de8475d58ededffdde851ae.png'
    },
    {
      id: 3,
      name: 'Marcelo',
      quote: "Patrick's blog posts and videos on Run It Once were what convinced me to join Nachos Poker, and I haven't looked back since. His approach is very data-driven and practical, and the way he breaks down spots makes complex ideas easy to apply. On top of that, the community he's built is supportive and focused on improving. Whether you're playing 200nl or aiming to move up, working with Patrick is a great place to be.",
      image: 'https://i.gyazo.com/99dafc2ce6c753470b343dd0cfc7366e.png'
    },
    {
      id: 4,
      name: 'Andrea',
      quote: "I just finished my learning path with Patrick and I wanted to share my experience working with him. It was my first experience with a coach and I've always been very skeptical about coaching in general, but after working with him I completely changed my mind. What impressed me the most was his empathy. One day I came to a lesson during a downswing and without me saying a word about it, he sensed something and said 'How about we have a mindset talk instead?' To me, that's an innate and truly essential quality in a coach. In about 13 months I went from being breakeven at NL50 to beating NL200, almost ready for NL500.",
      hasBeforeAfter: true,
      imageBefore: 'https://i.gyazo.com/f4749a49b560a07d3dfd002d97d66354.png',
      imageAfter: 'https://i.gyazo.com/71a3ce799042d5e469c71e01a9a3c086.png'
    },
    {
      id: 5,
      name: 'Davide',
      quote: "Thanks to NachosPoker, I went from struggling at 100nl to dominating at 1k in under a year! They helped me improve in every aspect of the game, not only strategical, but also mental and logistical. Patrick is always patient, humble, and delivers more than expected. Plus, the community is awesome!",
      image: 'https://i.gyazo.com/cb6ad67354991a6dfd841d4fd70726f0.png'
    },
    {
      id: 6,
      name: 'Brendon',
      quote: "The strategy will anchor you in spots where you typically feel lost. Patrick's methodology elevated my game from a breakeven 100nl reg to dominating 1000nl. The supportive community offers in-depth discussions that have been crucial to my development.",
      image: 'https://i.gyazo.com/acec149f25437808e9e874d7ead143a7.png'
    },
    {
      id: 7,
      name: 'Peter',
      quote: "After a tough downswing in late 2023 dropped me from 1knl to 200/500nl, I feared my high-stakes dream was over. A friend suggested Freenachos CFP, and it may have been the best decision of my career. Their resources and Patrick's support helped me excel, and I've since skyrocketed back on track, now competing at 2K and aiming higher soon.",
      image: 'https://i.gyazo.com/f4d4343480fa27271eba2281d25685da.png'
    },
  ];

  const mentorshipBenefits = [
    {
      icon: Crosshair,
      title: 'Surgical Leak Correction',
      description: "We don't just chat. We audit your ranges against GTO to identify exactly where you are bleeding EV, then build a custom protocol to plug the leak."
    },
    {
      icon: Swords,
      title: 'Weekly High-Stakes War Room',
      description: 'Join live study sessions with other crushers. Dissect hands, debate lines, and stay accountable in a high-performance environment.'
    },
    {
      icon: Zap,
      title: "The 'Nacho' Stat Validator",
      description: "Exclusive access to my proprietary tool. Instantly visualize where your range structure deviates from optimal play. It's an X-Ray for your game."
    },
    {
      icon: Brain,
      title: 'Performance by Design',
      description: 'A complete mental operating system tailored for poker. Eliminate tilt, master focus, and build the discipline required for high-volume grinding.'
    },
    {
      icon: Lock,
      title: 'The Strategy Vault',
      description: 'Unlock a growing library of high-stakes analysis, hand history reviews, and theoretical deep dives. The exact concepts used to beat 1KNL.'
    },
    {
      icon: MessageCircle,
      title: 'Direct Mentor Access',
      description: 'You are never alone. Get direct priority support via my private Discord. Post hands, ask questions, and get answers from me personally.'
    }
  ];

  const pricingPlans = [
    {
      name: '3-Month Kickstart',
      totalPrice: '2,999',
      paymentNote: 'Paid in full',
      featured: false,
      features: [
        '6 Private 1-on-1 Sessions',
        'Lifetime Weekly Group Coaching',
        'Full Database Review',
        'Personalized Study Plan',
        'Lifetime Discord Access'
      ],
      buttonText: 'Book Intro Call'
    },
    {
      name: '6-Month Accelerator',
      totalPrice: '4,999',
      paymentNote: 'Pay in full or 3 monthly installments',
      featured: true,
      badge: 'MOST POPULAR',
      savings: 'Save €1,000 vs. Quarterly',
      features: [
        '12 Private 1-on-1 Sessions',
        'Lifetime Weekly Group Coaching',
        'Quarterly Database Review',
        'Quarterly Updated Study Plan',
        'Lifetime Discord Access',
        '2-Month Pause Option'
      ],
      buttonText: 'Book Priority Call'
    },
    {
      name: '12-Month Mastery',
      totalPrice: '8,999',
      paymentNote: 'Pay in full or quarterly installments',
      featured: false,
      badge: 'BEST VALUE',
      savings: 'Save €3,000 vs. Quarterly',
      features: [
        '24 Private 1-on-1 Sessions',
        'Lifetime Weekly Group Coaching',
        'Quarterly Database Review',
        'Quarterly Updated Study Plan',
        'Lifetime Discord Access',
        'Priority Scheduling'
      ],
      buttonText: 'Book Mastery Call'
    }
  ];

  const faqItems = [
    {
      question: 'What is the structure of the mentorship program?',
      answer: `The mentorship program is structured to provide a comprehensive learning experience through a combination of personalized one-on-one coaching sessions, dynamic group sessions, and access to our exclusive high-stakes community. You'll receive individualized coaching, a full database review, and a personalized study plan tailored to your unique needs, along with homework assignments.

Additionally, you'll participate in weekly group sessions that foster a collaborative learning environment. In one-on-one sessions, we'll conduct a detailed analysis of your database using advanced tools to identify and address leaks, focusing on GTO range composition and exploiting areas of weakness to elevate your game.

The 3-month program consists of:
• 6 one-on-one coaching sessions (55 min)
• 13 group coaching sessions (55 min)
• Advanced database review`
    },
    {
      question: 'What skill level is the mentorship program best suited for?',
      answer: 'Our program is best suited for driven, motivated players who are eager to learn and take their game to the next level. While we tailor our coaching to each student\'s needs, those playing at mid-stakes or higher will gain the most from our data-driven strategies and advanced techniques. Ambitious low-stakes players ready to make a serious commitment to improvement are also welcome.'
    },
    {
      question: 'Will I receive any materials or resources to use after the program ends?',
      answer: 'Yes, you will have access to the resources provided during the program, including a personalized study plan and insights from your database review. Additionally, during the program you\'ll gain access to a comprehensive video database containing all past study sessions, presentations that break down complex concepts, and live-play videos. The strategies and concepts covered in both the one-on-one and group sessions are designed to be used and refined as you continue your poker journey.'
    },
    {
      question: 'Is there a deadline for completing the one-on-one or group sessions?',
      answer: 'The one-on-one coaching sessions must be scheduled within the duration of your chosen package. Unused sessions will not be reimbursed. Unless otherwise agreed, you can book a maximum of one one-on-one coaching session per week. Any unused sessions will not carry over if you renew the program.\n\nThe 6-month program does include a one-time pause option, allowing for a break of up to two months.'
    },
    {
      question: 'What payment options and payment plans do you offer?',
      answer: 'Payments can be made via BTC, USDT, Wise, and Revolut. PayPal and Skrill are also accepted, but with a 7% premium. Flexible payment plans are available for both programs. For more details on payment options, please get in touch directly.'
    }
  ];

  const goodFitReasons = [
    'You want to understand why strategies work, not just what to click',
    'You\'re willing to study consistently and review your own play',
    'You care about long-term improvement over short-term results'
  ];

  const notAFitReasons = [
    'You\'re looking for shortcuts or "secret lines"',
    'You don\'t want to put in off-table work',
    'You expect coaching to replace personal responsibility'
  ];

  const articles = [
    { id: 1, title: 'The Ultimate Guide to Table Selection', category: 'Strategy', readTime: '8 min', excerpt: 'Learn how to identify profitable tables and maximize your hourly rate with proper table selection techniques.', link: '/articles/table-selection' },
    { id: 2, title: 'Understanding VPIP and What It Tells You', category: 'Fundamentals', readTime: '5 min', excerpt: 'VPIP is one of the most important stats in poker. Here\'s how to use it to categorize your opponents.', link: '/articles/vpip-guide' },
    { id: 3, title: 'Bankroll Management for Serious Players', category: 'Mindset', readTime: '10 min', excerpt: 'The mathematical approach to never going broke while maximizing your growth potential.', link: '/articles/bankroll-management' },
  ];

  const tools = [
    { id: 1, name: 'Variance Calculator', description: 'Simulate your expected variance and downswings over any sample size', icon: BarChart3, color: '#3b82f6', link: '/variance' },
    { id: 2, name: 'Win Rate Analyzer', description: 'Track and analyze your win rate across different stakes and formats', icon: TrendingUp, color: '#22c55e', link: '/winrate' },
    { id: 3, name: 'Seat Selection EV', description: 'Visualize how fish position impacts your win rate at 6-max tables', icon: Target, color: '#FFB347', link: '/seat' },
    { id: 4, name: 'Profits Tracker', description: 'Monitor your poker profits and track your bankroll growth over time', icon: DollarSign, color: '#14b8a6', link: '/profits' },
    { id: 5, name: 'Bad Beat Jackpot Dashboard', description: 'Track bad beat jackpot sizes and expected value across poker rooms', icon: Trophy, color: '#a855f7', link: '/bad-beat-jackpot' },
    { id: 6, name: 'Articles', description: 'Strategy guides, tips, and educational content to improve your game', icon: BookOpen, color: '#ef4444', link: '/articles' },
  ];

  // ============================================
  // NACHO MASCOT LOGIC
  // ============================================
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    const newNachos = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 14 + Math.random() * 24,
      duration: 50 + Math.random() * 30,
      delay: Math.random() * 40,
      rotation: Math.random() * 360,
      opacity: 0.20 + Math.random() * 0.2,
      moveX: Math.random() * 80 - 40,
      moveY: Math.random() * 100 - 50
    }));
    setNachos(newNachos);
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

  const eyeOffset = getEyeOffset();

  // ============================================
  // CAROUSEL HANDLERS
  // ============================================
  
  const maxVideoIndex = Math.max(0, videos.length - 3);
  
  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev >= maxVideoIndex ? 0 : prev + 1));
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev <= 0 ? maxVideoIndex : prev - 1));
  };

  const nextTestimonial = () => {
    setSlideDirection('right');
    setCurrentTestimonialIndex((prev) => (prev >= testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setSlideDirection('left');
    setCurrentTestimonialIndex((prev) => (prev <= 0 ? testimonials.length - 1 : prev - 1));
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

  // Graph image component for testimonials
  const TestimonialGraph = ({ src }) => (
    <img 
      src={src} 
      alt="Results graph"
      style={{
        width: '100%',
        height: '128px',
        objectFit: 'contain',
        borderRadius: '8px',
        display: 'block'
      }}
    />
  );

  // Before/After graph for Andrea's testimonial
  const BeforeAfterGraph = ({ imageBefore, imageAfter }) => (
    <div style={{ display: 'flex', gap: '16px', height: '128px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          fontSize: '12px', 
          fontWeight: '600', 
          color: '#ef4444',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          flexShrink: 0
        }}>Before</div>
        <img 
          src={imageBefore} 
          alt="Before coaching"
          style={{
            width: '100%',
            flex: 1,
            objectFit: 'contain',
            borderRadius: '8px',
            display: 'block'
          }}
        />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          fontSize: '12px', 
          fontWeight: '600', 
          color: '#22c55e',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          flexShrink: 0
        }}>After</div>
        <img 
          src={imageAfter} 
          alt="After coaching"
          style={{
            width: '100%',
            flex: 1,
            objectFit: 'contain',
            borderRadius: '8px',
            display: 'block'
          }}
        />
      </div>
    </div>
  );

  const VideoCard = ({ video, index = 0 }) => (
    <a 
      href={video.link}
      target="_blank"
      rel="noopener noreferrer"
      className="video-card"
      style={{
        background: 'rgba(20, 20, 20, 0.6)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        overflow: 'hidden',
        cursor: 'pointer',
        flex: '0 0 300px',
        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        textDecoration: 'none',
        position: 'relative'
      }}
    >
      {/* Gold Bloom Glow - appears on hover */}
      <div 
        className="video-gold-bloom"
        style={{
          position: 'absolute',
          inset: '-20px',
          background: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.25) 0%, transparent 70%)',
          opacity: 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
          zIndex: 0,
          filter: 'blur(20px)'
        }}
      />
      <div style={{ position: 'relative', overflow: 'hidden', zIndex: 1 }}>
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
            transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
            borderRadius: '24px 24px 0 0'
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
            transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
            boxShadow: '0 4px 20px rgba(255, 179, 71, 0.4)'
          }}>
            <Play size={24} color="#0a0a0a" fill="#0a0a0a" style={{ marginLeft: '3px' }} />
          </div>
        </div>
        {video.duration && (
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
        )}
      </div>
      <div style={{ padding: '16px', position: 'relative', zIndex: 1 }}>
        <h4 style={{
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '8px',
          lineHeight: 1.4
        }}>
          {video.title}
        </h4>
        {video.views && (
          <span style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)'
          }}>
            {video.views} views
          </span>
        )}
      </div>
    </a>
  );

  const ArticleCard = ({ article }) => (
    <a 
      href={article.link}
      className="card-hover glass-card"
      style={{
        borderRadius: '12px',
        padding: '24px',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none'
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
          color: '#D4AF37',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          background: 'rgba(212, 175, 55, 0.15)',
          padding: '4px 10px',
          borderRadius: '20px'
        }}>
          {article.category}
        </span>
        <span style={{
          fontSize: '11px',
          color: 'rgba(240, 240, 240, 0.4)'
        }}>
          {article.readTime} read
        </span>
      </div>
      <h3 style={{
        color: '#F0F0F0',
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '12px',
        lineHeight: 1.3
      }}>
        {article.title}
      </h3>
      <p style={{
        color: 'rgba(240, 240, 240, 0.6)',
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
        color: '#D4AF37',
        fontSize: '13px',
        fontWeight: '500'
      }}>
        Read more <ArrowRight size={14} />
      </div>
    </a>
  );

  const ToolCard = ({ tool }) => {
    const Icon = tool.icon;
    return (
      <a 
        href={tool.link}
        className="card-hover glass-card"
        style={{
          borderRadius: '12px',
          padding: '24px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          textDecoration: 'none',
          display: 'block'
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
      </a>
    );
  };

  const BenefitCard = React.memo(({ benefit, index }) => {
    const Icon = benefit.icon;
    return (
      <div className="benefit-card">
        {/* Icon container */}
        <div 
          className="benefit-icon"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '14px',
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            pointerEvents: 'none'
          }}
        >
          <Icon size={28} color="#D4AF37" strokeWidth={1.5} />
        </div>
        
        {/* Title */}
        <h3 
          className="benefit-title"
          style={{
            color: '#F0F0F0',
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '14px',
            lineHeight: 1.3,
            pointerEvents: 'none'
          }}
        >
          {benefit.title}
        </h3>
        
        {/* Description */}
        <p style={{
          color: 'rgba(240, 240, 240, 0.65)',
          fontSize: '14px',
          lineHeight: 1.75,
          flex: 1,
          pointerEvents: 'none'
        }}>
          {benefit.description}
        </p>
      </div>
    );
  });

  const PricingCard = React.memo(({ plan }) => (
    <div 
      className={`pricing-card ${plan.featured ? 'featured' : ''}`}
      style={{
        background: '#121212',
        border: plan.featured ? '2px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '40px 32px',
        position: 'relative',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        transform: plan.featured ? 'scale(1.03)' : 'scale(1)',
        zIndex: plan.featured ? 2 : 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '560px',
        boxShadow: plan.featured 
          ? '0 0 40px rgba(212, 175, 55, 0.2), 0 20px 50px rgba(0, 0, 0, 0.4)' 
          : '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}
    >
      {/* Badge */}
      {plan.badge && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: plan.featured ? '#D4AF37' : 'rgba(212, 175, 55, 0.15)',
          color: plan.featured ? '#0a0a0a' : '#D4AF37',
          fontSize: '11px',
          fontWeight: '700',
          padding: '6px 16px',
          borderRadius: '20px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap'
        }}>
          {plan.badge}
        </div>
      )}
      
      {/* Plan Name */}
      <div style={{
        color: '#D4AF37',
        fontSize: '13px',
        fontWeight: '600',
        marginBottom: '24px',
        marginTop: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        height: '16px'
      }}>
        {plan.name}
      </div>
      
      {/* Price */}
      <div style={{
        marginBottom: '8px'
      }}>
        <span style={{
          color: '#F0F0F0',
          fontSize: '48px',
          fontWeight: '800',
          lineHeight: 1,
          letterSpacing: '-0.02em'
        }}>
          €{plan.totalPrice}
        </span>
      </div>
      
      {/* Payment Note */}
      <div style={{
        color: 'rgba(240, 240, 240, 0.5)',
        fontSize: '13px',
        marginBottom: '8px',
        lineHeight: 1.4,
        minHeight: '18px'
      }}>
        {plan.paymentNote}
      </div>
      
      {/* Savings text - fixed height container */}
      <div style={{
        height: '20px',
        marginBottom: '20px'
      }}>
        {plan.savings && (
          <span style={{
            color: '#D4AF37',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            {plan.savings}
          </span>
        )}
      </div>
      
      {/* Divider */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent)',
        marginBottom: '24px'
      }} />
      
      {/* Features */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        flex: 1,
        marginBottom: '28px'
      }}>
        {plan.features.map((feature, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Check size={16} color="#D4AF37" style={{ flexShrink: 0 }} />
            <span style={{
              color: 'rgba(240, 240, 240, 0.8)',
              fontSize: '14px',
              lineHeight: 1.4
            }}>
              {feature}
            </span>
          </div>
        ))}
      </div>
      
      {/* CTA Button */}
      <a
        href="https://calendly.com/freenachos/intro"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-hover"
        style={{
          display: 'block',
          width: '100%',
          padding: plan.featured ? '18px 20px' : '16px 20px',
          borderRadius: '12px',
          fontWeight: '700',
          fontSize: plan.featured ? '15px' : '14px',
          textAlign: 'center',
          textDecoration: 'none',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          background: '#FF9900',
          color: '#0a0a0a',
          border: 'none',
          marginTop: 'auto',
          boxShadow: plan.featured 
            ? '0 4px 20px rgba(255, 153, 0, 0.4)' 
            : '0 2px 10px rgba(255, 153, 0, 0.2)'
        }}
      >
        {plan.buttonText}
      </a>
    </div>
  ));

  const FAQItem = ({ item, index, isExpanded, onToggle }) => (
    <div 
      className="faq-item"
      style={{
        background: 'rgba(24, 24, 24, 0.9)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
    >
      <button
        onClick={() => onToggle(index)}
        style={{
          width: '100%',
          padding: '20px 24px',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <span style={{
          color: '#F0F0F0',
          fontSize: '15px',
          fontWeight: '600',
          flex: 1,
          paddingRight: '16px'
        }}>
          {item.question}
        </span>
        <ChevronDown 
          size={20} 
          color="#D4AF37"
          style={{
            transition: 'transform 0.3s ease',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0
          }}
        />
      </button>
      <div style={{
        maxHeight: isExpanded ? '500px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.4s ease'
      }}>
        <div style={{
          padding: '0 24px 20px',
          color: 'rgba(240, 240, 240, 0.7)',
          fontSize: '14px',
          lineHeight: 1.8,
          whiteSpace: 'pre-line'
        }}>
          {item.answer}
        </div>
      </div>
    </div>
  );

  // ============================================
  // RENDER
  // ============================================

  return (
    <div style={{minHeight: '100vh', background: '#0A0A0A', position: 'relative', overflow: 'hidden', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'}}>
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

      {/* Sticky CTA Button - Only visible after scrolling to About section */}
      {showStickyCta && (
        <div className="sticky-cta">
          <a 
            href="https://calendly.com/freenachos/intro" 
            target="_blank" 
            rel="noopener noreferrer"
            className="sticky-cta-btn"
          >
            <Calendar size={18} />
            Apply Now
          </a>
        </div>
      )}
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
        
        /* Smooth Scroll Behavior */
        html {
          scroll-behavior: smooth;
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
        
        /* === CINEMATIC SPACE DRIFT ANIMATIONS === */
        @keyframes driftSlow {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(15px, -25px) rotate(45deg); }
          50% { transform: translate(25px, -40px) rotate(90deg); }
          75% { transform: translate(10px, -20px) rotate(135deg); }
          100% { transform: translate(0, 0) rotate(180deg); }
        }
        @keyframes driftMedium {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-20px, -30px) rotate(-60deg); }
          50% { transform: translate(-10px, -50px) rotate(-120deg); }
          75% { transform: translate(10px, -25px) rotate(-180deg); }
          100% { transform: translate(0, 0) rotate(-240deg); }
        }
        @keyframes driftFast {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(12px, -18px) rotate(90deg); }
          50% { transform: translate(20px, -35px) rotate(180deg); }
          75% { transform: translate(8px, -15px) rotate(270deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        @keyframes floatNacho {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(calc(var(--moveX) * 0.5), calc(var(--moveY) * 0.5)) rotate(90deg); }
          50% { transform: translate(var(--moveX), var(--moveY)) rotate(180deg); }
          75% { transform: translate(calc(var(--moveX) * 0.5), calc(var(--moveY) * 0.5)) rotate(270deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
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
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        .glass-card {
          background: rgba(18, 18, 18, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(212, 175, 55, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
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
          box-shadow: 0 0 20px rgba(255, 153, 0, 0.4), 0 10px 40px rgba(255, 153, 0, 0.3);
          background: #FFa31a;
        }

        .sticky-cta {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          animation: fadeInUp 0.4s ease-out 1s both;
        }

        .sticky-cta-btn {
          background: #FF9900;
          color: #0a0a0a;
          padding: 16px 28px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 8px 32px rgba(255, 153, 0, 0.5), 0 0 0 4px rgba(255, 153, 0, 0.15);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .sticky-cta-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 40px rgba(255, 153, 0, 0.6), 0 0 0 6px rgba(255, 153, 0, 0.2);
        }
        
        .spark-border {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          background: #121212;
        }
        
        .spark-border::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.4), rgba(212, 175, 55, 0.1));
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
          background: linear-gradient(90deg, transparent 0%, #D4AF37 50%, #D4AF37 100%);
          box-shadow: 0 0 15px 2px rgba(212, 175, 55, 0.7);
          offset-path: rect(0 100% 100% 0 round 20px);
          animation: traceBorder 5s linear infinite;
          offset-rotate: auto;
          offset-anchor: center;
          z-index: 2;
          pointer-events: none;
        }

        .hero-gradient {
          background: radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.12) 0%, transparent 50%);
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
          color: #F0F0F0;
          margin: 0;
        }
        .section-title .line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(212, 175, 55, 0.4), transparent);
        }

        .carousel-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid rgba(212, 175, 55, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .carousel-btn:hover {
          background: rgba(212, 175, 55, 0.25);
          border-color: #D4AF37;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
        }

        .video-card {
          transform: translateX(0);
        }
        .video-card:hover {
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 30px 60px rgba(212, 175, 55, 0.25), 0 0 40px rgba(212, 175, 55, 0.15);
          border-color: rgba(212, 175, 55, 0.5);
        }
        .video-card:hover .video-thumbnail {
          transform: scale(1.05);
        }
        .video-card:hover .play-button {
          transform: scale(1.15);
          box-shadow: 0 8px 40px rgba(212, 175, 55, 0.7);
        }
        .video-card:hover .video-gold-bloom {
          opacity: 1 !important;
        }

        .benefit-card {
          background: #1A1A1A;
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          padding: 32px;
          position: relative;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
          cursor: default;
          transition: border-color 0.4s ease;
        }

        .benefit-card > * {
          pointer-events: none;
        }

        .benefit-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #D4AF37, transparent);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .benefit-card:hover::before {
          opacity: 1;
        }

        .benefit-card:hover {
          border-color: rgba(212, 175, 55, 0.4);
        }

        .benefit-card .benefit-icon {
          transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
        }

        .benefit-card:hover .benefit-icon {
          background: rgba(212, 175, 55, 0.15);
          border-color: rgba(212, 175, 55, 0.6);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.25);
        }

        .benefit-card .benefit-title {
          transition: color 0.4s ease;
        }

        .benefit-card:hover .benefit-title {
          color: #D4AF37;
        }

        .pricing-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .pricing-card.featured:hover {
          transform: scale(1.05);
          box-shadow: 0 0 50px rgba(212, 175, 55, 0.25), 0 25px 50px rgba(0, 0, 0, 0.4);
        }

        .faq-item:hover {
          border-color: rgba(212, 175, 55, 0.4);
        }

        .script-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-weight: 700;
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

        .testimonial-card {
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .testimonial-card-main {
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

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

        .preview-card:hover {
          opacity: 0.7 !important;
          transform: scale(0.95) !important;
        }

        /* Cinematic Nacho Float Animation */
        @keyframes cinematicFloat {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(15px, -25px) rotate(45deg); }
          50% { transform: translate(25px, -40px) rotate(90deg); }
          75% { transform: translate(10px, -20px) rotate(135deg); }
          100% { transform: translate(0, 0) rotate(180deg); }
        }

        @keyframes cinematicFloat2 {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-20px, -30px) rotate(-60deg); }
          50% { transform: translate(-10px, -50px) rotate(-120deg); }
          75% { transform: translate(10px, -25px) rotate(-180deg); }
          100% { transform: translate(0, 0) rotate(-240deg); }
        }

        @keyframes atmosphereDrift {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(30px, -20px) rotate(15deg); }
          50% { transform: translate(50px, -35px) rotate(30deg); }
          75% { transform: translate(25px, -15px) rotate(15deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
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
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 60%)',
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
          background: 'radial-gradient(circle, rgba(255, 153, 0, 0.06) 0%, transparent 55%)',
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
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 50%)',
          filter: 'blur(60px)',
          opacity: 0.4
        }} />
      </div>

      {/* ==================== DYNAMIC FLOATING NACHOS (Fixed, z-0) ==================== */}
      {/* Deep background layer - nachos pass behind all sections */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
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
      <section 
        ref={heroSectionRef}
        className="hero-section-fade"
        style={{
          position: 'relative',
          minHeight: '100vh',
          width: '100%',
          overflow: 'hidden',
          background: '#0A0A0A',
          zIndex: 2
        }}
      >
        {/* === LAYER 15: CINEMATIC EMBERS - BEHIND COACH (z-15) === */}
        {/* 5 organic glowing embers behind the coach for depth */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 15, overflow: 'hidden', pointerEvents: 'none' }}>
          
          {/* Ember - Near top-left headline */}
          <div style={{
            position: 'absolute',
            top: '30%',
            left: '10%',
            width: '8px',
            height: '8px',
            opacity: 0.9,
            filter: 'blur(0.5px) drop-shadow(0 0 4px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 12px rgba(255, 153, 0, 0.4))',
            animation: 'cinematicFloat 25s ease-in-out infinite'
          }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <defs>
                <radialGradient id="emberGlow1" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#FFD700" />
                </radialGradient>
              </defs>
              <polygon points="50,5 95,95 5,95" fill="url(#emberGlow1)" />
            </svg>
          </div>

          {/* Ember - Lower-left void (larger) */}
          <div style={{
            position: 'absolute',
            bottom: '25%',
            left: '6%',
            width: '10px',
            height: '10px',
            opacity: 0.9,
            filter: 'blur(1px) drop-shadow(0 0 4px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 12px rgba(255, 153, 0, 0.4))',
            animation: 'cinematicFloat2 28s ease-in-out infinite',
            animationDelay: '-8s'
          }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <defs>
                <radialGradient id="emberGlow2" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#FFD700" />
                </radialGradient>
              </defs>
              <polygon points="50,5 95,95 5,95" fill="url(#emberGlow2)" />
            </svg>
          </div>

          {/* Ember - Lower-left void (tiny) */}
          <div style={{
            position: 'absolute',
            bottom: '32%',
            left: '18%',
            width: '4px',
            height: '4px',
            opacity: 0.9,
            filter: 'blur(0.5px) drop-shadow(0 0 3px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 8px rgba(255, 153, 0, 0.4))',
            animation: 'cinematicFloat 22s ease-in-out infinite',
            animationDelay: '-12s'
          }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <defs>
                <radialGradient id="emberGlow3" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#FFD700" />
                </radialGradient>
              </defs>
              <polygon points="50,5 95,95 5,95" fill="url(#emberGlow3)" />
            </svg>
          </div>

          {/* Ember - Mid-left */}
          <div style={{
            position: 'absolute',
            top: '55%',
            left: '4%',
            width: '6px',
            height: '6px',
            opacity: 0.9,
            filter: 'blur(0.5px) drop-shadow(0 0 4px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 10px rgba(255, 153, 0, 0.4))',
            animation: 'cinematicFloat2 26s ease-in-out infinite',
            animationDelay: '-15s'
          }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <defs>
                <radialGradient id="emberGlow4" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#FFD700" />
                </radialGradient>
              </defs>
              <polygon points="50,5 95,95 5,95" fill="url(#emberGlow4)" />
            </svg>
          </div>

          {/* Ember - Near CTA area */}
          <div style={{
            position: 'absolute',
            top: '70%',
            left: '25%',
            width: '5px',
            height: '5px',
            opacity: 0.9,
            filter: 'blur(0.5px) drop-shadow(0 0 3px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 10px rgba(255, 153, 0, 0.4))',
            animation: 'cinematicFloat 24s ease-in-out infinite',
            animationDelay: '-18s'
          }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <defs>
                <radialGradient id="emberGlow5" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#FFD700" />
                </radialGradient>
              </defs>
              <polygon points="50,5 95,95 5,95" fill="url(#emberGlow5)" />
            </svg>
          </div>
        </div>

        {/* === LAYER 25: CINEMATIC EMBERS - IN FRONT OF COACH (z-25) === */}
        {/* 2 embers in front of coach for "sandwich" depth effect */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 25, overflow: 'hidden', pointerEvents: 'none' }}>
          
          {/* Ember - Floating near coach shoulder (foreground) */}
          <div style={{
            position: 'absolute',
            top: '38%',
            right: '32%',
            width: '5px',
            height: '5px',
            opacity: 0.9,
            filter: 'blur(0.5px) drop-shadow(0 0 4px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 12px rgba(255, 153, 0, 0.4))',
            animation: 'cinematicFloat 20s ease-in-out infinite',
            animationDelay: '-5s'
          }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <defs>
                <radialGradient id="emberGlowFront1" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#FFD700" />
                </radialGradient>
              </defs>
              <polygon points="50,5 95,95 5,95" fill="url(#emberGlowFront1)" />
            </svg>
          </div>

          {/* Ember - Lower foreground accent */}
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '12%',
            width: '7px',
            height: '7px',
            opacity: 0.9,
            filter: 'blur(1px) drop-shadow(0 0 5px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 14px rgba(255, 153, 0, 0.4))',
            animation: 'cinematicFloat2 23s ease-in-out infinite',
            animationDelay: '-10s'
          }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <defs>
                <radialGradient id="emberGlowFront2" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#FFD700" />
                </radialGradient>
              </defs>
              <polygon points="50,5 95,95 5,95" fill="url(#emberGlowFront2)" />
            </svg>
          </div>
        </div>

        {/* === LAYER 16: FLOATING NACHOS (z-16) - Inside Hero, ABOVE Vignette === */}
        {/* Sparse at top (distant stars), denser toward bottom */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 16, overflow: 'hidden', pointerEvents: 'none' }}>

          {/* === HERO ACCENT NACHOS: Intentional Placement === */}
          
          {/* Nacho - Left of "Master High-Stakes" headline (medium) */}
          <div style={{
            position: 'absolute',
            top: '38%',
            left: '6%',
            width: '45px',
            height: '45px',
            opacity: 0.25,
            filter: 'blur(4px)',
            animation: 'cinematicFloat 38s ease-in-out infinite'
          }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <polygon points="50,5 95,95 5,95" fill="#D4AF37" />
            </svg>
          </div>

          {/* Nacho - Top Center (large/blurry - slowest) */}
          <div style={{
            position: 'absolute',
            top: '8%',
            left: '45%',
            width: '70px',
            height: '70px',
            opacity: 0.2,
            filter: 'blur(8px)',
            animation: 'cinematicFloat2 55s ease-in-out infinite',
            animationDelay: '-20s'
          }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <polygon points="50,5 95,95 5,95" fill="#FF9900" />
            </svg>
          </div>

          {/* Nacho - Bottom Left Corner (medium) */}
          <div style={{
            position: 'absolute',
            bottom: '18%',
            left: '4%',
            width: '35px',
            height: '35px',
            opacity: 0.2,
            filter: 'blur(3px)',
            animation: 'cinematicFloat 42s ease-in-out infinite',
            animationDelay: '-15s'
          }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <polygon points="50,5 95,95 5,95" fill="#FF9900" />
            </svg>
          </div>

          {/* Nacho - Mid Right (above coach shoulder - medium) */}
          <div style={{
            position: 'absolute',
            top: '25%',
            right: '22%',
            width: '30px',
            height: '30px',
            opacity: 0.15,
            filter: 'blur(3px)',
            animation: 'cinematicFloat2 40s ease-in-out infinite',
            animationDelay: '-25s'
          }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <polygon points="50,5 95,95 5,95" fill="#D4AF37" />
            </svg>
          </div>

          {/* Nacho - Lower Center-Left (medium) */}
          <div style={{
            position: 'absolute',
            bottom: '30%',
            left: '28%',
            width: '28px',
            height: '28px',
            opacity: 0.18,
            filter: 'blur(2px)',
            animation: 'cinematicFloat 36s ease-in-out infinite',
            animationDelay: '-8s'
          }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <polygon points="50,5 95,95 5,95" fill="#D4AF37" />
            </svg>
          </div>
        </div>

        {/* === HALO LIGHTING: Key Light Behind Coach (z-5) === */}
        <div style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-5%',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(255, 153, 0, 0.3) 0%, rgba(212, 175, 55, 0.12) 40%, transparent 70%)',
          filter: 'blur(120px)',
          zIndex: 5,
          pointerEvents: 'none'
        }} />

        {/* === COACH IMAGE: Anchored Bottom-Right (z-20) === */}
        <div 
          className="hero-image-mask"
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            height: '88vh',
            maxHeight: '920px',
            zIndex: 20,
            animation: 'imageReveal 1.2s ease-out 0.5s both',
            pointerEvents: 'none'
          }}
        >
          <img 
            src="https://i.gyazo.com/ad823c265c17c21f61996bb3aa3283e2.png"
            alt="Freenachos - High Stakes Poker Coach"
            style={{
              height: '100%',
              width: 'auto',
              objectFit: 'contain',
              objectPosition: 'bottom right'
            }}
          />
        </div>

        {/* === CINEMATIC VIGNETTE: Readability Overlay (z-15) === */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 15,
            background: 'linear-gradient(to right, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.7) 35%, rgba(10, 10, 10, 0.3) 55%, transparent 75%)',
            pointerEvents: 'none'
          }}
        />

        {/* === CONTENT WRAPPER: Constrained Width (z-30) === */}
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
          {/* Max-Width Container - Prevents Ultra-Wide Stretch */}
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
                maxWidth: '580px',
                animation: 'heroFadeIn 1s ease-out 0.2s both'
              }}
            >
              {/* Badge */}
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '50px',
                  padding: '10px 20px',
                  marginBottom: '32px',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <Users size={16} color="#D4AF37" />
                <span style={{ 
                  fontSize: '13px', 
                  color: '#D4AF37', 
                  fontWeight: '600',
                  letterSpacing: '0.03em'
                }}>
                  Trusted by 200+ Winning Regs
                </span>
              </div>
              
              {/* Headline */}
              <h1 style={{
                fontSize: 'clamp(40px, 5vw, 60px)',
                fontWeight: '800',
                color: '#FFFFFF',
                marginBottom: '28px',
                lineHeight: 1.08,
                letterSpacing: '-0.025em',
                fontFamily: 'Manrope, Inter, sans-serif'
              }}>
                Master High-Stakes<br />
                Theory & <span style={{ 
                  color: '#D4AF37',
                  textShadow: '0 0 80px rgba(212, 175, 55, 0.4)'
                }}>Exploit the<br />Population</span>.
              </h1>
              
              {/* Subhead */}
              <p style={{
                fontSize: '17px',
                color: '#B0B0B8',
                maxWidth: '460px',
                lineHeight: 1.85,
                marginBottom: '40px',
                fontWeight: '400'
              }}>
                Stop guessing. Start executing. The exact data-driven strategies I used to win at 1KNL+ and help my students generate <strong style={{ color: '#FFFFFF', fontWeight: '500' }}>$5M+ in profits</strong>.
              </p>
              
              {/* CTA Button */}
              <a 
                href="https://calendly.com/freenachos/intro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-hover cta-primary"
                style={{
                  background: '#FF9900',
                  color: '#0a0a0a',
                  padding: '20px 44px',
                  borderRadius: '14px',
                  fontWeight: '700',
                  fontSize: '16px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 4px 30px rgba(255, 153, 0, 0.4)',
                  letterSpacing: '0.01em'
                }}
              >
                Apply for Mentorship <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Responsive Styles for Hero */}
        <style>{`
          @media (max-width: 1400px) {
            .hero-image-mask {
              right: -5% !important;
            }
          }
          @media (max-width: 1200px) {
            .hero-image-mask {
              right: -10% !important;
              height: 75vh !important;
              max-height: 800px !important;
            }
          }
          @media (max-width: 968px) {
            .hero-image-mask {
              display: none !important;
            }
          }
        `}</style>

        {/* === FLOOR FOG: Soft Bottom Transition (z-25) === */}
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '25vh',
            background: 'linear-gradient(to top, #0A0A0A 0%, rgba(10, 10, 10, 0.6) 50%, transparent 100%)',
            zIndex: 25,
            pointerEvents: 'none'
          }}
        />
      </section>

      {/* ==================== MUSEUM SPACER: Fade Zone ==================== */}
      <div 
        style={{
          height: '300px',
          position: 'relative',
          zIndex: 0
        }}
      />

      {/* ==================== MAIN CONTENT CONTAINER ==================== */}
      <div style={{position: 'relative', zIndex: 10, maxWidth: '1400px', margin: '0 auto', padding: '0 24px'}}>

        {/* About Section - First Card with Extra Dramatic Entrance */}
        <div 
          ref={aboutSectionRef}
          className="glass-card reveal-first"
          style={{
            borderRadius: '24px',
            padding: '64px',
            marginBottom: '200px'
          }}
        >
          {/* New Headline */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#F0F0F0',
              marginBottom: '8px',
              letterSpacing: '-0.01em'
            }}>
              The Coach Behind <span style={{ color: '#D4AF37' }}>$5M+</span> in Student Profits
            </h2>
          </div>

          {/* Stats Row - Prominent at Top */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '48px',
            padding: '28px 32px',
            background: 'rgba(18, 18, 18, 0.6)',
            borderRadius: '16px',
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#D4AF37', marginBottom: '6px' }}>$5M+</div>
              <div style={{ fontSize: '12px', color: 'rgba(240, 240, 240, 0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Student Profits</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#D4AF37', marginBottom: '6px' }}>200+</div>
              <div style={{ fontSize: '12px', color: 'rgba(240, 240, 240, 0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Players Coached</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#D4AF37', marginBottom: '6px' }}>6.2bb/100</div>
              <div style={{ fontSize: '12px', color: 'rgba(240, 240, 240, 0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Win Rate at 1KNL+</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#D4AF37', marginBottom: '6px' }}>10M+</div>
              <div style={{ fontSize: '12px', color: 'rgba(240, 240, 240, 0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Hands Played</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Bio Text - Rewritten for Authority (max-width 650px) */}
            <div style={{ flex: 1, minWidth: '300px', maxWidth: '650px' }}>
              {/* Paragraph 1: The Authority */}
              <p style={{
                color: 'rgba(240, 240, 240, 0.9)',
                fontSize: '16px',
                lineHeight: 1.9,
                marginBottom: '20px'
              }}>
                My students have generated over <strong style={{ color: '#D4AF37' }}>$5,000,000</strong> in combined profits. I maintain a <strong style={{ color: '#D4AF37' }}>6.2bb/100 win rate at 1KNL and above</strong>, with over 10 million hands of high-stakes experience. This isn't theory. It's a system that produces results.
              </p>
              
              {/* Paragraph 2: The Method */}
              <p style={{
                color: 'rgba(240, 240, 240, 0.8)',
                fontSize: '16px',
                lineHeight: 1.9,
                marginBottom: '20px'
              }}>
                I don't teach you to memorize solver outputs. I teach you to <strong style={{ color: '#D4AF37' }}>weaponize data</strong>. By identifying where real opponents deviate from equilibrium, we build strategies that exploit population tendencies in a controlled, repeatable way. GTO is the diagnostic tool. Exploitation is the profit engine.
              </p>
              
              {/* Paragraph 3: The Journey */}
              <p style={{
                color: 'rgba(240, 240, 240, 0.7)',
                fontSize: '16px',
                lineHeight: 1.9,
                marginBottom: '32px'
              }}>
                I wasn't born winning. My early graph was filled with breakeven stretches and frustrating downswings. What changed wasn't more study. It was a better system. That same system is now the foundation of my mentorship, and it's responsible for the results you see above.
              </p>

              {/* Secondary CTA after bio */}
              <a 
                href="https://calendly.com/freenachos/intro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-hover"
                style={{
                  background: 'transparent',
                  color: '#D4AF37',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '15px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: '2px solid rgba(212, 175, 55, 0.5)',
                  transition: 'all 0.3s ease'
                }}
              >
                Book a Free Intro Call <ArrowRight size={18} />
              </a>
            </div>
            
            {/* Results Graph - Visual Proof */}
            <div style={{
              flex: '0 0 360px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: '2px solid rgba(212, 175, 55, 0.35)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)'
              }}>
                <img 
                  src="https://static.runitonce.com/static/img/courses/dominate-with-data/chart.bcc69818f43c.jpg"
                  alt="Freenachos Results Graph - 6.2bb/100 at High Stakes"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </div>
              <div style={{ 
                textAlign: 'center',
                fontSize: '13px',
                color: 'rgba(240, 240, 240, 0.45)',
                fontStyle: 'italic'
              }}>
                Verified results at 1KNL+
              </div>
            </div>
          </div>
        </div>

        {/* What You Get in the Mentorship Program Section */}
        <div 
          id="mentorship"
          className="glass-card reveal"
          style={{
            borderRadius: '24px',
            padding: '72px 56px',
            marginBottom: '200px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '30px',
              padding: '8px 20px',
              marginBottom: '20px'
            }}>
              <Sparkles size={16} color="#D4AF37" />
              <span style={{ fontSize: '13px', color: '#D4AF37', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Exclusive Access
              </span>
            </div>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '800',
              color: '#F0F0F0',
              marginBottom: '12px',
              letterSpacing: '-0.02em'
            }}>
              What You Get
            </h2>
            <p style={{
              fontSize: '17px',
              color: 'rgba(240, 240, 240, 0.6)',
              maxWidth: '550px',
              margin: '0 auto',
              lineHeight: 1.7
            }}>
              Everything you need to transform from a struggling reg into a high-stakes crusher
            </p>
          </div>
          
          <div 
            className="benefits-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px'
            }}
          >
            {mentorshipBenefits.map((benefit, idx) => (
              <BenefitCard key={idx} benefit={benefit} index={idx} />
            ))}
          </div>
          
          {/* Responsive grid for smaller screens */}
          <style>{`
            @media (max-width: 1024px) {
              .benefits-grid {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
            @media (max-width: 680px) {
              .benefits-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </div>

        {/* Testimonials Section */}
        <div 
          id="testimonials"
          className="glass-card reveal"
          style={{
            borderRadius: '24px',
            padding: '64px',
            marginBottom: '200px',
            overflow: 'hidden'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#F0F0F0',
              marginBottom: '8px'
            }}>
              Testimonials
            </h2>
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
              style={{
                flex: '0 0 200px',
                height: '280px',
                background: 'rgba(15, 15, 15, 0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '20px',
                opacity: 0.5,
                transform: 'scale(0.9)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
              className="preview-card"
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
                "{testimonials[(currentTestimonialIndex - 1 + testimonials.length) % testimonials.length].quote.substring(0, 100)}..."
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '11px',
                fontWeight: '600',
                marginTop: '8px',
                flexShrink: 0
              }}>
                {testimonials[(currentTestimonialIndex - 1 + testimonials.length) % testimonials.length].name}
              </div>
            </div>

            {/* Main Testimonial Card */}
            <div 
              key={currentTestimonialIndex}
              className="testimonial-card-main"
              style={{
                flex: '0 0 600px',
                maxWidth: '600px',
                height: '480px',
                background: 'rgba(15, 15, 15, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 179, 71, 0.2)',
                borderRadius: '20px',
                padding: '32px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                animation: `${slideDirection === 'right' ? 'slideInRight' : 'slideInLeft'} 0.4s ease-out`
              }}
            >
              {/* Graph */}
              <div style={{
                background: 'rgba(15, 15, 15, 0.8)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
                border: '1px solid rgba(255, 179, 71, 0.2)',
                height: '160px',
                flexShrink: 0,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {testimonials[currentTestimonialIndex].hasBeforeAfter ? (
                  <BeforeAfterGraph 
                    imageBefore={testimonials[currentTestimonialIndex].imageBefore}
                    imageAfter={testimonials[currentTestimonialIndex].imageAfter}
                  />
                ) : (
                  <TestimonialGraph src={testimonials[currentTestimonialIndex].image} />
                )}
              </div>

              {/* Quote */}
              <div style={{
                position: 'relative',
                flex: 1,
                overflow: 'auto',
                marginBottom: '16px'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '-10px',
                  fontSize: '60px',
                  color: 'rgba(255, 179, 71, 0.2)',
                  fontFamily: 'Georgia, serif',
                  lineHeight: 1
                }}>
                  "
                </div>
                <p style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '15px',
                  lineHeight: 1.8,
                  fontStyle: 'italic',
                  paddingLeft: '30px',
                  paddingRight: '20px',
                  margin: 0
                }}>
                  {testimonials[currentTestimonialIndex].quote}
                </p>
              </div>

              {/* Name */}
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: '700'
                }}>
                  {testimonials[currentTestimonialIndex].name}
                </div>
                {testimonials[currentTestimonialIndex].subtitle && (
                  <div style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '13px',
                    marginTop: '4px'
                  }}>
                    {testimonials[currentTestimonialIndex].subtitle}
                  </div>
                )}
              </div>
            </div>

            {/* Right Preview Card */}
            <div 
              onClick={nextTestimonial}
              style={{
                flex: '0 0 200px',
                height: '280px',
                background: 'rgba(15, 15, 15, 0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '20px',
                opacity: 0.5,
                transform: 'scale(0.9)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
              className="preview-card"
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
                "{testimonials[(currentTestimonialIndex + 1) % testimonials.length].quote.substring(0, 100)}..."
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '11px',
                fontWeight: '600',
                marginTop: '8px',
                flexShrink: 0
              }}>
                {testimonials[(currentTestimonialIndex + 1) % testimonials.length].name}
              </div>
            </div>
          </div>

          {/* Carousel Controls */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '32px'
          }}>
            <button className="carousel-btn" onClick={prevTestimonial}>
              <ChevronLeft size={20} color="#D4AF37" />
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
            
            <button className="carousel-btn" onClick={nextTestimonial}>
              <ChevronRight size={20} color="#D4AF37" />
            </button>
          </div>
        </div>

        {/* YouTube Videos Section - Masterclass Vibe Check */}
        <div 
          className="glass-card reveal"
          id="videos"
          style={{
            borderRadius: '24px',
            padding: '56px',
            marginBottom: '200px'
          }}
        >
          <div className="section-title" style={{ marginBottom: '24px' }}>
            <Youtube size={24} color="#ef4444" />
            <h2>Latest Videos</h2>
            <div className="line" />
            <a 
              href="https://www.youtube.com/@nachospoker" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                fontSize: '13px',
                color: '#D4AF37',
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
                <ChevronLeft size={20} color="#D4AF37" />
              </button>
              <button className="carousel-btn" onClick={nextVideo}>
                <ChevronRight size={20} color="#D4AF37" />
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div 
          className="glass-card reveal"
          style={{
            borderRadius: '24px',
            padding: '72px 56px',
            marginBottom: '200px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '800',
              color: '#F0F0F0',
              marginBottom: '12px',
              letterSpacing: '-0.02em'
            }}>
              Investment
            </h2>
            <p style={{
              color: '#A1A1AA',
              fontSize: '17px',
              lineHeight: 1.8
            }}>
              Choose the commitment level that fits your goals
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px',
            alignItems: 'stretch',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            {pricingPlans.map((plan, idx) => (
              <PricingCard key={idx} plan={plan} />
            ))}
          </div>
        </div>

        {/* You're a Good Fit If Section */}
        <div 
          className="glass-card reveal"
          style={{
            borderRadius: '24px',
            padding: '72px 56px',
            marginBottom: '200px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '800',
              color: '#F0F0F0',
              marginBottom: '12px',
              letterSpacing: '-0.02em'
            }}>
              Is This Right For You?
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px',
            maxWidth: '950px',
            margin: '0 auto'
          }}>
            {/* Good Fit Column */}
            <div>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#F0F0F0',
                marginBottom: '28px'
              }}>
                You're a good fit if:
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {goodFitReasons.map((reason, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(212, 175, 55, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <Check size={14} color="#D4AF37" />
                    </div>
                    <span style={{
                      color: 'rgba(240, 240, 240, 0.8)',
                      fontSize: '15px',
                      lineHeight: 1.6
                    }}>
                      {reason}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Not a Fit Column */}
            <div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#F0F0F0',
                marginBottom: '24px'
              }}>
                Not a fit if:
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {notAFitReasons.map((reason, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(239, 68, 68, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <X size={14} color="#ef4444" />
                    </div>
                    <span style={{
                      color: 'rgba(240, 240, 240, 0.55)',
                      fontSize: '15px',
                      lineHeight: 1.6
                    }}>
                      {reason}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div style={{
            textAlign: 'center',
            marginTop: '48px'
          }}>
            <a 
              href="https://calendly.com/patrickgerritsen90/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover cta-primary"
              style={{
                background: '#FF9900',
                color: '#0a0a0a',
                padding: '18px 36px',
                borderRadius: '30px',
                fontWeight: '600',
                fontSize: '15px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 6px 28px rgba(255, 153, 0, 0.45)'
              }}
            >
              Book Free Intro Call
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div 
          className="glass-card reveal"
          style={{
            borderRadius: '24px',
            padding: '72px 56px',
            marginBottom: '200px',
            animation: 'fadeInUp 0.6s ease-out 0.45s both'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '800',
              color: '#F0F0F0',
              marginBottom: '12px',
              letterSpacing: '-0.02em'
            }}>
              Frequently Asked Questions
            </h2>
            <p style={{
              color: '#A1A1AA',
              fontSize: '17px',
              lineHeight: 1.8
            }}>
              Everything you need to know about the mentorship
            </p>
          </div>

          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {faqItems.map((item, idx) => (
              <FAQItem 
                key={idx} 
                item={item} 
                index={idx}
                isExpanded={expandedFAQ === idx}
                onToggle={(i) => setExpandedFAQ(expandedFAQ === i ? -1 : i)}
              />
            ))}
          </div>
        </div>

        {/* ==================== AUTHORITY VAULT SECTION ==================== */}
        <div 
          className="reveal"
          style={{
            marginBottom: '200px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{
              fontSize: '42px',
              fontWeight: '800',
              color: '#D4AF37',
              marginBottom: '16px',
              letterSpacing: '-0.02em',
              textShadow: '0 0 60px rgba(212, 175, 55, 0.3)'
            }}>
              Still looking for the edge?
            </h2>
            <p style={{
              color: '#A1A1AA',
              fontSize: '18px',
              maxWidth: '500px',
              margin: '0 auto',
              lineHeight: 1.7
            }}>
              Free resources to sharpen your game before you commit
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '32px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {/* Card A - Strategy Vault (Articles) */}
            <a 
              href="/articles"
              className="authority-vault-card"
              style={{
                display: 'block',
                background: 'rgba(18, 18, 18, 0.4)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(212, 175, 55, 0.15)',
                borderRadius: '28px',
                padding: '56px 48px',
                textDecoration: 'none',
                transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 60%)',
                opacity: 0,
                transition: 'opacity 0.5s ease',
                pointerEvents: 'none'
              }} className="vault-card-glow" />
              
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'rgba(168, 85, 247, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '28px'
              }}>
                <BookOpen size={32} color="#a855f7" />
              </div>
              
              <h3 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#F0F0F0',
                marginBottom: '12px',
                letterSpacing: '-0.01em'
              }}>
                The Strategy Vault
              </h3>
              
              <p style={{
                fontSize: '16px',
                color: 'rgba(240, 240, 240, 0.6)',
                lineHeight: 1.7,
                marginBottom: '24px'
              }}>
                Deep-dives into high-stakes theory and population exploits.
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#D4AF37',
                fontSize: '15px',
                fontWeight: '600'
              }}>
                Explore articles <ArrowRight size={18} />
              </div>
            </a>

            {/* Card B - Performance Toolkit (Tools) */}
            <a 
              href="/tools"
              className="authority-vault-card"
              style={{
                display: 'block',
                background: 'rgba(18, 18, 18, 0.4)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(212, 175, 55, 0.15)',
                borderRadius: '28px',
                padding: '56px 48px',
                textDecoration: 'none',
                transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 60%)',
                opacity: 0,
                transition: 'opacity 0.5s ease',
                pointerEvents: 'none'
              }} className="vault-card-glow" />
              
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'rgba(212, 175, 55, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '28px'
              }}>
                <Calculator size={32} color="#D4AF37" />
              </div>
              
              <h3 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#F0F0F0',
                marginBottom: '12px',
                letterSpacing: '-0.01em'
              }}>
                The Performance Toolkit
              </h3>
              
              <p style={{
                fontSize: '16px',
                color: 'rgba(240, 240, 240, 0.6)',
                lineHeight: 1.7,
                marginBottom: '24px'
              }}>
                Proprietary bankroll, variance, and win-rate calculators.
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#D4AF37',
                fontSize: '15px',
                fontWeight: '600'
              }}>
                Access tools <ArrowRight size={18} />
              </div>
            </a>
          </div>
        </div>

        <style>{`
          .authority-vault-card:hover {
            transform: translateY(-8px);
            border-color: rgba(212, 175, 55, 0.35);
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(212, 175, 55, 0.1);
          }
          .authority-vault-card:hover .vault-card-glow {
            opacity: 1 !important;
          }
          @media (max-width: 860px) {
            .authority-vault-card {
              padding: 40px 32px !important;
            }
          }
        `}</style>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          padding: '40px 0',
          marginTop: '24px',
          borderTop: '1px solid rgba(212, 175, 55, 0.1)'
        }}>
          <p style={{
            fontSize: '13px',
            color: 'rgba(240, 240, 240, 0.4)'
          }}>
            © 2025 Freenachos Poker. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PokerToolboxHome;

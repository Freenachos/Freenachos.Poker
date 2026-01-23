"use client";

import NachosPokerNavBar from '@/components/NachosPokerNavBar';
import NewsletterPopup from '@/components/NewsletterPopup';

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
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');
  const [expandedFAQ, setExpandedFAQ] = useState(0);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [showGraphModal, setShowGraphModal] = useState(false);
  const [showTestimonialGraphModal, setShowTestimonialGraphModal] = useState(null);
  const nachoRef = useRef(null);
  const aboutSectionRef = useRef(null);
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
      description: "We skip the small talk and audit your ranges against GTO to identify exactly where you are bleeding EV. By comparing your ranges to the GTO range composition, we build a personalized study plan and custom protocols to plug your leaks."
    },
    {
      icon: Swords,
      title: 'High-Stakes War Room',
      description: 'Join weekly live study sessions with a group of motivated crushers. Dissect hands, debate lines, and stay accountable in a high-performance environment designed to help you improve consistently.'
    },
    {
      icon: Zap,
      title: "The 'Nacho' Stat Validator",
      description: "Exclusive access to a unique tool that compares your entire range structure to solver outputs. Instantly visualize where your strategy deviates from optimal play and see where your leaks are in an X-ray of your game."
    },
    {
      icon: Brain,
      title: 'Performance by Design',
      description: 'A complete mental operating system tailored for the reality of high-volume grinding. Eliminate tilt, master your focus, and build the discipline required for long-term consistency and confidence at the tables.'
    },
    {
      icon: Lock,
      title: 'The Strategy Vault',
      description: 'Unlock access to a growing library of high-stakes analyses, hand reviews, and deep theoretical dives. These videos cover the exact concepts and strategies used to beat 1KNL and above.'
    },
    {
      icon: MessageCircle,
      title: 'Direct Mentor Access',
      description: 'You are never alone on the grind. Get direct priority support via my private Discord to post hands, ask questions, and get strategy breakdowns from me personally.'
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
      buttonText: 'Book Free Introcall'
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
      buttonText: 'Book Free Introcall'
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
      buttonText: 'Book Free Introcall'
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
    { id: 3, name: 'Seat Selection EV', description: 'Visualize how fish position impacts your win rate at 6-max tables', icon: Target, color: '#A78A43', link: '/seat' },
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

  // ============================================
  // COMPONENTS
  // ============================================

  const CartoonNacho = ({ size = 90 }) => (
    <svg ref={nachoRef} width={size} height={size} viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 4px 12px rgba(255, 179, 71, 0.4))' }}>
      <path d="M50 8 L88 85 Q90 92 82 92 L18 92 Q10 92 12 85 Z" fill="#A78A43" stroke="#8B7339" strokeWidth="2"/>
      <path d="M25 70 Q20 75 22 82 Q24 88 28 85 Q30 80 28 75 Z" fill="#FFD54F" opacity="0.9"/>
      <path d="M72 65 Q78 72 76 80 Q74 86 70 82 Q68 76 70 70 Z" fill="#FFD54F" opacity="0.9"/>
      <path d="M48 75 Q45 82 48 88 Q52 92 55 86 Q56 80 52 76 Z" fill="#FFD54F" opacity="0.9"/>
      <ellipse cx="50" cy="50" rx="22" ry="18" fill="#A78A43" />
      <ellipse cx="40" cy="48" rx="8" ry="9" fill="white" />
      <ellipse cx="60" cy="48" rx="8" ry="9" fill="white" />
      <circle cx={40 + eyeOffset.x} cy={48 + eyeOffset.y} r="4" fill="#1a1a1a" style={{ transition: 'cx 0.1s ease-out, cy 0.1s ease-out' }}/>
      <circle cx={60 + eyeOffset.x} cy={48 + eyeOffset.y} r="4" fill="#1a1a1a" style={{ transition: 'cx 0.1s ease-out, cy 0.1s ease-out' }}/>
      <circle cx={38 + eyeOffset.x * 0.5} cy={46 + eyeOffset.y * 0.5} r="1.5" fill="white" opacity="0.8" />
      <circle cx={58 + eyeOffset.x * 0.5} cy={46 + eyeOffset.y * 0.5} r="1.5" fill="white" opacity="0.8" />
      <path d="M38 62 Q50 72 62 62" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
      <path d="M33 38 Q40 35 47 38" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      <path d="M53 38 Q60 35 67 38" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="30" r="2" fill="#8B7339" opacity="0.5" />
      <circle cx="70" cy="35" r="2.5" fill="#8B7339" opacity="0.5" />
      <circle cx="35" cy="80" r="2" fill="#8B7339" opacity="0.5" />
      <circle cx="65" cy="78" r="1.5" fill="#8B7339" opacity="0.5" />
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
          background: 'radial-gradient(circle at 50% 50%, rgba(167, 138, 67, 0.25) 0%, transparent 70%)',
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
          color: '#A78A43',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          background: 'rgba(167, 138, 67, 0.15)',
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
        color: '#A78A43',
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
            background: 'rgba(167, 138, 67, 0.08)',
            border: '1px solid rgba(167, 138, 67, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            pointerEvents: 'none'
          }}
        >
          <Icon size={28} color="#A78A43" strokeWidth={1.5} />
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
      className={`pricing-card-authority ${plan.featured ? 'featured' : ''}`}
      style={{
        position: 'relative',
        background: 'rgba(18, 18, 18, 0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: plan.featured ? '1px solid rgba(168, 139, 70, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '40px 32px',
        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '560px',
        overflow: 'hidden'
      }}
    >
      {/* Radial glow for featured card */}
      {plan.featured && (
        <div style={{
          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '150%',
          height: '200px',
          background: 'radial-gradient(ellipse at center top, rgba(168, 139, 70, 0.15) 0%, rgba(168, 139, 70, 0.05) 40%, transparent 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
          zIndex: 0
        }} />
      )}

      {/* Badge */}
      {plan.badge && (
        <div style={{
          position: 'absolute',
          top: '-1px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: plan.featured ? '#a88b46' : 'rgba(168, 139, 70, 0.15)',
          color: plan.featured ? '#0a0a0a' : '#a88b46',
          fontSize: '10px',
          fontWeight: '700',
          padding: '8px 20px',
          borderRadius: '0 0 12px 12px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          whiteSpace: 'nowrap',
          zIndex: 2
        }}>
          {plan.badge}
        </div>
      )}
      
      {/* Plan Name */}
      <div style={{
        color: '#a88b46',
        fontSize: '12px',
        fontWeight: '600',
        marginBottom: '20px',
        marginTop: plan.badge ? '16px' : '0',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        position: 'relative',
        zIndex: 1
      }}>
        {plan.name}
      </div>
      
      {/* Price */}
      <div style={{
        marginBottom: '8px',
        position: 'relative',
        zIndex: 1
      }}>
        <span style={{
          color: '#FFFFFF',
          fontSize: '52px',
          fontWeight: '800',
          lineHeight: 1,
          letterSpacing: '-0.02em'
        }}>
          €{plan.totalPrice}
        </span>
      </div>
      
      {/* Payment Note */}
      <div style={{
        color: 'rgba(240, 240, 240, 0.45)',
        fontSize: '13px',
        marginBottom: '8px',
        lineHeight: 1.5,
        minHeight: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        {plan.paymentNote}
      </div>
      
      {/* Savings text */}
      <div style={{
        height: '22px',
        marginBottom: '24px',
        position: 'relative',
        zIndex: 1
      }}>
        {plan.savings && (
          <span style={{
            color: '#a88b46',
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
        background: 'linear-gradient(90deg, transparent, rgba(168, 139, 70, 0.25), transparent)',
        marginBottom: '28px',
        position: 'relative',
        zIndex: 1
      }} />
      
      {/* Features */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        flex: 1,
        marginBottom: '32px',
        position: 'relative',
        zIndex: 1
      }}>
        {plan.features.map((feature, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <Check size={15} color="#a88b46" style={{ flexShrink: 0, marginTop: '2px' }} strokeWidth={2.5} />
            <span style={{
              color: 'rgba(240, 240, 240, 0.75)',
              fontSize: '14px',
              lineHeight: 1.5
            }}>
              {feature}
            </span>
          </div>
        ))}
      </div>
      
      {/* CTA Button - Outline style matching Book Free Introcall */}
      <a
        href="https://calendly.com/patrickgerritsen90/30min"
        target="_blank"
        rel="noopener noreferrer"
        className="pricing-cta-btn"
        style={{
          display: 'block',
          width: '100%',
          padding: '16px 24px',
          borderRadius: '12px',
          fontWeight: '600',
          fontSize: '15px',
          textAlign: 'center',
          textDecoration: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          background: plan.featured ? '#a88b46' : 'transparent',
          color: plan.featured ? '#0a0a0a' : '#a88b46',
          border: plan.featured ? 'none' : '1.5px solid #a88b46',
          marginTop: 'auto',
          position: 'relative',
          zIndex: 1
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
        border: '1px solid rgba(167, 138, 67, 0.2)',
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
          color="#A78A43"
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

      {/* Sticky CTA Button - Discord DM - Only visible after scrolling past hero */}
      {showStickyCta && (
        <a 
          href="https://discord.com/users/420357572109926411" 
          target="_blank" 
          rel="noopener noreferrer"
          className="sticky-discord-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          DM on Discord
        </a>
      )}
      
      <style>{`
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
          border: 1px solid rgba(167, 138, 67, 0.15);
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
          box-shadow: 0 0 20px rgba(167, 138, 67, 0.4), 0 10px 40px rgba(167, 138, 67, 0.3);
          background: #FFa31a;
        }

        /* Discord DM Floating Button */
        .sticky-discord-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          background: #5865F2;
          color: #FFFFFF;
          padding: 14px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 14px rgba(88, 101, 242, 0.4);
          border: none;
          cursor: pointer;
          transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
          animation: discordBtnEnter 0.4s ease-out, discordShake 0.5s ease-in-out 0.4s;
        }

        .sticky-discord-btn:hover {
          background: #4752C4;
          box-shadow: 0 6px 20px rgba(88, 101, 242, 0.5);
          transform: translateY(-2px);
        }

        .sticky-discord-btn:active {
          transform: translateY(0);
          background: #3C45A5;
        }

        @keyframes discordBtnEnter {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes discordShake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-6px) rotate(-2deg); }
          30% { transform: translateX(5px) rotate(2deg); }
          45% { transform: translateX(-4px) rotate(-1deg); }
          60% { transform: translateX(3px) rotate(1deg); }
          75% { transform: translateX(-2px); }
          90% { transform: translateX(1px); }
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
          background: linear-gradient(135deg, rgba(167, 138, 67, 0.4), rgba(167, 138, 67, 0.1));
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
          background: linear-gradient(90deg, transparent 0%, #A78A43 50%, #A78A43 100%);
          box-shadow: 0 0 15px 2px rgba(167, 138, 67, 0.7);
          offset-path: rect(0 100% 100% 0 round 20px);
          animation: traceBorder 5s linear infinite;
          offset-rotate: auto;
          offset-anchor: center;
          z-index: 2;
          pointer-events: none;
        }

        .hero-gradient {
          background: radial-gradient(ellipse at 50% 0%, rgba(167, 138, 67, 0.12) 0%, transparent 50%);
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
          background: linear-gradient(90deg, rgba(167, 138, 67, 0.4), transparent);
        }

        .carousel-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(167, 138, 67, 0.15);
          border: 1px solid rgba(167, 138, 67, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .carousel-btn:hover {
          background: rgba(167, 138, 67, 0.25);
          border-color: #A78A43;
          box-shadow: 0 0 20px rgba(167, 138, 67, 0.3);
        }

        .video-card {
          transform: translateX(0);
        }
        .video-card:hover {
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 30px 60px rgba(167, 138, 67, 0.25), 0 0 40px rgba(167, 138, 67, 0.15);
          border-color: rgba(167, 138, 67, 0.5);
        }
        .video-card:hover .video-thumbnail {
          transform: scale(1.05);
        }
        .video-card:hover .play-button {
          transform: scale(1.15);
          box-shadow: 0 8px 40px rgba(167, 138, 67, 0.7);
        }
        .video-card:hover .video-gold-bloom {
          opacity: 1 !important;
        }

        .benefit-card {
          background: #1A1A1A;
          border: 1px solid rgba(167, 138, 67, 0.2);
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
          background: linear-gradient(90deg, transparent, #A78A43, transparent);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .benefit-card:hover::before {
          opacity: 1;
        }

        .benefit-card:hover {
          border-color: rgba(167, 138, 67, 0.4);
        }

        .benefit-card .benefit-icon {
          transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
        }

        .benefit-card:hover .benefit-icon {
          background: rgba(167, 138, 67, 0.15);
          border-color: rgba(167, 138, 67, 0.6);
          box-shadow: 0 0 20px rgba(167, 138, 67, 0.25);
        }

        .benefit-card .benefit-title {
          transition: color 0.4s ease;
        }

        .benefit-card:hover .benefit-title {
          color: #A78A43;
        }

        .pricing-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .pricing-card.featured:hover {
          transform: scale(1.05);
          box-shadow: 0 0 50px rgba(167, 138, 67, 0.25), 0 25px 50px rgba(0, 0, 0, 0.4);
        }

        .faq-item:hover {
          border-color: rgba(167, 138, 67, 0.4);
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
      <section 
        ref={heroSectionRef}
        className="hero-section-fade"
        style={{
          position: 'relative',
          minHeight: '100vh',
          width: '100%',
          overflow: 'hidden',
          background: 'transparent',
          zIndex: 10
        }}
      >
        {/* === HALO LIGHTING: Key Light Behind Coach (z-5) === */}
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
                  background: 'rgba(167, 138, 67, 0.1)',
                  border: '1px solid rgba(167, 138, 67, 0.3)',
                  borderRadius: '50px',
                  padding: '10px 20px',
                  marginBottom: '32px',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <Users size={16} color="#A78A43" />
                <span style={{ 
                  fontSize: '13px', 
                  color: '#A78A43', 
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
                  color: '#A78A43',
                  textShadow: '0 0 80px rgba(167, 138, 67, 0.4)'
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
                href="https://calendly.com/patrickgerritsen90/30min" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-hover cta-primary"
                style={{
                  background: '#A78A43',
                  color: '#0a0a0a',
                  padding: '20px 44px',
                  borderRadius: '14px',
                  fontWeight: '700',
                  fontSize: '16px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 4px 30px rgba(167, 138, 67, 0.4)',
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

        {/* ==================== COACH SECTION - Authority Split Layout ==================== */}
        <div 
          ref={aboutSectionRef}
          className="reveal-first coach-authority-section"
          style={{
            paddingTop: '256px',
            paddingBottom: '256px',
            marginBottom: '0',
            position: 'relative'
          }}
        >
          {/* Centered Headline */}
          <h2 
            style={{
              fontSize: 'clamp(36px, 4.5vw, 56px)',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '72px',
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              fontFamily: 'Manrope, Inter, sans-serif',
              textAlign: 'center'
            }}
          >
            The Coach Behind <span style={{ 
              color: '#a88b46',
              textShadow: '0 0 60px rgba(168, 139, 70, 0.4)',
              position: 'relative',
              display: 'inline-block'
            }}>
              {/* Subtle radial glow anchor */}
              <span style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '180%',
                height: '300%',
                background: 'radial-gradient(ellipse at center, rgba(168, 139, 70, 0.15) 0%, rgba(168, 139, 70, 0.05) 40%, transparent 70%)',
                filter: 'blur(20px)',
                pointerEvents: 'none',
                zIndex: -1
              }} />
              $5M+
            </span> in Student Profits
          </h2>

          {/* Two-Column Authority Split */}
          <div 
            className="authority-split-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '80px',
              alignItems: 'start',
              maxWidth: '1200px',
              margin: '0 auto'
            }}
          >
            {/* LEFT COLUMN - Copy */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingRight: '24px'
            }}>
              <div style={{
                color: 'rgba(240, 240, 240, 0.8)',
                fontSize: '17px',
                lineHeight: 1.9,
                fontWeight: '400'
              }}>
                <p style={{ marginBottom: '24px' }}>
                  I didn't start out winning. I went through long breakeven stretches and downswings, even while studying and putting in serious volume. The problem wasn't a lack of effort. It was that I lacked a system that worked against real opponents.
                </p>
                <p style={{ marginBottom: '24px', color: 'rgba(240, 240, 240, 0.7)' }}>
                  Everything changed when I stopped memorizing solver outputs and started using <span style={{ color: '#a88b46', fontWeight: '500' }}>GTO as a diagnostic tool</span>. By comparing equilibrium to actual population behavior, I learned how to identify recurring imbalances and build strategies that exploit them in a repeatable way.
                </p>
                <p style={{ color: 'rgba(240, 240, 240, 0.6)' }}>
                  I teach you to translate data into profit. The goal is not theoretical perfection. It is a <span style={{ color: '#a88b46', fontWeight: '500' }}>consistent, repeatable system</span> that wins over large samples.
                </p>
              </div>

              {/* CTA Button */}
              <a 
                href="https://calendly.com/patrickgerritsen90/30min" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-hover authority-cta-btn"
                style={{
                  marginTop: '48px',
                  background: 'transparent',
                  color: '#a88b46',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '15px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: '1.5px solid #a88b46',
                  transition: 'all 0.3s ease',
                  width: 'fit-content'
                }}
              >
                Book Free Introcall <ArrowRight size={16} />
              </a>
            </div>

            {/* RIGHT COLUMN - Visual Proof */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              {/* Graph Display */}
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '480px'
              }}>
                {/* Subtle Ambient Glow */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '110%',
                  height: '110%',
                  background: 'radial-gradient(ellipse at center, rgba(168, 139, 70, 0.12) 0%, transparent 60%)',
                  filter: 'blur(40px)',
                  pointerEvents: 'none',
                  zIndex: 0
                }} />
                
                {/* Graph Frame - Clickable */}
                <div 
                  onClick={() => setShowGraphModal(true)}
                  className="graph-frame-clickable"
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    border: '1px solid rgba(168, 139, 70, 0.2)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
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
                  {/* Hover overlay */}
                  <div className="graph-hover-overlay" style={{
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
                      fontSize: '13px',
                      fontWeight: '600',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase'
                    }}>Click to expand</span>
                  </div>
                </div>
                
                {/* Caption */}
                <div style={{ 
                  textAlign: 'center',
                  fontSize: '12px',
                  color: 'rgba(240, 240, 240, 0.45)',
                  fontStyle: 'italic',
                  marginTop: '16px',
                  letterSpacing: '0.02em'
                }}>
                  Verified results · 1KNL+
                </div>
              </div>

              {/* Separator Line */}
              <div style={{
                width: '100%',
                maxWidth: '480px',
                height: '1px',
                background: 'rgba(168, 139, 70, 0.15)',
                margin: '32px 0'
              }} />

              {/* Stats Row - 4 in a single row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '480px',
                gap: '16px'
              }}>
                {[
                  { value: '$5M+', label: 'CFP Profits' },
                  { value: '200+', label: 'Students' },
                  { value: '6.2bb', label: 'Win Rate' },
                  { value: '10M+', label: 'Hands' }
                ].map((stat, idx) => (
                  <div 
                    key={idx}
                    style={{ 
                      textAlign: 'left',
                      flex: 1
                    }}
                  >
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: '800', 
                      color: '#FFFFFF', 
                      marginBottom: '4px',
                      letterSpacing: '-0.02em',
                      lineHeight: 1
                    }}>
                      {stat.value}
                    </div>
                    <div style={{ 
                      fontSize: '10px', 
                      color: '#a88b46', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.1em',
                      fontWeight: '600',
                      lineHeight: 1.3
                    }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Graph Modal */}
          {showGraphModal && (
            <div 
              onClick={() => setShowGraphModal(false)}
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
                  onClick={() => setShowGraphModal(false)}
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
                    src="https://static.runitonce.com/static/img/courses/dominate-with-data/chart.bcc69818f43c.jpg"
                    alt="Freenachos Results Graph - 6.2bb/100 at High Stakes"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block'
                    }}
                  />
                </div>
                
                {/* Modal Caption */}
                <div style={{
                  textAlign: 'center',
                  fontSize: '13px',
                  color: 'rgba(240, 240, 240, 0.5)',
                  marginTop: '16px',
                  fontStyle: 'italic'
                }}>
                  Verified results · 6.2bb/100 at 1KNL+
                </div>
              </div>
            </div>
          )}

          {/* Authority Split Responsive Styles */}
          <style>{`
            .authority-cta-btn:hover {
              background: rgba(168, 139, 70, 0.08) !important;
              border-color: #a88b46 !important;
              transform: translateY(-2px);
              box-shadow: 0 8px 24px rgba(168, 139, 70, 0.15);
            }
            
            .graph-frame-clickable:hover {
              border-color: rgba(168, 139, 70, 0.4) !important;
              transform: translateY(-2px);
              box-shadow: 0 28px 72px rgba(0, 0, 0, 0.5), 0 0 30px rgba(168, 139, 70, 0.1) !important;
            }
            
            .graph-frame-clickable:hover .graph-hover-overlay {
              opacity: 1 !important;
            }
            
            .modal-close-btn:hover {
              background: rgba(168, 139, 70, 0.2) !important;
              border-color: rgba(168, 139, 70, 0.5) !important;
              transform: scale(1.05);
            }
            
            @keyframes modalFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            @keyframes modalScaleIn {
              from { 
                opacity: 0;
                transform: scale(0.95);
              }
              to { 
                opacity: 1;
                transform: scale(1);
              }
            }
            
            @media (max-width: 960px) {
              .authority-split-grid {
                grid-template-columns: 1fr !important;
                gap: 64px !important;
              }
              .authority-split-grid > div:first-child {
                padding-right: 0 !important;
                text-align: center;
              }
              .authority-split-grid > div:first-child a {
                margin-left: auto;
                margin-right: auto;
              }
            }
            
            @media (max-width: 768px) {
              .coach-authority-section {
                padding-top: 160px !important;
                padding-bottom: 160px !important;
              }
            }

            @media (max-width: 520px) {
              .authority-split-grid > div:last-child > div:last-child {
                flex-wrap: wrap !important;
                gap: 24px !important;
              }
              .authority-split-grid > div:last-child > div:last-child > div {
                flex: 0 0 calc(50% - 12px) !important;
              }
            }
          `}</style>
        </div>

        {/* ==================== WHAT YOU GET - Interactive Gallery ==================== */}
        <div 
          id="mentorship"
          className="reveal what-you-get-section"
          style={{
            paddingTop: '256px',
            paddingBottom: '256px',
            marginBottom: '0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Centered Authority Header */}
          <div style={{ 
            textAlign: 'center',
            marginBottom: '80px',
            maxWidth: '672px'
          }}>
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
              <Sparkles size={16} color="#A78A43" />
              <span style={{ fontSize: '13px', color: '#A78A43', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Exclusive Access
              </span>
            </div>
            <h2 
              
              style={{
                fontSize: 'clamp(38px, 5vw, 56px)',
                fontWeight: '800',
                color: '#FFFFFF',
                marginBottom: '24px',
                lineHeight: 1.08,
                letterSpacing: '-0.025em',
                fontFamily: 'Manrope, Inter, sans-serif',
                transition: 'all 0.4s ease'
              }}
            >
              What You <span style={{ 
                color: '#A78A43',
                textShadow: '0 0 60px rgba(167, 138, 67, 0.4)',
                transition: 'all 0.4s ease'
              }}>Get</span>
            </h2>
            <p style={{
              fontSize: '18px',
              color: 'rgba(240, 240, 240, 0.6)',
              lineHeight: 1.85,
              maxWidth: '520px',
              margin: '0 auto'
            }}>
              Everything you need to transform from a struggling reg into a high-stakes crusher
            </p>
          </div>
          
          {/* Ghost Grid - Icons Float on the Void */}
          <div 
            className="ghost-benefits-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '48px',
              maxWidth: '1200px',
              width: '100%'
            }}
          >
            {mentorshipBenefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={idx}
                  className="ghost-benefit-item"
                  style={{
                    padding: '48px 36px',
                    borderRadius: '24px',
                    transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                    cursor: 'default',
                    position: 'relative',
                    background: 'transparent',
                    border: '1px solid transparent'
                  }}
                >
                  {/* Icon with Gradient Effect */}
                  <div 
                    className="ghost-icon-container"
                    style={{
                      position: 'relative',
                      width: '72px',
                      height: '72px',
                      borderRadius: '18px',
                      background: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '28px',
                      transition: 'all 0.5s ease'
                    }}
                  >
                    {/* Gold Bloom Glow - Hidden by default */}
                    <div 
                      className="icon-bloom"
                      style={{
                        position: 'absolute',
                        inset: '-20px',
                        background: 'radial-gradient(circle, rgba(167, 138, 67, 0.35) 0%, transparent 70%)',
                        filter: 'blur(20px)',
                        opacity: 0,
                        transition: 'opacity 0.5s ease',
                        pointerEvents: 'none'
                      }}
                    />
                    {/* Icon with Gold-to-White gradient appearance */}
                    <Icon 
                      size={36} 
                      strokeWidth={1.5}
                      style={{
                        color: '#A78A43',
                        filter: 'drop-shadow(0 0 8px rgba(167, 138, 67, 0.3))',
                        transition: 'all 0.4s ease'
                      }}
                      className="ghost-icon"
                    />
                  </div>
                  
                  {/* Title */}
                  <h3 style={{
                    color: '#F0F0F0',
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '14px',
                    lineHeight: 1.3,
                    transition: 'color 0.4s ease'
                  }}>
                    {benefit.title}
                  </h3>
                  
                  {/* Description */}
                  <p style={{
                    color: 'rgba(240, 240, 240, 0.5)',
                    fontSize: '15px',
                    lineHeight: 1.8
                  }}>
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
          
          {/* Ghost Grid Interactive Styles */}
          <style>{`
            /* Default: Naked/Ghost state - floating on void */
            .ghost-benefit-item {
              background: transparent !important;
              border: 1px solid transparent !important;
            }
            
            /* Hover: Glass Reveal with Bloom */
            .ghost-benefit-item:hover {
              background: rgba(255, 255, 255, 0.05) !important;
              backdrop-filter: blur(24px);
              -webkit-backdrop-filter: blur(24px);
              border: 1px solid rgba(255, 255, 255, 0.10) !important;
              transform: translateY(-8px);
              box-shadow: 0 32px 64px rgba(0, 0, 0, 0.3);
            }
            
            /* Icon bloom on hover */
            .ghost-benefit-item:hover .icon-bloom {
              opacity: 1 !important;
            }
            
            /* Icon brightens on hover */
            .ghost-benefit-item:hover .ghost-icon {
              color: #FFFFFF !important;
              filter: drop-shadow(0 0 16px rgba(167, 138, 67, 0.6)) !important;
            }
            
            /* Responsive Grid */
            @media (max-width: 1024px) {
              .ghost-benefits-grid {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 32px !important;
              }
            }
            @media (max-width: 680px) {
              .ghost-benefits-grid {
                grid-template-columns: 1fr !important;
                gap: 24px !important;
              }
              .what-you-get-section {
                padding-top: 160px !important;
                padding-bottom: 160px !important;
              }
            }
          `}</style>
        </div>

        {/* ==================== TESTIMONIALS - Individual Cards Only ==================== */}
        <div 
          id="testimonials"
          className="reveal"
          style={{
            paddingTop: '60px',
            paddingBottom: '120px',
            marginBottom: '250px',
            overflow: 'visible'
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
              Results and testimonials from players I've worked with.
            </p>
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
                "{testimonials[(currentTestimonialIndex - 1 + testimonials.length) % testimonials.length].quote.substring(0, 100)}..."
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
                "{testimonials[currentTestimonialIndex].quote}"
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
                  <div style={{ color: 'rgba(167, 138, 67, 0.8)', fontSize: '13px' }}>
                    {testimonials[currentTestimonialIndex].result}
                  </div>
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
                "{testimonials[(currentTestimonialIndex + 1) % testimonials.length].quote.substring(0, 100)}..."
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
          <style>{`
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
          `}</style>
        </div>
        {/* ==================== DEAD SPACE: Cinema Transition Zone ==================== */}
        {/* 40vh of darkness with drifting nachos before YouTube section */}
        <div style={{ height: '40vh', position: 'relative', zIndex: 0 }} />

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
            marginBottom: '200px'
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
              See my thought process in action. If this approach makes sense to you, you're in the right place.
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
              background: 'linear-gradient(to right, #0A0A0A 0%, transparent 100%)',
              zIndex: 10,
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '100px',
              background: 'linear-gradient(to left, #0A0A0A 0%, transparent 100%)',
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
          <style>{`
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
          `}</style>
        </div>

        {/* ==================== PRICING SECTION - Authority Style ==================== */}
        <div 
          id="pricing"
          className="reveal"
          style={{
            paddingTop: '60px',
            paddingBottom: '120px',
            marginBottom: '250px'
          }}
        >
          {/* Centered Header */}
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <h2 style={{
              fontSize: 'clamp(38px, 5vw, 56px)',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '20px',
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              fontFamily: 'Manrope, Inter, sans-serif'
            }}>
              Choose Your <span style={{ 
                color: '#a88b46',
                textShadow: '0 0 60px rgba(168, 139, 70, 0.4)'
              }}>Commitment</span>
            </h2>
            <p style={{
              color: 'rgba(240, 240, 240, 0.5)',
              fontSize: '17px',
              lineHeight: 1.7,
              maxWidth: '480px',
              margin: '0 auto'
            }}>
              Select the path that fits your goals and timeline.
            </p>
          </div>

          <div 
            className="pricing-grid-authority"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
              alignItems: 'stretch',
              maxWidth: '1100px',
              margin: '0 auto'
            }}>
            {pricingPlans.map((plan, idx) => (
              <PricingCard key={idx} plan={plan} />
            ))}
          </div>

          {/* Pricing card styles */}
          <style>{`
            .pricing-card-authority {
              box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
            }
            .pricing-card-authority:hover {
              transform: translateY(-4px);
              border-color: rgba(168, 139, 70, 0.3) !important;
              box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4), 0 0 30px rgba(168, 139, 70, 0.08);
            }
            .pricing-card-authority.featured {
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 50px rgba(168, 139, 70, 0.12);
            }
            .pricing-card-authority.featured:hover {
              transform: translateY(-6px);
              box-shadow: 0 28px 72px rgba(0, 0, 0, 0.5), 0 0 60px rgba(168, 139, 70, 0.15);
            }
            .pricing-cta-btn:hover {
              transform: translateY(-2px);
            }
            .pricing-card-authority:not(.featured) .pricing-cta-btn:hover {
              background: rgba(168, 139, 70, 0.08) !important;
              box-shadow: 0 8px 24px rgba(168, 139, 70, 0.15);
            }
            .pricing-card-authority.featured .pricing-cta-btn:hover {
              box-shadow: 0 8px 24px rgba(168, 139, 70, 0.4);
            }
            @media (max-width: 960px) {
              .pricing-grid-authority {
                grid-template-columns: 1fr !important;
                max-width: 420px !important;
              }
            }
          `}</style>
        </div>

        {/* ==================== GOOD FIT SECTION - Floating Layout ==================== */}
        <div 
          className="reveal"
          style={{
            paddingTop: '60px',
            paddingBottom: '120px',
            marginBottom: '250px'
          }}
        >
          {/* Centered Header */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{
              fontSize: 'clamp(36px, 4.5vw, 52px)',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '16px',
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              fontFamily: 'Manrope, Inter, sans-serif'
            }}>
              Is This Right <span style={{ 
                color: '#A78A43',
                textShadow: '0 0 60px rgba(167, 138, 67, 0.4)'
              }}>For You</span>?
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
                      background: 'rgba(167, 138, 67, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <Check size={14} color="#A78A43" />
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
            marginTop: '56px'
          }}>
            <a 
              href="https://calendly.com/patrickgerritsen90/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover cta-primary"
              style={{
                background: '#A78A43',
                color: '#0a0a0a',
                padding: '20px 44px',
                borderRadius: '14px',
                fontWeight: '700',
                fontSize: '16px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 6px 30px rgba(167, 138, 67, 0.45)'
              }}
            >
              Book Free Intro Call <ArrowRight size={18} />
            </a>
          </div>
        </div>

        {/* ==================== FAQ - Narrow Glass Accordion ==================== */}
        <div 
          className="reveal"
          style={{
            paddingTop: '60px',
            paddingBottom: '120px',
            marginBottom: '250px'
          }}
        >
          {/* Centered Header */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{
              fontSize: 'clamp(36px, 4.5vw, 52px)',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '16px',
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              fontFamily: 'Manrope, Inter, sans-serif'
            }}>
              Questions & <span style={{ 
                color: '#A78A43',
                textShadow: '0 0 60px rgba(167, 138, 67, 0.4)'
              }}>Answers</span>
            </h2>
            <p style={{
              color: '#8A8A8A',
              fontSize: '17px',
              lineHeight: 1.7,
              maxWidth: '480px',
              margin: '0 auto'
            }}>
              Everything you need to know about the mentorship
            </p>
          </div>

          {/* Narrow Accordion Container - max-w-3xl */}
          <div style={{
            maxWidth: '768px',
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
              If you aren't ready for a full program, explore these professional tools and technical deep dives. See for yourself if this logic aligns with your game before we work together.
            </p>
          </div>

          {/* Two-Card Grid */}
          <div 
            className="safety-net-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '28px',
              maxWidth: '900px',
              margin: '0 auto'
            }}>
            {/* Card A - Strategy Vault (Articles) */}
            <a 
              href="/articles"
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
          </div>

          {/* Safety Net Styles */}
          <style>{`
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
            @media (max-width: 768px) {
              .safety-net-grid {
                grid-template-columns: 1fr !important;
                max-width: 420px !important;
              }
              .safety-net-card {
                padding: 40px 32px !important;
              }
            }
          `}</style>
        </div>

        <style>{`
          .authority-vault-card:hover {
            transform: translateY(-8px);
            border-color: rgba(167, 138, 67, 0.35);
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(167, 138, 67, 0.1);
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

export default PokerToolboxHome;

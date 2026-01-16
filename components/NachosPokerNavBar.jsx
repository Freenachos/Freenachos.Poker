'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, FileText, Calculator, LineChart, Users, DollarSign, ExternalLink } from 'lucide-react';

const NachosPokerNavBar = () => {
  const pathname = usePathname();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = 150;
      const progress = Math.min(window.scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Mentorship Program', icon: GraduationCap, special: true },
    { href: '/articles', label: 'Articles', icon: FileText },
    { href: '/variance', label: 'Variance', icon: Calculator },
    { href: '/winrate', label: 'Win Rate', icon: LineChart },
    { href: '/seat', label: 'Seat Selection', icon: Users },
    { href: '/profits', label: 'Profits', icon: DollarSign },
    { href: 'https://www.nachospoker.com', label: 'CFP', icon: ExternalLink, external: true },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('http')) return false;
    return pathname.startsWith(href);
  };

  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes subtleGlow {
          0%, 100% {
            box-shadow: 0 0 8px rgba(167, 139, 250, 0.4),
                        0 0 16px rgba(236, 72, 153, 0.2);
          }
          50% {
            box-shadow: 0 0 12px rgba(167, 139, 250, 0.6),
                        0 0 24px rgba(236, 72, 153, 0.4);
          }
        }

        .nachospoker-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          max-width: 1400px;
          margin: 0 auto;
          border-radius: 12px;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          isolation: isolate;
        }
        
        .nachospoker-navbar::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 12px;
          z-index: -1;
          background: rgba(255, 255, 255, calc(0.03 * var(--scroll-progress, 0)));
          border: 1px solid rgba(255, 255, 255, calc(0.08 * var(--scroll-progress, 0)));
          backdrop-filter: blur(calc(10px * var(--scroll-progress, 0)));
          -webkit-backdrop-filter: blur(calc(10px * var(--scroll-progress, 0)));
          transition: all 0.15s ease;
        }
        
        .nachospoker-navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .nachospoker-navbar-logo {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          flex-shrink: 0;
          overflow: hidden;
        }
        .nachospoker-navbar-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .nachospoker-navbar-brand-text {
          display: flex;
          flex-direction: column;
        }
        .nachospoker-navbar-brand-name {
          color: white;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.1;
        }
        .nachospoker-navbar-brand-suffix {
          color: #FFB347;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .nachospoker-navbar-links {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .nachospoker-nav-item {
          padding: 8px 12px;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
          font-weight: 500;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          text-decoration: none;
        }
        
        .nachospoker-nav-item:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }
        .nachospoker-nav-item.active {
          color: #FFB347;
          background: rgba(255, 179, 71, 0.15);
        }
        
        /* Special animated gradient button */
        .nachospoker-nav-item.special-gradient {
          background: linear-gradient(
            90deg,
            #8b5cf6,
            #a855f7,
            #d946ef,
            #ec4899,
            #d946ef,
            #a855f7,
            #8b5cf6
          );
          background-size: 300% 100%;
          animation: gradientShift 4s ease infinite, subtleGlow 3s ease-in-out infinite;
          color: white;
          font-weight: 600;
          border: none;
        }
        .nachospoker-nav-item.special-gradient:hover {
          background: linear-gradient(
            90deg,
            #8b5cf6,
            #a855f7,
            #d946ef,
            #ec4899,
            #d946ef,
            #a855f7,
            #8b5cf6
          );
          background-size: 300% 100%;
          animation: gradientShift 2s ease infinite, subtleGlow 1.5s ease-in-out infinite;
          transform: scale(1.02);
        }
        
        /* External link styling */
        .nachospoker-nav-item.external-link {
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .nachospoker-nav-item.external-link:hover {
          border-color: rgba(255, 179, 71, 0.4);
          color: #FFB347;
        }
        
        @media (max-width: 900px) {
          .nachospoker-nav-item {
            padding: 8px 10px;
            font-size: 11px;
          }
          .nachospoker-nav-item svg {
            display: none;
          }
          .nachospoker-nav-item.special-gradient svg {
            display: block;
          }
        }
        @media (max-width: 600px) {
          .nachospoker-navbar {
            padding: 10px 16px;
          }
          .nachospoker-navbar-links {
            width: 100%;
            justify-content: center;
          }
        }
        
        .navbar-spacer {
          height: 70px;
        }
      `}</style>
      
      <nav 
        className="nachospoker-navbar"
        style={{
          '--scroll-progress': scrollProgress
        }}
      >
        {/* Logo & Brand */}
        <div className="nachospoker-navbar-brand">
          <div className="nachospoker-navbar-logo">
            <img src="/logo.png" alt="Freenachos Poker" />
          </div>
          <div className="nachospoker-navbar-brand-text">
            <span className="nachospoker-navbar-brand-name">Freenachos</span>
            <span className="nachospoker-navbar-brand-suffix">.Poker</span>
          </div>
        </div>
        
        {/* Navigation Links */}
        <div className="nachospoker-navbar-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            
            if (item.external) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nachospoker-nav-item external-link"
                >
                  <span>{item.label}</span>
                  <Icon size={12} />
                </a>
              );
            }
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nachospoker-nav-item ${item.special ? 'special-gradient' : ''} ${isActive(item.href) ? 'active' : ''}`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      
      <div className="navbar-spacer" />
    </>
  );
};

export default NachosPokerNavBar;

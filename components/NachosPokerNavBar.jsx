'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, FileText, Calculator, LineChart, Users, DollarSign, ExternalLink, Wrench, ChevronDown, Target } from 'lucide-react';

const NachosPokerNavBar = () => {
  const pathname = usePathname();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setToolsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toolItems = [
    { href: '/variance', label: 'Variance', icon: Calculator },
    { href: '/winrate', label: 'Win Rate', icon: LineChart },
    { href: '/seat', label: 'Seat Selection', icon: Users },
    { href: '/profits', label: 'Profits', icon: DollarSign },
    { href: '/bbj', label: 'Bad Beat', icon: Target },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('http')) return false;
    return pathname.startsWith(href);
  };

  const isToolActive = toolItems.some(tool => isActive(tool.href));

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
          gap: 12px;
          isolation: isolate;
        }
        
        .nachospoker-navbar::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 12px;
          z-index: -1;
          background: rgba(10, 10, 10, calc(0.85 * var(--scroll-progress, 0)));
          border: 1px solid rgba(255, 255, 255, calc(0.08 * var(--scroll-progress, 0)));
          backdrop-filter: blur(calc(10px * var(--scroll-progress, 0)));
          -webkit-backdrop-filter: blur(calc(10px * var(--scroll-progress, 0)));
          transition: all 0.15s ease;
        }
        
        .nachospoker-navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
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
          align-items: center;
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

        /* Desktop: show individual tool links */
        .desktop-tools {
          display: flex;
          gap: 4px;
        }

        /* Mobile: show dropdown */
        .tools-dropdown {
          display: none;
          position: relative;
        }
        
        .tools-dropdown-btn {
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
          background: transparent;
          border: none;
          font-family: inherit;
        }
        
        .tools-dropdown-btn:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }
        
        .tools-dropdown-btn.active {
          color: #FFB347;
          background: rgba(255, 179, 71, 0.15);
        }
        
        .tools-dropdown-btn svg.chevron {
          transition: transform 0.2s ease;
        }
        
        .tools-dropdown-btn.open svg.chevron {
          transform: rotate(180deg);
        }
        
        .tools-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: rgba(15, 15, 15, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 8px;
          min-width: 180px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.2s ease;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }
        
        .tools-dropdown.open .tools-dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        
        .tools-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.15s ease;
        }
        
        .tools-dropdown-item:hover {
          color: white;
          background: rgba(255, 255, 255, 0.08);
        }
        
        .tools-dropdown-item.active {
          color: #FFB347;
          background: rgba(255, 179, 71, 0.15);
        }
        
        .tools-dropdown-item svg {
          opacity: 0.7;
        }
        
        .tools-dropdown-item:hover svg,
        .tools-dropdown-item.active svg {
          opacity: 1;
        }
        
        /* Breakpoint: switch to dropdown */
        @media (max-width: 1000px) {
          .desktop-tools {
            display: none;
          }
          .tools-dropdown {
            display: block;
          }
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
          .tools-dropdown-btn {
            padding: 8px 10px;
            font-size: 11px;
          }
        }
        
        @media (max-width: 600px) {
          .nachospoker-navbar {
            padding: 10px 16px;
          }
          .nachospoker-navbar-brand-text {
            display: none;
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
          {/* Mentorship Program */}
          <Link
            href="/"
            className={`nachospoker-nav-item special-gradient ${isActive('/') ? 'active' : ''}`}
          >
            <GraduationCap size={14} />
            <span>Mentorship Program</span>
          </Link>
          
          {/* Articles */}
          <Link
            href="/articles"
            className={`nachospoker-nav-item ${isActive('/articles') ? 'active' : ''}`}
          >
            <FileText size={14} />
            <span>Articles</span>
          </Link>
          
          {/* Desktop: Individual tool links */}
          <div className="desktop-tools">
            {toolItems.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`nachospoker-nav-item ${isActive(tool.href) ? 'active' : ''}`}
                >
                  <Icon size={14} />
                  <span>{tool.label}</span>
                </Link>
              );
            })}
          </div>
          
          {/* Mobile: Tools Dropdown */}
          <div 
            className={`tools-dropdown ${toolsOpen ? 'open' : ''}`}
            ref={toolsRef}
          >
            <button 
              className={`tools-dropdown-btn ${isToolActive ? 'active' : ''} ${toolsOpen ? 'open' : ''}`}
              onClick={() => setToolsOpen(!toolsOpen)}
            >
              <Wrench size={14} />
              <span>Tools</span>
              <ChevronDown size={12} className="chevron" />
            </button>
            
            <div className="tools-dropdown-menu">
              {toolItems.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={`tools-dropdown-item ${isActive(tool.href) ? 'active' : ''}`}
                    onClick={() => setToolsOpen(false)}
                  >
                    <Icon size={16} />
                    <span>{tool.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* CFP External Link */}
          <a
            href="https://www.nachospoker.com"
            target="_blank"
            rel="noopener noreferrer"
            className="nachospoker-nav-item external-link"
          >
            <span>CFP</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </nav>
      
      <div className="navbar-spacer" />
    </>
  );
};

export default NachosPokerNavBar;

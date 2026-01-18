'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Minimalist gold-line icon components (#a88b46)
const IconGraduation = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" />
  </svg>
);

const IconWrench = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const IconCalculator = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="8" y2="10.01" />
    <line x1="12" y1="10" x2="12" y2="10.01" />
    <line x1="16" y1="10" x2="16" y2="10.01" />
    <line x1="8" y1="14" x2="8" y2="14.01" />
    <line x1="12" y1="14" x2="12" y2="14.01" />
    <line x1="16" y1="14" x2="16" y2="14.01" />
    <line x1="8" y1="18" x2="8" y2="18.01" />
    <line x1="12" y1="18" x2="12" y2="18.01" />
    <line x1="16" y1="18" x2="16" y2="18.01" />
  </svg>
);

const IconTarget = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const IconChevronDown = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6,9 12,15 18,9" />
  </svg>
);

const IconExternalLink = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15,3 21,3 21,9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const NachosPokerNavBar = () => {
  const pathname = usePathname();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = 100;
      const progress = Math.min(window.scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setToolsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simplified tool items - only Variance Calculator and BBJ Dashboard
  const toolItems = [
    { href: '/variance', label: 'Variance Calculator', icon: IconCalculator },
    { href: '/bbj', label: 'BBJ Dashboard', icon: IconTarget },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    if (href === '/tools') return pathname === '/tools' || toolItems.some(t => pathname.startsWith(t.href));
    if (href.startsWith('http')) return false;
    return pathname.startsWith(href);
  };

  const isToolActive = pathname === '/tools' || toolItems.some(tool => pathname.startsWith(tool.href));

  return (
    <>
      <style>{`
        /* ============================================
           GOLD DESIGN SYSTEM - Matching Homepage
           Primary Gold: #a88b46
           White: #FFFFFF
           Dark BG: #0a0a0a
           ============================================ */
        
        .np-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 0 24px;
          isolation: isolate;
        }
        
        .np-navbar-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 14px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          position: relative;
          /* Glassmorphism effect */
          background: rgba(10, 10, 10, calc(0.75 + 0.2 * var(--scroll-progress, 0)));
          backdrop-filter: blur(calc(12px + 8px * var(--scroll-progress, 0)));
          -webkit-backdrop-filter: blur(calc(12px + 8px * var(--scroll-progress, 0)));
          /* Gold bottom border - 1px solid #a88b46 */
          border-bottom: 1px solid rgba(168, 139, 70, calc(0.5 + 0.5 * var(--scroll-progress, 0)));
          transition: all 0.3s ease;
        }
        
        /* ============================================
           LOGO / BRAND - Two-tone style
           "Freenachos" in #FFFFFF
           ".Poker" in #a88b46
           ============================================ */
        .np-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          flex-shrink: 0;
        }
        
        .np-brand-logo {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
        }
        
        .np-brand-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .np-brand-text {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.02em;
          display: flex;
          align-items: baseline;
        }
        
        .np-brand-name {
          color: #FFFFFF;
        }
        
        .np-brand-suffix {
          color: #a88b46;
        }
        
        /* ============================================
           NAVIGATION LINKS
           ============================================ */
        .np-nav-links {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        /* ============================================
           PRIMARY CTA - Mentorship Program
           Solid #a88b46 gold background with dark text
           Matches 'Book Free Introcall' button style
           ============================================ */
        .np-nav-cta {
          position: relative;
          padding: 10px 20px;
          background: #a88b46;
          color: #0a0a0a;
          font-weight: 600;
          font-size: 13px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          border: 1px solid #a88b46;
          transition: all 0.3s ease;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 0 20px rgba(168, 139, 70, 0.15);
        }
        
        .np-nav-cta svg {
          color: #0a0a0a;
          opacity: 0.85;
          transition: all 0.25s ease;
        }
        
        .np-nav-cta:hover {
          background: #bfa050;
          border-color: #bfa050;
          box-shadow: 
            0 0 30px rgba(168, 139, 70, 0.4),
            0 0 60px rgba(168, 139, 70, 0.2);
          transform: translateY(-1px);
        }
        
        .np-nav-cta:hover svg {
          opacity: 1;
        }
        
        /* Spark border shimmer effect */
        .np-nav-cta::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 11px;
          padding: 1px;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.4) 0%,
            transparent 40%,
            transparent 60%,
            rgba(255, 255, 255, 0.15) 100%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        
        /* ============================================
           TOOLS DROPDOWN - Ghost style
           ============================================ */
        .np-tools-dropdown {
          position: relative;
        }
        
        .np-tools-btn {
          position: relative;
          padding: 10px 16px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          border-radius: 10px;
          transition: all 0.25s ease;
          font-weight: 500;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          text-decoration: none;
          border: 1px solid transparent;
          background: transparent;
        }
        
        .np-tools-btn svg {
          color: #a88b46;
          opacity: 0.6;
          transition: all 0.25s ease;
        }
        
        .np-tools-btn .chevron {
          margin-left: -2px;
          transition: transform 0.25s ease, opacity 0.25s ease;
        }
        
        .np-tools-btn:hover,
        .np-tools-btn.open {
          color: #FFFFFF;
          background: rgba(168, 139, 70, 0.1);
          border-color: rgba(168, 139, 70, 0.2);
        }
        
        .np-tools-btn:hover svg,
        .np-tools-btn.open svg {
          opacity: 1;
          filter: drop-shadow(0 0 4px rgba(168, 139, 70, 0.5));
        }
        
        .np-tools-btn.open .chevron {
          transform: rotate(180deg);
        }
        
        .np-tools-btn.active {
          color: #a88b46;
        }
        
        .np-tools-btn.active svg {
          opacity: 1;
          filter: drop-shadow(0 0 6px rgba(168, 139, 70, 0.6));
        }
        
        /* Dropdown menu */
        .np-tools-menu {
          position: absolute;
          top: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%) translateY(-8px);
          /* Glassmorphism */
          background: rgba(15, 12, 8, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(168, 139, 70, 0.3);
          border-radius: 14px;
          padding: 10px;
          min-width: 200px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.25s ease;
          box-shadow: 
            0 16px 48px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(168, 139, 70, 0.1) inset;
        }
        
        .np-tools-dropdown.open .np-tools-menu {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }
        
        .np-tools-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        
        .np-tools-menu-item svg {
          color: #a88b46;
          opacity: 0.6;
          transition: all 0.2s ease;
        }
        
        .np-tools-menu-item:hover {
          color: #FFFFFF;
          background: rgba(168, 139, 70, 0.12);
          border-color: rgba(168, 139, 70, 0.15);
        }
        
        .np-tools-menu-item:hover svg {
          opacity: 1;
          filter: drop-shadow(0 0 4px rgba(168, 139, 70, 0.5));
        }
        
        .np-tools-menu-item.active {
          color: #a88b46;
          background: rgba(168, 139, 70, 0.15);
          border-color: rgba(168, 139, 70, 0.25);
        }
        
        .np-tools-menu-item.active svg {
          opacity: 1;
          filter: drop-shadow(0 0 6px rgba(168, 139, 70, 0.6));
        }
        
        /* ============================================
           CFP EXTERNAL LINK
           Gold border outline style
           ============================================ */
        .np-nav-external {
          position: relative;
          padding: 10px 16px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          border-radius: 10px;
          transition: all 0.25s ease;
          font-weight: 500;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          text-decoration: none;
          border: 1px solid rgba(168, 139, 70, 0.35);
          background: transparent;
        }
        
        .np-nav-external svg {
          color: #a88b46;
          opacity: 0.7;
          transition: all 0.25s ease;
        }
        
        .np-nav-external:hover {
          color: #a88b46;
          border-color: rgba(168, 139, 70, 0.6);
          background: rgba(168, 139, 70, 0.08);
        }
        
        .np-nav-external:hover svg {
          opacity: 1;
          filter: drop-shadow(0 0 4px rgba(168, 139, 70, 0.5));
        }
        
        /* ============================================
           RESPONSIVE BREAKPOINTS
           ============================================ */
        @media (max-width: 768px) {
          .np-navbar {
            padding: 0 16px;
          }
          .np-navbar-inner {
            padding: 12px 20px;
          }
          .np-nav-cta {
            padding: 8px 14px;
            font-size: 12px;
          }
          .np-tools-btn {
            padding: 8px 12px;
            font-size: 12px;
          }
          .np-nav-external {
            padding: 8px 12px;
            font-size: 12px;
          }
        }
        
        @media (max-width: 600px) {
          .np-navbar {
            padding: 0 12px;
          }
          .np-navbar-inner {
            padding: 10px 16px;
          }
          .np-brand-text {
            font-size: 16px;
          }
          .np-brand-logo {
            width: 36px;
            height: 36px;
          }
          .np-nav-cta span,
          .np-tools-btn span:first-of-type,
          .np-nav-external span {
            display: none;
          }
          .np-nav-cta {
            padding: 10px 12px;
          }
          .np-tools-btn {
            padding: 10px 12px;
          }
          .np-nav-external {
            padding: 10px 12px;
          }
        }
        
        @media (max-width: 480px) {
          .np-brand-text {
            display: none;
          }
        }
        
        /* Navbar spacer */
        .np-navbar-spacer {
          height: 80px;
        }
      `}</style>
      
      <nav className="np-navbar" style={{ '--scroll-progress': scrollProgress }}>
        <div className="np-navbar-inner">
          {/* Logo & Brand - Two-tone: "Freenachos" white, ".Poker" gold */}
          <Link href="/" className="np-brand">
            <div className="np-brand-logo">
              <img src="/logo.png" alt="Freenachos Poker" />
            </div>
            <div className="np-brand-text">
              <span className="np-brand-name">Freenachos</span>
              <span className="np-brand-suffix">.Poker</span>
            </div>
          </Link>
          
          {/* Navigation Links */}
          <div className="np-nav-links">
            {/* Primary CTA - Mentorship Program (solid gold button) */}
            <Link href="/" className="np-nav-cta">
              <IconGraduation size={15} />
              <span>Mentorship Program</span>
            </Link>
            
            {/* Tools Dropdown */}
            <div 
              className={`np-tools-dropdown ${toolsOpen ? 'open' : ''}`}
              ref={toolsRef}
            >
              <Link
                href="/tools"
                className={`np-tools-btn ${isToolActive ? 'active' : ''} ${toolsOpen ? 'open' : ''}`}
                onMouseEnter={() => setToolsOpen(true)}
              >
                <IconWrench size={15} />
                <span>Tools</span>
                <IconChevronDown size={12} className="chevron" />
              </Link>
              
              <div 
                className="np-tools-menu"
                onMouseLeave={() => setToolsOpen(false)}
              >
                {/* Individual tool links */}
                {toolItems.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className={`np-tools-menu-item ${pathname.startsWith(tool.href) ? 'active' : ''}`}
                      onClick={() => setToolsOpen(false)}
                    >
                      <Icon size={17} />
                      <span>{tool.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* CFP External Link (gold outline button) */}
            <a
              href="https://www.nachospoker.com"
              target="_blank"
              rel="noopener noreferrer"
              className="np-nav-external"
            >
              <span>CFP</span>
              <IconExternalLink size={13} />
            </a>
          </div>
        </div>
      </nav>
      
      <div className="np-navbar-spacer" />
    </>
  );
};

export default NachosPokerNavBar;

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, TrendingUp } from 'lucide-react';
import NachosPokerNavBar from '@/components/NachosPokerNavBar';

/**
 * Poker Seat Selection EV Visualization Tool
 * 
 * Shows how reg win rates change based on:
 * - Site (PokerStars vs GGPoker)
 * - Fish VPIP range
 * - Table position relative to fish (who is always in EP)
 * 
 * Data structure is extensible - add more sites/scenarios by extending the winRateData object
 */

const PokerSeatEVTool = () => {
  // ============================================
  // DATA LAYER - Structured for extensibility
  // ============================================
  
  const winRateData = {
    pokerstars: {
      name: 'PokerStars',
      expectedWR: 3.2,
      // Fish is in EP, these are reg win rates by position
      positions: {
        MP: { '0-30': 4.4, '30-40': 4.5, '40-50': 6.7, '50+': 12.7 },
        CO: { '0-30': 1.1, '30-40': 1.2, '40-50': 3.4, '50+': 9.4 },
        BTN: { '0-30': -0.1, '30-40': 0.0, '40-50': 2.2, '50+': 5.0 },
        SB: { '0-30': 0.0, '30-40': 0.1, '40-50': 2.3, '50+': 5.1 },
        BB: { '0-30': 0.1, '30-40': 0.2, '40-50': 2.4, '50+': 8.4 }
      }
    },
    ggpoker: {
      name: 'GGPoker',
      expectedWR: -1.7,
      positions: {
        MP: { '0-30': -3.3, '30-40': -1.2, '40-50': 1.9, '50+': 7.9 },
        CO: { '0-30': -2.1, '30-40': -0.7, '40-50': 2.1, '50+': 7.2 },
        BTN: { '0-30': -1.2, '30-40': -1.7, '40-50': -0.25, '50+': 6.8 },
        SB: { '0-30': -6.0, '30-40': -2.5, '40-50': -0.26, '50+': 4.6 },
        BB: { '0-30': -1.9, '30-40': -3.0, '40-50': -0.22, '50+': 2.7 }
      }
    }
  };

  const vpipRanges = ['0-30', '30-40', '40-50', '50+'];
  const vpipLabels = {
    '0-30': '0–30 VPIP (Tight)',
    '30-40': '30–40 VPIP',
    '40-50': '40–50 VPIP',
    '50+': '50+ VPIP (Very Loose)'
  };

  // ============================================
  // STATE
  // ============================================
  
  const [selectedSite, setSelectedSite] = useState('pokerstars');
  const [selectedVpip, setSelectedVpip] = useState('40-50');
  const [nachos, setNachos] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const nachoRef = useRef(null);

  // ============================================
  // DERIVED DATA
  // ============================================
  
  const currentData = winRateData[selectedSite];
  const getWinRate = (position) => currentData.positions[position][selectedVpip];
  
  // Color coding logic for win rates
  const getWinRateColor = (wr) => {
    if (wr < -2) return { bg: 'rgba(239, 68, 68, 0.25)', border: 'rgba(239, 68, 68, 0.4)', text: '#ef4444' };
    if (wr < 0) return { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.25)', text: '#f87171' };
    if (wr < 2) return { bg: 'rgba(255, 255, 255, 0.08)', border: 'rgba(255, 255, 255, 0.15)', text: 'rgba(255,255,255,0.8)' };
    if (wr < 5) return { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.25)', text: '#4ade80' };
    return { bg: 'rgba(34, 197, 94, 0.25)', border: 'rgba(34, 197, 94, 0.4)', text: '#22c55e' };
  };

  // ============================================
  // NACHO MASCOT LOGIC (from original)
  // ============================================
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
  // COMPONENTS
  // ============================================

  const CartoonNacho = () => (
    <svg ref={nachoRef} width="90" height="90" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 4px 12px rgba(168, 139, 70, 0.4))' }}>
      <path d="M50 8 L88 85 Q90 92 82 92 L18 92 Q10 92 12 85 Z" fill="#a88b46" stroke="#8b7339" strokeWidth="2"/>
      <path d="M25 70 Q20 75 22 82 Q24 88 28 85 Q30 80 28 75 Z" fill="#c4a85c" opacity="0.9"/>
      <path d="M72 65 Q78 72 76 80 Q74 86 70 82 Q68 76 70 70 Z" fill="#c4a85c" opacity="0.9"/>
      <path d="M48 75 Q45 82 48 88 Q52 92 55 86 Q56 80 52 76 Z" fill="#c4a85c" opacity="0.9"/>
      <ellipse cx="50" cy="50" rx="22" ry="18" fill="#a88b46" />
      <ellipse cx="40" cy="48" rx="8" ry="9" fill="white" />
      <ellipse cx="60" cy="48" rx="8" ry="9" fill="white" />
      <circle cx={40 + eyeOffset.x} cy={48 + eyeOffset.y} r="4" fill="#1a1a1a" style={{ transition: 'cx 0.1s ease-out, cy 0.1s ease-out' }}/>
      <circle cx={60 + eyeOffset.x} cy={48 + eyeOffset.y} r="4" fill="#1a1a1a" style={{ transition: 'cx 0.1s ease-out, cy 0.1s ease-out' }}/>
      <circle cx={38 + eyeOffset.x * 0.5} cy={46 + eyeOffset.y * 0.5} r="1.5" fill="white" opacity="0.8" />
      <circle cx={58 + eyeOffset.x * 0.5} cy={46 + eyeOffset.y * 0.5} r="1.5" fill="white" opacity="0.8" />
      <path d="M38 62 Q50 72 62 62" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
      <path d="M33 38 Q40 35 47 38" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      <path d="M53 38 Q60 35 67 38" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="30" r="2" fill="#8b7339" opacity="0.5" />
      <circle cx="70" cy="35" r="2.5" fill="#8b7339" opacity="0.5" />
      <circle cx="35" cy="80" r="2" fill="#8b7339" opacity="0.5" />
      <circle cx="65" cy="78" r="1.5" fill="#8b7339" opacity="0.5" />
    </svg>
  );

  const NachoTriangle = ({ size, opacity }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ opacity }}>
      <path d="M10 2 L18 17 L2 17 Z" fill="#a88b46" opacity="0.8"/>
    </svg>
  );

  // ============================================
  // TABLE GEOMETRY CONSTANTS
  // Strict elliptical coordinate system
  // ============================================
  
  const TABLE_CONFIG = {
    // Container dimensions (25% larger)
    containerWidth: 775,
    containerHeight: 563,
    // Table felt ellipse dimensions (25% larger)
    feltWidth: 550,
    feltHeight: 338,
    // Border thickness of table
    feltBorder: 10,
    // How much seat cards should overlap the table edge (negative = into table)
    overlapOffset: -18,
  };

  // Calculate seat position on ellipse perimeter
  // Returns {x, y} coordinates relative to container center
  const getEllipsePoint = (angleDegrees) => {
    const angleRad = (angleDegrees * Math.PI) / 180;
    // Radius to the EDGE of the felt (including border)
    const radiusX = (TABLE_CONFIG.feltWidth / 2) + TABLE_CONFIG.feltBorder + TABLE_CONFIG.overlapOffset;
    const radiusY = (TABLE_CONFIG.feltHeight / 2) + TABLE_CONFIG.feltBorder + TABLE_CONFIG.overlapOffset;
    
    return {
      x: radiusX * Math.cos(angleRad),
      y: radiusY * Math.sin(angleRad)
    };
  };

  // 6-max seat angles (in degrees, 0° = right, counterclockwise positive)
  // Evenly distributed at ~60° intervals
  const SEAT_ANGLES = {
    EP: 150,    // Upper-left (fish position)
    MP: 90,     // Top center
    CO: 30,     // Upper-right
    BTN: -30,   // Lower-right
    SB: -90,    // Bottom center
    BB: -150,   // Lower-left (same as 210°)
  };

  // Subtle icon components for player types (larger)
  const RegIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );

  const FishIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
      <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6-3.56 0-7.56-2.53-8.5-6Z"/>
      <path d="M18 12v.5"/>
      <path d="M16 17.93a9.77 9.77 0 0 1-2.5 4.57"/>
      <path d="M7 10.67A9.77 9.77 0 0 1 4.5 6.1"/>
      <path d="M4.5 12a7.5 7.5 0 0 0-2.5-2v4a7.5 7.5 0 0 0 2.5-2Z"/>
    </svg>
  );

  // Seat component for the poker table
  const Seat = ({ position, winRate, seatAngle, isRec = false }) => {
    const colors = isRec ? 
      { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 0.4)', text: '#60a5fa' } : 
      getWinRateColor(winRate);
    
    // Calculate position on ellipse perimeter
    const { x, y } = getEllipsePoint(seatAngle);
    
    // Convert to absolute positioning (from container center)
    const centerX = TABLE_CONFIG.containerWidth / 2;
    const centerY = TABLE_CONFIG.containerHeight / 2;
    
    return (
      <div style={{
        position: 'absolute',
        // Position center of card on the ellipse perimeter
        left: `${centerX + x}px`,
        top: `${centerY + y}px`,
        // Center the card on its calculated point
        transform: 'translate(-50%, -50%)',
        // Visual styling - CONSISTENT SIZE for all cards
        background: colors.bg,
        border: `2px solid ${colors.border}`,
        borderRadius: '10px',
        padding: '12px 16px',
        width: '90px',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        // Ensure seats layer above the table
        zIndex: 10,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Position label with player type icon */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
          marginBottom: '8px',
          color: isRec ? colors.text : 'rgba(255,255,255,0.5)'
        }}>
          {isRec ? <FishIcon /> : <RegIcon />}
          <span style={{
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {position}
          </span>
        </div>
        
        {/* Win rate value */}
        <div style={{
          fontSize: '20px',
          fontWeight: '700',
          color: colors.text,
          lineHeight: 1
        }}>
          {isRec ? '—' : `${winRate >= 0 ? '+' : ''}${winRate.toFixed(1)}`}
        </div>
        
        {/* Unit label */}
        <div style={{ 
          fontSize: '10px', 
          color: 'rgba(255,255,255,0.35)', 
          marginTop: '4px' 
        }}>
          {isRec ? 'rec player' : 'bb/100'}
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div style={{minHeight: '100vh', background: '#0A0E1A', position: 'relative', overflow: 'hidden', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'}}>
      {/* Noise/Grain Texture Overlay */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Background Glows */}
      <div style={{position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden'}}>
        <div style={{ 
          position: 'absolute', top: '-10%', right: '-8%', width: '900px', height: '900px', borderRadius: '50%', opacity: 0.6,
          background: 'radial-gradient(circle, rgba(168, 139, 70, 0.08) 0%, transparent 60%)', filter: 'blur(80px)' 
        }} />
        <div style={{ 
          position: 'absolute', bottom: '-15%', left: '-12%', width: '1000px', height: '1000px', borderRadius: '50%', opacity: 0.5,
          background: 'radial-gradient(circle, rgba(168, 139, 70, 0.06) 0%, transparent 55%)', filter: 'blur(100px)' 
        }} />
        <div style={{ 
          position: 'absolute', top: '40%', right: '5%', width: '600px', height: '600px', borderRadius: '50%', opacity: 0.4,
          background: 'radial-gradient(circle, rgba(168, 139, 70, 0.05) 0%, transparent 50%)', filter: 'blur(60px)' 
        }} />
      </div>

      {/* Peripheral Bokeh Nachos */}
      <div style={{position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden'}}>
        <div style={{ position: 'absolute', top: '5%', left: '-8%', width: '180px', height: '180px', opacity: 0.06, filter: 'blur(18px)', animation: 'peripheralWobble1 120s ease-in-out infinite' }}>
          <NachoTriangle size={180} opacity={1} />
        </div>
        <div style={{ position: 'absolute', top: '40%', left: '-12%', width: '220px', height: '220px', opacity: 0.05, filter: 'blur(22px)', animation: 'peripheralWobble2 140s ease-in-out infinite', animationDelay: '40s' }}>
          <NachoTriangle size={220} opacity={1} />
        </div>
        <div style={{ position: 'absolute', bottom: '10%', left: '-6%', width: '160px', height: '160px', opacity: 0.07, filter: 'blur(16px)', animation: 'peripheralWobble1 100s ease-in-out infinite', animationDelay: '70s' }}>
          <NachoTriangle size={160} opacity={1} />
        </div>
        <div style={{ position: 'absolute', top: '8%', right: '-10%', width: '200px', height: '200px', opacity: 0.05, filter: 'blur(20px)', animation: 'peripheralWobble2 130s ease-in-out infinite', animationDelay: '20s' }}>
          <NachoTriangle size={200} opacity={1} />
        </div>
        <div style={{ position: 'absolute', top: '50%', right: '-14%', width: '240px', height: '240px', opacity: 0.04, filter: 'blur(24px)', animation: 'peripheralWobble1 150s ease-in-out infinite', animationDelay: '60s' }}>
          <NachoTriangle size={240} opacity={1} />
        </div>
        <div style={{ position: 'absolute', bottom: '15%', right: '-8%', width: '170px', height: '170px', opacity: 0.06, filter: 'blur(17px)', animation: 'peripheralWobble2 110s ease-in-out infinite', animationDelay: '90s' }}>
          <NachoTriangle size={170} opacity={1} />
        </div>
      </div>

      {/* Foreground Bokeh Nachos */}
      <div style={{position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden'}}>
        <div style={{ position: 'absolute', top: '5%', left: '3%', width: '90px', height: '90px', opacity: 0.12, filter: 'blur(12px)', animation: 'foregroundDrift1 80s ease-in-out infinite' }}>
          <NachoTriangle size={90} opacity={1} />
        </div>
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '110px', height: '110px', opacity: 0.10, filter: 'blur(14px)', animation: 'foregroundDrift2 90s ease-in-out infinite', animationDelay: '30s' }}>
          <NachoTriangle size={110} opacity={1} />
        </div>
        <div style={{ position: 'absolute', top: '45%', left: '-2%', width: '80px', height: '80px', opacity: 0.08, filter: 'blur(10px)', animation: 'foregroundDrift3 70s ease-in-out infinite', animationDelay: '45s' }}>
          <NachoTriangle size={80} opacity={1} />
        </div>
        <div style={{ position: 'absolute', top: '15%', right: '8%', width: '70px', height: '70px', opacity: 0.09, filter: 'blur(11px)', animation: 'foregroundDrift1 85s ease-in-out infinite', animationDelay: '60s' }}>
          <NachoTriangle size={70} opacity={1} />
        </div>
      </div>

      {/* Midground Bokeh Nachos */}
      <div style={{position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2, overflow: 'hidden'}}>
        <div style={{ position: 'absolute', top: '20%', left: '15%', width: '40px', height: '40px', opacity: 0.18, filter: 'blur(4px)', animation: 'midgroundDrift1 45s ease-in-out infinite' }}>
          <NachoTriangle size={40} opacity={1} />
        </div>
        <div style={{ position: 'absolute', top: '60%', right: '20%', width: '35px', height: '35px', opacity: 0.16, filter: 'blur(5px)', animation: 'midgroundDrift2 50s ease-in-out infinite', animationDelay: '15s' }}>
          <NachoTriangle size={35} opacity={1} />
        </div>
        <div style={{ position: 'absolute', bottom: '30%', left: '8%', width: '45px', height: '45px', opacity: 0.15, filter: 'blur(4px)', animation: 'midgroundDrift3 55s ease-in-out infinite', animationDelay: '25s' }}>
          <NachoTriangle size={45} opacity={1} />
        </div>
        <div style={{ position: 'absolute', top: '35%', right: '12%', width: '38px', height: '38px', opacity: 0.14, filter: 'blur(3px)', animation: 'midgroundDrift1 48s ease-in-out infinite', animationDelay: '35s' }}>
          <NachoTriangle size={38} opacity={1} />
        </div>
        <div style={{ position: 'absolute', top: '75%', left: '25%', width: '32px', height: '32px', opacity: 0.17, filter: 'blur(4px)', animation: 'midgroundDrift2 42s ease-in-out infinite', animationDelay: '40s' }}>
          <NachoTriangle size={32} opacity={1} />
        </div>
        <div style={{ position: 'absolute', top: '10%', left: '55%', width: '42px', height: '42px', opacity: 0.13, filter: 'blur(4px)', animation: 'midgroundDrift3 52s ease-in-out infinite', animationDelay: '50s' }}>
          <NachoTriangle size={42} opacity={1} />
        </div>
      </div>

      {/* Background (Focal) Bokeh Nachos */}
      <div style={{position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 3, overflow: 'hidden'}}>
        <div style={{ position: 'absolute', top: '25%', left: '20%', width: '18px', height: '18px', opacity: 0.35, filter: 'blur(0.5px)', animation: 'backgroundDart1 25s linear infinite' }}>
          <NachoTriangle size={18} opacity={1} />
        </div>
        <div style={{ position: 'absolute', top: '55%', right: '25%', width: '15px', height: '15px', opacity: 0.30, filter: 'blur(0.5px)', animation: 'backgroundDart2 28s linear infinite', animationDelay: '8s' }}>
          <NachoTriangle size={15} opacity={1} />
        </div>
        <div style={{ position: 'absolute', bottom: '35%', left: '35%', width: '20px', height: '20px', opacity: 0.28, filter: 'blur(0.5px)', animation: 'backgroundDart1 22s linear infinite', animationDelay: '12s' }}>
          <NachoTriangle size={20} opacity={1} />
        </div>
        <div style={{ position: 'absolute', top: '40%', right: '35%', width: '16px', height: '16px', opacity: 0.32, filter: 'blur(0.5px)', animation: 'backgroundDart2 30s linear infinite', animationDelay: '18s' }}>
          <NachoTriangle size={16} opacity={1} />
        </div>
        <div style={{ position: 'absolute', top: '15%', left: '45%', width: '14px', height: '14px', opacity: 0.25, filter: 'blur(0.5px)', animation: 'backgroundDart1 26s linear infinite', animationDelay: '5s' }}>
          <NachoTriangle size={14} opacity={1} />
        </div>
        <div style={{ position: 'absolute', bottom: '20%', right: '40%', width: '17px', height: '17px', opacity: 0.27, filter: 'blur(0.5px)', animation: 'backgroundDart2 24s linear infinite', animationDelay: '15s' }}>
          <NachoTriangle size={17} opacity={1} />
        </div>
      </div>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
        
        @keyframes peripheralWobble1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(3px, -5px) rotate(2deg); }
          50% { transform: translate(6px, -3px) rotate(4deg); }
          75% { transform: translate(2px, -8px) rotate(1deg); }
        }
        @keyframes peripheralWobble2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-4px, -6px) rotate(-2deg); }
          50% { transform: translate(-2px, -10px) rotate(-1deg); }
          75% { transform: translate(-6px, -4px) rotate(-3deg); }
        }
        @keyframes foregroundDrift1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(8px, -12px) rotate(8deg); }
          50% { transform: translate(15px, -8px) rotate(15deg); }
          75% { transform: translate(5px, -18px) rotate(12deg); }
        }
        @keyframes foregroundDrift2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-10px, -15px) rotate(-12deg); }
          50% { transform: translate(-5px, -25px) rotate(-20deg); }
          75% { transform: translate(-12px, -10px) rotate(-8deg); }
        }
        @keyframes foregroundDrift3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(12px, -20px) rotate(18deg); }
          66% { transform: translate(6px, -10px) rotate(10deg); }
        }
        @keyframes midgroundDrift1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(20px, -30px) rotate(25deg); }
          40% { transform: translate(35px, -20px) rotate(50deg); }
          60% { transform: translate(25px, -40px) rotate(75deg); }
          80% { transform: translate(10px, -15px) rotate(55deg); }
        }
        @keyframes midgroundDrift2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-25px, -35px) rotate(-40deg); }
          40% { transform: translate(-15px, -50px) rotate(-80deg); }
          60% { transform: translate(-30px, -25px) rotate(-50deg); }
          80% { transform: translate(-15px, -60px) rotate(-25deg); }
        }
        @keyframes midgroundDrift3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -25px) rotate(60deg); }
          66% { transform: translate(15px, -45px) rotate(120deg); }
        }
        @keyframes backgroundDart1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          12.5% { transform: translate(25px, -40px) rotate(45deg); }
          25% { transform: translate(50px, -25px) rotate(90deg); }
          37.5% { transform: translate(35px, -60px) rotate(150deg); }
          50% { transform: translate(60px, -35px) rotate(200deg); }
          62.5% { transform: translate(40px, -55px) rotate(270deg); }
          75% { transform: translate(20px, -30px) rotate(320deg); }
          87.5% { transform: translate(25px, -40px) rotate(360deg); }
        }
        @keyframes backgroundDart2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          14.3% { transform: translate(-35px, -50px) rotate(-60deg); }
          28.6% { transform: translate(-20px, -30px) rotate(-120deg); }
          42.9% { transform: translate(-50px, -45px) rotate(-180deg); }
          57.1% { transform: translate(-30px, -60px) rotate(-250deg); }
          71.4% { transform: translate(-15px, -25px) rotate(-310deg); }
          85.7% { transform: translate(-35px, -50px) rotate(-360deg); }
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
        
        .glass-card {
          background: rgba(18, 18, 18, 0.65);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
        }
        .input-focus {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .input-focus:focus {
          border-color: #a88b46 !important;
          box-shadow: 0 0 0 3px rgba(168, 139, 70, 0.15);
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
        
        .spark-border-gold {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          background: rgba(18, 18, 18, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        
        .spark-border-gold::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, rgba(168, 139, 70, 0.5), rgba(168, 139, 70, 0.15));
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          z-index: 1;
          pointer-events: none;
        }
        
        .spark-border-gold::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 80px;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #a88b46 50%, #a88b46 100%);
          box-shadow: 0 0 15px 2px rgba(168, 139, 70, 0.6);
          offset-path: rect(0 100% 100% 0 round 24px);
          animation: traceBorder 6s linear infinite;
          offset-rotate: auto;
          offset-anchor: center;
          z-index: 2;
          pointer-events: none;
        }

        .filter-btn {
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.12);
          text-align: center;
          white-space: nowrap;
        }
        .filter-btn.active {
          background: linear-gradient(135deg, #a88b46 0%, #8b7339 100%);
          color: #0a0a0a;
          border-color: #a88b46;
          box-shadow: 0 2px 8px rgba(168, 139, 70, 0.3);
        }
        .filter-btn:not(.active) {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.55);
        }
        .filter-btn:not(.active):hover {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.8);
          border-color: rgba(168, 139, 70, 0.3);
        }

        /* Responsive Dashboard Grid */
        .dashboard-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 220px;
          grid-template-rows: auto 1fr;
          gap: 20px;
          grid-template-areas:
            "filters sidebar"
            "table sidebar";
        }
        
        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
            grid-template-areas:
              "filters"
              "table"
              "sidebar";
          }
        }
        
        @media (max-width: 768px) {
          .filter-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div style={{position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '20px'}}>
        {/* Navigation Bar */}
        <NachosPokerNavBar />
        
        {/* Header Banner with Sparkborder */}
        <div 
          className="spark-border-gold"
          style={{
            marginBottom: '30px',
            padding: '28px 32px',
            animation: 'fadeInUp 0.6s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }}
        >
          <div style={{ flex: 1 }}>
            <h2 style={{fontSize: '22px', fontWeight: '700', color: '#ffffff', marginBottom: '8px', lineHeight: 1.2, fontFamily: 'Manrope, Inter, sans-serif'}}>
              Seat Selection <span style={{color: '#a88b46'}}>EV Tool</span>
            </h2>
            <p style={{fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '0', lineHeight: 1.5, maxWidth: '400px'}}>
              See where the bb/100 hides based on fish VPIP and position. Ready for structured guidance? Explore the Mentorship Program.
            </p>
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0}}>
            <a 
              href="https://www.nachospoker.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-hover"
              style={{
                background: '#a88b46',
                color: '#0a0a0a',
                padding: '12px 20px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '13px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Join Our CFP <ExternalLink size={14} />
            </a>
            <a 
              href="https://calendly.com/patrickgerritsen90/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover"
              style={{
                background: 'transparent',
                border: '1.5px solid #a88b46',
                color: '#a88b46',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '13px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Private Coaching <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Main Tool Card */}
        <div 
          className="card-hover glass-card"
          style={{
            borderRadius: '16px', 
            padding: '40px', 
            marginBottom: '45px',
            animation: 'fadeInUp 0.6s ease-out 0.1s both'
          }}
        >
          <h1 style={{
            textAlign: 'center', 
            fontSize: '2.2em', 
            marginBottom: '8px', 
            color: '#ffffff',
            fontWeight: '700'
          }}>
            Seat Selection EV Tool
          </h1>
          <p style={{textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '30px'}}>
            How fish VPIP and position affect your win rate at 6-max
          </p>

          {/* Dashboard Grid Layout - Responsive */}
          <div className="dashboard-grid">
            
            {/* Top Row: Filters (Site, VPIP, Avg WR) */}
            <div className="filter-row" style={{
              gridArea: 'filters',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              alignItems: 'stretch'
            }}>
              {/* Site Filter */}
              <div className="glass-card" style={{
                padding: '20px 24px',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                animation: 'fadeIn 0.4s ease-out 0.2s both'
              }}>
                <h3 style={{
                  color: '#a88b46', 
                  marginBottom: '16px', 
                  fontSize: '11px', 
                  fontWeight: '600', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em'
                }}>
                  Site
                </h3>
                <div style={{
                  display: 'flex', 
                  gap: '10px',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <button 
                    className={`filter-btn ${selectedSite === 'pokerstars' ? 'active' : ''}`}
                    onClick={() => setSelectedSite('pokerstars')}
                    style={{flex: 1, maxWidth: '120px'}}
                  >
                    PokerStars
                  </button>
                  <button 
                    className={`filter-btn ${selectedSite === 'ggpoker' ? 'active' : ''}`}
                    onClick={() => setSelectedSite('ggpoker')}
                    style={{flex: 1, maxWidth: '120px'}}
                  >
                    GGPoker
                  </button>
                </div>
              </div>

              {/* VPIP Filter */}
              <div className="glass-card" style={{
                padding: '20px 24px',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                animation: 'fadeIn 0.4s ease-out 0.3s both'
              }}>
                <h3 style={{
                  color: '#a88b46', 
                  marginBottom: '16px', 
                  fontSize: '11px', 
                  fontWeight: '600', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em'
                }}>
                  Fish VPIP Range
                </h3>
                <div style={{
                  display: 'flex', 
                  gap: '8px',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {vpipRanges.map(range => (
                    <button 
                      key={range}
                      className={`filter-btn ${selectedVpip === range ? 'active' : ''}`}
                      onClick={() => setSelectedVpip(range)}
                      style={{flex: 1, minWidth: 0, padding: '10px 12px'}}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Average WR Card */}
              <div className="glass-card" style={{
                padding: '20px 24px',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                animation: 'fadeIn 0.4s ease-out 0.4s both'
              }}>
                <h3 style={{
                  color: '#a88b46', 
                  marginBottom: '12px', 
                  fontSize: '11px', 
                  fontWeight: '600', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em'
                }}>
                  Average Win Rate
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '8px'
                }}>
                  <span style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: currentData.expectedWR >= 0 ? '#22c55e' : '#ef4444',
                    lineHeight: 1
                  }}>
                    {currentData.expectedWR >= 0 ? '+' : ''}{currentData.expectedWR.toFixed(1)}
                  </span>
                  <span style={{fontSize: '13px', color: 'rgba(255,255,255,0.4)'}}>
                    bb/100
                  </span>
                </div>
                <div style={{fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '6px'}}>
                  {currentData.name} sample avg
                </div>
              </div>
            </div>

            {/* Poker Table Area */}
            <div style={{
              gridArea: 'table',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              animation: 'fadeIn 0.5s ease-out 0.4s both'
            }}>
              <div style={{
                position: 'relative',
                width: `${TABLE_CONFIG.containerWidth}px`,
                height: `${TABLE_CONFIG.containerHeight}px`
              }}>
                {/* Table felt */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: `${TABLE_CONFIG.feltWidth}px`,
                  height: `${TABLE_CONFIG.feltHeight}px`,
                  background: 'linear-gradient(145deg, #1a472a 0%, #0d2818 100%)',
                  borderRadius: '50%',
                  border: `${TABLE_CONFIG.feltBorder}px solid #2d1810`,
                  boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5), 0 10px 40px rgba(0,0,0,0.4)',
                  zIndex: 1
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '11px', 
                      color: 'rgba(255,255,255,0.3)', 
                      marginBottom: '4px', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.1em'
                    }}>
                      6-Max
                    </div>
                    <div style={{
                      fontSize: '13px', 
                      color: 'rgba(255,255,255,0.5)', 
                      fontWeight: '500'
                    }}>
                      {currentData.name}
                    </div>
                  </div>
                </div>

                {/* Seats */}
                <Seat position="EP" winRate={0} seatAngle={SEAT_ANGLES.EP} isRec={true} />
                <Seat position="MP" winRate={getWinRate('MP')} seatAngle={SEAT_ANGLES.MP} />
                <Seat position="CO" winRate={getWinRate('CO')} seatAngle={SEAT_ANGLES.CO} />
                <Seat position="BTN" winRate={getWinRate('BTN')} seatAngle={SEAT_ANGLES.BTN} />
                <Seat position="SB" winRate={getWinRate('SB')} seatAngle={SEAT_ANGLES.SB} />
                <Seat position="BB" winRate={getWinRate('BB')} seatAngle={SEAT_ANGLES.BB} />
              </div>
            </div>

            {/* Right Sidebar: Position Rankings + Strategy Insights */}
            <div style={{
              gridArea: 'sidebar',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              animation: 'fadeIn 0.5s ease-out 0.5s both'
            }}>
              {/* Position Rankings */}
              <div className="glass-card" style={{
                padding: '20px',
                borderRadius: '12px'
              }}>
                <h3 style={{
                  color: '#a88b46', 
                  marginBottom: '16px', 
                  fontSize: '11px', 
                  fontWeight: '600', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em'
                }}>
                  Position Rankings
                </h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  {Object.entries(currentData.positions)
                    .map(([pos, rates]) => ({ pos, wr: rates[selectedVpip] }))
                    .sort((a, b) => b.wr - a.wr)
                    .map(({ pos, wr }, idx) => {
                      const colors = getWinRateColor(wr);
                      return (
                        <div 
                          key={pos}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px 12px',
                            background: colors.bg,
                            borderRadius: '8px',
                            border: `1px solid ${colors.border}`,
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <span style={{
                              fontSize: '10px',
                              color: 'rgba(255,255,255,0.35)',
                              fontWeight: '500',
                              width: '18px'
                            }}>
                              #{idx + 1}
                            </span>
                            <span style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: 'rgba(255,255,255,0.9)'
                            }}>
                              {pos}
                            </span>
                          </div>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            color: colors.text
                          }}>
                            {wr >= 0 ? '+' : ''}{wr.toFixed(1)}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Strategy Insight Panel */}
              <div className="glass-card" style={{
                padding: '20px',
                borderRadius: '12px',
                borderLeft: '3px solid #a88b46',
                flex: '1 1 auto',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Quick Tip Section */}
                <div style={{marginBottom: '18px'}}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '10px'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a88b46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
                      <path d="M9 18h6"/>
                      <path d="M10 22h4"/>
                    </svg>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#a88b46',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em'
                    }}>
                      Quick Tip
                    </span>
                  </div>
                  <p style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: 1.6,
                    margin: 0
                  }}>
                    {selectedVpip === '50+' && 'On a table with a 50+ VPIP recreational, every seat is winning. Positional advantage still gives you an edge, but you can\'t always be picky.'}
                    {selectedVpip === '40-50' && 'Loose fish overplay too many hands preflop. Focus on isolating them in position and extracting thin value on later streets.'}
                    {selectedVpip === '30-40' && 'Moderate fish play a bit tighter preflop, but you should still look to isolate them widely to punish their lack of 4bets.'}
                    {selectedVpip === '0-30' && 'Tight fish offer minimal edge. When the recreational is playing few hands, prioritize table selection over seat selection.'}
                  </p>
                </div>

                {/* Divider */}
                <div style={{
                  height: '1px',
                  background: 'rgba(255,255,255,0.08)',
                  margin: '4px 0 16px 0'
                }}/>

                {/* Seat Legend */}
                <div>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '12px'
                  }}>
                    Seat Legend
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '3px',
                        background: 'rgba(34, 197, 94, 0.2)',
                        border: '1px solid rgba(34, 197, 94, 0.4)'
                      }}/>
                      <span style={{fontSize: '11px', color: 'rgba(255,255,255,0.6)'}}>
                        High EV (+3.0+)
                      </span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '3px',
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.25)'
                      }}/>
                      <span style={{fontSize: '11px', color: 'rgba(255,255,255,0.6)'}}>
                        Positive EV (+0.1 to +3.0)
                      </span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '3px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}/>
                      <span style={{fontSize: '11px', color: 'rgba(255,255,255,0.6)'}}>
                        Neutral / Low EV
                      </span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '3px',
                        background: 'rgba(59, 130, 246, 0.15)',
                        border: '1px solid rgba(59, 130, 246, 0.3)'
                      }}/>
                      <span style={{fontSize: '11px', color: 'rgba(255,255,255,0.6)'}}>
                        Recreational Player
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div 
          className="glass-card"
          style={{
            borderRadius: '16px', 
            padding: '40px',
            animation: 'fadeInUp 0.6s ease-out 0.3s both'
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '28px'}}>
            <TrendingUp size={24} color="#a88b46" />
            <h2 style={{fontSize: '20px', fontWeight: '600', color: '#ffffff', margin: 0}}>
              Key Insights
            </h2>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px'}}>
            {/* Insight 1 */}
            <div style={{
              background: 'rgba(168, 139, 70, 0.08)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(168, 139, 70, 0.2)'
            }}>
              <h3 style={{color: '#a88b46', fontSize: '14px', fontWeight: '600', marginBottom: '12px'}}>
                Position Matters Most
              </h3>
              <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: 1.7, margin: 0}}>
                MP (direct position on fish) consistently yields the highest win rates. Being able to isolate and play in position against weak players is the biggest edge.
              </p>
            </div>

            {/* Insight 2 */}
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}>
              <h3 style={{color: '#22c55e', fontSize: '14px', fontWeight: '600', marginBottom: '12px'}}>
                VPIP is Everything
              </h3>
              <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: 1.7, margin: 0}}>
                A 50+ VPIP fish transforms a break-even table into a gold mine. The difference between 0-30 and 50+ VPIP fish can be 8-10 bb/100 in your win rate.
              </p>
            </div>

            {/* Insight 3 */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <h3 style={{color: '#ef4444', fontSize: '14px', fontWeight: '600', marginBottom: '12px'}}>
                Site Selection Impact
              </h3>
              <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: 1.7, margin: 0}}>
                GGPoker's higher rake creates tougher conditions overall. Even with the same fish, your baseline expected WR is ~5 bb/100 lower than PokerStars.
              </p>
            </div>
          </div>

          <div style={{
            marginTop: '24px',
            padding: '18px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'center'
          }}>
            <p style={{color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0, lineHeight: 1.7}}>
              <strong style={{color: '#a88b46'}}>Pro Tip:</strong> Don't just find fish. Find <em>loose</em> fish and get direct position on them. 
              A tight fish in EP is worth almost nothing. A 50+ VPIP whale makes every seat at the table profitable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokerSeatEVTool;

'use client';

import NachosPokerNavBar from '@/components/NachosPokerNavBar';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, 
  Calculator, 
  TrendingUp, 
  Plus, 
  Trash2, 
  DollarSign, 
  Clock, 
  Layers,
  Sparkles,
  AlertCircle,
  Globe,
  Lightbulb
} from 'lucide-react';

/**
 * Poker Profit Calculator Tool
 * 
 * Part of the FreeNachos App Suite
 * Calculates projected profits based on:
 * - Volume (hands or hours)
 * - Win rate (bb/100)
 * - Rakeback percentage
 * - Site/Stake combinations
 */

const PokerProfitCalculator = () => {
  // ============================================
  // DATA LAYER - Site rake data structure
  // ============================================
  
  const SITE_DATA = {
    pokerstars: {
      name: 'PokerStars',
      stakes: {
        '10nl': { rake: 10.5, bb: 0.10 },
        '25nl': { rake: 9.5, bb: 0.25 },
        '50nl': { rake: 9.0, bb: 0.50 },
        '100nl': { rake: 8.5, bb: 1.00 },
        '200nl': { rake: 7.5, bb: 2.00 },
        '500nl': { rake: 6.0, bb: 5.00 },
      }
    },
    ggpoker: {
      name: 'GGPoker',
      stakes: {
        '10nl': { rake: 12.0, bb: 0.10 },
        '25nl': { rake: 11.0, bb: 0.25 },
        '50nl': { rake: 10.5, bb: 0.50 },
        '100nl': { rake: 9.5, bb: 1.00 },
        '200nl': { rake: 8.5, bb: 2.00 },
        '500nl': { rake: 7.0, bb: 5.00 },
      }
    },
    partypoker: {
      name: 'PartyPoker',
      stakes: {
        '10nl': { rake: 11.0, bb: 0.10 },
        '25nl': { rake: 10.0, bb: 0.25 },
        '50nl': { rake: 9.5, bb: 0.50 },
        '100nl': { rake: 8.0, bb: 1.00 },
        '200nl': { rake: 7.0, bb: 2.00 },
        '500nl': { rake: 5.5, bb: 5.00 },
      }
    },
    acr: {
      name: 'ACR',
      stakes: {
        '10nl': { rake: 11.5, bb: 0.10 },
        '25nl': { rake: 10.5, bb: 0.25 },
        '50nl': { rake: 10.0, bb: 0.50 },
        '100nl': { rake: 9.0, bb: 1.00 },
        '200nl': { rake: 8.0, bb: 2.00 },
        '500nl': { rake: 6.5, bb: 5.00 },
      }
    },
    live: {
      name: 'Live Poker',
      stakes: {
        '1/2': { rake: 12.0, bb: 2.00 },
        '1/3': { rake: 10.0, bb: 3.00 },
        '2/5': { rake: 8.0, bb: 5.00 },
        '5/10': { rake: 6.0, bb: 10.00 },
        '10/20': { rake: 4.0, bb: 20.00 },
        '25/50': { rake: 3.0, bb: 50.00 },
      }
    }
  };

  const DEFAULT_HANDS_PER_HOUR = 30;

  // ============================================
  // STATE
  // ============================================
  
  const [mode, setMode] = useState('online'); // 'online' or 'live'
  const [volume, setVolume] = useState('');
  const [winRate, setWinRate] = useState('');
  const [rakeback, setRakeback] = useState('');
  const [handsPerHour, setHandsPerHour] = useState(DEFAULT_HANDS_PER_HOUR);
  const [selectedSite, setSelectedSite] = useState('pokerstars');
  const [selectedStake, setSelectedStake] = useState('50nl');
  const [scenarios, setScenarios] = useState([]);
  const [nachos, setNachos] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const nachoRef = useRef(null);

  // ============================================
  // CALCULATION LOGIC
  // ============================================
  
  const calculateProfit = (scenario) => {
    const { site, stake, volume, winRate, rakeback, mode, handsPerHour } = scenario;
    const siteData = SITE_DATA[site];
    const stakeData = siteData.stakes[stake];
    
    // Get base values
    const baseRake = stakeData.rake; // bb/100
    const bbValue = stakeData.bb; // $ value of big blind
    
    // Step 1: Calculate Rakeback Profit (bb/100)
    const rakebackBb100 = baseRake * (rakeback / 100);
    
    // Step 2: Calculate Total Win Rate (bb/100)
    const totalBb100 = parseFloat(winRate) + rakebackBb100;
    
    // Step 3: Calculate hands per month
    let handsPerMonth;
    if (mode === 'online') {
      handsPerMonth = parseFloat(volume);
    } else {
      // Live mode: convert hours to hands
      handsPerMonth = parseFloat(volume) * handsPerHour;
    }
    
    // Step 4: Calculate profit in bb per month
    const bbPerMonth = (totalBb100 / 100) * handsPerMonth;
    
    // Step 5: Convert to dollars
    const monthlyProfit = bbPerMonth * bbValue;
    
    // Step 6: Calculate other timeframes
    const dailyProfit = monthlyProfit / 30;
    const weeklyProfit = monthlyProfit / 4.33;
    const yearlyProfit = monthlyProfit * 12;
    
    return {
      daily: dailyProfit,
      weekly: weeklyProfit,
      monthly: monthlyProfit,
      yearly: yearlyProfit,
      totalBb100,
      rakebackBb100,
      baseRake,
      handsPerMonth
    };
  };

  // ============================================
  // HANDLERS
  // ============================================
  
  const addScenario = () => {
    if (!volume || !winRate || rakeback === '') return;
    
    const newScenario = {
      id: Date.now(),
      site: selectedSite,
      stake: selectedStake,
      volume: parseFloat(volume),
      winRate: parseFloat(winRate),
      rakeback: parseFloat(rakeback),
      mode,
      handsPerHour: mode === 'live' ? handsPerHour : null
    };
    
    setScenarios([...scenarios, newScenario]);
  };

  const removeScenario = (id) => {
    setScenarios(scenarios.filter(s => s.id !== id));
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
    <svg ref={nachoRef} width="90" height="90" viewBox="0 0 100 100" className="drop-shadow-[0_4px_12px_rgba(234,179,8,0.4)]">
      <path d="M50 8 L88 85 Q90 92 82 92 L18 92 Q10 92 12 85 Z" fill="#facc15" stroke="#eab308" strokeWidth="2"/>
      <path d="M25 70 Q20 75 22 82 Q24 88 28 85 Q30 80 28 75 Z" fill="#fde047" opacity="0.9"/>
      <path d="M72 65 Q78 72 76 80 Q74 86 70 82 Q68 76 70 70 Z" fill="#fde047" opacity="0.9"/>
      <path d="M48 75 Q45 82 48 88 Q52 92 55 86 Q56 80 52 76 Z" fill="#fde047" opacity="0.9"/>
      <ellipse cx="50" cy="50" rx="22" ry="18" fill="#facc15" />
      <ellipse cx="40" cy="48" rx="8" ry="9" fill="white" />
      <ellipse cx="60" cy="48" rx="8" ry="9" fill="white" />
      <circle cx={40 + eyeOffset.x} cy={48 + eyeOffset.y} r="4" fill="#09090b" className="transition-all duration-100 ease-out"/>
      <circle cx={60 + eyeOffset.x} cy={48 + eyeOffset.y} r="4" fill="#09090b" className="transition-all duration-100 ease-out"/>
      <circle cx={38 + eyeOffset.x * 0.5} cy={46 + eyeOffset.y * 0.5} r="1.5" fill="white" opacity="0.8" />
      <circle cx={58 + eyeOffset.x * 0.5} cy={46 + eyeOffset.y * 0.5} r="1.5" fill="white" opacity="0.8" />
      <path d="M38 62 Q50 72 62 62" fill="none" stroke="#09090b" strokeWidth="3" strokeLinecap="round"/>
      <path d="M33 38 Q40 35 47 38" fill="none" stroke="#09090b" strokeWidth="2" strokeLinecap="round" />
      <path d="M53 38 Q60 35 67 38" fill="none" stroke="#09090b" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="30" r="2" fill="#ca8a04" opacity="0.5" />
      <circle cx="70" cy="35" r="2.5" fill="#ca8a04" opacity="0.5" />
      <circle cx="35" cy="80" r="2" fill="#ca8a04" opacity="0.5" />
      <circle cx="65" cy="78" r="1.5" fill="#ca8a04" opacity="0.5" />
    </svg>
  );

  const NachoTriangle = ({ size, opacity }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ opacity }}>
      <path d="M10 2 L18 17 L2 17 Z" fill="#facc15" opacity="0.8"/>
    </svg>
  );

  const formatCurrency = (value, compact = false) => {
    const absValue = Math.abs(value);
    const sign = value >= 0 ? '+' : '-';
    
    // For very large numbers, use abbreviations
    if (absValue >= 1000000) {
      return `${sign}$${(absValue / 1000000).toFixed(1)}M`;
    }
    if (absValue >= 10000) {
      return `${sign}$${(absValue / 1000).toFixed(1)}K`;
    }
    if (absValue >= 1000) {
      // For $1K-$10K, show whole dollars
      return `${sign}$${Math.round(absValue).toLocaleString('en-US')}`;
    }
    if (absValue >= 100) {
      // For $100-$999, show whole dollars
      return `${sign}$${Math.round(absValue).toLocaleString('en-US')}`;
    }
    // For smaller amounts, show cents
    return `${sign}$${absValue.toFixed(2)}`;
  };

  const getProfitColor = (value) => {
    if (value > 0) return 'text-emerald-400';
    if (value < 0) return 'text-red-400';
    return 'text-zinc-400';
  };

  const getProfitColorHex = (value) => {
    if (value > 0) return '#34d399';
    if (value < 0) return '#f87171';
    return '#a1a1aa';
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden font-sans">
      {/* Floating Nachos Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {nachos.map(nacho => (
          <motion.div
            key={nacho.id}
            className="absolute"
            style={{
              left: `${nacho.x}%`,
              top: `${nacho.y}%`,
            }}
            animate={{
              x: [0, nacho.moveX, 0],
              y: [0, nacho.moveY, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: nacho.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: nacho.delay,
            }}
          >
            <NachoTriangle size={nacho.size} opacity={nacho.opacity * 0.3} />
          </motion.div>
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-zinc-950 pointer-events-none z-0" />
      
      {/* Main Content */}
      <motion.div 
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <NachosPokerNavBar />
        
        {/* Header Banner */}
        <motion.div 
          variants={itemVariants}
          className="relative mb-8 p-6 sm:p-8 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 overflow-hidden group"
        >
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-500/20 via-yellow-600/10 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-[1px] rounded-2xl bg-zinc-900/90" />
          
          {/* Sparkle accent */}
          <div className="absolute top-4 right-4">
            <Sparkles className="w-5 h-5 text-yellow-500/50" />
          </div>
          
          <div className="relative flex flex-col sm:flex-row items-center gap-6">
            <motion.div 
              className="flex-shrink-0"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <CartoonNacho />
            </motion.div>
            
            <div className="flex-1 text-center sm:text-left">
              <span className="inline-block text-xs font-semibold text-yellow-500 tracking-widest uppercase mb-2">
                Crafted by FreeNachos
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Know your numbers. <span className="text-zinc-500">Then grow them.</span>
              </h2>
              <p className="text-sm text-zinc-400 max-w-md">
                Calculate your expected profit — and discover how coaching could take your win rate to the next level.
              </p>
            </div>
            
            <div className="flex flex-col gap-3 flex-shrink-0">
              <a 
                href="https://www.nachospoker.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-zinc-950 font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:-translate-y-0.5"
              >
                Join Our CFP <ExternalLink className="w-4 h-4" />
              </a>
              <a 
                href="https://www.freenachoscoaching.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-yellow-500/50 text-yellow-500 font-semibold text-sm transition-all duration-300 hover:bg-yellow-500/10 hover:border-yellow-500 hover:-translate-y-0.5"
              >
                Private Coaching <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Main Tool Card */}
        <motion.div 
          variants={itemVariants}
          className="relative rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-6 sm:p-10 mb-8 overflow-hidden"
        >
          {/* Subtle corner accent */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-br-full" />
          
          <div className="relative">
            {/* Title */}
            <div className="flex items-center justify-center gap-3 mb-2">
              <Calculator className="w-7 h-7 text-yellow-500" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Poker Profit Calculator
              </h1>
            </div>
            <p className="text-center text-zinc-400 text-sm mb-10">
              Project your earnings based on volume, win rate, and rakeback
            </p>

            {/* Input Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {/* Mode Toggle */}
              <motion.div 
                variants={cardVariants}
                className="bg-zinc-800/50 backdrop-blur border border-zinc-700/50 rounded-xl p-5"
              >
                <h3 className="flex items-center gap-2 text-yellow-500 font-semibold text-xs uppercase tracking-wider mb-4">
                  <Layers className="w-4 h-4" /> Mode
                </h3>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setMode('online')}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      mode === 'online'
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-zinc-950 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700 hover:text-zinc-300'
                    }`}
                  >
                    Online
                  </button>
                  <button 
                    onClick={() => setMode('live')}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      mode === 'live'
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-zinc-950 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700 hover:text-zinc-300'
                    }`}
                  >
                    Live
                  </button>
                </div>
              </motion.div>

              {/* Volume Input */}
              <motion.div 
                variants={cardVariants}
                className="bg-zinc-800/50 backdrop-blur border border-zinc-700/50 rounded-xl p-5"
              >
                <h3 className="flex items-center gap-2 text-yellow-500 font-semibold text-xs uppercase tracking-wider mb-4">
                  <Clock className="w-4 h-4" /> {mode === 'online' ? 'Hands / Month' : 'Hours / Month'}
                </h3>
                <input
                  type="number"
                  placeholder={mode === 'online' ? 'e.g., 50000' : 'e.g., 100'}
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900/80 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                />
                {mode === 'live' && (
                  <div className="mt-3">
                    <label className="text-[10px] text-zinc-500 block mb-1.5">
                      Hands per Hour (default: 30)
                    </label>
                    <input
                      type="number"
                      placeholder="30"
                      value={handsPerHour}
                      onChange={(e) => setHandsPerHour(parseInt(e.target.value) || DEFAULT_HANDS_PER_HOUR)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900/80 border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                    />
                  </div>
                )}
              </motion.div>

              {/* Win Rate & Rakeback */}
              <motion.div 
                variants={cardVariants}
                className="bg-zinc-800/50 backdrop-blur border border-zinc-700/50 rounded-xl p-5"
              >
                <h3 className="flex items-center gap-2 text-yellow-500 font-semibold text-xs uppercase tracking-wider mb-4">
                  <TrendingUp className="w-4 h-4" /> Win Rate & Rakeback
                </h3>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] text-zinc-500 block mb-1.5">
                      Win Rate (bb/100)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 3.5"
                      value={winRate}
                      onChange={(e) => setWinRate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-zinc-900/80 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-zinc-500 block mb-1.5">
                      Rakeback %
                    </label>
                    <input
                      type="number"
                      step="1"
                      placeholder="e.g., 30"
                      value={rakeback}
                      onChange={(e) => setRakeback(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-zinc-900/80 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Site/Stake Selection */}
            <motion.div 
              variants={cardVariants}
              className="bg-zinc-800/50 backdrop-blur border border-zinc-700/50 rounded-xl p-6 mb-8"
            >
              <h3 className="flex items-center gap-2 text-yellow-500 font-semibold text-xs uppercase tracking-wider mb-5">
                <DollarSign className="w-4 h-4" /> Add Site & Stake Scenario
              </h3>
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[180px]">
                  <label className="text-[10px] text-zinc-500 block mb-1.5">
                    Site
                  </label>
                  <select
                    value={selectedSite}
                    onChange={(e) => {
                      setSelectedSite(e.target.value);
                      setSelectedStake(Object.keys(SITE_DATA[e.target.value].stakes)[0]);
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900/80 border border-zinc-700 text-white text-sm cursor-pointer appearance-none focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23a1a1aa%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center] pr-10"
                  >
                    {Object.entries(SITE_DATA).map(([key, data]) => (
                      <option key={key} value={key} className="bg-zinc-900">{data.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label className="text-[10px] text-zinc-500 block mb-1.5">
                    Stake
                  </label>
                  <select
                    value={selectedStake}
                    onChange={(e) => setSelectedStake(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900/80 border border-zinc-700 text-white text-sm cursor-pointer appearance-none focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23a1a1aa%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center] pr-10"
                  >
                    {Object.keys(SITE_DATA[selectedSite].stakes).map(stake => (
                      <option key={stake} value={stake} className="bg-zinc-900">{stake.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={addScenario}
                    disabled={!volume || !winRate || rakeback === ''}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                      volume && winRate && rakeback !== ''
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-zinc-950 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:-translate-y-0.5 cursor-pointer'
                        : 'bg-zinc-700/50 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-5 h-5" /> Add Scenario
                  </button>
                </div>
              </div>
              <div className="mt-4 text-xs text-zinc-500">
                Base rake for {SITE_DATA[selectedSite].name} {selectedStake.toUpperCase()}: <span className="text-yellow-500 font-medium">{SITE_DATA[selectedSite].stakes[selectedStake].rake} bb/100</span>
              </div>
            </motion.div>

            {/* Results Section - Table Format */}
            <AnimatePresence>
              {scenarios.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="flex items-center gap-2.5 text-white text-lg font-semibold mb-5">
                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                    Projected Profits
                  </h3>
                  
                  {/* Table Container */}
                  <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/60">
                    <table className="w-full min-w-[800px]">
                      {/* Table Header */}
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-yellow-500 uppercase tracking-wider bg-zinc-800/50 whitespace-nowrap">
                            Site / Stake
                          </th>
                          <th className="px-3 py-3.5 text-center text-[11px] font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-800/50 whitespace-nowrap">
                            Volume
                          </th>
                          <th className="px-3 py-3.5 text-center text-[11px] font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-800/50 whitespace-nowrap">
                            WR
                          </th>
                          <th className="px-3 py-3.5 text-center text-[11px] font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-800/50 whitespace-nowrap">
                            RB
                          </th>
                          <th className="px-3 py-3.5 text-center text-[11px] font-semibold text-yellow-500 uppercase tracking-wider bg-yellow-500/5 whitespace-nowrap">
                            Total
                          </th>
                          <th className="px-3 py-3.5 text-center text-[11px] font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-800/50 whitespace-nowrap">
                            Daily
                          </th>
                          <th className="px-3 py-3.5 text-center text-[11px] font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-800/50 whitespace-nowrap">
                            Weekly
                          </th>
                          <th className="px-3 py-3.5 text-center text-[11px] font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-800/50 whitespace-nowrap">
                            Monthly
                          </th>
                          <th className="px-3 py-3.5 text-center text-[11px] font-semibold text-emerald-400 uppercase tracking-wider bg-emerald-500/5 whitespace-nowrap">
                            Yearly
                          </th>
                          <th className="px-2 py-3.5 text-center text-[11px] font-semibold text-zinc-600 uppercase tracking-wider bg-zinc-800/50 w-10">
                          </th>
                        </tr>
                      </thead>
                      
                      {/* Table Body */}
                      <tbody>
                        {scenarios.map((scenario, index) => {
                          const results = calculateProfit(scenario);
                          const siteData = SITE_DATA[scenario.site];
                          const isLastRow = index === scenarios.length - 1;
                          
                          return (
                            <motion.tr 
                              key={scenario.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className={`${!isLastRow ? 'border-b border-zinc-800/50' : ''} hover:bg-zinc-800/30 transition-colors duration-150`}
                            >
                              {/* Site / Stake */}
                              <td className="px-4 py-3">
                                <div className="font-semibold text-white text-[13px]">
                                  {siteData.name}
                                </div>
                                <div className="text-[11px] text-zinc-500 mt-0.5">
                                  {scenario.stake.toUpperCase()}
                                </div>
                              </td>
                              
                              {/* Volume */}
                              <td className="px-3 py-3 text-center">
                                <div className="font-medium text-zinc-300 text-xs whitespace-nowrap">
                                  {results.handsPerMonth >= 1000 
                                    ? `${(results.handsPerMonth / 1000).toFixed(0)}K` 
                                    : results.handsPerMonth.toLocaleString()}
                                </div>
                                <div className="text-[9px] text-zinc-600 mt-0.5">
                                  hands
                                </div>
                              </td>
                              
                              {/* Win Rate */}
                              <td className="px-3 py-3 text-center whitespace-nowrap">
                                <span className={`font-semibold text-[13px] ${getProfitColor(scenario.winRate)}`}>
                                  {scenario.winRate >= 0 ? '+' : ''}{scenario.winRate}
                                </span>
                              </td>
                              
                              {/* Rakeback */}
                              <td className="px-3 py-3 text-center whitespace-nowrap">
                                <span className="font-semibold text-emerald-400 text-[13px]">
                                  +{results.rakebackBb100.toFixed(1)}
                                </span>
                              </td>
                              
                              {/* Total WR */}
                              <td className="px-3 py-3 text-center bg-yellow-500/5 whitespace-nowrap">
                                <span className={`font-bold text-[13px] ${getProfitColor(results.totalBb100)}`}>
                                  {results.totalBb100 >= 0 ? '+' : ''}{results.totalBb100.toFixed(1)}
                                </span>
                              </td>
                              
                              {/* Daily */}
                              <td className="px-3 py-3 text-center whitespace-nowrap">
                                <span className={`font-semibold text-xs ${getProfitColor(results.daily)}`}>
                                  {formatCurrency(results.daily)}
                                </span>
                              </td>
                              
                              {/* Weekly */}
                              <td className="px-3 py-3 text-center whitespace-nowrap">
                                <span className={`font-semibold text-xs ${getProfitColor(results.weekly)}`}>
                                  {formatCurrency(results.weekly)}
                                </span>
                              </td>
                              
                              {/* Monthly */}
                              <td className="px-3 py-3 text-center whitespace-nowrap">
                                <span className={`font-semibold text-[13px] ${getProfitColor(results.monthly)}`}>
                                  {formatCurrency(results.monthly)}
                                </span>
                              </td>
                              
                              {/* Yearly */}
                              <td className="px-3 py-3 text-center bg-emerald-500/5 whitespace-nowrap">
                                <span className={`font-bold text-[13px] ${getProfitColor(results.yearly)}`}>
                                  {formatCurrency(results.yearly)}
                                </span>
                              </td>
                              
                              {/* Delete Button */}
                              <td className="px-2 py-3 text-center">
                                <button
                                  onClick={() => removeScenario(scenario.id)}
                                  className="p-1.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-200"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                      
                      {/* Table Footer - Totals */}
                      {scenarios.length > 1 && (
                        <tfoot>
                          <tr className="border-t-2 border-yellow-500/20 bg-yellow-500/5">
                            <td className="px-4 py-3">
                              <div className="font-bold text-yellow-500 text-[13px]">
                                TOTAL
                              </div>
                              <div className="text-[10px] text-zinc-500 mt-0.5">
                                {scenarios.length} scenarios
                              </div>
                            </td>
                            <td className="px-3 py-3 text-center whitespace-nowrap">
                              {(() => {
                                const totalHands = scenarios.reduce((sum, s) => sum + calculateProfit(s).handsPerMonth, 0);
                                return (
                                  <span className="font-semibold text-zinc-400 text-xs">
                                    {totalHands >= 1000 ? `${(totalHands / 1000).toFixed(0)}K` : totalHands.toLocaleString()}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="text-zinc-600 text-[11px]">—</span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="text-zinc-600 text-[11px]">—</span>
                            </td>
                            <td className="px-3 py-3 text-center bg-yellow-500/10">
                              <span className="text-zinc-600 text-[11px]">—</span>
                            </td>
                            <td className="px-3 py-3 text-center whitespace-nowrap">
                              {(() => {
                                const total = scenarios.reduce((sum, s) => sum + calculateProfit(s).daily, 0);
                                return (
                                  <span className={`font-bold text-xs ${getProfitColor(total)}`}>
                                    {formatCurrency(total)}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="px-3 py-3 text-center whitespace-nowrap">
                              {(() => {
                                const total = scenarios.reduce((sum, s) => sum + calculateProfit(s).weekly, 0);
                                return (
                                  <span className={`font-bold text-xs ${getProfitColor(total)}`}>
                                    {formatCurrency(total)}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="px-3 py-3 text-center whitespace-nowrap">
                              {(() => {
                                const total = scenarios.reduce((sum, s) => sum + calculateProfit(s).monthly, 0);
                                return (
                                  <span className={`font-bold text-[13px] ${getProfitColor(total)}`}>
                                    {formatCurrency(total)}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="px-3 py-3 text-center bg-emerald-500/10 whitespace-nowrap">
                              {(() => {
                                const total = scenarios.reduce((sum, s) => sum + calculateProfit(s).yearly, 0);
                                return (
                                  <span className={`font-extrabold text-sm ${getProfitColor(total)}`}>
                                    {formatCurrency(total)}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="px-2 py-3"></td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {scenarios.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 px-6 rounded-xl bg-zinc-800/20 border border-dashed border-zinc-700"
              >
                <Calculator className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <div className="text-base text-zinc-500 mb-2">
                  No scenarios added yet
                </div>
                <div className="text-sm text-zinc-600">
                  Fill in the fields above and click "Add Scenario" to see your projected profits
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Insights Section */}
        <motion.div 
          variants={itemVariants}
          className="relative rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-6 sm:p-10"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <TrendingUp className="w-6 h-6 text-yellow-500" />
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              Understanding Your Numbers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Insight 1 */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-yellow-500/10 backdrop-blur border border-yellow-500/20 rounded-xl p-6 transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(234,179,8,0.1)]"
            >
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <h3 className="text-yellow-500 text-sm font-semibold">
                  Rake is an Estimate
                </h3>
              </div>
              <p className="text-zinc-400 text-[13px] leading-relaxed">
                The rake values shown are averages — your actual rake depends on your playing style, table selection, and how often you see flops. Tighter players pay less rake.
              </p>
            </motion.div>

            {/* Insight 2 */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-red-500/10 backdrop-blur border border-red-500/20 rounded-xl p-6 transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]"
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <h3 className="text-red-400 text-sm font-semibold">
                  Use Your Real Rakeback %
                </h3>
              </div>
              <p className="text-zinc-400 text-[13px] leading-relaxed">
                Enter your <em className="text-zinc-300">actual</em> rakeback percentage, not the advertised one. Sites like GGPoker advertise up to 60% but real returns are often much lower. Check your cashier history.
              </p>
            </motion.div>

            {/* Insight 3 */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-blue-500/10 backdrop-blur border border-blue-500/20 rounded-xl p-6 transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
            >
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-blue-400" />
                <h3 className="text-blue-400 text-sm font-semibold">
                  Site Selection Matters
                </h3>
              </div>
              <p className="text-zinc-400 text-[13px] leading-relaxed">
                Different sites have different rake structures and player pools. Compare scenarios across sites to find where your edge is maximized.
              </p>
            </motion.div>
          </div>

          <div className="mt-8 p-5 bg-zinc-950/50 rounded-xl border border-zinc-800 text-center">
            <p className="text-zinc-500 text-[13px] leading-relaxed">
              <strong className="text-yellow-500">Pro Tip:</strong> These projections assume a stable win rate. In reality, variance can cause significant short-term swings. 
              Focus on volume and continuous improvement — the math will work out over time.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PokerProfitCalculator;

'use client';

import NachosPokerNavBar from '@/components/NachosPokerNavBar';
import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, X, ExternalLink, HelpCircle, TrendingUp, Target, BarChart3, ChevronDown, ChevronUp, Settings, Sparkles, Calculator, Zap, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PokerEVSimulation = () => {
  // ============================================
  // STATE - PRESERVED EXACTLY AS ORIGINAL
  // ============================================
  const [parameters, setParameters] = useState({
    winrate: 4,
    observedWinrate: 10,
    stdDev: 90,
    numHands: 100000,
    numSamples: 20,
    stakeWeights: [{ 
      stake: '25nl', 
      weight: 100, 
      volumeType: 'percentage',
      customWinrate: 4,
      customStdDev: 90
    }]
  });
  
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [displayInDollars, setDisplayInDollars] = useState(true);
  const [hoveredSample, setHoveredSample] = useState(null);
  const [nachos, setNachos] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const nachoRef = useRef(null);

  // ============================================
  // MULTIPLAYER MODE STATE
  // ============================================
  const [multiplayerMode, setMultiplayerMode] = useState(false);
  const [players, setPlayers] = useState([
    { id: 1, name: 'Player 1', winrate: 6, stdDev: 85, numSamples: 5, color: '#22c55e' },
    { id: 2, name: 'Player 2', winrate: 2, stdDev: 95, numSamples: 5, color: '#ef4444' }
  ]);
  const [multiplayerResults, setMultiplayerResults] = useState(null);
  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  
  // Player color palette
  const playerColors = [
    '#22c55e', // green
    '#ef4444', // red
    '#3b82f6', // blue
    '#f59e0b', // amber
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#84cc16', // lime
  ];

  // ============================================
  // EFFECTS - PRESERVED EXACTLY AS ORIGINAL
  // ============================================
  
  // Fix viewport scaling for mobile
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
    document.getElementsByTagName('head')[0].appendChild(meta);
  }, []);

  // Max limits to prevent breaking
  const MAX_HANDS = 10000000;
  const MAX_SAMPLES = 100;
  const MAX_SAMPLEHANDS = 100000000;

  // Calculate current samplehands and check if over limit
  const samplehands = parameters.numSamples * parameters.numHands;
  const isOverLimit = samplehands > MAX_SAMPLEHANDS;

  const stakes = [
    { value: '5nl', label: '5NL', bb: 0.05 },
    { value: '10nl', label: '10NL', bb: 0.10 },
    { value: '25nl', label: '25NL', bb: 0.25 },
    { value: '50nl', label: '50NL', bb: 0.50 },
    { value: '100nl', label: '100NL', bb: 1.00 },
    { value: '200nl', label: '200NL', bb: 2.00 },
    { value: '500nl', label: '500NL', bb: 5.00 },
    { value: '1000nl', label: '1000NL', bb: 10.00 },
    { value: '2000nl', label: '2000NL', bb: 20.00 },
    { value: '5000nl', label: '5000NL', bb: 50.00 }
  ];

  // Track mouse position for nacho eyes
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate eye position based on mouse
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

  // Initialize floating nachos
  useEffect(() => {
    const newNachos = Array.from({ length: 14 }, (_, i) => ({
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

  // ============================================
  // CALCULATION FUNCTIONS - PRESERVED EXACTLY
  // ============================================

  const getWeightedAverageBB = () => {
    const totalWeight = parameters.stakeWeights.reduce((sum, sw) => sum + (sw.weight || 0), 0);
    if (totalWeight === 0) return 0.25;
    const weightedSum = parameters.stakeWeights.reduce((sum, sw) => {
      const stake = stakes.find(s => s.value === sw.stake);
      return sum + (stake ? stake.bb * (sw.weight || 0) : 0);
    }, 0);
    return weightedSum / totalWeight;
  };

  const getWeightedAverageWinrate = () => {
    const totalWeight = parameters.stakeWeights.reduce((sum, sw) => sum + (sw.weight || 0), 0);
    if (totalWeight === 0) return parameters.winrate;
    const weightedSum = parameters.stakeWeights.reduce((sum, sw) => {
      return sum + ((sw.customWinrate || 0) * (sw.weight || 0));
    }, 0);
    return weightedSum / totalWeight;
  };

  const getWeightedAverageStdDev = () => {
    const totalWeight = parameters.stakeWeights.reduce((sum, sw) => sum + (sw.weight || 0), 0);
    if (totalWeight === 0) return parameters.stdDev;
    const weightedSum = parameters.stakeWeights.reduce((sum, sw) => {
      return sum + ((sw.customStdDev || 0) * (sw.weight || 0));
    }, 0);
    return weightedSum / totalWeight;
  };

  // Calculate bankroll requirements using Risk of Ruin formula
  const calculateBankrollRequirement = (riskOfRuin) => {
    const avgWinrate = getWeightedAverageWinrate();
    const avgStdDev = getWeightedAverageStdDev();
    const avgBB = getWeightedAverageBB();
    
    // FIX: Validate stdDev is positive
    if (avgStdDev <= 0) {
      return { bb: Infinity, dollars: Infinity };
    }
    
    const wrPerHand = avgWinrate / 100;
    const stdDevPerHand = avgStdDev / Math.sqrt(100);
    
    if (wrPerHand <= 0) {
      return { bb: Infinity, dollars: Infinity };
    }
    
    const bankrollBB = (Math.pow(stdDevPerHand, 2) / (2 * wrPerHand)) * Math.log(1 / riskOfRuin);
    const bankrollDollars = bankrollBB * avgBB;
    
    return {
      bb: Math.ceil(bankrollBB),
      dollars: Math.ceil(bankrollDollars)
    };
  };

  const bankrollProfiles = [
    { name: 'Aggressive Nacho', ror: 0.10, emoji: '😤', description: 'High-risk shot-taker' },
    { name: 'Basic Nacho', ror: 0.05, emoji: '🙂', description: 'Industry standard' },
    { name: 'Pro Nacho', ror: 0.01, emoji: '🤠', description: 'Serious grinder' },
    { name: 'Nit Nacho', ror: 0.001, emoji: '😰', description: 'Bulletproof bankroll' }
  ];

  const addStake = () => {
    const newStakeCount = parameters.stakeWeights.length + 1;
    const evenWeight = Math.floor(100 / newStakeCount);
    
    // Redistribute existing stakes evenly (only if they're using percentage)
    const updatedWeights = parameters.stakeWeights.map(sw => ({
      ...sw,
      weight: sw.volumeType === 'percentage' ? evenWeight : sw.weight
    }));
    
    // Add new stake with even weight
    setParameters({
      ...parameters,
      stakeWeights: [...updatedWeights, { 
        stake: '25nl', 
        weight: evenWeight, 
        volumeType: 'percentage',
        customWinrate: parameters.winrate,
        customStdDev: parameters.stdDev
      }]
    });
  };

  const removeStake = (index) => {
    if (parameters.stakeWeights.length > 1) {
      const newWeights = parameters.stakeWeights.filter((_, i) => i !== index);
      const newStakeCount = newWeights.length;
      const evenWeight = Math.floor(100 / newStakeCount);
      
      // Redistribute remaining stakes evenly (only if they're using percentage)
      const redistributedWeights = newWeights.map(sw => ({
        ...sw,
        weight: sw.volumeType === 'percentage' ? evenWeight : sw.weight
      }));
      
      setParameters({ ...parameters, stakeWeights: redistributedWeights });
    }
  };

  const updateStakeWeight = (index, field, value) => {
    const newWeights = [...parameters.stakeWeights];
    newWeights[index] = { ...newWeights[index], [field]: value };
    setParameters({ ...parameters, stakeWeights: newWeights });
  };

  const handleHandsChange = (value) => {
    const numValue = parseInt(value) || 0;
    setParameters({...parameters, numHands: Math.min(numValue, MAX_HANDS)});
  };

  const handleSamplesChange = (value) => {
    const numValue = parseInt(value) || 0;
    setParameters({...parameters, numSamples: Math.min(numValue, MAX_SAMPLES)});
  };

  const normalRandom = () => {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };

  const monteCarloSimulation = (numHands, numSamples, stakeWeights) => {
    const totalOps = numSamples * numHands;
    if (totalOps > MAX_SAMPLEHANDS) {
      return null;
    }

    // FIX: Build cumulative distribution for proper weighted sampling
    // instead of creating a capped pool of 1000 entries
    const totalWeight = stakeWeights.reduce((sum, sw) => sum + (sw.weight || 0), 0);
    const stakeData = [];
    let cumulative = 0;
    
    stakeWeights.forEach(sw => {
      const stake = stakes.find(s => s.value === sw.stake);
      if (stake && (sw.weight || 0) > 0) {
        const normalizedWeight = (sw.weight || 0) / totalWeight;
        cumulative += normalizedWeight;
        stakeData.push({
          cumulative,
          bb: stake.bb,
          winrate: sw.customWinrate || 0,
          stdDev: Math.max(sw.customStdDev || 1, 1) // Ensure stdDev is at least 1
        });
      }
    });
    
    // Fallback if no valid stakes
    if (stakeData.length === 0) {
      stakeData.push({
        cumulative: 1,
        bb: 0.25,
        winrate: parameters.winrate || 0,
        stdDev: Math.max(parameters.stdDev || 90, 1)
      });
    }
    
    // Binary search sampler for O(log n) stake selection
    const getStake = () => {
      const r = Math.random();
      let left = 0;
      let right = stakeData.length - 1;
      while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (stakeData[mid].cumulative < r) {
          left = mid + 1;
        } else {
          right = mid;
        }
      }
      return stakeData[left];
    };
    
    const samples = [];
    
    for (let sample = 0; sample < numSamples; sample++) {
      const sampleData = [];
      let cumulativeDollars = 0;
      
      for (let hand = 1; hand <= numHands; hand++) {
        const stakeInfo = getStake();
        const handResultBB = normalRandom() * ((stakeInfo.stdDev || 0) / Math.sqrt(100)) + ((stakeInfo.winrate || 0) / 100);
        const handResultDollars = handResultBB * stakeInfo.bb;
        cumulativeDollars += handResultDollars;
        
        if (hand % 1000 === 0 || hand === numHands) {
          sampleData.push({ x: hand, y: cumulativeDollars });
        }
      }
      
      samples.push({ data: sampleData, finalEV: cumulativeDollars });
    }
    
    const finalEVs = samples.map(s => s.finalEV);
    finalEVs.sort((a, b) => a - b);
    
    // FIX: Handle edge case when numSamples is very small
    const lowerIndex = Math.max(0, Math.floor(0.025 * numSamples));
    const upperIndex = Math.min(numSamples - 1, Math.floor(0.975 * numSamples));
    
    return {
      samples,
      finalEVs,
      bestRun: Math.max(...finalEVs),
      worstRun: Math.min(...finalEVs),
      avgEV: finalEVs.reduce((a, b) => a + b, 0) / finalEVs.length,
      conf95Lower: finalEVs[lowerIndex] || 0,
      conf95Upper: finalEVs[upperIndex] || 0
    };
  };

  const runSimulation = () => {
    if (isOverLimit) {
      alert('Limit exceeded: samples × hands must be ≤ 100,000,000. Please reduce your inputs.');
      return;
    }

    const { numHands, numSamples, stakeWeights } = parameters;
    
    if (isNaN(numHands) || numHands <= 0 || isNaN(numSamples) || numSamples <= 0) {
      alert('Please enter valid numeric values.');
      return;
    }
    
    // FIX: Validate stdDev before running simulation
    const avgStdDev = getWeightedAverageStdDev();
    if (avgStdDev <= 0) {
      alert('Standard deviation must be greater than 0.');
      return;
    }
    
    setIsCalculating(true);
    setTimeout(() => {
      const simResults = monteCarloSimulation(numHands, numSamples, stakeWeights);
      setResults(simResults);
      setIsCalculating(false);
    }, 100);
  };

  // ============================================
  // MULTIPLAYER MODE FUNCTIONS
  // ============================================
  
  const MAX_TOTAL_SAMPLES = 20;
  
  const getTotalMultiplayerSamples = () => {
    return players.reduce((sum, p) => sum + (p.numSamples || 0), 0);
  };
  
  const addPlayer = () => {
    if (players.length >= 8) {
      alert('Maximum 8 players allowed.');
      return;
    }
    const newId = Math.max(...players.map(p => p.id)) + 1;
    const colorIndex = players.length % playerColors.length;
    setPlayers([...players, {
      id: newId,
      name: `Player ${newId}`,
      winrate: 3,
      stdDev: 90,
      numSamples: Math.min(3, MAX_TOTAL_SAMPLES - getTotalMultiplayerSamples()),
      color: playerColors[colorIndex]
    }]);
  };
  
  const removePlayer = (id) => {
    if (players.length > 1) {
      setPlayers(players.filter(p => p.id !== id));
    }
  };
  
  const updatePlayer = (id, field, value) => {
    setPlayers(players.map(p => {
      if (p.id === id) {
        // Validate numSamples doesn't exceed total limit
        if (field === 'numSamples') {
          const otherPlayersSamples = players.filter(op => op.id !== id).reduce((sum, op) => sum + (op.numSamples || 0), 0);
          const maxForThisPlayer = MAX_TOTAL_SAMPLES - otherPlayersSamples;
          value = Math.min(Math.max(1, value), maxForThisPlayer);
        }
        return { ...p, [field]: value };
      }
      return p;
    }));
  };
  
  // Run simulation for a single player (used in multiplayer mode)
  const runPlayerSimulation = (player, numHands, stakeWeights) => {
    const totalWeight = stakeWeights.reduce((sum, sw) => sum + (sw.weight || 0), 0);
    const stakeData = [];
    let cumulative = 0;
    
    stakeWeights.forEach(sw => {
      const stake = stakes.find(s => s.value === sw.stake);
      if (stake && (sw.weight || 0) > 0) {
        const normalizedWeight = (sw.weight || 0) / totalWeight;
        cumulative += normalizedWeight;
        stakeData.push({
          cumulative,
          bb: stake.bb,
          // Use player's winrate and stdDev instead of stake's custom values
          winrate: player.winrate,
          stdDev: Math.max(player.stdDev || 1, 1)
        });
      }
    });
    
    if (stakeData.length === 0) {
      stakeData.push({
        cumulative: 1,
        bb: 0.25,
        winrate: player.winrate,
        stdDev: Math.max(player.stdDev || 90, 1)
      });
    }
    
    const getStake = () => {
      const r = Math.random();
      let left = 0;
      let right = stakeData.length - 1;
      while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (stakeData[mid].cumulative < r) {
          left = mid + 1;
        } else {
          right = mid;
        }
      }
      return stakeData[left];
    };
    
    const samples = [];
    
    for (let sample = 0; sample < player.numSamples; sample++) {
      const sampleData = [];
      let cumulativeDollars = 0;
      
      for (let hand = 1; hand <= numHands; hand++) {
        const stakeInfo = getStake();
        const handResultBB = normalRandom() * ((stakeInfo.stdDev || 0) / Math.sqrt(100)) + ((stakeInfo.winrate || 0) / 100);
        const handResultDollars = handResultBB * stakeInfo.bb;
        cumulativeDollars += handResultDollars;
        
        if (hand % 1000 === 0 || hand === numHands) {
          sampleData.push({ x: hand, y: cumulativeDollars });
        }
      }
      
      samples.push({ 
        data: sampleData, 
        finalEV: cumulativeDollars,
        playerId: player.id,
        playerName: player.name,
        playerColor: player.color
      });
    }
    
    return samples;
  };
  
  const runMultiplayerSimulation = () => {
    const { numHands, stakeWeights } = parameters;
    
    if (isNaN(numHands) || numHands <= 0) {
      alert('Please enter valid number of hands.');
      return;
    }
    
    // Validate all players have positive stdDev
    const invalidPlayer = players.find(p => (p.stdDev || 0) <= 0);
    if (invalidPlayer) {
      alert(`${invalidPlayer.name} has invalid standard deviation. Must be greater than 0.`);
      return;
    }
    
    const totalSamples = getTotalMultiplayerSamples();
    if (totalSamples > MAX_TOTAL_SAMPLES) {
      alert(`Total samples (${totalSamples}) exceeds maximum (${MAX_TOTAL_SAMPLES}). Please reduce samples per player.`);
      return;
    }
    
    setIsCalculating(true);
    setTimeout(() => {
      const allSamples = [];
      const playerResults = [];
      
      players.forEach(player => {
        const samples = runPlayerSimulation(player, numHands, stakeWeights);
        allSamples.push(...samples);
        
        const finalEVs = samples.map(s => s.finalEV).sort((a, b) => a - b);
        playerResults.push({
          ...player,
          samples,
          finalEVs,
          bestRun: Math.max(...finalEVs),
          worstRun: Math.min(...finalEVs),
          avgEV: finalEVs.reduce((a, b) => a + b, 0) / finalEVs.length
        });
      });
      
      setMultiplayerResults({
        players: playerResults,
        allSamples
      });
      setIsCalculating(false);
    }, 100);
  };
  
  const prepareMultiplayerChartData = () => {
    if (!multiplayerResults) return [];
    const { numHands } = parameters;
    const maxHands = Math.floor(numHands / 1000) * 1000;
    const weightedBB = getWeightedAverageBB();
    const combinedData = [];
    
    // Pre-index all sample data
    const sampleDataIndex = multiplayerResults.allSamples.map(sample => {
      const indexed = {};
      sample.data.forEach(point => {
        indexed[point.x] = point.y;
      });
      return { indexed, playerId: sample.playerId };
    });
    
    for (let hand = 1000; hand <= maxHands; hand += 1000) {
      const dataPoint = { x: hand };
      
      // Add theoretical EV lines for each player
      players.forEach(player => {
        dataPoint[`ev_player_${player.id}`] = (player.winrate * hand / 100) * weightedBB;
      });
      
      // Add all sample lines
      multiplayerResults.allSamples.forEach((sample, sampleIndex) => {
        const value = sampleDataIndex[sampleIndex].indexed[hand];
        if (value !== undefined) {
          dataPoint[`sample_${sampleIndex}_player_${sample.playerId}`] = value;
        }
      });
      
      combinedData.push(dataPoint);
    }
    
    return combinedData;
  };

  const prepareChartData = () => {
    if (!results) return [];
    const { numHands } = parameters;
    const maxHands = Math.floor(numHands / 1000) * 1000;
    const weightedBB = getWeightedAverageBB();
    const weightedWinrate = getWeightedAverageWinrate();
    const weightedStdDev = getWeightedAverageStdDev();
    const combinedData = [];
    
    // Pre-index sample data for O(1) lookup instead of O(n) find()
    const sampleDataIndex = results.samples.map(sample => {
      const indexed = {};
      sample.data.forEach(point => {
        indexed[point.x] = point.y;
      });
      return indexed;
    });
    
    for (let hand = 1000; hand <= maxHands; hand += 1000) {
      const dataPoint = { x: hand };
      
      // Theoretical EV at this hand count
      dataPoint.theoreticalEV = (weightedWinrate * hand / 100) * weightedBB;
      
      // FIX: Calculate proper CI using sqrt(N) scaling instead of linear interpolation
      // Standard deviation after N hands = (stdDev_BB100 / 10) * sqrt(N)
      // where stdDev_BB100 / 10 converts BB/100 to per-hand stdDev
      const stdDevAtHandsBB = (weightedStdDev / 10) * Math.sqrt(hand);
      const stdDevAtHandsDollars = stdDevAtHandsBB * weightedBB;
      
      // 95% CI uses z = 1.96
      dataPoint.conf95Upper = dataPoint.theoreticalEV + (1.96 * stdDevAtHandsDollars);
      dataPoint.conf95Lower = dataPoint.theoreticalEV - (1.96 * stdDevAtHandsDollars);
      
      // Use indexed lookup instead of .find() for better performance
      results.samples.forEach((sample, sampleIndex) => {
        const value = sampleDataIndex[sampleIndex][hand];
        if (value !== undefined) dataPoint[`sample${sampleIndex}`] = value;
      });
      combinedData.push(dataPoint);
    }
    return combinedData;
  };

  const formatNumber = (num, inDollars = false) => {
    if (num === Infinity || isNaN(num)) return '∞';
    if (inDollars) {
      return '$' + Math.round(num).toLocaleString();
    }
    const weightedBB = getWeightedAverageBB();
    return Math.round(num / weightedBB).toLocaleString();
  };

  const getStakeMixLabel = () => {
    if (parameters.stakeWeights.length === 1) {
      const stake = stakes.find(s => s.value === parameters.stakeWeights[0].stake);
      return stake ? stake.label : '25NL';
    }
    return 'Mixed';
  };

  const getPrimaryStake = () => {
    const maxWeight = Math.max(...parameters.stakeWeights.map(sw => sw.weight || 0));
    const primary = parameters.stakeWeights.find(sw => (sw.weight || 0) === maxWeight);
    return stakes.find(s => s.value === (primary?.stake || '25nl')) || stakes[2];
  };

  const eyeOffset = getEyeOffset();

  // ============================================
  // COMPONENTS
  // ============================================

  const CartoonNacho = ({ size = 90 }) => (
    <svg ref={nachoRef} width={size} height={size} viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 4px 12px rgba(168, 139, 70, 0.4))' }}>
      <path d="M50 8 L88 85 Q90 92 82 92 L18 92 Q10 92 12 85 Z" fill="#a88b46" stroke="#a88b46" strokeWidth="2" />
      <path d="M25 70 Q20 75 22 82 Q24 88 28 85 Q30 80 28 75 Z" fill="#E0BC47" opacity="0.9" />
      <path d="M72 65 Q78 72 76 80 Q74 86 70 82 Q68 76 70 70 Z" fill="#E0BC47" opacity="0.9" />
      <path d="M48 75 Q45 82 48 88 Q52 92 55 86 Q56 80 52 76 Z" fill="#E0BC47" opacity="0.9" />
      <ellipse cx="50" cy="50" rx="22" ry="18" fill="#a88b46" />
      <ellipse cx="40" cy="48" rx="8" ry="9" fill="white" />
      <ellipse cx="60" cy="48" rx="8" ry="9" fill="white" />
      <circle cx={40 + eyeOffset.x} cy={48 + eyeOffset.y} r="4" fill="#0A0A0A" style={{ transition: 'cx 0.1s ease-out, cy 0.1s ease-out' }} />
      <circle cx={60 + eyeOffset.x} cy={48 + eyeOffset.y} r="4" fill="#0A0A0A" style={{ transition: 'cx 0.1s ease-out, cy 0.1s ease-out' }} />
      <circle cx={38 + eyeOffset.x * 0.5} cy={46 + eyeOffset.y * 0.5} r="1.5" fill="white" opacity="0.8" />
      <circle cx={58 + eyeOffset.x * 0.5} cy={46 + eyeOffset.y * 0.5} r="1.5" fill="white" opacity="0.8" />
      <path d="M38 62 Q50 72 62 62" fill="none" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" />
      <path d="M33 38 Q40 35 47 38" fill="none" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" />
      <path d="M53 38 Q60 35 67 38" fill="none" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="30" r="2" fill="#a88b46" opacity="0.5" />
      <circle cx="70" cy="35" r="2.5" fill="#a88b46" opacity="0.5" />
      <circle cx="35" cy="80" r="2" fill="#a88b46" opacity="0.5" />
      <circle cx="65" cy="78" r="1.5" fill="#a88b46" opacity="0.5" />
    </svg>
  );

  const NachoTriangle = ({ size, opacity }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ opacity }}>
      <path d="M10 2 L18 17 L2 17 Z" fill="#a88b46" opacity="0.8" />
    </svg>
  );

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 30, scale: 0.98 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

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

      {/* ==================== BACKGROUND GLOWS ==================== */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-8%', width: '900px', height: '900px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 139, 70, 0.08) 0%, transparent 60%)', filter: 'blur(80px)', opacity: 0.6 }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-12%', width: '1000px', height: '1000px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 139, 70, 0.06) 0%, transparent 55%)', filter: 'blur(100px)', opacity: 0.5 }} />
        <div style={{ position: 'absolute', top: '40%', right: '5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 139, 70, 0.05) 0%, transparent 50%)', filter: 'blur(60px)', opacity: 0.4 }} />
      </div>

      {/* ==================== PERIPHERAL BOKEH NACHOS ==================== */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '5%', left: '-8%', width: '180px', height: '180px', opacity: 0.06, filter: 'blur(18px)', animation: 'peripheralWobble1 120s ease-in-out infinite' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '40%', left: '-12%', width: '220px', height: '220px', opacity: 0.05, filter: 'blur(22px)', animation: 'peripheralWobble2 140s ease-in-out infinite', animationDelay: '-40s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', bottom: '10%', left: '-6%', width: '160px', height: '160px', opacity: 0.07, filter: 'blur(16px)', animation: 'peripheralWobble1 100s ease-in-out infinite', animationDelay: '-70s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '8%', right: '-10%', width: '200px', height: '200px', opacity: 0.05, filter: 'blur(20px)', animation: 'peripheralWobble2 130s ease-in-out infinite', animationDelay: '-20s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '50%', right: '-14%', width: '240px', height: '240px', opacity: 0.04, filter: 'blur(24px)', animation: 'peripheralWobble1 150s ease-in-out infinite', animationDelay: '-60s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', bottom: '15%', right: '-8%', width: '170px', height: '170px', opacity: 0.06, filter: 'blur(17px)', animation: 'peripheralWobble2 110s ease-in-out infinite', animationDelay: '-90s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
      </div>

      {/* ==================== FOREGROUND BOKEH NACHOS ==================== */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '5%', left: '3%', width: '90px', height: '90px', opacity: 0.12, filter: 'blur(12px)', animation: 'foregroundDrift1 80s ease-in-out infinite' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '110px', height: '110px', opacity: 0.10, filter: 'blur(14px)', animation: 'foregroundDrift2 90s ease-in-out infinite', animationDelay: '-30s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '45%', left: '-2%', width: '80px', height: '80px', opacity: 0.08, filter: 'blur(10px)', animation: 'foregroundDrift3 70s ease-in-out infinite', animationDelay: '-45s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '15%', right: '8%', width: '70px', height: '70px', opacity: 0.09, filter: 'blur(11px)', animation: 'foregroundDrift1 85s ease-in-out infinite', animationDelay: '-60s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
      </div>

      {/* ==================== MIDGROUND BOKEH NACHOS ==================== */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '15%', width: '40px', height: '40px', opacity: 0.18, filter: 'blur(4px)', animation: 'midgroundDrift1 45s ease-in-out infinite' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '60%', right: '20%', width: '35px', height: '35px', opacity: 0.16, filter: 'blur(5px)', animation: 'midgroundDrift2 50s ease-in-out infinite', animationDelay: '-15s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', bottom: '30%', left: '8%', width: '45px', height: '45px', opacity: 0.15, filter: 'blur(4px)', animation: 'midgroundDrift3 55s ease-in-out infinite', animationDelay: '-25s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '35%', right: '12%', width: '38px', height: '38px', opacity: 0.14, filter: 'blur(3px)', animation: 'midgroundDrift1 48s ease-in-out infinite', animationDelay: '-35s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '75%', left: '25%', width: '32px', height: '32px', opacity: 0.17, filter: 'blur(4px)', animation: 'midgroundDrift2 42s ease-in-out infinite', animationDelay: '-40s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '10%', left: '55%', width: '42px', height: '42px', opacity: 0.13, filter: 'blur(4px)', animation: 'midgroundDrift3 52s ease-in-out infinite', animationDelay: '-50s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
      </div>

      {/* ==================== BACKGROUND (FOCAL) BOKEH NACHOS ==================== */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 3, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '25%', left: '20%', width: '18px', height: '18px', opacity: 0.35, filter: 'blur(0.5px)', animation: 'backgroundDart1 25s linear infinite' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '55%', right: '25%', width: '15px', height: '15px', opacity: 0.30, filter: 'blur(0.5px)', animation: 'backgroundDart2 28s linear infinite', animationDelay: '-8s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', bottom: '35%', left: '35%', width: '20px', height: '20px', opacity: 0.28, filter: 'blur(0.5px)', animation: 'backgroundDart1 22s linear infinite', animationDelay: '-12s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '40%', right: '35%', width: '16px', height: '16px', opacity: 0.32, filter: 'blur(0.5px)', animation: 'backgroundDart2 30s linear infinite', animationDelay: '-18s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '15%', left: '45%', width: '14px', height: '14px', opacity: 0.25, filter: 'blur(0.5px)', animation: 'backgroundDart1 26s linear infinite', animationDelay: '-5s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', bottom: '20%', right: '40%', width: '17px', height: '17px', opacity: 0.27, filter: 'blur(0.5px)', animation: 'backgroundDart2 24s linear infinite', animationDelay: '-15s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
      </div>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
        
        html {
          scroll-behavior: smooth;
        }

        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        /* === DEPTH-OF-FIELD BOKEH ANIMATIONS === */
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

        @keyframes traceBorder {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* Gold Sparkborder Effect */
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
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); 
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
          z-index: 2; 
          pointer-events: none; 
        }

        .obsidian-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 32px;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
        }

        .obsidian-card:hover {
          border-color: rgba(168, 139, 70, 0.4);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(168, 139, 70, 0.1);
          transform: translateY(-4px);
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .card-hover {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(168, 139, 70, 0.15);
        }

        .input-obsidian {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          background: rgba(10, 10, 10, 0.8);
          color: #F0F0F0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          outline: none;
          font-size: 14px;
          font-weight: 500;
          box-sizing: border-box;
          transition: all 0.3s ease;
        }

        .input-obsidian:focus {
          border-color: #a88b46;
          box-shadow: 0 0 0 4px rgba(168, 139, 70, 0.15), 0 0 20px rgba(168, 139, 70, 0.1);
        }

        .input-obsidian::placeholder {
          color: rgba(240, 240, 240, 0.3);
        }

        .btn-primary {
          position: relative;
          overflow: hidden;
          background: #a88b46;
          color: #0A0A0A;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(168, 139, 70, 0.3);
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .btn-primary:hover::before {
          left: 100%;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(168, 139, 70, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: transparent;
          border: 1.5px solid #a88b46;
          color: #a88b46;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: rgba(168, 139, 70, 0.1);
          transform: translateY(-2px);
        }

        .spark-border {
          position: relative;
          border-radius: 32px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }

        .spark-border::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 80px;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #a88b46 50%, #a88b46 100%);
          box-shadow: 0 0 15px 2px rgba(168, 139, 70, 0.6);
          offset-path: rect(0 100% 100% 0 round 32px);
          animation: traceBorder 6s linear infinite;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }

        .input-label {
          color: rgba(240, 240, 240, 0.6);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .select-wrapper {
          position: relative;
        }

        .select-obsidian {
          width: 100%;
          padding: 14px 40px 14px 16px;
          border-radius: 12px;
          background: rgba(10, 10, 10, 0.8);
          color: #F0F0F0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          outline: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          appearance: none;
          transition: all 0.3s ease;
        }

        .select-obsidian:focus {
          border-color: #a88b46;
          box-shadow: 0 0 0 4px rgba(168, 139, 70, 0.15);
        }

        .select-arrow {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: rgba(240, 240, 240, 0.4);
        }

        /* Unit toggle styles */
        .unit-toggle {
          display: flex;
          background: rgba(10, 10, 10, 0.6);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 3px;
          flex-shrink: 0;
        }

        .toggle-option {
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.3s ease;
          color: rgba(240, 240, 240, 0.5);
          white-space: nowrap;
        }

        .toggle-option.active {
          background: rgba(168, 139, 70, 0.2);
          color: #a88b46;
        }

        /* Header Layout */
        .header-layout {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 24px;
        }

        .header-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        /* Parameter Panels */
        .params-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Responsive Grids */
        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .howto-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .bankroll-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stake-inputs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          align-items: end;
        }

        .stake-input-group {
          display: flex;
          flex-direction: column;
          min-width: 0;
          position: relative;
        }

        .stake-input-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          gap: 8px;
          min-height: 20px;
        }

        .stake-input-label {
          color: rgba(240, 240, 240, 0.6);
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .header-layout {
            flex-direction: row;
            text-align: left;
            justify-content: space-between;
          }
          .header-buttons {
            flex-direction: row;
            width: auto;
          }
          .params-container {
            flex-direction: row;
          }
          .stake-inputs-grid {
            grid-template-columns: 100px 1fr 1fr 1fr;
            gap: 20px;
          }
        }
      `}</style>

      <div style={{position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '24px'}}>
        <NachosPokerNavBar />
        
        {/* ==================== HERO CTA BAR WITH SPARKBORDER ==================== */}
        <div className="spark-border-gold" style={{ marginBottom: '40px', padding: '36px 40px' }}>
          <div className="header-layout" style={{ position: 'relative' }}>
            <div style={{ flex: 1 }}>
              <h2 style={{
                fontSize: 'clamp(28px, 4vw, 36px)', 
                fontWeight: 800, 
                color: '#FFFFFF', 
                marginBottom: '12px', 
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                fontFamily: 'Manrope, Inter, sans-serif'
              }}>
                Variance <span style={{ color: '#a88b46' }}>Calculator</span>
              </h2>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)', marginBottom: 0, lineHeight: 1.6 }}>
                Understand your variance with multi-stake weighting and Monte Carlo simulation. If you'd rather fix your win rate than just watch the swings, check out our coaching programs.
              </p>
            </div>
            
            <div className="header-buttons" style={{flexShrink: 0}}>
              <a 
                href="/"
                className="btn-primary"
                style={{
                  padding: '14px 24px',
                  fontSize: '14px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                Mentorship Program <ExternalLink size={16} />
              </a>
              <a 
                href="https://www.nachospoker.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{
                  padding: '14px 24px',
                  fontSize: '14px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                Join Our CFP <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Main Simulator Card */}
        <motion.div 
          className="obsidian-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            borderRadius: '32px', 
            padding: '36px', 
            marginBottom: '32px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '18px',
              background: 'rgba(168, 139, 70, 0.1)',
              border: '1px solid rgba(168, 139, 70, 0.25)',
              marginBottom: '16px'
            }}>
              <Calculator size={26} color="#a88b46" strokeWidth={1.5} />
            </div>
            <h1 style={{
              fontSize: '28px', 
              marginBottom: '8px', 
              color: '#F0F0F0',
              fontWeight: '800',
              letterSpacing: '-0.02em'
            }}>
              Cashgame Variance Simulator
            </h1>
            <p style={{
              color: 'rgba(240, 240, 240, 0.5)', 
              fontSize: '14px',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Understand your variance with multi-stake weighting
            </p>
          </div>
          
          <div className="params-container" style={{marginBottom: '24px'}}>
            {/* Basic Parameters Panel */}
            <motion.div 
              className="glass-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                padding: '24px', 
                borderRadius: '20px',
                flex: '0 0 320px',
                maxWidth: '320px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'rgba(168, 139, 70, 0.1)',
                  border: '1px solid rgba(168, 139, 70, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Target size={20} color="#a88b46" />
                </div>
                <h3 style={{color: '#a88b46', fontSize: '18px', fontWeight: '700', margin: 0}}>Basic Parameters</h3>
              </div>
              
              <div style={{
                background: 'rgba(168, 139, 70, 0.08)',
                border: '1px solid rgba(168, 139, 70, 0.2)',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '24px',
                fontSize: '13px',
                color: 'rgba(240, 240, 240, 0.6)',
                lineHeight: 1.6
              }}>
                <strong style={{color: '#a88b46'}}>Note:</strong> Max 100M trial hands (hands × samples). More trial hands = longer load time and more lag. Override per-stake settings in Advanced panel.
              </div>

              <div style={{marginBottom: '20px'}}>
                <label style={{
                  color: 'rgba(240, 240, 240, 0.7)', 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: '600'
                }}>
                  Win Rate (BB/100)
                </label>
                <input 
                  type="number" 
                  value={parameters.winrate} 
                  onChange={(e) => setParameters({...parameters, winrate: parseFloat(e.target.value) || 0})} 
                  className="input-obsidian"
                  step="0.5" 
                />
              </div>

              <div style={{marginBottom: '20px'}}>
                <label style={{
                  color: 'rgba(240, 240, 240, 0.7)', 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: '600'
                }}>
                  Standard Deviation (BB/100)
                </label>
                <input 
                  type="number" 
                  value={parameters.stdDev} 
                  onChange={(e) => setParameters({...parameters, stdDev: parseFloat(e.target.value) || 0})} 
                  className="input-obsidian"
                  style={parameters.stdDev <= 0 ? { borderColor: '#ef4444' } : {}}
                  step="5"
                  min="1"
                />
                {parameters.stdDev <= 0 && (
                  <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>
                    Standard deviation must be greater than 0
                  </div>
                )}
              </div>

              <div style={{marginBottom: '20px'}}>
                <label style={{
                  color: 'rgba(240, 240, 240, 0.7)', 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: '600'
                }}>
                  Total Hands (max {MAX_HANDS.toLocaleString()})
                </label>
                <input 
                  type="number" 
                  value={parameters.numHands} 
                  onChange={(e) => handleHandsChange(e.target.value)} 
                  className="input-obsidian"
                  step="1000" 
                />
              </div>
              <div>
                <label style={{
                  color: 'rgba(240, 240, 240, 0.7)', 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: '600'
                }}>
                  Number of Samples (max {MAX_SAMPLES})
                </label>
                <input 
                  type="number" 
                  value={parameters.numSamples} 
                  onChange={(e) => handleSamplesChange(e.target.value)} 
                  className="input-obsidian"
                  step="1" 
                />
              </div>
            </motion.div>

            {/* Advanced Stake Settings Panel */}
            <motion.div 
              className="glass-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                padding: '24px', 
                borderRadius: '20px',
                flex: 1
              }}
            >
              {/* Collapsible Header */}
              <button
                onClick={() => setAdvancedOpen(!advancedOpen)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  marginBottom: advancedOpen ? '20px' : '0'
                }}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(168, 139, 70, 0.1)',
                    border: '1px solid rgba(168, 139, 70, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Settings size={20} color="#a88b46" />
                  </div>
                  <h3 style={{color: '#a88b46', fontSize: '18px', fontWeight: '700', margin: 0}}>Advanced Stake Settings</h3>
                </div>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: advancedOpen ? 'rgba(168, 139, 70, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${advancedOpen ? 'rgba(168, 139, 70, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}>
                  {advancedOpen ? <ChevronUp size={20} color="#a88b46" /> : <ChevronDown size={20} color="#a88b46" />}
                </div>
              </button>
              
              {/* Collapsible Content */}
              <AnimatePresence>
                {advancedOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{marginBottom: '20px', color: 'rgba(240, 240, 240, 0.5)', fontSize: '14px', lineHeight: 1.6}}>
                      Configure individual stakes with custom win rates and standard deviations.
                    </div>
                    
                    <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                      {parameters.stakeWeights.map((sw, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          style={{
                            background: 'rgba(10, 10, 10, 0.5)',
                            borderRadius: '16px',
                            padding: '20px',
                            border: '1px solid rgba(255, 255, 255, 0.05)'
                          }}
                        >
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                            <span style={{color: 'rgba(240, 240, 240, 0.7)', fontSize: '13px', fontWeight: '700'}}>Stake #{index + 1}</span>
                            {parameters.stakeWeights.length > 1 && (
                              <button 
                                onClick={() => removeStake(index)}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.15)',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  color: '#ef4444',
                                  borderRadius: '8px',
                                  padding: '6px 12px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <X size={14} /> Remove
                              </button>
                            )}
                          </div>
                          
                          <div className="stake-inputs-grid">
                            {/* Stake Dropdown */}
                            <div className="stake-input-group">
                              <div className="stake-input-header">
                                <span className="stake-input-label">Stake</span>
                              </div>
                              <select
                                value={sw.stake}
                                onChange={(e) => updateStakeWeight(index, 'stake', e.target.value)}
                                className="input-obsidian"
                                style={{cursor: 'pointer', padding: '12px 14px'}}
                              >
                                {stakes.map(stake => (
                                  <option key={stake.value} value={stake.value} style={{background: '#0A0A0A'}}>
                                    {stake.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            {/* Volume */}
                            <div className="stake-input-group">
                              <div className="stake-input-header">
                                <span className="stake-input-label">Volume</span>
                                <div className="toggle-switch">
                                  <span 
                                    className={`toggle-option ${sw.volumeType === 'percentage' ? 'active' : ''}`}
                                    onClick={() => updateStakeWeight(index, 'volumeType', 'percentage')}
                                  >%</span>
                                  <span 
                                    className={`toggle-option ${sw.volumeType === 'hands' ? 'active' : ''}`}
                                    onClick={() => updateStakeWeight(index, 'volumeType', 'hands')}
                                  >Hands</span>
                                </div>
                              </div>
                              <input
                                type="number"
                                value={sw.weight}
                                onChange={(e) => updateStakeWeight(index, 'weight', parseInt(e.target.value) || 0)}
                                className="input-obsidian"
                                style={{ padding: '12px 14px' }}
                                min="0"
                              />
                            </div>
                            
                            {/* Custom Win Rate */}
                            <div className="stake-input-group">
                              <div className="stake-input-header">
                                <span className="stake-input-label">Win Rate</span>
                                <span style={{fontSize: '10px', color: 'rgba(240, 240, 240, 0.4)'}}>BB/100</span>
                              </div>
                              <input
                                type="number"
                                value={sw.customWinrate}
                                onChange={(e) => updateStakeWeight(index, 'customWinrate', parseFloat(e.target.value) || 0)}
                                className="input-obsidian"
                                style={{ padding: '12px 14px' }}
                                step="0.1"
                              />
                            </div>
                            
                            {/* Custom Std Dev */}
                            <div className="stake-input-group">
                              <div className="stake-input-header">
                                <span className="stake-input-label">Std Dev</span>
                                <span style={{fontSize: '10px', color: 'rgba(240, 240, 240, 0.4)'}}>BB/100</span>
                              </div>
                              <input
                                type="number"
                                value={sw.customStdDev}
                                onChange={(e) => updateStakeWeight(index, 'customStdDev', parseFloat(e.target.value) || 0)}
                                className="input-obsidian"
                                style={{ padding: '12px 14px' }}
                                step="1"
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <button 
                      onClick={addStake}
                      className="btn-secondary"
                      style={{
                        width: '100%',
                        marginTop: '20px',
                        padding: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        fontSize: '14px',
                        borderStyle: 'dashed'
                      }}
                    >
                      <Plus size={18} /> Add Another Stake
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Summary Stats */}
              <div style={{
                marginTop: advancedOpen ? '24px' : '20px',
                padding: '20px',
                background: 'rgba(10, 10, 10, 0.5)',
                borderRadius: '16px',
                border: '1px solid rgba(168, 139, 70, 0.15)'
              }}>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', textAlign: 'center'}}>
                  <div>
                    <div style={{fontSize: '11px', color: 'rgba(240, 240, 240, 0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600'}}>Avg BB</div>
                    <div style={{fontSize: '20px', fontWeight: '800', color: '#a88b46'}}>${getWeightedAverageBB().toFixed(2)}</div>
                  </div>
                  <div>
                    <div style={{fontSize: '11px', color: 'rgba(240, 240, 240, 0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600'}}>Avg WR</div>
                    <div style={{fontSize: '20px', fontWeight: '800', color: '#22c55e'}}>{getWeightedAverageWinrate().toFixed(1)}</div>
                  </div>
                  <div>
                    <div style={{fontSize: '11px', color: 'rgba(240, 240, 240, 0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600'}}>Avg SD</div>
                    <div style={{fontSize: '20px', fontWeight: '800', color: '#F0F0F0'}}>{getWeightedAverageStdDev().toFixed(0)}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.button 
            onClick={runSimulation} 
            disabled={isCalculating || isOverLimit || getWeightedAverageStdDev() <= 0}
            className="btn-primary"
            whileHover={{ scale: isCalculating || isOverLimit ? 1 : 1.02 }}
            whileTap={{ scale: isCalculating || isOverLimit ? 1 : 0.98 }}
            style={{
              width: '100%',
              padding: '18px',
              fontSize: '17px',
              background: isOverLimit ? 'rgba(239, 68, 68, 0.2)' : undefined,
              color: isOverLimit ? '#ef4444' : '#0A0A0A',
              boxShadow: isOverLimit ? 'none' : undefined,
              opacity: isCalculating ? 0.7 : 1
            }}
          >
            {isCalculating ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <Sparkles size={20} style={{ animation: 'pulse 1s ease-in-out infinite' }} />
                Calculating...
              </span>
            ) : isOverLimit ? (
              `Limit Exceeded (${samplehands.toLocaleString()} > 100M)`
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <Zap size={20} />
                Run Simulation
              </span>
            )}
          </motion.button>
        </motion.div>

        {/* ==================== MULTIPLAYER MODE SECTION ==================== */}
        <motion.div 
          className="obsidian-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{
            borderRadius: '28px', 
            padding: '32px', 
            marginBottom: '32px'
          }}
        >
          {/* Toggle Header */}
          <button
            onClick={() => setMultiplayerMode(!multiplayerMode)}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              marginBottom: multiplayerMode ? '24px' : '0'
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '14px'}}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: multiplayerMode ? 'rgba(168, 139, 70, 0.15)' : 'rgba(168, 139, 70, 0.1)',
                border: `1px solid ${multiplayerMode ? 'rgba(168, 139, 70, 0.4)' : 'rgba(168, 139, 70, 0.25)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}>
                <span style={{ fontSize: '22px' }}>👥</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h2 style={{fontSize: '20px', fontWeight: '800', color: '#F0F0F0', margin: 0, letterSpacing: '-0.02em'}}>
                  Multiplayer Mode
                </h2>
                <p style={{color: 'rgba(240, 240, 240, 0.5)', fontSize: '13px', margin: '2px 0 0 0'}}>
                  Compare how different win rates lead to wildly different outcomes
                </p>
              </div>
            </div>
            <div style={{
              width: '52px',
              height: '28px',
              borderRadius: '14px',
              background: multiplayerMode ? '#a88b46' : 'rgba(255, 255, 255, 0.1)',
              border: `1px solid ${multiplayerMode ? '#a88b46' : 'rgba(255, 255, 255, 0.2)'}`,
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: '#fff',
                transform: multiplayerMode ? 'translateX(24px)' : 'translateX(0)',
                transition: 'transform 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} />
            </div>
          </button>
          
          {/* Multiplayer Content */}
          <AnimatePresence>
            {multiplayerMode && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ overflow: 'hidden' }}
              >
                {/* Info Banner */}
                <div style={{
                  background: 'rgba(168, 139, 70, 0.08)',
                  border: '1px solid rgba(168, 139, 70, 0.2)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  fontSize: '13px',
                  color: 'rgba(240, 240, 240, 0.6)',
                  lineHeight: 1.6
                }}>
                  <strong style={{color: '#a88b46'}}>How it works:</strong> Each player uses the same stake mix and volume from above, but with their own win rate and standard deviation. 
                  Max {MAX_TOTAL_SAMPLES} total samples across all players. Currently using: <strong style={{color: '#F0F0F0'}}>{getTotalMultiplayerSamples()}/{MAX_TOTAL_SAMPLES}</strong>
                </div>
                
                {/* Players Grid */}
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px'}}>
                  {players.map((player, index) => (
                    <motion.div 
                      key={player.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      style={{
                        background: 'rgba(10, 10, 10, 0.5)',
                        borderRadius: '16px',
                        padding: '18px',
                        border: `2px solid ${player.color}30`,
                        position: 'relative'
                      }}
                    >
                      {/* Color indicator bar */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '18px',
                        right: '18px',
                        height: '3px',
                        background: player.color,
                        borderRadius: '0 0 3px 3px'
                      }} />
                      
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                          <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: player.color,
                            boxShadow: `0 0 8px ${player.color}80`
                          }} />
                          <input
                            type="text"
                            value={player.name}
                            onChange={(e) => updatePlayer(player.id, 'name', e.target.value)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#F0F0F0',
                              fontSize: '16px',
                              fontWeight: '700',
                              outline: 'none',
                              width: '140px'
                            }}
                          />
                        </div>
                        {players.length > 1 && (
                          <button 
                            onClick={() => removePlayer(player.id)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#ef4444',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            <X size={14} /> Remove
                          </button>
                        )}
                      </div>
                      
                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px'}}>
                        {/* Win Rate */}
                        <div>
                          <label style={{
                            color: 'rgba(240, 240, 240, 0.5)',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'block',
                            marginBottom: '8px'
                          }}>
                            Win Rate (BB/100)
                          </label>
                          <input
                            type="number"
                            value={player.winrate}
                            onChange={(e) => updatePlayer(player.id, 'winrate', parseFloat(e.target.value) || 0)}
                            className="input-obsidian"
                            style={{ padding: '12px 14px' }}
                            step="0.5"
                          />
                        </div>
                        
                        {/* Std Dev */}
                        <div>
                          <label style={{
                            color: 'rgba(240, 240, 240, 0.5)',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'block',
                            marginBottom: '8px'
                          }}>
                            Std Dev (BB/100)
                          </label>
                          <input
                            type="number"
                            value={player.stdDev}
                            onChange={(e) => updatePlayer(player.id, 'stdDev', parseFloat(e.target.value) || 0)}
                            className="input-obsidian"
                            style={{ 
                              padding: '12px 14px',
                              borderColor: player.stdDev <= 0 ? '#ef4444' : undefined
                            }}
                            step="5"
                            min="1"
                          />
                        </div>
                        
                        {/* Samples */}
                        <div>
                          <label style={{
                            color: 'rgba(240, 240, 240, 0.5)',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'block',
                            marginBottom: '8px'
                          }}>
                            Samples
                          </label>
                          <input
                            type="number"
                            value={player.numSamples}
                            onChange={(e) => updatePlayer(player.id, 'numSamples', parseInt(e.target.value) || 1)}
                            className="input-obsidian"
                            style={{ padding: '12px 14px' }}
                            min="1"
                            max={MAX_TOTAL_SAMPLES}
                          />
                        </div>
                      </div>
                      
                      {/* Player EV Preview */}
                      <div style={{
                        marginTop: '12px',
                        padding: '10px 14px',
                        background: `${player.color}10`,
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{color: 'rgba(240, 240, 240, 0.5)', fontSize: '12px'}}>
                          Theoretical EV ({parameters.numHands.toLocaleString()} hands):
                        </span>
                        <span style={{color: player.color, fontWeight: '700', fontSize: '14px'}}>
                          {displayInDollars 
                            ? `$${Math.round((player.winrate * parameters.numHands / 100) * getWeightedAverageBB()).toLocaleString()}`
                            : `${Math.round(player.winrate * parameters.numHands / 100).toLocaleString()} BB`
                          }
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Add Player Button */}
                {players.length < 8 && (
                  <button 
                    onClick={addPlayer}
                    className="btn-secondary"
                    style={{
                      width: '100%',
                      marginBottom: '16px',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      borderStyle: 'dashed'
                    }}
                  >
                    <Plus size={16} /> Add Another Player
                  </button>
                )}
                
                {/* Run Multiplayer Simulation Button */}
                <motion.button 
                  onClick={runMultiplayerSimulation} 
                  disabled={isCalculating || getTotalMultiplayerSamples() > MAX_TOTAL_SAMPLES || players.some(p => p.stdDev <= 0)}
                  className="btn-primary"
                  whileHover={{ scale: isCalculating ? 1 : 1.02 }}
                  whileTap={{ scale: isCalculating ? 1 : 0.98 }}
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '15px',
                    opacity: isCalculating ? 0.7 : 1
                  }}
                >
                  {isCalculating ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <Sparkles size={20} style={{ animation: 'pulse 1s ease-in-out infinite' }} />
                      Simulating {players.length} Players...
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <Zap size={20} />
                      Run Multiplayer Simulation
                    </span>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ==================== MULTIPLAYER RESULTS ==================== */}
        {multiplayerMode && multiplayerResults && (
          <motion.div 
            className="obsidian-card"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              borderRadius: '32px', 
              padding: '48px', 
              marginBottom: '40px'
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px'}}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  background: 'rgba(168, 139, 70, 0.1)',
                  border: '1px solid rgba(168, 139, 70, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <BarChart3 size={24} color="#a88b46" />
                </div>
                <h2 style={{fontSize: '24px', fontWeight: '800', color: '#F0F0F0', margin: 0}}>
                  Multiplayer Results
                </h2>
              </div>
              <div style={{display: 'flex', gap: '8px'}}>
                <button
                  onClick={() => setDisplayInDollars(true)}
                  style={{
                    background: displayInDollars ? 'rgba(168, 139, 70, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${displayInDollars ? 'rgba(168, 139, 70, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: displayInDollars ? '#a88b46' : 'rgba(240, 240, 240, 0.6)',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  $ Dollars
                </button>
                <button
                  onClick={() => setDisplayInDollars(false)}
                  style={{
                    background: !displayInDollars ? 'rgba(168, 139, 70, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${!displayInDollars ? 'rgba(168, 139, 70, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: !displayInDollars ? '#a88b46' : 'rgba(240, 240, 240, 0.6)',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  BB ({getStakeMixLabel()})
                </button>
              </div>
            </div>
            
            {/* Player Stats Grid */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px'}}>
              {multiplayerResults.players.map((player, index) => (
                <motion.div 
                  key={player.id}
                  className="glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    border: `2px solid ${player.color}40`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: hoveredPlayer === player.id ? 'scale(1.02)' : 'scale(1)'
                  }}
                  onMouseEnter={() => setHoveredPlayer(player.id)}
                  onMouseLeave={() => setHoveredPlayer(null)}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px'}}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: player.color,
                      boxShadow: `0 0 8px ${player.color}80`
                    }} />
                    <span style={{color: '#F0F0F0', fontWeight: '700', fontSize: '15px'}}>{player.name}</span>
                    <span style={{color: 'rgba(240, 240, 240, 0.4)', fontSize: '12px'}}>({player.winrate} BB/100)</span>
                  </div>
                  
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                    <div>
                      <div style={{color: 'rgba(240, 240, 240, 0.4)', fontSize: '11px', marginBottom: '4px'}}>BEST</div>
                      <div style={{color: '#22c55e', fontWeight: '700', fontSize: '14px'}}>
                        {formatNumber(player.bestRun, displayInDollars)}
                      </div>
                    </div>
                    <div>
                      <div style={{color: 'rgba(240, 240, 240, 0.4)', fontSize: '11px', marginBottom: '4px'}}>WORST</div>
                      <div style={{color: '#ef4444', fontWeight: '700', fontSize: '14px'}}>
                        {formatNumber(player.worstRun, displayInDollars)}
                      </div>
                    </div>
                    <div style={{gridColumn: '1 / -1'}}>
                      <div style={{color: 'rgba(240, 240, 240, 0.4)', fontSize: '11px', marginBottom: '4px'}}>AVERAGE</div>
                      <div style={{color: player.color, fontWeight: '700', fontSize: '16px'}}>
                        {formatNumber(player.avgEV, displayInDollars)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Multiplayer Chart */}
            <div style={{background: 'rgba(10, 10, 10, 0.5)', borderRadius: '20px', padding: '28px'}}>
              <div style={{height: '450px'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={prepareMultiplayerChartData()} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="x" 
                      stroke="rgba(255,255,255,0.3)" 
                      tick={{fill: 'rgba(240, 240, 240, 0.5)', fontSize: 11}}
                      tickFormatter={(val) => `${(val/1000)}k`}
                      label={{value: 'Hands', position: 'insideBottomRight', offset: -10, fill: 'rgba(240, 240, 240, 0.4)', fontSize: 11}}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.3)" 
                      tick={{fill: 'rgba(240, 240, 240, 0.5)', fontSize: 11}}
                      tickFormatter={(val) => displayInDollars ? `$${(val/1000).toFixed(0)}k` : `${Math.round(val / getWeightedAverageBB()).toLocaleString()}`}
                      label={{value: displayInDollars ? 'Profit ($)' : 'Profit (BB)', angle: -90, position: 'insideLeft', fill: 'rgba(240, 240, 240, 0.4)', fontSize: 11}}
                    />
                    <Tooltip 
                      contentStyle={{
                        background: 'rgba(10, 10, 10, 0.95)',
                        border: '1px solid rgba(168, 139, 70, 0.4)',
                        borderRadius: '16px',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.5)'
                      }}
                      labelFormatter={(value) => `Hand ${value.toLocaleString()}`}
                      formatter={(value, name) => {
                        if (name.startsWith('ev_player_')) {
                          const playerId = parseInt(name.split('_')[2]);
                          const player = players.find(p => p.id === playerId);
                          return [formatNumber(value, displayInDollars), `${player?.name} EV`];
                        }
                        if (name.startsWith('sample_')) {
                          const parts = name.split('_');
                          const playerId = parseInt(parts[3]);
                          const player = players.find(p => p.id === playerId);
                          return [formatNumber(value, displayInDollars), player?.name];
                        }
                        return [formatNumber(value, displayInDollars), name];
                      }}
                    />
                    
                    {/* EV lines for each player (dashed) */}
                    {players.map(player => (
                      <Line 
                        key={`ev_${player.id}`}
                        type="monotone" 
                        dataKey={`ev_player_${player.id}`}
                        stroke={player.color}
                        strokeWidth={2}
                        strokeDasharray="8 4"
                        dot={false}
                        opacity={0.5}
                      />
                    ))}
                    
                    {/* Sample lines for each player */}
                    {multiplayerResults.allSamples.map((sample, index) => {
                      const player = players.find(p => p.id === sample.playerId);
                      const isHovered = hoveredPlayer === sample.playerId;
                      return (
                        <Line 
                          key={`sample_${index}`}
                          type="monotone" 
                          dataKey={`sample_${index}_player_${sample.playerId}`}
                          stroke={player?.color || '#888'}
                          strokeWidth={isHovered ? 3 : 1.5}
                          dot={false}
                          opacity={isHovered ? 1 : (hoveredPlayer ? 0.2 : 0.7)}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div style={{marginTop: '24px', padding: '18px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px'}}>
                <div style={{display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', alignItems: 'center'}}>
                  {players.map(player => (
                    <div 
                      key={player.id}
                      style={{
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        cursor: 'pointer',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: hoveredPlayer === player.id ? `${player.color}20` : 'transparent',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={() => setHoveredPlayer(player.id)}
                      onMouseLeave={() => setHoveredPlayer(null)}
                    >
                      <div style={{width: '20px', height: '3px', background: player.color, borderRadius: '2px'}}></div>
                      <span style={{color: 'rgba(240, 240, 240, 0.7)', fontSize: '13px', fontWeight: '600'}}>
                        {player.name} ({player.winrate} BB/100)
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{textAlign: 'center', marginTop: '12px', color: 'rgba(240, 240, 240, 0.4)', fontSize: '12px'}}>
                  Dashed lines = Theoretical EV • Solid lines = Simulated runs • Hover legend to highlight player
                </div>
              </div>
            </div>
            
            {/* Key Insight */}
            <div style={{
              marginTop: '28px',
              padding: '20px 24px',
              background: 'rgba(168, 139, 70, 0.08)',
              border: '1px solid rgba(168, 139, 70, 0.2)',
              borderRadius: '16px'
            }}>
              <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
                <span style={{fontSize: '24px'}}>💡</span>
                <div>
                  <div style={{color: '#a88b46', fontWeight: '700', fontSize: '15px', marginBottom: '6px'}}>
                    Key Insight
                  </div>
                  <p style={{color: 'rgba(240, 240, 240, 0.6)', fontSize: '14px', margin: 0, lineHeight: 1.7}}>
                    Notice how players with different win rates can have overlapping results in the short term. 
                    A {Math.max(...players.map(p => p.winrate))} BB/100 winner can run below a {Math.min(...players.map(p => p.winrate))} BB/100 player for thousands of hands. 
                    This is why sample size matters — variance masks true skill in the short run.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Nacho Bankroll Analysis Section */}
        <motion.div 
          className="obsidian-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            borderRadius: '32px', 
            padding: '48px', 
            marginBottom: '40px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{fontSize: '48px', display: 'block', marginBottom: '12px'}}>🌮</span>
            <h2 style={{fontSize: '28px', fontWeight: '800', color: '#F0F0F0', margin: 0, letterSpacing: '-0.02em'}}>
              Nacho Bankroll Analysis
            </h2>
            <p style={{color: 'rgba(240, 240, 240, 0.5)', fontSize: '15px', marginTop: '12px'}}>
              Minimum bankroll requirements based on Risk of Ruin • Primary stake: <span style={{color: '#a88b46', fontWeight: '600'}}>{getPrimaryStake().label}</span>
            </p>
          </div>
          
          <div className="bankroll-grid">
            {bankrollProfiles.map((profile, index) => {
              const requirement = calculateBankrollRequirement(profile.ror);
              const isRecommended = profile.ror === 0.05;
              return (
                <motion.div 
                  key={index}
                  className="glass-card card-hover"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  style={{
                    padding: '28px',
                    borderRadius: '24px',
                    textAlign: 'center',
                    border: isRecommended ? '2px solid rgba(168, 139, 70, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    overflow: 'visible'
                  }}
                >
                  {isRecommended && (
                    <div style={{
                      position: 'absolute',
                      top: '-14px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #a88b46 0%, #a88b46 100%)',
                      color: '#0A0A0A',
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      boxShadow: '0 4px 12px rgba(168, 139, 70, 0.4)'
                    }}>
                      Recommended
                    </div>
                  )}
                  <div style={{fontSize: '48px', marginBottom: '12px', marginTop: isRecommended ? '8px' : 0}}>{profile.emoji}</div>
                  <div style={{fontSize: '17px', fontWeight: '700', color: '#F0F0F0', marginBottom: '6px'}}>
                    {profile.name}
                  </div>
                  <div style={{fontSize: '13px', color: 'rgba(240, 240, 240, 0.4)', marginBottom: '16px'}}>
                    {profile.description} • {(profile.ror * 100).toFixed(1)}% RoR
                  </div>
                  <div style={{
                    background: 'rgba(10, 10, 10, 0.6)',
                    borderRadius: '16px',
                    padding: '16px'
                  }}>
                    <div style={{fontSize: '26px', fontWeight: '800', color: '#a88b46', marginBottom: '6px'}}>
                      {requirement.dollars === Infinity ? '∞' : `$${requirement.dollars.toLocaleString()}`}
                    </div>
                    <div style={{fontSize: '13px', color: 'rgba(240, 240, 240, 0.5)'}}>
                      {requirement.bb === Infinity ? '∞' : `${requirement.bb.toLocaleString()} BB`}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <div style={{
            marginTop: '28px',
            padding: '20px',
            background: 'rgba(10, 10, 10, 0.5)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            textAlign: 'center'
          }}>
            <p style={{color: 'rgba(240, 240, 240, 0.5)', fontSize: '13px', margin: 0, lineHeight: 1.7}}>
              <strong style={{color: '#a88b46'}}>Formula:</strong> B = (σ² / 2WR) × ln(1/RoR) where σ = std dev per hand, WR = win rate per hand
            </p>
          </div>
        </motion.div>

        {/* Results Section */}
        {results && (
          <motion.div 
            className="obsidian-card"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              borderRadius: '32px', 
              padding: '48px', 
              marginBottom: '40px'
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px'}}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  background: 'rgba(168, 139, 70, 0.1)',
                  border: '1px solid rgba(168, 139, 70, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <BarChart3 size={24} color="#a88b46" />
                </div>
                <h2 style={{fontSize: '24px', fontWeight: '800', color: '#F0F0F0', margin: 0}}>
                  Simulation Results
                </h2>
              </div>
              <div style={{display: 'flex', gap: '8px'}}>
                <button
                  onClick={() => setDisplayInDollars(true)}
                  style={{
                    background: displayInDollars ? 'rgba(168, 139, 70, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${displayInDollars ? 'rgba(168, 139, 70, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: displayInDollars ? '#a88b46' : 'rgba(240, 240, 240, 0.6)',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                >
                  $ Dollars
                </button>
                <button
                  onClick={() => setDisplayInDollars(false)}
                  style={{
                    background: !displayInDollars ? 'rgba(168, 139, 70, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${!displayInDollars ? 'rgba(168, 139, 70, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: !displayInDollars ? '#a88b46' : 'rgba(240, 240, 240, 0.6)',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                >
                  BB ({getStakeMixLabel()})
                </button>
              </div>
            </div>
            
            <div className="results-grid" style={{marginBottom: '32px'}}>
              <motion.div 
                className="glass-card" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{padding: '24px', borderRadius: '20px', textAlign: 'center'}}
              >
                <div style={{fontSize: '12px', color: 'rgba(240, 240, 240, 0.4)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600'}}>Theoretical EV</div>
                <div style={{fontSize: '28px', fontWeight: '800', color: '#F0F0F0'}}>
                  {formatNumber((getWeightedAverageWinrate() * parameters.numHands / 100) * getWeightedAverageBB(), displayInDollars)}
                </div>
                <div style={{fontSize: '12px', color: 'rgba(240, 240, 240, 0.3)', marginTop: '6px'}}>
                  {displayInDollars ? `${Math.round((getWeightedAverageWinrate() * parameters.numHands / 100)).toLocaleString()} BB` : `$${Math.round((getWeightedAverageWinrate() * parameters.numHands / 100) * getWeightedAverageBB()).toLocaleString()}`}
                </div>
              </motion.div>
              <motion.div 
                className="glass-card" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{padding: '24px', borderRadius: '20px', textAlign: 'center'}}
              >
                <div style={{fontSize: '12px', color: 'rgba(240, 240, 240, 0.4)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600'}}>Best Run</div>
                <div style={{fontSize: '28px', fontWeight: '800', color: '#22c55e'}}>
                  {formatNumber(results.bestRun, displayInDollars)}
                </div>
                <div style={{fontSize: '12px', color: 'rgba(240, 240, 240, 0.3)', marginTop: '6px'}}>
                  {displayInDollars ? `${Math.round(results.bestRun / getWeightedAverageBB()).toLocaleString()} BB` : `$${Math.round(results.bestRun).toLocaleString()}`}
                </div>
              </motion.div>
              <motion.div 
                className="glass-card" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{padding: '24px', borderRadius: '20px', textAlign: 'center'}}
              >
                <div style={{fontSize: '12px', color: 'rgba(240, 240, 240, 0.4)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600'}}>Worst Run</div>
                <div style={{fontSize: '28px', fontWeight: '800', color: '#ef4444'}}>
                  {formatNumber(results.worstRun, displayInDollars)}
                </div>
                <div style={{fontSize: '12px', color: 'rgba(240, 240, 240, 0.3)', marginTop: '6px'}}>
                  {displayInDollars ? `${Math.round(results.worstRun / getWeightedAverageBB()).toLocaleString()} BB` : `$${Math.round(results.worstRun).toLocaleString()}`}
                </div>
              </motion.div>
              <motion.div 
                className="glass-card" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                style={{padding: '24px', borderRadius: '20px', textAlign: 'center'}}
              >
                <div style={{fontSize: '12px', color: 'rgba(240, 240, 240, 0.4)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600'}}>95% CI Range</div>
                <div style={{fontSize: '22px', fontWeight: '800', color: '#22c55e'}}>
                  {formatNumber(results.conf95Lower, displayInDollars)} to {formatNumber(results.conf95Upper, displayInDollars)}
                </div>
                <div style={{fontSize: '12px', color: 'rgba(240, 240, 240, 0.3)', marginTop: '6px'}}>
                  Most outcomes fall here
                </div>
              </motion.div>
            </div>
            
            {/* Chart */}
            <div style={{background: 'rgba(10, 10, 10, 0.5)', borderRadius: '20px', padding: '28px'}}>
              <div style={{height: '400px'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={prepareChartData()} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    onMouseMove={(e) => {
                      if (e && e.activePayload) {
                        const payload = e.activePayload;
                        for (let i = 0; i < results.samples.length; i++) {
                          if (payload.find(p => p.dataKey === `sample${i}`)) {
                            setHoveredSample(i);
                            return;
                          }
                        }
                      }
                    }}
                    onMouseLeave={() => setHoveredSample(null)}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="x" 
                      stroke="rgba(255,255,255,0.3)" 
                      tick={{fill: 'rgba(240, 240, 240, 0.5)', fontSize: 11}}
                      tickFormatter={(val) => `${(val/1000)}k`}
                      label={{value: 'Hands', position: 'insideBottomRight', offset: -10, fill: 'rgba(240, 240, 240, 0.4)', fontSize: 11}}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.3)" 
                      tick={{fill: 'rgba(240, 240, 240, 0.5)', fontSize: 11}}
                      tickFormatter={(val) => displayInDollars ? `$${(val/1000).toFixed(0)}k` : `${Math.round(val / getWeightedAverageBB()).toLocaleString()}`}
                      label={{value: displayInDollars ? 'Profit ($)' : 'Profit (BB)', angle: -90, position: 'insideLeft', fill: 'rgba(240, 240, 240, 0.4)', fontSize: 11}}
                    />
                    <Tooltip 
                      contentStyle={{
                        background: 'rgba(10, 10, 10, 0.95)',
                        border: '1px solid rgba(168, 139, 70, 0.4)',
                        borderRadius: '16px',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(20px)'
                      }}
                      labelStyle={{color: '#a88b46', fontWeight: '700', marginBottom: '10px'}}
                      labelFormatter={(value) => `Hand ${value.toLocaleString()}`}
                      formatter={(value, name) => {
                        if (name === 'theoreticalEV') return [formatNumber(value, displayInDollars), 'Theoretical'];
                        if (name === 'conf95Upper') return [formatNumber(value, displayInDollars), '95% Upper'];
                        if (name === 'conf95Lower') return [formatNumber(value, displayInDollars), '95% Lower'];
                        return [formatNumber(value, displayInDollars), `Sample ${name.replace('sample', '')}`];
                      }}
                      content={({ active, payload, label }) => {
                        if (!active || !payload || payload.length === 0) return null;
                        const theoreticalEV = payload.find(p => p.dataKey === 'theoreticalEV');
                        const upper = payload.find(p => p.dataKey === 'conf95Upper');
                        const lower = payload.find(p => p.dataKey === 'conf95Lower');
                        const samplePayloads = payload.filter(p => p.dataKey.startsWith('sample'));
                        const hoveredSamplePayload = hoveredSample !== null ? samplePayloads.find(p => p.dataKey === `sample${hoveredSample}`) : null;
                        
                        return (
                          <div style={{
                            background: 'rgba(10, 10, 10, 0.95)',
                            border: '1px solid rgba(168, 139, 70, 0.4)',
                            borderRadius: '16px',
                            padding: '18px 22px',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.5)'
                          }}>
                            <div style={{color: '#a88b46', fontWeight: '700', marginBottom: '12px', fontSize: '14px'}}>
                              Hand {label.toLocaleString()}
                            </div>
                            {[
                              theoreticalEV && { name: 'Theoretical EV', value: theoreticalEV.value, color: 'rgba(240, 240, 240, 0.6)' },
                              upper && { name: '95% Upper', value: upper.value, color: '#22c55e' },
                              lower && { name: '95% Lower', value: lower.value, color: '#22c55e' },
                              hoveredSamplePayload && { name: `Sample ${hoveredSample}`, value: hoveredSamplePayload.value, color: '#a88b46' }
                            ].filter(Boolean).map((item, i) => (
                              <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', marginBottom: '6px'}}>
                                <span style={{color: item.color, fontSize: '13px'}}>{item.name}</span>
                                <span style={{color: '#F0F0F0', fontWeight: '700', fontSize: '13px'}}>
                                  {formatNumber(item.value, displayInDollars)}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      }}
                    />
                    {results.samples.map((sample, index) => {
                      const isHovered = hoveredSample === index;
                      const isBest = sample.finalEV === results.bestRun;
                      const isWorst = sample.finalEV === results.worstRun;
                      
                      let strokeColor = "rgba(255, 255, 255, 0.1)";
                      let strokeWidth = 1;
                      
                      if (isHovered) {
                        strokeColor = "#a88b46";
                        strokeWidth = 4;
                      } else if (isBest) {
                        strokeColor = "#22c55e";
                        strokeWidth = 2;
                      } else if (isWorst) {
                        strokeColor = "#ef4444";
                        strokeWidth = 2;
                      }
                      
                      return (
                        <Line 
                          key={index} 
                          type="monotone" 
                          dataKey={`sample${index}`} 
                          stroke={strokeColor} 
                          strokeWidth={strokeWidth} 
                          dot={false} 
                          legendType="none"
                          onMouseEnter={() => setHoveredSample(index)}
                          activeDot={false}
                        />
                      );
                    })}
                    <Line type="monotone" dataKey="theoreticalEV" stroke="rgba(240, 240, 240, 0.4)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Theoretical" />
                    <Line type="monotone" dataKey="conf95Upper" stroke="#22c55e" strokeWidth={2} dot={false} name="95% Upper" />
                    <Line type="monotone" dataKey="conf95Lower" stroke="#22c55e" strokeWidth={2} dot={false} name="95% Lower" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{textAlign: 'center', marginTop: '18px', color: 'rgba(240, 240, 240, 0.4)', fontSize: '14px'}}>
                Hover over any sample line to highlight it • Per-stake variance properly applied
              </div>
              
              {/* Legend */}
              <div style={{marginTop: '24px', padding: '18px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px'}}>
                <div style={{display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', alignItems: 'center'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <div style={{width: '28px', height: '2px', background: 'rgba(240, 240, 240, 0.4)', borderTop: '2px dashed rgba(240, 240, 240, 0.4)'}}></div>
                    <span style={{color: 'rgba(240, 240, 240, 0.6)', fontSize: '13px'}}>Theoretical EV</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <div style={{width: '28px', height: '2px', background: '#22c55e', borderRadius: '2px'}}></div>
                    <span style={{color: 'rgba(240, 240, 240, 0.6)', fontSize: '13px'}}>95% Confidence</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <div style={{width: '28px', height: '2px', background: 'rgba(255,255,255,0.12)', borderRadius: '2px'}}></div>
                    <span style={{color: 'rgba(240, 240, 240, 0.6)', fontSize: '13px'}}>All Samples ({results.samples.length})</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <div style={{width: '28px', height: '3px', background: '#a88b46', borderRadius: '2px'}}></div>
                    <span style={{color: 'rgba(240, 240, 240, 0.6)', fontSize: '13px'}}>Hovered Sample</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* How to Use Section */}
        <motion.div 
          className="obsidian-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            borderRadius: '32px', 
            padding: '48px'
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '36px'}}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '18px',
              background: 'rgba(168, 139, 70, 0.1)',
              border: '1px solid rgba(168, 139, 70, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Brain size={28} color="#a88b46" strokeWidth={1.5} />
            </div>
            <h2 style={{fontSize: '26px', fontWeight: '800', color: '#F0F0F0', margin: 0}}>
              How to Use & Read Results
            </h2>
          </div>

          <div className="howto-grid">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                background: 'rgba(168, 139, 70, 0.08)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                padding: '28px',
                borderRadius: '24px',
                border: '1px solid rgba(168, 139, 70, 0.2)'
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px'}}>
                <Target size={22} color="#a88b46" />
                <h3 style={{color: '#a88b46', fontSize: '16px', fontWeight: '700', margin: 0}}>Input Parameters</h3>
              </div>
              <ul style={{color: 'rgba(240, 240, 240, 0.7)', fontSize: '14px', lineHeight: 2, margin: 0, paddingLeft: '20px'}}>
                <li><strong style={{color: '#F0F0F0'}}>Win Rate:</strong> Your expected BB/100</li>
                <li><strong style={{color: '#F0F0F0'}}>Std Dev:</strong> Variance (typically 70-120)</li>
                <li><strong style={{color: '#F0F0F0'}}>Hands:</strong> Total hands to simulate</li>
                <li><strong style={{color: '#F0F0F0'}}>Samples:</strong> Number of runs</li>
                <li><strong style={{color: '#F0F0F0'}}>Advanced:</strong> Per-stake custom settings</li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              style={{
                background: 'rgba(34, 197, 94, 0.08)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                padding: '28px',
                borderRadius: '24px',
                border: '1px solid rgba(34, 197, 94, 0.2)'
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px'}}>
                <TrendingUp size={22} color="#22c55e" />
                <h3 style={{color: '#22c55e', fontSize: '16px', fontWeight: '700', margin: 0}}>Reading the Chart</h3>
              </div>
              <ul style={{color: 'rgba(240, 240, 240, 0.7)', fontSize: '14px', lineHeight: 2, margin: 0, paddingLeft: '20px'}}>
                <li><strong style={{color: '#F0F0F0'}}>Gray dashed:</strong> Theoretical EV line</li>
                <li><strong style={{color: '#F0F0F0'}}>Green lines:</strong> 95% confidence bounds</li>
                <li><strong style={{color: '#F0F0F0'}}>Faint lines:</strong> Individual sample runs</li>
                <li><strong style={{color: '#F0F0F0'}}>Best/Worst:</strong> Green/red highlights</li>
                <li><strong style={{color: '#F0F0F0'}}>Hover:</strong> Highlight any line</li>
              </ul>
            </motion.div>

            <motion.div 
              className="glass-card" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                padding: '28px',
                borderRadius: '24px'
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px'}}>
                <BarChart3 size={22} color="rgba(240, 240, 240, 0.8)" />
                <h3 style={{color: 'rgba(240, 240, 240, 0.9)', fontSize: '16px', fontWeight: '700', margin: 0}}>Key Insights</h3>
              </div>
              <ul style={{color: 'rgba(240, 240, 240, 0.7)', fontSize: '14px', lineHeight: 2, margin: 0, paddingLeft: '20px'}}>
                <li><strong style={{color: '#F0F0F0'}}>Wide spread:</strong> High variance expected</li>
                <li><strong style={{color: '#F0F0F0'}}>Tight spread:</strong> More consistent results</li>
                <li><strong style={{color: '#F0F0F0'}}>Below EV:</strong> Normal short-term</li>
                <li><strong style={{color: '#F0F0F0'}}>95% CI:</strong> Most runs fall within</li>
                <li><strong style={{color: '#F0F0F0'}}>Long-term:</strong> Converges to true EV</li>
              </ul>
            </motion.div>
          </div>

          <div style={{
            marginTop: '32px',
            padding: '24px',
            background: 'rgba(10, 10, 10, 0.5)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            textAlign: 'center'
          }}>
            <p style={{color: 'rgba(240, 240, 240, 0.5)', fontSize: '14px', margin: 0, lineHeight: 1.8}}>
              <strong style={{color: '#a88b46'}}>Pro Tip:</strong> Run multiple simulations with different sample sizes to truly understand your variance. 
              Even winning players can experience significant downswings , this tool helps you prepare mentally and financially.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PokerEVSimulation;

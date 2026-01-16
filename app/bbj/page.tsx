'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  ExternalLink, 
  TrendingUp, 
  BarChart3, 
  Target, 
  Zap, 
  AlertTriangle, 
  DollarSign, 
  Activity, 
  Play, 
  RefreshCw, 
  Database, 
  LineChart,
  ChevronDown,
  Trophy,
  Users,
  Clock,
  Percent,
  Calculator
} from 'lucide-react';
import NachosPokerNavBar from '@/components/NachosPokerNavBar';

/**
 * BBJ Dashboard & Variance Calculator
 * 
 * Part of the FreeNachos App Suite
 * Analyzes Bad Beat Jackpot odds, EV, and variance based on 8M+ hand sample
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

interface BBJConstants {
  handsPerBBJ: number;
  showdownsPerBBJ: number;
  avgPlayersPerTable: number;
  showdownRate: number;
  bbPer100Fees: number;
  feesPerBBJ_bb: number;
  poolDivisor: number;
  breakevenPayout_bb: number;
  breakevenPool_usd: number;
  evDivisor: number;
  winnerSharePercent: number;
  loserSharePercent: number;
  tableSharePercent: number;
}

interface EVResult {
  payoutBB: number;
  returnRatio: number;
  netBBper100: number;
  isProfitable: boolean;
  percentToBreakeven: number;
  poolNeeded: number;
  jackpotWinnerPayout: number;
  opponentPayout: number;
  tableSharePayout: number;
  totalPayoutAtStake: number;
  stakePoolSize: number;
}

interface StakeOption {
  label: string;
  value: string;
  bbValue: number;
  poolPercent: number;
}

interface VarianceResult {
  expectedBBJs: number;
  expectedProfit: number;
  stdDeviation: number;
  confidenceInterval95: [number, number];
  confidenceInterval99: [number, number];
  probabilityOfProfit: number;
  totalFeesPaid: number;
  expectedPayouts: number;
  worstCase1Percent: number;
  bestCase1Percent: number;
}

interface SimulationTrial {
  trialNumber: number;
  bbjsHit: number;
  jackpotWins: number;
  opponentWins: number;
  tableShares: number;
  totalPayout: number;
  feesPaid: number;
  netProfit: number;
  timeline: { hands: number; profit: number; }[];
}

interface SimulationResults {
  trials: SimulationTrial[];
  averageProfit: number;
  medianProfit: number;
  stdDev: number;
  minProfit: number;
  maxProfit: number;
  profitableTrials: number;
  totalTrials: number;
  handsPerTrial: number;
  bottom20BBper100: number;
  top20BBper100: number;
}

// ============================================
// CONSTANTS - 42.1M Hand Verified Sample (GG Poker NL100+)
// ============================================

const BBJ_CONSTANTS: BBJConstants = {
  handsPerBBJ: 67498,
  showdownsPerBBJ: 8962,
  avgPlayersPerTable: 5.96,
  showdownRate: 0.1328,
  bbPer100Fees: 2.0831,
  feesPerBBJ_bb: 8378,
  poolDivisor: 240.38,
  breakevenPayout_bb: 1406,
  breakevenPool_usd: 2017000,
  evDivisor: 240.38,
  winnerSharePercent: 10,
  loserSharePercent: 3,
  tableSharePercent: 0.8,
};

const STAKE_POOL_PERCENTAGES: Record<string, number> = {
  '10/20': 51.42,
  '5/10': 25.71,
  '2/5': 12.86,
  '1/2': 5.14,
  '0.50/1': 2.57,
  '0.25/0.50': 1.29,
  '0.10/0.25': 0.64,
  '0.05/0.10': 0.26,
  '0.02/0.05': 0.13,
  '0.01/0.02': 0.05,
};

const STAKE_OPTIONS: StakeOption[] = [
  { label: '$10/$20', value: '10/20', bbValue: 20, poolPercent: 51.42 },
  { label: '$5/$10', value: '5/10', bbValue: 10, poolPercent: 25.71 },
  { label: '$2/$5', value: '2/5', bbValue: 5, poolPercent: 12.86 },
  { label: '$1/$2', value: '1/2', bbValue: 2, poolPercent: 5.14 },
  { label: '$0.50/$1', value: '0.50/1', bbValue: 1, poolPercent: 2.57 },
  { label: '$0.25/$0.50', value: '0.25/0.50', bbValue: 0.50, poolPercent: 1.29 },
  { label: '$0.10/$0.25', value: '0.10/0.25', bbValue: 0.25, poolPercent: 0.64 },
  { label: '$0.05/$0.10', value: '0.05/0.10', bbValue: 0.10, poolPercent: 0.26 },
  { label: '$0.02/$0.05', value: '0.02/0.05', bbValue: 0.05, poolPercent: 0.13 },
  { label: '$0.01/$0.02', value: '0.01/0.02', bbValue: 0.02, poolPercent: 0.05 },
];

const PROBABILITY_DATA = {
  bbjPerHand: 1 / 67498,
  bbjPerShowdown: 1 / 8962,
  showdownRate: 0.1328,
  avgPlayers: 5.96,
  totalHandsAnalyzed: 42118396,
  regularHands: 8186000,
  rushCashHands: 33932396,
  totalShowdowns: 5592311,
  totalBBJsFound: 624,
  duplicatesSkipped: 86311,
  totalFeesUSD: 9037553.51,
  totalFeesBB: 5226344.44,
  handsToSeeOneBBJ: 67498,
  handsToWinJackpot: Math.round(67498 * 5.96 / 2 * 2),
  handsToBeOpponent: Math.round(67498 * 5.96 / 2 * 2),
  handsToGetTableShare: Math.round(67498 * 5.96 / (5.96 - 2)),
  triggerHand: 'AAATT or better',
  returnAt8000bb: 0.9552,
  returnAt8500bb: 1.0149,
  returnAt9000bb: 1.0746,
  returnAt9500bb: 1.1343,
  returnAt10000bb: 1.1940,
};

// ============================================
// ANIMATION VARIANTS
// ============================================

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

// ============================================
// COMPONENT
// ============================================

const BBJDashboard: React.FC = () => {
  // ============================================
  // STATE
  // ============================================
  
  const [poolSize, setPoolSize] = useState<number>(2017000);
  const [selectedStake, setSelectedStake] = useState<string>('0.50/1');
  const [simulationHands, setSimulationHands] = useState<number>(1000000);
  const [numTrials, setNumTrials] = useState<number>(100);
  const [displayInDollars, setDisplayInDollars] = useState<boolean>(true);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [varianceResult, setVarianceResult] = useState<VarianceResult | null>(null);
  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);
  const [nachos, setNachos] = useState<any[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const nachoRef = useRef<SVGSVGElement>(null);

  // ============================================
  // CALCULATION FUNCTIONS (UNCHANGED)
  // ============================================

  const calculateEV = (pool: number, stake: string = selectedStake): EVResult => {
    const stakeOption = STAKE_OPTIONS.find(s => s.value === stake) || STAKE_OPTIONS[4];
    const stakePoolSize = pool * (stakeOption.poolPercent / 100);
    const avgTablePlayers = BBJ_CONSTANTS.avgPlayersPerTable;
    const otherPlayers = avgTablePlayers - 2;
    
    const jackpotWinnerPayout = stakePoolSize * 0.10;
    const opponentPayout = stakePoolSize * 0.03;
    const tableSharePayout = stakePoolSize * 0.008;
    const totalPayoutAtStake = jackpotWinnerPayout + opponentPayout + (tableSharePayout * otherPlayers);
    
    const bbValue = stakeOption.bbValue;
    const jackpotWinnerBB = jackpotWinnerPayout / bbValue;
    const opponentBB = opponentPayout / bbValue;
    const tableShareBB = tableSharePayout / bbValue;
    
    const expectedPayoutPerBBJ = 
      (1 / avgTablePlayers) * jackpotWinnerBB +
      (1 / avgTablePlayers) * opponentBB +
      (otherPlayers / avgTablePlayers) * tableShareBB;
    
    const payoutBB = totalPayoutAtStake / bbValue;
    const expectedPayoutPer100 = (100 / BBJ_CONSTANTS.handsPerBBJ) * expectedPayoutPerBBJ;
    const netBBper100 = expectedPayoutPer100 - BBJ_CONSTANTS.bbPer100Fees;
    const returnRatio = expectedPayoutPer100 / BBJ_CONSTANTS.bbPer100Fees;
    
    const isProfitable = netBBper100 >= 0;
    const percentToBreakeven = returnRatio * 100;
    
    const breakevenExpectedPerBBJ = BBJ_CONSTANTS.bbPer100Fees * BBJ_CONSTANTS.handsPerBBJ / 100;
    const currentExpectedPerBBJ = expectedPayoutPerBBJ;
    const poolMultiplier = breakevenExpectedPerBBJ / currentExpectedPerBBJ;
    const poolNeededForBreakeven = pool * poolMultiplier;
    
    return {
      payoutBB,
      returnRatio,
      netBBper100,
      isProfitable,
      percentToBreakeven,
      poolNeeded: poolNeededForBreakeven - pool,
      jackpotWinnerPayout,
      opponentPayout,
      tableSharePayout,
      totalPayoutAtStake,
      stakePoolSize,
    };
  };

  const calculateVariance = (hands: number, pool: number, stake: string = selectedStake): VarianceResult => {
    const stakeOption = STAKE_OPTIONS.find(s => s.value === stake) || STAKE_OPTIONS[4];
    const bbValue = stakeOption.bbValue;
    const lambda = hands / BBJ_CONSTANTS.handsPerBBJ;
    const totalFeesPaid = (hands / 100) * BBJ_CONSTANTS.bbPer100Fees;
    const stakePoolSize = pool * (stakeOption.poolPercent / 100);
    const avgTablePlayers = BBJ_CONSTANTS.avgPlayersPerTable;
    const otherPlayers = avgTablePlayers - 2;
    
    const jackpotWinnerBB = (stakePoolSize * 0.10) / bbValue;
    const opponentBB = (stakePoolSize * 0.03) / bbValue;
    const tableShareBB = (stakePoolSize * 0.008) / bbValue;
    
    const expectedPayoutPerBBJ = 
      (1 / avgTablePlayers) * jackpotWinnerBB +
      (1 / avgTablePlayers) * opponentBB +
      (otherPlayers / avgTablePlayers) * tableShareBB;
    
    const expectedPayouts = lambda * expectedPayoutPerBBJ;
    const expectedProfit = expectedPayouts - totalFeesPaid;
    
    const varianceOfSingleBBJ = 
      (1 / avgTablePlayers) * Math.pow(jackpotWinnerBB - expectedPayoutPerBBJ, 2) +
      (1 / avgTablePlayers) * Math.pow(opponentBB - expectedPayoutPerBBJ, 2) +
      (otherPlayers / avgTablePlayers) * Math.pow(tableShareBB - expectedPayoutPerBBJ, 2);
    
    const totalVariance = lambda * varianceOfSingleBBJ + lambda * Math.pow(expectedPayoutPerBBJ, 2);
    const stdDeviation = Math.sqrt(totalVariance);
    
    const z95 = 1.96;
    const z99 = 2.576;
    
    const confidenceInterval95: [number, number] = [
      expectedProfit - z95 * stdDeviation,
      expectedProfit + z95 * stdDeviation
    ];
    
    const confidenceInterval99: [number, number] = [
      expectedProfit - z99 * stdDeviation,
      expectedProfit + z99 * stdDeviation
    ];
    
    const zScore = expectedProfit / (stdDeviation || 1);
    const probabilityOfProfit = 0.5 * (1 + erf(zScore / Math.sqrt(2)));
    
    const worstCase1Percent = expectedProfit - 2.326 * stdDeviation;
    const bestCase1Percent = expectedProfit + 2.326 * stdDeviation;
    
    return {
      expectedBBJs: lambda,
      expectedProfit,
      stdDeviation,
      confidenceInterval95,
      confidenceInterval99,
      probabilityOfProfit,
      totalFeesPaid,
      expectedPayouts,
      worstCase1Percent,
      bestCase1Percent,
    };
  };

  const erf = (x: number): number => {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  };

  const runSimulation = () => {
    setIsCalculating(true);
    setSimulationProgress(0);
    
    requestAnimationFrame(() => {
      const result = calculateVariance(simulationHands, poolSize, selectedStake);
      setVarianceResult(result);
      
      runMonteCarloSimulation();
    });
  };

  const runMonteCarloSimulation = useCallback(() => {
    const stakeOption = STAKE_OPTIONS.find(s => s.value === selectedStake) || STAKE_OPTIONS[4];
    const bbValue = stakeOption.bbValue;
    const stakePoolSize = poolSize * (stakeOption.poolPercent / 100);
    const avgTablePlayers = BBJ_CONSTANTS.avgPlayersPerTable;
    const otherPlayers = avgTablePlayers - 2;
    
    const jackpotWinnerBB = (stakePoolSize * 0.10) / bbValue;
    const opponentBB = (stakePoolSize * 0.03) / bbValue;
    const tableShareBB = (stakePoolSize * 0.008) / bbValue;
    
    const bbjProbability = 1 / BBJ_CONSTANTS.handsPerBBJ;
    const feesPer100 = BBJ_CONSTANTS.bbPer100Fees;
    
    const trials: SimulationTrial[] = [];
    let currentTrial = 0;
    const batchSize = Math.max(1, Math.floor(numTrials / 20));
    
    const actualHandsPerTrial = simulationHands;
    const timelinePoints = 50;
    const handsPerPoint = Math.floor(actualHandsPerTrial / timelinePoints);
    
    const processBatch = () => {
      const batchEnd = Math.min(currentTrial + batchSize, numTrials);
      
      for (let t = currentTrial; t < batchEnd; t++) {
        let bbjsHit = 0;
        let jackpotWins = 0;
        let opponentWins = 0;
        let tableShares = 0;
        let totalPayout = 0;
        const timeline: { hands: number; profit: number; }[] = [];
        let runningProfit = 0;
        
        for (let point = 0; point < timelinePoints; point++) {
          const handsInSegment = handsPerPoint;
          const feesForSegment = (handsInSegment / 100) * feesPer100;
          runningProfit -= feesForSegment;
          
          for (let h = 0; h < handsInSegment; h++) {
            if (Math.random() < bbjProbability) {
              bbjsHit++;
              const role = Math.random() * avgTablePlayers;
              
              if (role < 1) {
                jackpotWins++;
                totalPayout += jackpotWinnerBB;
                runningProfit += jackpotWinnerBB;
              } else if (role < 2) {
                opponentWins++;
                totalPayout += opponentBB;
                runningProfit += opponentBB;
              } else {
                tableShares++;
                totalPayout += tableShareBB;
                runningProfit += tableShareBB;
              }
            }
          }
          
          timeline.push({
            hands: (point + 1) * handsPerPoint,
            profit: runningProfit
          });
        }
        
        const totalFeesPaid = (actualHandsPerTrial / 100) * feesPer100;
        
        trials.push({
          trialNumber: t + 1,
          bbjsHit,
          jackpotWins,
          opponentWins,
          tableShares,
          totalPayout,
          feesPaid: totalFeesPaid,
          netProfit: totalPayout - totalFeesPaid,
          timeline
        });
      }
      
      currentTrial = batchEnd;
      setSimulationProgress(Math.round((currentTrial / numTrials) * 100));
      
      if (currentTrial < numTrials) {
        requestAnimationFrame(processBatch);
      } else {
        const profits = trials.map(t => t.netProfit);
        profits.sort((a, b) => a - b);
        
        const sum = profits.reduce((a, b) => a + b, 0);
        const avg = sum / profits.length;
        const sortedProfits = [...profits].sort((a, b) => a - b);
        const median = sortedProfits[Math.floor(sortedProfits.length / 2)];
        const variance = profits.reduce((acc, p) => acc + Math.pow(p - avg, 2), 0) / profits.length;
        const stdDev = Math.sqrt(variance);
        const profitableCount = profits.filter(p => p >= 0).length;
        
        const twentyPercent = Math.max(1, Math.floor(sortedProfits.length * 0.2));
        const bottom20Profits = sortedProfits.slice(0, twentyPercent);
        const top20Profits = sortedProfits.slice(-twentyPercent);
        const bottom20Avg = bottom20Profits.reduce((a, b) => a + b, 0) / bottom20Profits.length;
        const top20Avg = top20Profits.reduce((a, b) => a + b, 0) / top20Profits.length;
        
        const bottom20BBper100 = (bottom20Avg / actualHandsPerTrial) * 100;
        const top20BBper100 = (top20Avg / actualHandsPerTrial) * 100;
        
        setSimulationResults({
          trials,
          averageProfit: avg,
          medianProfit: median,
          stdDev,
          minProfit: sortedProfits[0],
          maxProfit: sortedProfits[sortedProfits.length - 1],
          profitableTrials: profitableCount,
          totalTrials: numTrials,
          handsPerTrial: actualHandsPerTrial,
          bottom20BBper100,
          top20BBper100,
        });
        
        setIsCalculating(false);
      }
    };
    
    requestAnimationFrame(processBatch);
  }, [poolSize, selectedStake, simulationHands, numTrials]);

  // ============================================
  // MEMOIZED CALCULATIONS
  // ============================================

  const currentEV = useMemo(() => calculateEV(poolSize, selectedStake), [poolSize, selectedStake]);
  
  const evTableData = useMemo(() => {
    const poolSizes = [1600000, 1800000, 2017000, 2200000, 2400000, 2600000];
    return poolSizes.map(pool => ({
      pool,
      ...calculateEV(pool, selectedStake)
    }));
  }, [selectedStake]);

  // ============================================
  // NACHO MASCOT LOGIC
  // ============================================
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
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
    const newNachos = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 14 + Math.random() * 24,
      duration: 50 + Math.random() * 30,
      delay: Math.random() * 40,
      rotation: Math.random() * 360,
      opacity: 0.15 + Math.random() * 0.15,
      moveX: Math.random() * 80 - 40,
      moveY: Math.random() * 100 - 50
    }));
    setNachos(newNachos);
  }, []);

  const eyeOffset = getEyeOffset();

  // ============================================
  // HELPER COMPONENTS
  // ============================================

  const CartoonNacho = () => (
    <svg ref={nachoRef} width="90" height="90" viewBox="0 0 100 100" className="drop-shadow-[0_4px_12px_rgba(212,175,55,0.4)]">
      <path d="M50 8 L88 85 Q90 92 82 92 L18 92 Q10 92 12 85 Z" fill="#D4AF37" stroke="#A68942" strokeWidth="2"/>
      <path d="M25 70 Q20 75 22 82 Q24 88 28 85 Q30 80 28 75 Z" fill="#E5C158" opacity="0.9"/>
      <path d="M72 65 Q78 72 76 80 Q74 86 70 82 Q68 76 70 70 Z" fill="#E5C158" opacity="0.9"/>
      <path d="M48 75 Q45 82 48 88 Q52 92 55 86 Q56 80 52 76 Z" fill="#E5C158" opacity="0.9"/>
      <ellipse cx="50" cy="50" rx="22" ry="18" fill="#D4AF37" />
      <ellipse cx="40" cy="48" rx="8" ry="9" fill="white" />
      <ellipse cx="60" cy="48" rx="8" ry="9" fill="white" />
      <circle cx={40 + eyeOffset.x} cy={48 + eyeOffset.y} r="4" fill="#0a0a0a" className="transition-all duration-100"/>
      <circle cx={60 + eyeOffset.x} cy={48 + eyeOffset.y} r="4" fill="#0a0a0a" className="transition-all duration-100"/>
      <circle cx={38 + eyeOffset.x * 0.5} cy={46 + eyeOffset.y * 0.5} r="1.5" fill="white" opacity="0.8" />
      <circle cx={58 + eyeOffset.x * 0.5} cy={46 + eyeOffset.y * 0.5} r="1.5" fill="white" opacity="0.8" />
      <path d="M38 62 Q50 72 62 62" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round"/>
      <path d="M33 38 Q40 35 47 38" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" />
      <path d="M53 38 Q60 35 67 38" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  const NachoTriangle = ({ size, opacity }: { size: number; opacity: number }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ opacity }}>
      <path d="M10 2 L18 17 L2 17 Z" fill="#D4AF37" opacity="0.6"/>
    </svg>
  );

  const formatCurrency = (value: number): string => {
    const absValue = Math.abs(value);
    const sign = value >= 0 ? '' : '-';
    
    if (absValue >= 1000000) {
      return `${sign}$${(absValue / 1000000).toFixed(2)}M`;
    }
    if (absValue >= 1000) {
      return `${sign}$${(absValue / 1000).toFixed(0)}K`;
    }
    return `${sign}$${absValue.toFixed(0)}`;
  };

  const formatBB = (value: number, showSign: boolean = false): string => {
    const sign = showSign ? (value >= 0 ? '+' : '') : '';
    if (Math.abs(value) >= 1000000) {
      return `${sign}${(value / 1000000).toFixed(2)}M bb`;
    }
    if (Math.abs(value) >= 1000) {
      return `${sign}${(value / 1000).toFixed(1)}K bb`;
    }
    return `${sign}${value.toFixed(1)} bb`;
  };

  const formatSimValue = (bbValue: number, showSign: boolean = false): string => {
    const stakeOption = STAKE_OPTIONS.find(s => s.value === selectedStake) || STAKE_OPTIONS[4];
    const dollarValue = bbValue * stakeOption.bbValue;
    
    if (displayInDollars) {
      const sign = showSign ? (dollarValue >= 0 ? '+' : '') : '';
      if (Math.abs(dollarValue) >= 1000000) {
        return `${sign}$${(dollarValue / 1000000).toFixed(2)}M`;
      }
      if (Math.abs(dollarValue) >= 1000) {
        return `${sign}$${(dollarValue / 1000).toFixed(1)}K`;
      }
      return `${sign}$${dollarValue.toFixed(2)}`;
    } else {
      const sign = showSign ? (bbValue >= 0 ? '+' : '') : '';
      if (Math.abs(bbValue) >= 1000000) {
        return `${sign}${(bbValue / 1000000).toFixed(2)}M bb`;
      }
      if (Math.abs(bbValue) >= 1000) {
        return `${sign}${(bbValue / 1000).toFixed(1)}K bb`;
      }
      return `${sign}${bbValue.toFixed(1)} bb`;
    }
  };

  const getEVColor = (value: number): string => {
    if (value > 0) return 'text-emerald-400';
    if (value < 0) return 'text-red-400';
    return 'text-zinc-400';
  };

  const getEVColorRaw = (value: number): string => {
    if (value > 0) return '#34d399';
    if (value < 0) return '#f87171';
    return '#a1a1aa';
  };

  // Progress bar component
  const ProgressBar = ({ value, max, color, showLabel = true }: { value: number; max: number; color: string; showLabel?: boolean }) => {
    const percentage = Math.min((value / max) * 100, 100);
    return (
      <div className="w-full">
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        {showLabel && (
          <div className="text-[11px] text-zinc-500 mt-1 text-right">
            {percentage.toFixed(1)}%
          </div>
        )}
      </div>
    );
  };

  // Gauge component for EV visualization
  const EVGauge = ({ value, min, max }: { value: number; min: number; max: number }) => {
    const range = max - min;
    const normalizedValue = ((value - min) / range) * 100;
    const clampedValue = Math.max(0, Math.min(100, normalizedValue));
    
    const getGaugeColor = (pct: number): string => {
      if (pct < 50) {
        const red = 239;
        const green = Math.round(68 + (pct / 50) * 187);
        return `rgb(${red}, ${green}, 68)`;
      } else {
        const red = Math.round(255 - ((pct - 50) / 50) * 221);
        const green = Math.round(255 - ((pct - 50) / 50) * 60);
        return `rgb(${red}, ${green}, 94)`;
      }
    };

    return (
      <div className="relative w-full h-[120px]">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <motion.path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke={getGaugeColor(clampedValue)}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${clampedValue * 2.51} 251`}
            initial={{ strokeDasharray: '0 251' }}
            animate={{ strokeDasharray: `${clampedValue * 2.51} 251` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          <text
            x="100"
            y="70"
            textAnchor="middle"
            fill={getGaugeColor(clampedValue)}
            fontSize="24"
            fontWeight="700"
            className="font-bold"
          >
            {value >= 0 ? '+' : ''}{value.toFixed(2)}
          </text>
          <text
            x="100"
            y="88"
            textAnchor="middle"
            fill="rgba(255,255,255,0.5)"
            fontSize="12"
          >
            bb/100
          </text>
          <text x="20" y="98" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10">
            {min.toFixed(1)}
          </text>
          <text x="180" y="98" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10">
            +{max.toFixed(1)}
          </text>
        </svg>
      </div>
    );
  };

  // Line chart for simulation results
  const SimulationLineChart = ({ results }: { results: SimulationResults }) => {
    const chartWidth = 700;
    const chartHeight = 300;
    const padding = { top: 30, right: 60, bottom: 50, left: 80 };
    const innerWidth = chartWidth - padding.left - padding.right;
    const innerHeight = chartHeight - padding.top - padding.bottom;
    
    const stakeOption = STAKE_OPTIONS.find(s => s.value === selectedStake) || STAKE_OPTIONS[4];
    const bbValue = stakeOption.bbValue;
    
    const convertValue = (bb: number) => displayInDollars ? bb * bbValue : bb;
    
    const allProfits = results.trials.flatMap(t => t.timeline.map(p => convertValue(p.profit)));
    const minProfit = Math.min(...allProfits);
    const maxProfit = Math.max(...allProfits);
    const yRange = maxProfit - minProfit || 1;
    const yPadding = yRange * 0.1;
    const yMin = minProfit - yPadding;
    const yMax = maxProfit + yPadding;
    
    const maxHands = results.handsPerTrial;
    
    const scaleX = (hands: number) => padding.left + (hands / maxHands) * innerWidth;
    const scaleY = (profit: number) => padding.top + innerHeight - ((convertValue(profit) - yMin) / (yMax - yMin)) * innerHeight;
    
    const zeroY = padding.top + innerHeight - ((0 - yMin) / (yMax - yMin)) * innerHeight;
    
    const visibleTrials = results.trials;
    
    const getLineColor = (index: number, profit: number) => {
      if (profit >= 0) return `hsla(142, 70%, ${50 + (index % 3) * 10}%, 0.6)`;
      return `hsla(0, 70%, ${50 + (index % 3) * 10}%, 0.6)`;
    };
    
    const formatAxisLabel = (value: number) => {
      if (Math.abs(value) >= 1000000000) return `${(value / 1000000000).toFixed(0)}B`;
      if (Math.abs(value) >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
      if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(0)}K`;
      return value.toFixed(0);
    };
    
    const formatYAxisLabel = (value: number) => {
      const formatted = formatAxisLabel(value);
      return displayInDollars ? `$${formatted}` : `${formatted} bb`;
    };

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full min-w-[600px]">
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map(pct => (
            <line 
              key={pct}
              x1={padding.left} 
              y1={padding.top + innerHeight * pct} 
              x2={padding.left + innerWidth} 
              y2={padding.top + innerHeight * pct} 
              stroke="rgba(255,255,255,0.05)" 
              strokeDasharray="4"
            />
          ))}
          
          {/* Zero line */}
          {yMin < 0 && yMax > 0 && (
            <line 
              x1={padding.left} 
              y1={zeroY} 
              x2={padding.left + innerWidth} 
              y2={zeroY} 
              stroke="rgba(212, 175, 55, 0.3)" 
              strokeWidth="1"
            />
          )}
          
          {/* Trial lines */}
          {visibleTrials.map((trial, idx) => {
            const points = trial.timeline.map(p => `${scaleX(p.hands)},${scaleY(p.profit)}`).join(' ');
            return (
              <polyline
                key={trial.trialNumber}
                points={points}
                fill="none"
                stroke={getLineColor(idx, trial.netProfit)}
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            );
          })}
          
          {/* Average line */}
          {(() => {
            const avgTimeline = Array.from({ length: visibleTrials[0]?.timeline.length || 0 }, (_, i) => {
              const avgProfit = visibleTrials.reduce((sum, t) => sum + t.timeline[i].profit, 0) / visibleTrials.length;
              return { hands: visibleTrials[0]?.timeline[i].hands || 0, profit: avgProfit };
            });
            const points = avgTimeline.map(p => `${scaleX(p.hands)},${scaleY(p.profit)}`).join(' ');
            return (
              <polyline
                points={points}
                fill="none"
                stroke="#D4AF37"
                strokeWidth="3"
                strokeLinejoin="round"
                opacity="0.9"
              />
            );
          })()}
          
          {/* X axis */}
          <line 
            x1={padding.left} 
            y1={padding.top + innerHeight} 
            x2={padding.left + innerWidth} 
            y2={padding.top + innerHeight} 
            stroke="rgba(255,255,255,0.3)" 
          />
          
          {/* X axis labels */}
          <text x={padding.left} y={chartHeight - 15} fill="rgba(255,255,255,0.5)" fontSize="11" textAnchor="start">
            0
          </text>
          <text x={padding.left + innerWidth / 2} y={chartHeight - 15} fill="rgba(255,255,255,0.5)" fontSize="11" textAnchor="middle">
            {formatAxisLabel(maxHands / 2)} hands
          </text>
          <text x={padding.left + innerWidth} y={chartHeight - 15} fill="rgba(255,255,255,0.5)" fontSize="11" textAnchor="end">
            {formatAxisLabel(maxHands)}
          </text>
          <text x={padding.left + innerWidth / 2} y={chartHeight - 2} fill="rgba(255,255,255,0.4)" fontSize="10" textAnchor="middle">
            Hands Played
          </text>
          
          {/* Y axis */}
          <line 
            x1={padding.left} 
            y1={padding.top} 
            x2={padding.left} 
            y2={padding.top + innerHeight} 
            stroke="rgba(255,255,255,0.3)" 
          />
          
          {/* Y axis labels */}
          <text x={padding.left - 10} y={padding.top + 4} fill="rgba(255,255,255,0.5)" fontSize="11" textAnchor="end">
            {formatYAxisLabel(yMax)}
          </text>
          {yMin < 0 && yMax > 0 && (
            <text x={padding.left - 10} y={zeroY + 4} fill="rgba(255,255,255,0.7)" fontSize="11" textAnchor="end" fontWeight="600">
              0
            </text>
          )}
          <text x={padding.left - 10} y={padding.top + innerHeight + 4} fill="rgba(255,255,255,0.5)" fontSize="11" textAnchor="end">
            {formatYAxisLabel(yMin)}
          </text>
          
          {/* Y axis title */}
          <text 
            x={15} 
            y={padding.top + innerHeight / 2} 
            fill="rgba(255,255,255,0.4)" 
            fontSize="10" 
            textAnchor="middle"
            transform={`rotate(-90, 15, ${padding.top + innerHeight / 2})`}
          >
            Profit ({displayInDollars ? '$' : 'bb'})
          </text>
          
          {/* Legend */}
          <g transform={`translate(${padding.left + innerWidth - 120}, ${padding.top + 10})`}>
            <rect x="-5" y="-5" width="130" height="50" fill="rgba(0,0,0,0.5)" rx="4" />
            <line x1="0" y1="8" x2="25" y2="8" stroke="#D4AF37" strokeWidth="3" />
            <text x="30" y="12" fill="rgba(255,255,255,0.7)" fontSize="10">Average</text>
            <line x1="0" y1="25" x2="25" y2="25" stroke="rgba(34, 197, 94, 0.6)" strokeWidth="1.5" />
            <text x="30" y="29" fill="rgba(255,255,255,0.7)" fontSize="10">Winning Trial</text>
            <line x1="0" y1="42" x2="25" y2="42" stroke="rgba(239, 68, 68, 0.6)" strokeWidth="1.5" />
            <text x="30" y="46" fill="rgba(255,255,255,0.7)" fontSize="10">Losing Trial</text>
          </g>
        </svg>
      </div>
    );
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden font-['Inter',_-apple-system,_BlinkMacSystemFont,_sans-serif]">
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
            <NachoTriangle size={nacho.size} opacity={nacho.opacity} />
          </motion.div>
        ))}
      </div>

      {/* Radial gradient overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.08)_0%,transparent_50%)] pointer-events-none z-0" />

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 py-6">
        <NachosPokerNavBar />
        
        {/* Header Banner */}
        <motion.div 
          className="relative mb-8 p-7 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-hidden"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-500/20 via-transparent to-yellow-500/20 opacity-50" />
          
          <div className="relative flex items-center gap-6 flex-wrap">
            <motion.div 
              className="flex-shrink-0"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <CartoonNacho />
            </motion.div>
            
            <div className="flex-1 min-w-[280px]">
              <div className="text-xs text-yellow-500 font-semibold mb-1.5 tracking-[0.1em] uppercase">
                Crafted by FreeNachos
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
                The house always wins. <span className="text-zinc-500">But by how much?</span>
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-lg">
                Bad Beat Jackpots look tempting — until you do the math. See exactly when the pool makes it worth chasing, and when you're just padding the casino's pockets.
              </p>
            </div>
            
            <div className="flex flex-col gap-3 flex-shrink-0">
              <a 
                href="https://www.nachospoker.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-zinc-950 px-5 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all duration-300 hover:-translate-y-0.5"
              >
                Join Our CFP <ExternalLink size={14} />
              </a>
              <a 
                href="https://www.freenachoscoaching.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-transparent border border-yellow-500/50 text-yellow-500 px-5 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2 hover:bg-yellow-500/10 hover:border-yellow-500 transition-all duration-300"
              >
                Private Coaching <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Data Methodology Section */}
        <motion.div 
          className="rounded-3xl p-6 md:p-8 mb-8 bg-white/[0.02] backdrop-blur-xl border border-white/10"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 bg-yellow-500/15 rounded-2xl p-3">
              <Database size={24} className="text-yellow-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-lg font-bold mb-3">About This Data</h3>
              
              <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                Based on <strong className="text-yellow-500">42.1 million hands</strong> from GGPoker NL100+. 
                We found <strong className="text-yellow-500">624 BBJ triggers</strong> — a frequency of <strong>1 in 67,500 hands</strong>.
              </p>
              
              <p className="text-zinc-500 text-xs leading-relaxed mb-5">
                Sample: 8.2M regular hands + 33.9M Rush & Cash. Rush plays faster (new table each hand) but BBJ rules are identical — combining both ensures robust data.
              </p>
              
              {/* Key Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
                  <div className="text-[11px] text-zinc-500 mb-1.5 uppercase tracking-wide">Your Jackpot "Rake"</div>
                  <div className="text-2xl md:text-3xl text-red-400 font-bold">2.08 bb/100</div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 text-center">
                  <div className="text-[11px] text-zinc-500 mb-1.5 uppercase tracking-wide">Break-Even Pool</div>
                  <div className="text-2xl md:text-3xl text-yellow-500 font-bold">~$2.02M</div>
                </div>
              </div>

              {/* Verdict */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-400 leading-relaxed">
                <strong className="text-yellow-500">TL;DR:</strong> When the total pool exceeds ~$2M, playing BBJ tables becomes mathematically +EV. Below that, you're subsidizing other players' jackpot dreams.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Variance Simulator Section */}
        <motion.div 
          className="rounded-3xl p-6 md:p-10 mb-8 bg-white/[0.03] backdrop-blur-xl border border-white/10"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Calculator size={28} className="text-yellow-500" />
            <h2 className="text-xl md:text-2xl font-bold text-white">Variance Simulator</h2>
          </div>
          <p className="text-center text-zinc-500 text-sm mb-8">
            See how BBJ fees and payouts affect your bankroll across thousands of hands
          </p>

          {/* Simulator Controls */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Hands per Trial */}
            <motion.div 
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5"
              variants={scaleIn}
            >
              <h3 className="text-yellow-500 mb-3 text-xs font-semibold uppercase tracking-wider">
                Hands per Trial
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[100000, 500000, 1000000, 5000000].map(preset => (
                  <button
                    key={preset}
                    onClick={() => setSimulationHands(preset)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      simulationHands === preset 
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-zinc-950' 
                        : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-700'
                    }`}
                  >
                    {preset >= 1000000 ? `${preset / 1000000}M` : `${preset / 1000}K`}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Number of Trials */}
            <motion.div 
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5"
              variants={scaleIn}
            >
              <h3 className="text-yellow-500 mb-3 text-xs font-semibold uppercase tracking-wider">
                Number of Trials
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[50, 100, 200, 500].map(preset => (
                  <button
                    key={preset}
                    onClick={() => setNumTrials(preset)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      numTrials === preset 
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-zinc-950' 
                        : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-700'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Your Stakes */}
            <motion.div 
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5"
              variants={scaleIn}
            >
              <h3 className="text-yellow-500 mb-3 text-xs font-semibold uppercase tracking-wider">
                Your Stakes
              </h3>
              <div className="grid grid-cols-2 gap-1">
                {STAKE_OPTIONS.slice(0, 6).map(stake => (
                  <button
                    key={stake.value}
                    onClick={() => setSelectedStake(stake.value)}
                    className={`py-1.5 px-2 rounded-md text-[10px] font-semibold transition-all duration-200 ${
                      selectedStake === stake.value 
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-zinc-950' 
                        : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-700'
                    }`}
                  >
                    {stake.label.replace('$', '')}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* BBJ Pool Size */}
            <motion.div 
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5"
              variants={scaleIn}
            >
              <h3 className="text-yellow-500 mb-3 text-xs font-semibold uppercase tracking-wider">
                BBJ Pool Size
              </h3>
              <input
                type="number"
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm mb-2 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30 outline-none transition-all"
                value={poolSize}
                onChange={(e) => setPoolSize(parseFloat(e.target.value) || 0)}
              />
              <div className="grid grid-cols-2 gap-1">
                {[1800000, 2200000, 2400000].map(preset => (
                  <button
                    key={preset}
                    onClick={() => setPoolSize(preset)}
                    className={`py-1 px-2 rounded-md text-[9px] font-semibold transition-all duration-200 ${
                      poolSize === preset 
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-zinc-950' 
                        : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 border border-zinc-700'
                    }`}
                  >
                    ${(preset / 1000000).toFixed(1)}M
                  </button>
                ))}
                <button
                  onClick={() => setPoolSize(2017000)}
                  className={`py-1 px-2 rounded-md text-[9px] font-bold transition-all duration-200 ${
                    poolSize === 2017000 
                      ? 'bg-emerald-500 text-zinc-950' 
                      : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                  }`}
                >
                  Break-even
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Run Simulation Button */}
          <div className="text-center mb-8">
            <motion.button
              onClick={runSimulation}
              disabled={isCalculating}
              className={`px-12 py-4 rounded-2xl font-bold text-base inline-flex items-center gap-3 transition-all duration-300 ${
                isCalculating 
                  ? 'bg-yellow-500/30 text-zinc-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-zinc-950 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:-translate-y-1'
              }`}
              whileTap={{ scale: isCalculating ? 1 : 0.98 }}
            >
              {isCalculating ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  Simulating... {simulationProgress}%
                </>
              ) : (
                <>
                  <Play size={20} />
                  Run {numTrials} Simulations
                </>
              )}
            </motion.button>
            
            {isCalculating && (
              <motion.div 
                className="mt-4 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${simulationProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Simulation Results */}
          {simulationResults && !isCalculating && (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-white text-lg font-semibold mb-4 text-center flex items-center justify-center gap-3">
                <BarChart3 size={20} className="text-yellow-500" />
                Results: {simulationResults.totalTrials} simulations of {simulationResults.handsPerTrial >= 1000000 ? `${(simulationResults.handsPerTrial / 1000000)}M` : `${(simulationResults.handsPerTrial / 1000)}K`} hands each
              </h3>
              
              {/* Display Toggle */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex rounded-xl overflow-hidden border border-zinc-700">
                  <button
                    onClick={() => setDisplayInDollars(false)}
                    className={`px-5 py-2 text-xs font-semibold transition-all duration-200 ${
                      !displayInDollars 
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-zinc-950' 
                        : 'bg-zinc-800/50 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Show in BB
                  </button>
                  <button
                    onClick={() => setDisplayInDollars(true)}
                    className={`px-5 py-2 text-xs font-semibold transition-all duration-200 ${
                      displayInDollars 
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-zinc-950' 
                        : 'bg-zinc-800/50 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Show in $
                  </button>
                </div>
              </div>

              {/* Line Chart */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-6">
                <h4 className="text-yellow-500 mb-4 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                  <LineChart size={16} /> Bankroll Over Time ({simulationResults.totalTrials} trials shown)
                </h4>
                <SimulationLineChart results={simulationResults} />
                <div className="mt-3 text-center text-[11px] text-zinc-500">
                  Lines trend down from fees ({BBJ_CONSTANTS.bbPer100Fees.toFixed(2)} bb/100), jump up when BBJ hits
                </div>
              </div>

              {/* Summary Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <motion.div 
                  className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5"
                  variants={scaleIn}
                >
                  <div className="text-[11px] text-zinc-500 mb-2 uppercase tracking-wide">Average BB/100</div>
                  <div className={`text-2xl font-bold ${getEVColor(simulationResults.averageProfit)}`}>
                    {((simulationResults.averageProfit / simulationResults.handsPerTrial) * 100) >= 0 ? '+' : ''}{((simulationResults.averageProfit / simulationResults.handsPerTrial) * 100).toFixed(4)}
                  </div>
                  <div className="text-[11px] text-zinc-600 mt-1">across all {simulationResults.totalTrials} trials</div>
                </motion.div>

                <motion.div 
                  className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5"
                  variants={scaleIn}
                >
                  <div className="text-[11px] text-zinc-500 mb-2 uppercase tracking-wide">Median BB/100</div>
                  <div className={`text-2xl font-bold ${getEVColor(simulationResults.medianProfit)}`}>
                    {((simulationResults.medianProfit / simulationResults.handsPerTrial) * 100) >= 0 ? '+' : ''}{((simulationResults.medianProfit / simulationResults.handsPerTrial) * 100).toFixed(4)}
                  </div>
                  <div className="text-[11px] text-zinc-600 mt-1">typical outcome</div>
                </motion.div>

                <motion.div 
                  className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5"
                  variants={scaleIn}
                >
                  <div className="text-[11px] text-zinc-500 mb-2 uppercase tracking-wide">Top 20% Avg BB/100</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {simulationResults.top20BBper100 >= 0 ? '+' : ''}{simulationResults.top20BBper100.toFixed(4)}
                  </div>
                  <div className="text-[11px] text-zinc-600 mt-1">luckiest {Math.max(1, Math.floor(simulationResults.totalTrials * 0.2))} trials</div>
                </motion.div>

                <motion.div 
                  className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5"
                  variants={scaleIn}
                >
                  <div className="text-[11px] text-zinc-500 mb-2 uppercase tracking-wide">Bottom 20% Avg BB/100</div>
                  <div className="text-2xl font-bold text-red-400">
                    {simulationResults.bottom20BBper100 >= 0 ? '+' : ''}{simulationResults.bottom20BBper100.toFixed(4)}
                  </div>
                  <div className="text-[11px] text-zinc-600 mt-1">unluckiest {Math.max(1, Math.floor(simulationResults.totalTrials * 0.2))} trials</div>
                </motion.div>
              </div>

              {/* Range Statistics */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5">
                <h4 className="text-yellow-500 mb-4 text-sm font-semibold uppercase tracking-wider">
                  Outcome Range
                </h4>
                <div className="flex justify-between items-center flex-wrap gap-5">
                  <div className="text-center">
                    <div className="text-[11px] text-zinc-500 mb-1">Worst Trial</div>
                    <div className="text-lg font-bold text-red-400">
                      {formatSimValue(simulationResults.minProfit, true)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-[200px] px-5">
                    <div className="relative h-2 bg-zinc-800 rounded-full">
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 rounded-full opacity-60"
                      />
                      <motion.div 
                        className="absolute top-[-4px] w-1 h-4 bg-yellow-500 rounded"
                        style={{
                          left: `${((simulationResults.averageProfit - simulationResults.minProfit) / (simulationResults.maxProfit - simulationResults.minProfit)) * 100}%`,
                          transform: 'translateX(-50%)'
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[11px] text-zinc-500 mb-1">Best Trial</div>
                    <div className="text-lg font-bold text-emerald-400">
                      {formatSimValue(simulationResults.maxProfit, true)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center text-xs text-zinc-500">
                  Range: {formatSimValue(simulationResults.maxProfit - simulationResults.minProfit)} spread between best and worst outcomes
                </div>
              </div>

              {/* Variance Summary */}
              {(() => {
                const sortedTrials = [...simulationResults.trials].sort((a, b) => a.netProfit - b.netProfit);
                const twentyPercent = Math.max(1, Math.floor(sortedTrials.length * 0.2));
                
                const bottom20 = sortedTrials.slice(0, twentyPercent);
                const bottom20Avg = {
                  netProfit: bottom20.reduce((sum, t) => sum + t.netProfit, 0) / bottom20.length,
                  bbjsHit: (bottom20.reduce((sum, t) => sum + t.bbjsHit, 0) / bottom20.length).toFixed(1),
                  jackpotWins: (bottom20.reduce((sum, t) => sum + t.jackpotWins, 0) / bottom20.length).toFixed(2),
                  opponentWins: (bottom20.reduce((sum, t) => sum + t.opponentWins, 0) / bottom20.length).toFixed(2),
                  tableShares: (bottom20.reduce((sum, t) => sum + t.tableShares, 0) / bottom20.length).toFixed(1),
                  feesPaid: bottom20.reduce((sum, t) => sum + t.feesPaid, 0) / bottom20.length,
                };
                
                const top20 = sortedTrials.slice(-twentyPercent);
                const top20Avg = {
                  netProfit: top20.reduce((sum, t) => sum + t.netProfit, 0) / top20.length,
                  bbjsHit: (top20.reduce((sum, t) => sum + t.bbjsHit, 0) / top20.length).toFixed(1),
                  jackpotWins: (top20.reduce((sum, t) => sum + t.jackpotWins, 0) / top20.length).toFixed(2),
                  opponentWins: (top20.reduce((sum, t) => sum + t.opponentWins, 0) / top20.length).toFixed(2),
                  tableShares: (top20.reduce((sum, t) => sum + t.tableShares, 0) / top20.length).toFixed(1),
                  feesPaid: top20.reduce((sum, t) => sum + t.feesPaid, 0) / top20.length,
                };
                
                const handsLabel = simulationResults.handsPerTrial >= 1000000 
                  ? `${(simulationResults.handsPerTrial / 1000000)}M` 
                  : `${(simulationResults.handsPerTrial / 1000)}K`;
                
                return (
                  <motion.div 
                    className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mt-6"
                    variants={fadeIn}
                  >
                    <h4 className="text-yellow-500 mb-4 text-sm font-semibold uppercase tracking-wider">
                      What Makes the Difference? (Top 20% vs Bottom 20%)
                    </h4>
                    
                    {/* Comparison Table */}
                    <div className="overflow-x-auto">
                      <div className="min-w-[400px]">
                        {/* Header */}
                        <div className="grid grid-cols-3 bg-zinc-800/50 rounded-t-xl py-3 px-5 border-b border-zinc-700">
                          <div className="text-xs text-zinc-500 font-medium">Metric</div>
                          <div className="text-xs text-red-400 font-medium text-center">Bottom 20%</div>
                          <div className="text-xs text-emerald-400 font-medium text-center">Top 20%</div>
                        </div>
                        
                        {/* Rows */}
                        {[
                          { label: 'Net Profit', bottom: formatSimValue(bottom20Avg.netProfit, true), top: formatSimValue(top20Avg.netProfit, true), highlight: true },
                          { label: 'BBJs Witnessed', bottom: bottom20Avg.bbjsHit, top: top20Avg.bbjsHit },
                          { label: 'Jackpot Wins', bottom: bottom20Avg.jackpotWins, top: top20Avg.jackpotWins },
                          { label: 'Opponent Wins', bottom: bottom20Avg.opponentWins, top: top20Avg.opponentWins },
                          { label: 'Table Shares', bottom: bottom20Avg.tableShares, top: top20Avg.tableShares },
                          { label: 'Fees Paid', bottom: formatSimValue(bottom20Avg.feesPaid), top: formatSimValue(top20Avg.feesPaid) },
                        ].map((row, idx) => (
                          <div 
                            key={row.label}
                            className={`grid grid-cols-3 py-3 px-5 ${
                              row.highlight ? 'bg-yellow-500/10 border-b border-yellow-500/20' : 
                              idx < 5 ? 'border-b border-zinc-800' : ''
                            }`}
                          >
                            <div className="text-sm text-zinc-400">{row.label}</div>
                            <div className={`text-base text-center font-semibold ${row.highlight ? 'text-red-400' : 'text-white'}`}>
                              {row.bottom}
                            </div>
                            <div className={`text-base text-center font-semibold ${row.highlight ? 'text-emerald-400' : 'text-white'}`}>
                              {row.top}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Summary */}
                    <div className="flex items-center gap-4 p-4 bg-zinc-800/30 rounded-xl mt-5 text-sm text-zinc-300">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-xl">
                        📊
                      </div>
                      <div>
                        <strong className="text-yellow-500">The Gap: </strong>
                        <strong className="text-white">{formatSimValue(top20Avg.netProfit - bottom20Avg.netProfit)}</strong> difference.
                        {simulationResults.profitableTrials < simulationResults.totalTrials && simulationResults.profitableTrials > 0 && (
                          <span>
                            {' '}Only <strong className={simulationResults.profitableTrials / simulationResults.totalTrials >= 0.5 ? 'text-emerald-400' : 'text-red-400'}>
                              {((simulationResults.profitableTrials / simulationResults.totalTrials) * 100).toFixed(0)}%
                            </strong> of simulations were profitable.
                          </span>
                        )}
                        {simulationResults.profitableTrials === 0 && (
                          <span className="text-red-400">
                            {' '}<strong>0%</strong> of simulations were profitable.
                          </span>
                        )}
                        {simulationResults.profitableTrials === simulationResults.totalTrials && (
                          <span className="text-emerald-400">
                            {' '}<strong>100%</strong> of simulations were profitable!
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
            </motion.div>
          )}

          {/* Empty State */}
          {!simulationResults && !isCalculating && (
            <div className="text-center py-10 px-5 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-700">
              <LineChart size={40} className="text-zinc-700 mx-auto mb-3" />
              <div className="text-sm text-zinc-500 mb-2">
                No simulation run yet
              </div>
              <div className="text-xs text-zinc-600">
                Configure your settings above and click "Run Simulations" to see how variance affects your bankroll across {numTrials} simulated poker sessions of {simulationHands >= 1000000 ? `${(simulationHands / 1000000)}M` : `${(simulationHands / 1000)}K`} hands each
              </div>
            </div>
          )}
        </motion.div>

        {/* Main Dashboard Card */}
        <motion.div 
          className="rounded-3xl p-6 md:p-10 mb-8 bg-white/[0.03] backdrop-blur-xl border border-white/10"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Target size={28} className="text-yellow-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">BBJ Dashboard</h1>
          </div>
          <p className="text-center text-zinc-500 text-sm mb-8">
            Real-time EV analysis powered by 42.1M verified hands
          </p>

          {/* Pool Size & Stake Input */}
          <motion.div 
            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8"
            variants={scaleIn}
          >
            <h3 className="text-yellow-500 mb-4 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
              <DollarSign size={16} /> Pool Size & Your Stakes
            </h3>
            <div className="flex gap-5 flex-wrap mb-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-[11px] text-zinc-500 block mb-1.5">
                  Total Jackpot Pool (USD)
                </label>
                <input
                  type="number"
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white text-lg font-semibold focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30 outline-none transition-all"
                  placeholder="e.g., 2172588"
                  value={poolSize}
                  onChange={(e) => setPoolSize(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="flex-1 min-w-[300px]">
                <label className="text-[11px] text-zinc-500 block mb-1.5">
                  Your Stakes
                </label>
                <div className="grid grid-cols-5 gap-1">
                  {STAKE_OPTIONS.map(stake => (
                    <button
                      key={stake.value}
                      onClick={() => setSelectedStake(stake.value)}
                      className={`py-2 px-1 rounded-lg text-[10px] font-semibold transition-all duration-200 whitespace-nowrap ${
                        selectedStake === stake.value 
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-zinc-950' 
                          : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-700'
                      }`}
                    >
                      {stake.value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap mb-4">
              {[1600000, 1800000, 2017000, 2200000, 2400000].map(preset => (
                <button
                  key={preset}
                  onClick={() => setPoolSize(preset)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    poolSize === preset 
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-zinc-950' 
                      : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-700'
                  }`}
                >
                  {formatCurrency(preset)}
                </button>
              ))}
            </div>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <span className="text-xs text-zinc-500">
                Your stake pool: <span className="text-yellow-500 font-semibold">{formatCurrency(currentEV.stakePoolSize)}</span>
                <span className="text-zinc-600 ml-2">
                  ({(STAKE_OPTIONS.find(s => s.value === selectedStake)?.poolPercent || 0).toFixed(2)}% of total)
                </span>
              </span>
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
                currentEV.isProfitable 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {currentEV.isProfitable ? '✓ +EV at this pool' : `✗ -EV (need ${formatCurrency(Math.abs(currentEV.poolNeeded))} more)`}
              </span>
            </div>
          </motion.div>

          {/* EV Overview Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Main EV Gauge */}
            <motion.div 
              className={`rounded-2xl p-5 border ${
                currentEV.isProfitable 
                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}
              variants={scaleIn}
            >
              <h3 className={`mb-2 text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${
                currentEV.isProfitable ? 'text-emerald-400' : 'text-red-400'
              }`}>
                <Activity size={14} /> Your Expected Value
              </h3>
              <EVGauge value={currentEV.netBBper100} min={-1.5} max={1.5} />
              <div className="text-center mt-2">
                <span className="text-[11px] text-zinc-500 bg-zinc-900/50 px-3 py-1 rounded-lg">
                  {currentEV.isProfitable ? 'Playing is +EV at this pool size' : 'You\'re paying to chase the dream'}
                </span>
              </div>
            </motion.div>

            {/* Pool Progress */}
            <motion.div 
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5"
              variants={scaleIn}
            >
              <h3 className="text-yellow-500 mb-4 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                <TrendingUp size={14} /> Pool vs Breakeven
              </h3>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-2xl font-bold text-white">
                    {currentEV.percentToBreakeven.toFixed(1)}%
                  </span>
                  <span className={`text-xs self-end ${currentEV.isProfitable ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    {currentEV.isProfitable ? 'Above breakeven!' : `${formatCurrency(currentEV.poolNeeded)} needed`}
                  </span>
                </div>
                <ProgressBar 
                  value={poolSize} 
                  max={BBJ_CONSTANTS.breakevenPool_usd * 1.5} 
                  color={currentEV.isProfitable ? '#34d399' : '#D4AF37'}
                  showLabel={false}
                />
                <div className="flex justify-between mt-1.5 text-[10px] text-zinc-600">
                  <span>$0</span>
                  <span className="text-yellow-500">Breakeven</span>
                  <span>{formatCurrency(BBJ_CONSTANTS.breakevenPool_usd * 1.5)}</span>
                </div>
              </div>
            </motion.div>

            {/* Payout Breakdown */}
            <motion.div 
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5"
              variants={scaleIn}
            >
              <h3 className="text-yellow-500 mb-4 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                <Zap size={14} /> When BBJ Hits at Your Stake
              </h3>
              <div className="text-xs text-zinc-500 mb-3">
                Total distributed: <span className="text-yellow-500 font-semibold">{formatCurrency(currentEV.totalPayoutAtStake)}</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center bg-emerald-500/10 rounded-xl p-3">
                  <div>
                    <div className="text-[11px] text-zinc-400">Bad Beat Winner</div>
                    <div className="text-[10px] text-zinc-600">(Loser with quads+) • 10%</div>
                  </div>
                  <div className="text-base font-bold text-emerald-400">{formatCurrency(currentEV.jackpotWinnerPayout)}</div>
                </div>
                <div className="flex justify-between items-center bg-blue-500/10 rounded-xl p-3">
                  <div>
                    <div className="text-[11px] text-zinc-400">Bad Beat Opponent</div>
                    <div className="text-[10px] text-zinc-600">(Winner of hand) • 3%</div>
                  </div>
                  <div className="text-base font-bold text-blue-400">{formatCurrency(currentEV.opponentPayout)}</div>
                </div>
                <div className="flex justify-between items-center bg-purple-500/10 rounded-xl p-3">
                  <div>
                    <div className="text-[11px] text-zinc-400">Table Share</div>
                    <div className="text-[10px] text-zinc-600">(Each other player) • 0.8%</div>
                  </div>
                  <div className="text-base font-bold text-purple-400">{formatCurrency(currentEV.tableSharePayout)}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* EV by Pool Size Table */}
          <motion.div 
            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6"
            variants={fadeIn}
          >
            <h3 className="text-yellow-500 mb-5 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={16} /> EV at Different Pool Sizes ({STAKE_OPTIONS.find(s => s.value === selectedStake)?.label})
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="py-3 px-2 text-left text-[11px] text-zinc-500 font-semibold">Total Pool</th>
                    <th className="py-3 px-2 text-right text-[11px] text-zinc-500 font-semibold">Your Stake Pool</th>
                    <th className="py-3 px-2 text-right text-[11px] text-zinc-500 font-semibold">Jackpot Win</th>
                    <th className="py-3 px-2 text-right text-[11px] text-zinc-500 font-semibold">Net BB/100</th>
                    <th className="py-3 px-2 text-center text-[11px] text-zinc-500 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {evTableData.map((row, index) => (
                    <tr 
                      key={row.pool}
                      className={`border-b border-zinc-800/50 ${
                        row.pool === poolSize ? 'bg-yellow-500/10' : ''
                      }`}
                    >
                      <td className="py-3 px-2 text-sm text-white font-medium">
                        {formatCurrency(row.pool)}
                      </td>
                      <td className="py-3 px-2 text-sm text-zinc-400 text-right">
                        {formatCurrency(row.stakePoolSize)}
                      </td>
                      <td className="py-3 px-2 text-sm text-emerald-400 text-right font-semibold">
                        {formatCurrency(row.jackpotWinnerPayout)}
                      </td>
                      <td className={`py-3 px-2 text-sm text-right font-bold ${getEVColor(row.netBBper100)}`}>
                        {row.netBBper100 >= 0 ? '+' : ''}{row.netBBper100.toFixed(3)}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`text-[11px] font-semibold px-2 py-1 rounded ${
                          row.isProfitable 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {row.isProfitable ? '+EV' : '-EV'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-xs text-zinc-500 text-center">
              Fee cost: <span className="text-red-400">-{BBJ_CONSTANTS.bbPer100Fees.toFixed(4)} bb/100</span> • 
              Breakeven requires expected return to exceed fee cost
            </div>
          </motion.div>
        </motion.div>

        {/* Insights Section */}
        <motion.div 
          className="rounded-3xl p-6 md:p-10 mb-8 bg-white/[0.03] backdrop-blur-xl border border-white/10"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-center gap-3 mb-7">
            <AlertTriangle size={24} className="text-yellow-500" />
            <h2 className="text-xl font-semibold text-white">Reality Check</h2>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Insight 1 */}
            <motion.div 
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6"
              variants={scaleIn}
            >
              <h3 className="text-red-400 text-sm font-semibold mb-3">
                The Odds Are Astronomical
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                To WIN the main jackpot (lose with AAATT or better), you need to play <strong className="text-white">~{PROBABILITY_DATA.handsToWinJackpot.toLocaleString()} hands</strong>. 
                At 500 hands/hour, that's <strong className="text-white">{Math.round(PROBABILITY_DATA.handsToWinJackpot / 500).toLocaleString()} hours</strong> — 
                or about <strong className="text-white">{Math.round(PROBABILITY_DATA.handsToWinJackpot / 500 / 8)} days</strong> of 8-hour sessions.
              </p>
            </motion.div>

            {/* Insight 2 */}
            <motion.div 
              className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6"
              variants={scaleIn}
            >
              <h3 className="text-yellow-500 text-sm font-semibold mb-3">
                Most Players Never Win It
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                To <em>win</em> the main jackpot, you need <strong className="text-white">{PROBABILITY_DATA.handsToWinJackpot.toLocaleString()} hands</strong>. 
                A recreational player grinding 5 hours/week at 80 hands/hour would need <strong className="text-white">~{Math.round(PROBABILITY_DATA.handsToWinJackpot / (5 * 80 * 52))} years</strong> of play 
                to expect one jackpot win. That's longer than most poker careers.
              </p>
            </motion.div>

            {/* Insight 3 */}
            <motion.div 
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6"
              variants={scaleIn}
            >
              <h3 className="text-emerald-400 text-sm font-semibold mb-3">
                Table Share is Your Best Bet
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                You'll get a table share once every <strong className="text-white">~{PROBABILITY_DATA.handsToGetTableShare.toLocaleString()} hands</strong> — 
                about <strong className="text-white">4x more often</strong> than winning the main prize. 
                It's small ({formatCurrency(currentEV.tableSharePayout)} at your stake), but it's something!
              </p>
            </motion.div>
          </motion.div>

          <div className="mt-6 p-5 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-center">
            <p className="text-zinc-400 text-sm leading-relaxed">
              <strong className="text-yellow-500">Bottom Line:</strong> At current pool levels, you're paying <strong className="text-red-400">{BBJ_CONSTANTS.bbPer100Fees.toFixed(2)} bb/100</strong> in fees. 
              Your expected return is <strong className={currentEV.netBBper100 >= 0 ? 'text-emerald-400' : 'text-red-400'}>{currentEV.netBBper100 >= 0 ? '+' : ''}{currentEV.netBBper100.toFixed(3)} bb/100</strong>. 
              {currentEV.isProfitable 
                ? " The pool is high enough to make BBJ tables mathematically +EV!"
                : ` The pool needs to reach about ${formatCurrency(poolSize + currentEV.poolNeeded)} before playing BBJ tables becomes +EV.`
              }
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-center py-8 text-zinc-600 text-xs"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <p>
            Data based on 42.1M verified hands from GGPoker (NL100+) • 624 BBJ triggers analyzed
          </p>
          <p className="mt-2">
            Built with 🌮 by FreeNachos
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default BBJDashboard;

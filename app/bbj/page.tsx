'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ExternalLink, TrendingUp, BarChart3, Target, Zap, AlertTriangle, DollarSign, Activity, Percent, Calculator, Play, RefreshCw, Info, Database, LineChart } from 'lucide-react';
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
  // Actual payouts when BBJ hits (in $)
  jackpotWinnerPayout: number;  // Bad Beat Winner (loser) - 10%
  opponentPayout: number;       // Bad Beat Opponent (winner) - 3%
  tableSharePayout: number;     // Rest of players - 0.8% each
  totalPayoutAtStake: number;   // Total distributed at this stake
  stakePoolSize: number;        // This stake's portion of total pool
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
  // Timeline data for chart (sampled points)
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
  handsPerBBJ: 67498,           // 42,118,396 / 624 BBJs
  showdownsPerBBJ: 8962,        // 5,592,311 / 624 BBJs  
  avgPlayersPerTable: 5.96,
  showdownRate: 0.1328,         // 13.28%
  bbPer100Fees: 2.0831,         // Verified from $9.04M fees collected
  feesPerBBJ_bb: 8378,          // 5,226,344 bb fees / 624 BBJs
  poolDivisor: 240.38,
  breakevenPayout_bb: 1406,     // Exact: 2.0831 * 67498 / 100
  breakevenPool_usd: 2017000,   // ~$2.02M total pool for break-even
  evDivisor: 240.38,
  // Actual GGPoker distribution (% of stake-specific pool)
  winnerSharePercent: 10,       // Bad Beat Winner (the LOSER with quads+)
  loserSharePercent: 3,         // Bad Beat Opponent (the WINNER of the hand)
  tableSharePercent: 0.8,       // Rest of players at table (each)
};

// Stake pool percentages (of total pool) - derived from GGPoker screenshots
const STAKE_POOL_PERCENTAGES: Record<string, number> = {
  '10/20': 51.42,    // $1,120,957 of $2.18M
  '5/10': 25.71,     // $560,478
  '2/5': 12.86,      // $280,239  
  '1/2': 5.14,       // $112,095
  '0.50/1': 2.57,    // $56,050
  '0.25/0.50': 1.29, // $28,025
  '0.10/0.25': 0.64, // $14,012
  '0.05/0.10': 0.26, // $5,605
  '0.02/0.05': 0.13, // $2,802
  '0.01/0.02': 0.05, // $1,121
};

// Stake options for dropdown
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

// Probability breakdowns - 42.1M Hand Sample
const PROBABILITY_DATA = {
  bbjPerHand: 1 / 67498,
  bbjPerShowdown: 1 / 8962,
  showdownRate: 0.1328,
  avgPlayers: 5.96,
  // Sample composition
  totalHandsAnalyzed: 42118396,
  regularHands: 8186000,
  rushCashHands: 33932396,
  totalShowdowns: 5592311,
  totalBBJsFound: 624,
  duplicatesSkipped: 86311,
  totalFeesUSD: 9037553.51,
  totalFeesBB: 5226344.44,
  // Player probabilities
  handsToSeeOneBBJ: 67498,
  // To WIN the jackpot (be the bad beat loser with AAATT or better)
  // 67,498 hands × (5.96 players / 2 involved) = ~201,184 hands to be involved
  // Then 50% chance you're the loser = ~402,368 hands to WIN jackpot
  handsToWinJackpot: Math.round(67498 * 5.96 / 2 * 2), // ~402,368
  handsToBeOpponent: Math.round(67498 * 5.96 / 2 * 2), // ~402,368 (same odds)
  handsToGetTableShare: Math.round(67498 * 5.96 / (5.96 - 2)), // ~101,583
  triggerHand: 'AAATT or better',
  // EV Return data at different pool levels (per 1 bb of fees)
  returnAt8000bb: 0.9552,   // -0.0934 bb/100 net
  returnAt8500bb: 1.0149,   // +0.0310 bb/100 net
  returnAt9000bb: 1.0746,   // +0.1553 bb/100 net
  returnAt9500bb: 1.1343,   // +0.2797 bb/100 net
  returnAt10000bb: 1.1940,  // +0.4040 bb/100 net
};

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
  // CALCULATION FUNCTIONS
  // ============================================

  const calculateEV = (pool: number, stake: string = selectedStake): EVResult => {
    const stakeOption = STAKE_OPTIONS.find(s => s.value === stake) || STAKE_OPTIONS[4]; // Default to 0.50/1
    
    // Calculate this stake's portion of the pool
    const stakePoolSize = pool * (stakeOption.poolPercent / 100);
    
    // Calculate payouts when BBJ hits (in USD)
    // Total payout is ~17.8% of stake pool (10% + 3% + ~4.8% for table)
    const avgTablePlayers = BBJ_CONSTANTS.avgPlayersPerTable;
    const otherPlayers = avgTablePlayers - 2; // ~3.79 players get table share
    
    const jackpotWinnerPayout = stakePoolSize * 0.10;  // 10% - Bad Beat Winner
    const opponentPayout = stakePoolSize * 0.03;       // 3% - Bad Beat Opponent  
    const tableSharePayout = stakePoolSize * 0.008;    // 0.8% each - Rest of players
    const totalPayoutAtStake = jackpotWinnerPayout + opponentPayout + (tableSharePayout * otherPlayers);
    
    // Convert to BB for the selected stake
    const bbValue = stakeOption.bbValue;
    const jackpotWinnerBB = jackpotWinnerPayout / bbValue;
    const opponentBB = opponentPayout / bbValue;
    const tableShareBB = tableSharePayout / bbValue;
    
    // Expected payout per BBJ at table (weighted by probability of each outcome)
    // P(jackpot winner) = 1/5.79, P(opponent) = 1/5.79, P(table share) = 3.79/5.79
    const expectedPayoutPerBBJ = 
      (1 / avgTablePlayers) * jackpotWinnerBB +
      (1 / avgTablePlayers) * opponentBB +
      (otherPlayers / avgTablePlayers) * tableShareBB;
    
    // Total payout in bb (for display)
    const payoutBB = totalPayoutAtStake / bbValue;
    
    // Calculate EV per 100 hands
    // BBJ hits 1 in 101,940 hands, so expected payouts per 100 hands:
    const expectedPayoutPer100 = (100 / BBJ_CONSTANTS.handsPerBBJ) * expectedPayoutPerBBJ;
    
    // Net BB/100 = Expected payouts - Fees paid
    const netBBper100 = expectedPayoutPer100 - BBJ_CONSTANTS.bbPer100Fees;
    
    // Return ratio (for breakeven comparison)
    const returnRatio = expectedPayoutPer100 / BBJ_CONSTANTS.bbPer100Fees;
    
    const isProfitable = netBBper100 >= 0;
    const percentToBreakeven = returnRatio * 100;
    
    // Calculate pool needed for breakeven
    // At breakeven: expectedPayoutPer100 = bbPer100Fees
    // This means we need: (100/101940) * expectedPayoutPerBBJ = 1.8042
    // So expectedPayoutPerBBJ = 1.8042 * 101940 / 100 = 1838.94 bb
    // Working backwards to find required pool...
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
    
    // Expected number of BBJs seen (Poisson lambda)
    const lambda = hands / BBJ_CONSTANTS.handsPerBBJ;
    
    // Total fees paid in bb
    const totalFeesPaid = (hands / 100) * BBJ_CONSTANTS.bbPer100Fees;
    
    // Calculate stake pool and payouts
    const stakePoolSize = pool * (stakeOption.poolPercent / 100);
    const avgTablePlayers = BBJ_CONSTANTS.avgPlayersPerTable;
    const otherPlayers = avgTablePlayers - 2;
    
    // Payouts in BB
    const jackpotWinnerBB = (stakePoolSize * 0.10) / bbValue;
    const opponentBB = (stakePoolSize * 0.03) / bbValue;
    const tableShareBB = (stakePoolSize * 0.008) / bbValue;
    
    // Expected payout per BBJ (weighted by probability)
    const expectedPayoutPerBBJ = 
      (1 / avgTablePlayers) * jackpotWinnerBB +
      (1 / avgTablePlayers) * opponentBB +
      (otherPlayers / avgTablePlayers) * tableShareBB;
    
    // Expected total payouts
    const expectedPayouts = lambda * expectedPayoutPerBBJ;
    
    // Expected profit (EV)
    const expectedProfit = expectedPayouts - totalFeesPaid;
    
    // Variance calculation
    // When BBJ hits, variance comes from which role you get
    const varianceOfSingleBBJ = 
      (1 / avgTablePlayers) * Math.pow(jackpotWinnerBB - expectedPayoutPerBBJ, 2) +
      (1 / avgTablePlayers) * Math.pow(opponentBB - expectedPayoutPerBBJ, 2) +
      (otherPlayers / avgTablePlayers) * Math.pow(tableShareBB - expectedPayoutPerBBJ, 2);
    
    // Total variance = E[N] * Var(X) + Var(N) * E[X]^2 (for compound Poisson)
    const totalVariance = lambda * varianceOfSingleBBJ + lambda * Math.pow(expectedPayoutPerBBJ, 2);
    const stdDeviation = Math.sqrt(totalVariance);
    
    // Confidence intervals using normal approximation
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
    
    // Probability of profit
    const zScore = expectedProfit / (stdDeviation || 1);
    const probabilityOfProfit = 0.5 * (1 + erf(zScore / Math.sqrt(2)));
    
    // Worst/Best case scenarios
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

  // Error function approximation for normal CDF
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
    
    // Use requestAnimationFrame to not block UI
    requestAnimationFrame(() => {
      const result = calculateVariance(simulationHands, poolSize, selectedStake);
      setVarianceResult(result);
      
      // Run Monte Carlo simulation
      runMonteCarloSimulation();
    });
  };

  const runMonteCarloSimulation = useCallback(() => {
    const stakeOption = STAKE_OPTIONS.find(s => s.value === selectedStake) || STAKE_OPTIONS[4];
    const bbValue = stakeOption.bbValue;
    const stakePoolSize = poolSize * (stakeOption.poolPercent / 100);
    const avgTablePlayers = BBJ_CONSTANTS.avgPlayersPerTable;
    
    // Payouts in BB
    const jackpotWinnerBB = (stakePoolSize * 0.10) / bbValue;
    const opponentBB = (stakePoolSize * 0.03) / bbValue;
    const tableShareBB = (stakePoolSize * 0.008) / bbValue;
    
    // Fee per hand in bb
    const feePerHand = BBJ_CONSTANTS.bbPer100Fees / 100;
    
    // Probability per hand
    const pBBJ = 1 / BBJ_CONSTANTS.handsPerBBJ;
    
    const trials: SimulationTrial[] = [];
    const actualHandsPerTrial = simulationHands;
    
    // Number of sample points for the chart (per trial)
    const samplePoints = 200;
    const handsPerSample = Math.floor(actualHandsPerTrial / samplePoints);
    
    let currentTrial = 0;
    
    const processBatch = () => {
      const batchSize = Math.min(5, numTrials - currentTrial);
      
      for (let b = 0; b < batchSize; b++) {
        const trialNum = currentTrial + b;
        
        // Generate BBJ hit times using inverse transform sampling
        const bbjTimes: number[] = [];
        let t = 0;
        while (t < actualHandsPerTrial) {
          // Time to next BBJ follows exponential distribution
          const u = Math.random();
          const timeTillNext = Math.floor(-Math.log(u) / pBBJ);
          t += timeTillNext;
          if (t < actualHandsPerTrial) {
            bbjTimes.push(t);
          }
        }
        
        // Determine role for each BBJ
        const bbjEvents: { hand: number; payout: number; type: string }[] = [];
        let jackpotWins = 0;
        let opponentWins = 0;
        let tableShares = 0;
        
        for (const bbjHand of bbjTimes) {
          const roll = Math.random();
          const pJackpot = 1 / avgTablePlayers;
          const pOpponent = 1 / avgTablePlayers;
          
          let payout = 0;
          let type = '';
          
          if (roll < pJackpot) {
            payout = jackpotWinnerBB;
            jackpotWins++;
            type = 'jackpot';
          } else if (roll < pJackpot + pOpponent) {
            payout = opponentBB;
            opponentWins++;
            type = 'opponent';
          } else {
            payout = tableShareBB;
            tableShares++;
            type = 'table';
          }
          
          bbjEvents.push({ hand: bbjHand, payout, type });
        }
        
        // Generate timeline
        const timeline: { hands: number; profit: number }[] = [];
        let currentProfit = 0;
        let nextBBJIndex = 0;
        
        for (let i = 0; i <= samplePoints; i++) {
          const currentHand = i * handsPerSample;
          
          // Apply fees up to this point
          const feesAtThisPoint = currentHand * feePerHand;
          
          // Apply any BBJ payouts that occurred before this point
          let payoutsAtThisPoint = 0;
          while (nextBBJIndex < bbjEvents.length && bbjEvents[nextBBJIndex].hand <= currentHand) {
            payoutsAtThisPoint += bbjEvents[nextBBJIndex].payout;
            nextBBJIndex++;
          }
          
          // Recalculate profit including this segment
          const totalPayoutsSoFar = bbjEvents
            .filter(e => e.hand <= currentHand)
            .reduce((sum, e) => sum + e.payout, 0);
          
          currentProfit = totalPayoutsSoFar - feesAtThisPoint;
          
          timeline.push({ hands: currentHand, profit: currentProfit });
        }
        
        const totalPayout = jackpotWins * jackpotWinnerBB + opponentWins * opponentBB + tableShares * tableShareBB;
        const feesPaid = actualHandsPerTrial * feePerHand;
        const netProfit = totalPayout - feesPaid;
        
        trials.push({
          trialNumber: trialNum + 1,
          bbjsHit: bbjTimes.length,
          jackpotWins,
          opponentWins,
          tableShares,
          totalPayout,
          feesPaid,
          netProfit,
          timeline,
        });
      }
      
      currentTrial += batchSize;
      setSimulationProgress(Math.round((currentTrial / numTrials) * 100));
      
      if (currentTrial < numTrials) {
        requestAnimationFrame(processBatch);
      } else {
        // Calculate statistics
        const profits = trials.map(t => t.netProfit);
        profits.sort((a, b) => a - b);
        
        const sum = profits.reduce((a, b) => a + b, 0);
        const avg = sum / profits.length;
        const sortedProfits = [...profits].sort((a, b) => a - b);
        const median = sortedProfits[Math.floor(sortedProfits.length / 2)];
        const variance = profits.reduce((acc, p) => acc + Math.pow(p - avg, 2), 0) / profits.length;
        const stdDev = Math.sqrt(variance);
        const profitableCount = profits.filter(p => p >= 0).length;
        
        // Calculate top/bottom 20% averages
        const twentyPercent = Math.max(1, Math.floor(sortedProfits.length * 0.2));
        const bottom20Profits = sortedProfits.slice(0, twentyPercent);
        const top20Profits = sortedProfits.slice(-twentyPercent);
        const bottom20Avg = bottom20Profits.reduce((a, b) => a + b, 0) / bottom20Profits.length;
        const top20Avg = top20Profits.reduce((a, b) => a + b, 0) / top20Profits.length;
        
        // Convert to BB/100
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
    <svg ref={nachoRef} width="90" height="90" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 4px 12px rgba(255, 179, 71, 0.4))' }}>
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

  const NachoTriangle = ({ size, opacity }: { size: number; opacity: number }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ opacity }}>
      <path d="M10 2 L18 17 L2 17 Z" fill="#FFB347" opacity="0.8"/>
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

  // Format value for simulator - can be BB or $
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
    if (value > 0) return '#22c55e';
    if (value < 0) return '#ef4444';
    return 'rgba(255,255,255,0.6)';
  };

  const getStatusColor = (isProfitable: boolean): string => {
    return isProfitable ? '#22c55e' : '#ef4444';
  };

  // Progress bar component
  const ProgressBar = ({ value, max, color, showLabel = true }: { value: number; max: number; color: string; showLabel?: boolean }) => {
    const percentage = Math.min((value / max) * 100, 100);
    return (
      <div style={{ width: '100%' }}>
        <div style={{
          width: '100%',
          height: '8px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            borderRadius: '4px',
            transition: 'width 0.5s ease-out'
          }} />
        </div>
        {showLabel && (
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', textAlign: 'right' }}>
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
    
    // Color gradient from red (-EV) through yellow (0) to green (+EV)
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
      <div style={{ position: 'relative', width: '100%', height: '120px' }}>
        <svg viewBox="0 0 200 100" style={{ width: '100%', height: '100%' }}>
          {/* Background arc */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Colored arc based on value */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke={getGaugeColor(clampedValue)}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${clampedValue * 2.51} 251`}
            style={{ transition: 'stroke-dasharray 0.5s ease-out, stroke 0.5s ease-out' }}
          />
          {/* Center value display */}
          <text
            x="100"
            y="70"
            textAnchor="middle"
            fill={getGaugeColor(clampedValue)}
            fontSize="24"
            fontWeight="700"
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
          {/* Min/Max labels */}
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

  // Bar chart component
  const BarChart = ({ data, labelKey, valueKey, maxValue }: { data: any[]; labelKey: string; valueKey: string; maxValue?: number }) => {
    const max = maxValue || Math.max(...data.map(d => Math.abs(d[valueKey])));
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {data.map((item, index) => {
          const value = item[valueKey];
          const isPositive = value >= 0;
          const width = (Math.abs(value) / max) * 100;
          
          return (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '80px', fontSize: '11px', color: 'rgba(255,255,255,0.6)', textAlign: 'right', flexShrink: 0 }}>
                {item[labelKey]}
              </div>
              <div style={{ flex: 1, height: '24px', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: isPositive ? '50%' : `${50 - width / 2}%`,
                  width: `${width / 2}%`,
                  height: '100%',
                  background: isPositive 
                    ? 'linear-gradient(90deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.8))' 
                    : 'linear-gradient(90deg, rgba(239, 68, 68, 0.8), rgba(239, 68, 68, 0.3))',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease-out'
                }} />
                {/* Center line */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  bottom: 0,
                  width: '1px',
                  background: 'rgba(255,255,255,0.2)'
                }} />
              </div>
              <div style={{ 
                width: '70px', 
                fontSize: '12px', 
                fontWeight: '600',
                color: getEVColor(value),
                textAlign: 'left',
                flexShrink: 0
              }}>
                {value >= 0 ? '+' : ''}{value.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Line chart for simulation results showing bankroll over time
  const SimulationLineChart = ({ results }: { results: SimulationResults }) => {
    const chartWidth = 700;
    const chartHeight = 300;
    const padding = { top: 30, right: 60, bottom: 50, left: 80 };
    const innerWidth = chartWidth - padding.left - padding.right;
    const innerHeight = chartHeight - padding.top - padding.bottom;
    
    // Get BB value for conversion
    const stakeOption = STAKE_OPTIONS.find(s => s.value === selectedStake) || STAKE_OPTIONS[4];
    const bbValue = stakeOption.bbValue;
    
    // Convert value based on display mode
    const convertValue = (bb: number) => displayInDollars ? bb * bbValue : bb;
    
    // Get all profit values to determine Y scale
    const allProfits = results.trials.flatMap(t => t.timeline.map(p => convertValue(p.profit)));
    const minProfit = Math.min(...allProfits);
    const maxProfit = Math.max(...allProfits);
    const yRange = maxProfit - minProfit || 1;
    const yPadding = yRange * 0.1;
    const yMin = minProfit - yPadding;
    const yMax = maxProfit + yPadding;
    
    const maxHands = results.handsPerTrial;
    
    // Scale functions
    const scaleX = (hands: number) => padding.left + (hands / maxHands) * innerWidth;
    const scaleY = (profit: number) => padding.top + innerHeight - ((convertValue(profit) - yMin) / (yMax - yMin)) * innerHeight;
    
    // Y-axis zero line position
    const zeroY = padding.top + innerHeight - ((0 - yMin) / (yMax - yMin)) * innerHeight;
    
    // Generate path for each trial (limit to 20 for performance)
    const visibleTrials = results.trials;
    
    // Color palette for lines
    const getLineColor = (index: number, profit: number) => {
      if (profit >= 0) return `hsla(142, 70%, ${50 + (index % 3) * 10}%, 0.6)`;
      return `hsla(0, 70%, ${50 + (index % 3) * 10}%, 0.6)`;
    };
    
    // Format axis labels
    const formatAxisLabel = (value: number) => {
      if (Math.abs(value) >= 1000000000) return `${(value / 1000000000).toFixed(0)}B`;
      if (Math.abs(value) >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
      if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(0)}K`;
      return value.toFixed(0);
    };
    
    // Format Y-axis label with unit
    const formatYAxisLabel = (value: number) => {
      const formatted = formatAxisLabel(value);
      return displayInDollars ? `$${formatted}` : `${formatted} bb`;
    };
    
    return (
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg width={chartWidth} height={chartHeight} style={{ display: 'block', margin: '0 auto' }}>
          {/* Background */}
          <rect x={padding.left} y={padding.top} width={innerWidth} height={innerHeight} fill="rgba(255,255,255,0.02)" rx="4" />
          
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map(pct => (
            <line
              key={pct}
              x1={padding.left}
              y1={padding.top + innerHeight * pct}
              x2={padding.left + innerWidth}
              y2={padding.top + innerHeight * pct}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="4,4"
            />
          ))}
          
          {/* Zero line (if visible) */}
          {yMin < 0 && yMax > 0 && (
            <line
              x1={padding.left}
              y1={zeroY}
              x2={padding.left + innerWidth}
              y2={zeroY}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            />
          )}
          
          {/* Trial lines */}
          {visibleTrials.map((trial, index) => {
            const pathData = trial.timeline
              .map((point, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(point.hands)} ${scaleY(point.profit)}`)
              .join(' ');
            
            return (
              <path
                key={trial.trialNumber}
                d={pathData}
                fill="none"
                stroke={getLineColor(index, trial.netProfit)}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}
          
          {/* Average line (highlighted) */}
          {results.trials.length > 0 && (() => {
            // Calculate average timeline
            const avgTimeline: { hands: number; profit: number }[] = [];
            const sampleCount = results.trials[0].timeline.length;
            
            for (let i = 0; i < sampleCount; i++) {
              const hands = results.trials[0].timeline[i].hands;
              const avgProfit = results.trials.reduce((sum, t) => sum + t.timeline[i].profit, 0) / results.trials.length;
              avgTimeline.push({ hands, profit: avgProfit });
            }
            
            const pathData = avgTimeline
              .map((point, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(point.hands)} ${scaleY(point.profit)}`)
              .join(' ');
            
            return (
              <path
                d={pathData}
                fill="none"
                stroke="#FFB347"
                strokeWidth="3"
                strokeLinecap="round"
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
            <line x1="0" y1="8" x2="25" y2="8" stroke="#FFB347" strokeWidth="3" />
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
    <>
      <NachosPokerNavBar />
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
            } as React.CSSProperties}
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
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
        }
        .input-focus {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .input-focus:focus {
          border-color: #FFB347 !important;
          box-shadow: 0 0 0 3px rgba(255, 179, 71, 0.15);
          outline: none;
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

        .input-field {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 12px 16px;
          color: #ffffff;
          font-size: 14px;
          width: 100%;
          box-sizing: border-box;
        }
        .input-field::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 179, 71, 0.2);
        }

        .ev-positive {
          background: rgba(34, 197, 94, 0.1);
          border-color: rgba(34, 197, 94, 0.3);
        }
        .ev-negative {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
        }
        .ev-neutral {
          background: rgba(255, 179, 71, 0.1);
          border-color: rgba(255, 179, 71, 0.3);
        }

        .shimmer-text {
          background: linear-gradient(90deg, #FFB347 0%, #fff 50%, #FFB347 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      <div style={{position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', padding: '20px'}}>
        {/* Header Banner - CTA */}
        <div 
          className="card-hover spark-border"
          style={{
            marginBottom: '30px',
            padding: '28px 32px',
            animation: 'fadeInUp 0.6s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }}
        >
          <div style={{ flexShrink: 0, animation: 'bounce 2s ease-in-out infinite' }}>
            <CartoonNacho />
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{fontSize: '12px', color: '#FFB347', fontWeight: '600', marginBottom: '6px', letterSpacing: '0.1em', textTransform: 'uppercase'}}>
              Crafted by FreeNachos
            </div>
            <h2 style={{fontSize: '22px', fontWeight: '700', color: '#ffffff', marginBottom: '8px', lineHeight: 1.2}}>
              The house always wins. <span style={{ color: 'rgba(255,255,255,0.5)' }}>But by how much?</span>
            </h2>
            <p style={{fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '0', lineHeight: 1.5, maxWidth: '480px'}}>
              Bad Beat Jackpots look tempting — until you do the math. See exactly when the pool makes it worth chasing, and when you're just padding the casino's pockets.
            </p>
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0}}>
            <a 
              href="https://www.nachospoker.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-hover"
              style={{
                background: '#FFB347',
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
              href="https://www.freenachoscoaching.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-hover"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 179, 71, 0.5)',
                color: '#FFB347',
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

        {/* Data Methodology Explanation */}
        <div 
          className="glass-card"
          style={{
            borderRadius: '16px', 
            padding: '24px 32px', 
            marginBottom: '30px',
            animation: 'fadeInUp 0.6s ease-out 0.05s both',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ 
              flexShrink: 0, 
              background: 'rgba(255, 179, 71, 0.15)', 
              borderRadius: '10px', 
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={24} color="#FFB347" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
                About This Data
              </h3>
              
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.8, margin: '0 0 12px 0' }}>
                Based on <strong style={{ color: '#FFB347' }}>42.1 million hands</strong> from GGPoker NL100+. 
                We found <strong style={{ color: '#FFB347' }}>624 BBJ triggers</strong> — a frequency of <strong>1 in 67,500 hands</strong>.
              </p>
              
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                Sample: 8.2M regular hands + 33.9M Rush & Cash. Rush plays faster (new table each hand) but BBJ rules are identical — combining both ensures robust data.
              </p>
              
              {/* Two key numbers */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1, background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>YOUR JACKPOT "RAKE"</div>
                  <div style={{ fontSize: '28px', color: '#ef4444', fontWeight: '700' }}>2.08 bb/100</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(255, 179, 71, 0.08)', border: '1px solid rgba(255, 179, 71, 0.15)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>BREAK-EVEN POOL</div>
                  <div style={{ fontSize: '28px', color: '#FFB347', fontWeight: '700' }}>~$2.02M</div>
                </div>
              </div>

              {/* Simple verdict */}
              <div style={{ 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.08)', 
                borderRadius: '8px', 
                padding: '12px',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.6)',
                lineHeight: 1.6
              }}>
                <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Note on variance:</strong> Even with 42M hands and 624 observed BBJs, statistical variance means the true frequency could range from ~1 in 55K to ~1 in 85K hands. Use these numbers as strong estimates, not guarantees.
              </div>
              
              {/* Your Odds of Winning */}
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ color: '#FFB347', marginBottom: '16px', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Your Odds of Winning
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                  <div style={{ background: 'rgba(255, 179, 71, 0.08)', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>SEE BBJ AT TABLE</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#FFB347' }}>1 in 67.5K</div>
                  </div>
                  <div style={{ background: 'rgba(34, 197, 94, 0.08)', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>WIN JACKPOT (10%)</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#22c55e' }}>1 in 402K</div>
                  </div>
                  <div style={{ background: 'rgba(59, 130, 246, 0.08)', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>WIN OPPONENT (3%)</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#60a5fa' }}>1 in 402K</div>
                  </div>
                  <div style={{ background: 'rgba(168, 85, 247, 0.08)', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>TABLE SHARE (0.8%)</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#a855f7' }}>1 in 102K</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Variance Calculator Card */}
        <div 
          className="card-hover glass-card"
          style={{
            borderRadius: '16px', 
            padding: '40px', 
            marginBottom: '30px',
            animation: 'fadeInUp 0.6s ease-out 0.2s both'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
            <LineChart size={28} color="#FFB347" />
            <h1 style={{
              textAlign: 'center', 
              fontSize: '2em', 
              margin: 0,
              color: '#ffffff',
              fontWeight: '700'
            }}>
              Monte Carlo Simulator
            </h1>
          </div>
          <p style={{textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '30px'}}>
            Run thousands of simulated poker sessions to see the range of possible outcomes
          </p>

          {/* Calculator Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {/* Hands Per Trial */}
            <div className="glass-card" style={{ padding: '20px', borderRadius: '12px' }}>
              <h3 style={{ color: '#FFB347', marginBottom: '12px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Hands Per Trial
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {[100000, 1000000, 10000000, 100000000, 1000000000, 10000000000].map(preset => (
                  <button
                    key={preset}
                    onClick={() => setSimulationHands(preset)}
                    style={{
                      background: simulationHands === preset ? '#FFB347' : 'rgba(255,255,255,0.08)',
                      color: simulationHands === preset ? '#0a0a0a' : 'rgba(255,255,255,0.7)',
                      border: simulationHands === preset ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      padding: '6px 4px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {preset >= 1000000000 ? `${preset / 1000000000}B` : preset >= 1000000 ? `${preset / 1000000}M` : `${preset / 1000}K`}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: '8px', fontSize: '9px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 1.4 }}>
                {(() => {
                  const handsPerYear = 250 * 20 * 52;
                  const yearsNeeded = simulationHands / handsPerYear;
                  const startYear = Math.round(2026 - yearsNeeded);
                  let era = '';
                  if (startYear < -3000) era = ' (Bronze Age)';
                  else if (startYear < -500) era = ' (Ancient Egypt)';
                  else if (startYear < 0) era = ' (Roman Era)';
                  else if (startYear < 500) era = ' (Fall of Rome)';
                  else if (startYear < 1500) era = ' (Medieval)';
                  const yearDisplay = startYear < 0 ? `${Math.abs(startYear)} BC` : `${startYear}`;
                  return <>250 hands/hr, 20 hrs/week<br/>= started in <strong style={{ color: '#FFB347' }}>{yearDisplay}</strong>{era}</>;
                })()}
              </div>
            </div>

            {/* Number of Simulations */}
            <div className="glass-card" style={{ padding: '20px', borderRadius: '12px' }}>
              <h3 style={{ color: '#FFB347', marginBottom: '12px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Simulations
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                {[10, 25, 50, 100].map(preset => (
                  <button
                    key={preset}
                    onClick={() => setNumTrials(preset)}
                    style={{
                      background: numTrials === preset ? '#FFB347' : 'rgba(255,255,255,0.08)',
                      color: numTrials === preset ? '#0a0a0a' : 'rgba(255,255,255,0.7)',
                      border: numTrials === preset ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      padding: '8px 6px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: '8px', fontSize: '10px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                Total: {(simulationHands * numTrials) >= 1000000000 
                  ? `${((simulationHands * numTrials) / 1000000000).toFixed(1)}B` 
                  : `${((simulationHands * numTrials) / 1000000).toFixed(0)}M`} hands
              </div>
            </div>

            {/* Your Stakes */}
            <div className="glass-card" style={{ padding: '20px', borderRadius: '12px' }}>
              <h3 style={{ color: '#FFB347', marginBottom: '12px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Your Stakes
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
                {STAKE_OPTIONS.slice(0, 6).map(stake => (
                  <button
                    key={stake.value}
                    onClick={() => setSelectedStake(stake.value)}
                    style={{
                      background: selectedStake === stake.value ? '#FFB347' : 'rgba(255,255,255,0.08)',
                      color: selectedStake === stake.value ? '#0a0a0a' : 'rgba(255,255,255,0.7)',
                      border: selectedStake === stake.value ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      padding: '6px 4px',
                      borderRadius: '5px',
                      fontSize: '10px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {stake.label.replace('$', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* BBJ Pool Size */}
            <div className="glass-card" style={{ padding: '20px', borderRadius: '12px' }}>
              <h3 style={{ color: '#FFB347', marginBottom: '12px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                BBJ Pool Size
              </h3>
              <input
                type="number"
                className="input-field input-focus"
                value={poolSize}
                onChange={(e) => setPoolSize(parseFloat(e.target.value) || 0)}
                style={{ padding: '8px 10px', fontSize: '13px', marginBottom: '8px' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
                {[1800000, 2200000, 2400000].map(preset => (
                  <button
                    key={preset}
                    onClick={() => setPoolSize(preset)}
                    style={{
                      background: poolSize === preset ? '#FFB347' : 'rgba(255,255,255,0.08)',
                      color: poolSize === preset ? '#0a0a0a' : 'rgba(255,255,255,0.6)',
                      border: 'none',
                      padding: '5px 4px',
                      borderRadius: '4px',
                      fontSize: '9px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    ${(preset / 1000000).toFixed(1)}M
                  </button>
                ))}
                <button
                  onClick={() => setPoolSize(2017000)}
                  style={{
                    background: poolSize === 2017000 ? '#22c55e' : 'rgba(34, 197, 94, 0.15)',
                    color: poolSize === 2017000 ? '#0a0a0a' : '#22c55e',
                    border: poolSize === 2017000 ? 'none' : '1px solid rgba(34, 197, 94, 0.3)',
                    padding: '5px 4px',
                    borderRadius: '4px',
                    fontSize: '9px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Break-even
                </button>
              </div>
            </div>
          </div>

          {/* Run Simulation Button */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <button
              onClick={runSimulation}
              disabled={isCalculating}
              className="btn-hover"
              style={{
                background: isCalculating ? 'rgba(255, 179, 71, 0.3)' : '#FFB347',
                color: isCalculating ? 'rgba(0,0,0,0.5)' : '#0a0a0a',
                padding: '16px 48px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '16px',
                border: 'none',
                cursor: isCalculating ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: isCalculating ? 'none' : '0 4px 20px rgba(255, 179, 71, 0.3)',
                minWidth: '280px',
                justifyContent: 'center'
              }}
            >
              {isCalculating ? (
                <>
                  <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  Simulating... {simulationProgress}%
                </>
              ) : (
                <>
                  <Play size={20} />
                  Run {numTrials} Simulations
                </>
              )}
            </button>
            {isCalculating && (
              <div style={{ marginTop: '12px', maxWidth: '400px', margin: '12px auto 0' }}>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${simulationProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #FFB347, #22c55e)',
                    borderRadius: '3px',
                    transition: 'width 0.3s ease-out'
                  }} />
                </div>
              </div>
            )}
          </div>

          {/* Simulation Results with Line Chart */}
          {simulationResults && !isCalculating && (
            <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
              <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginBottom: '16px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <BarChart3 size={20} color="#FFB347" />
                Results: {simulationResults.totalTrials} simulations of {simulationResults.handsPerTrial >= 1000000000 ? `${(simulationResults.handsPerTrial / 1000000000)}B` : simulationResults.handsPerTrial >= 1000000 ? `${(simulationResults.handsPerTrial / 1000000)}M` : `${(simulationResults.handsPerTrial / 1000).toLocaleString()}K`} hands each
              </h3>
              
              {/* Display Toggle */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <button
                    onClick={() => setDisplayInDollars(false)}
                    style={{
                      padding: '8px 20px',
                      background: !displayInDollars ? '#FFB347' : 'rgba(255,255,255,0.08)',
                      color: !displayInDollars ? '#0a0a0a' : 'rgba(255,255,255,0.7)',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Show in BB
                  </button>
                  <button
                    onClick={() => setDisplayInDollars(true)}
                    style={{
                      padding: '8px 20px',
                      background: displayInDollars ? '#FFB347' : 'rgba(255,255,255,0.08)',
                      color: displayInDollars ? '#0a0a0a' : 'rgba(255,255,255,0.7)',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Show in $
                  </button>
                </div>
              </div>

              {/* Line Chart */}
              <div className="glass-card" style={{ padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
                <h4 style={{ color: '#FFB347', marginBottom: '16px', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LineChart size={16} /> Bankroll Over Time ({simulationResults.totalTrials} trials shown)
                </h4>
                <SimulationLineChart results={simulationResults} />
                <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                  Lines trend down from fees ({BBJ_CONSTANTS.bbPer100Fees.toFixed(2)} bb/100), jump up when BBJ hits
                </div>
              </div>

              {/* Summary Statistics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div className="stat-card">
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Average BB/100
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: getEVColor(simulationResults.averageProfit) }}>
                    {((simulationResults.averageProfit / simulationResults.handsPerTrial) * 100) >= 0 ? '+' : ''}{((simulationResults.averageProfit / simulationResults.handsPerTrial) * 100).toFixed(4)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                    across all {simulationResults.totalTrials} trials
                  </div>
                </div>

                <div className="stat-card">
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Median BB/100
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: getEVColor(simulationResults.medianProfit) }}>
                    {((simulationResults.medianProfit / simulationResults.handsPerTrial) * 100) >= 0 ? '+' : ''}{((simulationResults.medianProfit / simulationResults.handsPerTrial) * 100).toFixed(4)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                    typical outcome
                  </div>
                </div>

                <div className="stat-card">
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Top 20% Avg BB/100
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e' }}>
                    {simulationResults.top20BBper100 >= 0 ? '+' : ''}{simulationResults.top20BBper100.toFixed(4)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                    luckiest {Math.max(1, Math.floor(simulationResults.totalTrials * 0.2))} trials
                  </div>
                </div>

                <div className="stat-card">
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Bottom 20% Avg BB/100
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>
                    {simulationResults.bottom20BBper100 >= 0 ? '+' : ''}{simulationResults.bottom20BBper100.toFixed(4)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                    unluckiest {Math.max(1, Math.floor(simulationResults.totalTrials * 0.2))} trials
                  </div>
                </div>
              </div>

              {/* Range Statistics */}
              <div className="glass-card" style={{ padding: '20px', borderRadius: '12px' }}>
                <h4 style={{ color: '#FFB347', marginBottom: '16px', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Outcome Range
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Worst Trial</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#ef4444' }}>
                      {formatSimValue(simulationResults.minProfit, true)}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: '200px', padding: '0 20px' }}>
                    <div style={{ position: 'relative', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                      {/* Range bar */}
                      <div style={{
                        position: 'absolute',
                        left: '0%',
                        right: '0%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #ef4444, #FFB347, #22c55e)',
                        borderRadius: '4px',
                        opacity: 0.6
                      }} />
                      {/* Average marker */}
                      <div style={{
                        position: 'absolute',
                        left: `${((simulationResults.averageProfit - simulationResults.minProfit) / (simulationResults.maxProfit - simulationResults.minProfit)) * 100}%`,
                        top: '-4px',
                        width: '4px',
                        height: '16px',
                        background: '#FFB347',
                        borderRadius: '2px',
                        transform: 'translateX(-50%)'
                      }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Best Trial</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#22c55e' }}>
                      {formatSimValue(simulationResults.maxProfit, true)}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                  Range: {formatSimValue(simulationResults.maxProfit - simulationResults.minProfit)} spread between best and worst outcomes
                </div>
              </div>

              {/* Variance Summary */}
              {(() => {
                // Sort trials by profit
                const sortedTrials = [...simulationResults.trials].sort((a, b) => a.netProfit - b.netProfit);
                const twentyPercent = Math.max(1, Math.floor(sortedTrials.length * 0.2));
                
                // Bottom 20% (worst performers)
                const bottom20 = sortedTrials.slice(0, twentyPercent);
                const bottom20Avg = {
                  netProfit: bottom20.reduce((sum, t) => sum + t.netProfit, 0) / bottom20.length,
                  bbjsHit: (bottom20.reduce((sum, t) => sum + t.bbjsHit, 0) / bottom20.length).toFixed(1),
                  jackpotWins: (bottom20.reduce((sum, t) => sum + t.jackpotWins, 0) / bottom20.length).toFixed(2),
                  opponentWins: (bottom20.reduce((sum, t) => sum + t.opponentWins, 0) / bottom20.length).toFixed(2),
                  tableShares: (bottom20.reduce((sum, t) => sum + t.tableShares, 0) / bottom20.length).toFixed(1),
                  feesPaid: bottom20.reduce((sum, t) => sum + t.feesPaid, 0) / bottom20.length,
                };
                
                // Top 20% (best performers)
                const top20 = sortedTrials.slice(-twentyPercent);
                const top20Avg = {
                  netProfit: top20.reduce((sum, t) => sum + t.netProfit, 0) / top20.length,
                  bbjsHit: (top20.reduce((sum, t) => sum + t.bbjsHit, 0) / top20.length).toFixed(1),
                  jackpotWins: (top20.reduce((sum, t) => sum + t.jackpotWins, 0) / top20.length).toFixed(2),
                  opponentWins: (top20.reduce((sum, t) => sum + t.opponentWins, 0) / top20.length).toFixed(2),
                  tableShares: (top20.reduce((sum, t) => sum + t.tableShares, 0) / top20.length).toFixed(1),
                  feesPaid: top20.reduce((sum, t) => sum + t.feesPaid, 0) / top20.length,
                };
                
                const handsLabel = simulationResults.handsPerTrial >= 1000000000 
                  ? `${(simulationResults.handsPerTrial / 1000000000)}B` 
                  : simulationResults.handsPerTrial >= 1000000 
                    ? `${(simulationResults.handsPerTrial / 1000000)}M` 
                    : `${(simulationResults.handsPerTrial / 1000)}K`;
                
                // 250 hands/hr × 30 hrs/week × 52 weeks = 390,000 hands/year
                const handsPerYear = 250 * 30 * 52;
                const yearsNeeded = simulationResults.handsPerTrial / handsPerYear;
                const startYear = Math.round(2026 - yearsNeeded);
                
                let startYearDisplay;
                if (startYear < -3000) {
                  startYearDisplay = `${Math.abs(startYear)} BC (Bronze Age) 🏺`;
                } else if (startYear < -500) {
                  startYearDisplay = `${Math.abs(startYear)} BC`;
                } else if (startYear < 0) {
                  startYearDisplay = `${Math.abs(startYear)} BC`;
                } else if (startYear < 1900) {
                  startYearDisplay = `the year ${startYear}`;
                } else {
                  startYearDisplay = startYear.toString();
                }
                
                const stakeOption = STAKE_OPTIONS.find(s => s.value === selectedStake) || STAKE_OPTIONS[4];
                
                return (
                  <div className="glass-card" style={{ 
                    padding: '28px', 
                    borderRadius: '12px', 
                    marginTop: '24px',
                    background: 'rgba(255, 179, 71, 0.05)',
                    border: '1px solid rgba(255, 179, 71, 0.2)'
                  }}>
                    <h4 style={{ color: '#FFB347', marginBottom: '20px', fontSize: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <AlertTriangle size={20} /> What This Variance Actually Means
                    </h4>
                    
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: '0 0 24px 0' }}>
                      Over <strong style={{ color: '#FFB347' }}>{handsLabel} hands</strong> (playing 30 hrs/week since <strong style={{ color: '#FFB347' }}>{startYearDisplay}</strong>), 
                      we ran <strong style={{ color: '#FFB347' }}>{simulationResults.totalTrials} simulations</strong>. 
                      Here's how the bottom 20% compares to the top 20%:
                    </p>
                    
                    {/* Comparison Table */}
                    <div style={{ 
                      background: 'rgba(0,0,0,0.3)', 
                      borderRadius: '12px', 
                      overflow: 'hidden',
                      marginBottom: '20px'
                    }}>
                      {/* Header Row */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr 1fr', 
                        padding: '14px 20px',
                        background: 'rgba(255,255,255,0.05)',
                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>METRIC</div>
                        <div style={{ fontSize: '15px', color: '#ef4444', fontWeight: '700', textAlign: 'center' }}>😢 BOTTOM 20%</div>
                        <div style={{ fontSize: '15px', color: '#22c55e', fontWeight: '700', textAlign: 'center' }}>🎉 TOP 20%</div>
                      </div>
                      
                      {/* Net Result Row */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr 1fr', 
                        padding: '16px 20px',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        background: 'rgba(255, 179, 71, 0.05)'
                      }}>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>Net Result</div>
                        <div style={{ fontSize: '18px', color: '#ef4444', fontWeight: '700', textAlign: 'center' }}>
                          {formatSimValue(bottom20Avg.netProfit, true)}
                        </div>
                        <div style={{ fontSize: '18px', color: '#22c55e', fontWeight: '700', textAlign: 'center' }}>
                          {formatSimValue(top20Avg.netProfit, true)}
                        </div>
                      </div>
                      
                      {/* BBJs at Table Row */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr 1fr', 
                        padding: '12px 20px',
                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>BBJs at Table</div>
                        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontWeight: '600' }}>{bottom20Avg.bbjsHit}</div>
                        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontWeight: '600' }}>{top20Avg.bbjsHit}</div>
                      </div>
                      
                      {/* Jackpot Wins Row */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr 1fr', 
                        padding: '12px 20px',
                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Jackpot Wins (10%)</div>
                        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontWeight: '600' }}>{bottom20Avg.jackpotWins}</div>
                        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontWeight: '600' }}>{top20Avg.jackpotWins}</div>
                      </div>
                      
                      {/* Opponent Wins Row */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr 1fr', 
                        padding: '12px 20px',
                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Opponent Wins (3%)</div>
                        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontWeight: '600' }}>{bottom20Avg.opponentWins}</div>
                        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontWeight: '600' }}>{top20Avg.opponentWins}</div>
                      </div>
                      
                      {/* Table Shares Row */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr 1fr', 
                        padding: '12px 20px',
                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Table Shares (0.8%)</div>
                        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontWeight: '600' }}>{bottom20Avg.tableShares}</div>
                        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontWeight: '600' }}>{top20Avg.tableShares}</div>
                      </div>
                      
                      {/* Fees Paid Row */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr 1fr', 
                        padding: '12px 20px'
                      }}>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Fees Paid</div>
                        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontWeight: '600' }}>{formatSimValue(bottom20Avg.feesPaid)}</div>
                        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontWeight: '600' }}>{formatSimValue(top20Avg.feesPaid)}</div>
                      </div>
                    </div>
                    
                    {/* Summary */}
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px 20px',
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.8)'
                    }}>
                      <div style={{ 
                        flexShrink: 0,
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'rgba(255, 179, 71, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                      }}>
                        📊
                      </div>
                      <div>
                        <strong style={{ color: '#FFB347' }}>The Gap: </strong>
                        <strong style={{ color: '#ffffff' }}>{formatSimValue(top20Avg.netProfit - bottom20Avg.netProfit)}</strong> difference.
                        {simulationResults.profitableTrials < simulationResults.totalTrials && simulationResults.profitableTrials > 0 && (
                          <span>
                            {' '}Only <strong style={{ color: simulationResults.profitableTrials / simulationResults.totalTrials >= 0.5 ? '#22c55e' : '#ef4444' }}>
                              {((simulationResults.profitableTrials / simulationResults.totalTrials) * 100).toFixed(0)}%
                            </strong> of simulations were profitable.
                          </span>
                        )}
                        {simulationResults.profitableTrials === 0 && (
                          <span style={{ color: '#ef4444' }}>
                            {' '}<strong>0%</strong> of simulations were profitable.
                          </span>
                        )}
                        {simulationResults.profitableTrials === simulationResults.totalTrials && (
                          <span style={{ color: '#22c55e' }}>
                            {' '}<strong>100%</strong> of simulations were profitable!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Empty State */}
          {!simulationResults && !isCalculating && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '12px',
              border: '1px dashed rgba(255, 255, 255, 0.1)'
            }}>
              <LineChart size={40} color="rgba(255,255,255,0.2)" style={{ marginBottom: '12px' }} />
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                No simulation run yet
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                Configure your settings above and click "Run Simulations" to see how variance affects your bankroll across {numTrials} simulated poker sessions of {simulationHands >= 1000000000 ? `${(simulationHands / 1000000000)}B` : simulationHands >= 1000000 ? `${(simulationHands / 1000000)}M` : `${(simulationHands / 1000).toLocaleString()}K`} hands each
              </div>
            </div>
          )}
        </div>

        {/* Main Dashboard Card */}
        <div 
          className="card-hover glass-card"
          style={{
            borderRadius: '16px', 
            padding: '40px', 
            marginBottom: '30px',
            animation: 'fadeInUp 0.6s ease-out 0.1s both'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
            <Target size={28} color="#FFB347" />
            <h1 style={{
              textAlign: 'center', 
              fontSize: '2.2em', 
              margin: 0,
              color: '#ffffff',
              fontWeight: '700'
            }}>
              BBJ Dashboard
            </h1>
          </div>
          <p style={{textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '30px'}}>
            Real-time EV analysis powered by 42.1M verified hands
          </p>

          {/* Pool Size & Stake Input */}
          <div className="glass-card" style={{
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '30px',
            animation: 'fadeIn 0.4s ease-out 0.2s both'
          }}>
            <h3 style={{color: '#FFB347', marginBottom: '16px', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <DollarSign size={16} /> Pool Size & Your Stakes
            </h3>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>
                  Total Jackpot Pool (USD)
                </label>
                <input
                  type="number"
                  className="input-field input-focus"
                  placeholder="e.g., 2172588"
                  value={poolSize}
                  onChange={(e) => setPoolSize(parseFloat(e.target.value) || 0)}
                  style={{ fontSize: '18px', fontWeight: '600' }}
                />
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>
                  Your Stakes
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
                  {STAKE_OPTIONS.map(stake => (
                    <button
                      key={stake.value}
                      onClick={() => setSelectedStake(stake.value)}
                      style={{
                        background: selectedStake === stake.value ? '#FFB347' : 'rgba(255,255,255,0.08)',
                        color: selectedStake === stake.value ? '#0a0a0a' : 'rgba(255,255,255,0.7)',
                        border: selectedStake === stake.value ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        padding: '8px 2px',
                        borderRadius: '5px',
                        fontSize: '10px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {stake.value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {[1600000, 1800000, 2017000, 2200000, 2400000].map(preset => (
                <button
                  key={preset}
                  onClick={() => setPoolSize(preset)}
                  className="btn-hover"
                  style={{
                    background: poolSize === preset ? '#FFB347' : 'rgba(255,255,255,0.05)',
                    color: poolSize === preset ? '#0a0a0a' : 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {formatCurrency(preset)}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                Your stake pool: <span style={{ color: '#FFB347', fontWeight: '600' }}>{formatCurrency(currentEV.stakePoolSize)}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: '8px' }}>
                  ({(STAKE_OPTIONS.find(s => s.value === selectedStake)?.poolPercent || 0).toFixed(2)}% of total)
                </span>
              </span>
              <span style={{ 
                fontSize: '12px', 
                fontWeight: '600',
                color: currentEV.isProfitable ? '#22c55e' : '#ef4444',
                background: currentEV.isProfitable ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                padding: '6px 12px',
                borderRadius: '6px'
              }}>
                {currentEV.isProfitable ? '✓ +EV at this pool' : `✗ -EV (need ${formatCurrency(Math.abs(currentEV.poolNeeded))} more)`}
              </span>
            </div>
          </div>

          {/* EV Overview Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            
            {/* Main EV Gauge */}
            <div className={`stat-card ${currentEV.isProfitable ? 'ev-positive' : 'ev-negative'}`} style={{ animation: 'fadeIn 0.4s ease-out 0.25s both' }}>
              <h3 style={{ color: currentEV.isProfitable ? '#22c55e' : '#ef4444', marginBottom: '8px', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={14} /> Your Expected Value
              </h3>
              <EVGauge value={currentEV.netBBper100} min={-1.5} max={1.5} />
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <span style={{ 
                  fontSize: '11px', 
                  color: 'rgba(255,255,255,0.5)',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '4px 10px',
                  borderRadius: '4px'
                }}>
                  {currentEV.isProfitable ? 'Playing is +EV at this pool size' : 'You\'re paying to chase the dream'}
                </span>
              </div>
            </div>

            {/* Pool Progress */}
            <div className="stat-card" style={{ animation: 'fadeIn 0.4s ease-out 0.3s both' }}>
              <h3 style={{ color: '#FFB347', marginBottom: '16px', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={14} /> Pool vs Breakeven
              </h3>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff' }}>
                    {currentEV.percentToBreakeven.toFixed(1)}%
                  </span>
                  <span style={{ 
                    fontSize: '12px', 
                    color: currentEV.isProfitable ? '#22c55e' : 'rgba(255,255,255,0.5)',
                    alignSelf: 'flex-end'
                  }}>
                    {currentEV.isProfitable ? 'Above breakeven!' : `${formatCurrency(currentEV.poolNeeded)} needed`}
                  </span>
                </div>
                <ProgressBar 
                  value={poolSize} 
                  max={BBJ_CONSTANTS.breakevenPool_usd * 1.5} 
                  color={currentEV.isProfitable ? '#22c55e' : '#FFB347'}
                  showLabel={false}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                  <span>$0</span>
                  <span style={{ color: '#FFB347' }}>Breakeven</span>
                  <span>{formatCurrency(BBJ_CONSTANTS.breakevenPool_usd * 1.5)}</span>
                </div>
              </div>
            </div>

            {/* Payout Breakdown */}
            <div className="stat-card" style={{ animation: 'fadeIn 0.4s ease-out 0.35s both' }}>
              <h3 style={{ color: '#FFB347', marginBottom: '16px', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={14} /> When BBJ Hits at Your Stake
              </h3>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>
                Total distributed: <span style={{ color: '#FFB347', fontWeight: '600' }}>{formatCurrency(currentEV.totalPayoutAtStake)}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', padding: '10px 12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Bad Beat Winner</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>(Loser with quads+) • 10%</div>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#22c55e' }}>{formatCurrency(currentEV.jackpotWinnerPayout)}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', padding: '10px 12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Bad Beat Opponent</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>(Winner of hand) • 3%</div>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#60a5fa' }}>{formatCurrency(currentEV.opponentPayout)}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '8px', padding: '10px 12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Table Share</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>(Each other player) • 0.8%</div>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#a855f7' }}>{formatCurrency(currentEV.tableSharePayout)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* EV by Pool Size Chart */}
          <div className="glass-card" style={{
            padding: '24px',
            borderRadius: '12px',
            animation: 'fadeIn 0.4s ease-out 0.45s both'
          }}>
            <h3 style={{ color: '#FFB347', marginBottom: '20px', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={16} /> EV at Different Pool Sizes ({STAKE_OPTIONS.find(s => s.value === selectedStake)?.label})
            </h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>Total Pool</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right', fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>Your Stake Pool</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right', fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>Jackpot Win</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right', fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>Net BB/100</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {evTableData.map((row, index) => (
                    <tr 
                      key={row.pool}
                      style={{ 
                        borderBottom: index < evTableData.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        background: row.pool === poolSize ? 'rgba(255, 179, 71, 0.1)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '12px 8px', fontSize: '13px', color: '#ffffff', fontWeight: '500' }}>
                        {formatCurrency(row.pool)}
                      </td>
                      <td style={{ padding: '12px 8px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', textAlign: 'right' }}>
                        {formatCurrency(row.stakePoolSize)}
                      </td>
                      <td style={{ padding: '12px 8px', fontSize: '13px', color: '#22c55e', textAlign: 'right', fontWeight: '600' }}>
                        {formatCurrency(row.jackpotWinnerPayout)}
                      </td>
                      <td style={{ padding: '12px 8px', fontSize: '13px', color: getEVColor(row.netBBper100), textAlign: 'right', fontWeight: '700' }}>
                        {row.netBBper100 >= 0 ? '+' : ''}{row.netBBper100.toFixed(3)}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background: row.isProfitable ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: row.isProfitable ? '#22c55e' : '#ef4444'
                        }}>
                          {row.isProfitable ? '+EV' : '-EV'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
              Fee cost: <span style={{ color: '#ef4444' }}>-{BBJ_CONSTANTS.bbPer100Fees.toFixed(4)} bb/100</span> • 
              Breakeven requires expected return to exceed fee cost
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
            <AlertTriangle size={24} color="#FFB347" />
            <h2 style={{fontSize: '20px', fontWeight: '600', color: '#ffffff', margin: 0}}>
              Reality Check
            </h2>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px'}}>
            {/* Insight 1 */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <h3 style={{color: '#ef4444', fontSize: '14px', fontWeight: '600', marginBottom: '12px'}}>
                The Odds Are Astronomical
              </h3>
              <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: 1.7, margin: 0}}>
                To WIN the main jackpot (lose with AAATT or better), you need to play <strong>~{PROBABILITY_DATA.handsToWinJackpot.toLocaleString()} hands</strong>. 
                At 500 hands/hour, that's <strong>{Math.round(PROBABILITY_DATA.handsToWinJackpot / 500).toLocaleString()} hours</strong> — 
                or about <strong>{Math.round(PROBABILITY_DATA.handsToWinJackpot / 500 / 8)} days</strong> of 8-hour sessions.
              </p>
            </div>

            {/* Insight 2 */}
            <div style={{
              background: 'rgba(255, 179, 71, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 179, 71, 0.2)'
            }}>
              <h3 style={{color: '#FFB347', fontSize: '14px', fontWeight: '600', marginBottom: '12px'}}>
                Most Players Never Win It
              </h3>
              <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: 1.7, margin: 0}}>
                To <em>win</em> the main jackpot, you need <strong>{PROBABILITY_DATA.handsToWinJackpot.toLocaleString()} hands</strong>. 
                A recreational player grinding 5 hours/week at 80 hands/hour would need <strong>~{Math.round(PROBABILITY_DATA.handsToWinJackpot / (5 * 80 * 52))} years</strong> of play 
                to expect one jackpot win. That's longer than most poker careers.
              </p>
            </div>

            {/* Insight 3 */}
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}>
              <h3 style={{color: '#22c55e', fontSize: '14px', fontWeight: '600', marginBottom: '12px'}}>
                Table Share is Your Best Bet
              </h3>
              <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: 1.7, margin: 0}}>
                You'll get a table share once every <strong>~{PROBABILITY_DATA.handsToGetTableShare.toLocaleString()} hands</strong> — 
                about <strong>4x more often</strong> than winning the main prize. 
                It's small ({formatCurrency(currentEV.tableSharePayout)} at your stake), but it's something!
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
              <strong style={{color: '#FFB347'}}>Bottom Line:</strong> At current pool levels, you're paying <strong style={{color: '#ef4444'}}>{BBJ_CONSTANTS.bbPer100Fees.toFixed(2)} bb/100</strong> in fees. 
              Your expected return is <strong style={{color: currentEV.netBBper100 >= 0 ? '#22c55e' : '#ef4444'}}>{currentEV.netBBper100 >= 0 ? '+' : ''}{currentEV.netBBper100.toFixed(3)} bb/100</strong>. 
              {currentEV.isProfitable 
                ? " The pool is high enough to make BBJ tables mathematically +EV!"
                : ` The pool needs to reach about ${formatCurrency(poolSize + currentEV.poolNeeded)} before playing BBJ tables becomes +EV.`
              }
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          padding: '30px 20px',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '12px'
        }}>
          <p style={{ margin: 0 }}>
            Data based on 42.1M verified hands from GGPoker (NL100+) • 624 BBJ triggers analyzed
          </p>
          <p style={{ margin: '8px 0 0 0' }}>
            Built with 🌮 by FreeNachos
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default BBJDashboard;

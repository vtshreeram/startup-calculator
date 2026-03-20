import { Founder, FundingRound, FACTOR_WEIGHTS, TOTAL_INITIAL_SHARES } from '../types';

export type CapTableEntry = {
  id: string;
  name: string;
  shares: number;
  percentage: number;
  paperValue: number;
  type: 'founder' | 'investor' | 'option_pool';
  readinessScore?: number;
  aiSuggestedRange?: { min: number; max: number };
};

export type CapTableResult = {
  roundName: string;
  entries: CapTableEntry[];
  totalShares: number;
  postMoneyValuation: number;
  sharePrice: number;
};

export interface FounderWithEvaluation {
  id: string;
  name: string;
  role: string;
  factors: Founder['factors'];
  readinessScore?: number;
  aiSuggestedRange?: { min: number; max: number };
  commitmentLevel?: 'full-time' | 'part-time';
  authorityScope?: 'Advisory' | 'Operational' | 'Decision-Maker' | 'Full Autonomy';
}

const COMMITMENT_WEIGHTS = {
  'full-time': 1.0,
  'part-time': 0.5,
};

const AUTHORITY_WEIGHTS = {
  'Advisory': 0.5,
  'Operational': 0.75,
  'Decision-Maker': 1.0,
  'Full Autonomy': 1.25,
};

export function calculateCapTable(
  founders: Founder[],
  rounds: FundingRound[],
  evaluations?: FounderWithEvaluation[]
): CapTableResult[] {
  const results: CapTableResult[] = [];

  const getEvaluationData = (founderId: string) => {
    return evaluations?.find(e => e.id === founderId);
  };

  let totalFounderScore = 0;
  const founderScores = founders.map((founder) => {
    const evalData = getEvaluationData(founder.id);
    
    let baseScore = 0;
    (Object.keys(FACTOR_WEIGHTS) as Array<keyof typeof FACTOR_WEIGHTS>).forEach(
      (factor) => {
        baseScore += founder.factors[factor] * FACTOR_WEIGHTS[factor];
      }
    );

    let multiplier = 1.0;
    
    if (evalData?.readinessScore) {
      const scoreMultiplier = evalData.readinessScore / 100;
      multiplier *= (0.5 + (scoreMultiplier * 0.5));
    }

    if (evalData?.commitmentLevel) {
      multiplier *= COMMITMENT_WEIGHTS[evalData.commitmentLevel];
    }

    if (evalData?.authorityScope) {
      multiplier *= AUTHORITY_WEIGHTS[evalData.authorityScope];
    }

    const finalScore = baseScore * multiplier;
    totalFounderScore += finalScore;
    
    return { 
      id: founder.id, 
      name: founder.name, 
      score: finalScore,
      readinessScore: evalData?.readinessScore,
      aiSuggestedRange: evalData?.aiSuggestedRange,
    };
  });

  let currentEntries: CapTableEntry[] = founderScores.map((f) => {
    const percentage = totalFounderScore > 0 ? f.score / totalFounderScore : 0;
    return {
      id: f.id,
      name: f.name,
      shares: percentage * TOTAL_INITIAL_SHARES,
      percentage: percentage * 100,
      paperValue: 0,
      type: 'founder',
      readinessScore: f.readinessScore,
      aiSuggestedRange: f.aiSuggestedRange,
    };
  });

  let currentTotalShares = TOTAL_INITIAL_SHARES;

  results.push({
    roundName: 'Initial Formation',
    entries: [...currentEntries],
    totalShares: currentTotalShares,
    postMoneyValuation: 0,
    sharePrice: 0,
  });

  rounds.forEach((round) => {
    let postMoneyValuation = 0;
    let investorOwnership = 0;
    let optionPoolOwnership = 0;

    if (round.type === 'priced') {
      postMoneyValuation = round.preMoneyValuation + round.investmentAmount;
      investorOwnership = postMoneyValuation > 0 ? round.investmentAmount / postMoneyValuation : 0;
      optionPoolOwnership = round.optionPoolPercentage / 100;
    } else if (round.type === 'safe') {
      postMoneyValuation = round.valuationCap + round.investmentAmount;
      investorOwnership = postMoneyValuation > 0 ? round.investmentAmount / postMoneyValuation : 0;
      optionPoolOwnership = 0;
    }

    const totalDilution = investorOwnership + optionPoolOwnership;
    const existingOwnership = 1 - totalDilution;

    if (existingOwnership <= 0) {
      return;
    }

    const newTotalShares = currentTotalShares / existingOwnership;
    const investorShares = newTotalShares * investorOwnership;
    const optionPoolShares = newTotalShares * optionPoolOwnership;
    const sharePrice = newTotalShares > 0 ? postMoneyValuation / newTotalShares : 0;

    currentEntries = currentEntries.map((entry) => ({
      ...entry,
      percentage: (entry.shares / newTotalShares) * 100,
      paperValue: entry.shares * sharePrice,
    }));

    if (investorShares > 0) {
      currentEntries.push({
        id: `investor-${round.id}`,
        name: `${round.name} Investors`,
        shares: investorShares,
        percentage: investorOwnership * 100,
        paperValue: investorShares * sharePrice,
        type: 'investor',
      });
    }

    if (optionPoolShares > 0) {
      const existingPoolIndex = currentEntries.findIndex(
        (e) => e.type === 'option_pool'
      );
      if (existingPoolIndex >= 0) {
        currentEntries[existingPoolIndex].shares += optionPoolShares;
        currentEntries[existingPoolIndex].percentage =
          (currentEntries[existingPoolIndex].shares / newTotalShares) * 100;
        currentEntries[existingPoolIndex].paperValue = 
          currentEntries[existingPoolIndex].shares * sharePrice;
      } else {
        currentEntries.push({
          id: `pool-${round.id}`,
          name: 'Option Pool',
          shares: optionPoolShares,
          percentage: optionPoolOwnership * 100,
          paperValue: optionPoolShares * sharePrice,
          type: 'option_pool',
        });
      }
    }

    currentTotalShares = newTotalShares;

    results.push({
      roundName: round.name,
      entries: [...currentEntries],
      totalShares: currentTotalShares,
      postMoneyValuation,
      sharePrice,
    });
  });

  return results;
}

import { Founder, FundingRound, FACTOR_WEIGHTS, TOTAL_INITIAL_SHARES } from '../types';

export type CapTableEntry = {
  id: string;
  name: string;
  shares: number;
  percentage: number;
  type: 'founder' | 'investor' | 'option_pool';
};

export type CapTableResult = {
  roundName: string;
  entries: CapTableEntry[];
  totalShares: number;
  postMoneyValuation: number;
  sharePrice: number;
};

export function calculateCapTable(
  founders: Founder[],
  rounds: FundingRound[]
): CapTableResult[] {
  const results: CapTableResult[] = [];

  // 1. Calculate Initial Founder Split
  let totalFounderScore = 0;
  const founderScores = founders.map((founder) => {
    let score = 0;
    (Object.keys(FACTOR_WEIGHTS) as Array<keyof typeof FACTOR_WEIGHTS>).forEach(
      (factor) => {
        score += founder.factors[factor] * FACTOR_WEIGHTS[factor];
      }
    );
    totalFounderScore += score;
    return { id: founder.id, name: founder.name, score };
  });

  let currentEntries: CapTableEntry[] = founderScores.map((f) => {
    const percentage = totalFounderScore > 0 ? f.score / totalFounderScore : 0;
    return {
      id: f.id,
      name: f.name,
      shares: percentage * TOTAL_INITIAL_SHARES,
      percentage: percentage * 100,
      type: 'founder',
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

  // 2. Process Funding Rounds
  rounds.forEach((round) => {
    const postMoneyValuation = round.preMoneyValuation + round.investmentAmount;
    const investorOwnership =
      postMoneyValuation > 0 ? round.investmentAmount / postMoneyValuation : 0;
    const optionPoolOwnership = round.optionPoolPercentage / 100;
    const totalDilution = investorOwnership + optionPoolOwnership;
    const existingOwnership = 1 - totalDilution;

    if (existingOwnership <= 0) {
      // Invalid round, skip or handle error
      return;
    }

    const newTotalShares = currentTotalShares / existingOwnership;
    const investorShares = newTotalShares * investorOwnership;
    const optionPoolShares = newTotalShares * optionPoolOwnership;
    const sharePrice =
      newTotalShares > 0 ? postMoneyValuation / newTotalShares : 0;

    // Update existing entries percentages
    currentEntries = currentEntries.map((entry) => ({
      ...entry,
      percentage: (entry.shares / newTotalShares) * 100,
    }));

    // Add new investor
    if (investorShares > 0) {
      currentEntries.push({
        id: `investor-${round.id}`,
        name: `${round.name} Investors`,
        shares: investorShares,
        percentage: investorOwnership * 100,
        type: 'investor',
      });
    }

    // Add or update option pool
    if (optionPoolShares > 0) {
      const existingPoolIndex = currentEntries.findIndex(
        (e) => e.type === 'option_pool'
      );
      if (existingPoolIndex >= 0) {
        currentEntries[existingPoolIndex].shares += optionPoolShares;
        currentEntries[existingPoolIndex].percentage =
          (currentEntries[existingPoolIndex].shares / newTotalShares) * 100;
      } else {
        currentEntries.push({
          id: `pool-${round.id}`,
          name: 'Option Pool',
          shares: optionPoolShares,
          percentage: optionPoolOwnership * 100,
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

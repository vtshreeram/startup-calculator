export type FounderFactors = {
  idea: number;
  skills: number;
  time: number;
  capital: number;
  network: number;
  risk: number;
};

export type Founder = {
  id: string;
  name: string;
  role: string;
  factors: FounderFactors;
};

export type FundingRound = {
  id: string;
  name: string;
  type: 'priced' | 'safe';
  investmentAmount: number;
  // Priced Round Fields
  preMoneyValuation: number;
  optionPoolPercentage: number;
  // SAFE Fields
  valuationCap: number;
  discount: number;
};

export const FACTOR_WEIGHTS: Record<keyof FounderFactors, number> = {
  idea: 1,
  skills: 3,
  time: 2,
  capital: 2,
  network: 1,
  risk: 1,
};

export const FACTOR_LABELS: Record<keyof FounderFactors, string> = {
  idea: "Idea & IP",
  skills: "Skills & Execution",
  time: "Time Commitment",
  capital: "Capital Contribution",
  network: "Network & Connections",
  risk: "Risk Taken",
};

export const TOTAL_INITIAL_SHARES = 10_000_000;

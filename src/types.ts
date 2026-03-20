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

export type Industry = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export type StartupStage = 'Pre-seed' | 'Seed' | 'Series A' | 'Series B+';

export type StartupProfile = {
  industry: string;
  stage: StartupStage;
  teamSize: number;
};

export type Persona = {
  id: string;
  role: string;
  industryId: string;
  description: string;
  typicalResponsibilities: string[];
};

export type ResponsibilityCommitment = {
  id: string;
  label: string;
  commitmentLevel: number; // 1-5
  hoursPerWeek: number;
};

export type AuthorityRequest = {
  domain: string;
  scope: 'Advisory' | 'Operational' | 'Decision-Maker' | 'Full Autonomy';
  reasoning: string;
};

export type SupportRequirement = {
  type: string;
  description: string;
  isCritical: boolean;
};

export type Evidence = {
  type: 'Link' | 'Description' | 'File';
  value: string;
};

export type RoleEvaluation = {
  id: string;
  founderId: string;
  personaId: string;
  responsibilities: ResponsibilityCommitment[];
  authorities: AuthorityRequest[];
  supportRequirements: SupportRequirement[];
  evidence: Evidence[];
  status: 'pending' | 'approved' | 'rejected';
  score?: number;
  aiFeedback?: string;
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

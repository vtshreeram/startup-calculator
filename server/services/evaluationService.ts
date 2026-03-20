import type { RoleEvaluation } from '../routes/evaluations.js';
import { evaluateRole, evaluateTeam } from './geminiService.js';

interface EvaluationInput {
  id: string;
  startupId?: string;
  founderId: string;
  personaId: string;
  responsibilities: Array<{ label: string; commitmentLevel: number; hoursPerWeek: number }>;
  authorities: Array<{ domain: string; scope: string; reasoning?: string }>;
  supportRequirements: Array<{ type: string; description: string; isCritical: boolean }>;
  evidence: Array<{ type: string; value: string }>;
  status?: string;
  score?: number;
  aiFeedback?: string;
}

export interface EvaluationResult {
  score: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  suggestedEquityRange: {
    min: number;
    max: number;
  };
}

export interface TeamAnalysisResult {
  overlaps: Array<{
    roles: string[];
    severity: 'high' | 'medium' | 'low';
    recommendation: string;
  }>;
  missingRoles: Array<{
    role: string;
    criticality: 'high' | 'medium' | 'low';
    suggestedAction: string;
  }>;
  authorityGaps: Array<{
    domain: string;
    severity: 'high' | 'medium' | 'low';
    recommendation: string;
  }>;
  overallScore: number;
  recommendations: string[];
}

export async function evaluateRoleReadiness(
  evaluation: EvaluationInput,
  industry: string,
  stage: string
): Promise<EvaluationResult> {
  const persona = evaluation.personaId;
  const responsibilities = evaluation.responsibilities.map(r => r.label);
  const authorities = evaluation.authorities.map(a => `${a.domain}: ${a.scope}`);
  const support = evaluation.supportRequirements.map(s => `${s.type}: ${s.description}`);
  const evidence = evaluation.evidence.map(e => `${e.type}: ${e.value}`);

  const result = await evaluateRole(
    persona,
    responsibilities,
    authorities,
    support,
    evidence,
    industry,
    stage
  );

  return result;
}

export async function analyzeTeamComposition(
  evaluations: EvaluationInput[],
  industry: string,
  stage: string
): Promise<TeamAnalysisResult> {
  const result = await evaluateTeam(evaluations, industry, stage);
  return result;
}

export function validateEvaluation(evaluation: EvaluationInput): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!evaluation.personaId) {
    errors.push('Persona is required');
  }

  if (evaluation.responsibilities.length === 0) {
    errors.push('At least one responsibility is required');
  }

  for (const resp of evaluation.responsibilities) {
    if (!resp.label || resp.label.trim() === '') {
      errors.push('Responsibility label cannot be empty');
    }
    if (resp.commitmentLevel < 1 || resp.commitmentLevel > 5) {
      errors.push('Commitment level must be between 1 and 5');
    }
    if (resp.hoursPerWeek < 1 || resp.hoursPerWeek > 80) {
      errors.push('Hours per week must be between 1 and 80');
    }
  }

  for (const auth of evaluation.authorities) {
    if (!auth.domain || auth.domain.trim() === '') {
      errors.push('Authority domain cannot be empty');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

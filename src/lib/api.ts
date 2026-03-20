const API_BASE = '/api';

export async function evaluateRole(
  evaluation: any,
  industry: string,
  stage: string
): Promise<any> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'evaluateRole',
      persona: evaluation.personaId,
      responsibilities: evaluation.responsibilities,
      authorities: evaluation.authorities,
      support: evaluation.supportRequirements,
      evidence: evaluation.evidence,
      industry,
      stage,
    }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Evaluation failed');
  return data.data;
}

export async function evaluateTeam(
  evaluations: any[],
  industry: string,
  stage: string
): Promise<any> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'evaluateTeam',
      evaluations,
      industry,
      stage,
    }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Team analysis failed');
  return data.data;
}

export async function updateEvaluationStatus(
  evaluationId: string,
  status: 'pending' | 'approved' | 'rejected'
): Promise<any> {
  return { success: true };
}

export async function getEvaluations(): Promise<any[]> {
  return [];
}

export async function createEvaluation(evaluation: any): Promise<any> {
  return evaluation;
}

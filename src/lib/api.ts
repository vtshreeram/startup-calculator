const API_BASE = 'http://localhost:3001/api';

export async function evaluateRole(
  evaluation: any,
  industry: string,
  stage: string
): Promise<any> {
  const res = await fetch(`${API_BASE}/ai/evaluate/role`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ evaluation, industry, stage }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message || 'Evaluation failed');
  return data.data;
}

export async function evaluateTeam(
  evaluations: any[],
  industry: string,
  stage: string
): Promise<any> {
  const res = await fetch(`${API_BASE}/ai/evaluate/team`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ evaluations, industry, stage }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message || 'Team analysis failed');
  return data.data;
}

export async function updateEvaluationStatus(
  evaluationId: string,
  status: 'pending' | 'approved' | 'rejected'
): Promise<any> {
  const res = await fetch(`${API_BASE}/evaluations/${evaluationId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message || 'Update failed');
  return data.data;
}

export async function getEvaluations(startupId?: string): Promise<any[]> {
  const url = startupId 
    ? `${API_BASE}/evaluations?startupId=${startupId}`
    : `${API_BASE}/evaluations`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message || 'Failed to fetch evaluations');
  return data.data;
}

export async function createEvaluation(evaluation: any): Promise<any> {
  const res = await fetch(`${API_BASE}/evaluations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(evaluation),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message || 'Failed to create evaluation');
  return data.data;
}

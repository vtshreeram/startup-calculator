import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validation.js';
import { evaluateRoleReadiness, analyzeTeamComposition, validateEvaluation } from '../services/evaluationService.js';

const evaluationDataSchema = z.object({
  id: z.string(),
  founderId: z.string(),
  personaId: z.string(),
  responsibilities: z.array(z.object({
    id: z.string(),
    label: z.string(),
    commitmentLevel: z.number(),
    hoursPerWeek: z.number(),
  })),
  authorities: z.array(z.object({
    domain: z.string(),
    scope: z.enum(['Advisory', 'Operational', 'Decision-Maker', 'Full Autonomy']),
    reasoning: z.string(),
  })),
  supportRequirements: z.array(z.object({
    type: z.string(),
    description: z.string(),
    isCritical: z.boolean(),
  })),
  evidence: z.array(z.object({
    type: z.enum(['Link', 'Description', 'File']),
    value: z.string(),
  })),
});

const roleEvaluationRequestSchema = z.object({
  evaluation: evaluationDataSchema,
  industry: z.string(),
  stage: z.string(),
});

const teamAnalysisRequestSchema = z.object({
  evaluations: z.array(evaluationDataSchema),
  industry: z.string(),
  stage: z.string(),
});

const router = Router();

const cache: Map<string, { data: any; timestamp: number }> = new Map();
const CACHE_TTL = 15 * 60 * 1000;

function getCached(key: string): any | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

router.post('/evaluate/role', validate(roleEvaluationRequestSchema), async (req, res, next) => {
  try {
    const { evaluation, industry, stage } = req.body;

    const cacheKey = `role:${evaluation.id}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    const validation = validateEvaluation(evaluation);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: { message: validation.errors.join(', ') }
      });
    }

    const result = await evaluateRoleReadiness(evaluation, industry, stage);

    setCache(cacheKey, result);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/evaluate/team', validate(teamAnalysisRequestSchema), async (req, res, next) => {
  try {
    const { evaluations, industry, stage } = req.body;

    if (!evaluations || evaluations.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'No evaluations provided' }
      });
    }

    const cacheKey = `team:${evaluations.map(e => e.id).join(':')}:${industry}:${stage}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    const result = await analyzeTeamComposition(evaluations, industry, stage);

    setCache(cacheKey, result);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/cache/clear', (req, res) => {
  cache.clear();
  res.json({ success: true, message: 'Cache cleared' });
});

export default router;

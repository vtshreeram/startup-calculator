import { Router } from 'express';
import { z } from 'zod';
import { JsonStore } from '../data/jsonStore.js';
import { validate } from '../middleware/validation.js';
import { HttpError } from '../middleware/errorHandler.js';

export interface ResponsibilityCommitment {
  id: string;
  label: string;
  commitmentLevel: number;
  hoursPerWeek: number;
}

export interface AuthorityRequest {
  domain: string;
  scope: 'Advisory' | 'Operational' | 'Decision-Maker' | 'Full Autonomy';
  reasoning: string;
}

export interface SupportRequirement {
  type: string;
  description: string;
  isCritical: boolean;
}

export interface Evidence {
  type: 'Link' | 'Description' | 'File';
  value: string;
}

export interface RoleEvaluation {
  id: string;
  startupId: string;
  founderId: string;
  personaId: string;
  responsibilities: ResponsibilityCommitment[];
  authorities: AuthorityRequest[];
  supportRequirements: SupportRequirement[];
  evidence: Evidence[];
  status: 'pending' | 'approved' | 'rejected';
  score?: number;
  aiFeedback?: string;
  createdAt: string;
  updatedAt: string;
}

const evaluationSchema = z.object({
  startupId: z.string().min(1),
  founderId: z.string().min(1),
  personaId: z.string().min(1),
  responsibilities: z.array(z.object({
    id: z.string(),
    label: z.string(),
    commitmentLevel: z.number().min(1).max(5),
    hoursPerWeek: z.number().min(1).max(80),
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
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  score: z.number().optional(),
  aiFeedback: z.string().optional(),
});

const store = new JsonStore<RoleEvaluation>('evaluations.json');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { startupId } = req.query;
    let evaluations = await store.findAll();
    if (startupId) {
      evaluations = evaluations.filter(e => e.startupId === startupId);
    }
    res.json({ success: true, data: evaluations });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const evaluation = await store.findById(req.params.id);
    if (!evaluation) {
      throw new HttpError('Evaluation not found', 404);
    }
    res.json({ success: true, data: evaluation });
  } catch (error) {
    next(error);
  }
});

router.post('/', validate(evaluationSchema), async (req, res, next) => {
  try {
    const now = new Date().toISOString();
    const evaluation: RoleEvaluation = {
      id: crypto.randomUUID(),
      ...req.body,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    const created = await store.create(evaluation);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validate(evaluationSchema.partial()), async (req, res, next) => {
  try {
    const updated = await store.update(req.params.id, {
      ...req.body,
      updatedAt: new Date().toISOString(),
    });
    if (!updated) {
      throw new HttpError('Evaluation not found', 404);
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      throw new HttpError('Invalid status', 400);
    }
    const updated = await store.update(req.params.id, {
      status,
      updatedAt: new Date().toISOString(),
    });
    if (!updated) {
      throw new HttpError('Evaluation not found', 404);
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await store.delete(req.params.id);
    if (!deleted) {
      throw new HttpError('Evaluation not found', 404);
    }
    res.json({ success: true, message: 'Evaluation deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;

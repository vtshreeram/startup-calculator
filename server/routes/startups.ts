import { Router } from 'express';
import { z } from 'zod';
import { JsonStore } from '../data/jsonStore.js';
import { validate } from '../middleware/validation.js';
import { HttpError } from '../middleware/errorHandler.js';

export interface StartupProfile {
  id: string;
  name: string;
  industry: string;
  stage: 'Pre-seed' | 'Seed' | 'Series A' | 'Series B+';
  teamSize: number;
  createdAt: string;
  updatedAt: string;
}

const startupSchema = z.object({
  name: z.string().min(1),
  industry: z.string().min(1),
  stage: z.enum(['Pre-seed', 'Seed', 'Series A', 'Series B+']),
  teamSize: z.number().min(1).max(100),
});

const store = new JsonStore<StartupProfile>('startups.json');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const startups = await store.findAll();
    res.json({ success: true, data: startups });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const startup = await store.findById(req.params.id);
    if (!startup) {
      throw new HttpError('Startup not found', 404);
    }
    res.json({ success: true, data: startup });
  } catch (error) {
    next(error);
  }
});

router.post('/', validate(startupSchema), async (req, res, next) => {
  try {
    const now = new Date().toISOString();
    const startup: StartupProfile = {
      id: crypto.randomUUID(),
      ...req.body,
      createdAt: now,
      updatedAt: now,
    };
    const created = await store.create(startup);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validate(startupSchema.partial()), async (req, res, next) => {
  try {
    const updated = await store.update(req.params.id, {
      ...req.body,
      updatedAt: new Date().toISOString(),
    });
    if (!updated) {
      throw new HttpError('Startup not found', 404);
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
      throw new HttpError('Startup not found', 404);
    }
    res.json({ success: true, message: 'Startup deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;

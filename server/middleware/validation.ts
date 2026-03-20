import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError as ZodErr } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodErr) {
        const errors = error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({
          success: false,
          error: {
            message: 'Validation failed',
            errors,
          },
        });
      }
      next(error);
    }
  };
};

import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

// Validate request body
export const validateBody = <T extends ZodSchema>(schema: T) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Validate query parameters
// Note: In Express v5, req.query is read-only, so we store validated data in res.locals
export const validateQuery = <T extends ZodSchema>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse(req.query);
      // Store validated query in res.locals for Express v5 compatibility
      res.locals.validatedQuery = validated;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Validate route parameters
export const validateParams = <T extends ZodSchema>(schema: T) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse(req.params);
      // Store in req.params - Express typing requires cast
      req.params = validated as typeof req.params;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Generic validate (backwards compatibility) - validates body
export const validate = validateBody;

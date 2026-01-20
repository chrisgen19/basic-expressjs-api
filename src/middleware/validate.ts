import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse({
        ...req.body,
        ...req.query,
        ...req.params,
      });

      // Replace body/query/params with validated data
      req.body = validated;
      next();
    } catch (error) {
      next(error);
    }
  };
};

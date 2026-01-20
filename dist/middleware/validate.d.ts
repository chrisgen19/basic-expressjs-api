import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
export declare const validateBody: <T extends ZodSchema>(schema: T) => (req: Request, _res: Response, next: NextFunction) => void;
export declare const validateQuery: <T extends ZodSchema>(schema: T) => (req: Request, _res: Response, next: NextFunction) => void;
export declare const validateParams: <T extends ZodSchema>(schema: T) => (req: Request, _res: Response, next: NextFunction) => void;
export declare const validate: <T extends ZodSchema>(schema: T) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate.d.ts.map
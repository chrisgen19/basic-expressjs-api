"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.validateParams = exports.validateQuery = exports.validateBody = void 0;
// Validate request body
const validateBody = (schema) => {
    return (req, _res, next) => {
        try {
            const validated = schema.parse(req.body);
            req.body = validated;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validateBody = validateBody;
// Validate query parameters
// Note: Express req.query is ParsedQs type, so we need to cast
// The validated data is properly typed in the schema
const validateQuery = (schema) => {
    return (req, _res, next) => {
        try {
            const validated = schema.parse(req.query);
            // Store in req.query - Express typing requires cast
            req.query = validated;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validateQuery = validateQuery;
// Validate route parameters
const validateParams = (schema) => {
    return (req, _res, next) => {
        try {
            const validated = schema.parse(req.params);
            // Store in req.params - Express typing requires cast
            req.params = validated;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validateParams = validateParams;
// Generic validate (backwards compatibility) - validates body
exports.validate = exports.validateBody;
//# sourceMappingURL=validate.js.map
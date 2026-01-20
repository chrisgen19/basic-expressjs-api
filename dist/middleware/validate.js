"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => {
    return (req, _res, next) => {
        try {
            const validated = schema.parse({
                ...req.body,
                ...req.query,
                ...req.params,
            });
            // Replace body/query/params with validated data
            req.body = validated;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map
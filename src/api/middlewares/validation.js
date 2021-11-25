import { BadRequestError } from '../utils/errors';

export default (schema, field = 'body') => {
    return (req, res, next) => {
        const result = schema.validate(req[field]);
        if (result.error) {
            const description = result.error.details.map(d => d.message).join(',');
            throw new BadRequestError('Joi: ' + description);
        }
        req[field] = result.value || req[field];
        next();
    };
};

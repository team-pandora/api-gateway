import * as Joi from 'joi';

export const getConfigRequestSchema = Joi.object({
    body: {},
    query: {},
    params: {},
});

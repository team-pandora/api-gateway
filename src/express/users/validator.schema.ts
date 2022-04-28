import * as Joi from 'joi';

export const getUsersRequestSchema = Joi.object({
    body: {},
    query: {
            name: Joi.string().optional(),
            mail: Joi.string().optional(),
    },
    params: {},
});

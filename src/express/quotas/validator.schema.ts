import * as Joi from 'joi';
import { JoiObjectId } from '../../utils/joi';

export const getQuotaByUserIdRequestSchema = Joi.object({
    query: {},
    params: {
        userId: JoiObjectId.required(),
    },
    body: {},
});

export const getSelfQuotaRequestSchema = Joi.object({
    query: {},
    params: {},
    body: {},
});

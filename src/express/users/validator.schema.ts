import * as Joi from 'joi';
import config from '../../config';
import { JoiObjectId } from '../../utils/joi';

const { fsObjectTypes, fsObjectsSortFields, statesSortFields, sortOrders } = config.constants;

export const getFsObjectRequestSchema = Joi.object({
    query: Joi.object({
        // State filters
        // stateId: JoiObjectId.optional(),
        // userId: Joi.string().regex(config.users.idRegex).optional(),
        // fsObjectId: JoiObjectId.optional(),
        // favorite: Joi.boolean().optional(),
        // trash: Joi.boolean().optional(),
        // trashRoot: Joi.boolean().optional(),
        // root: Joi.boolean().optional(),
        // permission: Joi.alternatives()
        //     .try(Joi.string().valid(...permissions), Joi.array().items(Joi.string().valid(...permissions)))
        //     .custom((value) => (Array.isArray(value) ? { $in: value } : value))
        //     .optional(),

        // FsObject filters
        key: Joi.string().optional(),
        bucket: Joi.string().optional(),
        source: Joi.string().optional(),
        size: Joi.number().optional(),
        public: Joi.boolean().optional(),
        name: Joi.string().optional(),
        parent: Joi.alternatives().try(JoiObjectId, Joi.string().valid('null').empty('null').default(null)).optional(),
        type: Joi.string()
            .valid(...fsObjectTypes)
            .optional(),
        ref: JoiObjectId.optional(),

        // Sort
        sortBy: Joi.string()
            .valid(...fsObjectsSortFields, ...statesSortFields)
            .optional(),
        sortOrder: Joi.string()
            .valid(...sortOrders)
            .optional(),

        // Pagination
        page: Joi.number().integer().min(1).optional(),
        pageSize: Joi.number().integer().min(1).optional(),
    }),
});

export const getUsersRequestSchema = Joi.object({
    body: {},
    query: {
        name: Joi.string().optional(),
        mail: Joi.string().optional(),
        source: Joi.string().required(),
    },
    params: {},
});

export const getUserRequestSchema = Joi.object({
    body: {},
    query: {},
    params: {
        userId: Joi.string().required(),
    },
});

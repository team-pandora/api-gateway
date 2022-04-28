// import Joi = require("joi");

// export const aggregateStatesFsObjectsRequestSchema = Joi.object({
//     query: Joi.object({
//         // State filters
//         // stateId: JoiObjectId.optional(),
//         // userId: Joi.string().regex(config.users.idRegex).optional(),
//         // fsObjectId: JoiObjectId.optional(),
//         // favorite: Joi.boolean().optional(),
//         // trash: Joi.boolean().optional(),
//         // trashRoot: Joi.boolean().optional(),
//         // root: Joi.boolean().optional(),
//         // permission: Joi.alternatives()
//         //     .try(Joi.string().valid(...permissions), Joi.array().items(Joi.string().valid(...permissions)))
//         //     .custom((value) => (Array.isArray(value) ? { $in: value } : value))
//         //     .optional(),

//         // FsObject filters
//         key: Joi.string().optional(),
//         bucket: Joi.string().optional(),
//         source: Joi.string().optional(),
//         size: Joi.number().optional(),
//         public: Joi.boolean().optional(),
//         name: Joi.string().optional(),
//         parent: Joi.alternatives().try(JoiObjectId, Joi.string().valid('null').empty('null').default(null)).optional(),
//         type: Joi.string()
//             .valid(...fsObjectTypes)
//             .optional(),
//         ref: JoiObjectId.optional(),

//         // Sort
//         sortBy: Joi.string()
//             .valid(...fsObjectsSortFields, ...statesSortFields)
//             .optional(),
//         sortOrder: Joi.string()
//             .valid(...sortOrders)
//             .optional(),

//         // Pagination
//         page: Joi.number().integer().min(1).optional(),
//         pageSize: Joi.number().integer().min(1).optional(),
//     })

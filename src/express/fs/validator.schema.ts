import * as Joi from 'joi';
import config from '../../config';
import { JoiObjectId } from '../../utils/joi';

const { nameRegex, fileKeyRegex, fileBucketRegex, minFileSizeInBytes, maxFileSizeInBytes } = config.fs;
const { apps, permissions, fsObjectTypes, fsObjectsSortFields, statesSortFields, sortOrders } = config.constants;

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

export const getFsObjectByIdRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {},
});

export const getFsObjectHierarchyRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {},
});

export const deleteFsObjectRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {},
});

export const createFsObjectRequestSchema = Joi.object({
    query: {},
    params: {},
    body: {
        name: Joi.string().regex(nameRegex).required(),
        parent: Joi.alternatives().try(JoiObjectId, Joi.any().valid(null)).required(),
        key: Joi.string().regex(fileKeyRegex).required(),
        bucket: Joi.string().regex(fileBucketRegex).required(),
        size: Joi.number().min(minFileSizeInBytes).max(maxFileSizeInBytes).required(),
        source: Joi.string()
            .valid(...apps)
            .required(),

        public: Joi.boolean().optional(),
    },
});

export const updateFsObjectRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {
        name: Joi.string().regex(nameRegex).required(),
        parent: Joi.alternatives().try(JoiObjectId, Joi.any().valid(null)).required(),
        key: Joi.string().regex(fileKeyRegex).required(),
        bucket: Joi.string().regex(fileBucketRegex).required(),
        size: Joi.number().min(minFileSizeInBytes).max(maxFileSizeInBytes).required(),
        source: Joi.string()
            .valid(...apps)
            .required(),

        public: Joi.boolean().optional(),
    },
});

export const moveFsObjectsRequestSchema = Joi.object({
    query: {},
    params: {},
    body: {
        objectIds: Joi.array().items(JoiObjectId).min(1).required(),
        destination: JoiObjectId.required(),
    },
});

export const shareFsObjectRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {
        userId: JoiObjectId.required(),
        permission: Joi.string()
            .valid(...permissions)
            .required(),
    },
});

export const copyFsObjectRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {
        name: Joi.string().regex(nameRegex).required(),
        folderId: JoiObjectId.required(),
    },
});

export const getFsObjectShareLinkRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {
        permission: Joi.string()
            .valid(...permissions)
            .optional(),
        time: Joi.date().required(),
    },
});

export const removePermissionsRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {
        userIds: Joi.array().items(JoiObjectId).min(1).required(),
    },
});

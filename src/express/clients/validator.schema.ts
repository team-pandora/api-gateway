import * as Joi from 'joi';
import config from '../../config';
import { JoiObjectId } from '../../utils/joi';

const { permissions, fsObjectsSortFields, fsObjectTypes, statesSortFields, sortOrders } = config.constants;
const { fsObjectNameRegex: nameRegex, minFileSizeInBytes, maxFileSizeInBytes, userIdRegex } = config.validations;

export const uploadFileRequestSchema = Joi.object({
    headers: Joi.object({
        'content-type': Joi.string()
            .regex(/.*multipart\/form-data.*/)
            .required(),
    }).unknown(),
    query: {
        name: Joi.string().regex(nameRegex).required(),
        size: Joi.number().min(minFileSizeInBytes).max(maxFileSizeInBytes).required(),
        public: Joi.boolean().optional(),
    },
    params: {},
    body: {},
});

export const reUploadFileRequestSchema = Joi.object({
    headers: Joi.object({
        'content-type': Joi.string()
            .regex(/.*multipart\/form-data.*/)
            .required(),
    }).unknown(),
    query: {
        size: Joi.number().min(minFileSizeInBytes).max(maxFileSizeInBytes).required(),
    },
    params: {},
    body: {},
});

export const shareFileRequestSchema = Joi.object({
    query: {},
    params: {},
    body: {
        userId: Joi.string().regex(userIdRegex).required(),
        permission: Joi.string()
            .valid(...permissions)
            .required(),
    },
});

export const downloadFileRequestSchema = Joi.object({
    query: {},
    params: {
        fileId: JoiObjectId.required(),
    },
    body: {},
});

export const getFilesRequestSchema = Joi.object({
    query: Joi.object({
        stateId: JoiObjectId.optional(),
        fsObjectId: JoiObjectId.optional(),
        favorite: Joi.boolean().optional(),
        trash: Joi.boolean().optional(),
        trashRoot: Joi.boolean().optional(),
        root: Joi.boolean().optional(),
        permission: Joi.alternatives()
            .try(Joi.string().valid(...permissions), Joi.array().items(Joi.string().valid(...permissions)))
            .custom((value) => (Array.isArray(value) ? { $in: value } : value))
            .optional(),

        // FsObject filters
        client: Joi.string().optional(),
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
    })
        .with('sortBy', 'sortOrder')
        .with('sortOrder', 'sortBy')
        .with('page', ['pageSize', 'sortBy', 'sortOrder'])
        .with('pageSize', ['page', 'sortBy', 'sortOrder']),
    params: {},
    body: {},
});

export const getFileRequestSchema = Joi.object({
    query: {},
    params: {
        fileId: JoiObjectId.required(),
    },
    body: {},
});

export const updateFileNameRequestSchema = Joi.object({
    query: {},
    params: {
        fileId: JoiObjectId.required(),
    },
    body: {
        name: Joi.string().regex(nameRegex).required(),
    },
});

export const updateFilePublicRequestSchema = Joi.object({
    query: {},
    params: {
        fileId: JoiObjectId.required(),
    },
    body: {
        public: Joi.boolean().required(),
    },
});

export const updateFilePermissionRequestSchema = Joi.object({
    query: {},
    params: {
        fileId: JoiObjectId.required(),
    },
    body: {
        userId: Joi.string().regex(userIdRegex).required(),
        permission: Joi.string()
            .valid(...permissions)
            .required(),
    },
});

export const deleteFileRequestSchema = Joi.object({
    query: {},
    params: {
        fileId: JoiObjectId.required(),
    },
    body: {},
});

export const unshareFileRequestSchema = Joi.object({
    query: {},
    params: {
        fileId: JoiObjectId.required(),
    },
    body: {},
});

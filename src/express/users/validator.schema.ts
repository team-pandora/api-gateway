import * as Joi from 'joi';
import config from '../../config';
import { JoiObjectId } from '../../utils/joi';

const { permissions, fsObjectTypes, fsObjectsSortFields, statesSortFields, sortOrders } = config.constants;
const { fsObjectNameRegex: nameRegex, userIdRegex, minFileSizeInBytes, maxFileSizeInBytes } = config.validations;

export const getUsersRequestSchema = Joi.object({
    query: Joi.object({
        name: Joi.string().optional(),
        mail: Joi.string().optional(),
        source: Joi.string().required(),
    })
        .min(1)
        .required(),
    params: {},
    body: {},
});

export const getUserRequestSchema = Joi.object({
    query: {},
    params: {
        userId: Joi.string().regex(userIdRegex).required(),
    },
    body: {},
});

export const getQuotaRequestSchema = Joi.object({
    query: {},
    params: {},
    body: {},
});

export const getFsObjectsRequestSchema = Joi.object({
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

export const getFsObjectRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {},
});

export const downloadFileRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {},
});

export const downloadFolderRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {},
});

export const searchFsObjectsRequestSchema = Joi.object({
    query: {
        query: Joi.string().required(),
    },
    params: {},
    body: {},
});

export const shareFsObjectRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {
        userId: Joi.string().regex(userIdRegex).required(),
        permission: Joi.string()
            .valid(...permissions)
            .required(),
    },
});

export const uploadFileRequestSchema = Joi.object({
    headers: Joi.object({
        'content-type': Joi.string()
            .regex(/.*multipart\/form-data.*/)
            .required(),
    }).unknown(),
    query: {
        parent: Joi.alternatives().try(JoiObjectId, Joi.string().valid('null').empty('null').default(null)).required(),
        name: Joi.string().regex(nameRegex).required(),
        public: Joi.boolean().required(),
        size: Joi.number().min(minFileSizeInBytes).max(maxFileSizeInBytes).required(),
        client: Joi.string().required(),
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
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {},
});

export const createFolderRequestSchema = Joi.object({
    query: {},
    params: {},
    body: {
        name: Joi.string().required(),
        parent: JoiObjectId.allow(null).default(null),
    },
});

export const createShortcutRequestSchema = Joi.object({
    query: {},
    params: {},
    body: {
        name: Joi.string().required(),
        parent: JoiObjectId.allow(null).default(null),
        ref: JoiObjectId.required(),
    },
});

export const restoreFsObjectRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {},
});

export const favoriteFsObjectRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {},
});

export const duplicateFileRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {
        name: Joi.string().required(),
        parent: JoiObjectId.allow(null).default(null),
        client: Joi.string().required(),
    },
});

export const patchFileRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {
        name: Joi.string().optional(),
        parent: JoiObjectId.allow(null).default(null),
        public: Joi.boolean().optional(),
    },
});

export const patchFolderRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {
        name: Joi.string().optional(),
        parent: JoiObjectId.allow(null).default(null),
    },
});

export const patchShortcutRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {
        name: Joi.string().optional(),
        parent: JoiObjectId.allow(null).default(null),
    },
});

export const updateFsObjectPermissionRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {
        userId: Joi.string().regex(userIdRegex).required(),
        permission: Joi.string()
            .valid(...permissions)
            .required(),
    },
});

export const moveFsObjectToTrashRequestSchema = Joi.object({
    body: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    query: {},
});

export const deleteFsObjectRequestSchema = Joi.object({
    body: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    query: {},
});

export const unshareFsObjectRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {
        sharedUserId: Joi.string().regex(userIdRegex).required(),
    },
});

export const unfavoriteRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {},
});

export const generateShareTokenReqSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {
        permission: Joi.string()
            .valid(...permissions)
            .required(),
        expirationInSec: Joi.number().integer().min(0).required(),
    },
});

export const getPermissionByTokenRequestSchema = Joi.object({
    query: {
        token: Joi.string().required(),
    },
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {},
});

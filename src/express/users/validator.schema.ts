import * as Joi from 'joi';
import config from '../../config';
import { JoiObjectId } from '../../utils/joi';

const { permissions, fsObjectTypes, fsObjectsSortFields, statesSortFields, sortOrders } = config.constants;
const { fsObjectNameRegex: nameRegex, userIdRegex, minFileSizeInBytes, maxFileSizeInBytes } = config.validations;

export const getUsersRequestSchema = Joi.object({
    query: {
        name: Joi.string().optional(),
        mail: Joi.string().optional(),
        source: Joi.string().required(),
    },
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

export const downloadFsObjectRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {},
});

export const searchFsObjectRequestSchema = Joi.object({
    query: {
        query: Joi.string().required(),
    },
    params: {},
    body: {},
});

export const shareFsObjectRequestSchema = Joi.object({
    query: {},
    params: {},
    body: {
        userId: Joi.string().regex(userIdRegex).required(),
        fsObjectsId: JoiObjectId.required(),
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
        parent: JoiObjectId.default(null),
        name: Joi.string().regex(nameRegex).required(),
        public: Joi.boolean().required(),
        size: Joi.number().min(minFileSizeInBytes).max(maxFileSizeInBytes).required(),
    },
    params: {},
    body: {},
});

export const createFolderRequestSchema = Joi.object({
    query: {},
    params: {},
    body: {
        name: Joi.string().required(),
        parent: JoiObjectId.default(null),
    },
});

export const createShortcutRequestSchema = Joi.object({
    query: {},
    params: {},
    body: {
        name: Joi.string().required(),
        parent: JoiObjectId.default(null),
        ref: JoiObjectId.required(),
    },
});

export const restoreRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {},
});

export const createFavoriteRequestSchema = Joi.object({
    query: {},
    params: {},
    body: {
        fsObjectId: JoiObjectId.required(),
    },
});

export const duplicateFileRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {
        name: Joi.string().required(),
        parent: JoiObjectId.default(null),
    },
});

export const patchFileRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {
        name: Joi.string().optional(),
        parent: JoiObjectId.optional(),
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
        parent: JoiObjectId.optional(),
    },
});

export const patchShortcutRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {
        name: Joi.string().optional(),
        parent: JoiObjectId.optional(),
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

export const removeFavoritesRequestSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {},
});

export const generateShareLinkReqSchema = Joi.object({
    query: {},
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {
        permission: Joi.string()
            .valid(...permissions)
            .required(),
        time: Joi.string().required(),
    },
});

export const getShareLinkRequestSchema = Joi.object({
    query: {
        token: Joi.string().required(),
    },
    params: {
        fsObjectId: JoiObjectId.required(),
    },
    body: {},
});

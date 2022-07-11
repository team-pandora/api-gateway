import * as Joi from 'joi';
import config from '../../config';
import { JoiObjectId } from '../../utils/joi';

const { permissions } = config.constants;
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
        _id: JoiObjectId.optional(),
        bucket: Joi.string().optional(),
        client: Joi.string().optional(),
        size: Joi.number().optional(),
        public: Joi.boolean().optional(),
        name: Joi.string().optional(),
        parent: Joi.alternatives().try(JoiObjectId, Joi.string().valid('null').empty('null').default(null)).optional(),
    }).min(1),
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
    body: {
        userId: Joi.string().regex(userIdRegex).required(),
    },
});

import * as Joi from 'joi';
import config from '../../config';
import { TransfersSortByFields, TransfersSortOrders, classifications, destinations } from './interface';

export const getTransfersRequestSchema = Joi.object({
    query: Joi.object({
        // Transfer fields
        requestId: Joi.string().regex(config.transfers.idRegex).optional(),
        userId: Joi.string().regex(config.transfers.idRegex).optional(),
        recipients: Joi.array().items(Joi.string().regex(config.transfers.idRegex)).optional(),
        classification: Joi.string()
            .valid(...classifications)
            .optional(),
        fileName: Joi.string().regex(config.transfers.fileNameRegex).optional(),
        destination: Joi.string()
            .valid(...destinations)
            .optional(),

        // Sort
        sortBy: Joi.string()
            .valid(...TransfersSortByFields)
            .optional(),
        sortOrder: Joi.string()
            .valid(...TransfersSortOrders)
            .optional(),

        // Pagination
        page: Joi.number().integer().min(1).optional(),
        pageSize: Joi.number().integer().min(1).optional(),
    })
        .with('sortBy', 'sortOrder')
        .with('sortOrder', 'sortBy')
        .with('page', ['pageSize', 'sortBy', 'sortOrder'])
        .with('pageSize', ['page', 'sortBy', 'sortOrder']),
    body: {},
    params: {},
});

export const createTransferRequestSchema = Joi.object({
    body: {
        requestId: Joi.string().regex(config.transfers.idRegex).required(),
        userId: Joi.string().regex(config.transfers.idRegex).required(),
        recipients: Joi.array().items(Joi.string().regex(config.transfers.idRegex)).required(),
        classification: Joi.string()
            .valid(...classifications)
            .required(),
        fileName: Joi.string().regex(config.transfers.fileNameRegex).required(),
        fileSize: Joi.number().positive().required(),
        destination: Joi.string()
            .valid(...destinations)
            .required(),
    },
    query: {},
    params: {},
});

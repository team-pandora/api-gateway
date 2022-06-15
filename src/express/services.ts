import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import config from '../config';
import logger from '../utils/logger';
import { ServerError } from './error';

export const fsService = axios.create({
    baseURL: `${config.service.fsServiceUrl}/api`,
});

export const fsServiceErrorHandler =
    (messagePrefix: string, cleanupFunc?: () => Promise<any>) => async (error: any) => {
        if (!error?.response?.data) {
            throw new ServerError(StatusCodes.INTERNAL_SERVER_ERROR, `${messagePrefix}, internal error`, error);
        }

        const { status, message } = error.response.data;

        if (cleanupFunc) {
            await cleanupFunc().catch((err) => {
                logger.log('error', `Failed to perform cleanup after error:\n${message}\nerror:\n${err.message}`);
            });
        }

        throw new ServerError(status, `${messagePrefix}, ${message}`, error);
    };

export const storageService = axios.create({
    baseURL: `${config.service.storageServiceUrl}/api`,
});

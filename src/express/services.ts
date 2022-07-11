import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import config from '../config';
import logger from '../utils/logger';
import { ServerError } from './error';

const { url: storageServiceUrl, ...storageServiceConfig } = config.storageService;
const { url: fsCrudUrl, ...fsCrudConfig } = config.fsCrud;

export const fsService = axios.create({
    baseURL: `${fsCrudUrl}/api`,
    ...fsCrudConfig,
});

export const storageService = axios.create({
    baseURL: `${storageServiceUrl}/api/storage`,
    ...storageServiceConfig,
});

export const kartoffelService = axios.create({
    baseURL: `${config.service.kartoffelUrl}/api`,
});

export const serviceErrorHandler = (messagePrefix: string, cleanupFunc?: () => Promise<any>) => async (error: any) => {
    if (!error?.response?.data) {
        throw new ServerError(StatusCodes.INTERNAL_SERVER_ERROR, `${messagePrefix}, internal error`, error);
    }

    const { code, message } = error.response.data;

    if (cleanupFunc) {
        await cleanupFunc().catch((err) => {
            logger.log('error', `Failed to perform cleanup after error:\n${message}\nerror:\n${err.message}`);
        });
    }

    throw new ServerError(code, `${messagePrefix}, ${message}`, error);
};

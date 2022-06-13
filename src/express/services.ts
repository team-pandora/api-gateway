import axios from 'axios';
import config from '../config';

export const fsService = axios.create({
    baseURL: config.service.fsServiceUrl,
});

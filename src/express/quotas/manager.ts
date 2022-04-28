import axios from 'axios';
import config from '../../config';

export const getQuotaByUserId = async (userId: string) => {
    return (await axios.get(`${config.service.fsServiceUrl}/quotas/${userId}`)).data;
};

export const getSelfQuota = async () => {
    return (await axios.get(`${config.service.fsServiceUrl}/quotas/self`)).data;
};

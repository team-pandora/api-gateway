import axios from 'axios';
import { IUserGetReq } from './interface';
import config from '../../config';

export const searchUsers = async (filters: IUserGetReq) => {
    const { name, mail, source } = filters;
    if (!mail) {
        return axios.get(
            `http://kartoffel.branch-yesodot.org/api/entities/search?fullName=${name}&digitalIdentity.source=${source}&expanded=true`,
        );
    }
    return axios.get(`http://kartoffel.branch-yesodot.org/api/entities/digitalIdentity/${mail}&expanded=true`);
};

export const getUser = async (filters: IUserGetReq) => {
    const { userId } = filters;
    return axios.get(`http://kartoffel.branch-yesodot.org/api/entities/${userId}&expanded=true`);
};

export const getQuota = async (userId: string) => {
    return (await axios.get(`${config.service.fsServiceUrl}/quotas/${userId}`)).data;
};

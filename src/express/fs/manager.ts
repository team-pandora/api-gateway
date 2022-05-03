import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import config from '../../config';
import { IFsGetReq, INewFsObject } from './interface';

export const getFsObject = async (filters: IFsGetReq) => {
    return (await axios.get(`${config.service.fsServiceUrl}/fs`, { params: filters })).data;
};

export const getFsObjectById = async (id: string) => {
    return (await axios.get(`${config.service.fsServiceUrl}/fs/${id}`)).data;
};

export const getFsObjectHierarchy = async (id: string) => {
    return (await axios.get(`${config.service.fsServiceUrl}/fs/${id}/hierarchy`)).data;
};

export const searchFsObject = async (filters: IFsGetReq) => {
    return (await axios.get(`${config.service.fsServiceUrl}/fs/search`, { params: filters })).data;
};

// TODO
export const updateFsObject = async (id: string, fsObject: INewFsObject) => {
    return (await axios.patch(`${config.service.fsServiceUrl}/fs/${id}`, fsObject)).data;
};

export const moveFsObjects = async (ids: string[], destinationId: string) => {
    return (await axios.patch(`${config.service.fsServiceUrl}/fs/move`, { ids, destinationId })).data;
};

export const deleteFsObject = async (id: string) => {
    return (await axios.delete(`${config.service.fsServiceUrl}/fs/${id}`)).data;
};

export const shareFsObject = async (fsObjectId: string, ownerId: string, recipientId: string, permission: string) => {
    // If user
    return (
        await axios.post(`${config.service.fsServiceUrl}/fs/users/${ownerId}/fs/${fsObjectId}/share`, {
            permission,
            recipientId,
        })
    ).data;
};

export const copyFsObject = async (fsObjectId: string, destination: string, folderId: string, name: string) => {
    // If user
    return (await axios.post(`${config.service.fsServiceUrl}/fs/${fsObjectId}/copy`, { destination, folderId, name }))
        .data;
};

export const removePermissions = async (fsObjectId: string, userIds: string[]) => {
    return (await axios.delete(`${config.service.fsServiceUrl}/fs/${fsObjectId}/hierarchy`, { data: userIds })).data;
};

export const createFsObjectShareLink = async (fsObjectId: string, ownerId: string, permission: string, time: Date) => {
    return jwt.sign({ fsObjectId, ownerId, permission, time }, 'tempsecret', { algorithm: 'HS256' });
};

export const receiveFsObjectShareLink = async (token: string, recipientId: string) => {
    const payload = jwt.verify(token, 'tempsecret');

    if (typeof payload !== 'object' || !payload.iat) {
        throw new Error('Invalid JWT payload');
    }

    return shareFsObject(payload.fsObjectId, payload.ownerId, recipientId, payload.permission);
};

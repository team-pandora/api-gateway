import * as archiver from 'archiver';
import axios from 'axios';
import { Request } from 'express';
import * as FormData from 'form-data';
import * as jwt from 'jsonwebtoken';
import config from '../../config';
import { handleFileUpload } from '../../utils/express/file';
import logger from '../../utils/logger';
import { IAggregateStatesAndFsObjectsQuery, permission } from '../clients/interface';
import { fsService, fsServiceErrorHandler, storageService } from '../services';
import { IGenerateLink, INewFile, IUpdateFsObject, IUserGetReq } from './interface';

const getFolderChildren = async (userId: string, folderId: string) => {
    const response = await fsService
        .get(`/users/${userId}/fs/folder/${folderId}/children`)
        .catch(fsServiceErrorHandler('Failed to get folder children'));

    return response.data;
};

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
    const response = await fsService.get(`/users/${userId}/quota`).catch(fsServiceErrorHandler('Failed to get quota'));

    return response.data;
};

export const getFsObjects = async (userId: string, query: IAggregateStatesAndFsObjectsQuery) => {
    const response = await fsService
        .get(`/users/${userId}/states/fsObjects`, { params: query })
        .catch(fsServiceErrorHandler('Failed to get fsObjects'));

    return response.data;
};

export const getFsObject = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .get(`/users/${userId}/states/fsObjects`, {
            params: { _id: fsObjectId },
        })
        .catch(fsServiceErrorHandler('Failed to get fsObject'));

    return response.data;
};

export const shareFsObject = async (
    userId: string,
    fsObjectId: string,
    sharedUserId: string,
    sharedPermission: permission,
) => {
    const response = await fsService
        .post(`/users/${userId}/fs/${fsObjectId}/share`, {
            sharedUserId,
            sharedPermission,
        })
        .catch(fsServiceErrorHandler('Failed to share fsObject'));

    return response.data;
};

export const searchFsObject = async (userId: string, query: string) => {
    const response = await fsService
        .get(`/users/${userId}fsObjects/states/search`, { params: query })
        .catch(fsServiceErrorHandler('Failed to search fsObject'));

    return response.data;
};

export const updateFile = async (userId: string, fsObjectId: string, body: IUpdateFsObject) => {
    const response = await fsService
        .patch(`/users/${userId}/fs/file/${fsObjectId}`, body)
        .catch(fsServiceErrorHandler('Failed to update file'));

    return response.data;
};

export const updateFolder = async (userId: string, fsObjectId: string, body: IUpdateFsObject) => {
    const response = await fsService
        .patch(`/users/${userId}/fs/folder/${fsObjectId}`, body)
        .catch(fsServiceErrorHandler('Failed to update folder'));

    return response.data;
};

export const updateShortcut = async (userId: string, fsObjectId: string, body: IUpdateFsObject) => {
    const response = await fsService
        .patch(`/users/${userId}/fs/shortcut/${fsObjectId}`, body)
        .catch(fsServiceErrorHandler('Failed to update shortcut'));

    return response.data;
};

export const uploadFile = async (req: Request, file: INewFile) => {
    const response = await fsService
        .post(`/users/${req.user.id}/fs/file`, { ...file, bucket: req.user.id, client: 'drive' })
        .catch(fsServiceErrorHandler('Failed to create file'));

    await handleFileUpload(req, async (fileStream) => {
        const formData = new FormData();
        formData.append('file', fileStream);
        const uploadResponse = await storageService
            .post(`/storage/bucket/${req.user.id}/key/${response.data._id}`, formData, {
                headers: formData.getHeaders(),
            })
            .catch(
                fsServiceErrorHandler('Failed to upload file', async () => {
                    await fsService.delete(`/users/${req.user.id}/fs/file/${response.data.fsObjectId}`);
                }),
            );
        if (uploadResponse.data.size !== file.size) {
            logger.log(
                'error',
                `File size mismatch on upload, file: ${response.data._id}, expected: ${file.size}, actual: ${uploadResponse.data.size}`,
            );
        }
    });

    return response.data;
};

export const createFolder = async (userId: string, body: INewFile) => {
    const response = await fsService
        .post(`/users/${userId}/fs/folder`, body)
        .catch(fsServiceErrorHandler('Failed to create folder'));

    return response.data;
};

export const createShortcut = async (userId: string, body: INewFile) => {
    const response = await fsService
        .post(`/users/${userId}/fs/shortcut`, body)
        .catch(fsServiceErrorHandler('Failed to create shortcut'));

    return response.data;
};

export const restoreFile = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .post(`/users/${userId}/fs/file/${fsObjectId}/restore`)
        .catch(fsServiceErrorHandler('Failed to restore file'));

    return response.data;
};

export const restoreFolder = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .post(`/users/${userId}/fs/folder/${fsObjectId}/restore`)
        .catch(fsServiceErrorHandler('Failed to restore folder'));

    return response.data;
};

export const restoreShortcut = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .post(`/users/${userId}/fs/shortcut/${fsObjectId}/restore`)
        .catch(fsServiceErrorHandler('Failed to restore shortcut'));

    return response.data;
};

export const createFavorite = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .post(`/users/${userId}/fs/${fsObjectId}/favorite`)
        .catch(fsServiceErrorHandler('Failed to create favorite'));

    return response.data;
};

export const getFsObjectHierarchy = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .post(`/users/${userId}/fs/${fsObjectId}/hierarchy`)
        .catch(fsServiceErrorHandler('Failed to get fsObject hierarchy'));

    return response.data;
};

export const updateFsObjectPermission = async (
    userId: string,
    fsObjectId: string,
    sharedUserId: string,
    updatePermission: permission,
) => {
    const response = await fsService
        .patch(`/users/${userId}/fs/${fsObjectId}/permission`, {
            sharedUserId,
            updatePermission,
        })
        .catch(fsServiceErrorHandler('Failed to update fsObject permission'));

    return response.data;
};

export const removeFavorite = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .delete(`/users/${userId}/fs/${fsObjectId}/favorite`)
        .catch(fsServiceErrorHandler('Failed to remove favorite'));

    return response.data;
};

export const unshareFsObject = async (userId: string, fsObjectId: string, sharedUserId: string) => {
    const response = await fsService
        .delete(`/users/${userId}/fs/${fsObjectId}/share`, {
            data: { sharedUserId },
        })
        .catch(fsServiceErrorHandler('Failed to unshare fsObject'));

    return response.data;
};

export const moveFileToTrash = async (userId: string, fileId: string) => {
    const response = await fsService
        .post(`/users/${userId}/fs/file/${fileId}/trash`)
        .catch(fsServiceErrorHandler('Failed to delete file'));

    return response.data;
};

export const moveFolderToTrash = async (userId: string, folderId: string) => {
    const response = await fsService
        .delete(`/users/${userId}/fs/folder/${folderId}/trash`)
        .catch(fsServiceErrorHandler('Failed to delete folder'));

    return response.data;
};

export const moveShortcutToTrash = async (userId: string, shortcutId: string) => {
    const response = await fsService
        .delete(`/users/${userId}/fs/shortcut/${shortcutId}/trash`)
        .catch(fsServiceErrorHandler('Failed to delete shortcut'));

    return response.data;
};

export const deleteFilePermanent = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .delete(`/users/${userId}/fs/file/${fsObjectId}/trash`)
        .catch(fsServiceErrorHandler('Failed to delete file'));

    await storageService
        .delete(`${config.service.storageServiceUrl}/storage/bucket/${userId}`, { data: { key: [fsObjectId] } })
        .catch((error) => {
            logger.log('error', `Failed to delete file '${fsObjectId}' with bucket '${userId}' from storage: ${error}`);
        });

    return response.data;
};

export const deleteFolderPermanent = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .delete(`/users/${userId}/fs/folder/${fsObjectId}/trash`)
        .catch(fsServiceErrorHandler('Failed to delete file'));

    await storageService
        .delete(`${config.service.storageServiceUrl}/storage/bucket/${userId}`, { data: { key: [fsObjectId] } })
        .catch((error) => {
            logger.log(
                'error',
                `Failed to delete folder '${fsObjectId}' with bucket '${userId}' from storage: ${error}`,
            );
        });

    return response.data;
};

export const deleteShortcutPermanent = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .delete(`/users/${userId}/fs/shortcut/${fsObjectId}/trash`)
        .catch(fsServiceErrorHandler('Failed to delete file'));

    await storageService
        .delete(`${config.service.storageServiceUrl}/storage/bucket/${userId}`, { data: { key: [fsObjectId] } })
        .catch((error) => {
            logger.log(
                'error',
                `Failed to delete shortcut '${fsObjectId}' with bucket '${userId}' from storage: ${error}`,
            );
        });

    return response.data;
};

export const downloadFile = async (userId: string, fileId: string) => {
    const response = await storageService
        .get(`${config.service.storageServiceUrl}/storage/bucket/${userId}/key/${fileId}`, {
            responseType: 'stream',
        })
        .catch(fsServiceErrorHandler('Failed to download file'));

    return response.data;
};

export const downloadFolder = async (userId: string, folderId: string) => {
    const hierarchyObject: any = {};
    const children = await getFolderChildren(userId, folderId);

    children.data.forEach((child) => {
        if (child.parent === folderId) {
            hierarchyObject[child._id] = `${child.name}`;
        } else {
            hierarchyObject[child._id] = `${hierarchyObject[child.parent]}/${child.name}`;
        }
    });

    const archive = archiver('zip');

    archive.on('error', (err) => {
        throw err;
    });

    const results: Promise<any>[] = [];
    children.forEach((child) => {
        if (child.type === 'file') {
            results.push(downloadFile(userId, child._id));
        }
    });

    Promise.all(results).then((files) => {
        files.forEach((file) => {
            archive.append(file, { name: hierarchyObject[file._id] });
        });
    });

    return archive;
};

export const duplicateFile = async (userId: string, fileId: string, file: INewFile) => {
    const response = await fsService
        .post(`/users/${userId}/fs/file`, file)
        .catch(fsServiceErrorHandler('Failed to create file'));

    await storageService
        .post(`${config.service.storageServiceUrl}/storage/copy`, {
            body: {
                sourceBucket: userId,
                sourceKey: fileId,
                newBucket: userId,
                newKey: response.data._id,
            },
        })
        .catch(
            fsServiceErrorHandler('Failed to duplicate file', async () => {
                await fsService.delete(`/users/${userId}/fs/file/${response.data._id}`);
            }),
        );
};

export const generateShareLink = async (userId: string, fsObjectId: string, body: IGenerateLink) => {
    return jwt.sign({ ...body, userId, fsObjectId }, config.constants.jwtSecret, { algorithm: 'HS256' });
};

export const shareByLink = async (token: string, recipientId: string) => {
    const payload = jwt.verify(token, config.constants.jwtSecret);

    if (typeof payload !== 'object' || !payload.exp) {
        throw new Error('Invalid JWT payload');
    }

    return shareFsObject(payload.userId, recipientId, payload.fsObjectId, payload.permission);
};

// Delete multiple fsObjects
export const deleteFiles = async (userId: string, fsObjectIds: string[]) => {
    const results: Promise<any>[] = [];
    fsObjectIds.forEach((fsObjectId) => {
        results.push(fsService.delete(`/users/${userId}/fs/file/${fsObjectId}`));
    });
    return Promise.all(results);
};

export const deleteFolders = async (userId: string, fsObjectIds: string[]) => {
    const results: Promise<any>[] = [];
    fsObjectIds.forEach((fsObjectId) => {
        results.push(fsService.delete(`/users/${userId}/fs/folder/${fsObjectId}`));
    });
    return Promise.all(results);
};

export const deleteShortcuts = async (userId: string, fsObjectIds: string[]) => {
    const results: Promise<any>[] = [];
    fsObjectIds.forEach((fsObjectId) => {
        results.push(fsService.delete(`/users/${userId}/fs/shortcut/${fsObjectId}`));
    });
    return Promise.all(results);
};

export const deleteFavorites = async (userId: string, fsObjectIds: string[]) => {
    const results: Promise<any>[] = [];
    fsObjectIds.forEach((fsObjectId) => {
        results.push(fsService.delete(`/users/${userId}/fs/${fsObjectId}/favorite`));
    });
    return Promise.all(results);
};

export const createFavorites = async (userId: string, fsObjectIds: string[]) => {
    const results: Promise<any>[] = [];
    fsObjectIds.forEach((fsObjectId) => {
        results.push(fsService.post(`/users/${userId}/fs/${fsObjectId}/favorite`));
    });
    return Promise.all(results);
};

export const deletePermanents = async (userId: string, fsObjectIds: string[]) => {
    const results: Promise<any>[] = [];
    fsObjectIds.forEach((fsObjectId) => {
        results.push(
            storageService.delete(`${config.service.storageServiceUrl}/storage/bucket/${userId}/key/${fsObjectId}`),
        );
    });

    Promise.all(results).then((files) => {
        files.forEach(async (file) => {
            await storageService
                .delete(`${config.service.storageServiceUrl}/storage/bucket/${userId}/key/${file.data._id}`)
                .catch(fsServiceErrorHandler('Failed to delete file from S3'));
        });
    });
};

export const shareFsObjects = async (
    userId: string,
    recipientsIds: string[],
    fsObjectIds: string[],
    permissions: string,
) => {
    const results: Promise<any>[] = [];
    fsObjectIds.forEach((fsObjectId) => {
        recipientsIds.forEach(async (recipientId) => {
            results.push(
                fsService.post(`/users/${userId}/fs/${fsObjectId}/share`, {
                    sharedUserId: recipientId,
                    sharedPermission: permissions,
                }),
            );
        });
    });
    return Promise.all(results);
};

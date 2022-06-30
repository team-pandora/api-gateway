import * as archiver from 'archiver';
import axios from 'axios';
import { Request } from 'express';
import * as FormData from 'form-data';
import { StatusCodes } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import config from '../../config';
import { handleFileUpload } from '../../utils/express/file';
import logger from '../../utils/logger';
import { ServerError } from '../error';
import {
    IAggregateStatesAndFsObjectsQuery,
    IFsObject,
    IGenerateLink,
    INewFile,
    IUpdateFsObject,
    IUserGetReq,
    permission,
} from '../interface';
import { fsService, serviceErrorHandler, storageService } from '../services';

const getFolderChildren = async (userId: string, folderId: string) => {
    const response = await fsService
        .get(`/users/${userId}/fs/folder/${folderId}/children`)
        .catch(serviceErrorHandler('Failed to download folder'));

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
    const response = await fsService.get(`/users/${userId}/quota`).catch(serviceErrorHandler('Failed to get quota'));

    return response.data;
};

export const getFsObjects = async (userId: string, query: IAggregateStatesAndFsObjectsQuery) => {
    const response = await fsService
        .get(`/users/${userId}/states/fsObjects`, { params: query })
        .catch(serviceErrorHandler('Failed to get fsObjects'));

    return response.data;
};

export const getFsObject = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .get(`/users/${userId}/states/fsObjects`, {
            params: { fsObjectId },
        })
        .catch(serviceErrorHandler('Failed to get fsObject'));
    return response.data[0];
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
        .catch(serviceErrorHandler('Failed to share fsObject'));

    return response.data;
};

export const searchFsObject = async (userId: string, query: string) => {
    const response = await fsService
        .get(`/users/${userId}/fsObjects/states/search`, { params: { query } })
        .catch(serviceErrorHandler('Failed to search fsObject'));

    return response.data;
};

export const updateFile = async (userId: string, fsObjectId: string, body: IUpdateFsObject) => {
    const response = await fsService
        .patch(`/users/${userId}/fs/file/${fsObjectId}`, body)
        .catch(serviceErrorHandler('Failed to update file'));

    return response.data;
};

export const updateFolder = async (userId: string, fsObjectId: string, body: IUpdateFsObject) => {
    const response = await fsService
        .patch(`/users/${userId}/fs/folder/${fsObjectId}`, body)
        .catch(serviceErrorHandler('Failed to update folder'));

    return response.data;
};

export const updateShortcut = async (userId: string, fsObjectId: string, body: IUpdateFsObject) => {
    const response = await fsService
        .patch(`/users/${userId}/fs/shortcut/${fsObjectId}`, body)
        .catch(serviceErrorHandler('Failed to update shortcut'));

    return response.data;
};

export const uploadFile = async (req: Request, file: INewFile) => {
    const response = await fsService
        .post(`/users/${req.user.id}/fs/file`, { ...file, bucket: req.user.id, client: 'drive' })
        .catch(serviceErrorHandler('Failed to create file'));

    const uploadResponse: any = await handleFileUpload(req, async (fileStream) => {
        const formData = new FormData();
        formData.append('file', fileStream);
        return storageService
            .post(`/bucket/${req.user.id}/object/${response.data.fsObjectId}`, formData, {
                headers: formData.getHeaders(),
            })
            .catch(
                serviceErrorHandler('Failed to upload file', async () => {
                    await fsService.delete(`/users/${req.user.id}/fs/file/${response.data.fsObjectId}`);
                }),
            );
    });

    if (uploadResponse.data.size !== file.size) {
        await fsService.delete(`/users/${req.user.id}/fs/file/${response.data.fsObjectId}`).catch((error) => {
            logger.log('error', `Failed to delete file from fs (size mismatch cleanup): ${error.message}`);
        });
        await storageService
            .delete(`/bucket/${req.user.id}`, { data: { objectsList: [response.data.fsObjectId] } })
            .catch((error) => {
                logger.log('error', `Failed to delete file from storage (size mismatch cleanup): ${error.message}`);
            });

        throw new ServerError(
            StatusCodes.BAD_REQUEST,
            `Failed to upload file, file size mismatch, expected: ${file.size}, actual: ${uploadResponse.data.size}`,
        );
    }

    return response.data;
};

export const reUploadFile = async (userId: string, req: Request, fsObjectId: string, size: number) => {
    const response = await fsService
        .patch(`/users/${userId}/fs/file/${fsObjectId}`, { size })
        .catch(serviceErrorHandler('Failed to update file'));

    await handleFileUpload(req, async (fileStream) => {
        const formData = new FormData();
        formData.append('file', fileStream);
        const uploadResponse = await storageService
            .post(`/bucket/${userId}/object/${response.data._id}`, formData, {
                headers: formData.getHeaders(),
            })
            .catch(
                serviceErrorHandler('Failed to upload file', async () => {
                    await fsService.delete(`/users/${userId}/fs/file`, { params: { _id: response.data._id } });
                }),
            );

        if (uploadResponse?.data?.size !== size) {
            logger.log(
                'error',
                `File size mismatch on reUpload, file: ${fsObjectId}, expected: ${size}, actual: ${uploadResponse.data.size}`,
            );
        }
    });

    return response.data;
};

export const createFolder = async (userId: string, body: INewFile) => {
    const response = await fsService
        .post(`/users/${userId}/fs/folder`, body)
        .catch(serviceErrorHandler('Failed to create folder'));

    return response.data;
};

export const createShortcut = async (userId: string, body: INewFile) => {
    const response = await fsService
        .post(`/users/${userId}/fs/shortcut`, body)
        .catch(serviceErrorHandler('Failed to create shortcut'));

    return response.data;
};

export const restoreFile = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .post(`/users/${userId}/fs/file/${fsObjectId}/restore`)
        .catch(serviceErrorHandler('Failed to restore file'));

    return response.data;
};

export const restoreFolder = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .post(`/users/${userId}/fs/folder/${fsObjectId}/restore`)
        .catch(serviceErrorHandler('Failed to restore folder'));

    return response.data;
};

export const restoreShortcut = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .post(`/users/${userId}/fs/shortcut/${fsObjectId}/restore`)
        .catch(serviceErrorHandler('Failed to restore shortcut'));

    return response.data;
};

export const createFavorite = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .post(`/users/${userId}/fs/${fsObjectId}/favorite`)
        .catch(serviceErrorHandler('Failed to create favorite'));

    return response.data;
};

export const getFsObjectHierarchy = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .get(`/users/${userId}/fs/${fsObjectId}/hierarchy`)
        .catch(serviceErrorHandler('Failed to get fsObject hierarchy'));

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
        .catch(serviceErrorHandler('Failed to update fsObject permission'));

    return response.data;
};

export const removeFavorite = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .delete(`/users/${userId}/fs/${fsObjectId}/favorite`)
        .catch(serviceErrorHandler('Failed to remove favorite'));

    return response.data;
};

export const unshareFsObject = async (userId: string, fsObjectId: string, sharedUserId: string) => {
    const response = await fsService
        .delete(`/users/${userId}/fs/${fsObjectId}/share`, {
            data: { sharedUserId },
        })
        .catch(serviceErrorHandler('Failed to unshare fsObject'));

    return response.data;
};

export const moveFileToTrash = async (userId: string, fileId: string) => {
    const response = await fsService
        .post(`/users/${userId}/fs/file/${fileId}/trash`)
        .catch(serviceErrorHandler('Failed to move file to trash'));

    return response.data;
};

export const moveFolderToTrash = async (userId: string, folderId: string) => {
    const response = await fsService
        .post(`/users/${userId}/fs/folder/${folderId}/trash`)
        .catch(serviceErrorHandler('Failed to move folder to trash'));

    return response.data;
};

export const moveShortcutToTrash = async (userId: string, shortcutId: string) => {
    const response = await fsService
        .post(`/users/${userId}/fs/shortcut/${shortcutId}/trash`)
        .catch(serviceErrorHandler('Failed to move shortcut to trash'));

    return response.data;
};

export const deleteFileFromTrash = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .delete(`/users/${userId}/fs/file/${fsObjectId}/trash`)
        .catch(serviceErrorHandler('Failed to delete file from trash'));

    await storageService.delete(`/bucket/${userId}`, { data: { objectNames: [fsObjectId] } }).catch((error) => {
        logger.log('error', `Failed to delete file '${fsObjectId}' with bucket '${userId}' from storage: ${error}`);
    });

    return response.data;
};

export const deleteFolderFromTrash = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .delete(`/users/${userId}/fs/folder/${fsObjectId}/trash`)
        .catch(serviceErrorHandler('Failed to delete folder'));

    await storageService
        .delete(`/bucket/${userId}`, {
            data: { objectNames: response.data.deletedFiles },
        })
        .catch((error) => {
            logger.log(
                'error',
                `Failed to delete files from folder '${fsObjectId}' with bucket '${userId}' from storage: ${error}`,
            );
        });

    return response.data.deletedFolder;
};

export const deleteShortcutFromTrash = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .delete(`/users/${userId}/fs/shortcut/${fsObjectId}/trash`)
        .catch(serviceErrorHandler('Failed to delete file'));

    await storageService.delete(`/bucket/${userId}`, { data: { key: [fsObjectId] } }).catch((error) => {
        logger.log('error', `Failed to delete file '${fsObjectId}' with bucket '${userId}' from storage: ${error}`);
    });

    return response.data;
};

export const deleteFolderPermanent = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .delete(`/users/${userId}/fs/folder/${fsObjectId}/trash`)
        .catch(serviceErrorHandler('Failed to delete file'));

    await storageService.delete(`/bucket/${userId}`, { data: { key: [fsObjectId] } }).catch((error) => {
        logger.log('error', `Failed to delete folder '${fsObjectId}' with bucket '${userId}' from storage: ${error}`);
    });

    return response.data;
};

export const deleteShortcutPermanent = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .delete(`/users/${userId}/fs/shortcut/${fsObjectId}/trash`)
        .catch(serviceErrorHandler('Failed to delete file'));

    await storageService.delete(`/bucket/${userId}`, { data: { key: [fsObjectId] } }).catch((error) => {
        logger.log('error', `Failed to delete shortcut '${fsObjectId}' with bucket '${userId}' from storage: ${error}`);
    });

    return response.data;
};

export const downloadFile = async (userId: string, fileId: string) => {
    const [file] = await getFsObjects(userId, { fsObjectId: fileId, type: 'file' });

    if (!file) {
        throw new ServerError(StatusCodes.NOT_FOUND, 'File not found');
    }

    const response = await storageService
        .get(`/bucket/${userId}/object/${fileId}`, {
            responseType: 'stream',
        })
        .catch(serviceErrorHandler('Failed to download file'));

    return response.data;
};

export const downloadFolder = async (userId: string, folderId: string) => {
    const children: IFsObject[] = await getFolderChildren(userId, folderId);
    const files = children.filter((child) => child.type === 'file');

    const childrenHierarchies: { [key: string]: string } = { [folderId]: '' };

    for (let i = 0; i < children.length; i++) {
        const { _id, parent, name } = children[i];
        childrenHierarchies[_id] = `${childrenHierarchies[parent || folderId]}/${name}`;
    }

    const archive = archiver('zip');

    await new Promise((resolve, reject) => {
        archive.on('error', (err) => {
            reject(new ServerError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to download folder', err));
        });

        const downloadPromises = files.map(async ({ _id }) => {
            const fileStream = await downloadFile(userId, _id);
            archive.append(fileStream, { name: childrenHierarchies[_id] });
        });

        Promise.all(downloadPromises).then(resolve).catch(reject);
    });

    return archive;
};

export const duplicateFile = async (userId: string, fsObjectId: string, file: INewFile) => {
    const response = await fsService
        .post(`/users/${userId}/fs/file`, { ...file, public: false, bucket: userId })
        .catch(serviceErrorHandler('Failed to create file'));

    await storageService
        .post(`/bucket/${userId}/object/${fsObjectId}/copy`, {
            newBucketName: userId,
            newObjectName: response.data.fsObjectId,
        })
        .catch(
            serviceErrorHandler('Failed to duplicate file', async () => {
                await fsService.delete(`/users/${userId}/fs/file/${response.data.fsObjectId}`);
            }),
        );

    return response.data;
};

export const generateShareToken = async (userId: string, fsObjectId: string, body: IGenerateLink) => {
    const token = jwt.sign({ ...body, userId, fsObjectId }, config.service.linkSecret, {
        algorithm: 'HS256',
        expiresIn: body.expirationInSec,
    });

    return { token };
};

export const getPermissionByToken = async (token: string, recipientId: string) => {
    const payload = jwt.verify(token, config.service.linkSecret);

    if (typeof payload !== 'object' || !payload.exp) {
        throw new Error('Invalid JWT payload');
    }

    return shareFsObject(payload.userId, payload.fsObjectId, recipientId, payload.permission);
};

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
        results.push(storageService.delete(`/bucket/${userId}/object/${fsObjectId}`));
    });

    Promise.all(results).then((files) => {
        files.forEach(async (file) => {
            await storageService
                .delete(`/bucket/${userId}/object/${file.data._id}`)
                .catch(serviceErrorHandler('Failed to delete file from S3'));
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

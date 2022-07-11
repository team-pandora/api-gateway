import * as archiver from 'archiver';
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
    IDuplicateFile,
    IFile,
    IFsObject,
    IGenerateLink,
    INewFile,
    IUpdateFsObject,
    IUserFilters,
    permission,
} from '../interface';
import { fsService, kartoffelService, serviceErrorHandler, storageService } from '../services';

export const getUsers = async (filters: IUserFilters) => {
    const { name, mail, source } = filters;

    const searchUrn = mail
        ? `/entities/digitalIdentity/${mail}&expanded=true`
        : `/entities/search?fullName=${name}&digitalIdentity.source=${source}&expanded=true`;

    const response = await kartoffelService.get(searchUrn).catch(serviceErrorHandler('Failed to get users'));
    return response.data;
};

export const getUser = async (userId: string) => {
    const response = await kartoffelService
        .get(`/entities/${userId}&expanded=true`)
        .catch(serviceErrorHandler('Failed to get user'));
    return response.data;
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

    const [fsObject] = response.data;
    if (!fsObject) throw new ServerError(StatusCodes.NOT_FOUND, 'Failed to get fsObject');
    return fsObject;
};

export const searchFsObjects = async (userId: string, query: string) => {
    const response = await fsService
        .get(`/users/${userId}/fsObjects/states/search`, { params: { query } })
        .catch(serviceErrorHandler('Failed to search fsObject'));
    return response.data;
};

export const getFsObjectHierarchy = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .get(`/users/${userId}/fs/${fsObjectId}/hierarchy`)
        .catch(serviceErrorHandler('Failed to get fsObject hierarchy'));
    return response.data;
};

export const getFsObjectSharedUsers = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .get(`/users/${userId}/fs/${fsObjectId}/shared`)
        .catch(serviceErrorHandler("Failed to get fsObject's shared users"));
    return response.data;
};

export const downloadFile = async (userId: string, fileId: string) => {
    const [file] = await getFsObjects(userId, { fsObjectId: fileId, type: 'file' });
    if (!file) throw new ServerError(StatusCodes.NOT_FOUND, 'Failed to get file data');

    const response = await storageService
        .get(`/bucket/${file.bucket}/object/${file.fsObjectId}`, {
            responseType: 'stream',
        })
        .catch(serviceErrorHandler('Failed to download file'));
    return response.data;
};

const getFolderChildren = async (userId: string, folderId: string) => {
    const response = await fsService
        .get(`/users/${userId}/fs/folder/${folderId}/children`)
        .catch(serviceErrorHandler('Failed to get folder data'));
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

export const getPermissionByToken = async (token: string, recipientId: string) => {
    try {
        const payload = jwt.verify(token, config.service.linkSecret);

        if (typeof payload !== 'object' || !payload.exp) {
            throw new Error('Invalid token');
        }

        return shareFsObject(payload.userId, payload.fsObjectId, recipientId, payload.permission);
    } catch (error: any) {
        throw new ServerError(StatusCodes.UNAUTHORIZED, `Failed to validate token, ${error.message}`, error);
    }
};

export const generateShareToken = async (userId: string, fsObjectId: string, body: IGenerateLink) => {
    try {
        const token = jwt.sign({ userId, fsObjectId, permission: body.permission }, config.service.linkSecret, {
            algorithm: 'HS256',
            expiresIn: body.expirationInSec,
        });
        return { token };
    } catch (error) {
        throw new ServerError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to generate share token', error);
    }
};

export const uploadFile = async (userId: string, req: Request, newFile: INewFile) => {
    const file = (
        await fsService
            .post(`/users/${userId}/fs/file`, { ...newFile, bucket: userId })
            .catch(serviceErrorHandler('Failed to create file'))
    ).data;

    const uploadResponse: any = await handleFileUpload(req, async (fileStream) => {
        const formData = new FormData();
        formData.append('file', fileStream);
        return storageService
            .post(`/bucket/${file.bucket}/object/${file.fsObjectId}`, formData, {
                headers: formData.getHeaders(),
            })
            .catch(
                serviceErrorHandler('Failed to upload file', async () => {
                    await fsService.delete(`/users/${userId}/fs/file/${file.fsObjectId}`);
                }),
            );
    });

    if (uploadResponse?.data?.size !== file.size) {
        await fsService.delete(`/users/${userId}/fs/file/${file.fsObjectId}`).catch((error) => {
            logger.log('error', `Failed to delete file from fs (size mismatch cleanup): ${error.message}`);
        });
        await storageService.delete(`/bucket/${file.bucket}/object/${file.fsObjectId}`).catch((error) => {
            logger.log('error', `Failed to delete file from storage (size mismatch cleanup): ${error.message}`);
        });

        throw new ServerError(
            StatusCodes.BAD_REQUEST,
            `Failed to upload file, file size mismatch, expected: ${newFile.size}, actual: ${uploadResponse.data.size}`,
        );
    }

    return file;
};

export const reUploadFile = async (userId: string, req: Request, fsObjectId: string, size: number) => {
    const file = (
        await fsService
            .patch(`/users/${userId}/fs/file/${fsObjectId}`, { size })
            .catch(serviceErrorHandler('Failed to update file'))
    ).data;

    const uploadResponse: any = await handleFileUpload(req, async (fileStream) => {
        const formData = new FormData();
        formData.append('file', fileStream);
        return storageService
            .post(`/bucket/${file.bucket}/object/${file.fsObjectId}`, formData, {
                headers: formData.getHeaders(),
            })
            .catch(
                serviceErrorHandler('Failed to upload file', async () => {
                    await fsService.delete(`/users/${userId}/fs/file/${file.fsObjectId}`);
                }),
            );
    });

    if (uploadResponse?.data?.size !== file.size) {
        logger.log(
            'error',
            `File size mismatch on reUpload, file: ${file.fsObjectId}, expected: ${file.size}, actual: ${uploadResponse.data.size}`,
        );
    }

    return file;
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

export const favoriteFsObject = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .post(`/users/${userId}/fs/${fsObjectId}/favorite`)
        .catch(serviceErrorHandler('Failed to create favorite'));
    return response.data;
};

export const duplicateFile = async (userId: string, fsObjectId: string, newFile: IDuplicateFile) => {
    const [originalFile] = await getFsObjects(userId, { fsObjectId, type: 'file' });
    if (!originalFile) throw new ServerError(StatusCodes.NOT_FOUND, 'Failed to get file data');

    const file = (
        await fsService
            .post(`/users/${userId}/fs/file`, { ...newFile, public: false, bucket: userId })
            .catch(serviceErrorHandler('Failed to create file'))
    ).data;

    await storageService
        .post(`/bucket/${originalFile.bucket}/object/${originalFile.fsObjectId}/copy`, {
            newBucketName: file.bucket,
            newObjectName: file.fsObjectId,
        })
        .catch(
            serviceErrorHandler('Failed to duplicate file', async () => {
                await fsService.delete(`/users/${userId}/fs/file/${file.fsObjectId}`);
            }),
        );

    return file;
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

export const deleteFileFromTrash = async (userId: string, fsObjectId: string) => {
    const file = (
        await fsService
            .delete(`/users/${userId}/fs/file/${fsObjectId}/trash`)
            .catch(serviceErrorHandler('Failed to delete file from trash'))
    ).data;

    if (file.permission === 'owner') {
        await storageService.delete(`/bucket/${file.bucket}/object/${file.fsObjectId}`).catch((error) => {
            logger.log('error', `Failed to delete file '${fsObjectId}' with bucket '${userId}' from storage: ${error}`);
        });
    }

    return file;
};

export const deleteFolderFromTrash = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .delete(`/users/${userId}/fs/folder/${fsObjectId}/trash`)
        .catch(serviceErrorHandler('Failed to delete folder'));

    const deletePromises = response.data.deletedFiles.map((file: IFile) =>
        storageService.delete(`/bucket/${file.bucket}/object/${file._id}`).catch((error) => {
            logger.log(
                'error',
                `Failed to delete file '${file._id}' with bucket '${file.bucket}' from storage: ${error}`,
            );
        }),
    );

    await Promise.allSettled(deletePromises);

    return response.data.deletedFolder;
};

export const deleteShortcutFromTrash = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .delete(`/users/${userId}/fs/shortcut/${fsObjectId}/trash`)
        .catch(serviceErrorHandler('Failed to delete shortcut'));
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

export const unfavorite = async (userId: string, fsObjectId: string) => {
    const response = await fsService
        .delete(`/users/${userId}/fs/${fsObjectId}/favorite`)
        .catch(serviceErrorHandler('Failed to remove favorite'));
    return response.data;
};

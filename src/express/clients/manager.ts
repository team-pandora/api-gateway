import { Request } from 'express';
import * as FormData from 'form-data';
import { StatusCodes } from 'http-status-codes';
import { handleFileUpload } from '../../utils/express/file';
import logger from '../../utils/logger';
import { ServerError } from '../error';
import { fsService, serviceErrorHandler, storageService } from '../services';
import { IAggregateStatesAndFsObjectsQuery, INewFile, permission } from './interface';

export const uploadFile = async (client: string, req: Request, file: INewFile) => {
    const response = await fsService
        .post(`/clients/${client}/fs/file`, { ...file, bucket: client })
        .catch(serviceErrorHandler('Failed to create file'));

    const uploadResponse: any = await handleFileUpload(req, async (fileStream) => {
        const formData = new FormData();
        formData.append('file', fileStream);
        return storageService
            .post(`/bucket/${client}/key/${response.data._id}`, formData, {
                headers: formData.getHeaders(),
            })
            .catch(
                serviceErrorHandler('Failed to upload file', async () => {
                    await fsService.delete(`/clients/${client}/fs/file`, { params: { _id: response.data._id } });
                }),
            );
    });

    if (uploadResponse.data.size !== file.size) {
        await fsService.delete(`/clients/${client}/fs/file`, { params: { _id: response.data._id } }).catch((error) => {
            logger.log('error', `Failed to delete file from fs (size mismatch cleanup): ${error.message}`);
        });
        await storageService.delete(`/bucket/${client}`, { data: { key: [response.data._id] } }).catch((error) => {
            logger.log('error', `Failed to delete file from storage (size mismatch cleanup): ${error.message}`);
        });

        throw new ServerError(
            StatusCodes.BAD_REQUEST,
            `Failed to upload file, file size mismatch, expected: ${file.size}, actual: ${uploadResponse.data.size}`,
        );
    }

    return response.data;
};

export const reUploadFile = async (client: string, req: Request, fileId: string, size: number) => {
    const response = await fsService
        .patch(`/clients/${client}/fs/file/${fileId}`, { size })
        .catch(serviceErrorHandler('Failed to update file'));

    await handleFileUpload(req, async (fileStream) => {
        const formData = new FormData();
        formData.append('file', fileStream);
        const uploadResponse = await storageService
            .post(`/bucket/${client}/key/${response.data._id}`, formData, {
                headers: formData.getHeaders(),
            })
            .catch(
                serviceErrorHandler('Failed to upload file', async () => {
                    await fsService.delete(`/clients/${client}/fs/file`, { params: { _id: response.data._id } });
                }),
            );
        if (uploadResponse.data.size !== size) {
            logger.log(
                'error',
                `File size mismatch on reUpload, file: ${fileId}, expected: ${size}, actual: ${uploadResponse.data.size}`,
            );
        }
    });

    return response.data;
};

export const downloadFile = async (client: string, fileId: string) => {
    const response = await storageService
        .get(`/bucket/${client}/key/${fileId}`, { responseType: 'stream' })
        .catch(serviceErrorHandler('Failed to download file'));

    return response.data;
};

export const shareFile = async (client: string, fileId: string, sharedUserId: string, sharedPermission: permission) => {
    const response = await fsService
        .post(`/clients/${client}/fs/file/${fileId}/share`, { sharedUserId, sharedPermission })
        .catch(serviceErrorHandler('Failed to share file'));

    return response.data;
};

export const getFiles = async (client: string, query: IAggregateStatesAndFsObjectsQuery) => {
    const response = await fsService
        .get(`/clients/${client}/fs/files`, { params: query })
        .catch(serviceErrorHandler('Failed to get files'));

    return response.data;
};

export const getFile = async (client: string, fileId: string) => {
    const response = await fsService
        .get(`/clients/${client}/fs/files`, { params: { _id: fileId } })
        .catch(serviceErrorHandler('Failed to get file'));

    return response.data;
};

export const updateFileName = async (client: string, fileId: string, name: string) => {
    const response = await fsService
        .patch(`/clients/${client}/fs/file/${fileId}`, { name })
        .catch(serviceErrorHandler('Failed to update file name'));

    return response.data;
};

export const updateFilePublic = async (client: string, fileId: string, isPublic: boolean) => {
    const response = await fsService
        .patch(`/clients/${client}/fs/file/${fileId}`, { public: isPublic })
        .catch(serviceErrorHandler('Failed to update file public'));

    return response.data;
};

export const updateFilePermission = async (
    client: string,
    fileId: string,
    sharedUserId: string,
    updatePermission: permission,
) => {
    const response = await fsService
        .patch(`/clients/${client}/fs/file/${fileId}/permission`, { sharedUserId, updatePermission })
        .catch(serviceErrorHandler('Failed to update file permission'));

    return response.data;
};

export const deleteFile = async (client: string, fileId: string) => {
    const response = await fsService
        .delete(`/clients/${client}/fs/file/${fileId}`)
        .catch(serviceErrorHandler('Failed to delete file'));

    await storageService.delete(`/bucket/${client}`, { data: { keys: [fileId] } }).catch((error) => {
        logger.log('error', `Failed to delete file '${fileId}' with bucket '${client}' from storage: ${error}`);
    });

    return response.data;
};

export const unshareFile = async (client: string, fileId: string) => {
    const response = await fsService
        .delete(`/clients/${client}/fs/file/${fileId}/share`)
        .catch(serviceErrorHandler('Failed to unshare file'));

    return response.data;
};

import { Request } from 'express';
import * as FormData from 'form-data';
import { StatusCodes } from 'http-status-codes';
import { handleFileUpload } from '../../utils/express/file';
import logger from '../../utils/logger';
import { ServerError } from '../error';
import { IAggregateStatesAndFsObjectsQuery, INewFile, permission } from '../interface';
import { fsService, serviceErrorHandler, storageService } from '../services';

export const uploadFile = async (client: string, req: Request, newFile: INewFile) => {
    const file = (
        await fsService
            .post(`/clients/${client}/fs/file`, { ...newFile, bucket: client })
            .catch(serviceErrorHandler('Failed to create file'))
    ).data;

    const uploadResponse: any = await handleFileUpload(req, async (fileStream) => {
        const formData = new FormData();
        formData.append('file', fileStream);
        return storageService
            .post(`/bucket/${client}/object/${file._id}`, formData, {
                headers: formData.getHeaders(),
            })
            .catch(
                serviceErrorHandler('Failed to upload file', async () => {
                    await fsService.delete(`/clients/${client}/fs/file/${file._id}`);
                }),
            );
    });

    if (uploadResponse?.data?.size !== file.size) {
        await fsService.delete(`/clients/${client}/fs/file/${file._id}`).catch((error) => {
            logger.log('error', `Failed to delete file from fs (size mismatch cleanup): ${error.message}`);
        });
        await storageService.delete(`/bucket/${file.bucket}/object/${file._id}`).catch((error) => {
            logger.log('error', `Failed to delete file from storage (size mismatch cleanup): ${error.message}`);
        });

        throw new ServerError(
            StatusCodes.BAD_REQUEST,
            `Failed to upload file, file size mismatch, expected: ${file.size}, actual: ${uploadResponse.data.size}`,
        );
    }

    return file;
};

export const reUploadFile = async (client: string, req: Request, fileId: string, size: number) => {
    const file = (
        await fsService
            .patch(`/clients/${client}/fs/file/${fileId}`, { size })
            .catch(serviceErrorHandler('Failed to update file'))
    ).data;

    const uploadResponse: any = await handleFileUpload(req, async (fileStream) => {
        const formData = new FormData();
        formData.append('file', fileStream);
        return storageService
            .post(`/bucket/${file.bucket}/object/${file._id}`, formData, {
                headers: formData.getHeaders(),
            })
            .catch(
                serviceErrorHandler('Failed to upload file', async () => {
                    await fsService.delete(`/clients/${client}/fs/file/${file._id}`);
                }),
            );
    });

    if (uploadResponse?.data?.size !== file.size) {
        logger.log(
            'error',
            `File size mismatch on reUpload, file: ${file._id}, expected: ${file.size}, actual: ${uploadResponse.data.size}`,
        );
    }

    return file;
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

    const [file] = response.data;
    if (!file) throw new ServerError(StatusCodes.NOT_FOUND, 'Failed to get file');
    return file;
};

export const downloadFile = async (client: string, fileId: string) => {
    const file = await getFile(client, fileId);

    const fileResponse = await storageService
        .get(`/bucket/${file.bucket}/object/${file._id}`, { responseType: 'stream' })
        .catch(serviceErrorHandler('Failed to download file'));
    return fileResponse.data;
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
    const file = (
        await fsService
            .delete(`/clients/${client}/fs/file/${fileId}`)
            .catch(serviceErrorHandler('Failed to delete file'))
    ).data;

    await storageService.delete(`/bucket/${file.bucket}/object/${file._id}`).catch((error) => {
        logger.log('error', `Failed to delete file '${file._id}' with bucket '${file.bucket}' from storage: ${error}`);
    });

    return file;
};

export const unshareFile = async (client: string, fileId: string, sharedUserId: string) => {
    const response = await fsService
        .delete(`/clients/${client}/fs/file/${fileId}/share`, { params: { sharedUserId } })
        .catch(serviceErrorHandler('Failed to unshare file'));
    return response.data;
};

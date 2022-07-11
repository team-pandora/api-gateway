import { Router } from 'express';
import wrapMiddleware from '../../utils/express';
import ValidateRequest from '../../utils/joi';
import * as ClientsController from './controller';
import * as ValidatorSchemas from './validator.schema';

const clientsRouter = Router();

clientsRouter.post(
    '/files/upload',
    ValidateRequest(ValidatorSchemas.uploadFileRequestSchema),
    wrapMiddleware(ClientsController.uploadFile),
);

clientsRouter.post(
    '/files/:fileId/reupload',
    ValidateRequest(ValidatorSchemas.reUploadFileRequestSchema),
    wrapMiddleware(ClientsController.reUploadFile),
);

clientsRouter.post(
    '/files/fileId/share',
    ValidateRequest(ValidatorSchemas.shareFileRequestSchema),
    wrapMiddleware(ClientsController.shareFile),
);

clientsRouter.get(
    '/files/:fileId/download',
    ValidateRequest(ValidatorSchemas.downloadFileRequestSchema),
    wrapMiddleware(ClientsController.downloadFile),
);

clientsRouter.get(
    '/files',
    ValidateRequest(ValidatorSchemas.getFilesRequestSchema),
    wrapMiddleware(ClientsController.getFiles),
);

clientsRouter.get(
    '/files/:fileId',
    ValidateRequest(ValidatorSchemas.getFileRequestSchema),
    wrapMiddleware(ClientsController.getFile),
);

clientsRouter.patch(
    '/files/:fileId/name',
    ValidateRequest(ValidatorSchemas.updateFileNameRequestSchema),
    wrapMiddleware(ClientsController.updateFileName),
);

clientsRouter.patch(
    '/files/:fileId/public',
    ValidateRequest(ValidatorSchemas.updateFilePublicRequestSchema),
    wrapMiddleware(ClientsController.updateFilePublic),
);

clientsRouter.patch(
    '/files/:fileId/permission',
    ValidateRequest(ValidatorSchemas.updateFilePermissionRequestSchema),
    wrapMiddleware(ClientsController.updateFilePermission),
);

clientsRouter.delete(
    '/files/:fileId',
    ValidateRequest(ValidatorSchemas.deleteFileRequestSchema),
    wrapMiddleware(ClientsController.deleteFile),
);

clientsRouter.delete(
    '/files/:fileId/share',
    ValidateRequest(ValidatorSchemas.unshareFileRequestSchema),
    wrapMiddleware(ClientsController.unshareFile),
);
export default clientsRouter;

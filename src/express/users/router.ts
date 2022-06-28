import { Router } from 'express';
import wrapMiddleware from '../../utils/express';
import ValidateRequest from '../../utils/joi';
import * as UsersController from './controller';
import * as ValidatorSchemas from './validator.schema';

const usersRouter = Router();

usersRouter.get(
    '/users',
    ValidateRequest(ValidatorSchemas.getUsersRequestSchema),
    wrapMiddleware(UsersController.getUsers),
);

usersRouter.get(
    '/users/:userId',
    ValidateRequest(ValidatorSchemas.getUserRequestSchema),
    wrapMiddleware(UsersController.getUsers),
);

usersRouter.get(
    '/quota',
    ValidateRequest(ValidatorSchemas.getQuotaRequestSchema),
    wrapMiddleware(UsersController.getQuota),
);

usersRouter.get(
    '/fs/query',
    ValidateRequest(ValidatorSchemas.getFsObjectsRequestSchema),
    wrapMiddleware(UsersController.getFsObjects),
);

usersRouter.get(
    '/fs/query/:fsObjectId',
    ValidateRequest(ValidatorSchemas.getFsObjectRequestSchema),
    wrapMiddleware(UsersController.getFsObject),
);

usersRouter.get(
    '/fs/search',
    ValidateRequest(ValidatorSchemas.searchFsObjectsRequestSchema),
    wrapMiddleware(UsersController.searchFsObject),
);

usersRouter.get(
    '/fs/:fsObjectId/hierarchy',
    ValidateRequest(ValidatorSchemas.getFsObjectRequestSchema),
    wrapMiddleware(UsersController.getFsObjectHierarchy),
);

usersRouter.get(
    '/fs/file/:fsObjectId/download',
    ValidateRequest(ValidatorSchemas.downloadFsObjectRequestSchema),
    wrapMiddleware(UsersController.downloadFile),
);

usersRouter.get(
    '/fs/folder/:fsObjectId/download',
    ValidateRequest(ValidatorSchemas.downloadFsObjectRequestSchema),
    wrapMiddleware(UsersController.downloadFolder),
);

usersRouter.post(
    '/fs/share',
    ValidateRequest(ValidatorSchemas.shareFsObjectRequestSchema),
    wrapMiddleware(UsersController.shareFsObject),
);

usersRouter.post(
    '/fs/file',
    ValidateRequest(ValidatorSchemas.uploadFileRequestSchema),
    wrapMiddleware(UsersController.uploadFile),
);

usersRouter.post(
    '/fs/folder',
    ValidateRequest(ValidatorSchemas.createFolderRequestSchema),
    wrapMiddleware(UsersController.createFolder),
);

usersRouter.post(
    '/fs/shortcut',
    ValidateRequest(ValidatorSchemas.createShortcutRequestSchema),
    wrapMiddleware(UsersController.createShortcut),
);

usersRouter.post(
    '/fs/file/:fsObjectId/restore',
    ValidateRequest(ValidatorSchemas.restoreRequestSchema),
    wrapMiddleware(UsersController.restoreFile),
);

usersRouter.post(
    '/fs/folder/:fsObjectId/restore',
    ValidateRequest(ValidatorSchemas.restoreRequestSchema),
    wrapMiddleware(UsersController.restoreFolder),
);

usersRouter.post(
    '/fs/shortcut/:fsObjectId/restore',
    ValidateRequest(ValidatorSchemas.restoreRequestSchema),
    wrapMiddleware(UsersController.restoreShortcut),
);

usersRouter.post(
    '/fs/favorite',
    ValidateRequest(ValidatorSchemas.createFavoriteRequestSchema),
    wrapMiddleware(UsersController.createFavorite),
);

usersRouter.post(
    '/fs/file/:fsObjectId/duplicate',
    ValidateRequest(ValidatorSchemas.duplicateFileRequestSchema),
    wrapMiddleware(UsersController.duplicateFile),
);

usersRouter.patch(
    '/fs/file/:fsObjectId',
    ValidateRequest(ValidatorSchemas.patchFileRequestSchema),
    wrapMiddleware(UsersController.updateFile),
);

usersRouter.patch(
    '/fs/folder/:fsObjectId',
    ValidateRequest(ValidatorSchemas.patchFolderRequestSchema),
    wrapMiddleware(UsersController.updateFolder),
);

usersRouter.patch(
    '/fs/shortcut/:fsObjectId',
    ValidateRequest(ValidatorSchemas.patchShortcutRequestSchema),
    wrapMiddleware(UsersController.updateShortcut),
);

usersRouter.patch(
    '/fs/:fsObjectId/permission',
    ValidateRequest(ValidatorSchemas.updateFsObjectPermissionRequestSchema),
    wrapMiddleware(UsersController.updateFsObjectPermission),
);

usersRouter.post(
    '/fs/file/:fsObjectId/trash',
    ValidateRequest(ValidatorSchemas.deleteFsObjectRequestSchema),
    wrapMiddleware(UsersController.moveFileToTrash),
);

usersRouter.post(
    '/fs/folder/:fsObjectId/trash',
    ValidateRequest(ValidatorSchemas.deleteFsObjectRequestSchema),
    wrapMiddleware(UsersController.moveFolderToTrash),
);

usersRouter.post(
    '/fs/shortcut/:fsObjectId/trash',
    ValidateRequest(ValidatorSchemas.deleteFsObjectRequestSchema),
    wrapMiddleware(UsersController.moveShortcutToTrash),
);

usersRouter.delete(
    '/fs/file/:fsObjectId/trash',
    ValidateRequest(ValidatorSchemas.deleteFsObjectRequestSchema),
    wrapMiddleware(UsersController.deleteFileFromTrash),
);

usersRouter.delete(
    '/fs/folder/:fsObjectId/trash',
    ValidateRequest(ValidatorSchemas.deleteFsObjectRequestSchema),
    wrapMiddleware(UsersController.deleteFolderFromTrash),
);

usersRouter.delete(
    '/fs/shortcut/:fsObjectId/trash',
    ValidateRequest(ValidatorSchemas.deleteFsObjectRequestSchema),
    wrapMiddleware(UsersController.deleteShortcutFromTrash),
);

usersRouter.delete(
    '/fs/:fsObjectId/share',
    ValidateRequest(ValidatorSchemas.unshareFsObjectRequestSchema),
    wrapMiddleware(UsersController.unshareFsObject),
);

usersRouter.delete(
    '/fs/:fsObjectId/favorite',
    ValidateRequest(ValidatorSchemas.removeFavoritesRequestSchema),
    wrapMiddleware(UsersController.removeFavorite),
);

usersRouter.post(
    '/fs/:fsObjectId/share/token',
    ValidateRequest(ValidatorSchemas.generateShareTokenReqSchema),
    wrapMiddleware(UsersController.generateShareToken),
);

usersRouter.get(
    '/fs/:fsObjectId/permission/token',
    ValidateRequest(ValidatorSchemas.getPermissionByTokenRequestSchema),
    wrapMiddleware(UsersController.getPermissionByToken),
);

export default usersRouter;

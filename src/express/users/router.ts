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
    '/fs',
    ValidateRequest(ValidatorSchemas.getFsObjectsRequestSchema),
    wrapMiddleware(UsersController.getFsObjects),
);

usersRouter.get(
    '/fs/:fsObjectId',
    ValidateRequest(ValidatorSchemas.getFsObjectRequestSchema),
    wrapMiddleware(UsersController.getFsObject),
);

usersRouter.get(
    '/fs/search',
    ValidateRequest(ValidatorSchemas.searchFsObjectRequestSchema),
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
    '/fs/file/:fileId/duplicate',
    ValidateRequest(ValidatorSchemas.duplicateFileRequestSchema),
    wrapMiddleware(UsersController.duplicateFile),
);

usersRouter.patch(
    '/fs/file/:fileId',
    ValidateRequest(ValidatorSchemas.patchFileRequestSchema),
    wrapMiddleware(UsersController.updateFile),
);

usersRouter.patch(
    '/fs/folder/:folderId',
    ValidateRequest(ValidatorSchemas.patchFolderRequestSchema),
    wrapMiddleware(UsersController.updateFolder),
);

usersRouter.patch(
    '/fs/shortcut/:shortcutId',
    ValidateRequest(ValidatorSchemas.patchShortcutRequestSchema),
    wrapMiddleware(UsersController.updateShortcut),
);

usersRouter.patch(
    '/fs/:fsObjectId/permission',
    ValidateRequest(ValidatorSchemas.updateFsObjectPermissionRequestSchema),
    wrapMiddleware(UsersController.updatePermission),
);

usersRouter.delete(
    '/fs/file/:fsObjectId',
    ValidateRequest(ValidatorSchemas.deleteFsObjectRequestSchema),
    wrapMiddleware(UsersController.deleteFile),
);

usersRouter.delete(
    '/fs/folder/:fsObjectId',
    ValidateRequest(ValidatorSchemas.deleteFsObjectRequestSchema),
    wrapMiddleware(UsersController.deleteFolder),
);

usersRouter.delete(
    '/fs/shortcut/:fsObjectId',
    ValidateRequest(ValidatorSchemas.deleteFsObjectRequestSchema),
    wrapMiddleware(UsersController.deleteShortcut),
);

usersRouter.delete(
    '/fs/file/permanent',
    ValidateRequest(ValidatorSchemas.deleteFsObjectRequestSchema),
    wrapMiddleware(UsersController.deletePermanent),
);

usersRouter.delete(
    '/fs/:fsObjectId/share',
    ValidateRequest(ValidatorSchemas.unshareFsObjectRequestSchema),
    wrapMiddleware(UsersController.unshareFsObject),
);

usersRouter.delete(
    '/fs/favorite/:fsObjectId',
    ValidateRequest(ValidatorSchemas.removeFavoritesRequestSchema),
    wrapMiddleware(UsersController.removeFavorite),
);

usersRouter.get(
    '/fs/:fsObjectId/share/link',
    ValidateRequest(ValidatorSchemas.generateShareLinkReqSchema),
    wrapMiddleware(UsersController.generateShareLink),
);

usersRouter.post(
    '/share/link',
    ValidateRequest(ValidatorSchemas.getShareLinkRequestSchema),
    wrapMiddleware(UsersController.shareByLink),
);

export default usersRouter;

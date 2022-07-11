import { Request, Response } from 'express';
import * as stream from 'stream';
import { promisify } from 'util';
import * as usersManager from './manager';

export const getUsers = async (req: Request, res: Response) => {
    res.json(await usersManager.getUsers(req.query));
};

export const getUser = async (req: Request, res: Response) => {
    res.json(await usersManager.getUser(req.params.userId));
};

export const getQuota = async (req: Request, res: Response) => {
    res.json(await usersManager.getQuota(req.user.id));
};

export const getFsObjects = async (req: Request, res: Response) => {
    res.json(await usersManager.getFsObjects(req.user.id, req.query));
};

export const getFsObject = async (req: Request, res: Response) => {
    res.json(await usersManager.getFsObject(req.user.id, req.params.fsObjectId));
};

export const searchFsObjects = async (req: Request, res: Response) => {
    res.json(await usersManager.searchFsObjects(req.user.id, req.query.query as string));
};

export const getFsObjectHierarchy = async (req: Request, res: Response) => {
    res.json(await usersManager.getFsObjectHierarchy(req.user.id, req.params.fsObjectId));
};

export const getFsObjectSharedUsers = async (req: Request, res: Response) => {
    res.json(await usersManager.getFsObjectSharedUsers(req.user.id, req.params.fsObjectId));
};

export const downloadFile = async (req: Request, res: Response) => {
    const fileStream = await usersManager.downloadFile(req.user.id, req.params.fsObjectId);
    fileStream.pipe(res);
    await promisify(stream.finished)(fileStream);
};

export const downloadFolder = async (req: Request, res: Response) => {
    const folder = await usersManager.getFsObject(req.user.id, req.params.fsObjectId);
    const archive = await usersManager.downloadFolder(req.user.id, req.params.fsObjectId);

    res.setHeader('Content-type', 'application/zip');
    res.attachment(`${folder.name}.zip`);

    archive.pipe(res);
    await archive.finalize();
};

export const getPermissionByToken = async (req: Request, res: Response) => {
    res.json(await usersManager.getPermissionByToken(req.query.token as string, req.user.id));
};

export const generateShareToken = async (req: Request, res: Response) => {
    res.json(await usersManager.generateShareToken(req.user.id, req.params.fsObjectId, req.body));
};

export const uploadFile = async (req: Request, res: Response) => {
    res.json(await usersManager.uploadFile(req.user.id, req, req.query));
};

export const reUploadFile = async (req: Request<{ fsObjectId: string }, any, {}, any>, res: Response) => {
    res.json(await usersManager.reUploadFile(req.user.id, req, req.params.fsObjectId, req.query.size));
};

export const createFolder = async (req: Request, res: Response) => {
    res.json(await usersManager.createFolder(req.user.id, req.body));
};

export const createShortcut = async (req: Request, res: Response) => {
    res.json(await usersManager.createShortcut(req.user.id, req.body));
};

export const shareFsObject = async (req: Request, res: Response) => {
    const { userId, permission } = req.body;
    res.json(await usersManager.shareFsObject(req.user.id, req.params.fsObjectId, userId, permission));
};

export const moveFileToTrash = async (req: Request, res: Response) => {
    res.json(await usersManager.moveFileToTrash(req.user.id, req.params.fsObjectId));
};

export const moveFolderToTrash = async (req: Request, res: Response) => {
    res.json(await usersManager.moveFolderToTrash(req.user.id, req.params.fsObjectId));
};

export const moveShortcutToTrash = async (req: Request, res: Response) => {
    res.json(await usersManager.moveShortcutToTrash(req.user.id, req.params.fsObjectId));
};

export const restoreFile = async (req: Request, res: Response) => {
    res.json(await usersManager.restoreFile(req.user.id, req.params.fsObjectId));
};

export const restoreFolder = async (req: Request, res: Response) => {
    res.json(await usersManager.restoreFolder(req.user.id, req.params.fsObjectId));
};

export const restoreShortcut = async (req: Request, res: Response) => {
    res.json(await usersManager.restoreShortcut(req.user.id, req.params.fsObjectId));
};

export const favoriteFsObject = async (req: Request, res: Response) => {
    res.json(await usersManager.favoriteFsObject(req.user.id, req.params.fsObjectId));
};

export const duplicateFile = async (req: Request, res: Response) => {
    res.json(await usersManager.duplicateFile(req.user.id, req.params.fsObjectId, req.body));
};

export const updateFile = async (req: Request, res: Response) => {
    res.json(await usersManager.updateFile(req.user.id, req.params.fsObjectId, req.body));
};

export const updateFolder = async (req: Request, res: Response) => {
    res.json(await usersManager.updateFolder(req.user.id, req.params.fsObjectId, req.body));
};

export const updateShortcut = async (req: Request, res: Response) => {
    res.json(await usersManager.updateShortcut(req.user.id, req.params.fsObjectId, req.body));
};

export const updateFsObjectPermission = async (req: Request, res: Response) => {
    const { userId, permission } = req.body;
    res.json(await usersManager.updateFsObjectPermission(req.user.id, req.params.fsObjectId, userId, permission));
};

export const deleteFileFromTrash = async (req: Request, res: Response) => {
    res.json(await usersManager.deleteFileFromTrash(req.user.id, req.params.fsObjectId));
};

export const deleteFolderFromTrash = async (req: Request, res: Response) => {
    res.json(await usersManager.deleteFolderFromTrash(req.user.id, req.params.fsObjectId));
};

export const deleteShortcutFromTrash = async (req: Request, res: Response) => {
    res.json(await usersManager.deleteShortcutFromTrash(req.user.id, req.params.fsObjectId));
};

export const unshareFsObject = async (req: Request, res: Response) => {
    res.json(await usersManager.unshareFsObject(req.user.id, req.params.fsObjectId, req.body.sharedUserId));
};

export const unfavorite = async (req: Request, res: Response) => {
    res.json(await usersManager.unfavorite(req.user.id, req.params.fsObjectId));
};

import { Request, Response } from 'express';
import * as stream from 'stream';
import { promisify } from 'util';
import * as usersManager from './manager';

export const getUsers = async (req: Request, res: Response) => {
    res.json(await usersManager.searchUsers(req.query));
};

export const getUser = async (req: Request, res: Response) => {
    res.json(await usersManager.getUser(req.params));
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

export const shareFsObject = async (req: Request, res: Response) => {
    const { userId, fsObjectId, permission } = req.body;
    res.json(await usersManager.shareFsObject(req.user.id, fsObjectId, userId, permission));
};

export const searchFsObject = async (req: Request, res: Response) => {
    res.json(await usersManager.searchFsObject(req.user.id, req.query.query as string));
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

export const uploadFile = async (req: Request, res: Response) => {
    res.json(await usersManager.uploadFile(req, req.query));
};

export const createFolder = async (req: Request, res: Response) => {
    res.json(await usersManager.createFolder(req.user.id, req.body));
};

export const createShortcut = async (req: Request, res: Response) => {
    res.json(await usersManager.createShortcut(req.user.id, req.body));
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

export const createFavorite = async (req: Request, res: Response) => {
    res.json(await usersManager.createFavorite(req.user.id, req.body.fsObjectIds));
};

export const getFsObjectHierarchy = async (req: Request, res: Response) => {
    res.json(await usersManager.getFsObjectHierarchy(req.user.id, req.body.fsObjectId));
};

export const updatePermission = async (req: Request, res: Response) => {
    const { userId, permission } = req.body;
    res.json(await usersManager.updateFsObjectPermission(req.user.id, req.params.fsObjectId, userId, permission));
};

export const removeFavorite = async (req: Request, res: Response) => {
    res.json(await usersManager.removeFavorite(req.user.id, req.params.fsObjectId));
};

export const deleteFavorites = async (req: Request, res: Response) => {
    res.json(await usersManager.deleteFavorites(req.user.id, req.body.fsObjectIds));
};

export const unshareFsObject = async (req: Request, res: Response) => {
    const { sharedUserId } = req.body;
    res.json(await usersManager.unshareFsObject(req.user.id, req.params.fsObjectId, sharedUserId));
};

export const deleteFile = async (req: Request, res: Response) => {
    res.json(await usersManager.moveFileToTrash(req.user.id, req.params.fsObjectId));
};

export const deleteFolder = async (req: Request, res: Response) => {
    res.json(await usersManager.moveFolderToTrash(req.user.id, req.params.fsObjectId));
};

export const deleteShortcut = async (req: Request, res: Response) => {
    res.json(await usersManager.moveShortcutToTrash(req.user.id, req.params.fsObjectId));
};

export const deletePermanent = async (req: Request, res: Response) => {
    res.json(await usersManager.deleteFilePermanent(req.user.id, req.params.fsObjectId));
};

export const downloadFile = async (req: Request, res: Response) => {
    const fileStream = await usersManager.downloadFile(req.user.id, req.params.fsObjectId);
    fileStream.pipe(res);
    await promisify(stream.finished)(fileStream);
};

export const downloadFolder = async (req: Request, res: Response) => {
    const rootFolder = await usersManager.getFsObject(req.user.id, req.params.fsObjectId);
    const archive = await usersManager.downloadFolder(req.user.id, req.params.fsObjectId);
    res.attachment(`${rootFolder.data.name}.zip`);
    res.setHeader('Content-type', 'application/zip');

    archive.pipe(res);
    await archive.finalize();
};

// body: name, parent. params: fsObjectId.
export const duplicateFile = async (req: Request, res: Response) => {
    res.json(await usersManager.duplicateFile(req.user.id, req.params.fsObjectId, req.body));
};

export const generateShareLink = async (req: Request, res: Response) => {
    res.json(await usersManager.generateShareLink(req.user.id, req.params.fsObjectId, req.body));
};

export const shareByLink = async (req: Request, res: Response) => {
    res.json(await usersManager.shareByLink(req.params.token, req.user.id));
};

import { Request, Response } from 'express';
import * as stream from 'stream';
import { promisify } from 'util';
import * as clientsManager from './manager';

export const uploadFile = async (req: Request<{}, any, {}, any>, res: Response) => {
    res.json(await clientsManager.uploadFile(req.client.clientName, req, req.query));
};

export const reUploadFile = async (req: Request<{ fileId: string }, any, {}, any>, res: Response) => {
    res.json(await clientsManager.reUploadFile(req.client.clientName, req, req.params.fileId, req.query.size));
};

export const shareFile = async (req: Request, res: Response) => {
    const { userId, permission } = req.body;
    res.json(await clientsManager.shareFile(req.client.clientName, req.params.fileId, userId, permission));
};

export const downloadFile = async (req: Request, res: Response) => {
    const fileStream = await clientsManager.downloadFile(req.client.clientName, req.params.fileId);
    fileStream.pipe(res);
    await promisify(stream.finished)(fileStream);
};

export const getFiles = async (req: Request, res: Response) => {
    res.json(await clientsManager.getFiles(req.client.clientName, req.query));
};

export const getFile = async (req: Request, res: Response) => {
    res.json(await clientsManager.getFile(req.client.clientName, req.params.fileId));
};

export const updateFileName = async (req: Request, res: Response) => {
    res.json(await clientsManager.updateFileName(req.client.clientName, req.params.fileId, req.body.name));
};

export const updateFilePublic = async (req: Request, res: Response) => {
    res.json(await clientsManager.updateFilePublic(req.client.clientName, req.params.fileId, req.body.public));
};

export const updateFilePermission = async (req: Request, res: Response) => {
    const { userId, permission } = req.body;
    res.json(await clientsManager.updateFilePermission(req.client.clientName, req.params.fileId, userId, permission));
};

export const deleteFile = async (req: Request, res: Response) => {
    res.json(await clientsManager.deleteFile(req.client.clientName, req.params.fileId));
};

export const unshareFile = async (req: Request, res: Response) => {
    res.json(await clientsManager.unshareFile(req.client.clientName, req.params.fileId, req.body.userId));
};

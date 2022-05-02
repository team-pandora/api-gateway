import { Request, Response } from 'express';
import * as fsManager from './manager';

export const getFsObject = async (req: Request, res: Response) => {
    res.json(await fsManager.getFsObject(req.query));
};

export const getFsObjectById = async (req: Request, res: Response) => {
    res.json(await fsManager.getFsObjectById(req.params.fsObjectId));
};

export const getFsObjectHierarchy = async (req: Request, res: Response) => {
    res.json(await fsManager.getFsObjectHierarchy(req.params.fsObjectId));
};

export const searchFsObject = async (req: Request, res: Response) => {
    res.json(await fsManager.searchFsObject(req.query));
};

// TODO
export const updateFsObject = async (req: Request, res: Response) => {
    res.json(await fsManager.updateFsObject(req.params.fsObjectId, req.body));
};

export const moveFsObject = async (req: Request, res: Response) => {
    res.json(await fsManager.moveFsObjects(req.body.fsObjectIds, req.body.destinationId));
};

export const deleteFsObject = async (req: Request, res: Response) => {
    res.json(await fsManager.deleteFsObject(req.params.fsObjectId));
};

export const shareFsObject = async (req: Request, res: Response) => {
    res.json(await fsManager.shareFsObject(req.params.fsObjectId, req.body.userId, req.body.permission));
};

export const copyFsObject = async (req: Request, res: Response) => {
    res.json(
        await fsManager.copyFsObject(req.params.fsObjectId, req.body.destination, req.body.folderId, req.body.name),
    );
};

export const getFsObjectShareLink = async (req: Request, res: Response) => {
    res.json(await fsManager.getFsObjectShareLink(req.params.fsObjectId, req.body.permission, req.body.time));
};

export const removePermissions = async (req: Request, res: Response) => {
    res.json(await fsManager.removePermissions(req.params.fsObjectId, req.body.userIds));
};

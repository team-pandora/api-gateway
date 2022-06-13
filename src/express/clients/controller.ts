import { Request, Response } from 'express';
import * as clientsManager from './manager';

export const getFiles = async (req: Request, res: Response) => {
    res.json(await clientsManager.getFiles(req.client.clientName, req.query));
};

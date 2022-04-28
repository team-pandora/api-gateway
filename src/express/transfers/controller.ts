import { Request, Response } from 'express';
import * as TransferManager from './manager';

export const getTransfers = async (req: Request, res: Response) => {
    res.json(await TransferManager.getTransfers(req.query));
};

export const createTransfer = async (req: Request, res: Response) => {
    res.json(await TransferManager.createTransfer(req.body));
};

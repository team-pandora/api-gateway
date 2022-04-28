import { Request, Response } from 'express';
import * as quotaManager from './manager';

export const getQuotaByUserId = async (req: Request, res: Response) => {
    res.json(await quotaManager.getQuotaByUserId(req.params.userId));
};

export const getSelfQuota = async (_req: Request, res: Response) => {
    res.json(await quotaManager.getSelfQuota());
};

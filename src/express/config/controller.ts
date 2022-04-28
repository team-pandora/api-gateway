import { Request, Response } from 'express';
import * as ConfigManager from './manager';

export const getConfig = async (_req: Request, res: Response) => {
    res.json(await ConfigManager.getConfig());
};

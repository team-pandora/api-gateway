import { Request, Response } from 'express';
import * as usersManager from './manager';

export const getUsers = async (req: Request, res: Response) => {
    res.json(await usersManager.getUsers(req.query));
};

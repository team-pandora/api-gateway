import { Request, Response } from 'express';
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

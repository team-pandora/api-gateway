import { NextFunction, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import config from '../config';
import {
    shragaAuthMiddleware as shraga,
    shragaCallbackMiddleware,
    shragaLoginMiddleware,
    spikeAuthMiddlewareFactory as spike,
} from './auth';
import clientsRouter from './clients/router';
import { ServerError } from './error';
import usersRouter from './users/router';

const appRouter = Router();

appRouter.get('/auth/login', shragaLoginMiddleware);
appRouter.post('/auth/callback', shragaCallbackMiddleware);

appRouter.get('/config', (_, res: Response, next: NextFunction) => {
    res.json({});
    next();
});

appRouter.use('/api/users', shraga, usersRouter);

appRouter.use('/api/clients', spike([config.service.spikeClientsApiScope]), clientsRouter);

appRouter.use('/isAlive', (_, res) => {
    res.status(StatusCodes.OK).send('alive');
});

appRouter.use('*', (_, res: Response, next: NextFunction) => {
    if (!res.headersSent) {
        next(new ServerError(StatusCodes.NOT_FOUND, 'Invalid route'));
    }
    next();
});

export default appRouter;

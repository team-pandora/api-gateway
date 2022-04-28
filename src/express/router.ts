import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ServerError } from './error';
import fsRouter from './fs/router';
import quotasRouter from './quotas/router';
// import shragaRouter from './shraga/router';
import transfersRouter from './transfers/router';
import configRouter from './config/router';

const appRouter = Router();

// appRouter.use('/auth', shragaRouter);

appRouter.use('/api/config', configRouter);
appRouter.use('api/router', transfersRouter);
appRouter.use('/api/fs', fsRouter);
appRouter.use('/api/quotas', quotasRouter);
appRouter.use('/api/transfers', transfersRouter);
// appRouter.use('/api/users', usersRouter);

appRouter.use('/isAlive', (_req, res) => {
    res.status(StatusCodes.OK).send('alive');
});

appRouter.use('*', (_req, res, next) => {
    if (!res.headersSent) {
        next(new ServerError(StatusCodes.NOT_FOUND, 'Invalid route'));
    }
    next();
});

export default appRouter;

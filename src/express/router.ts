import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
    // shragaAuthMiddleware as shraga,
    shragaCallbackMiddleware,
    shragaLoginMiddleware,
} from './auth';
import { ServerError } from './error';
import usersRouter from './users/router';

const appRouter = Router();

appRouter.get('/auth/login', shragaLoginMiddleware);
appRouter.post('/auth/callback', shragaCallbackMiddleware);

appRouter.use('/api/users', usersRouter);

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

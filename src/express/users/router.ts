import { Router } from 'express';
import wrapMiddleware from '../../utils/express';
import ValidateRequest from '../../utils/joi';
import * as usersController from './controller';
import * as ValidatorSchemas from './validator.schema';

const usersRouter = Router();

usersRouter.get('/', ValidateRequest(ValidatorSchemas.getUsersRequestSchema), wrapMiddleware(usersController.getUsers));

usersRouter.get(
    '/:userId',
    ValidateRequest(ValidatorSchemas.getUserRequestSchema),
    wrapMiddleware(usersController.getUsers),
);

usersRouter.get(
    '/quota',
    ValidateRequest(ValidatorSchemas.getUserRequestSchema),
    wrapMiddleware(usersController.getQuota),
);

export default usersRouter;

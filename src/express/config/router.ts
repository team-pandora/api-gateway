import { Router } from 'express';
import wrapMiddleware from '../../utils/express';
import ValidateRequest from '../../utils/joi';
import * as ConfigController from './controller';
import * as ValidatorSchemas from './validator.schema';

export const configRouter = Router();

configRouter.get(
    '/',
    ValidateRequest(ValidatorSchemas.getConfigRequestSchema),
    wrapMiddleware(ConfigController.getConfig),
);

export default configRouter;

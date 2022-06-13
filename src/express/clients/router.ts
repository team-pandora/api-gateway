import { Router } from 'express';
import wrapMiddleware from '../../utils/express';
import ValidateRequest from '../../utils/joi';
import * as ClientsController from './controller';
import * as ValidatorSchemas from './validator.schema';

const clientsRouter = Router();

clientsRouter.get(
    '/files',
    ValidateRequest(ValidatorSchemas.getFilesRequestSchema),
    wrapMiddleware(ClientsController.getFiles),
);

export default clientsRouter;

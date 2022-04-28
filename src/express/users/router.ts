import { Router } from 'express';
import { wrapController } from '../../utils/express';
import ValidateRequest from '../../utils/joi';
import * as usersController from './controller';
import * as ValidatorSchemas from './validator.schema';

const usersRouter = Router();

usersRouter.get('/', ValidateRequest(ValidatorSchemas.getUsersRequestSchema), wrapController(usersController.getUsers));

export default usersRouter;

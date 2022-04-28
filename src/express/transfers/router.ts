import { Router } from 'express';
import ValidateRequest from '../../utils/joi';
import * as ValidatorSchemas from './validator.schema';
import * as transferController from './controller';
import { wrapController } from '../../utils/express';

const transfersRouter: Router = Router();

transfersRouter.get(
    '/',
    ValidateRequest(ValidatorSchemas.getTransfersRequestSchema),
    wrapController(transferController.getTransfers),
);

transfersRouter.post(
    '/',
    ValidateRequest(ValidatorSchemas.createTransferRequestSchema),
    wrapController(transferController.createTransfer),
);

export default transfersRouter;

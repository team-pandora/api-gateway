import { Router } from 'express';
import ValidateRequest from '../../utils/joi';
import * as ValidatorSchemas from './validator.schema';
import * as quotaController from './controller';
import { wrapController } from '../../utils/express';

const quotasRouter: Router = Router();

quotasRouter.get(
    '/:userId',
    ValidateRequest(ValidatorSchemas.getQuotaByUserIdRequestSchema),
    wrapController(quotaController.getQuotaByUserId),
);

quotasRouter.get(
    '/self',
    ValidateRequest(ValidatorSchemas.getSelfQuotaRequestSchema),
    wrapController(quotaController.getSelfQuota),
);

export default quotasRouter;

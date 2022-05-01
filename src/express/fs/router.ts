import { Router } from 'express';
import ValidateRequest from '../../utils/joi';
import * as ValidatorSchemas from './validator.schema';
import * as fsController from './controller';
import { wrapController } from '../../utils/express';

const fsRouter: Router = Router();

fsRouter.get('/', ValidateRequest(ValidatorSchemas.getFsObjectRequestSchema), wrapController(fsController.getFsObject));

fsRouter.get(
    '/:fsObjectId',
    ValidateRequest(ValidatorSchemas.getFsObjectByIdRequestSchema),
    wrapController(fsController.getFsObjectById),
);

fsRouter.get(
    '/:fsObjectId/hierarchy',
    ValidateRequest(ValidatorSchemas.getFsObjectHierarchyRequestSchema),
    wrapController(fsController.getFsObjectHierarchy),
);

fsRouter.get(
    '/search',
    ValidateRequest(ValidatorSchemas.getFsObjectRequestSchema),
    wrapController(fsController.searchFsObject),
);

fsRouter.patch(
    '/:fsObjectId',
    ValidateRequest(ValidatorSchemas.updateFsObjectRequestSchema),
    wrapController(fsController.updateFsObject),
);

fsRouter.patch(
    '/move',
    ValidateRequest(ValidatorSchemas.moveFsObjectsRequestSchema),
    wrapController(fsController.moveFsObject),
);

fsRouter.delete(
    '/:fsObjectId',
    ValidateRequest(ValidatorSchemas.deleteFsObjectRequestSchema),
    wrapController(fsController.deleteFsObject),
);

fsRouter.post(
    '/:fsObjectId/share',
    ValidateRequest(ValidatorSchemas.shareFsObjectRequestSchema),
    wrapController(fsController.shareFsObject),
);

fsRouter.post(
    '/:fsObjectId/copy',
    ValidateRequest(ValidatorSchemas.copyFsObjectRequestSchema),
    wrapController(fsController.copyFsObject),
);

fsRouter.get(
    '/:fsObjectId/share/link',
    ValidateRequest(ValidatorSchemas.getFsObjectShareLinkRequestSchema),
    wrapController(fsController.getFsObjectShareLink),
);

fsRouter.delete(
    '/:fsObjectId/permissions',
    ValidateRequest(ValidatorSchemas.removePermissionsRequestSchema),
    wrapController(fsController.removePermissions),
);

export default fsRouter;

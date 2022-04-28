import { Router } from 'express';
import ValidateRequest from '../../utils/joi';
import * as ValidatorSchemas from './validator.schema';
import * as fsController from './controller';
import { wrapController } from '../../utils/express';

const fs: Router = Router();

fs.get('/', ValidateRequest(ValidatorSchemas.getFsObjectRequestSchema), wrapController(fsController.getFsObject));

fs.get(
    '/:fsObjectId',
    ValidateRequest(ValidatorSchemas.getFsObjectByIdRequestSchema),
    wrapController(fsController.getFsObjectById),
);

fs.get(
    '/:fsObjectId/hierarchy',
    ValidateRequest(ValidatorSchemas.getFsObjectHierarchyRequestSchema),
    wrapController(fsController.getFsObjectHierarchy),
);

fs.get(
    '/search',
    ValidateRequest(ValidatorSchemas.getFsObjectRequestSchema),
    wrapController(fsController.searchFsObject),
);

fs.patch(
    '/:fsObjectId',
    ValidateRequest(ValidatorSchemas.updateFsObjectRequestSchema),
    wrapController(fsController.updateFsObject),
);

fs.patch(
    '/move',
    ValidateRequest(ValidatorSchemas.moveFsObjectsRequestSchema),
    wrapController(fsController.moveFsObject),
);

fs.delete(
    '/:fsObjectId',
    ValidateRequest(ValidatorSchemas.deleteFsObjectRequestSchema),
    wrapController(fsController.deleteFsObject),
);

fs.post(
    '/:fsObjectId/share',
    ValidateRequest(ValidatorSchemas.shareFsObjectRequestSchema),
    wrapController(fsController.shareFsObject),
);

export default fs;

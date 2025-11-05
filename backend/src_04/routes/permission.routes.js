import express from 'express';

const permissionRoutes = express.Router();


import PermissionsControllers from '../controllers/permissions.controller.js';
import { protect } from '../middleware/auth.Middleware.js';

import { checkPermission } from '../middleware/permissionMiddleware.js';
const PermissionsController = new PermissionsControllers();

permissionRoutes.post('/create-permission', PermissionsController.CreatePermission);

permissionRoutes.get('/permission', PermissionsController.getPermissions)

permissionRoutes.put('/permission-update', PermissionsController.UpdatePermission);

permissionRoutes.delete('/permission-delete/:id', PermissionsController.DeletePermission)


permissionRoutes.put('/permission-toggle/:id', PermissionsController.TogglePermission);

export default permissionRoutes 
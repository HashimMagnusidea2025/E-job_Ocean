
import express from 'express';

const roleRoutes = express.Router();

import RoleControllers from '../controllers/role.controller.js';

const roleController = new RoleControllers()

roleRoutes.post('/role-create', roleController.createRole.bind(roleController));

roleRoutes.get('/', roleController.getRoles.bind(roleController));

roleRoutes.put("/:id", roleController.updateRole.bind(roleController));
roleRoutes.delete('/:id', roleController.deleteRole.bind(roleController))


export default roleRoutes
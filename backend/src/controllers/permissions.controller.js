
import permissionModel from '../models/Permission.model.js'

export default class PermissionsController {



    async CreatePermission(req, res) {

        try {
            const { name } = req.body;

            const existing = await permissionModel.findOne({ name });
            if (existing) return res.status(409).json({ message: "Permission already exists" });

            const permission = await permissionModel.create({ name });
            res.status(201).json(permission);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getPermissions(req, res) {

        try {
            const permissions = await permissionModel.find();
            res.json(permissions);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async UpdatePermission(req,res) {

        try {
            const { id, name } = req.body;

            const updated = await permissionModel.findByIdAndUpdate(id, { name }, { new: true });

            if (!updated) return res.status(404).json({ message: "Permission not found" });

            res.status(200).json(updated);
        } catch (err) {
            res.status(500).json({ message: "Server Error" });
        }
    }


    async  DeletePermission(req, res){
    try {
      const { id } = req.params;

      const deleted = await permissionModel.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ message: "Permission not found" });
      }

      res.status(200).json({ message: "Permission deleted successfully" });
    } catch (error) {
      console.error("Error deleting permission:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

}
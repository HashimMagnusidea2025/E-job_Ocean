
import roleModel from "../models/role.model.js";

export default class RoleControllers {


    async createRole(req, res) {

        try {
            const { name, permissions } = req.body;
            const role = await roleModel.create({ name, permissions });
            res.status(201).json(role);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getRoles(req, res) {

        try {
            const roles = await roleModel.find().populate("permissions");
            res.json(roles);
            console.log(roles);

            

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }


  async  updateRole(req, res){
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;

    const updatedRole = await roleModel.findByIdAndUpdate(
      id,
      { name, permissions },
      { new: true }
    ).populate("permissions");

    res.json(updatedRole);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




async deleteRole(req, res) {
  try {
    const { id } = req.params;
    const deletedRole = await roleModel.findByIdAndDelete(id);

    if (!deletedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json({ message: "Role deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


}
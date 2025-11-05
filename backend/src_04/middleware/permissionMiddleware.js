 export const checkPermission = (permissionName) => {
  return (req, res, next) => {
    const permissions = req.user.roleID?.permissions?.map(p => p.name) || [];
    if (!permissions.includes(permissionName)) {
      return res.status(403).json({ message: "Forbidden: No permission" });
    }
    next();
  };
};
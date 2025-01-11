import RolePermission from "../model/role.model.js";
import Admin from "../model/admin.model.js";

export const checkRole = (currentRole) => async (req, res, next) => {
  const id = req.user._id;
  const admin = await Admin.findOne({ _id: id })
    .populate({
      path: "roles",
      populate: {
        path: "permissions",
        model: "Permission",
      },
    })
    .exec();

  if (admin.is_superuser) {
    return next();
  }

  const { Role } = RolePermission;

  let assignedPermissions = [];

  const roles = await Role.find({ _id: { $in: admin.roles } }).populate(
    "permissions"
  );

  roles.forEach((role) => {
    assignedPermissions.push(...role.permissions);
  });

  const hasRole = assignedPermissions.find(
    (assignedPermission) => assignedPermission.code_name === currentRole
  );

  if (!hasRole) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  return next();
};

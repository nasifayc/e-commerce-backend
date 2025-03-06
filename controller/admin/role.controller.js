import RP from "../../model/role.model.js";
import Admin from "../../model/admin.model.js";
const { Permission, Role } = RP;

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate("permissions");
    // console.log(roles);
    res.status(200).json({
      success: true,
      message: "Roles fetched successfully",
      roles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch roles",
      error: error.message,
    });
  }
};

export const createRole = async (req, res) => {
  try {
    const { role_name, permissions, description } = req.body;

    const roleExists = await Role.findOne({ role_name });
    if (roleExists) {
      return res.status(400).json({
        success: false,
        message: "Role already exists",
      });
    }

    const role = new Role({
      role_name,
      permissions,
      description,
      created_by: req.user.id,
    });

    await role.save();

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create role",
      error: error.message,
    });
  }
};

export const getRoleByID = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id)
      .populate("permissions", "code_name description")
      .exec();

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Role fetched successfully",
      role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch role",
      error: error.message,
    });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { role_name, permissions, description } = req.body;
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    role.role_name = role_name || role.role_name;
    role.permissions = permissions || role.permissions;
    role.description = description || role.description;
    role.updated_by = req.user.id;

    await role.save();

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update role",
      error: error.message,
    });
  }
};

export const deleteRole = async (req, res) => {
  try {
    console.log(req.body);
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    await role.deleteOne();
    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete role",
      error: error.message,
    });
  }
};

export const fetchPermissions = async (req, res) => {
  try {
    let permissions;
    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (admin.is_superuser) {
      console.log("Super User");
      permissions = await Permission.find();
    } else {
      console.log("Admin User");
      const admin = await Admin.findById(req.user.id).populate({
        path: "roles",
        populate: {
          path: "permissions",
        },
      });

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      permissions = admin.roles.flatMap((role) => role.permissions);
    }

    res.status(200).json({
      permissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch permissions",
      error: error.message,
    });
  }
};

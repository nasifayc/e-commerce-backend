import cloudinary from "../../config/cloudinary.js";
import Admin from "../../model/admin.model.js";
import RP from "../../model/role.model.js";
const { Permission } = RP;

// Get All Admins
export const getAllAdmins = async (req, res) => {
  try {
    console.log("Getting Admins...");
    const admins = await Admin.find().populate("roles", "role_name");

    res.status(200).json({
      success: true,
      message: "Admins fetched successfully",
      admins,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admins",
      error: error.message,
    });
  }
};

// Create new Admin
export const createAdmin = async (req, res) => {
  try {
    const { first_name, last_name, email, password, roles } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    const newAdmin = new Admin({
      first_name,
      last_name,
      email,
      password,
      roles,
      profile_photo: req.file?.path,
      created_by: req.user.id,
    });

    const savedAdmin = await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: savedAdmin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create admin",
      error: error.message,
    });
  }
};

export const getAdminByID = async (req, res) => {
  try {
    console.log("Things Are coming here........");
    const admin = await Admin.findById(req.user.id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin profile fetched successfully",
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin profile",
      error: error.message,
    });
  }
};
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, password, roles, is_active } =
      req.body;
    const updates = {
      first_name,
      last_name,
      email,
      roles,
      is_active,
      updated_by: req.user.id,
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    if (req.file) {
      const admin = await Admin.findById(id);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      // Delete old profile photo if it exists
      if (admin.profile_photo) {
        const publicId = admin.profile_photo.split("/").pop().split(".")[0];

        try {
          await cloudinary.uploader.destroy(`profiles/${publicId}`);
          console.log(
            "Old profile photo deleted successfully from Cloudinary."
          );
        } catch (error) {
          console.error(
            "Failed to delete old profile photo from Cloudinary:",
            error
          );
        }
      }

      updates.profile_photo = req.file?.path;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update admin",
      error: error.message,
    });
  }
};

export const getCurrentAdmin = async (req, res) => {
  try {
    const { id } = req.user;
    const admin = await Admin.findById(id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      admin,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin profile",
      error: error.message,
    });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (userId === id) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete yourself",
      });
    }

    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (admin.profile_photo) {
      const publicId = admin.profile_photo.split("/").pop().split(".")[0];

      cloudinary.uploader.destroy(`profiles/${publicId}`, (error, result) => {
        if (error) {
          console.error(
            "Failed to delete profile photo from Cloudinary:",
            error
          );
        } else {
          console.log(
            "Profile photo deleted successfully from Cloudinary:",
            result
          );
        }
      });
    }

    await admin.deleteOne();

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete admin",
      error: error.message,
    });
  }
};

export const getPermissions = async (req, res) => {
  console.log("Feching permissions...");
  try {
    const { id } = req.user;
    const admin = await Admin.findById(id)
      .populate({
        path: "roles",
        populate: { path: "permissions" },
      })
      .lean();

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (admin.is_superuser) {
      const per = await Permission.find();
      const codeName = per.map((p) => p.code_name);

      return res.status(200).json({
        permissions: codeName,
      });
    }

    // console.log(admin);

    const allPermissions = admin.roles.flatMap((role) => role.permissions);
    const uniquePermissions = Array.from(
      new Map(
        allPermissions.map((permission) => [
          permission._id.toString(),
          permission,
        ])
      ).values()
    ).map((permission) => permission.code_name);

    // console.log("Permissions:", uniquePermissions);

    res.status(200).json({
      permissions: uniquePermissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch permissions",
      error: error.message,
    });
  }
};

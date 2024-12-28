import mongoose from "mongoose";
const PermissionSchema = mongoose.Schema(
  {
    model: { type: String },
    code_name: { type: String, unique: true },
    description: { type: String, unique: true },
    user_type: [String],
  },
  { timestamps: true }
);

const RoleSchema = mongoose.Schema(
  {
    role_name: {
      type: String,
      unique: true,
      required: true,
    },

    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
    description: {
      type: String,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creater user is required"],
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Permission = mongoose.model("Permission", PermissionSchema);
const Role = mongoose.model("Role", RoleSchema);

export default { Permission, Role };

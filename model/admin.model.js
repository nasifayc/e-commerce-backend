import mongoose from "mongoose";
import bcrypt from "bcrypt";

const AdminSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      trim: true,
      required: [true, "First Name is required"],
    },
    last_name: {
      type: String,
      trim: true,
      required: [true, "Last Name is required"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    is_active: {
      type: Boolean,
      default: true,
    },

    is_superuser: {
      type: Boolean,
      default: false,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    profile_photo: {
      type: String,
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
    },
  },
  { timestamps: true }
);

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

AdminSchema.methods.comparePassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

// Middleware to clear sensitive data when converting to JSON
AdminSchema.methods.toJSON = function () {
  const adminObject = this.toObject();
  delete adminObject.password;

  return adminObject;
};

const Admin = mongoose.model("Admin", AdminSchema);

export default Admin;

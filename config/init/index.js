import Admin from "../../model/admin.model.js";
import db from "../database.js";

export const createSuperAdmin = async (admin) => {
  try {
    await db();
    const { first_name, last_name, email, password } = admin;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log("A Super admin with this email already exists. ");
      process.exit(1);
    }

    const superAdmin = new Admin({
      first_name,
      last_name,
      email,
      password,
      is_superuser: true,
      is_active: true,
    });

    await superAdmin.save();
    console.log("Super admin created successfully.", superAdmin);
    process.exit(0);
  } catch (e) {
    console.log("Error creating Super admin: ", e);
    process.exit(1);
  } finally {
    db.connection.close();
  }
};

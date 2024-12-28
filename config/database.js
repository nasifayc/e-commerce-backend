import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const db = async () => {
  try {
    const database = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB successfully");
    return database;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default db;

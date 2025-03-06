import multer from "multer";
import path from "path";
import fs from "fs";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const type = req.query.type || "misc";
    let folder = "misc";

    switch (type) {
      case "profile":
        folder = "profiles";
        break;
      case "category":
        folder = "categories";
        break;
    }

    return {
      folder,
      allowed_formats: ["jpg", "jpeg", "png"],
      public_id: `${file.fieldname}-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}`, // Unique filename
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    };
  },
});
// File filter for validating image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and JPG images are allowed"), false);
  }
};

export const uploadFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

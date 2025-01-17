import multer from "multer";
import path from "path";

// Multer storage configuration for profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profiles/"); // Folder for saving profile images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, `profile-${uniqueSuffix}${ext}`); // Example: profile-1679945698123.jpg
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

// Multer instance for profile uploads
export const uploadProfileImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB file size limit for profile images
});

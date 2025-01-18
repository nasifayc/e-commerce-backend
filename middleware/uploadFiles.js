import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.query.type; // Expect a 'type' query parameter in the request
    let folder = "uploads/misc/"; // Default folder for unclassified uploads

    switch (type) {
      case "profile":
        folder = "uploads/profiles/";
        break;
      case "category":
        folder = "uploads/categories/";
        break;
      // Add other cases as needed
      default:
        break;
    }

    // Ensure folder exists
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname); // Get the file extension
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`); // Example: profile-1679945698123.jpg
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

// Dynamic multer middleware
export const uploadFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
});

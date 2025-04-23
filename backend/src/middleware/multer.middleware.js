import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg", "video/mp4", "video/mov"]; 

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = `others`;
    if (file.fieldname === "profilePicture") {
      folder = `profile`;
    } else if (file.fieldname === "coverImage") {
      folder = `cover`;
    } else if (file.fieldname === "contentUrl") {
      folder = `social_posts`;
    }
    return {
      folder,
      allowed_formats: ["jpg", "png", "jpeg", "mp4", "mov"],
      resource_type: "auto",
    };
  },
});

// Multer upload configuration
const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only JPG, PNG, JPEG, MP4, MOV are allowed."), false);
    }
    cb(null, true);
  }
});

// Export middleware to handle specific fields for user media uploads
export const uploadUserMedia = upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);

// If you want to use the generic upload export as well (optional)
export default upload;
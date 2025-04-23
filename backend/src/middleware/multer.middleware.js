import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

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

export const upload = multer({ storage });


// Export middleware to handle specific fields
export const uploadUserMedia = upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);

// If you want generic export too (optional)
export default upload;
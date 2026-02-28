import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/models")); // Save to public/models
  },
  filename: (req, file, cb) => {
    // Save with timestamp to avoid conflicts
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// File filter - only allow .glb files
const fileFilter = (req, file, cb) => {
  if (file.originalname.toLowerCase().endsWith(".glb")) {
    cb(null, true);
  } else {
    cb(new Error("Only .glb files are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

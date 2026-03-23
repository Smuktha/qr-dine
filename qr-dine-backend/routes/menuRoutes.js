import express from "express";
import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {
  addMenuItem,
  getMenuItems,
  deleteMenuItem,
  updateMenuItem,
} from "../controllers/menuController.js";

const router = express.Router();

// Configure multer for local image uploads
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Configure Cloudinary storage if environment variables are provided
let uploadStorage = localStorage;
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  uploadStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "qr-dine",
      allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
      public_id: (req, file) => `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    },
  });
}


const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Routes
router.get("/", getMenuItems);
router.post("/", upload.single("image"), addMenuItem);
router.put("/:id", upload.single("image"), updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router;
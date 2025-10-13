import { Router } from "express";
import multer from "multer";
import path from "path";
import {
  ensureUploadsDir,
  handleUpload,
} from "../controllers/uploads.controller";

const router = Router();

const uploadsDir = path.resolve(process.cwd(), "uploads");
ensureUploadsDir(uploadsDir);

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (_req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname || "");
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({ storage });

router.post("/", upload.array("files", 5), handleUpload);

export default router;


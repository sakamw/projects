import { Request, Response } from "express";
import fs from "fs";
import path from "path";

export function ensureUploadsDir(uploadsDir: string) {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

export async function handleUpload(req: Request, res: Response) {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    const file = (req.file as Express.Multer.File) || null;
    const all = file ? [file] : files;
    if (!all.length) {
      res.status(400).json({ message: "No files uploaded" });
      return;
    }
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const urls = all.map(
      (f) => `${baseUrl}/uploads/${path.basename(f.filename)}`
    );
    res.status(201).json({ urls });
  } catch (e) {
    res.status(500).json({ message: "Upload failed" });
  }
}


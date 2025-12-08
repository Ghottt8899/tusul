import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth';
import { mkdirSync } from 'fs';
import { join } from 'path';
const UPLOAD_DIR = join(process.cwd(), 'storage');
mkdirSync(UPLOAD_DIR, { recursive: true });

const upload = multer({ dest: UPLOAD_DIR });
export const uploads = Router();

uploads.post('/photo', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file' });
  // NOTE: Хэрэв at-rest encryption хэрэгтэй бол энд шифрлээд хадгал.
  res.json({ id: req.file.filename, path: req.file.path, size: req.file.size });
});

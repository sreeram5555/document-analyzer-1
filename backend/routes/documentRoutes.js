
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import userAuth from '../middleware/authMiddleware.js';
import { uploadDocument, getDocumentChatHistory, getUserDocuments } from '../controllers/documentController.js';

const router = express.Router();

// --- MULTER DISK STORAGE CONFIGURATION ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // We will save files to the 'public/uploads' directory
    const uploadPath = 'public/uploads';
    fs.mkdirSync(uploadPath, { recursive: true }); // Create directory if it doesn't exist
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Create a unique filename to prevent overwrites
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// This route now uses disk storage.
router.post('/upload-document', userAuth, upload.single('file'), uploadDocument);

// This route fetches all documents for the logged-in user
router.get('/', userAuth, getUserDocuments);

router.get('/:documentId/chat', userAuth, getDocumentChatHistory);

export default router;
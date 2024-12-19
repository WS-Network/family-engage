import { createRouter } from 'next-connect';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

// Extend NextApiRequest to include Multer's file type
interface ExtendedNextApiRequest extends NextApiRequest {
  file?: Express.Multer.File;
}

// Define upload directory
const uploadDirectory = path.join(process.cwd(), 'public/uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const router = createRouter<ExtendedNextApiRequest, NextApiResponse>();

// Use middleware to handle file upload
router.use((req, res, next) => {
  upload.single('file')(req as any, res as any, next as any);
});

// Define POST handler
router.post((req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const filePath = `/uploads/${file.filename}`;
    return res.status(200).json({ avatarUrl: filePath });
  } catch (error: unknown) {
    console.error('Error during file upload:', (error as Error).message);
    return res.status(500).json({
      message: 'File upload failed',
      error: (error as Error).message,
    });
  }
});

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default router.handler({
  onError: (err, req, res) => {
    console.error((err as Error).stack);
    res.status(500).end('Something broke!');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});

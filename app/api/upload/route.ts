import { NextResponse } from "next/server";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDirectory = path.join(process.cwd(), "public/uploads");

// Ensure the upload directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configure multer for storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Setting destination for upload...");
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    console.log("Setting filename:", uniqueName);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

async function parseFormData(req: Request): Promise<Express.Multer.File> {
  return new Promise((resolve, reject) => {
    const multerHandler = upload.single("file");
    multerHandler(req as any, {} as any, (err: any) => {
      if (err) {
        console.error("Multer error:", err);
        return reject(err);
      }
      resolve((req as any).file);
    });
  });
}

export async function POST(req: Request) {
  try {
    console.log("Request received for file upload...");

    const file = await parseFormData(req);
    console.log("File successfully uploaded:", file);

    const filePath = `/uploads/${file.filename}`;
    console.log("Generated file path:", filePath);

    return NextResponse.json({ avatarUrl: filePath });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during file upload:", error.message);
      return NextResponse.json(
        { message: "File upload failed", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unexpected error during file upload:", error);
      return NextResponse.json(
        { message: "Unexpected error occurred" },
        { status: 500 }
      );
    }
  }
}

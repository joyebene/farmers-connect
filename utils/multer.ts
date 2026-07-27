import multer from "multer";

// Store files in memory as Buffer
const storage = multer.memoryStorage();

// Allowed file types
const allowedMimeTypes = [
  // Images
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",

  // Videos
  "video/mp4",
  "video/mpeg",

  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  // 3D files
  "model/gltf-binary",
  "model/gltf+json",
];

// File filter
const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file type: ${file.mimetype}`
      )
    );
  }
};

// Multer upload instance
export const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
    files: 10,
  },
});
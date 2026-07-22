

import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  const allowedTypes = [
     "image/jpeg",
     "image/jpg",
     "image/png",
     "image/webp",
     "video/mp4",
     "video/webm",
     "video/quicktime",
];

  if (!allowedTypes.includes(file.mimetype)) {
    return callback(
      new Error("Only JPG, JPEG, PNG and WEBP images are allowed"),
      false
    );
  }

  callback(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});
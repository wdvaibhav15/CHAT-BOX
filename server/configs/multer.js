// import multer from 'multer'

// const storage = multer.diskStorage({})

// export const upload = multer({ storage })

import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDirectory = path.resolve("uploads");

// Create uploads folder if it does not exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (req, file, callback) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "-");

    callback(
      null,
      `${file.fieldname}-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}-${safeName}`
    );
  },
});

const fileFilter = (req, file, callback) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
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
    fileSize: 5 * 1024 * 1024,
  },
});
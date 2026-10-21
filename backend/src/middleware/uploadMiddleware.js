import multer from "multer";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp"
];

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
    fields: 3,
    parts: 4
  },

  fileFilter(req, file, callback) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      const error = new Error(
        "Formato immagine non supportato. Usa JPEG, PNG o WebP."
      );

      error.statusCode = 415;
      error.code = "UNSUPPORTED_MEDIA_TYPE";

      return callback(error);
    }

    callback(null, true);
  }
});

export default upload;

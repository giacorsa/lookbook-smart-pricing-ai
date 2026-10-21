import multer from "multer";

export function errorHandler(err, req, res, next) {
  // File troppo grande
  if (
    err instanceof multer.MulterError &&
    err.code === "LIMIT_FILE_SIZE"
  ) {
    return res.status(413).json({
      error: {
        code: "FILE_TOO_LARGE",
        message: "La fotografia supera il limite di 5 MB.",
        details: []
      }
    });
  }

  // Altri errori Multer
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: {
        code: "UPLOAD_ERROR",
        message: "Errore durante il caricamento del file.",
        details: []
      }
    });
  }

  // Errori applicativi noti
  if (
    Number.isInteger(err.statusCode) &&
    err.statusCode >= 400 &&
    err.statusCode <= 599 &&
    typeof err.code === "string"
  ) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: []
      }
    });
  }

  // Errore inatteso: log interno
  console.error("Errore interno backend:", err);

  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Errore interno del server.",
      details: []
    }
  });
}

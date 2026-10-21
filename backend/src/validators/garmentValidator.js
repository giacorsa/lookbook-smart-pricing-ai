
const allowedCategories = [
  "maglietta",
  "camicia",
  "pantaloni",
  "jeans",
  "giacca",
  "cappotto",
  "vestito",
  "scarpe",
  "accessori"
];

const allowedConditions = [
  "nuovo",
  "buono",
  "usato"
];

function detectImageMimeType(buffer) {
  if (!Buffer.isBuffer(buffer)) {
    return null;
  }

  // JPEG: FF D8 FF
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "image/jpeg";
  }

  // PNG: firma di 8 byte
  const pngSignature = Buffer.from([
    0x89, 0x50, 0x4e, 0x47,
    0x0d, 0x0a, 0x1a, 0x0a
  ]);

  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(pngSignature)
  ) {
    return "image/png";
  }

  // WebP: RIFF....WEBP
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

export function validateGarment(req, res, next) {
  const errors = [];

  const { category, brand, condition } = req.body;

  // Immagine obbligatoria
  if (!req.file) {
    errors.push({
      field: "image",
      message: "La fotografia è obbligatoria."
    });
  } else {
    const detectedMimeType = detectImageMimeType(
      req.file.buffer
    );

    if (
      !detectedMimeType ||
      detectedMimeType !== req.file.mimetype
    ) {
      errors.push({
        field: "image",
        message: "Il contenuto del file non corrisponde a un'immagine supportata."
      });
    }
  }

  // Categoria
  if (
    typeof category !== "string" ||
    !allowedCategories.includes(category)
  ) {
    errors.push({
      field: "category",
      message: "Categoria non valida."
    });
  }

  // Brand
  if (
    typeof brand !== "string" ||
    brand.trim().length === 0 ||
    brand.trim().length > 100
  ) {
    errors.push({
      field: "brand",
      message: "Il brand deve contenere da 1 a 100 caratteri."
    });
  }

  // Condizione
  if (
    typeof condition !== "string" ||
    !allowedConditions.includes(condition)
  ) {
    errors.push({
      field: "condition",
      message: "Condizione non valida."
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "I dati inviati non sono validi.",
        details: errors
      }
    });
  }

  // Normalizzazione dei dati validati
  req.garmentData = {
    image: req.file,
    category,
    brand: brand.trim(),
    condition
  };

  next();
}

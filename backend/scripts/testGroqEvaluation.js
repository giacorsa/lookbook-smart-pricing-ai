import "dotenv/config";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

import { evaluateWithGroq } from "../src/services/groqClient.js";

const imagePath = process.argv[2];

if (!imagePath) {
  console.error(
    "Uso: node scripts/testGroqEvaluation.js <percorso-immagine>"
  );
  process.exit(1);
}

const mimeTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

try {
  const extension = path.extname(imagePath).toLowerCase();
  const mimetype = mimeTypes[extension];

  if (!mimetype) {
    throw new Error("Formato non supportato. Usa JPG, PNG o WebP.");
  }

  const fileInfo = await stat(imagePath);

  if (fileInfo.size > 5 * 1024 * 1024) {
    throw new Error("Immagine superiore al limite di 5 MiB.");
  }

  const buffer = await readFile(imagePath);

  const garmentData = {
    image: {
      originalname: path.basename(imagePath),
      mimetype,
      buffer
    },
    category: "giacca",
    brand: "Levi's",
    condition: "buono"
  };

  console.log("Avvio valutazione Groq...");
  console.log("Modello:", process.env.GROQ_MODEL);
  console.log("Fotografia:", path.basename(imagePath));

  const result = await evaluateWithGroq(garmentData);

  console.log("\nVALUTAZIONE AI");
  console.log(JSON.stringify(result.evaluation, null, 2));

  console.log("\nMETADATI");
  console.log("Modello:", result.model);
  console.log("Token utilizzati:", result.usage?.total_tokens ?? "N/D");

} catch (error) {
  console.error("\nTEST FALLITO");
  console.error("Tipo:", error.constructor.name);
  console.error("HTTP status:", error.status ?? "N/D");
  console.error("Messaggio:", error.message);
  process.exitCode = 1;
}

import { evaluationSystemPrompt } from "../prompts/evaluationSystemPrompt.js";
import { buildEvaluationUserPrompt } from "../prompts/evaluationUserPrompt.js";

export function buildGroqMessages(garmentData) {
  const { image } = garmentData;

  if (
    !image ||
    !Buffer.isBuffer(image.buffer) ||
    image.buffer.length === 0
  ) {
    throw new Error("Immagine non disponibile.");
  }

  const base64Image = image.buffer.toString("base64");

  const imageDataUrl = `data:${image.mimetype};base64,${base64Image}`;

  return [
    {
      role: "system",
      content: evaluationSystemPrompt
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: buildEvaluationUserPrompt(garmentData)
        },
        {
          type: "image_url",
          image_url: {
            url: imageDataUrl
          }
        }
      ]
    }
  ];
}

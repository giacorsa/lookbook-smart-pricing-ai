
import Groq from "groq-sdk";

import { buildGroqMessages} from "./groqMessageBuilder.js";

import { validateEvaluation} from "../validators/evaluationValidator.js";

import {  AppError,  mapGroqError} from "./groqErrorMapper.js";

export async function evaluateWithGroq(garmentData) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new AppError(
      503,
      "AI_SERVICE_UNAVAILABLE",
      "Il servizio AI non è configurato."
    );
  }

  const groq = new Groq({
    apiKey,
    maxRetries: 0,
    timeout: Number(process.env.GROQ_TIMEOUT_MS || 30000)
  });

  const model =
    process.env.GROQ_MODEL || "qwen/qwen3.8-27b";

  const messages = buildGroqMessages(garmentData);

  let completion;

  try {
    completion = await groq.chat.completions.create({
      model,
      messages,
      temperature: 0.2,
      max_completion_tokens: 1500,
      response_format: {
        type: "json_object"
      }
    });
  } catch (error) {
    throw mapGroqError(error);
  }

  const content =
    completion.choices?.[0]?.message?.content;

  if (typeof content !== "string" || !content.trim()) {
    throw new AppError(
      502,
      "AI_PROVIDER_ERROR",
      "Il servizio AI ha restituito una risposta vuota."
    );
  }

  let evaluation;

  try {
    evaluation = JSON.parse(content);
  } catch {
    throw new AppError(
      502,
      "AI_PROVIDER_ERROR",
      "Il servizio AI ha restituito un formato non valido."
    );
  }

  try {
    evaluation = validateEvaluation(evaluation);
  } catch {
    throw new AppError(
      502,
      "AI_PROVIDER_ERROR",
      "La valutazione AI non rispetta il formato richiesto."
    );
  }

  return {
    evaluation,
    model: completion.model,
    usage: completion.usage
  };
}

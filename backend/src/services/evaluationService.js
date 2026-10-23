
import { evaluateWithGroq } from "./groqClient.js";

import { saveEvaluation } from "../repositories/evaluationRepository.js";

import { EVALUATION_PROMPT_VERSION } from "../prompts/evaluationSystemPrompt.js";

export async function evaluateGarmentService(garmentData) {

  // 1. Richiesta di valutazione a Groq
  const result = await evaluateWithGroq(garmentData);

  // 2. Estrazione della valutazione validata
  const evaluation = result.evaluation;

  // 3. Persistenza della valutazione in PostgreSQL
  const savedRecord = await saveEvaluation(
    garmentData,
    evaluation,
    {
      modelName: process.env.GROQ_MODEL,
      promptVersion: EVALUATION_PROMPT_VERSION,
    }
  );

  // 4. Conferma del salvataggio nel log
  console.log(
    "[Evaluation] Valutazione salvata:",
    savedRecord.id
  );

  // 5. Restituzione della valutazione al controller
  return evaluation;
}

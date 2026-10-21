import {   evaluateGarmentService } from "../services/evaluationService.js";

import {
  validateEvaluation
} from "../validators/evaluationValidator.js";

export async function evaluateGarment(req, res, next) {
  try {
    const garmentData = req.garmentData;

    // Elaborazione applicativa
    const evaluation = await evaluateGarmentService(
      garmentData
    );

    // Validazione della risposta del service
    const validatedEvaluation = validateEvaluation(
      evaluation
    );

    // Risposta HTTP
    return res.status(200).json(validatedEvaluation);

  } catch (error) {
    next(error);
  }
}

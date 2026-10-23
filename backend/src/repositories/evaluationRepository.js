
import { query } from "../config/database.js";

/**
 * Salva una valutazione AI in PostgreSQL.
 */
export async function saveEvaluation(
  garmentData,
  evaluation,
  metadata
) {
  const sql = `
    INSERT INTO evaluations (
      category,
      brand,
      condition,
      suggested_price,
      price_min,
      price_max,
      motivation,
      selling_tips,
      model_name,
      prompt_version
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id, created_at
  `;

  const params = [
    garmentData.category,
    garmentData.brand,
    garmentData.condition,
    evaluation.suggested_price,
    evaluation.range.min,
    evaluation.range.max,
    evaluation.motivation,
    JSON.stringify(evaluation.selling_tips),
    metadata.modelName,
    metadata.promptVersion,
  ];

  const result = await query(sql, params);

  return result.rows[0];
}

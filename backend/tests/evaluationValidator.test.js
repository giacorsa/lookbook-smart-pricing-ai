import test from "node:test";
import assert from "node:assert/strict";

import { validateEvaluation } from "../src/validators/evaluationValidator.js";

function createValidEvaluation() {
  return {
    suggested_price: 22,
    range: {
      min: 18,
      max: 27
    },
    motivation: "Capo in buone condizioni.",
    selling_tips: [
      "Usa fotografie luminose.",
      "Indica la taglia."
    ]
  };
}

test("T1 - Accetta una valutazione valida", () => {
  const evaluation = createValidEvaluation();

  const result = validateEvaluation(evaluation);

  assert.equal(result.suggested_price, 22);
  assert.equal(result.range.min, 18);
  assert.equal(result.range.max, 27);
  assert.equal(result.selling_tips.length, 2);
});

test("T2 - Rifiuta un prezzo negativo", () => {
  const evaluation = createValidEvaluation();

  evaluation.suggested_price = -5;

  assert.throws(
    () => validateEvaluation(evaluation),
    /Prezzo suggerito non valido/
  );
});

test("T3 - Rifiuta un prezzo fuori intervallo", () => {
  const evaluation = createValidEvaluation();

  evaluation.suggested_price = 50;

  assert.throws(
    () => validateEvaluation(evaluation),
    /Intervallo di prezzo incoerente/
  );
});

test("T4 - Rifiuta un intervallo invertito", () => {
  const evaluation = createValidEvaluation();

  evaluation.range.min = 30;
  evaluation.range.max = 10;

  assert.throws(
    () => validateEvaluation(evaluation),
    /Intervallo di prezzo incoerente/
  );
});

test("T5 - Rifiuta una motivazione vuota", () => {
  const evaluation = createValidEvaluation();

  evaluation.motivation = "   ";

  assert.throws(
    () => validateEvaluation(evaluation),
    /Motivazione mancante/
  );
});

test("T6 - Rifiuta consigli non validi", () => {
  const evaluation = createValidEvaluation();

  evaluation.selling_tips = ["Consiglio valido", ""];

  assert.throws(
    () => validateEvaluation(evaluation),
    /Consigli di vendita non validi/
  );
});

test("T7 - Rifiuta un oggetto nullo", () => {
  assert.throws(
    () => validateEvaluation(null),
    /La valutazione deve essere un oggetto/
  );
});

test("T8 - Normalizza motivazione e consigli", () => {
  const evaluation = createValidEvaluation();

  evaluation.motivation = "  Capo in buone condizioni.  ";
  evaluation.selling_tips = ["  Usa fotografie luminose.  "];

  const result = validateEvaluation(evaluation);

  assert.equal(
    result.motivation,
    "Capo in buone condizioni."
  );

  assert.equal(
    result.selling_tips[0],
    "Usa fotografie luminose."
  );
});


test("T9 - Rifiuta un prezzo NaN", () => {
  const evaluation = createValidEvaluation();

  evaluation.suggested_price = NaN;

  assert.throws(
    () => validateEvaluation(evaluation),
    /Prezzo suggerito non valido/
  );
});

test("T10 - Rifiuta un prezzo infinito", () => {
  const evaluation = createValidEvaluation();

  evaluation.suggested_price = Infinity;

  assert.throws(
    () => validateEvaluation(evaluation),
    /Prezzo suggerito non valido/
  );
});

test("T11 - Rifiuta prezzi espressi come stringhe", () => {
  const evaluation = createValidEvaluation();

  evaluation.suggested_price = "22";

  assert.throws(
    () => validateEvaluation(evaluation),
    /Prezzo suggerito non valido/
  );
});

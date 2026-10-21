
import test from "node:test";
import assert from "node:assert/strict";

import {
  AppError,
  mapGroqError
} from "../src/services/groqErrorMapper.js";

test("E1 - Mappa HTTP 429", () => {
  const error = mapGroqError({ status: 429 });

  assert.equal(error.statusCode, 429);
  assert.equal(error.code, "RATE_LIMIT_EXCEEDED");
});

test("E2 - Mappa HTTP 401", () => {
  const error = mapGroqError({ status: 401 });

  assert.equal(error.statusCode, 503);
  assert.equal(error.code, "AI_SERVICE_UNAVAILABLE");
});

test("E3 - Mappa HTTP 503", () => {
  const error = mapGroqError({ status: 503 });

  assert.equal(error.statusCode, 503);
  assert.equal(error.code, "AI_SERVICE_UNAVAILABLE");
});

test("E4 - Mappa il timeout", () => {
  const error = mapGroqError({
    name: "APIConnectionTimeoutError"
  });

  assert.equal(error.statusCode, 504);
  assert.equal(error.code, "AI_TIMEOUT");
});

test("E5 - Mappa HTTP 400", () => {
  const error = mapGroqError({ status: 400 });

  assert.equal(error.statusCode, 502);
  assert.equal(error.code, "AI_PROVIDER_ERROR");
});

test("E6 - Conserva un AppError", () => {
  const original = new AppError(
    502,
    "AI_PROVIDER_ERROR",
    "Errore di prova."
  );

  const result = mapGroqError(original);

  assert.equal(result, original);
});

test("E7 - Mappa un errore sconosciuto", () => {
  const error = mapGroqError(new Error("Errore sconosciuto"));

  assert.equal(error.statusCode, 502);
  assert.equal(error.code, "AI_PROVIDER_ERROR");
});


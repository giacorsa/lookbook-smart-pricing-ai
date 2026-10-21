import test from "node:test";
import assert from "node:assert/strict";

import {  errorHandler} from "../src/middleware/errorHandler.js";

import {  AppError} from "../src/services/groqErrorMapper.js";

function createMockResponse() {
  return {
    statusCode: 200,
    body: null,

    status(code) {
      this.statusCode = code;
      return this;
    },

    json(data) {
      this.body = data;
      return this;
    }
  };
}

test("H1 - Gestisce rate limit Groq", () => {
  const error = new AppError(
    429,
    "RATE_LIMIT_EXCEEDED",
    "Rate limit raggiunto."
  );

  const res = createMockResponse();

  errorHandler(error, {}, res, () => {});

  assert.equal(res.statusCode, 429);
  assert.equal(
    res.body.error.code,
    "RATE_LIMIT_EXCEEDED"
  );
});

test("H2 - Gestisce timeout Groq", () => {
  const error = new AppError(
    504,
    "AI_TIMEOUT",
    "Timeout AI."
  );

  const res = createMockResponse();

  errorHandler(error, {}, res, () => {});

  assert.equal(res.statusCode, 504);
  assert.equal(res.body.error.code, "AI_TIMEOUT");
});

test("H3 - Gestisce indisponibilità Groq", () => {
  const error = new AppError(
    503,
    "AI_SERVICE_UNAVAILABLE",
    "Servizio AI non disponibile."
  );

  const res = createMockResponse();

  errorHandler(error, {}, res, () => {});

  assert.equal(res.statusCode, 503);
  assert.equal(
    res.body.error.code,
    "AI_SERVICE_UNAVAILABLE"
  );
});

test("H4 - Nasconde gli errori imprevisti", () => {
  const error = new Error(
    "Dettaglio interno riservato"
  );

  const res = createMockResponse();

  const originalConsoleError = console.error;
  console.error = () => {};

  try {
    errorHandler(error, {}, res, () => {});
  } finally {
    console.error = originalConsoleError;
  }

  assert.equal(res.statusCode, 500);
  assert.equal(
    res.body.error.code,
    "INTERNAL_ERROR"
  );

  assert.doesNotMatch(
    JSON.stringify(res.body),
    /Dettaglio interno riservato/
  );
});

test("H5 - Non espone dettagli tecnici Groq", () => {
  const error = new AppError(
    502,
    "AI_PROVIDER_ERROR",
    "Il servizio AI non è riuscito a elaborare la richiesta."
  );

  const res = createMockResponse();

  errorHandler(error, {}, res, () => {});

  assert.equal(res.statusCode, 502);
  assert.deepEqual(res.body.error.details, []);
});

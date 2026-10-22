
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { evaluateGarment } from "../src/services/api.js";
import { ApiError } from "../src/services/ApiError.js";

const validEvaluation = {
  suggested_price: 24,
  range: {
    min: 19,
    max: 30
  },
  motivation: "Jeans in buone condizioni.",
  selling_tips: [
    "Mostra le etichette.",
    "Indica la taglia.",
    "Fotografa eventuali difetti."
  ]
};

function createGarmentData() {
  const image = new File(
    ["contenuto immagine simulato"],
    "jeans.jpg",
    { type: "image/jpeg" }
  );

  return {
    image,
    category: "jeans",
    brand: "Levi's",
    condition: "buono"
  };
}

function mockJsonResponse(status, body, requestId = "test-request-123") {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: {
      get: vi.fn((name) =>
        name.toLowerCase() === "x-request-id"
          ? requestId
          : null
      )
    },
    json: vi.fn().mockResolvedValue(body)
  };
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("evaluateGarment - richiesta HTTP", () => {
  it("A1 - Invia POST con FormData corretta", async () => {
    const garmentData = createGarmentData();

    fetch.mockResolvedValue(
      mockJsonResponse(200, validEvaluation)
    );

    const result = await evaluateGarment(garmentData);

    expect(fetch).toHaveBeenCalledTimes(1);

    const [url, options] = fetch.mock.calls[0];

    expect(url).toBe("/api/evaluate");
    expect(options.method).toBe("POST");
    expect(options.body).toBeInstanceOf(FormData);

    const formData = options.body;

    expect(formData.get("image")).toBe(garmentData.image);
    expect(formData.get("category")).toBe("jeans");
    expect(formData.get("brand")).toBe("Levi's");
    expect(formData.get("condition")).toBe("buono");

    // Il browser deve impostare Content-Type e boundary.
    expect(options.headers?.["Content-Type"]).toBeUndefined();

    expect(result).toEqual(validEvaluation);
  });
});


describe("evaluateGarment - errori HTTP", () => {
  const cases = [
    {
      id: "A2",
      status: 400,
      code: "VALIDATION_ERROR"
    },
    {
      id: "A3",
      status: 429,
      code: "RATE_LIMIT_EXCEEDED"
    },
    {
      id: "A4",
      status: 503,
      code: "AI_SERVICE_UNAVAILABLE"
    },
    {
      id: "A5",
      status: 504,
      code: "AI_TIMEOUT"
    }
  ];

  it.each(cases)(
    "$id - Gestisce HTTP $status",
    async ({ status, code }) => {
      fetch.mockResolvedValue(
        mockJsonResponse(status, {
          error: {
            code,
            message: "Errore di test.",
            details: []
          }
        })
      );

      let caughtError;

      try {
        await evaluateGarment(createGarmentData());
      } catch (error) {
        caughtError = error;
      }

      expect(caughtError).toBeInstanceOf(ApiError);
      expect(caughtError.status).toBe(status);
      expect(caughtError.code).toBe(code);
      expect(caughtError.message).toBe("Errore di test.");
      expect(caughtError.requestId).toBe("test-request-123");
    }
  );
});


describe("evaluateGarment - errori di comunicazione", () => {
  it("A6 - Gestisce un errore di rete", async () => {
    fetch.mockRejectedValue(
      new TypeError("Failed to fetch")
    );

    await expect(
      evaluateGarment(createGarmentData())
    ).rejects.toMatchObject({
      name: "ApiError",
      status: null,
      code: "NETWORK_ERROR"
    });
  });
});


it("A7 - Gestisce una risposta JSON non valida", async () => {
  const response = mockJsonResponse(200, {});

  response.json.mockRejectedValue(
    new SyntaxError("Unexpected token")
  );

  fetch.mockResolvedValue(response);

  await expect(
    evaluateGarment(createGarmentData())
  ).rejects.toMatchObject({
    name: "ApiError",
    status: 200,
    code: "INVALID_RESPONSE",
    requestId: "test-request-123"
  });
});


describe("evaluateGarment - fallback", () => {
  it("A8 - Gestisce una risposta di errore senza messaggio", async () => {
    fetch.mockResolvedValue(
      mockJsonResponse(502, {
        error: {
          code: "AI_PROVIDER_ERROR"
        }
      })
    );

    await expect(
      evaluateGarment(createGarmentData())
    ).rejects.toMatchObject({
      name: "ApiError",
      status: 502,
      code: "AI_PROVIDER_ERROR",
      message: "Si è verificato un errore durante la valutazione."
    });
  });
});

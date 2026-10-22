
import { describe, it, expect } from "vitest";

import { getUserFriendlyError } from "../src/utils/apiErrors.js";

describe("getUserFriendlyError", () => {
  it("gestisce il rate limit", () => {
    const message = getUserFriendlyError({
      code: "RATE_LIMIT_EXCEEDED"
    });

    expect(message).toContain("limite di richieste");
  });

  it("gestisce il timeout", () => {
    const message = getUserFriendlyError({
      code: "AI_TIMEOUT"
    });

    expect(message).toContain("troppo tempo");
  });

  it("gestisce il servizio non disponibile", () => {
    const message = getUserFriendlyError({
      code: "AI_SERVICE_UNAVAILABLE"
    });

    expect(message).toContain("non è temporaneamente disponibile");
  });

  it("gestisce un errore di rete", () => {
    const message = getUserFriendlyError({
      code: "NETWORK_ERROR"
    });

    expect(message).toContain("Impossibile raggiungere");
  });

  it("gestisce un errore sconosciuto", () => {
    const message = getUserFriendlyError({
      code: "UNKNOWN_ERROR"
    });

    expect(message).toContain("errore imprevisto");
  });
});

import { ApiError } from "./ApiError.js";

const API_BASE_URL = "/api";

/**
 * Check Backend Health.
 *
 * @returns {Promise<object>}
 */
export async function checkBackendHealth() {
  const response = await fetch(
    `${API_BASE_URL}/health`,
    {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      `Errore HTTP: ${response.status}`
    );
  }

  return await response.json();
}

export async function evaluateGarment(garmentData) {
  const formData = new FormData(); //WEB Api Js interface for building form data to send via fetch

  formData.append("image", garmentData.image);
  formData.append("category", garmentData.category);
  formData.append("brand", garmentData.brand);
  formData.append("condition", garmentData.condition);

  let response;

  try {
    response = await fetch( `${API_BASE_URL}/evaluate`,
      {
        method: "POST",
        body: formData
      }
    );
  } catch {
    throw new ApiError( 
      "Impossibile contattare il server. Verifica la connessione e riprova.", 
      null, 
      "NETWORK_ERROR" 
    );
  }

  const requestId = response.headers.get("X-Request-ID");
  
  let result;

  try {
    result = await response.json();
  } catch {
    throw new ApiError(
      "Il server ha restituito una risposta non valida.",
      response.status,
      "INVALID_RESPONSE",
      requestId
    );
  }

  if (!response.ok) {
    throw new ApiError(
      result?.error?.message || "Si è verificato un errore durante la valutazione.",
      response.status,
      result?.error?.code || "API_ERROR",
      requestId
    );
  }

  return result;
}
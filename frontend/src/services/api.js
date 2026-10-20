
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

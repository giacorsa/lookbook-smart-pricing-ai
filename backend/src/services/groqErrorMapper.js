export class AppError extends Error {
  constructor(statusCode, code, message) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
  }
}


export function mapGroqError(error) {
  if (error instanceof AppError) {
    return error;
  }

  const status = error?.status;
  const name = error?.name;

  if (status === 429) {
    return new AppError(
      429,
      "RATE_LIMIT_EXCEEDED",
      "Il servizio AI ha raggiunto il limite di richieste. Riprova più tardi."
    );
  }

  if (
    status === 408 ||
    status === 504 ||
    name === "APIConnectionTimeoutError"
  ) {
    return new AppError(
      504,
      "AI_TIMEOUT",
      "Il servizio AI non ha risposto entro il tempo previsto."
    );
  }

  if (
    status === 401 ||
    status === 403 ||
    status === 404 ||
    status === 503
  ) {
    return new AppError(
      503,
      "AI_SERVICE_UNAVAILABLE",
      "Il servizio di valutazione AI non è disponibile."
    );
  }

  return new AppError(
    502,
    "AI_PROVIDER_ERROR",
    "Il servizio AI non è riuscito a elaborare la richiesta."
  );
}

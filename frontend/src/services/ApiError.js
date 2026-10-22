export class ApiError extends Error {
  constructor(message, status = null, code = "API_ERROR", requestId = null) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.requestId = requestId;
  }
}

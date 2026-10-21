import { randomUUID } from "node:crypto";

export function requestLogger(req, res, next) {
  const requestId = randomUUID();
  const startTime = performance.now();

  req.requestId = requestId;

  res.setHeader("X-Request-ID", requestId);

  res.on("finish", () => {
    const durationMs = Math.round(
      performance.now() - startTime
    );

    console.info(JSON.stringify({
      requestId,
      method: req.method,
      route: req.route?.path ?? req.path,
      status: res.statusCode,
      durationMs
    }));
  });

  next();
}

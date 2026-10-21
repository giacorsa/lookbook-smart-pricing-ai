import express from "express";
import dotenv from "dotenv";

import evaluationRoutes from "./routes/evaluationRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

import {  requestLogger} from "./middleware/requestLogger.js";


dotenv.config();

const app = express();
app.use(requestLogger);

const PORT = process.env.PORT || 3000;

// Middleware per richieste JSON
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "lookbook-smart-pricing-ai-backend"
  });
});

// Route di valutazione
app.use("/api", evaluationRoutes);

// Gestione percorsi non esistenti
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Endpoint non trovato.",
      details: []
    }
  });
});

// Middleware errori: deve essere registrato per ultimo
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend attivo su http://localhost:${PORT}`);
});

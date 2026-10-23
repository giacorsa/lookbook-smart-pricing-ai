<script setup>

import { ref } from "vue";
import { evaluateGarment } from "./services/api.js";
import GarmentForm from "./components/GarmentForm.vue";
import EvaluationResult from "./components/EvaluationResult.vue";
import BackendStatus from "./components/BackendStatus.vue";

import ErrorMessage from "./components/ErrorMessage.vue";
import { getUserFriendlyError } from "./utils/apiErrors.js";

// Stati possibili: idle, loading, success, error
const status = ref("idle");

// Risultato della valutazione
const evaluation = ref(null);

// Messaggio di errore
const errorMessage = ref("");

// ID della richiesta in caso di errore
const errorRequestId = ref(null);

async function handleEvaluate(garmentData) {
  // Evita richieste duplicate
  if (status.value === "loading") {
    return;
  }

  status.value = "loading";
  evaluation.value = null;
  errorMessage.value = "";
  errorRequestId.value = null;

  try {
    const result = await evaluateGarment(garmentData);

    evaluation.value = result;
    status.value = "success";

  } catch (error) {
    errorMessage.value = getUserFriendlyError(error);
    errorRequestId.value = error.requestId ?? null;

    status.value = "error";
  }
}

</script>

<template>
  <main>
    <header class="app-header">
      <h1>LookBook Smart Pricing AI</h1>
    </header>

    <BackendStatus />

    <GarmentForm
      :is-loading="status === 'loading'"
      @submit="handleEvaluate"
    />

    <p v-if="status === 'loading'" role="status" aria-live="polite">
      Analisi AI in corso...
    </p>

    <ErrorMessage
      v-if="status === 'error'"
      :message="errorMessage"
      :request-id="errorRequestId"
    />


    <EvaluationResult
      v-if="status === 'success' && evaluation"
      :evaluation="evaluation"
    />

  </main>
</template>

<style scoped>
main {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px;
  box-sizing: border-box;
}

.app-header {
  text-align: center;
  margin-bottom: 32px;
}

.app-header h1 {
  margin-bottom: 12px;
  color: #263238;
}

.app-header p {
  color: #64748b;
}

.demo-controls {
  margin-bottom: 24px;
  padding: 16px 20px;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  background: #eff6ff;
}

.demo-controls h2 {
  margin: 0 0 12px;
  font-size: 16px;
  color: #1e40af;
}

.demo-controls label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.demo-controls p {
  margin-bottom: 0;
  font-size: 13px;
  color: #64748b;
}

.app-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: start;
  gap: 24px;
}

.app-layout > * {
  min-width: 0;
}

.result-area {
  min-height: 250px;
}

.status-panel {
  padding: 32px 24px;
  border: 1px solid #dbe2ea;
  border-radius: 12px;
  background: white;
  text-align: center;
}

.status-panel h2 {
  margin-top: 0;
  color: #334155;
}

.status-panel p {
  color: #64748b;
  line-height: 1.6;
}

.loading-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.spinner {
  width: 42px;
  height: 42px;
  border: 4px solid #bfdbfe;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
    border-top-color: #1d4ed8;
  }
}

.error-panel {
  border-color: #fecaca;
  background: #fef2f2;
}

.error-panel h2 {
  color: #b91c1c;
}

.demo-notice {
  margin: 24px 0;
  color: #64748b;
  font-size: 13px;
  text-align: center;
}

@media (max-width: 800px) {
  .app-layout {
    grid-template-columns: 1fr;
  }
}
</style>

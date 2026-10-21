<script setup>
import { computed, ref } from "vue";

import GarmentForm from "./components/GarmentForm.vue";
import EvaluationResult from "./components/EvaluationResult.vue";
import BackendStatus from "./components/BackendStatus.vue";

// Stati possibili: idle, loading, success, error
const requestStatus = ref("idle");

// Risultato della valutazione
const evaluation = ref(null);

// Messaggio di errore
const errorMessage = ref("");

// Modalità di simulazione:
// false = risposta corretta
// true  = errore simulato
const simulateError = ref(false);

// Prop derivata dallo stato della richiesta
const isLoading = computed(() => {
  return requestStatus.value === "loading";
});

// Dati di esempio
const mockEvaluation = {
  suggested_price: 22,
  range: {
    min: 18,
    max: 27,
  },
  motivation:
    "Il capo presenta un buon equilibrio tra riconoscibilità " +
    "del brand, condizioni generali e domanda potenziale " +
    "nel mercato second-hand.",
  selling_tips: [
    "Utilizza fotografie luminose che mostrino tutti i dettagli.",
    "Indica chiaramente taglia, misure e condizioni del capo.",
    "Pubblica l'annuncio con un prezzo leggermente negoziabile.",
  ],
};

// Simula una richiesta asincrona al backend
async function simulateEvaluation(garmentData) {
  // Attende 2 secondi
  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (simulateError.value) {
    throw new Error("Errore simulato durante la valutazione AI.");
  }

  // Restituisce una copia indipendente del JSON
  return {
    ...mockEvaluation,
    range: { ...mockEvaluation.range },
    selling_tips: [...mockEvaluation.selling_tips],
  };
}

// Riceve il submit da GarmentForm.vue
async function handleGarmentSubmit(garmentData) {
  if (isLoading.value) {
    return;
  }

  requestStatus.value = "loading";
  evaluation.value = null;
  errorMessage.value = "";

  console.log("Richiesta di valutazione:", {
    imageName: garmentData.image.name,
    category: garmentData.category,
    brand: garmentData.brand,
    condition: garmentData.condition,
  });

  try {
    const result = await simulateEvaluation(garmentData);

    evaluation.value = result;
    requestStatus.value = "success";

    console.log("Valutazione completata:", result);
  } catch (error) {
    evaluation.value = null;
    errorMessage.value =
      error instanceof Error
        ? error.message
        : "Errore imprevisto durante la valutazione.";

    requestStatus.value = "error";

    console.error("Errore valutazione:", error);
  }
}
</script>

<template>
  <main>
    <header class="app-header">
      <h1>LookBook Smart Pricing AI</h1>

      <p>
        Sistema intelligente per la valutazione di capi d'abbigliamento
        second-hand.
      </p>
    </header>

    <!-- Controlli disponibili solo nella demo -->
    <section class="demo-controls">
      <h2>Modalità dimostrativa</h2>

      <label>
        <input v-model="simulateError" type="checkbox" :disabled="isLoading" />
        Simula errore durante la valutazione
      </label>

      <p>La richiesta viene simulata con un'attesa di circa 2 secondi.</p>
    </section>

    <div class="app-layout">
      <!-- Form -->
      <GarmentForm :is-loading="isLoading" @submit="handleGarmentSubmit" />

      <!-- Area risultato -->
      <section class="result-area" aria-live="polite">
        <!-- IDLE -->
        <div v-if="requestStatus === 'idle'" class="status-panel idle-panel">
          <h2>In attesa della valutazione</h2>

          <p>
            Compila il form e carica una fotografia per ottenere il prezzo
            suggerito.
          </p>
        </div>

        <!-- LOADING -->
        <div
          v-else-if="requestStatus === 'loading'"
          class="status-panel loading-panel"
          role="status"
        >
          <div class="spinner" aria-hidden="true"></div>

          <h2>Analisi in corso...</h2>

          <p>Stiamo elaborando le informazioni del capo.</p>
        </div>

        <!-- SUCCESS -->
        <EvaluationResult
          v-else-if="requestStatus === 'success' && evaluation"
          :evaluation="evaluation"
        />

        <!-- ERROR -->
        <div
          v-else-if="requestStatus === 'error'"
          class="status-panel error-panel"
          role="alert"
        >
          <h2>Valutazione non riuscita</h2>

          <p>{{ errorMessage }}</p>

          <p>Verifica le informazioni e riprova.</p>
        </div>
      </section>
    </div>

    <p class="demo-notice">
      Modalità dimostrativa: nessuna richiesta viene inviata al modello AI.
    </p>

    <BackendStatus />
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

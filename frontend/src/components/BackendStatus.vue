
<script setup>
import { ref, onMounted } from "vue";
import  { checkBackendHealth }  from '../services/api.js';
  // Importa la funzione checkBackendHealthr

// Stato reattivo del componente
const status = ref("idle");
const backendData = ref(null);
const errorMessage = ref("");

// Funzione per interrogare il backend
async function loadBackendStatus() {
  status.value = "loading";
  errorMessage.value = "";

  try {
    const data = await checkBackendHealth();

    backendData.value = data;
    status.value = "success";

  } catch (error) {
    backendData.value = null;
    errorMessage.value = error.message;
    status.value = "error";
  }
}

// Esegue il controllo al montaggio
onMounted(() => {
  loadBackendStatus();
});
</script>

<template>
  <section class="backend-status">
    <h2>Stato del Backend</h2>

    <p v-if="status === 'loading'">
      Connessione al backend in corso...
    </p>

    <div v-else-if="status === 'success'">
      <p class="success">
        Backend connesso correttamente!
      </p>

      <p>
        <strong>Applicazione:</strong>
        {{ backendData.application }}
      </p>

      <p>
        <strong>Messaggio:</strong>
        {{ backendData.message }}
      </p>

      <p>
        <strong>Timestamp:</strong>
        {{ backendData.timestamp }}
      </p>
    </div>

    <div v-else-if="status === 'error'">
      <p class="error">
        Errore di connessione al backend
      </p>

      <p>{{ errorMessage }}</p>
    </div>

    <button
      type="button"
      :disabled="status === 'loading'"
      @click="loadBackendStatus"
    >
      Verifica connessione
    </button>
  </section>
</template>

<style scoped>
.backend-status {
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 12px;
  max-width: 600px;
  margin: 30px auto;
}

.success {
  color: #17803d;
  font-weight: bold;
}

.error {
  color: #c62828;
  font-weight: bold;
}

button {
  margin-top: 16px;
  padding: 10px 16px;
  cursor: pointer;
}
</style>

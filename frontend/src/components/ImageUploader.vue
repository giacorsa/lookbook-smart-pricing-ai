
<script setup>
import { ref, onUnmounted } from "vue";

// Evento emesso verso il componente padre
const emit = defineEmits(["image-selected"]);

// Formati e dimensione massima consentiti
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp"
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Stato reattivo
const selectedFile = ref(null);
const previewUrl = ref(null);
const errorMessage = ref("");
const fileInput = ref(null);

// Gestione della selezione
function handleFileChange(event) {
  const file = event.target.files?.[0];

  if (!file) return;

  errorMessage.value = "";

  // Verifica del formato
  if (!ALLOWED_TYPES.includes(file.type)) {
    errorMessage.value =  "Formato non valido. Usa JPEG, PNG o WebP.";

    resetInput();
    return;
  }

  // Verifica della dimensione
  if (file.size > MAX_FILE_SIZE) {
    errorMessage.value = "Immagine troppo grande. Massimo 5 MB.";

    resetInput();
    return;
  }

  // Rimuove l'eventuale anteprima precedente
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }

  // Memorizza il file e genera l'anteprima
  selectedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);

  // Comunica il file al padre
  emit("image-selected", file);
}

// Resetta l'input HTML
function resetInput() {
  if (fileInput.value) {
    fileInput.value.value = "";
  }
}

// Rimuove l'immagine selezionata
function removeImage() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }

  selectedFile.value = null;
  previewUrl.value = null;
  errorMessage.value = "";

  resetInput();

  // Comunica al padre che non c'è più un file
  emit("image-selected", null);
}

// Libera la risorsa quando il componente viene distrutto
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<template>
  <section class="image-uploader">
    <label for="garment-image" class="field-label">
      Fotografia del capo *
    </label>

    <input
      id="garment-image"
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      @change="handleFileChange"
    />

    <p class="helper-text">
      Formati: JPEG, PNG, WebP. Dimensione massima: 5 MB.
    </p>

    <p v-if="errorMessage" class="error-message" role="alert">
      {{ errorMessage }}
    </p>

    <div v-if="previewUrl" class="preview-container">
      <img
        :src="previewUrl"
        alt="Anteprima del capo selezionato"
        class="preview-image"
      />

      <p class="file-info">
        {{ selectedFile.name }}
        ({{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB)
      </p>

      <button
        type="button"
        class="remove-button"
        @click="removeImage"
      >
        Rimuovi immagine
      </button>
    </div>
  </section>
</template>

<style scoped>
.image-uploader {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field-label {
  font-weight: 600;
  font-size: 16px;
}

input[type="file"] {
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: white;
  max-width: 100%;
  box-sizing: border-box;
}

.helper-text {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.error-message {
  margin: 0;
  color: #b91c1c;
  font-size: 14px;
}

.preview-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-top: 8px;
}

.preview-image {
  width: 100%;
  max-width: 320px;
  max-height: 320px;
  object-fit: contain;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: white;
}

.file-info {
  margin: 0;
  font-size: 13px;
  color: #475569;
  overflow-wrap: anywhere;
}

.remove-button {
  padding: 10px 14px;
  border: 1px solid #dc2626;
  border-radius: 8px;
  background: white;
  color: #b91c1c;
  cursor: pointer;
}

.remove-button:hover {
  background: #fef2f2;
}
</style>

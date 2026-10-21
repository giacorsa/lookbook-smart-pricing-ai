
<script setup>
import { reactive, ref } from "vue";
import ImageUploader from "./ImageUploader.vue";

// Proprietà del componente
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
});


// Evento verso App.vue
const emit = defineEmits(["submit"]);

// Categorie disponibili
const categories = [
  { value: "maglietta", label: "Maglietta" },
  { value: "camicia", label: "Camicia" },
  { value: "pantaloni", label: "Pantaloni" },
  { value: "jeans", label: "Jeans" },
  { value: "giacca", label: "Giacca" },
  { value: "cappotto", label: "Cappotto" },
  { value: "vestito", label: "Vestito" },
  { value: "scarpe", label: "Scarpe" },
  { value: "accessori", label: "Accessori" }
];

// Condizioni disponibili
const conditions = [
  { value: "nuovo", label: "Nuovo" },
  { value: "buono", label: "Buono" },
  { value: "usato", label: "Usato" }
];

// Stato del form
const form = reactive({
  image: null,
  category: "",
  brand: "",
  condition: ""
});

// Messaggi di validazione
const errors = reactive({
  image: "",
  category: "",
  brand: "",
  condition: ""
});

// Stato del messaggio informativo
const infoMessage = ref("");

// Riceve l'immagine da ImageUploader
function handleImageSelected(file) {
  form.image = file;
  errors.image = "";
  infoMessage.value = "";
}

// Pulisce gli errori precedenti
function clearErrors() {
  errors.image = "";
  errors.category = "";
  errors.brand = "";
  errors.condition = "";
}

// Validazione completa del form
function validateForm() {
  clearErrors();

  let isValid = true;

  if (!form.image) {
    errors.image = "Seleziona una fotografia.";
    isValid = false;
  }

  if (!form.category) {
    errors.category = "Seleziona una categoria.";
    isValid = false;
  }

  if (!form.brand.trim()) {
    errors.brand = "Inserisci il brand.";
    isValid = false;
  }

  if (!form.condition) {
    errors.condition = "Seleziona la condizione.";
    isValid = false;
  }

  return isValid;
}

// Invio del form
function handleSubmit() {
    
    if (props.isLoading) {
        return; // Evita l'invio se è in corso un caricamento
    }

    infoMessage.value = "";

    if (!validateForm()) {
      return; // Interrompe l'invio se ci sono errori
    }

  // Crea un oggetto indipendente dal form reattivo
  const garmentData = {
    image: form.image,
    category: form.category,
    brand: form.brand.trim(),
    condition: form.condition
  };

  // Comunica i dati ad App.vue
  emit("submit", garmentData);

//   infoMessage.value = "Dati validati e inviati al componente padre.";
}
</script>

<template>
  <form
    class="garment-form"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <h2>Valuta il tuo capo</h2>

    <!-- Fotografia -->
    <div class="form-field">
      <ImageUploader
        @image-selected="handleImageSelected"
      />

      <p v-if="errors.image" class="error" role="alert">
        {{ errors.image }}
      </p>
    </div>

    <!-- Categoria -->
    <div class="form-field">
      <label for="category">Categoria *</label>

      <select
        id="category"
        v-model="form.category"
        :aria-invalid="Boolean(errors.category)"
      >
        <option value="">Seleziona categoria</option>

        <option
          v-for="category in categories"
          :key="category.value"
          :value="category.value"
        >
          {{ category.label }}
        </option>
      </select>

      <p v-if="errors.category" class="error" role="alert">
        {{ errors.category }}
      </p>
    </div>

    <!-- Brand -->
    <div class="form-field">
      <label for="brand">Brand *</label>

      <input
        id="brand"
        v-model="form.brand"
        type="text"
        maxlength="100"
        placeholder="Es. Levi's, Zara, Nike"
        :aria-invalid="Boolean(errors.brand)"
      />

      <p v-if="errors.brand" class="error" role="alert">
        {{ errors.brand }}
      </p>
    </div>

    <!-- Condizione -->
    <div class="form-field">
      <label for="condition">Condizione *</label>

      <select
        id="condition"
        v-model="form.condition"
        :aria-invalid="Boolean(errors.condition)"
      >
        <option value="">Seleziona condizione</option>

        <option
          v-for="condition in conditions"
          :key="condition.value"
          :value="condition.value"
        >
          {{ condition.label }}
        </option>
      </select>

      <p v-if="errors.condition" class="error" role="alert">
        {{ errors.condition }}
      </p>
    </div>

    <button 
        type="submit" 
        class="submit-button" 
        :disabled="isLoading"
    >
      {{ isLoading ? "Valutazione in corso..." : "Valuta il capo" }}
    </button>

    <p
      v-if="infoMessage"
      class="info-message"
      role="status"
    >
      {{ infoMessage }}
    </p>
  </form>
</template>

<style scoped>
.garment-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  border: 1px solid #dbe2ea;
  border-radius: 12px;
  background: white;
}

h2 {
  margin: 0;
  color: #263238;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 600;
  color: #334155;
}

input,
select {
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: white;
  font: inherit;
}

input:focus,
select:focus {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
}

.error {
  margin: 0;
  color: #b91c1c;
  font-size: 14px;
}

.submit-button {
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.submit-button:hover {
  background: #1d4ed8;
}


.submit-button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  opacity: 0.75;
}

.info-message {
  margin: 0;
  color: #166534;
  font-size: 14px;
}
</style>

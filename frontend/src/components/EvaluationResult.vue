
<script setup>
import { computed } from "vue";
import PriceRange from "./PriceRange.vue";

const props = defineProps({
  evaluation: {
    type: Object,
    required: true
  }
});

const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR"
});

function formatPrice(value) {
  return currencyFormatter.format(value);
}

// Verifica della struttura della valutazione
const isValidEvaluation = computed(() => {
  const data = props.evaluation;

  if (!data || typeof data !== "object") {
    return false;
  }

  const { suggested_price, range, motivation, selling_tips } = data;

  return (
    typeof suggested_price === "number" &&
    Number.isFinite(suggested_price) &&
    suggested_price >= 0 &&
    range !== null &&
    typeof range === "object" &&
    typeof range.min === "number" &&
    typeof range.max === "number" &&
    Number.isFinite(range.min) &&
    Number.isFinite(range.max) &&
    range.min >= 0 &&
    range.max > range.min &&
    suggested_price >= range.min &&
    suggested_price <= range.max &&
    typeof motivation === "string" &&
    motivation.trim().length > 0 &&
    Array.isArray(selling_tips) &&
    selling_tips.every(
      tip => typeof tip === "string" && tip.trim().length > 0
    )
  );
});
</script>

<template>
  <section class="evaluation-result">
    <h2>Valutazione AI</h2>

    <template v-if="isValidEvaluation">
      <!-- Prezzo suggerito -->
      <div class="suggested-price-box">
        <p class="price-label">Prezzo consigliato</p>

        <p class="suggested-price">
          {{ formatPrice(evaluation.suggested_price) }}
        </p>
      </div>

      <!-- Intervallo di prezzo -->
      <PriceRange
        :min="evaluation.range.min"
        :max="evaluation.range.max"
        :suggested-price="evaluation.suggested_price"
      />

      <!-- Motivazione -->
      <div class="result-section">
        <h3>Motivazione della valutazione</h3>

        <p>{{ evaluation.motivation }}</p>
      </div>

      <!-- Consigli di vendita -->
      <div class="result-section">
        <h3>Consigli per la vendita</h3>

        <ul>
          <li
            v-for="(tip, index) in evaluation.selling_tips"
            :key="index"
          >
            {{ tip }}
          </li>
        </ul>
      </div>

      <p class="disclaimer">
        Il prezzo è una stima indicativa e non garantisce
        il valore effettivo di vendita.
      </p>
    </template>

    <p v-else class="result-error" role="alert">
      I dati della valutazione non sono validi.
    </p>
  </section>
</template>

<style scoped>
.evaluation-result {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  border: 1px solid #dbe2ea;
  border-radius: 12px;
  background: white;
}

h2 {
  margin: 0;
  color: #263238;
}

.suggested-price-box {
  padding: 24px;
  border-radius: 12px;
  background: #eff6ff;
  text-align: center;
}

.price-label {
  margin: 0 0 8px;
  color: #475569;
  font-weight: 600;
}

.suggested-price {
  margin: 0;
  font-size: clamp(30px, 5vw, 42px);
  font-weight: 700;
  color: #1d4ed8;
}

.result-section h3 {
  margin: 0 0 12px;
  color: #334155;
  font-size: 18px;
}

.result-section p {
  margin: 0;
  line-height: 1.7;
  color: #475569;
}

.result-section ul {
  margin: 0;
  padding-left: 22px;
  color: #475569;
  line-height: 1.8;
}

.result-section li {
  margin-bottom: 8px;
}

.disclaimer {
  margin: 0;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 12px;
}

.result-error {
  color: #b91c1c;
}
</style>

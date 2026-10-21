
<script setup>
import { computed } from "vue";

const props = defineProps({
  min: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true
  },
  suggestedPrice: {
    type: Number,
    required: true
  }
});

// Formattazione in euro
const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR"
});

function formatPrice(value) {
  return currencyFormatter.format(value);
}

// Controllo di coerenza dell'intervallo
const isValidRange = computed(() => {
  return (
    Number.isFinite(props.min) &&
    Number.isFinite(props.max) &&
    Number.isFinite(props.suggestedPrice) &&
    props.min >= 0 &&
    props.max > props.min &&
    props.suggestedPrice >= props.min &&
    props.suggestedPrice <= props.max
  );
});

// Posizione percentuale del prezzo suggerito
const markerPosition = computed(() => {
  if (!isValidRange.value) {
    return 0;
  }

  return (
    (props.suggestedPrice - props.min) /
    (props.max - props.min)
  ) * 100;
});
</script>

<template>
  <section class="price-range">
    <h3>Intervallo di prezzo</h3>

    <template v-if="isValidRange">
      <div class="range-labels">
        <span>{{ formatPrice(min) }}</span>
        <span>{{ formatPrice(max) }}</span>
      </div>

      <div
        class="range-track"
        role="img"
        :aria-label="
          `Intervallo da ${formatPrice(min)} a ${formatPrice(max)}.
           Prezzo suggerito ${formatPrice(suggestedPrice)}.`
        "
      >
        <div
          class="range-marker"
          :style="{ left: `${markerPosition}%` }"
        ></div>
      </div>

      <p class="range-description">
        Il prezzo consigliato è
        <strong>{{ formatPrice(suggestedPrice) }}</strong>
      </p>
    </template>

    <p v-else class="range-error" role="alert">
      Intervallo di prezzo non valido.
    </p>
  </section>
</template>

<style scoped>
.price-range {
  padding: 20px;
  border-radius: 12px;
  background: #f1f5f9;
}

h3 {
  margin: 0 0 16px;
  font-size: 16px;
  color: #334155;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #334155;
}

.range-track {
  position: relative;
  height: 12px;
  border-radius: 999px;
  background: #93c5fd;
}

.range-marker {
  position: absolute;
  top: 50%;
  width: 18px;
  height: 18px;
  border: 3px solid white;
  border-radius: 50%;
  background: #1d4ed8;
  box-shadow: 0 1px 4px #0002;
  transform: translate(-50%, -50%);
}

.range-description {
  margin: 18px 0 0;
  color: #475569;
  font-size: 14px;
}

.range-error {
  color: #b91c1c;
  font-size: 14px;
}
</style>

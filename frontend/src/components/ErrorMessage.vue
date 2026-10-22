
<script setup>
    defineProps({
    message: {
        type: String,
        required: true
    },
    requestId: {
        type: String,
        default: null
    }
});
</script>

<template>
  <div
    class="error-message"
    role="alert"
    aria-live="assertive"
  >
    <strong>Valutazione non riuscita</strong>

    <p>{{ message }}</p>

    <small v-if="requestId">
      Riferimento richiesta: {{ requestId }}
    </small>
  </div>
</template>

<style scoped>
.error-message {
  padding: 1rem;
  margin-top: 1rem;
  border: 1px solid #dc2626;
  border-radius: 8px;
  background-color: #fef2f2;
  color: #991b1b;
}

.error-message p {
  margin: 0.5rem 0;
}

.error-message small {
  font-size: 0.75rem;
  overflow-wrap: anywhere;
}
</style>

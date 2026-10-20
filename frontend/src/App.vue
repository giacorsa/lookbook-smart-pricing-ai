
<script setup>
import BackendStatus from './components/BackendStatus.vue';
</script>

<template>
  <main>
    <header>
      <h1>LookBook Smart Pricing AI</h1>

      <p>
        Sistema intelligente per la valutazione
        di capi d'abbigliamento second-hand.
      </p>
    </header>

    <BackendStatus />
  </main>
</template>

<style scoped>
main {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
  box-sizing: border-box;
}

header {
  text-align: center;
  margin-bottom: 32px;
}

h1 {
  color: #2c3e50;
}
</style>

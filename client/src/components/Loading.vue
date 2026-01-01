<script setup lang="ts">
import { onUnmounted, ref, watch } from "vue";

const model = defineModel<boolean>({ required: true });
const loadingTime = ref(0);
let timerInterval: number | null = null;

function startTimer() {
  stopTimer();
  timerInterval = window.setInterval(() => {
    loadingTime.value++;
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

watch(
  model,
  (newValue) => {
    if (newValue === true) {
      loadingTime.value = 0;
      startTimer();
    } else {
      stopTimer();
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  stopTimer();
});
</script>

<template>
  <v-overlay
    :model-value="model"
    class="align-center justify-center"
    persistent
    :scrim="true"
    :opacity="0.9"
  >
    <div class="loading-container text-center">
      <v-progress-circular
        indeterminate
        color="white"
        size="32"
        width="3"
      />
      <p class="text-caption text-grey mt-3">Carregando...</p>
      <p v-if="loadingTime > 5" class="text-caption text-grey-darken-1 mt-1">
        {{ loadingTime }}s
      </p>
    </div>
  </v-overlay>
</template>

<style scoped>
.loading-container {
  padding: 24px;
}
</style>

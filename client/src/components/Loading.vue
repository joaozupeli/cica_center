<script setup lang="ts">
// #region Import libs
import { onUnmounted, ref, watch } from "vue";
// #endregion

// #region Declare variables
const model = defineModel<boolean>({ required: true });
const loadingTime = ref(0);
let timerInterval: number | null = null;
// #endregion

// #region Declare Functions
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
// #endregion

// #region Watch
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
// #endregion

// #region Lifecycle hooks
onUnmounted(() => {
  stopTimer();
});
// #endregion
</script>

<template>
  <div>
    <v-overlay
      :model-value="model"
      class="align-center justify-center loading-overlay"
      persistent
      :scrim="true"
      :opacity="0.5"
    >
      <v-sheet
        elevation="12"
        class="loading-card pa-6 d-flex flex-column align-center"
        rounded="xl"
        width="280"
      >
        <!-- Spinner Animado -->
        <div class="loading-spinner mb-4">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <v-icon size="24" color="primary" class="spinner-icon">mdi-shopping</v-icon>
        </div>

        <!-- Título -->
        <div class="text-subtitle-1 mb-2 loading-title">Carregando</div>

        <!-- Progress Bar -->
        <v-progress-linear
          indeterminate
          color="primary"
          height="3"
          rounded
          class="loading-progress mb-4"
        ></v-progress-linear>

        <!-- Mensagem -->
        <div class="loading-message text-center">
          <div class="text-body-2">Por favor, aguarde...</div>
          <div v-if="loadingTime > 5" class="mt-2 text-caption loading-time">
            <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>
            {{ loadingTime }}s
          </div>
        </div>

        <!-- Dots animados -->
        <div class="loading-dots mt-4">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </v-sheet>
    </v-overlay>
  </div>
</template>

<style scoped>
/* Overlay com escurecimento suave */
.loading-overlay {
  transition: all 0.3s ease;
}

/* Card moderno com sombra forte */
.loading-card {
  background: rgba(255, 255, 255, 1) !important;
  border: 2px solid rgba(8, 96, 53, 0.15);
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(8, 96, 53, 0.1) !important;
  animation: fadeInScale 0.4s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Spinner customizado */
.loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: #086035;
  border-radius: 50%;
  animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
}

.spinner-ring:nth-child(2) {
  width: 70%;
  height: 70%;
  border-top-color: #4caf50;
  animation-delay: -0.3s;
}

.spinner-ring:nth-child(3) {
  width: 50%;
  height: 50%;
  border-top-color: #81c784;
  animation-delay: -0.6s;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spinner-icon {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

/* Título */
.loading-title {
  color: #086035;
  font-weight: 600;
  letter-spacing: 0.5px;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Progress bar suave */
.loading-progress {
  width: 100%;
  opacity: 0.8;
}

/* Mensagem */
.loading-message {
  color: #666;
  animation: fadeIn 0.8s ease-out;
}

.loading-time {
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Dots animados */
.loading-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #086035;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Tema escuro */
.v-theme--dark .loading-card {
  background: rgba(30, 30, 30, 0.98) !important;
  border-color: rgba(8, 96, 53, 0.3);
}

.v-theme--dark .loading-title {
  color: #81c784;
}

.v-theme--dark .loading-message {
  color: #bbb;
}

.v-theme--dark .loading-time {
  color: #999;
}
</style>

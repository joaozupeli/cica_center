<script lang="ts" setup>
import { useRouter } from "vue-router";
const router = useRouter();

function voltarInicio() {
  router.push("/");
}
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" class="text-center">
        <div class="error-code mb-2">
          <span class="text-white">4</span>
          <v-icon color="white" size="48" class="mx-1">mdi-shield-lock-outline</v-icon>
          <span class="text-white">3</span>
        </div>
        <p class="text-subtitle-2 text-white mb-2">Acesso Negado</p>
        <p class="text-caption text-grey mb-4">Você não tem permissão</p>
        <v-btn size="small" color="white" prepend-icon="mdi-arrow-left" @click="voltarInicio()">
          Voltar
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.error-code {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 3rem;
  font-weight: 700;
}
</style>

<script lang="ts" setup>
import { ref } from 'vue';

const activeTab = ref('visao-geral');

const resumo = ref({
  saldo: 'R$ 0,00',
  receitas: 'R$ 0,00',
  despesas: 'R$ 0,00',
});
</script>

<template>
  <v-container fluid class="pa-4">
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <h1 class="text-h6 text-white mb-1">
          <v-icon size="20" class="mr-2">mdi-cash-multiple</v-icon>
          Financeiro
        </h1>
        <p class="text-caption text-grey">Gestão financeira</p>
      </div>
      <v-btn size="small" color="white" prepend-icon="mdi-plus">
        Novo
      </v-btn>
    </div>

    <v-row dense class="mb-4">
      <v-col cols="4">
        <v-card color="grey-darken-4" elevation="0" class="stat-card">
          <v-card-text class="pa-3">
            <div class="text-caption text-grey mb-1">Saldo</div>
            <div class="stat-value text-white">{{ resumo.saldo }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card color="grey-darken-4" elevation="0" class="stat-card">
          <v-card-text class="pa-3">
            <div class="text-caption text-grey mb-1">Receitas</div>
            <div class="stat-value text-success">{{ resumo.receitas }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card color="grey-darken-4" elevation="0" class="stat-card">
          <v-card-text class="pa-3">
            <div class="text-caption text-grey mb-1">Despesas</div>
            <div class="stat-value text-error">{{ resumo.despesas }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card color="grey-darken-4" elevation="0" class="content-card">
      <v-tabs v-model="activeTab" bg-color="transparent" color="white" density="compact">
        <v-tab value="visao-geral" class="text-caption">Visão Geral</v-tab>
        <v-tab value="receitas" class="text-caption">Receitas</v-tab>
        <v-tab value="despesas" class="text-caption">Despesas</v-tab>
      </v-tabs>

      <v-divider color="grey-darken-3" />

      <v-card-text class="pa-4">
        <div class="text-center py-8">
          <v-icon size="40" color="grey-darken-2">mdi-cash-register</v-icon>
          <p class="text-caption text-grey mt-3">Nenhum lançamento</p>
          <v-btn size="small" color="white" class="mt-3" prepend-icon="mdi-plus">
            Primeiro Lançamento
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.stat-card {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px !important;
}

.stat-value {
  font-size: 1rem;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
}

.content-card {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px !important;
}
</style>

<script lang="ts" setup>
import { ref } from 'vue';

const vendas = ref<any[]>([]);
const activeTab = ref('todas');
</script>

<template>
  <v-container fluid class="pa-4">
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <h1 class="text-h6 text-white mb-1">
          <v-icon size="20" class="mr-2">mdi-cart-outline</v-icon>
          Vendas
        </h1>
        <p class="text-caption text-grey">Pedidos</p>
      </div>
      <v-btn size="small" color="white" prepend-icon="mdi-plus">
        Nova
      </v-btn>
    </div>

    <v-row dense class="mb-4">
      <v-col cols="6" md="3">
        <v-card color="grey-darken-4" elevation="0" class="stat-card">
          <v-card-text class="pa-3">
            <div class="text-caption text-grey mb-1">Total</div>
            <div class="stat-value text-white">0</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card color="grey-darken-4" elevation="0" class="stat-card">
          <v-card-text class="pa-3">
            <div class="text-caption text-grey mb-1">Finalizadas</div>
            <div class="stat-value text-success">0</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card color="grey-darken-4" elevation="0" class="stat-card">
          <v-card-text class="pa-3">
            <div class="text-caption text-grey mb-1">Pendentes</div>
            <div class="stat-value text-warning">0</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card color="grey-darken-4" elevation="0" class="stat-card">
          <v-card-text class="pa-3">
            <div class="text-caption text-grey mb-1">Faturamento</div>
            <div class="stat-value text-white">R$ 0</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card color="grey-darken-4" elevation="0" class="content-card">
      <v-tabs v-model="activeTab" bg-color="transparent" color="white" density="compact">
        <v-tab value="todas" class="text-caption">Todas</v-tab>
        <v-tab value="pendentes" class="text-caption">Pendentes</v-tab>
        <v-tab value="finalizadas" class="text-caption">Finalizadas</v-tab>
      </v-tabs>

      <v-divider color="grey-darken-3" />

      <v-card-text v-if="vendas.length === 0" class="pa-4">
        <div class="text-center py-8">
          <v-icon size="40" color="grey-darken-2">mdi-cart-off</v-icon>
          <p class="text-caption text-grey mt-3">Nenhuma venda</p>
          <v-btn size="small" color="white" class="mt-3" prepend-icon="mdi-plus">
            Registrar
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

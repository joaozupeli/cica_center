<script lang="ts" setup>
import { ref } from 'vue';

const stats = ref([
  { title: 'Receitas', value: 'R$ 0,00', icon: 'mdi-trending-up', change: '+0%' },
  { title: 'Despesas', value: 'R$ 0,00', icon: 'mdi-trending-down', change: '0%' },
  { title: 'Clientes', value: '0', icon: 'mdi-account-group', change: '+0' },
  { title: 'Tarefas', value: '0', icon: 'mdi-clipboard-check-outline', change: '0' },
]);

const quickActions = ref([
  { title: 'Nova Venda', icon: 'mdi-cart-plus', to: '/vendas' },
  { title: 'Novo Cliente', icon: 'mdi-account-plus', to: '/clientes' },
  { title: 'Nova Tarefa', icon: 'mdi-plus-circle', to: '/tarefas' },
  { title: 'Relatórios', icon: 'mdi-chart-bar', to: '/relatorios' },
]);
</script>

<template>
  <v-container fluid class="pa-4">
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <h1 class="text-h6 text-white mb-1">Dashboard</h1>
        <p class="text-caption text-grey">Visão geral</p>
      </div>
      <v-btn size="small" color="white" prepend-icon="mdi-refresh" variant="outlined">
        Atualizar
      </v-btn>
    </div>

    <v-row dense>
      <v-col v-for="(stat, index) in stats" :key="index" cols="6" md="3">
        <v-card color="grey-darken-4" class="stat-card" elevation="0">
          <v-card-text class="pa-3">
            <div class="d-flex align-center justify-space-between mb-2">
              <v-icon color="grey" size="18">{{ stat.icon }}</v-icon>
              <span class="text-caption text-grey">{{ stat.change }}</span>
            </div>
            <div class="stat-value text-white">{{ stat.value }}</div>
            <div class="text-caption text-grey">{{ stat.title }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div class="text-subtitle-2 text-grey-lighten-1 mt-4 mb-2">Ações Rápidas</div>
    <v-row dense>
      <v-col v-for="action in quickActions" :key="action.title" cols="6" sm="3">
        <v-card 
          color="grey-darken-4" 
          class="action-card" 
          elevation="0"
          :to="action.to"
        >
          <v-card-text class="text-center pa-3">
            <v-icon size="24" color="grey-lighten-1" class="mb-2">{{ action.icon }}</v-icon>
            <div class="text-caption text-grey-lighten-1">{{ action.title }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4" dense>
      <v-col cols="12" md="6">
        <v-card color="grey-darken-4" elevation="0" class="content-card">
          <v-card-title class="text-subtitle-2 text-white pa-3 pb-2">
            <v-icon size="16" class="mr-2">mdi-history</v-icon>
            Atividades Recentes
          </v-card-title>
          <v-divider color="grey-darken-3" />
          <v-card-text class="pa-3">
            <div class="text-center py-6">
              <v-icon size="32" color="grey-darken-2">mdi-history</v-icon>
              <p class="text-caption text-grey mt-2">Nenhuma atividade</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card color="grey-darken-4" elevation="0" class="content-card">
          <v-card-title class="text-subtitle-2 text-white pa-3 pb-2">
            <v-icon size="16" class="mr-2">mdi-chart-line</v-icon>
            Resumo Financeiro
          </v-card-title>
          <v-divider color="grey-darken-3" />
          <v-card-text class="pa-3">
            <div class="text-center py-6">
              <v-icon size="32" color="grey-darken-2">mdi-chart-areaspline</v-icon>
              <p class="text-caption text-grey mt-2">Sem dados</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.stat-card {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px !important;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
}

.action-card {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px !important;
  cursor: pointer;
}

.content-card {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px !important;
}
</style>

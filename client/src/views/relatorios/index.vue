<script lang="ts" setup>
const relatorios = [
  { title: 'Vendas', icon: 'mdi-cart-outline' },
  { title: 'Financeiro', icon: 'mdi-cash-multiple' },
  { title: 'Clientes', icon: 'mdi-account-group' },
  { title: 'Produtos', icon: 'mdi-package-variant' },
  { title: 'Tarefas', icon: 'mdi-clipboard-check' },
  { title: 'Gerencial', icon: 'mdi-chart-bar' },
];
</script>

<template>
  <v-container fluid class="pa-4">
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <h1 class="text-h6 text-white mb-1">
          <v-icon size="20" class="mr-2">mdi-chart-bar</v-icon>
          Relatórios
        </h1>
        <p class="text-caption text-grey">Análises</p>
      </div>
    </div>

    <v-row dense>
      <v-col v-for="relatorio in relatorios" :key="relatorio.title" cols="6" md="4">
        <v-card color="grey-darken-4" elevation="0" class="report-card">
          <v-card-text class="pa-3">
            <div class="d-flex align-center mb-2">
              <v-icon size="20" color="grey-lighten-1" class="mr-2">{{ relatorio.icon }}</v-icon>
              <span class="text-caption text-white">{{ relatorio.title }}</span>
            </div>
            <v-btn block size="small" variant="outlined" color="grey">
              Gerar
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.report-card {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px !important;
}
</style>

<script lang="ts" setup>
import { ref } from 'vue';

const tarefas = ref<any[]>([]);
const activeFilter = ref('todas');
</script>

<template>
  <v-container fluid class="pa-4">
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <h1 class="text-h6 text-white mb-1">
          <v-icon size="20" class="mr-2">mdi-clipboard-check-outline</v-icon>
          Tarefas
        </h1>
        <p class="text-caption text-grey">Gerenciamento</p>
      </div>
      <v-btn size="small" color="white" prepend-icon="mdi-plus">
        Nova
      </v-btn>
    </div>

    <v-card color="grey-darken-4" elevation="0" class="content-card mb-4">
      <v-card-text class="pa-2">
        <v-chip-group v-model="activeFilter" mandatory selected-class="bg-white text-black">
          <v-chip value="todas" size="small" variant="outlined" color="grey">Todas</v-chip>
          <v-chip value="pendentes" size="small" variant="outlined" color="grey">Pendentes</v-chip>
          <v-chip value="concluidas" size="small" variant="outlined" color="grey">Concluídas</v-chip>
        </v-chip-group>
      </v-card-text>
    </v-card>

    <v-card color="grey-darken-4" elevation="0" class="content-card">
      <v-card-text v-if="tarefas.length === 0" class="pa-4">
        <div class="text-center py-8">
          <v-icon size="40" color="grey-darken-2">mdi-clipboard-text-outline</v-icon>
          <p class="text-caption text-grey mt-3">Nenhuma tarefa</p>
          <v-btn size="small" color="white" class="mt-3" prepend-icon="mdi-plus">
            Criar Tarefa
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.content-card {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px !important;
}
</style>

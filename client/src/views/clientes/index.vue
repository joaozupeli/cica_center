<script lang="ts" setup>
import { ref } from 'vue';

const clientes = ref<any[]>([]);
const search = ref('');
</script>

<template>
  <v-container fluid class="pa-4">
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <h1 class="text-h6 text-white mb-1">
          <v-icon size="20" class="mr-2">mdi-account-group</v-icon>
          Clientes
        </h1>
        <p class="text-caption text-grey">Cadastro</p>
      </div>
      <v-btn size="small" color="white" prepend-icon="mdi-plus">
        Novo
      </v-btn>
    </div>

    <v-card color="grey-darken-4" elevation="0" class="content-card mb-4">
      <v-card-text class="pa-2">
        <v-text-field
          v-model="search"
          placeholder="Buscar..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          bg-color="grey-darken-3"
        />
      </v-card-text>
    </v-card>

    <v-card color="grey-darken-4" elevation="0" class="content-card">
      <v-card-text v-if="clientes.length === 0" class="pa-4">
        <div class="text-center py-8">
          <v-icon size="40" color="grey-darken-2">mdi-account-group-outline</v-icon>
          <p class="text-caption text-grey mt-3">Nenhum cliente</p>
          <v-btn size="small" color="white" class="mt-3" prepend-icon="mdi-plus">
            Cadastrar
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

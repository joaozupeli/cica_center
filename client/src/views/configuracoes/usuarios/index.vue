<script lang="ts" setup>
import { ref } from 'vue';

const usuarios = ref<any[]>([]);
const search = ref('');
</script>

<template>
  <v-container fluid class="pa-4">
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <v-btn variant="text" size="small" color="grey" class="mb-1 ml-n2" to="/configuracoes">
          <v-icon start size="16">mdi-arrow-left</v-icon>
          Voltar
        </v-btn>
        <h1 class="text-h6 text-white mb-1">
          <v-icon size="20" class="mr-2">mdi-account-cog</v-icon>
          Usuários
        </h1>
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
      <v-card-text v-if="usuarios.length === 0" class="pa-4">
        <div class="text-center py-8">
          <v-icon size="40" color="grey-darken-2">mdi-account-group-outline</v-icon>
          <p class="text-caption text-grey mt-3">Nenhum usuário</p>
          <v-btn size="small" color="white" class="mt-3" prepend-icon="mdi-plus">
            Adicionar
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

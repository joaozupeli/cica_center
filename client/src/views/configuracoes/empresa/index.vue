<script lang="ts" setup>
import { ref } from 'vue';

const empresa = ref({
  razaoSocial: '',
  nomeFantasia: '',
  cnpj: '',
  telefone: '',
  email: '',
});
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
          <v-icon size="20" class="mr-2">mdi-domain</v-icon>
          Empresa
        </h1>
      </div>
      <v-btn size="small" color="white" prepend-icon="mdi-content-save">
        Salvar
      </v-btn>
    </div>

    <v-card color="grey-darken-4" elevation="0" class="content-card">
      <v-card-title class="text-subtitle-2 text-white pa-3">
        Dados da Empresa
      </v-card-title>
      <v-divider color="grey-darken-3" />
      <v-card-text class="pa-3">
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="empresa.razaoSocial"
              label="Razão Social"
              variant="outlined"
              density="compact"
              bg-color="grey-darken-3"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="empresa.nomeFantasia"
              label="Nome Fantasia"
              variant="outlined"
              density="compact"
              bg-color="grey-darken-3"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="empresa.cnpj"
              label="CNPJ"
              variant="outlined"
              density="compact"
              bg-color="grey-darken-3"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="empresa.telefone"
              label="Telefone"
              variant="outlined"
              density="compact"
              bg-color="grey-darken-3"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="empresa.email"
              label="E-mail"
              variant="outlined"
              density="compact"
              bg-color="grey-darken-3"
            />
          </v-col>
        </v-row>
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

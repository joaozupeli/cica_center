<script lang="ts" setup>
const configSections = [
  { title: 'Usuários', icon: 'mdi-account-cog', to: '/configuracoes/usuarios' },
  { title: 'Empresa', icon: 'mdi-domain', to: '/configuracoes/empresa' },
  { title: 'Sistema', icon: 'mdi-cog', to: '/configuracoes' },
  { title: 'Backup', icon: 'mdi-cloud-upload', to: '/configuracoes' },
];
</script>

<template>
  <v-container fluid class="pa-4">
    <div class="mb-4">
      <h1 class="text-h6 text-white mb-1">
        <v-icon size="20" class="mr-2">mdi-cog</v-icon>
        Configurações
      </h1>
      <p class="text-caption text-grey">Sistema</p>
    </div>

    <v-row dense>
      <v-col v-for="section in configSections" :key="section.title" cols="6" md="4">
        <v-card 
          color="grey-darken-4" 
          elevation="0" 
          class="config-card"
          :to="section.to"
        >
          <v-card-text class="pa-3 d-flex align-center">
            <v-icon size="20" color="grey-lighten-1" class="mr-3">{{ section.icon }}</v-icon>
            <span class="text-caption text-white">{{ section.title }}</span>
            <v-spacer />
            <v-icon size="16" color="grey">mdi-chevron-right</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card color="grey-darken-4" elevation="0" class="content-card mt-4">
      <v-card-title class="text-subtitle-2 text-white pa-3">
        <v-icon size="16" class="mr-2">mdi-information-outline</v-icon>
        Sistema
      </v-card-title>
      <v-divider color="grey-darken-3" />
      <v-card-text class="pa-3">
        <div class="d-flex justify-space-between mb-2">
          <span class="text-caption text-grey">Versão</span>
          <span class="text-caption text-white">1.0.0</span>
        </div>
        <div class="d-flex justify-space-between">
          <span class="text-caption text-grey">Status</span>
          <v-chip size="x-small" color="success" variant="tonal">Online</v-chip>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.config-card {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px !important;
  cursor: pointer;
}

.content-card {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px !important;
}
</style>

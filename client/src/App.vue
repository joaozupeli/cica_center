<script setup lang="ts">
import { RouterView } from "vue-router";
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import AuthGuardModal from "@/components/shared/AuthGuardModal.vue";
</script>

<template>
  <v-app>
    <AppHeader />
    <v-main class="cica-main">
      <RouterView />
    </v-main>
    <AppFooter />
    <AuthGuardModal />
  </v-app>
</template>

<style scoped>
.cica-main {
  background-color: #000000;
  min-height: calc(100vh - 64px);
}
</style>

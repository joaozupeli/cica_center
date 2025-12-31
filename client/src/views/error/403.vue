<script lang="ts" setup>
// #region Import libs
import { useRouter } from "vue-router";
const router = useRouter();
// #endregion

// #region Declare functions
function voltarInicio() {
  router.push("/");
}
// #endregion
</script>

<template>
  <v-container class="fill-height">
    <v-row>
      <v-col cols="12" class="d-flex flex-column align-center">
        <span class="text-h1 font-weight-black pr-1 grey--text">
          4
          <v-icon color="primary" size="100"> mdi-emoticon-dead-outline </v-icon>
          3
        </span>
        <p class="text-h3 mt-5 mb-7 font-weight-black">Desculpe, página não encontrada!</p>
        <v-btn color="primary" variant="tonal" size="x-large" @click="voltarInicio()">
          <v-icon left> mdi-reply </v-icon>
          Retornar
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
// Example to implements
// await appStore.setNotify({ text: "Teste" });
// #region Import libs
import { useAppStore } from "@/stores/app";
import { computed } from "vue";
// #endregion

// #region Declare variables
const appStore = useAppStore();
const snackBar = computed(() => appStore.snackBar);
// #endregion

// #region Declare Functions
function handleSetNotifyFalse() {
  appStore.setNotifySnackBar({
    value: false,
    color: '',
    text: '',
    icon: '',
    timeout: -1,
  });
}
// #endregion
</script>

<template>
  <div class="text-center">
    <v-snackbar
      v-model="snackBar.value"
      :color="snackBar.color"
      :timeout="snackBar.timeout"
      location='top'
      style="z-index: 10000 !important"
      elevation="24"
      multi-line
    >
      <v-row>
        <v-col
          cols="2"
          align-self="center"
        >
          <v-icon
            dark
            left
            size="30"
            class="mr-2"
          >
            {{ snackBar.icon }}
          </v-icon>
        </v-col>
        <v-col
          cols="10"
          align-self="center"
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="snackBar.text" />
        </v-col>
      </v-row>
      <template #actions>
        <v-btn
          color="white"
          variant="text"
          dark
          @click="handleSetNotifyFalse"
        >
          <v-icon size="30">
            mdi-close
          </v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"

const propsAlert = defineProps<{
  options?: Alert
}>()

const modelValue: any = ref(true)

watch(
  () => propsAlert.options?.visible,
  () => {
    modelValue.value = propsAlert.options?.visible
  },
  { immediate: true }
)
</script>

<template>
  <v-dialog v-model="modelValue" persistent :width="propsAlert?.options?.width ?? 'auto'">
      <v-card :prepend-icon="propsAlert?.options?.icon ?? 'mdi-update'" style="color: black">
      <template #title>
        <span class="text-h5" style="color: black !important">
          {{ propsAlert?.options?.title ?? "Atenção" }}
        </span>
      </template>
      <template #prepend>
        <v-icon
          v-if="propsAlert?.options?.icon"
          :color="propsAlert?.options?.color"
          :icon="propsAlert?.options?.icon"
          :size="propsAlert?.options?.size"
        />
      </template>
      <template #text>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="propsAlert?.options?.text" />
      </template>
      <template #actions>
        <v-btn
          v-for="ac in propsAlert?.options?.actions"
          :key="ac.type"
          :class="ac.class ?? ''"
          :color="ac.color ?? 'primary'"
          :size="ac?.size ?? 'small'"
          :variant="ac?.variant ?? 'outlined'"
          @click="ac?.action?.()"
        >
          <v-icon v-if="ac?.icon" class="mr-2">
            {{ ac.icon }}
          </v-icon>
          {{ ac.text }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

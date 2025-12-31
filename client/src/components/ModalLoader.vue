<template>
  <v-dialog
    v-model="model"
    persistent
    :width="largura"
  >
    <v-list
      class="py-2"
      color="primary"
      elevation="12"
      rounded="lg"
    >
      <v-list-item>
        <template #title>
          <span>{{ mensagem }}</span>
        </template>

        <template
          v-if="icone"
          #prepend
        >
          <div class="pe-4">
            <v-icon
              color="primary"
              size="x-large"
            >
              {{ icone }}
            </v-icon>
          </div>
        </template>

        <template #append>
          <v-progress-circular
            color="primary"
            indeterminate="disable-shrink"
            size="35"
            width="4"
          />
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>
</template>

<script setup lang="ts">
const model = defineModel({
  type: Boolean,
  default: false,
  required: true,
})

defineProps({
  largura: {
    type: String,
    default: '450'
  },
  mensagem: {
    type: String,
    required: true,
  },
  icone: {
    type: String,
    required: false,
  }
})
</script>

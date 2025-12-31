<template>
  <v-dialog
    v-model="model"
    persistent
    :width="largura"
  >
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar density="compact">
          <v-toolbar-title>
            <b>{{ opcoes.titulo }}</b>
          </v-toolbar-title>

          <v-spacer />

          <v-icon
            :color="opcoes?.color || 'primary'"
            class="mr-3"
          >
            {{
              opcoes?.icone || 'mdi-alert-circle'
            }}
          </v-icon>
        </v-toolbar>
      </v-card-title>

      <v-card-text class="pa-1 px-4">
        <span v-html="opcoes.texto!" />
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-btn
          color="primary"
          size="small"
          variant="flat"
          @click="acao(opcoes.evento)"
        >
          <v-icon
            style="margin-bottom: -1px; margin-right: 2px"
            icon="mdi-check-circle-outline"
          />
          Confirmar
        </v-btn>
        <v-btn
          color="red"
          variant="flat"
          size="small"
          @click="acao()"
        >
          <v-icon
            style="margin-bottom: -1px; margin-right: 2px"
            icon="mdi-close-circle-outline"
          />
          Fechar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">

const model = defineModel({
  type: Boolean,
  default: false,
  required: true
})

const emit = defineEmits(["cancelar"])

defineProps({
  largura: {
    type: String,
    default: "500"
  },
  opcoes: {
    type: Object,
    default: () => {}
  }
})

const acao = (emitValue?: string) => {
  model.value = false

  if (emitValue) {
    emit((emitValue as any))
    return
  }

  emit("cancelar")
}
</script>

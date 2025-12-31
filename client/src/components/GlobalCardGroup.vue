<template>
  <v-card
    variant="outlined"
    color="primary"
    :disabled="disabled"
    :style="{
      padding: '16px 8px 16px 8px',
      backgroundColor: destacar ? 'var(--v-theme-surface)' : 'transparent',
    }"
    class="mt-2"
    :ripple="false"
  >
    <span v-if="title && !alternativo" class="title-card-group text-caption">
      {{ title }}
    </span>
    <v-card-title v-if="title && alternativo" class="pt-2 pb-4">
      <v-icon size="16" left> mdi-circle </v-icon>
      {{ title }}
    </v-card-title>
    <div class="mt-4">
      <v-row dense>
        <v-col>
          <slot />
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "GlobalCardGroup",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    alternativo: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    destacar: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style scoped>
.title-card-group {
  position: absolute;
  top: -10px;
  z-index: 1;
  line-height: 5;
}
</style>

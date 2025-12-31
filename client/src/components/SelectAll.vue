<script setup lang="ts">
// #region Import libs
import { computed } from "vue";
import type { SelectAll } from "./SelectAll";
// #endregion

// #region Declare variables
const propsSelectAll = defineProps<{
  options: SelectAll;
}>();

const model = defineModel<any[] | null>({ required: true });
const items = computed(() => propsSelectAll.options?.items || []);
const tudoSelecionado = computed(() => model?.value?.length === items.value.length);
const parcialSelecionado = computed(
  () => (model?.value?.length ?? 0) > 0 && !tudoSelecionado.value,
);
const icone = computed(() => {
  if (tudoSelecionado.value) return "mdi-close-box";
  if (parcialSelecionado.value) return "mdi-minus-box";
  return "mdi-checkbox-blank-outline";
});
// #endregion

// #region Declare functions
function selecionarTodos() {
  if (tudoSelecionado.value || parcialSelecionado.value) {
    model.value = [];
    propsSelectAll.options?.action?.();
  } else {
    model.value = items.value.map((el: any) => el[propsSelectAll.options?.itemValue]);
    propsSelectAll.options?.action?.();
  }
}
// #endregion
</script>

<template>
  <v-row dense>
    <v-col cols="12" class="py-1">
      <v-select
        :id="propsSelectAll.options?.id"
        v-model="model"
        :clearable="propsSelectAll.options?.clearable"
        :density="propsSelectAll.options?.density || 'compact'"
        :disabled="propsSelectAll.options?.disabled"
        :hide-details="propsSelectAll.options?.hideDetails"
        :items="items?.length ? items : []"
        :item-value="propsSelectAll.options?.itemValue"
        :item-title="propsSelectAll.options?.itemTitle"
        :label="propsSelectAll.options?.label"
        color="primary"
        :rules="propsSelectAll.options?.rules"
        :class="propsSelectAll.options?.required ? 'required' : ''"
        :multiple="
          propsSelectAll.options?.multiple === false ? propsSelectAll.options?.multiple : true
        "
        :variant="propsSelectAll.options?.variant || 'outlined'"
        @input="propsSelectAll.options?.action"
        @click:clear="propsSelectAll.options?.action?.()"
      >
        <template #prepend-item>
          <v-list v-ripple>
            <v-list-item>
              <v-list-item-action class="ml-2 cursor-pointer" @click="selecionarTodos()">
                <v-icon :color="model && model.length > 0 ? 'primary' : ''">
                  {{ icone }}
                </v-icon>
                <v-list-item-title class="ml-2 cursor-pointer">
                  SELECIONAR TODOS
                </v-list-item-title>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-divider class="mt-2" />
        </template>
        <template #selection="{ item, index }">
          <div v-if="model?.length === 1 && index === 0" class="card-title-span">
            <span class="text-span">
              {{ item.title }}
            </span>
          </div>
          <span v-if="items.length !== model?.length && index === 1"> VÁRIOS </span>
          <span v-if="items.length === model?.length && index === 1"> TODOS </span>
        </template>
      </v-select>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
.card-title-span {
  display: inline-flex;
  max-width: calc(100%);
}
.text-span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<script setup lang="ts">
// #region Import libs
import { validMask } from "@/plugins/maska.js";
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import DatePicker from "./DatePicker.vue";
import DateRange from "./DateRange.vue";
import type { Filter } from "./Filter.d.ts";
import SelectAll from "./SelectAll.vue";
// #endregion

// #region Declare variables
const propsT = defineProps<{
  options?: Filter;
}>();

const { mobile } = useDisplay();
const actions = ref(propsT.options?.actions);
const fields = ref(propsT.options?.fields);
const fieldsInMoreFilters = ref(propsT.options?.fieldsInMoreFilters);
const fieldsResetFilters = computed(() => propsT.options?.fieldsResetFilters);
const form: any = ref(null);
let expandido = ref(propsT.options?.defaultExpanded ?? false);

// Computed para verificar se há filtros preenchidos em fieldsInMoreFilters
const hasFiltersApplied = computed(() => {
  if (!fieldsInMoreFilters.value?.length) return false;

  return fieldsInMoreFilters.value.some((field: any) => {
    const value = field.model;

    // Verifica se o valor está preenchido
    if (value === null || value === undefined || value === "") return false;

    // Para arrays (múltiplos), verifica se tem itens
    if (Array.isArray(value)) return value.length > 0;

    // Para objetos, verifica se não está vazio
    if (typeof value === "object") return Object.keys(value).length > 0;

    // Para outros tipos, considera preenchido se não for falsy
    return true;
  });
});
const handleGetCols = (defaultCols: any) => {
  const { name } = useDisplay();
  // Obtenha informações sobre a tela (como o breakpoint atual)
  // const display = useDisplay();
  // Ajuste as colunas com base no tamanho da tela
  const cols = computed(() => {
    if (name.value === "xs") {
      return Math.max(+defaultCols, 12);
    } else if (name.value === "sm") {
      return Math.max(+defaultCols, 6);
    } else if (name.value === "md") {
      return Math.max(+defaultCols, 4);
    } else if (name.value === "lg") {
      return Math.max(+defaultCols, 1);
    } else if (name.value === "xl") {
      return Math.max(+defaultCols, 1);
    } else if (name.value === "xxl") {
      return Math.max(+defaultCols, 1); // Limite a 8 colunas em telas sm
    } else {
      return +defaultCols; // Use o valor padrão em telas maiores
    }
  });
  return String(cols.value);
};
// #endregion

// #region Declare functions
async function handleValidate(): Promise<boolean> {
  const { valid } = await form.value.validate();
  return valid;
}

async function handleMoreFilters() {
  return expandido.value === false
    ? (expandido.value = true)
    : (expandido.value = false);
}

async function handleValidateFilter(
  action: Function | undefined,
  validate?: boolean
) {
  if (validate) {
    const { valid } = await form.value.validate();
    if (valid) {
      fields.value?.forEach((element: any) => {
        if (element.validate !== undefined) {
          if (element.model) {
            element.validate = false;
            action?.();
          } else {
            element.validate = true;
          }
          setTimeout(() => {
            element.validate = false;
          }, 5);
        }
      });
    }
  } else {
    action?.();
  }
}
// #endregion
</script>

<template>
  <v-form ref="form" fast-fail @submit.prevent>
    <v-card>
      <v-card-title class="d-flex flex-row px-2">
        <div
          :class="
            mobile
              ? 'd-flex flex-column align-center'
              : 'd-flex flex-row align-center'
          "
        >
          <v-badge
            v-if="options?.moreFilters && fieldsInMoreFilters?.length"
            :model-value="hasFiltersApplied"
            color="error"
            dot
            offset-x="8"
            offset-y="8"
          >
            <v-btn
              color="primary"
              :class="mobile ? 'mr-2 mb-2' : 'mr-2'"
              :disabled="!fieldsInMoreFilters?.length"
              size="small"
              variant="outlined"
              @click="handleMoreFilters()"
            >
              <v-icon size="20">
                {{ expandido ? "mdi-filter-minus-outline" : "mdi-filter-plus" }}
              </v-icon>
            </v-btn>
          </v-badge>
          <div v-for="(ac, idx) in actions" :key="idx" class="align-center">
            <v-menu v-if="ac.type === 'v-menu'" transition="scale-transition">
              <template #activator="{ props }">
                <v-btn
                  :class="ac.class ?? ''"
                  :color="ac?.color ?? 'primary'"
                  :disabled="ac?.disabled"
                  :size="ac?.size ?? 'small'"
                  :variant="ac?.variant"
                  v-bind="props"
                >
                  <v-icon :class="ac.text ? 'mr-2' : ''">
                    {{ ac?.icon }}
                  </v-icon>
                  {{ ac?.text }}
                </v-btn>
              </template>
              <v-list density="compact">
                <v-list-item
                  v-for="(item, i) in ac?.list"
                  :key="i"
                  :value="item"
                  @click="item?.action"
                >
                  <template #prepend>
                    <v-icon :color="item.color" :icon="item.icon" />
                  </template>
                  <v-list-item-title class="font-size-600">
                    {{ item.text }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-btn
              v-if="ac.type === 'v-btn'"
              :class="
                ac.class
                  ? ac.class
                  : mobile
                    ? idx === 0
                      ? 'mr-2'
                      : 'mt-2 mr-2'
                    : idx === 0
                      ? ''
                      : 'ml-2'
              "
              :color="ac.color ?? 'primary'"
              :size="ac?.size ?? 'small'"
              :slim="ac?.slim"
              :disabled="
                (ac.icon === 'mdi-filter-remove' && !fieldsResetFilters) ||
                ac?.disabled
              "
              :variant="ac?.variant ?? 'outlined'"
              @click="
                (ac.icon === 'mdi-filter-remove' && fieldsResetFilters
                  ? (expandido = false)
                  : '',
                ac.validate
                  ? handleValidateFilter(ac.action, ac?.validate)
                  : ac?.action?.())
              "
            >
              <v-icon size="20" :class="ac.text ? 'mr-2' : ''">
                {{ ac.icon }}
              </v-icon>
              {{ ac.text }}
            </v-btn>
          </div>
        </div>
        <div style="width: 100% !important" :class="!mobile ? 'ml-2' : ''">
          <v-row dense>
            <v-col
              v-for="(item, i) in fields"
              :key="i"
              :cols="handleGetCols(item.cols)"
            >
              <v-text-field
                v-if="item.type === 'v-text-field'"
                :id="item.id"
                v-model="item.model"
                v-maska="item.mascara ? validMask(item.mascara) : null"
                v-moeda="item?.moeda || undefined"
                :append-inner-icon="item.appendInnerIcon"
                :bg-color="item.bgColor"
                :color="item.color"
                :density="item.density"
                :disabled="item.disabled"
                :clearable="item.clearable"
                :hide-details="
                  item.hideDetails ??
                  !form?.errors?.find((el: any) => el.id == item.id)
                "
                :label="item.label"
                :placeholder="item.placeholder"
                :prefix="item.prefix"
                :suffix="item.sufixo"
                :rules="item.rules"
                :variant="item.variant"
                @keydown.enter="item?.action?.()"
                @click:clear="item.action?.() as any"
              />
              <v-select
                v-if="item.type === 'v-select'"
                :id="item.id"
                v-model="item.model"
                :append-inner-icon="item.appendInnerIcon"
                :bg-color="item.bgColor"
                :color="item.color"
                :density="item.density"
                :disabled="item.disabled"
                :clearable="item.clearable"
                :hide-details="
                  item.hideDetails ??
                  !form?.errors?.find((el: any) => el.id == item.id)
                "
                :item-value="item.itemValue"
                :item-title="item.itemTitle"
                :single-line="item.singleLine"
                :items="item.items"
                :label="item.label"
                :multiple="item.multiple"
                :placeholder="item.placeholder"
                :prefix="item.prefix"
                :rules="item.rules"
                :variant="item.variant"
                @update:model-value="item.action as any"
                @click:clear="item.action as any"
              />
              <SelectAll
                v-if="item.type === 'v-select-all'"
                v-model="item.model as any"
                :options="{
                  id: item.id,
                  rules: item.rules,
                  hideDetails:
                    item.hideDetails ??
                    !form?.errors?.find((el: any) => el.id == item.id),
                  itemTitle: item.itemTitle!,
                  itemValue: item.itemValue!,
                  clearable: item.clearable,
                  density: item.density,
                  disabled: item.disabled,
                  items: item.items!,
                  label: item.label,
                  required: item.required,
                  multiple: item.multiple,
                  variant: item.variant,
                  action: item.action,
                }"
                @update:model-value="item.action as any"
              />
              <v-autocomplete
                v-if="item.type === 'v-autocomplete'"
                :id="item.id"
                v-model="item.model"
                :append-inner-icon="item.appendInnerIcon"
                :bg-color="item.bgColor"
                :color="item.color"
                :density="item.density"
                :disabled="item.disabled"
                :clearable="item.clearable"
                :hide-details="
                  item.hideDetails ??
                  !form?.errors?.find((el: any) => el.id == item.id)
                "
                :item-value="item.itemValue"
                :item-title="item.itemTitle"
                :items="item.items"
                :label="item.label"
                :multiple="item.multiple"
                :placeholder="item.placeholder"
                :prefix="item.prefix"
                :rules="item.rules"
                :variant="item.variant"
                @update:model-value="item.action as any"
                @click:clear="item.action as any"
              />
              <v-btn
                v-if="item.type === 'v-btn'"
                :block="item.block"
                :color="item.color"
                :disabled="item.disabled"
                :size="item.size ?? 'small'"
                :variant="item.variantBtn"
                @click="item?.action"
              >
                {{ item.label }}
              </v-btn>

              <DatePicker
                v-if="item.type === 'v-date-picker'"
                v-model="item.model"
                :options="{
                  id: item.id,
                  variant: item.variant,
                  density: item.density,
                  label: item.label,
                  rules: item.rules,
                  placeHolder: item.placeholder,
                  hideDetails: item.hideDetails,
                  autofocus: item.autofocus,
                  clearable: item.clearable,
                  disabled: item.disabled,
                  readOnly: item.readOnly,
                  required: item.required,
                  singleLine: item.singleLineDatePicker,
                  controlarDia: item.controlarDiaDatePicker,
                  btnNow: item.btnNowDatePicker,
                  rounded: item.rounded,
                  dataCy: item.dataCy,
                  min: item.minDate,
                  max: item.maxDate,
                  type: item.typeDatePicker,
                }"
                @input="item.model = $event"
              />
              <DateRange
                v-if="item.type === 'v-date-range'"
                v-model="item.model"
                :options="{
                  id: item.id,
                  variant: item.variant,
                  density: item.density,
                  label: item.label,
                  rules: item.rules,
                  placeHolder: item.placeholder,
                  hideDetails: item.hideDetails,
                  required: item.required,
                  autofocus: item.autofocus,
                  clearable: item.clearable,
                  disabled: item.disabled,
                  readOnly: item.readOnly,
                  singleLine: item.singleLineDatePicker,
                  btnNow: item.btnNowDatePicker,
                  rounded: item.rounded,
                  dataCy: item.dataCy,
                  min: item.minDate,
                  max: item.maxDate,
                  type: item.typeDatePicker,
                }"
                @input="item.model = $event"
              />
              <v-checkbox
                v-if="item.type === 'v-checkbox'"
                :id="item.id"
                v-model="item.model"
                :color="item.color ? item.color : 'primary'"
                :true-value="item.trueValue"
                :false-value="item.falseValue"
                :ripple="item.ripple"
                :label="item.label"
                style="margin-top: 0px; padding-top: 0px"
                density="compact"
              />
            </v-col>
          </v-row>
        </div>
      </v-card-title>
      <v-divider v-if="options?.moreFilters" />
      <v-card-text v-if="options?.moreFilters && expandido" class="px-2 py-2">
        <div style="width: 100% !important">
          <v-row dense>
            <v-col
              v-for="(item, i) in fieldsInMoreFilters"
              :key="i"
              :cols="handleGetCols(item.cols)"
            >
              <v-text-field
                v-if="item.type === 'v-text-field'"
                :id="item.id"
                v-model="item.model"
                v-maska="item.mascara ? validMask(item.mascara) : null"
                v-moeda="item?.moeda || undefined"
                :append-inner-icon="item.appendInnerIcon"
                :bg-color="item.bgColor"
                :color="item.color"
                :density="item.density"
                :disabled="item.disabled"
                :clearable="item.clearable"
                :hide-details="
                  item.hideDetails ??
                  !form?.errors?.find((el: any) => el.id == item.id)
                "
                :label="item.label"
                :placeholder="item.placeholder"
                :prefix="item.prefix"
                :rules="item.rules"
                :variant="item.variant"
                @keydown.enter="item?.action?.()"
                @click:clear="item.action?.() as any"
              />
              <v-select
                v-if="item.type === 'v-select'"
                :id="item.id"
                v-model="item.model"
                :append-inner-icon="item.appendInnerIcon"
                :bg-color="item.bgColor"
                :color="item.color"
                :density="item.density"
                :disabled="item.disabled"
                :clearable="item.clearable"
                :hide-details="
                  item.hideDetails ??
                  !form?.errors?.find((el: any) => el.id == item.id)
                "
                :item-value="item.itemValue"
                :item-title="item.itemTitle"
                :items="item.items"
                :label="item.label"
                :multiple="item.multiple"
                :placeholder="item.placeholder"
                :prefix="item.prefix"
                :rules="item.rules"
                :variant="item.variant"
                @update:model-value="item.action as any"
                @click:clear="item.action as any"
              />
              <SelectAll
                v-if="item.type === 'v-select-all'"
                v-model="item.model as any"
                :options="{
                  id: item.id,
                  rules: item.rules,
                  hideDetails:
                    item.hideDetails ??
                    !form?.errors?.find((el: any) => el.id == item.id),
                  itemTitle: item.itemTitle!,
                  itemValue: item.itemValue!,
                  clearable: item.clearable,
                  density: item.density,
                  disabled: item.disabled,
                  items: item.items!,
                  label: item.label,
                  required: item.required,
                  multiple: item.multiple,
                  variant: item.variant,
                  action: item.action,
                }"
                @update:model-value="item.action as any"
              />
              <v-autocomplete
                v-if="item.type === 'v-autocomplete'"
                :id="item.id"
                v-model="item.model"
                :append-inner-icon="item.appendInnerIcon"
                :bg-color="item.bgColor"
                :color="item.color"
                :density="item.density"
                :disabled="item.disabled"
                :clearable="item.clearable"
                :hide-details="
                  item.hideDetails ??
                  !form?.errors?.find((el: any) => el.id == item.id)
                "
                :item-value="item.itemValue"
                :item-title="item.itemTitle"
                :items="item.items"
                :label="item.label"
                :multiple="item.multiple"
                :placeholder="item.placeholder"
                :prefix="item.prefix"
                :rules="item.rules"
                :variant="item.variant"
                @update:model-value="item.action as any"
                @click:clear="item.action as any"
              />
              <v-btn
                v-if="item.type === 'v-btn'"
                :block="item.block"
                :color="item.color"
                :disabled="item.disabled"
                :size="item.size"
                :variant="item.variantBtn"
                @input="handleValidate() ?? item?.action"
              >
                {{ item.label }}
              </v-btn>

              <Usuario
                v-if="item.type === 'F3-usuario'"
                v-model="item.model as any"
                :options="{
                  rules: item.rules,
                  hideDetails: item.hideDetails,
                  id: item.id,
                  label: item.label,
                  semPlaceholder: item.semPlaceholder,
                  disabled: item.disabled,
                  clearable: item.clearable,
                  required: item.required,
                }"
                @update:model-value="item.action as any"
              />

              <DatePicker
                v-if="item.type === 'v-date-picker'"
                v-model="item.model"
                :options="{
                  id: item.id,
                  variant: item.variant,
                  density: item.density,
                  label: item.label,
                  rules: item.rules,
                  placeHolder: item.placeholder,
                  hideDetails: item.hideDetails,
                  autofocus: item.autofocus,
                  clearable: item.clearable,
                  disabled: item.disabled,
                  readOnly: item.readOnly,
                  singleLine: item.singleLineDatePicker,
                  controlarDia: item.controlarDiaDatePicker,
                  btnNow: item.btnNowDatePicker,
                  required: item.required,
                  rounded: item.rounded,
                  dataCy: item.dataCy,
                  min: item.minDate,
                  max: item.maxDate,
                  type: item.typeDatePicker,
                }"
                @input="item.model = $event"
              />
              <DateRange
                v-if="item.type === 'v-date-range'"
                v-model="item.model"
                :options="{
                  id: item.id,
                  variant: item.variant,
                  density: item.density,
                  label: item.label,
                  rules: item.rules,
                  placeHolder: item.placeholder,
                  hideDetails: item.hideDetails,
                  autofocus: item.autofocus,
                  clearable: item.clearable,
                  disabled: item.disabled,
                  readOnly: item.readOnly,
                  singleLine: item.singleLineDatePicker,
                  btnNow: item.btnNowDatePicker,
                  rounded: item.rounded,
                  dataCy: item.dataCy,
                  required: item.required,
                  min: item.minDate,
                  max: item.maxDate,
                  type: item.typeDatePicker,
                }"
                @input="item.model = $event"
              />
              <v-checkbox
                v-if="item.type === 'v-checkbox'"
                :id="item.id"
                v-model="item.model"
                :color="item.color ? item.color : 'primary'"
                :true-value="item.trueValue"
                :false-value="item.falseValue"
                :ripple="item.ripple"
                :label="item.label"
                :hide-details="item.hideDetails"
                class="ml-2"
                style="margin-top: 0px; padding-top: 0px"
                density="compact"
              />
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<style lang="scss">
.filtro-expand {
  .v-expansion-panel__header {
    padding: 8px !important;
  }
}
.v-expansion-panel-content__wrap {
  padding: 0 !important;
  padding-bottom: 4px !important;
}
</style>

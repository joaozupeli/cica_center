<script setup lang="ts">
// #region Import libs
// import SelectLink from "@/components/SelectLink.vue"; // Arquivo não existe
import { validMask } from "@/plugins/maska";
import { computed, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import DatePicker from "./DatePicker.vue";
import DateRange from "./DateRange.vue";
import type { PageType } from "./Page";
import SelectAll from "./SelectAll.vue";
// #endregion

// #region Declare variables
const propsT = defineProps<{
  options?: PageType;
}>();

const moreOptions = ref({ ...propsT.options?.form?.moreOptions });
const modeController = ref(propsT.options?.modeController);
const actions = ref(propsT.options?.form?.actions);
const toolbarActions = ref(propsT.options?.form?.toolbarActions);
const toolbarButtons = ref(propsT.options?.form?.toolbarButtons);
const fields = computed(() => propsT.options?.form?.fields);
const fieldsDetails = computed(() => propsT.options?.form?.fieldsDetails);
const form: any = ref(null);
const idsVisibleActions = ref(propsT.options?.idsVisibleActions);
const hideMsgCamposObrigatorios = ref(propsT.options?.hideMsgCamposObrigatorios || false);
let moreOptionsVisible = computed(() => propsT.options?.form?.moreOptions?.visible);
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
      return Math.max(+defaultCols, 1);
    } else {
      return +defaultCols; // Use o valor padrão em telas maiores
    }
  });
  return String(cols.value);
};
// #endregion

// #region Declare functions
async function handleValidate(action: Function | undefined, validate?: boolean) {
  if (validate) {
    const { valid } = await form.value.validate();
    if (valid) {
      action?.();
    }
  } else {
    action?.();
  }
}
// #endregion

// #region Watch
watch(
  () => propsT.options?.modeController,
  () => {
    modeController.value = propsT.options?.modeController;
    actions.value = propsT.options?.form?.actions;
    idsVisibleActions.value = propsT.options?.idsVisibleActions;
  },
  { deep: true },
);

watch(
  () => propsT?.options?.form?.actions,
  () => {
    actions.value = propsT.options?.form?.actions;
  },
  { deep: true },
);
// #endregion
</script>

<template>
  <v-container class="pa-0" fluid>
    <v-row
      v-if="propsT.options?.title"
      class="bg-grey-lighten-4 justify-center px-4 ml-1 mx-0 pt-1"
      dense
    >
      <v-col :cols="propsT.options?.cols" class="">
        <span class="text-h5 font-weight-regular">
          <b>{{ propsT.options?.title }}</b> {{ propsT.options?.subtitle ? "| " : "" }}
        </span>
        <span class="text-subtitle-1 font-weight-medium">{{ propsT.options?.subtitle }}</span>
      </v-col>
    </v-row>

    <v-row class="mt-1 mx-2 justify-center" dense>
      <v-col v-show="propsT.options?.mode === 'list'" :cols="propsT.options?.cols">
        <slot name="list" />
      </v-col>

      <v-col v-if="propsT.options?.mode === 'form'" :cols="propsT.options?.cols">
        <slot name="form">
          <v-card v-if="propsT.options?.form?.visible" elevation="2">
            <v-card-title class="card-title-span d-flex flex-row px-3 py-1">
              <v-btn
                v-for="(item, i) in toolbarActions"
                :key="i"
                :class="item.class ?? ''"
                :color="item.color ?? 'primary'"
                :size="item?.size"
                :disabled="item?.disabled"
                :variant="item?.variant ?? 'outlined'"
                :title="item?.title"
                @click="item?.action"
              >
                <v-icon size="20" dark>
                  {{ item?.icon ?? "mdi-arrow-left-bold" }}
                </v-icon>
              </v-btn>
              <span class="text-span text-h6 font-weight-regular">
                <b>{{ propsT.options?.form?.description }}</b>
              </span>
              <v-spacer />

              <span
                v-for="(item, i) in toolbarButtons"
                :key="i"
                style="display: flex; align-items: center"
              >
                <v-btn
                  v-if="item.visible ?? true"
                  :class="item?.class ?? 'mt-1'"
                  :color="item?.color ?? 'primary'"
                  :size="item?.size ?? 'small'"
                  :disabled="item?.disabled"
                  :variant="item?.variant ?? 'outlined'"
                  @click="
                    item?.validate ? handleValidate(item?.action, item?.validate) : item?.action?.()
                  "
                >
                  <v-icon class="mr-2">
                    {{ item.icon }}
                  </v-icon>
                  {{ item.text }}
                </v-btn>
              </span>

              <v-menu
                v-if="moreOptionsVisible && !modeController?.insert"
                transition="scale-transition"
              >
                <template #activator="{ props }">
                  <v-btn
                    elevation="0"
                    :color="moreOptions?.color"
                    title="Mais Opções"
                    icon
                    :text="moreOptions?.text"
                    :variant="moreOptions?.variant as any"
                    :size="moreOptions?.size ?? '36'"
                    v-bind="props"
                  >
                    <v-icon size="24"> mdi-dots-vertical </v-icon>
                  </v-btn>
                </template>

                <v-list density="compact" class="py-0">
                  <span v-for="(item, i) in moreOptions?.actions" :key="i">
                    <v-list-item
                      v-if="item?.visible ?? true"
                      :value="item"
                      :disabled="!!item.disabled"
                      slim
                      style="height: 45px; border-bottom: 1px solid #eeeeee"
                      @click="item?.action?.()"
                    >
                      <div class="d-flex justify-start fill-height align-center">
                        <div class="mr-3">
                          <v-icon :color="item.color || 'primary'">
                            {{ item.icon }}
                          </v-icon>
                        </div>
                        <v-list-item-title class="mt-1 py-2">
                          {{ item.text }}
                        </v-list-item-title>
                      </div>
                    </v-list-item>
                  </span>
                </v-list>
              </v-menu>
            </v-card-title>

            <v-divider />

            <v-card-text :class="options?.class ?? ''">
              <slot name="formContent" />
              <v-form v-if="fields?.length" ref="form" fast-fail @submit.prevent>
                <v-row dense>
                  <v-col
                    v-for="(item, i) in fields.filter((el: any) =>
                      el.visible !== undefined ? el.visible : true,
                    )"
                    :key="i"
                    :cols="handleGetCols(item.cols)"
                  >
                    <v-text-field
                      v-if="item.type === 'v-text-field'"
                      :id="item.id"
                      v-model="item.model"
                      v-maska="item.mascara ? validMask(item.mascara) : undefined"
                      v-moeda="item?.moeda || undefined"
                      :type="item.typeField"
                      :class="item.required ? 'required' : ''"
                      :append-inner-icon="item.appendInnerIcon"
                      :bg-color="item.bgColor"
                      :clearable="item.clearable && modeController?.view ? false : item.clearable"
                      :color="item.color ?? 'primary'"
                      :density="item.density"
                      :disabled="item.disabled !== undefined ? item.disabled : modeController?.view"
                      :hide-details="
                        item.hideDetails ?? !form?.errors?.find((el: any) => el.id == item.id)
                      "
                      :label="item.label"
                      :placeholder="item.placeholder"
                      :prefix="item.prefix"
                      :suffix="item.suffix"
                      :rules="item.rules"
                      :variant="item.variant ?? 'filled'"
                      @input="handleValidate(item?.action, item?.validate)"
                    />
                    <v-textarea
                      v-if="item.type === 'v-textarea' && (item?.visible ?? true)"
                      :id="item.id"
                      v-model="item.model"
                      :type="item.typeField"
                      :append-inner-icon="item.appendInnerIcon"
                      :bg-color="item.bgColor"
                      :clearable="item.clearable"
                      :color="item.color ?? 'primary'"
                      :density="item.density"
                      :disabled="item.disabled !== undefined ? item.disabled : modeController?.view"
                      :hide-details="
                        item.hideDetails ?? !form?.errors?.find((el: any) => el.id == item.id)
                      "
                      :label="item.label"
                      :placeholder="item.placeholder"
                      :prefix="item.prefix"
                      :rules="item.rules"
                      :variant="item.variant ?? 'filled'"
                      @input="handleValidate(item?.action, item?.validate)"
                    />
                    <v-select
                      v-if="item.type === 'v-select'"
                      :id="item.id"
                      v-model="item.model"
                      :append-inner-icon="item.appendInnerIcon"
                      :bg-color="item.bgColor"
                      :clearable="modeController?.view ? false : item.clearable"
                      :color="item.color"
                      :class="item.required ? 'required' : ''"
                      :density="item.density"
                      :disabled="item.disabled !== undefined ? item.disabled : modeController?.view"
                      :hide-details="
                        item.hideDetails ?? !form?.errors?.find((el: any) => el.id == item.id)
                      "
                      :item-value="item?.itemValue"
                      :item-title="item?.itemTitle"
                      :items="item.items"
                      :label="item.label"
                      :multiple="item.multiple"
                      :placeholder="item.placeholder"
                      :prefix="item.prefix"
                      :rules="item.rules"
                      :variant="item.variant"
                      @input="handleValidate(item?.action, item?.validate)"
                    >
                      <template v-if="item.append" #append-inner>
                        <v-tooltip location="bottom">
                          <template #activator="{ props }">
                            <v-icon v-bind="props" icon="mdi-help-circle-outline"></v-icon>
                          </template>
                          <!-- eslint-disable-next-line vue/no-v-html -->
                          <span v-html="item.appendMessage" />
                        </v-tooltip>
                      </template>
                    </v-select>
                    <SelectAll
                      v-if="item.type === 'v-select-all'"
                      v-model="item.model as any"
                      :options="{
                        id: item.id,
                        rules: item.rules,
                        hideDetails:
                          item.hideDetails ?? !form?.errors?.find((el: any) => el.id == item.id),
                        itemTitle: item.itemTitle!,
                        itemValue: item.itemValue!,
                        clearable: item.clearable,
                        required: item.required,
                        density: item.density,
                        disabled: item.disabled,
                        items: item.items!,
                        label: item.label,
                        multiple: item.multiple,
                        variant: item.variant,
                        action: item.action,
                      }"
                    />
                    <v-autocomplete
                      v-if="item.type === 'v-autocomplete'"
                      :id="item.id"
                      v-model="item.model"
                      :append-inner-icon="item.appendInnerIcon"
                      :bg-color="item.bgColor"
                      :clearable="modeController?.view ? false : item.clearable"
                      :color="item.color"
                      :density="item.density"
                      :class="item.required ? 'required' : ''"
                      :disabled="item.disabled !== undefined ? item.disabled : modeController?.view"
                      :hide-details="
                        item.hideDetails ?? !form?.errors?.find((el: any) => el.id == item.id)
                      "
                      :item-value="item?.itemValue"
                      :item-title="item?.itemTitle"
                      :items="item.items"
                      :label="item.label"
                      :multiple="item.multiple"
                      :placeholder="item.placeholder"
                      :prefix="item.prefix"
                      :rules="item.rules"
                      :variant="item.variant"
                      @input="handleValidate(item?.action, item?.validate)"
                    />
                    <select-link
                      v-if="item.type === 'v-select-link'"
                      :id="item.id"
                      :model-value="item.model as any"
                      :append-inner-icon="item.appendInnerIcon"
                      :bg-color="item.bgColor"
                      :clearable="modeController?.view ? false : item.clearable"
                      :color="item.color"
                      :density="item.density"
                      :disabled="item.disabled !== undefined ? item.disabled : modeController?.view"
                      :hide-details="
                        item.hideDetails ?? !form?.errors?.find((el: any) => el.id == item.id)
                      "
                      :rota="item.rota"
                      :item-value="item?.itemValue"
                      :item-title="item?.itemTitle"
                      :items="item.items"
                      :label="item.label"
                      :multiple="item.multiple"
                      :placeholder="item.placeholder"
                      :prefix="item.prefix"
                      :required="item.required"
                      :rules="item.rules"
                      :variant="item.variant"
                      @atualizar="item.atualizar"
                      @update:model-value="($event: any) => (item.model = $event)"
                    />
                    <v-btn
                      v-if="item.type === 'v-btn'"
                      :block="item.block"
                      :color="item.color"
                      :disabled="item.disabled !== undefined ? item.disabled : modeController?.view"
                      :size="item.size ?? 'small'"
                      :variant="item.variant as any"
                      @click="handleValidate(item?.action, item?.validate)"
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
                        required: item.required,
                        hideDetails:
                          item.hideDetails ?? !form?.errors?.find((el: any) => el.id == item.id),
                        autofocus: item.autofocus,
                        clearable: modeController?.view ? false : item.clearable,
                        disabled:
                          item.disabled !== undefined ? item.disabled : modeController?.view,
                        readOnly: item.readOnly,
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
                        hideDetails:
                          item.hideDetails ?? !form?.errors?.find((el: any) => el.id == item.id),
                        autofocus: item.autofocus,
                        clearable: modeController?.view ? false : item.clearable,
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
                      :color="
                        item.color ? item.color : modeController?.view ? '#171717' : 'primary'
                      "
                      :true-value="item.trueValue"
                      :false-value="item.falseValue"
                      :hide-details="
                        item.hideDetails ?? !form?.errors?.find((el: any) => el.id == item.id)
                      "
                      class="input-edit-checkbox"
                      density="compact"
                      :style="
                        modeController?.view ? 'cursor: pointer !important; opacity: 0.5;' : ''
                      "
                      :ripple="item.ripple"
                      :label="item.label"
                      :readonly="item.disabled !== undefined ? item.disabled : modeController?.view"
                    />
                    <component
                      :is="item.componenteDinamico"
                      v-if="item.type === 'componente-dinamico'"
                      v-model="item.model"
                      v-bind="
                        item.componenteDinamicoProps &&
                        item.componenteDinamicoProps(item, i, item.model)
                      "
                      v-on="item.listeners"
                      @update:model-value="item.action ? item.action(item) : undefined"
                    />
                  </v-col>
                </v-row>
              </v-form>
              <v-row v-if="fieldsDetails && fieldsDetails.length" dense class="mt-3">
                <template
                  v-for="(section, sectionIndex) in fieldsDetails"
                  :key="'section-' + sectionIndex"
                >
                  <v-card flat width="100%" class="pa-0 ma-1">
                    <v-card-title class="pa-0 ma-0">
                      <span class="text-subtitle-1 font-weight-regular" style="color: #00000099">
                        <b>{{ section.title || "Detalhes" }}</b>
                      </span>
                      <v-spacer />
                    </v-card-title>
                    <v-card-text class="pa-0 mx-0 mt-1">
                      <v-form :ref="'form' + sectionIndex" fast-fail @submit.prevent>
                        <v-row dense>
                          <!-- Verifique se a função handleGetCols está retornando um valor válido -->
                          <v-col
                            v-for="(item, i) in (section.fields ?? []).filter(
                              (el: any) => el.visible !== false,
                            )"
                            :key="item.id || i"
                            :cols="handleGetCols(item.cols)"
                          >
                            <v-text-field
                              v-if="item.type === 'v-text-field'"
                              :id="item.id"
                              v-model="item.model"
                              v-maska="item.mascara ? validMask(item.mascara) : undefined"
                              v-moeda="item?.moeda || undefined"
                              :type="item.typeField"
                              :class="item.required ? 'required' : ''"
                              :append-inner-icon="item.appendInnerIcon"
                              :bg-color="item.bgColor"
                              :clearable="
                                item.clearable && modeController?.view ? false : item.clearable
                              "
                              :color="item.color ?? 'primary'"
                              :density="item.density"
                              :disabled="
                                item.disabled !== undefined ? item.disabled : modeController?.view
                              "
                              :hide-details="
                                item.hideDetails ??
                                !form?.errors?.find((el: any) => el.id == item.id)
                              "
                              :label="item.label"
                              :placeholder="item.placeholder"
                              :prefix="item.prefix"
                              :suffix="item.suffix"
                              :rules="item.rules"
                              :variant="item.variant ?? 'filled'"
                              @input="handleValidate(item?.action, item?.validate)"
                            />
                            <v-textarea
                              v-if="item.type === 'v-textarea' && (item?.visible ?? true)"
                              :id="item.id"
                              v-model="item.model"
                              :type="item.typeField"
                              :append-inner-icon="item.appendInnerIcon"
                              :bg-color="item.bgColor"
                              :clearable="item.clearable"
                              :color="item.color ?? 'primary'"
                              :density="item.density"
                              :disabled="
                                item.disabled !== undefined ? item.disabled : modeController?.view
                              "
                              :hide-details="
                                item.hideDetails ??
                                !form?.errors?.find((el: any) => el.id == item.id)
                              "
                              :label="item.label"
                              :placeholder="item.placeholder"
                              :prefix="item.prefix"
                              :rules="item.rules"
                              :variant="item.variant ?? 'filled'"
                              @input="handleValidate(item?.action, item?.validate)"
                            />
                            <v-select
                              v-if="item.type === 'v-select'"
                              :id="item.id"
                              v-model="item.model"
                              :append-inner-icon="item.appendInnerIcon"
                              :bg-color="item.bgColor"
                              :clearable="modeController?.view ? false : item.clearable"
                              :color="item.color"
                              :class="item.required ? 'required' : ''"
                              :density="item.density"
                              :disabled="
                                item.disabled !== undefined ? item.disabled : modeController?.view
                              "
                              :hide-details="
                                item.hideDetails ??
                                !form?.errors?.find((el: any) => el.id == item.id)
                              "
                              :item-value="item?.itemValue"
                              :item-title="item?.itemTitle"
                              :items="item.items"
                              :label="item.label"
                              :multiple="item.multiple"
                              :placeholder="item.placeholder"
                              :prefix="item.prefix"
                              :rules="item.rules"
                              :variant="item.variant"
                              @input="handleValidate(item?.action, item?.validate)"
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
                                required: item.required,
                                density: item.density,
                                disabled: item.disabled,
                                items: item.items!,
                                label: item.label,
                                multiple: item.multiple,
                                variant: item.variant,
                                action: item.action,
                              }"
                            />
                            <v-autocomplete
                              v-if="item.type === 'v-autocomplete'"
                              :id="item.id"
                              v-model="item.model"
                              :append-inner-icon="item.appendInnerIcon"
                              :bg-color="item.bgColor"
                              :clearable="modeController?.view ? false : item.clearable"
                              :color="item.color"
                              :density="item.density"
                              :class="item.required ? 'required' : ''"
                              :disabled="
                                item.disabled !== undefined ? item.disabled : modeController?.view
                              "
                              :hide-details="
                                item.hideDetails ??
                                !form?.errors?.find((el: any) => el.id == item.id)
                              "
                              :item-value="item?.itemValue"
                              :item-title="item?.itemTitle"
                              :items="item.items"
                              :label="item.label"
                              :multiple="item.multiple"
                              :placeholder="item.placeholder"
                              :prefix="item.prefix"
                              :rules="item.rules"
                              :variant="item.variant"
                              @input="handleValidate(item?.action, item?.validate)"
                            />
                            <select-link
                              v-if="item.type === 'v-select-link'"
                              :id="item.id"
                              :model-value="item.model as any"
                              :append-inner-icon="item.appendInnerIcon"
                              :bg-color="item.bgColor"
                              :clearable="modeController?.view ? false : item.clearable"
                              :color="item.color"
                              :density="item.density"
                              :disabled="
                                item.disabled !== undefined ? item.disabled : modeController?.view
                              "
                              :hide-details="
                                item.hideDetails ??
                                !form?.errors?.find((el: any) => el.id == item.id)
                              "
                              :rota="item.rota"
                              :item-value="item?.itemValue"
                              :item-title="item?.itemTitle"
                              :items="item.items"
                              :label="item.label"
                              :multiple="item.multiple"
                              :placeholder="item.placeholder"
                              :prefix="item.prefix"
                              :required="item.required"
                              :rules="item.rules"
                              :variant="item.variant"
                              @atualizar="item.atualizar"
                              @update:model-value="($event: any) => (item.model = $event)"
                            />
                            <v-btn
                              v-if="item.type === 'v-btn'"
                              :block="item.block"
                              :color="item.color"
                              :disabled="
                                item.disabled !== undefined ? item.disabled : modeController?.view
                              "
                              :size="item.size ?? 'small'"
                              :variant="item.variant as any"
                              @click="handleValidate(item?.action, item?.validate)"
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
                                required: item.required,
                                hideDetails:
                                  item.hideDetails ??
                                  !form?.errors?.find((el: any) => el.id == item.id),
                                autofocus: item.autofocus,
                                clearable: modeController?.view ? false : item.clearable,
                                disabled:
                                  item.disabled !== undefined
                                    ? item.disabled
                                    : modeController?.view,
                                readOnly: item.readOnly,
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
                                hideDetails:
                                  item.hideDetails ??
                                  !form?.errors?.find((el: any) => el.id == item.id),
                                autofocus: item.autofocus,
                                clearable: modeController?.view ? false : item.clearable,
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
                              :color="
                                item.color
                                  ? item.color
                                  : modeController?.view
                                    ? '#171717'
                                    : 'primary'
                              "
                              :true-value="item.trueValue"
                              :false-value="item.falseValue"
                              :hide-details="
                                item.hideDetails ??
                                !form?.errors?.find((el: any) => el.id == item.id)
                              "
                              :style="
                                modeController?.view
                                  ? 'cursor: pointer !important; opacity: 0.5;'
                                  : ''
                              "
                              density="compact"
                              class="input-edit-checkbox"
                              :ripple="item.ripple"
                              :label="item.label"
                              :readonly="
                                item.disabled !== undefined ? item.disabled : modeController?.view
                              "
                            />
                            <component
                              :is="item.componenteDinamico"
                              v-if="item.type === 'componente-dinamico'"
                              v-model="item.model"
                              v-bind="
                                item.componenteDinamicoProps &&
                                item.componenteDinamicoProps(item, i, item.model)
                              "
                              v-on="item.listeners"
                              @update:model-value="item.action ? item.action(item) : undefined"
                            />
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </template>
              </v-row>
            </v-card-text>

            <v-divider />

            <v-card-actions
              v-if="actions?.length"
              class="py-3 pr-2 mx-3"
              style="min-height: 36px"
              dense
            >
              <v-row class="pa-0" dense>
                <div v-if="!hideMsgCamposObrigatorios" class="mx-2 body-2 font-weight-bold">
                  <span style="color: red" class="red--text subtitle-1">*</span> Campos obrigatórios
                </div>
                <v-spacer />
                <div v-for="(ac, idx) in actions" :key="idx" class="py-0">
                  <v-btn
                    v-if="(ac?.id && idsVisibleActions?.includes(ac?.id)) || ac?.visible"
                    :class="ac?.class ?? ''"
                    :color="ac?.color ?? 'primary'"
                    :size="ac?.size ?? 'small'"
                    :disabled="ac?.disabled"
                    :variant="ac?.variant ?? 'outlined'"
                    @click="
                      ac?.validate ? handleValidate(ac?.action, ac?.validate) : ac?.action?.()
                    "
                  >
                    <v-icon class="mr-2">
                      {{ ac.icon }}
                    </v-icon>
                    {{ ac.text }}
                  </v-btn>
                </div>
              </v-row>
            </v-card-actions>
          </v-card>
        </slot>
      </v-col>

      <v-col v-if="propsT.options?.mode == 'form'" :cols="propsT.options?.cols">
        <slot name="master-detail" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
:deep(.v-input--disabled),
:deep(.v-textarea--disabled),
:deep(.v-select--disabled) {
  opacity: 1 !important;
  
  .v-field {
    background-color: #0000001a !important;
  }
  
  .v-field__input,
  .v-field__label,
  .v-select__selection,
  textarea {
    color: #000000 !important;
    opacity: 1 !important;
  }
  
  .v-field__label {
    color: #00000099 !important;
  }
}

:deep(.input-edit-checkbox, .v-checkbox-btn) {
  padding: 10px 0px 0px 0px !important;
  height: 30px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  display: flex !important;
  align-items: center;
  --v-input-control-height: 30px !important;
}

.card-title-span {
  display: inline-flex;
  align-items: center;
  max-width: calc(100% - 6px - 6px);
  color: #00000099;
}
.text-span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

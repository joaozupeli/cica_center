<script lang="ts" setup>
// #region Import libs
import { computed, nextTick, ref, watch } from "vue";
import { useDisplay, useTheme } from "vuetify";
import type { Modal } from "./Modal.d";
// #endregion

// #region Declare variables
const propsModal = withDefaults(
  defineProps<{
    options: Modal;
  }>(),
  {},
);

const model = defineModel<boolean>({ required: true });
const { mobile } = useDisplay();
const theme = useTheme();
const dialog = ref<any>(null);
const toolbar = ref<any>(null);
const isDark = theme.themes.value.light.dark;
let idsVisibleActions = computed(() => propsModal.options?.idsVisibleActions);
let actionCancel = computed(() =>
  propsModal.options?.actions?.find((el) => el.id === "cancelar" || el.id === "fechar"),
);
const moreOptions = ref({ ...propsModal.options?.moreOptions });
let moreOptionsVisible = computed(() => propsModal.options?.moreOptions?.visible);
const toolbarButtons = ref(propsModal.options?.toolbarButtons);
const moving = ref<boolean>(propsModal.options?.moving || false);
const clickPosition: any = {
  x: ref(null),
  y: ref(null),
};
// #endregion

// #region Declare functions
function mouseDown(e: any) {
  moving.value = true;
  toolbar?.value?.$el.classList.add("ig-dialog__moving");
  const toolbarRect = toolbar?.value?.$el?.getBoundingClientRect();
  (clickPosition.x.value = e.clientX - toolbarRect.left),
    (clickPosition.y.value = e.clientY - toolbarRect.top),
    document.addEventListener("mousemove", mouseMove);
  document.addEventListener("mouseup", mouseUp);
}

function mouseMove(e: any) {
  const dialogEl = dialog?.value?.$el?.offsetParent;
  if (!dialogEl) return;
  const newPosition = {
    x: e.clientX - clickPosition.x.value,
    y: e.clientY - clickPosition.y.value,
  };
  dialogEl.style.left = `${newPosition.x}px`;
  dialogEl.style.top = `${newPosition.y}px`;
  checkBoundings();
}

function mouseUp() {
  moving.value = false;
  toolbar?.value?.$el.classList.remove("ig-dialog__moving");
  document.removeEventListener("mousemove", mouseMove);
  document.removeEventListener("mouseup", mouseUp);
}

function checkBoundings() {
  const dialogEl = dialog?.value?.$el?.offsetParent;
  if (!dialogEl) return;
  const dialogRect = dialogEl.getBoundingClientRect();
  if (dialogRect.left < 0) {
    dialogEl.style.left = "0";
  }
  if (dialogRect.top < 0) {
    dialogEl.style.top = "0";
  }
  if (dialogRect.right > window.innerWidth) {
    dialogEl.style.left = `${window.innerWidth - dialogRect.width}px`;
  }
  if (dialogRect.bottom > window.innerHeight) {
    dialogEl.style.top = `${window.innerHeight - dialogRect.height}px`;
  }
}
// #endregion

// #region Watch
watch(model, (val: any) => {
  if (val) {
    nextTick(() => {
      toolbar.value && toolbar?.value?.$el.addEventListener("mousedown", mouseDown);
    });
  } else {
    nextTick(() => {
      toolbar.value && toolbar?.value?.$el.removeEventListener("mousedown", mouseDown);
    });
  }
});
// #endregion
</script>

<template>
  <div class="text-center">
    <v-dialog
      v-model="model"
      transition="dialog-top-transition"
      :width="options.width ? options.width : 600"
      conte
      :content-class="
        moving ? 'ma-0 ig-dialog__custon ig-no-transitions' : 'ma-0 ig-dialog__custon'
      "
      persistent
      :fullscreen="mobile || options.fullScreen"
      scrollable
    >
      <v-card ref="dialog" :variant="isDark ? 'outlined' : 'elevated'">
        <v-card-title
          ref="toolbar"
          class="title py-1 px-2 d-flex"
          :class="isDark ? 'accent' : 'white'"
        >
          <v-btn
            class="mr-2"
            icon
            elevation="0"
            size="36"
            @click.stop.prevent="actionCancel?.action"
          >
            <v-icon size="28" :color="isDark ? 'white' : 'primary'" class="pa-0 ma-0">
              mdi-close
            </v-icon>
          </v-btn>
          <span class="font-weight-bold text-subtitle-1 text-center align-self-center">
            {{ options.title || "Form Title" }}
          </span>
          <v-spacer />
          <slot name="acaoToolbar" />
          <span v-for="(item, i) in toolbarButtons" :key="i" class="align-self-center">
            <v-btn
              v-if="item.visible ?? true"
              :class="item?.class ?? 'mt-1'"
              :color="item?.color ?? 'primary'"
              :size="item?.size ?? 'small'"
              :disabled="item?.disabled"
              :variant="item?.variant ?? 'outlined'"
              @click="item?.action?.()"
            >
              <v-icon class="mr-2">
                {{ item.icon }}
              </v-icon>
              {{ item.text }}
            </v-btn>
          </span>
          <v-menu
            v-if="moreOptionsVisible"
            class="ml-2"
            :location="moreOptions?.location ?? 'start'"
            transition="scale-transition"
          >
            <template #activator="{ props }">
              <v-btn
                elevation="0"
                :color="moreOptions?.color"
                title="Mais Opções"
                icon
                :text="moreOptions?.text"
                :variant="moreOptions?.variant"
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
                    <div class="mr-2">
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
        <v-card-text :class="options?.class ?? 'py-0 px-2'">
          <v-card flat :height="options.height">
            <slot name="content" />
          </v-card>
          <v-card v-if="options.contentDense" dense :height="options.height" class="ma-4">
            <slot name="contentDense" />
          </v-card>
        </v-card-text>
        <v-divider />
        <v-card-actions
          style="min-height: 36px"
          dense
          class="pa-1 py-2 mr-1 d-flex justify-space-between"
        >
          <div v-if="options.camposObrigatorios" class="mx-3 body-2 font-weight-bold">
            <span style="color: red" class="red--text subtitle-1">*</span> Campos obrigatórios
          </div>
          <v-spacer />
          <div>
            <template v-for="btn in options.actions" :key="btn.title">
              <v-btn
                v-if="(btn.id && idsVisibleActions?.includes(btn?.id)) || btn?.visible"
                :color="isDark && btn.color !== 'error' ? 'accent' : btn.color || 'primary'"
                :class="btn.class || ''"
                :variant="btn.variant ?? 'outlined'"
                :disabled="btn.disabled"
                :size="btn?.size ?? 'small'"
                @click="btn.action"
              >
                <v-icon class="mr-2">
                  {{ btn.icon }}
                </v-icon>
                {{ btn.text }}
              </v-btn>
            </template>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style>
.ig-dialog__custon {
  position: absolute;
  margin: 0;
}
.ig-dialog__moving {
  cursor: move !important;
  user-select: none !important;
}
.ig-no-transitions {
  transition: none !important;
}
</style>

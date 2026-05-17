<script setup lang="ts">
import { computed } from "vue";
import { useProductsStore } from "@/stores/products";
import type { ProductFilters } from "@/types/product";

const props = defineProps<{
  modelValue: ProductFilters;
  precoMaximo: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: ProductFilters): void;
  (e: "clear"): void;
}>();

const products = useProductsStore();

const opcoesAro = computed(() =>
  products.arosDisponiveis.map((a) => ({ title: `Aro ${a}`, value: `aro${a}` }))
);

const opcoesFuracao = computed(() => products.furacoesDisponiveis);
const opcoesCor = computed(() => products.coresDisponiveis);

function update<K extends keyof ProductFilters>(
  key: K,
  value: ProductFilters[K]
) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}

const precoRange = computed({
  get: () => [
    props.modelValue.precoMin ?? 0,
    props.modelValue.precoMax ?? props.precoMaximo,
  ],
  set: (v: number[]) =>
    emit("update:modelValue", {
      ...props.modelValue,
      precoMin: v[0],
      precoMax: v[1],
    }),
});

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}
</script>

<template>
  <aside class="filters">
    <header class="filters-header">
      <h3>Filtros</h3>
      <v-btn
        size="x-small"
        variant="text"
        color="primary"
        @click="emit('clear')"
      >
        Limpar
      </v-btn>
    </header>

    <section class="filter-block">
      <label class="filter-label">Modelo (Aro)</label>
      <v-select
        :model-value="modelValue.modelo"
        :items="opcoesAro"
        item-title="title"
        item-value="value"
        multiple
        chips
        closable-chips
        placeholder="Todos os aros"
        density="comfortable"
        hide-details
        @update:model-value="(v) => update('modelo', v)"
      />
    </section>

    <section class="filter-block">
      <label class="filter-label">Furação</label>
      <v-select
        :model-value="modelValue.furacao"
        :items="opcoesFuracao"
        multiple
        chips
        closable-chips
        placeholder="Todas as furações"
        density="comfortable"
        hide-details
        @update:model-value="(v) => update('furacao', v)"
      />
    </section>

    <section class="filter-block">
      <label class="filter-label">Cor</label>
      <div class="cor-list">
        <label
          v-for="cor in opcoesCor"
          :key="cor"
          class="cor-option"
          :class="{ active: modelValue.cor?.includes(cor) }"
        >
          <input
            type="checkbox"
            :value="cor"
            :checked="modelValue.cor?.includes(cor) ?? false"
            @change="
              (e) => {
                const target = e.target as HTMLInputElement;
                const list = modelValue.cor ? [...modelValue.cor] : [];
                if (target.checked) list.push(cor);
                else {
                  const idx = list.indexOf(cor);
                  if (idx >= 0) list.splice(idx, 1);
                }
                update('cor', list);
              }
            "
          />
          <span class="swatch" :class="`cor-${cor}`" />
          <span class="cor-name">{{ cor }}</span>
        </label>
      </div>
    </section>

    <section class="filter-block">
      <label class="filter-label">Carro compatível</label>
      <v-text-field
        :model-value="modelValue.carro"
        placeholder="Ex.: Gol, Civic..."
        density="comfortable"
        hide-details
        prepend-inner-icon="mdi-magnify"
        clearable
        @update:model-value="(v) => update('carro', v || undefined)"
      />
    </section>

    <section class="filter-block">
      <label class="filter-label">Faixa de preço</label>
      <v-range-slider
        v-model="precoRange"
        :min="0"
        :max="precoMaximo"
        :step="100"
        thumb-label
        color="primary"
        track-color="grey-darken-3"
        hide-details
      />
      <div class="preco-info">
        <span>{{ formatBRL(precoRange[0]) }}</span>
        <span>{{ formatBRL(precoRange[1]) }}</span>
      </div>
    </section>
  </aside>
</template>

<style scoped>
.filters {
  background-color: var(--cica-black-soft);
  border: 1px solid var(--cica-border);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 88px;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--cica-border);
  padding-bottom: 12px;
}

.filters-header h3 {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  letter-spacing: 0.08em;
  font-size: 16px;
  margin: 0;
}

.filter-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-family: "Rajdhani", sans-serif;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #b5b5b5;
}

.cor-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cor-option {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.cor-option:hover {
  background-color: var(--cica-black-elevated);
}

.cor-option input {
  accent-color: var(--cica-red);
}

.cor-option.active {
  background-color: rgba(204, 0, 0, 0.1);
}

.swatch {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #444;
}

.cor-preto {
  background: #0a0a0a;
}
.cor-prata {
  background: #c0c0c0;
}
.cor-branco {
  background: #ffffff;
}
.cor-bronze {
  background: #cd7f32;
}
.cor-vermelho {
  background: #cc0000;
}

.cor-name {
  text-transform: capitalize;
  color: var(--cica-white);
  font-size: 14px;
}

.preco-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #b5b5b5;
}
</style>

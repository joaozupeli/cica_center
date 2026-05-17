<script setup lang="ts">
import { computed } from "vue";
import type { ProductFilters } from "@/types/product";

interface ChipItem {
  label: string;
  remove: () => void;
}

const props = defineProps<{
  filters: ProductFilters;
}>();

const emit = defineEmits<{
  (e: "update", value: ProductFilters): void;
  (e: "clear"): void;
}>();

const chips = computed<ChipItem[]>(() => {
  const items: ChipItem[] = [];
  const f = props.filters;

  (f.modelo || []).forEach((m) => {
    items.push({
      label: m.replace(/^aro/i, "Aro "),
      remove: () =>
        emit("update", {
          ...f,
          modelo: (f.modelo || []).filter((x) => x !== m),
        }),
    });
  });

  (f.furacao || []).forEach((fur) => {
    items.push({
      label: `Furação ${fur}`,
      remove: () =>
        emit("update", {
          ...f,
          furacao: (f.furacao || []).filter((x) => x !== fur),
        }),
    });
  });

  (f.cor || []).forEach((cor) => {
    items.push({
      label: `Cor: ${cor}`,
      remove: () =>
        emit("update", { ...f, cor: (f.cor || []).filter((x) => x !== cor) }),
    });
  });

  if (f.carro) {
    items.push({
      label: `Carro: ${f.carro}`,
      remove: () => emit("update", { ...f, carro: undefined }),
    });
  }

  if (typeof f.precoMin === "number" || typeof f.precoMax === "number") {
    const min = (f.precoMin ?? 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    });
    const max = (f.precoMax ?? 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    });
    items.push({
      label: `Preço: ${min} - ${max}`,
      remove: () =>
        emit("update", {
          ...f,
          precoMin: undefined,
          precoMax: undefined,
        }),
    });
  }

  return items;
});
</script>

<template>
  <div v-if="chips.length > 0" class="filter-chips">
    <v-chip
      v-for="chip in chips"
      :key="chip.label"
      closable
      variant="outlined"
      color="primary"
      class="chip"
      @click:close="chip.remove"
    >
      {{ chip.label }}
    </v-chip>
    <v-btn
      variant="text"
      color="primary"
      size="small"
      class="clear-btn"
      @click="emit('clear')"
    >
      Limpar filtros
    </v-btn>
  </div>
</template>

<style scoped>
.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
}

.chip {
  font-size: 13px;
}

.clear-btn {
  letter-spacing: 0.04em;
}
</style>

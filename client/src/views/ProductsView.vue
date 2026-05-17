<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProductsStore } from "@/stores/products";
import ProductGrid from "@/components/products/ProductGrid.vue";
import ProductFilters from "@/components/products/ProductFilters.vue";
import FilterChips from "@/components/products/FilterChips.vue";
import ProductPagination from "@/components/products/ProductPagination.vue";
import type {
  ProductFilters as Filters,
  ProductListParams,
} from "@/types/product";

const route = useRoute();
const router = useRouter();
const products = useProductsStore();

const PER_PAGE = 24;
const mobileFiltersOpen = ref(false);

function parseList(value: unknown): string[] | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

function parseNumber(value: unknown): number | undefined {
  if (typeof value !== "string" || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

const currentFilters = computed<Filters>(() => ({
  modelo: parseList(route.query.modelo),
  furacao: parseList(route.query.furacao),
  cor: parseList(route.query.cor),
  carro: typeof route.query.carro === "string" ? route.query.carro : undefined,
  precoMin: parseNumber(route.query.precoMin),
  precoMax: parseNumber(route.query.precoMax),
}));

const currentPage = computed<number>(() => {
  const p = parseNumber(route.query.page);
  return p && p > 0 ? p : 1;
});

function buildQuery(
  filters: Filters,
  page: number
): Record<string, string> {
  const q: Record<string, string> = {};
  if (filters.modelo?.length) q.modelo = filters.modelo.join(",");
  if (filters.furacao?.length) q.furacao = filters.furacao.join(",");
  if (filters.cor?.length) q.cor = filters.cor.join(",");
  if (filters.carro) q.carro = filters.carro;
  if (typeof filters.precoMin === "number") q.precoMin = String(filters.precoMin);
  if (typeof filters.precoMax === "number") q.precoMax = String(filters.precoMax);
  if (page > 1) q.page = String(page);
  return q;
}

function updateFilters(filters: Filters) {
  router.push({ query: buildQuery(filters, 1) });
}

function updatePage(page: number) {
  router.push({ query: buildQuery(currentFilters.value, page) });
}

function clearFilters() {
  router.push({ query: {} });
}

async function load() {
  const params: ProductListParams = {
    ...currentFilters.value,
    page: currentPage.value,
    perPage: PER_PAGE,
  };
  await products.fetchList(params);
}

onMounted(load);
watch(() => route.fullPath, load);
</script>

<template>
  <v-container max-width="1440" class="py-8">
    <header class="page-header">
      <div>
        <span class="page-eyebrow">Catálogo</span>
        <h1 class="page-title">Rodas automotivas</h1>
      </div>
      <v-btn
        class="d-md-none"
        variant="outlined"
        color="primary"
        prepend-icon="mdi-tune"
        @click="mobileFiltersOpen = true"
      >
        Filtros
      </v-btn>
    </header>

    <div class="layout">
      <div class="filters-col d-none d-md-block">
        <ProductFilters
          :model-value="currentFilters"
          :preco-maximo="products.precoMaximo"
          @update:model-value="updateFilters"
          @clear="clearFilters"
        />
      </div>

      <div class="content-col">
        <FilterChips
          :filters="currentFilters"
          @update="updateFilters"
          @clear="clearFilters"
        />

        <v-alert
          v-if="products.error"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          {{ products.error }}
        </v-alert>

        <ProductGrid :products="products.list" :loading="products.loading" />

        <ProductPagination
          :page="products.page"
          :total-pages="products.totalPages"
          :total="products.total"
          :per-page="products.perPage"
          @update:page="updatePage"
        />
      </div>
    </div>

    <v-navigation-drawer
      v-model="mobileFiltersOpen"
      location="left"
      temporary
      width="320"
      color="surface"
    >
      <div class="pa-4">
        <ProductFilters
          :model-value="currentFilters"
          :preco-maximo="products.precoMaximo"
          @update:model-value="updateFilters"
          @clear="clearFilters"
        />
      </div>
    </v-navigation-drawer>
  </v-container>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
  gap: 12px;
}

.page-eyebrow {
  font-family: "Rajdhani", sans-serif;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--cica-red);
}

.page-title {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 36px;
  color: var(--cica-white);
  margin: 4px 0 0;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 32px;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.content-col {
  min-width: 0;
}
</style>

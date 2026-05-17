<script setup lang="ts">
import type { Product } from "@/types/product";
import ProductCard from "./ProductCard.vue";

defineProps<{
  products: Product[];
  loading?: boolean;
}>();
</script>

<template>
  <div>
    <div v-if="loading" class="grid">
      <v-skeleton-loader
        v-for="i in 8"
        :key="i"
        type="image, article"
        color="surface"
      />
    </div>

    <div v-else-if="products.length === 0" class="empty-state">
      <v-icon size="64" color="grey-darken-1">mdi-magnify-close</v-icon>
      <h3 class="mt-4">Nenhuma roda encontrada</h3>
      <p>Tente ajustar os filtros para encontrar o que procura.</p>
    </div>

    <div v-else class="grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

@media (max-width: 380px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.empty-state {
  text-align: center;
  padding: 80px 24px;
  color: #b5b5b5;
}

.empty-state h3 {
  font-family: "Rajdhani", sans-serif;
  font-weight: 600;
  color: var(--cica-white);
  letter-spacing: 0.04em;
  margin: 0;
}

.empty-state p {
  margin: 8px 0 0;
}
</style>

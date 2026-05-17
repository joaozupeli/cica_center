<script setup lang="ts">
import { computed } from "vue";
import type { Product } from "@/types/product";

const props = defineProps<{ product: Product }>();

const precoFormatado = computed(() =>
  props.product.preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
);
</script>

<template>
  <v-card
    class="product-card"
    color="surface"
    flat
    :to="{ name: 'ProdutoDetalhe', params: { id: product.id } }"
  >
    <div class="product-image-wrapper">
      <v-img
        :src="product.imagem"
        :alt="product.nome"
        cover
        height="240"
        class="product-image"
      >
        <template #placeholder>
          <div class="image-placeholder">
            <v-icon size="48" color="grey-darken-1">mdi-car-tire-alert</v-icon>
          </div>
        </template>
      </v-img>
      <div class="product-aro">Aro {{ product.aro }}</div>
    </div>

    <v-card-text class="pa-4">
      <div class="product-modelo">{{ product.modelo }}</div>
      <h3 class="product-nome">{{ product.nome }}</h3>
      <div class="product-meta">
        <span class="product-furacao">
          <v-icon size="14" class="mr-1">mdi-circle-multiple-outline</v-icon>
          {{ product.furacao }}
        </span>
        <span class="product-cor">
          <span class="cor-dot" :class="`cor-${product.cor}`" />
          {{ product.cor }}
        </span>
      </div>

      <div class="product-preco">{{ precoFormatado }}</div>

      <v-btn
        color="primary"
        block
        variant="flat"
        class="mt-3"
        rounded="0"
        height="42"
      >
        Ver detalhes
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.product-card {
  border: 1px solid var(--cica-border);
  transition: transform 0.2s ease, border-color 0.2s ease;
  overflow: hidden;
}

.product-card:hover {
  border-color: var(--cica-red);
  transform: translateY(-4px);
}

.product-image-wrapper {
  position: relative;
  background-color: var(--cica-black);
}

.product-image {
  background-color: #1a1a1a;
}

.image-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
}

.product-aro {
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: var(--cica-red);
  color: var(--cica-white);
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.08em;
  padding: 4px 10px;
  text-transform: uppercase;
}

.product-modelo {
  font-family: "Rajdhani", sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #b5b5b5;
}

.product-nome {
  font-family: "Rajdhani", sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--cica-white);
  margin: 4px 0 10px;
  line-height: 1.2;
  min-height: 44px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-meta {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: #b5b5b5;
  margin-bottom: 12px;
  align-items: center;
}

.product-furacao,
.product-cor {
  display: inline-flex;
  align-items: center;
}

.cor-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 6px;
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

.product-preco {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 26px;
  color: var(--cica-red);
  letter-spacing: 0.02em;
}
</style>

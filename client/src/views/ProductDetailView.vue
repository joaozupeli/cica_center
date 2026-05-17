<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useProductsStore } from "@/stores/products";
import { useCartStore } from "@/stores/cart";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const products = useProductsStore();
const cart = useCartStore();

const productId = computed(() => Number(route.params.id));

const precoFormatado = computed(() =>
  products.current
    ? products.current.preco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : ""
);

function load() {
  if (!Number.isNaN(productId.value)) {
    products.fetchById(productId.value);
  }
}

onMounted(load);
watch(productId, load);

function addToCart() {
  if (!products.current) return;
  cart.addProduct(products.current, 1);
  toast.success(`${products.current.nome} adicionada ao carrinho!`);
}

function buyNow() {
  if (!products.current) return;
  cart.addProduct(products.current, 1);
  router.push("/carrinho");
}
</script>

<template>
  <v-container max-width="1440" class="py-8">
    <v-btn
      variant="text"
      color="white"
      prepend-icon="mdi-arrow-left"
      to="/produtos"
      class="mb-4"
    >
      Voltar para catálogo
    </v-btn>

    <div v-if="products.loading" class="d-flex justify-center pa-12">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <v-alert
      v-else-if="products.error || !products.current"
      type="error"
      variant="tonal"
    >
      Produto não encontrado.
    </v-alert>

    <div v-else class="detail">
      <div class="gallery">
        <v-img
          :src="products.current.imagem"
          :alt="products.current.nome"
          cover
          aspect-ratio="1"
          class="main-image"
        />
      </div>

      <div class="info">
        <span class="info-eyebrow">{{ products.current.modelo }}</span>
        <h1 class="info-title">{{ products.current.nome }}</h1>

        <div class="info-meta">
          <span class="badge">Aro {{ products.current.aro }}</span>
          <span class="badge">Furação {{ products.current.furacao }}</span>
          <span class="badge cor">
            <span class="swatch" :class="`cor-${products.current.cor}`" />
            {{ products.current.cor }}
          </span>
        </div>

        <p class="info-desc">{{ products.current.descricao }}</p>

        <div class="info-preco">{{ precoFormatado }}</div>
        <div class="info-parcelas">
          Em até 12x sem juros no cartão
        </div>

        <div class="info-stock">
          <v-icon size="18" color="success">mdi-check-circle</v-icon>
          {{ products.current.estoque }} unidades em estoque
        </div>

        <div class="actions">
          <v-btn
            color="primary"
            variant="flat"
            size="large"
            rounded="0"
            height="52"
            block
            @click="addToCart"
          >
            <v-icon start>mdi-cart-plus</v-icon>
            Adicionar ao carrinho
          </v-btn>
          <v-btn
            variant="outlined"
            color="white"
            size="large"
            rounded="0"
            height="52"
            block
            @click="buyNow"
          >
            Comprar agora
          </v-btn>
        </div>

        <section class="info-section">
          <h4>Carros compatíveis</h4>
          <div class="chips">
            <v-chip
              v-for="carro in products.current.carrosCompativeis"
              :key="carro"
              variant="outlined"
              color="white"
              size="small"
            >
              {{ carro }}
            </v-chip>
          </div>
        </section>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}

@media (max-width: 900px) {
  .detail {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.gallery {
  border: 1px solid var(--cica-border);
}

.main-image {
  background-color: #1a1a1a;
}

.info-eyebrow {
  font-family: "Rajdhani", sans-serif;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--cica-red);
}

.info-title {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 36px;
  color: var(--cica-white);
  margin: 4px 0 16px;
  letter-spacing: 0.02em;
}

.info-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.badge {
  background-color: var(--cica-black-elevated);
  border: 1px solid var(--cica-border);
  padding: 6px 12px;
  font-family: "Rajdhani", sans-serif;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
}

.badge.cor {
  text-transform: capitalize;
}

.swatch {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-right: 8px;
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

.info-desc {
  color: #b5b5b5;
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 24px;
}

.info-preco {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 48px;
  color: var(--cica-red);
  letter-spacing: 0.02em;
  line-height: 1;
}

.info-parcelas {
  font-size: 13px;
  color: #b5b5b5;
  margin-top: 6px;
  margin-bottom: 16px;
}

.info-stock {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #b5b5b5;
  font-size: 14px;
  margin-bottom: 24px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 32px;
}

.info-section h4 {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--cica-white);
  margin: 0 0 12px;
}

.chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>

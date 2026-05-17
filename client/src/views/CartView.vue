<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";
import { useAuthStore } from "@/stores/auth";

const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();

const totalFormatado = computed(() =>
  cart.totalPrice.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
);

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function handleCheckout() {
  if (!auth.isAuthenticated) {
    auth.requireAuth(
      "/checkout",
      "Você precisa estar logado para finalizar a compra."
    );
    return;
  }
  router.push("/checkout");
}
</script>

<template>
  <v-container max-width="1440" class="py-8">
    <h1 class="page-title">Carrinho</h1>

    <div v-if="cart.isEmpty" class="empty">
      <v-icon size="80" color="grey-darken-1">mdi-cart-outline</v-icon>
      <h3>Seu carrinho está vazio</h3>
      <p>Adicione rodas ao carrinho para começar.</p>
      <v-btn
        color="primary"
        variant="flat"
        size="large"
        rounded="0"
        to="/produtos"
      >
        Ver catálogo
      </v-btn>
    </div>

    <div v-else class="cart-layout">
      <section class="cart-items">
        <div
          v-for="item in cart.items"
          :key="item.product.id"
          class="cart-item"
        >
          <v-img
            :src="item.product.imagem"
            :alt="item.product.nome"
            cover
            width="120"
            height="120"
            class="item-image"
          />

          <div class="item-info">
            <span class="item-modelo">{{ item.product.modelo }}</span>
            <h3 class="item-nome">{{ item.product.nome }}</h3>
            <div class="item-meta">
              Aro {{ item.product.aro }} • {{ item.product.furacao }} •
              <span class="text-capitalize">{{ item.product.cor }}</span>
            </div>
          </div>

          <div class="item-controls">
            <v-btn
              icon
              size="small"
              variant="outlined"
              color="white"
              @click="cart.updateQuantity(item.product.id, item.quantity - 1)"
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <span class="qty">{{ item.quantity }}</span>
            <v-btn
              icon
              size="small"
              variant="outlined"
              color="white"
              @click="cart.updateQuantity(item.product.id, item.quantity + 1)"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>

          <div class="item-preco">
            <strong>{{ formatBRL(item.product.preco * item.quantity) }}</strong>
            <v-btn
              icon
              size="small"
              variant="text"
              color="grey"
              @click="cart.removeProduct(item.product.id)"
            >
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </div>
        </div>
      </section>

      <aside class="cart-summary">
        <h3>Resumo do pedido</h3>

        <div class="summary-line">
          <span>Subtotal ({{ cart.totalItems }} itens)</span>
          <span>{{ totalFormatado }}</span>
        </div>
        <div class="summary-line">
          <span>Frete</span>
          <span class="text-grey">Calculado no checkout</span>
        </div>

        <v-divider class="my-3" />

        <div class="summary-total">
          <span>Total</span>
          <span class="total-value">{{ totalFormatado }}</span>
        </div>
        <div class="parcelas">Em até 12x sem juros</div>

        <v-btn
          color="primary"
          variant="flat"
          size="large"
          rounded="0"
          height="52"
          block
          class="mt-4"
          @click="handleCheckout"
        >
          Finalizar compra
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>

        <v-btn
          variant="text"
          color="white"
          block
          to="/produtos"
          class="mt-2"
        >
          Continuar comprando
        </v-btn>
      </aside>
    </div>
  </v-container>
</template>

<style scoped>
.page-title {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 36px;
  color: var(--cica-white);
  margin: 0 0 32px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.empty {
  text-align: center;
  padding: 80px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty h3 {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: var(--cica-white);
  margin: 8px 0 0;
}

.empty p {
  color: #b5b5b5;
  margin: 0 0 16px;
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
  align-items: start;
}

@media (max-width: 960px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr auto auto;
  gap: 20px;
  align-items: center;
  background-color: var(--cica-black-soft);
  border: 1px solid var(--cica-border);
  padding: 16px;
}

@media (max-width: 700px) {
  .cart-item {
    grid-template-columns: 100px 1fr;
    grid-template-areas:
      "image info"
      "controls preco";
    gap: 12px;
  }
  .item-image {
    grid-area: image;
  }
  .item-info {
    grid-area: info;
  }
  .item-controls {
    grid-area: controls;
  }
  .item-preco {
    grid-area: preco;
    text-align: right;
  }
}

.item-image {
  border: 1px solid var(--cica-border);
}

.item-modelo {
  font-family: "Rajdhani", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #b5b5b5;
}

.item-nome {
  font-family: "Rajdhani", sans-serif;
  font-weight: 600;
  font-size: 18px;
  color: var(--cica-white);
  margin: 4px 0;
  letter-spacing: 0.02em;
}

.item-meta {
  font-size: 13px;
  color: #b5b5b5;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 28px;
  text-align: center;
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 18px;
}

.item-preco {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: var(--cica-white);
}

.cart-summary {
  background-color: var(--cica-black-soft);
  border: 1px solid var(--cica-border);
  padding: 24px;
  position: sticky;
  top: 88px;
}

.cart-summary h3 {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: var(--cica-white);
  margin: 0 0 16px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #b5b5b5;
  margin-bottom: 8px;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.summary-total span:first-child {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--cica-white);
}

.total-value {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 28px;
  color: var(--cica-red);
}

.parcelas {
  font-size: 12px;
  color: #b5b5b5;
  text-align: right;
}
</style>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useCartStore } from "@/stores/cart";
import { useAuthStore } from "@/stores/auth";

const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();
const toast = useToast();

const form = ref({
  nome: auth.user?.nome || "",
  email: auth.user?.email || "",
  cep: "",
  endereco: "",
  numero: "",
  bairro: "",
  cidade: "",
  estado: "",
});

const pagamento = ref<"credito" | "boleto" | "pix">("credito");
const submitting = ref(false);

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

async function submit() {
  submitting.value = true;
  try {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Pedido realizado com sucesso! (mock)");
    cart.clear();
    router.push("/conta");
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <v-container max-width="1440" class="py-8">
    <h1 class="page-title">Finalizar compra</h1>

    <div v-if="cart.isEmpty" class="empty">
      <p>Seu carrinho está vazio.</p>
      <v-btn color="primary" variant="flat" rounded="0" to="/produtos">
        Voltar ao catálogo
      </v-btn>
    </div>

    <v-form v-else class="checkout-layout" @submit.prevent="submit">
      <div class="form-cols">
        <section class="form-block">
          <h3>Dados pessoais</h3>
          <div class="grid-2">
            <v-text-field
              v-model="form.nome"
              label="Nome completo"
              required
            />
            <v-text-field
              v-model="form.email"
              label="E-mail"
              type="email"
              required
            />
          </div>
        </section>

        <section class="form-block">
          <h3>Endereço de entrega</h3>
          <div class="grid-2">
            <v-text-field v-model="form.cep" label="CEP" required />
            <v-text-field v-model="form.numero" label="Número" required />
          </div>
          <v-text-field v-model="form.endereco" label="Endereço" required />
          <div class="grid-3">
            <v-text-field v-model="form.bairro" label="Bairro" required />
            <v-text-field v-model="form.cidade" label="Cidade" required />
            <v-text-field v-model="form.estado" label="UF" required />
          </div>
        </section>

        <section class="form-block">
          <h3>Forma de pagamento</h3>
          <v-radio-group v-model="pagamento" hide-details>
            <v-radio value="credito" color="primary">
              <template #label>
                <v-icon class="mr-2">mdi-credit-card-outline</v-icon>
                Cartão de crédito (até 12x sem juros)
              </template>
            </v-radio>
            <v-radio value="pix" color="primary">
              <template #label>
                <v-icon class="mr-2">mdi-qrcode</v-icon>
                Pix (5% de desconto)
              </template>
            </v-radio>
            <v-radio value="boleto" color="primary">
              <template #label>
                <v-icon class="mr-2">mdi-barcode</v-icon>
                Boleto bancário
              </template>
            </v-radio>
          </v-radio-group>
        </section>
      </div>

      <aside class="summary">
        <h3>Resumo</h3>
        <ul class="summary-items">
          <li v-for="item in cart.items" :key="item.product.id">
            <span>{{ item.quantity }}x {{ item.product.nome }}</span>
            <strong>{{ formatBRL(item.product.preco * item.quantity) }}</strong>
          </li>
        </ul>
        <v-divider class="my-3" />
        <div class="total">
          <span>Total</span>
          <span class="total-value">{{ totalFormatado }}</span>
        </div>
        <v-btn
          type="submit"
          color="primary"
          variant="flat"
          size="large"
          rounded="0"
          height="52"
          block
          :loading="submitting"
          class="mt-4"
        >
          Confirmar pedido
        </v-btn>
      </aside>
    </v-form>
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
  gap: 16px;
  color: #b5b5b5;
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
  align-items: start;
}

@media (max-width: 960px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }
}

.form-cols {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-block {
  background-color: var(--cica-black-soft);
  border: 1px solid var(--cica-border);
  padding: 24px;
}

.form-block h3 {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cica-white);
  margin: 0 0 16px;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.grid-3 {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  gap: 12px;
}

@media (max-width: 600px) {
  .grid-2,
  .grid-3 {
    grid-template-columns: 1fr;
  }
}

.summary {
  background-color: var(--cica-black-soft);
  border: 1px solid var(--cica-border);
  padding: 24px;
  position: sticky;
  top: 88px;
}

.summary h3 {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cica-white);
  margin: 0 0 16px;
}

.summary-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-items li {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #b5b5b5;
  gap: 8px;
}

.summary-items strong {
  color: var(--cica-white);
  white-space: nowrap;
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.total span:first-child {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.total-value {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 28px;
  color: var(--cica-red);
}
</style>

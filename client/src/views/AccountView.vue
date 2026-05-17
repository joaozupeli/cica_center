<script setup lang="ts">
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();
const toast = useToast();

function logout() {
  auth.logout();
  toast.info("Você saiu da sua conta.");
  router.push("/");
}
</script>

<template>
  <v-container max-width="1100" class="py-8">
    <header class="page-header">
      <div>
        <span class="page-eyebrow">Minha conta</span>
        <h1 class="page-title">Olá, {{ auth.user?.nome || "cliente" }}</h1>
      </div>
      <v-btn
        variant="outlined"
        color="primary"
        prepend-icon="mdi-logout"
        @click="logout"
      >
        Sair
      </v-btn>
    </header>

    <div class="grid">
      <section class="card">
        <v-icon size="40" color="primary">mdi-account-circle-outline</v-icon>
        <h3>Dados pessoais</h3>
        <p>Mantenha suas informações sempre atualizadas.</p>
        <ul>
          <li>
            <strong>Nome:</strong>
            {{ auth.user?.nome || "—" }}
          </li>
          <li>
            <strong>E-mail:</strong>
            {{ auth.user?.email || "—" }}
          </li>
        </ul>
      </section>

      <section class="card">
        <v-icon size="40" color="primary">mdi-package-variant-closed</v-icon>
        <h3>Meus pedidos</h3>
        <p>Acompanhe o histórico e o status de cada compra.</p>
        <div class="empty-state">
          <v-icon size="32" color="grey-darken-1">mdi-package-variant</v-icon>
          <span>Você ainda não tem pedidos.</span>
        </div>
      </section>

      <section class="card">
        <v-icon size="40" color="primary">mdi-map-marker-outline</v-icon>
        <h3>Endereços</h3>
        <p>Cadastre endereços para agilizar suas compras.</p>
        <v-btn variant="outlined" color="primary" rounded="0" class="mt-2">
          Adicionar endereço
        </v-btn>
      </section>

      <section class="card">
        <v-icon size="40" color="primary">mdi-credit-card-outline</v-icon>
        <h3>Formas de pagamento</h3>
        <p>Gerencie cartões e formas de pagamento favoritas.</p>
        <v-btn variant="outlined" color="primary" rounded="0" class="mt-2">
          Adicionar cartão
        </v-btn>
      </section>
    </div>
  </v-container>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
  flex-wrap: wrap;
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
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (max-width: 700px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background-color: var(--cica-black-soft);
  border: 1px solid var(--cica-border);
  padding: 24px;
}

.card h3 {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--cica-white);
  margin: 12px 0 8px;
}

.card p {
  color: #b5b5b5;
  font-size: 14px;
  margin: 0 0 12px;
}

.card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  color: #b5b5b5;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card ul strong {
  color: var(--cica-white);
}

.empty-state {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b5b5b5;
  background-color: var(--cica-black-elevated);
  border: 1px dashed var(--cica-border);
  padding: 16px;
  margin-top: 8px;
}
</style>

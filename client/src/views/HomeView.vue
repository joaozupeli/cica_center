<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useProductsStore } from "@/stores/products";
import ProductCard from "@/components/products/ProductCard.vue";

const products = useProductsStore();

const destaques = computed(() => products.list.slice(0, 4));

onMounted(() => {
  products.fetchList({ page: 1, perPage: 4 });
});
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <span class="hero-eyebrow">Cica Center</span>
        <h1 class="hero-title">
          Rodas que <span class="text-red">transformam</span><br />
          o seu carro.
        </h1>
        <p class="hero-text">
          A linha completa das melhores rodas automotivas do Brasil.
          Performance, estilo e qualidade em um só lugar.
        </p>
        <div class="hero-actions">
          <v-btn
            color="primary"
            size="large"
            variant="flat"
            rounded="0"
            to="/produtos"
            height="52"
          >
            Ver catálogo
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
          <v-btn
            color="white"
            size="large"
            variant="outlined"
            rounded="0"
            href="#destaques"
            height="52"
          >
            Destaques
          </v-btn>
        </div>
      </div>

      <div class="hero-image">
        <img
          src="https://images.unsplash.com/photo-1626668893632-6f3a4466d109?w=1200&auto=format&fit=crop&q=80"
          alt="Roda esportiva"
        />
      </div>
    </section>

    <section class="features">
      <v-container max-width="1440">
        <div class="features-grid">
          <div class="feature">
            <v-icon size="40" color="primary">mdi-truck-fast-outline</v-icon>
            <div>
              <h4>Entrega rápida</h4>
              <p>Em todo Brasil em até 7 dias úteis</p>
            </div>
          </div>
          <div class="feature">
            <v-icon size="40" color="primary">mdi-shield-check-outline</v-icon>
            <div>
              <h4>Garantia de 1 ano</h4>
              <p>Cobertura total contra defeitos</p>
            </div>
          </div>
          <div class="feature">
            <v-icon size="40" color="primary">mdi-credit-card-outline</v-icon>
            <div>
              <h4>Parcele em 12x</h4>
              <p>Sem juros nos principais cartões</p>
            </div>
          </div>
          <div class="feature">
            <v-icon size="40" color="primary">mdi-headset</v-icon>
            <div>
              <h4>Suporte especializado</h4>
              <p>Atendimento técnico de segunda a sábado</p>
            </div>
          </div>
        </div>
      </v-container>
    </section>

    <section id="destaques" class="destaques">
      <v-container max-width="1440">
        <header class="section-header">
          <div>
            <span class="section-eyebrow">Em destaque</span>
            <h2 class="section-title">As rodas do momento</h2>
          </div>
          <v-btn
            variant="text"
            color="primary"
            to="/produtos"
            append-icon="mdi-arrow-right"
          >
            Ver todas
          </v-btn>
        </header>

        <div class="destaques-grid">
          <ProductCard
            v-for="p in destaques"
            :key="p.id"
            :product="p"
          />
        </div>
      </v-container>
    </section>
  </div>
</template>

<style scoped>
.home {
  background-color: var(--cica-black);
}

.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 48px;
  max-width: 1440px;
  margin: 0 auto;
  padding: 64px 24px;
  min-height: 540px;
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 32px 24px;
    gap: 32px;
  }
}

.hero-eyebrow {
  font-family: "Rajdhani", sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--cica-red);
}

.hero-title {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 64px;
  line-height: 1.05;
  letter-spacing: 0.01em;
  color: var(--cica-white);
  margin: 12px 0 20px;
  text-transform: uppercase;
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 44px;
  }
}

.text-red {
  color: var(--cica-red);
}

.hero-text {
  color: #b5b5b5;
  font-size: 17px;
  line-height: 1.6;
  max-width: 480px;
  margin: 0 0 32px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.hero-image {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid var(--cica-border);
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.2) contrast(1.05);
}

.features {
  background-color: var(--cica-black-soft);
  border-top: 1px solid var(--cica-border);
  border-bottom: 1px solid var(--cica-border);
  padding: 40px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

@media (max-width: 900px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}

.feature {
  display: flex;
  align-items: center;
  gap: 16px;
}

.feature h4 {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: var(--cica-white);
  letter-spacing: 0.04em;
  margin: 0 0 4px;
}

.feature p {
  font-size: 13px;
  color: #b5b5b5;
  margin: 0;
}

.destaques {
  padding: 64px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 12px;
}

.section-eyebrow {
  font-family: "Rajdhani", sans-serif;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--cica-red);
}

.section-title {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 36px;
  color: var(--cica-white);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin: 4px 0 0;
}

.destaques-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

@media (max-width: 600px) {
  .destaques-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
</style>

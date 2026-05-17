<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <v-footer color="surface" class="cica-footer pa-0">
    <v-container max-width="1440" class="py-10">
      <div class="footer-grid">
        <div>
          <div class="footer-logo mb-3">
            <span class="footer-cica">CICA</span>
            <span class="footer-center">CENTER</span>
          </div>
          <p class="footer-text">
            Rodas automotivas premium para quem busca performance e estilo.
          </p>
        </div>

        <div>
          <h4 class="footer-title">Navegue</h4>
          <ul class="footer-links">
            <li><router-link to="/">Início</router-link></li>
            <li><router-link to="/produtos">Rodas</router-link></li>
            <li><router-link to="/carrinho">Carrinho</router-link></li>
            <li><router-link to="/conta">Minha conta</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-title">Atendimento</h4>
          <ul class="footer-links">
            <li>
              <v-icon size="16" class="mr-2">mdi-phone-outline</v-icon>
              (11) 4002-8922
            </li>
            <li>
              <v-icon size="16" class="mr-2">mdi-email-outline</v-icon>
              contato@cicacenter.com.br
            </li>
            <li>
              <v-icon size="16" class="mr-2">mdi-map-marker-outline</v-icon>
              Av. Brasil, 1000 - São Paulo/SP
            </li>
          </ul>
        </div>

        <div>
          <h4 class="footer-title">Siga</h4>
          <div class="footer-social">
            <v-btn icon variant="text" color="white">
              <v-icon>mdi-instagram</v-icon>
            </v-btn>
            <v-btn icon variant="text" color="white">
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon variant="text" color="white">
              <v-icon>mdi-whatsapp</v-icon>
            </v-btn>
            <v-btn icon variant="text" color="white">
              <v-icon>mdi-youtube</v-icon>
            </v-btn>
          </div>
        </div>
      </div>

      <v-divider class="my-6" />

      <div class="footer-bottom">
        <span>© {{ year }} Cica Center. Todos os direitos reservados.</span>
        <span class="text-grey">CNPJ 00.000.000/0001-00</span>
      </div>
    </v-container>
  </v-footer>
</template>

<style scoped>
.cica-footer {
  border-top: 1px solid var(--cica-border);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

@media (max-width: 900px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}

.footer-logo {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 0.08em;
}
.footer-cica {
  color: var(--cica-red);
}
.footer-center {
  color: var(--cica-white);
  margin-left: 6px;
}

.footer-title {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cica-white);
  margin: 0 0 14px;
}

.footer-text {
  color: #b5b5b5;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer-links li,
.footer-links a {
  color: #b5b5b5;
  font-size: 14px;
  transition: color 0.2s ease;
}
.footer-links a:hover {
  color: var(--cica-red);
}

.footer-social {
  display: flex;
  gap: 6px;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: #b5b5b5;
  font-size: 13px;
}
</style>

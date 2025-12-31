import "./assets/main.css";
import { createPinia } from "pinia";
import { createApp } from "vue";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { pt } from "vuetify/locale";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import App from "./App.vue";
import router from "./router";
import { vMaska } from "maska/vue";
import vMoeda from "@/plugins/v-moeda";

const vuetify = createVuetify({
  icons: { defaultSet: "mdi" },
  components,
  directives,
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "#086035", // Verde da marca
          secondary: "#4caf50",
          accent: "#8bc34a",
          error: "#f44336",
          warning: "#ff9800",
          info: "#2196f3",
          success: "#4caf50",
        },
      },
    },
  },
  locale: { locale: "pt", fallback: "pt", messages: { pt } },
});

const app = createApp(App);
app.directive("maska", vMaska);
app.use(vMoeda);
app.use(createPinia());
app.use(vuetify);
app.use(router);
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 5000,
});
app.mount("#app");

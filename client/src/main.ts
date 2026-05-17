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

const vuetify = createVuetify({
  icons: { defaultSet: "mdi" },
  components,
  directives,
  theme: {
    defaultTheme: "cica",
    themes: {
      cica: {
        dark: true,
        colors: {
          background: "#0A0A0A",
          surface: "#141414",
          "surface-bright": "#1C1C1C",
          "surface-variant": "#1C1C1C",
          "on-surface-variant": "#FFFFFF",
          primary: "#CC0000",
          "primary-darken-1": "#A30000",
          secondary: "#1C1C1C",
          accent: "#CC0000",
          error: "#FF4444",
          warning: "#FFB020",
          info: "#2196F3",
          success: "#00C853",
          "on-primary": "#FFFFFF",
          "on-secondary": "#FFFFFF",
          "on-background": "#FFFFFF",
          "on-surface": "#FFFFFF",
        },
        variables: {
          "border-color": "#2A2A2A",
          "border-opacity": 1,
        },
      },
    },
  },
  defaults: {
    VBtn: {
      style: "text-transform: none; letter-spacing: 0.02em;",
    },
    VCard: {
      color: "surface",
    },
    VTextField: {
      variant: "outlined",
      density: "comfortable",
    },
    VSelect: {
      variant: "outlined",
      density: "comfortable",
    },
  },
  locale: { locale: "pt", fallback: "pt", messages: { pt } },
});

const app = createApp(App);
app.use(createPinia());
app.use(vuetify);
app.use(router);
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 4000,
});
app.mount("#app");

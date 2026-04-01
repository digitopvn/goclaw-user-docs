import DefaultTheme from "vitepress/theme";
import YouTube from "./components/YouTube.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("YouTube", YouTube);
  },
};

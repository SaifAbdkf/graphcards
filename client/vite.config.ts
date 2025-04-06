import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // api: "modern-compiler",
        additionalData: `@use "src/styles/mixins" as *; @import "src/styles/_variables.scss";`,
        silenceDeprecations: ["legacy-js-api"],
        //TODO https://github.com/vitejs/vite/discussions/18388 did not work see if there is something else new
      },
    },
  },
});

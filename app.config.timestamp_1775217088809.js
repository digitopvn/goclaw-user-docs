// app.config.ts
import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import solidStyled from "unplugin-solid-styled";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
var app_config_default = defineConfig({
  ssr: true,
  server: {
    preset: "node-server",
    port: Number(process.env.PORT) || 3001,
    publicAssets: [
      {
        baseURL: "/assets/",
        dir: "./public/assets"
      }
    ]
  },
  solid: {
    ssr: true
  },
  vite: {
    build: {
      ...process.env.NODE_ENV === "production" ? {
        minify: "esbuild",
        cssCodeSplit: true,
        rollupOptions: {
          output: {
            entryFileNames: "assets/[name].[hash].js",
            chunkFileNames: "assets/[name].[hash].js",
            assetFileNames: "assets/[name].[hash].[ext]"
          }
        }
      } : { sourcemap: true }
    },
    server: {
      ...process.env.NODE_ENV !== "production" ? {
        hmr: { overlay: true },
        allowedHosts: true
      } : {}
    },
    plugins: [
      tsconfigPaths(),
      tailwindcss(),
      solidStyled.vite({
        filter: {
          include: "src/**/*.tsx",
          exclude: "node_modules/**/*.{ts,js}"
        }
      })
    ]
  },
  middleware: "./src/middleware.ts"
});
export {
  app_config_default as default
};

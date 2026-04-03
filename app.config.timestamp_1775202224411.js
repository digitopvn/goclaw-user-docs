// app.config.ts
import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import solidStyled from "unplugin-solid-styled";
import compression from "vite-plugin-compression";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
var app_config_default = defineConfig({
  ssr: true,
  server: {
    preset: "node-server",
    // prerender: {
    // 	// crawlLinks: true,
    // 	routes: ['/'],
    // },
    // experimental: {
    // 	wasm: true,
    // },
    publicAssets: [
      {
        baseURL: "/assets/",
        dir: "./public/assets"
      }
    ],
    routeRules: {
      // Ensure all non-prerendered routes are always SSR
      // '/**': { swr: false },
      ...process.env.VITE_ENV != "local" ? {
        // Assets optimization with CORS, caching, and security headers
        "/assets/**": {
          static: true,
          headers: {
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Cache-Control": "public, max-age=31536000, immutable",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block"
          }
        },
        "/**/*.{webp}": {
          static: true,
          headers: {
            "content-type": "image/webp",
            "Cache-Control": "public, max-age=31536000, immutable",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block"
          }
        },
        // JS files - hashed by Vite, safe to cache aggressively
        "/**/*.{js}": {
          static: true,
          headers: {
            "Access-Control-Allow-Origin": `${process.env.VITE_BASE_URL}`,
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "content-type": "text/javascript; charset=utf-8",
            "Cache-Control": "public, max-age=31536000, immutable",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block"
          },
          cors: true
        },
        // HTML files - always revalidate to get latest hashed asset references
        "/**/*.html": {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0"
          }
        },
        // CSS files optimization - allow async loading
        "/**/*.css": {
          static: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Cache-Control": "public, max-age=31536000, immutable",
            "X-Content-Type-Options": "nosniff"
          },
          cors: true
        },
        // Font files optimization
        "/**/*.{woff,woff2,ttf,eot}": {
          static: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Cache-Control": "public, max-age=31536000, immutable"
          },
          cors: true
        },
        // 3D model files optimization
        "/**/*.{glb,gltf}": {
          static: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Cache-Control": "public, max-age=31536000, immutable",
            "Content-Type": "model/gltf-binary"
          },
          cors: true
        }
      } : {}
    }
    // 	https: {
    // 		cert: 'local_certificate/fullchain.pem',
    // 		key: 'local_certificate/privkey.pem',
    // 	},
  },
  solid: {
    ssr: true
  },
  vite: {
    optimizeDeps: {
      include: ["lodash"]
    },
    ssr: {
      // These packages ship ESM-only builds without "type":"module", which causes Node.js
      // CJS loader to fail. Bundling through Vite avoids the externalization issue.
      noExternal: ["gsap"]
    },
    build: {
      ...process.env.NODE_ENV == "production" ? {
        minify: "esbuild",
        cssCodeSplit: true,
        rollupOptions: {
          output: {
            // Ensure unique hashes for cache busting
            entryFileNames: "assets/[name].[hash].js",
            chunkFileNames: "assets/[name].[hash].js",
            assetFileNames: "assets/[name].[hash].[ext]",
            manualChunks: {
              vendor: ["@solidjs/router"],
              ui: ["@solidjs/meta"]
            }
          }
        },
        chunkSizeWarningLimit: 1e3
      } : {
        sourcemap: true
      }
    },
    server: {
      // renderMode: 'async',
      ...process.env.NODE_ENV == "production" ? {} : {
        hmr: {
          overlay: true
          // Hiển thị lỗi overlay
        },
        allowedHosts: true
      },
      // Để dễ debug
      // Note the dot prefix - matches any subdomain of ult.vn
      // host: '0.0.0.0',
      // Increase max HTTP header size for large data transfers (chapters with many pages)
      maxHttpHeaderSize: 16 * 1024
      // 16KB
    },
    plugins: [
      tsconfigPaths(),
      tailwindcss(),
      solidStyled.vite({
        filter: {
          include: "src/**/*.tsx",
          exclude: "node_modules/**/*.{ts,js}"
        }
      }),
      // Add compression plugin for production builds
      ...process.env.NODE_ENV === "production" ? [
        compression({
          algorithm: "gzip",
          ext: ".gz"
        }),
        compression({
          algorithm: "brotliCompress",
          ext: ".br"
        })
      ] : []
    ]
  },
  middleware: "./src/middleware.ts"
});
export {
  app_config_default as default
};

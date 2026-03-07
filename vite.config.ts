import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy vendor libs into their own chunks for better caching
          "vendor-react": ["react", "react-dom"],
          "vendor-framer": ["framer-motion"],
          "vendor-ui": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-select",
            "@radix-ui/react-toggle-group",
            "@radix-ui/react-switch",
          ],
        },
      },
    },
  },
}));

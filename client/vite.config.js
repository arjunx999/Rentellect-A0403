import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, 
    strictPort: true,
    port: 5173,
    // allowedHosts: ['.loca.lt'] // ← allow all localtunnel subdomains
  }
});

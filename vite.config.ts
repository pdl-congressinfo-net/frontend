import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import mkcert from "vite-plugin-mkcert";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), mkcert()],
    define: {
      __API_DATA_PROVIDER__: JSON.stringify(env.API_DATA_PROVIDER),
    },
  };
});

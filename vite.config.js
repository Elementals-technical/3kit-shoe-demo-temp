import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default {
  server: {
    open: true,
    port: 8000,
    proxy: {},
    host: "0.0.0.0", // allow external connections
  },
  plugins: [react(), visualizer()],
};

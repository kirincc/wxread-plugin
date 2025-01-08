import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/content/content.tsx"),
      name: "content",
      formats: ["iife"],
      fileName: () => "content/content.js",
    },
    outDir: "dist",
    emptyOutDir: false,  // 不要清空 dist 目录，因为它包含了 popup 的构建结果
    sourcemap: true,
    rollupOptions: {
      output: {
        extend: true,
      },
    },
  },
  plugins: [],  // content script 不需要 React
});

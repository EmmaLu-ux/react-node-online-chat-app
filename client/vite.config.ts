import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "path"

const chunkMatchers = [
  {
    name: "react",
    pattern:
      /node_modules\/\.pnpm\/react(@|\/)|node_modules\/\.pnpm\/react-dom/,
  },
  { name: "router", pattern: /node_modules\/\.pnpm\/react-router-dom/ },
  { name: "emoji-picker", pattern: /node_modules\/\.pnpm\/emoji-picker-react/ },
  { name: "socket", pattern: /node_modules\/\.pnpm\/socket\.io-client/ },
  { name: "moment", pattern: /node_modules\/\.pnpm\/moment/ },
  {
    name: "lottie",
    pattern:
      /node_modules\/\.pnpm\/lottie-web|node_modules\/\.pnpm\/react-lottie/,
  },
  { name: "zustand", pattern: /node_modules\/\.pnpm\/zustand/ },
  { name: "radix", pattern: /node_modules\/\.pnpm\/@radix-ui/ },
]

const getPackageChunk = (id: string) => {
  const match = id.split("node_modules/").pop()
  if (!match) return "vendor"
  const segments = match.split("/")
  const [first, second] = segments
  const name = match.startsWith("@") ? `${first}-${second ?? "pkg"}` : first
  return name.replace(/[@.]/g, "-")
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return
          const matched = chunkMatchers.find(({ pattern }) => pattern.test(id))
          if (matched) return matched.name
          return getPackageChunk(id)
        },
      },
    },
  },
})

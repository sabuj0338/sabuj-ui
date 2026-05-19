// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"

// https://astro.build/config
export default defineConfig({
  site: "https://sabujui.com", // You can change this to your actual production domain
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
})

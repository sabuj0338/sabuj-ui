// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"

// https://astro.build/config
export default defineConfig({
  site: "https://sabuj0338.github.io",
  base: "/sabuj-ui/",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
})

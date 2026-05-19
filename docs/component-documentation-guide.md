# Component documentation guide

Use this guide when adding a new custom component to the Sabuj UI documentation site.

## Goal

Every documented component should have its own page under `src/pages/components` with:

- a component overview card on the landing page
- a dedicated route, for example `/components/timeline/`
- a left-menu link back to the overview and sibling components
- preview visible by default
- copy button for the full component source
- download button for the component source file
- preview/code tabs or a show-code control
- usage example
- exports list
- props/variants table or cards
- install notes for required dependencies and local helpers

## File locations

- Component source: `src/components/ui/{component-name}.tsx`
- Landing page overview: `src/pages/index.astro`
- Component documentation page: `src/pages/components/{component-name}.astro`
- Shared layout: `src/layouts/main.astro`
- Global Tailwind and shadcn tokens: `src/styles/global.css`
- Utilities: `src/lib/utils.ts`

## Steps for an AI agent

1. Read the component source in `src/components/ui`.
2. Identify the component exports, public props, variant props, required dependencies, and any local helpers.
3. Create a dedicated documentation page in `src/pages/components/{component-name}.astro`.
4. Import the component and its raw source in that component page.

```astro
---
import { ExampleComponent } from "@/components/ui/example-component"
import exampleComponentCode from "@/components/ui/example-component.tsx?raw"
---
```

5. Add a component metadata object with `id`, `name`, `description`, `file`, `source`, `exports`, `dependencies`, and `props`.
6. Add or update the component overview card in `src/pages/index.astro`.
7. Add the component to the docs page left navigation.
8. Build the component page with this structure:

- header with component name, description, Copy, Download, and Show code buttons
- preview panel first
- source panel using `<code id="{id}-source">{source}</code>`
- usage example
- exports list
- props or variants reference
- install notes

9. Use these data attributes so copy/download behavior stays consistent:

```astro
<button data-copy-target="example-source">Copy</button>
<button data-download-target="example-source" data-download-file="example-component.tsx">
  Download
</button>
<pre><code id="example-source">{exampleComponentCode}</code></pre>
```

10. Keep the preview realistic. Show common states, variants, disabled/loading states, and responsive behavior when relevant.
11. Run formatting and verification.

```bash
pnpm run format
pnpm run lint
pnpm run build
```

## Writing standards

- Put the preview before code.
- Keep descriptions short and practical.
- Explain dependencies in install notes.
- Use Tailwind classes and existing shadcn CSS variables.
- Keep the home page as an overview, not full component documentation.
- Do not add all component docs to `src/pages/index.astro`.
- Keep copy/download/show-code behavior consistent across all component sections.

## Optional Starlight migration note

Astro Starlight is a strong fit for larger multi-page documentation. This project currently uses custom Astro pages so the component preview, source, copy, download, and shadcn styling can stay fully controlled. If the catalog grows much larger, migrate the same per-component route pattern into Starlight pages.

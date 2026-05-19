# Component documentation guide

Use this guide when adding a new custom component to the Sabuj UI documentation site.

## Goal

Every documented component should have a landing-page section with:

- a left-menu anchor
- preview visible by default
- copy button for the full component source
- download button for the component source file
- show code button for the hidden full source
- usage example
- exports list
- props/variants table or cards
- install notes for required dependencies and local helpers

## File locations

- Component source: `src/components/ui/{component-name}.tsx`
- Main documentation page: `src/pages/index.astro`
- Shared layout: `src/layouts/main.astro`
- Global Tailwind and shadcn tokens: `src/styles/global.css`
- Utilities: `src/lib/utils.ts`

## Steps for an AI agent

1. Read the component source in `src/components/ui`.
2. Identify the component exports, public props, variant props, required dependencies, and any local helpers.
3. Import the component and its raw source in `src/pages/index.astro`.

```astro
---
import { ExampleComponent } from "@/components/ui/example-component"
import exampleComponentCode from "@/components/ui/example-component.tsx?raw"
---
```

4. Add a component metadata object with `id`, `name`, `description`, `file`, `source`, `exports`, and `props`.
5. Add the component to the left navigation.
6. Add a new component section with this structure:

- header with component name, description, Copy, Download, and Show code buttons
- preview panel first
- hidden source panel using `<code id="{id}-source">{source}</code>`
- usage example
- exports list
- props or variants reference
- install notes

7. Make the section anchor match the component id, for example `id="timeline"`.
8. Use these data attributes so the existing page script works:

```astro
<button data-copy-target="example-source">Copy</button>
<button data-download-target="example-source" data-download-file="example-component.tsx">
  Download
</button>
<button data-toggle-code="example-code" aria-expanded="false">Show code</button>

<div id="example-code" class="hidden" data-code-panel>
  <pre><code id="example-source">{exampleComponentCode}</code></pre>
</div>
```

9. Keep the preview realistic. Show common states, variants, disabled/loading states, and responsive behavior when relevant.
10. Run formatting and verification.

```bash
pnpm run format
pnpm run build
```

## Writing standards

- Put the preview before code.
- Keep descriptions short and practical.
- Explain dependencies in install notes.
- Use Tailwind classes and existing shadcn CSS variables.
- Do not add a separate landing page or marketing section for each component.
- Keep copy/download/show-code behavior consistent across all component sections.

## Optional Starlight migration note

Astro Starlight is a strong fit for multi-page documentation. This project currently uses a custom single-page catalog because the requested component actions are landing-page focused. If the catalog grows large, migrate each component section into a Starlight page and keep the same preview, source, copy, and download pattern inside reusable docs components.

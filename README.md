# Sabuj UI

An Astro documentation site for custom React components built with Tailwind CSS
and shadcn/ui conventions.

The landing page is the component catalog. Each component section includes a live
preview, usage notes, props, source code, and copy/download actions.

## Development

```bash
pnpm install
pnpm run dev
```

## Documenting components

Use `docs/component-documentation-guide.md` as the repeatable guide for adding
new component documentation. It is written so you can hand it to an AI agent when
you add another component to `src/components/ui`.

## Verification

```bash
pnpm run format
pnpm run build
```

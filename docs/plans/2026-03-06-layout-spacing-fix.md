# Layout & Spacing Fix — Design

**Goal:** Fix inconsistent container widths, padding, and section spacing across all portfolio sections. Content should look good from mobile to ultrawide.

## Changes

### Container System (all sections)
- Outer padding: `px-6 md:px-12 lg:px-20` (consistent everywhere)
- Inner container: `max-w-6xl mx-auto` (up from `max-w-4xl`)
- Vertical padding: `py-24 sm:py-32 lg:py-40` (more breathing room)
- No dividers — padding alone creates separation

### Projects Grid
- Switch to `grid-cols-1 md:grid-cols-2` (always 2-col on desktop, clean pairs)

### About Section
- Stats row: `max-w-3xl` -> `max-w-4xl`
- Timeline/interests grid: remove `max-w-4xl` constraint, use full container width
- Bio text: unchanged (`max-w-2xl mx-auto text-center`)

## Files to Modify
- `src/components/Hero.tsx` — padding + container
- `src/components/About.tsx` — padding + container + inner widths
- `src/components/Skills.tsx` — padding + container
- `src/components/Projects.tsx` — padding + container + grid cols
- `src/components/AIAgents.tsx` — padding + container
- `src/components/Contact.tsx` — padding + container

## Not Changed
- globals.css, layout.tsx, ParticleField — no structural changes needed

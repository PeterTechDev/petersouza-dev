# Layout & Spacing Fix — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix inconsistent container widths, padding, and section spacing so the portfolio looks good from mobile to ultrawide.

**Architecture:** Pure CSS class changes across 6 component files. No new logic, no new dependencies. Every section gets the same container pattern: consistent outer padding, wider max-width, more vertical breathing room.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4

---

## Reference: Class Changes

These values are used across all tasks:

| Property | Old (varies) | New (consistent) |
|----------|-------------|-------------------|
| Section padding (horizontal) | `px-5 sm:px-6` / `px-6 sm:px-8` / `px-6 sm:px-10 lg:px-16` | `px-6 md:px-12 lg:px-20` |
| Section padding (vertical) | `py-20 sm:py-28 lg:py-32` / `py-32 md:py-40` | `py-24 sm:py-32 lg:py-40` |
| Inner container | `max-w-3xl` / `max-w-4xl` | `max-w-6xl` |

---

## Commit Strategy

All changes in a single commit — they are one logical unit (layout system).

Branch: `fix/layout-spacing` (create from `main`).

---

### Task 1: Update Hero.tsx

**Files:**
- Modify: `src/components/Hero.tsx:16`

**Step 1: Change section classes**

Line 16 — change:
```
className="py-32 md:py-40 flex flex-col items-center justify-center px-5 sm:px-6 relative"
```
To:
```
className="py-24 sm:py-32 lg:py-40 flex flex-col items-center justify-center px-6 md:px-12 lg:px-20 relative"
```

Hero doesn't have a `max-w` inner div because it uses `text-center max-w-4xl` on the content div (line 23). Update that too:

Line 23 — change:
```
className="text-center max-w-4xl"
```
To:
```
className="text-center max-w-6xl"
```

---

### Task 2: Update About.tsx

**Files:**
- Modify: `src/components/About.tsx:25, 50, 108`

**Step 1: Change section padding**

Line 25 — change:
```
className="py-20 sm:py-28 lg:py-32 px-6 sm:px-8"
```
To:
```
className="py-24 sm:py-32 lg:py-40 px-6 md:px-12 lg:px-20"
```

**Step 2: Widen stats row**

Line 50 — change:
```
className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 mb-14"
```
To:
```
className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 mb-14"
```

**Step 3: Remove max-w constraint on timeline/interests grid**

Line 108 — change:
```
className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 mb-10"
```
To:
```
className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 mb-10"
```

---

### Task 3: Update Skills.tsx

**Files:**
- Modify: `src/components/Skills.tsx:36-37`

**Step 1: Change section padding and container**

Line 36 — change:
```
className="py-20 sm:py-28 lg:py-32 px-6 sm:px-10 lg:px-16"
```
To:
```
className="py-24 sm:py-32 lg:py-40 px-6 md:px-12 lg:px-20"
```

Line 37 — change:
```
className="max-w-4xl mx-auto"
```
To:
```
className="max-w-6xl mx-auto"
```

---

### Task 4: Update Projects.tsx

**Files:**
- Modify: `src/components/Projects.tsx:55-56, 88`

**Step 1: Change section padding and container**

Line 55 — change:
```
className="py-20 sm:py-28 lg:py-32 px-6 sm:px-10 lg:px-16"
```
To:
```
className="py-24 sm:py-32 lg:py-40 px-6 md:px-12 lg:px-20"
```

Line 56 — change:
```
className="max-w-4xl mx-auto"
```
To:
```
className="max-w-6xl mx-auto"
```

**Step 2: Simplify grid to 2-col**

Line 88 — change:
```
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```
To:
```
className="grid grid-cols-1 md:grid-cols-2 gap-6"
```

---

### Task 5: Update AIAgents.tsx

**Files:**
- Modify: `src/components/AIAgents.tsx:53-54`

**Step 1: Change section padding and container**

Line 53 — change:
```
className="py-20 sm:py-28 lg:py-32 px-6 sm:px-10 lg:px-16"
```
To:
```
className="py-24 sm:py-32 lg:py-40 px-6 md:px-12 lg:px-20"
```

Line 54 — change:
```
className="max-w-4xl mx-auto"
```
To:
```
className="max-w-6xl mx-auto"
```

---

### Task 6: Update Contact.tsx

**Files:**
- Modify: `src/components/Contact.tsx:13-14`

**Step 1: Change section padding**

Line 13 — change:
```
className="py-20 sm:py-28 lg:py-32 px-6 sm:px-10 lg:px-16"
```
To:
```
className="py-24 sm:py-32 lg:py-40 px-6 md:px-12 lg:px-20"
```

**Step 2: Widen container**

Line 14 — change:
```
className="max-w-3xl mx-auto text-center"
```
To:
```
className="max-w-6xl mx-auto text-center"
```

Note: Contact text content is already constrained by `max-w-2xl` on inner elements, so widening the outer container just gives consistent padding.

---

### Task 7: Verify and commit

**Step 1: Type-check**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 2: Create branch, commit, and push**

```bash
git checkout -b fix/layout-spacing
git add src/components/Hero.tsx src/components/About.tsx src/components/Skills.tsx src/components/Projects.tsx src/components/AIAgents.tsx src/components/Contact.tsx
git commit -m "fix: consistent container widths, padding, and spacing across all sections"
git push -u origin fix/layout-spacing
```

**Step 3: Create PR**

```bash
gh pr create --title "fix: consistent layout spacing across all sections" --body "..."
```

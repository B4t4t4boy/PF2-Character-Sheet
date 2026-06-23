# Character Sheet - Alternative Tech Stack Plans

Both plans target a **Pathfinder 1e/2e Character Sheet** application with:
- Dense, grid-based tabular layouts (like Roll20)
- Auto-calculating fields (modifiers, BAB, saves, AC, CMB/CMD, etc.)
- Repeating sections (classes, skills, weapons, spells)
- Save/Load character data as JSON
- Export to PDF
- Offline-capable
- Cross-platform (web-first, desktop possible via wrapper)

---

## Plan A: React + Vite + Zustand + Tailwind (PWA)

### Stack
| Layer | Technology |
|---|---|
| **UI Framework** | React 18/19 with functional components + hooks |
| **Build Tool** | Vite (fast HMR, tree-shaking) |
| **State Management** | Zustand (lightweight, reactive, computed values via `subscribeWithSelector`) |
| **Styling** | Tailwind CSS 4 (utility-first, dense layouts) |
| **Persistence** | localStorage + IndexedDB via idb-keyval (save/load JSON) |
| **Routing** | React Router (tabs: Main, Combat, Skills, Spells, Gear) |
| **PDF Export** | `window.print()` with `@media print` styles |
| **Dev/Deploy** | `npm run dev` for dev; `npm run build` for static deploy |
| **Desktop (optional)** | Wrap with Tauri v2 or Electron later |

### Why it fits
- **React** is the most widely used framework with massive ecosystem. Components map naturally to sheet sections (AbilityScores, Defenses, SkillsGrid).
- **Zustand** provides computed/getter patterns perfect for auto-calculations (e.g., `getModifier(score)` recomputed on any score change).
- **Tailwind CSS** makes dense, grid-heavy Roll20-like layouts straightforward with `grid-cols-*`, `gap-*`, and `text-xs`.
- **PWA** means the character sheet loads in a browser and works offline with no install.
- Simple deployment: just a static `dist/` folder on any host or GitHub Pages.

### Structure
```
char-sheet/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── store/
│   │   └── characterStore.ts       # Zustand store with auto-calc logic
│   ├── data/
│   │   └── classes.ts              # PF1e class progression tables
│   │   └── skills.ts               # Skill definitions
│   ├── components/
│   │   ├── Header.tsx              # Character name, class/level, alignment, etc.
│   │   ├── AbilityScores.tsx       # STR/DEX/CON/INT/WIS/CHA grid
│   │   ├── Defenses.tsx            # HP, AC, Saves grids
│   │   ├── Offense.tsx             # Initiative, BAB, CMB, CMD
│   │   ├── Skills.tsx              # Full skill list with ranks
│   │   ├── Classes.tsx             # Multi-class progression table
│   │   ├── Toolbar.tsx             # Save/Load/PDF buttons
│   │   └── ui/                     # Reusable inputs, buttons, grid helpers
│   ├── hooks/
│   │   └── useAutoCalc.ts          # Hook for reactive modifier updates
│   ├── utils/
│   │   ├── math.ts                 # calculateModifier, BAB formula, save formula
│   │   └── persistence.ts          # saveCharacter, loadCharacter
│   └── styles/
│       └── print.css               # @media print overrides
```

---

## Plan B: Svelte 5 + SvelteKit (static) + Dexie.js + Unocss

### Stack
| Layer | Technology |
|---|---|
| **UI Framework** | Svelte 5 (runes: `$state`, `$derived`, `$effect`) |
| **Meta-Framework** | SvelteKit (static adapter, SPA mode) |
| **Styling** | UnoCSS (on-demand utility CSS, Tailwind-compatible) |
| **Persistence** | Dexie.js (IndexedDB wrapper, powerful queries) |
| **State** | Svelte 5 built-in runes (no extra library needed) |
| **PDF Export** | `window.print()` + print CSS |
| **Desktop (optional)** | Tauri v2 or Capacitor |

### Why it fits
- **Svelte 5** has `$derived` runes that are *perfect* for auto-calculations — just declare `let mod = $derived(calcMod(score))` and it updates reactively with zero boilerplate.
- **SvelteKit** with `@sveltejs/adapter-static` produces a pure static site (zero server needed), deployable to any static host.
- **Dexie.js** wraps IndexedDB for robust offline storage of multiple characters with search/filter capabilities.
- **UnoCSS** generates only the CSS classes used, keeping the bundle tiny — important for a dense sheet with many utility classes.
- **Minimal dependencies**: Svelte's reactivity is built-in; no external state management library needed.
- **Smaller bundle**: Svelte compiled output is significantly smaller than React, making initial load faster.

### Structure
```
char-sheet/
├── package.json
├── svelte.config.js
├── vite.config.ts
├── unocss.config.ts
├── src/
│   ├── app.html
│   ├── app.ts
│   ├── routes/
│   │   ├── +layout.svelte         # Main layout with tab navigation
│   │   ├── +page.svelte           # Main tab (abilities, defenses, offense)
│   │   ├── skills/
│   │   │   └── +page.svelte       # Skills tab
│   │   ├── combat/
│   │   │   └── +page.svelte       # Combat stats, weapons
│   │   ├── spells/
│   │   │   └── +page.svelte       # Spellcasting tab
│   │   └── gear/
│   │       └── +page.svelte       # Inventory/equipment tab
│   ├── lib/
│   │   ├── stores/
│   │   │   └── character.svelte.ts   # Svelte 5 runes-based character store
│   │   ├── data/
│   │   │   ├── classes.ts
│   │   │   └── skills.ts
│   │   ├── components/
│   │   │   ├── Header.svelte
│   │   │   ├── AbilityScores.svelte
│   │   │   ├── Defenses.svelte
│   │   │   ├── Skills.svelte
│   │   │   ├── Classes.svelte
│   │   │   ├── Toolbar.svelte
│   │   │   └── ui/
│   │   │       ├── GridInput.svelte
│   │   │       └── ReadOnlyField.svelte
│   │   ├── utils/
│   │   │   ├── math.ts
│   │   │   └── persistence.ts
│   │   └── db.ts                   # Dexie.js database setup
│   └── styles/
│       └── print.css
```

---

## Comparison Table

| Feature | Plan A (React + Zustand + Tailwind) | Plan B (Svelte 5 + Dexie + UnoCSS) |
|---|---|---|
| **Bundle size** | ~40-50KB gzip | ~15-25KB gzip |
| **Auto-calc reactivity** | Zustand `subscribe` + manual selectors | Native `$derived` runes (zero boilerplate) |
| **Learning curve** | Moderate (React ecosystem knowledge) | Lower (Svelte is simpler) |
| **Ecosystem size** | Largest (most libs/templates) | Smaller but growing |
| **Multi-character storage** | Manual IndexedDB via idb-keyval | Dexie.js (battle-tested, queryable) |
| **Desktop wrapper** | Tauri v2 or Electron | Tauri v2 or Electron |
| **PDF Export** | `window.print()` + print CSS | `window.print()` + print CSS |
| **TypeScript support** | Excellent | Excellent |
| **Hottest in 2026** | Stable, mature | Gaining traction, v5 is a leap |

---

## Recommendation

For a **dense, calculation-heavy character sheet** where reactivity is critical (changing STR auto-updates mod, CMB, CMD, skill checks, etc.), **Plan B (Svelte 5)** has a natural advantage — `$derived` runes handle cascading auto-calculations without any state management library overhead.

However, **Plan A (React)** is a safer choice if you value the largest ecosystem, most tutorials/examples, and the widest hiring pool.

Both plans are viable. Which direction would you like to go?
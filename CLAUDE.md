# SC-Companion — CLAUDE.md

Personal Star Citizen fleet/asset tracker. Static site deployed on GitHub Pages. All data lives client-side in `localStorage` with JSON import/export for cross-device sync and backups.

**Initial scope: Hangar module only.** Architecture must cleanly support Inventory, Crafting, Cargo/Trade, Mining, and Missions modules in future phases without refactoring core layout, routing, or theme.

---

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build tool:** Vite
- **Routing:** React Router v6 — `HashRouter` (required for GitHub Pages SPA routing)
- **State:** React Context + custom hooks (no Redux/Zustand)
- **Persistence:** `localStorage` wrapper with versioned schema
- **Styling:** Tailwind CSS + CSS modules for component-scoped tweaks
- **Icons:** `lucide-react`
- **Forms:** `react-hook-form` + `zod`
- **Bottom sheets:** `vaul` (Radix-based)
- **PWA:** `vite-plugin-pwa` — include in initial build
- **Fonts:** Aldrich (headings/display), Inter (body), JetBrains Mono (IDs/timestamps/technical data) — self-hosted
- **Deployment:** GitHub Actions → `gh-pages` branch

---

## Visual Theme: RSI Corporate

Inspired by robertsspaceindustries.com — clean, dark, minimal, corporate. **Not** a generic AI dashboard — no purple gradients, no glassmorphism, no generic Tailwind template feel.

### Color Tokens

```css
--bg-void:          #0a0e14   /* near-black base */
--bg-panel:         #11171f   /* card/panel surface */
--bg-elevated:      #1a2230   /* hover, dropdown, modal surface */
--border-subtle:    #1f2937   /* dividers, card borders */
--border-active:    #2a3a52   /* focused inputs, active tabs */
--accent-cyan:      #00b3d6   /* primary RSI cyan — links, buttons, active states */
--accent-cyan-dim:  #007a94   /* hover-darken of cyan */
--accent-glow:      #00d4ff   /* hover-glow accents, focus rings (use sparingly) */
--text-primary:     #e6edf3   /* main text */
--text-secondary:   #8b97a8   /* labels, captions, muted text */
--text-disabled:    #4a5568
--status-ready:     #00d97e   /* green — Ready */
--status-delivery:  #f5a623   /* amber — In Delivery */
--status-destroyed: #e64545   /* red — Destroyed */
--status-stored:    #6b7280   /* gray — Stored (future) */
```

### Layout Rules

- **No rounded-everything.** `rounded-none` or max `rounded-sm` (2px) for corporate/technical feel. Softer rounding only for status badges.
- **1px borders** in `--border-subtle` everywhere. Cards are defined by border, not shadow.
- **Generous whitespace.** Don't pack the UI. Mimic RSI's airy spacing.
- **Uppercase + `tracking-wide`** for section headers and table column headers (e.g., `MANUFACTURER`, `STATUS`, `LOCATION`).
- **Monospace** (`JetBrains Mono`) for IDs, dates, and technical/data fields.
- **Subtle hover states** — 1–2% lighten on background. Never glow effects except on primary CTA buttons.

### Header / Nav

- Fixed top bar: 56px height, `--bg-panel` background, 1px bottom border in `--accent-cyan-dim` at 30% opacity
- Left: wordmark in Aldrich, cyan
- Center (desktop `md:+`): tab strip — HANGAR, INVENTORY, CRAFTING, CARGO, MINING, MISSIONS
- Right: import/export icon buttons, settings cog
- Coming-soon tabs: `--text-disabled` color + small "SOON" tag, not clickable

---

## Mobile-First Design

**Phone-only in practice.** Desktop is a bonus, not a target.

- Single-column layout by default; two-column grid only at `md:` (768px+)
- Touch targets minimum 44×44px
- Primary actions (Add Ship FAB, save buttons) in bottom-right / bottom-center — thumb zone
- **Bottom sheets, not centered modals.** Use `vaul` for all sheet primitives
- No hover-dependent UI — everything works on tap

### Mobile Nav

On `<768px`: hamburger icon (left) | wordmark (center) | import/export icon (right).  
Tapping hamburger opens a left-side drawer with the full nav list (coming-soon items greyed out with SOON tag).  
At `md:`, switch to horizontal tab strip.

### Input UX

- `type="url"` for build links, `type="date"` for acquired date, `type="search"` for search box
- Autocomplete dropdowns: full-width list below input, large tap targets
- Ship add/edit form has ~9 fields — let the bottom sheet scroll; don't cram into one viewport

### Safe Areas

Use `env(safe-area-inset-bottom)` for the FAB and any bottom-anchored UI.

---

## Data Layer

### Storage Keys

- Primary: `holo-manifest:v1`
- Auto-backup (previous state): `holo-manifest:v1:backup`

### AppData Schema

```ts
interface AppData {
  schemaVersion: 1;
  exportedAt?: string;        // ISO timestamp, set on export
  hangar: Ship[];
  // Future modules:
  // inventory?: InventoryItem[];
  // crafting?: CraftingProject[];
  // cargo?: CargoEntry[];
  // mining?: MiningRun[];
  // missions?: Mission[];
  meta: {
    createdAt: string;
    lastModifiedAt: string;
  };
}
```

### Schema Versioning

On import, check `schemaVersion`:
- Same version → load directly
- Lower version → run sequential migration functions (`migrate_v1_to_v2`, etc.)
- Higher version → reject with error: "Export is from a newer version of SC-Companion"

Build the migration scaffold now even though only v1 exists.

### Import / Export

- **Export:** `sc-companion-export-YYYY-MM-DD.json`, pretty-printed (2-space indent)
- **Import:** File picker → parse → zod validate → confirmation modal ("This will replace N ships in your current hangar. Continue?") → write → reload state. Never merge silently. Offer "download current data first" button in the confirmation modal.
- **Auto-backup:** On every mutation, write previous state to `holo-manifest:v1:backup`. Surface as "Restore previous state" in settings.

---

## Hangar Module

### Ship Data Model

```ts
interface Ship {
  id: string;              // UUID v4
  name: string;            // User's custom name (e.g., "Polaris 'Last Word'")
  model: string;           // Ship model (e.g., "Polaris")
  manufacturer: string;    // e.g., "RSI", "Aegis", "Anvil"
  status: 'ready' | 'in_delivery' | 'destroyed';
  location: string;        // Free text — station/planet/etc.
  buildLink?: string;      // Optional URL to a saved loadout/build
  buildSiteName?: string;  // Optional display name (e.g., "Erkul")
  notes?: string;
  acquiredAt?: string;     // Optional ISO date
  createdAt: string;       // ISO date — when entry was created in app
  updatedAt: string;       // ISO date — last edited
}
```

### Ship Reference Data (`src/data/ships.ts`)

Static bundled list of SC ships + manufacturers for **autocomplete suggestions only** — not for validation. Users must always be able to type a custom value.

Minimum ships to include: Polaris, Perseus, Galaxy, Liberator, Ironclad, Ironclad Assault, Hull B, Paladin, Super Hornet Heartseeker, Sabre Firebird, Moth, Aurora MK II, plus Constellation variants, Carrack, 600i, Cutlass variants, Freelancer variants, Hornet variants, and other common fleet ships. Target ~80–100 entries.

### Ship Images

Fetch thumbnails at runtime from the `star-citizen.wiki` API (has proper attribution). This works fine on GitHub Pages since it's a client-side fetch. Skip silently if the API fails or a ship isn't found — no broken image states.

### Hangar UI

**Card list view.** One card per ship, stacked vertically on mobile, 2-column grid on `md:+`.

Each card shows:
- Ship name (large, Aldrich)
- Model + manufacturer (small, muted)
- Ship thumbnail (via star-citizen.wiki API, graceful fallback)
- Status badge (colored pill)
- Location (with map-pin icon)
- Build link button (if present)

Tap anywhere on card → edit bottom sheet.

### Filters / Sort Bar

Above the list:
- Search box: filters across name, model, manufacturer, location
- Status filter: chip-style toggles (READY / IN DELIVERY / DESTROYED), single-row scrollable on mobile
- Manufacturer filter: "More filters" collapsible sheet on mobile, populated from current fleet
- Sort: Name / Model / Manufacturer / Status / Date Added (compact dropdown)

### Add Ship FAB

56px diameter, cyan background, `+` icon, 16px from screen edges (bottom-right). Drop shadow (the one place shadow is acceptable). Opens Add Ship bottom sheet.

### Add/Edit Ship Form

Bottom sheet, ~85% viewport height, swipe-down or backdrop-tap to dismiss. Fields in order:

1. Ship Model* (autocomplete from bundled list, custom allowed)
2. Manufacturer (auto-fills from model if in bundled list, editable)
3. Custom Name (optional — defaults to model name if blank)
4. Status* (radio buttons with colored dots: Ready / In Delivery / Destroyed)
5. Location (free text — placeholder: "Port Olisar", "Area18 - Riker Memorial", "In Transit")
6. Build Link (URL field, optional)
7. Build Site Name (text, optional, only enabled if build link is filled — placeholder: "Erkul")
8. Acquired Date (date picker, optional)
9. Notes (textarea, optional)

Validation via zod. Cancel discards changes. Save writes to localStorage and dismisses sheet.

### Empty State

- Centered `Rocket` icon from lucide-react (cyan outline)
- Heading: "NO SHIPS REGISTERED"
- Subtext: "Add your first ship to begin tracking your fleet."
- Primary "ADD SHIP" button
- Secondary "IMPORT FROM JSON" link

---

## Routing Structure

Using `HashRouter` for GitHub Pages:

```
/#/          → redirect to /#/hangar
/#/hangar    → hangar list view
/#/settings  → import/export, theme prefs, danger zone (clear all data)
/#/about     → app info, version, link to GitHub repo

# Placeholder routes (render ComingSoon component):
/#/inventory
/#/crafting
/#/cargo
/#/mining
/#/missions
```

Set up all placeholder routes now so nav tabs are wired and adding a module later is just dropping in a component.

---

## File / Folder Structure

```
sc-companion/
├── .github/workflows/deploy.yml    # GH Pages deploy on push to main
├── public/
│   └── favicon.svg                 # cyan stylized "SC" geometric mark
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx        # top nav + main content slot
│   │   │   ├── TopNav.tsx
│   │   │   └── ComingSoon.tsx      # placeholder for unimplemented modules
│   │   ├── hangar/
│   │   │   ├── HangarPage.tsx
│   │   │   ├── ShipCard.tsx
│   │   │   ├── ShipFormSheet.tsx
│   │   │   ├── HangarFilters.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── settings/
│   │   │   └── SettingsPage.tsx
│   │   └── ui/                     # shared primitives
│   │       ├── Button.tsx
│   │       ├── BottomSheet.tsx     # wraps vaul drawer
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── Autocomplete.tsx
│   │       ├── StatusBadge.tsx
│   │       └── ConfirmDialog.tsx
│   ├── data/
│   │   └── ships.ts                # bundled ship reference list
│   ├── hooks/
│   │   ├── useAppData.ts           # main data hook (read/write all modules)
│   │   ├── useHangar.ts            # hangar-specific operations
│   │   └── useLocalStorage.ts      # generic localStorage wrapper
│   ├── lib/
│   │   ├── storage.ts              # localStorage read/write/backup
│   │   ├── schema.ts               # zod schemas + TypeScript types
│   │   ├── migrations.ts           # version migration functions
│   │   └── export-import.ts        # JSON export/import handlers
│   ├── styles/
│   │   ├── globals.css             # Tailwind directives + CSS vars
│   │   └── tokens.css              # color/spacing/typography vars
│   ├── App.tsx                     # router setup
│   └── main.tsx                    # React entry
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts                  # base: '/sc-companion/' for GH Pages
└── README.md
```

---

## GitHub Pages Deployment

`vite.config.ts` must set `base: '/sc-companion/'`.

GitHub Actions workflow (`.github/workflows/deploy.yml`) on every push to `main`:
1. Checkout
2. Setup Node 20
3. `npm ci`
4. `npm run build`
5. Deploy `dist/` to `gh-pages` branch via `peaceiris/actions-gh-pages@v3`

GH Pages source: "Deploy from a branch" → `gh-pages` / root.

---

## PWA Setup

Include in initial build via `vite-plugin-pwa`:
- `manifest.json` with app name, cyan theme color, app icon
- Service worker for offline support (localStorage data is already local)
- Full-screen mode (no browser chrome when installed)
- Supports "Add to Home Screen" on iOS Safari

---

## Build Order

### Phase A — Foundation
1. Scaffold Vite + React + TS + Tailwind (mobile-first)
2. Routing, AppShell, TopNav (hamburger drawer on mobile, tab strip on `md:+`) with all module tabs (most disabled)
3. Storage layer (localStorage wrapper, schema, migrations, zod validators)
4. Import/export with confirmation modal and auto-backup
5. Design system primitives (Button, BottomSheet via vaul, Input, Select, Autocomplete, StatusBadge, ConfirmDialog)
6. Theme tokens, fonts, base styles, safe-area handling
7. PWA setup via `vite-plugin-pwa`

### Phase B — Hangar
8. Bundled ship reference data (`src/data/ships.ts`)
9. HangarPage with empty state
10. ShipFormSheet (add/edit bottom sheet)
11. ShipCard list with star-citizen.wiki image fetching
12. Filters and sort (chip-style status filters, collapsible advanced filter sheet on mobile)
13. Settings page (import/export UI, restore backup, clear-all danger zone)

### Phase C — Deploy
14. GitHub Actions workflow
15. Verify HashRouter routing works on actual GH Pages URL
16. Test "Add to Home Screen" on iOS Safari

---

## Out of Scope (Future Phases)

Architecture placeholders exist (route stubs, type slots in `AppData`), but do not implement:

- **Inventory:** Categorized item tracking (Weapons, Armor, Components, Consumables, Resources, Tools, Apparel, Misc). UEX Corp API for prices.
- **Crafting:** In-progress/planned crafts, required vs owned materials. No reliable public API — decide at build time whether to hand-curate JSON or let user paste recipe info.
- **Cargo/Trade log:** Buy/sell history with profit tracking. UEX integration for commodity prices.
- **Mining log:** Refinery run tracker, mineral inventory.
- **Missions/Contracts:** Active contract list with payout, faction, expiration.
- **Multi-character/account support**
- **Public/open-source release:** Config flag, CONTRIBUTING.md, MIT license, sample data

---

## Key Decisions Made

- **No ship images bundled** — fetched at runtime from star-citizen.wiki API; graceful fallback if unavailable
- **No Redux/Zustand** — React Context + custom hooks is sufficient for single-user scope; revisit if state grows
- **No centered modals** — always use bottom sheets (vaul) for forms and confirmations
- **No shadow on cards** — border defines cards; shadow only on the Add Ship FAB

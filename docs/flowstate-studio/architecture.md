# Architecture & File Plan: FlowState Studio

## 1. High-Level Architecture

FlowState Studio will be a **single-page React app** built with **Vite + TypeScript + Tailwind CSS**, running entirely in the browser. All session data (start/end time, activity, mood, soundtrack) is stored in `localStorage`, so there’s no backend or auth to worry about. The core of the app is a “session state machine”: idle → running → stopped → saved-to-timeline.

At the UI level, we’ll have a main **AppShell** that wraps everything in a CRT-style, neon-glow frame: the big timer area (“Deck”), a control strip for start/stop, and a scrollable “Vibe Reel” timeline of previous sessions. A lightweight global state (via React context or a top-level state in `App.tsx`) will manage the current active session and the list of stored sessions, with a small abstraction around `localStorage` to keep persistence logic clean.

Styling is handled by **Tailwind** plus a small global CSS layer for CRT scanlines, glow, and glitchy transitions. Components stay small and focused: timer, form, list, list item card, and some reusable “vibe” UI primitives (glowing buttons, badges, panels). This keeps the codebase approachable and hackathon-friendly while still looking visually impressive.

## 2. File & Folder Structure

```text
flowstate-studio/
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ postcss.config.cjs
├─ tailwind.config.cjs
└─ src/
   ├─ main.tsx
   ├─ App.tsx
   ├─ types/
   │  └─ session.ts
   ├─ context/
   │  └─ SessionContext.tsx
   ├─ components/
   │  ├─ layout/
   │  │  └─ AppShell.tsx
   │  ├─ sessions/
   │  │  ├─ SessionTimer.tsx
   │  │  ├─ SessionForm.tsx
   │  │  ├─ SessionList.tsx
   │  │  └─ SessionCard.tsx
   │  └─ ui/
   │     ├─ GlowButton.tsx
   │     ├─ VibeBadge.tsx
   │     └─ Panel.tsx
   ├─ hooks/
   │  ├─ useSessionTimer.ts
   │  └─ useLocalStorage.ts
   ├─ lib/
   │  ├─ storage.ts
   │  └─ time.ts
   └─ styles/
      └─ index.css
```

## 3. Responsibilities Per Main File / Folder

### Root / Config

* **`index.html`**
  The base HTML file Vite uses as an entry point. Minimal shell with root `<div id="root"></div>`, plus any meta tags and a background colour that matches the cyberpunk theme (dark).

* **`package.json`**
  Declares dependencies (`react`, `react-dom`, `typescript`, `tailwindcss`, etc.), scripts (`dev`, `build`, `preview`), and project metadata. This is what you’ll run with `npm run dev`.

* **`tsconfig.json`**
  TypeScript configuration: JSX settings, module resolution, strictness. Keeps the DX nice and prevents common type errors.

* **`vite.config.ts`**
  Vite setup for React + TS. Mostly boilerplate, but we can customise `base` or aliases later if needed.

* **`postcss.config.cjs` & `tailwind.config.cjs`**
  Tailwind and PostCSS configuration. Tailwind config will define the content paths (`./index.html`, `./src/**/*.{ts,tsx}`) and optionally extend the theme with neon colours and fonts.

### `src/main.tsx`

* Bootstraps the React app.
* Renders `<App />` into `#root`.
* Wraps `<App />` inside any providers, e.g. `<SessionProvider>` from `SessionContext.tsx`.
* Imports the global styles: `import "./styles/index.css";`.

### `src/App.tsx`

* Top-level application component.
* Composes the layout:
  * `<AppShell>` for the CRT frame.
  * Inside: `<SessionTimer>`, start/stop controls, stats, and the `<SessionList>`.
* Consumes the session context to:
  * Show current running session status.
  * Pass session actions (start/stop/save/delete) to the relevant components.
* This is effectively the “director” of the main screen.

### `src/types/session.ts`

* Defines TypeScript types and enums for sessions:
  ```ts
  export type Mood = "FOCUSED" | "CHILL" | "BURNT" | "HYPED"; // etc.

  export interface Session {
    id: string;
    activity: string;
    mood: Mood;
    soundtrack: string;
    startedAt: string;  // ISO string
    endedAt: string;    // ISO string
    durationMs: number;
  }
  ```
* Central place for types so the rest of the app doesn’t drift.

### `src/context/SessionContext.tsx`

* Provides global state and actions for sessions:
  * `sessions: Session[]`
  * `currentSessionStart: Date | null`
  * `startSession(activityHint?)`
  * `stopSessionAndSave(metadata)`
  * `deleteSession(id)`
* On mount:
  * Hydrates the `sessions` array from `localStorage` via `lib/storage.ts`.
* On change:
  * Writes updated sessions back to `localStorage`.
* Exposes a `useSessions()` hook for components to easily consume the state.

We can keep this fairly small; the heavy lifting for timing lives in `useSessionTimer`.

### `src/components/layout/AppShell.tsx`

* Responsible only for the **frame and overall layout**:
  * Full-screen flex/grid layout.
  * Neon gradient background.
  * Overlay for CRT scanlines & subtle vignette.
* Slot pattern:
  * Might take `header`, `main`, `sidebar` children or just `children` and apply consistent padding, max-width, etc.
* Adds the cosmetic layer: pseudo-elements for scanlines, inner glow around main content.

### `src/components/sessions/SessionTimer.tsx`

* Displays:
  * Large digital timer (HH:MM:SS).
  * Current activity or a placeholder (“IDLE”).
* Uses `useSessionTimer` + context:
  * When a session is active, it counts up based on `currentSessionStart`.
  * When idle, shows `00:00:00` or last session duration.
* Can include small “status lights” (e.g. green/red LED dot) depending on running vs idle.

### `src/components/sessions/SessionForm.tsx`

* Appears when the user stops a session (“TERMINATE”).
* Could be a modal or slide-up sheet.
* Fields:
  * `Activity` (text)
  * `Mood` (select or buttons with emoji like 🔥, 🧘, 💀)
  * `Soundtrack` (free text, e.g. “lofi girl #288”)
* On submit:
  * Calls `stopSessionAndSave(metadata)` via context.
  * Closes itself.
* On cancel:
  * Optionally discards or asks for confirmation (for hackathon speed, we can just discard).

### `src/components/sessions/SessionList.tsx`

* Takes the `sessions` array from context.
* Renders them in **reverse chronological order** (newest first).
* Wraps each session in a `<SessionCard>` for consistent styling.
* Optionally groups by date (“Today”, “Yesterday”).

### `src/components/sessions/SessionCard.tsx`

* Renders one session’s information in a stylised “VHS label” / cyberpunk card:
  * Activity name, mood emoji, soundtrack.
  * Time range + duration (formatted via `lib/time.ts`).
* Visual elements:
  * Coloured mood badge via `<VibeBadge>`.
  * Subtle hover glow, scanline overlay, maybe a fake “tape ID” or hex ID.
* Includes a small delete icon/button:
  * Calls delete from context.

### `src/components/ui/GlowButton.tsx`

* Reusable button with neon/glow styling using Tailwind classes.
* Props: `variant`, `size`, `onClick`, `children`, `disabled`.
* Used for “INITIATE”, “TERMINATE”, maybe “Edit”, “Delete”, etc. to keep visual consistency.

### `src/components/ui/VibeBadge.tsx`

* Displays a mood in a compact, visually distinct way:
  * e.g. 🔥 FOCUSED, 🧘 CHILL, 💀 BURNT.
* Tailwind classes for background glow and border.
* Keeps mood rendering logic in one place.

### `src/components/ui/Panel.tsx`

* Generic container with:
  * Semi-transparent background for glassy look.
  * Borders / inner shadows appropriate for CRT feel.
* Used for grouping timer, stats, and session list.

### `src/hooks/useSessionTimer.ts`

* Encapsulates logic for deriving elapsed time:
  * Takes `currentSessionStart` (from context).
  * Internally uses `setInterval` or `requestAnimationFrame` to update every second.
  * Returns a formatted object: `{ elapsedMs, hours, minutes, seconds }`.
* Abstracting this hook keeps the timer logic testable and reusable.

### `src/hooks/useLocalStorage.ts`

* Generic hook to sync a piece of state with `localStorage`, e.g.:
  * `const [value, setValue] = useLocalStorage<T>("key", defaultValue);`
* Can be used by `SessionContext` or directly by components if we want.

### `src/lib/storage.ts`

* Low-level helpers for `localStorage` access:
  * `loadSessions(): Session[]`
  * `saveSessions(sessions: Session[]): void`
* Handles JSON parsing/stringifying and fallback if `localStorage` is empty or corrupted.

### `src/lib/time.ts`

* Pure functions for time formatting:
  * `formatDuration(ms: number): string` (e.g. `01:23:45`).
  * `formatTimeRange(start: string, end: string): string`.
* Keeps formatting logic consistent across timer and cards.

### `src/styles/index.css`

* Imports Tailwind base, components, utilities:
  * `@tailwind base; @tailwind components; @tailwind utilities;`
* Adds global CSS for:
  * CRT scanline effect (e.g. repeating linear gradient).
  * Body background and font stack.
  * Optional keyframe animations (glitch, flicker).
* Anything too custom for Tailwind utility classes lives here.

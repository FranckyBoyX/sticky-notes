# Sticky Notes App — Design & Implementation Plan

## Context

Hiring assignment: single-page sticky notes web app assessed on architecture, code quality, TypeScript accuracy, and usability. Implements all 4 core features (create, resize, move, trash) plus text editing (Bonus I) and local storage persistence (Bonus III). The goal is to demonstrate intentional design decisions, not to use readymade solutions.

---

## Stack

| Tool | Role |
|------|------|
| Bun | Runtime + package manager |
| Vite (React plugin) | Build + HMR dev server |
| React 19 + TypeScript (strict) | UI |
| Biome (default config) | Lint + format |
| CSS Modules | Scoped styles, no runtime cost |

---

## Architecture

### Data Model — `src/types.ts`

```typescript
export interface Note {
  id: string;       // crypto.randomUUID()
  x: number;        // px from canvas left
  y: number;        // px from canvas top
  width: number;    // px
  height: number;   // px
  text: string;
  zIndex: number;
}

export type NoteAction =
  | { type: 'CREATE';         payload: Omit<Note, 'id' | 'zIndex'> }
  | { type: 'MOVE';           id: string; x: number; y: number }
  | { type: 'RESIZE';         id: string; width: number; height: number }
  | { type: 'REMOVE';         id: string }
  | { type: 'UPDATE_TEXT';    id: string; text: string }
  | { type: 'BRING_TO_FRONT'; id: string }
```

Default note size: `200 × 150px`. Minimum note size: `100 × 80px` (enforced in reducer).

### State Management

Single `usePersistedReducer` at `App` level. Mirrors `useReducer` API with an extra `key` param:

```typescript
const [notes, dispatch] = usePersistedReducer(notesReducer, 'sticky-notes', []);
```

Internally: lazy initializer reads from `localStorage` on mount (no flicker); `useEffect` writes on every change; `try/catch` guards `JSON.parse`. Nothing else.

### Drag System

All drag interactions use the Pointer Events API — no HTML5 DnD API.

| Context | Trigger | What happens |
|---------|---------|--------------|
| **Create** | `pointerdown` on NotepadStack | Ghost note follows cursor; `pointerup` on canvas → `CREATE`; `pointerup` back on stack → cancel |
| **Move** | `pointerdown` on NoteHeader | `pointermove` → `MOVE`; `pointerup` over TrashZone → `REMOVE` |
| **Resize** | `pointerdown` on ResizeHandle | `pointermove` → `RESIZE` (clamped to min size) |

`setPointerCapture` is used in all cases so dragging stays smooth when the cursor leaves the element. Because pointer capture routes events to the capturing element, TrashZone hit-testing on move/create release uses `getBoundingClientRect` on a `trashZoneRef` rather than pointer events on the zone itself.

`useDrag` encapsulates the pointer lifecycle and returns the current drag delta. `useResize` wraps the same pattern for the resize handle.

### Component Tree

```
App
├── NotepadStack        — fixed top-left, visual sticky note "pad", source of new notes
├── Canvas              — full-viewport div, positions notes absolutely
│   └── Note[]          — sorted by zIndex before render
│       ├── NoteHeader  — drag handle; BRING_TO_FRONT on pointerdown
│       ├── NoteBody    — contentEditable div; UPDATE_TEXT on blur
│       └── ResizeHandle — bottom-right grip
└── TrashZone           — fixed bottom-center; hidden normally, revealed during any drag
```

---

## File Structure

```
sticky-notes/
  index.html
  biome.json                          — default Biome config
  src/
    main.tsx                          — ReactDOM.createRoot entry
    types.ts                          — Note, NoteAction
    reducer.ts                        — notesReducer (pure)
    hooks/
      usePersistedReducer.ts          — localStorage-synced useReducer
      useDrag.ts                      — pointer event drag lifecycle
      useResize.ts                    — pointer event resize lifecycle
    components/
      App.tsx                         — root, owns state, passes dispatch
      Canvas.tsx                      — full-viewport backdrop, renders Note[]
      Note.tsx                        — assembles Header + Body + ResizeHandle
      NoteHeader.tsx                  — drag handle
      NoteBody.tsx                    — contentEditable text
      ResizeHandle.tsx                — resize grip
      NotepadStack.tsx                — new-note source
      TrashZone.tsx                   — delete drop target, exposes ref
    styles/
      index.css                       — global reset, CSS custom properties
      Canvas.module.css
      Note.module.css
      NotepadStack.module.css
      TrashZone.module.css
```

---

## Implementation Steps

### Phase 1 — Scaffolding
1. `bun create vite sticky-notes --template react-ts`
2. Enable TypeScript strict mode in `tsconfig.json` (`strict: true`, `noUncheckedIndexedAccess: true`)
3. `bun add --dev @biomejs/biome` + `bunx biome init`
4. Delete Vite boilerplate (`App.css`, `assets/`, default `App.tsx` contents)
5. Add global CSS reset and CSS custom properties (`--note-bg`, `--note-shadow`, `--note-min-width`, `--note-min-height`)

### Phase 2 — Types + Reducer
1. Write `src/types.ts` — `Note` interface + `NoteAction` discriminated union
2. Write `src/reducer.ts` — `notesReducer` handling all 6 actions; `RESIZE` clamps to min size; `MOVE` is unclamped in the reducer (pure, no DOM knowledge) — clamping to viewport happens in `NoteHeader` before dispatch using `window.innerWidth/Height`; `BRING_TO_FRONT` sets `zIndex` to `max(zIndexes) + 1`
3. Write `src/hooks/usePersistedReducer.ts`

### Phase 3 — Drag Hooks
1. Write `src/hooks/useDrag.ts`
   - Takes `onMove: (dx: number, dy: number) => void` and `onRelease: (x: number, y: number) => void`
   - Returns `{ startDrag: (e: PointerEvent) => void, isDragging: boolean }`
   - Calls `setPointerCapture` internally
2. Write `src/hooks/useResize.ts`
   - Same pattern, callback receives new `width` and `height` derived from start size + delta

### Phase 4 — Components (bottom-up)
1. `ResizeHandle.tsx` — small corner grip, calls `startDrag` from `useResize`, dispatches `RESIZE` on move
2. `NoteBody.tsx` — `contentEditable` div with `suppressContentEditableWarning`; dispatches `UPDATE_TEXT` on `blur`; stops pointer events from bubbling to header
3. `NoteHeader.tsx` — drag handle bar; `pointerdown` → `BRING_TO_FRONT` + start move drag; `pointermove` → `MOVE`; `pointerup` → check TrashZone bounds → `REMOVE` or no-op
4. `Note.tsx` — positions itself absolutely via `style={{ left, top, width, height, zIndex }}`; composes Header + Body + ResizeHandle
5. `TrashZone.tsx` — fixed-position div with a forwarded ref; receives `isActive: boolean` prop (true during any drag) to show/hide
6. `NotepadStack.tsx` — visual pad icon; `pointerdown` starts creation drag, renders ghost note during drag; `pointerup` → if not over stack, dispatch `CREATE`
7. `Canvas.tsx` — `position: relative; width: 100vw; height: 100vh; overflow: hidden`; renders `notes.toSorted((a,b) => a.zIndex - b.zIndex).map(...)`
8. `App.tsx` — calls `usePersistedReducer`; tracks `isDragging` boolean in local `useState` (set true on any drag start, false on release) to pass to `TrashZone`; passes `trashZoneRef` down to note drag handlers

### Phase 5 — Styles
1. `index.css`: box-sizing reset, `body { margin: 0; overflow: hidden; }`, CSS custom properties
2. `Note.module.css`: yellow background (`#fef08a`), box shadow, border-radius, cursor defaults
3. `NoteHeader.module.css`: slightly darker yellow, `cursor: grab`, `:active { cursor: grabbing }`
4. `NotepadStack.module.css`: stacked card visual (3 offset divs), `cursor: grab`
5. `TrashZone.module.css`: dashed border, centered icon; `.active` variant highlights in red

### Phase 6 — Wiring + Polish
1. Verify localStorage round-trip on page reload
2. Ghost note during creation drag (absolutely positioned, follows pointer, `pointer-events: none`)
3. Constrain note movement to stay within viewport in the `MOVE` handler
4. Constrain resize to minimum dimensions in the `RESIZE` handler
5. Prevent text selection on the canvas during drag (`user-select: none` while `isDragging`)

---

## TrashZone Hit-Test Detail

Because pointer capture routes all events to the dragging element, `TrashZone` cannot use its own `pointerover` event during a move. Instead:

```typescript
// In NoteHeader onRelease:
const trashRect = trashZoneRef.current?.getBoundingClientRect();
if (trashRect && x >= trashRect.left && x <= trashRect.right
                && y >= trashRect.top  && y <= trashRect.bottom) {
  dispatch({ type: 'REMOVE', id });
} else {
  dispatch({ type: 'MOVE', id, x: finalX, y: finalY });
}
```

Same pattern for NotepadStack creation drag.

---

## Verification Checklist

1. `bun run dev` starts without errors, no TypeScript errors (`bun run tsc --noEmit`)
2. Biome reports no lint/format errors (`bunx biome check src/`)
3. Drag from notepad stack → note appears at drop position
4. Drag note header → note follows cursor, drops correctly
5. Drag note over trash zone → zone highlights, release removes note
6. Drag resize handle → note resizes, respects minimum dimensions
7. Click note body → can type, text persists on blur
8. Reload page → all notes restore with correct position, size, text
9. Overlapping notes: clicking a note brings it to front
10. Tested in Chrome, Firefox, Edge

---

## Architecture Description (for submission)

The application is built around a single immutable state tree managed by a custom `usePersistedReducer` hook at the root `App` component. Notes are plain objects (`id`, `x`, `y`, `width`, `height`, `text`, `zIndex`) held in an array; every interaction dispatches a typed action to a pure reducer, making all state transitions predictable and auditable. The hook mirrors the `useReducer` API exactly — the only difference from the caller's perspective is a `key` parameter — and syncs to `localStorage` via a lazy initializer (zero-flicker rehydration on load) and a `useEffect` write-back.

All drag-and-drop interactions — creating notes from the notepad stack, moving notes, resizing them, and discarding them into the trash zone — are implemented with the Pointer Events API and `setPointerCapture`. This avoids the HTML5 Drag and Drop API entirely, whose ghost-image constraints and cross-browser inconsistencies make custom drag UIs painful. Two focused custom hooks (`useDrag`, `useResize`) encapsulate the pointer event lifecycle; because pointer capture routes events to the capturing element rather than whatever is under the cursor, trash-zone hit detection falls back to a `getBoundingClientRect` check on release.

The component tree is shallow and single-responsibility: each component owns exactly one visual concern, communicates exclusively through props and dispatch, and has no knowledge of its siblings. CSS Modules provide scoped styles without a runtime dependency, keeping the bundle lean and free of styling abstractions.

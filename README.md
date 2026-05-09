# Sticky Notes

A single-page sticky notes application built with React and TypeScript.

## Features

- Drag a note from the notepad stack (top-left) to place it on the canvas
- Move notes by dragging their header
- Resize notes by dragging the bottom-right handle
- Delete notes by dragging them onto the trash zone (appears during drag)
- Edit note text by clicking the note body
- Notes persist across page reloads via localStorage

## Prerequisites

[Bun](https://bun.sh) ≥ 1.0, then install dependencies:

```bash
bun install
```

## How to Run Locally

```bash
bun run dev
```

Opens at `http://localhost:5173`.

## How to Build

```bash
bun run build
```

## How to Lint

```bash
bun run lint
```

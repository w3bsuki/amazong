# Pencil Dev — Complete Guide for Codex

> **What:** Pencil is an agent-driven MCP vector canvas that lives in your IDE. Design files (`.pen`) are JSON, version-controlled in Git, and editable by AI agents via MCP tools.
>
> **Why this guide exists:** Some screens Codex designed look great, others look like shit. This guide teaches you the full Pencil MCP tool API, the `.pen` format, the CLI, and — critically — how to design screens that are consistently high quality.

Official docs: https://docs.pencil.dev

---

## Table of Contents

1. [Setup & Prerequisites](#1-setup--prerequisites)
2. [The .pen Format](#2-the-pen-format)
3. [MCP Tools Reference](#3-mcp-tools-reference)
4. [The Design Loop (How to Work)](#4-the-design-loop)
5. [Layout System & Flexbox](#5-layout-system--flexbox)
6. [Components & Instances](#6-components--instances)
7. [Variables & Theming](#7-variables--theming)
8. [Design → Code Workflow](#8-design--code-workflow)
9. [Pencil CLI (Batch Mode)](#9-pencil-cli-batch-mode)
10. [Keyboard Shortcuts](#10-keyboard-shortcuts)
11. [Troubleshooting](#11-troubleshooting)
12. [Treido-Specific Rules](#12-treido-specific-rules)
13. [Quality Checklist](#13-quality-checklist)

---

## 1. Setup & Prerequisites

### Install the Extension

- **VS Code / Cursor:** Extensions → search "Pencil" → Install.
- Verify: create a `.pen` file → open it → look for the Pencil icon top-right.

### Authentication

Pencil needs two things:

1. **Pencil activation** — enter your email, get a code, paste it in.
2. **Claude Code auth** — run `claude` in your terminal and complete the browser flow.

### Verify MCP Connection

- **Cursor:** Settings → Tools & MCP → Pencil should appear.
- **Codex CLI:** run `/mcp` → Pencil should be in the list.
- **VS Code:** check MCP configuration in settings.

> **Important:** Pencil's MCP server runs *locally*. No design data is sent to remote servers (except when the AI itself sends prompts to Claude for generation).

---

## 2. The .pen Format

`.pen` files are **JSON** describing a tree of graphical objects on an infinite 2D canvas.

### Document Structure

```json
{
  "version": "...",
  "themes": { "mode": ["light", "dark"] },
  "variables": { ... },
  "children": [ /* top-level frames/objects */ ]
}
```

### Object Types

| Type | Description |
|------|------------|
| `frame` | Rectangle container with children + flexbox layout |
| `rectangle` | Basic rectangle (no children) |
| `ellipse` | Ellipse / circle / arc / ring |
| `line` | Simple line |
| `polygon` | Regular polygon |
| `path` | SVG path geometry |
| `text` | Text element with rich styling |
| `group` | Grouping container |
| `ref` | Instance of a reusable component |
| `icon_font` | Icon from a font family (lucide, feather, Material Symbols, phosphor) |
| `note` | Design note (not rendered in output) |
| `prompt` | Embedded prompt |
| `context` | Context annotation |

### Every Object Has

```json
{
  "id": "unique-string-no-slashes",
  "type": "frame",
  "x": 0, "y": 0,
  "width": 375, "height": 812,
  "name": "Optional display name",
  "context": "Optional context for AI"
}
```

- **`id`** — unique within the document, no `/` characters.
- **`x`, `y`** — position relative to parent (ignored when parent uses flexbox).
- **`name`** — display label (shows in layers panel).
- **`context`** — text hint for AI agents about the object's purpose.

### Sizing Behaviors

Instead of a fixed number, `width`/`height` can be a sizing behavior string:

- `"fit_content"` — shrinks to children. Optional fallback: `"fit_content(100)"`.
- `"fill_container"` — expands to parent. Optional fallback: `"fill_container(100)"`.

### Graphics

```json
{
  "fill": "#FF0000",
  "stroke": {
    "thickness": 1,
    "fill": "#000000",
    "align": "inside"
  },
  "effect": {
    "type": "shadow",
    "shadowType": "outer",
    "offset": { "x": 0, "y": 2 },
    "blur": 4,
    "color": "#00000020"
  },
  "cornerRadius": 12,
  "opacity": 0.9,
  "clip": true
}
```

**Fill types:** solid color (`"#RRGGBB"` or `"#RRGGBBAA"`), gradient, image, mesh gradient.

**Multiple fills:** use an array `"fill": [fill1, fill2]` — painted in order.

**Stroke options:** `align` (inside/center/outside), `thickness` (number or per-side object), `join`, `cap`, `dashPattern`.

**Effects:** `blur`, `background_blur`, `shadow` (inner/outer with offset, spread, blur, color).

### Text

```json
{
  "type": "text",
  "content": "Hello World",
  "fontFamily": "Inter",
  "fontSize": 16,
  "fontWeight": "600",
  "textAlign": "left",
  "textAlignVertical": "top",
  "lineHeight": 1.5,
  "letterSpacing": 0,
  "textGrowth": "fixed-width",
  "width": 200
}
```

> **Critical:** Never set `width` or `height` on text without also setting `textGrowth`. Without it, width/height are ignored.

**`textGrowth` modes:**

| Mode | Behavior |
|------|----------|
| `"auto"` | Box grows to fit text, no wrapping |
| `"fixed-width"` | Width fixed, text wraps, height auto |
| `"fixed-width-height"` | Both fixed, text may overflow |

### Icons

```json
{
  "type": "icon_font",
  "iconFontFamily": "lucide",
  "iconFontName": "shopping-cart",
  "width": 24, "height": 24,
  "fill": "#333333"
}
```

**Available icon fonts:** `lucide`, `feather`, `Material Symbols Outlined`, `Material Symbols Rounded`, `Material Symbols Sharp`, `phosphor`.

For Treido: **use `lucide`** (matches our codebase which uses `lucide-react`).

---

## 3. MCP Tools Reference

These are the tools available when an AI agent connects to Pencil via MCP.

### `get_editor_state`

Returns the active file, top-level frames, and current selection.

**Use:** Start every session by confirming which file is open and what's in it.

### `batch_get`

Read design component structure and hierarchy.

**Parameters:**
- Target objects/paths to inspect
- `readDepth` — how deep to traverse children (start low: 1-2)
- Search patterns

**Use:** Inspect a screen or component to understand its structure before modifying.

**Best practice:** Use low `readDepth` first (1-2), then drill deeper on specific subtrees. Don't read the entire document at depth 10 — it'll be massive.

### `batch_design`

Create, modify, and manipulate design elements. This is the main workhorse tool.

**Operations available:**
- `insert` — add new objects
- `update` — modify existing object properties
- `replace` — swap an object entirely
- `copy` — duplicate objects
- `move` — reposition objects
- `delete` — remove objects
- Generate and place images

**Best practice:**
- Keep batches **≤ 25 operations**. Small, reversible batches.
- Don't build an entire page in one batch. Build it section by section.
- After each batch, verify with `get_screenshot`.

### `get_screenshot`

Render a visual preview of the current design (or a specific frame).

**Use:** After every `batch_design` call. This is how you catch:
- Clipped content
- Overlapping elements
- Misaligned spacing
- Missing or incorrect text
- Wrong colors/sizes

### `snapshot_layout`

Analyze layout structure and detect positioning issues.

**Use:** After larger edits, run this to catch:
- Overlapping nodes
- Elements outside their parent bounds
- Layout inconsistencies

### `get_variables` / `set_variables`

Read and update design tokens (colors, numbers, strings, booleans).

**Use:** When working with the design system's semantic tokens.

---

## 4. The Design Loop

This is the single most important section. **The reason some screens look bad is skipping steps in this loop.**

### The Loop

```
1. get_editor_state     →  Know what file and frames exist
2. batch_get            →  Inspect the template/component you'll use (low depth)
3. batch_design         →  Make a SMALL batch of changes (≤25 ops)
4. get_screenshot       →  LOOK at the result
5. Fix issues           →  If anything's wrong, batch_design to fix
6. Repeat 3-5           →  Add the next section
7. snapshot_layout      →  Final sanity check for overlap/clipping
```

### What Goes Wrong (and How to Fix It)

| Symptom | Cause | Fix |
|---------|-------|-----|
| Content clipped/cut off | Frame too small or `clip: true` | Increase frame size or use `fit_content` |
| Elements overlapping | No layout / wrong positioning | Use flexbox layout (`layout: "vertical"`) on parent |
| Giant empty spaces | Fixed heights too large | Use `fit_content` for containers |
| Text invisible | Wrong color / zero opacity / outside bounds | Check fill color, opacity, and parent clip |
| Inconsistent spacing | Eyeballed `y` offsets | Use flexbox `gap` instead of manual positioning |
| Components look different | Not using `ref` instances | Use instances (`type: "ref"`) of shared components |
| Screen doesn't match others | Didn't start from template | Always start from the project's base templates |

### Golden Rule

**Design → Screenshot → Adjust. NEVER build more than one section before looking.**

If you build an entire page without screenshotting, you WILL produce garbage. The AI can't see what pixels look like — `get_screenshot` is your eyes. Use it after every 1-2 `batch_design` calls.

---

## 5. Layout System & Flexbox

Frames use a flexbox-style layout system. **This is how you avoid manual positioning and keep things consistent.**

### Layout Properties (on parent frames)

```json
{
  "type": "frame",
  "layout": "vertical",
  "gap": 16,
  "padding": [16, 16, 16, 16],
  "justifyContent": "start",
  "alignItems": "center",
  "width": 375,
  "height": "fit_content"
}
```

| Property | Values | Default |
|----------|--------|---------|
| `layout` | `"none"`, `"vertical"`, `"horizontal"` | `"none"` (frames), absolute positioning |
| `gap` | number (pixels between children) | `0` |
| `padding` | number, `[h, v]`, or `[top, right, bottom, left]` | `0` |
| `justifyContent` | `"start"`, `"center"`, `"end"`, `"space_between"`, `"space_around"` | `"start"` |
| `alignItems` | `"start"`, `"center"`, `"end"` | `"start"` |

### Child Sizing in Flex

- `"fill_container"` — stretch to fill available space in parent.
- `"fit_content"` — shrink to content size.
- Fixed number — explicit pixel size.

### When to Use What

| Scenario | Layout |
|----------|--------|
| Page with stacked sections | `layout: "vertical"`, `gap: 24` |
| Horizontal row of chips | `layout: "horizontal"`, `gap: 8`, `alignItems: "center"` |
| Card with image + text | `layout: "vertical"`, `gap: 12` |
| Header with logo and actions | `layout: "horizontal"`, `justifyContent: "space_between"`, `alignItems: "center"` |
| Absolute overlay (badge) | `layout: "none"` on parent, position with `x`/`y` |

### Common Patterns

**Full-width page frame:**
```json
{
  "type": "frame",
  "width": 375, "height": 812,
  "layout": "vertical",
  "clip": true,
  "fill": "$surface-page"
}
```

**Card:**
```json
{
  "type": "frame",
  "width": "fill_container",
  "height": "fit_content",
  "layout": "vertical",
  "padding": 16,
  "gap": 12,
  "cornerRadius": 12,
  "fill": "$surface-card",
  "effect": { "type": "shadow", "shadowType": "outer", "offset": { "x": 0, "y": 1 }, "blur": 3, "color": "#0000000D" }
}
```

**Horizontal row:**
```json
{
  "type": "frame",
  "width": "fill_container",
  "height": "fit_content",
  "layout": "horizontal",
  "alignItems": "center",
  "gap": 12
}
```

---

## 6. Components & Instances

### Creating a Reusable Component

Add `"reusable": true` to any object:

```json
{
  "id": "product-card",
  "type": "frame",
  "reusable": true,
  "width": 170, "height": 260,
  "layout": "vertical",
  "cornerRadius": 12,
  "children": [
    { "id": "card-image", "type": "frame", "width": "fill_container", "height": 170, "fill": "#E5E5E5" },
    { "id": "card-title", "type": "text", "content": "Product Name", "fontSize": 14, "fontWeight": "600" },
    { "id": "card-price", "type": "text", "content": "$29.99", "fontSize": 16, "fontWeight": "600" }
  ]
}
```

### Creating an Instance

Use `type: "ref"` pointing to the component's `id`:

```json
{
  "id": "card-instance-1",
  "type": "ref",
  "ref": "product-card"
}
```

### Overriding Properties

Override top-level properties directly:

```json
{
  "id": "card-instance-2",
  "type": "ref",
  "ref": "product-card",
  "width": 200
}
```

Override nested child properties via `descendants`:

```json
{
  "id": "card-instance-3",
  "type": "ref",
  "ref": "product-card",
  "descendants": {
    "card-title": { "content": "Premium Headphones" },
    "card-price": { "content": "$149.99" }
  }
}
```

### Nested Instance Overrides

For components containing other component instances, prefix the descendant ID with the instance's ID and `/`:

```json
{
  "descendants": {
    "ok-button/label": { "content": "Save" },
    "cancel-button/label": { "content": "Discard" }
  }
}
```

### Replacing Children (Slots)

Frames marked with `"slot": [...]` are designed to have their children replaced:

```json
{
  "id": "card-content",
  "type": "frame",
  "slot": ["list-item", "product-card"]
}
```

In instances, replace the slot's children:

```json
{
  "descendants": {
    "card-content": {
      "children": [
        { "id": "custom-item-1", "type": "text", "content": "Custom content" }
      ]
    }
  }
}
```

### Why This Matters for Quality

**Good:** Use `ref` instances → change the component once → all screens update.

**Bad:** Copy-paste frame trees → every screen is a unique snowflake → inconsistency.

**Rule:** Every screen should be composed of component `ref` instances as much as possible. This is what makes the well-designed screens look consistent.

---

## 7. Variables & Theming

### Defining Variables

```json
{
  "variables": {
    "color.primary": {
      "type": "color",
      "value": "#3B82F6"
    },
    "color.background": {
      "type": "color",
      "value": [
        { "value": "#FFFFFF", "theme": { "mode": "light" } },
        { "value": "#111111", "theme": { "mode": "dark" } }
      ]
    },
    "spacing.base": {
      "type": "number",
      "value": 16
    }
  },
  "themes": {
    "mode": ["light", "dark"]
  }
}
```

### Using Variables

Prefix with `$`:

```json
{
  "fill": "$color.primary",
  "padding": "$spacing.base"
}
```

### Theme Resolution

When a variable has multiple values, the **last matching theme** wins. Default is the first value in each axis.

### Syncing with CSS

You can sync Pencil variables ↔ CSS custom properties:

- **Import:** Ask AI to "create Pencil variables from `globals.css`"
- **Export:** Ask AI to "update `globals.css` with these Pencil variables"

This is how design tokens stay in sync between Pencil and the codebase.

---

## 8. Design → Code Workflow

### Generating Code from Designs

1. Design in Pencil.
2. Save the `.pen` file.
3. Press `Cmd/Ctrl + K`.
4. Prompt: `"Generate React code for this frame using Tailwind CSS and Shadcn UI"`.

### Effective Prompts for Code Generation

```
# Component
"Generate a React TypeScript component for this card using Tailwind CSS"

# Full page
"Create a Next.js page component from this design using our existing Button from components/ui/button"

# Specific library
"Export this using Shadcn UI components and Lucide icons"

# With context
"Generate code matching our project conventions: Server Components by default, semantic Tailwind tokens, next-intl for i18n"
```

### Code → Design (Import)

```
"Recreate the Header component from src/components/layout/header.tsx in this design"
"Import the product card from components/shared/product-card.tsx"
```

### Two-Way Sync Workflow

1. Import existing components into Pencil.
2. Improve the design visually.
3. Re-export updated code.
4. Iterate.

---

## 9. Pencil CLI (Batch Mode)

> **Status:** Experimental — desktop app only. Headless npm version coming soon.

### Setup

```bash
# macOS/Linux: install pencil to PATH
# Go to File → Install `pencil` command into PATH
# Reset terminal

pencil --agent-config config.json
```

### Agent Config

Run multiple prompts in parallel, each in its own Pencil window. **Important:** create empty `.pen` files first — the CLI can't create them.

```json
[
  {
    "file": "./designs/screen1.pen",
    "prompt": "Design a mobile product listing page with grid cards, filters, and bottom nav",
    "model": "claude-4.5-sonnet",
    "attachments": ["docs/DESIGN.md", "designs/reference-screenshot.png"]
  },
  {
    "file": "./designs/screen2.pen",
    "prompt": "Design a checkout flow with 3 steps: cart → shipping → payment",
    "model": "claude-4.6-opus",
    "attachments": ["docs/DESIGN.md"]
  }
]
```

**Parameters:**

| Parameter | Description |
|-----------|------------|
| `file` | Path to `.pen` file (must exist, can be empty) |
| `prompt` | The design prompt |
| `model` | AI model (e.g. `claude-4.5-haiku`, `claude-4.5-sonnet`, `claude-4.6-opus`) |
| `attachments` | Array of file paths (`.md`, `.png`, `.jpg`) to attach as context |

### Use Cases

- **A/B testing designs:** Same prompt, different models → compare quality.
- **Batch screen generation:** Generate many screens in parallel.
- **Design agency mode:** Multiple prompts with different specs running simultaneously.

---

## 10. Keyboard Shortcuts

### Essential

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open AI prompt panel |
| `Cmd/Ctrl + S` | **Save** (no auto-save!) |
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |

### Canvas

| Shortcut | Action |
|----------|--------|
| `Space + Drag` | Pan |
| `Cmd/Ctrl + Scroll` | Zoom |
| `Cmd/Ctrl + 0` | Zoom to fit |
| `Cmd/Ctrl + 1` | Zoom 100% |

### Selection

| Shortcut | Action |
|----------|--------|
| `Click` | Select |
| `Cmd/Ctrl + Click` | Deep select (nested) |
| `Shift + Click` | Add to selection |
| `Shift + Enter` | Select parent |
| `Cmd/Ctrl + A` | Select all |

### Objects

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + G` | Group |
| `Cmd/Ctrl + Alt + G` | Frame from selection |
| `Cmd/Ctrl + Alt + K` | Convert to reusable component |
| `Cmd/Ctrl + D` | Duplicate |
| `Delete` | Delete |

---

## 11. Troubleshooting

### MCP Not Connecting

1. Ensure Claude Code is authenticated: run `claude` in terminal.
2. Verify Pencil extension is installed and enabled.
3. Check MCP settings in your IDE.
4. Restart IDE.

### "Claude Code not connected"

Run `claude` CLI, complete auth, return to Pencil.

### Export Errors ("process exited with code 1")

- Check Claude Code auth.
- Try the operation in a separate Claude Code session.
- Check folder permissions.

### Conflicting Auth

If you see "Invalid API key" or "Please run /login":
- Remove `ANTHROPIC_API_KEY` env variables if using CLI auth.
- Don't mix CLI auth + environment keys + custom provider configs.

### Canvas Doesn't Match Code Output

- Take a screenshot for reference.
- Try re-exporting.
- Break complex designs into smaller pieces and export in stages.

### No Auto-Save

**This is real.** Save with `Cmd/Ctrl + S` frequently. Commit to Git often. If the IDE crashes, unsaved work is lost.

---

## 12. Treido-Specific Rules

These apply to all Pencil work in this project on top of the general Pencil rules.

### File

- Work in `designs/treido.pen` — the single canonical file.
- Screen naming: `M375 / <route> / <short title>`.
- Device: 375 × 812 (M375).

### Templates

Every screen uses one base template (defined in the `.pen` file):

| Template | Use for |
|----------|---------|
| `FeedGridPage` | Browse grids, category pages, search results, wishlist |
| `DetailPage (PDP)` | Product detail, order detail |
| `ListPage` | Settings, forms, lists, account pages |
| `ReadingPage` | Static content (about, privacy, FAQ) |
| `Wizard` | Multi-step flows (onboarding, sell) |
| `Chat` | Chat/inbox |
| `Checkout` | Checkout flow |
| `Desktop-first placeholder` | Admin/dashboard (no mobile design) |

### Styling

- **Semantic tokens only** — use `$--*` variables (e.g. `$--surface-card`, `$--foreground`, `$--muted-foreground`). No hardcoded hex unless introducing a new token.
- **Touch targets ≥ 44px** for all interactive elements.
- **Shadows over borders** — prefer subtle depth, avoid harsh 1px borders.
- **Spacing rhythm:** 8 / 12 / 16 / 24 / 32.
- **Typography:** Inter, weight 600 for emphasis, avoid 700+.
- **Radius:** cards 12–16px, pills 999px, bottom sheets 20–28px top.
- **Icons:** use `lucide` icon font family.

### Components

Reuse these from the "Gold Components / Primitives (2026)" section in `treido.pen`:

- Header / Browse
- Bottom Tab Bar / 5 tabs
- Product Card / Grid
- Chips / Discovery
- Filter Bar

Use `ref` instances of these — do NOT rebuild them per screen.

### Browse Feed Pattern (match the “good” screens)

- Structure: **Header / Browse → Chips / Discovery rail → Product grid → Bottom Tab Bar**.
- Chips are *mode pivots* (one active). Filters are *constraints* (drawer + visible count + clear).

### Task Workflow

For each screen task:

1. Create the screen frame via `batch_design` (copy the appropriate template, update content).
2. Verify with `get_screenshot` — catch clipping, alignment, missing content.
3. Check the task checkbox in the task `.md` file.

---

## 13. Quality Checklist

Run through this before marking any screen as done:

### Structure
- [ ] Screen uses the correct base template (`ref` instance, not a copy)
- [ ] Components are `ref` instances of shared primitives
- [ ] Frame naming follows `M375 / <route> / <short title>`

### Layout
- [ ] All containers use flexbox (`layout: "vertical"` or `"horizontal"`) — no manual `y` positioning for stacked content
- [ ] Spacing uses consistent gap values (8/12/16/24/32)
- [ ] Page padding matches the template inset (typically `$--page-inset-mobile` = 8 on M375)
- [ ] Content doesn't overflow or clip unexpectedly

### Visual
- [ ] All colors use semantic token variables (`$--*`)
- [ ] Touch targets ≥ 44px
- [ ] Text is readable (contrast, size ≥ 12px for body)
- [ ] Icons use `lucide` font family
- [ ] Shadows are subtle, no harsh borders

### Verification
- [ ] `get_screenshot` taken and reviewed after completion
- [ ] `snapshot_layout` shows no overlapping/clipped nodes
- [ ] Screen matches the visual quality of the "good" screens (home, PDP, cart, etc.)

---

## Quick Reference: MCP Tool Sequence for a New Screen

```
# 1. Orient
get_editor_state

# 2. Find the template
batch_get  →  inspect the template you'll copy (readDepth: 2)

# 3. Create the screen frame
batch_design  →  insert new frame as ref of template, set name "M375 / /route / Title"

# 4. Verify the skeleton
get_screenshot

# 5. Customize content (section by section)
batch_design  →  update title, labels, slot content (≤25 ops)
get_screenshot  →  check after each batch

# 6. Add route-specific content
batch_design  →  insert route-specific elements
get_screenshot

# 7. Final check
snapshot_layout  →  detect overlap/clipping issues
get_screenshot  →  final visual confirmation
```

---

*Source: https://docs.pencil.dev — fetched 2026-02-23*
*Last updated: 2026-02-23*

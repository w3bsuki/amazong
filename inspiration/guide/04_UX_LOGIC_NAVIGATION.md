# 04. UX LOGIC: The Smart Anchor Navigation

**Role:** Interaction Designer
**Goal:** Implement a deep navigation tree (L1 -> L2 -> L3) inside a **single UI row** without using breadcrumb bars or stacking multiple tab rows.

## 1. The Concept: "Morphing Row"

Instead of stacking rows like this:
```
[Tabs: Women | Men | Kids]
[Pills: Shoes | Clothing | Bags]
[Sub: Sneakers | Boots]
```

We use a **Single Row** that transforms based on depth:

**State 0 (Root):**
`[Women] [Men] [Kids]` (All pills look equal)

**State 1 (Drill Down - Women):**
`[← Women] [Shoes] [Clothing] [Bags]`
(The "Women" pill becomes a **Black Anchor** on the left. The rest are the children of Women.)

**State 2 (Drill Down - Shoes):**
`[← Shoes] [Sneakers] [Boots] [Sandals]`
(The "Shoes" pill becomes the **Black Anchor**. The rest are children of Shoes.)

## 2. The Logic (State Machine)

You need to track "Active IDs" for each level of depth.

```typescript
// 1. State Variables
const [l1, setL1] = useState(null); // e.g., 'women'
const [l2, setL2] = useState(null); // e.g., 'shoes'
const [l3, setL3] = useState(null); // e.g., 'sneakers'

// 2. Determine what to show
let viewMode = 'ROOT';
let pillsToShow = ROOT_DATA; // [Women, Men, Kids]
let anchor = null;

if (l1 && !l2) {
    viewMode = 'L1_SELECTED';
    pillsToShow = GET_CHILDREN(l1); // [Shoes, Clothing...]
    anchor = {
       label: GET_NAME(l1), // "Women"
       onClick: () => setL1(null) // Go back to Root
    };
} else if (l2) {
    viewMode = 'L2_SELECTED';
    pillsToShow = GET_CHILDREN(l2); // [Sneakers, Boots...]
    anchor = {
       label: GET_NAME(l2), // "Shoes"
       onClick: () => setL2(null) // Go back to L1
    };
}

// 3. Render
return (
  <div className="flex gap-2 overflow-x-auto">
     {/* The Anchor (Black) */}
     {anchor && (
        <button onClick={anchor.onClick} className="bg-black text-white ...">
           <ArrowLeft /> {anchor.label}
        </button>
     )}

     {/* The Siblings (White) */}
     {pillsToShow.map(pill => (
        <button onClick={() => handleSelect(pill.id)} className="bg-white border ...">
           {pill.name}
        </button>
     ))}
  </div>
)
```

## 3. Visual Rules for the Agent

1.  **The Anchor** is ALWAYS **Black** (`bg-zinc-900`) with **White Text**.
2.  **The Anchor** ALWAYS has an `ArrowLeft` icon.
3.  **The Siblings** are ALWAYS **White** (`bg-white`) with **Zinc Borders** (`border-zinc-200`).
4.  **Scroll Reset:** When the state changes (user clicks a pill), the container MUST scroll back to `left: 0`.

## 4. Why this matters?
This pattern allows us to support infinite depth (Categories like Electronics -> Computers -> Components -> RAM) without the header growing to take up half the screen. It keeps the UI "Invisible" and focused on the content.
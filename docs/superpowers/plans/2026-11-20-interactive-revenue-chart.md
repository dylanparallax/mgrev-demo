# Interactive Revenue Chart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add month-level hover, keyboard, and touch inspection to the cumulative revenue chart.

**Architecture:** Extract the chart into a focused client component with typed monthly data and local selected-month state. Generate SVG geometry from the data, use broad transparent hit areas for interaction, and render the tooltip inside the responsive SVG.

**Tech Stack:** TypeScript, React 19, Next.js 15, SVG, CSS

## Global Constraints

- Preserve the existing chart colors, dimensions, and page layout.
- Show month, Actual, Model, and dollar gap in one tooltip.
- Support pointer hover, keyboard focus, and touch.
- Keep the tooltip inside the SVG bounds.
- Do not add a test framework; verify with build, diagnostics, and browser interaction.

---

### Task 1: Build the interactive chart component

**Files:**
- Create: `components/RevenueChart.tsx`

**Interfaces:**
- Consumes: no props; the chart owns the fixed January–October demonstration data.
- Produces: `RevenueChart(): JSX.Element`, the complete accessible chart.

- [ ] **Step 1: Create typed chart data and geometry**

Create `components/RevenueChart.tsx` as a client component. Define:

```tsx
'use client';

import { useState } from 'react';

type RevenueMonth = {
  month: string;
  shortMonth: string;
  actual: number;
  model: number;
};

const REVENUE_DATA: RevenueMonth[] = [
  { month: 'January', shortMonth: 'JAN', actual: 0, model: 30 },
  { month: 'February', shortMonth: 'FEB', actual: 10, model: 70 },
  { month: 'March', shortMonth: 'MAR', actual: 35, model: 120 },
  { month: 'April', shortMonth: 'APR', actual: 80, model: 180 },
  { month: 'May', shortMonth: 'MAY', actual: 140, model: 250 },
  { month: 'June', shortMonth: 'JUN', actual: 215, model: 330 },
  { month: 'July', shortMonth: 'JUL', actual: 300, model: 420 },
  { month: 'August', shortMonth: 'AUG', actual: 390, model: 520 },
  { month: 'September', shortMonth: 'SEP', actual: 500, model: 640 },
  { month: 'October', shortMonth: 'OCT', actual: 612, model: 780 },
];

const PLOT = { left: 60, right: 780, top: 20, bottom: 230, max: 800 };
const xFor = (index: number) =>
  PLOT.left + (index * (PLOT.right - PLOT.left)) / (REVENUE_DATA.length - 1);
const yFor = (value: number) =>
  PLOT.bottom - (value / PLOT.max) * (PLOT.bottom - PLOT.top);
const pointsFor = (key: 'actual' | 'model') =>
  REVENUE_DATA.map((item, index) => `${xFor(index)},${yFor(item[key])}`).join(' ');
```

- [ ] **Step 2: Render the static chart from data**

Render the existing grid, axes, legend-independent lines, month labels, and endpoint labels from `REVENUE_DATA`. Use `pointsFor('model')` and `pointsFor('actual')` for the polylines.

- [ ] **Step 3: Add selected-month interaction**

Add local state:

```tsx
const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
```

For every month, render a transparent `<rect>` spanning its column. Set `tabIndex={0}`, pointer/focus handlers, and:

```tsx
aria-label={`${item.month}: Actual $${item.actual}K, Model $${item.model}K, gap $${item.model - item.actual}K`}
```

Clear hover selection from the SVG `onMouseLeave`. Keep focus and click/tap selection available.

- [ ] **Step 4: Render selection details**

When `selectedIndex !== null`, render:

- A vertical guide at the selected month's x coordinate.
- One emphasized point on each line.
- A tooltip group shifted left when `xFor(selectedIndex) > 600`.
- Tooltip text for month, actual, model, and gap.

Use a dark tooltip background with white text, an orange Actual marker, and a dashed gray Model marker.

- [ ] **Step 5: Compile the component**

Run:

```bash
npx tsc --noEmit
```

Expected: no TypeScript errors from `components/RevenueChart.tsx`.

### Task 2: Integrate, style, and verify

**Files:**
- Modify: `components/Demo.tsx:702-749`
- Modify: `app/globals.css:120-123`

**Interfaces:**
- Consumes: `RevenueChart` default export from `components/RevenueChart.tsx`.
- Produces: interactive chart in the existing Thesis panel.

- [ ] **Step 1: Replace the static SVG**

Import:

```tsx
import RevenueChart from './RevenueChart';
```

Replace the static `<svg>` block under “Cumulative cross-sell revenue vs. investment model” with:

```tsx
<RevenueChart />
```

- [ ] **Step 2: Add chart-specific styles**

Add:

```css
.revenue-chart { width: 100%; height: auto; display: block; overflow: visible; }
.chart-hit { cursor: crosshair; outline: none; }
.chart-hit:focus-visible { stroke: var(--ink); stroke-width: 1; stroke-dasharray: 3 3; }
.chart-guide { pointer-events: none; }
.chart-tooltip { pointer-events: none; filter: drop-shadow(0 4px 10px rgb(26 28 32 / 16%)); }
```

- [ ] **Step 3: Run diagnostics and production build**

Run:

```bash
npx tsc --noEmit
npm run build
```

Expected: both commands exit successfully.

- [ ] **Step 4: Verify browser behavior**

Check the Thesis chart at desktop and mobile widths:

- Hover January, May, and October: each tooltip remains inside the chart.
- Each tooltip shows month, Actual, Model, and gap.
- Tab through month targets: focus shows the same details.
- Tap a month at narrow width: its details appear.
- Moving the pointer away removes hover details.
- The chart remains readable without any active selection.

- [ ] **Step 5: Commit implementation**

```bash
git add components/RevenueChart.tsx components/Demo.tsx app/globals.css
git commit -m "feat: make revenue chart interactive"
```

# Unified Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the separate Overview and Thesis views with one full-width, action-first dashboard that shows opportunity, plays, activity, and performance with less desktop scrolling.

**Architecture:** Keep shared interaction state in `Demo` and consolidate the two existing view components into one `Dashboard` component in the same file. Reuse the focused `RevenueChart` component instead of retaining duplicate inline chart markup. CSS Grid controls desktop panel density and collapses progressively for tablet and mobile.

**Tech Stack:** TypeScript, React 19, Next.js 15, CSS Grid, existing CSS design tokens.

## Global Constraints

- Preserve the current play drawer, generation flow, send action, not-a-fit action, reset behavior, and metric updates.
- Describe `$780K` as the `Year 1 ramp target`.
- Keep other critique-specific copy changes out of scope.
- Do not add dependencies or a test framework.
- Keep keyboard labels, semantic table markup, focus styles, Escape-to-close behavior, and reduced-motion support.
- Do not introduce global tracking utilities or arbitrary body-text letter spacing.

---

### Task 1: Consolidate Overview and Thesis into one dashboard

**Files:**
- Modify: `components/Demo.tsx:1-797`
- Modify: `components/RevenueChart.tsx:51-62`

**Interfaces:**
- Consumes: existing `Account`, `Pair`, `CompanyId`, `Status`, `FeedItem`, matrix data, play callbacks, and count-up state.
- Produces: one `Dashboard` component receiving all current overview and performance state; `RevenueChart` remains a default export with no props.

- [ ] **Step 1: Verify the current production baseline**

Run:

```bash
npm run build
```

Expected: exit code `0` and successful Next.js compilation.

- [ ] **Step 2: Import the existing interactive chart and remove view state**

Add the chart import beside `useCountUp`:

```tsx
import RevenueChart from './RevenueChart';
import { useCountUp } from './useCountUp';
```

Delete:

```tsx
const [tab, setTab] = useState<'overview' | 'thesis'>('overview');
```

Keep `useState` imported because the play flow still uses it.

- [ ] **Step 3: Replace tab navigation and conditional rendering**

Keep the brand block in the header, remove the entire `<nav className="tabs">`, and replace the conditional Overview/Thesis render with:

```tsx
<Dashboard
  accounts={seedAccounts}
  statuses={statuses}
  active={active}
  ready={ready}
  intros={intros}
  pipelineK={pipelineK}
  bump={bump}
  flashCell={flashCell}
  feed={feed}
  pairs={pairs}
  changedPair={changedPair}
  onPlay={startPlay}
  onReset={reset}
/>
```

Expected static check:

```bash
rg "setTab|tab ===|role=\"tab\"|role=\"tablist\"" components/Demo.tsx
```

Expected: no matches.

- [ ] **Step 4: Merge the existing view props into `Dashboard`**

Rename `Overview` to `Dashboard`, extend its props, and destructure the new values:

```tsx
function Dashboard(props: {
  accounts: Account[];
  statuses: Record<string, Status>;
  active: Account | null;
  ready: number;
  intros: number;
  pipelineK: number;
  bump: number;
  flashCell: { key: string; n: number } | null;
  feed: FeedItem[];
  pairs: Pair[];
  changedPair: string | null;
  onPlay: (a: Account) => void;
  onReset: () => void;
}) {
  const {
    accounts,
    statuses,
    active,
    ready,
    intros,
    pipelineK,
    bump,
    flashCell,
    feed,
    pairs,
    changedPair,
    onPlay,
    onReset,
  } = props;
  const introsShown = useCountUp(intros);
  const pipeShown = useCountUp(pipelineK);
```

Delete the old `Thesis` function after its performance chart and company-pair table have been moved into `Dashboard`.

- [ ] **Step 5: Reorder the dashboard into semantic panel groups**

Make these exact wrapper changes without altering the content or event handlers inside them:

1. Insert `<section className="dashboard-summary" aria-label="Cross-sell summary">` before the hero.
2. Change the hero wrapper from `<section className="hero">` to `<section className="hero dashboard-panel">`.
3. Close `dashboard-summary` immediately after the existing KPI section.
4. Change `<section className="cols">` to `<section className="dashboard-grid dashboard-grid-main" aria-label="Cross-sell actions">`.
5. Change the first matrix `<div className="col">` to `<section className="dashboard-panel dashboard-matrix">` and use a matching closing `</section>`.
6. Change the weekly-plays `<div className="col">` to `<section className="dashboard-panel dashboard-plays">` and use a matching closing `</section>`.
7. Move the complete activity section inside `dashboard-grid-main`, change its wrapper to `<section className="dashboard-panel dashboard-activity">`, and remove its inline `flex: 'none'` style.
8. Delete the old inline SVG from `Thesis`; the interactive `RevenueChart` renders in its place.
9. Move the complete `By company pair` table from `Thesis` into the `dashboard-results` section, preserving the `changedPair`, `intros`, `p.stalled`, and `p.vsModel` expressions exactly.

After `dashboard-grid-main`, add the performance heading and chart wrapper:

```tsx
<section className="performance-heading">
  <span className="label">Cross-sell performance</span>
  <h2>78% of Year 1 ramp target</h2>
</section>

<section
  className="dashboard-grid dashboard-grid-performance"
  aria-label="Cross-sell performance"
>
  <section className="panel dashboard-chart">
    <div className="col-head">
      <h2>Cumulative cross-sell revenue vs. Year 1 ramp target</h2>
      <div className="legend">
        <span>
          <i className="legend-line actual" />
          Actual
        </span>
        <span>
          <i className="legend-line target" />
          Year 1 ramp target
        </span>
      </div>
    </div>
    <RevenueChart />
  </section>
  <section className="dashboard-panel dashboard-results">
    <div className="col-head">
      <h2>By company pair</h2>
    </div>
    <div className="table-wrap">
      <table className="pairs">
        <thead>
          <tr>
            <th>Pair</th>
            <th>Intros</th>
            <th>Meetings</th>
            <th>Quotes</th>
            <th>Closed YTD</th>
            <th>vs. target</th>
          </tr>
        </thead>
        <tbody>{pairRows}</tbody>
      </table>
    </div>
  </section>
</section>
```

Before `return`, define `pairRows` by moving the existing `pairs.map` expression from the old `Thesis` table body unchanged:

```tsx
const pairRows = pairs.map((p) => {
  const key = `${p.from}-${p.to}`;
  return (
    <tr key={key} className={p.stalled ? 'stalled' : ''}>
      <td>
        {pairName(p.from, p.to)}
        {p.stalled && (
          <span className="mono" style={{ fontSize: 11, marginLeft: 8 }}>
            Stalled
          </span>
        )}
      </td>
      <td
        key={changedPair === key ? `c${intros}` : 'n'}
        className={changedPair === key ? 'changed' : ''}
      >
        {p.intros}
      </td>
      <td>{p.meetings}</td>
      <td>{p.quotes}</td>
      <td>${p.closed}K</td>
      <td className={p.vsModel > 0 ? 'up' : ''}>
        {p.vsModel === 0
          ? 'New'
          : `${p.vsModel > 0 ? '+' : '−'}${Math.abs(p.vsModel)}%`}
      </td>
    </tr>
  );
});
```

Replace the KPI helper copy in both the dashboard KPI and chart language:

```tsx
<span className="s">Year 1 ramp target ${baseline.model}K</span>
```

- [ ] **Step 6: Update chart accessible language**

Change the title and description in `RevenueChart.tsx` to:

```tsx
<title id="revenue-chart-title">
  Cumulative cross-sell revenue versus Year 1 ramp target
</title>
<desc id="revenue-chart-description">
  Cumulative cross-sell revenue from January to October 2026. Actual revenue reaches $612K
  against a Year 1 ramp target of $780K. Focus or select a month for details.
</desc>
```

Change each month hit target label to:

```tsx
aria-label={`${item.month}: Actual $${item.actual}K, Year 1 ramp target $${item.model}K, gap $${item.model - item.actual}K`}
```

- [ ] **Step 7: Compile the consolidated dashboard**

Run:

```bash
npm run build
```

Expected: exit code `0`; no missing prop, duplicate declaration, or JSX nesting errors.

- [ ] **Step 8: Commit the functional consolidation**

```bash
git add components/Demo.tsx components/RevenueChart.tsx
git commit -m "feat: unify dashboard content"
```

---

### Task 2: Implement the full-width responsive panel grid

**Files:**
- Modify: `app/globals.css:38-217`

**Interfaces:**
- Consumes: `dashboard-summary`, `dashboard-grid-main`, `dashboard-grid-performance`, and panel modifier classes added in Task 1.
- Produces: full-width desktop layout, progressive tablet wrapping, and single-column mobile stacking.

- [ ] **Step 1: Remove the page width cap and unused tab styles**

Replace the shell spacing rules with:

```css
.topbar-inner {
  width: 100%;
  padding: 16px clamp(16px, 2.5vw, 40px);
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.main {
  width: 100%;
  padding: clamp(24px, 3vw, 48px) clamp(16px, 2.5vw, 40px) 64px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
```

Delete the unused `.tabs`, `.tab`, and `.tab[aria-selected='true']` rules.

- [ ] **Step 2: Add summary and panel-grid layout**

Add after the hero rules:

```css
.dashboard-summary {
  display: grid;
  grid-template-columns: minmax(280px, 0.8fr) minmax(720px, 2.2fr);
  gap: 16px;
  align-items: stretch;
}

.dashboard-panel {
  min-width: 0;
  background: var(--white);
  border: 1px solid var(--line);
  padding: 20px;
}

.dashboard-summary .hero {
  justify-content: center;
}

.dashboard-summary .hero-num strong {
  font-size: clamp(56px, 6vw, 96px);
}

.dashboard-summary .kpis {
  height: 100%;
}

.dashboard-grid {
  display: grid;
  gap: 16px;
  align-items: start;
}

.dashboard-grid-main {
  grid-template-columns:
    minmax(430px, 1.2fr)
    minmax(400px, 1fr)
    minmax(260px, 0.72fr);
}

.dashboard-grid-performance {
  grid-template-columns: minmax(620px, 1.4fr) minmax(480px, 1fr);
}

.performance-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding-top: 8px;
}

.performance-heading h2 {
  font-size: clamp(24px, 2.5vw, 36px);
  font-weight: 500;
}

.legend-line {
  display: inline-block;
  width: 18px;
  height: 2px;
}

.legend-line.actual {
  background: var(--signal);
}

.legend-line.target {
  border-top: 2px dashed #8a8f99;
}

.table-wrap {
  overflow-x: auto;
}
```

- [ ] **Step 3: Add progressive responsive layouts**

Add before the existing `max-width: 640px` query:

```css
@media (max-width: 1240px) {
  .dashboard-summary {
    grid-template-columns: 1fr;
  }

  .dashboard-grid-main {
    grid-template-columns: minmax(0, 1fr) minmax(380px, 1fr);
  }

  .dashboard-activity {
    grid-column: 1 / -1;
  }

  .dashboard-grid-performance {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 820px) {
  .dashboard-grid-main {
    grid-template-columns: 1fr;
  }

  .dashboard-activity {
    grid-column: auto;
  }

  .performance-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
```

Extend the existing mobile query:

```css
@media (max-width: 640px) {
  .topbar-inner,
  .main {
    padding-left: 16px;
    padding-right: 16px;
  }

  .dashboard-panel,
  .panel {
    padding: 16px;
  }

  .kpis,
  .facts {
    grid-template-columns: 1fr;
  }
}
```

Do not remove `.matrix-wrap` or the table’s existing horizontal overflow wrapper.

- [ ] **Step 4: Compile the responsive layout**

Run:

```bash
npm run build
```

Expected: exit code `0`.

- [ ] **Step 5: Verify desktop, tablet, and mobile behavior**

With `npm run dev` running, inspect:

- `1440px`: summary is hero plus KPIs; matrix, plays, and activity share one row; chart and results share one row.
- `1024px`: summary stacks; matrix and plays share a row; activity spans beneath them; performance panels stack.
- `390px`: every panel is one column; no page-level horizontal overflow; matrix and results table scroll only inside their wrappers.
- Open a play at each width and confirm the drawer does not clip the dashboard or prevent Close/Escape.

- [ ] **Step 6: Commit the layout**

```bash
git add app/globals.css
git commit -m "style: add full-width dashboard grid"
```

---

### Task 3: Verify interactions and acceptance criteria

**Files:**
- Verify: `components/Demo.tsx`
- Verify: `components/RevenueChart.tsx`
- Verify: `app/globals.css`

**Interfaces:**
- Consumes: completed unified dashboard.
- Produces: verified production-ready behavior with no additional API.

- [ ] **Step 1: Run static copy and navigation checks**

Run:

```bash
rg "Thesis|investment model|Model \\$|role=\"tab\"|setTab" components/Demo.tsx components/RevenueChart.tsx
```

Expected: no matches.

Run:

```bash
rg "Year 1 ramp target|Cross-sell performance" components/Demo.tsx components/RevenueChart.tsx
```

Expected: matches in dashboard headings, KPI helper copy, chart legend, and chart accessible text.

- [ ] **Step 2: Exercise the send path**

1. Click `Run play`.
2. Wait for build, write, deliver, inbox, and open phases.
3. Click `Send intro`.
4. Confirm the drawer closes.
5. Confirm introductions increase by one, pipeline increases by the account value, the matrix cell flashes, activity receives a new entry, and the matching company-pair intro count increases.

- [ ] **Step 3: Exercise the not-a-fit and reset paths**

1. Run a different play and click `Not a fit`.
2. Confirm the activity entry says the feedback returned to the model and revenue metrics do not increase.
3. Click `Reset demo`.
4. Confirm statuses, introductions, pipeline, matrix emphasis, and company-pair values return to baseline.

- [ ] **Step 4: Run final automated checks**

Run:

```bash
npm run build
```

Expected: exit code `0` with successful Next.js compilation.

Check edited files with the IDE lint checker.

Expected: no new errors in `components/Demo.tsx`, `components/RevenueChart.tsx`, or `app/globals.css`.

- [ ] **Step 5: Confirm the final diff is scoped**

Run:

```bash
git status --short
git diff --check
```

Expected: only intended project files or implementation-plan tracking changes are present; `git diff --check` reports no whitespace errors.

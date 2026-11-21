# Unified Dashboard Design

## Goal

Combine the current Overview and Thesis views into one action-first operating dashboard. The dashboard should surface the opportunity, recommended actions, activity, and performance with less scrolling on desktop.

## Page Structure

Remove the Overview/Thesis navigation and render one dashboard in this order:

1. Opportunity hero and KPI strip
2. Opportunity matrix, weekly plays, and activity
3. Cross-sell revenue chart and company-pair results

The page uses the available viewport width with a small responsive outer gutter rather than a centered maximum-width container.

## Desktop Layout

Use a panel grid:

- Top: the opportunity hero beside the four KPI cards.
- Middle: opportunity matrix, weekly plays, and activity in three panels.
- Bottom: revenue performance chart and company-pair results in two panels.

Panel widths may favor content that needs more horizontal space. The matrix and chart should be wider than the activity panel. Text content remains constrained inside each panel so full-width layout does not create long reading lines.

## Responsive Behavior

- Large desktop: render the full panel grid.
- Smaller desktop and tablet: reduce columns and allow panels to wrap.
- Mobile: stack all panels in the narrative order.
- Matrix and table containers may scroll horizontally when their minimum readable width exceeds the viewport.
- Preserve the existing full-screen play drawer behavior at narrow widths.

## Content Changes

- Remove the `Thesis` label and tab.
- Introduce the performance section with the heading `Cross-sell performance`.
- Describe the `$780K` model as the `Year 1 ramp target`.
- Keep other critique-specific copy changes out of scope.

## Interaction and Data Flow

Existing play interactions remain unchanged. Running and completing a play continues to update:

- Introductions sent
- Open pipeline
- Opportunity matrix emphasis
- Activity feed
- Company-pair results

The play drawer, generated email flow, send action, not-a-fit action, and reset behavior remain functionally unchanged.

## Component Boundaries

- `Demo` owns shared state and play interactions.
- A single dashboard component replaces the separate `Overview` and `Thesis` views.
- Existing matrix, play list, activity, performance chart, and results table behavior should be preserved while their wrappers are reorganized into panels.
- Avoid unrelated data-model or generation-flow refactors.

## Accessibility

- Preserve semantic headings, button labels, table markup, and chart accessible text.
- Maintain keyboard focus styles and Escape-to-close behavior.
- Keep responsive overflow containers keyboard and touch usable.

## Verification

- Confirm there is no Overview/Thesis tab state or navigation.
- Confirm all dashboard sections render on one page.
- Confirm the full-width grid reduces desktop page height without clipping content.
- Test desktop, tablet, and mobile layouts.
- Run a play through send and not-a-fit paths and confirm all dependent metrics still update.
- Run the production build and check edited files for lint errors.

# Interactive Revenue Chart Design

## Goal

Make the cumulative cross-sell revenue chart easy to inspect by month without changing its existing visual style or taking up more page space.

## Interaction

- Treat each month as one interaction target spanning the chart's full plot height.
- On pointer hover, keyboard focus, or tap, select that month.
- Show a compact tooltip containing:
  - Month
  - Actual cumulative revenue
  - Modeled cumulative revenue
  - Dollar gap between actual and model
- Draw a subtle vertical guide at the selected month and emphasize both corresponding data points.
- Clear pointer selection when the pointer leaves the chart. Keyboard focus and taps remain usable without hover.

## Accessibility

- Give each month target a descriptive accessible label with all three values.
- Make month targets keyboard focusable.
- Preserve the chart's overall `role="img"` description.
- Do not depend on color alone: the tooltip names both series.

## Architecture

- Add typed month data near the chart component.
- Calculate SVG coordinates from values using small chart constants and helper functions.
- Keep chart state local to a focused `RevenueChart` component.
- Replace the current static chart SVG in `Thesis` with that component.
- Add only chart-specific styles to `app/globals.css`.

## Responsive Behavior

- Keep the current responsive SVG view box.
- Keep the tooltip inside the SVG bounds, shifting it left for later months.
- Use broad month hit areas so touch and pointer interaction do not require precise targeting.

## Verification

The project has no automated test framework. Verify with:

- TypeScript/Next.js production build.
- Lint diagnostics for edited files.
- Browser checks for first, middle, and last months.
- Pointer, keyboard, and narrow-screen interaction checks.

Adding a test runner is outside this feature's scope.

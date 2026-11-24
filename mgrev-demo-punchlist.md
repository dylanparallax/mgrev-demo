# mgREV demo: punchlist

Context: demo app for the fictional roll-up Northfield Services Group (Keystone HVAC, Ridgeline Electrical, Cardinal Fire, Summit Controls). All content is hard-coded. No live AI calls.

## 1. Profile switcher
- [ ] Add an avatar at the right side of the header that opens a profile switcher.
- [ ] Two profiles: **Value Creation Lead** (default) and **Sales Rep** (Jordan, Keystone).
- [ ] VCL profile shows the dashboard. Sales Rep profile shows the plays.
- [ ] Avatar is a circle, per avatar conventions (the one exception to the no-rounded-corners rule). Initials in Space Mono, uppercase.
- [ ] Switching profiles changes the view with no login or auth.

## 2. VCL dashboard: broaden beyond cross-sell
- [ ] Organize the dashboard by sales motion: Cross-sell, Upsell, New logo, Retention.
- [ ] Each motion shows its plays run and revenue tracked against the deal model.
- [ ] Cross-sell stays the most built-out motion and the one the demo clicks into.
- [ ] Update header and page copy so the product reads as an engine for any sales model, with brand as the multiplier ("1+1=3"), not a cross-sell-only tool.

## 3. Sales Rep view: plays
- [ ] Landing view is a list of plays assigned to the rep (account, motion, est. value, fit).
- [ ] First play: Harbor Point Hospital, Keystone customer → Cardinal Fire, $86K, High fit.
- [ ] Each play has a **Run play** button.
- [ ] Run play shows a short simulated "generating" state (about 1–2 seconds), then the play.

## 4. Play output: six tabs, in this order
- [ ] Why this account
- [ ] Email
- [ ] Call
- [ ] Battle card
- [ ] Objections
- [ ] Proof
- [ ] Content comes from `mgrev-demo-play-harbor-point.md`. Use it verbatim.
- [ ] Cap at six tabs. Don't add more.

## 5. Generation
- [ ] All play content is hard-coded.
- [ ] Optional: a "Regenerate" button on the Email tab that swaps between two pre-written versions.

## 6. Brand presentation
- [ ] No brand-source tags or annotations on the play output. The presenter explains the "why" out loud.
- [ ] Remove the existing "IN NORTHFIELD VOICE · EDIT FREELY" label from the email.
- [ ] Pending Geoff and Lou: optional "Without brand / With brand" toggle on the Email tab, using the generic email in the play doc. Build behind a flag so it can be turned off.

## 7. Design system (unchanged, enforce)
- [ ] Archivo for body. Space Mono for labels, always uppercase, normal tracking.
- [ ] No rounded corners anywhere, except the profile avatar.
- [ ] Monogram orange #F26322; #B3440F for orange text and links. Orange is reserved for money figures.
- [ ] Clean, minimal, slightly technical, fintech feel.

## 8. Data consistency
- [ ] Keep all names and numbers consistent with the concept screens: Harbor Point, Marcus Hale (facilities), Dana Ruiz (Cardinal), Jordan (Keystone rep), $86K, Q1 renewal, $4.2M total whitespace.

## Open decision
- [ ] Does the rep's in-app inbox stay as an entry point into the play (email notification → open play), or does the plays list replace it?

## Parked for later (do not build)
- Live email sent to the buyer's own inbox during the demo.
- Live AI generation.
- CRM connections.

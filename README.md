# mgREV demo

A presenter-driven demo of mgREV for a fictional roll-up, Northfield Services Group
(Keystone HVAC, Ridgeline Electrical, Cardinal Fire, Summit Controls). Built on the
mgREV design system from the "mgREV Concept Screens" canvas.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Optional: copy `.env.example` to `.env.local` and add `ANTHROPIC_API_KEY` to generate
the emails live. Without a key, the demo streams the staged emails in `lib/data.ts`,
so it never breaks in front of a buyer. If a live call fails, it falls back the same way.

## The flow (about 90 seconds per play)

1. **Overview.** The $4.2M whitespace number, the KPIs a VCL tracks, the company-pair
   matrix, and this week's plays.
2. **Run play.** The drawer opens and checks off each input: CRM history, buyer,
   signal, lookalike customers, Monogram brand voice, and the playbook rule.
3. **Write.** The introduction email streams in, written by Claude from those inputs.
4. **Deliver.** The draft flies out and lands in the rep's inbox with a notification.
5. **Act.** The opportunity opens. The rep clicks **Send intro** (or **Not a fit**).
6. **The loop closes.** The drawer closes, Introductions sent and Open pipeline tick up,
   the matrix cell flashes, and the activity feed logs it. The Thesis tab updates too.

Esc or Close stops a play. **Reset demo** (bottom of Overview) puts every number back.

## What's real and what's staged

| Real | Staged |
| --- | --- |
| Email generation (`app/api/generate/route.ts`) | Matrix, accounts, KPIs, chart, inbox (`lib/data.ts`) |

To change the story, edit `lib/data.ts`. Each account's `playRule` is the
opportunity-level "how"; it's the line to swap for Monogram's real playbook.

## Later

Live send: email the opportunity to the buyer's own inbox during the demo
(needs an email service such as Resend and a sending domain).

## Deploy

Push to GitHub and import in Vercel, or run `npx vercel`. Set `ANTHROPIC_API_KEY`
in the project's environment variables for live generation.

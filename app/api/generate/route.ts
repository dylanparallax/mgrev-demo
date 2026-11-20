import Anthropic from '@anthropic-ai/sdk';
import { accounts, brandVoice, companies, reps } from '@/lib/data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const encoder = new TextEncoder();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function buildPrompt(accountId: string) {
  const a = accounts.find((x) => x.id === accountId);
  if (!a) return null;
  const rep = reps[a.rep];
  const from = companies[a.from];
  const to = companies[a.to];

  const system = `You write cross-sell introduction emails for Northfield Services Group, a family of building-services companies.
The email is sent by a rep to a customer they already serve, introducing a specialist from a sister company.

Brand promise: ${brandVoice.promise}
Voice: ${brandVoice.voice.join(', ')}.

Playbook rules (follow all of them):
- ${Object.values(brandVoice.rules).join('\n- ')}
- For this opportunity: ${a.playRule}

Write like a person who knows this building, not like marketing. No exclamation points. No bullet points.
Output format, exactly:
Subject: <subject line, under 8 words>

<email body>`;

  const user = `Rep: ${rep.name}, ${rep.title} at ${from.full}
Customer: ${a.name}
Buyer: ${a.buyer.name}, ${a.buyer.role}. What they're accountable for: ${a.buyer.cares}
Relationship history: ${a.history}
Signal: ${a.signal}
Similar customers: ${a.lookalikes}
Introduce: ${a.specialist.name}, ${a.specialist.title} (${to.full}, ${to.trade})

Write the email.`;

  return { a, system, user };
}

function fallbackStream(text: string) {
  return new ReadableStream({
    async start(controller) {
      for (let i = 0; i < text.length; i += 3) {
        controller.enqueue(encoder.encode(text.slice(i, i + 3)));
        await sleep(16);
      }
      controller.close();
    },
  });
}

export async function POST(req: Request) {
  const { accountId } = (await req.json().catch(() => ({}))) as { accountId?: string };
  const built = accountId ? buildPrompt(accountId) : null;
  if (!built) return new Response('Unknown account', { status: 400 });

  const { a, system, user } = built;
  const fallback = `Subject: ${a.fallbackEmail.subject}\n\n${a.fallbackEmail.body}`;
  const headers = { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' };

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(fallbackStream(fallback), { headers: { ...headers, 'X-Mgrev-Source': 'staged' } });
  }

  const client = new Anthropic();
  const stream = new ReadableStream({
    async start(controller) {
      let sent = 0;
      try {
        const s = client.messages.stream({
          model: process.env.MGREV_MODEL || 'claude-sonnet-5-5',
          max_tokens: 600,
          system,
          messages: [{ role: 'user', content: user }],
        });
        for await (const event of s) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
            sent += event.delta.text.length;
          }
        }
      } catch (err) {
        console.error('[mgREV] generation failed, using staged email', err);
        // Never break a live demo: if nothing went out yet, stream the staged email.
        if (sent === 0) {
          for (let i = 0; i < fallback.length; i += 3) {
            controller.enqueue(encoder.encode(fallback.slice(i, i + 3)));
            await sleep(16);
          }
        }
      }
      controller.close();
    },
  });

  return new Response(stream, { headers: { ...headers, 'X-Mgrev-Source': 'live' } });
}

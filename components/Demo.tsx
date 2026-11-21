'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  accounts as seedAccounts,
  baseline,
  brandVoice,
  companies,
  companyOrder,
  matrix,
  pairs as seedPairs,
  reps,
  type Account,
  type CompanyId,
  type Pair,
} from '@/lib/data';
import RevenueChart from './RevenueChart';
import { useCountUp } from './useCountUp';

type Phase = 'build' | 'write' | 'deliver' | 'inbox' | 'open' | 'sent' | 'pass';
type Status = 'sent' | 'pass';
type FeedItem = { id: number; time: string; text: React.ReactNode };

const STEPS: { key: string; label: string; phases: Phase[] }[] = [
  { key: 'build', label: '1 Build', phases: ['build'] },
  { key: 'write', label: '2 Write', phases: ['write'] },
  { key: 'deliver', label: '3 Deliver', phases: ['deliver', 'inbox'] },
  { key: 'act', label: '4 Act', phases: ['open', 'sent', 'pass'] },
];
const ORDER: Phase[] = ['build', 'write', 'deliver', 'inbox', 'open', 'sent', 'pass'];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const clock = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
const fmtM = (k: number) => `$${(k / 1000).toFixed(2)}M`;
const pairName = (from: CompanyId, to: CompanyId) => `${companies[from].name} → ${companies[to].name}`;

function heat(v: number) {
  if (v >= 500) return 'h3';
  if (v >= 300) return 'h2';
  if (v > 0) return 'h1';
  return 'zero';
}

function splitDraft(text: string) {
  const m = text.match(/^\s*Subject:\s*(.*)\n?/i);
  if (!m) return { subject: '', body: text.replace(/^\s+/, '') };
  return { subject: m[1].trim(), body: text.slice(m[0].length).replace(/^\s+/, '') };
}

function inputsFor(a: Account) {
  const from = companies[a.from];
  return [
    { src: `${from.full} CRM`, what: a.history },
    { src: 'Buyer', what: `${a.buyer.name}, ${a.buyer.role}. Measured on: ${a.buyer.cares}` },
    { src: 'Signal', what: a.signal },
    { src: 'Northfield base', what: a.lookalikes },
    { src: 'Brand voice, Monogram', what: `"${brandVoice.promise}" ${brandVoice.voice.join(', ')}.` },
    { src: 'Playbook rule, Monogram', what: a.playRule, rule: true },
  ];
}

export default function Demo() {
  const [active, setActive] = useState<Account | null>(null);
  const [phase, setPhase] = useState<Phase>('build');
  const [inputsOn, setInputsOn] = useState(0);
  const [draft, setDraft] = useState('');
  const [source, setSource] = useState<'live' | 'staged' | null>(null);
  const [toast, setToast] = useState(0);

  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [intros, setIntros] = useState(baseline.intros);
  const [pipelineK, setPipelineK] = useState(baseline.pipeline * 1000);
  const [pairs, setPairs] = useState<Pair[]>(seedPairs);
  const [changedPair, setChangedPair] = useState<string | null>(null);
  const [bump, setBump] = useState(0);
  const [flashCell, setFlashCell] = useState<{ key: string; n: number } | null>(null);
  const [feed, setFeed] = useState<FeedItem[]>([
    { id: 3, time: 'Fri', text: <>Brookside Medical Plaza: meeting booked, <span className="row-sub">Keystone → Cardinal</span></> },
    { id: 2, time: 'Thu', text: <>Granite Logistics: quote sent, <span className="money mono">$48K</span>, <span className="row-sub">Ridgeline → Keystone</span></> },
    { id: 1, time: 'Thu', text: <>Oak Hollow ISD: intro sent by Alicia, <span className="row-sub">Summit → Keystone</span></> },
  ]);

  const run = useRef(0);
  const abort = useRef<AbortController | null>(null);

  const close = useCallback(() => {
    run.current++;
    abort.current?.abort();
    setActive(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && active) close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, close]);

  async function startPlay(a: Account) {
    const id = ++run.current;
    abort.current?.abort();
    const live = () => run.current === id;

    setActive(a);
    setPhase('build');
    setInputsOn(0);
    setDraft('');
    setSource(null);

    await sleep(500);
    for (let i = 1; i <= inputsFor(a).length; i++) {
      if (!live()) return;
      setInputsOn(i);
      await sleep(420);
    }
    await sleep(300);
    if (!live()) return;
    setPhase('write');

    const ctrl = new AbortController();
    abort.current = ctrl;
    let text = '';
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: a.id }),
        signal: ctrl.signal,
      });
      setSource(res.headers.get('X-Mgrev-Source') === 'live' ? 'live' : 'staged');
      const reader = res.body!.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done || !live()) break;
        text += dec.decode(value, { stream: true });
        setDraft(text);
      }
    } catch {
      if (!live()) return;
      // Network failure: stream the staged email client-side so the demo keeps moving.
      setSource('staged');
      const full = `Subject: ${a.fallbackEmail.subject}\n\n${a.fallbackEmail.body}`;
      for (let i = 0; i < full.length && live(); i += 3) {
        text = full.slice(0, i + 3);
        setDraft(text);
        await sleep(16);
      }
    }
    if (!live()) return;

    await sleep(900);
    if (!live()) return;
    setPhase('deliver');
    await sleep(950);
    if (!live()) return;
    setPhase('inbox');
    setToast((n) => n + 1);
    await sleep(1700);
    if (!live()) return;
    setPhase('open');
  }

  async function act(kind: Status) {
    if (!active) return;
    const a = active;
    const id = run.current;
    setPhase(kind);
    await sleep(2200);
    if (run.current !== id) return;
    close();
    await sleep(500);

    setStatuses((s) => ({ ...s, [a.id]: kind }));
    const rep = reps[a.rep];
    if (kind === 'sent') {
      setIntros((n) => n + 1);
      setPipelineK((k) => k + a.value);
      setBump((n) => n + 1);
      setFlashCell({ key: `${a.from}-${a.to}`, n: Date.now() });
      const key = `${a.from}-${a.to}`;
      setChangedPair(key);
      setPairs((ps) => {
        const hit = ps.find((p) => p.from === a.from && p.to === a.to);
        if (hit) return ps.map((p) => (p === hit ? { ...p, intros: p.intros + 1 } : p));
        return [...ps, { from: a.from, to: a.to, intros: 1, meetings: 0, quotes: 0, closed: 0, vsModel: 0 }];
      });
      setFeed((f) => [
        {
          id: Date.now(),
          time: clock(),
          text: (
            <>
              {rep.first} sent intro to {a.buyer.name} at {a.name}, <span className="money mono">+${a.value}K</span> pipeline,{' '}
              <span className="row-sub">{pairName(a.from, a.to)}</span>
            </>
          ),
        },
        ...f,
      ]);
    } else {
      setFeed((f) => [
        {
          id: Date.now(),
          time: clock(),
          text: (
            <>
              {rep.first} marked {a.name} not a fit, <span className="row-sub">fed back to the model</span>
            </>
          ),
        },
        ...f,
      ]);
    }
  }

  function reset() {
    close();
    setStatuses({});
    setIntros(baseline.intros);
    setPipelineK(baseline.pipeline * 1000);
    setPairs(seedPairs);
    setChangedPair(null);
    setFlashCell(null);
  }

  const ready = seedAccounts.filter((a) => !statuses[a.id]).length;

  return (
    <div className={`shell${active ? ' open' : ''}`}>
      <div className="stage">
        <header className="topbar">
          <div className="topbar-inner">
            <div className="brand">
              <span className="wordmark">
                mg<span>REV</span>
              </span>
              <span className="client">Northfield Services Group</span>
            </div>
          </div>
        </header>

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
      </div>

      <aside className="drawer" aria-hidden={!active}>
        {active && (
          <div className="drawer-inner">
            <div className="drawer-head">
              <div className="steps" aria-label="Progress">
                {STEPS.map((s) => {
                  const idx = ORDER.indexOf(phase);
                  const on = s.phases.includes(phase);
                  const done = !on && Math.max(...s.phases.map((p) => ORDER.indexOf(p))) < idx;
                  return (
                    <span key={s.key} className={`step${on ? ' on' : done ? ' done' : ''}`}>
                      {s.label}
                    </span>
                  );
                })}
              </div>
              <button className="close" onClick={close} aria-label="Close">
                Close
              </button>
            </div>
            <div className="drawer-body">
              {(phase === 'build' || phase === 'write' || phase === 'deliver') && (
                <BuildPanel a={active} phase={phase} inputsOn={inputsOn} draft={draft} source={source} />
              )}
              {(phase === 'inbox' || phase === 'open' || phase === 'sent' || phase === 'pass') && (
                <InboxPanel a={active} phase={phase} draft={draft} toast={toast} onOpen={() => setPhase('open')} onBack={() => setPhase('inbox')} onAct={act} />
              )}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */

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

  return (
    <main className="main">
      <section className="dashboard-summary" aria-label="Cross-sell summary">
        <section className="hero dashboard-panel">
          <span className="label">Cross-sell opportunity in your current customers</span>
          <h1 className="hero-num">
            <strong className="num">${baseline.whitespace}M</strong>
            <span>/ year</span>
          </h1>
          <p>
            Across <strong>318 existing customers</strong> who buy from one Northfield company and fit what another one sells.
          </p>
        </section>

        <section className="kpis">
          <div key={`i${bump}`} className={`kpi${bump ? ' bump' : ''}`}>
            <span className="k">Introductions sent</span>
            <span className="v">{Math.round(introsShown)}</span>
            <span className="s">{baseline.meetings} became meetings</span>
          </div>
          <div key={`p${bump}`} className={`kpi${bump ? ' bump' : ''}`}>
            <span className="k">Open cross-sell pipeline</span>
            <span className="v money">{fmtM(pipeShown)}</span>
            <span className="s">Source: CRM opportunities</span>
          </div>
          <div className="kpi">
            <span className="k">Cross-sell revenue YTD</span>
            <span className="v money">${baseline.revenueYtd}K</span>
            <span className="s">Year 1 ramp target ${baseline.model}K</span>
          </div>
          <div className="kpi">
            <span className="k">Customers resolved</span>
            <span className="v">{baseline.customersResolved.toLocaleString()}</span>
            <span className="s">From 1,942 records in 4 CRMs</span>
          </div>
        </section>
      </section>

      <section className="dashboard-grid dashboard-grid-main" aria-label="Cross-sell actions">
        <section className="dashboard-panel dashboard-matrix">
          <div className="col-head">
            <h2>Opportunity by company pair</h2>
            <span className="label">$K / yr, row sells to column</span>
          </div>
          <div
            className="matrix-wrap"
            tabIndex={0}
            role="region"
            aria-label="Opportunity by company pair matrix"
          >
            <div className="matrix">
              <div className="mh first">Customer of ↓</div>
              {companyOrder.map((c) => (
                <div key={c} className="mh">
                  {companies[c].name}
                </div>
              ))}
              {companyOrder.map((row) => (
                <Row key={row} row={row} active={active} flashCell={flashCell} />
              ))}
            </div>
          </div>
        </section>

        <section className="dashboard-panel dashboard-plays">
          <div className="col-head">
            <h2>This week&apos;s plays</h2>
            <span className="label">{ready} ready</span>
          </div>
          <div className="list">
            {accounts.map((a) => {
              const st = statuses[a.id];
              return (
                <div key={a.id} className="row">
                  <div className="row-main">
                    <span className="row-name">{a.name}</span>
                    <span className="row-sub">
                      {companies[a.from].name} customer, fits {companies[a.to].name}
                    </span>
                  </div>
                  {st === 'sent' ? (
                    <span className="chip sent">Intro sent</span>
                  ) : st === 'pass' ? (
                    <span className="chip pass">Not a fit</span>
                  ) : (
                    <span className={`chip ${a.fit === 'HIGH' ? 'high' : 'med'}`}>{a.fit}</span>
                  )}
                  <span className="row-val money">${a.value}K</span>
                  <button className="btn" disabled={!!st || active?.id === a.id} onClick={() => onPlay(a)}>
                    {st ? 'Done' : active?.id === a.id ? 'Running' : 'Run play'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="dashboard-panel dashboard-activity">
          <div className="col-head">
            <h2>Activity</h2>
            <button className="btn quiet" onClick={onReset}>
              Reset demo
            </button>
          </div>
          <div className="feed">
            {feed.slice(0, 6).map((f) => (
              <div key={f.id} className="feed-item">
                <time>{f.time}</time>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </section>
      </section>

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
          <div
            className="table-wrap"
            tabIndex={0}
            role="region"
            aria-label="Cross-sell performance by company pair table"
          >
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
    </main>
  );
}
function Row({ row, active, flashCell }: { row: CompanyId; active: Account | null; flashCell: { key: string; n: number } | null }) {
  return (
    <>
      <div className="mr">
        {companies[row].name} <span>{companies[row].trade}</span>
      </div>
      {companyOrder.map((col) => {
        if (col === row)
          return (
            <div key={col} className="mc self" aria-label="Same company">
              —
            </div>
          );
        const v = matrix[row][col] ?? 0;
        const key = `${row}-${col}`;
        const focus = active && active.from === row && active.to === col;
        const flash = flashCell?.key === key;
        return (
          <div key={flash ? `${col}-${flashCell!.n}` : col} className={`mc ${heat(v)}${focus ? ' focus' : ''}${flash ? ' flash' : ''}`}>
            {focus && <span className="dot" aria-hidden="true" />}
            {v}
          </div>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */

function BuildPanel({ a, phase, inputsOn, draft, source }: { a: Account; phase: Phase; inputsOn: number; draft: string; source: 'live' | 'staged' | null }) {
  const inputs = inputsFor(a);
  const { subject, body } = splitDraft(draft);
  const rep = reps[a.rep];
  const writing = phase === 'write';

  return (
    <div className="build">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span className="label">
          {pairName(a.from, a.to)}, <span className="money">${a.value}K / yr</span>
        </span>
        <h3>{a.name}</h3>
      </div>

      <div className="inputs">
        {inputs.map((x, i) => (
          <div key={x.src} className={`input${i < inputsOn ? ' on' : ''}`}>
            <span className="tick" aria-hidden="true" />
            <div>
              <div className="src">{x.src}</div>
              <div className={`what${x.rule ? ' rule' : ''}`}>{x.what}</div>
            </div>
          </div>
        ))}
      </div>

      {(phase === 'write' || phase === 'deliver') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="gen-meta">
            <span className="label">
              Introduction from {rep.first} to {a.buyer.first}
            </span>
            <span className="label">{writing ? 'Writing' : 'Done'}{source === 'staged' ? ', staged' : ''}</span>
          </div>
          <div className={`draft${phase === 'deliver' ? ' flying' : ''}`}>
            {subject && <span className="subj">{subject}</span>}
            {body}
            {writing && <span className="caret" aria-hidden="true" />}
          </div>
        </div>
      )}
    </div>
  );
}

function InboxPanel({
  a,
  phase,
  draft,
  toast,
  onOpen,
  onBack,
  onAct,
}: {
  a: Account;
  phase: Phase;
  draft: string;
  toast: number;
  onOpen: () => void;
  onBack: () => void;
  onAct: (k: Status) => void;
}) {
  const rep = reps[a.rep];
  const to = companies[a.to];
  const { subject, body } = splitDraft(draft);
  const title = `${a.name} fits ${to.full}`;
  const opened = phase !== 'inbox';

  if (!opened) {
    return (
      <div className="inbox">
        <div key={toast} className="toast" role="status">
          <span className="label">New, mgREV</span>
          <span style={{ fontSize: 14 }}>{title}</span>
        </div>
        <div className="inbox-top">
          <strong>Inbox</strong>
          <span>{rep.email}</span>
        </div>
        <button className="msg new" onClick={onOpen}>
          <span className="msg-line">
            <b>mgREV, Northfield</b>
            <time>Just now</time>
          </span>
          <span className="subj">{title}</span>
          <span className="prev">Intro drafted to {a.buyer.first}. One click to send.</span>
        </button>
        <div className="msg read">
          <span className="msg-line">
            <b>{a.buyer.name}</b>
            <time>Yesterday</time>
          </span>
          <span className="subj">RE: Service window next week</span>
          <span className="prev">Thursday works for us. Badge in at the east entrance…</span>
        </div>
        <div className="msg read">
          <span className="msg-line">
            <b>Dispatch</b>
            <time>Yesterday</time>
          </span>
          <span className="subj">Weekly service schedule</span>
          <span className="prev">14 visits booked for your accounts this week…</span>
        </div>
        <div className="msg read">
          <span className="msg-line">
            <b>mgREV, Northfield</b>
            <time>Nov 6</time>
          </span>
          <span className="subj">Brookside Medical Plaza: meeting booked</span>
          <span className="prev">You&apos;re credited as originating rep…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="inbox">
      <div className="inbox-top">
        <button className="close" onClick={onBack} style={{ paddingLeft: 0 }}>
          ← Inbox
        </button>
        <span>{rep.email}</span>
      </div>
      <article className="letter">
        <header style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="label">Cross-sell opportunity, from mgREV</span>
          <h3>{title}</h3>
        </header>

        <div className="facts">
          <div className="fact">
            <span className="k">Est. annual value</span>
            <span className="v mono money">${a.value}K</span>
          </div>
          <div className="fact">
            <span className="k">Fit</span>
            <span className="v mono">{a.fit === 'HIGH' ? 'High' : 'Med'}</span>
          </div>
          <div className="fact">
            <span className="k">{to.name} contact</span>
            <span className="v">{a.specialist.name}</span>
          </div>
        </div>

        <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h2 style={{ fontSize: 15 }}>Why it fits</h2>
          <ul className="why">
            {a.why.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="col-head">
            <h2 style={{ fontSize: 15 }}>Your introduction</h2>
            <span className="label" style={{ fontSize: 11 }}>
              In Northfield voice, edit freely
            </span>
          </div>
          <div className="draft" contentEditable={phase === 'open'} suppressContentEditableWarning aria-label="Introduction email draft">
            {subject && <span className="subj">{subject}</span>}
            {body}
          </div>
        </section>

        {phase === 'open' && (
          <div className="actions">
            <button className="btn big" onClick={() => onAct('sent')}>
              Send intro
            </button>
            <button className="btn ghost big">Remind me Monday</button>
            <button className="btn quiet big" onClick={() => onAct('pass')}>
              Not a fit
            </button>
          </div>
        )}
        {phase === 'sent' && (
          <div className="done-banner" role="status">
            <span className="label">Intro sent, {clock()}</span>
            <span>
              To {a.buyer.name}, cc {a.specialist.name}. Logged to the CRM, <span style={{ color: '#FBCFB5' }}>+${a.value}K</span> in pipeline.
            </span>
          </div>
        )}
        {phase === 'pass' && (
          <div className="done-banner" role="status">
            <span className="label">Logged, {clock()}</span>
            <span>Thanks. This goes back into the model so the next play is sharper.</span>
          </div>
        )}

       
      </article>
    </div>
  );
}

'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  accounts as seedAccounts,
  baseline,
  companies,
  companyOrder,
  matrix,
  pairs as seedPairs,
  type Account,
  type CompanyId,
  type Pair,
} from '@/lib/data';
import {
  accountMotionLine,
  motions,
  previewPlays,
  type Motion,
  type MotionId,
} from '@/lib/playContent';
import PlayPanel from './PlayPanel';
import ProfileSwitch, { type ProfileId } from './ProfileSwitch';
import RevenueChart from './RevenueChart';
import { useCountUp } from './useCountUp';

type FeedItem = { id: number; time: string; text: ReactNode };
type PlayPhase = 'generating' | 'ready';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const fmtM = (k: number) => `$${(k / 1000).toFixed(2)}M`;
const pairName = (from: CompanyId, to: CompanyId) => `${companies[from].name} → ${companies[to].name}`;

function heat(v: number) {
  if (v >= 500) return 'h3';
  if (v >= 300) return 'h2';
  if (v > 0) return 'h1';
  return 'zero';
}

function OpportunityDonut({
  fits,
  intros,
  meetings,
  quotes,
}: {
  fits: number;
  intros: number;
  meetings: number;
  quotes: number;
}) {
  const slices = [
    { key: 'waiting', label: 'Not introduced', value: Math.max(0, fits - intros) },
    { key: 'intro', label: 'Introduced, no meeting', value: Math.max(0, intros - meetings) },
    { key: 'meeting', label: 'Met, no quote', value: Math.max(0, meetings - quotes) },
    { key: 'quote', label: 'Quoted', value: Math.max(0, quotes) },
  ];
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const gap = 3;
  let cursor = 0;
  const summary = slices.map((slice) => `${Math.round(slice.value).toLocaleString()} ${slice.label}`).join(', ');

  return (
    <div className="donut-fig">
      <svg className="donut" viewBox="0 0 120 120" role="img" aria-label={`Opportunity mix. ${summary}.`}>
        {slices.map((slice) => {
          const raw = (slice.value / fits) * circumference;
          const length = Math.max(0, raw - gap);
          const dashOffset = -cursor;
          cursor += raw;
          return (
            <circle
              key={slice.key}
              className={slice.key}
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              strokeWidth="14"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 60 60)"
            />
          );
        })}
        <text className="donut-total" x="60" y="60" textAnchor="middle" dominantBaseline="central">
          {fits.toLocaleString()}
        </text>
      </svg>
      <ul className="donut-legend">
        {slices.map((slice) => (
          <li key={slice.key}>
            <i className={`swatch ${slice.key}`} aria-hidden="true" />
            <span className="num">{Math.round(slice.value).toLocaleString()}</span>
            <span>{slice.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Demo() {
  const [profile, setProfile] = useState<ProfileId>('vcl');
  const [active, setActive] = useState<Account | null>(null);
  const [phase, setPhase] = useState<PlayPhase>('ready');
  const run = useRef(0);

  const close = useCallback(() => {
    run.current += 1;
    setActive(null);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && active) close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, close]);

  async function startPlay(account: Account) {
    const id = ++run.current;
    setActive(account);
    setPhase('generating');
    await sleep(1500);
    if (run.current !== id) return;
    setPhase('ready');
  }

  function switchProfile(next: ProfileId) {
    close();
    setProfile(next);
  }

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
            <ProfileSwitch profile={profile} onChange={switchProfile} />
          </div>
        </header>

        {profile === 'vcl' ? (
          <Dashboard accounts={seedAccounts} active={active} onPlay={startPlay} />
        ) : (
          <RepPlays active={active} onPlay={startPlay} />
        )}
      </div>

      <aside className="drawer" aria-hidden={!active}>
        {active && (
          <div className="drawer-inner">
            <div className="drawer-head">
              <div>
                <span className="label">{accountMotionLine(active)}</span>
                <h2 className="drawer-title">{active.name}</h2>
              </div>
              <button type="button" className="close" onClick={close} aria-label="Close">
                Close
              </button>
            </div>
            <div className="drawer-body">
              <PlayPanel account={active} phase={phase} />
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function Dashboard({
  accounts,
  active,
  onPlay,
}: {
  accounts: Account[];
  active: Account | null;
  onPlay: (account: Account) => void;
}) {
  const [motion, setMotion] = useState<MotionId>('cross-sell');
  const introsShown = useCountUp(baseline.intros);
  const pipeShown = useCountUp(baseline.pipeline * 1000);
  const quotes = seedPairs.reduce((sum, pair) => sum + pair.quotes, 0);
  const rampPct = Math.round((baseline.revenueYtd / baseline.model) * 100);
  const introPct = Math.min(100, Math.round((introsShown / baseline.fits) * 100));
  const selected = motions.find((item) => item.id === motion) ?? motions[0];

  return (
    <main className="main">
      <section className="dashboard-summary" aria-label="Whitespace summary">
        <section className="hero">
          <h1 className="hero-num">
            <strong className="num">${baseline.whitespace}M</strong>
            <span>/ year</span>
          </h1>
        </section>
        {motion === 'cross-sell' ? (
          <section className="kpis">
            <div className="kpi">
              <span className="k">Opportunity mix</span>
              <OpportunityDonut fits={baseline.fits} intros={introsShown} meetings={baseline.meetings} quotes={quotes} />
            </div>
            <div className="kpi">
              <span className="k">Plays run</span>
              <span className="v num">{Math.round(introsShown).toLocaleString()}</span>
              <div
                className="meter"
                role="meter"
                aria-valuemin={0}
                aria-valuemax={baseline.fits}
                aria-valuenow={Math.round(introsShown)}
                aria-label={`${Math.round(introsShown).toLocaleString()} of ${baseline.fits.toLocaleString()} customer fits`}
              >
                <span style={{ width: `${introPct}%` }} />
              </div>
              <span className="s">
                {introPct}% of {baseline.fits.toLocaleString()} customer fits
              </span>
            </div>
            <div className="kpi">
              <span className="k">Open pipeline</span>
              <span className="v money">{fmtM(pipeShown)}</span>
              <span className="s">Cross-sell opportunities</span>
            </div>
            <div className="kpi">
              <span className="k">Revenue vs. deal model</span>
              <span className="v money">${baseline.revenueYtd}K</span>
              <div
                className="meter"
                role="meter"
                aria-valuemin={0}
                aria-valuemax={baseline.model}
                aria-valuenow={baseline.revenueYtd}
                aria-label={`$${baseline.revenueYtd}K of $${baseline.model}K Year 1 ramp target`}
              >
                <span style={{ width: `${rampPct}%` }} />
              </div>
              <span className="s">
                {rampPct}% of ${baseline.model}K Year 1 target
              </span>
            </div>
          </section>
        ) : (
          <MotionStat motion={selected} />
        )}
      </section>

      <section className="motions" aria-label="Sales motions">
        {motions.map((item) => {
          const on = item.id === motion;
          const pct = Math.round((item.revenueK / item.modelK) * 100);
          return (
            <button
              key={item.id}
              type="button"
              className={`motion${on ? ' on' : ''}`}
              aria-pressed={on}
              onClick={() => setMotion(item.id)}
            >
              <span className="label">{item.label}</span>
              <span className="motion-run">
                <strong className="num">{item.playsRun.toLocaleString()}</strong> plays run
              </span>
              <span className="motion-rev">
                <span className="money">${item.revenueK}K</span> of <span className="money">${item.modelK}K</span> model · {pct}%
              </span>
            </button>
          );
        })}
      </section>

      {motion === 'cross-sell' ? (
        <CrossSellDetail accounts={accounts} active={active} onPlay={onPlay} rampPct={rampPct} pairs={seedPairs} />
      ) : (
        <MotionPreview motion={selected} />
      )}
    </main>
  );
}

function MotionStat({ motion }: { motion: Motion }) {
  const pct = Math.round((motion.revenueK / motion.modelK) * 100);
  return (
    <section className="kpis motion-stat" aria-label={`${motion.label} against the deal model`}>
      <div className="kpi">
        <span className="k">Plays run</span>
        <span className="v num">{motion.playsRun.toLocaleString()}</span>
        <span className="s">{motion.label}</span>
      </div>
      <div className="kpi">
        <span className="k">Revenue vs. deal model</span>
        <span className="v money">${motion.revenueK}K</span>
        <div
          className="meter"
          role="meter"
          aria-valuemin={0}
          aria-valuemax={motion.modelK}
          aria-valuenow={motion.revenueK}
          aria-label={`$${motion.revenueK}K of $${motion.modelK}K deal model`}
        >
          <span style={{ width: `${pct}%` }} />
        </div>
        <span className="s">
          {pct}% of ${motion.modelK}K model
        </span>
      </div>
      <p className="motion-blurb">{motion.blurb}</p>
    </section>
  );
}

function MotionPreview({ motion }: { motion: Motion }) {
  if (motion.id === 'cross-sell') return null;
  const plays = previewPlays[motion.id];
  return (
    <section className="dashboard-panel" aria-label={`${motion.label} plays`}>
      <div className="col-head">
        <h2>{motion.label} plays</h2>
        <span className="label">{plays.length} shown</span>
      </div>
      <div className="list">
        {plays.map((play) => (
          <div key={play.name} className="row">
            <div className="row-main">
              <span className="row-name">{play.name}</span>
              <span className="row-sub">{play.detail}</span>
            </div>
            <span className={`chip ${play.fit === 'HIGH' ? 'high' : 'med'}`}>{play.fit === 'HIGH' ? 'High' : 'Med'}</span>
            <span className="row-val money">${play.value}K</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function CrossSellDetail({
  accounts,
  active,
  onPlay,
  rampPct,
  pairs,
}: {
  accounts: Account[];
  active: Account | null;
  onPlay: (account: Account) => void;
  rampPct: number;
  pairs: Pair[];
}) {
  return (
    <>
      <p className="motion-note">
        Across <strong>{baseline.fits.toLocaleString()} existing customers</strong> who buy from one Northfield company and fit what another one sells.
      </p>

      <section className="dashboard-grid dashboard-grid-main" aria-label="Cross-sell actions">
        <section className="dashboard-panel dashboard-matrix">
          <div className="col-head">
            <h2>Opportunity by company pair</h2>
            <span className="label">$K / yr, row sells to column</span>
          </div>
          <div className="matrix-wrap" tabIndex={0} role="region" aria-label="Opportunity by company pair matrix">
            <div className="matrix">
              <div className="mh first">Customer of ↓</div>
              {companyOrder.map((company) => (
                <div key={company} className="mh">
                  {companies[company].name}
                </div>
              ))}
              {companyOrder.map((row) => (
                <Row key={row} row={row} active={active} />
              ))}
            </div>
          </div>
        </section>

        <section className="dashboard-panel dashboard-plays">
          <div className="col-head">
            <h2>This week&apos;s plays</h2>
            <span className="label">{accounts.length} ready</span>
          </div>
          <div className="list">
            {accounts.map((account) => (
              <PlayRow key={account.id} account={account} active={active} onPlay={onPlay} />
            ))}
          </div>
        </section>

        <section className="dashboard-panel dashboard-activity">
          <div className="col-head">
            <h2>Activity</h2>
          </div>
          <div className="feed">
            <Feed />
          </div>
        </section>
      </section>

      <section className="performance-heading">
        <h2>Cross-sell performance</h2>
        <h2>{rampPct}% of Year 1 ramp target</h2>
      </section>

      <section className="dashboard-grid dashboard-grid-performance" aria-label="Cross-sell performance">
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
          <div className="table-wrap" tabIndex={0} role="region" aria-label="Cross-sell performance by company pair table">
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
              <tbody>
                {pairs.map((pair) => {
                  const key = `${pair.from}-${pair.to}`;
                  return (
                    <tr key={key} className={pair.stalled ? 'stalled' : ''}>
                      <td>
                        {pairName(pair.from, pair.to)}
                        {pair.stalled && (
                          <span className="mono" style={{ fontSize: 11, marginLeft: 8 }}>
                            Stalled
                          </span>
                        )}
                      </td>
                      <td>{pair.intros}</td>
                      <td>{pair.meetings}</td>
                      <td>{pair.quotes}</td>
                      <td className="money">${pair.closed}K</td>
                      <td className={pair.vsModel > 0 ? 'up' : ''}>
                        {pair.vsModel === 0 ? 'New' : `${pair.vsModel > 0 ? '+' : '−'}${Math.abs(pair.vsModel)}%`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </>
  );
}

const FEED: FeedItem[] = [
  { id: 6, time: 'Fri', text: <>Brookside Medical Plaza: meeting booked, <span className="row-sub">Keystone → Cardinal</span></> },
  { id: 5, time: 'Thu', text: <>Granite Logistics: quote sent, <span className="money mono">$48K</span>, <span className="row-sub">Ridgeline → Keystone</span></> },
  { id: 4, time: 'Thu', text: <>Oak Hollow ISD: intro sent by Alicia, <span className="row-sub">Summit → Keystone</span></> },
  { id: 3, time: 'Wed', text: <>Northline Cold Storage: intro sent by Sam, <span className="row-sub">Ridgeline → Keystone</span></> },
  { id: 2, time: 'Wed', text: <>St. Brigid Clinic: meeting booked, <span className="row-sub">Keystone → Cardinal</span></> },
  { id: 1, time: 'Tue', text: <>Fieldstone Mall: quote sent, <span className="money mono">$36K</span>, <span className="row-sub">Keystone → Ridgeline</span></> },
];

function Feed() {
  return FEED.map((item) => (
    <div key={item.id} className="feed-item">
      <time>{item.time}</time>
      <span>{item.text}</span>
    </div>
  ));
}

function PlayRow({
  account,
  active,
  onPlay,
}: {
  account: Account;
  active: Account | null;
  onPlay: (account: Account) => void;
}) {
  const running = active?.id === account.id;
  return (
    <div className="row">
      <div className="row-main">
        <span className="row-name">{account.name}</span>
        <span className="row-sub">{accountMotionLine(account)}</span>
      </div>
      <span className={`chip ${account.fit === 'HIGH' ? 'high' : 'med'}`}>{account.fit === 'HIGH' ? 'High' : 'Med'}</span>
      <span className="row-val money">${account.value}K</span>
      <button type="button" className="btn" disabled={running} onClick={() => onPlay(account)}>
        {running ? 'Running' : 'Run play'}
      </button>
    </div>
  );
}

function RepPlays({ active, onPlay }: { active: Account | null; onPlay: (account: Account) => void }) {
  const plays = seedAccounts
    .filter((account) => account.rep === 'jordan')
    .sort((a, b) => Number(b.id === 'harbor-point') - Number(a.id === 'harbor-point'));

  return (
    <main className="main">
      <section className="hero">
        <h1 className="page-title">Plays</h1>
      </section>
      <section className="dashboard-panel rep-plays" aria-label="Plays assigned to Jordan">
        <div className="table-wrap">
          <table className="rep-table">
            <thead>
              <tr>
                <th scope="col">Account</th>
                <th scope="col">Motion</th>
                <th scope="col">Est. value</th>
                <th scope="col">Fit</th>
                <th scope="col">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {plays.map((account) => {
                const running = active?.id === account.id;
                return (
                  <tr key={account.id}>
                    <td>
                      <div className="row-main">
                        <span className="row-name">{account.name}</span>
                        <span className="row-sub">{accountMotionLine(account)}</span>
                      </div>
                    </td>
                    <td className="mono">Cross-sell</td>
                    <td className="money mono">${account.value}K</td>
                    <td>
                      <span className={`chip ${account.fit === 'HIGH' ? 'high' : 'med'}`}>
                        {account.fit === 'HIGH' ? 'High' : 'Med'}
                      </span>
                    </td>
                    <td>
                      <button type="button" className="btn" disabled={running} onClick={() => onPlay(account)}>
                        {running ? 'Running' : 'Run play'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Row({ row, active }: { row: CompanyId; active: Account | null }) {
  return (
    <>
      <div className="mr">
        {companies[row].name} <span>{companies[row].trade}</span>
      </div>
      {companyOrder.map((col) => {
        if (col === row) {
          return (
            <div key={col} className="mc self" aria-label="Same company">
              —
            </div>
          );
        }
        const value = matrix[row][col] ?? 0;
        const focus = active && active.from === row && active.to === col;
        return (
          <div key={col} className={`mc ${heat(value)}${focus ? ' focus' : ''}`}>
            {focus && <span className="dot" aria-hidden="true" />}
            {value}
          </div>
        );
      })}
    </>
  );
}

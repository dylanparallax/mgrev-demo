'use client';

import { useEffect, useState } from 'react';
import type { Account } from '@/lib/data';
import { PLAY_TABS, SHOW_BRAND_TOGGLE, playFor, type PlayTabId } from '@/lib/playContent';

export default function PlayPanel({
  account,
  phase,
}: {
  account: Account;
  phase: 'generating' | 'ready';
}) {
  const play = playFor(account);
  const [tab, setTab] = useState<PlayTabId>('brief');
  const [withBrand, setWithBrand] = useState(true);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setTab('brief');
    setWithBrand(true);
    setSent(false);
  }, [account.id]);

  if (phase === 'generating') {
    return (
      <div className="generating" role="status" aria-live="polite">
        <span className="label">Generating</span>
        <h3>{account.name}</h3>
        <div className="meter generating-meter" aria-hidden="true">
          <span />
        </div>
      </div>
    );
  }

  const email = withBrand || !SHOW_BRAND_TOGGLE ? play.brandedEmail : play.genericEmail;

  return (
    <div className="play">
      <div className="play-tabs" role="tablist" aria-label="Play output">
        {PLAY_TABS.map((item) => {
          const selected = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`play-tab-${item.id}`}
              className={`play-tab${selected ? ' on' : ''}`}
              aria-selected={selected}
              aria-controls={`play-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        className="play-body"
        role="tabpanel"
        id={`play-panel-${tab}`}
        aria-labelledby={`play-tab-${tab}`}
      >
        {tab === 'brief' && (
          <>
            <p className="play-kicker">
              {play.kicker.account} · Est. <span className="money">{play.kicker.value}</span> / year · Fit:{' '}
              {play.kicker.fit} · Renewal window: {play.kicker.renewal}
            </p>
            <ul className="why">
              {play.points.map((point) => (
                <li key={`${point.lead}${point.text}`}>
                  {point.lead ? <strong>{point.lead} </strong> : null}
                  {point.text}
                </li>
              ))}
            </ul>
            <p>{play.dealIncludes}</p>
          </>
        )}

        {tab === 'email' && (
          <>
            {SHOW_BRAND_TOGGLE && (
              <div className="brand-toggle" role="group" aria-label="Email version">
                <button type="button" className={!withBrand ? 'on' : ''} aria-pressed={!withBrand} onClick={() => setWithBrand(false)}>
                  Without brand
                </button>
                <button type="button" className={withBrand ? 'on' : ''} aria-pressed={withBrand} onClick={() => setWithBrand(true)}>
                  With brand
                </button>
              </div>
            )}
            <div className="draft">
              {email.subject ? <span className="subj">Subject: {email.subject}</span> : null}
              {email.body}
            </div>
            {sent ? (
              <div className="done-banner" role="status">
                <span className="label">Email sent</span>
                <span>To {account.buyer.name}.</span>
              </div>
            ) : (
              <div className="actions">
                <button type="button" className="btn big" onClick={() => setSent(true)}>
                  Send email
                </button>
              </div>
            )}
          </>
        )}

        {tab === 'call' && (
          <>
            {play.call.map((block) => (
              <section key={block.heading} className="play-section">
                <h3>{block.heading}</h3>
                {block.body ? <p>{block.body}</p> : null}
                {block.items ? (
                  block.ordered ? (
                    <ol className="play-list">
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  ) : (
                    <ul className="play-list">
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )
                ) : null}
              </section>
            ))}
            <div className="call-contact">
              <span className="label">Contact</span>
              <strong>{account.buyer.name}</strong>
              <span className="phone">{account.buyer.phone}</span>
            </div>
          </>
        )}

        {tab === 'objections' &&
          play.objections.map((item) => (
            <section key={item.objection} className="play-section">
              <h3>&quot;{item.objection}&quot;</h3>
              <p>{item.response}</p>
            </section>
          ))}

        {tab === 'battle' && (
          <>
            <p>{play.incumbent}</p>
            <div className="battle-wrap" tabIndex={0} role="region" aria-label="Battle card">
              <table className="battle">
                <thead>
                  <tr>
                    <th scope="col">
                      <span className="sr-only">Topic</span>
                    </th>
                    {play.battleColumns.map((column) => (
                      <th key={column} scope="col">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {play.battleRows.map((row) => (
                    <tr key={row.topic}>
                      <th scope="row">{row.topic}</th>
                      <td>{row.incumbent}</td>
                      <td>{row.northfield}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {play.battleNotes.map((note) => (
              <p key={note.label}>
                <strong>{note.label} </strong>
                {note.text}
              </p>
            ))}
          </>
        )}

        {tab === 'contacts' &&
          play.contactGroups.map((group) => (
            <section key={group.heading} className="play-section contacts">
              <h3>{group.heading}</h3>
              <div className="battle-wrap" tabIndex={0} role="region" aria-label={group.heading}>
                <table className="battle">
                  <thead>
                    <tr>
                      {group.columns.map((column) => (
                        <th key={column} scope="col">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.map((row) => (
                      <tr key={row.name}>
                        <td>
                          <strong>{row.name}</strong>, {row.role}
                        </td>
                        {row.cells.map((cell) => (
                          <td key={cell}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}

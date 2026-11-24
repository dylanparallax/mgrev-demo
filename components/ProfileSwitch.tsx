'use client';

import { useEffect, useId, useRef, useState } from 'react';

export type ProfileId = 'vcl' | 'rep';

const PROFILES: { id: ProfileId; initials: string; name: string; detail: string }[] = [
  { id: 'vcl', initials: 'VC', name: 'Value Creation Lead', detail: 'Dashboard' },
  { id: 'rep', initials: 'JE', name: 'Sales Rep', detail: 'Jordan, Keystone' },
];

export default function ProfileSwitch({
  profile,
  onChange,
}: {
  profile: ProfileId;
  onChange: (id: ProfileId) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const current = PROFILES.find((item) => item.id === profile) ?? PROFILES[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', onPointer);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onPointer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="profile" ref={rootRef}>
      <button
        type="button"
        className="avatar"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Profile, ${current.name}. Switch profile.`}
        onClick={() => setOpen((value) => !value)}
      >
        {current.initials}
      </button>
      {open && (
        <div className="profile-menu" id={menuId} role="menu" aria-label="Profiles">
          {PROFILES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitemradio"
              aria-checked={item.id === profile}
              className={`profile-item${item.id === profile ? ' on' : ''}`}
              onClick={() => {
                onChange(item.id);
                setOpen(false);
              }}
            >
              <strong>{item.name}</strong>
              <span>{item.detail}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

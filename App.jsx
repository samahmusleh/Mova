import React, { useEffect, useState } from 'react';
import { StatusBar } from './ui.jsx';
import { baseLogs } from './data.js';
import Mentee from './Mentee.jsx';
import Mentor from './Mentor.jsx';
import Advisor from './Advisor.jsx';

// Shared demo state so the three roles affect each other live during the pitch:
// Kayla checks in → Jaylen gets a nudge → Jaylen logs help → Mr. Robinson reviews it.
const initialShared = {
  kaylaCheckin: null,       // 'good' | 'bus' | 'family' | 'meh'
  kaylaAskedForHelp: false,
  jaylenMessage: null,
  kaylaComeback: false,
  menteePoints: 340,
  mentorPoints: 1240,
  codeAgreed: false,
  ferpaAck: false,
  logs: baseLogs
};

export default function App() {
  const [role, setRole] = useState(null);
  const [launching, setLaunching] = useState(true);
  const [shared, setShared] = useState(initialShared);
  const update = patch => setShared(s => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));

  useEffect(() => { const t = setTimeout(() => setLaunching(false), 1400); return () => clearTimeout(t); }, []);

  const props = { shared, update, switchRole: () => setRole(null) };
  return (
    <main className="device">
      {launching ? <Launch /> :
        role === 'mentee' ? <Mentee {...props} /> :
        role === 'mentor' ? <Mentor {...props} /> :
        role === 'advisor' ? <Advisor {...props} /> :
        <RolePicker onPick={setRole} onReset={() => setShared(initialShared)} />}
    </main>
  );
}

export function Logo({ size = 54 }) {
  return (
    <span className="logo" style={{ fontSize: size }}>
      <span className="mark" style={{ width: size * 1.18, height: size * 1.18, borderRadius: size / 3 }} aria-hidden="true">
        <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24" fill="none" stroke="#B4EE1F" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18L18 6M9 6h9v9" /></svg>
      </span>
      mova
    </span>
  );
}

function Launch() {
  return (
    <div className="launch" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <span className="blob" style={{ width: 220, height: 220, background: 'var(--fun-purple)', top: -60, right: -40 }} />
      <span className="blob" style={{ width: 200, height: 200, background: 'var(--bg-brand)', bottom: -40, left: -70 }} />
      <span className="blob" style={{ width: 90, height: 90, background: 'var(--fun-pink)', bottom: 200, right: -10 }} />
      <span className="blob" style={{ width: 46, height: 46, background: 'var(--fun-orange)', top: 130, left: 40 }} />
      <Logo />
      <h2>Show up. Show the way.</h2>
      <p className="caption" style={{ color: 'var(--text-primary)' }}>Moving Our Young Ahead</p>
    </div>
  );
}

function RolePicker({ onPick, onReset }) {
  const roles = [
    ['mentee', 'KN', 'needs', 'Kayla · 9th grade mentee', 'Check in, catch up, earn points'],
    ['mentor', 'JW', 'ok', 'Jaylen · 10th grade mentor', 'Lead a crew of 5, log help, unlock rewards'],
    ['advisor', 'MR', 'ok', 'Mr. Robinson · teacher advisor', 'See help requests, challenges and mentor logs']
  ];
  return (
    <>
      <StatusBar />
      <div className="scroll" style={{ justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', display: 'grid', gap: 8, justifyItems: 'center' }}>
          <Logo size={40} />
          <p className="muted">Students who miss class become mentors younger students count on.</p>
        </div>
        <h2 style={{ marginTop: 8 }}>Try the demo as…</h2>
        {roles.map(([id, ini, st, title, sub]) => (
          <button key={id} className="role-btn" onClick={() => onPick(id)}>
            <span className={`bubble ${st}`}>{ini}</span>
            <span className="grow" style={{ flex: 1 }}><b style={{ display: 'block' }}>{title}</b><span className="caption">{sub}</span></span>
            <span aria-hidden="true">›</span>
          </button>
        ))}
        <p className="caption" style={{ textAlign: 'center' }}>Demo data only. No real students. Switch roles anytime to see how one action reaches everyone.</p>
        <button className="btn ghost small" onClick={onReset}>Reset demo</button>
      </div>
    </>
  );
}

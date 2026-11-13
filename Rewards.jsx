import React, { useState } from 'react';
import { TopBar, Points, Confetti, Bubble } from './ui.jsx';
import { rewards, crew } from './data.js';

export default function Rewards({ points, onClaim }) {
  const [unlocked, setUnlocked] = useState(null);
  const near = rewards.filter(r => r.near);
  const rest = rewards.filter(r => !r.near);

  if (unlocked) return <Unlocked onClaim={() => { setUnlocked(null); onClaim?.(); }} />;

  return (
    <>
      <TopBar eyebrow="Credits & rewards" title="My rewards" right={<Points value={points} />} />
      <div className="scroll">
        <div className="hero row">
          <div className="grow"><h3>{near.length} rewards are almost yours!</h3><p className="caption">Keep showing up this week to unlock them.</p></div>
          <span style={{ fontSize: 30 }} aria-hidden="true">🔥</span>
        </div>
        <h2>Almost there 🔥</h2>
        {near.map(r => <RewardCard key={r.id} r={r} onOpen={r.id === 'pizza' ? () => setUnlocked(r) : undefined} />)}
        <h2>In progress</h2>
        {rest.map(r => <RewardCard key={r.id} r={r} />)}
      </div>
    </>
  );
}

function RewardCard({ r, onOpen }) {
  const Tag = onOpen ? 'button' : 'div';
  return (
    <Tag className={`card reward ${r.near ? 'near' : ''}`} onClick={onOpen} style={{ textAlign: 'left', width: '100%' }}
      aria-label={onOpen ? `${r.title}, ${r.progress}. Tap to see what happens when it unlocks` : undefined}>
      {r.near && <>
        <span className="pill orange" style={{ alignSelf: 'flex-start' }}>SO CLOSE</span>
        <span className="sparkle" style={{ right: 18, top: 12 }} aria-hidden="true">✦</span>
        <span className="sparkle" style={{ right: 40, top: 34, fontSize: 11, animationDelay: '.4s' }} aria-hidden="true">✦</span>
      </>}
      <div className="row">
        <span className="icon-box" style={{ background: r.bg }} aria-hidden="true">{r.icon}</span>
        <div className="grow">
          {r.near ? <h3>{r.title}</h3> : <b>{r.title}</b>}
          <p className="caption">{r.sub}</p>
        </div>
      </div>
      <div>
        <div className="row" style={{ justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
          <span className="muted">{r.progress}</span>
          <span style={{ color: r.near ? 'var(--fun-orange-text)' : 'var(--text-brand)' }}>{r.toGo}</span>
        </div>
        <div className={`track ${r.near ? 'thick' : ''}`} role="progressbar" aria-valuenow={r.pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${r.title} progress`}>
          <div className={`fill ${r.near ? 'lime' : ''}`} style={{ width: `${r.pct}%` }} />
        </div>
      </div>
    </Tag>
  );
}

function Unlocked({ onClaim }) {
  return (
    <div className="celebrate" role="dialog" aria-label="Reward unlocked">
      <Confetti count={44} />
      <div className="badge-pop" aria-hidden="true">🍕</div>
      <span className="pill orange rise">🎉 REWARD UNLOCKED</span>
      <h1 className="rise">Pizza party for your crew!</h1>
      <p className="rise">All 5 of your mentees showed up 5 days straight. They came because you did, Jaylen.</p>
      <div className="row rise" style={{ gap: 0 }}>
        {[{ id: 'JW' }, ...crew].map(c => <span key={c.id} style={{ marginLeft: -8 }}><Bubble initials={c.id} status="ok" size={50} /></span>)}
      </div>
      <div className="row rise"><span className="pill brand">+250 pts</span><span className="pill brand">+2h leadership credit</span></div>
      <p className="caption rise">Mr. Robinson will set it up for Friday lunch 🍕</p>
      <button className="btn accent block rise" onClick={onClaim}>Claim my reward</button>
      <button className="btn secondary block rise" onClick={onClaim}>Send a cheer to my crew</button>
    </div>
  );
}

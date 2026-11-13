import React, { useMemo, useState } from 'react';
import { StatusBar, TopBar, Points, Bubble, Tabs, Sheet, useToast, Confetti, Checkbox, api, AiTag, Pill } from './ui.jsx';
import { crew, crewCode, supportTypes, challengeTypes } from './data.js';
import Rewards from './Rewards.jsx';

export default function Mentor({ shared, update, switchRole }) {
  const [tab, setTab] = useState('home');
  const [welcome, setWelcome] = useState(false);
  const [toast, showToast] = useToast();

  if (!shared.codeAgreed) return <CrewCode onAgree={() => { update({ codeAgreed: true }); setWelcome(true); }} onBack={switchRole} />;
  if (welcome) return <Welcome onDone={() => setWelcome(false)} />;

  return (
    <>
      <StatusBar />
      {tab === 'home' && <Home shared={shared} update={update} showToast={showToast} />}
      {tab === 'log' && <DailyLog onSaved={log => { update(s => ({ logs: [log, ...s.logs], mentorPoints: s.mentorPoints + 50 })); setTab('saved'); }} />}
      {tab === 'saved' && <Saved onDone={() => setTab('home')} />}
      {tab === 'rewards' && <Rewards points={shared.mentorPoints} onClaim={() => showToast('Cheer sent to your crew!')} />}
      {tab !== 'saved' && (
        <Tabs active={tab} onChange={id => (id === 'switch' ? switchRole() : setTab(id))}
          items={[{ id: 'home', label: 'Home', icon: '🏠' }, { id: 'log', label: 'Daily log', icon: '✅' }, { id: 'rewards', label: 'Rewards', icon: '🏆' }, { id: 'switch', label: 'Switch role', icon: '🔁' }]} />
      )}
      {toast}
    </>
  );
}

function Home({ shared, update, showToast }) {
  const [draft, setDraft] = useState(null); // { text, source }
  const [check, setCheck] = useState(null);
  const [busy, setBusy] = useState(false);
  const [backup, setBackup] = useState(false);
  const kaylaFlag = shared.kaylaCheckin && shared.kaylaCheckin !== 'good';
  const checkinLabel = { bus: 'bus is late', family: 'family stuff', meh: 'not feeling it' }[shared.kaylaCheckin];
  const roster = useMemo(() => crew.map(c => (c.id === 'KN' && shared.kaylaComeback ? { ...c, status: 'ok', detail: 'Back on track today!' } : c)), [shared.kaylaComeback]);

  const makeDraft = async () => {
    setBusy(true); setCheck(null);
    try { setDraft(await api('draft', { mentee: 'Kayla', checkin: checkinLabel || 'missed class', mentor: 'Jaylen' })); }
    finally { setBusy(false); }
  };
  const send = async () => {
    setBusy(true);
    try {
      const result = await api('check', { text: draft.text });
      setCheck(result);
      if (result.safe) { update({ jaylenMessage: draft.text }); setDraft(null); showToast('Sent to Kayla'); }
    } finally { setBusy(false); }
  };

  return (
    <>
      <TopBar eyebrow="Mentor · 10th grade" title="Hey, Jaylen!" right={<Points value={shared.mentorPoints} />} />
      <div className="scroll">
        <div className="stats">
          <div className="stat"><b>12</b><span>my day streak</span></div>
          <div className="stat"><b>18h</b><span>of 40h leadership credit</span></div>
        </div>

        <section className="card">
          <div className="section-head"><div><h3>313 Risers</h3><p className="caption">#2 most improved this week</p></div></div>
          <div className="bubbles">{roster.map(c => <Bubble key={c.id} initials={c.id} status={c.status} />)}</div>
          <div className="track" aria-label="3 of 5 here today"><div className="fill" style={{ width: '60%' }} /></div>
          <p className="caption">3 of 5 here today</p>
        </section>

        <section className="card" style={{ background: 'var(--fun-purple-subtle)', borderColor: 'transparent' }}>
          <AiTag source={draft?.source} />
          <p><b>{kaylaFlag ? `Kayla said "${checkinLabel}" today.` : 'Kayla missed Tuesday.'}</b> Check in kindly. Don't ask why.</p>
          {!draft ? (
            <button className="btn primary block" onClick={makeDraft} disabled={busy}>{busy ? 'Writing…' : 'Help me write a kind message'}</button>
          ) : (
            <>
              <label className="caption" htmlFor="msg">Edit before you send</label>
              <textarea id="msg" value={draft.text} onChange={e => setDraft({ ...draft, text: e.target.value })} />
              {check && !check.safe && <div className="note warn" role="alert">⚠️ {check.reason}</div>}
              <button className="btn primary block" onClick={send} disabled={busy}>{busy ? 'Checking it\'s kind…' : 'Send to Kayla'}</button>
              <p className="caption">Every message gets a safety check before it's sent.</p>
            </>
          )}
          <button className="btn ghost block" onClick={() => setBackup(true)}>I need backup 🙋</button>
        </section>

        <section className="card">
          <h3>Who needs you</h3>
          {roster.map((c, i) => (
            <React.Fragment key={c.id}>
              <div className="row">
                <Bubble initials={c.id} status={c.status} />
                <div className="grow"><b>{c.name}</b><p className="caption">{c.detail}</p></div>
                <Pill tone={c.status === 'ok' ? 'ok' : c.status === 'slip' ? 'warn' : 'danger'}>{c.status === 'ok' ? 'On track' : c.status === 'slip' ? 'Slipping' : 'Needs check-in'}</Pill>
              </div>
              {i < roster.length - 1 && <div className="divider" />}
            </React.Fragment>
          ))}
        </section>
      </div>

      {backup && (
        <Sheet label="Need backup" onClose={() => setBackup(false)}>
          <h2>Need backup? You're not alone.</h2>
          {[['🙋', 'Ask Mr. Robinson', 'Your advisor gets a heads-up right now'], ['😟', "I'm worried about a mentee", 'Goes privately to Mr. Robinson and the counselor'], ['💡', 'Ideas for a check-in', 'Quick tips from other mentors']].map(([e, t, s]) => (
            <button key={t} className="option" onClick={() => { setBackup(false); showToast(`${t}: sent`); }}>
              <span style={{ fontSize: 24 }} aria-hidden="true">{e}</span><span><b style={{ display: 'block' }}>{t}</b><span className="caption">{s}</span></span>
            </button>
          ))}
        </Sheet>
      )}
    </>
  );
}

function DailyLog({ onSaved }) {
  const [who, setWho] = useState('KN');
  const [start, setStart] = useState('15:15');
  const [end, setEnd] = useState('15:40');
  const [support, setSupport] = useState(['Homework help', 'Bus / ride plan']);
  const [challenge, setChallenge] = useState('Getting to school');
  const [details, setDetails] = useState('We did her fractions sheet together in the library. She missed the bus Tuesday, so we looked up the 7:05 bus and set a 6:40 alarm.');
  const minutes = (() => { const [a, b] = start.split(':').map(Number); const [c, d] = end.split(':').map(Number); return Math.max(0, c * 60 + d - (a * 60 + b)); })();
  const toggle = s => setSupport(v => (v.includes(s) ? v.filter(x => x !== s) : [...v, s]));
  const mentee = crew.find(c => c.id === who);
  const valid = minutes > 0 && support.length > 0;

  return (
    <>
      <TopBar eyebrow="Daily log · today" title="Log today's help" />
      <div className="scroll">
        <div className="note" style={{ background: 'var(--fun-orange-subtle)', color: 'var(--fun-orange-text)', fontWeight: 700 }}>🔥 6-day log streak! Takes about 1 minute.</div>
        <fieldset style={{ border: 0, padding: 0, margin: 0, display: 'grid', gap: 10 }}>
          <legend><h3>1. Who did you help?</h3></legend>
          <div className="bubbles">
            {crew.map(c => <button key={c.id} onClick={() => setWho(c.id)} aria-pressed={who === c.id} aria-label={c.name}><Bubble initials={c.id} status={c.status} selected={who === c.id} /></button>)}
          </div>
          <p className="caption" style={{ color: 'var(--text-brand)' }}>{mentee.name} selected</p>
        </fieldset>
        <div>
          <h3>2. When?</h3>
          <div className="row" style={{ marginTop: 8 }}>
            <label className="grow">Start<input type="time" value={start} onChange={e => setStart(e.target.value)} /></label>
            <label className="grow">End<input type="time" value={end} onChange={e => setEnd(e.target.value)} /></label>
          </div>
          <p className="caption" style={{ color: 'var(--text-success)', marginTop: 6 }}>= {minutes} minutes toward your leadership credit</p>
        </div>
        <div>
          <h3>3. What support did you give?</h3><p className="caption">Pick all that fit</p>
          <div className="chips" style={{ marginTop: 8 }}>{supportTypes.map(s => <button key={s} className="chip" aria-pressed={support.includes(s)} onClick={() => toggle(s)}>{s}</button>)}</div>
        </div>
        <div>
          <h3>4. Did they mention a challenge?</h3>
          <div className="chips" style={{ marginTop: 8 }}>{challengeTypes.map(s => <button key={s} className="chip" aria-pressed={challenge === s} onClick={() => setChallenge(s)}>{s}</button>)}</div>
          <p className="caption" style={{ marginTop: 6 }}>🔒 Only Mr. Robinson sees this part.</p>
        </div>
        <div>
          <label htmlFor="details"><h3>5. Tell us more</h3><p className="caption">What did you do together? How did it go?</p></label>
          <textarea id="details" maxLength={500} value={details} onChange={e => setDetails(e.target.value)} style={{ marginTop: 8 }} />
          <p className="caption" style={{ textAlign: 'right' }}>{details.length} / 500</p>
        </div>
      </div>
      <div className="footer">
        <button className="btn primary block" disabled={!valid} onClick={() => onSaved({
          id: `l${Date.now()}`, mentor: 'Jaylen W.', mentorId: 'JW', mentee: mentee.name, start, end, minutes, support, challenge, details, status: 'review', isNew: true
        })}>Save log</button>
      </div>
    </>
  );
}

function Saved({ onDone }) {
  return (
    <div className="celebrate">
      <Confetti count={24} />
      <div className="badge-pop" aria-hidden="true">✅</div>
      <h1 className="rise">Log saved!</h1>
      <p className="rise">Mr. Robinson will review it. Your minutes count toward your leadership credit.</p>
      <div className="row rise"><span className="pill brand">🔥 7-day log streak</span><span className="pill brand">+50 pts</span></div>
      <button className="btn accent block rise" onClick={onDone}>Back to my crew</button>
    </div>
  );
}

function CrewCode({ onAgree, onBack }) {
  const [ok, setOk] = useState(false);
  return (
    <>
      <StatusBar />
      <TopBar eyebrow="Mentor onboarding · Step 3 of 3" title="Our crew code" onBack={onBack} />
      <div className="scroll">
        <div className="hero"><h3>Younger students are counting on you.</h3><p>These 8 promises keep everyone safe and make MOVA work.</p></div>
        <section className="card">
          {crewCode.map(([e, t, s], i) => (
            <React.Fragment key={t}>
              <div className="row" style={{ alignItems: 'flex-start' }}>
                <span className="icon-box" style={{ background: 'var(--bg-brand-subtle)' }} aria-hidden="true">{e}</span>
                <div className="grow"><b>{t}</b><p className="caption">{s}</p></div>
              </div>
              {i < crewCode.length - 1 && <div className="divider" />}
            </React.Fragment>
          ))}
        </section>
        <div className="note warn">If a promise is broken, your advisor will talk with you first. Serious safety issues follow school rules.</div>
      </div>
      <div className="footer">
        <Checkbox checked={ok} onChange={setOk}>I promise to follow the crew code</Checkbox>
        <p className="caption">A parent or guardian also signs at enrollment.</p>
        <button className="btn primary block" disabled={!ok} onClick={onAgree}>Join my crew</button>
      </div>
    </>
  );
}

function Welcome({ onDone }) {
  return (
    <div className="celebrate">
      <Confetti />
      <div className="badge-pop" aria-hidden="true">👥</div>
      <h1 className="rise">You're officially a MOVA mentor!</h1>
      <p className="rise">5 younger students are counting on you. Show up. Show the way.</p>
      <span className="pill brand rise">🏅 Badge earned: Crew Leader</span>
      <button className="btn accent block rise" onClick={onDone}>Meet my crew</button>
    </div>
  );
}

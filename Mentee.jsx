import React, { useEffect, useState } from 'react';
import { StatusBar, TopBar, Points, Bubble, Tabs, Sheet, useToast, Confetti, api, AiTag } from './ui.jsx';
import { checkinOptions } from './data.js';

export default function Mentee({ shared, update, switchRole }) {
  const [tab, setTab] = useState('home');
  const [screen, setScreen] = useState('home'); // home | quiz | comeback
  const [sheet, setSheet] = useState(null);
  const [toast, showToast] = useToast();

  const pick = id => {
    update({ kaylaCheckin: id });
    if (id === 'good') showToast('Nice! See you in class 🙌');
    else setSheet(id);
  };

  if (screen === 'quiz') return <Quiz onBack={() => setScreen('home')} onDone={() => { update(s => ({ menteePoints: s.menteePoints + 50, kaylaComeback: true })); setScreen('comeback'); }} />;
  if (screen === 'comeback') return <Comeback onDone={() => setScreen('home')} points={shared.menteePoints} />;

  return (
    <>
      <StatusBar />
      <TopBar eyebrow="Good morning · 9th grade" title="Hey, Kayla!" right={<Points value={shared.menteePoints} />} />
      <div className="scroll">
        <div className="row">
          <span className="pill orange">🔥 {shared.kaylaComeback ? '1-day streak, back on!' : 'Streak paused, not lost'}</span>
        </div>

        <section className="card" aria-labelledby="today">
          <h2 id="today">How's today looking?</h2>
          <p className="caption">One tap. Only you and your mentor see this.</p>
          <div className="chips">
            {checkinOptions.map(o => (
              <button key={o.id} className="chip" aria-pressed={shared.kaylaCheckin === o.id} onClick={() => pick(o.id)}>
                <span aria-hidden="true">{o.emoji}</span>{o.label}
              </button>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="row">
            <Bubble initials="JW" status="ok" />
            <div className="grow"><b>Jaylen</b><p className="caption">Your mentor · 10th grade</p></div>
          </div>
          <div className="note purple">{shared.jaylenMessage || 'You got this on the math test today! Meet me at lunch by the gym?'}</div>
          <button className="btn secondary small" onClick={() => showToast('Reply sent to Jaylen')}>Reply to Jaylen</button>
        </section>

        <section className="card">
          <h3>Catch up in 2 minutes</h3>
          <p className="muted">One question from what you missed. Wrong answers just show the right one. No penalty.</p>
          <button className="btn accent block" onClick={() => setScreen('quiz')}>Start catch-up ⚡</button>
        </section>
      </div>
      <Tabs active={tab} onChange={id => (id === 'switch' ? switchRole() : setTab(id))}
        items={[{ id: 'home', label: 'Home', icon: '🏠' }, { id: 'switch', label: 'Switch role', icon: '🔁' }]} />

      {sheet === 'family' || sheet === 'meh' ? (
        <Sheet label="Thanks for telling us" onClose={() => setSheet(null)}>
          <h2>Thanks for telling us 💜</h2>
          <p className="muted">Only you and Mr. Robinson see why. Jaylen just knows you might want a hand today.</p>
          <button className="btn primary block" onClick={() => { update({ kaylaAskedForHelp: true }); setSheet(null); showToast('Jaylen got a heads-up'); }}>Talk to Jaylen</button>
          <button className="btn ghost block" onClick={() => setSheet(null)}>I'm okay for now</button>
        </Sheet>
      ) : null}
      {sheet === 'bus' ? (
        <Sheet label="Running late" onClose={() => setSheet(null)}>
          <h2>Running late? 🚌</h2>
          <p className="muted">Late is better than absent. Here's a backup plan.</p>
          <div className="note warn">Next bus in 12 min · or ask a crew buddy for a ride plan</div>
          <button className="btn primary block" onClick={() => { update({ kaylaAskedForHelp: true }); setSheet(null); showToast('Ride plan request sent'); }}>Help me make a ride plan</button>
          <button className="btn ghost block" onClick={() => setSheet(null)}>I've got it</button>
        </Sheet>
      ) : null}
      {toast}
    </>
  );
}

function Quiz({ onBack, onDone }) {
  const [q, setQ] = useState(null);
  const [picked, setPicked] = useState(null);
  useEffect(() => { api('question', { grade: 9, topic: 'fractions' }).then(setQ).catch(() => setQ(null)); }, []);
  const right = q && picked === q.answerIndex;
  return (
    <div className="quiz" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StatusBar dark />
      <TopBar title="Catch-up" eyebrow={<span style={{ color: '#fff' }}>Question 1 of 1</span>} onBack={onBack} />
      <div className="scroll">
        {!q ? <p>Loading a question at your level…</p> : (
          <>
            <div className="card" style={{ color: 'var(--text-primary)' }}>
              <AiTag source={q.source} />
              <h2>{q.question}</h2>
            </div>
            <div className="answers">
              {q.choices.map((c, i) => (
                <button key={i} className={`answer ${picked !== null ? (i === q.answerIndex ? 'right' : 'dim') : ''}`}
                  disabled={picked !== null} onClick={() => setPicked(i)}>{c}</button>
              ))}
            </div>
            {picked !== null && (
              <div className="card" role="status" style={{ color: 'var(--text-primary)' }}>
                <h3>{right ? 'Correct! +50 pts 🎉' : 'Good try! Here\'s the trick:'}</h3>
                <p>{q.explain}</p>
                <button className="btn accent block" onClick={onDone}>Keep going</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Comeback({ onDone, points }) {
  return (
    <div className="celebrate">
      <Confetti />
      <div className="badge-pop" aria-hidden="true">🔥</div>
      <h1 className="rise">Nice comeback, Kayla!</h1>
      <p className="rise">Streak is back on. Jaylen will see your win.</p>
      <span className="pill brand rise">⚡ {points} pts</span>
      <button className="btn accent block rise" onClick={onDone}>Back to home</button>
    </div>
  );
}

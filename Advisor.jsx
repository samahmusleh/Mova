import React, { useMemo, useState } from 'react';
import { StatusBar, TopBar, Bubble, Tabs, Sheet, useToast, Checkbox, api, AiTag, Pill } from './ui.jsx';
import { ferpaPoints, baseHelpRequests, mentors } from './data.js';

export default function Advisor({ shared, update, switchRole }) {
  const [view, setView] = useState('everyone');
  const [reviewing, setReviewing] = useState(null);
  const [replying, setReplying] = useState(null);
  const [handled, setHandled] = useState([]);
  const [summary, setSummary] = useState(null);
  const [toast, showToast] = useToast();

  const kaylaChallenge = { bus: 'Getting to school', family: 'Family stuff', meh: 'Tired or sick' }[shared.kaylaCheckin];
  const requests = useMemo(() => {
    const list = [...baseHelpRequests];
    if (shared.kaylaAskedForHelp) list.unshift({
      id: 'kayla', initials: 'KN', name: 'Kayla N.', grade: 9, status: 'needs', time: 'Just now', challenge: kaylaChallenge || 'Getting to school',
      message: shared.kaylaCheckin === 'bus' ? 'I missed the bus again. Can someone help me make a ride plan?' : 'Checked in with "' + (kaylaChallenge || '').toLowerCase() + '" and asked to talk to her mentor.',
      options: [['Ask Jaylen to check in', 'Her mentor gets a nudge right now'], ['Start a ride plan', 'Bus times + a backup ride, shared with Kayla'], ['Send Kayla a note', '"Got your message. We\'ve got you."']]
    });
    return list.filter(r => !handled.includes(r.id));
  }, [shared.kaylaAskedForHelp, shared.kaylaCheckin, handled, kaylaChallenge]);

  const challenges = useMemo(() => {
    const c = { 'Getting to school': 9, Homework: 6, 'Family stuff': 4, 'Tired or sick': 3, 'Talk to a grown-up': 2 };
    if (kaylaChallenge) c[kaylaChallenge] += 1;
    for (const l of shared.logs) if (l.isNew && c[l.challenge] !== undefined) c[l.challenge] += 1;
    return Object.entries(c).sort((a, b) => b[1] - a[1]);
  }, [kaylaChallenge, shared.logs]);

  const toReview = shared.logs.filter(l => l.status === 'review');

  if (!shared.ferpaAck) return <Ferpa onAck={() => update({ ferpaAck: true })} onBack={switchRole} />;
  if (reviewing) return (
    <LogReview log={reviewing} onBack={() => setReviewing(null)} toast={toast}
      onApprove={() => { update(s => ({ logs: s.logs.map(l => (l.id === reviewing.id ? { ...l, status: 'approved' } : l)) })); setReviewing(null); showToast(`Approved · +${reviewing.minutes} min for ${reviewing.mentor.split(' ')[0]}`); }}
      onAsk={() => showToast(`Message sent to ${reviewing.mentor.split(' ')[0]}`)}
      onCounselor={() => showToast('Shared privately with Ms. Carter')} />
  );

  const show = k => view === 'everyone' || view === k;
  const max = Math.max(...challenges.map(c => c[1]));

  return (
    <>
      <StatusBar />
      <TopBar eyebrow="Advisor · Mr. Robinson" title="Today at a glance" />
      <div className="scroll">
        <div role="tablist" aria-label="Who to show" className="row" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 999, padding: 4, gap: 4 }}>
          {[['everyone', 'Everyone'], ['mentees', 'Mentees'], ['mentors', 'Mentors']].map(([id, l]) => (
            <button key={id} role="tab" aria-selected={view === id} onClick={() => setView(id)} className="grow"
              style={{ flex: 1, minHeight: 40, borderRadius: 999, fontWeight: 700, background: view === id ? 'var(--bg-brand)' : 'transparent', color: view === id ? '#fff' : 'var(--text-secondary)' }}>{l}</button>
          ))}
        </div>

        <div className="stats">
          <div className="stat"><b>{requests.length}</b><span>asking for help</span></div>
          <div className="stat"><b>{challenges.reduce((a, c) => a + c[1], 0)}</b><span>challenges this week</span></div>
          <div className="stat"><b>{toReview.length}</b><span>logs to review</span></div>
          <div className="stat"><b>{shared.kaylaComeback ? '42' : '41'}/48</b><span>mentees here today</span></div>
        </div>

        <section className="card" style={{ background: 'var(--fun-purple-subtle)', borderColor: 'transparent' }}>
          <AiTag source={summary?.source} />
          {summary ? <p>{summary.text}</p> : <p className="muted">Get a 2-sentence summary of this week's patterns. Only totals are shared, never names.</p>}
          <button className="btn secondary small" onClick={async () => setSummary(await api('summary', { stats: { challenges: Object.fromEntries(challenges), helpRequests: requests.length, logsToReview: toReview.length, mentorsMissingLogs: 1 } }))}>
            {summary ? 'Refresh summary' : 'Summarize my week'}
          </button>
        </section>

        {show('mentees') && <>
          <h2>Asking for help</h2>
          <section className="card">
            {requests.length === 0 && <p className="muted">All caught up. Nice work! 🎉</p>}
            {requests.map((q, i) => (
              <React.Fragment key={q.id}>
                <div className="row" style={{ alignItems: 'flex-start' }}>
                  <Bubble initials={q.initials} status={q.status} />
                  <div className="grow" style={{ display: 'grid', gap: 6 }}>
                    <div className="row" style={{ justifyContent: 'space-between' }}><b>{q.name} · {q.grade}th</b><span className="caption">{q.time}</span></div>
                    <p>"{q.message}"</p>
                    <div className="row" style={{ justifyContent: 'space-between' }}>
                      <Pill tone={q.urgent ? 'danger' : 'warn'}>{q.challenge}</Pill>
                      <button className="btn primary small" onClick={() => setReplying(q)}>Reply</button>
                    </div>
                  </div>
                </div>
                {i < requests.length - 1 && <div className="divider" />}
              </React.Fragment>
            ))}
          </section>

          <h2>Challenges this week</h2>
          <section className="card">
            {challenges.map(([l, n]) => (
              <div key={l}>
                <div className="row" style={{ justifyContent: 'space-between' }}><span>{l}</span><b>{n}</b></div>
                <div className="track" style={{ marginTop: 4 }}><div className="fill" style={{ width: `${(n / max) * 100}%` }} /></div>
              </div>
            ))}
            <p className="caption">🔒 Only you and the school counselor see these. Mentors never see why a student is out.</p>
          </section>
        </>}

        {show('mentors') && <>
          <div className="section-head"><h2>Mentor logs to review</h2><span className="link">{toReview.length} new</span></div>
          <section className="card">
            {toReview.length === 0 && <p className="muted">No logs waiting.</p>}
            {toReview.map((l, i) => (
              <React.Fragment key={l.id}>
                <button className="row" style={{ textAlign: 'left', width: '100%' }} onClick={() => setReviewing(l)}>
                  <Bubble initials={l.mentorId} status="ok" />
                  <span className="grow" style={{ display: 'grid' }}>
                    <b>{l.mentor} helped {l.mentee}</b>
                    <span className="caption">{fmt(l.start)}–{fmt(l.end)} · {l.minutes} min</span>
                    <span className="caption" style={{ color: 'var(--text-brand)' }}>{l.support.join(' · ')}</span>
                  </span>
                  <Pill tone="warn">Review</Pill><span aria-hidden="true">›</span>
                </button>
                {i < toReview.length - 1 && <div className="divider" />}
              </React.Fragment>
            ))}
            <div className="note warn row"><span className="grow">⚠️ Chris P. hasn't logged today.</span><button className="btn secondary small" onClick={() => showToast('Reminder sent to Chris')}>Nudge</button></div>
          </section>

          <h2>Mentors this week</h2>
          <section className="card">
            {mentors.map((m, i) => (
              <React.Fragment key={m.id}>
                <div className="row">
                  <Bubble initials={m.id} status={m.status} />
                  <div className="grow"><b>{m.name}</b><p className="caption">{m.mentees} mentees · {m.hours} h logged</p><p className="caption" style={{ color: m.status === 'ok' ? 'var(--text-success)' : 'var(--text-warning)' }}>{m.change}</p></div>
                  <Pill tone={m.status === 'ok' ? 'ok' : 'warn'}>{m.status === 'ok' ? 'On track' : 'Slipping'}</Pill>
                </div>
                {i < mentors.length - 1 && <div className="divider" />}
              </React.Fragment>
            ))}
          </section>
        </>}
      </div>
      <Tabs active="home" onChange={id => id === 'switch' && switchRole()}
        items={[{ id: 'home', label: 'Dashboard', icon: '📊' }, { id: 'switch', label: 'Switch role', icon: '🔁' }]} />

      {replying && <ReplySheet req={replying} onClose={() => setReplying(null)}
        onSend={() => { setHandled(h => [...h, replying.id]); setReplying(null); showToast('Help sent!'); }} />}
      {toast}
    </>
  );
}

const fmt = t => { const [h, m] = t.split(':').map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; };

function ReplySheet({ req, onClose, onSend }) {
  const [picked, setPicked] = useState([0]);
  const toggle = i => setPicked(p => (p.includes(i) ? p.filter(x => x !== i) : [...p, i]));
  return (
    <Sheet label={`Help ${req.name}`} onClose={onClose}>
      <div className="row"><Bubble initials={req.initials} status={req.status} /><div className="grow"><h2>Help {req.name.split(' ')[0]}</h2><p className="caption">"{req.message}"</p></div></div>
      {req.options.map(([t, s], i) => (
        <button key={t} className="option" aria-pressed={picked.includes(i)} onClick={() => toggle(i)}>
          <span className="grow" style={{ flex: 1 }}><b style={{ display: 'block' }}>{t}</b><span className="caption">{s}</span></span>
          {picked.includes(i) && <span aria-hidden="true">✓</span>}
        </button>
      ))}
      <button className="btn primary block" disabled={!picked.length} onClick={onSend}>Send help</button>
    </Sheet>
  );
}

function LogReview({ log, onBack, onApprove, onAsk, onCounselor, toast }) {
  return (
    <>
      <StatusBar />
      <TopBar eyebrow="Mentor log" title={`${log.mentor.split(' ')[0]} helped ${log.mentee.split(' ')[0]}`} onBack={onBack} />
      <div className="scroll">
        <section className="card">
          <div className="row"><Bubble initials={log.mentorId} status="ok" /><div className="grow"><b>{log.mentor}</b><p className="caption">Mentor</p></div><span aria-hidden="true">→</span><div className="grow"><b>{log.mentee}</b><p className="caption">Mentee</p></div></div>
          <div className="note" style={{ background: 'var(--bg-brand-subtle)' }}>🕒 Today · {fmt(log.start)}–{fmt(log.end)} ({log.minutes} min)</div>
        </section>
        <h3>Support given</h3>
        <div className="chips">{log.support.map(s => <span key={s} className="chip" aria-pressed="true">{s} ✓</span>)}</div>
        <h3>What happened</h3>
        <section className="card"><p>{log.details}</p></section>
        <h3>Challenge mentioned</h3>
        <p className="caption">🔒 Private: only you and the counselor see this</p>
        <div><Pill tone="warn">{log.challenge}</Pill></div>
        <div className="note" style={{ background: 'var(--bg-accent-subtle)' }}>Approving adds {log.minutes} min to {log.mentor.split(' ')[0]}'s leadership credit.</div>
      </div>
      <div className="footer">
        <button className="btn primary block" onClick={onApprove}>Approve {log.minutes} min</button>
        <div className="row"><button className="btn secondary small grow" style={{ flex: 1 }} onClick={onAsk}>Ask {log.mentor.split(' ')[0]}</button><button className="btn ghost small grow" style={{ flex: 1 }} onClick={onCounselor}>Tell counselor</button></div>
      </div>
      {toast}
    </>
  );
}

function Ferpa({ onAck, onBack }) {
  const [ok, setOk] = useState(false);
  return (
    <>
      <StatusBar />
      <TopBar eyebrow="Before you see student info" title="Student privacy (FERPA)" onBack={onBack} />
      <div className="scroll">
        <div className="note" style={{ background: 'var(--bg-brand-subtle)' }}>MOVA shows you attendance, check-ins and challenges students report. These are education records protected by FERPA.</div>
        <section className="card">
          {ferpaPoints.map(([e, t, s], i) => (
            <React.Fragment key={t}>
              <div className="row" style={{ alignItems: 'flex-start' }}>
                <span className="icon-box" style={{ background: 'var(--bg-brand-subtle)' }} aria-hidden="true">{e}</span>
                <div className="grow"><b>{t}</b><p className="caption">{s}</p></div>
              </div>
              {i < ferpaPoints.length - 1 && <div className="divider" />}
            </React.Fragment>
          ))}
        </section>
      </div>
      <div className="footer">
        <Checkbox checked={ok} onChange={setOk}>I understand and will protect student records under FERPA</Checkbox>
        <p className="caption">Signed electronically as Mr. Robinson · renews every school year</p>
        <button className="btn primary block" disabled={!ok} onClick={onAck}>Acknowledge & continue</button>
      </div>
    </>
  );
}

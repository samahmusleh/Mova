import React, { useEffect, useState } from 'react';

export const api = async (path, body) => {
  const res = await fetch(`/api/ai/${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {})
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
};

export function StatusBar({ dark }) {
  return (
    <div className={`statusbar ${dark ? 'on-dark' : ''}`} aria-hidden="true">
      <span>9:41</span><span>●●● ▮</span>
    </div>
  );
}

export function TopBar({ eyebrow, title, onBack, right }) {
  return (
    <header className="topbar">
      {onBack && (
        <button className="back" onClick={onBack} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
      )}
      <div className="titles">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
      </div>
      {right}
    </header>
  );
}

export const Points = ({ value }) => <span className="points" aria-label={`${value} points`}>⚡ {value.toLocaleString()}</span>;

export function Bubble({ initials, status = 'ok', selected, size }) {
  const label = { ok: 'on track', slip: 'slipping', needs: 'needs check-in' }[status];
  return (
    <span className={`bubble ${status} ${selected ? 'selected' : ''}`} style={size ? { width: size, height: size } : undefined}
      title={label} aria-label={`${initials}, ${label}`}>{initials}</span>
  );
}

export function Pill({ tone = 'brand', children }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

export function Tabs({ items, active, onChange }) {
  return (
    <nav className="tabbar" aria-label="Main">
      {items.map(t => (
        <button key={t.id} className={`tab ${active === t.id ? 'active' : ''}`} aria-current={active === t.id ? 'page' : undefined} onClick={() => onChange(t.id)}>
          <span className="tab-icon" aria-hidden="true">{t.icon}</span>{t.label}
        </button>
      ))}
    </nav>
  );
}

export function Sheet({ onClose, children, label }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="scrim" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={label} onClick={e => e.stopPropagation()}>
        <div className="grabber" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}

export function Toast({ message, onDone }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return <div className="toast" role="status">✓ {message}</div>;
}

export function useToast() {
  const [msg, setMsg] = useState(null); // { text, id }
  const node = msg ? <Toast key={msg.id} message={msg.text} onDone={() => setMsg(null)} /> : null;
  return [node, text => setMsg({ text, id: Date.now() })];
}

export function Confetti({ count = 36 }) {
  const colors = ['#B4EE1F', '#F26B0F', '#D11F6F', '#7C3AED', '#FFFFFF'];
  return Array.from({ length: count }).map((_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const dist = 140 + (i % 5) * 40;
    return (
      <span key={i} className="confetti" aria-hidden="true" style={{
        background: colors[i % colors.length],
        '--dx': `${Math.cos(angle) * dist - 5}px`, '--dy': `${Math.sin(angle) * dist}px`, '--rot': `${(i * 47) % 360}deg`,
        borderRadius: i % 3 === 0 ? '50%' : 3
      }} />
    );
  });
}

export function Checkbox({ checked, onChange, children }) {
  return (
    <button className="checkbox-row" role="checkbox" aria-checked={checked} onClick={() => onChange(!checked)}>
      <span className={`checkbox ${checked ? 'on' : ''}`} aria-hidden="true">{checked ? '✓' : ''}</span>
      <span>{children}</span>
    </button>
  );
}

export const AiTag = ({ source }) => (
  <span className="ai-tag">✨ IBM Granite {source === 'demo' ? '· demo mode' : '· watsonx.ai'}</span>
);

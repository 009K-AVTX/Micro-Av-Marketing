import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Logo from './components/Logo';
import { CONNECTS, FAQS, FOOTER, JOURNEY, NAV, QUESTIONS, RATES, SETUP, TICKER, TRUST, VIEWS } from './content';

const CONTACT = 'mailto:hello@microav.com';

// Optional: set VITE_ACCESS_ENDPOINT to a form backend (Formspree, a webhook, etc.).
// Without it, the request-access form opens a pre-filled email instead.
const ACCESS_ENDPOINT = import.meta.env.VITE_ACCESS_ENDPOINT;

const AccessCtx = createContext(() => {});
const useAccess = () => useContext(AccessCtx);
// "Chat with us" buttons call openAccess(topic, 'chat'): the same modal, asking for a message instead.

const usd = n => `$${Math.round(n).toLocaleString()}`;
const cents = n => `$${n.toFixed(2)}`;

export default function App() {
  const [access, setAccess] = useState(null); // null = closed, otherwise { interest, mode }
  const openAccess = (interest = '', mode = 'access') => setAccess({ interest, mode });
  return (
    <AccessCtx.Provider value={openAccess}>
      <Header />
      <main>
        <Hero />
        <Ticker />
        <Journey />
        {QUESTIONS.map((q, i) => <Question key={q.id} q={q} flip={i % 2 === 1} Visual={VISUALS[q.id]} />)}
        <Calculator />
        <Views />
        <Connects />
        <Trust />
        <Pricing />
        <Faq />
        <Closing />
      </main>
      <Footer />
      <StickyCta />
      {access && <AccessModal interest={access.interest} mode={access.mode} onClose={() => setAccess(null)} />}
    </AccessCtx.Provider>
  );
}

/* ---------------- Header ---------------- */

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setOpen(false);
  const openAccess = useAccess();
  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="wrap header-row">
        <a href="#top" className="brand-link" onClick={close}><Logo size={30} /></a>
        <nav className="main-nav" aria-label="Main">
          {NAV.map(([label, href]) => <a className="nav-item" key={label} href={href} onClick={close}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <button type="button" className="btn btn-ghost" onClick={() => { close(); openAccess(); }}>Request access</button>
          <button type="button" className="btn btn-primary" onClick={() => { close(); openAccess('', 'chat'); }}>Chat with us</button>
          <button type="button" className="btn menu-toggle" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(o => !o)}>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  const openAccess = useAccess();
  return (
    <section className="hero-site" id="top">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="section-title">Call forwarding & routing · for teams that can’t miss a call</span>
          <h1>Every call, to the right person<span className="accent">.</span></h1>
          <p className="lede">MicroAV gives you local and toll-free numbers that ring wherever your team is — with rules for hours, areas and menus, failover when nobody picks up, and a live view of every call.</p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={() => openAccess('', 'chat')}>Chat with us →</button>
            <button type="button" className="btn btn-lg" onClick={() => openAccess('Guided walkthrough')}>Get a walkthrough</button>
          </div>
          <a className="text-link" href="#journey">Or see how a call moves in 60 seconds ↓</a>
          <ul className="assurances">
            <li>{cents(RATES.perMinute)} a minute</li><li>No contract</li><li>Any phone or SIP line</li>
          </ul>
        </div>
        <LivePreview />
      </div>
      <span className="hero-word" aria-hidden="true">Forward</span>
    </section>
  );
}

// [caller, dialed, route, status]
const SEED_CALLS = [
  ['+1 (212) 555-0183', 'Sales line', 'Area code 2xx → Sales desk', 'Connected'],
  ['+1 (646) 555-0129', 'Main toll-free', 'IVR · pressed 2 → Support', 'Connected'],
  ['+1 (305) 555-0162', 'Miami office', 'Round robin → Rep 3', 'Ringing'],
  ['+1 (202) 555-0147', 'Sales line', 'Block list · robocaller', 'Blocked'],
  ['+1 (415) 555-0105', 'Sales line', 'No answer → Overflow', 'Failover'],
];
const INCOMING = [
  ['+1 (718) 555-0174', 'Sales line', 'Office hours → Sales desk', 'Ringing'],
  ['+1 (312) 555-0191', 'Main toll-free', 'IVR · pressed 1 → Sales', 'Connected'],
  ['+1 (213) 555-0138', 'Sales line', 'Busy → Sales overflow', 'Failover'],
  ['+1 (786) 555-0110', 'Miami office', 'Round robin → Rep 1', 'Connected'],
];
const STATUS_BADGE = { Connected: 'badge-green', Ringing: 'badge-blue', Failover: 'badge-amber', Blocked: 'badge-red' };

function LivePreview() {
  const [calls, setCalls] = useState(SEED_CALLS);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => {
      setTick(t => {
        const next = t + 1;
        setCalls(cs => [INCOMING[next % INCOMING.length], ...cs].slice(0, 5));
        return next;
      });
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const live = calls.filter(c => c[3] === 'Connected' || c[3] === 'Ringing').length;

  return (
    <div className="preview card" aria-label="Example MicroAV live monitor">
      <div className="preview-bar">
        <span /><span /><span />
        <em>MicroAV · live monitor</em>
      </div>
      <div className="preview-stats">
        <div><span className="stat-label">Live now</span><div className="stat-value">{live}</div></div>
        <div><span className="stat-label">Calls today</span><div className="stat-value">{214 + tick}</div></div>
        <div><span className="stat-label">Answered</span><div className="stat-value">96<small>%</small></div></div>
      </div>
      <table>
        <thead><tr><th>Caller</th><th className="hide-sm">Dialed</th><th>Route</th><th>Status</th></tr></thead>
        <tbody>
          {calls.map((c, i) => (
            <tr key={`${tick}-${i}`} className={i === 0 && tick > 0 ? 'row-new' : ''}>
              <td>{c[0]}</td>
              <td className="hide-sm muted">{c[1]}</td>
              <td className="muted route-cell">{c[2]}</td>
              <td><span className={`badge ${STATUS_BADGE[c[3]]}`}>{c[3]}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Ticker & journey ---------------- */

function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {items.map(([k, v], i) => <div className="ticker-item" key={i}><b>{k}</b>{v}</div>)}
      </div>
    </div>
  );
}

function Journey() {
  return (
    <section className="wrap journey" id="journey">
      <div className="journey-intro">
        <span className="section-title">How it works</span>
        <h2>From ring to right person in under a second.</h2>
        <p className="lede">Every call to a MicroAV number runs the same five steps, and you control each one from a single panel.</p>
      </div>
      <ol className="journey-track">
        {JOURNEY.map(([t, d], i) => (
          <li key={t}>
            <span className="journey-node">{String(i + 1).padStart(2, '0')}</span>
            <strong>{t}</strong>
            <span className="muted small">{d}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------------- The three questions ---------------- */

function Question({ q, flip, Visual }) {
  const openAccess = useAccess();
  return (
    <section className="question" id={q.id}>
      <div className="wrap">
        <div className={`question-head${flip ? ' flip' : ''}`}>
          <div>
            <span className="section-title">{q.n} · The question behind every call</span>
            <h2>{q.ask}</h2>
            <p className="lede">{q.answer}</p>
            <ul className="points">
              {q.points.map(([t, d]) => (
                <li key={t}><h3>{t}</h3><p>{d}</p></li>
              ))}
            </ul>
            <div className="inline-cta">
              <button type="button" className="btn btn-primary" onClick={() => openAccess(q.ask, 'chat')}>Chat with us</button>
              <button type="button" className="btn btn-ghost" onClick={() => openAccess(q.ask)}>Ask us how →</button>
            </div>
          </div>
          <div className="question-side">
            <div className="question-visual card">
              <span className="question-word" aria-hidden="true">{q.word}</span>
              <Visual />
            </div>
            <figure className="voice">
              <blockquote>“{q.voice[0]}”</blockquote>
              <figcaption>{q.voice[1]}</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

function RouteVisual() {
  const paths = [
    ['1', 'Area code 2xx', 'Any time', 'New York desk'],
    ['2', 'Office hours', 'Mon–Fri 09:00–18:00', 'Sales desk → Overflow'],
    ['3', 'Everything else', 'Any time', 'After-hours answering'],
  ];
  return (
    <div className="plan-paths">
      <span className="stat-label">Routing plan · Sales — smart routing <span className="badge badge-green">Live</span></span>
      {paths.map(([n, name, when, to]) => (
        <div className="plan-path" key={n}>
          <span className="plan-n">{n}</span>
          <span><strong>{name}</strong><small>{when}</small></span>
          <span className="plan-to">→ {to}</span>
        </div>
      ))}
      <p className="muted small">Checked top to bottom. The first path that matches takes the call.</p>
    </div>
  );
}

function FailoverVisual() {
  const steps = [
    ['Sales desk', '+1 (646) 555-0110', 'No answer · 20s', 'miss'],
    ['Sales overflow', '+1 (917) 555-0177', 'Busy', 'miss'],
    ['After-hours answering', '+1 (415) 555-0188', 'Connected · 3m 41s', 'ok'],
  ];
  return (
    <div className="chain">
      <span className="stat-label">One call, three tries · priority order</span>
      {steps.map(([name, target, result, kind], i) => (
        <div className={`chain-step ${kind}`} key={name}>
          <span className="chain-n">{i + 1}</span>
          <span><strong>{name}</strong><small>{target}</small></span>
          <span className={`badge ${kind === 'ok' ? 'badge-green' : 'badge-amber'}`}>{result}</span>
        </div>
      ))}
    </div>
  );
}

function InsightVisual() {
  const bars = [['Sales desk', 97, '97%'], ['Support PBX', 93, '93%'], ['Miami office', 88, '88%'], ['Billing team', 74, '74%'], ['Overflow', 61, '61%']];
  return (
    <div className="bars">
      <span className="stat-label">Answer rate by destination · last 30 days</span>
      {bars.map(([s, w, v], i) => (
        <div className="bar-row" key={s}>
          <span>{s}</span>
          <span className="bar-track"><span className={`bar-fill${i === bars.length - 1 ? ' top' : ''}`} style={{ width: `${w}%` }} /></span>
          <strong>{v}</strong>
        </div>
      ))}
      <p className="muted small">The red bar is the one to fix first.</p>
    </div>
  );
}

const VISUALS = { route: RouteVisual, failover: FailoverVisual, insight: InsightVisual };

/* ---------------- Missed-call calculator ---------------- */

function Calculator() {
  const openAccess = useAccess();
  const [calls, setCalls] = useState(400);
  const [missed, setMissed] = useState(20);
  const [minutes, setMinutes] = useState(4);
  const [value, setValue] = useState(450);
  const [closeRate, setCloseRate] = useState(30);

  const missedCalls = calls * (missed / 100);
  const atRisk = missedCalls * (closeRate / 100) * value;
  const forwardCost = calls * minutes * RATES.perMinute + RATES.numbers[0][1];

  const field = (label, val, set, opts) => (
    <label className="calc-field">
      <span className="calc-label">{label}<b>{opts.fmt(val)}</b></span>
      <input type="range" min={opts.min} max={opts.max} step={opts.step} value={val} onChange={e => set(Number(e.target.value))} />
    </label>
  );

  return (
    <section className="band calc-band" id="calculator">
      <div className="wrap">
        <div className="section-head">
          <span className="section-title">Run your own numbers</span>
          <h2>What are missed calls costing you?</h2>
          <p className="lede">Every call that rings out is a customer who probably called the next business on the list. Drag the sliders to see what that adds up to — and what it costs to forward every call instead.</p>
        </div>
        <div className="calc">
          <div className="calc-inputs">
            {field('Calls per month', calls, setCalls, { min: 20, max: 5000, step: 20, fmt: v => v.toLocaleString() })}
            {field('Share that go unanswered', missed, setMissed, { min: 0, max: 60, step: 5, fmt: v => `${v}%` })}
            {field('Average call length', minutes, setMinutes, { min: 1, max: 20, step: 1, fmt: v => `${v} min` })}
            {field('Value of a won customer', value, setValue, { min: 50, max: 10000, step: 50, fmt: usd })}
            {field('Calls that become customers', closeRate, setCloseRate, { min: 5, max: 80, step: 5, fmt: v => `${v}%` })}
          </div>
          <div className="calc-out card">
            <div className="calc-compare">
              <div><span className="stat-label">Walking away each month</span><div className="stat-value accent">{usd(atRisk)}</div></div>
              <div><span className="stat-label">Forwarding every call</span><div className="stat-value">{usd(forwardCost)}</div></div>
            </div>
            <div className="calc-rows">
              <div><span>Missed calls a month</span><strong>{Math.round(missedCalls)}</strong></div>
              <div><span>Customers lost with them</span><strong>{Math.round(missedCalls * closeRate / 100)}</strong></div>
              <div><span>Forwarded minutes</span><strong>{(calls * minutes).toLocaleString()} × {cents(RATES.perMinute)}</strong></div>
              <div><span>Plus one local number</span><strong>{cents(RATES.numbers[0][1])}/mo</strong></div>
            </div>
            <p className="muted small">Forwarding cost uses MicroAV’s standard per-minute rate. Failover won’t catch every call, but every one it catches counts.</p>
            <button type="button" className="btn btn-primary btn-block" onClick={() => openAccess(`Calculator: ${calls} calls/mo, ${missed}% missed`, 'chat')}>Plan my routing with us →</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Views, connects, trust ---------------- */

function Views() {
  const [view, setView] = useState('business');
  const v = VIEWS[view];
  return (
    <section className="band" id="views">
      <div className="wrap">
        <div className="toggle" role="tablist" aria-label="Choose your view">
          {Object.entries(VIEWS).map(([k, x]) => (
            <button key={k} type="button" role="tab" aria-selected={view === k} onClick={() => setView(k)}>{x.label}</button>
          ))}
        </div>
        <div className="views-body">
          <div>
            <h2>{v.title}</h2>
            <p className="lede">{v.copy}</p>
          </div>
          <div>
            <ul className="check-list">{v.list.map(x => <li key={x}>{x}</li>)}</ul>
            <figure className="voice">
              <blockquote>“{v.voice[0]}”</blockquote>
              <figcaption>{v.voice[1]}</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

function Connects() {
  return (
    <section className="wrap section" id="connects">
      <div className="split">
        <div>
          <span className="section-title">Rings anywhere</span>
          <h2>If it can take a call, MicroAV can reach it.</h2>
          <p className="lede">Send calls to mobiles, desk phones, an answering service or straight into your VoIP system over SIP. Pull the results out again by CSV or API.</p>
          <ol className="setup">
            {SETUP.map(([t, d], i) => (
              <li key={t}><span className="step-n">{i + 1}</span><div><strong>{t}</strong><p>{d}</p></div></li>
            ))}
          </ol>
        </div>
        <div className="logo-grid">
          {CONNECTS.map(n => <div key={n}><span>{n}</span></div>)}
        </div>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="wrap section trust" id="trust">
      <div className="section-head">
        <span className="section-title">Protection & control</span>
        <h2>Your phone line is your front door. Keep it tidy.</h2>
      </div>
      <div className="trust-grid">
        {TRUST.map(([t, d]) => (
          <div key={t}>
            <span className="trust-mark" aria-hidden="true" />
            <h3>{t}</h3>
            <p>{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Pricing ---------------- */

function Pricing() {
  const openAccess = useAccess();
  const cards = [
    {
      name: 'Phone numbers', price: cents(RATES.numbers[0][1]), unit: '/mo per local number', pitch: 'Rent as many as you need, cancel any time.',
      list: RATES.numbers.map(([k, v]) => `${k} — ${cents(v)}/mo`).concat('Mobile numbers available'),
    },
    {
      name: 'Forwarded minutes', price: cents(RATES.perMinute), unit: '/min', pitch: 'Only pay for calls that connect.', featured: true,
      list: [`Prepaid balance, top up from $${RATES.minTopUp}`, 'Deducted per minute as you go', 'Low-balance alerts you set', 'No contract, no minimums'],
    },
    {
      name: 'The platform', price: '$0', unit: '/mo', pitch: 'Every feature on every account.',
      list: ['Unlimited routing plans & rules', 'IVR menus & failover', 'Live monitor, reports, CSV', 'API access'],
    },
  ];
  return (
    <section className="band" id="pricing">
      <div className="wrap">
        <div className="pricing-head">
          <div>
            <span className="section-title">Pricing</span>
            <h2>Pay for numbers and minutes. That’s it.</h2>
          </div>
          <p className="muted pricing-note">No seats, no tiers, no setup fee. Every account gets every feature.</p>
        </div>
        <div className="plans">
          {cards.map(c => (
            <article key={c.name} className={`plan${c.featured ? ' hot' : ''}`}>
              {c.featured && <span className="badge plan-flag">Only pay for use</span>}
              <h3>{c.name}</h3>
              <p className="muted">{c.pitch}</p>
              <div className="price">{c.price}<small>{c.unit}</small></div>
              <button type="button" className={`btn btn-block${c.featured ? ' btn-primary' : ''}`} onClick={() => openAccess(`Pricing: ${c.name}`, 'chat')}>Chat with us</button>
              <ul>{c.list.map(f => <li key={f}>{f}</li>)}</ul>
            </article>
          ))}
        </div>
        <div className="partner">
          <div>
            <span className="stat-label">High volume or reselling?</span>
            <h3>Volume minute rates and reseller accounts for agencies and call networks.</h3>
          </div>
          <button type="button" className="btn" onClick={() => openAccess('Volume / reseller pricing')}>Get a volume quote</button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ, closing, footer ---------------- */

function Faq() {
  return (
    <section className="wrap section faq" id="faq">
      <div>
        <span className="section-title">FAQ</span>
        <h2>Fair questions.</h2>
      </div>
      <div className="faq-list">
        {FAQS.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Closing() {
  const openAccess = useAccess();
  return (
    <section className="wrap closing">
      <div className="hero cta">
        <div className="hero-inner">
          <div>
            <span className="hero-eyebrow">Your phone is ringing somewhere</span>
            <h2>Make sure someone<br />picks it up<span className="accent">.</span></h2>
            <p>Numbers from {cents(RATES.numbers[0][1])} a month, minutes at {cents(RATES.perMinute)}, and a real person to help you set up your first routing plan.</p>
          </div>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={() => openAccess('', 'chat')}>Chat with us →</button>
            <button type="button" className="btn btn-lg" onClick={() => openAccess()}>Request access</button>
          </div>
        </div>
        <span className="hero-word" aria-hidden="true">Connect</span>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <Logo size={28} />
          <p className="muted">Call forwarding and routing that gets every call to the right person.</p>
        </div>
        {FOOTER.map(([title, links]) => (
          <div key={title}>
            <span className="stat-label">{title}</span>
            <ul>{links.map(l => <li key={l}><a href="#top">{l}</a></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="wrap footer-legal">
        <span>© {new Date().getFullYear()} MicroAV</span>
        <span><a href="#top">Terms</a><a href="#top">Privacy</a><a href="#top">Cookies</a></span>
      </div>
    </footer>
  );
}

/* ---------------- Sticky mobile CTA ---------------- */

function StickyCta() {
  const openAccess = useAccess();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const nearEnd = window.innerHeight + window.scrollY > document.body.scrollHeight - 600;
      setShow(window.scrollY > 700 && !nearEnd);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className={`sticky-cta${show ? ' is-visible' : ''}`} aria-hidden={!show}>
      <button type="button" className="btn btn-primary" onClick={() => openAccess('', 'chat')} tabIndex={show ? 0 : -1}>Chat with us</button>
      <button type="button" className="btn" onClick={() => openAccess()} tabIndex={show ? 0 : -1}>Request access</button>
    </div>
  );
}

/* ---------------- Request-access modal ---------------- */

const VOLUMES = ['Under 50', '50–250', '250–1,000', '1,000+'];

function AccessModal({ interest, mode = 'access', onClose }) {
  const chat = mode === 'chat';
  const firstInput = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', company: '', type: 'My business', volume: VOLUMES[1], note: chat ? '' : interest, topic: chat ? interest : '', kind: chat ? 'chat' : 'access' });
  const [state, setState] = useState('idle'); // idle | sending | sent | mailed | error
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    firstInput.current?.focus();
    const onKey = e => { if (e.key === 'Escape') closeRef.current(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, []);

  const mailto = () => {
    const body = chat
      ? [form.note, '', `— ${form.name}`, form.email, form.topic && `(Re: ${form.topic})`].filter(x => x !== false && x !== undefined).join('\n')
      : [`Name: ${form.name}`, `Email: ${form.email}`, `Company: ${form.company}`, `Setting up for: ${form.type}`,
        `Calls per month: ${form.volume}`, form.note && `Note: ${form.note}`].filter(Boolean).join('\n');
    const subject = chat ? `Question from ${form.name || 'the website'}` : `MicroAV access request — ${form.company || form.name}`;
    return `${CONTACT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const submit = async e => {
    e.preventDefault();
    if (!ACCESS_ENDPOINT) {
      window.location.href = mailto();
      setState('mailed');
      return;
    }
    setState('sending');
    try {
      const res = await fetch(ACCESS_ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(form),
      });
      setState(res.ok ? 'sent' : 'error');
    } catch {
      setState('error');
    }
  };

  const first = form.name.trim().split(/\s+/)[0];
  const done = state === 'sent' || state === 'mailed';

  return (
    <div className="modal-scrim" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="access-modal card" role="dialog" aria-modal="true" aria-labelledby="access-title">
        <button type="button" className="modal-x" onClick={onClose} aria-label="Close">×</button>
        {done ? (
          <div className="access-done">
            <span className="section-title">{state === 'sent' ? (chat ? 'Message received' : 'Request received') : 'Almost there'}</span>
            <h2 id="access-title">Thanks{first ? `, ${first}` : ''}<span className="accent">.</span></h2>
            {state === 'sent'
              ? <p className="lede">{chat ? 'A real person will reply by email, usually within a few working hours.' : 'We’ll be in touch within one working day to set up your access.'}</p>
              : <p className="lede">Your email app should have opened with your details filled in — just press send. If it didn’t, email <a href={mailto()}>hello@microav.com</a>.</p>}
            <button type="button" className="btn" onClick={onClose}>Back to the site</button>
          </div>
        ) : (
          chat ? (
          <form onSubmit={submit}>
            <span className="section-title">Chat with us</span>
            <h2 id="access-title">Ask us anything.</h2>
            <p className="muted">Pricing, setup, whether MicroAV fits your business — send a message and a real person will get back to you.</p>
            <div className="form-grid">
              <label>Your name<input ref={firstInput} required value={form.name} onChange={set('name')} autoComplete="name" /></label>
              <label>Email<input type="email" required value={form.email} onChange={set('email')} autoComplete="email" /></label>
              <label className="span-2">Your message
                <textarea rows={4} required value={form.note} onChange={set('note')}
                  placeholder={form.topic ? `About “${form.topic}”…` : 'What would you like to know?'} />
              </label>
            </div>
            {state === 'error' && (
              <p className="form-error" role="alert">That didn’t go through. Try again, or <a href={mailto()}>email us instead</a>.</p>
            )}
            <button className="btn btn-primary btn-block" type="submit" disabled={state === 'sending'}>
              {state === 'sending' ? 'Sending…' : 'Send message →'}
            </button>
          </form>
          ) : (
          <form onSubmit={submit}>
            <span className="section-title">Request access</span>
            <h2 id="access-title">Let’s get you set up.</h2>
            <p className="muted">Tell us a little about you and we’ll set up your account, numbers and first routing plan.</p>
            <div className="form-grid">
              <label>Your name<input ref={firstInput} required value={form.name} onChange={set('name')} autoComplete="name" /></label>
              <label>Work email<input type="email" required value={form.email} onChange={set('email')} autoComplete="email" /></label>
              <label className="span-2">Company<input required value={form.company} onChange={set('company')} autoComplete="organization" /></label>
              <fieldset className="span-2">
                <legend>I’m setting this up for</legend>
                <div className="seg">
                  {['My business', 'Clients'].map(t => (
                    <label key={t} className={form.type === t ? 'on' : ''}>
                      <input type="radio" name="type" value={t} checked={form.type === t} onChange={set('type')} />{t}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="span-2">Calls per month
                <select value={form.volume} onChange={set('volume')}>{VOLUMES.map(v => <option key={v}>{v}</option>)}</select>
              </label>
              <label className="span-2">Anything we should know? <span className="muted">(optional)</span>
                <textarea rows={2} value={form.note} onChange={set('note')} />
              </label>
            </div>
            {state === 'error' && (
              <p className="form-error" role="alert">That didn’t go through. Try again, or <a href={mailto()}>email us instead</a>.</p>
            )}
            <button className="btn btn-primary btn-block" type="submit" disabled={state === 'sending'}>
              {state === 'sending' ? 'Sending…' : 'Request access →'}
            </button>
            <p className="muted small">We’ll only use this to set up your account.</p>
          </form>
          )
        )}
      </div>
    </div>
  );
}

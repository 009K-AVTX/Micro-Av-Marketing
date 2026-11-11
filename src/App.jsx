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
          <span className="section-title">Call forwarding panel · numbers, rules & live traffic</span>
          <h1>Route Every Call. Anywhere<span className="accent">.</span></h1>
          <p className="lede">Get local and toll-free numbers, decide where each call goes by time, area code or keypad choice, line up backups for busy moments, and watch it all happen live — from one simple panel.</p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={() => openAccess('', 'chat')}>Chat with us →</button>
            <button type="button" className="btn btn-lg" onClick={() => openAccess('Panel tour')}>Book a Tour</button>
          </div>
          <a className="text-link" href="#journey">Follow one call through MicroAV ↓</a>
          <ul className="assurances">
            <li>Local &amp; toll-free numbers</li><li>Prepaid, no lock-in</li><li>Phones and SIP lines</li>
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
        <em>MicroAV · Live Monitor</em>
      </div>
      <div className="preview-stats">
        <div><span className="stat-label">On the line</span><div className="stat-value">{live}</div></div>
        <div><span className="stat-label">Calls today</span><div className="stat-value">{214 + tick}</div></div>
        <div><span className="stat-label">Answer rate</span><div className="stat-value">96<small>%</small></div></div>
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
        <span className="section-title">The call path</span>
        <h2>Five Steps, Usually Under a Second.</h2>
        <p className="lede">Each call to a MicroAV number goes through the same sequence. You set every step from the panel.</p>
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
            <span className="section-title">{q.n} · Handled on every call</span>
            <h2>{q.ask}</h2>
            <p className="lede">{q.answer}</p>
            <ul className="points">
              {q.points.map(([t, d]) => (
                <li key={t}><h3>{t}</h3><p>{d}</p></li>
              ))}
            </ul>
            <div className="inline-cta">
              <button type="button" className="btn btn-primary" onClick={() => openAccess(q.ask, 'chat')}>Chat with us</button>
              <button type="button" className="btn btn-ghost" onClick={() => openAccess(q.ask)}>See it in the panel →</button>
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
      <p className="muted small">Paths are checked top to bottom. The first match with a free destination takes the call.</p>
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
      <span className="stat-label">One call, three destinations · in order</span>
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
      <p className="muted small">Red marks the destination losing the most calls.</p>
    </div>
  );
}

const VISUALS = { route: RouteVisual, failover: FailoverVisual, insight: InsightVisual };

/* ---------------- Missed-call calculator ---------------- */

function Calculator() {
  const openAccess = useAccess();
  const [calls, setCalls] = useState(400);
  const [missed, setMissed] = useState(20);
  const [value, setValue] = useState(450);
  const [closeRate, setCloseRate] = useState(30);

  const missedCalls = calls * (missed / 100);
  const atRisk = missedCalls * (closeRate / 100) * value;
  const callWorth = (closeRate / 100) * value;
  const returnPerDollar = callWorth / RATES.perCall;

  const field = (label, val, set, opts) => (
    <label className="calc-field">
      <span className="calc-label">{label}<b>{opts.fmt(val)}</b></span>
      <input type="range" min={opts.min} max={opts.max} step={opts.step} value={val} onChange={e => set(Number(e.target.value))}
        style={{ '--fill': `${((val - opts.min) / (opts.max - opts.min)) * 100}%` }} />
    </label>
  );
  const lostSales = missedCalls * closeRate / 100;

  return (
    <section className="band calc-band" id="calculator">
      <div className="wrap">
        <div className="section-head">
          <span className="section-title">Missed-call estimate</span>
          <h2>Price Out Your Unanswered Calls.</h2>
          <p className="lede">A call nobody answers rarely calls back. Move the sliders to put a monthly figure on those lost calls, and see what one answered call is worth next to MicroAV’s average price per call.</p>
        </div>
        <div className="calc">
          <div className="calc-inputs card">
            <span className="stat-label">Your numbers</span>
            {field('Calls per month', calls, setCalls, { min: 20, max: 5000, step: 20, fmt: v => v.toLocaleString() })}
            {field('Calls nobody answers', missed, setMissed, { min: 0, max: 60, step: 5, fmt: v => `${v}%` })}
            {field('Average sale per customer', value, setValue, { min: 50, max: 10000, step: 50, fmt: usd })}
            {field('Answered calls that buy', closeRate, setCloseRate, { min: 5, max: 80, step: 5, fmt: v => `${v}%` })}
          </div>
          <div className="calc-out card">
            <div className="calc-compare">
              <div><span className="stat-label">Lost each month</span><div className="stat-value accent">{usd(atRisk)}</div></div>
              <div><span className="stat-label">One answered call is worth</span><div className="stat-value">{usd(callWorth)}</div></div>
            </div>
            <div className="calc-rows">
              <div><span>Unanswered calls</span><strong>{Math.round(missedCalls)}</strong></div>
              <div><span>Sales that went elsewhere</span><strong>{lostSales < 10 ? lostSales.toFixed(1) : Math.round(lostSales)}</strong></div>
              <div><span>MicroAV average per call</span><strong>{usd(RATES.perCall)}</strong></div>
              <div><span>Back for every $1 spent</span><strong>${returnPerDollar.toFixed(2)}</strong></div>
            </div>
            <p className="muted small">Worked out at the {usd(RATES.perCall)} average per connected call. Your own rate is set in a short chat with the MicroAV team.</p>
            <button type="button" className="btn btn-primary btn-block" onClick={() => openAccess(`My per-call price (${calls} calls/mo, ${missed}% unanswered)`, 'chat')}>Chat for Your Price →</button>
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
          <span className="section-title">Destinations</span>
          <h2>Forward to Any Phone You Already Use.</h2>
          <p className="lede">Mobiles, office handsets, a night service or your VoIP system over SIP — all work as destinations. Call data comes back out by CSV or API.</p>
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
        <span className="section-title">Safeguards</span>
        <h2>Stay in Control of Who Gets Through.</h2>
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
      name: 'Included', price: '$0', unit: '/mo', pitch: 'Numbers and the full panel come with every account.',
      list: ['Local and toll-free numbers', 'Routing plans, IVR menus & backup order', 'Live monitor, reports, CSV', 'API key'],
    },
    {
      name: 'Per Connected Call', price: usd(RATES.perCall), unit: ' avg / call', pitch: 'One price per call — no minutes to count.', featured: true,
      list: ['Charged only when a call connects', 'Blocked callers are never billed', `Prepaid, top up from $${RATES.minTopUp}`, 'Your own low-balance warning'],
    },
    {
      name: 'Your Rate', price: 'Fixed', unit: ' up front', pitch: 'Your exact per-call price is agreed before you go live.',
      list: ['Industry and call type', 'Monthly call volume', 'Number type and country', 'How many paths and menus you run'],
    },
  ];
  return (
    <section className="band" id="pricing">
      <div className="wrap">
        <div className="pricing-head">
          <div>
            <span className="section-title">Pricing</span>
            <h2>One Price per Call, Averaging $35.</h2>
          </div>
          <p className="muted pricing-note">No per-minute meter, no per-user fees and no plan levels.</p>
        </div>
        <div className="plans">
          {cards.map(c => (
            <article key={c.name} className={`plan${c.featured ? ' hot' : ''}`}>
              {c.featured && <span className="badge plan-flag">Most accounts</span>}
              <h3>{c.name}</h3>
              <p className="muted">{c.pitch}</p>
              <div className="price">{c.price}<small>{c.unit}</small></div>
              <button type="button" className={`btn btn-block${c.featured ? ' btn-primary' : ''}`} onClick={() => openAccess('My per-call price', 'chat')}>Chat for Your Price</button>
              <ul>{c.list.map(f => <li key={f}>{f}</li>)}</ul>
            </article>
          ))}
        </div>
        <div className="partner">
          <div>
            <span className="stat-label">Lots of calls, or reselling?</span>
            <h3>Lower Per-Call Rates at Volume, and Reseller Accounts for Agencies.</h3>
          </div>
          <button type="button" className="btn" onClick={() => openAccess('Volume or reseller rates')}>Ask About Volume Rates</button>
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
        <span className="section-title">Help</span>
        <h2>Common Questions, Plain Answers.</h2>
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
            <span className="hero-eyebrow">Ready when you are</span>
            <h2>Never Let a<br />Call Ring Out<span className="accent">.</span></h2>
            <p>Priced per connected call, averaging {usd(RATES.perCall)}, with numbers included. We’ll help you build your first routing plan.</p>
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
          <p className="muted">Numbers, rules, menus and live traffic in one forwarding panel.</p>
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
              ? <p className="lede">{chat ? 'Someone from the MicroAV team will email you back, normally the same working day.' : 'We’ll email you within one working day with your login.'}</p>
              : <p className="lede">Your email app should now be open with the details filled in. Hit send to finish. If it didn’t, email <a href={mailto()}>hello@microav.com</a>.</p>}
            <button type="button" className="btn" onClick={onClose}>Back to the site</button>
          </div>
        ) : (
          chat ? (
          <form onSubmit={submit}>
            <span className="section-title">Chat with us</span>
            <h2 id="access-title">Send Us a Message.</h2>
            <p className="muted">Rates, setup or whether MicroAV suits your calls — write to us and the team will reply.</p>
            <div className="form-grid">
              <label>Your name<input ref={firstInput} required value={form.name} onChange={set('name')} autoComplete="name" /></label>
              <label>Email<input type="email" required value={form.email} onChange={set('email')} autoComplete="email" /></label>
              <label className="span-2">Your message
                <textarea rows={4} required value={form.note} onChange={set('note')}
                  placeholder={form.topic ? `About “${form.topic}”…` : 'What would you like to know?'} />
              </label>
            </div>
            {state === 'error' && (
              <p className="form-error" role="alert">Sending failed. Try once more, or <a href={mailto()}>email us directly</a>.</p>
            )}
            <button className="btn btn-primary btn-block" type="submit" disabled={state === 'sending'}>
              {state === 'sending' ? 'Sending…' : 'Send message →'}
            </button>
          </form>
          ) : (
          <form onSubmit={submit}>
            <span className="section-title">Request access</span>
            <h2 id="access-title">Open Your MicroAV Account.</h2>
            <p className="muted">A few details and we’ll prepare your panel, numbers and a starter routing plan.</p>
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
              <p className="form-error" role="alert">Sending failed. Try once more, or <a href={mailto()}>email us directly</a>.</p>
            )}
            <button className="btn btn-primary btn-block" type="submit" disabled={state === 'sending'}>
              {state === 'sending' ? 'Sending…' : 'Request access →'}
            </button>
            <p className="muted small">Used only to create your account.</p>
          </form>
          )
        )}
      </div>
    </div>
  );
}

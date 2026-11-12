import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Logo from './components/Logo';
import { CONNECTS, FAQS, FOOTER, JOURNEY, NAV, QUESTIONS, RATES, SETUP, TICKER, TRUST, VIEWS } from './content';
import { CALLERS, PICKUP, PLAN, TIMES, routeCall } from './routing';

const CONTACT = 'mailto:hello@microav.com';

// Optional: set VITE_ACCESS_ENDPOINT to a form backend (Formspree, a webhook, etc.).
// Without it, the request-access form opens a pre-filled email instead.
const ACCESS_ENDPOINT = import.meta.env.VITE_ACCESS_ENDPOINT;

const AccessCtx = createContext(() => {});
const useAccess = () => useContext(AccessCtx);
// "Chat with us" buttons call openAccess(topic, 'chat'): the same modal, asking for a message instead.


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
        <TestCall />
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
        <CallFlow />
      </div>
      <span className="hero-word" aria-hidden="true">Forward</span>
    </section>
  );
}

// [caller, dialed, route, status]
// Sample calls the hero cycles through: [caller, time, first desk].
const HERO_CALLS = [
  ['ny', 'office', 'answers'],
  ['chi', 'office', 'busy'],
  ['chi', 'evening', 'answers'],
  ['spam', 'office', 'answers'],
  ['ny', 'weekend', 'noanswer'],
  ['chi', 'office', 'answers'],
];
const RESULT_BADGE = { Connected: 'badge-green', 'Rolled over': 'badge-amber', Blocked: 'badge-red' };

function CallFlow() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => setI(n => (n + 1) % HERO_CALLS.length), 3600);
    return () => clearInterval(id);
  }, [paused]);

  const [c, t, p] = HERO_CALLS[i];
  const caller = CALLERS[c];
  const { steps, paths, result } = routeCall(c, t, p);
  const pathNote = j => steps.find(s => s.title.startsWith(`Path ${j + 1} `))?.detail;

  return (
    <div className="preview card flow" aria-label="Example of MicroAV routing a call"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="preview-bar">
        <span /><span /><span />
        <em>MicroAV · Sales — smart routing</em>
        <span className="flow-live"><i />Live</span>
      </div>

      <div className="flow-body" key={i}>
        <div className="flow-caller">
          <span className="stat-label">Incoming call</span>
          <div className="flow-caller-row">
            <strong>{caller.number}</strong>
            <span className="muted small">{caller.label} · {TIMES[t].label}</span>
          </div>
        </div>

        <div className={`flow-gate${caller.blocked ? ' is-stop' : ''}`}>
          <span>Block list</span>
          <span>{caller.blocked ? 'Blocked' : 'Clear'}</span>
        </div>

        <ol className="flow-paths">
          {PLAN.map((path, j) => (
            <li key={path.name} className={`is-${paths[j]}`} style={{ '--d': `${0.25 + j * 0.25}s` }}>
              <span className="plan-n">{j + 1}</span>
              <span><strong>{path.name}</strong><small>{paths[j] === 'idle' ? path.when : pathNote(j)}</small></span>
              <span className="flow-to">→ {path.chain.join(' → ')}</span>
            </li>
          ))}
        </ol>

        <div className="flow-result">
          <span className={`badge ${RESULT_BADGE[result.status]}`}>{result.status}</span>
          <strong>{result.to}</strong>
          {result.status === 'Rolled over' && <span className="muted small">first desk: {PICKUP[p].reason.toLowerCase()}</span>}
        </div>
      </div>

      <div className="flow-dots" role="tablist" aria-label="Sample calls">
        {HERO_CALLS.map((_, j) => (
          <button key={j} type="button" role="tab" aria-selected={j === i} aria-label={`Sample call ${j + 1}`}
            onClick={() => { setI(j); setPaused(true); }} />
        ))}
      </div>
    </div>
  );
}

/* ---------------- Ticker & journey ---------------- */

function Ticker() {
  // Four copies so the band never runs out on very wide or zoomed-out screens.
  const items = [...TICKER, ...TICKER, ...TICKER, ...TICKER];
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

function IvrVisual() {
  const keys = [['1', 'Sales', 'Sales desk'], ['2', 'Support', 'Support PBX'], ['3', 'Billing', 'Billing team'], ['0', 'Anything else', 'Front desk']];
  return (
    <div className="ivr">
      <span className="stat-label">IVR menu · Main menu</span>
      <p className="ivr-greeting">“Thanks for calling. Press 1 for sales, 2 for support, 3 for billing, or 0 for the front desk.”</p>
      <div className="ivr-keys">
        {keys.map(([k, label, to]) => (
          <div key={k}>
            <span className="ivr-key">{k}</span>
            <span><strong>{label}</strong><small>→ {to}</small></span>
          </div>
        ))}
      </div>
      <p className="muted small">No key pressed in 8 seconds → Front desk.</p>
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

const VISUALS = { route: IvrVisual, failover: FailoverVisual, insight: InsightVisual };

/* ---------------- Test-call simulator ---------------- */

const STEP_ICON = { pass: '✓', stop: '✕', skip: '–', match: '●', fail: '!', ok: '✓' };

function TestCall() {
  const openAccess = useAccess();
  const [caller, setCaller] = useState('chi');
  const [time, setTime] = useState('office');
  const [pickup, setPickup] = useState('busy');
  const { steps, result } = routeCall(caller, time, pickup);

  const choice = (label, value, set, options) => (
    <div className="tc-choice">
      <span className="tc-label">{label}</span>
      <div className="tc-seg" role="radiogroup" aria-label={label}>
        {Object.entries(options).map(([k, o]) => (
          <button key={k} type="button" role="radio" aria-checked={value === k} onClick={() => set(k)}>{o.label}</button>
        ))}
      </div>
    </div>
  );

  return (
    <section className="band" id="test-call">
      <div className="wrap">
        <div className="section-head">
          <span className="section-title">Test call</span>
          <h2>Try a Call Before It’s Real.</h2>
          <p className="lede">The MicroAV panel lets you dry-run any call through your rules. Have a go with this sample plan: pick who’s calling, when, and whether the first desk picks up.</p>
        </div>
        <div className="tc">
          <div className="tc-inputs card">
            <span className="stat-label">The call</span>
            {choice('Who’s calling', caller, setCaller, CALLERS)}
            {choice('When', time, setTime, TIMES)}
            {choice('First desk', pickup, setPickup, PICKUP)}
            <p className="muted small tc-plan">
              Sample plan: 212 callers → New York desk · weekdays 9–6 → Sales desk · everything else → answering service.
              Busy or unanswered desks roll to Sales overflow.
            </p>
          </div>
          <div className="tc-out card">
            <span className="stat-label">What MicroAV does</span>
            <ol className="tc-steps" key={`${caller}${time}${pickup}`}>
              {steps.map((s, i) => (
                <li key={i} className={`k-${s.kind}`} style={{ '--d': `${i * 0.08}s` }}>
                  <span className="tc-icon" aria-hidden="true">{STEP_ICON[s.kind]}</span>
                  <span><strong>{s.title}</strong><small>{s.detail}</small></span>
                </li>
              ))}
            </ol>
            <div className="tc-result">
              <span className={`badge ${RESULT_BADGE[result.status]}`}>{result.status}</span>
              <strong>{result.to}</strong>
            </div>
            <button type="button" className="btn btn-primary btn-block" onClick={() => openAccess('Help mapping my routing', 'chat')}>Map Out My Own Routing →</button>
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
      name: 'Included', pitch: 'Numbers and the full panel come with every account.',
      list: ['Local and toll-free numbers', 'Routing plans, IVR menus & backup order', 'Live monitor, reports, CSV', 'API key'],
    },
    {
      name: 'Per Connected Call', pitch: 'One price per call — no minutes to count.', featured: true,
      list: ['Charged only when a call connects', 'Blocked callers are never billed', `Prepaid, top up from $${RATES.minTopUp}`, 'Your own low-balance warning'],
    },
    {
      name: 'Your Rate', pitch: 'Your per-call price is agreed with you in a chat, before you go live.',
      list: ['Industry and call type', 'Monthly call volume', 'Number type and country', 'How many paths and menus you run'],
    },
  ];
  return (
    <section className="band" id="pricing">
      <div className="wrap">
        <div className="pricing-head">
          <div>
            <span className="section-title">Pricing</span>
            <h2>Priced per Call, Set for Your Business.</h2>
          </div>
          <p className="muted pricing-note">No per-minute meter, no per-user fees and no plan levels.</p>
        </div>
        <div className="plans">
          {cards.map(c => (
            <article key={c.name} className={`plan${c.featured ? ' hot' : ''}`}>
              {c.featured && <span className="badge plan-flag">How you pay</span>}
              <h3>{c.name}</h3>
              <p className="muted">{c.pitch}</p>
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
            <p>Priced per connected call at a rate we agree with you, numbers included. We’ll help you build your first routing plan.</p>
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

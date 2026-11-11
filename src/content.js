// All marketing copy in one place. Features mirror the MicroAV forwarding panel
// (../Micro-Av). Customer quotes are placeholders — replace before launch.

export const NAV = [
  ['How it works', '#journey'],
  ['Routing', '#route'],
  ['Failover', '#failover'],
  ['Pricing', '#pricing'],
  ['FAQ', '#faq'],
];

// The rates the panel bills at today (Micro-Av/src/lib/seed.js) — keep in sync.
export const RATES = {
  perMinute: 0.02,
  minTopUp: 5,
  numbers: [['Local number', 1.5], ['Toll-free number', 4], ['International, from', 2]],
};

// A call's path through MicroAV, shown under the hero.
export const JOURNEY = [
  ['Dial', 'Caller rings your MicroAV number'],
  ['Screen', 'Blocked and spam numbers stop here'],
  ['Match', 'Hours, area code or menu choice'],
  ['Ring', 'Priority, round robin or all at once'],
  ['Log', 'Live view, reports and cost'],
];

// The page is told as three questions every business asks about its phones.
export const QUESTIONS = [
  {
    id: 'route',
    n: 'Q1',
    ask: 'Where should this call go?',
    answer: 'Write the rules once and MicroAV makes the decision on every ring — by time of day, where the caller is, or which key they press.',
    word: 'Route',
    points: [
      ['Routing plans', 'Stack paths in order: “area code 212 goes to New York”, “weekdays 9–6 go to sales”, “everything else goes to the answering service”. The first match wins.'],
      ['IVR menus', 'Greet callers with “press 1 for sales, 2 for support” and send each key to its own team, with a fallback if they press nothing.'],
      ['Campaigns', 'Group the numbers behind each ad, client or product line, give each a daily cap, and pause or resume it in one click.'],
    ],
    voice: ['We have three offices and one number on the ads. Callers reach the nearest one without ever noticing.', 'Operations lead, multi-location clinic'],
  },
  {
    id: 'failover',
    n: 'Q2',
    ask: 'What if nobody picks up?',
    answer: 'A ring that goes unanswered is a customer calling someone else. MicroAV keeps trying until a real person answers.',
    word: 'Failover',
    points: [
      ['Failover chains', 'List destinations in order with a ring timeout on each. No answer at the desk? It moves to the overflow line, then the answering service.'],
      ['Ring strategies', 'Ring in priority order, share calls evenly with weighted round robin, or ring everyone at once and let the fastest hand win.'],
      ['Capacity limits', 'Cap simultaneous calls and daily answered calls per destination, so no one gets buried and extra calls flow to whoever is free.'],
    ],
    voice: ['Lunchtime used to be voicemail. Now calls roll to the second shift and nobody notices the gap.', 'Owner, plumbing & heating company'],
  },
  {
    id: 'insight',
    n: 'Q3',
    ask: 'How are the calls actually going?',
    answer: 'See every call as it rings, then look back by number, campaign, destination or hour to find where calls are slipping through.',
    word: 'Insight',
    points: [
      ['Live monitor', 'Watch calls ring, connect and finish in real time, with the route each one took.'],
      ['Reports', 'Answer rate, minutes, average talk time and cost — broken down by day, hour, number, campaign, destination or routing path.'],
      ['Logs, export & API', 'A searchable log of every call, CSV export for any report, and an API for your own tools.'],
    ],
    voice: ['The busiest-hour chart showed we were short-staffed on Monday mornings. One rota change fixed it.', 'Support manager, home-services franchise'],
  },
];

export const VIEWS = {
  business: {
    label: 'Small business',
    title: 'Sound bigger than you are.',
    copy: 'One number on the van, the website and the ads — ringing your mobile by day and an answering service at night. Callers just hear a business that always picks up.',
    list: ['Local and toll-free numbers', 'Business-hours and after-hours routing', 'Rings any mobile or landline', 'Block spam and robocallers'],
    voice: ['I answer from the job site, my office manager answers from home, and customers just hear one company.', 'Owner, roofing contractor'],
  },
  teams: {
    label: 'Sales & support teams',
    title: 'Share the load, fairly.',
    copy: 'Spread calls across reps with round robin, ring a whole team at once for urgent lines, and put a menu in front of the queues that need one.',
    list: ['Weighted round robin', 'IVR menus per department', 'Per-person concurrency and daily caps', 'Live monitor for team leads'],
    voice: ['Round robin ended the “he gets all the good calls” arguments overnight.', 'Sales manager, solar installer'],
  },
  agencies: {
    label: 'Agencies & call buyers',
    title: 'A campaign for every client.',
    copy: 'Give each client, buyer or ad its own campaign with its own numbers, routing and daily cap, then report answer rate and minutes per campaign.',
    list: ['Unlimited campaigns', 'Daily caps per campaign and per path', 'Reports and CSV per campaign', 'API for your own dashboards'],
    voice: ['Caps per buyer mean we never send more calls than someone paid for.', 'Founder, pay-per-call network'],
  },
};

// Where calls can ring, and which numbers you can get.
export const CONNECTS = [
  'Mobile phones', 'Desk phones', 'SIP addresses', 'Cloud PBX', 'Answering services', 'Call-center queues',
  'Local numbers', 'Toll-free numbers', 'Mobile numbers', 'REST API', 'CSV export', 'Email alerts',
];

export const SETUP = [
  ['Get a number', 'Pick local, toll-free or mobile numbers in the US, UK and more.'],
  ['Add destinations', 'Any phone number or SIP address, each with its own limits.'],
  ['Test, then go live', 'Simulate a call — caller, time, key pressed — and see exactly where it lands before you switch on.'],
];

// Protection & control — each of these exists in the panel today.
export const TRUST = [
  ['Block spam callers', 'Keep a block list tagged by reason — spam, robocaller, abusive, fraud. Blocked calls never ring a phone.'],
  ['Test before it’s live', 'Run any caller, time and key press through your rules and see the exact route before a real customer does.'],
  ['Drafts until ready', 'Build routing plans as drafts and switch them live when you’re happy. Changes never go out half-finished.'],
  ['No surprise bills', 'Prepaid balance, per-minute pricing and a low-balance alert you set yourself. No invoice you didn’t expect.'],
  ['Limits that protect people', 'Concurrency and daily caps on every destination, so one desk never gets twenty calls at once.'],
  ['Alerts when it matters', 'Notifications for low balance and reached caps, in the panel and by email.'],
];

export const FAQS = [
  ['How does call forwarding work with MicroAV?', 'You get a MicroAV phone number and put it on your website, ads or van. When someone calls it, MicroAV checks your rules and connects the call to the right phone — a mobile, a desk phone or a SIP line — in a fraction of a second.'],
  ['What happens if nobody answers?', 'The call moves to the next destination in your failover chain after the ring timeout you set. At the end of the chain it can go to voicemail or an answering service, so it’s never just left ringing.'],
  ['Can I route by where the caller is?', 'Yes. Routing paths can match the start of the caller’s number, such as an area code or country code, and send them to the nearest office or team.'],
  ['What is a SIP destination?', 'SIP is how internet phone systems connect. If your office uses a VoIP or cloud PBX, MicroAV can send calls straight to it with a SIP address instead of a regular phone number.'],
  ['How is billing worked out?', `You top up a prepaid balance (from $${RATES.minTopUp}) and forwarded minutes are deducted as you go, at $${RATES.perMinute.toFixed(2)} a minute. Numbers have a small monthly fee. No contract, no platform fee.`],
  ['Can I keep my existing number?', 'You can forward your current line to a MicroAV number today. If you want to move the number over completely, talk to us about porting.'],
  ['Is there an API?', 'Yes. Generate an API key in settings to pull call logs and reports into your own systems.'],
];

export const TICKER = [
  ['Connected', 'Sales desk · 4m 12s'],
  ['Failover', 'No answer → Sales overflow'],
  ['Blocked', 'Robocaller · +1 (202) 555-0147'],
  ['IVR', 'Pressed 2 → Support PBX'],
  ['After hours', '→ Answering service'],
  ['Round robin', 'Miami office · rep 3 of 4'],
];

export const FOOTER = [
  ['Platform', ['Phone numbers', 'Routing plans', 'IVR menus', 'Failover', 'Live monitor', 'Reports']],
  ['Partners', ['Agency program', 'Reseller rates', 'Referral scheme']],
  ['Help', ['Guides', 'Developer API', 'Service status', 'Contact']],
];

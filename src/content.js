// All marketing copy in one place, written in the MicroAV panel's own voice
// (../Micro-Av). Customer quotes are placeholders — replace before launch.

export const NAV = [
  ['The Call Path', '#journey'],
  ['Routing', '#route'],
  ['Backup Lines', '#failover'],
  ['Rates', '#pricing'],
  ['Help', '#faq'],
];

// Pricing shown on the page.
export const RATES = {
  perCall: 35, // average price per connected call; each account's exact rate is quoted
  minTopUp: 5,
};

// A call's path through MicroAV, shown under the hero.
export const JOURNEY = [
  ['Ring', 'Someone dials a MicroAV number'],
  ['Check', 'Numbers on your block list go no further'],
  ['Pick', 'The first path whose conditions fit'],
  ['Connect', 'One phone, the next free one, or all of them'],
  ['Record', 'Logged with route, minutes and cost'],
];

// Three things the panel decides for you on every call.
export const QUESTIONS = [
  {
    id: 'route',
    n: '01',
    ask: 'Send Each Caller to the Right Desk.',
    answer: 'Set the conditions once. From then on MicroAV picks the path for each call — by the clock, by the caller’s area code, or by the key they press.',
    word: 'Route',
    points: [
      ['Routing Plans', 'Build a plan from paths in order — say, “212 callers go to the New York desk”, “weekdays 9–6 go to sales”, “the rest go to the night line”. Paths are checked top to bottom.'],
      ['IVR Menus', 'Play a short greeting, map keys 1–9 to teams, and choose where the call lands if the caller presses nothing.'],
      ['Campaigns', 'Put the numbers for each ad, client or product into one campaign. Pause it, cap it and route it as a single unit.'],
    ],
    voice: ['One number runs on all our ads. MicroAV quietly hands each caller to the closest of our three branches.', 'Operations lead, multi-location clinic'],
  },
  {
    id: 'failover',
    n: '02',
    ask: 'Keep Calls Alive When a Line Is Busy.',
    answer: 'An unanswered ring usually means a lost job. MicroAV moves the call along your backup list until someone answers.',
    word: 'Backup',
    points: [
      ['Backup Order', 'Line destinations up with a ring timeout for each. If the front desk doesn’t answer in time, the call tries the overflow line, then the night service.'],
      ['Ring Styles', 'Go down the list one at a time, take turns with weighted round robin, or ring every phone together and let the quickest answer.'],
      ['Load Limits', 'Set how many calls a destination can hold at once and how many it takes per day. When it’s full, calls move to whoever has room.'],
    ],
    voice: ['Our lunch hour used to go straight to voicemail. Now those calls roll over to the afternoon crew.', 'Owner, plumbing & heating company'],
  },
  {
    id: 'insight',
    n: '03',
    ask: 'Watch Every Call, Then Learn From It.',
    answer: 'Follow calls as they happen, then slice the history by number, campaign, destination or hour to spot where callers are slipping away.',
    word: 'Calls',
    points: [
      ['Live Monitor', 'See each call ringing, connected or finished, along with the route it took.'],
      ['Reports', 'Answer rate, minutes, average talk time and spend — grouped by day, hour, number, campaign, destination or path.'],
      ['Call Logs & API', 'Search the full history, download any report as CSV, or pull the data into your own systems with an API key.'],
    ],
    voice: ['The hourly chart showed Monday mornings were where we dropped calls. We moved one shift and the gap closed.', 'Support manager, home-services franchise'],
  },
];

export const VIEWS = {
  business: {
    label: 'Owner-Run Businesses',
    title: 'One Number, Answered Every Time.',
    copy: 'Print one number on the van, the site and the flyers. It rings your mobile during the day and the night service after hours, so customers always reach someone.',
    list: ['Local and toll-free numbers', 'Day and after-hours paths', 'Forward to any mobile or landline', 'Block nuisance and robocalls'],
    voice: ['I pick up on site, my office manager picks up from home, and callers only ever hear one company.', 'Owner, roofing contractor'],
  },
  teams: {
    label: 'Sales & Support Desks',
    title: 'Spread Calls Evenly Across the Team.',
    copy: 'Rotate calls between reps, ring a whole group for urgent lines, and put a keypad menu in front of departments that need sorting.',
    list: ['Weighted round robin', 'A keypad menu per department', 'Per-person call and daily limits', 'Live view for team leads'],
    voice: ['Rotating calls put an end to arguments about who gets the good leads.', 'Sales manager, solar installer'],
  },
  agencies: {
    label: 'Agencies & Call Buyers',
    title: 'A Separate Campaign per Client.',
    copy: 'Each client, buyer or ad gets its own campaign, numbers, routing and daily cap. Report answer rate and minutes for each one on its own.',
    list: ['As many campaigns as you need', 'Daily caps per campaign and per path', 'Per-campaign reports and CSV', 'API for your own dashboards'],
    voice: ['With a cap on each buyer, nobody receives more calls than they paid for.', 'Founder, pay-per-call network'],
  },
};

// Where calls can ring, and which numbers you can get.
export const CONNECTS = [
  'Mobiles', 'Office Phones', 'SIP Addresses', 'Cloud PBX', 'Night Services', 'Contact Centers',
  'Local Numbers', 'Toll-Free Numbers', 'Mobile Numbers', 'REST API', 'CSV Downloads', 'Email Alerts',
];

export const SETUP = [
  ['Choose Numbers', 'Local, toll-free or mobile, in the US, UK and other countries.'],
  ['Add Where Calls Go', 'Any phone number or SIP address, each with its own limits.'],
  ['Try a Test Call', 'Enter a caller, a time and a key press. The panel shows the exact route before you publish.'],
];

// Protection & control — each of these exists in the panel today.
export const TRUST = [
  ['A Block List That Bites', 'Tag numbers as spam, robocaller, abusive or fraud. Blocked callers never reach a phone.'],
  ['Dry-Run Every Rule', 'Feed any caller, time and key press through your setup and see where the call would land.'],
  ['Publish When Ready', 'Plans stay as drafts until you switch them live, so half-finished edits never reach callers.'],
  ['Prepaid, Not Postpaid', 'Top up a balance, pay per connected call and set your own low-balance warning.'],
  ['Room for Everyone', 'Concurrency and daily limits on each destination stop one desk from being flooded.'],
  ['Heads-Up Alerts', 'Get notified in the panel and by email when your balance runs low or a cap is reached.'],
];

export const FAQS = [
  ['How does MicroAV forward a call?', 'You place a MicroAV number on your site, ads or vehicles. When it rings, MicroAV checks your paths and passes the call to the right mobile, office phone or SIP line almost instantly.'],
  ['What if the first phone doesn’t answer?', 'After the ring timeout you set, the call moves to the next destination in the list. The last step can be voicemail or a night service, so a call is never left ringing out.'],
  ['Can calls go to different places depending on the caller?', 'Yes. A path can match the beginning of the caller’s number — an area code or a country code — and send them to the nearest branch or team.'],
  ['What does “SIP destination” mean?', 'It’s an address for an internet phone system. If your office runs VoIP or a cloud PBX, MicroAV can hand calls to it directly with a SIP address in place of a phone number.'],
  ['How am I charged?', `Add funds to a prepaid balance (minimum $${RATES.minTopUp}). Each connected call is charged at your agreed per-call rate, which averages $${RATES.perCall} across accounts. Numbers and the panel are included, and there’s no contract.`],
  ['Do I have to change my current number?', 'No. Forward your existing line to a MicroAV number and keep using it. To transfer the number itself, ask us about porting.'],
  ['Can I connect my own software?', 'Yes. Create an API key under Settings to read call logs and reports from your own tools.'],
];

// Red ticker under the hero: what the panel does, one feature per item.
export const TICKER = [
  ['Routing plans', 'By time, area code or key press'],
  ['IVR menus', 'Keys 1–9 to any team'],
  ['Backup lines', 'Unanswered calls roll to the next phone'],
  ['Round robin', 'Calls shared evenly across reps'],
  ['Block list', 'Spam and robocalls stopped at the door'],
  ['Daily caps', 'Per campaign, path and destination'],
  ['Live monitor', 'Every call as it rings'],
  ['Test calls', 'Check the route before you publish'],
];

export const FOOTER = [
  ['Product', ['Numbers', 'Routing Plans', 'IVR Menus', 'Backup Lines', 'Live Monitor', 'Reports']],
  ['Work With Us', ['For Agencies', 'Reseller Rates', 'Refer a Business']],
  ['Support', ['Setup Guides', 'API Reference', 'System Status', 'Contact']],
];

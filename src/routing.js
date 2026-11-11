// A tiny version of the MicroAV routing engine, used by the hero animation and the
// test-call section so both always agree. Mirrors a sample "Sales — smart routing" plan.

export const CALLERS = {
  ny: { label: 'New York', number: '+1 (212) 555-0183', prefix: '+1 2' },
  chi: { label: 'Chicago', number: '+1 (312) 555-0191', prefix: '+1 3' },
  spam: { label: 'Robocaller', number: '+1 (202) 555-0147', prefix: '+1 2', blocked: true },
};

export const TIMES = {
  office: { label: 'Weekday 10:14', office: true },
  evening: { label: 'Weekday 20:40', office: false },
  weekend: { label: 'Saturday 11:05', office: false },
};

export const PICKUP = {
  answers: { label: 'Picks up' },
  busy: { label: 'Busy', reason: 'Busy' },
  noanswer: { label: 'No answer', reason: 'No answer after 20s' },
};

export const PLAN = [
  { name: 'Area code 2xx', when: 'Any time', chain: ['New York desk', 'Sales overflow'],
    test: (c) => c.prefix === '+1 2', yes: 'Caller starts +1 2', no: c => `Caller starts ${c.prefix}` },
  { name: 'Office hours', when: 'Mon–Fri 09:00–18:00', chain: ['Sales desk', 'Sales overflow'],
    test: (c, t) => t.office, yes: 'Inside office hours', no: () => 'Outside office hours' },
  { name: 'Everything else', when: 'Any time', chain: ['Answering service'],
    test: () => true, yes: 'Catches every call left', no: () => '' },
];

// Returns { steps: [{ kind, title, detail }], paths: ['match'|'skip'|'idle'], result: { status, to } }
// kind: pass | stop | skip | match | fail | ok
export function routeCall(callerKey, timeKey, pickupKey) {
  const caller = CALLERS[callerKey];
  const time = TIMES[timeKey];
  const pickup = PICKUP[pickupKey];
  const steps = [];
  const paths = PLAN.map(() => 'idle');

  if (caller.blocked) {
    steps.push({ kind: 'stop', title: 'Block list', detail: 'Tagged as robocaller — call ended before any phone rang' });
    return { steps, paths, result: { status: 'Blocked', to: 'No phone rang' } };
  }
  steps.push({ kind: 'pass', title: 'Block list', detail: 'Not on the list' });

  const i = PLAN.findIndex((p, j) => {
    const hit = p.test(caller, time);
    paths[j] = hit ? 'match' : 'skip';
    steps.push(hit
      ? { kind: 'match', title: `Path ${j + 1} · ${p.name}`, detail: p.yes }
      : { kind: 'skip', title: `Path ${j + 1} · ${p.name}`, detail: p.no(caller) });
    return hit;
  });

  const [first, backup] = PLAN[i].chain;
  // The answering service always picks up; only staffed desks can be busy or unanswered.
  if (pickup.reason && backup) {
    steps.push({ kind: 'fail', title: `Ring ${first}`, detail: pickup.reason });
    steps.push({ kind: 'ok', title: `Ring ${backup}`, detail: 'Answered' });
    return { steps, paths, result: { status: 'Rolled over', to: backup } };
  }
  steps.push({ kind: 'ok', title: `Ring ${first}`, detail: pickup.reason && !backup ? 'Answered — the answering service always picks up' : 'Answered' });
  return { steps, paths, result: { status: 'Connected', to: first } };
}

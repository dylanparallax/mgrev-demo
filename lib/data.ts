// Seed data for the demo. Northfield Services Group is fictional.
// Everything here is staged except the email, which is generated live
// (or streamed from `fallbackEmail` when no API key is set).

export type CompanyId = 'keystone' | 'ridgeline' | 'cardinal' | 'summit';

export const companies: Record<CompanyId, { name: string; trade: string; full: string }> = {
  keystone: { name: 'Keystone', trade: 'HVAC', full: 'Keystone Mechanical' },
  ridgeline: { name: 'Ridgeline', trade: 'Electrical', full: 'Ridgeline Electric' },
  cardinal: { name: 'Cardinal', trade: 'Fire', full: 'Cardinal Fire Protection' },
  summit: { name: 'Summit', trade: 'Controls', full: 'Summit Building Controls' },
};

export const companyOrder: CompanyId[] = ['keystone', 'ridgeline', 'cardinal', 'summit'];

// $K / yr. Row = customer of, column = company that could sell to them.
export const matrix: Record<CompanyId, Partial<Record<CompanyId, number>>> = {
  keystone: { ridgeline: 610, cardinal: 540, summit: 380 },
  ridgeline: { keystone: 420, cardinal: 310, summit: 290 },
  cardinal: { keystone: 350, ridgeline: 180, summit: 0 },
  summit: { keystone: 470, ridgeline: 240, cardinal: 410 },
};

export type Rep = { name: string; first: string; email: string; company: CompanyId; title: string };

export const reps: Record<string, Rep> = {
  jordan: { name: 'Jordan Ellis', first: 'Jordan', email: 'jordan@keystonemech.com', company: 'keystone', title: 'Account Manager' },
  sam: { name: 'Sam Ortiz', first: 'Sam', email: 'sam@ridgeline-electric.com', company: 'ridgeline', title: 'Service Sales Lead' },
  alicia: { name: 'Alicia Grant', first: 'Alicia', email: 'agrant@summitcontrols.com', company: 'summit', title: 'Account Executive' },
  mike: { name: 'Mike Hanley', first: 'Mike', email: 'mhanley@cardinalfire.com', company: 'cardinal', title: 'Inspection Sales' },
};

// The sample playbook. In a real install this is Monogram's work for the client.
export const brandVoice = {
  promise: 'One call keeps the building running.',
  voice: ['Plain', 'Direct', 'Local', 'Accountable'],
  rules: {
    lead: 'Lead with what the buyer is accountable for, not with our service list.',
    person: 'The intro comes from a person they already trust, never from "Northfield."',
    words: 'Never say "integrated solutions," "full-service," "one-stop shop," or "synergy."',
    ask: 'Ask for one small next step: a 20-minute call with the specialist, rep on the call.',
    short: 'Under 120 words. Sign with a first name.',
  },
};

export type Account = {
  id: string;
  name: string;
  from: CompanyId; // current vendor
  to: CompanyId; // company that should sell next
  value: number; // $K / yr
  fit: 'HIGH' | 'MED';
  rep: keyof typeof reps;
  buyer: { name: string; first: string; role: string; cares: string };
  specialist: { name: string; title: string };
  history: string;
  signal: string;
  lookalikes: string;
  playRule: string; // the opportunity-level "how"
  why: string[];
  fallbackEmail: { subject: string; body: string };
};

export const accounts: Account[] = [
  {
    id: 'harbor-point',
    name: 'Harbor Point Hospital',
    from: 'keystone',
    to: 'cardinal',
    value: 86,
    fit: 'HIGH',
    rep: 'jordan',
    buyer: { name: 'Marcus Hale', first: 'Marcus', role: 'Director of Facilities', cares: 'Passing the spring accreditation survey with no findings.' },
    specialist: { name: 'Dana Ruiz', title: 'Healthcare Fire & Life Safety Lead, Cardinal' },
    history: 'Keystone has serviced Harbor Point’s HVAC since 2021. 4 rooftop units, chiller PM, 11 emergency calls answered in under an hour.',
    signal: 'Current fire protection contract renews in Q1. Accreditation survey due in the spring.',
    lookalikes: '7 hospitals in the Northfield base look like Harbor Point. 5 buy inspection and alarm testing from Cardinal.',
    playRule: 'Healthcare: the buyer is graded on survey findings. Sell survey readiness, not inspections.',
    why: [
      'Keystone has serviced their HVAC since 2021, so Marcus already trusts the relationship.',
      'Seven hospitals in our base look like Harbor Point. Five buy inspection and alarm testing from Cardinal.',
      'Their fire protection contract renews in Q1, ahead of the spring survey.',
    ],
    fallbackEmail: {
      subject: 'Spring survey and your fire protection renewal',
      body: `Hi Marcus,

With your accreditation survey coming up this spring and the fire protection contract renewing in Q1, I wanted to flag something before you rebid it.

Keystone is now part of Northfield, and our sister company Cardinal handles sprinkler inspection and alarm testing for five hospitals in the region. Their reports are built to hand straight to surveyors, which is where findings usually start.

Would you be open to a 20-minute call with Dana Ruiz, who leads their healthcare work? I'll join so it isn't a cold start.

Jordan`,
    },
  },
  {
    id: 'westgate',
    name: 'Westgate Distribution Center',
    from: 'ridgeline',
    to: 'keystone',
    value: 74,
    fit: 'HIGH',
    rep: 'sam',
    buyer: { name: 'Priya Nair', first: 'Priya', role: 'Operations Manager', cares: 'Throughput and keeping pick crews productive through summer.' },
    specialist: { name: 'Tom Becker', title: 'Industrial HVAC Manager, Keystone' },
    history: 'Ridgeline did the LED retrofit and dock electrical in 2023, plus ongoing service. Priya calls Sam directly.',
    signal: 'Rooftop units are 18 years old. Ridgeline techs noted heat complaints in the pick zones last July.',
    lookalikes: '12 warehouses in the base. 8 buy HVAC service from Keystone.',
    playRule: 'Industrial: tie the new service to throughput and uptime, not comfort.',
    why: [
      'Ridgeline has been on site since the 2023 retrofit, and Priya calls Sam directly.',
      'Their rooftop units are 18 years old, and our techs logged heat complaints in the pick zones.',
      'Eight of the twelve warehouses like Westgate already use Keystone for HVAC.',
    ],
    fallbackEmail: {
      subject: 'Heat in the pick zones before next summer',
      body: `Hi Priya,

When our crew was out last July, a few of your pickers mentioned how hot the zones near the dock doors get. With rooftop units that are 18 years old, that usually gets worse before it gets better, and it shows up in pick rates first.

Ridgeline is now part of Northfield, and Keystone, our HVAC company, services eight distribution centers in the area. Tom Becker runs their industrial work.

Would a 20-minute walk-through with Tom this month be worth it? I'll come along.

Sam`,
    },
  },
  {
    id: 'lakeview',
    name: 'Lakeview Unified School District',
    from: 'summit',
    to: 'keystone',
    value: 68,
    fit: 'MED',
    rep: 'alicia',
    buyer: { name: 'Ray Delgado', first: 'Ray', role: 'Director of Maintenance & Operations', cares: 'Getting bond-funded replacements done inside the summer window.' },
    specialist: { name: 'Tom Becker', title: 'HVAC Project Manager, Keystone' },
    history: 'Summit installed building automation at 9 Lakeview schools and monitors them remotely.',
    signal: 'The district passed a facilities bond. HVAC replacements at 4 schools go out to bid in the spring.',
    lookalikes: '6 districts in the base. 4 use Keystone for summer replacement projects.',
    playRule: 'Public buyers: speak to the bid calendar and the summer window. Never imply skipping procurement.',
    why: [
      'Summit runs the controls at nine Lakeview schools, so we already see how their systems perform.',
      'The new bond puts HVAC replacements at four schools out to bid this spring.',
      'Keystone has finished summer replacements for four similar districts.',
    ],
    fallbackEmail: {
      subject: 'Bond HVAC work and the summer window',
      body: `Hi Ray,

Congratulations on the bond passing. Since Summit monitors the controls at nine of your schools, we can see which units are closest to failing, and I'd be glad to share that before the specs go out.

Summit is now part of Northfield, and our HVAC company, Keystone, has finished summer replacements for four districts nearby. They plan around the bid calendar so work starts the day school lets out.

Would a 20-minute call with Tom Becker before the spring bid be useful? I'll join.

Alicia`,
    },
  },
  {
    id: 'crestline',
    name: 'Crestline Office Park',
    from: 'keystone',
    to: 'ridgeline',
    value: 61,
    fit: 'HIGH',
    rep: 'jordan',
    buyer: { name: 'Elena Brooks', first: 'Elena', role: 'Property Manager', cares: 'Tenant retention and renewals.' },
    specialist: { name: 'Kevin Marsh', title: 'Commercial Projects Lead, Ridgeline' },
    history: 'Keystone has the HVAC maintenance contract for all 3 buildings since 2022.',
    signal: 'Two anchor tenants asked about EV charging ahead of lease renewals.',
    lookalikes: '9 office parks in the base. 6 used Ridgeline for EV charging or lighting.',
    playRule: 'Property managers: frame the work around tenant renewals, not building upgrades.',
    why: [
      'Keystone has maintained HVAC across all three buildings since 2022.',
      'Two anchor tenants asked about EV charging ahead of their renewals.',
      'Six office parks like Crestline used Ridgeline for EV charging or lighting.',
    ],
    fallbackEmail: {
      subject: 'EV charging ahead of your tenant renewals',
      body: `Hi Elena,

Your team mentioned two anchor tenants asking about EV charging before they renew. That request tends to turn into a deciding factor quickly.

Keystone is now part of Northfield, and our electrical company, Ridgeline, has installed charging at six office parks in the area, usually without shutting down a parking deck.

Would a 20-minute call with Kevin Marsh be helpful, so you have real numbers before those renewal talks? I'll join.

Jordan`,
    },
  },
  {
    id: 'pinecrest',
    name: 'Pinecrest Senior Living',
    from: 'cardinal',
    to: 'keystone',
    value: 52,
    fit: 'MED',
    rep: 'mike',
    buyer: { name: 'Gloria Tate', first: 'Gloria', role: 'Executive Director', cares: 'Resident comfort and family satisfaction scores.' },
    specialist: { name: 'Tom Becker', title: 'HVAC Service Manager, Keystone' },
    history: 'Cardinal has done fire inspection and alarm testing at Pinecrest since 2019.',
    signal: 'Resident comfort complaints rose last summer. Families raised it in reviews.',
    lookalikes: '5 senior living communities in the base. 3 use Keystone for HVAC.',
    playRule: 'Senior living: the buyer answers to families. Lead with residents, not equipment.',
    why: [
      'Cardinal has inspected Pinecrest since 2019 and knows the building.',
      'Resident comfort complaints rose last summer and showed up in family reviews.',
      'Three senior living communities like Pinecrest use Keystone for HVAC.',
    ],
    fallbackEmail: {
      subject: 'Keeping residents comfortable next summer',
      body: `Hi Gloria,

I saw that comfort came up in a few family reviews after last summer. That's hard on residents and on your team.

Cardinal is now part of Northfield, and our HVAC company, Keystone, looks after three senior living communities nearby. They know how to schedule work around residents' routines.

Would a 20-minute call with Tom Becker be worth it before the weather turns? I'll be on it too.

Mike`,
    },
  },
];

export const baseline = {
  whitespace: 4.2, // $M
  fits: 318,
  intros: 214,
  meetings: 61,
  pipeline: 1.9, // $M
  revenueYtd: 612, // $K
  model: 780, // $K
};

export type Pair = { from: CompanyId; to: CompanyId; intros: number; meetings: number; quotes: number; closed: number; vsModel: number; stalled?: boolean };

export const pairs: Pair[] = [
  { from: 'keystone', to: 'ridgeline', intros: 58, meetings: 19, quotes: 11, closed: 188, vsModel: 12 },
  { from: 'keystone', to: 'cardinal', intros: 47, meetings: 14, quotes: 8, closed: 141, vsModel: -4 },
  { from: 'summit', to: 'keystone', intros: 39, meetings: 12, quotes: 6, closed: 117, vsModel: -9 },
  { from: 'ridgeline', to: 'keystone', intros: 41, meetings: 10, quotes: 5, closed: 96, vsModel: -18 },
  { from: 'summit', to: 'cardinal', intros: 29, meetings: 6, quotes: 1, closed: 70, vsModel: -41, stalled: true },
];

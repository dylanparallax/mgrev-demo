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
  buyer: { name: string; first: string; role: string; phone: string; cares: string };
  specialist: { name: string; title: string };
  history: string;
  signal: string;
  renewal: string;
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
    buyer: { name: 'Marcus Hale', first: 'Marcus', role: 'Director of Facilities', phone: '(410) 555-0142', cares: 'Passing the spring accreditation survey with no findings.' },
    specialist: { name: 'Dana Ruiz', title: 'Healthcare Fire & Life Safety Lead, Cardinal' },
    history: 'Keystone has serviced Harbor Point’s HVAC since 2021. 4 rooftop units, chiller PM, 11 emergency calls answered in under an hour.',
    signal: 'Current fire protection contract renews in Q1. Accreditation survey due in the spring.',
    renewal: 'Q1',
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
    buyer: { name: 'Priya Nair', first: 'Priya', role: 'Operations Manager', phone: '(443) 555-0176', cares: 'Throughput and keeping pick crews productive through summer.' },
    specialist: { name: 'Tom Becker', title: 'Industrial HVAC Manager, Keystone' },
    history: 'Ridgeline did the LED retrofit and dock electrical in 2023, plus ongoing service. Priya calls Sam directly.',
    signal: 'Rooftop units are 18 years old. Ridgeline techs noted heat complaints in the pick zones last July.',
    renewal: 'Before next summer',
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
    buyer: { name: 'Ray Delgado', first: 'Ray', role: 'Director of Maintenance & Operations', phone: '(410) 555-0190', cares: 'Getting bond-funded replacements done inside the summer window.' },
    specialist: { name: 'Tom Becker', title: 'HVAC Project Manager, Keystone' },
    history: 'Summit installed building automation at 9 Lakeview schools and monitors them remotely.',
    signal: 'The district passed a facilities bond. HVAC replacements at 4 schools go out to bid in the spring.',
    renewal: 'Spring bid',
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
    buyer: { name: 'Elena Brooks', first: 'Elena', role: 'Property Manager', phone: '(410) 555-0164', cares: 'Tenant retention and renewals.' },
    specialist: { name: 'Kevin Marsh', title: 'Commercial Projects Lead, Ridgeline' },
    history: 'Keystone has the HVAC maintenance contract for all 3 buildings since 2022.',
    signal: 'Two anchor tenants asked about EV charging ahead of lease renewals.',
    renewal: 'Tenant renewals',
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
    buyer: { name: 'Gloria Tate', first: 'Gloria', role: 'Executive Director', phone: '(443) 555-0133', cares: 'Resident comfort and family satisfaction scores.' },
    specialist: { name: 'Tom Becker', title: 'HVAC Service Manager, Keystone' },
    history: 'Cardinal has done fire inspection and alarm testing at Pinecrest since 2019.',
    signal: 'Resident comfort complaints rose last summer. Families raised it in reviews.',
    renewal: 'Before next summer',
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

// Extra plays on Jordan's list. Eight are already worked, so they are not open.
export type JordanPlay = {
  account: Account;
  workedOn?: string;
};

export const jordanQueue: JordanPlay[] = [
  {
    account: {
      id: 'ashland',
      name: 'Ashland Surgery Center',
      from: 'keystone',
      to: 'cardinal',
      value: 44,
      fit: 'HIGH',
      rep: 'jordan',
      buyer: { name: 'Nina Shah', first: 'Nina', role: 'Administrator', phone: '(410) 555-0188', cares: 'A clean accreditation visit and no surprises in the operating rooms.' },
      specialist: { name: 'Dana Ruiz', title: 'Healthcare Fire & Life Safety Lead, Cardinal' },
      history: 'Keystone has maintained the surgery center’s HVAC since 2022, including the operating-room air handlers.',
      signal: 'Their fire inspection contract ends in Q2, six weeks before the accreditation visit.',
      renewal: 'Q2',
      lookalikes: '4 outpatient centers in the base. 3 buy inspection and alarm testing from Cardinal.',
      playRule: 'Outpatient surgery: the buyer is graded on the visit. Sell a report the surveyor can read, not a stack of tickets.',
      why: [
        'Keystone is already in the operating rooms, so Nina knows the crew.',
        'Three similar centers buy inspection and alarm testing from Cardinal.',
        'The fire contract ends in Q2, before the accreditation visit.',
      ],
      fallbackEmail: {
        subject: 'Fire inspection before your accreditation visit',
        body: `Hi Nina,

Your fire inspection contract ends in Q2, and the accreditation visit is six weeks after that. The last thing you want is a report the surveyor has to decode.

Keystone is now part of Northfield, and Cardinal handles inspection and alarm testing for three surgery centers nearby. Their reports are written for the visit, not for the file cabinet.

Would a 20-minute call with Dana Ruiz be useful before you rebid it? I'll join.

Jordan`,
      },
    },
  },
  {
    account: {
      id: 'tidewater',
      name: 'Tidewater Apartments',
      from: 'keystone',
      to: 'ridgeline',
      value: 29,
      fit: 'MED',
      rep: 'jordan',
      buyer: { name: 'Chris Lang', first: 'Chris', role: 'Regional Property Manager', phone: '(443) 555-0160', cares: 'Spring leasing and keeping the garage from becoming a complaint.' },
      specialist: { name: 'Kevin Marsh', title: 'Commercial Projects Lead, Ridgeline' },
      history: 'Keystone has the HVAC contract for both Tidewater buildings, including the garage exhaust fans.',
      signal: 'Residents asked for EV charging in the garage ahead of spring leasing.',
      renewal: 'Spring leasing',
      lookalikes: '6 apartment communities in the base. 4 used Ridgeline for garage charging or lighting.',
      playRule: 'Multifamily: tie the work to leasing season, not to a technology upgrade.',
      why: [
        'Keystone already services both buildings, including the garage fans.',
        'Residents asked for charging before spring leasing starts.',
        'Four similar communities used Ridgeline for the garage.',
      ],
      fallbackEmail: {
        subject: 'Garage charging before spring leasing',
        body: `Hi Chris,

A few residents asked about EV charging in the garage. That question tends to show up on tours once leasing season starts.

Keystone is now part of Northfield, and Ridgeline has put charging into four apartment garages nearby, usually without closing the deck.

Would a 20-minute call with Kevin Marsh be worth it so you have a number before the tours pick up? I'll join.

Jordan`,
      },
    },
  },
  {
    account: {
      id: 'st-brigid',
      name: 'St. Brigid Clinic',
      from: 'keystone',
      to: 'cardinal',
      value: 39,
      fit: 'HIGH',
      rep: 'jordan',
      buyer: { name: 'Helen Cho', first: 'Helen', role: 'Practice Manager', phone: '(410) 555-0119', cares: 'Keeping the clinic open on inspection day.' },
      specialist: { name: 'Dana Ruiz', title: 'Healthcare Fire & Life Safety Lead, Cardinal' },
      history: 'Keystone has serviced the clinic’s rooftop units since 2020. Helen calls Jordan directly when a room runs warm.',
      signal: 'Sprinkler inspection is due in March. Their current vendor is two counties away and has missed a window before.',
      renewal: 'March',
      lookalikes: '5 clinics in the base. 4 buy sprinkler inspection from Cardinal.',
      playRule: 'Clinics: the cost of a missed inspection is a closed morning, not a fine.',
      why: [
        'Helen already calls Jordan when a room runs warm.',
        'The sprinkler inspection is due in March, and the current vendor has missed a window.',
        'Four clinics like St. Brigid use Cardinal.',
      ],
      fallbackEmail: {
        subject: 'March sprinkler inspection',
        body: `Hi Helen,

Your sprinkler inspection is due in March. The vendor you have now is two counties away, and they have missed a window here before. A missed morning is harder on the clinic than the inspection itself.

Cardinal, our sister company, does this for four clinics nearby and schedules around patient hours.

Would a 20-minute call with Dana Ruiz this month be useful? I'll be on it.

Jordan`,
      },
    },
    workedOn: '2026-11-24',
  },
  {
    account: {
      id: 'fieldstone',
      name: 'Fieldstone Mall',
      from: 'keystone',
      to: 'ridgeline',
      value: 36,
      fit: 'MED',
      rep: 'jordan',
      buyer: { name: 'Andre Walsh', first: 'Andre', role: 'General Manager', phone: '(410) 555-0171', cares: 'Common areas that look kept up for holiday traffic.' },
      specialist: { name: 'Kevin Marsh', title: 'Commercial Projects Lead, Ridgeline' },
      history: 'Keystone maintains the mall’s rooftop units and the food-court exhaust.',
      signal: 'The common-area lighting contract ends in January.',
      renewal: 'January',
      lookalikes: '3 malls in the base. 2 used Ridgeline when the lighting contract turned over.',
      playRule: 'Retail: talk about the floor looking right for traffic, not about fixtures.',
      why: [
        'Keystone is already on the roof and in the food court.',
        'The common-area lighting contract ends in January.',
        'Two malls like Fieldstone moved that work to Ridgeline at renewal.',
      ],
      fallbackEmail: {
        subject: 'Common-area lighting before January',
        body: `Hi Andre,

The lighting contract for the common areas ends in January. That is a bad month to be rebidding if a section of the concourse goes dark over the holidays.

Ridgeline, part of Northfield with Keystone, took that work over at two malls nearby and did it in overnight shifts.

Would a 20-minute call with Kevin Marsh be useful before you send the bid out? I'll join.

Jordan`,
      },
    },
    workedOn: '2026-11-21',
  },
  {
    account: {
      id: 'brookside',
      name: 'Brookside Medical Plaza',
      from: 'keystone',
      to: 'cardinal',
      value: 42,
      fit: 'HIGH',
      rep: 'jordan',
      buyer: { name: 'Ruth Keller', first: 'Ruth', role: 'Building Manager', phone: '(410) 555-0148', cares: 'A survey report the practices upstairs will not argue with.' },
      specialist: { name: 'Dana Ruiz', title: 'Healthcare Fire & Life Safety Lead, Cardinal' },
      history: 'Keystone has the HVAC contract for the plaza, four tenant practices plus the lobby.',
      signal: 'Alarm testing renews in Q1. Surveyors marked up the last vendor’s report.',
      renewal: 'Q1',
      lookalikes: '8 medical plazas in the base. 5 use Cardinal for alarm testing.',
      playRule: 'Multi-tenant medical: the building manager is stuck between the surveyor and the practices. Give her one report.',
      why: [
        'Keystone already covers the four practices and the lobby.',
        'Alarm testing renews in Q1, and the last report was marked up by surveyors.',
        'Five medical plazas like Brookside use Cardinal for that test.',
      ],
      fallbackEmail: {
        subject: 'Alarm testing before the Q1 renewal',
        body: `Hi Ruth,

Your alarm testing renews in Q1, and the surveyors marked up the last report. That puts you between the survey and the practices upstairs.

Cardinal writes the test so a surveyor can follow it. They already do that for five medical plazas in the area.

Would a 20-minute call with Dana Ruiz be worth it before you renew? I'll join so it is not a cold start.

Jordan`,
      },
    },
    workedOn: '2026-11-20',
  },
  {
    account: {
      id: 'hampstead',
      name: 'Hampstead Courthouse',
      from: 'keystone',
      to: 'summit',
      value: 33,
      fit: 'MED',
      rep: 'jordan',
      buyer: { name: 'Owen Briggs', first: 'Owen', role: 'County Facilities Director', phone: '(410) 555-0194', cares: 'Courtrooms that hold temperature on trial days.' },
      specialist: { name: 'Nora Pell', title: 'Building Controls Lead, Summit' },
      history: 'Keystone replaced two air handlers in 2023 and still holds the service contract.',
      signal: 'The building controls contract is up this summer. Courtrooms run hot on trial days.',
      renewal: 'This summer',
      lookalikes: '2 county buildings in the base. Both use Summit on top of Keystone equipment.',
      playRule: 'Civic buildings: the buyer answers to a calendar, not a comfort complaint. Name the trial day.',
      why: [
        'Keystone put in the air handlers and still services them.',
        'Courtrooms run hot on trial days, and the controls contract is up this summer.',
        'Both county buildings like this one already stack Summit on Keystone equipment.',
      ],
      fallbackEmail: {
        subject: 'Courtroom controls before the summer contract',
        body: `Hi Owen,

The controls contract is up this summer, and the courtrooms still run hot on trial days. The equipment is fine. The controls are what lose the afternoon.

Summit, our controls company, sits on top of Keystone equipment in both county buildings we already serve.

Would a 20-minute call with Nora Pell before you write the summer spec be useful? I'll join.

Jordan`,
      },
    },
    workedOn: '2026-11-19',
  },
  {
    account: {
      id: 'camden-row',
      name: 'Camden Row Offices',
      from: 'keystone',
      to: 'ridgeline',
      value: 38,
      fit: 'HIGH',
      rep: 'jordan',
      buyer: { name: 'Lena Cho', first: 'Lena', role: 'Asset Manager', phone: '(443) 555-0127', cares: 'Q2 tenant renewals and a garage tenants will actually use.' },
      specialist: { name: 'Kevin Marsh', title: 'Commercial Projects Lead, Ridgeline' },
      history: 'Keystone has maintained all three Camden Row buildings since 2021.',
      signal: 'Two tenants asked about garage lighting and EV stalls ahead of Q2 renewals.',
      renewal: 'Q2 renewals',
      lookalikes: '9 office parks in the base. 6 used Ridgeline for garage lighting or charging.',
      playRule: 'Offices: the asset manager is protecting the renewal, not buying a garage project.',
      why: [
        'Keystone has been in all three buildings since 2021.',
        'Two tenants asked about the garage before their Q2 renewals.',
        'Six office parks like Camden Row used Ridgeline for the garage.',
      ],
      fallbackEmail: {
        subject: 'Garage lighting before the Q2 renewals',
        body: `Hi Lena,

Two tenants asked about garage lighting and charging before they renew in Q2. That request usually becomes a condition, not a suggestion.

Ridgeline has done the garage at six office parks nearby, and Keystone is already in your buildings, so this would not start from zero.

Would a 20-minute call with Kevin Marsh give you a number before those talks? I'll join.

Jordan`,
      },
    },
    workedOn: '2026-11-18',
  },
  {
    account: {
      id: 'severn',
      name: 'Severn Middle School',
      from: 'keystone',
      to: 'summit',
      value: 22,
      fit: 'MED',
      rep: 'jordan',
      buyer: { name: 'Pat Morales', first: 'Pat', role: 'Principal', phone: '(410) 555-0155', cares: 'Classrooms that stay comfortable after spring break, without a change order.' },
      specialist: { name: 'Nora Pell', title: 'Building Controls Lead, Summit' },
      history: 'Keystone services the school’s rooftop units and has been on the roof every fall since 2019.',
      signal: 'The board put classroom controls out to bid for work after spring break.',
      renewal: 'After spring break',
      lookalikes: '4 schools in the base. 3 added Summit controls onto Keystone units.',
      playRule: 'Schools: speak to the break calendar. Do not imply the bid can be skipped.',
      why: [
        'Keystone has been on this roof every fall since 2019.',
        'Classroom controls go out to bid for work after spring break.',
        'Three schools like Severn added Summit on top of Keystone units.',
      ],
      fallbackEmail: {
        subject: 'Classroom controls after spring break',
        body: `Hi Pat,

The board is bidding classroom controls for work after spring break. The rooftop units are already ours, so the bid is really about whether the rooms hold temperature once the controls change.

Summit has done that pairing at three schools nearby, planned around the break so class is not the test.

Would a 20-minute call with Nora Pell before the spec is final be useful? I'll join.

Jordan`,
      },
    },
    workedOn: '2026-11-17',
  },
  {
    account: {
      id: 'patapsco',
      name: 'Patapsco Cold Storage',
      from: 'keystone',
      to: 'cardinal',
      value: 51,
      fit: 'HIGH',
      rep: 'jordan',
      buyer: { name: 'Victor Ruiz', first: 'Victor', role: 'Plant Manager', phone: '(410) 555-0136', cares: 'A fire pump that passes in April without shutting a dock.' },
      specialist: { name: 'Evan Cole', title: 'Inspection Lead, Cardinal' },
      history: 'Keystone maintains the refrigeration and the dock-door air curtains. Victor has Jordan’s cell number.',
      signal: 'The fire pump inspection is due in April. The last vendor missed two monthly tests.',
      renewal: 'April',
      lookalikes: '3 cold storage sites in the base. All three use Cardinal for the pump inspection.',
      playRule: 'Cold storage: a missed pump test risks the product, not just the citation. Say that plainly.',
      why: [
        'Victor already has Jordan’s number for the refrigeration.',
        'The fire pump inspection is due in April, and the current vendor missed two monthly tests.',
        'Every cold storage site like this one uses Cardinal for that inspection.',
      ],
      fallbackEmail: {
        subject: 'Fire pump inspection in April',
        body: `Hi Victor,

The fire pump inspection is due in April, and the vendor you have now missed two monthly tests. At a cold storage site that is not a paperwork problem. It is the product.

Cardinal inspects the pump at the three cold storage sites we know like yours, and they schedule it so a dock does not sit idle.

Would a 20-minute call with Evan Cole be worth it before April? I'll join.

Jordan`,
      },
    },
    workedOn: '2026-11-14',
  },
  {
    account: {
      id: 'hollins',
      name: 'Hollins Medical Arts',
      from: 'keystone',
      to: 'ridgeline',
      value: 31,
      fit: 'HIGH',
      rep: 'jordan',
      buyer: { name: 'Samira Adeyemi', first: 'Samira', role: 'Office Manager', phone: '(443) 555-0182', cares: 'A generator that starts if the building loses power during clinic hours.' },
      specialist: { name: 'Kevin Marsh', title: 'Commercial Projects Lead, Ridgeline' },
      history: 'Keystone has the HVAC contract for the building. The generator is on the same roof and is not on that contract.',
      signal: 'The generator service contract ends in February. It failed a monthly test in October.',
      renewal: 'February',
      lookalikes: '6 medical office buildings in the base. 4 use Ridgeline for generator service.',
      playRule: 'Medical offices: lead with the failed test, not with a service menu.',
      why: [
        'Keystone is already on the roof. The generator sits next to equipment they service.',
        'The generator contract ends in February, after a failed test in October.',
        'Four medical office buildings like Hollins use Ridgeline for the generator.',
      ],
      fallbackEmail: {
        subject: 'Generator contract ending in February',
        body: `Hi Samira,

The generator failed its October test, and the service contract ends in February. If the building loses power on a clinic day, that is the machine that has to start.

Ridgeline services the generator at four medical office buildings nearby. Keystone is already on your roof, so we are not introducing a stranger.

Would a 20-minute call with Kevin Marsh before February be useful? I'll join.

Jordan`,
      },
    },
    workedOn: '2026-11-13',
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

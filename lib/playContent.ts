// Hard-coded Harbor Point play, from mgrev-demo-play-harbor-point.md.
// Presenter notes stay out of the UI. The brand comparison is off until Geoff and Lou want it.

import { companies, reps, type Account } from './data';

export const SHOW_BRAND_TOGGLE = false;

export type MotionId = 'cross-sell' | 'upsell' | 'new-logo' | 'retention';

export type Motion = {
  id: MotionId;
  label: string;
  playsRun: number;
  revenueK: number;
  modelK: number;
  blurb: string;
};

export const motions: Motion[] = [
  {
    id: 'cross-sell',
    label: 'Cross-sell',
    playsRun: 214,
    revenueK: 612,
    modelK: 780,
    blurb: 'A customer of one Northfield company fits what another company sells.',
  },
  {
    id: 'upsell',
    label: 'Upsell',
    playsRun: 36,
    revenueK: 148,
    modelK: 320,
    blurb: 'Expand the contract already on the building.',
  },
  {
    id: 'new-logo',
    label: 'New logo',
    playsRun: 11,
    revenueK: 54,
    modelK: 260,
    blurb: 'Named accounts with no Northfield company on site yet.',
  },
  {
    id: 'retention',
    label: 'Retention',
    playsRun: 48,
    revenueK: 390,
    modelK: 410,
    blurb: 'Renewals inside the next two quarters.',
  },
];

export type PreviewPlay = {
  name: string;
  detail: string;
  value: number;
  fit: 'HIGH' | 'MED';
};

export const previewPlays: Record<Exclude<MotionId, 'cross-sell'>, PreviewPlay[]> = {
  upsell: [
    { name: 'Meridian Clinic', detail: 'Keystone service expansion', value: 28, fit: 'MED' },
    { name: 'Lantern Hotels', detail: 'Ridgeline lighting add-on', value: 19, fit: 'MED' },
  ],
  'new-logo': [
    { name: 'Halpern Surgical Center', detail: 'Cardinal, no company on site', value: 64, fit: 'HIGH' },
    { name: 'North Pier Warehouse', detail: 'Keystone, no company on site', value: 47, fit: 'MED' },
  ],
  retention: [
    { name: 'Cedar Ridge Apartments', detail: 'Keystone renewal', value: 33, fit: 'HIGH' },
    { name: 'Vale Medical Offices', detail: 'Cardinal renewal', value: 22, fit: 'MED' },
  ],
};

export type PlayTabId = 'brief' | 'email' | 'call' | 'objections' | 'battle' | 'contacts';

export const PLAY_TABS: { id: PlayTabId; label: string }[] = [
  { id: 'brief', label: 'Prospect Brief' },
  { id: 'email', label: 'Outreach Email' },
  { id: 'call', label: 'Call Prep' },
  { id: 'objections', label: 'Objection Handling' },
  { id: 'battle', label: 'Competitors & Battlecards' },
  { id: 'contacts', label: 'Key Contacts' },
];

export type PlayContent = {
  kicker: { account: string; value: string; fit: string; renewal: string };
  points: { lead: string; text: string }[];
  dealIncludes: string;
  brandedEmail: { subject: string; body: string };
  genericEmail: { subject: string; body: string };
  call: { heading: string; body?: string; items?: string[]; ordered?: boolean }[];
  objections: { objection: string; response: string }[];
  incumbent: string;
  battleColumns: [string, string];
  battleRows: { topic: string; incumbent: string; northfield: string }[];
  battleNotes: { label: string; text: string }[];
  contactGroups: { heading: string; columns: string[]; rows: { name: string; role: string; cells: string[] }[] }[];
};

const harborPoint: PlayContent = {
  kicker: {
    account: 'Harbor Point Hospital',
    value: '$86K',
    fit: 'High',
    renewal: 'Q1',
  },
  points: [
    {
      lead: 'The relationship is already there.',
      text: 'Keystone has serviced Harbor Point\'s HVAC since 2021. Marcus Hale (Director of Facilities) knows Jordan and trusts the crew.',
    },
    {
      lead: 'The pattern says yes.',
      text: 'Seven hospitals in the Northfield base look like Harbor Point. Five already buy inspection and alarm testing from Cardinal.',
    },
    {
      lead: 'The timing is right.',
      text: 'Their current fire protection contract renews in Q1.',
    },
    {
      lead: 'The gap only Northfield can close.',
      text: 'Fire and smoke dampers sit inside the HVAC system but are a life safety requirement. Hospitals often find that their HVAC contractor assumes the fire contractor tests them, and the fire contractor assumes the opposite. Keystone is already in their ductwork. Cardinal already does their kind of inspection. Together, the gap disappears.',
    },
  ],
  dealIncludes:
    'What the deal includes (illustrative): sprinkler inspection and testing, fire alarm testing, fire and smoke damper inspection, annual fire door inspection.',
  brandedEmail: {
    subject: 'Harbor Point: closing a gap between our two teams',
    body: `Hi Marcus,

Quick one. When we're up in your ductwork for HVAC service, we see the fire and smoke dampers every visit. In a lot of hospitals, nobody owns those clearly: the HVAC contractor assumes the fire contractor is testing them, and the fire contractor assumes the reverse. It tends to show up during a survey.

Since Keystone joined Northfield, we have a fire protection team, Cardinal, that does inspection and testing for five hospitals in the region. Between us we could cover the HVAC, the dampers, and the fire and life safety testing on one schedule, with one set of records for your surveyors.

Your fire contract comes up in Q1, so the timing might be useful. Would you be open to 20 minutes with Dana Ruiz from Cardinal next week? I'll join so it isn't a cold start.

Jordan`,
  },
  genericEmail: {
    subject: '',
    body: `Hi Marcus,

I hope you're doing well! I wanted to let you know that Keystone is now part of Northfield Services Group, which also includes Cardinal Fire Protection. Cardinal offers a full range of fire protection services, including sprinkler inspections and alarm testing.

Would you be interested in learning more? I'd be happy to set up a call.

Best,
Jordan`,
  },
  call: [
    {
      heading: 'Opener (Jordan, first 30 seconds):',
      body: "Marcus, thanks for the time. I asked Dana to join because of something we keep seeing in your building. Our techs are in your ductwork every quarter, and the dampers up there sit between our world and the fire world. I wanted you to hear from Dana how Cardinal handles that at other hospitals.",
    },
    {
      heading: 'Discovery questions (Dana leads):',
      ordered: true,
      items: [
        'Who tests your fire and smoke dampers today, and when was the last round?',
        'How did your last Joint Commission or state survey go on the life safety side?',
        'How many contractors touch life safety in this building, and who pulls their records together before a survey?',
        'What would you change about your current fire contractor if the Q1 renewal were a clean slate?',
      ],
    },
    {
      heading: 'The one story to tell:',
      body: "A hospital of similar size had separate HVAC and fire contractors. Their damper testing fell through the gap for a full cycle, and it surfaced as a finding during a survey. After consolidating under Northfield, the same team that services the air handlers coordinates damper testing with Cardinal's alarm and sprinkler work, and the facilities director gets one binder before every survey.",
    },
    {
      heading: 'Ask to close the call:',
      body: 'a free walkthrough of their life safety records with Dana, before the Q1 renewal decision.',
    },
    {
      heading: 'Send after the call:',
      items: [
        'One-page case summary of the damper-gap story above',
        'Sample survey-ready records binder',
        'Northfield one-pager: "One team accountable for the whole building"',
        'Cardinal credentials: certified inspectors, response times, coverage map',
      ],
    },
  ],
  objections: [
    {
      objection: "We're happy with our current fire contractor.",
      response:
        "Good, then this isn't about replacing them for the sake of it. The question is whether anyone owns the dampers and the handoffs. A walkthrough of your records answers that either way.",
    },
    {
      objection: 'Putting everything with one company feels risky.',
      response:
        "Fair. You'd still have specialist teams; Cardinal's techs are fire people, Keystone's are HVAC people. What changes is one point of accountability and one set of records. And you already know how Keystone performs.",
    },
    {
      objection: "We're locked in until the contract ends.",
      response:
        "That's why Q1 matters. Use the walkthrough now so you have a real comparison when the renewal decision comes up.",
    },
  ],
  incumbent: 'Likely incumbent: a national fire protection provider on a multi-year contract.',
  battleColumns: ['National incumbent', 'Northfield (Cardinal + Keystone)'],
  battleRows: [
    { topic: 'Fire inspection and testing', incumbent: 'Yes', northfield: 'Yes' },
    { topic: "Knows the building's HVAC", incumbent: 'No', northfield: 'Keystone has serviced it since 2021' },
    { topic: 'Covers the damper gap', incumbent: 'Rarely owns it', northfield: 'Owned end to end' },
    { topic: 'Records for surveyors', incumbent: 'Fire only', northfield: 'Fire, life safety, and HVAC in one set' },
    { topic: 'Who shows up', incumbent: 'Rotating techs', northfield: 'Local crews who know the site' },
    { topic: 'Scheduling', incumbent: 'Separate from HVAC', northfield: 'Coordinated with existing Keystone visits' },
  ],
  battleNotes: [
    {
      label: 'How we win:',
      text: "Don't compete on price or on fire capability alone. Compete on the gap. The incumbent can't offer coordination with an HVAC team it doesn't have.",
    },
    {
      label: 'How we lose:',
      text: 'If this becomes a line-item price comparison on sprinkler inspections. Steer back to total risk and total coordination.',
    },
    {
      label: 'Landmine to set:',
      text: '"When your last damper testing happened, who coordinated access with the HVAC side?"',
    },
  ],
  contactGroups: [
    {
      heading: 'At Harbor Point',
      columns: ['Contact', 'Role in the deal', 'Relationship', 'How to engage'],
      rows: [
        {
          name: 'Marcus Hale',
          role: 'Director of Facilities',
          cells: [
            'Champion and day-to-day owner',
            'Strong. Keystone customer since 2021',
            'Jordan leads. Open with the damper gap.',
          ],
        },
        {
          name: 'Renee Okafor',
          role: 'Safety Officer',
          cells: [
            'Owns survey readiness; feels the life safety risk most',
            'None yet',
            'Ask Marcus to bring her to the records walkthrough.',
          ],
        },
        {
          name: 'Tom Brandt',
          role: 'VP of Support Services',
          cells: [
            'Economic buyer; signs the Q1 renewal',
            'None yet',
            'Reach through Marcus. Lead with one accountable vendor and fewer contracts.',
          ],
        },
      ],
    },
    {
      heading: 'On the Northfield side',
      columns: ['Contact', 'Role', 'Note'],
      rows: [
        {
          name: 'Jordan',
          role: 'Keystone account manager',
          cells: ['Originating rep, relationship owner', 'Credited on anything Cardinal closes here.'],
        },
        {
          name: 'Dana Ruiz',
          role: 'Cardinal Fire',
          cells: ['Fire and life safety specialist', 'Leads discovery and the records walkthrough.'],
        },
      ],
    },
  ],
};

function fallbackPlay(account: Account): PlayContent {
  const from = companies[account.from];
  const to = companies[account.to];
  const rep = reps[account.rep];
  return {
    kicker: {
      account: account.name,
      value: `$${account.value}K`,
      fit: account.fit === 'HIGH' ? 'High' : 'Med',
      renewal: 'See signal',
    },
    points: account.why.map((text) => ({ lead: '', text })),
    dealIncludes: account.playRule,
    brandedEmail: account.fallbackEmail,
    genericEmail: {
      subject: '',
      body: `Hi ${account.buyer.first},\n\nI hope you're doing well! I wanted to let you know that ${from.name} is now part of Northfield Services Group, which also includes ${to.full}.\n\nWould you be interested in learning more? I'd be happy to set up a call.\n\nBest,\n${rep.first}`,
    },
    call: [
      { heading: 'Opener:', body: account.history },
      { heading: 'What to listen for:', body: account.signal },
      {
        heading: 'Ask to close the call:',
        body: `A 20-minute call with ${account.specialist.name}, ${account.specialist.title}. ${rep.first} stays on the call.`,
      },
    ],
    objections: [
      {
        objection: 'We already have someone for that.',
        response: account.signal,
      },
    ],
    incumbent: account.lookalikes,
    battleColumns: ['Current setup', `${to.name} with ${from.name}`],
    battleRows: [
      { topic: 'Relationship', incumbent: 'Not on site with us', northfield: account.history },
      { topic: 'Timing', incumbent: 'Status quo', northfield: account.signal },
    ],
    battleNotes: [{ label: 'How we win:', text: account.playRule }],
    contactGroups: [
      {
        heading: account.name,
        columns: ['Contact', 'Role', 'Note'],
        rows: [
          {
            name: account.buyer.name,
            role: account.buyer.role,
            cells: ['Buyer', account.buyer.cares],
          },
          {
            name: account.specialist.name,
            role: to.name,
            cells: [account.specialist.title, `${rep.first} makes the introduction.`],
          },
        ],
      },
    ],
  };
}

export function playFor(account: Account): PlayContent {
  if (account.id === 'harbor-point') return harborPoint;
  return fallbackPlay(account);
}

export function accountMotionLine(account: Account) {
  const from = companies[account.from];
  const to = companies[account.to];
  return `${from.name} customer → ${to.name} ${to.trade}`;
}

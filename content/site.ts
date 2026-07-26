/**
 * Synthetic content fixtures for the Novagait demo.
 * Everything here is invented: providers, locations, phone numbers, hours.
 * Rule (docs/SPEC.md): no realistic PHI shapes, no real clinic data.
 */

export const clinic = {
  name: "Novagait Physical Therapy",
  tagline: "A stronger stride starts here.",
  phone: "(555) 010-4820",
  disclaimer:
    'Demonstration project by Lotus Innovations. "Novagait" is a fictional brand; all data is synthetic. Not affiliated with any real clinic or entity.',
};

export type Service = {
  slug: string;
  name: string;
  summary: string;
  detail: string;
  goodFor: string[];
};

export const services: Service[] = [
  {
    slug: "orthopedic-rehab",
    name: "Orthopedic rehabilitation",
    summary:
      "Recover strength and range of motion after injury to bones, joints, or muscles.",
    detail:
      "Your first visit is a movement evaluation, not a lecture. We measure what your joints and muscles can do today, agree on what you want them to do again, and build the plan backward from that goal. Most orthopedic plans mix hands-on treatment with progressive loading you continue at home.",
    goodFor: [
      "Back and neck pain",
      "Shoulder, hip, and knee injuries",
      "Arthritis and joint stiffness",
    ],
  },
  {
    slug: "post-surgical",
    name: "Post-surgical recovery",
    summary:
      "Structured rehabilitation after joint replacement, ligament repair, and other procedures.",
    detail:
      "We coordinate with your surgeon's protocol and progress you through each phase on evidence, not on the calendar alone. You always know which milestone you are working toward and what clears you for the next one.",
    goodFor: [
      "Knee and hip replacement",
      "ACL and rotator cuff repair",
      "Spinal surgery recovery",
    ],
  },
  {
    slug: "balance-falls",
    name: "Balance and fall prevention",
    summary:
      "Reduce fall risk and rebuild confidence on stairs, curbs, and uneven ground.",
    detail:
      "Falls are predictable and largely preventable. We test the systems that keep you upright: strength, vision-vestibular coordination, and reaction time, then train the weak links with graded, safe challenges.",
    goodFor: [
      "A recent fall or near-miss",
      "Dizziness and vertigo",
      "Neuropathy-related unsteadiness",
    ],
  },
  {
    slug: "sports-injury",
    name: "Sports injury care",
    summary:
      "Return to your sport with a plan built around your event, position, and season.",
    detail:
      "Rest alone rarely fixes a sports injury. We find the capacity gap that caused it, restore it past pre-injury baseline, and retest against sport-specific demands before you return to play.",
    goodFor: [
      "Sprains, strains, and overuse injuries",
      "Return-to-play testing",
      "Load and training-error review",
    ],
  },
  {
    slug: "gait-running",
    name: "Gait and running analysis",
    summary:
      "Video-based analysis of how you walk or run, with a corrective program to match.",
    detail:
      "Our namesake service. We record your walk or run, break the cycle down frame by frame, and show you exactly where force is going astray. You leave with two or three cues that matter, not twenty.",
    goodFor: [
      "Recurring running injuries",
      "Post-stroke or post-injury gait changes",
      "Orthotic and footwear decisions",
    ],
  },
  {
    slug: "pelvic-health",
    name: "Pelvic health",
    summary:
      "Specialist care for pelvic pain, incontinence, and pregnancy-related conditions.",
    detail:
      "Private, unhurried appointments with a therapist who specializes in pelvic health. Treatment is always explained first and consent-driven throughout.",
    goodFor: [
      "Pregnancy and postpartum recovery",
      "Incontinence and urgency",
      "Pelvic pain",
    ],
  },
];

export type Provider = {
  slug: string;
  name: string;
  credentials: string;
  role: string;
  focus: string[];
  bio: string;
  initials: string;
};

export const providers: Provider[] = [
  {
    slug: "maren-oduya",
    name: "Maren Oduya",
    credentials: "PT, DPT, OCS",
    role: "Clinic director · Crescent Park",
    focus: ["Orthopedics", "Post-surgical"],
    bio: "Maren has led outpatient orthopedic programs for 14 years and still keeps a full patient schedule. Her rule for every plan: the patient should be able to explain it back in one sentence.",
    initials: "MO",
  },
  {
    slug: "daniel-reyes-vogel",
    name: "Daniel Reyes-Vogel",
    credentials: "PT, DPT, CSCS",
    role: "Lead therapist · Eastbrook",
    focus: ["Sports injury", "Running analysis"],
    bio: "A former collegiate middle-distance runner, Daniel runs the gait lab and the return-to-play program. He has watched more slow-motion footfalls than anyone should admit to.",
    initials: "DR",
  },
  {
    slug: "priya-natarajan",
    name: "Priya Natarajan",
    credentials: "PT, DPT, NCS",
    role: "Neurologic specialist · Crescent Park",
    focus: ["Balance", "Neurologic rehab"],
    bio: "Priya is board-certified in neurologic physical therapy and leads the fall-prevention track. Her sessions are famous for being hard work that somehow feels like a good day.",
    initials: "PN",
  },
  {
    slug: "sofia-lindqvist",
    name: "Sofia Lindqvist",
    credentials: "PT, DPT, WCS",
    role: "Pelvic health lead · Harborline",
    focus: ["Pelvic health", "Pre/postnatal"],
    bio: "Sofia built our pelvic health service from a single treatment room into a full program. Every appointment is private, explained, and paced by the patient.",
    initials: "SL",
  },
  {
    slug: "jonas-akintola",
    name: "Jonas Akintola",
    credentials: "PT, DPT, GCS",
    role: "Geriatric specialist · Eastbrook",
    focus: ["Balance", "Healthy aging"],
    bio: "Jonas specializes in keeping people in their seventies, eighties, and nineties doing the things they refuse to give up. He considers a returned bus pass a treatment failure.",
    initials: "JA",
  },
  {
    slug: "hana-tsukamoto",
    name: "Hana Tsukamoto",
    credentials: "PT, DPT, OCS",
    role: "Staff therapist · Harborline",
    focus: ["Orthopedics", "Manual therapy"],
    bio: "Hana pairs precise manual therapy with a stopwatch-honest exercise progression. Patients describe her as gentle and completely unwilling to skip a rep.",
    initials: "HT",
  },
];

export type Location = {
  slug: string;
  name: string;
  address: string[];
  phone: string;
  hours: { days: string; open: string }[];
  access: string[];
};

export const locations: Location[] = [
  {
    slug: "crescent-park",
    name: "Crescent Park",
    address: ["100 Demonstration Way, Suite 210", "Crescent Park, CA 90000"],
    phone: "(555) 010-4821",
    hours: [
      { days: "Monday to Thursday", open: "7:00 am – 7:00 pm" },
      { days: "Friday", open: "7:00 am – 5:00 pm" },
      { days: "Saturday", open: "8:00 am – 12:00 pm" },
      { days: "Sunday", open: "Closed" },
    ],
    access: [
      "Step-free entrance on Demonstration Way",
      "Accessible parking in the attached garage, level 2",
      "Two blocks from the Crescent Park transit center",
    ],
  },
  {
    slug: "eastbrook",
    name: "Eastbrook",
    address: ["48 Sample Boulevard", "Eastbrook, CA 90001"],
    phone: "(555) 010-4822",
    hours: [
      { days: "Monday to Friday", open: "6:30 am – 6:30 pm" },
      { days: "Saturday and Sunday", open: "Closed" },
    ],
    access: [
      "Ground-floor clinic, no stairs",
      "Free surface parking with four accessible spaces",
      "Bus routes 12 and 40 stop at the door",
    ],
  },
  {
    slug: "harborline",
    name: "Harborline",
    address: ["7 Placeholder Pier, Building C", "Harborline, CA 90002"],
    phone: "(555) 010-4823",
    hours: [
      { days: "Monday, Wednesday, Friday", open: "7:00 am – 6:00 pm" },
      { days: "Tuesday and Thursday", open: "9:00 am – 7:00 pm" },
      { days: "Saturday and Sunday", open: "Closed" },
    ],
    access: [
      "Elevator access from the pier-level lobby",
      "Drop-off zone directly outside Building C",
      "Water-taxi accessible dock 40 meters away",
    ],
  },
];

/** The four-step care journey: a genuine sequence, used with numbering. */
export const journey = [
  {
    step: "Evaluate",
    text: "A 60-minute first visit: your story, a movement exam, and honest answers about what is going on.",
  },
  {
    step: "Plan",
    text: "A written plan with a goal you chose, the milestones between here and there, and what each week asks of you.",
  },
  {
    step: "Progress",
    text: "Every session retests something. When the numbers move, the plan moves; when they stall, we change the approach.",
  },
  {
    step: "Maintain",
    text: "You graduate with a maintenance program and a clear line back to us if something changes.",
  },
];

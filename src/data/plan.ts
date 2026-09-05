import type { Phase } from "../types";

export const START = new Date(2026, 8, 1); // 1 Sep 2026
export const END = new Date(2027, 9, 1); // 1 Oct 2027

export const PHASES: Phase[] = [
  {
    id: "p0",
    n: "0",
    title: "Digital foundations",
    range: "September to October 2026",
    load: "5–6 hrs a week",
    from: new Date(2026, 8, 1),
    to: new Date(2026, 10, 1),
    amber: false,
    goal: "From phone-user to computer-user. Nothing here is optional — CCNA gets much easier once this feels natural.",
    items: [
      "Set up her own laptop: her user account, updates, cloud backup",
      "Typing practice 15 min daily (typing.com or keybr.com) until 30+ WPM",
      "Build a study folder system; learn file types, zip/unzip, search",
      "Learn safe installing: where to download, what to avoid, browser basics",
      "Set up Bitwarden password manager — her first real security habit",
      "Create accounts: NetAcad, TryHackMe, Google Drive for notes",
      "Watch “How the Internet works”, then explain an IP address to Florian in her own words",
      "Start CCNA1 gently: modules 1–3 on NetAcad",
    ],
    milestone: "She types 30 WPM and can explain what an IP address is at dinner.",
  },
  {
    id: "p1",
    n: "1",
    title: "CCNA1 — networking core",
    range: "November 2026 to February 2027",
    load: "6–8 hrs a week",
    from: new Date(2026, 10, 1),
    to: new Date(2027, 1, 15),
    amber: false,
    goal: "Finish CCNA1 with real understanding, not just a passing score. Subnetting is the hill — climb it slowly.",
    items: [
      "Modules 4–7 (Ethernet, network layer) with every Packet Tracer lab",
      "Modules 8–11 (IP addressing and subnetting) — slow down here on purpose",
      "Subnetting drills twice a week, 20 min, until splitting a /24 feels easy",
      "Modules 12–14 (transport and application layers)",
      "Modules 15–17 plus the security fundamentals module",
      "Winter break sprint: catch up, then build one small network solo — 2 PCs, a switch, a router, working pings",
      "Sunday teach-back: she explains one concept to Florian each week",
      "Pass every checkpoint exam and the CCNA1 final",
    ],
    milestone: "CCNA1 done, plus one network built from scratch with no tutorial open.",
  },
  {
    id: "p2",
    n: "2",
    title: "Linux and first code",
    range: "February to April 2027",
    load: "5–6 hrs a week",
    from: new Date(2027, 1, 15),
    to: new Date(2027, 4, 1),
    amber: false,
    goal: "Comfortable in a terminal, first lines of Python. School is getting heavier — keep sessions short and steady.",
    items: [
      "Florian installs VirtualBox + Ubuntu VM on her laptop (his job, not hers)",
      "TryHackMe “Pre-Security” path — complete it",
      "Linux basics: moving around, files, permissions (cd, ls, cat, chmod)",
      "OverTheWire Bandit levels 0–10 — a puzzle game for the terminal",
      "Python start: variables, loops, if/else (Python for Everybody, ch. 1–5)",
      "Mini-project: a password strength checker, ~30 lines. Florian reviews, never writes",
      "Keep networking warm: one Packet Tracer lab a week",
    ],
    milestone: "Bandit level 10 beaten and her first script runs.",
  },
  {
    id: "p3",
    n: "3",
    title: "Matura mode",
    range: "May to June 2027",
    load: "2–3 hrs a week, max",
    from: new Date(2027, 4, 1),
    to: new Date(2027, 6, 1),
    amber: true,
    goal: "Passing Matura well is what actually opens UBT's door. Tech pauses — that is the plan, not a failure of it.",
    items: [
      "Tech drops to fun-only: typing streaks, a video, an easy TryHackMe room if she feels like it",
      "Florian takes over all logistics: enrollment documents, deadlines, paperwork",
      "Zero guilt about skipped study weeks — Matura is the cyber plan right now",
      "Graduate",
      "Celebrate properly. She earned it",
    ],
    milestone: "Matura passed, diploma in hand.",
  },
  {
    id: "p4",
    n: "4",
    title: "Summer sprint",
    range: "July to September 2027",
    load: "15–20 hrs a week",
    from: new Date(2027, 6, 1),
    to: new Date(2027, 9, 1),
    amber: false,
    goal: "School is over — this is the big push. She walks into UBT ahead of most of her class.",
    items: [
      "Python fundamentals complete: functions, lists, dictionaries, files",
      "Project 1: Caesar cipher encoder/decoder",
      "Project 2: a quiz app that drills networking terms — coding and revising at once",
      "Project 3: her choice, anything she finds fun",
      "TryHackMe “Cyber Security 101” path — complete",
      "GitHub account; push all three projects (Florian teaches add, commit, push)",
      "Networking refresh: redo 2–3 CCNA1 labs; start CCNA2 if she is enjoying it",
      "Set up the uni laptop: VS Code, Linux VM, a note system that survives semester one",
      "UBT enrollment submitted early, nothing left to the last week",
      "Visit campus together before day one",
    ],
    milestone: "Three projects on GitHub, enrolled, ready for October.",
  },
];

export const COACH_TIPS = [
  "Sunday, 30 minutes: review the week, unblock her, plan the next one.",
  "Be the rubber duck — she explains, you listen. Teaching it back is the real test.",
  "You build the environments (VMs, installs, accounts) so her hours go to learning.",
  "Celebrate milestones out loud. CCNA1 finished means dinner out.",
  "The dip arrives around February–March. It is normal. Push through it together.",
  "Never do her labs. Unblock, then step back.",
  "May and June: boyfriend first, coach on pause.",
  "Unlock the next phase a few days before she finishes the current one — momentum matters more than surprise.",
];

export const PHASE_ORDER = PHASES.map((p) => p.id);

export function phaseIds(p: Phase): string[] {
  return p.items.map((_, i) => `${p.id}-${i}`);
}

export const ALL_TASK_IDS = PHASES.flatMap(phaseIds);

/** The phase the calendar says we are in (clamped to first/last). */
export function phaseByDate(today: Date): Phase {
  const hit = PHASES.find((p) => today >= p.from && today < p.to);
  if (hit) return hit;
  return today < START ? PHASES[0] : PHASES[PHASES.length - 1];
}

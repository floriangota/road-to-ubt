# Road to UBT — cyber prep planner

A 13-month study planner (September 2026 → October 2027) for going from medical high school to a cybersecurity bachelor at UBT. Vite + React + TypeScript, synced through Supabase.

## The two views — the URL decides, nothing is remembered per device

- **Her link:** `https://you.github.io/road-to-ubt/` — only the phases the coach has unlocked, her own progress bar, no calendar pressure. This is what the plain URL shows on *every* device.
- **Coach link:** `https://you.github.io/road-to-ubt/?coach=YOURCODE` — all phases, her ticks (refreshes every 20s and on tab focus), last-activity time, Unlock/Lock per phase, reset. Bookmark this one; open the plain link any time to preview exactly what she sees.

Without Supabase configured, the app still runs in local-only mode (per-device, no sync) and shows a banner saying so.

## Structure

```
├── .github/workflows/deploy.yml   GitHub Pages deploy (build with secrets)
├── index.html                     Vite entry
└── src/
    ├── main.tsx                   React bootstrap
    ├── App.tsx                    role from URL, composition
    ├── config.ts                  env → config (VITE_* vars)
    ├── types.ts                   Phase / PlannerState / Role
    ├── styles.css                 design system
    ├── data/plan.ts               phases, coach tips, date helpers
    ├── lib/api.ts                 Supabase client, fetch/push state
    ├── lib/time.ts                relative-time formatting
    ├── hooks/usePlannerState.ts   cache, polling, debounced sync, actions
    └── components/                CoachStrip, RouteBar, PhaseCard, LockedCard, CoachTips, Footer, icons
```

## Setup

### 1. Database (once, ~5 min)

[supabase.com](https://supabase.com) → New project (free) → **SQL Editor** → run:

```sql
create table planner_state (
  id int primary key,
  checks jsonb not null default '{}'::jsonb,
  unlocked jsonb not null default '["p0"]'::jsonb,
  updated_at timestamptz default now()
);
insert into planner_state (id) values (1);

alter table planner_state enable row level security;
create policy "planner read"  on planner_state for select using (true);
create policy "planner write" on planner_state for update using (true);
```

Grab two values: **Project URL** (Connect dialog, or Settings → Data API) and the **anon public key** (Settings → API Keys → Legacy API Keys tab). Never use the `service_role` / `sb_secret_` key in this project — it must not ship to a browser.

### 2. Local dev

```bash
npm install
npm run dev
```

The Supabase URL, anon key and coach code live in `src/config.ts`. Edit them there. A `.env` file with the same `VITE_*` names (see `.env.example`) overrides them if you ever want to.

### 3. Deploy to GitHub Pages

1. Push to `main`. The included workflow builds and publishes `dist/` — no repo secrets needed, the values in `src/config.ts` are used.
2. If the site does not appear: Repo → **Settings → Pages** → Source: **GitHub Actions**.
3. Optional: repository secrets `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_COACH_CODE` override the file values at build time.

## Honest notes

- The anon key ships in the bundle by design; combined with the open RLS policies, anyone holding the URL can read/update ticks. Fine for a two-person planner — just don't post the link publicly.
- All phase content ships in the bundle too, so a determined view-source reveals future phases. If she does that, she is already thinking like a security student.
- The coach code is a curtain, not a lock: it controls which view renders, not access to data.

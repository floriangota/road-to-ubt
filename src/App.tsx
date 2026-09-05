import { useEffect, useMemo, useState } from "react";
import { config } from "./config";
import { PHASES, PHASE_ORDER, phaseByDate, phaseIds } from "./data/plan";
import { usePlannerState } from "./hooks/usePlannerState";
import type { Role } from "./types";
import { CoachStrip } from "./components/CoachStrip";
import { CoachTips } from "./components/CoachTips";
import { Footer } from "./components/Footer";
import { LockedCard } from "./components/LockedCard";
import { PhaseCard } from "./components/PhaseCard";
import { RouteBar } from "./components/RouteBar";

/** The URL alone decides the view. Plain link = her view, on every device. */
function roleFromUrl(): Role {
  const code = new URLSearchParams(window.location.search).get("coach");
  return config.coachCode && code === config.coachCode ? "coach" : "student";
}

export default function App() {
  const role = useMemo(roleFromUrl, []);
  const { state, toggleTask, setPhaseUnlocked, resetChecks, syncEnabled } = usePlannerState();

  const visible = role === "coach" ? PHASES : PHASES.filter((p) => state.unlocked.includes(p.id));

  // "now" = calendar phase for the coach; latest unlocked phase for her.
  const nowId =
    role === "coach"
      ? phaseByDate(new Date()).id
      : state.unlocked.length
        ? state.unlocked[state.unlocked.length - 1]
        : null;

  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(nowId ? [nowId] : []));

  // When the coach unlocks a new phase, open it on her screen automatically.
  useEffect(() => {
    if (role !== "student" || !state.unlocked.length) return;
    const latest = state.unlocked[state.unlocked.length - 1];
    setOpenIds((prev) => (prev.has(latest) ? prev : new Set(prev).add(latest)));
  }, [role, state.unlocked]);

  function toggleOpen(id: string): void {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const openTaskIds = visible.flatMap(phaseIds);
  const allOpenDone = openTaskIds.length > 0 && openTaskIds.every((id) => state.checks[id]);

  return (
    <div className="wrap">
      {!syncEnabled && (
        <div className="strip offline">
          Running locally — progress is not syncing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see README).
        </div>
      )}
      {role === "coach" && <CoachStrip updatedAt={state.updatedAt} />}

      <header>
        <p className="kicker">September 2026 → October 2027</p>
        <h1>
          From the med lab
          <br />
          to the terminal.
        </h1>
        <p className="lede">
          {role === "coach"
            ? "Thirteen months from medical high school to day one of cybersecurity at UBT. You pace it; she walks it."
            : "Your road from the medical world to cybersecurity at UBT — one phase at a time, one honest hour a day."}
        </p>
        <RouteBar role={role} state={state} />
      </header>

      <main>
        {visible.map((p) => (
          <PhaseCard
            key={p.id}
            phase={p}
            checks={state.checks}
            role={role}
            unlocked={state.unlocked.includes(p.id)}
            isNow={p.id === nowId}
            open={openIds.has(p.id)}
            onToggleOpen={() => toggleOpen(p.id)}
            onToggleTask={toggleTask}
            onToggleLock={() => setPhaseUnlocked(p.id, !state.unlocked.includes(p.id), PHASE_ORDER)}
          />
        ))}
        {role === "student" && visible.length < PHASES.length && <LockedCard allOpenDone={allOpenDone} />}
      </main>

      {role === "coach" && <CoachTips />}
      <Footer role={role} onResetChecks={resetChecks} />
    </div>
  );
}

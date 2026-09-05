import type { PlannerState, Role } from "../types";
import { ALL_TASK_IDS, END, PHASES, START, phaseIds } from "../data/plan";

interface Props {
  role: Role;
  state: PlannerState;
}

export function RouteBar({ role, state }: Props) {
  if (role === "coach") {
    const done = ALL_TASK_IDS.filter((id) => state.checks[id]).length;
    const taskPct = Math.round((done / ALL_TASK_IDS.length) * 100);
    const timePct = Math.min(
      100,
      Math.max(0, Math.round(((Date.now() - START.getTime()) / (END.getTime() - START.getTime())) * 100)),
    );
    return (
      <div className="route">
        <div className="route-meta">
          <span>
            <strong>{done}</strong> of {ALL_TASK_IDS.length} steps done
          </span>
          <span>{taskPct >= timePct ? "ahead of the calendar" : "calendar is ahead — steady, not sprint"}</span>
        </div>
        <div className="bar">
          <div className="fill" style={{ width: `${taskPct}%` }} />
          <div className="today" style={{ left: `calc(${timePct}% - 1px)` }} />
        </div>
        <div className="legend">
          <span>green = her ticked steps</span>
          <span>dark line = today</span>
        </div>
      </div>
    );
  }

  // Her view: progress over unlocked steps only — no calendar, no pressure.
  const openIds = PHASES.filter((p) => state.unlocked.includes(p.id)).flatMap(phaseIds);
  const done = openIds.filter((id) => state.checks[id]).length;
  const pct = openIds.length ? Math.round((done / openIds.length) * 100) : 0;
  return (
    <div className="route">
      <div className="route-meta">
        <span>
          <strong>{done}</strong> of {openIds.length} open steps done
        </span>
        <span>{pct}%</span>
      </div>
      <div className="bar">
        <div className="fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

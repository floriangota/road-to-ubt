import type { CSSProperties, MouseEvent } from "react";
import type { Phase, Role } from "../types";
import { phaseIds } from "../data/plan";
import { CheckIcon, ChevronIcon, LockIcon } from "./icons";

interface Props {
  phase: Phase;
  checks: Record<string, boolean>;
  role: Role;
  unlocked: boolean;
  isNow: boolean;
  open: boolean;
  onToggleOpen: () => void;
  onToggleTask: (taskId: string) => void;
  onToggleLock: () => void;
}

function TaskRow({
  id,
  label,
  done,
  onToggle,
}: {
  id: string;
  label: string;
  done: boolean;
  onToggle: (taskId: string) => void;
}) {
  return (
    <button type="button" className={`task ${done ? "on" : ""}`} onClick={() => onToggle(id)}>
      <span className="box">
        <CheckIcon />
      </span>
      <span className="txt">{label}</span>
    </button>
  );
}

export function PhaseCard({
  phase,
  checks,
  role,
  unlocked,
  isNow,
  open,
  onToggleOpen,
  onToggleTask,
  onToggleLock,
}: Props) {
  const ids = phaseIds(phase);
  const done = ids.filter((id) => checks[id]).length;
  const complete = done === ids.length;
  const accent = phase.amber ? "var(--amber)" : "var(--teal)";
  const soft = phase.amber ? "var(--amber-soft)" : "var(--teal-soft)";

  function handleLock(e: MouseEvent<HTMLButtonElement>): void {
    e.stopPropagation(); // don't also collapse/expand the card
    onToggleLock();
  }

  return (
    <section
      className={`phase ${isNow ? "now" : ""} ${open ? "open" : ""}`}
      style={{ "--accent": accent, "--soft": soft } as CSSProperties}
    >
      <div className="phase-head" onClick={onToggleOpen} role="button" tabIndex={0}>
        <span className={`badge ${complete ? "done" : ""}`}>{complete ? <CheckIcon /> : phase.n}</span>
        <span className="headmain">
          <span className="phase-title">
            {phase.title}
            {isNow && <span className="pill">now</span>}
            {role === "coach" && !unlocked && (
              <span className="pill muted">
                <LockIcon size={12} /> hidden from her
              </span>
            )}
          </span>
          <span className="phase-sub">
            {phase.range} — {phase.load} — {done}/{ids.length}
          </span>
        </span>
        <span className="headright">
          {role === "coach" && (
            <button type="button" className={`lockbtn ${unlocked ? "" : "unlock"}`} onClick={handleLock}>
              {unlocked ? "Lock" : "Unlock"}
            </button>
          )}
          <span className="chev">
            <ChevronIcon />
          </span>
        </span>
      </div>

      {open && (
        <div className="phase-body">
          <p className="goal">{phase.goal}</p>
          {phase.items.map((item, i) => {
            const id = `${phase.id}-${i}`;
            return <TaskRow key={id} id={id} label={item} done={!!checks[id]} onToggle={onToggleTask} />;
          })}
          <p className="milestone">
            <b>Milestone:</b> {phase.milestone}
          </p>
        </div>
      )}
    </section>
  );
}

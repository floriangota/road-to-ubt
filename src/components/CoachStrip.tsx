import { relTime } from "../lib/time";

export function CoachStrip({ updatedAt }: { updatedAt: string | null }) {
  return (
    <div className="strip coach">
      <span>
        <b>Coach view.</b> She sees only unlocked phases.
      </span>
      <span>
        Last activity: <b>{relTime(updatedAt)}</b>
      </span>
      <span className="hint">Open the plain link (no ?coach) to preview her view.</span>
    </div>
  );
}

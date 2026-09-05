import { LockIcon } from "./icons";

export function LockedCard({ allOpenDone }: { allOpenDone: boolean }) {
  return (
    <section className="phase locked">
      <span className="badge">
        <LockIcon />
      </span>
      <p>
        {allOpenDone
          ? "Everything open is done — nice. The next phase unlocks when Florian opens it."
          : "More phases are waiting, locked on purpose. One phase at a time is the whole point."}
      </p>
    </section>
  );
}

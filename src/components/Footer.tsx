import { useState } from "react";
import type { Role } from "../types";

interface Props {
  role: Role;
  onResetChecks: () => void;
}

export function Footer({ role, onResetChecks }: Props) {
  const [confirming, setConfirming] = useState(false);

  return (
    <footer>
      <span>Budget for the whole year: roughly €0–100. Everything core is free.</span>
      {role === "coach" &&
        (confirming ? (
          <span className="resetzone">
            <button
              type="button"
              className="danger"
              onClick={() => {
                onResetChecks();
                setConfirming(false);
              }}
            >
              Reset her ticks
            </button>
            <button type="button" onClick={() => setConfirming(false)}>
              Keep
            </button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirming(true)}>
            Reset progress
          </button>
        ))}
    </footer>
  );
}

import { useEffect, useRef, useState } from "react";
import type { PlannerState } from "../types";
import { fetchRemote, pushRemote, syncEnabled } from "../lib/api";

const CACHE_KEY = "ubt-cache-v2";
const POLL_MS = 20_000;
const EDIT_GRACE_MS = 5_000; // ignore polls right after a local edit
const CHECKS_DEBOUNCE_MS = 600;

const DEFAULT_STATE: PlannerState = { checks: {}, unlocked: ["p0"], updatedAt: null };

function loadCache(): PlannerState {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const c = JSON.parse(raw) as Partial<PlannerState>;
      if (c && typeof c === "object" && c.checks) return { ...DEFAULT_STATE, ...c };
    }
  } catch {
    // private mode / blocked storage — start clean
  }
  return DEFAULT_STATE;
}

function saveCache(s: PlannerState): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(s));
  } catch {
    // non-fatal
  }
}

export function usePlannerState() {
  const [state, setState] = useState<PlannerState>(loadCache);
  const stateRef = useRef(state);
  const lastLocalEdit = useRef(0);
  const checksTimer = useRef<number | undefined>(undefined);

  function commit(next: PlannerState): void {
    stateRef.current = next;
    setState(next);
    saveCache(next);
  }

  // Pull remote state on mount, every POLL_MS, and when the tab regains focus.
  useEffect(() => {
    let cancelled = false;

    async function pull(): Promise<void> {
      const remote = await fetchRemote();
      if (cancelled || !remote) return;
      // Don't clobber ticks the user just made and that are still debouncing.
      if (Date.now() - lastLocalEdit.current < EDIT_GRACE_MS) return;
      stateRef.current = remote;
      setState(remote);
      saveCache(remote);
    }

    void pull();
    const timer = window.setInterval(() => void pull(), POLL_MS);
    const onVisible = (): void => {
      if (document.visibilityState === "visible") void pull();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  function toggleTask(taskId: string): void {
    const checks = { ...stateRef.current.checks };
    if (checks[taskId]) delete checks[taskId];
    else checks[taskId] = true;
    lastLocalEdit.current = Date.now();
    commit({ ...stateRef.current, checks });
    // Debounce so a burst of ticks becomes one PATCH.
    window.clearTimeout(checksTimer.current);
    checksTimer.current = window.setTimeout(() => {
      void pushRemote({ checks: stateRef.current.checks });
    }, CHECKS_DEBOUNCE_MS);
  }

  /** Coach action. `order` keeps `unlocked` in canonical phase order. */
  function setPhaseUnlocked(phaseId: string, unlocked: boolean, order: string[]): void {
    const set = new Set(stateRef.current.unlocked);
    if (unlocked) set.add(phaseId);
    else set.delete(phaseId);
    const nextUnlocked = order.filter((id) => set.has(id));
    lastLocalEdit.current = Date.now();
    commit({ ...stateRef.current, unlocked: nextUnlocked });
    void pushRemote({ unlocked: nextUnlocked });
  }

  /** Coach action. Clears every tick. */
  function resetChecks(): void {
    lastLocalEdit.current = Date.now();
    commit({ ...stateRef.current, checks: {} });
    void pushRemote({ checks: {} });
  }

  return { state, toggleTask, setPhaseUnlocked, resetChecks, syncEnabled };
}

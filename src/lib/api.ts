import { createClient } from "@supabase/supabase-js";
import { config } from "../config";
import type { PlannerState } from "../types";

/**
 * One row (id = 1) in the `planner_state` table holds everything:
 *   checks   jsonb  — { "p0-3": true, ... }  ticked tasks
 *   unlocked jsonb  — ["p0", "p1"]           phases visible to her
 * See README for the SQL that creates it.
 */
const client = config.hasSync
  ? createClient(config.supabaseUrl, config.supabaseAnonKey)
  : null;

/** False when env vars are missing — the app then runs local-only. */
export const syncEnabled = client !== null;

export async function fetchRemote(): Promise<PlannerState | null> {
  if (!client) return null;
  try {
    const { data, error } = await client
      .from("planner_state")
      .select("checks, unlocked, updated_at")
      .eq("id", 1)
      .maybeSingle();
    if (error || !data) return null;
    return {
      checks: (data.checks ?? {}) as Record<string, boolean>,
      unlocked: (data.unlocked ?? ["p0"]) as string[],
      updatedAt: (data.updated_at as string | null) ?? null,
    };
  } catch {
    return null; // offline — caller keeps local state
  }
}

export async function pushRemote(
  fields: Partial<Pick<PlannerState, "checks" | "unlocked">>,
): Promise<void> {
  if (!client) return;
  try {
    await client
      .from("planner_state")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", 1);
  } catch {
    // swallowed on purpose — the next change or poll reconciles
  }
}

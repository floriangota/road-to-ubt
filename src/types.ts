export interface Phase {
  id: string;
  n: string;
  title: string;
  range: string;
  load: string;
  from: Date;
  to: Date;
  amber: boolean;
  goal: string;
  items: string[];
  milestone: string;
}

export interface PlannerState {
  checks: Record<string, boolean>;
  unlocked: string[];
  updatedAt: string | null;
}

export type Role = "student" | "coach";

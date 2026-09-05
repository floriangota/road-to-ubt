/**
 * Defaults live here so the app works straight from a plain `git push`
 * with no repo secrets. Build-time VITE_* env vars override them.
 *
 * SUPABASE_URL must be the bare project URL (no /rest/v1/ suffix —
 * supabase-js appends that itself).
 */
const DEFAULTS = {
  SUPABASE_URL: "https://lwfqcwkmcnnzgxbppetl.supabase.co",
  SUPABASE_ANON_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZnFjd2ttY25uemd4YnBwZXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2Mjc5MzIsImV4cCI6MjEwNDIwMzkzMn0.ctPUMRU84ps8zBMkZyrLu60piKICjhXVD2UsWj__wA4",
  COACH_CODE: "BABA", // open ?coach=THIS to enter coach view
};

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || DEFAULTS.SUPABASE_URL).replace(/\/rest\/v1\/?$/, "");
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULTS.SUPABASE_ANON_KEY;
const coachCode = import.meta.env.VITE_COACH_CODE || DEFAULTS.COACH_CODE;

export const config = {
  supabaseUrl,
  supabaseAnonKey,
  coachCode,
  /** True when both Supabase values are present at build time. */
  hasSync: Boolean(supabaseUrl && supabaseAnonKey),
};

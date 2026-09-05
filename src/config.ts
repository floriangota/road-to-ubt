const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";
const coachCode = import.meta.env.VITE_COACH_CODE ?? "";

export const config = {
  supabaseUrl,
  supabaseAnonKey,
  coachCode,
  /** True when both Supabase values are present at build time. */
  hasSync: Boolean(supabaseUrl && supabaseAnonKey),
};

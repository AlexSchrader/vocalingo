import { createClient } from "@supabase/supabase-js";

// Single Supabase client for the app. NULL when the env vars are absent — in
// that case the whole accounts/sync feature stays dormant and the app runs
// local-only, exactly as before (CI and any un-provisioned deploy hit this
// path). The anon key is public-by-design; Row-Level Security protects the data.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true, // handle the OAuth redirect callback
          flowType: "pkce",
        },
      })
    : null;

export const isCloudConfigured = !!supabase;

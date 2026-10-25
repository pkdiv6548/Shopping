import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

// This is the project's public Supabase configuration. A publishable key is
// intentionally safe for browser use; authorization must still be enforced by
// Supabase Auth and Row Level Security. Never put a service_role/secret key here.
const publicSupabaseUrl = "https://dbenwifjhdqhiznowncs.supabase.co";
const publicSupabaseKey = "sb_publishable_-x_VjXiyIL7j_dz7b7AgQQ_jv_Wj4dq";

/** Browser-safe public client with environment-variable overrides for deployments. */
export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || publicSupabaseUrl;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || publicSupabaseKey;
  if (!url || !key) return null;
  if (!client) {
    client = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}

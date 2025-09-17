"use client";
import { createClient } from "@supabase/supabase-js";

export function getDbClientForTenant(dbToken: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !anon) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  let client: ReturnType<typeof createClient> | null = null;
  if (!client) {
    client = createClient(url, anon, {
      global: { headers: { Authorization: `Bearer ${dbToken}` } },
    });
  }
  return client;
}

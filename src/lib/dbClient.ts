'use client'
import { createClient } from '@supabase/supabase-js'

/** Trả về Supabase client dùng DB token (JWT có tenant_id) đã lưu trong sessionStorage. */
export function getDbClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const dbToken = typeof window !== 'undefined' ? sessionStorage.getItem('dbToken') : null

  return createClient(url, anon, {
    global: dbToken ? { headers: { Authorization: `Bearer ${dbToken}` } } : undefined,
  })
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Quan trọng: đặt db.schema='api' để supabase.from('<view>')
// gọi đúng các view trong schema api (v_class_roster, v_ledger_full, ...).
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'api' },
})

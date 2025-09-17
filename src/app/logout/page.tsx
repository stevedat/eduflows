'use client'

import { useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LogoutPage() {
  useEffect(() => {
    const run = async () => {
      try { await supabaseAuth.auth.signOut() } catch {}
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('dbToken')
        sessionStorage.removeItem('activeTenantId')
      }
    }
    run()
  }, [])
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="border rounded-2xl p-6 space-y-3">
        <div className="text-lg font-medium">Logged out.</div>
        <div className="text-sm text-gray-600">Đã xoá dbToken & activeTenantId.</div>
        <Link className="text-blue-600 underline" href="/login">Go to /login</Link>
      </div>
    </div>
  )
}

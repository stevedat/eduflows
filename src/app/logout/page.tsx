'use client'

import { useEffect } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import Link from 'next/link'

const supabaseAuth = getSupabaseBrowser()

export default function LogoutPage() {
  useEffect(() => {
    const run = async () => {
      try { await supabaseAuth.auth.signOut() } catch {}
      // Supabase handles session removal automatically
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

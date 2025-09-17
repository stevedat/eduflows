'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LogoutPage() {
  const router = useRouter()
  useEffect(() => {
    const doSignOut = async () => {
      await supabase.auth.signOut()
      router.replace('/login')
    }
    doSignOut()
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Signing out…</p>
    </div>
  )
}

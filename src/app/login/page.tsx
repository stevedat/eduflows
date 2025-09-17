'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Removed tenantId for superadmin login
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null); setInfo(null); setLoading(true)
    try {
      // 1) Đăng nhập
      const { data: { session }, error: signErr } = await supabaseAuth.auth.signInWithPassword({ email, password })
      if (signErr || !session) throw new Error(signErr?.message || 'Sign-in failed')

      setInfo('Signed in. Redirecting…')
      router.push('/quick')
    } catch (e:any) {
      setError(e?.message || 'Login error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="w-full max-w-md border rounded-2xl p-6 space-y-4">
        <h1 className="text-xl font-semibold">Login & Issue Tenant DB Token</h1>

        <label className="text-sm grid gap-1">
          <span>Email</span>
          <input className="border rounded px-3 py-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </label>

        <label className="text-sm grid gap-1">
          <span>Password</span>
          <input className="border rounded px-3 py-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </label>

        {/* Tenant ID input removed for superadmin login */}

        <button disabled={loading} className="w-full border rounded px-3 py-2">
          {loading ? 'Processing…' : 'Login & Get DB Token'}
        </button>

        {error && <div className="text-sm text-red-600">Error: {error}</div>}
        {info && <div className="text-sm text-green-700">{info}</div>}
      </form>
    </div>
  )
}

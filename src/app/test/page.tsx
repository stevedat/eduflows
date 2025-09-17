'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
const supabase = getSupabaseBrowser()

export default function TestPage() {
  const [tenants, setTenants] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTenants() {
      const { data, error } = await supabase.from('v_tenants').select('*').limit(5)
      if (error) setError(error.message)
      else setTenants(data || [])
    }
    loadTenants()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Supabase Connection</h1>
      {error && <p className="text-red-500">Error: {error}</p>}
      {tenants.length === 0 && !error && <p>No tenants found.</p>}
      <ul className="space-y-2">
        {tenants.map((t) => (
          <li key={t.id} className="border p-2 rounded">
            {t.name} ({t.status})
          </li>
        ))}
      </ul>
    </div>
  )
}

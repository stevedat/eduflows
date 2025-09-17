'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function WhoAmI() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [errUser, setErrUser] = useState<string | null>(null)
  const [probeData, setProbeData] = useState<any[]>([])
  const [probeError, setProbeError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.auth.getUser()
      if (error) setErrUser(error.message)
      setUserInfo(data?.user ?? null)

      // Probe 1 view có scope theo tenant (ví dụ ledger)
      const { data: rows, error: e2 } = await supabase
        .from('v_ledger_full')
        .select('*')
        .limit(5)
      if (e2) setProbeError(e2.message)
      else setProbeData(rows ?? [])
    }
    load()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Who Am I · Supabase Auth</h1>

      <section className="border rounded-lg p-4">
        <h2 className="font-semibold">User</h2>
        {errUser && <p className="text-red-600 text-sm mt-2">Error: {errUser}</p>}
        {!userInfo && !errUser && <p className="text-gray-600 text-sm">No user (anon).</p>}
        {userInfo && (
          <pre className="mt-2 text-xs bg-gray-50 p-3 rounded overflow-auto">
{JSON.stringify(userInfo, null, 2)}
          </pre>
        )}
      </section>

      <section className="border rounded-lg p-4">
        <h2 className="font-semibold">RLS Probe · api.v_ledger_full</h2>
        {probeError ? (
          <p className="text-red-600 text-sm mt-2">Error: {probeError}</p>
        ) : probeData.length === 0 ? (
          <p className="text-gray-600 text-sm mt-2">No rows.</p>
        ) : (
          <pre className="mt-2 text-xs bg-gray-50 p-3 rounded overflow-auto">
{JSON.stringify(probeData, null, 2)}
          </pre>
        )}
      </section>
    </div>
  )
}

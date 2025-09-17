'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Row = Record<string, any>
type Result = { name: string; data: Row[]; error: string | null }

const VIEWS = [
  // v1
  'v_class_roster',
  'v_teacher_class_assignment',
  // v2
  'v_attendance_overview_by_class',
  // v3
  'meal_deduction_view',
  'v_ledger',
  // v4
  'v_expenses_by_period',
  'v_payroll_summary_by_teacher',
  // v5
  'v_vendor_cost_by_fee_item',
  'v_vendor_cost_by_month',
  // v6
  'v_growth_summary',
  'v_vaccination_status',
  'v_notices_with_responses',
  // v7
  'v_revenue_by_fee_item',
  'v_revenue_by_student',
  'v_revenue_by_class',
]

export default function DiagnosticsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function run() {
      setLoading(true)
      const out: Result[] = []
      for (const name of VIEWS) {
        const { data, error } = await supabase.from(name).select('*').limit(5)
        out.push({
          name: `api.${name}`,
          data: data ?? [],
          error: error ? `${error.message}` : null,
        })
      }
      setResults(out)
      setLoading(false)
    }
    run()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Diagnostics · Supabase API Views</h1>
      <p className="text-sm text-gray-600">
        Kiểm tra nhanh kết nối & RLS. Nếu view nào trả lỗi/empty, có thể do chưa có seed dữ liệu
        hoặc JWT chưa có <code>tenant_id</code>.
      </p>
      {loading && <div className="animate-pulse">Loading…</div>}
      {!loading && results.map((r) => (
        <section key={r.name} className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{r.name}</h2>
            {r.error ? (
              <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">ERROR</span>
            ) : (
              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">OK</span>
            )}
          </div>
          {r.error ? (
            <pre className="mt-2 text-sm text-red-600 whitespace-pre-wrap">{r.error}</pre>
          ) : r.data.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">No rows.</p>
          ) : (
            <pre className="mt-2 text-xs overflow-auto bg-gray-50 p-3 rounded">
{JSON.stringify(r.data, null, 2)}
            </pre>
          )}
        </section>
      ))}
    </div>
  )
}

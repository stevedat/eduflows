'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { RosterTable } from '@/components/RosterTable'

type RosterRow = {
  tenant_id: string
  class_id: string
  student_id: string
  full_name: string
}

const PAGE_SIZE_DEFAULT = 20

export default function ClassRosterPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const classId = params?.id
  const [rows, setRows] = useState<RosterRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number | null>(null)

  // query state
  const q = searchParams.get('q') ?? ''
  const page = Number(searchParams.get('page') ?? '1')
  const pageSize = Number(searchParams.get('pageSize') ?? PAGE_SIZE_DEFAULT)

  const from = useMemo(() => (page - 1) * pageSize, [page, pageSize])
  const to = useMemo(() => from + pageSize - 1, [from, pageSize])

  useEffect(() => {
    if (!classId) return
    let cancelled = false
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        // View: api.v_class_roster (đã set db.schema='api' trong supabase client)
        // - Lọc theo class_id == params.id
        // - Tìm kiếm full_name (ilike) nếu có q
        let query = supabase.from('v_class_roster')
          .select('tenant_id,class_id,student_id,full_name', { count: 'exact' })
          .eq('class_id', classId)

        if (q) {
          // ilike sẽ dùng pattern `%q%`
          query = query.ilike('full_name', `%${q}%`)
        }

        const { data, error, count } = await query.range(from, to)

        if (error) throw error
        if (cancelled) return

        setRows((data ?? []) as RosterRow[])
        setTotal(typeof count === 'number' ? count : null)
      } catch (err: any) {
        if (cancelled) return
        setError(err?.message ?? 'Error loading roster')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [classId, q, from, to])

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const input = (form.elements.namedItem('q') as HTMLInputElement)
    const next = new URLSearchParams(searchParams.toString())
    if (input.value) next.set('q', input.value)
    else next.delete('q')
    next.set('page', '1') // reset về trang 1 khi search
    router.replace(`?${next.toString()}`)
  }

  const setPage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams.toString())
    next.set('page', String(nextPage))
    router.replace(`?${next.toString()}`)
  }

  const setPageSize = (nextSize: number) => {
    const next = new URLSearchParams(searchParams.toString())
    next.set('pageSize', String(nextSize))
    next.set('page', '1')
    router.replace(`?${next.toString()}`)
  }

  const totalPages = total ? Math.max(1, Math.ceil(total / pageSize)) : 1

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Class Roster</h1>
          <div className="text-xs text-gray-500 font-mono">
            class_id: {classId}
          </div>
        </div>

        <form onSubmit={onSearch} className="flex gap-2 items-center">
          <input
            name="q"
            defaultValue={q}
            placeholder="Tìm theo tên học sinh…"
            className="border rounded-lg px-3 py-2 outline-none w-64"
          />
          <button className="rounded-lg px-4 py-2 border bg-black text-white hover:opacity-90">
            Tìm
          </button>
          <div className="ml-auto flex items-center gap-2 text-sm">
            <span>Rows/page</span>
            <select
              className="border rounded px-2 py-1"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </form>

        {loading && (
          <div className="border rounded-xl p-4 text-sm">Đang tải roster…</div>
        )}
        {error && (
          <div className="border rounded-xl p-4 text-sm text-red-600">Lỗi: {error}</div>
        )}
        {!loading && !error && <RosterTable rows={rows} />}

        <div className="flex items-center justify-between text-sm">
          <div>
            {total !== null ? (
              <span>Tổng: <b>{total}</b> học sinh</span>
            ) : (
              <span>&nbsp;</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              className="border rounded px-3 py-1 disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              ← Trang trước
            </button>
            <div className="px-2 py-1">Trang {page} / {totalPages}</div>
            <button
              className="border rounded px-3 py-1 disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Trang sau →
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Gợi ý: nếu bạn đang thấy danh sách rỗng, hãy đảm bảo:
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Tài khoản đã đăng nhập có <code>tenant_id</code> phù hợp (RLS).</li>
            <li>Đã có dữ liệu trong <code>core.students</code> và <code>core.class_enrollments</code> (đúng tenant).</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

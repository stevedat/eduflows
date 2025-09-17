'use client'

import { useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
const supabase = getSupabaseBrowser()

type Row = Record<string, any>
type FetchState = { loading: boolean; error: string | null; rows: Row[] }

function Block({title, children}:{title:string; children:React.ReactNode}) {
  return (
    <section className="border rounded-xl p-4 space-y-3">
      <h2 className="font-medium">{title}</h2>
      {children}
    </section>
  )
}

export default function QuickTest() {
  const [classId, setClassId] = useState('')
  const [studentId, setStudentId] = useState('')
  const [period, setPeriod] = useState('') // 'YYYY-MM'

  const [roster, setRoster] = useState<FetchState>({loading:false,error:null,rows:[]})
  const [attOverview, setAttOverview] = useState<FetchState>({loading:false,error:null,rows:[]})
  const [mealDeduct, setMealDeduct] = useState<FetchState>({loading:false,error:null,rows:[]})
  const [ledger, setLedger] = useState<FetchState>({loading:false,error:null,rows:[]})
  const [ledgerFull, setLedgerFull] = useState<FetchState>({loading:false,error:null,rows:[]})
  const [revFee, setRevFee] = useState<FetchState>({loading:false,error:null,rows:[]})
  const [revClass, setRevClass] = useState<FetchState>({loading:false,error:null,rows:[]})
  const [revStudent, setRevStudent] = useState<FetchState>({loading:false,error:null,rows:[]})
  const [expByPeriod, setExpByPeriod] = useState<FetchState>({loading:false,error:null,rows:[]})
  const [vendorFee, setVendorFee] = useState<FetchState>({loading:false,error:null,rows:[]})
  const [vendorMonth, setVendorMonth] = useState<FetchState>({loading:false,error:null,rows:[]})
  const [payroll, setPayroll] = useState<FetchState>({loading:false,error:null,rows:[]})
  const [growth, setGrowth] = useState<FetchState>({loading:false,error:null,rows:[]})
  const [vacc, setVacc] = useState<FetchState>({loading:false,error:null,rows:[]})
  const [notices, setNotices] = useState<FetchState>({loading:false,error:null,rows:[]})

  const run = async <T extends FetchState>(setter:(s:T)=>void, fn:()=>Promise<{rows:Row[], error?:any}>) => {
    setter({loading:true,error:null,rows:[]} as T)
    try {
      const { rows, error } = await fn()
      if (error) throw error
      setter({loading:false,error:null,rows} as T)
    } catch (e:any) {
      setter({loading:false,error:e?.message ?? 'Error',rows:[]} as T)
    }
  }

  const fetchRoster = () => run(setRoster, async () => {
    if (!classId) throw new Error('Nhập class_id trước')
    const { data, error } = await supabase
      .from('v_class_roster')
      .select('*')
      .eq('class_id', classId)
      .limit(20)
    return { rows: data ?? [], error }
  })

  const fetchAttOverview = () => run(setAttOverview, async () => {
    if (!classId) throw new Error('Nhập class_id trước')
    const { data, error } = await supabase
      .from('v_attendance_overview_by_class')
      .select('*')
      .eq('class_id', classId)
      .order('sess_date', { ascending: false })
      .limit(20)
    return { rows: data ?? [], error }
  })

  const fetchMealDeduct = () => run(setMealDeduct, async () => {
    if (!studentId || !period) throw new Error('Cần student_id và period (YYYY-MM)')
    const { data, error } = await supabase
      .from('meal_deduction_view')
      .select('*')
      .eq('student_id', studentId)
      .eq('period', period)
    return { rows: data ?? [], error }
  })

  const fetchLedger = () => run(setLedger, async () => {
    const q = supabase.from('v_ledger').select('*').order('period', { ascending:false }).limit(10)
    const { data, error } = await q
    return { rows: data ?? [], error }
  })

  const fetchLedgerFull = () => run(setLedgerFull, async () => {
    const q = supabase.from('v_ledger_full').select('*').order('period', { ascending:false }).limit(10)
    const { data, error } = await q
    return { rows: data ?? [], error }
  })

  const fetchRevFee = () => run(setRevFee, async () => {
    const q = supabase.from('v_revenue_by_fee_item').select('*').order('period', { ascending:false }).limit(10)
    const { data, error } = await q
    return { rows: data ?? [], error }
  })

  const fetchRevClass = () => run(setRevClass, async () => {
    if (classId) {
      const { data, error } = await supabase
        .from('v_revenue_by_class')
        .select('*')
        .eq('class_id', classId)
        .order('period', { ascending:false })
        .limit(10)
      return { rows: data ?? [], error }
    } else {
      const { data, error } = await supabase
        .from('v_revenue_by_class')
        .select('*')
        .order('period', { ascending:false })
        .limit(10)
      return { rows: data ?? [], error }
    }
  })

  const fetchRevStudent = () => run(setRevStudent, async () => {
    if (!studentId) throw new Error('Nhập student_id trước')
    const { data, error } = await supabase
      .from('v_revenue_by_student')
      .select('*')
      .eq('student_id', studentId)
      .order('period', { ascending:false })
      .limit(10)
    return { rows: data ?? [], error }
  })

  const fetchExpByPeriod = () => run(setExpByPeriod, async () => {
    const { data, error } = await supabase
      .from('v_expenses_by_period')
      .select('*')
      .order('period', { ascending:false })
      .limit(12)
    return { rows: data ?? [], error }
  })

  const fetchVendorFee = () => run(setVendorFee, async () => {
    const { data, error } = await supabase
      .from('v_vendor_cost_by_fee_item')
      .select('*')
      .order('period', { ascending:false })
      .limit(10)
    return { rows: data ?? [], error }
  })

  const fetchVendorMonth = () => run(setVendorMonth, async () => {
    const { data, error } = await supabase
      .from('v_vendor_cost_by_month')
      .select('*')
      .order('period', { ascending:false })
      .limit(10)
    return { rows: data ?? [], error }
  })

  const fetchPayroll = () => run(setPayroll, async () => {
    const { data, error } = await supabase
      .from('v_payroll_summary_by_teacher')
      .select('*')
      .order('month', { ascending:false })
      .limit(10)
    return { rows: data ?? [], error }
  })

  const fetchGrowth = () => run(setGrowth, async () => {
    if (!studentId) throw new Error('Nhập student_id trước')
    const { data, error } = await supabase
      .from('v_growth_summary')
      .select('*')
      .eq('student_id', studentId)
      .order('period', { ascending:false })
      .limit(12)
    return { rows: data ?? [], error }
  })

  const fetchVacc = () => run(setVacc, async () => {
    if (!studentId) throw new Error('Nhập student_id trước')
    const { data, error } = await supabase
      .from('v_vaccination_status')
      .select('*')
      .eq('student_id', studentId)
    return { rows: data ?? [], error }
  })

  const fetchNotices = () => run(setNotices, async () => {
    const { data, error } = await supabase
      .from('v_notices_with_responses')
      .select('*')
      .order('created_at', { ascending:false })
      .limit(10)
    return { rows: data ?? [], error }
  })

  const Field = ({label, value, onChange, placeholder}:{label:string; value:string; onChange:(v:string)=>void; placeholder?:string}) => (
    <label className="text-sm flex items-center gap-2">
      <span className="w-28">{label}</span>
      <input value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder}
             className="border rounded px-2 py-1 flex-1" />
    </label>
  )

  const Render = ({state}:{state:FetchState}) => (
    <div className="text-sm">
      {state.loading && <div>Loading…</div>}
      {state.error && <div className="text-red-600">Error: {state.error}</div>}
      {!state.loading && !state.error && (
        <pre className="overflow-auto max-h-72">{JSON.stringify(state.rows, null, 2)}</pre>
      )}
    </div>
  )

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Quick API Tester (schema: api)</h1>

        <div className="border rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Field label="class_id" value={classId} onChange={setClassId} placeholder="UUID lớp (từ seed_demo)"/>
            <Field label="student_id" value={studentId} onChange={setStudentId} placeholder="UUID học sinh (từ seed_demo)"/>
            <Field label="period" value={period} onChange={setPeriod} placeholder="YYYY-MM"/>
          </div>
          <p className="text-xs text-gray-500">
            Điền các id đúng theo dữ liệu seed để lọc chính xác. Nếu để trống, một số khối sẽ load không lọc.
          </p>
        </div>

        <Block title="Roster — api.v_class_roster (lọc theo class_id)">
          <button onClick={fetchRoster} className="border rounded px-3 py-1 mb-2">Fetch</button>
          <Render state={roster}/>
        </Block>

        <Block title="Attendance Overview — api.v_attendance_overview_by_class (lọc theo class_id)">
          <button onClick={fetchAttOverview} className="border rounded px-3 py-1 mb-2">Fetch</button>
          <Render state={attOverview}/>
        </Block>

        <Block title="Meal Deduction — api.meal_deduction_view (student_id + period)">
          <button onClick={fetchMealDeduct} className="border rounded px-3 py-1 mb-2">Fetch</button>
          <Render state={mealDeduct}/>
        </Block>

        <Block title="Finance — api.v_ledger (10 bản ghi gần nhất)">
          <button onClick={fetchLedger} className="border rounded px-3 py-1 mb-2">Fetch</button>
          <Render state={ledger}/>
        </Block>

        <Block title="Finance — api.v_ledger_full (10 bản ghi gần nhất)">
          <button onClick={fetchLedgerFull} className="border rounded px-3 py-1 mb-2">Fetch</button>
          <Render state={ledgerFull}/>
        </Block>

        <Block title="Revenue by Fee Item — api.v_revenue_by_fee_item">
          <button onClick={fetchRevFee} className="border rounded px-3 py-1 mb-2">Fetch</button>
          <Render state={revFee}/>
        </Block>

        <Block title="Revenue by Class — api.v_revenue_by_class (lọc optional class_id)">
          <button onClick={fetchRevClass} className="border rounded px-3 py-1 mb-2">Fetch</button>
          <Render state={revClass}/>
        </Block>

        <Block title="Revenue by Student — api.v_revenue_by_student (student_id)">
          <button onClick={fetchRevStudent} className="border rounded px-3 py-1 mb-2">Fetch</button>
          <Render state={revStudent}/>
        </Block>

        <Block title="Expenses by Period — api.v_expenses_by_period">
          <button onClick={fetchExpByPeriod} className="border rounded px-3 py-1 mb-2">Fetch</button>
          <Render state={expByPeriod}/>
        </Block>

        <Block title="Vendor Cost by Fee Item — api.v_vendor_cost_by_fee_item">
          <button onClick={fetchVendorFee} className="border rounded px-3 py-1 mb-2">Fetch</button>
          <Render state={vendorFee}/>
        </Block>

        <Block title="Vendor Cost by Month — api.v_vendor_cost_by_month">
          <button onClick={fetchVendorMonth} className="border rounded px-3 py-1 mb-2">Fetch</button>
          <Render state={vendorMonth}/>
        </Block>

        <Block title="Payroll Summary by Teacher — api.v_payroll_summary_by_teacher">
          <button onClick={fetchPayroll} className="border rounded px-3 py-1 mb-2">Fetch</button>
          <Render state={payroll}/>
        </Block>

        <Block title="Growth Summary — api.v_growth_summary (student_id)">
          <button onClick={fetchGrowth} className="border rounded px-3 py-1 mb-2">Fetch</button>
          <Render state={growth}/>
        </Block>

        <Block title="Vaccination Status — api.v_vaccination_status (student_id)">
          <button onClick={fetchVacc} className="border rounded px-3 py-1 mb-2">Fetch</button>
          <Render state={vacc}/>
        </Block>

        <Block title="Notices + Responses — api.v_notices_with_responses">
          <button onClick={fetchNotices} className="border rounded px-3 py-1 mb-2">Fetch</button>
          <Render state={notices}/>
        </Block>
      </div>
    </div>
  )
}

"use client";

import { useEffect, useState } from "react";
import { ensureDbToken } from "@/lib/ensureDbToken";
import { getDbClientForTenant } from "@/lib/getDbClientForTenant";

type Row = Record<string, any>;
type Block = { title: string; rows?: Row[]; error?: string };

const SAMPLE_VIEWS = [
  { table: "v_class_roster", params: {} },
  { table: "v_teacher_class_assignment", params: {} },
  { table: "v_attendance_overview_by_class", params: {} },
  { table: "meal_deduction_view", params: {} },
  { table: "v_ledger", params: {} },
  { table: "v_ledger_full", params: {} },
  { table: "v_expenses_by_period", params: {} },
  { table: "v_payroll_summary_by_teacher", params: {} },
  { table: "v_vendor_cost_by_fee_item", params: {} },
  { table: "v_vendor_cost_by_month", params: {} },
  { table: "v_growth_summary", params: {} },
  { table: "v_vaccination_status", params: {} },
  { table: "v_notices_with_responses", params: {} },
  { table: "v_revenue_by_fee_item", params: {} },
  { table: "v_revenue_by_student", params: {} },
  { table: "v_revenue_by_class", params: {} },
];

export default function DiagnosticsPage() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    // Check current Supabase user
    import('@/lib/supabase-browser').then(({ getSupabaseBrowser }) => {
      const supabase = getSupabaseBrowser();
      supabase.auth.getUser().then(({ data, error }) => {
        setUser(data?.user || null);
      });
    });
  }, []);
  const [tenantId, setTenantId] = useState<string>("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const t = localStorage.getItem("activeTenantId") || process.env.NEXT_PUBLIC_DEMO_TENANT_ID || "";
    setTenantId(t);
  }, []);

  const run = async () => {
    setStatus("Requesting dbToken...");
    setBlocks([]);
    try {
      if (!tenantId) throw new Error("No tenantId. Set in /login or .env");
      const dbToken = await ensureDbToken(tenantId);
      setStatus("dbToken OK. Querying views...");

      const db = getDbClientForTenant(dbToken);
      const out: Block[] = [];

      for (const v of SAMPLE_VIEWS) {
        try {
          const { data, error } = await db.from(v.table as any).select("*").limit(5);
          if (error) out.push({ title: v.table, error: error.message });
          else out.push({ title: v.table, rows: data ?? [] });
        } catch (e: any) {
          out.push({ title: v.table, error: e?.message || String(e) });
        }
      }

      setBlocks(out);
      setStatus("Done");
    } catch (e: any) {
      setStatus(`Error: ${e.message || String(e)}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-2">
        <span className="font-semibold">Login status: </span>
        {user ? (
          <span className="text-green-700">Logged in</span>
        ) : (
          <span className="text-red-600">Not logged in</span>
        )}
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-bold">Current Supabase User</h2>
        {user ? (
          <pre className="bg-gray-50 p-2 rounded text-xs">{JSON.stringify(user, null, 2)}</pre>
        ) : (
          <span className="text-red-600 text-sm">No Supabase user found (not logged in)</span>
        )}
      </div>
      <h1 className="text-2xl font-semibold">Diagnostics</h1>

      <div className="flex gap-2 items-center">
        <input
          className="border rounded px-3 py-2 w-[420px]"
          placeholder="tenant_id"
          value={tenantId}
          onChange={(e) => {
            setTenantId(e.target.value);
            localStorage.setItem("activeTenantId", e.target.value);
          }}
        />
        <button className="px-4 py-2 rounded bg-black text-white" onClick={run}>
          Run Checks
        </button>
      </div>

      <p className="text-sm text-gray-600">{status}</p>

      <div className="space-y-4">
        {blocks.map((b) => (
          <div key={b.title} className="border rounded p-3">
            <div className="font-mono text-sm mb-2">{b.title}</div>
            {b.error ? (
              <pre className="text-red-600 text-sm">{b.error}</pre>
            ) : (
              <pre className="text-xs overflow-auto bg-gray-50 p-2 rounded">
                {JSON.stringify(b.rows, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

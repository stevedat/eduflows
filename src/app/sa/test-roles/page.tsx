"use client";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

const TEST_QUERIES = [
  {
    role: "Super Admin",
    view: "api.tenants",
    query: (supabase) => supabase.from("api.tenants").select("id,name,status,created_at").limit(5),
  },
  {
    role: "Admin",
    view: "api.v_class_roster",
    query: (supabase) => supabase.from("api.v_class_roster").select("*").limit(5),
  },
  {
    role: "Teacher",
    view: "api.v_teacher_class_assignment",
    query: (supabase) => supabase.from("api.v_teacher_class_assignment").select("*").limit(5),
  },
  {
    role: "Parent",
    view: "api.v_notices_with_responses",
    query: (supabase) => supabase.from("api.v_notices_with_responses").select("*").limit(5),
  },
];

export default function TestRolesPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const supabase = getSupabaseBrowser();
    Promise.all(
      TEST_QUERIES.map(async (q) => {
        try {
          const { data, error } = await q.query(supabase);
          return { role: q.role, view: q.view, data, error: error?.message };
        } catch (e) {
          return { role: q.role, view: q.view, error: String(e) };
        }
      })
    ).then((res) => {
      setResults(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Test FE Queries for All Roles</h1>
      {loading && <div>Loading...</div>}
      {results.map((r) => (
        <div key={r.role} className="mb-4">
          <h2 className="text-lg font-semibold">{r.role} — {r.view}</h2>
          {r.error && <div className="text-red-600">Error: {r.error}</div>}
          {r.data && r.data.length > 0 ? (
            <pre className="bg-gray-50 p-2 rounded text-xs">{JSON.stringify(r.data, null, 2)}</pre>
          ) : (
            !r.error && <div>No data found.</div>
          )}
        </div>
      ))}
    </div>
  );
}

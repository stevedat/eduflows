"use client";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function SuperadminDashboard() {
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    const supabase = getSupabaseBrowser();
    supabase
      .from("test_info")
      .select("*")
      .limit(10)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setRows(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Superadmin Dashboard</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      <table className="w-full border rounded">
        <thead>
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Message</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="border px-2 py-1">{row.id}</td>
              <td className="border px-2 py-1">{row.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && !loading && !error && <div>No data found.</div>}
    </div>
  );
}

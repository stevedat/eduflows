"use client";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function SuperAdminDashboard() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    const supabase = getSupabaseBrowser();
    supabase
      .from("api.tenants")
      .select("id,name,status,created_at", { count: "exact" })
      .then(({ data, error, count }) => {
        if (error) setError(error.message);
        else {
          setTenants(data ?? []);
          setCount(count ?? 0);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="mb-4">
        <a href="/sa/tenants/create" className="px-4 py-2 bg-green-600 text-white rounded">+ Create Tenant</a>
      </div>
      <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>
      <div className="mb-2">Total tenants: <b>{count}</b></div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      <table className="w-full border rounded">
        <thead>
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Created At</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((row) => (
            <tr key={row.id}>
              <td className="border px-2 py-1">{row.id}</td>
              <td className="border px-2 py-1">{row.name}</td>
              <td className="border px-2 py-1">{row.status}</td>
              <td className="border px-2 py-1">{row.created_at}</td>
              <td className="border px-2 py-1">
                <a href={`/sa/tenants/${row.id}`} className="text-blue-600 underline">Details</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {tenants.length === 0 && !loading && !error && <div>No tenants found.</div>}
    </div>
  );
}

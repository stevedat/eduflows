"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function TenantDetailPage() {
  const { tenantId } = useParams();
  const [tenant, setTenant] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tenantId) return;
    setLoading(true);
    setError("");
    const supabase = getSupabaseBrowser();
    supabase
      .from("api.tenants")
      .select("id,name,status,created_at")
      .eq("id", tenantId)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setTenant(data ?? null);
        setLoading(false);
      });
  }, [tenantId]);

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      {tenant && (
        <div className="mb-4 flex gap-2">
          <a href={`/sa/tenants/${tenant.id}/edit`} className="px-4 py-2 bg-blue-600 text-white rounded">Edit</a>
          <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={async () => {
            if (!confirm('Delete this tenant?')) return;
            const supabase = getSupabaseBrowser();
            const { error } = await supabase.from('api.tenants').delete().eq('id', tenant.id);
            if (error) alert('Delete failed: ' + error.message);
            else window.location.href = '/sa/dashboard';
          }}>Delete</button>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">Tenant Details</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      {tenant ? (
        <table className="w-full border rounded">
          <tbody>
            <tr>
              <td className="border px-2 py-1 font-semibold">ID</td>
              <td className="border px-2 py-1">{tenant.id}</td>
            </tr>
            <tr>
              <td className="border px-2 py-1 font-semibold">Name</td>
              <td className="border px-2 py-1">{tenant.name}</td>
            </tr>
            <tr>
              <td className="border px-2 py-1 font-semibold">Status</td>
              <td className="border px-2 py-1">{tenant.status}</td>
            </tr>
            <tr>
              <td className="border px-2 py-1 font-semibold">Created At</td>
              <td className="border px-2 py-1">{tenant.created_at}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        !loading && !error && <div>No tenant found.</div>
      )}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function EditTenantPage() {
  const { tenantId } = useParams();
  const [tenant, setTenant] = useState<any>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!tenantId) return;
    setLoading(true);
    setError("");
    const supabase = getSupabaseBrowser();
    supabase
      .from("api.tenants")
      .select("id,name,status")
      .eq("id", tenantId)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else {
          setTenant(data ?? null);
          setName(data?.name ?? "");
          setStatus(data?.status ?? "active");
        }
        setLoading(false);
      });
  }, [tenantId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from("api.tenants").update({ name, status }).eq("id", tenantId);
    if (error) setError(error.message);
    else router.push(`/sa/tenants/${tenantId}`);
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Edit Tenant</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      {tenant && (
        <form onSubmit={handleUpdate} className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Tenant Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <select
            className="w-full border rounded px-3 py-2"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="suspended">Suspended</option>
            <option value="closed">Closed</option>
          </select>
          <button className="px-4 py-2 rounded bg-blue-600 text-white" disabled={loading}>
            {loading ? "Updating..." : "Update Tenant"}
          </button>
        </form>
      )}
    </div>
  );
}

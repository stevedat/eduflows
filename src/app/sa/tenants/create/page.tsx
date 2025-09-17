"use client";
import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function CreateTenantPage() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from("api.tenants").insert({ name, status });
    if (error) setError(error.message);
    else router.push("/sa/dashboard");
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Create Tenant</h1>
      <form onSubmit={handleCreate} className="space-y-3">
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
        <button className="px-4 py-2 rounded bg-green-600 text-white" disabled={loading}>
          {loading ? "Creating..." : "Create Tenant"}
        </button>
      </form>
      {error && <div className="text-red-600">Error: {error}</div>}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { ensureDbToken } from "@/lib/ensureDbToken";

export default function WhoAmI() {
  const [tenantId, setTenantId] = useState("");
  const [payload, setPayload] = useState<any>(null);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    const t = localStorage.getItem("activeTenantId") || process.env.NEXT_PUBLIC_DEMO_TENANT_ID || "";
    setTenantId(t);
  }, []);

  const run = async () => {
    setErr("");
    setPayload(null);
    try {
      const token = await ensureDbToken(tenantId);
      const [, p] = token.split(".");
      const json = JSON.parse(atob(p.replace(/-/g, "+").replace(/_/g, "/")));
      setPayload(json);
    } catch (e: any) {
      setErr(e?.message || String(e));
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">whoami (dbToken payload)</h1>
      <div className="flex gap-2">
        <input className="border rounded px-3 py-2 w-[420px]" placeholder="tenant_id"
          value={tenantId} onChange={e=>{setTenantId(e.target.value); localStorage.setItem("activeTenantId", e.target.value);}} />
        <button className="px-4 py-2 rounded bg-black text-white" onClick={run}>Decode</button>
      </div>
      {err && <pre className="text-sm text-red-600">{err}</pre>}
      {payload && <pre className="text-xs bg-gray-50 p-2 rounded">{JSON.stringify(payload, null, 2)}</pre>}
    </div>
  );
}

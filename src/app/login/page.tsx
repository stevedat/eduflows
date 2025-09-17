"use client";
import { useState } from "react";
import { getSupabaseBrowser } from '@/lib/supabase-browser';

const supabase = getSupabaseBrowser();

export default function LoginPage() {
  const [email, setEmail] = useState("admin@ductueviet.com");
  const [password, setPassword] = useState("");
  // Removed tenantId selection from login
  const [status, setStatus] = useState<string>("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Signing in...");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus(`Login error: ${error.message}`);
      return;
    }
    // Supabase handles session storage automatically
    // For superadmin, do not require tenant check after login
    try {
      const defaultTenant = process.env.NEXT_PUBLIC_DEMO_TENANT_ID || "";
      if (defaultTenant) localStorage.setItem("activeTenantId", defaultTenant);
      // This is only for diagnostics, not for login
    } catch {}
  window.location.href = "/sa/dashboard";
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2"
          placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2"
          type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {/* Tenant selection removed from login */}
        <button className="px-4 py-2 rounded bg-black text-white">Sign in</button>
      </form>
      <p className="text-sm text-gray-600">{status}</p>
    </div>
  );
}

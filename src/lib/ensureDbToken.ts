"use client";

export async function ensureDbToken(tenantId: string): Promise<string> {
  if (!tenantId) throw new Error("tenantId is required");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !anon) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL/ANON_KEY");

  // Nếu đã có và chưa hết hạn ~10 phút thì dùng lại
  const cached = typeof window !== "undefined" ? window.localStorage.getItem("dbTokenPayload") : null;
  if (cached) {
    try {
      const { token, tenant_id, exp } = JSON.parse(cached) as { token: string; tenant_id: string; exp: number };
      const now = Math.floor(Date.now() / 1000);
      if (tenant_id === tenantId && exp && exp - now > 120) {
        return token;
      }
    } catch {}
  }

  // Lấy access_token trực tiếp từ Supabase client
  const { getSupabaseBrowser } = await import('./supabase-browser');
  const supabase = getSupabaseBrowser();
  const { data, error } = await supabase.auth.getSession();
  if (error || !data?.session?.access_token) {
    throw new Error("Not signed in (no session). Please login first.");
  }
  const access_token = data.session.access_token;

  // Gọi Edge Function để xin dbToken (có tenant_id)
  const res = await fetch(`${url}/functions/v1/issue-tenant-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": anon,
      "Authorization": `Bearer ${access_token}`,
    },
    body: JSON.stringify({ tenant_id: tenantId }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`issue-tenant-token failed: ${res.status} ${text}`);
  }
  const { token } = await res.json();

  // Giải mã phần payload (không verify) để lấy exp & tenant_id lưu cache
  const [, payloadB64] = token.split(".");
  const payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
  try {
    window.localStorage.setItem("dbTokenPayload", JSON.stringify({ token, tenant_id: payload.tenant_id, exp: payload.exp }));
  } catch {}

  return token;
}

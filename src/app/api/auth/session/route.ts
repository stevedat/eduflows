import { NextResponse } from "next/server";
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = getSupabaseBrowser();

  // Supabase-js v2 không tự đọc cookie trong route; dùng Service: get from header won't work.
  // Giải pháp đơn giản: trên FE gọi supabase.auth.getSession() rồi POST lên đây cũng được.
  // Tuy nhiên để tối giản: thử dùng auth api trực tiếp từ browser thay vì route.
  // => Fallback: đọc session từ localStorage do /login đã lưu (session_json)
  try {
    const stored = typeof window === "undefined" ? null : window.localStorage.getItem("session_json");
    if (stored) {
      const s = JSON.parse(stored);
      if (s?.access_token) return NextResponse.json({ access_token: s.access_token });
    }
  } catch {}

  // Nếu không đọc được (vì route chạy server-side), trả 401.
  return new NextResponse("No session available. Call from client with session JSON if needed.", { status: 401 });
}

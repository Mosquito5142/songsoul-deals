import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// รับรหัสจากลิงก์อีเมลของ Supabase แล้วแลกเป็นเซสชันในคุกกี้
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const failure = NextResponse.redirect(new URL("/admin?error=login", url.origin));

  if (!code) return failure;

  const supabase = await createServerSupabase();
  if (!supabase) return failure;

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return failure;

  return NextResponse.redirect(new URL("/admin", url.origin));
}

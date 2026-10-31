"use client";

import { createBrowserSupabase } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<"magic" | "password" | null>(null);

  async function sendMagicLink() {
    setPending("magic");
    setError(null);
    setMessage(null);
    const supabase = createBrowserSupabase();
    const { error: signError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setPending(null);
    if (signError) {
      setError("ส่งลิงก์ไม่สำเร็จ ตรวจอีเมลหรือลองใหม่ภายหลัง");
      return;
    }
    setMessage("ถ้าส่งได้ ระบบจะส่งลิงก์เข้าสู่ระบบไปที่อีเมลนี้ ตรวจกล่องจดหมายและโฟลเดอร์สแปม");
  }

  async function signInWithPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending("password");
    setError(null);
    setMessage(null);
    const supabase = createBrowserSupabase();
    const { error: signError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setPending(null);
    if (signError) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={signInWithPassword} className="grid gap-4">
      <label className="grid gap-1 text-sm" htmlFor="admin-email">
        <span className="font-medium text-ink">อีเมล</span>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 rounded-xl border border-line bg-white px-3 text-ink"
        />
      </label>
      <label className="grid gap-1 text-sm" htmlFor="admin-password">
        <span className="font-medium text-ink">รหัสผ่าน</span>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 rounded-xl border border-line bg-white px-3 text-ink"
        />
      </label>
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" className="text-sm leading-6 text-ink">
          {message}
        </p>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="submit"
          disabled={pending !== null}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-teal px-4 text-sm font-semibold text-white hover:bg-teal-dark disabled:opacity-60"
        >
          {pending === "password" ? "กำลังเข้าสู่ระบบ" : "เข้าสู่ระบบ"}
        </button>
        <button
          type="button"
          disabled={pending !== null || email.trim() === ""}
          onClick={sendMagicLink}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-line bg-white px-4 text-sm font-medium text-ink hover:border-teal disabled:opacity-60"
        >
          {pending === "magic" ? "กำลังส่งลิงก์" : "ส่งลิงก์ทางอีเมล"}
        </button>
      </div>
      <p className="text-sm leading-6 text-muted">
        ใช้ได้เฉพาะอีเมลที่อยู่ใน ADMIN_EMAILS ถ้ายังไม่มีบัญชี ให้สร้างผู้ใช้ใน Supabase ก่อน หรือให้ลิงก์อีเมลสร้างบัญชีให้เมื่อเปิดการสมัคร
      </p>
    </form>
  );
}

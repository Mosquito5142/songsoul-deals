// อ่านได้ทั้งเบราว์เซอร์และเซิร์ฟเวอร์ จึงใช้เฉพาะตัวแปรที่ขึ้นต้นด้วย NEXT_PUBLIC_

const DEFAULT_SITE_URL = "https://songsoul-deals.vercel.app";

export function getPublicSupabaseEnv(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) return null;

  try {
    const parsed = new URL(url);
    const local = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    if (parsed.protocol === "https:") return { url: parsed.origin, anonKey };
    if (parsed.protocol === "http:" && local) return { url: parsed.origin, anonKey };
  } catch {
    return null;
  }

  return null;
}

export function isSupabaseConfigured(): boolean {
  return getPublicSupabaseEnv() !== null;
}

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;

  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return DEFAULT_SITE_URL;
    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

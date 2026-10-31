// คีย์ฝั่งเซิร์ฟเวอร์เท่านั้น ห้าม import ไฟล์นี้จาก Client Component

export function getServiceRoleKey(): string | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return key ? key : null;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

// รับเฉพาะ https ที่ไม่มี userinfo เพื่อกันลิงก์แปลกในฐานข้อมูล
// อนุญาตทุกโฮสต์เพราะลิงก์พันธมิตรของ Shopee อาจเป็น shopee.co.th หรือตัวย่ออย่าง shope.ee
export function isSafeHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    if (url.username || url.password) return false;
    if (!url.hostname) return false;
    return true;
  } catch {
    return false;
  }
}

export function isSafeImageUrl(value: string): boolean {
  if (value === "") return true;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  return isSafeHttpsUrl(value);
}

// รายชื่อผู้ดูแลอยู่ใน env ไม่ได้อยู่ใน user_metadata
// เพราะผู้ใช้แก้ user_metadata เองได้ จึงใช้เป็นตัวตัดสินสิทธิ์ไม่ได้

export function parseAdminEmails(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0);
}

export function isAllowedAdmin(
  email: string | null | undefined,
  rawList = process.env.ADMIN_EMAILS,
): boolean {
  if (!email) return false;
  return parseAdminEmails(rawList).includes(email.trim().toLowerCase());
}

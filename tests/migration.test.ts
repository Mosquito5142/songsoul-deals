import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

const files = readdirSync("supabase/migrations").filter((name) => name.endsWith(".sql"));
const sql = files.map((name) => readFileSync(`supabase/migrations/${name}`, "utf8")).join("\n");

describe("migration", () => {
  it("เปิด RLS และไม่ให้คนทั่วไปเขียนคลิก", () => {
    expect(files).toHaveLength(1);
    for (const table of ["categories", "products", "clicks", "admin_allowlist"]) {
      expect(sql).toContain(`alter table public.${table} enable row level security`);
    }
    expect(sql).toContain("private.is_admin()");
    expect(sql).not.toMatch(/on public\.clicks[\s\S]{0,120}for insert/i);
  });

  it("สินค้าตัวอย่างไม่มีราคาปลอมและชี้ไปหน้า Shopee ทั่วไป", () => {
    expect(sql).toContain("สินค้าตัวอย่าง");
    expect(sql).toContain("ตัวอย่าง รอใส่ข้อมูลจริง");
    expect(sql).toContain("https://shopee.co.th");
    expect(sql).not.toMatch(/฿\s*\d|\d+\s*บาท|บาท\s*\d+/);
  });
});

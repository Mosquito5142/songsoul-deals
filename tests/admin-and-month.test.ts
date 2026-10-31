import { isAllowedAdmin, parseAdminEmails } from "@/lib/admin-emails";
import { bangkokMonthStartIso, formatBangkokMonth } from "@/lib/month";
import { describe, expect, it } from "vitest";

describe("parseAdminEmails", () => {
  it("ตัดช่องว่างและไม่สนตัวพิมพ์", () => {
    expect(parseAdminEmails(" A@Example.com, ,b@example.com ")).toEqual([
      "a@example.com",
      "b@example.com",
    ]);
    expect(parseAdminEmails(undefined)).toEqual([]);
  });

  it("อนุญาตเฉพาะอีเมลในรายการ", () => {
    const list = "owner@example.com";
    expect(isAllowedAdmin("Owner@Example.com", list)).toBe(true);
    expect(isAllowedAdmin("other@example.com", list)).toBe(false);
    expect(isAllowedAdmin(null, list)).toBe(false);
  });
});

describe("เดือนตามเวลาไทย", () => {
  it("ข้ามวันเมื่อเลยเที่ยงคืนที่กรุงเทพ", () => {
    expect(bangkokMonthStartIso(new Date("2026-10-31T17:30:00.000Z"))).toBe(
      "2026-11-01T00:00:00+07:00",
    );
    expect(bangkokMonthStartIso(new Date("2026-10-31T16:30:00.000Z"))).toBe(
      "2026-10-01T00:00:00+07:00",
    );
  });

  it("รูปแบบชื่อเดือนเป็นภาษาไทย", () => {
    expect(formatBangkokMonth(new Date("2026-10-15T04:00:00.000Z"))).toContain("ตุลาคม");
    expect(formatBangkokMonth(new Date("2026-10-15T04:00:00.000Z"))).toContain("2569");
  });
});

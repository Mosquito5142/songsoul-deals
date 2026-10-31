import { GET } from "@/app/go/[id]/route";
import { handleGo } from "@/lib/go-request";
import { findPublishedProduct, recordClick } from "@/lib/redirect-data";
import { sampleProducts } from "@/lib/sample-data";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/redirect-data", () => ({
  findPublishedProduct: vi.fn(),
  recordClick: vi.fn(),
}));

const findMock = vi.mocked(findPublishedProduct);
const recordMock = vi.mocked(recordClick);
const sample = sampleProducts[0];

describe("handleGo", () => {
  it("ไม่ค้นสินค้าเมื่อรหัสไม่ใช่ uuid", async () => {
    const find = vi.fn();
    const record = vi.fn();
    const result = await handleGo("not-a-uuid", {
      findPublishedProduct: find,
      recordClick: record,
    });
    expect(result).toEqual({ status: 404 });
    expect(find).not.toHaveBeenCalled();
    expect(record).not.toHaveBeenCalled();
  });

  it("ไม่พาไปลิงก์ที่ไม่ใช่ https และไม่นับคลิก", async () => {
    const record = vi.fn();
    const result = await handleGo(sample.id, {
      findPublishedProduct: async () => ({ id: sample.id, affiliateUrl: "http://evil.example" }),
      recordClick: record,
    });
    expect(result).toEqual({ status: 404 });
    expect(record).not.toHaveBeenCalled();
  });

  it("ยังพาไปร้านแม้บันทึกคลิกจะล้มเหลว", async () => {
    const result = await handleGo(sample.id, {
      findPublishedProduct: async () => ({ id: sample.id, affiliateUrl: sample.affiliateUrl }),
      recordClick: async () => {
        throw new Error("db down");
      },
    });
    expect(result).toEqual({ status: 302, location: "https://shopee.co.th" });
  });

  it("ตอบ 404 เมื่อหาสินค้าไม่สำเร็จ", async () => {
    const record = vi.fn();
    const result = await handleGo(sample.id, {
      findPublishedProduct: async () => {
        throw new Error("timeout");
      },
      recordClick: record,
    });
    expect(result).toEqual({ status: 404 });
    expect(record).not.toHaveBeenCalled();
  });
});

describe("GET /go/[id]", () => {
  beforeEach(() => {
    findMock.mockReset();
    recordMock.mockReset();
  });

  it("บันทึกคลิกแล้วเปลี่ยนทางไป Shopee", async () => {
    findMock.mockResolvedValue({ id: sample.id, affiliateUrl: sample.affiliateUrl });
    recordMock.mockResolvedValue();

    const response = await GET(new Request(`http://localhost/go/${sample.id}`), {
      params: Promise.resolve({ id: sample.id }),
    });

    expect(response.status).toBe(302);
    const location = response.headers.get("location");
    expect(location && new URL(location).hostname).toBe("shopee.co.th");
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(recordMock).toHaveBeenCalledWith(sample.id);
  });

  it("ตอบ 404 เมื่อสินค้าไม่ถูกเผยแพร่", async () => {
    findMock.mockResolvedValue(null);
    const response = await GET(new Request("http://localhost/go/missing"), {
      params: Promise.resolve({ id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa9" }),
    });
    expect(response.status).toBe(404);
    expect(recordMock).not.toHaveBeenCalled();
  });
});

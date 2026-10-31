import { handleGo } from "@/lib/go-request";
import { findPublishedProduct, recordClick } from "@/lib/redirect-data";
import { NextResponse } from "next/server";

// ห้ามแคช เพราะต้องบันทึกคลิกทุกรอบ และลิงก์ร้านอาจถูกแก้ในภายหลัง
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const decision = await handleGo(id, { findPublishedProduct, recordClick });

  if (decision.status === 404) {
    return new NextResponse("ไม่พบสินค้า", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  return NextResponse.redirect(decision.location, {
    status: 302,
    headers: { "cache-control": "no-store" },
  });
}

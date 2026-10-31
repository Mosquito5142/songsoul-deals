"use server";

import { getAdminSession } from "@/lib/admin-session";
import { mapCategory, type CategoryRow } from "@/lib/rows";
import { createServerSupabase } from "@/lib/supabase/server";
import { isUuid } from "@/lib/urls";
import { readProductForm, validateProductInput } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function redirectWithError(message: string): never {
  redirect(`/admin?error=${encodeURIComponent(message)}`);
}

async function requireReadyAdmin() {
  const session = await getAdminSession();
  if (session.status === "unconfigured") {
    redirectWithError("ยังไม่ได้ตั้งค่า Supabase");
  }
  if (session.status === "anonymous") {
    redirectWithError("กรุณาเข้าสู่ระบบก่อน");
  }
  if (session.status === "forbidden") {
    redirectWithError("บัญชีนี้ไม่มีสิทธิ์ผู้ดูแล");
  }
  if (!session.allowlistSynced) {
    redirectWithError("ยังลงทะเบียนผู้ดูแลไม่ได้ ตรวจ SUPABASE_SERVICE_ROLE_KEY");
  }
  return session;
}

function productPayload(value: ReturnType<typeof readProductForm>) {
  return {
    category_id: value.categoryId,
    name: value.name,
    price_note: value.priceNote,
    review: value.review,
    image_url: value.imageUrl,
    affiliate_url: value.affiliateUrl,
    published: value.published,
    is_sample: value.isSample,
    sort_order: value.sortOrder,
  };
}

async function categoryIds(supabase: Awaited<ReturnType<typeof requireReadyAdmin>>["supabase"]) {
  const { data, error } = await supabase.from("categories").select("id, slug, name, description, sort_order");
  if (error || !data) return [];
  return (data as CategoryRow[]).map(mapCategory).map((category) => category.id);
}

async function saveProduct(formData: FormData, mode: "create" | "update") {
  const session = await requireReadyAdmin();
  const parsed = validateProductInput(
    readProductForm(formData),
    await categoryIds(session.supabase),
  );
  if (!parsed.ok) redirectWithError(parsed.errors[0] ?? "ข้อมูลสินค้าไม่ถูกต้อง");

  if (mode === "create") {
    const { error } = await session.supabase.from("products").insert(productPayload(parsed.value));
    if (error) redirectWithError("บันทึกสินค้าไม่สำเร็จ");
  } else {
    const id = String(formData.get("id") ?? "");
    if (!isUuid(id)) redirectWithError("ไม่พบสินค้าที่ต้องการแก้");
    const { error } = await session.supabase.from("products").update(productPayload(parsed.value)).eq("id", id);
    if (error) redirectWithError("แก้ไขสินค้าไม่สำเร็จ");
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?saved=1");
}

export async function createProductAction(formData: FormData) {
  await saveProduct(formData, "create");
}

export async function updateProductAction(formData: FormData) {
  await saveProduct(formData, "update");
}

export async function deleteProductAction(formData: FormData) {
  const session = await requireReadyAdmin();
  const id = String(formData.get("id") ?? "");
  if (!isUuid(id)) redirectWithError("ไม่พบสินค้าที่ต้องการลบ");

  const { error } = await session.supabase.from("products").delete().eq("id", id);
  if (error) redirectWithError("ลบสินค้าไม่สำเร็จ");

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?saved=1");
}

export async function signOutAction() {
  const supabase = await createServerSupabase();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin");
}

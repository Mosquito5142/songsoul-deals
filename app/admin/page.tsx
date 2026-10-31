import { AdminPanel } from "@/components/admin-panel";
import { LoginForm } from "@/components/login-form";
import { signOutAction } from "@/app/admin/actions";
import { loadClickStats } from "@/lib/admin-stats";
import { getAdminSession } from "@/lib/admin-session";
import { mapCategory, mapProduct, type CategoryRow, type ProductRow } from "@/lib/rows";
import type { Category, Product } from "@/lib/types";

export const dynamic = "force-dynamic";

const notices: Record<string, string> = {
  login: "ลิงก์เข้าสู่ระบบใช้ไม่ได้หรือหมดอายุ ลองส่งใหม่",
  saved: "บันทึกแล้ว",
};

function noticeFromQuery(error?: string, saved?: string): string | null {
  if (saved === "1") return notices.saved;
  if (!error) return null;
  return notices[error] ?? error;
}

async function loadAdminCatalog(session: Extract<Awaited<ReturnType<typeof getAdminSession>>, { status: "ready" }>) {
  const [categoriesResult, productsResult, clickSummary] = await Promise.all([
    session.supabase.from("categories").select("id, slug, name, description, sort_order").order("sort_order"),
    session.supabase
      .from("products")
      .select(
        "id, category_id, name, price_note, review, image_url, affiliate_url, published, is_sample, sort_order",
      )
      .order("sort_order"),
    loadClickStats(session.supabase),
  ]);

  const categories: Category[] = categoriesResult.error
    ? []
    : ((categoriesResult.data ?? []) as CategoryRow[]).map(mapCategory);
  const products: Product[] = productsResult.error
    ? []
    : ((productsResult.data ?? []) as ProductRow[]).map(mapProduct);

  return { categories, products, ...clickSummary };
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const query = await searchParams;
  const notice = noticeFromQuery(query.error, query.saved);
  const session = await getAdminSession();

  if (session.status === "unconfigured") {
    return (
      <div className="mx-auto grid w-full max-w-xl gap-3 px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-semibold text-ink">ยังไม่ได้เชื่อม Supabase</h1>
        <p className="text-sm leading-7 text-muted">
          หน้าร้านยังแสดงสินค้าตัวอย่างได้ แต่หน้านี้ใช้เพิ่มสินค้าจริงได้เมื่อตั้งค่าตัวแปรสภาพแวดล้อมตาม README
        </p>
      </div>
    );
  }

  if (session.status === "anonymous") {
    return (
      <div className="mx-auto grid w-full max-w-md gap-6 px-4 py-10 sm:px-6 sm:py-16">
        <div>
          <h1 className="text-2xl font-semibold text-ink">เข้าสู่ระบบผู้ดูแล</h1>
          <p className="mt-2 text-sm leading-6 text-muted">ใช้รหัสผ่านหรือลิงก์ที่ส่งไปทางอีเมล</p>
        </div>
        {notice ? (
          <p role="alert" className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink">
            {notice}
          </p>
        ) : null}
        <LoginForm />
      </div>
    );
  }

  if (session.status === "forbidden") {
    return (
      <div className="mx-auto grid w-full max-w-xl gap-4 px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-semibold text-ink">ยังไม่มีสิทธิ์ผู้ดูแล</h1>
        <p className="break-all text-sm leading-7 text-muted">
          บัญชี {session.email} ยังไม่อยู่ใน ADMIN_EMAILS
        </p>
        <form action={signOutAction}>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-line bg-white px-4 text-sm font-medium"
          >
            ออกจากระบบ
          </button>
        </form>
      </div>
    );
  }

  const catalog = await loadAdminCatalog(session);

  return (
    <AdminPanel
      email={session.email}
      allowlistSynced={session.allowlistSynced}
      categories={catalog.categories}
      products={catalog.products}
      stats={catalog.stats}
      statsAvailable={catalog.available && session.allowlistSynced}
      notice={notice}
    />
  );
}

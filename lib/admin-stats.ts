import { bangkokMonthStartIso } from "@/lib/month";
import type { ClickStat } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type SummaryRow = {
  product_id: string;
  total_clicks: number | string;
  month_clicks: number | string;
};

export async function loadClickStats(
  supabase: SupabaseClient,
): Promise<{ stats: ClickStat[]; available: boolean }> {
  const { data, error } = await supabase.rpc("admin_click_summary", {
    month_start: bangkokMonthStartIso(),
  });

  if (error || !Array.isArray(data)) {
    return { stats: [], available: false };
  }

  const stats = (data as SummaryRow[]).map((row) => ({
    productId: row.product_id,
    totalClicks: Number(row.total_clicks) || 0,
    monthClicks: Number(row.month_clicks) || 0,
  }));

  return { stats, available: true };
}

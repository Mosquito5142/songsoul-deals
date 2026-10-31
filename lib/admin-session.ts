import { isAllowedAdmin } from "@/lib/admin-emails";
import { isSupabaseConfigured } from "@/lib/public-env";
import { createServerSupabase } from "@/lib/supabase/server";
import { createServiceSupabase } from "@/lib/supabase/service";
import type { SupabaseClient } from "@supabase/supabase-js";

export type AdminSession =
  | { status: "unconfigured" }
  | { status: "anonymous" }
  | { status: "forbidden"; email: string }
  | {
      status: "ready";
      email: string;
      supabase: SupabaseClient;
      allowlistSynced: boolean;
    };

export async function getAdminSession(): Promise<AdminSession> {
  if (!isSupabaseConfigured()) return { status: "unconfigured" };

  const supabase = await createServerSupabase();
  if (!supabase) return { status: "unconfigured" };

  const { data, error } = await supabase.auth.getClaims();
  const email = data?.claims.email;
  if (error || !email) return { status: "anonymous" };
  if (!isAllowedAdmin(email)) return { status: "forbidden", email };

  const service = createServiceSupabase();
  if (!service) {
    return { status: "ready", email, supabase, allowlistSynced: false };
  }

  const { error: upsertError } = await service
    .from("admin_allowlist")
    .upsert({ email: email.trim().toLowerCase() });

  return {
    status: "ready",
    email,
    supabase,
    allowlistSynced: !upsertError,
  };
}

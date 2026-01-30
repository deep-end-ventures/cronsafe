import { createServerComponentClient } from "@/lib/supabase-server";
import { DashboardContent } from "@/components/DashboardContent";
import { DashboardNav } from "@/components/DashboardNav";
import { Monitor } from "@/types";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createServerComponentClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/login");
  }

  const { data: monitors, error } = await supabase
    .from("monitors")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching monitors:", error);
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <DashboardNav userEmail={user.email} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <DashboardContent monitors={(monitors as Monitor[]) || []} />
      </main>
    </div>
  );
}

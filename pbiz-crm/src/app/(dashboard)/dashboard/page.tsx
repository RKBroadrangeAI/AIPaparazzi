import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

const roleRedirects: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  MANAGER: "/dashboard/manager",
  CONSULTANT: "/dashboard/consultant",
};

export default async function DashboardRedirect() {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  redirect(roleRedirects[session.role] ?? "/dashboard/consultant");
}

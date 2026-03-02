import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import type { SessionUser } from "@/components/layout/session-provider";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const dbUser = await db.pbizUser.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  });

  if (!dbUser) redirect("/sign-in");

  const user: SessionUser = {
    id: dbUser.id,
    email: dbUser.email,
    firstName: dbUser.firstName,
    lastName: dbUser.lastName,
    role: dbUser.role,
  };

  return <DashboardShell user={user}>{children}</DashboardShell>;
}

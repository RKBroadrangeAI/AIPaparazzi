import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getDashboardStats,
  getDealsByPipeline,
  getRecentActivities,
  getUpcomingAppointments,
} from "@/lib/data";
import { StatsRow } from "@/components/dashboard/stats-row";
import { DealPipeline } from "@/components/dashboard/deal-pipeline";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Target, Users, ShoppingBag, DollarSign } from "lucide-react";

export default async function ManagerDashboard() {
  const session = await getSession();
  if (!session || session.role !== "MANAGER") redirect("/dashboard");

  const [stats, deals, activities] = await Promise.all([
    getDashboardStats(),
    getDealsByPipeline(),
    getRecentActivities(8),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">
          Manager Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Team performance & deal tracking.
        </p>
      </div>

      <StatsRow
        stats={[
          { label: "Active Leads", value: stats.activeLeads, icon: Target },
          { label: "Customers", value: stats.totalCustomers, icon: Users },
          { label: "Open Deals", value: stats.openDeals, icon: ShoppingBag },
          { label: "Pipeline Value", value: `$${(stats.pipelineValue / 1000).toFixed(1)}K`, icon: DollarSign },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <DealPipeline deals={deals as any} />
        <ActivityFeed activities={activities as any} />
      </div>
    </div>
  );
}

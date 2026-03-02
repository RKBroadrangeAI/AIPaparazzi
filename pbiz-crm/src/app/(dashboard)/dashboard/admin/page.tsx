import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getDashboardStats,
  getSystemStats,
  getDealsByPipeline,
  getRecentActivities,
  getUpcomingAppointments,
  getOverdueFollowUps,
  getLowStockProducts,
} from "@/lib/data";
import { StatsRow } from "@/components/dashboard/stats-row";
import { DealPipeline } from "@/components/dashboard/deal-pipeline";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import {
  Target,
  Users,
  ShoppingBag,
  DollarSign,
  UserCog,
  Package,
  AlertTriangle,
  CalendarClock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/dashboard");

  const [stats, system, deals, activities, appointments, overdue, lowStock] =
    await Promise.all([
      getDashboardStats(),
      getSystemStats(),
      getDealsByPipeline(),
      getRecentActivities(10),
      getUpcomingAppointments(5),
      getOverdueFollowUps(),
      getLowStockProducts(),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Welcome back — here's your store overview.
        </p>
      </div>

      <StatsRow
        stats={[
          { label: "Active Leads", value: stats.activeLeads, icon: Target, change: "+12%" },
          { label: "Customers", value: stats.totalCustomers, icon: Users, change: "+5%" },
          { label: "Open Deals", value: stats.openDeals, icon: ShoppingBag },
          { label: "Pipeline Value", value: `$${(stats.pipelineValue / 1000).toFixed(1)}K`, icon: DollarSign },
        ]}
      />

      <StatsRow
        stats={[
          { label: "Consultants", value: system.totalConsultants, icon: UserCog },
          { label: "Total Products", value: system.totalProducts, icon: Package },
          { label: "Low Stock", value: lowStock.length, icon: AlertTriangle },
          { label: "Appointments Today", value: appointments.length, icon: CalendarClock },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <DealPipeline deals={deals as any} />
        <ActivityFeed activities={activities as any} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Overdue follow-ups */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-red-600">
              Overdue Follow-ups
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overdue.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">All caught up!</p>
            ) : (
              <div className="space-y-2">
                {overdue.map((f: any) => (
                  <div key={f.id} className="flex items-center justify-between rounded-lg border border-red-100 px-3 py-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-900">{f.title}</span>
                      <span className="text-[10px] text-gray-400">{f.lead?.firstName} {f.lead?.lastName}</span>
                    </div>
                    <Badge variant="secondary" className="bg-red-100 text-red-700 text-[9px]">Overdue</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low stock */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-amber-600">
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStock.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Stock levels OK</p>
            ) : (
              <div className="space-y-2">
                {lowStock.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border border-amber-100 px-3 py-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-900">{p.name}</span>
                      <span className="text-[10px] text-gray-400">{p.sku} · {p.category}</span>
                    </div>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-[9px]">{p.stockQty} left</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming appointments */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No upcoming appointments</p>
            ) : (
              <div className="space-y-2">
                {appointments.map((a: any) => (
                  <div key={a.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-900">{a.title}</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(a.startTime).toLocaleDateString()} · {a.type.replace("_", " ")}
                      </span>
                    </div>
                    <Badge variant="secondary" className="bg-[#C8658E]/10 text-[#C8658E] text-[9px]">{a.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDashboardStats, getRecentActivities, getUpcomingAppointments, getPendingTasks } from "@/lib/data";
import { StatsRow } from "@/components/dashboard/stats-row";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Target, ShoppingBag, CalendarClock, CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ConsultantDashboard() {
  const session = await getSession();
  if (!session || session.role !== "CONSULTANT") redirect("/dashboard");

  const [stats, activities, appointments, tasks] = await Promise.all([
    getDashboardStats(),
    getRecentActivities(5),
    getUpcomingAppointments(5),
    getPendingTasks(5),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">
          My Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Your leads, appointments & tasks at a glance.
        </p>
      </div>

      <StatsRow
        stats={[
          { label: "My Leads", value: stats.activeLeads, icon: Target },
          { label: "Open Deals", value: stats.openDeals, icon: ShoppingBag },
          { label: "Appointments", value: appointments.length, icon: CalendarClock },
          { label: "Pending Tasks", value: tasks.length, icon: CheckSquare },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityFeed activities={activities as any} />

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

import { getDashboardStats } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Target, DollarSign, ShoppingBag } from "lucide-react";

export default async function ReportsPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500">Analytics & performance metrics</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#C8658E]/10">
              <Target className="size-5 text-[#C8658E]" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.activeLeads}</p>
              <p className="text-xs text-gray-500">Total Leads</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-blue-100">
              <Users className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.totalCustomers}</p>
              <p className="text-xs text-gray-500">Total Customers</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-100">
              <ShoppingBag className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.openDeals}</p>
              <p className="text-xs text-gray-500">Open Deals</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-amber-100">
              <DollarSign className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">${(stats.pipelineValue / 1000).toFixed(1)}K</p>
              <p className="text-xs text-gray-500">Pipeline Value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Lead Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "New", count: stats.activeLeads, pct: 100 },
                { label: "Contacted", count: Math.floor(stats.activeLeads * 0.7), pct: 70 },
                { label: "Qualified", count: Math.floor(stats.activeLeads * 0.4), pct: 40 },
                { label: "Converted", count: Math.floor(stats.activeLeads * 0.2), pct: 20 },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{s.label}</span>
                    <span className="font-medium">{s.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-[#C8658E]"
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Revenue by Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Retail", value: stats.pipelineValue * 0.45, color: "bg-[#C8658E]" },
                { label: "Wholesale", value: stats.pipelineValue * 0.30, color: "bg-blue-500" },
                { label: "Custom Order", value: stats.pipelineValue * 0.15, color: "bg-amber-500" },
                { label: "Event", value: stats.pipelineValue * 0.10, color: "bg-emerald-500" },
              ].map((p) => (
                <div key={p.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{p.label}</span>
                    <span className="font-medium">${(p.value / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className={`h-2 rounded-full ${p.color}`}
                      style={{
                        width: `${stats.pipelineValue > 0 ? (p.value / stats.pipelineValue) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Monthly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3 text-center">
              <TrendingUp className="size-10 text-gray-300" />
              <p className="text-sm text-gray-400">Interactive charts coming soon.</p>
              <p className="text-xs text-gray-300">Recharts integration for trend analysis</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

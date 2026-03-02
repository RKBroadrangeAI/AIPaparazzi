import { getDealsByPipeline } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign } from "lucide-react";

const stageColors: Record<string, string> = {
  PROSPECTING: "bg-gray-100 text-gray-700",
  QUALIFICATION: "bg-blue-100 text-blue-700",
  PROPOSAL: "bg-purple-100 text-purple-700",
  NEGOTIATION: "bg-amber-100 text-amber-700",
  CLOSED_WON: "bg-emerald-100 text-emerald-700",
  CLOSED_LOST: "bg-red-100 text-red-700",
};

const pipelineLabels: Record<string, string> = {
  RETAIL: "Retail",
  WHOLESALE: "Wholesale",
  CUSTOM_ORDER: "Custom Order",
  EVENT: "Event",
};

export default async function DealsPage() {
  const allDeals = await getDealsByPipeline();

  const grouped: Record<string, any[]> = {};
  for (const d of allDeals) {
    const p = (d as any).pipeline || "RETAIL";
    if (!grouped[p]) grouped[p] = [];
    grouped[p].push(d);
  }

  const totalValue = allDeals.reduce((sum: number, d: any) => sum + (d.value || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Deals</h1>
          <p className="text-sm text-gray-500">
            {allDeals.length} active deals · ${totalValue.toLocaleString()} total pipeline
          </p>
        </div>
        <Button size="sm" className="h-9 bg-[#C8658E] hover:bg-[#B8557E]">
          <Plus className="mr-1 size-4" /> New Deal
        </Button>
      </div>

      {Object.entries(grouped).length === 0 ? (
        <Card className="border-none shadow-sm">
          <CardContent className="py-12 text-center">
            <DollarSign className="mx-auto size-10 text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">No deals in pipeline yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([pipeline, pDeals]) => (
            <div key={pipeline}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">
                  {pipelineLabels[pipeline] ?? pipeline}
                </h2>
                <span className="text-xs text-gray-400">{pDeals.length} deals</span>
              </div>
              <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                          <th className="px-4 py-3 font-medium">Title</th>
                          <th className="px-4 py-3 font-medium">Customer / Lead</th>
                          <th className="px-4 py-3 font-medium">Value</th>
                          <th className="px-4 py-3 font-medium">Stage</th>
                          <th className="px-4 py-3 font-medium">Assigned</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pDeals.map((d: any) => (
                          <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{d.title || d.category}</td>
                            <td className="px-4 py-3 text-xs text-gray-500">
                              {d.customer ? `${d.customer.firstName} ${d.customer.lastName}` : "—"}
                            </td>
                            <td className="px-4 py-3 text-xs font-semibold text-gray-700">${d.value?.toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <Badge variant="secondary" className={`text-[10px] ${stageColors[d.stage] ?? ""}`}>
                                {d.stage?.replace("_", " ")}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">
                              {d.assignedTo ? `${d.assignedTo.firstName} ${d.assignedTo.lastName}` : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

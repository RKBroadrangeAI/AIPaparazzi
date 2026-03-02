"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Deal {
  id: string;
  value: number;
  stage: string;
  pipeline: string;
  category: string;
  customer: { firstName: string; lastName: string } | null;
}

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

export function DealPipeline({ deals }: { deals: Deal[] }) {
  const grouped: Record<string, Deal[]> = {};
  for (const d of deals) {
    const p = d.pipeline || "RETAIL";
    if (!grouped[p]) grouped[p] = [];
    grouped[p].push(d);
  }

  const pipelines = Object.entries(grouped);

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-900">Deal Pipeline</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {pipelines.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">No active deals</p>
        ) : (
          <div className="space-y-5">
            {pipelines.map(([pipeline, pDeals]) => (
              <div key={pipeline}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    {pipelineLabels[pipeline] ?? pipeline}
                  </span>
                  <span className="text-xs text-gray-400">{pDeals.length} deals</span>
                </div>
                <div className="space-y-2">
                  {pDeals.slice(0, 5).map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium text-gray-900">{d.category}</span>
                        <span className="text-[10px] text-gray-400">
                          {d.customer ? `${d.customer.firstName} ${d.customer.lastName}` : "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-700">
                          ${d.value.toLocaleString()}
                        </span>
                        <Badge
                          variant="secondary"
                          className={cn("text-[9px]", stageColors[d.stage] ?? "")}
                        >
                          {d.stage.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

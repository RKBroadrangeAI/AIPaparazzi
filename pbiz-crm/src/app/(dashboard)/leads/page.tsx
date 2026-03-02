import { getLeads } from "@/lib/data";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-purple-100 text-purple-700",
  QUALIFIED: "bg-emerald-100 text-emerald-700",
  NURTURING: "bg-amber-100 text-amber-700",
  CONVERTED: "bg-green-100 text-green-700",
  LOST: "bg-red-100 text-red-700",
};

const sourceLabels: Record<string, string> = {
  WEBSITE: "Website",
  REFERRAL: "Referral",
  SOCIAL_MEDIA: "Social",
  WALK_IN: "Walk-in",
  EVENT: "Event",
  ADVERTISING: "Ad",
  OTHER: "Other",
};

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500">{leads.length} total leads in pipeline</p>
        </div>
        <div className="flex gap-2">
          <Link href="/leads/import">
            <Button variant="outline" size="sm" className="h-9">
              Import
            </Button>
          </Link>
          <Button size="sm" className="h-9 bg-[#C8658E] hover:bg-[#B8557E]">
            <Plus className="mr-1 size-4" /> Add Lead
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                  <th className="px-4 py-3 font-medium">Style Interest</th>
                  <th className="px-4 py-3 font-medium">Assigned</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead: any) => (
                  <tr
                    key={lead.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-[#C8658E] transition-colors"
                      >
                        {lead.firstName} {lead.lastName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{lead.email || "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className={`text-[10px] ${statusColors[lead.status] ?? ""}`}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {sourceLabels[lead.source] ?? lead.source}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-700">
                      {lead.aiScore ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {lead.styleInterest || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {lead.assignedTo
                        ? `${lead.assignedTo.firstName} ${lead.assignedTo.lastName}`
                        : lead.consultant
                        ? lead.consultant.name
                        : "Unassigned"}
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-xs text-gray-400">
                      No leads yet. Add your first lead to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

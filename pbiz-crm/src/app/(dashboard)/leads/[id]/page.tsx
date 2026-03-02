import { notFound } from "next/navigation";
import { getLead } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag, User } from "lucide-react";

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-purple-100 text-purple-700",
  QUALIFIED: "bg-emerald-100 text-emerald-700",
  NURTURING: "bg-amber-100 text-amber-700",
  CONVERTED: "bg-green-100 text-green-700",
  LOST: "bg-red-100 text-red-700",
};

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/leads">
          <Button variant="ghost" size="sm" className="h-8 gap-1">
            <ArrowLeft className="size-4" /> Back
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-bold text-gray-900">
              {lead.firstName} {lead.lastName}
            </h1>
            <Badge variant="secondary" className={statusColors[lead.status] ?? ""}>
              {lead.status}
            </Badge>
          </div>
        </div>
        <Button size="sm" className="bg-[#C8658E] hover:bg-[#B8557E]">
          Convert to Customer
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lead.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="size-4 text-gray-400" />
                  <span>{lead.email}</span>
                </div>
              )}
              {lead.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="size-4 text-gray-400" />
                  <span>{lead.phone}</span>
                </div>
              )}
              {lead.referredBy && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="size-4 text-gray-400" />
                  <span>Referred by: {lead.referredBy}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Style Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500">Style Interest</span>
                  <p className="font-medium">{lead.styleInterest || "—"}</p>
                </div>
                <div>
                  <span className="text-gray-500">Size Preference</span>
                  <p className="font-medium">{lead.sizePreference || "—"}</p>
                </div>
                <div>
                  <span className="text-gray-500">AI Score</span>
                  <p className="font-medium">{lead.aiScore ?? "—"}</p>
                </div>
                <div>
                  <span className="text-gray-500">Source</span>
                  <p className="font-medium">{lead.source}</p>
                </div>
              </div>
              {lead.notes && (
                <div>
                  <span className="text-gray-500">Notes</span>
                  <p className="mt-1 text-gray-700">{lead.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {lead.tasks && lead.tasks.length > 0 ? (
                <div className="space-y-3">
                  {lead.tasks.map((t: any) => (
                    <div key={t.id} className="flex items-start gap-3 border-b border-gray-50 pb-3 last:border-0">
                      <Badge variant="secondary" className="mt-0.5 text-[9px]">{t.status}</Badge>
                      <div>
                        <p className="text-xs text-gray-700">{t.title}</p>
                        <p className="text-[10px] text-gray-400">
                          {t.dueDate ? new Date(t.dueDate).toLocaleString() : "No due date"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">No tasks yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Assigned Consultant</CardTitle>
            </CardHeader>
            <CardContent>
              {lead.consultant ? (
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#C8658E]/10 text-sm font-bold text-[#C8658E]">
                    {lead.consultant.name?.[0] ?? "C"}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{lead.consultant.name}</p>
                    <p className="text-[10px] text-gray-400">{lead.consultant.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-4">
                  <User className="size-8 text-gray-300" />
                  <p className="text-xs text-gray-400">Not assigned</p>
                  <Button size="sm" variant="outline" className="mt-1">Assign</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start h-9 text-xs">
                <Mail className="mr-2 size-3.5" /> Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start h-9 text-xs">
                <Phone className="mr-2 size-3.5" /> Log Call
              </Button>
              <Button variant="outline" className="w-full justify-start h-9 text-xs">
                <ShoppingBag className="mr-2 size-3.5" /> Create Deal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

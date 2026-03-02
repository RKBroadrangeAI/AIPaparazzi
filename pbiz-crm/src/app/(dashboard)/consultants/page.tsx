import { getConsultants } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, UserCog } from "lucide-react";

export default async function ConsultantsPage() {
  const consultants = await getConsultants();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Consultants</h1>
          <p className="text-sm text-gray-500">{consultants.length} style consultants</p>
        </div>
        <Button size="sm" className="h-9 bg-[#C8658E] hover:bg-[#B8557E]">
          <Plus className="mr-1 size-4" /> Add Consultant
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {consultants.map((c: any) => (
          <Card key={c.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-[#C8658E]/10 text-sm font-bold text-[#C8658E]">
                  {c.name?.[0] ?? "C"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {c.name}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">{c.email}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={c.isActive ? "bg-emerald-100 text-emerald-700 text-[9px]" : "bg-red-100 text-red-700 text-[9px]"}
                >
                  {c.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">{c._count?.leads ?? 0}</p>
                  <p className="text-[10px] text-gray-400">Leads</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{c._count?.appointments ?? 0}</p>
                  <p className="text-[10px] text-gray-400">Appointments</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{c._count?.messages ?? 0}</p>
                  <p className="text-[10px] text-gray-400">Messages</p>
                </div>
              </div>
              {c.specialties && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {c.specialties.split(",").map((s: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-[9px] bg-gray-100 text-gray-600">
                      {s.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {consultants.length === 0 && (
          <Card className="col-span-full border-none shadow-sm">
            <CardContent className="py-12 text-center">
              <UserCog className="mx-auto size-10 text-gray-300 mb-3" />
              <p className="text-sm text-gray-400">No consultants added yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

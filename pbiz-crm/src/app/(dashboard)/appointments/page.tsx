import { getUpcomingAppointments } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";

const typeColors: Record<string, string> = {
  STYLE_CONSULT: "bg-[#C8658E]/15 text-[#C8658E]",
  FITTING: "bg-blue-100 text-blue-700",
  PICKUP: "bg-emerald-100 text-emerald-700",
  VIRTUAL: "bg-purple-100 text-purple-700",
};

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-gray-200 text-gray-700",
  CANCELLED: "bg-red-100 text-red-700",
  NO_SHOW: "bg-amber-100 text-amber-700",
};

export default async function AppointmentsPage() {
  const appointments = await getUpcomingAppointments(50);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500">Style consultations, fittings & pickups</p>
        </div>
        <Button size="sm" className="h-9 bg-[#C8658E] hover:bg-[#B8557E]">
          <Plus className="mr-1 size-4" /> Book Appointment
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Date & Time</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Customer / Lead</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a: any) => (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{a.title}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(a.startTime).toLocaleDateString()} at {new Date(a.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className={`text-[10px] ${typeColors[a.type] ?? ""}`}>
                        {a.type?.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {a.customer ? `${a.customer.firstName} ${a.customer.lastName}` :
                       a.lead ? `${a.lead.firstName} ${a.lead.lastName}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className={`text-[10px] ${statusColors[a.status] ?? ""}`}>
                        {a.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-xs text-gray-400">
                      No upcoming appointments.
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

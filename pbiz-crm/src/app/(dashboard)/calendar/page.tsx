import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPage() {
  const today = new Date();
  const month = today.toLocaleString("default", { month: "long", year: "numeric" });

  // Generate calendar grid for current month
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const startPad = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const days = [];
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-sm text-gray-500">Schedule & manage appointments</p>
        </div>
        <Button size="sm" className="h-9 bg-[#C8658E] hover:bg-[#B8557E]">
          <CalendarClock className="mr-1 size-4" /> New Event
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold">{month}</CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="size-8 p-0">
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="ghost" size="sm" className="size-8 p-0">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="bg-gray-50 px-2 py-2 text-center text-[10px] font-medium text-gray-500">
                {d}
              </div>
            ))}
            {days.map((day, i) => (
              <div
                key={i}
                className={`min-h-[80px] bg-white p-2 ${
                  day === today.getDate()
                    ? "ring-2 ring-inset ring-[#C8658E]/40"
                    : ""
                }`}
              >
                {day && (
                  <span
                    className={`inline-flex size-6 items-center justify-center rounded-full text-xs ${
                      day === today.getDate()
                        ? "bg-[#C8658E] text-white font-bold"
                        : "text-gray-700"
                    }`}
                  >
                    {day}
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

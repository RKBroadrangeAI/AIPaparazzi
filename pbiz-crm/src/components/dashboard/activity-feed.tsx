"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: string;
  description: string;
  createdAt: string | Date;
  user: { firstName: string; lastName: string } | null;
}

const typeColors: Record<string, string> = {
  NOTE: "bg-blue-100 text-blue-700",
  EMAIL: "bg-purple-100 text-purple-700",
  CALL: "bg-green-100 text-green-700",
  MEETING: "bg-amber-100 text-amber-700",
  FOLLOW_UP: "bg-[#C8658E]/15 text-[#C8658E]",
  STATUS_CHANGE: "bg-gray-100 text-gray-700",
  TASK: "bg-cyan-100 text-cyan-700",
};

export function ActivityFeed({ activities }: { activities: Activity[] }) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {activities.length === 0 ? (
          <p className="px-4 py-8 text-center text-xs text-gray-400">No recent activity</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {activities.map((a) => (
              <div key={a.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors">
                <div className="mt-0.5">
                  <Badge
                    variant="secondary"
                    className={`text-[9px] ${typeColors[a.type] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {a.type}
                  </Badge>
                </div>
                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <span className="text-xs text-gray-700 line-clamp-2">{a.description}</span>
                  <div className="flex items-center gap-2">
                    {a.user && (
                      <span className="text-[10px] font-medium text-gray-400">
                        {a.user.firstName} {a.user.lastName}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-300">
                      {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

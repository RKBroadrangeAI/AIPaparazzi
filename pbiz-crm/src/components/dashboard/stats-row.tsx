"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: number | string;
  change?: string;
  icon: LucideIcon;
  href?: string;
}

export function StatsRow({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s, i) => {
        const Icon = s.icon;
        const positive = s.change?.startsWith("+");
        return (
          <Card key={i} className="group border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#C8658E]/10 group-hover:bg-[#C8658E]/15 transition-colors">
                <Icon className="size-5 text-[#C8658E]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[22px] font-bold text-gray-900">
                  {typeof s.value === "number" ? s.value.toLocaleString() : s.value}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">{s.label}</span>
                  {s.change && (
                    <span
                      className={cn(
                        "text-[10px] font-medium",
                        positive ? "text-emerald-600" : "text-red-500"
                      )}
                    >
                      {s.change}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

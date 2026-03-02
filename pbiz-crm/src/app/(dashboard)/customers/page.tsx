import { getCustomers } from "@/lib/data";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

const tierColors: Record<string, string> = {
  VIP: "bg-[#C8658E]/15 text-[#C8658E]",
  GOLD: "bg-amber-100 text-amber-700",
  SILVER: "bg-gray-200 text-gray-700",
  BRONZE: "bg-orange-100 text-orange-700",
  STANDARD: "bg-blue-100 text-blue-700",
};

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500">{customers.length} active customers</p>
        </div>
        <Button size="sm" className="h-9 bg-[#C8658E] hover:bg-[#B8557E]">
          <Plus className="mr-1 size-4" /> Add Customer
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Tier</th>
                  <th className="px-4 py-3 font-medium">Total Spend</th>
                  <th className="px-4 py-3 font-medium">Orders</th>
                  <th className="px-4 py-3 font-medium">VIP</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c: any) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/customers/${c.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-[#C8658E] transition-colors"
                      >
                        {c.firstName} {c.lastName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{c.email}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{c.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className={`text-[10px] ${c.isVip ? tierColors.VIP : tierColors.STANDARD}`}>
                        {c.isVip ? "VIP" : "Standard"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-700">
                      ${c.totalSpend?.toLocaleString() ?? "0"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {c._count?.orders ?? 0}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {c.isVip ? "Yes" : "—"}
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-xs text-gray-400">
                      No customers yet.
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

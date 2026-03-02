import { notFound } from "next/navigation";
import { getCustomer } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag, Calendar } from "lucide-react";

const tierColors: Record<string, string> = {
  VIP: "bg-[#C8658E]/15 text-[#C8658E]",
  GOLD: "bg-amber-100 text-amber-700",
  SILVER: "bg-gray-200 text-gray-700",
  BRONZE: "bg-orange-100 text-orange-700",
  STANDARD: "bg-blue-100 text-blue-700",
};

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomer(id);
  if (!customer) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/customers">
          <Button variant="ghost" size="sm" className="h-8 gap-1">
            <ArrowLeft className="size-4" /> Back
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-bold text-gray-900">
              {customer.firstName} {customer.lastName}
            </h1>
            <Badge variant="secondary" className={customer.isVip ? tierColors.VIP : tierColors.STANDARD}>
              {customer.isVip ? "VIP" : "Standard"}
            </Badge>
          </div>
          <p className="text-sm text-gray-500">
            Customer since {new Date(customer.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="size-4 text-gray-400" />
                <span>{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="size-4 text-gray-400" />
                  <span>{customer.phone}</span>
                </div>
              )}
              {customer.notes && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="size-4 text-gray-400" />
                  <span>{customer.notes}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Style Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Size Profile</span>
                  <p className="font-medium">{customer.sizeProfile || "—"}</p>
                </div>
                <div>
                  <span className="text-gray-500">Preferences</span>
                  <p className="font-medium">{customer.preferences || "—"}</p>
                </div>
                <div>
                  <span className="text-gray-500">Total Spend</span>
                  <p className="font-medium">${customer.totalSpend?.toLocaleString() ?? "0"}</p>
                </div>
                <div>
                  <span className="text-gray-500">Total Orders</span>
                  <p className="font-medium">{customer.orders?.length ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {customer.orders && customer.orders.length > 0 ? (
                <div className="space-y-2">
                  {customer.orders.map((o: any) => (
                    <div key={o.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-900">Order #{o.id.slice(-6)}</span>
                        <span className="text-[10px] text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">${o.total?.toLocaleString()}</span>
                        <Badge variant="secondary" className="text-[9px]">{o.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">No orders yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Customer Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">VIP Status</span>
                <span className="font-medium">{customer.isVip ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">AI Score</span>
                <span className="font-medium">{customer.aiScore}</span>
              </div>
              {customer.aiSummary && (
                <div>
                  <span className="text-gray-500">AI Summary</span>
                  <p className="mt-1 text-xs text-gray-600">{customer.aiSummary}</p>
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
                <ShoppingBag className="mr-2 size-3.5" /> New Order
              </Button>
              <Button variant="outline" className="w-full justify-start h-9 text-xs">
                <Calendar className="mr-2 size-3.5" /> Schedule Fitting
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

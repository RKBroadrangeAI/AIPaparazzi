import { getProducts, getLowStockProducts } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Package, AlertTriangle } from "lucide-react";

const categoryColors: Record<string, string> = {
  tops: "bg-blue-100 text-blue-700",
  bottoms: "bg-purple-100 text-purple-700",
  dresses: "bg-[#C8658E]/15 text-[#C8658E]",
  outerwear: "bg-amber-100 text-amber-700",
  accessories: "bg-emerald-100 text-emerald-700",
  activewear: "bg-cyan-100 text-cyan-700",
};

export default async function InventoryPage() {
  const [products, lowStock] = await Promise.all([
    getProducts(),
    getLowStockProducts(),
  ]);

  const lowStockIds = new Set(lowStock.map((p: any) => p.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500">
            {products.length} products · {lowStock.length} low stock
          </p>
        </div>
        <Button size="sm" className="h-9 bg-[#C8658E] hover:bg-[#B8557E]">
          <Plus className="mr-1 size-4" /> Add Product
        </Button>
      </div>

      {lowStock.length > 0 && (
        <Card className="border-none shadow-sm border-l-4 border-l-amber-400">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="size-5 text-amber-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Low Stock Alert</p>
              <p className="text-xs text-gray-500">
                {lowStock.length} product{lowStock.length > 1 ? "s are" : " is"} running low on stock.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Sizes</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p: any) => {
                  const isLow = lowStockIds.has(p.id);
                  return (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-lg bg-gray-100">
                            <Package className="size-4 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{p.name}</p>
                            <p className="text-[10px] text-gray-400 line-clamp-1">{p.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-500">{p.sku}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className={`text-[10px] ${categoryColors[p.category] ?? "bg-gray-100 text-gray-700"}`}>
                          {p.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-gray-700">
                        ${p.price?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${isLow ? "text-red-600" : "text-gray-700"}`}>
                          {p.stockQty}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {Array.isArray(p.sizes) ? p.sizes.join(", ") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {isLow ? (
                          <Badge variant="secondary" className="bg-red-100 text-red-700 text-[10px]">Low Stock</Badge>
                        ) : p.active ? (
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-[10px]">Active</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-200 text-gray-600 text-[10px]">Inactive</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-xs text-gray-400">
                      No products in inventory. Add your first product.
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

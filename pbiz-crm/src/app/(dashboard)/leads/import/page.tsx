import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet } from "lucide-react";

export default function LeadImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Import Leads</h1>
        <p className="text-sm text-gray-500">Upload a CSV file to bulk-import leads.</p>
      </div>

      <Card className="border-none shadow-sm max-w-2xl">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">CSV Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-10 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-[#C8658E]/10">
              <FileSpreadsheet className="size-6 text-[#C8658E]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Drag & drop your CSV file</p>
              <p className="text-xs text-gray-400 mt-1">
                Columns: firstName, lastName, email, phone, source, styleInterest, sizePreference, notes
              </p>
            </div>
            <Button variant="outline" className="mt-2">
              <Upload className="mr-1.5 size-4" /> Choose File
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

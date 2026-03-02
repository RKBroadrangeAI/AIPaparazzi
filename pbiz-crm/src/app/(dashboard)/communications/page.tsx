import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Filter } from "lucide-react";

export default function CommunicationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Communications</h1>
          <p className="text-sm text-gray-500">Messages, emails & call logs</p>
        </div>
        <Button size="sm" className="h-9 bg-[#C8658E] hover:bg-[#B8557E]">
          <Send className="mr-1 size-4" /> New Message
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Message History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <MessageSquare className="size-10 text-gray-300" />
                <p className="text-sm text-gray-400">No messages yet.</p>
                <p className="text-xs text-gray-300">
                  Customer communications will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Message Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start h-9 text-xs">
                Welcome - New Customer
              </Button>
              <Button variant="outline" className="w-full justify-start h-9 text-xs">
                Follow-Up - Style Consultation
              </Button>
              <Button variant="outline" className="w-full justify-start h-9 text-xs">
                Promo - New Collection Drop
              </Button>
              <Button variant="outline" className="w-full justify-start h-9 text-xs">
                Re-engage - Inactive Customer
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Sent Today</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Open Rate</span>
                  <span className="font-medium">—</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Response Rate</span>
                  <span className="font-medium">—</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

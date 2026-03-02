import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, User, Shield, Palette, Database, Bell } from "lucide-react";

export default async function SettingsPage() {
  const session = await getSession();

  const user = session
    ? await db.pbizUser.findUnique({
        where: { id: session.userId },
        select: { id: true, email: true, firstName: true, lastName: true, role: true },
      })
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account & CRM preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <User className="size-4 text-[#C8658E]" /> Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user && (
              <>
                <div className="flex items-center gap-4">
                  <div className="flex size-14 items-center justify-center rounded-full bg-[#C8658E]/10 text-lg font-bold text-[#C8658E]">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                    <Badge variant="secondary" className="mt-1 text-[9px]">{user.role}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit Profile</Button>
                  <Button variant="outline" size="sm">Change Password</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Brand */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Palette className="size-4 text-[#C8658E]" /> Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-[#C8658E]" />
              <div>
                <p className="text-sm font-medium">Primary Color</p>
                <p className="text-xs text-gray-400">#C8658E</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-[#1A1A1A]" />
              <div>
                <p className="text-sm font-medium">Sidebar Dark</p>
                <p className="text-xs text-gray-400">#1A1A1A</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">Brand customization coming soon.</p>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Bell className="size-4 text-[#C8658E]" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { label: "New lead assigned", enabled: true },
              { label: "Deal stage changes", enabled: true },
              { label: "Low stock alerts", enabled: true },
              { label: "Appointment reminders", enabled: true },
              { label: "Daily digest email", enabled: false },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-gray-600">{n.label}</span>
                <div className={`h-5 w-9 rounded-full ${n.enabled ? "bg-[#C8658E]" : "bg-gray-200"} relative cursor-pointer`}>
                  <div className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-all ${n.enabled ? "left-[18px]" : "left-0.5"}`} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Database className="size-4 text-[#C8658E]" /> System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Version</span>
              <span className="font-mono text-xs">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Database</span>
              <span className="font-mono text-xs">PostgreSQL (Railway)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Framework</span>
              <span className="font-mono text-xs">Next.js 16</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Port</span>
              <span className="font-mono text-xs">3001</span>
            </div>
          </CardContent>
        </Card>

        {/* User Management (admin only) */}
        {user?.role === "ADMIN" && (
          <Card className="border-none shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Shield className="size-4 text-[#C8658E]" /> User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-400 mb-4">
                Manage users via the API: POST /api/auth/users to create, GET /api/auth/users to list.
              </p>
              <Button variant="outline" size="sm">
                View All Users
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

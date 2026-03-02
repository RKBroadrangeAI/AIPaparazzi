"use client";

import { SidebarProvider } from "./sidebar-context";
import { SessionProvider, type SessionUser } from "./session-provider";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { FloatingCopilot } from "@/components/ai/floating-copilot";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";

function ShellInner({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();
  return (
    <div className="min-h-screen bg-gray-50/70">
      <Sidebar />
      <Topbar />
      <main
        className={cn(
          "min-h-[calc(100vh-4rem)] p-4 transition-all duration-300 lg:p-6",
          isOpen ? "lg:ml-[260px]" : "lg:ml-[68px]"
        )}
      >
        {children}
      </main>
      <FloatingCopilot />
    </div>
  );
}

export function DashboardShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  return (
    <SessionProvider user={user}>
      <TooltipProvider delayDuration={300}>
        <SidebarProvider>
          <ShellInner>{children}</ShellInner>
        </SidebarProvider>
        <Toaster
          theme="light"
          position="top-right"
          toastOptions={{
            style: { background: "#FFFFFF", border: "1px solid #E5E5E5", color: "#000000" },
            className: "font-sans",
          }}
        />
      </TooltipProvider>
    </SessionProvider>
  );
}

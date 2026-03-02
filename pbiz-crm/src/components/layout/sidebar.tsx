"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Users,
  ShoppingBag,
  MessageSquare,
  Sparkles,
  BarChart3,
  Settings,
  ChevronLeft,
  UserCog,
  Shuffle,
  CalendarClock,
  Calendar,
  Globe,
  Package,
  Shirt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import { useSession } from "./session-provider";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Target },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Deals", href: "/deals", icon: ShoppingBag },
  { label: "Inventory", href: "/inventory", icon: Package },
  { label: "Consultants", href: "/consultants", icon: UserCog },
  { label: "Communications", href: "/communications", icon: MessageSquare },
  { label: "Calendar", href: "/calendar", icon: CalendarClock },
  { label: "Appointments", href: "/appointments", icon: Calendar },
  { label: "Social Intel", href: "/social", icon: Globe },
  { label: "AI Copilot", href: "/ai-copilot", icon: Sparkles },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

const roleAccess: Record<string, string[]> = {
  ADMIN: navItems.map((i) => i.href),
  MANAGER: ["/dashboard", "/leads", "/customers", "/deals", "/inventory", "/consultants", "/communications", "/calendar", "/appointments", "/reports", "/settings"],
  CONSULTANT: ["/dashboard", "/leads", "/customers", "/deals", "/inventory", "/communications", "/calendar", "/appointments", "/ai-copilot"],
};

const roleLabels: Record<string, string> = {
  ADMIN: "Administrator",
  MANAGER: "Manager",
  CONSULTANT: "Consultant",
};

function SidebarContent({ collapsed }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const { closeMobile } = useSidebar();
  const { user } = useSession();

  const allowedHrefs = roleAccess[user?.role ?? "CONSULTANT"] ?? roleAccess.CONSULTANT;
  const filteredItems = navItems.filter((item) => allowedHrefs.includes(item.href));

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 bg-white">
        <div className="flex size-9 items-center justify-center rounded-lg bg-[#C8658E]/20">
          <Shirt className="size-5 text-[#C8658E]" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold tracking-wider text-black">
              PBiz CRM
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
              Fashion Intelligence
            </span>
          </div>
        )}
      </div>

      <Separator className="bg-white/[0.08]" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {filteredItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname.startsWith("/dashboard")
                : pathname === item.href || pathname.startsWith(item.href);
            const Icon = item.icon;
            const isAI = item.label === "AI Copilot";

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "bg-[#C8658E]/15 text-[#C8658E]"
                    : "text-gray-400 hover:bg-white/[0.06] hover:text-white",
                  isAI && !isActive && "text-[#C8658E]/60 hover:bg-[#C8658E]/[0.08] hover:text-[#C8658E]"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-[#C8658E]" />
                )}
                <Icon className={cn("size-[18px] shrink-0", isActive && "text-[#C8658E]", isAI && "text-[#C8658E]/70")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator className="bg-white/[0.08]" />

      {/* User Status */}
      <div className={cn("px-4 py-4", collapsed && "px-2")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="relative">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#C8658E]/20 text-[10px] font-bold text-[#C8658E]">
              {user ? `${user.firstName[0]}${user.lastName[0]}` : "PB"}
            </div>
            <div className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#1A1A1A] bg-emerald-500" />
          </div>
          {!collapsed && user && (
            <div className="flex flex-col min-w-0">
              <span className="truncate text-xs font-medium text-white">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-[10px] text-gray-500">
                {roleLabels[user.role] ?? user.role}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { isOpen, isMobileOpen, toggle, closeMobile } = useSidebar();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden h-screen bg-[#1A1A1A] transition-all duration-300 lg:block",
          isOpen ? "w-[260px]" : "w-[68px]"
        )}
      >
        <SidebarContent collapsed={!isOpen} />
        <button
          onClick={toggle}
          className="absolute -right-3 top-20 flex size-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 shadow-sm hover:text-gray-900 transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(0deg)" : "rotate(180deg)" }}
        >
          <ChevronLeft className="size-3.5" />
        </button>
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={closeMobile} />
          <aside className="absolute left-0 top-0 h-full w-[280px] bg-[#1A1A1A]">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}

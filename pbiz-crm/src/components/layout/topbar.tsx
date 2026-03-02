"use client";

import { Menu, Search, Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSidebar } from "./sidebar-context";
import { useSession } from "./session-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useState } from "react";

const roleLabels: Record<string, string> = {
  ADMIN: "Administrator",
  MANAGER: "Manager",
  CONSULTANT: "Consultant",
};

export function Topbar() {
  const { isOpen, toggleMobile } = useSidebar();
  const { user } = useSession();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/sign-in");
      router.refresh();
    } catch {
      setSigningOut(false);
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md transition-all duration-300 lg:px-6",
        isOpen ? "lg:ml-[260px]" : "lg:ml-[68px]"
      )}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobile}
          className="flex size-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        {/* Search */}
        <div className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-400 md:flex">
          <Search className="size-4" />
          <span>Search leads, customers, orders…</span>
          <kbd className="ml-6 rounded bg-gray-200 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative flex size-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">
          <Bell className="size-[18px]" />
          <div className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#C8658E]" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2">
          <Avatar className="size-8 border border-gray-200">
            <AvatarFallback className="bg-[#C8658E]/10 text-[10px] font-bold text-[#C8658E]">
              {user ? `${user.firstName[0]}${user.lastName[0]}` : "PB"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden flex-col md:flex">
            <span className="text-xs font-medium text-gray-900">
              {user ? `${user.firstName} ${user.lastName}` : ""}
            </span>
            <span className="text-[10px] text-gray-400">
              {user ? roleLabels[user.role] ?? user.role : ""}
            </span>
          </div>
        </div>

        {/* Sign out */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          disabled={signingOut}
          className="h-8 gap-1.5 text-gray-400 hover:text-gray-600"
        >
          <LogOut className="size-3.5" />
          <span className="hidden md:inline">{signingOut ? "…" : "Sign out"}</span>
        </Button>
      </div>
    </header>
  );
}

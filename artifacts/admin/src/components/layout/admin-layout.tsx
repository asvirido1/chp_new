import React from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, List, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-background text-foreground">
      <aside className="w-full md:w-64 border-r border-border bg-sidebar text-sidebar-foreground flex-shrink-0 flex flex-col h-auto md:h-screen md:sticky md:top-0">
        <div className="p-4 border-b border-sidebar-border h-14 flex items-center shrink-0">
          <div className="font-bold text-lg tracking-tight">CHPOK ADMIN</div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
          <Link href="/">
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                location === "/"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </div>
          </Link>
          <Link href="/reports">
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                location.startsWith("/reports")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <List className="w-4 h-4" />
              Reports
            </div>
          </Link>
        </nav>
        <div className="p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/50 shrink-0">
          Operator Console v1.0.0
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-muted/20">
        {children}
      </main>
    </div>
  );
}

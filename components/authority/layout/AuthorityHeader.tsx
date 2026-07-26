"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, Bell, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { IssueReport } from "@/types/issue";
import { formatDistanceToNow } from "date-fns";

interface AuthorityHeaderProps {
  reports?: IssueReport[];
  onMenuClick: () => void;
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/admin/dashboard": { title: "Dashboard", subtitle: "Operations overview" },
  "/admin/pending": { title: "Pending Reports", subtitle: "Reports awaiting review" },
  "/admin/approved": { title: "Approved Reports", subtitle: "Verified reports" },
  "/admin/in-progress": { title: "In Progress", subtitle: "Actively being resolved" },
  "/admin/resolved": { title: "Resolved Reports", subtitle: "Successfully closed issues" },
  "/admin/map": { title: "City Map", subtitle: "Geographic issue overview" },
  "/admin/analytics": { title: "Analytics", subtitle: "Insights & performance metrics" },
  "/admin/settings": { title: "Settings", subtitle: "Profile & preferences" },
};

function getTimeAgo(createdAt: any): string {
  if (!createdAt) return "";
  try {
    const date = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "";
  }
}

export function AuthorityHeader({ reports = [], onMenuClick }: AuthorityHeaderProps) {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);

  // Derive notifications from reports
  const notifications = [
    ...reports
      .filter((r) => r.status === "pending")
      .slice(0, 3)
      .map((r) => ({
        id: r.id!,
        type: "pending" as const,
        title: `New Report: ${r.title}`,
        time: getTimeAgo(r.createdAt),
        icon: Clock,
        color: "text-amber-600",
        bg: "bg-amber-50",
      })),
    ...reports
      .filter((r) => r.severity === "Critical" || r.severity === "High")
      .slice(0, 2)
      .map((r) => ({
        id: `crit-${r.id!}`,
        type: "critical" as const,
        title: `High Priority: ${r.title}`,
        time: getTimeAgo(r.createdAt),
        icon: AlertTriangle,
        color: "text-red-600",
        bg: "bg-red-50",
      })),
    ...reports
      .filter((r) => r.status === "resolved")
      .slice(0, 2)
      .map((r) => ({
        id: `res-${r.id!}`,
        type: "resolved" as const,
        title: `Resolved: ${r.title}`,
        time: getTimeAgo(r.updatedAt || r.createdAt),
        icon: CheckCircle2,
        color: "text-green-600",
        bg: "bg-green-50",
      })),
  ].slice(0, 7);

  const unreadCount = Math.min(
    reports.filter((r) => r.status === "pending").length,
    9
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-notif-panel]")) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Get page info
  const pageInfo =
    pageTitles[pathname] ||
    (pathname.startsWith("/admin/reports/")
      ? { title: "Report Details", subtitle: "Full report review" }
      : { title: "Authority Portal", subtitle: "Municipal operations" });

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 shadow-sm">
      {/* Left: Mobile menu + Page title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <h1 className="font-bold text-gray-900 text-lg leading-tight">{pageInfo.title}</h1>
          <p className="text-xs text-gray-500">{pageInfo.subtitle}</p>
        </div>
        <div className="sm:hidden">
          <h1 className="font-bold text-gray-900 text-base">{pageInfo.title}</h1>
        </div>
      </div>

      {/* Right: Notifications */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative" data-notif-panel>
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Panel */}
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <p className="font-bold text-gray-900 text-sm">Notifications</p>
                {unreadCount > 0 && (
                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    {unreadCount} pending
                  </span>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <CheckCircle2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">All caught up!</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const Icon = notif.icon;
                    return (
                      <div key={notif.id} className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                        <div className={`w-8 h-8 rounded-full ${notif.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Icon className={`w-4 h-4 ${notif.color}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{notif.time}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="px-4 py-2.5 border-t border-gray-100 text-center">
                <a
                  href="/admin/pending"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                  onClick={() => setNotifOpen(false)}
                >
                  View all pending reports →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

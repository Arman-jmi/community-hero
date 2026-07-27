"use client";

import { useMemo } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAdminReports } from "@/hooks/useAdminReports";
import { getTimeAgo } from "@/utils/timeAgo";
import Link from "next/link";
import {
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Brain,
  Zap,
  Clock,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { StatusBadge } from "@/components/authority/reports/StatusBadge";
import { PriorityBadge } from "@/components/authority/reports/PriorityBadge";
import React from "react";

// ─── Skeleton sub-components (stable references, not recreated on render) ──────

const SkeletonCard = React.memo(function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-32 bg-gray-100 rounded" />
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gray-100" />
      </div>
    </div>
  );
});

export default function AdminDashboardPage() {
  const { profile } = useAuthContext();

  // Single cached fetch — instant on re-navigation, deduplicated on first mount.
  const { reports, loading } = useAdminReports();

  // ── Greeting (only recomputed when the component first mounts) ────────────────
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening";
  }, []);

  const dateLabel = useMemo(
    () =>
      new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    []
  );

  // ── Derived stats — only recalculated when `reports` changes ─────────────────
  const stats = useMemo(() => {
    const today = new Date();

    let pending = 0;
    let approvedToday = 0;
    let critical = 0;
    let resolvedThisWeek = 0;
    let inProgress = 0;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    for (const r of reports) {
      if (r.status === "pending") pending++;
      if (r.status === "in_progress") inProgress++;
      if (r.severity === "Critical" || r.severity === "High") critical++;

      if (r.status === "verified") {
        const d = r.updatedAt as unknown as { toDate?: () => Date };
        if (d) {
          const date = d?.toDate ? d.toDate() : new Date(r.updatedAt as unknown as string);
          if (date.toDateString() === today.toDateString()) approvedToday++;
        }
      }

      if (r.status === "resolved") {
        const d = r.resolvedAt as unknown as { toDate?: () => Date };
        if (d) {
          const date = d?.toDate ? d.toDate() : new Date(r.resolvedAt as unknown as string);
          if (date >= weekAgo) resolvedThisWeek++;
        }
      }
    }

    return { pending, approvedToday, critical, resolvedThisWeek, inProgress, total: reports.length };
  }, [reports]);

  // ── KPI card configs — only rebuilt when stats changes ───────────────────────
  const kpiCards = useMemo(
    () => [
      {
        label: "Pending Reports",
        value: stats.pending,
        icon: ClipboardList,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
        trend: "Needs review",
        href: "/admin/pending",
      },
      {
        label: "Approved Today",
        value: stats.approvedToday,
        icon: CheckCircle2,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        trend: "Today's approvals",
        href: "/admin/approved",
      },
      {
        label: "Critical Issues",
        value: stats.critical,
        icon: AlertTriangle,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-100",
        trend: "High + Critical",
        href: "/admin/pending",
      },
      {
        label: "Resolved This Week",
        value: stats.resolvedThisWeek,
        icon: TrendingUp,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100",
        trend: "Last 7 days",
        href: "/admin/resolved",
      },
      {
        label: "In Progress",
        value: stats.inProgress,
        icon: Clock,
        color: "text-purple-600",
        bg: "bg-purple-50",
        border: "border-purple-100",
        trend: "Being worked on",
        href: "/admin/in-progress",
      },
    ],
    [stats]
  );

  // ── Derived report lists — memoized, no repeated full-array iterations ────────
  const recentReports = useMemo(() => reports.slice(0, 6), [reports]);

  const highPriority = useMemo(
    () =>
      reports
        .filter((r) => r.severity === "Critical" || r.severity === "High")
        .slice(0, 4),
    [reports]
  );

  const aiFlagged = useMemo(
    () => reports.filter((r) => r.aiAnalysis?.duplicateReportPossibility).slice(0, 4),
    [reports]
  );

  const recentResolutions = useMemo(
    () => reports.filter((r) => r.status === "resolved").slice(0, 4),
    [reports]
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good {greeting},{" "}
            {profile?.name?.split(" ")[0] ?? "Officer"} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Managing {profile?.adminArea || "all regions"} •{" "}
            {dateLabel}
          </p>
        </div>
        <Link
          href="/admin/analytics"
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <BarChart3 className="w-4 h-4" />
          Analytics
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : kpiCards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className={`bg-white rounded-2xl border ${card.border} p-5 hover:shadow-md transition-all duration-300 group cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-11 h-11 rounded-2xl ${card.bg} flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors mt-1" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs font-semibold text-gray-600 mt-0.5">{card.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{card.trend}</p>
              </Link>
            ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Reports */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-gray-400" />
              <h2 className="font-bold text-gray-900">Recent Reports</h2>
            </div>
            <Link href="/admin/pending" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-6 py-4 animate-pulse flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                  <div className="h-6 w-20 bg-gray-100 rounded-full" />
                </div>
              ))
            ) : recentReports.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <ClipboardList className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No reports yet</p>
              </div>
            ) : (
              recentReports.map((report) => (
                <Link
                  key={report.id}
                  href={`/admin/reports/${report.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-11 h-11 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={report.imageUrl?.startsWith("blob:") ? "/pothole.jpg" : report.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => (e.currentTarget.src = "/pothole.jpg")}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{report.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {report.category} • {getTimeAgo(report.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={report.status} size="sm" />
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* High Priority Issues */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <h2 className="font-bold text-gray-900 text-sm">High Priority</h2>
              </div>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                {stats.critical}
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="px-5 py-3 animate-pulse flex items-center gap-3">
                    <div className="h-4 bg-gray-100 rounded flex-1" />
                    <div className="h-5 w-16 bg-gray-100 rounded-full" />
                  </div>
                ))
              ) : highPriority.length === 0 ? (
                <div className="px-5 py-6 text-center">
                  <CheckCircle2 className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">No critical issues</p>
                </div>
              ) : (
                highPriority.map((report) => (
                  <Link
                    key={report.id}
                    href={`/admin/reports/${report.id}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{report.title}</p>
                      <p className="text-[11px] text-gray-400">{report.category}</p>
                    </div>
                    <PriorityBadge severity={report.severity} size="sm" />
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* AI Flagged */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700 flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <h2 className="font-bold text-white text-sm">AI Flagged</h2>
            </div>
            <div className="divide-y divide-slate-800">
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="px-5 py-3 animate-pulse">
                    <div className="h-3.5 bg-slate-700 rounded w-3/4 mb-1.5" />
                    <div className="h-3 bg-slate-800 rounded w-1/2" />
                  </div>
                ))
              ) : aiFlagged.length === 0 ? (
                <div className="px-5 py-6 text-center">
                  <Zap className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No AI flags at this time</p>
                </div>
              ) : (
                aiFlagged.map((report) => (
                  <Link
                    key={report.id}
                    href={`/admin/reports/${report.id}`}
                    className="block px-5 py-3 hover:bg-slate-800 transition-colors"
                  >
                    <p className="text-xs font-semibold text-slate-200 truncate">{report.title}</p>
                    <p className="text-[11px] text-purple-400 mt-0.5">
                      ⚠ Possible duplicate detected
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Resolutions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <h2 className="font-bold text-gray-900">Recent Resolutions</h2>
          </div>
          <Link href="/admin/resolved" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-5 animate-pulse">
                <div className="h-3.5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </div>
            ))
          ) : recentResolutions.length === 0 ? (
            <div className="col-span-4 py-10 text-center">
              <p className="text-gray-400 text-sm">No resolved reports yet</p>
            </div>
          ) : (
            recentResolutions.map((report) => (
              <Link
                key={report.id}
                href={`/admin/reports/${report.id}`}
                className="p-5 hover:bg-gray-50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="font-semibold text-gray-900 text-sm line-clamp-1">{report.title}</p>
                <p className="text-xs text-gray-400 mt-1">{report.category}</p>
                {report.resolutionNote && (
                  <p className="text-[11px] text-emerald-600 mt-2 font-medium line-clamp-2">
                    {report.resolutionNote}
                  </p>
                )}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

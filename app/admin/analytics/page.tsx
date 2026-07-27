"use client";

import { useMemo } from "react";
import React from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAdminReports } from "@/hooks/useAdminReports";
import { BarChart3, TrendingUp, PieChart, Activity } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const CATEGORY_COLORS: Record<string, string> = {
  Road: "#10b981",
  Garbage: "#f59e0b",
  "Street Light": "#6366f1",
  Water: "#3b82f6",
  Drainage: "#06b6d4",
  Traffic: "#f97316",
  Park: "#22c55e",
  Other: "#8b5cf6",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  verified: "#10b981",
  in_progress: "#3b82f6",
  resolved: "#22c55e",
  rejected: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  verified: "Approved",
  in_progress: "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

// Memoized pure presentational components
const StatCard = React.memo(function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm font-semibold text-gray-600 mt-0.5">{title}</p>
      <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
    </div>
  );
});

const ChartCard = React.memo(function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-bold text-gray-900 mb-5">{title}</h3>
      {children}
    </div>
  );
});

// Skeleton for loading state — avoids blank screen
function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      <div>
        <div className="h-7 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-64 bg-gray-100 rounded" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="w-10 h-10 bg-gray-100 rounded-2xl mb-3" />
            <div className="h-8 w-16 bg-gray-200 rounded mb-1" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="h-5 w-40 bg-gray-200 rounded mb-5" />
            <div className="h-60 bg-gray-100 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { profile } = useAuthContext();

  // Shared cached fetch — won't re-fetch if dashboard already loaded data.
  const { reports, loading } = useAdminReports();

  // ── All chart data memoized — only recalculated when reports change ───────────

  const byCategory = useMemo(
    () =>
      Object.entries(
        reports.reduce((acc: Record<string, number>, r) => {
          acc[r.category] = (acc[r.category] || 0) + 1;
          return acc;
        }, {})
      )
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
    [reports]
  );

  const byStatus = useMemo(
    () =>
      Object.entries(
        reports.reduce((acc: Record<string, number>, r) => {
          acc[r.status] = (acc[r.status] || 0) + 1;
          return acc;
        }, {})
      ).map(([name, value]) => ({ name: STATUS_LABELS[name] || name, value, key: name })),
    [reports]
  );

  // Daily reports for last 14 days
  const daily = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (13 - i));
      const label = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      const dateStr = d.toDateString();
      const count = reports.filter((r) => {
        const cd = r.createdAt as unknown as { toDate?: () => Date };
        if (!cd) return false;
        const rDate = cd?.toDate ? cd.toDate() : new Date(r.createdAt as unknown as string);
        return rDate.toDateString() === dateStr;
      }).length;
      return { date: label, Reports: count };
    });
  }, [reports]);

  const bySeverity = useMemo(
    () =>
      ["Critical", "High", "Medium", "Low"].map((s) => ({
        name: s,
        count: reports.filter((r) => r.severity === s).length,
      })),
    [reports]
  );

  const { total, resolutionRate, approvalRate, pendingCount } = useMemo(() => {
    const total = reports.length;
    const resolved = reports.filter((r) => r.status === "resolved").length;
    const approved = reports.filter(
      (r) => r.status !== "pending" && r.status !== "rejected"
    ).length;
    const pendingCount = reports.filter((r) => r.status === "pending").length;
    return {
      total,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
      pendingCount,
    };
  }, [reports]);

  // Category breakdown rows — memoized to avoid re-filtering on every render
  const categoryRows = useMemo(
    () =>
      byCategory.map(({ name, count }) => {
        const catReports = reports.filter((r) => r.category === name);
        const catResolved = catReports.filter((r) => r.status === "resolved").length;
        const catPending = catReports.filter((r) => r.status === "pending").length;
        const catRate = count > 0 ? Math.round((catResolved / count) * 100) : 0;
        return { name, count, catResolved, catPending, catRate };
      }),
    [byCategory, reports]
  );

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">
          Insights and performance metrics for {profile?.adminArea || "all regions"}
        </p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Reports" value={total} subtitle="All time" icon={BarChart3} color="bg-emerald-500" />
        <StatCard title="Resolution Rate" value={`${resolutionRate}%`} subtitle="Resolved vs total" icon={TrendingUp} color="bg-blue-500" />
        <StatCard title="Approval Rate" value={`${approvalRate}%`} subtitle="Approved vs total" icon={Activity} color="bg-purple-500" />
        <StatCard title="Pending Queue" value={pendingCount} subtitle="Awaiting review" icon={PieChart} color="bg-amber-500" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports by Category */}
        <ChartCard title="Reports by Category">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byCategory} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                angle={-30}
                textAnchor="end"
                height={50}
              />
              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={40}>
                {byCategory.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#10b981"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Reports by Status */}
        <ChartCard title="Reports by Status">
          <ResponsiveContainer width="100%" height={240}>
            <RechartsPieChart>
              <Pie
                data={byStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={3}
                label={({ name, percent }) =>
                  percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
                }
                labelLine={false}
              >
                {byStatus.map((entry) => (
                  <Cell key={entry.key} fill={STATUS_COLORS[entry.key] || "#6b7280"} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Reports Trend */}
        <ChartCard title="Daily Reports (Last 14 Days)">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={daily} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#6b7280" }}
                angle={-30}
                textAnchor="end"
                height={50}
              />
              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="Reports"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* By Severity */}
        <ChartCard title="Reports by Severity">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={bySeverity} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#6b7280" }} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: "#374151", fontWeight: 600 }}
                width={65}
              />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={32}>
                <Cell fill="#7c3aed" />
                <Cell fill="#ea580c" />
                <Cell fill="#d97706" />
                <Cell fill="#16a34a" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top Categories Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Category Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-right">Total</th>
                <th className="px-6 py-3 text-right">Resolved</th>
                <th className="px-6 py-3 text-right">Pending</th>
                <th className="px-6 py-3 text-right">Resolution %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categoryRows.map(({ name, count, catResolved, catPending, catRate }) => (
                <tr key={name} className="hover:bg-gray-50">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[name] || "#10b981" }}
                      />
                      <span className="font-semibold text-gray-800">{name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-right font-bold text-gray-900">{count}</td>
                  <td className="px-6 py-3.5 text-right text-emerald-600 font-semibold">{catResolved}</td>
                  <td className="px-6 py-3.5 text-right text-amber-600 font-semibold">{catPending}</td>
                  <td className="px-6 py-3.5 text-right">
                    <span
                      className={`font-bold ${
                        catRate >= 70 ? "text-emerald-600" : catRate >= 40 ? "text-amber-600" : "text-red-500"
                      }`}
                    >
                      {catRate}%
                    </span>
                  </td>
                </tr>
              ))}
              {categoryRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

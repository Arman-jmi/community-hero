import React from "react";

type ReportStatus = "pending" | "verified" | "in_progress" | "resolved" | "rejected" | "community_verified";

interface StatusBadgeProps {
  status: ReportStatus;
  size?: "sm" | "md";
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  pending: {
    label: "Pending",
    classes: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  verified: {
    label: "Approved",
    classes: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  community_verified: {
    label: "Community Verified",
    classes: "bg-teal-100 text-teal-700 border border-teal-200",
  },
  in_progress: {
    label: "In Progress",
    classes: "bg-blue-100 text-blue-700 border border-blue-200",
  },
  resolved: {
    label: "Resolved",
    classes: "bg-green-100 text-green-700 border border-green-200",
  },
  rejected: {
    label: "Rejected",
    classes: "bg-red-100 text-red-700 border border-red-200",
  },
};

export const StatusBadge = React.memo(function StatusBadge({
  status,
  size = "md",
}: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status.replace(/_/g, " "),
    classes: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wide ${sizeClasses} ${config.classes}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 flex-shrink-0" />
      {config.label}
    </span>
  );
});

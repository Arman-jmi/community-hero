import React from "react";

type Severity = "Low" | "Medium" | "High" | "Critical";

interface PriorityBadgeProps {
  severity: Severity;
  size?: "sm" | "md";
}

const severityConfig: Record<Severity, { label: string; classes: string; dot: string }> = {
  Critical: {
    label: "Critical",
    classes: "bg-purple-100 text-purple-700 border border-purple-200",
    dot: "bg-purple-500",
  },
  High: {
    label: "High",
    classes: "bg-orange-100 text-orange-700 border border-orange-200",
    dot: "bg-orange-500",
  },
  Medium: {
    label: "Medium",
    classes: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    dot: "bg-yellow-500",
  },
  Low: {
    label: "Low",
    classes: "bg-green-100 text-green-700 border border-green-200",
    dot: "bg-green-500",
  },
};

export function PriorityBadge({ severity, size = "md" }: PriorityBadgeProps) {
  const config = severityConfig[severity] ?? {
    label: severity,
    classes: "bg-gray-100 text-gray-700 border border-gray-200",
    dot: "bg-gray-500",
  };

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wide ${sizeClasses} ${config.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
      {config.label}
    </span>
  );
}

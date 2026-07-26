"use client";

import React from "react";
import { IssueReport } from "@/types/issue";
import { CheckCircle2, Clock, AlertCircle, XCircle, Building2, Loader2 } from "lucide-react";

interface TimelineEvent {
  status: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

interface ReportTimelineProps {
  report: IssueReport;
}

const statusOrder: string[] = ["pending", "verified", "in_progress", "resolved"];

const eventConfig: Record<string, TimelineEvent> = {
  pending: {
    status: "pending",
    label: "Report Submitted",
    description: "Citizen submitted the report for review.",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  verified: {
    status: "verified",
    label: "Approved & Verified",
    description: "Authority reviewed and approved the report.",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  in_progress: {
    status: "in_progress",
    label: "In Progress",
    description: "Issue has been assigned to a department.",
    icon: Building2,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  resolved: {
    status: "resolved",
    label: "Resolved",
    description: "Issue has been resolved successfully.",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  rejected: {
    status: "rejected",
    label: "Rejected",
    description: "Report was rejected by the authority.",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
};

export function ReportTimeline({ report }: ReportTimelineProps) {
  // Build the list of events to show
  const isRejected = report.status === "rejected";

  const events: TimelineEvent[] = isRejected
    ? [eventConfig.pending, eventConfig.rejected]
    : statusOrder
        .slice(0, statusOrder.indexOf(report.status) + 1)
        .map((s) => eventConfig[s])
        .filter(Boolean);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 text-sm mb-4">Status Timeline</h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100" />

        <div className="space-y-5">
          {events.map((event, index) => {
            const Icon = event.icon;
            const isLast = index === events.length - 1;
            const isPast = !isLast;

            return (
              <div key={event.status} className="flex items-start gap-4 relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                    isLast ? event.bgColor : "bg-gray-100"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isLast ? event.color : "text-gray-400"}`}
                  />
                </div>
                <div className="pb-1">
                  <p
                    className={`text-sm font-semibold ${
                      isLast ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {event.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{event.description}</p>
                  {isLast && report.status === "rejected" && report.rejectionReason && (
                    <p className="text-xs text-red-600 mt-1 font-medium">
                      Reason: {report.rejectionReason}
                    </p>
                  )}
                  {isLast && report.status === "resolved" && report.resolutionNote && (
                    <p className="text-xs text-green-600 mt-1 font-medium">
                      Note: {report.resolutionNote}
                    </p>
                  )}
                  {isLast && report.assignedDepartment && (
                    <p className="text-xs text-blue-600 mt-1 font-medium">
                      Assigned to: {report.assignedDepartment}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Current loading state if still processing */}
          {!["resolved", "rejected"].includes(report.status) && (
            <div className="flex items-start gap-4 relative opacity-40">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 z-10">
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              </div>
              <div className="pb-1">
                <p className="text-sm font-semibold text-gray-400">Awaiting next action</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

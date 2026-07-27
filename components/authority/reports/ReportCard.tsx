"use client";

import React from "react";
import Link from "next/link";
import { IssueReport } from "@/types/issue";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { getTimeAgo } from "@/utils/timeAgo";
import {
  MapPin,
  User,
  Calendar,
  Brain,
  Eye,
  CheckCircle2,
  XCircle,
  Building2,
  ShieldCheck,
  Users,
} from "lucide-react";

interface ReportCardProps {
  report: IssueReport;
  onApprove?: (report: IssueReport) => void;
  onReject?: (report: IssueReport) => void;
  onAssign?: (report: IssueReport) => void;
  onMarkResolved?: (report: IssueReport) => void;
  loading?: boolean;
}

/**
 * ReportCard is wrapped with React.memo so the grid does NOT re-render
 * all cards when actionLoading toggles for a single card action.
 * Callbacks are also stable (useCallback in parent) to prevent false changes.
 */
export const ReportCard = React.memo(function ReportCard({
  report,
  onApprove,
  onReject,
  onAssign,
  onMarkResolved,
  loading = false,
}: ReportCardProps) {
  const imageUrl =
    report.imageUrl && !report.imageUrl.startsWith("blob:")
      ? report.imageUrl
      : "/pothole.jpg";

  const confidence = report.aiAnalysis?.confidence;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={report.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "/pothole.jpg")}
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <StatusBadge status={report.status} size="sm" />
          <PriorityBadge severity={report.severity} size="sm" />
        </div>
        {confidence !== undefined && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
            <Brain className="w-3 h-3" />
            AI {confidence}%
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Category chip */}
        <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
          {report.category}
        </span>

        <h3 className="mt-2 font-bold text-gray-900 text-sm leading-snug line-clamp-2">
          {report.title}
        </h3>

        <div className="mt-3 space-y-1.5 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">
              {report.location?.address ||
                `${report.location?.lat?.toFixed(4)}, ${report.location?.lng?.toFixed(4)}`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{report.reporterName || "Anonymous"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span>{getTimeAgo(report.createdAt)}</span>
          </div>
          {(report.verificationCount ?? 0) > 0 && (
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span>{report.verificationCount} community verifications</span>
            </div>
          )}
        </div>

        {/* AI Department suggestion */}
        {report.aiAnalysis?.department && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 rounded-lg px-2.5 py-1.5">
            <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-medium truncate">
              Suggested: {report.aiAnalysis.department}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
          <Link
            href={`/admin/reports/${report.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View Details
          </Link>

          {report.status === "pending" && onApprove && (
            <button
              onClick={() => onApprove(report)}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approve
            </button>
          )}

          {report.status === "pending" && onReject && (
            <button
              onClick={() => onReject(report)}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5" />
              Reject
            </button>
          )}

          {report.status === "verified" && onAssign && (
            <button
              onClick={() => onAssign(report)}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Building2 className="w-3.5 h-3.5" />
              Assign Team
            </button>
          )}

          {report.status === "in_progress" && onMarkResolved && (
            <button
              onClick={() => onMarkResolved(report)}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Mark Resolved
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

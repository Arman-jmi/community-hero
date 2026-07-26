"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { getAdminReports, updateReportStatus } from "@/services/admin.service";
import { IssueReport } from "@/types/issue";
import { ReportCard } from "@/components/authority/reports/ReportCard";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Loader2,
  ClipboardList,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ReportListPageProps {
  statusFilter: string;
  title: string;
  subtitle: string;
  emptyMessage: string;
}

const CATEGORIES = ["All", "Road", "Garbage", "Street Light", "Water", "Drainage", "Traffic", "Park", "Other"];
const SEVERITIES = ["All", "Critical", "High", "Medium", "Low"];

export function ReportListPage({ statusFilter, title, subtitle, emptyMessage }: ReportListPageProps) {
  const { profile } = useAuthContext();
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");

  // Reject dialog
  const [rejectReport, setRejectReport] = useState<IssueReport | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Resolve dialog
  const [resolveReport, setResolveReport] = useState<IssueReport | null>(null);
  const [resolveNote, setResolveNote] = useState("");

  const loadReports = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const data = await getAdminReports(
        profile.adminArea,
        statusFilter !== "all" ? statusFilter : undefined
      );
      setReports(data);
    } catch {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [profile, statusFilter]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const adminInfo = profile
    ? { adminId: profile.uid, adminName: profile.name, adminEmail: profile.email }
    : null;

  const handleApprove = async (report: IssueReport) => {
    if (!adminInfo) return;
    setActionLoading(true);
    try {
      await updateReportStatus(report.id!, report.status, "verified", adminInfo, {}, "approve");
      setReports((prev) =>
        prev.map((r) => (r.id === report.id ? { ...r, status: "verified" } : r))
      );
      toast.success("Report approved successfully.");
    } catch {
      toast.error("Failed to approve report.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectOpen = (report: IssueReport) => {
    setRejectReport(report);
    setRejectReason("");
  };

  const handleRejectSubmit = async () => {
    if (!adminInfo || !rejectReport) return;
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    setActionLoading(true);
    setRejectReport(null);
    try {
      await updateReportStatus(
        rejectReport.id!,
        rejectReport.status,
        "rejected",
        adminInfo,
        { rejectionReason: rejectReason },
        "reject"
      );
      setReports((prev) =>
        prev.map((r) =>
          r.id === rejectReport.id ? { ...r, status: "rejected", rejectionReason: rejectReason } : r
        )
      );
      toast.success("Report rejected.");
    } catch {
      toast.error("Failed to reject report.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssign = async (report: IssueReport) => {
    if (!adminInfo) return;
    const dept = report.aiAnalysis?.department || "General Services";
    setActionLoading(true);
    try {
      await updateReportStatus(
        report.id!,
        report.status,
        "in_progress",
        adminInfo,
        { assignedDepartment: dept },
        "assign"
      );
      setReports((prev) =>
        prev.map((r) =>
          r.id === report.id ? { ...r, status: "in_progress", assignedDepartment: dept } : r
        )
      );
      toast.success(`Assigned to ${dept}.`);
    } catch {
      toast.error("Failed to assign report.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolveOpen = (report: IssueReport) => {
    setResolveReport(report);
    setResolveNote("");
  };

  const handleResolveSubmit = async () => {
    if (!adminInfo || !resolveReport) return;
    if (!resolveNote.trim()) {
      toast.error("Please provide a resolution note.");
      return;
    }
    setActionLoading(true);
    setResolveReport(null);
    try {
      await updateReportStatus(
        resolveReport.id!,
        resolveReport.status,
        "resolved",
        adminInfo,
        { resolutionNote: resolveNote, resolvedAt: new Date() },
        "resolve"
      );
      setReports((prev) =>
        prev.map((r) =>
          r.id === resolveReport.id
            ? { ...r, status: "resolved", resolutionNote: resolveNote }
            : r
        )
      );
      toast.success("Report marked as resolved.");
    } catch {
      toast.error("Failed to resolve report.");
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = reports.filter((r) => {
    const matchSearch =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      (r.location?.address || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || r.category === categoryFilter;
    const matchSev = severityFilter === "All" || r.severity === severityFilter;
    return matchSearch && matchCat && matchSev;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, category, or location..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select
            className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-700"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Severity Filter */}
        <select
          className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-700"
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
        >
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Count */}
        <div className="flex items-center gap-1.5 px-3 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-500 font-medium flex-shrink-0">
          <ClipboardList className="w-4 h-4" />
          {loading ? "..." : `${filtered.length} reports`}
        </div>
      </div>

      {/* Report Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-44 bg-gray-100" />
              <div className="p-4 space-y-3">
                <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
                <div className="h-8 bg-gray-100 rounded-lg mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center shadow-sm">
          <ClipboardList className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-1">{emptyMessage}</h3>
          <p className="text-gray-400 text-sm">
            {search || categoryFilter !== "All" || severityFilter !== "All"
              ? "Try adjusting your filters."
              : "Check back later or verify that reports exist for your zone."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onApprove={report.status === "pending" ? handleApprove : undefined}
              onReject={report.status === "pending" ? handleRejectOpen : undefined}
              onAssign={report.status === "verified" ? handleAssign : undefined}
              onMarkResolved={report.status === "in_progress" ? handleResolveOpen : undefined}
              loading={actionLoading}
            />
          ))}
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={!!rejectReport} onOpenChange={(o) => !o && setRejectReport(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Report</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this report. The citizen will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Reason *</label>
            <Input
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Duplicate, Not a civic issue, Unclear image"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectReport(null)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleRejectSubmit}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={!!resolveReport} onOpenChange={(o) => !o && setResolveReport(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Resolved</DialogTitle>
            <DialogDescription>
              Provide resolution details for this issue.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Resolution Note *</label>
            <Textarea
              value={resolveNote}
              onChange={(e) => setResolveNote(e.target.value)}
              placeholder="Describe what was done to resolve the issue..."
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveReport(null)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleResolveSubmit}>
              Mark Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

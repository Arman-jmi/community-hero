"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { IssueReport } from "@/types/issue";
import { updateReportStatus, deleteReport } from "@/services/admin.service";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  User,
  Loader2,
  AlertTriangle,
  Brain,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  Calendar,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/authority/reports/StatusBadge";
import { PriorityBadge } from "@/components/authority/reports/PriorityBadge";
import { ReportTimeline } from "@/components/authority/reports/ReportTimeline";
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

function getTimeAgo(ts: any): string {
  if (!ts) return "Unknown";
  try {
    const date = ts?.toDate ? ts.toDate() : new Date(ts);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "Unknown";
  }
}

function getFullDate(ts: any): string {
  if (!ts) return "Unknown";
  try {
    const date = ts?.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleString("en-IN", {
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return "Unknown";
  }
}

export default function AdminReportDetailsPage() {
  const { id } = useParams();
  const { profile } = useAuthContext();
  const router = useRouter();
  const [report, setReport] = useState<IssueReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Dialogs
  const [rejectOpen, setRejectOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [resolveNote, setResolveNote] = useState("");

  useEffect(() => {
    async function fetchReport() {
      if (!id || typeof id !== "string") return;
      try {
        const snap = await getDoc(doc(db, "reports", id));
        if (snap.exists()) setReport({ id: snap.id, ...snap.data() } as IssueReport);
      } catch (err) {
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [id]);

  const adminInfo = profile
    ? { adminId: profile.uid, adminName: profile.name, adminEmail: profile.email }
    : null;

  const runAction = async (
    newStatus: any,
    action: any,
    extra: Partial<IssueReport> = {},
    msg: string
  ) => {
    if (!adminInfo || !report) return;
    setActionLoading(true);
    try {
      await updateReportStatus(report.id!, report.status, newStatus, adminInfo, extra, action);
      setReport((prev) => (prev ? { ...prev, status: newStatus, ...extra } : prev));
      toast.success(msg);
    } catch {
      toast.error("Action failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = () => runAction("verified", "approve", {}, "Report approved successfully.");

  const handleAssign = () => {
    const dept = report?.aiAnalysis?.department || "General Services";
    runAction("in_progress", "assign", { assignedDepartment: dept }, `Assigned to ${dept}.`);
  };

  const handleMarkInProgress = () =>
    runAction("in_progress", "mark_in_progress", {}, "Marked as in progress.");

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) { toast.error("Please provide a reason."); return; }
    setRejectOpen(false);
    await runAction("rejected", "reject", { rejectionReason: rejectReason }, "Report rejected.");
  };

  const handleResolveSubmit = async () => {
    if (!resolveNote.trim()) { toast.error("Please provide a resolution note."); return; }
    setResolveOpen(false);
    await runAction("resolved", "resolve", { resolutionNote: resolveNote, resolvedAt: new Date() }, "Marked as resolved.");
  };

  const handleDelete = async () => {
    if (!adminInfo || !report) return;
    if (!confirm("Permanently delete this report? This cannot be undone.")) return;
    setActionLoading(true);
    try {
      await deleteReport(report.id!, adminInfo);
      toast.success("Report deleted.");
      router.push("/admin/pending");
    } catch {
      toast.error("Failed to delete report.");
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-400 font-medium">Loading report details...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 max-w-md mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <AlertTriangle className="h-7 w-7 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Report Not Found</h2>
        <p className="text-gray-400 text-sm">This report may have been deleted or you do not have access.</p>
        <Button onClick={() => router.push("/admin/pending")} className="mt-2">
          ← Back to Reports
        </Button>
      </div>
    );
  }

  const imageUrl =
    report.imageUrl && !report.imageUrl.startsWith("blob:")
      ? report.imageUrl
      : "/pothole.jpg";

  const googleMapsUrl = `https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&center=${report.location?.lat},${report.location?.lng}&zoom=16&maptype=satellite`;
  const mapsLinkUrl = `https://www.google.com/maps?q=${report.location?.lat},${report.location?.lng}`;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Back Button + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Report Review</h1>
          <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {report.id}</p>
        </div>
        <div className="ml-auto flex items-center gap-2 flex-wrap">
          <StatusBadge status={report.status} />
          <PriorityBadge severity={report.severity} />
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image + Details Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-72 sm:h-96 bg-gray-100 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={report.title}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = "/pothole.jpg")}
              />
            </div>
            <div className="p-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                {report.category}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mt-3 mb-3">{report.title}</h2>
              {report.description && (
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">{report.description}</p>
              )}

              {/* Meta */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
                  <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">Reporter</p>
                    <p className="text-sm font-semibold text-gray-800">{report.reporterName || "Anonymous"}</p>
                    <p className="text-xs text-gray-400">{report.reporterEmail || ""}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">Submitted</p>
                    <p className="text-sm font-semibold text-gray-800">{getTimeAgo(report.createdAt)}</p>
                    <p className="text-xs text-gray-400">{getFullDate(report.createdAt)}</p>
                  </div>
                </div>
                {(report.verificationCount ?? 0) > 0 && (
                  <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
                    <Users className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] text-gray-400 font-medium">Community Verifications</p>
                      <p className="text-sm font-semibold text-gray-800">{report.verificationCount} citizens</p>
                    </div>
                  </div>
                )}
                {report.assignedDepartment && (
                  <div className="flex items-start gap-2.5 p-3 bg-blue-50 rounded-xl">
                    <Building2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] text-blue-500 font-medium">Assigned To</p>
                      <p className="text-sm font-semibold text-blue-700">{report.assignedDepartment}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-gray-900">Location</h3>
            </div>
            <div className="p-5">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                {report.location?.address || "Address not available"}
              </p>
              <p className="text-xs text-gray-400 font-mono mb-4">
                {report.location?.lat?.toFixed(6)}, {report.location?.lng?.toFixed(6)}
              </p>
              {/* Map Embed */}
              <div className="h-52 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                  <iframe
                    title="Report Location"
                    src={googleMapsUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <a
                      href={mapsLinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline"
                    >
                      <MapPin className="w-4 h-4" />
                      View on Google Maps →
                    </a>
                  </div>
                )}
              </div>
              <a
                href={mapsLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-xs text-blue-600 hover:underline font-medium flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" />
                Open in Google Maps
              </a>
            </div>
          </div>

          {/* Resolution / Rejection notes */}
          {report.status === "resolved" && report.resolutionNote && (
            <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-emerald-800">Resolution Details</h3>
              </div>
              <p className="text-emerald-700 text-sm leading-relaxed">{report.resolutionNote}</p>
            </div>
          )}
          {report.status === "rejected" && report.rejectionReason && (
            <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-red-800">Rejection Reason</h3>
              </div>
              <p className="text-red-700 text-sm leading-relaxed">{report.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Actions Panel */}
          {profile && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-4 pb-3 border-b border-gray-100">
                Authority Actions
              </h3>
              <div className="space-y-2.5">
                {report.status === "pending" && (
                  <>
                    <Button
                      onClick={handleApprove}
                      disabled={actionLoading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-10"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve & Verify
                    </Button>
                    <Button
                      onClick={() => setRejectOpen(true)}
                      disabled={actionLoading}
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 h-10"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject Report
                    </Button>
                  </>
                )}
                {report.status === "verified" && (
                  <>
                    <Button
                      onClick={handleAssign}
                      disabled={actionLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10"
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      Assign Department
                    </Button>
                    <Button
                      onClick={handleMarkInProgress}
                      disabled={actionLoading}
                      variant="outline"
                      className="w-full h-10"
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Mark In Progress
                    </Button>
                  </>
                )}
                {report.status === "in_progress" && (
                  <Button
                    onClick={() => setResolveOpen(true)}
                    disabled={actionLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white h-10"
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Mark Resolved
                  </Button>
                )}
                {["resolved", "rejected"].includes(report.status) && (
                  <div className="text-center py-3 bg-gray-50 rounded-xl text-sm text-gray-400">
                    No further actions available.
                  </div>
                )}
                {actionLoading && (
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-400 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </div>
                )}
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100">
                <Button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  variant="ghost"
                  className="w-full text-red-400 hover:text-red-600 hover:bg-red-50 text-xs h-9"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Delete (Spam/Fake)
                </Button>
              </div>
            </div>
          )}

          {/* Timeline */}
          <ReportTimeline report={report} />

          {/* AI Analysis */}
          {report.aiAnalysis && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 text-white shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <h3 className="font-bold text-white text-sm">AI Analysis</h3>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    report.aiAnalysis.confidence > 80
                      ? "bg-green-500/20 text-green-400"
                      : report.aiAnalysis.confidence > 50
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {report.aiAnalysis.confidence}% confidence
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2.5">
                  <Building2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-slate-400 text-xs">Suggested Department</p>
                    <p className="font-semibold text-blue-400">{report.aiAnalysis.department}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-slate-400 text-xs">Est. Repair Time</p>
                    <p className="font-semibold text-slate-200">{report.aiAnalysis.repairTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Zap className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-slate-400 text-xs">AI Category</p>
                    <p className="font-semibold text-slate-200">{report.aiAnalysis.category}</p>
                  </div>
                </div>
                {report.aiAnalysis.duplicateReportPossibility && (
                  <div className="mt-3 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />
                      <p className="text-amber-300 text-xs font-semibold">Possible duplicate report detected</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Report</DialogTitle>
            <DialogDescription>Provide a clear reason. The citizen will be notified.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Reason *</label>
            <Input
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Duplicate report, Outside jurisdiction, Unclear image"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleRejectSubmit}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={resolveOpen} onOpenChange={setResolveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Issue as Resolved</DialogTitle>
            <DialogDescription>Describe how the issue was resolved.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Resolution Note *</label>
            <Textarea
              value={resolveNote}
              onChange={(e) => setResolveNote(e.target.value)}
              placeholder="Describe the work done to resolve this issue..."
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveOpen(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleResolveSubmit}>
              Mark Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

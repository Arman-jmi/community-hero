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
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import React from "react";

// Stable constants outside component — prevents SDK reload on every render
const MAP_LIBRARIES: "places"[] = ["places"];
const MAP_CONTAINER_STYLE: React.CSSProperties = { width: "100%", height: "100%" };

interface ReportLocationMapProps {
  lat: number;
  lng: number;
  title?: string;
}

/**
 * Polished location map for the Authority Portal report details page.
 * Uses the Maps JavaScript API (same pattern as the Citizen Portal).
 * Features: satellite/roadmap toggle, all controls, marker tooltip,
 *           smooth fade-in, loading skeleton, and clean error fallback.
 */
const ReportLocationMap = React.memo(function ReportLocationMap({
  lat,
  lng,
  title,
}: ReportLocationMapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: MAP_LIBRARIES,
  });

  const [mapReady, setMapReady] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [mapType, setMapType] = React.useState<"satellite" | "roadmap">("roadmap");

  // Stable center — never changes for this render, avoids map re-centering on re-render
  const center = React.useMemo(() => ({ lat, lng }), [lat, lng]);

  const handleMapLoad = React.useCallback(() => {
    // Brief delay so tiles visually finish loading before the fade-in
    setTimeout(() => setMapReady(true), 300);
  }, []);

  const toggleMapType = React.useCallback(() => {
    setMapType((prev) => (prev === "roadmap" ? "satellite" : "roadmap"));
  }, []);

  // ── Missing key ──────────────────────────────────────────────────────────────
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gray-50">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600">Unable to load map</p>
          <p className="text-xs text-gray-400 mt-0.5">Please try again later</p>
        </div>
      </div>
    );
  }

  // ── SDK load error ───────────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gray-50">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-red-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600">Unable to load map</p>
          <p className="text-xs text-gray-400 mt-0.5">Please try again later</p>
        </div>
      </div>
    );
  }

  // ── Loading skeleton ─────────────────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gray-100 animate-pulse flex items-end justify-start p-3">
        <div className="space-y-1.5">
          <div className="h-2.5 w-24 bg-gray-200 rounded" />
          <div className="h-2.5 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Fade-in overlay — hides map until tiles are ready */}
      {!mapReady && (
        <div className="absolute inset-0 z-10 bg-gray-100 animate-pulse" />
      )}

      {/* Satellite / Roadmap toggle button */}
      <button
        onClick={toggleMapType}
        className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-sm shadow-md border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
        title="Toggle map type"
      >
        <span>{mapType === "roadmap" ? "🛰 Satellite" : "🗺 Map"}</span>
      </button>

      <div
        style={{
          opacity: mapReady ? 1 : 0,
          transition: "opacity 0.35s ease",
          width: "100%",
          height: "100%",
        }}
      >
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER_STYLE}
          center={center}
          zoom={16}
          onLoad={handleMapLoad}
          options={{
            mapTypeId: mapType,
            // All controls enabled
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,   // we use our own toggle
            streetViewControl: false,
            fullscreenControl: true,
            scrollwheel: true,
            disableDoubleClickZoom: false,
            draggable: true,
            clickableIcons: false,
            // Subtle style only on roadmap view
            styles: mapType === "roadmap" ? [
              { featureType: "poi", stylers: [{ visibility: "off" }] },
              { featureType: "transit", stylers: [{ visibility: "simplified" }] },
            ] : [],
          }}
        >
          {/* Custom emerald marker */}
          <Marker
            position={center}
            title="Reported Location"
            onClick={() => setShowTooltip((v) => !v)}
            icon={{
              path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
              fillColor: "#10b981",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
              scale: 2,
              anchor: new google.maps.Point(12, 24),
            }}
          />

          {/* Tooltip InfoWindow on marker click */}
          {showTooltip && (
            <InfoWindow
              position={center}
              onCloseClick={() => setShowTooltip(false)}
              options={{ pixelOffset: new google.maps.Size(0, -40) }}
            >
              <div style={{ maxWidth: 180, fontFamily: "inherit" }}>
                <p style={{ fontWeight: 700, fontSize: 12, color: "#111827", marginBottom: 2 }}>
                  📍 Reported Location
                </p>
                {title && (
                  <p style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.4 }}>
                    {title}
                  </p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
});
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

          {/* ── Location Card ─────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-gray-900">Location</h3>
            </div>

            {/* Address block */}
            <div className="px-6 pt-4 pb-3">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Address
              </p>
              <p className="text-sm font-semibold text-gray-800 leading-snug">
                {report.location?.address || (
                  <span className="text-gray-400 font-normal italic">Address unavailable</span>
                )}
              </p>
              <div className="flex flex-col gap-0.5 mt-2">
                <span className="text-xs text-gray-400 font-mono">
                  <span className="text-gray-500 font-medium not-italic">Latitude: </span>
                  {report.location?.lat?.toFixed(6)}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  <span className="text-gray-500 font-medium not-italic">Longitude: </span>
                  {report.location?.lng?.toFixed(6)}
                </span>
              </div>
            </div>

            {/* Map — full-width, 420px tall, no horizontal padding */}
            {report.location?.lat && report.location?.lng && (
              <div
                className="w-full overflow-hidden"
                style={{ height: "420px" }}
              >
                <ReportLocationMap
                  lat={report.location.lat}
                  lng={report.location.lng}
                  title={report.title}
                />
              </div>
            )}

            {/* Action buttons */}
            <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap gap-2">
              <a
                href={mapsLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Open in Google Maps
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${report.location?.lat},${report.location?.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                Get Directions
              </a>
              <button
                onClick={() => {
                  const coords = `${report.location?.lat?.toFixed(6)}, ${report.location?.lng?.toFixed(6)}`;
                  navigator.clipboard.writeText(coords).then(() => {
                    toast.success("Coordinates copied to clipboard");
                  }).catch(() => {
                    toast.error("Failed to copy coordinates");
                  });
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy Coordinates
              </button>
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

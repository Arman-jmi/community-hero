"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { getAdminReports } from "@/services/admin.service";
import { IssueReport } from "@/types/issue";
import { Loader2, MapPin, Filter, X } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/authority/reports/StatusBadge";
import { PriorityBadge } from "@/components/authority/reports/PriorityBadge";

const CATEGORIES = ["All", "Road", "Garbage", "Street Light", "Water", "Drainage", "Traffic", "Park", "Other"];

const severityColors: Record<string, string> = {
  Critical: "#dc2626",
  High: "#ea580c",
  Medium: "#d97706",
  Low: "#16a34a",
};

const severityEmoji: Record<string, string> = {
  Critical: "🔴",
  High: "🟠",
  Medium: "🟡",
  Low: "🟢",
};

function MapMarker({ report, onClick, selected }: { report: IssueReport; onClick: () => void; selected: boolean }) {
  const color = severityColors[report.severity] || "#6b7280";
  return (
    <button
      onClick={onClick}
      title={report.title}
      style={{
        position: "absolute",
        transform: "translate(-50%, -100%)",
        cursor: "pointer",
        zIndex: selected ? 10 : 5,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50% 50% 50% 0",
            backgroundColor: color,
            transform: "rotate(-45deg)",
            border: selected ? "3px solid white" : "2px solid white",
            boxShadow: selected ? `0 0 0 3px ${color}` : "0 2px 8px rgba(0,0,0,0.3)",
            transition: "all 0.2s",
          }}
        />
      </div>
    </button>
  );
}

export default function AdminMapPage() {
  const { profile } = useAuthContext();
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState<IssueReport | null>(null);

  useEffect(() => {
    async function load() {
      if (!profile) return;
      try {
        const data = await getAdminReports(profile.adminArea);
        setReports(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [profile]);

  const filtered = reports.filter((r) => {
    if (categoryFilter !== "All" && r.category !== categoryFilter) return false;
    return r.location?.lat && r.location?.lng;
  });

  // Compute bounds for the map
  const hasReports = filtered.length > 0;
  const centerLat = hasReports
    ? filtered.reduce((sum, r) => sum + r.location.lat, 0) / filtered.length
    : 28.6139;
  const centerLng = hasReports
    ? filtered.reduce((sum, r) => sum + r.location.lng, 0) / filtered.length
    : 77.209;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Legend
  const legend = [
    { color: "#dc2626", label: "Critical" },
    { color: "#ea580c", label: "High" },
    { color: "#d97706", label: "Medium" },
    { color: "#16a34a", label: "Low" },
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">City Map</h1>
        <p className="text-gray-500 text-sm mt-1">Geographic view of all reported civic issues</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium mr-2">
            <Filter className="w-4 h-4" />
            Filter by category:
          </div>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
          <div className="ml-auto text-xs text-gray-400">
            {loading ? "Loading..." : `${filtered.length} issues`}
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="relative" style={{ height: "560px" }}>
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Loading map data...</p>
              </div>
            </div>
          ) : apiKey ? (
            <iframe
              title="City Issues Map"
              src={`https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${centerLat},${centerLng}&zoom=12&maptype=roadmap`}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
          ) : (
            /* Fallback: Simple CSS-based visual map representation */
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-emerald-50 relative overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-medium">Map view requires Google Maps API key</p>
                <p className="text-gray-400 text-xs mt-1">Configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable</p>
              </div>
            </div>
          )}

          {/* Floating Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-3 z-10">
            <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Severity</p>
            <div className="space-y-1.5">
              {legend.map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-gray-600 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Report List Below Map */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-sm">
            {categoryFilter === "All" ? "All Reports" : `${categoryFilter} Reports`}
            <span className="ml-2 text-gray-400 font-normal">({filtered.length})</span>
          </h2>
        </div>
        <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <MapPin className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No reports match the selected filter</p>
            </div>
          ) : (
            filtered.map((report) => (
              <Link
                key={report.id}
                href={`/admin/reports/${report.id}`}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: severityColors[report.severity] || "#6b7280" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{report.title}</p>
                  <p className="text-xs text-gray-400">
                    {report.category} •{" "}
                    {report.location?.address ||
                      `${report.location?.lat?.toFixed(4)}, ${report.location?.lng?.toFixed(4)}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={report.status} size="sm" />
                  <PriorityBadge severity={report.severity} size="sm" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

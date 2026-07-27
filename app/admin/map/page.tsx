"use client";

import { useMemo, useState, useCallback } from "react";
import { useAdminReports } from "@/hooks/useAdminReports";
import { IssueReport } from "@/types/issue";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Loader2, MapPin, Filter, ExternalLink, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/authority/reports/StatusBadge";
import { PriorityBadge } from "@/components/authority/reports/PriorityBadge";

// Keep the libraries array stable outside the component to prevent
// useLoadScript from reloading the Maps JS SDK on every render.
const LIBRARIES: "places"[] = ["places"];

const CATEGORIES = ["All", "Road", "Garbage", "Street Light", "Water", "Drainage", "Traffic", "Park", "Other"];

const severityColors: Record<string, string> = {
  Critical: "#dc2626",
  High:     "#ea580c",
  Medium:   "#d97706",
  Low:      "#16a34a",
};

const legend = [
  { color: "#dc2626", label: "Critical" },
  { color: "#ea580c", label: "High" },
  { color: "#d97706", label: "Medium" },
  { color: "#16a34a", label: "Low" },
];

const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };

// Neutral light map options — keeps the existing Authority Portal look
const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  clickableIcons: false,
};

// ── Fallback shown when the API key is missing or Maps fails to load ──────────
function MapErrorFallback({ message }: { message: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gray-50">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-gray-500 text-sm font-medium text-center max-w-xs">
        {message}
      </p>
    </div>
  );
}

export default function AdminMapPage() {
  // Shared cached fetch — same hook used by dashboard / analytics
  const { reports, loading: reportsLoading } = useAdminReports();

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState<IssueReport | null>(null);

  // Load Maps JavaScript API — identical pattern to CommunityMap.tsx / LocationPicker.tsx
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES,
  });

  const filtered = useMemo(
    () =>
      reports.filter(
        (r) =>
          (categoryFilter === "All" || r.category === categoryFilter) &&
          r.location?.lat &&
          r.location?.lng
      ),
    [reports, categoryFilter]
  );

  // Dynamic map centre — average of visible markers, falls back to New Delhi
  const center = useMemo<google.maps.LatLngLiteral>(() => {
    if (filtered.length === 0) return { lat: 28.6139, lng: 77.209 };
    return {
      lat: filtered.reduce((s, r) => s + r.location.lat, 0) / filtered.length,
      lng: filtered.reduce((s, r) => s + r.location.lng, 0) / filtered.length,
    };
  }, [filtered]);

  const handleMarkerClick = useCallback((report: IssueReport) => {
    setSelectedReport(report);
  }, []);

  const handleInfoClose = useCallback(() => {
    setSelectedReport(null);
  }, []);

  const handleCategoryChange = useCallback((cat: string) => {
    setCategoryFilter(cat);
    setSelectedReport(null);
  }, []);

  // Determine map render state
  const mapReady = !reportsLoading && isLoaded && !loadError;
  const mapLoadError = !reportsLoading && (loadError || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

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
              onClick={() => handleCategoryChange(cat)}
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
            {reportsLoading ? "Loading..." : `${filtered.length} issues`}
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="relative" style={{ height: "560px" }}>

          {/* Loading state */}
          {(reportsLoading || (!isLoaded && !loadError)) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Loading map...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {mapLoadError && (
            <MapErrorFallback
              message={
                !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                  ? "Map view requires a Google Maps API key. Configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable."
                  : "Unable to load Google Maps. Please check the Google Maps configuration."
              }
            />
          )}

          {/* Live map — rendered only when SDK is ready */}
          {mapReady && (
            <GoogleMap
              mapContainerStyle={MAP_CONTAINER_STYLE}
              center={center}
              zoom={filtered.length > 0 ? 12 : 11}
              options={MAP_OPTIONS}
              onClick={handleInfoClose}
            >
              {filtered.map((report) => (
                <Marker
                  key={report.id}
                  position={{ lat: report.location.lat, lng: report.location.lng }}
                  title={report.title}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 9,
                    fillColor: severityColors[report.severity] || "#6b7280",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 2,
                  }}
                  onClick={() => handleMarkerClick(report)}
                />
              ))}

              {selectedReport && (
                <InfoWindow
                  position={{
                    lat: selectedReport.location.lat,
                    lng: selectedReport.location.lng,
                  }}
                  onCloseClick={handleInfoClose}
                >
                  <div style={{ maxWidth: 220, fontFamily: "inherit" }}>
                    <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, color: "#111827" }}>
                      {selectedReport.title}
                    </p>
                    <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>
                      {selectedReport.category} •{" "}
                      {selectedReport.location?.address ||
                        `${selectedReport.location?.lat?.toFixed(4)}, ${selectedReport.location?.lng?.toFixed(4)}`}
                    </p>
                    <a
                      href={`/admin/reports/${selectedReport.id}`}
                      style={{ fontSize: 11, color: "#059669", fontWeight: 600, textDecoration: "none" }}
                    >
                      View Report →
                    </a>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}

          {/* Floating Severity Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-3 z-10 pointer-events-none">
            <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Severity</p>
            <div className="space-y-1.5">
              {legend.map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
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

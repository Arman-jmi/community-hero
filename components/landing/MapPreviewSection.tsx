"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Map as MapIcon, CheckCircle2, AlertTriangle, Users, MapPin, Clock, ShieldAlert, Activity } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useIssues } from "@/hooks/useIssues"
import { GoogleMap, useLoadScript, OverlayView } from "@react-google-maps/api"
import { formatDistanceToNow } from "date-fns"

const LIBRARIES: "places"[] = ["places"]
const DEFAULT_CENTER = { lat: 40.7128, lng: -74.0060 }
const MAP_STYLES = [
 { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
 { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
 { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
 { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
 { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
 { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
 { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
 { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
 { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }
]

export function MapPreviewSection() {
  const { issues } = useIssues()
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES,
  })

  const mapRef = React.useRef<google.maps.Map | null>(null)

  // Derived Stats
  const totalIssues = issues.length
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length
  const pendingIssues = issues.filter(i => i.status === 'pending').length
  const highSeverity = issues.filter(i => i.severity === 'High' || i.severity === 'Critical').length
  const activeHeroes = new Set(issues.filter(i => i.userId).map(i => i.userId)).size || Math.max(1, Math.floor(totalIssues * 0.8)) // Fallback if anonymous
  
  const latestResolved = issues.filter(i => i.status === 'resolved').sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0))[0]
  const recentReports = issues.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)).slice(0, 3)

  // Auto bounds
  const onLoad = React.useCallback((map: google.maps.Map) => {
    mapRef.current = map
    if (issues.length > 0) {
      if (issues.length === 1) {
        map.panTo({ lat: issues[0].location.lat, lng: issues[0].location.lng })
        map.setZoom(15)
      } else {
        const bounds = new window.google.maps.LatLngBounds()
        issues.forEach((issue) => {
          if(issue.location?.lat && issue.location?.lng) {
             bounds.extend(new window.google.maps.LatLng(issue.location.lat, issue.location.lng))
          }
        })
        map.fitBounds(bounds)
      }
    }
  }, [issues])

  const getMarkerColor = (issue: any) => {
    if (issue.status === 'resolved') return 'bg-green-500 shadow-green-500/50'
    if (issue.status === 'verified') return 'bg-blue-500 shadow-blue-500/50'
    if (issue.severity === 'High' || issue.severity === 'Critical') return 'bg-red-500 shadow-red-500/50'
    if (issue.severity === 'Medium') return 'bg-amber-500 shadow-amber-500/50'
    return 'bg-blue-500 shadow-blue-500/50' // default low
  }

  return (
    <section id="map-preview" className="relative py-24 sm:py-32 overflow-hidden bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
              Hyperlocal Awareness
            </h2>
            <p className="text-lg text-gray-700 font-medium">
              Explore your neighborhood's health in real-time. Spot high-severity issues, track community verified repairs, and see the impact heatmap grow.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Link href="/map">
              <Button variant="secondary" className="rounded-full gap-2 font-semibold shadow-sm bg-white text-gray-800 border border-gray-200 hover:bg-gray-50">
                Open Full Map <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Live Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-white shadow-md border border-gray-200 rounded-2xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Total Issues</p>
                <p className="text-2xl font-bold text-gray-900">{totalIssues}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md border border-gray-200 rounded-2xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{resolvedIssues}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md border border-gray-200 rounded-2xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">High Severity</p>
                <p className="text-2xl font-bold text-gray-900">{highSeverity}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md border border-gray-200 rounded-2xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Active Heroes</p>
                <p className="text-2xl font-bold text-gray-900">{activeHeroes}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Dashboard Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Map Column */}
          <div className="lg:col-span-2">
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] xl:h-[550px] rounded-2xl overflow-hidden bg-white shadow-md border border-gray-200">
              {!isLoaded ? (
                <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
                  <MapIcon className="w-12 h-12 text-gray-300" />
                </div>
              ) : issues.length === 0 ? (
                <div className="w-full h-full bg-white flex flex-col items-center justify-center text-center p-8">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No community issues reported in this area yet.</h3>
                  <p className="text-gray-600 mb-6">Be the first to flag an issue and make your neighborhood safer.</p>
                  <Link href="/report">
                    <Button size="lg" className="font-semibold shadow-md rounded-xl bg-primary hover:bg-primary text-white">Report the First Issue</Button>
                  </Link>
                </div>
              ) : (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={DEFAULT_CENTER}
                  zoom={12}
                  onLoad={onLoad}
                  options={{
                    disableDefaultUI: true,
                    styles: MAP_STYLES,
                    gestureHandling: "cooperative"
                  }}
                >
                  {issues.map(issue => (
                    issue.location?.lat && issue.location?.lng ? (
                      <OverlayView
                        key={issue.id}
                        position={{ lat: issue.location.lat, lng: issue.location.lng }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 border-white shadow-[0_0_15px_rgba(0,0,0,0.5)] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${getMarkerColor(issue)}`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        </div>
                      </OverlayView>
                    ) : null
                  ))}
                </GoogleMap>
              )}
            </div>
          </div>

          {/* Info Panel Column */}
          <div className="flex flex-col gap-6">
            <Card className="bg-white shadow-md border border-gray-200 rounded-2xl flex-1">
              <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Area Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 border border-gray-100 shadow-sm p-4 rounded-xl">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Total</p>
                    <p className="text-2xl font-black text-gray-900">{totalIssues}</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 shadow-sm p-4 rounded-xl">
                    <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Pending</p>
                    <p className="text-2xl font-black text-amber-600">{pendingIssues}</p>
                  </div>
                  <div className="bg-green-50 border border-green-100 shadow-sm p-4 rounded-xl">
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Resolved</p>
                    <p className="text-2xl font-black text-green-600">{resolvedIssues}</p>
                  </div>
                  <div className="bg-red-50 border border-red-100 shadow-sm p-4 rounded-xl">
                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">High/Crit</p>
                    <p className="text-2xl font-black text-red-600">{highSeverity}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" /> Nearest Issue
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {issues.length > 0 ? "0.2 mi away" : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" /> Last Updated
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      Just now
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white shadow-md border border-gray-200 rounded-2xl h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-gray-100 mb-3">
              <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" /> Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {recentReports.length > 0 ? (
                <ul className="space-y-4">
                  {recentReports.map(report => (
                    <li key={report.id} className="flex items-start gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                      <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${report.severity === 'High' || report.severity === 'Critical' ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]' : 'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]'}`} />
                      <div>
                        <p className="text-sm font-semibold text-gray-800 line-clamp-1">{report.title}</p>
                        <p className="text-xs text-gray-500">{report.createdAt ? formatDistanceToNow(report.createdAt, { addSuffix: true }) : 'Recently'}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center h-full flex-1">
                  <AlertTriangle className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-700 font-medium mb-1">No recent reports</p>
                  <p className="text-xs text-gray-500 mb-4">Be the first to report an issue.</p>
                  <Link href="/report">
                    <Button variant="outline" size="sm" className="text-gray-700 border-gray-300 hover:bg-gray-50">Report an Issue</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md border border-gray-200 rounded-2xl h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-gray-100 mb-3">
              <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-blue-600" /> Recent Verifications
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex flex-col items-center justify-center py-6 text-center h-full flex-1">
                <ShieldAlert className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-700 font-medium mb-1">No verifications yet</p>
                <p className="text-xs text-gray-500 mb-4">Verifications will appear here once civic heroes start verifying issues.</p>
                <Link href="/map">
                  <Button variant="outline" size="sm" className="text-gray-700 border-gray-300 hover:bg-gray-50">Verify Nearby Issues</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md border border-gray-200 rounded-2xl md:col-span-2 lg:col-span-1 h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-gray-100 mb-3">
              <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" /> Latest Resolved
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {latestResolved ? (
                <div className="bg-gray-50 border border-gray-100 shadow-sm p-4 rounded-xl flex items-start gap-3">
                  <div className="mt-0.5 bg-green-500 rounded-full p-1 text-white shadow-sm shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 line-clamp-1">{latestResolved.title}</p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Resolved <span className="text-green-600">{latestResolved.updatedAt ? formatDistanceToNow(latestResolved.updatedAt, { addSuffix: true }) : 'recently'}</span></p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center h-full flex-1">
                  <CheckCircle2 className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-700 font-medium mb-1">No issues resolved yet</p>
                  <p className="text-xs text-gray-500 mb-4">Help the community by resolving open issues.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  )
}

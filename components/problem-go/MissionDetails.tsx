"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { IssueReport } from "@/types/issue"
import { MapPin, Navigation, ShieldAlert, ShieldCheck, ArrowLeft, Camera, User, AlertTriangle, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MissionDetailsProps {
 mission: IssueReport
 distance: number
 onBack: () => void
 onStartVerification: () => void
}

const VERIFICATION_RADIUS = 1000; // meters
const VERIFICATION_THRESHOLD = 5;

export function MissionDetails({ mission, distance, onBack, onStartVerification }: MissionDetailsProps) {
 const isOutOfRange = distance > VERIFICATION_RADIUS
 const verificationCount = mission.verificationCount ?? 0
 const progressPercent = Math.min((verificationCount / VERIFICATION_THRESHOLD) * 100, 100)
 
 const openMaps = () => {
   const url = `https://www.google.com/maps/search/?api=1&query=${mission.location.lat},${mission.location.lng}`;
   window.open(url, '_blank');
 };

 return (
 <motion.div
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="bg-white shadow-md border border-gray-200 rounded-3xl overflow-hidden flex flex-col"
 >
 <div className="relative h-64 w-full bg-zinc-800">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img src={mission.imageUrl} alt={mission.title} className="w-full h-full object-cover" />
 <div className="absolute top-4 left-4">
 <Button variant="secondary" size="icon" className="rounded-full bg-white/80 hover:bg-white text-gray-900 backdrop-blur-md shadow-sm" onClick={onBack}>
 <ArrowLeft className="h-5 w-5" />
 </Button>
 </div>
 </div>

 <div className="p-6 md:p-8 flex-1 flex flex-col">
 <div className="flex items-start justify-between mb-4">
 <div>
 <h2 className="text-2xl font-bold text-gray-900 mb-2">{mission.title}</h2>
 <div className="flex items-center gap-3 text-sm text-gray-700 flex-wrap">
 <span className="flex items-center"><MapPin className="h-4 w-4 mr-1 text-gray-500" /> {mission.location.address || 'Unknown Address'}</span>
 <span className="flex items-center"><User className="h-4 w-4 mr-1 text-gray-500" /> {mission.reporterName || 'Anonymous'}</span>
 </div>
 </div>
 <div className="text-right">
 <span className={`text-lg font-black ${isOutOfRange ? "text-red-400" : "text-emerald-400"}`}>
 {Math.round(distance)}m
 </span>
 <p className="text-xs text-gray-500 uppercase tracking-wider">Distance</p>
 </div>
 </div>
 
 <div className="flex items-center gap-3 mb-6">
   <Badge variant={mission.severity === 'Critical' || mission.severity === 'High' ? 'destructive' : 'default'} className="flex items-center gap-1">
     <AlertTriangle className="w-3 h-3" /> {mission.severity} Severity
   </Badge>
   <Badge variant="success" className="flex items-center gap-1">
     <Coins className="w-3 h-3" /> +50 XP Reward
   </Badge>
 </div>

 {/* Community Verification Progress */}
 <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 mb-6">
 <div className="flex items-center justify-between mb-3">
 <h4 className="text-sm font-bold text-gray-900 flex items-center">
 <ShieldCheck className="h-4 w-4 mr-2 text-emerald-500" />
 Community Verification
 </h4>
 <span className="text-sm font-bold text-emerald-700">{verificationCount} / {VERIFICATION_THRESHOLD} Verified</span>
 </div>
 <div className="w-full h-2.5 bg-emerald-100 rounded-full overflow-hidden">
 <div
 className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-700 ease-out"
 style={{ width: `${progressPercent}%` }}
 />
 </div>
 <p className="text-xs text-emerald-600 mt-2">
 {verificationCount >= VERIFICATION_THRESHOLD
 ? "This issue has been fully verified by the community."
 : `${VERIFICATION_THRESHOLD - verificationCount} more verification${VERIFICATION_THRESHOLD - verificationCount === 1 ? '' : 's'} needed.`}
 </p>
 </div>

 <p className="text-gray-700 mb-6 line-clamp-3 leading-relaxed">{mission.description || 'No description provided.'}</p>

 <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-8">
 <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center"><ShieldAlert className="h-4 w-4 mr-2 text-primary" /> Verification Objective</h4>
 <p className="text-sm text-gray-700">
 Walk to the location and capture a clear photo of the reported issue. The AI will cross-reference your photo with the original to determine if it has been resolved.
 </p>
 </div>

 <div className="mt-auto space-y-4">
 {isOutOfRange ? (
 <div className="text-center p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
 <p className="text-red-400 font-bold text-sm">Move closer to verify.</p>
 <p className="text-red-400/70 text-xs mt-1">You must be within 1 km of the reported location to verify this issue.</p>
 </div>
 ) : (
 <Button 
 onClick={onStartVerification}
 className="w-full h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-xl shadow-emerald-500/20 text-lg"
 >
 <Camera className="mr-2 h-5 w-5" /> Begin Verification
 </Button>
 )}
 
 <Button variant="outline" className="w-full h-14 rounded-full border-gray-300 text-gray-800 hover:bg-gray-50" onClick={openMaps}>
 <Navigation className="mr-2 h-5 w-5" /> Open in Google Maps
 </Button>
 </div>
 </div>
 </motion.div>
 )
}

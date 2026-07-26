"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { IssueReport } from "@/types/issue"
import { GeminiVerificationResult } from "@/types/problem-go"
import { MissionDetails } from "@/components/problem-go/MissionDetails"
import { VerificationCamera } from "@/components/problem-go/VerificationCamera"
import { VerificationResult } from "@/components/problem-go/VerificationResult"
import { RewardPopup } from "@/components/problem-go/RewardPopup"
import { getIssueById, verifyIssue } from "@/services/problemGo.service"
import { useAuthContext } from "@/contexts/AuthContext"

type FlowState = "DETAILS" | "CAMERA" | "ANALYZING" | "RESULT" | "REWARD"

export default function MissionPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthContext()
  
  const id = params.id as string

  const [issue, setIssue] = React.useState<IssueReport | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [userLocation, setUserLocation] = React.useState<google.maps.LatLngLiteral | null>(null)
  
  const [flowState, setFlowState] = React.useState<FlowState>("DETAILS")
  
  const [aiResult, setAiResult] = React.useState<GeminiVerificationResult | null>(null)
  const [rewardData, setRewardData] = React.useState<{xpAwarded: number, badgesUnlocked: string[]}>({xpAwarded: 0, badgesUnlocked: []})

  React.useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("GPS error:", err),
        { enableHighAccuracy: true }
      )
      return () => navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  React.useEffect(() => {
    const fetchIssue = async () => {
      setLoading(true)
      const data = await getIssueById(id)
      setIssue(data)
      setLoading(false)
    }
    fetchIssue()
  }, [id])

  const getDistance = (mission: IssueReport) => {
    if (!userLocation) return 9999
    const R = 6371e3
    const φ1 = userLocation.lat * Math.PI/180
    const φ2 = mission.location.lat * Math.PI/180
    const Δφ = (mission.location.lat - userLocation.lat) * Math.PI/180
    const Δλ = (mission.location.lng - userLocation.lng) * Math.PI/180
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const handleCapture = async (file: File) => {
    if (!issue || !user) {
      if (!user) alert("You must be logged in to verify issues.");
      return;
    }
    
    setFlowState("ANALYZING")
    
    try {
      const { compressImageToBase64 } = await import("@/services/issue.service");
      const base64Image = await compressImageToBase64(file);
      
      const { result, xpEarned } = await verifyIssue(issue.id!, user.uid, issue.imageUrl, base64Image)
      
      setAiResult(result)
      setRewardData({ xpAwarded: xpEarned, badgesUnlocked: [] }) // Add real badge logic if needed later
      setFlowState("RESULT")
      
    } catch (err: any) {
      console.error(err)
      if (err?.message?.includes("DUPLICATE_VERIFICATION")) {
        alert("You have already verified this issue.")
        setFlowState("DETAILS")
      } else {
        alert("Verification failed. Please try again.")
        setFlowState("CAMERA")
      }
    }
  }

  const handleContinue = () => {
    if (aiResult?.status === "Fake Report") {
      router.push("/problem-go")
    } else {
      setFlowState("REWARD")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Mission Not Found</h2>
        <button onClick={() => router.push("/problem-go")} className="text-primary hover:underline">
          Back to Map
        </button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background pb-24 pt-8">
      <div className="max-w-3xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {flowState === "DETAILS" && (
            <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MissionDetails 
                mission={issue}
                distance={getDistance(issue)}
                onBack={() => router.push("/problem-go")}
                onStartVerification={() => setFlowState("CAMERA")}
              />
            </motion.div>
          )}

          {(flowState === "CAMERA" || flowState === "ANALYZING") && (
            <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <VerificationCamera 
                isProcessing={flowState === "ANALYZING"}
                onCapture={handleCapture}
                onCancel={() => setFlowState("DETAILS")}
              />
            </motion.div>
          )}

          {flowState === "RESULT" && aiResult && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <VerificationResult 
                result={aiResult as any}
                onContinue={handleContinue}
              />
            </motion.div>
          )}

          {flowState === "REWARD" && (
            <motion.div key="reward" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute inset-0 z-50 flex items-center justify-center">
              <RewardPopup 
                reward={rewardData as any}
                onClose={() => router.push("/problem-go")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

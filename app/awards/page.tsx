"use client"

import * as React from "react"
import { AwardsDashboard } from "@/components/awards/AwardsDashboard"
import { useAuthContext } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function AwardsPage() {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Breadcrumb */}
        <div className="mb-6 text-sm font-medium text-gray-500 flex items-center gap-2">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">Awards</span>
        </div>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-emerald-800 mb-2">
            🏅 Awards &amp; Badges
          </h1>
          <p className="text-gray-500 text-lg">
            Your civic contributions, officially recognized.
          </p>
        </div>

        <AwardsDashboard />

      </div>
    </main>
  )
}

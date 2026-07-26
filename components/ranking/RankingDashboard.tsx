"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { toast } from "sonner"
import {
  FileText, CheckCircle, Trophy, Activity, Calendar,
  Zap, Star, Users, Clock, ChevronRight, User,
} from "lucide-react"
import { useAuthContext } from "@/contexts/AuthContext"
import { getUserRankingStats, RankingStats } from "@/services/ranking.service"
import { StatCard } from "./StatCard"
import { LevelProgressCard } from "./LevelProgressCard"
import { AccuracyCard } from "./AccuracyCard"

// ─── Types ────────────────────────────────────────────────────────────────────

interface LeaderboardEntry {
  rank: number
  uid: string
  name: string
  avatar?: string
  xp: number
  badgesCount: number
}

interface XPHistoryEntry {
  id?: string
  type: string
  xp: number
  description: string
  createdAt: any
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ icon, title, href, linkLabel }: {
  icon: React.ReactNode
  title: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="p-2 rounded-xl bg-emerald-100">{icon}</div>
      <h2 className="text-xl font-bold text-gray-900 flex-1">{title}</h2>
      {href && linkLabel && (
        <Link
          href={href}
          className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 transition-colors"
        >
          {linkLabel} <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}

// ─── Leaderboard Row ─────────────────────────────────────────────────────────

function LeaderboardRow({
  entry,
  isCurrentUser,
  delay,
}: {
  entry: LeaderboardEntry
  isCurrentUser: boolean
  delay: number
}) {
  const rankMedal =
    entry.rank === 1 ? "🥇" :
    entry.rank === 2 ? "🥈" :
    entry.rank === 3 ? "🥉" : null

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
        isCurrentUser
          ? "bg-emerald-50 border border-emerald-200"
          : "hover:bg-gray-50 border border-transparent"
      }`}
    >
      {/* Rank */}
      <div className="w-8 flex-shrink-0 text-center">
        {rankMedal ? (
          <span className="text-xl">{rankMedal}</span>
        ) : (
          <span className="text-sm font-bold text-gray-400">#{entry.rank}</span>
        )}
      </div>

      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-emerald-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
        {entry.avatar ? (
          <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
        ) : (
          <User className="w-5 h-5 text-emerald-500" />
        )}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-sm truncate ${isCurrentUser ? "text-emerald-800" : "text-gray-900"}`}>
          {entry.name}
          {isCurrentUser && (
            <span className="ml-2 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">You</span>
          )}
        </p>
        <p className="text-[11px] text-gray-400 font-medium">{entry.badgesCount} badges</p>
      </div>

      {/* XP */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-black text-emerald-700">{entry.xp.toLocaleString()}</p>
        <p className="text-[10px] text-gray-400 font-semibold">XP</p>
      </div>
    </motion.div>
  )
}

// ─── Activity Item ────────────────────────────────────────────────────────────

function ActivityItem({ entry, delay }: { entry: XPHistoryEntry; delay: number }) {
  const isPositive = entry.xp > 0

  const icon =
    entry.type === "REPORT_CREATED" ? "📄" :
    entry.type === "REPORT_APPROVED" ? "🛠️" :
    entry.type === "VERIFICATION_COMPLETED" ? "✅" :
    entry.type === "MILESTONE" ? "🏅" :
    entry.type === "DAILY_LOGIN" ? "☀️" :
    entry.type === "FAKE_REPORT" ? "⚠️" :
    entry.type === "AREA_BONUS" ? "📍" :
    "⭐"

  let timeAgo = "Recently"
  try {
    const date = entry.createdAt?.toDate
      ? entry.createdAt.toDate()
      : entry.createdAt?.seconds
      ? new Date(entry.createdAt.seconds * 1000)
      : new Date(entry.createdAt)
    const diffMin = Math.round((Date.now() - date.getTime()) / 60000)
    if (diffMin < 60) timeAgo = `${diffMin}m ago`
    else if (diffMin < 1440) timeAgo = `${Math.round(diffMin / 60)}h ago`
    else timeAgo = `${Math.round(diffMin / 1440)}d ago`
  } catch { /* keep default */ }

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0"
    >
      <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 leading-snug">{entry.description}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{timeAgo}</p>
      </div>
      <span className={`text-sm font-black flex-shrink-0 ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
        {isPositive ? "+" : ""}{entry.xp} XP
      </span>
    </motion.div>
  )
}

// ─── Badge Progress Preview ───────────────────────────────────────────────────

function BadgePreviewItem({ badge, delay }: { badge: any; delay: number }) {
  const pct = Math.min((badge.progress / badge.target) * 100, 100)
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0"
    >
      <span className="text-2xl flex-shrink-0">{badge.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm font-bold text-gray-800 truncate">{badge.name}</p>
          <span className="text-[11px] font-semibold text-gray-400 ml-2 flex-shrink-0">
            {badge.progress}/{badge.target}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(pct, pct > 0 ? 3 : 0)}%` }}
            transition={{ delay: delay + 0.2, duration: 0.9, ease: "easeOut" }}
            className="h-full bg-emerald-400 rounded-full"
          />
        </div>
      </div>
      {badge.rewardXP > 0 && (
        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex-shrink-0">
          +{badge.rewardXP} XP
        </span>
      )}
    </motion.div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function RankingDashboard() {
  const { profile, user } = useAuthContext()
  const [stats, setStats] = React.useState<RankingStats | null>(null)
  const [leaderboard, setLeaderboard] = React.useState<LeaderboardEntry[]>([])
  const [activity, setActivity] = React.useState<XPHistoryEntry[]>([])
  const [inProgressBadges, setInProgressBadges] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!user || !profile) return

    async function loadAll() {
      setLoading(true)
      try {
        // Load ranking stats
        const rankingData = await getUserRankingStats(user!.uid, profile!.xp)
        setStats(rankingData)

        // Load top leaderboard
        const { getLeaderboard } = await import("@/services/leaderboard.service")
        const lb = await getLeaderboard("all-time", 10)
        setLeaderboard(lb)

        // Load XP activity history
        const { getXPHistory } = await import("@/services/xp.service")
        const hist = await getXPHistory(user!.uid, 8)
        setActivity(hist as any)

        // Load in-progress badges
        const { syncUserBadges } = await import("@/services/award.service")
        const { badges } = await syncUserBadges(user!.uid)
        const inProgress = badges
          .filter((b: any) => !b.isUnlocked && b.progress > 0)
          .sort((a: any, b: any) => (b.progress / b.target) - (a.progress / a.target))
          .slice(0, 4)
        setInProgressBadges(inProgress)

      } catch (err) {
        console.error("Error loading ranking data:", err)
        toast.error("Some stats failed to load.")
      }
      setLoading(false)
    }
    loadAll()
  }, [user, profile])

  if (!profile || loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
        <p className="text-gray-400 text-sm font-medium animate-pulse">Loading your stats…</p>
      </div>
    )
  }

  const totalVerifications = profile.reportsVerified || 0
  const fakeReports = profile.fakeReports || 0
  const totalReports = profile.reportsSubmitted || 0
  const accuracy = (totalVerifications + fakeReports) > 0
    ? Math.round((totalVerifications / (totalVerifications + fakeReports)) * 100)
    : 100

  // Find current user in leaderboard
  const myEntry = leaderboard.find((e) => e.uid === user?.uid)

  return (
    <div className="space-y-10">

      {/* ── 1. Hero Level Card ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6">
        <LevelProgressCard
          level={profile.level}
          currentXp={profile.xp}
          globalRank={stats.currentRank}
          delay={0.05}
        />
      </div>

      {/* ── 2. Stats Grid ──────────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          icon={<Activity className="w-5 h-5 text-emerald-600" />}
          title="Your Statistics"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard
            title="Global Rank"
            value={`#${stats.currentRank}`}
            icon={Trophy}
            description="Your position among all heroes"
            trend={stats.currentRank <= 100 ? "Top 100" : undefined}
            trendUp={stats.currentRank <= 100}
            accentColor="amber"
            delay={0.1}
          />
          <StatCard
            title="Total XP"
            value={profile.xp.toLocaleString()}
            icon={Zap}
            description="Lifetime experience points"
            accentColor="emerald"
            delay={0.15}
          />
          <StatCard
            title="Reports Submitted"
            value={totalReports}
            icon={FileText}
            description="Civic issues you've reported"
            accentColor="blue"
            delay={0.2}
          />
          <StatCard
            title="Verifications"
            value={totalVerifications}
            icon={CheckCircle}
            description="Issues you helped verify"
            accentColor="teal"
            delay={0.25}
          />
          <StatCard
            title="Accuracy"
            value={`${accuracy}%`}
            icon={Trophy}
            description="Verification accuracy rate"
            accentColor="purple"
            delay={0.3}
          />
          <StatCard
            title="Weekly XP"
            value={`+${stats.weeklyXp.toLocaleString()}`}
            icon={Activity}
            description="XP earned this week"
            trend="This week"
            trendUp={stats.weeklyXp > 0}
            accentColor="rose"
            delay={0.35}
          />
          <StatCard
            title="Monthly XP"
            value={`+${stats.monthlyXp.toLocaleString()}`}
            icon={Calendar}
            description="XP earned this month"
            trend="This month"
            trendUp={stats.monthlyXp > 0}
            accentColor="orange"
            delay={0.4}
          />
          <AccuracyCard
            reportsVerified={totalVerifications}
            fakeReports={fakeReports}
            delay={0.45}
          />
        </div>
      </section>

      {/* ── 3. Two-column: Leaderboard + Activity ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Leaderboard Preview */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <SectionHeader
            icon={<Users className="w-5 h-5 text-emerald-600" />}
            title="Top Civic Heroes"
            href="/leaderboard"
            linkLabel="Full Leaderboard"
          />
          {leaderboard.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">🏆</p>
              <p className="font-medium">No leaderboard data yet.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {leaderboard.map((entry, idx) => (
                <LeaderboardRow
                  key={entry.uid}
                  entry={entry}
                  isCurrentUser={entry.uid === user?.uid}
                  delay={0.05 + idx * 0.04}
                />
              ))}
              {/* If current user not in top 10, show them at bottom */}
              {!myEntry && (
                <div className="mt-2 pt-2 border-t border-dashed border-gray-100">
                  <LeaderboardRow
                    entry={{
                      rank: stats.currentRank,
                      uid: user?.uid ?? "",
                      name: profile.name || "You",
                      avatar: profile.avatar,
                      xp: profile.xp,
                      badgesCount: profile.badges?.length ?? 0,
                    }}
                    isCurrentUser={true}
                    delay={0.6}
                  />
                </div>
              )}
            </div>
          )}
        </section>

        {/* Activity Timeline */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <SectionHeader
            icon={<Clock className="w-5 h-5 text-emerald-600" />}
            title="Recent Activity"
          />
          {activity.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">📋</p>
              <p className="font-medium">No recent activity yet.</p>
              <p className="text-sm mt-1">Start reporting issues to see your history!</p>
            </div>
          ) : (
            <div>
              {activity.map((entry, idx) => (
                <ActivityItem key={entry.id ?? idx} entry={entry} delay={0.05 + idx * 0.04} />
              ))}
            </div>
          )}
        </section>

      </div>

      {/* ── 4. Badge Progress Preview ──────────────────────────────────────── */}
      {inProgressBadges.length > 0 && (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <SectionHeader
            icon={<Star className="w-5 h-5 text-emerald-600" />}
            title="Badges In Progress"
            href="/awards"
            linkLabel="View All Awards"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            {inProgressBadges.map((badge, idx) => (
              <BadgePreviewItem key={badge.id} badge={badge} delay={0.05 + idx * 0.06} />
            ))}
          </div>
          {inProgressBadges.length === 0 && (
            <div className="text-center py-6 text-gray-400">
              <p className="text-4xl mb-2">🏅</p>
              <p className="font-medium">You haven't started any badges yet.</p>
              <Link href="/awards" className="text-emerald-600 font-semibold hover:underline text-sm mt-1 block">
                Explore available badges →
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Empty state for badges */}
      {inProgressBadges.length === 0 && (
        <section className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center">
          <p className="text-4xl mb-2">🏅</p>
          <p className="text-emerald-800 font-bold">Start earning badges!</p>
          <p className="text-emerald-600 text-sm mt-1">Report your first issue to unlock your first achievement.</p>
          <Link
            href="/awards"
            className="inline-flex items-center gap-1 mt-4 bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors"
          >
            Explore Awards <ChevronRight className="w-4 h-4" />
          </Link>
        </section>
      )}

    </div>
  )
}

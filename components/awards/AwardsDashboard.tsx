"use client"

import * as React from "react"
import { toast } from "sonner"
import { Award, Lock, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { syncUserBadges, EvaluatedBadge } from "@/services/award.service"
import { useAuthContext } from "@/contexts/AuthContext"
import { getInProgressBadges, groupBadgesByCategory } from "@/utils/badge-helpers"
import { BadgeCategory, BADGE_CATEGORY_META } from "@/config/badge-definitions"
import { AwardsStatsBar } from "./AwardsStatsBar"
import { BadgeCard } from "./BadgeCard"
import { BadgeCategorySection } from "./BadgeCategorySection"

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  count,
  accent,
}: {
  icon: React.ReactNode
  title: string
  count?: number
  accent: string
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`p-2 rounded-xl ${accent}`}>{icon}</div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {count !== undefined && (
        <span className="ml-auto text-[12px] font-bold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
          {count}
        </span>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AwardsDashboard() {
  const { user, profile } = useAuthContext()
  const [badges, setBadges] = React.useState<EvaluatedBadge[]>([])
  const [streak, setStreak] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [toastedIds, setToastedIds] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    if (!user) return

    async function fetchBadges() {
      setLoading(true)
      try {
        const result = await syncUserBadges(user!.uid)
        setBadges(result.badges)

        // Fire toast notifications for newly unlocked badges (only once per session)
        result.newlyUnlocked.forEach((b) => {
          if (!toastedIds.has(b.id)) {
            toast.success(`🎉 Achievement Unlocked!`, {
              description: `${b.icon} ${b.name}${b.rewardXP > 0 ? ` · +${b.rewardXP} XP Earned` : ""}`,
              duration: 5000,
            })
            setToastedIds((prev) => new Set([...prev, b.id]))
          }
        })

        // Extract streak from streak badges' progress for display
        const streakBadge = result.badges.find((b) => b.id === "streak_100")
        if (!streakBadge) {
          const s7 = result.badges.find((b) => b.id === "streak_7")
          setStreak(s7?.progress ?? 0)
        } else {
          setStreak(streakBadge.progress)
        }
      } catch (error) {
        console.error("Failed to load badges:", error)
        toast.error("Failed to load achievements. Please try again.")
      }
      setLoading(false)
    }

    fetchBadges()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (!user || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
        <p className="text-gray-400 text-sm font-medium animate-pulse">Loading your achievements…</p>
      </div>
    )
  }

  const xp = profile?.xp ?? profile?.totalXP ?? 0
  const level = profile?.level ?? 1

  const earnedBadges = badges
    .filter((b) => b.isUnlocked)
    .sort((a, b) => {
      const tsA = (a.earnedAt as any)?.seconds ?? 0
      const tsB = (b.earnedAt as any)?.seconds ?? 0
      return tsB - tsA // most recent first
    })

  const inProgressBadges = getInProgressBadges(badges).slice(0, 12)

  const lockedBadges = badges.filter((b) => !b.isUnlocked && b.progress === 0)
  const lockedByCategory = groupBadgesByCategory(lockedBadges)
  const lockedCategoryOrder: BadgeCategory[] = [
    "reporting", "verification", "xp", "level", "streak",
    "impact", "problemgo", "milestone", "rare",
  ]

  return (
    <div className="space-y-10">

      {/* Stats Summary Bar */}
      <AwardsStatsBar
        badges={badges}
        totalXP={xp}
        level={level}
        streak={streak}
      />

      {/* ── Section 1: Earned Badges ────────────────────────────────────────── */}
      <section>
        <SectionHeader
          icon={<Award className="w-5 h-5 text-emerald-600" />}
          title="Earned Badges"
          count={earnedBadges.length}
          accent="bg-emerald-100"
        />
        {earnedBadges.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-10 text-center"
          >
            <p className="text-4xl mb-3">🌱</p>
            <p className="text-gray-500 font-medium">No badges earned yet.</p>
            <p className="text-gray-400 text-sm mt-1">Start reporting and verifying issues to unlock your first badge!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {earnedBadges.map((badge, idx) => (
              <BadgeCard key={badge.id} badge={badge} delay={idx * 0.04} />
            ))}
          </div>
        )}
      </section>

      <div className="border-t border-gray-100" />

      {/* ── Section 2: In Progress ──────────────────────────────────────────── */}
      {inProgressBadges.length > 0 && (
        <section>
          <SectionHeader
            icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
            title="In Progress"
            count={inProgressBadges.length}
            accent="bg-blue-50"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {inProgressBadges.map((badge, idx) => (
              <BadgeCard key={badge.id} badge={badge} delay={idx * 0.04} />
            ))}
          </div>
        </section>
      )}

      {inProgressBadges.length > 0 && <div className="border-t border-gray-100" />}

      {/* ── Section 3: Locked Badges by Category ───────────────────────────── */}
      {lockedBadges.length > 0 && (
        <section>
          <SectionHeader
            icon={<Lock className="w-5 h-5 text-gray-400" />}
            title="Locked Badges"
            count={lockedBadges.length}
            accent="bg-gray-100"
          />
          <div className="space-y-3">
            {lockedCategoryOrder.map((cat) => {
              const catBadges = lockedByCategory.get(cat) ?? []
              if (catBadges.length === 0) return null
              return (
                <BadgeCategorySection
                  key={cat}
                  category={cat}
                  badges={catBadges}
                  defaultOpen={false}
                />
              )
            })}
          </div>
        </section>
      )}

      {/* All unlocked! */}
      {lockedBadges.length === 0 && earnedBadges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-10 text-center"
        >
          <p className="text-5xl mb-3">🎉</p>
          <p className="text-emerald-800 font-bold text-xl">Incredible! You&apos;ve unlocked every badge!</p>
          <p className="text-emerald-600 mt-2">You are a true Community Legend.</p>
        </motion.div>
      )}

    </div>
  )
}

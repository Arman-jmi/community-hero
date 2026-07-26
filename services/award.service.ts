"use server"

import { db } from "@/lib/firebase/config"
import {
  doc, getDoc, updateDoc, collection, query,
  where, getDocs, Timestamp, arrayUnion
} from "firebase/firestore"
import { UserProfile, UserBadge } from "@/types/user"
import { BADGE_DEFINITIONS, BadgeCategory, BadgeExtras } from "@/config/badge-definitions"
import { awardXP } from "@/services/xp.service"
import { computeDaysSince } from "@/utils/badge-helpers"

// ─── Evaluated Badge (returned to UI) ────────────────────────────────────────

export interface EvaluatedBadge {
  id: string
  name: string
  description: string
  icon: string
  category: BadgeCategory
  isUnlocked: boolean
  progress: number
  target: number
  rewardXP: number
  earnedAt: Timestamp | null
}

// ─── Streak Calculation ───────────────────────────────────────────────────────

async function calculateMaxStreak(userId: string): Promise<number> {
  try {
    const reportsQ = query(collection(db, "reports"), where("userId", "==", userId))
    const verificationsQ = query(collection(db, "verifications"), where("userId", "==", userId))

    const [reportsSnap, verificationsSnap] = await Promise.all([
      getDocs(reportsQ),
      getDocs(verificationsQ),
    ])

    const activityDates = new Set<string>()

    reportsSnap.forEach((docSnap) => {
      const data = docSnap.data()
      const date = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
      activityDates.add(date.toISOString().split("T")[0])
    })

    verificationsSnap.forEach((docSnap) => {
      const data = docSnap.data()
      const date = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
      activityDates.add(date.toISOString().split("T")[0])
    })

    const sortedDates = Array.from(activityDates).sort()
    if (sortedDates.length === 0) return 0

    let maxStreak = 1
    let currentStreak = 1

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1])
      const currDate = new Date(sortedDates[i])
      const diffDays = Math.round(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (diffDays === 1) {
        currentStreak++
        if (currentStreak > maxStreak) maxStreak = currentStreak
      } else if (diffDays > 1) {
        currentStreak = 1
      }
    }

    return maxStreak
  } catch {
    return 0
  }
}

// ─── Badge Sync — Main Export ─────────────────────────────────────────────────

export interface SyncBadgesResult {
  badges: EvaluatedBadge[]
  newlyUnlocked: EvaluatedBadge[]
}

/**
 * Evaluate all badge definitions against the current user state.
 * - Unlocks any newly earned badges and writes them to Firestore.
 * - Awards bonus XP for each newly unlocked badge (if rewardXP > 0).
 * - Returns all evaluated badges plus the list of newly unlocked ones.
 */
export async function syncUserBadges(userId: string): Promise<SyncBadgesResult> {
  const userRef = doc(db, "users", userId)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    throw new Error("User not found")
  }

  const userData = userSnap.data() as UserProfile
  const existingBadges: UserBadge[] = userData.badges || []

  // Compute extras once
  const [streak, leaderboardRank] = await Promise.all([
    calculateMaxStreak(userId),
    Promise.resolve(0), // Leaderboard rank: extend later via leaderboard.service
  ])

  const memberDays = computeDaysSince(userData.createdAt)

  const extras: BadgeExtras = { streak, leaderboardRank, memberDays }

  const newlyUnlocked: UserBadge[] = []
  const evaluatedBadges: EvaluatedBadge[] = []

  for (const def of BADGE_DEFINITIONS) {
    const progressVal = Math.floor(def.calculateProgress(userData, extras))
    const existingBadge = existingBadges.find((b) => b.id === def.id)

    if (existingBadge) {
      // Already unlocked — return stored state
      evaluatedBadges.push({
        id: def.id,
        name: def.name,
        description: def.description,
        icon: def.icon,
        category: def.category,
        isUnlocked: true,
        progress: def.target,
        target: def.target,
        rewardXP: def.rewardXP,
        earnedAt: existingBadge.earnedAt,
      })
    } else if (progressVal >= def.target) {
      // Newly unlocked — write to Firestore
      const newBadge: UserBadge = {
        id: def.id,
        name: def.name,
        description: def.description,
        iconUrl: def.icon,
        earnedAt: Timestamp.now(),
      }
      newlyUnlocked.push(newBadge)
      evaluatedBadges.push({
        id: def.id,
        name: def.name,
        description: def.description,
        icon: def.icon,
        category: def.category,
        isUnlocked: true,
        progress: def.target,
        target: def.target,
        rewardXP: def.rewardXP,
        earnedAt: newBadge.earnedAt,
      })
    } else {
      // Still locked — return with current progress
      evaluatedBadges.push({
        id: def.id,
        name: def.name,
        description: def.description,
        icon: def.icon,
        category: def.category,
        isUnlocked: false,
        progress: progressVal,
        target: def.target,
        rewardXP: def.rewardXP,
        earnedAt: null,
      })
    }
  }

  // Persist newly unlocked badges + award their XP bonuses
  if (newlyUnlocked.length > 0) {
    await updateDoc(userRef, {
      badges: arrayUnion(...newlyUnlocked),
    })

    // Award XP for each badge that has a rewardXP > 0
    const xpAwardPromises = newlyUnlocked
      .filter((b) => {
        const def = BADGE_DEFINITIONS.find((d) => d.id === b.id)
        return def && def.rewardXP > 0
      })
      .map((b) => {
        const def = BADGE_DEFINITIONS.find((d) => d.id === b.id)!
        return awardXP(
          userId,
          "MILESTONE",
          def.rewardXP,
          `Badge Unlocked: ${def.name}`
        )
      })

    await Promise.allSettled(xpAwardPromises)
  }

  const newlyUnlockedEvaluated = evaluatedBadges.filter((b) =>
    newlyUnlocked.some((n) => n.id === b.id)
  )

  return { badges: evaluatedBadges, newlyUnlocked: newlyUnlockedEvaluated }
}

"use server"

import { db } from "@/lib/firebase/config"
import {
  doc, getDoc, updateDoc, addDoc, collection, query,
  orderBy, limit, getDocs, where, Timestamp, increment, runTransaction
} from "firebase/firestore"
import { XPTransactionType, XPHistoryEntry } from "@/types/user"

// ─── XP Reward Constants ─────────────────────────────────────────────────────

import { LEVEL_THRESHOLDS, calculateLevel, getLevelProgress } from "@/utils/xp-helpers"
import { XP_VALUES } from "@/utils/xpConstants"

// ─── Core XP Operations ──────────────────────────────────────────────────────

/**
 * Award XP to a user using a Firestore transaction.
 * Creates an XP history entry in subcollection and updates user totals atomically.
 */
export async function awardXP(
  userId: string,
  type: XPTransactionType,
  xpAmount: number,
  description: string,
  issueId?: string
): Promise<{ newTotalXP: number; newLevel: number }> {
  const userRef = doc(db, "users", userId)

  // Add XP history entry to subcollection
  const historyEntry: Omit<XPHistoryEntry, "id"> = {
    type,
    xp: xpAmount,
    description,
    createdAt: Timestamp.now(),
    ...(issueId && { issueId }),
  }

  await addDoc(collection(db, "users", userId, "xpHistory"), historyEntry)

  // Atomically update user XP and level
  const result = await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRef)
    if (!userSnap.exists()) {
      throw new Error("User not found")
    }

    const userData = userSnap.data()
    const currentXP = userData.xp ?? userData.totalXP ?? 0
    const newTotalXP = Math.max(0, currentXP + xpAmount) // Floor at 0
    const newLevel = calculateLevel(newTotalXP)

    const updatePayload: Record<string, any> = {
      xp: newTotalXP,
      totalXP: newTotalXP,
      level: newLevel,
      updatedAt: Timestamp.now(),
    }

    // Track specific counters based on type
    if (type === "VERIFICATION_COMPLETED") {
      updatePayload.successfulVerifications = increment(1)
      updatePayload.reportsVerified = increment(1)
    } else if (type === "REPORT_APPROVED") {
      updatePayload.reportsApproved = increment(1)
    } else if (type === "FAKE_REPORT") {
      updatePayload.fakeReports = increment(1)
    }

    transaction.update(userRef, updatePayload)

    return { newTotalXP, newLevel }
  })

  return result
}

/**
 * Deduct XP from a user. Convenience wrapper around awardXP with negative value.
 */
export async function deductXP(
  userId: string,
  type: XPTransactionType,
  xpAmount: number,
  description: string,
  issueId?: string
): Promise<{ newTotalXP: number; newLevel: number }> {
  // Ensure we pass a negative value
  const negativeAmount = xpAmount > 0 ? -xpAmount : xpAmount
  return awardXP(userId, type, negativeAmount, description, issueId)
}

// ─── XP History ──────────────────────────────────────────────────────────────

/**
 * Fetch recent XP history for a user from the subcollection
 */
export async function getXPHistory(
  userId: string,
  maxEntries: number = 10
): Promise<XPHistoryEntry[]> {
  try {
    const historyRef = collection(db, "users", userId, "xpHistory")
    const q = query(historyRef, orderBy("createdAt", "desc"), limit(maxEntries))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        type: data.type as XPTransactionType,
        xp: data.xp,
        description: data.description,
        issueId: data.issueId,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      } as XPHistoryEntry
    })
  } catch (error) {
    console.error("Error fetching XP history:", error)
    return []
  }
}

/**
 * Get XP earned by a user within a specific date range (for ranking)
 */
export async function getXPInDateRange(
  userId: string,
  sinceDate: Date
): Promise<number> {
  try {
    const historyRef = collection(db, "users", userId, "xpHistory")
    const cutoffTimestamp = Timestamp.fromDate(sinceDate)
    const q = query(historyRef, where("createdAt", ">=", cutoffTimestamp))
    const snapshot = await getDocs(q)

    let total = 0
    snapshot.forEach((docSnap) => {
      total += docSnap.data().xp ?? 0
    })

    return total
  } catch (error) {
    console.error("Error fetching XP in date range:", error)
    return 0
  }
}

// ─── Daily Login ─────────────────────────────────────────────────────────────

/**
 * Check and award daily login XP if >24 hours since last award
 */
export async function checkDailyLogin(userId: string): Promise<boolean> {
  try {
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) return false

    const userData = userSnap.data()
    const lastReward = userData.lastDailyReward

    const now = new Date()
    let shouldAward = false

    if (!lastReward) {
      shouldAward = true
    } else {
      const lastRewardDate = lastReward.toDate ? lastReward.toDate() : new Date(lastReward)
      const hoursSinceLastReward = (now.getTime() - lastRewardDate.getTime()) / (1000 * 60 * 60)
      shouldAward = hoursSinceLastReward >= 24
    }

    if (shouldAward) {
      // Update lastDailyReward timestamp
      await updateDoc(userRef, {
        lastDailyReward: Timestamp.now(),
      })

      // Award the XP
      await awardXP(userId, "DAILY_LOGIN", XP_VALUES.DAILY_LOGIN, "Daily login reward")

      return true
    }

    return false
  } catch (error) {
    console.error("Error checking daily login:", error)
    return false
  }
}

// ─── Milestone Checks ────────────────────────────────────────────────────────

/**
 * Check if the user has crossed the 10-resolved-reports milestone.
 * Should be called after a report is resolved.
 */
export async function checkMilestones(userId: string, issueId?: string): Promise<void> {
  try {
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) return

    const userData = userSnap.data()
    const reportsApproved = userData.reportsApproved ?? 0

    // Check 10-resolved milestone (only award once)
    if (reportsApproved === 10) {
      // Check if milestone was already awarded
      const historyRef = collection(db, "users", userId, "xpHistory")
      const milestoneQuery = query(historyRef, where("type", "==", "MILESTONE"), limit(1))
      const existing = await getDocs(milestoneQuery)

      if (existing.empty) {
        await awardXP(
          userId,
          "MILESTONE",
          XP_VALUES.MILESTONE_10_RESOLVED,
          "Milestone: 10 reports approved!",
          issueId
        )
      }
    }
  } catch (error) {
    console.error("Error checking milestones:", error)
  }
}

/**
 * Check if this is the user's first approved report in a given admin area.
 * Awards area bonus if so.
 */
export async function checkAreaBonus(
  userId: string,
  adminArea: string,
  issueId?: string
): Promise<boolean> {
  try {
    // Check if user has any previously approved reports in this area
    const reportsRef = collection(db, "reports")
    const areaQuery = query(
      reportsRef,
      where("userId", "==", userId),
      where("adminArea", "==", adminArea),
      where("status", "==", "verified")
    )
    const existing = await getDocs(areaQuery)

    // If this is the only one (just approved), it's the first
    if (existing.size <= 1) {
      await awardXP(
        userId,
        "AREA_BONUS",
        XP_VALUES.AREA_BONUS,
        `First approved report in ${adminArea}`,
        issueId
      )
      return true
    }

    return false
  } catch (error) {
    console.error("Error checking area bonus:", error)
    return false
  }
}

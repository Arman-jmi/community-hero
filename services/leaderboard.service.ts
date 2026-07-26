"use server"

import { db } from "@/lib/firebase/config"
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from "firebase/firestore"
import { UserProfile } from "@/types/user"

export type Timeframe = 'all-time' | 'monthly' | 'weekly'

export interface LeaderboardEntry {
  rank: number
  uid: string
  name: string
  avatar?: string
  xp: number
  reportsSubmitted: number
  reportsVerified: number
  badgesCount: number
}

export async function getLeaderboard(timeframe: Timeframe, maxLimit: number = 100): Promise<LeaderboardEntry[]> {
  try {
    const usersRef = collection(db, "users")
    const allUsersSnap = await getDocs(usersRef)
    const entries: LeaderboardEntry[] = []

    if (timeframe === 'all-time') {
      const sortedUsers = allUsersSnap.docs.map(doc => {
        const data = doc.data() as UserProfile
        return {
          uid: data.uid,
          name: data.name || "Anonymous Hero",
          avatar: data.avatar,
          xp: data.xp || data.totalXP || 0,
          reportsSubmitted: data.reportsApproved || 0, // Using approved reports instead of raw submitted reports
          reportsVerified: data.successfulVerifications || data.reportsVerified || 0,
          badgesCount: data.badges?.length || 0,
          createdAt: data.createdAt
        }
      })

      // Sort according to XP rules:
      // 1. Total XP (Highest)
      // 2. Successful Verifications
      // 3. Approved Reports
      // 4. Earliest Account Creation (Tie-breaker)
      sortedUsers.sort((a, b) => {
        if (b.xp !== a.xp) return b.xp - a.xp
        if (b.reportsVerified !== a.reportsVerified) return b.reportsVerified - a.reportsVerified
        if (b.reportsSubmitted !== a.reportsSubmitted) return b.reportsSubmitted - a.reportsSubmitted
        
        const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt ? new Date(a.createdAt as any).getTime() : 0)
        const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt ? new Date(b.createdAt as any).getTime() : 0)
        return timeA - timeB
      })

      return sortedUsers.slice(0, maxLimit).map((entry, index) => ({
        rank: index + 1,
        uid: entry.uid,
        name: entry.name,
        avatar: entry.avatar,
        xp: entry.xp,
        reportsSubmitted: entry.reportsSubmitted,
        reportsVerified: entry.reportsVerified,
        badgesCount: entry.badgesCount
      }))
    } else {
      // Weekly or Monthly
      const now = new Date()
      const cutoffDate = new Date()
      if (timeframe === 'weekly') {
        cutoffDate.setDate(now.getDate() - 7)
      } else {
        cutoffDate.setDate(now.getDate() - 30)
      }

      for (const userDoc of allUsersSnap.docs) {
        const data = userDoc.data() as UserProfile
        const historyRef = collection(db, "users", userDoc.id, "xpHistory")
        const historySnap = await getDocs(historyRef)
        
        let periodXp = 0
        let periodVerifications = 0
        let periodApprovedReports = 0

        historySnap.forEach(docSnap => {
          const entry = docSnap.data()
          const createdAt = entry.createdAt?.toDate ? entry.createdAt.toDate() : new Date(entry.createdAt)
          if (createdAt >= cutoffDate) {
            periodXp += entry.xp || 0
            if (entry.type === "VERIFICATION_COMPLETED") {
              periodVerifications++
            } else if (entry.type === "REPORT_APPROVED") {
              periodApprovedReports++
            }
          }
        })

        if (periodXp > 0) {
          entries.push({
            rank: 0,
            uid: data.uid,
            name: data.name || "Anonymous Hero",
            avatar: data.avatar,
            xp: periodXp,
            reportsSubmitted: periodApprovedReports,
            reportsVerified: periodVerifications,
            badgesCount: data.badges?.length || 0
          })
        }
      }

      // Sort weekly/monthly entries
      entries.sort((a, b) => {
        if (b.xp !== a.xp) return b.xp - a.xp
        if (b.reportsVerified !== a.reportsVerified) return b.reportsVerified - a.reportsVerified
        return b.reportsSubmitted - a.reportsSubmitted
      })

      const finalEntries = entries.slice(0, maxLimit).map((entry, index) => ({
        ...entry,
        rank: index + 1
      }))

      return finalEntries
    }
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return []
  }
}

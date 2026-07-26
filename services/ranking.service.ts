"use server"

import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs, getCountFromServer, orderBy } from "firebase/firestore"

export interface RankingStats {
  weeklyXp: number;
  monthlyXp: number;
  currentRank: number;
}

export async function getUserRankingStats(userId: string, currentXp: number): Promise<RankingStats> {
  let weeklyXp = 0;
  let monthlyXp = 0;
  let currentRank = 1;

  try {
    // Calculate Rank
    // How many users have strictly more XP than current user?
    const usersRef = collection(db, "users");
    const higherXpQuery = query(usersRef, where("xp", ">", currentXp));
    const higherXpSnap = await getCountFromServer(higherXpQuery);
    currentRank = higherXpSnap.data().count + 1; // +1 because if 0 people have more XP, you are rank 1

    // Calculate Weekly & Monthly XP from the centralized XP ledger
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const { getXPInDateRange } = await import("@/services/xp.service");
    weeklyXp = await getXPInDateRange(userId, sevenDaysAgo);
    monthlyXp = await getXPInDateRange(userId, thirtyDaysAgo);

  } catch (error) {
    console.error("Error fetching ranking stats:", error);
  }

  return {
    weeklyXp,
    monthlyXp,
    currentRank
  };
}

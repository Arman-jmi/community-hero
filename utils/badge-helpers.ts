import { EvaluatedBadge } from "@/services/award.service";
import { BadgeCategory } from "@/config/badge-definitions";
import { Timestamp } from "firebase/firestore";

/**
 * Format a Firestore Timestamp or raw date into a readable string.
 */
export function formatBadgeDate(earnedAt: Timestamp | null | unknown): string {
  if (!earnedAt) return "Recently";
  try {
    const date =
      typeof (earnedAt as any).toDate === "function"
        ? (earnedAt as any).toDate()
        : (earnedAt as any).seconds
        ? new Date((earnedAt as any).seconds * 1000)
        : new Date(earnedAt as any);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Recently";
  }
}

/**
 * Return badges filtered by category.
 */
export function getBadgesByCategory(
  badges: EvaluatedBadge[],
  category: BadgeCategory
): EvaluatedBadge[] {
  return badges.filter((b) => b.category === category);
}

/**
 * Return locked badges that have some progress, sorted by completion % descending.
 * These are the "closest to unlocking" — shown in the In Progress section.
 */
export function getInProgressBadges(badges: EvaluatedBadge[]): EvaluatedBadge[] {
  return badges
    .filter((b) => !b.isUnlocked && b.progress > 0)
    .sort((a, b) => {
      const pctA = a.progress / a.target;
      const pctB = b.progress / b.target;
      return pctB - pctA;
    });
}

/**
 * Compute overall badge completion percentage.
 */
export function computeCompletionPct(badges: EvaluatedBadge[]): number {
  if (badges.length === 0) return 0;
  const unlocked = badges.filter((b) => b.isUnlocked).length;
  return Math.round((unlocked / badges.length) * 100);
}

/**
 * Group badges by category, returning a map of category → badges[].
 */
export function groupBadgesByCategory(
  badges: EvaluatedBadge[]
): Map<BadgeCategory, EvaluatedBadge[]> {
  const map = new Map<BadgeCategory, EvaluatedBadge[]>();
  for (const badge of badges) {
    const existing = map.get(badge.category) ?? [];
    existing.push(badge);
    map.set(badge.category, existing);
  }
  return map;
}

/**
 * Compute a user's current active streak from the last known active date.
 * Returns 0 if the user has not been active in the last 48 hours
 * (gives a buffer for timezone differences).
 */
export function computeDaysSince(createdAt: unknown): number {
  if (!createdAt) return 0;
  try {
    const date =
      typeof (createdAt as any).toDate === "function"
        ? (createdAt as any).toDate()
        : (createdAt as any).seconds
        ? new Date((createdAt as any).seconds * 1000)
        : new Date(createdAt as any);
    const diffMs = Date.now() - date.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

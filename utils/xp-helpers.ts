// XP Level Thresholds and Progress Utilities

export const LEVEL_THRESHOLDS = [0, 0, 100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000];

/**
 * Calculate a user's level from their total XP
 */
export function calculateLevel(totalXP: number): number {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 1; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) {
      level = i;
      break;
    }
  }
  return level;
}

/**
 * Get detailed level progress information
 */
export function getLevelProgress(totalXP: number): {
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progressXP: number;
  percentage: number;
  xpToNextLevel: number;
} {
  const level = calculateLevel(totalXP);
  const currentLevelXP = LEVEL_THRESHOLDS[level] ?? 0;
  const nextLevelXP = LEVEL_THRESHOLDS[level + 1] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

  // If at max level
  if (level >= LEVEL_THRESHOLDS.length - 1) {
    return {
      level,
      currentLevelXP,
      nextLevelXP: currentLevelXP,
      progressXP: 0,
      percentage: 100,
      xpToNextLevel: 0,
    };
  }

  const progressXP = totalXP - currentLevelXP;
  const totalRequired = nextLevelXP - currentLevelXP;
  const percentage = totalRequired > 0 ? Math.min(100, Math.round((progressXP / totalRequired) * 100)) : 100;
  const xpToNextLevel = nextLevelXP - totalXP;

  return { level, currentLevelXP, nextLevelXP, progressXP, percentage, xpToNextLevel };
}

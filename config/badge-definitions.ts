import { UserProfile } from "@/types/user";

// ─── Badge Categories ─────────────────────────────────────────────────────────

export type BadgeCategory =
  | "reporting"
  | "verification"
  | "xp"
  | "level"
  | "streak"
  | "impact"
  | "problemgo"
  | "milestone"
  | "rare";

export const BADGE_CATEGORY_META: Record<
  BadgeCategory,
  { label: string; icon: string; color: string; bgColor: string; borderColor: string }
> = {
  reporting:    { label: "Reporting",       icon: "📝", color: "text-blue-700",   bgColor: "bg-blue-50",   borderColor: "border-blue-200" },
  verification: { label: "Verification",    icon: "✅", color: "text-emerald-700", bgColor: "bg-emerald-50", borderColor: "border-emerald-200" },
  xp:           { label: "XP Milestones",   icon: "⭐", color: "text-yellow-700", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" },
  level:        { label: "Level Badges",    icon: "🏅", color: "text-purple-700", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
  streak:       { label: "Streaks",         icon: "🔥", color: "text-orange-700", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
  impact:       { label: "Community Impact",icon: "🌍", color: "text-teal-700",   bgColor: "bg-teal-50",   borderColor: "border-teal-200" },
  problemgo:    { label: "Problem GO",      icon: "📍", color: "text-rose-700",   bgColor: "bg-rose-50",   borderColor: "border-rose-200" },
  milestone:    { label: "Milestones",      icon: "🎉", color: "text-indigo-700", bgColor: "bg-indigo-50", borderColor: "border-indigo-200" },
  rare:         { label: "Rare & Special",  icon: "🌟", color: "text-amber-700",  bgColor: "bg-amber-50",  borderColor: "border-amber-200" },
};

// ─── Badge Extras (computed externally, passed in) ───────────────────────────

export interface BadgeExtras {
  streak: number;           // max consecutive active days
  leaderboardRank: number;  // global rank (0 = not ranked)
  memberDays: number;       // days since account creation
}

// ─── Badge Definition Interface ──────────────────────────────────────────────

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  target: number;
  rewardXP: number;
  calculateProgress: (user: UserProfile, extras: BadgeExtras) => number;
}

// ─── All Badge Definitions ────────────────────────────────────────────────────

export const BADGE_DEFINITIONS: BadgeDefinition[] = [

  // ── 📝 Reporting ──────────────────────────────────────────────────────────
  {
    id: "first_report",
    name: "First Report",
    description: "Report your first civic issue.",
    icon: "🥉",
    category: "reporting",
    target: 1,
    rewardXP: 20,
    calculateProgress: (u) => u.reportsSubmitted || 0,
  },
  {
    id: "community_reporter",
    name: "Community Reporter",
    description: "Report 5 issues in your community.",
    icon: "🥈",
    category: "reporting",
    target: 5,
    rewardXP: 50,
    calculateProgress: (u) => u.reportsSubmitted || 0,
  },
  {
    id: "active_reporter",
    name: "Active Reporter",
    description: "Report 10 issues.",
    icon: "🥇",
    category: "reporting",
    target: 10,
    rewardXP: 100,
    calculateProgress: (u) => u.reportsSubmitted || 0,
  },
  {
    id: "hero_reporter",
    name: "Hero Reporter",
    description: "Report 25 issues — a true civic hero.",
    icon: "🏆",
    category: "reporting",
    target: 25,
    rewardXP: 250,
    calculateProgress: (u) => u.reportsSubmitted || 0,
  },
  {
    id: "city_guardian_reporter",
    name: "City Guardian",
    description: "Report 50 issues and protect your city.",
    icon: "🌍",
    category: "reporting",
    target: 50,
    rewardXP: 500,
    calculateProgress: (u) => u.reportsSubmitted || 0,
  },
  {
    id: "civic_champion",
    name: "Civic Champion",
    description: "Report 100 issues — you are legendary.",
    icon: "👑",
    category: "reporting",
    target: 100,
    rewardXP: 1000,
    calculateProgress: (u) => u.reportsSubmitted || 0,
  },

  // ── ✅ Verification ────────────────────────────────────────────────────────
  {
    id: "first_verification",
    name: "First Verification",
    description: "Complete your first Problem GO verification.",
    icon: "🔍",
    category: "verification",
    target: 1,
    rewardXP: 20,
    calculateProgress: (u) => u.reportsVerified || 0,
  },
  {
    id: "trusted_verifier",
    name: "Trusted Verifier",
    description: "Complete 5 verifications.",
    icon: "✔️",
    category: "verification",
    target: 5,
    rewardXP: 50,
    calculateProgress: (u) => u.reportsVerified || 0,
  },
  {
    id: "expert_verifier",
    name: "Expert Verifier",
    description: "Complete 10 verifications with accuracy.",
    icon: "⭐",
    category: "verification",
    target: 10,
    rewardXP: 100,
    calculateProgress: (u) => u.reportsVerified || 0,
  },
  {
    id: "community_inspector",
    name: "Community Inspector",
    description: "Complete 25 verifications in your area.",
    icon: "🛡️",
    category: "verification",
    target: 25,
    rewardXP: 250,
    calculateProgress: (u) => u.reportsVerified || 0,
  },
  {
    id: "verification_master",
    name: "Verification Master",
    description: "Complete 50 verifications — you are a pillar of truth.",
    icon: "👮",
    category: "verification",
    target: 50,
    rewardXP: 500,
    calculateProgress: (u) => u.reportsVerified || 0,
  },
  {
    id: "truth_guardian",
    name: "Truth Guardian",
    description: "Complete 100 verifications. Unmatched dedication.",
    icon: "🧠",
    category: "verification",
    target: 100,
    rewardXP: 1000,
    calculateProgress: (u) => u.reportsVerified || 0,
  },

  // ── ⭐ XP Milestones ───────────────────────────────────────────────────────
  {
    id: "xp_100",
    name: "Bronze Hero",
    description: "Earn your first 100 XP.",
    icon: "⭐",
    category: "xp",
    target: 100,
    rewardXP: 0,
    calculateProgress: (u) => u.xp || u.totalXP || 0,
  },
  {
    id: "xp_500",
    name: "Silver Hero",
    description: "Reach 500 XP — you're making a difference.",
    icon: "⭐⭐",
    category: "xp",
    target: 500,
    rewardXP: 0,
    calculateProgress: (u) => u.xp || u.totalXP || 0,
  },
  {
    id: "xp_1000",
    name: "Gold Hero",
    description: "Reach 1000 XP. You are unstoppable!",
    icon: "⭐⭐⭐",
    category: "xp",
    target: 1000,
    rewardXP: 0,
    calculateProgress: (u) => u.xp || u.totalXP || 0,
  },
  {
    id: "xp_2500",
    name: "Platinum Hero",
    description: "Reach 2500 XP. Elite level dedication.",
    icon: "💎",
    category: "xp",
    target: 2500,
    rewardXP: 0,
    calculateProgress: (u) => u.xp || u.totalXP || 0,
  },
  {
    id: "xp_5000",
    name: "Diamond Hero",
    description: "Reach 5000 XP — a true community legend.",
    icon: "👑",
    category: "xp",
    target: 5000,
    rewardXP: 0,
    calculateProgress: (u) => u.xp || u.totalXP || 0,
  },
  {
    id: "xp_10000",
    name: "Ultimate Hero",
    description: "Reach 10,000 XP. You are the Ultimate Hero.",
    icon: "🚀",
    category: "xp",
    target: 10000,
    rewardXP: 0,
    calculateProgress: (u) => u.xp || u.totalXP || 0,
  },

  // ── 🏅 Level Badges ───────────────────────────────────────────────────────
  {
    id: "level_2",
    name: "Rising Hero",
    description: "Reach Level 2.",
    icon: "🌱",
    category: "level",
    target: 2,
    rewardXP: 0,
    calculateProgress: (u) => u.level || 1,
  },
  {
    id: "level_5",
    name: "Seasoned Hero",
    description: "Reach Level 5.",
    icon: "🌿",
    category: "level",
    target: 5,
    rewardXP: 0,
    calculateProgress: (u) => u.level || 1,
  },
  {
    id: "level_10",
    name: "Veteran Hero",
    description: "Reach Level 10 — a seasoned civic guardian.",
    icon: "🌳",
    category: "level",
    target: 10,
    rewardXP: 0,
    calculateProgress: (u) => u.level || 1,
  },
  {
    id: "level_20",
    name: "Elite Guardian",
    description: "Reach Level 20 — exceptional commitment.",
    icon: "🦅",
    category: "level",
    target: 20,
    rewardXP: 0,
    calculateProgress: (u) => u.level || 1,
  },
  {
    id: "level_30",
    name: "Legendary Guardian",
    description: "Reach Level 30 — you are a legend.",
    icon: "🔱",
    category: "level",
    target: 30,
    rewardXP: 0,
    calculateProgress: (u) => u.level || 1,
  },

  // ── 🔥 Streak Badges ──────────────────────────────────────────────────────
  {
    id: "streak_3",
    name: "3 Day Streak",
    description: "Stay active for 3 consecutive days.",
    icon: "🔥",
    category: "streak",
    target: 3,
    rewardXP: 30,
    calculateProgress: (_u, extras) => extras.streak,
  },
  {
    id: "streak_7",
    name: "7 Day Streak",
    description: "Stay active for a full week.",
    icon: "🔥🔥",
    category: "streak",
    target: 7,
    rewardXP: 70,
    calculateProgress: (_u, extras) => extras.streak,
  },
  {
    id: "streak_15",
    name: "15 Day Streak",
    description: "15 consecutive active days — outstanding!",
    icon: "🔥🔥🔥",
    category: "streak",
    target: 15,
    rewardXP: 150,
    calculateProgress: (_u, extras) => extras.streak,
  },
  {
    id: "streak_30",
    name: "30 Day Streak",
    description: "A full month of civic dedication.",
    icon: "🗓️",
    category: "streak",
    target: 30,
    rewardXP: 300,
    calculateProgress: (_u, extras) => extras.streak,
  },
  {
    id: "streak_100",
    name: "100 Day Legend",
    description: "100 consecutive active days. You are unstoppable.",
    icon: "🏆",
    category: "streak",
    target: 100,
    rewardXP: 1000,
    calculateProgress: (_u, extras) => extras.streak,
  },

  // ── 🌍 Community Impact ───────────────────────────────────────────────────
  {
    id: "first_resolved",
    name: "First Resolution",
    description: "One of your reports was officially resolved.",
    icon: "🌱",
    category: "impact",
    target: 1,
    rewardXP: 50,
    calculateProgress: (u) => u.reportsApproved || 0,
  },
  {
    id: "neighborhood_hero",
    name: "Neighborhood Hero",
    description: "Have 5 of your reports resolved.",
    icon: "🏡",
    category: "impact",
    target: 5,
    rewardXP: 100,
    calculateProgress: (u) => u.reportsApproved || 0,
  },
  {
    id: "community_builder",
    name: "Community Builder",
    description: "Have 10 of your reports resolved.",
    icon: "🏘️",
    category: "impact",
    target: 10,
    rewardXP: 200,
    calculateProgress: (u) => u.reportsApproved || 0,
  },
  {
    id: "city_hero",
    name: "City Hero",
    description: "Have 25 reports resolved — you are changing your city.",
    icon: "🏙️",
    category: "impact",
    target: 25,
    rewardXP: 500,
    calculateProgress: (u) => u.reportsApproved || 0,
  },
  {
    id: "community_legend",
    name: "Community Legend",
    description: "Have 50 reports resolved. Your impact is undeniable.",
    icon: "🌎",
    category: "impact",
    target: 50,
    rewardXP: 1000,
    calculateProgress: (u) => u.reportsApproved || 0,
  },

  // ── 📍 Problem GO ──────────────────────────────────────────────────────────
  {
    id: "first_mission",
    name: "First Mission",
    description: "Complete your first Problem GO mission.",
    icon: "📍",
    category: "problemgo",
    target: 1,
    rewardXP: 25,
    calculateProgress: (u) => u.successfulVerifications || u.reportsVerified || 0,
  },
  {
    id: "explorer",
    name: "Explorer",
    description: "Complete 10 Problem GO missions.",
    icon: "🧭",
    category: "problemgo",
    target: 10,
    rewardXP: 100,
    calculateProgress: (u) => u.successfulVerifications || u.reportsVerified || 0,
  },
  {
    id: "field_volunteer",
    name: "Field Volunteer",
    description: "Complete 25 Problem GO missions in the field.",
    icon: "🚶",
    category: "problemgo",
    target: 25,
    rewardXP: 250,
    calculateProgress: (u) => u.successfulVerifications || u.reportsVerified || 0,
  },
  {
    id: "local_guardian",
    name: "Local Guardian",
    description: "Complete 50 Problem GO missions.",
    icon: "🛰️",
    category: "problemgo",
    target: 50,
    rewardXP: 500,
    calculateProgress: (u) => u.successfulVerifications || u.reportsVerified || 0,
  },
  {
    id: "problemgo_master",
    name: "Problem GO Master",
    description: "Complete 100 Problem GO missions. True field hero.",
    icon: "🏅",
    category: "problemgo",
    target: 100,
    rewardXP: 1000,
    calculateProgress: (u) => u.successfulVerifications || u.reportsVerified || 0,
  },

  // ── 🎉 Milestones ─────────────────────────────────────────────────────────
  {
    id: "welcome_hero",
    name: "Welcome Hero",
    description: "Create your Civic Hero account.",
    icon: "🎉",
    category: "milestone",
    target: 1,
    rewardXP: 10,
    calculateProgress: () => 1, // Always met on account creation
  },
  {
    id: "one_month_member",
    name: "One Month Member",
    description: "30 days as a Civic Hero member.",
    icon: "📅",
    category: "milestone",
    target: 30,
    rewardXP: 50,
    calculateProgress: (_u, extras) => extras.memberDays,
  },
  {
    id: "one_year_member",
    name: "One Year Member",
    description: "365 days as a Civic Hero. Legendary loyalty.",
    icon: "🎂",
    category: "milestone",
    target: 365,
    rewardXP: 500,
    calculateProgress: (_u, extras) => extras.memberDays,
  },
  {
    id: "actions_100",
    name: "100 Actions",
    description: "Complete 100 total actions (reports + verifications).",
    icon: "💯",
    category: "milestone",
    target: 100,
    rewardXP: 100,
    calculateProgress: (u) => (u.reportsSubmitted || 0) + (u.reportsVerified || 0),
  },
  {
    id: "actions_500",
    name: "500 Actions",
    description: "Complete 500 total actions. You are a pillar of Civic Hero.",
    icon: "🚀",
    category: "milestone",
    target: 500,
    rewardXP: 500,
    calculateProgress: (u) => (u.reportsSubmitted || 0) + (u.reportsVerified || 0),
  },

  // ── 🌟 Rare & Special ────────────────────────────────────────────────────
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Submit a report after midnight. Who watches when others sleep?",
    icon: "🦉",
    category: "rare",
    target: 1,
    rewardXP: 50,
    calculateProgress: () => 0, // Awarded by backend event trigger — shown as 0/1 if not held
  },
  {
    id: "early_bird",
    name: "Early Bird",
    description: "Submit a report before 6 AM. Rise and make a difference.",
    icon: "🌅",
    category: "rare",
    target: 1,
    rewardXP: 50,
    calculateProgress: () => 0,
  },
  {
    id: "lightning_hero",
    name: "Lightning Hero",
    description: "Report and verify an issue on the same day.",
    icon: "⚡",
    category: "rare",
    target: 1,
    rewardXP: 75,
    calculateProgress: () => 0,
  },
  {
    id: "early_adopter",
    name: "Early Adopter",
    description: "Among the first heroes to join Civic Hero.",
    icon: "🥚",
    category: "rare",
    target: 1,
    rewardXP: 100,
    calculateProgress: () => 0, // Manually awarded by admin
  },
  {
    id: "bug_hunter",
    name: "Bug Hunter",
    description: "Helped the team by reporting a platform bug. Thank you!",
    icon: "🐞",
    category: "rare",
    target: 1,
    rewardXP: 150,
    calculateProgress: () => 0, // Manually awarded by admin
  },
  {
    id: "completionist",
    name: "The Completionist",
    description: "Unlock every other badge available in Civic Hero.",
    icon: "👑",
    category: "rare",
    target: 48, // Total badges minus this one
    rewardXP: 2000,
    calculateProgress: (u) => (u.badges || []).length,
  },
];

"use client"

import * as React from "react"
import { EvaluatedBadge } from "@/services/award.service"
import { computeCompletionPct } from "@/utils/badge-helpers"
import { motion } from "framer-motion"

interface AwardsStatsBarProps {
  badges: EvaluatedBadge[]
  totalXP: number
  level: number
  streak: number
}

interface StatItemProps {
  icon: string
  label: string
  value: string | number
  sub?: string
  delay: number
  accent: string
}

function StatItem({ icon, label, value, sub, delay, accent }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`flex flex-col items-center justify-center gap-1 p-4 rounded-2xl border ${accent} min-w-0`}
    >
      <span className="text-2xl">{icon}</span>
      <p className="text-[22px] font-black text-gray-900 leading-none">{value}</p>
      {sub && <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">{sub}</p>}
      <p className="text-[12px] font-semibold text-gray-500 text-center">{label}</p>
    </motion.div>
  )
}

export function AwardsStatsBar({ badges, totalXP, level, streak }: AwardsStatsBarProps) {
  const earned = badges.filter((b) => b.isUnlocked).length
  const total = badges.length
  const completionPct = computeCompletionPct(badges)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-10">
      <StatItem
        icon="🏅"
        label="Badges Earned"
        value={`${earned} / ${total}`}
        delay={0}
        accent="bg-emerald-50 border-emerald-200"
      />
      <StatItem
        icon="⭐"
        label="Total XP"
        value={totalXP.toLocaleString()}
        sub="XP"
        delay={0.05}
        accent="bg-blue-50 border-blue-200"
      />
      <StatItem
        icon="🏆"
        label="Current Level"
        value={level}
        sub={`LVL`}
        delay={0.1}
        accent="bg-purple-50 border-purple-200"
      />
      <StatItem
        icon="🔥"
        label="Max Streak"
        value={streak}
        sub="Days"
        delay={0.15}
        accent="bg-orange-50 border-orange-200"
      />
      <StatItem
        icon="📈"
        label="Completion"
        value={`${completionPct}%`}
        delay={0.2}
        accent="bg-amber-50 border-amber-200"
      />
    </div>
  )
}

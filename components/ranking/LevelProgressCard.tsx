"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Trophy, Star, Zap } from "lucide-react"
import { getLevelProgress } from "@/utils/xp-helpers"

interface LevelProgressCardProps {
  level: number
  currentXp: number
  globalRank: number
  delay?: number
}

const MOTIVATIONAL = [
  "Keep helping your community — every report matters!",
  "You're making a real difference. Don't stop now!",
  "Your city is better because of you. Keep going!",
  "One more report closer to the top. You've got this!",
  "Your civic heroes celebrate your contributions!",
]

export function LevelProgressCard({ level, currentXp, globalRank, delay = 0 }: LevelProgressCardProps) {
  const { nextLevelXP, percentage, xpToNextLevel } = getLevelProgress(currentXp)
  const motto = MOTIVATIONAL[Math.abs(level + globalRank) % MOTIVATIONAL.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
      className="col-span-full"
    >
      <div className="relative overflow-hidden rounded-2xl bg-emerald-600 shadow-xl">
        {/* Decorative background trophy */}
        <div className="absolute -right-10 -top-10 opacity-[0.08] pointer-events-none">
          <Trophy className="w-72 h-72 text-white" />
        </div>

        <div className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

            {/* Left — Level badge + title */}
            <div className="flex items-center gap-5">
              <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-white/15 backdrop-blur flex flex-col items-center justify-center border border-white/20 shadow-inner">
                <Star className="w-5 h-5 text-yellow-300 fill-yellow-300 mb-0.5" />
                <span className="text-3xl font-black text-white leading-none">{level}</span>
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Level</span>
              </div>
              <div>
                <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-1">Your Progress</p>
                <h2 className="text-3xl font-black text-white leading-tight">
                  {currentXp.toLocaleString()} XP
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  <span className="text-white/80 text-sm font-medium">
                    {xpToNextLevel > 0
                      ? `${xpToNextLevel.toLocaleString()} XP to Level ${level + 1}`
                      : "Maximum Level Reached!"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right — Rank pill */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center bg-white/15 backdrop-blur rounded-2xl px-6 py-4 border border-white/20 min-w-[120px]">
              <p className="text-white/70 text-[11px] font-bold uppercase tracking-widest mb-1">Global Rank</p>
              <p className="text-4xl font-black text-white leading-none">#{globalRank}</p>
              <p className="text-white/60 text-[11px] mt-1 font-medium">Community Standing</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-[12px] font-semibold text-white/70 mb-2">
              <span>Level {level}</span>
              <span>{percentage}% complete</span>
              <span>Level {level + 1}</span>
            </div>
            <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(percentage, percentage > 0 ? 2 : 0)}%` }}
                transition={{ delay: delay + 0.4, duration: 1.2, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full shadow-[0_0_12px_rgba(253,224,71,0.5)]"
              />
            </div>
          </div>

          {/* Motivational message */}
          <p className="mt-4 text-white/60 text-[13px] font-medium italic">"{motto}"</p>
        </div>
      </div>
    </motion.div>
  )
}

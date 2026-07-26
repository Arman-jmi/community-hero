"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { EvaluatedBadge } from "@/services/award.service"
import { formatBadgeDate } from "@/utils/badge-helpers"
import { Lock } from "lucide-react"

interface BadgeCardProps {
  badge: EvaluatedBadge
  delay?: number
}

export function BadgeCard({ badge, delay = 0 }: BadgeCardProps) {
  const { isUnlocked, progress, target, rewardXP } = badge
  const progressPercent = Math.min((progress / target) * 100, 100)
  const isInProgress = !isUnlocked && progress > 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.45, type: "spring", stiffness: 120 }}
      className="h-full"
    >
      <div
        className={`
          relative h-full flex flex-col items-center text-center p-5 rounded-2xl border transition-all duration-300
          ${isUnlocked
            ? "bg-gradient-to-b from-emerald-50 to-white border-emerald-200 shadow-[0_4px_24px_rgba(16,185,129,0.15)] hover:shadow-[0_8px_32px_rgba(16,185,129,0.25)] hover:-translate-y-0.5"
            : "bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"
          }
        `}
      >
        {/* Status pill — top right */}
        <div className="absolute top-3 right-3">
          {isUnlocked ? (
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-widest">
              ✓ Unlocked
            </span>
          ) : isInProgress ? (
            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-widest">
              In Progress
            </span>
          ) : (
            <span className="text-[10px] font-bold bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <Lock className="w-2.5 h-2.5" /> Locked
            </span>
          )}
        </div>

        {/* Icon circle */}
        <div className="relative mt-3 mb-3">
          <div
            className={`
              w-20 h-20 rounded-full flex items-center justify-center text-4xl
              ${isUnlocked
                ? "bg-gradient-to-tr from-emerald-100 to-emerald-50 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                : "bg-gray-50 grayscale opacity-50"
              }
            `}
          >
            {badge.icon}
          </div>

          {/* Spinning ring for unlocked */}
          {isUnlocked && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-300/60"
            />
          )}
        </div>

        {/* Name & description */}
        <h3
          className={`text-[15px] font-bold mb-1 leading-tight ${
            isUnlocked ? "text-emerald-900" : "text-gray-600"
          }`}
        >
          {badge.name}
        </h3>
        <p className="text-[12px] text-gray-400 mb-4 leading-relaxed flex-grow px-1">
          {badge.description}
        </p>

        {/* Bottom section */}
        <div className="w-full mt-auto space-y-2">
          {isUnlocked ? (
            <div className="text-center">
              <p className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 py-1.5 rounded-lg">
                🗓 Earned {formatBadgeDate(badge.earnedAt)}
              </p>
              {rewardXP > 0 && (
                <p className="text-[11px] font-bold text-emerald-700 mt-1.5">
                  +{rewardXP} XP Rewarded
                </p>
              )}
            </div>
          ) : (
            <>
              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-gray-400">
                  <span>Progress</span>
                  <span>{Math.floor(progress)} / {target}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(progressPercent, progressPercent > 0 ? 4 : 0)}%` }}
                    transition={{ delay: delay + 0.3, duration: 0.9, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      isInProgress ? "bg-emerald-400" : "bg-gray-200"
                    }`}
                  />
                </div>
              </div>
              {rewardXP > 0 && (
                <p className="text-[11px] font-semibold text-gray-400">
                  Reward: <span className="text-emerald-600 font-bold">+{rewardXP} XP</span>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

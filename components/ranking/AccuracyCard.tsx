"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Target, CheckCircle, XCircle } from "lucide-react"

interface AccuracyCardProps {
  reportsVerified: number
  fakeReports: number
  delay?: number
}

export function AccuracyCard({ reportsVerified, fakeReports, delay = 0 }: AccuracyCardProps) {
  const total = reportsVerified + fakeReports
  const accuracy = total > 0 ? Math.round((reportsVerified / total) * 100) : 100

  const r = 40
  const circumference = 2 * Math.PI * r
  const strokeDashoffset = circumference - (accuracy / 100) * circumference

  const accuracyColor =
    accuracy >= 90 ? "text-emerald-600" :
    accuracy >= 70 ? "text-amber-600" :
    "text-red-500"

  const ringColor =
    accuracy >= 90 ? "text-emerald-500" :
    accuracy >= 70 ? "text-amber-500" :
    "text-red-500"

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, type: "spring", stiffness: 110 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <div className="h-full flex flex-col p-5 rounded-2xl border bg-teal-50 border-teal-100 shadow-sm hover:shadow-md transition-shadow">

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2.5 rounded-xl text-teal-600 bg-teal-100">
            <Target className="w-5 h-5" />
          </div>
          <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest">Verification Accuracy</p>
        </div>

        {/* Ring + percentage */}
        <div className="flex items-center gap-5 flex-1">
          <div className="relative flex-shrink-0">
            <svg width="100" height="100" className="-rotate-90">
              {/* Track */}
              <circle
                cx="50" cy="50" r={r}
                stroke="currentColor"
                strokeWidth="9"
                fill="transparent"
                className="text-gray-100"
              />
              {/* Progress */}
              <motion.circle
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ delay: delay + 0.5, duration: 1.4, ease: "easeOut" }}
                cx="50" cy="50" r={r}
                stroke="currentColor"
                strokeWidth="9"
                fill="transparent"
                strokeDasharray={circumference}
                className={`${ringColor} drop-shadow-sm`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-[22px] font-black leading-none ${accuracyColor}`}>
                {accuracy}%
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Valid</p>
                <p className="text-[20px] font-black text-emerald-700 leading-none">{reportsVerified}</p>
              </div>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Fake</p>
                <p className="text-[20px] font-black text-red-600 leading-none">{fakeReports}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom quality badge */}
        <div className="mt-4 pt-3 border-t border-teal-100">
          <p className={`text-[12px] font-bold text-center ${accuracyColor}`}>
            {accuracy >= 90 ? "🏆 Excellent accuracy" :
             accuracy >= 70 ? "⚡ Good accuracy" :
             "⚠️ Needs improvement"}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: string
  trendUp?: boolean
  accentColor?: string   // e.g. "emerald" | "blue" | "amber" | "rose" | "purple"
  delay?: number
}

const COLOR_MAP: Record<string, { bg: string; icon: string; border: string; trend: string }> = {
  emerald: { bg: "bg-emerald-50",  icon: "text-emerald-600 bg-emerald-100", border: "border-emerald-100", trend: "bg-emerald-100 text-emerald-700" },
  blue:    { bg: "bg-blue-50",     icon: "text-blue-600 bg-blue-100",       border: "border-blue-100",    trend: "bg-blue-100 text-blue-700" },
  amber:   { bg: "bg-amber-50",    icon: "text-amber-600 bg-amber-100",     border: "border-amber-100",   trend: "bg-amber-100 text-amber-700" },
  rose:    { bg: "bg-rose-50",     icon: "text-rose-600 bg-rose-100",       border: "border-rose-100",    trend: "bg-rose-100 text-rose-700" },
  purple:  { bg: "bg-purple-50",   icon: "text-purple-600 bg-purple-100",   border: "border-purple-100",  trend: "bg-purple-100 text-purple-700" },
  teal:    { bg: "bg-teal-50",     icon: "text-teal-600 bg-teal-100",       border: "border-teal-100",    trend: "bg-teal-100 text-teal-700" },
  orange:  { bg: "bg-orange-50",   icon: "text-orange-600 bg-orange-100",   border: "border-orange-100",  trend: "bg-orange-100 text-orange-700" },
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendUp,
  accentColor = "emerald",
  delay = 0,
}: StatCardProps) {
  const colors = COLOR_MAP[accentColor] ?? COLOR_MAP.emerald

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, type: "spring", stiffness: 110 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <div className={`h-full flex flex-col p-5 rounded-2xl border ${colors.bg} ${colors.border} shadow-sm hover:shadow-md transition-shadow`}>
        {/* Icon + trend row */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2.5 rounded-xl ${colors.icon}`}>
            <Icon className="w-5 h-5" />
          </div>
          {trend && (
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
              trendUp ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
            }`}>
              {trendUp ? "↑" : "↓"} {trend}
            </span>
          )}
        </div>

        {/* Label */}
        <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest mb-1">{title}</p>

        {/* Value */}
        <p className="text-[32px] font-black text-gray-900 leading-none">{value}</p>

        {/* Description */}
        {description && (
          <p className="text-[12px] text-gray-400 mt-2 font-medium leading-tight">{description}</p>
        )}
      </div>
    </motion.div>
  )
}

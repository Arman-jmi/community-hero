"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { EvaluatedBadge } from "@/services/award.service"
import { BadgeCategory, BADGE_CATEGORY_META } from "@/config/badge-definitions"
import { BadgeCard } from "./BadgeCard"

interface BadgeCategorySectionProps {
  category: BadgeCategory
  badges: EvaluatedBadge[]
  defaultOpen?: boolean
}

export function BadgeCategorySection({
  category,
  badges,
  defaultOpen = false,
}: BadgeCategorySectionProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  const meta = BADGE_CATEGORY_META[category]
  const unlockedCount = badges.filter((b) => b.isUnlocked).length

  if (badges.length === 0) return null

  return (
    <div className={`rounded-2xl border ${meta.borderColor} ${meta.bgColor} overflow-hidden`}>
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{meta.icon}</span>
          <div>
            <p className={`font-bold text-[15px] ${meta.color}`}>{meta.label}</p>
            <p className="text-[12px] text-gray-400 font-medium">
              {unlockedCount} / {badges.length} unlocked
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              unlockedCount === badges.length
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {unlockedCount === badges.length ? "✓ Complete" : `${badges.length - unlockedCount} left`}
          </span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className={`w-4 h-4 ${meta.color}`} />
          </motion.div>
        </div>
      </button>

      {/* Badge grid — collapsible */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 pt-0">
              {badges.map((badge, idx) => (
                <BadgeCard key={badge.id} badge={badge} delay={idx * 0.05} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

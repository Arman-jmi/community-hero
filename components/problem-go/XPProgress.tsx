"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { getLevelProgress } from "@/utils/xp-helpers"

interface XPProgressProps {
 currentXP: number
 level: number
}

export function XPProgress({ currentXP, level }: XPProgressProps) {
 const { level: calculatedLevel, progressXP, percentage, xpToNextLevel } = getLevelProgress(currentXP)
 const totalRequired = progressXP + xpToNextLevel

 return (
 <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-md">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-3">
 <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
 <Star className="h-6 w-6 text-primary" />
 </div>
 <div>
 <h3 className="font-bold text-gray-900 text-lg">Level {calculatedLevel}</h3>
 <p className="text-gray-600 text-sm">Civic Hero</p>
 </div>
 </div>
 <div className="text-right">
 <span className="font-black text-xl text-gray-900">{currentXP}</span>
 <span className="text-gray-600 text-sm ml-1">XP</span>
 </div>
 </div>
 
 <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden relative">
 <motion.div 
 className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-primary to-emerald-400"
 initial={{ width: 0 }}
 animate={{ width: `${percentage}%` }}
 transition={{ duration: 1.5, ease: "easeOut" }}
 />
 </div>
 
 <div className="mt-2 text-right text-xs font-semibold text-gray-600">
 {xpToNextLevel > 0 ? `${xpToNextLevel} XP to Level ${calculatedLevel + 1}` : "Max level achieved!"}
 </div>
 </div>
 )
}

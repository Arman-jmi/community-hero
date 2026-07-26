"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { MetricCard } from "@/components/charts/metric-card"
import { CheckCircle, Leaf, Droplets } from "lucide-react"

export function ImpactPreviewSection() {
 return (
 <section id="impact" className="py-24 sm:py-32 relative bg-black/40">
 <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
 <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
 <motion.div 
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 className="max-w-2xl"
 >
 <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
 Measurable Impact
 </h2>
 <p className="text-lg text-muted-foreground">
 Every report matters. Watch as your community transforms and the overall Community Health Score increases in real-time.
 </p>
 </motion.div>
 
 <motion.div 
 initial={{ opacity: 0, scale: 0.9 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 className="glass-dark p-6 rounded-3xl border-white/20 text-center shadow-[0_0_50px_rgba(79,70,229,0.2)]"
 >
 <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">City Health Score</div>
 <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
 92<span className="text-3xl">/100</span>
 </div>
 </motion.div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
 <MetricCard 
 title="Resolution Rate" 
 value="87%" 
 icon={<CheckCircle />} 
 trend={{ value: 12, isPositive: true }} 
 />
 </motion.div>
 <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
 <MetricCard 
 title="Garbage Removed" 
 value="4,200 kg" 
 icon={<Leaf />} 
 trend={{ value: 8, isPositive: true }} 
 />
 </motion.div>
 <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
 <MetricCard 
 title="Water Saved" 
 value="15k Liters" 
 icon={<Droplets />} 
 trend={{ value: 5, isPositive: true }} 
 />
 </motion.div>
 </div>
 </div>
 </section>
 )
}

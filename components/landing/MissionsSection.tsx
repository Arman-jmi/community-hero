"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { ShieldCheck, Map, Trophy, Star } from "lucide-react"

export function MissionsSection() {
 return (
 <section id="missions" className="py-24 sm:py-32 relative overflow-hidden">
 <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
 <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
 
 <div className="w-full lg:w-1/2 order-2 lg:order-1 relative flex justify-center">
 {/* Background glow for phone */}
 <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
 
 {/* Phone Mockup */}
 <motion.div 
 initial={{ opacity: 0, y: 50, rotate: -5 }}
 whileInView={{ opacity: 1, y: 0, rotate: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 1, type: "spring", bounce: 0.4 }}
 className="relative w-[300px] h-[600px] rounded-[3rem] border-[8px] border-zinc-900 bg-black shadow-2xl overflow-hidden flex flex-col"
 >
 {/* Notch */}
 <div className="absolute top-0 inset-x-0 h-6 bg-zinc-900 rounded-b-xl w-1/2 mx-auto z-20" />
 
 {/* Map Background Mock */}
 <div className="absolute inset-0 bg-[#17263c] opacity-80" />
 <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=16&size=600x1200&maptype=roadmap&style=feature:all|element:geometry|color:0x242f3e&style=feature:water|color:0x17263c&key=YOUR_API_KEY')] bg-cover bg-center mix-blend-screen opacity-50" />
 
 <div className="relative z-10 flex flex-col h-full p-4 pt-10">
 <div className="glass rounded-xl p-3 mb-auto flex items-center justify-between">
 <span className="font-semibold text-foreground">Nearby Missions</span>
 <div className="flex items-center gap-1 text-emerald-400 font-bold">
 <Star className="h-4 w-4 fill-emerald-400" />
 250 XP
 </div>
 </div>

 {/* Animated Markers in Phone */}
 <motion.div 
 animate={{ y: [0, -10, 0] }}
 transition={{ duration: 2, repeat: Infinity }}
 className="absolute top-1/3 left-1/4 h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center border border-accent/50 backdrop-blur-sm"
 >
 <ShieldCheck className="h-6 w-6 text-accent" />
 </motion.div>
 
 <motion.div 
 animate={{ y: [0, -10, 0] }}
 transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
 className="absolute top-1/2 right-1/4 h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/50 backdrop-blur-sm"
 >
 <ShieldCheck className="h-5 w-5 text-amber-400" />
 </motion.div>

 {/* Mission Card Popup */}
 <motion.div 
 initial={{ y: 100, opacity: 0 }}
 whileInView={{ y: 0, opacity: 1 }}
 viewport={{ once: true }}
 transition={{ delay: 0.8, duration: 0.5 }}
 >
 <Card className="glass-dark border-white/20 mb-4 shadow-2xl">
 <div className="p-4">
 <h4 className="font-semibold text-foreground mb-1">Verify Pothole</h4>
 <p className="text-xs text-muted-foreground mb-3">50m away • Reported 2h ago</p>
 <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-foreground font-medium py-2 rounded-lg text-sm transition-colors">
 Verify Issue
 </button>
 </div>
 </Card>
 </motion.div>
 
 {/* Mobile Nav Mock */}
 <div className="h-14 glass rounded-2xl flex items-center justify-around px-2 border border-white/10">
 <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center"><Map className="h-4 w-4 text-muted-foreground" /></div>
 <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg -mt-4 border-2 border-zinc-900"><Trophy className="h-5 w-5 text-foreground" /></div>
 <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center"><ShieldCheck className="h-4 w-4 text-muted-foreground" /></div>
 </div>
 </div>
 </motion.div>
 </div>

 <motion.div 
 initial={{ opacity: 0, x: 20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 className="w-full lg:w-1/2 order-1 lg:order-2"
 >
 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
 <Trophy className="h-4 w-4" /> Gamified Civic Action
 </div>
 <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
 Civic Engagement <br /> meets Problem GO
 </h2>
 <p className="text-lg text-muted-foreground mb-8 max-w-lg">
 Earn XP, level up, and build your Trust Score by exploring your neighborhood to verify reported issues. Complete nearby missions to unlock rare badges and real-world rewards.
 </p>
 
 <div className="grid grid-cols-2 gap-4">
 <div className="glass p-4 rounded-2xl border-white/10">
 <div className="text-emerald-400 font-bold text-2xl mb-1">+50 XP</div>
 <div className="text-sm text-muted-foreground">Per Verified Issue</div>
 </div>
 <div className="glass p-4 rounded-2xl border-white/10">
 <div className="text-blue-400 font-bold text-2xl mb-1">+5 Trust</div>
 <div className="text-sm text-muted-foreground">Trust Score Increase</div>
 </div>
 </div>
 </motion.div>

 </div>
 </div>
 </section>
 )
}

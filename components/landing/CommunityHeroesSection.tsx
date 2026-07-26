"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Medal, Star } from "lucide-react"

const HEROES = [
 { id: 1, name: "Alex Rivers", role: "Top Reporter", points: "15,400 XP", level: 42, icon: <Trophy className="h-6 w-6 text-amber-400" /> },
 { id: 2, name: "Sarah Chen", role: "Top Verifier", points: "12,200 XP", level: 38, icon: <Medal className="h-6 w-6 text-blue-400" /> },
 { id: 3, name: "Marcus Johnson", role: "Local Legend", points: "10,800 XP", level: 35, icon: <Star className="h-6 w-6 text-accent" /> },
]

export function CommunityHeroesSection() {
 return (
 <section id="heroes" className="py-24 sm:py-32 relative">
 <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
 <div className="text-center mb-16 max-w-2xl mx-auto">
 <motion.h2 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground"
 >
 Hall of Heroes
 </motion.h2>
 <motion.p 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.1 }}
 className="text-lg text-muted-foreground"
 >
 Real people making a real difference. Climb the leaderboard by helping your community.
 </motion.p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
 {HEROES.map((hero, idx) => (
 <motion.div
 key={hero.id}
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: idx * 0.2, duration: 0.6 }}
 >
 <Card className="glass relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
 <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
 {hero.icon}
 </div>
 <CardContent className="p-8">
 <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px] mb-6">
 <div className="w-full h-full bg-background rounded-full flex items-center justify-center font-bold text-xl">
 {hero.name.charAt(0)}
 </div>
 </div>
 <h3 className="font-bold text-xl text-foreground mb-1">{hero.name}</h3>
 <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-4">{hero.role}</p>
 
 <div className="flex items-center justify-between pt-4 border-t border-white/10">
 <span className="text-muted-foreground text-sm">Level {hero.level}</span>
 <span className="font-bold text-foreground">{hero.points}</span>
 </div>
 </CardContent>
 </Card>
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 )
}

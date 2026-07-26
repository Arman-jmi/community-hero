"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const TESTIMONIALS = [
 { id: 1, quote: "I reported a massive pothole and it was fixed in 2 days. The gamification makes helping out actually fun!", author: "Jamie T.", role: "Level 14 Citizen" },
 { id: 2, quote: "As a city planner, the AI categorization saves us hundreds of hours. We know exactly who needs to respond.", author: "Marcus R.", role: "Public Works Dept" },
 { id: 3, quote: "My friends and I compete to see who can get the most verified reports. It's like Problem GO but for civic duty.", author: "Elena V.", role: "Level 32 Hero" },
]

export function TestimonialsSection() {
 return (
 <section id="testimonials" className="py-24 sm:py-32 relative overflow-hidden bg-white/5 dark:bg-black/20">
 <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
 <motion.h2 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center text-foreground"
 >
 Community Voices
 </motion.h2>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
 {TESTIMONIALS.map((t, i) => (
 <motion.div
 key={t.id}
 initial={{ opacity: 0, scale: 0.9 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 transition={{ delay: i * 0.2 }}
 >
 <Card className="glass h-full border-white/10 hover:border-white/30 transition-colors">
 <CardContent className="p-8">
 <Quote className="h-8 w-8 text-primary mb-6 opacity-50" />
 <p className="text-lg text-muted-foreground mb-6 italic">"{t.quote}"</p>
 <div>
 <h4 className="font-bold text-foreground">{t.author}</h4>
 <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{t.role}</p>
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

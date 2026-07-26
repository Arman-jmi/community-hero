"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
 return (
 <section className="py-32 relative overflow-hidden">
 {/* Background Gradients */}
 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/20 pointer-events-none" />
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(800px,100vw)] h-[min(800px,100vw)] bg-accent/20 rounded-full blur-[150px] pointer-events-none" />

 <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 text-center">
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="max-w-3xl mx-auto glass-dark p-12 md:p-20 rounded-[3rem] border border-white/20 shadow-2xl shadow-indigo-500/20"
 >
 <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-foreground leading-tight">
 Ready to make a <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">difference?</span>
 </h2>
 <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
 Report your first issue today and join thousands of citizens transforming their neighborhoods.
 </p>
 
 <Link href="/register">
 <Button size="lg" className="rounded-full h-14 px-10 text-lg shadow-xl shadow-primary/30 hover:scale-105 transition-transform duration-300">
 Become a Hero <ArrowRight className="ml-2 h-5 w-5" />
 </Button>
 </Link>
 </motion.div>
 </div>
 </section>
 )
}

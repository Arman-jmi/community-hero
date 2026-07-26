"use client"

import * as React from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, BrainCircuit, ArrowDown, Activity, Clock, Building2 } from "lucide-react"

export function AIDemoSection() {
 const ref = React.useRef(null)
 const isInView = useInView(ref, { once: true, margin: "-100px" })

 const containerVariants = {
 hidden: { opacity: 0 },
 visible: {
 opacity: 1,
 transition: { staggerChildren: 0.8, delayChildren: 0.2 }
 }
 }

 const itemVariants: any = {
 hidden: { opacity: 0, y: 20 },
 visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
 }

 return (
 <section id="ai-demo" className="py-24 sm:py-32 relative">
 <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
 <div className="text-center mb-16 max-w-3xl mx-auto">
 <motion.h2 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"
 >
 Powered by Gemini AI
 </motion.h2>
 <motion.p 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.1 }}
 className="text-lg text-muted-foreground"
 >
 No manual forms. Just take a picture and let our advanced multimodal AI instantly categorize, assess severity, and route the issue to the correct department.
 </motion.p>
 </div>

 <motion.div 
 ref={ref}
 variants={containerVariants}
 initial="hidden"
 animate={isInView ? "visible" : "hidden"}
 className="max-w-4xl mx-auto flex flex-col items-center gap-6"
 >
 {/* Step 1: Upload */}
 <motion.div variants={itemVariants} className="w-full sm:w-2/3 md:w-1/2 relative group">
 <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
 <Card className="relative glass border-white/20 p-6 flex flex-col items-center justify-center text-center">
 <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
 <ImageIcon className="h-8 w-8 text-muted-foreground" />
 </div>
 <h3 className="font-semibold text-foreground text-lg">1. Upload Photo</h3>
 <p className="text-sm text-muted-foreground mt-2">Take a photo of the civic issue</p>
 </Card>
 </motion.div>

 <motion.div variants={itemVariants} className="text-muted-foreground">
 <ArrowDown className="h-8 w-8 animate-bounce" />
 </motion.div>

 {/* Step 2: AI Processing */}
 <motion.div variants={itemVariants} className="w-full sm:w-2/3 md:w-1/2 relative group">
 <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-40 animate-pulse" />
 <Card className="relative glass-dark border-white/20 p-6 flex flex-col items-center justify-center text-center overflow-hidden">
 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-muted-foreground to-transparent animate-[scan_2s_ease-in-out_infinite]" />
 <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-primary to-accent p-[2px] mb-4 shadow-[0_0_30px_rgba(236,72,153,0.5)]">
 <div className="h-full w-full bg-black rounded-2xl flex items-center justify-center">
 <BrainCircuit className="h-10 w-10 text-foreground" />
 </div>
 </div>
 <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent text-xl">Gemini Analyzing</h3>
 <p className="text-sm text-muted-foreground mt-2">Processing image context...</p>
 </Card>
 </motion.div>

 <motion.div variants={itemVariants} className="text-muted-foreground">
 <ArrowDown className="h-8 w-8 animate-bounce" />
 </motion.div>

 {/* Step 3: Result */}
 <motion.div variants={itemVariants} className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
 <Card className="glass border-white/10 hover:border-white/20 transition-all p-5 flex flex-col items-center text-center">
 <Activity className="h-6 w-6 text-accent mb-3" />
 <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Severity</span>
 <Badge variant="destructive" className="bg-accent hover:bg-accent">High</Badge>
 </Card>
 
 <Card className="glass border-white/10 hover:border-white/20 transition-all p-5 flex flex-col items-center text-center">
 <Building2 className="h-6 w-6 text-primary mb-3" />
 <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Department</span>
 <span className="font-semibold text-foreground">Public Works</span>
 </Card>
 
 <Card className="glass border-white/10 hover:border-white/20 transition-all p-5 flex flex-col items-center text-center">
 <Clock className="h-6 w-6 text-amber-400 mb-3" />
 <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Est. Repair</span>
 <span className="font-semibold text-foreground">48 Hours</span>
 </Card>
 </motion.div>
 
 </motion.div>
 </div>

 <style dangerouslySetInnerHTML={{__html: `
 @keyframes scan {
 0% { transform: translateY(-100%); opacity: 0; }
 50% { opacity: 1; }
 100% { transform: translateY(800%); opacity: 0; }
 }
 `}} />
 </section>
 )
}

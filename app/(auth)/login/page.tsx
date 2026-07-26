"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { User, Building2, ArrowRight, ShieldCheck, Zap, Users, MapPin, Database, Server, Activity } from "lucide-react";

export default function RoleSelectionPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 overflow-hidden flex items-center justify-center font-sans">
      {/* Background Aurora / Glassmorphism Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.01] mix-blend-overlay"></div>
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-200/50 blur-[120px] mix-blend-multiply animate-pulse duration-[8000ms]"></div>
        <div className="absolute top-[10%] right-[0%] w-[40%] h-[60%] rounded-full bg-teal-200/50 blur-[150px] mix-blend-multiply animate-pulse duration-[10000ms]"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-emerald-100/60 blur-[120px] mix-blend-multiply"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[60%] rounded-full bg-cyan-100/50 blur-[150px] mix-blend-multiply animate-pulse duration-[12000ms]"></div>
        
        {/* Soft Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]"></div>
      </div>

      {/* Radial Spotlight following mouse */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16,185,129,0.04), transparent 40%)`
        }}
      />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 h-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
        
        {/* LEFT SIDE (60%) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 w-full flex flex-col justify-center text-left mt-10 lg:mt-0"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-6 backdrop-blur-md w-fit">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">System Online</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-[72px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 mb-4 tracking-tight leading-[1.1]">
            Civic Hero
          </motion.h1>
          
          <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl text-slate-600 font-light mb-8 max-w-xl">
            AI Powered Civic Intelligence Platform
          </motion.h2>

          <motion.div variants={itemVariants} className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-10 max-w-lg font-light">
            <p className="mb-1">Report issues.</p>
            <p className="mb-1">Verify problems.</p>
            <p className="mb-1">Earn rewards.</p>
            <p className="text-emerald-600 font-medium mt-2">Build smarter cities together.</p>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative overflow-hidden group hover:border-emerald-200 hover:shadow-md transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <ShieldCheck className="w-6 h-6 text-emerald-500 mb-2 relative z-10" />
              <div className="text-2xl font-bold text-slate-900 mb-1 relative z-10">12,000+</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider relative z-10">Issues Solved</div>
            </div>
            
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative overflow-hidden group hover:border-blue-200 hover:shadow-md transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Users className="w-6 h-6 text-blue-500 mb-2 relative z-10" />
              <div className="text-2xl font-bold text-slate-900 mb-1 relative z-10">2,500+</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider relative z-10">Civic Heroes</div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative overflow-hidden group hover:border-purple-200 hover:shadow-md transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Zap className="w-6 h-6 text-purple-500 mb-2 relative z-10" />
              <div className="text-2xl font-bold text-slate-900 mb-1 relative z-10">98%</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider relative z-10">AI Accuracy</div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 items-center">
            <div className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> Powered by Gemini AI</div>
            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Google Maps</div>
            <div className="flex items-center gap-1.5"><Database className="w-4 h-4" /> Firebase</div>
            <div className="flex items-center gap-1.5"><Server className="w-4 h-4" /> Real-time Verification</div>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE (40%) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 80 }}
          className="w-full lg:w-[480px] shrink-0 perspective-1000 mb-10 lg:mb-0"
        >
          <div 
            className="w-full rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden"
            style={{ 
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,1)',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)'
            }}
          >
            {/* Inner glow */}
            <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
            
            <div className="text-center mb-10 relative z-10">
              <h3 className="text-2xl font-bold text-slate-900 tracking-wide">Choose Your Portal</h3>
              <p className="text-sm text-slate-500 mt-2">Select an identity to continue</p>
            </div>

            <div className="space-y-5 relative z-10">
              {/* Citizen Portal */}
              <Link href="/login/citizen" className="block outline-none">
                <motion.div 
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative w-full rounded-3xl p-5 border border-emerald-100 bg-white hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 overflow-hidden cursor-pointer flex items-center gap-5"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/0 via-emerald-50/80 to-emerald-50/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                  
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300 shrink-0">
                    <User className="w-7 h-7" />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">Citizen Portal</h4>
                    <p className="text-xs text-slate-500 mt-1">Report issues & earn rewards</p>
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white text-slate-400 transition-all duration-300 shrink-0">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </Link>

              {/* Authority Portal */}
              <Link href="/admin/login" className="block outline-none">
                <motion.div 
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative w-full rounded-3xl p-5 border border-blue-100 bg-white hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden cursor-pointer flex items-center gap-5"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/80 to-blue-50/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                  
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300 shrink-0">
                    <Building2 className="w-7 h-7" />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Authority Portal</h4>
                    <p className="text-xs text-slate-500 mt-1">Manage public services</p>
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white text-slate-400 transition-all duration-300 shrink-0">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 text-center relative z-10">
              <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Secure connection established
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

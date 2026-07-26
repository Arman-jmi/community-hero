"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
      {/* Subtle green radial glow — very faint, purely decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#10B981]/8 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center bg-white border border-gray-100 rounded-3xl shadow-[0_4px_40px_rgba(0,0,0,0.06)] px-8 py-16 md:px-16 md:py-20"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#10B981]/20 text-[#10B981] text-sm font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            Join the Movement
          </div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight mb-5">
            Ready to make a <br className="hidden sm:block" />
            <span className="text-[#10B981]">real difference?</span>
          </h2>

          <p className="text-lg text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
            Report your first issue today and join thousands of citizens transforming their neighborhoods with AI-powered civic action.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <button className="h-14 px-10 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-bold text-base flex items-center gap-2 transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5">
                Become a Hero
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
            <Link href="/map">
              <button className="h-14 px-8 rounded-full bg-white hover:bg-gray-50 text-gray-700 font-bold text-base flex items-center gap-2 border border-gray-200 transition-all hover:-translate-y-0.5">
                Explore the Map
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

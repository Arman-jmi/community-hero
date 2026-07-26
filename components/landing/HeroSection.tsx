"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Trophy, BarChart3, Medal, Users, MapPinned, FileText, CheckCircle2, Target } from "lucide-react"

export function HeroSection() {
  return (
    <>
      <section className="relative min-h-[800px] lg:h-[800px] flex items-center pt-20 bg-white overflow-hidden">
        
        {/* Right Background Image */}
        <div className="absolute top-0 right-0 w-full lg:w-[60vw] h-[500px] lg:h-full z-0">
          <Image 
            src="/images/hero-bg.png" 
            fill 
            sizes="60vw"
            className="object-cover" 
            alt="Adult community volunteers cleaning a park" 
            priority 
          />
          
          {/* Wave SVG Overlay */}
          <div className="hidden lg:block absolute top-0 left-[-1px] w-[200px] h-full pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full drop-shadow-[-10px_0_15px_rgba(0,0,0,0.05)]">
              {/* Light green band behind */}
              <path d="M0,0 C80,30 -20,65 50,100 L0,100 Z" fill="#E8F8F0" />
              {/* White front mask */}
              <path d="M0,0 C60,30 -40,65 30,100 L0,100 Z" fill="white" />
            </svg>
          </div>
          
          {/* Mobile gradient mask instead of wave */}
          <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />

          {/* Floating Leaf 1 */}
          <div className="absolute top-[20%] left-[10%] hidden lg:block opacity-90 drop-shadow-md z-10 animate-pulse">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#34D399" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" opacity="0.2"/>
              <path d="M12 2C12 2 14.5 7.5 14.5 12C14.5 16.5 12 22 12 22C12 22 9.5 16.5 9.5 12C9.5 7.5 12 2 12 2Z" fill="#10B981"/>
            </svg>
          </div>
          
          {/* Floating Leaf 2 */}
          <div className="absolute bottom-[40%] left-[5%] hidden lg:block opacity-60 drop-shadow-sm z-10 animate-bounce">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="#6EE7B7" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" opacity="0.3"/>
              <path d="M12 2C12 2 14.5 7.5 14.5 12C14.5 16.5 12 22 12 22C12 22 9.5 16.5 9.5 12C9.5 7.5 12 2 12 2Z" fill="#34D399"/>
            </svg>
          </div>

          {/* Floating Card: Join 1,800+ */}
          <div className="hidden lg:flex absolute top-[15%] left-[8%] z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_15px_40px_rgba(0,0,0,0.1)] items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-[#E8F8F0] p-2.5 rounded-full">
              <Users className="h-6 w-6 text-[#10B981]" />
            </div>
            <div>
              <div className="font-extrabold text-[#052E16] text-[15px] leading-tight">Join 1,800+</div>
              <div className="text-[12px] text-gray-500 font-medium">Civic Heroes</div>
            </div>
          </div>

          {/* Floating Card: Every action counts */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-[15%] z-20 bg-white/95 backdrop-blur-md rounded-[20px] p-5 shadow-[0_15px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-transform duration-300 w-[90%] sm:w-auto min-w-[320px]">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-[#E8F8F0] p-3 rounded-full mt-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#10B981" xmlns="http://www.w3.org/2000/svg">
                   <path d="M17 3H7C4.79 3 3 4.79 3 7V17C3 19.21 4.79 21 7 21H17C19.21 21 21 19.21 21 17V7C21 4.79 19.21 3 17 3ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#10B981"/>
                </svg>
              </div>
              <div>
                <div className="font-extrabold text-[#052E16] text-[15px]">Every action counts!</div>
                <div className="text-[13px] text-gray-500 mt-0.5">Small steps today, big change tomorrow.</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                <img src="https://i.pravatar.cc/100?img=1" className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" alt="Avatar" />
                <img src="https://i.pravatar.cc/100?img=2" className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" alt="Avatar" />
                <img src="https://i.pravatar.cc/100?img=3" className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" alt="Avatar" />
                <img src="https://i.pravatar.cc/100?img=4" className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" alt="Avatar" />
                <img src="https://i.pravatar.cc/100?img=5" className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" alt="Avatar" />
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#10B981] flex items-center justify-center text-[10px] font-bold text-white z-10">+1.2K</div>
              </div>
              <div className="text-[11px] font-semibold text-gray-600 text-right leading-tight">
                Active<br/>Volunteers
              </div>
            </div>
          </div>
        </div>

        {/* Left Content Container */}
        <div className="container relative z-10 mx-auto px-6 lg:px-10 h-full flex items-center mt-[250px] lg:mt-0">
          <div className="max-w-[600px] bg-white/80 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-6 lg:p-0 rounded-3xl">
            
            {/* Gemini Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F8F0] mb-8">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#10B981" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z"/>
              </svg>
              <span className="text-[13px] font-bold text-[#10B981]">Powered by Gemini AI</span>
            </div>

            {/* Headline */}
            <h1 className="text-[42px] sm:text-[56px] lg:text-[72px] font-extrabold tracking-tight leading-[1.05] mb-6">
              <span className="text-[#052E16]">Together, We Build</span>
              <br />
              <span className="text-[#10B981]">Better Communities</span>
            </h1>

            {/* Paragraph */}
            <p className="text-[16px] lg:text-[18px] text-gray-600 mb-10 max-w-[480px] leading-relaxed">
              Report local issues, track progress, earn rewards, and create lasting impact in your neighborhood.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-14">
              <Link href="/register">
                <button className="h-14 px-8 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-bold flex items-center gap-2 transition-all shadow-[0_8px_25px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_30px_rgba(16,185,129,0.4)] hover:-translate-y-1">
                  <span className="text-xl leading-none">+</span>
                  Report Issue
                </button>
              </Link>
              <Link href="/map">
                <button className="h-14 px-8 rounded-full bg-white hover:bg-gray-50 text-[#052E16] font-bold flex items-center gap-2 border border-gray-200 transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                  <MapPin className="h-5 w-5" />
                  Explore Map
                </button>
              </Link>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:w-[130%] bg-white/50 p-2 rounded-[24px]">
              
              {/* Problem GO */}
              <Link href="/problem-go" className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                <div className="bg-[#E8F8F0] p-2.5 rounded-full shrink-0">
                  <MapPinned className="h-5 w-5 text-[#10B981]" />
                </div>
                <div>
                  <div className="font-extrabold text-[#052E16] text-[13px]">Problem GO</div>
                  <div className="text-[11px] text-gray-500 font-medium">Take missions</div>
                </div>
              </Link>

              {/* Leaderboard */}
              <Link href="/leaderboard" className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                <div className="bg-[#FFF8E6] p-2.5 rounded-full shrink-0">
                  <Trophy className="h-5 w-5 text-[#F59E0B]" />
                </div>
                <div>
                  <div className="font-extrabold text-[#052E16] text-[13px]">Leaderboard</div>
                  <div className="text-[11px] text-gray-500 font-medium">Top heroes</div>
                </div>
              </Link>

              {/* Ranking */}
              <Link href="/ranking" className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                <div className="bg-[#E8F8F0] p-2.5 rounded-full shrink-0">
                  <BarChart3 className="h-5 w-5 text-[#10B981]" />
                </div>
                <div>
                  <div className="font-extrabold text-[#052E16] text-[13px]">Ranking</div>
                  <div className="text-[11px] text-gray-500 font-medium">See your rank</div>
                </div>
              </Link>

              {/* Awards */}
              <Link href="/awards" className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                <div className="bg-[#FFF1E6] p-2.5 rounded-full shrink-0">
                  <Medal className="h-5 w-5 text-[#F97316]" />
                </div>
                <div>
                  <div className="font-extrabold text-[#052E16] text-[13px]">Awards</div>
                  <div className="text-[11px] text-gray-500 font-medium">Earn badges</div>
                </div>
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section (Matches Reference perfectly) */}
      <section className="bg-white pb-10 pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-100 shadow-[0_10px_50px_rgba(0,0,0,0.05)] rounded-[40px] p-6 lg:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              
              {/* Stat 1 */}
              <div className="flex items-center gap-5 pt-4 md:pt-0 md:px-6">
                <div className="bg-[#E8F8F0] p-4 rounded-full shrink-0">
                  <FileText className="h-6 w-6 text-[#10B981]" />
                </div>
                <div>
                  <div className="text-[28px] font-extrabold text-[#052E16] leading-none mb-1">12,000+</div>
                  <div className="text-[14px] font-bold text-gray-800">Issues Reported</div>
                  <div className="text-[12px] text-gray-500">By citizens like you</div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-5 pt-4 md:pt-0 md:px-6">
                <div className="bg-[#E8F8F0] p-4 rounded-full shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-[#10B981]" />
                </div>
                <div>
                  <div className="text-[28px] font-extrabold text-[#052E16] leading-none mb-1">9,500+</div>
                  <div className="text-[14px] font-bold text-gray-800">Issues Resolved</div>
                  <div className="text-[12px] text-gray-500">Making real impact</div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center gap-5 pt-4 md:pt-0 md:px-6">
                <div className="bg-[#E8F8F0] p-4 rounded-full shrink-0">
                  <Users className="h-6 w-6 text-[#10B981]" />
                </div>
                <div>
                  <div className="text-[28px] font-extrabold text-[#052E16] leading-none mb-1">1,800+</div>
                  <div className="text-[14px] font-bold text-gray-800">Civic Heroes</div>
                  <div className="text-[12px] text-gray-500">Active volunteers</div>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex items-center gap-5 pt-4 md:pt-0 md:px-6">
                <div className="bg-[#E8F8F0] p-4 rounded-full shrink-0">
                  <Target className="h-6 w-6 text-[#10B981]" />
                </div>
                <div>
                  <div className="text-[28px] font-extrabold text-[#052E16] leading-none mb-1">98%</div>
                  <div className="text-[14px] font-bold text-gray-800">AI Accuracy</div>
                  <div className="text-[12px] text-gray-500">Smart problem detection</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}

"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Shield, ChevronDown, User, MapPinned, Trophy, BarChart3, Medal, LogOut, Sun, Plus } from "lucide-react"
import { useAuthContext } from "@/contexts/AuthContext"
import { logoutUser } from "@/lib/firebase/auth"
import { useRouter } from "next/navigation"

export function LandingNavbar() {
  const { user, profile, loading } = useAuthContext()
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Click outside to close
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logoutUser()
    setDropdownOpen(false)
    router.refresh()
  }

  const getInitials = () => {
    const name = profile?.name || user?.displayName
    if (!name) return "U"
    const parts = name.split(" ")
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return name[0].toUpperCase()
  }

  const displayName = profile?.name || user?.displayName || "Hero"

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Heroes", href: "#heroes" },
    { name: "Impact", href: "#impact" },
    { name: "About Us", href: "#about" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto max-w-[1400px] h-20 flex items-center justify-between px-6 lg:px-10">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-lg border-2 border-[#10B981] flex items-center justify-center text-[#10B981]">
            <Shield className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#052E16]">
            Civic Hero
          </span>
        </Link>

        {/* Center: Links */}
        <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-[14px] font-bold text-[#052E16] hover:text-[#10B981] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <button className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <Sun className="h-5 w-5" />
          </button>

          {!loading && (
            user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 bg-[#F0FDF4] hover:bg-[#ECFDF5] border border-[#10B981]/20 rounded-full h-10 px-1.5 pr-4 transition-all duration-200"
                >
                  <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center overflow-hidden border border-[#10B981]/10">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-bold text-[#052E16]">{getInitials()}</span>
                    )}
                  </div>
                  <span className="text-[13px] font-bold text-[#052E16] hidden md:block">
                    {displayName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-3 w-64 rounded-2xl bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col z-50"
                    >
                      <div className="p-2 flex flex-col gap-1">
                        <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold text-gray-700 hover:text-[#10B981] hover:bg-[#F0FDF4] transition-colors" onClick={() => setDropdownOpen(false)}>
                          <User className="h-4 w-4" /> My Profile
                        </Link>
                        <Link href="/problem-go" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold text-gray-700 hover:text-[#10B981] hover:bg-[#F0FDF4] transition-colors" onClick={() => setDropdownOpen(false)}>
                          <MapPinned className="h-4 w-4" /> Problem GO
                        </Link>
                        <Link href="/leaderboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold text-gray-700 hover:text-[#10B981] hover:bg-[#F0FDF4] transition-colors" onClick={() => setDropdownOpen(false)}>
                          <Trophy className="h-4 w-4" /> Leaderboard
                        </Link>
                        <Link href="/ranking" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold text-gray-700 hover:text-[#10B981] hover:bg-[#F0FDF4] transition-colors" onClick={() => setDropdownOpen(false)}>
                          <BarChart3 className="h-4 w-4" /> Ranking
                        </Link>
                        <Link href="/awards" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold text-gray-700 hover:text-[#10B981] hover:bg-[#F0FDF4] transition-colors" onClick={() => setDropdownOpen(false)}>
                          <Medal className="h-4 w-4" /> Awards
                        </Link>
                      </div>
                      <div className="h-px bg-gray-100 mx-3" />
                      <div className="p-2 flex flex-col gap-1">
                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold text-red-500 hover:bg-red-50 transition-colors text-left w-full"
                        >
                          <LogOut className="h-4 w-4" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="text-[14px] font-bold text-gray-600 hover:text-[#10B981] transition-colors hidden sm:block mr-2">
                Log in
              </Link>
            )
          )}
          
          <Link href="/register">
            <Button className="rounded-full h-10 px-5 font-bold bg-[#10B981] hover:bg-[#059669] text-white shadow-none hover:shadow-md transition-all">
              <Plus className="h-4 w-4 mr-1.5" />
              Report Issue
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

"use client"

import * as React from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Bell, Search, Trophy } from "lucide-react"

export function Navbar() {
 const { profile } = useAuth()

 return (
 <header className="fixed top-0 left-0 right-0 z-40 h-16 glass border-b border-white/20 dark:border-white/10 px-4 md:px-8 flex items-center justify-between">
 <div className="flex items-center gap-4">
 <Link href="/" className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
  Civic Hero
 </Link>
 </div>

 <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
 <div className="hidden md:flex items-center relative w-64 max-w-sm">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
 <input 
 type="text" 
 placeholder="Search location..." 
 className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
 />
 </div>

 <Link href="/leaderboard">
  <Button variant="icon" size="icon" className="relative group hover:text-primary transition-colors">
  <Trophy className="h-5 w-5" />
  </Button>
 </Link>

 <Button variant="icon" size="icon" className="relative">
 <Bell className="h-5 w-5" />
 <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
 </Button>

 <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px]">
 <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden">
 {profile?.avatar ? (
 <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover" />
 ) : (
 <span className="text-xs font-medium">{profile?.name?.charAt(0) || "U"}</span>
 )}
 </div>
 </div>
 </div>
 </header>
 )
}

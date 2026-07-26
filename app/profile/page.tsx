"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthContext } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Trophy, Medal, BarChart3, MapPinned, Star, ShieldCheck, ArrowLeft, LayoutDashboard, ChevronRight } from "lucide-react";
import { getLevelProgress } from "@/utils/xp-helpers";
import { XPHistoryEntry } from "@/types/user";

const getTransactionDetails = (type: string) => {
  switch (type) {
    case "REPORT_CREATED":
      return { icon: "📝", label: "Report Created", color: "text-emerald-600 bg-emerald-50" };
    case "REPORT_APPROVED":
      return { icon: "✅", label: "Report Approved", color: "text-blue-600 bg-blue-50" };
    case "VERIFICATION_COMPLETED":
      return { icon: "🔍", label: "Verification Completed", color: "text-indigo-600 bg-indigo-50" };
    case "HIGH_CONFIDENCE_BONUS":
      return { icon: "🔥", label: "AI High Confidence Bonus", color: "text-amber-600 bg-amber-50" };
    case "AREA_BONUS":
      return { icon: "📍", label: "First in New Area Bonus", color: "text-rose-600 bg-rose-50" };
    case "DAILY_LOGIN":
      return { icon: "☀️", label: "Daily Login Reward", color: "text-yellow-600 bg-yellow-50" };
    case "MILESTONE":
      return { icon: "🏆", label: "Milestone Reached", color: "text-purple-600 bg-purple-50" };
    case "FAKE_REPORT":
      return { icon: "❌", label: "Fake Report Penalty", color: "text-red-600 bg-red-50" };
    case "FAKE_VERIFICATION":
      return { icon: "⚠️", label: "Fake Verification Penalty", color: "text-orange-600 bg-orange-50" };
    default:
      return { icon: "✨", label: "XP Update", color: "text-gray-600 bg-gray-50" };
  }
};

export default function ProfilePage() {
  const { user, profile, loading } = useAuthContext();
  const router = useRouter();
  const [xpHistory, setXpHistory] = useState<XPHistoryEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Load XP transaction history
  useEffect(() => {
    async function loadHistory() {
      if (!user) return;
      try {
        const { getXPHistory } = await import("@/services/xp.service");
        const history = await getXPHistory(user.uid, 10);
        setXpHistory(history);
      } catch (err) {
        console.error("Error loading XP history:", err);
      } finally {
        setLoadingHistory(false);
      }
    }
    loadHistory();
  }, [user]);

  const avatarUrl = profile?.avatar || user?.photoURL || "";

  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [avatarUrl]);

  if (loading || !user || !profile) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const xp = profile.xp || profile.totalXP || 0;
  const { level, progressXP, nextLevelXP, percentage, xpToNextLevel } = getLevelProgress(xp);
  const displayName = profile.name || user.displayName || "Civic Hero";
  const firstInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-6 text-sm font-medium text-gray-500 flex items-center gap-2">
        <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900">Profile</span>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-200 mb-8 relative"
      >
        <div className="absolute top-6 right-6">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2 border-gray-200">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 border-b border-gray-100 pb-8 mb-8">
          <div className="w-[140px] h-[140px] min-w-[140px] min-h-[140px] rounded-full bg-gray-50 flex items-center justify-center border-4 border-primary/20 shadow-inner overflow-hidden flex-shrink-0 relative">
            {avatarUrl && !imageError ? (
              <motion.img
                src={avatarUrl}
                alt={`${displayName}'s profile picture`}
                className="w-full h-full object-cover block"
                onError={() => setImageError(true)}
                onLoad={() => setImageLoaded(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-black select-none">
                {firstInitial}
              </div>
            )}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              {displayName}
            </h1>
            <p className="text-lg text-gray-600 flex items-center justify-center md:justify-start gap-2 font-medium">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              {user.email}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Current XP */}
          <div className="flex flex-col items-center justify-center gap-2 h-[120px] bg-blue-50 border border-blue-100 rounded-xl shadow-sm px-3">
            <p className="text-[13px] font-bold text-blue-600 uppercase tracking-widest leading-none">Current XP</p>
            <p className="text-[44px] font-extrabold text-blue-900 leading-none flex items-center gap-1">
              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500 flex-shrink-0" />
              {xp}
            </p>
          </div>
          {/* Level */}
          <div className="flex flex-col items-center justify-center gap-2 h-[120px] bg-emerald-500 border border-emerald-600 rounded-xl shadow-sm px-3">
            <p className="text-[13px] font-bold text-white/90 uppercase tracking-widest leading-none">Level</p>
            <p className="text-[44px] font-extrabold text-white leading-none">{level}</p>
          </div>
          {/* Reports */}
          <div className="flex flex-col items-center justify-center gap-2 h-[120px] bg-emerald-50 border border-emerald-100 rounded-xl shadow-sm px-3">
            <p className="text-[13px] font-bold text-emerald-700 uppercase tracking-widest leading-none">Reports</p>
            <p className="text-[44px] font-extrabold text-slate-900 leading-none">{profile.reportsSubmitted || 0}</p>
          </div>
          {/* Verifications */}
          <div className="flex flex-col items-center justify-center gap-2 h-[120px] bg-amber-50 border border-amber-100 rounded-xl shadow-sm px-3">
            <p className="text-[13px] font-bold text-amber-700 uppercase tracking-widest leading-none">Verifications</p>
            <p className="text-[44px] font-extrabold text-amber-900 leading-none">{profile.reportsVerified || 0}</p>
          </div>
        </div>

        {/* XP Progress Bar Section */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8 shadow-sm">
          {/* Top row: title + level left, XP fraction right */}
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-[14px] font-semibold text-emerald-700 uppercase tracking-widest mb-2">Level Progress</p>
              <h3 className="text-[42px] font-bold text-slate-900 leading-none">Level {level}</h3>
            </div>
            <div className="text-right pb-1">
              <span className="text-[32px] font-bold text-slate-900 leading-none">{xp}</span>
              <span className="text-slate-600 font-semibold text-base"> / {nextLevelXP} XP</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-4 w-full bg-emerald-100 rounded-full overflow-hidden relative shadow-inner">
            <motion.div
              className="absolute top-0 left-0 bottom-0 bg-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(percentage, 3)}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-[16px] font-semibold text-slate-700">{percentage}% Complete</span>
            <span className="text-[16px] font-semibold text-slate-700">{xpToNextLevel > 0 ? `${xpToNextLevel} XP to Level ${level + 1}` : "Max Level Reached"}</span>
          </div>
        </div>
        
        {/* Badges Earned */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Badges Earned</p>
          <div className="flex items-center justify-center gap-3">
            <Medal className="h-8 w-8 text-rose-500" />
            <span className="text-4xl font-black text-gray-900">{profile.badges?.length || 0}</span>
          </div>
        </div>
      </motion.div>

      {/* Recent XP Activity */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6 px-2">Recent XP Activity</h2>
      <Card className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-200 mb-8">
        {loadingHistory ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : xpHistory.length === 0 ? (
          <p className="text-center py-6 text-gray-500 font-medium">No recent XP activities found.</p>
        ) : (
          <div className="space-y-4">
            {xpHistory.map((item, index) => {
              const details = getTransactionDetails(item.type);
              const isPositive = item.xp >= 0;
              return (
                <div key={item.id || index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${details.color}`}>
                      {details.icon}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{details.label}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-black ${isPositive ? "text-green-600" : "text-red-600"}`}>
                      {isPositive ? `+${item.xp}` : item.xp} XP
                    </span>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                      {item.createdAt 
                        ? (typeof (item.createdAt as any).toDate === "function"
                            ? (item.createdAt as any).toDate().toLocaleDateString()
                            : new Date(item.createdAt as any).toLocaleDateString())
                        : 'Recently'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <h2 className="text-2xl font-bold text-gray-900 mb-6 px-2">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/dashboard">
          <Button variant="outline" className="w-full h-16 text-lg font-bold gap-3 border-gray-300 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm">
            <LayoutDashboard className="h-6 w-6" /> Go to Dashboard
          </Button>
        </Link>
        <Link href="/ranking">
          <Button variant="outline" className="w-full h-16 text-lg font-bold gap-3 border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
            <BarChart3 className="h-6 w-6" /> View Ranking
          </Button>
        </Link>
        <Link href="/awards">
          <Button variant="outline" className="w-full h-16 text-lg font-bold gap-3 border-gray-300 hover:border-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all shadow-sm">
            <Medal className="h-6 w-6" /> View Awards
          </Button>
        </Link>
        <Link href="/leaderboard">
          <Button variant="outline" className="w-full h-16 text-lg font-bold gap-3 border-gray-300 hover:border-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 transition-all shadow-sm">
            <Trophy className="h-6 w-6" /> View Leaderboard
          </Button>
        </Link>
        <Link href="/problem-go">
          <Button className="w-full h-16 text-lg font-bold gap-3 bg-primary hover:bg-primary text-white shadow-md">
            <MapPinned className="h-6 w-6" /> Go to Problem GO
          </Button>
        </Link>
      </div>
    </div>
  );
}

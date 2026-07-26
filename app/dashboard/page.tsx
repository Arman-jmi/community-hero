"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthContext } from "@/contexts/AuthContext";
import { logoutUser } from "@/lib/firebase/auth";
import { toast } from "sonner";
import { LogOut, User, AlertTriangle, ShieldCheck, ClipboardList, Trophy, BarChart3, Medal, MapPinned, Map, ChevronRight } from "lucide-react";

import { useIssues } from "@/hooks/useIssues";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const { user, profile, loading } = useAuthContext();
  const router = useRouter();

  // Fetch only this user's issues
  const { issues: userIssues, loading: issuesLoading } = useIssues(user ? { userId: user.uid } : undefined);

  const [rankingStats, setRankingStats] = useState<any>(null);
  const [topHeroes, setTopHeroes] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!user || !profile) return;
      try {
        const { getUserRankingStats } = await import("@/services/ranking.service");
        const { getLeaderboard } = await import("@/services/leaderboard.service");
        
        const stats = await getUserRankingStats(user.uid, profile.xp || 0);
        setRankingStats(stats);

        const heroes = await getLeaderboard('all-time', 3);
        setTopHeroes(heroes);
      } catch (e) {
        console.error(e);
      } finally {
        setStatsLoading(false);
      }
    }
    loadStats();
  }, [user, profile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Successfully logged out");
      router.push("/login");
    } catch (error: any) {
      toast.error("Failed to log out");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-6 text-sm font-medium text-gray-500 flex items-center gap-2">
        <Link href="/profile" className="hover:text-primary transition-colors">Profile</Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900">Dashboard</span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-200"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100 pb-8 mb-8">
          <Link href="/profile" className="flex items-center gap-6 group hover:opacity-80 transition-opacity">
            <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center border-2 border-primary/30 group-hover:border-primary transition-colors">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="h-full w-full rounded-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                Welcome, {profile?.name || user.displayName || "Hero"}!
              </h1>
              <p className="text-gray-700 flex items-center gap-2 mt-1 font-medium">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                {user.email}
              </p>
            </div>
          </Link>
          
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2 text-gray-700 border-gray-300"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          <Link href="/report" className="block h-full">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="h-full">
              <Card className="h-full cursor-pointer group hover:border-amber-500 transition-colors bg-white shadow-sm border border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-amber-100 text-amber-600 rounded-full w-12 h-12 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h3 className="text-gray-800 font-bold">Report Issue</h3>
              </Card>
            </motion.div>
          </Link>

          <Link href="/problem-go" className="block h-full">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="h-full">
              <Card className="h-full cursor-pointer group hover:border-emerald-500 transition-colors bg-white shadow-sm border border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-emerald-100 text-emerald-600 rounded-full w-12 h-12 flex items-center justify-center mb-3 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <MapPinned className="h-6 w-6" />
                </div>
                <h3 className="text-gray-800 font-bold">Problem GO</h3>
              </Card>
            </motion.div>
          </Link>

          <Link href="/leaderboard" className="block h-full">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="h-full">
              <Card className="h-full cursor-pointer group hover:border-yellow-500 transition-colors bg-white shadow-sm border border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-yellow-100 text-yellow-600 rounded-full w-12 h-12 flex items-center justify-center mb-3 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                  <Trophy className="h-6 w-6" />
                </div>
                <h3 className="text-gray-800 font-bold">Leaderboard</h3>
              </Card>
            </motion.div>
          </Link>

          <Link href="/ranking" className="block h-full">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="h-full">
              <Card className="h-full cursor-pointer group hover:border-blue-500 transition-colors bg-white shadow-sm border border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-3 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-gray-800 font-bold">Ranking</h3>
              </Card>
            </motion.div>
          </Link>

          <Link href="/awards" className="block h-full">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="h-full">
              <Card className="h-full cursor-pointer group hover:border-rose-500 transition-colors bg-white shadow-sm border border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-rose-100 text-rose-600 rounded-full w-12 h-12 flex items-center justify-center mb-3 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                  <Medal className="h-6 w-6" />
                </div>
                <h3 className="text-gray-800 font-bold">Awards</h3>
              </Card>
            </motion.div>
          </Link>

          <Link href="/map" className="block h-full">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="h-full">
              <Card className="h-full cursor-pointer group hover:border-green-500 transition-colors bg-white shadow-sm border border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center mb-3 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <Map className="h-6 w-6" />
                </div>
                <h3 className="text-gray-800 font-bold">Map</h3>
              </Card>
            </motion.div>
          </Link>
        </div>

        {/* Stats & Leaderboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Rank & Stats */}
          <Card className="bg-gradient-to-br from-blue-900 to-indigo-900 border-none text-white shadow-xl rounded-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Trophy className="w-32 h-32" />
            </div>
            <CardHeader>
              <CardTitle className="text-blue-100 font-bold flex items-center gap-2">
                <BarChart3 className="h-5 w-5" /> Your Standing
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="h-12 w-24 bg-white/20 rounded"></div>
                </div>
              ) : (
                <div className="flex items-end gap-6">
                  <div>
                    <p className="text-blue-200 text-sm font-medium mb-1">Global Rank</p>
                    <p className="text-5xl font-black">#{rankingStats?.currentRank || '-'}</p>
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm font-medium mb-1">Weekly XP</p>
                    <p className="text-3xl font-bold text-green-400">+{rankingStats?.weeklyXp || 0}</p>
                  </div>
                </div>
              )}
              <div className="mt-6 flex gap-3">
                <Link href="/ranking" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                  View Details
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Top Heroes */}
          <Card className="bg-white shadow-md border border-gray-200 rounded-2xl">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-gray-800 font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Medal className="h-5 w-5 text-amber-500" /> Top Heroes
                </div>
                <Link href="/leaderboard" className="text-sm text-primary hover:underline font-medium">View All</Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {statsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {topHeroes.map((hero, idx) => (
                    <div key={hero.uid} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          idx === 0 ? 'bg-amber-100 text-amber-700' : 
                          idx === 1 ? 'bg-slate-100 text-slate-700' : 
                          idx === 2 ? 'bg-orange-100 text-orange-800' : 'bg-gray-50 text-gray-500'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden">
                          {hero.avatar ? <img src={hero.avatar} alt={hero.name} className="w-full h-full object-cover" /> : <User className="w-full h-full p-2 text-gray-400" />}
                        </div>
                        <p className="font-semibold text-gray-900">{hero.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">{hero.xp} XP</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Latest Awards Section */}
        {profile?.badges && profile.badges.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Latest Awards</h2>
              <Link href="/awards" className="text-primary hover:underline font-medium">View Collection</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {profile.badges.slice(-5).reverse().map((badge: any, i: number) => (
                <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                    <Medal className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="text-sm font-bold text-amber-900 leading-tight">{badge.id.replace(/_/g, " ")}</p>
                  <p className="text-[10px] text-amber-700/80 uppercase font-semibold mt-2">
                    {badge.earnedAt ? new Date(badge.earnedAt.toDate ? badge.earnedAt.toDate() : badge.earnedAt).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Your Recent Reports Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-between">
            Your Recent Reports
            <Link href="/report" className="text-sm text-primary hover:underline font-medium">View Map</Link>
          </h2>
          {issuesLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : userIssues.length === 0 ? (
            <Card className="p-12 text-center flex flex-col items-center justify-center border border-dashed border-gray-300 bg-gray-50 rounded-2xl shadow-sm">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 border border-gray-200 shadow-sm">
                <ClipboardList className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">No Reports Yet</h3>
              <p className="text-gray-600 mb-6 font-medium">You haven't reported any issues in your community yet.</p>
              <Link href="/report">
                <Button className="w-full sm:w-auto font-semibold shadow-md">
                  Create your first report
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userIssues.slice(0, 6).map(issue => (
                <Card key={issue.id} className="hover:bg-gray-50 transition-colors flex gap-4 overflow-hidden shadow-md border border-gray-200 p-4 rounded-2xl bg-white">
                  {issue.imageUrl && !issue.imageUrl.startsWith("pending") ? (
                    <img 
                      src={issue.imageUrl.startsWith("blob:") ? "/pothole.jpg" : issue.imageUrl} 
                      alt={issue.title} 
                      className="w-20 h-20 object-cover rounded-lg shrink-0 border border-gray-200 shadow-sm" 
                      onError={(e) => { e.currentTarget.src = "/pothole.jpg"; }}
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 border border-gray-200 shadow-sm">
                      <AlertTriangle className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex flex-col justify-between overflow-hidden flex-1">
                    <div>
                      <h4 className="font-bold text-gray-800 truncate">{issue.title}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">{issue.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        issue.status === 'resolved' ? 'text-green-600' :
                        issue.status === 'verified' ? 'text-blue-600' :
                        issue.status === 'rejected' ? 'text-gray-600' :
                        issue.status === 'in_progress' ? 'text-primary' :
                        'text-amber-600'
                      }`}>
                        {issue.status.replace("_", " ")}
                      </span>
                      {issue.createdAt && (
                        <span className="text-xs text-gray-500 font-medium">
                          {formatDistanceToNow(issue.createdAt, { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    {issue.status === 'rejected' && issue.rejectionReason && (
                      <div className="mt-2 bg-gray-50 border border-gray-200 rounded p-2">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Rejection Reason:</p>
                        <p className="text-xs text-gray-700">{issue.rejectionReason}</p>
                      </div>
                    )}
                    {issue.status === 'resolved' && issue.resolutionNote && (
                      <div className="mt-2 bg-green-50 border border-green-200 rounded p-2">
                        <p className="text-xs text-green-700 font-semibold mb-1">Resolution:</p>
                        <p className="text-xs text-green-800">{issue.resolutionNote}</p>
                        {issue.resolutionPhotoUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={issue.resolutionPhotoUrl} alt="Resolution" className="w-full h-24 object-cover rounded mt-2" />
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

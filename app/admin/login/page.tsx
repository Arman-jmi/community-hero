"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { loginUser } from "@/lib/firebase/auth";
import { toast } from "sonner";
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user, profile, loading } = useAuthContext();

  // Redirect if already logged in and is authority
  useEffect(() => {
    if (!loading && user && profile) {
      if (profile.role === "authority") {
        router.push("/admin/dashboard");
      }
    }
  }, [user, profile, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    try {
      console.log("=== AUTHORITY LOGIN DEBUG START ===");
      const user = await loginUser(email, password);
      console.log("Authenticated UID:", user.uid);
      console.log("Authenticated Email:", user.email);
      
      const { db } = await import("@/lib/firebase/config");
      console.log("Firebase Project ID:", db.app.options.projectId);
      
      const { COLLECTIONS } = await import("@/lib/firebase/collections");
      console.log("COLLECTIONS.USERS equals:", COLLECTIONS.USERS);
      
      // Verify authority role
      const { UserService } = await import("@/services/UserService");
      console.log(`Reading from: ${COLLECTIONS.USERS}/${user.uid}`);
      let userProfile = await UserService.getUserProfile(user.uid);
      console.log("Firestore Profile:", userProfile);
      
      if (!userProfile) {
        console.log("userProfile is null! The document might not exist in Firestore or the UID is mismatched.");
        const { logoutUser } = await import("@/lib/firebase/auth");
        await logoutUser();
        toast.error("Access Denied: You are not authorized to access the Authority Portal.");
        setIsSubmitting(false);
        return;
      }
      
      if (userProfile.role !== "authority") {
        console.log(`Role mismatch! Expected 'authority' but got '${userProfile.role}'`);
        const { logoutUser } = await import("@/lib/firebase/auth");
        await logoutUser();
        toast.error("Access Denied: You are not authorized to access the Authority Portal.");
        setIsSubmitting(false);
        return;
      }
      
      console.log("=== AUTHORITY LOGIN DEBUG END ===");
      toast.success("Authentication successful. Welcome to Authority Portal.");
      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error("Login Error:", error);
      toast.error(error.message || "Failed to authenticate.");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-slate-800 p-8 text-center border-b border-slate-700">
          <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Authority Portal</h1>
          <p className="text-slate-400 text-sm">Secure access for community administrators</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Official Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  type="email" 
                  required
                  placeholder="admin@civichero.org" 
                  className="pl-10 h-12 border-slate-200 focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  className="pl-10 h-12 border-slate-200 focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Authenticate <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              This system is restricted to authorized personnel only. All access is logged and monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

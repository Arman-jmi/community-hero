"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { loginWithEmail, loginWithGoogle } from "@/lib/firebase/auth";
import { toast } from "sonner";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
 const router = useRouter();
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [loading, setLoading] = useState(false);
 const [googleLoading, setGoogleLoading] = useState(false);

 const handleEmailLogin = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!email || !password) {
 toast.error("Please fill in all fields");
 return;
 }
 
 setLoading(true);
 try {
 const user = await loginWithEmail(email, password);
 // Verify citizen role
 const { UserService } = await import("@/services/UserService");
 const userProfile = await UserService.getUserProfile(user.uid);
 
 if (!userProfile || userProfile.role !== "citizen") {
 const { logoutUser } = await import("@/lib/firebase/auth");
 await logoutUser();
 toast.error("This account is not a citizen account.");
 setLoading(false);
 return;
 }

 toast.success("Welcome back to Civic Hero!");
 router.push("/dashboard");
 } catch (error: any) {
 toast.error(error.message || "Failed to login. Please try again.");
 } finally {
 setLoading(false);
 }
 };

 const handleGoogleLogin = async () => {
 setGoogleLoading(true);
 try {
 const user = await loginWithGoogle();
 // Verify citizen role
 const { UserService } = await import("@/services/UserService");
 const userProfile = await UserService.getUserProfile(user.uid);
 
 if (!userProfile || userProfile.role !== "citizen") {
 const { logoutUser } = await import("@/lib/firebase/auth");
 await logoutUser();
 toast.error("This account is not a citizen account.");
 setGoogleLoading(false);
 return;
 }

 toast.success("Signed in with Google!");
 router.push("/dashboard");
 } catch (error: any) {
 toast.error(error.message || "Failed to sign in with Google.");
 } finally {
 setGoogleLoading(false);
 }
 };

 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="bg-surface/90 dark:bg-surface/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl border border-border"
 >
 <div className="text-center mb-8">
 <h1 className="text-page-title mb-2">Welcome Back</h1>
 <p className="text-body">Login to continue helping your community.</p>
 </div>

 <form onSubmit={handleEmailLogin} className="space-y-5">
 <div>
 <div className="relative">
 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted h-5 w-5" />
 <Input
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="Email Address"
 className="pl-12"
 />
 </div>
 </div>

 <div>
 <div className="relative">
 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted h-5 w-5" />
 <Input
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 placeholder="Password"
 className="pl-12"
 />
 </div>
 <div className="text-right mt-2">
 <Link
 href="/forgot-password"
 className="text-caption hover:text-text-primary transition-colors"
 >
 Forgot password?
 </Link>
 </div>
 </div>

 <Button
 type="submit"
 size="lg"
 disabled={loading || googleLoading}
 className="w-full gap-2"
 >
 {loading ? (
 <Loader2 className="h-5 w-5 animate-spin" />
 ) : (
 <>
 <span>Sign In</span>
 <ArrowRight className="h-4 w-4" />
 </>
 )}
 </Button>
 </form>

 <div className="my-6 flex items-center">
 <div className="flex-1 border-t border-border"></div>
 <span className="px-3 text-caption font-medium">OR</span>
 <div className="flex-1 border-t border-border"></div>
 </div>

 <Button
 variant="outline"
 size="lg"
 onClick={handleGoogleLogin}
 disabled={loading || googleLoading}
 className="w-full gap-3 shadow-sm border-border bg-surface text-text-primary"
 >
 {googleLoading ? (
 <Loader2 className="h-5 w-5 animate-spin" />
 ) : (
 <>
 <svg className="w-5 h-5" viewBox="0 0 24 24">
 <path
 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
 fill="#4285F4"
 />
 <path
 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
 fill="#34A853"
 />
 <path
 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
 fill="#FBBC05"
 />
 <path
 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
 fill="#EA4335"
 />
 </svg>
 <span>Continue with Google</span>
 </>
 )}
 </Button>

 <div className="mt-8 text-center">
 <p className="text-body">
 Don't have an account?{" "}
 <Link href="/register" className="text-text-primary font-semibold hover:underline">
 Register here
 </Link>
 </p>
 </div>
 </motion.div>
 );
}

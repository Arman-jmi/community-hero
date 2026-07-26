"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { registerWithEmail } from "@/lib/firebase/auth";
import { toast } from "sonner";
import { User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
 const router = useRouter();
 const [name, setName] = useState("");
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [loading, setLoading] = useState(false);

 const handleRegister = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!name || !email || !password) {
 toast.error("Please fill in all fields");
 return;
 }

 if (password.length < 6) {
 toast.error("Password must be at least 6 characters long");
 return;
 }
 
 setLoading(true);
 try {
 await registerWithEmail(email, password, name);
 toast.success("Account created successfully!");
 router.push("/dashboard");
 } catch (error: any) {
 toast.error(error.message || "Failed to create account.");
 } finally {
 setLoading(false);
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
 <h1 className="text-page-title mb-2">Join Civic Hero</h1>
 <p className="text-body">Create an account to make a difference.</p>
 </div>

 <form onSubmit={handleRegister} className="space-y-5">
 <div>
 <div className="relative">
 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted h-5 w-5" />
 <Input
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 placeholder="Full Name"
 className="pl-12"
 />
 </div>
 </div>

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
 placeholder="Password (min. 6 chars)"
 className="pl-12"
 />
 </div>
 </div>

 <Button
 type="submit"
 size="lg"
 disabled={loading}
 className="w-full gap-2 mt-2"
 >
 {loading ? (
 <Loader2 className="h-5 w-5 animate-spin" />
 ) : (
 <>
 <span>Create Account</span>
 <ArrowRight className="h-4 w-4" />
 </>
 )}
 </Button>
 </form>

 <div className="mt-8 text-center">
 <p className="text-body">
 Already have an account?{" "}
 <Link href="/login" className="text-text-primary font-semibold hover:underline">
 Login here
 </Link>
 </p>
 </div>
 </motion.div>
 );
}

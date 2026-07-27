"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { AuthoritySidebar } from "@/components/authority/layout/AuthoritySidebar";
import { AuthorityHeader } from "@/components/authority/layout/AuthorityHeader";
import { toast } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Stable callbacks — prevent AuthoritySidebar/AuthorityHeader from re-rendering
  // whenever unrelated layout state changes.
  const openMobileMenu = useCallback(() => setMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        if (pathname !== "/admin/login") {
          router.push("/admin/login");
        }
      } else if (!profile || profile.role !== "authority") {
        toast.error("Access Denied: You do not have authority privileges.");
        router.push("/dashboard");
      }
    }
  }, [user, profile, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">Loading Authority Portal...</p>
        </div>
      </div>
    );
  }

  // If on login page, don't show sidebar/header
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Guard: not authorized
  if (!profile || profile.role !== "authority") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Access Denied</h2>
          <p className="text-gray-500 text-sm">You are not authorized to access this portal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <AuthoritySidebar
        profile={profile}
        mobileOpen={mobileMenuOpen}
        onMobileClose={closeMobileMenu}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AuthorityHeader onMenuClick={openMobileMenu} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6 xl:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

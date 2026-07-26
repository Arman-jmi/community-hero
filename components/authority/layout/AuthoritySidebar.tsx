"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserProfile } from "@/types/user";
import { logoutUser } from "@/lib/firebase/auth";
import { toast } from "sonner";
import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle2,
  Clock,
  CheckCheck,
  Map,
  BarChart3,
  Settings,
  LogOut,
  Building2,
  ChevronRight,
  Menu,
  X,
  Shield,
} from "lucide-react";

interface AuthoritySidebarProps {
  profile: UserProfile;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navItems = [
  {
    section: "Operations",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Pending Reports", href: "/admin/pending", icon: ClipboardList },
      { name: "Approved Reports", href: "/admin/approved", icon: CheckCircle2 },
      { name: "In Progress", href: "/admin/in-progress", icon: Clock },
      { name: "Resolved Reports", href: "/admin/resolved", icon: CheckCheck },
    ],
  },
  {
    section: "Tools",
    items: [
      { name: "City Map", href: "/admin/map", icon: Map },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    section: "Account",
    items: [
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AuthoritySidebar({ profile, mobileOpen, onMobileClose }: AuthoritySidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    try {
      console.log("Signing out...");
      await logoutUser();
      console.log("Firebase signOut successful");

      // Clear all auth-related storage
      localStorage.clear();
      sessionStorage.clear();

      toast.success("Logged out successfully.");
      setShowLogoutConfirm(false);

      console.log("Redirecting to /login");
      // Hard redirect: forces a full page reload so all React/Firebase
      // in-memory state is wiped. replace() prevents Back-button re-entry.
      window.location.replace("/login");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred.";
      console.error("Logout redirect failed:", message);
      toast.error(`Sign out failed: ${message}`);
      setLoggingOut(false);
    }
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));

  const sidebarContent = (
    <aside className="flex flex-col h-full bg-gray-950 text-white">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight text-white">Civic Hero</p>
            <p className="text-[11px] text-emerald-400 font-medium">Authority Portal</p>
          </div>
        </div>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Region Badge */}
      <div className="mx-4 mt-4 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] text-emerald-400 font-medium uppercase tracking-wider">Zone</p>
            <p className="text-sm font-semibold text-white truncate">
              {profile.adminArea || "All Regions"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navItems.map((group) => (
          <div key={group.section}>
            <p className="px-3 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              {group.section}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onMobileClose}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                        active
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                          : "text-gray-400 hover:text-white hover:bg-white/8"
                      }`}
                    >
                      <item.icon
                        className={`w-4.5 h-4.5 flex-shrink-0 transition-colors ${
                          active ? "text-white" : "text-gray-500 group-hover:text-gray-300"
                        }`}
                      />
                      <span className="flex-1">{item.name}</span>
                      {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Profile + Sign Out */}
      <div className="px-3 py-4 border-t border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 mb-2">
          <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
            {profile.name?.charAt(0)?.toUpperCase() ?? "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">{profile.name}</p>
            <p className="text-[11px] text-gray-400 truncate">{profile.email}</p>
          </div>
        </div>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 active:bg-red-500/20 transition-all duration-200 group"
        >
          <LogOut className="w-4.5 h-4.5 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );

  /* ── Logout Confirmation Modal ── */
  const logoutModal = showLogoutConfirm && (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !loggingOut && setShowLogoutConfirm(false)}
      />
      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto">
          <LogOut className="w-7 h-7 text-red-600" />
        </div>
        {/* Text */}
        <div className="text-center">
          <h2 id="logout-dialog-title" className="text-lg font-bold text-gray-900">
            Sign Out?
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            You will be signed out of the Authority Portal. Any unsaved changes will be lost.
          </p>
        </div>
        {/* Actions */}
        <div className="flex gap-3 mt-1">
          <button
            onClick={() => setShowLogoutConfirm(false)}
            disabled={loggingOut}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleLogoutConfirm}
            disabled={loggingOut}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loggingOut ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Signing out…
              </>
            ) : (
              "Sign Out"
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          {/* Drawer */}
          <div className="relative w-72 h-full">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal (portal-level, renders above everything) */}
      {logoutModal}
    </>
  );
}

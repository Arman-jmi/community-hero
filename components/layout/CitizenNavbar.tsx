"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, TriangleAlert, AlertTriangle, Gamepad2, MapPinned, Trophy, Medal, UserCircle, LogOut, Menu, X } from "lucide-react";
import { logoutUser } from "@/lib/firebase/auth";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function CitizenNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Report Issue", href: "/report", icon: TriangleAlert || AlertTriangle },
    { name: "Problem GO", href: "/problem-go", icon: Gamepad2 },
    { name: "Map", href: "/map", icon: MapPinned },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { name: "Awards", href: "/awards", icon: Medal },
    { name: "Profile", href: "/profile", icon: UserCircle },
  ];

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Successfully logged out");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[72px]">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 group cursor-pointer hover:scale-105 transition-transform duration-300">
              <div className="w-9 h-9 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-bold shadow-md">
                CH
              </div>
              <span className="font-bold text-xl text-slate-800 hidden sm:block">Civic Hero</span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-1 lg:space-x-2 overflow-x-auto no-scrollbar py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center px-4 py-2.5 rounded-xl text-sm transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-emerald-500 text-white shadow-md font-semibold hover:scale-105"
                      : "text-slate-700 hover:bg-slate-100 font-medium"
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 transition-colors duration-300 ${isActive ? "text-white" : "text-slate-500 group-hover:text-emerald-500"}`} />
                  <span className="whitespace-nowrap">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-[19px] left-1/2 w-1/2 h-[3px] bg-emerald-500 rounded-t-full -translate-x-1/2 hidden md:block"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            
            <button
              onClick={handleLogout}
              className="group flex items-center px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 ml-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2 text-slate-500 group-hover:text-red-500 transition-colors" />
              Sign Out
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg shadow-inner">
          <div className="pt-2 pb-4 space-y-1 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3.5 rounded-xl text-base transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-emerald-500 text-white shadow-md font-semibold"
                      : "text-slate-700 hover:bg-slate-100 font-medium"
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 transition-colors duration-300 ${isActive ? "text-white" : "text-slate-500 group-hover:text-emerald-500"}`} />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="group flex items-center w-full px-4 py-3.5 rounded-xl text-base font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 mt-2 transition-all duration-300 cursor-pointer"
            >
              <LogOut className="w-5 h-5 mr-3 text-slate-500 group-hover:text-red-500 transition-colors" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

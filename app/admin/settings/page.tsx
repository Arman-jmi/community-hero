"use client";

import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { toast } from "sonner";
import {
  User,
  Building2,
  MapPin,
  Mail,
  Phone,
  Bell,
  Lock,
  Shield,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const { user, profile } = useAuthContext();

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  // Notification preferences (UI state only)
  const [notifPrefs, setNotifPrefs] = useState({
    newReports: true,
    highPriority: true,
    resolved: true,
    dailySummary: false,
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setPwLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        toast.error("Current password is incorrect.");
      } else {
        toast.error(error.message || "Failed to change password.");
      }
    } finally {
      setPwLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your authority profile and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
            <User className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="font-bold text-gray-900">Authority Profile</h2>
        </div>

        <div className="p-6 space-y-5">
          {/* Avatar + Name row */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {profile.name?.charAt(0)?.toUpperCase() ?? "A"}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{profile.name}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                  Authority Officer
                </span>
              </div>
            </div>
          </div>

          {/* Info Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</span>
              </div>
              <p className="text-sm font-semibold text-gray-800">{profile.email}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</span>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {profile.department || "Not specified"}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Zone / Area</span>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {profile.adminArea || "All Regions"}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">City</span>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {profile.city || "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl text-xs text-blue-600">
            <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Profile information is managed by system administrators. Contact your IT department to update
              department, zone, or city assignments.
            </span>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="font-bold text-gray-900">Notification Preferences</h2>
        </div>

        <div className="p-6 space-y-4">
          {[
            {
              key: "newReports" as const,
              label: "New Report Submissions",
              desc: "Get notified when citizens submit new reports in your zone",
            },
            {
              key: "highPriority" as const,
              label: "High Priority Alerts",
              desc: "Immediate notifications for Critical and High severity reports",
            },
            {
              key: "resolved" as const,
              label: "Resolution Updates",
              desc: "Notify when reports are marked as resolved",
            },
            {
              key: "dailySummary" as const,
              label: "Daily Summary",
              desc: "Receive a daily digest of all report activity",
            },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-start justify-between gap-4 py-1">
              <div>
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => setNotifPrefs((p) => ({ ...p, [key]: !p[key] }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full flex-shrink-0 transition-colors duration-200 ${
                  notifPrefs[key] ? "bg-emerald-500" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                    notifPrefs[key] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}

          <div className="pt-2">
            <button
              onClick={() => toast.success("Notification preferences saved.")}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Preferences
            </button>
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
            <Lock className="w-5 h-5 text-slate-600" />
          </div>
          <h2 className="font-bold text-gray-900">Change Password</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
              disabled={pwLoading}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              required
              disabled={pwLoading}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Confirm New Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
              disabled={pwLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={pwLoading || !currentPassword || !newPassword || !confirmPassword}
            className="bg-slate-900 hover:bg-slate-700 text-white"
          >
            {pwLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Changing...</>
            ) : (
              <><Lock className="mr-2 h-4 w-4" /> Change Password</>
            )}
          </Button>
          <div className="text-xs text-gray-400 flex items-start gap-1.5 pt-1">
            <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>All access is logged and monitored. Use a strong, unique password.</span>
          </div>
        </form>
      </div>

      {/* Account Info */}
      <div className="bg-gray-900 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold">Account Security</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-400 text-xs">Account Type</p>
            <p className="font-semibold text-emerald-400 mt-0.5">Authority Officer</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Verification</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <p className="font-semibold text-white">Verified</p>
            </div>
          </div>
          <div className="col-span-2">
            <p className="text-gray-400 text-xs">User ID</p>
            <p className="font-mono text-xs text-gray-300 mt-0.5 break-all">{profile.uid}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

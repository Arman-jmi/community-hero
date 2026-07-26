import { Timestamp } from "firebase/firestore";

export type UserRole = "citizen" | "authority";

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  earnedAt: Timestamp;
  iconUrl?: string;
}

// XP transaction types for the history ledger
export type XPTransactionType =
  | "REPORT_CREATED"
  | "REPORT_APPROVED"
  | "VERIFICATION_COMPLETED"
  | "HIGH_CONFIDENCE_BONUS"
  | "AREA_BONUS"
  | "DAILY_LOGIN"
  | "MILESTONE"
  | "FAKE_REPORT"
  | "FAKE_VERIFICATION";

export interface XPHistoryEntry {
  id?: string;
  type: XPTransactionType;
  xp: number;
  description: string;
  issueId?: string;
  createdAt: Timestamp | Date;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  
  // Authority Specific Fields
  department?: string;
  city?: string;
  verified?: boolean;
  
  adminArea?: string; // e.g. "Jammu", "Delhi"
  xp: number;
  level: number;
  trustScore: number;
  reportsSubmitted: number;
  reportsVerified: number;
  fakeReports: number;
  badges: UserBadge[];
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // New XP system fields (optional for backward compat)
  totalXP?: number;
  lastDailyReward?: Timestamp | null;
  reportsApproved?: number;
  successfulVerifications?: number;
}


import { db } from "@/lib/firebase/config";
import { collection, doc, getDocs, query, where, updateDoc, addDoc, Timestamp, orderBy, deleteDoc, getDoc } from "firebase/firestore";
import { IssueReport } from "@/types/issue";
import { AuditLog, AdminAction } from "@/types/audit";
import { awardXP, deductXP, checkAreaBonus, checkMilestones } from "@/services/xp.service";
import { XP_VALUES } from "@/utils/xpConstants";

/**
 * Fetch reports for an admin, optionally filtered by area and status
 */
export async function getAdminReports(adminArea?: string, statusFilter?: string): Promise<IssueReport[]> {
  const reportsRef = collection(db, "reports");
  
  let q = query(reportsRef, orderBy("createdAt", "desc"));

  // If admin is assigned an area, filter by it (or just return all if not specified for a super admin)
  if (adminArea) {
    q = query(q, where("adminArea", "==", adminArea));
  }

  if (statusFilter && statusFilter !== "all") {
    q = query(q, where("status", "==", statusFilter));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IssueReport));
}

/**
 * Log an action to the auditLogs collection
 */
export async function logAdminAction(log: Omit<AuditLog, "id" | "timestamp">) {
  const auditLogsRef = collection(db, "auditLogs");
  await addDoc(auditLogsRef, {
    ...log,
    timestamp: Timestamp.now()
  });
}

/**
 * Update the status of a report and log the action
 */
export async function updateReportStatus(
  reportId: string,
  previousStatus: string,
  newStatus: "pending" | "verified" | "in_progress" | "resolved" | "rejected",
  adminInfo: { adminId: string; adminName: string; adminEmail: string },
  additionalUpdates: Partial<IssueReport> = {},
  actionName: AdminAction,
  notes?: string
): Promise<void> {
  const reportRef = doc(db, "reports", reportId);

  // 1. Update report
  await updateDoc(reportRef, {
    status: newStatus,
    updatedAt: Timestamp.now(),
    ...additionalUpdates
  });

  // 2. Log action
  await logAdminAction({
    reportId,
    adminId: adminInfo.adminId,
    adminName: adminInfo.adminName,
    adminEmail: adminInfo.adminEmail,
    action: actionName,
    previousStatus,
    newStatus,
    notes
  });

  // 3. XP hooks based on action
  try {
    const reportSnap = await getDoc(doc(db, "reports", reportId));
    const reportData = reportSnap.exists() ? reportSnap.data() : null;
    const reporterUserId = reportData?.userId;

    if (reporterUserId) {
      if (actionName === "approve") {
        // Award REPORT_APPROVED XP
        await awardXP(
          reporterUserId,
          "REPORT_APPROVED",
          XP_VALUES.REPORT_APPROVED,
          "Report approved by admin",
          reportId
        );
        // Check for area bonus
        const adminArea = reportData?.adminArea;
        if (adminArea) {
          await checkAreaBonus(reporterUserId, adminArea, reportId);
        }
        // Check milestones
        await checkMilestones(reporterUserId, reportId);
      } else if (actionName === "reject" && notes?.toLowerCase().includes("fake")) {
        // Deduct XP for fake report
        await deductXP(
          reporterUserId,
          "FAKE_REPORT",
          Math.abs(XP_VALUES.FAKE_REPORT),
          "Fake report penalty",
          reportId
        );
      }
    }
  } catch (xpError) {
    console.error("Error processing XP for admin action:", xpError);
  }
}

/**
 * Permanently delete a fake/spam report
 */
export async function deleteReport(reportId: string, adminInfo: { adminId: string; adminName: string; adminEmail: string }): Promise<void> {
  // Read report before deleting to get userId for XP deduction
  const reportRef = doc(db, "reports", reportId);
  const reportSnap = await getDoc(reportRef);
  const reporterUserId = reportSnap.exists() ? reportSnap.data()?.userId : null;

  await deleteDoc(reportRef);

  await logAdminAction({
    reportId,
    adminId: adminInfo.adminId,
    adminName: adminInfo.adminName,
    adminEmail: adminInfo.adminEmail,
    action: "delete",
    previousStatus: "any",
    newStatus: "deleted",
    notes: "Permanently deleted report."
  });

  // Deduct XP for fake/spam report
  if (reporterUserId) {
    try {
      await deductXP(
        reporterUserId,
        "FAKE_REPORT",
        Math.abs(XP_VALUES.FAKE_REPORT),
        "Report deleted as fake/spam",
        reportId
      );
    } catch (xpError) {
      console.error("Error deducting XP for deleted report:", xpError);
    }
  }
}

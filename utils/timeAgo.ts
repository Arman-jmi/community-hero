import { formatDistanceToNow } from "date-fns";

/**
 * Convert a Firestore Timestamp or Date-like value to a relative time string.
 * e.g. "3 minutes ago", "2 days ago"
 *
 * Extracted from duplicated helpers in:
 * - app/admin/dashboard/page.tsx
 * - components/authority/reports/ReportCard.tsx
 * - components/authority/layout/AuthorityHeader.tsx
 */
export function getTimeAgo(createdAt: unknown): string {
  if (!createdAt) return "Unknown";
  try {
    const d = createdAt as { toDate?: () => Date };
    const date = d?.toDate ? d.toDate() : new Date(createdAt as string | number | Date);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "Unknown";
  }
}

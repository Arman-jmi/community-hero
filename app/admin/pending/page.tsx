import { ReportListPage } from "@/components/authority/reports/ReportListPage";

export default function PendingReportsPage() {
  return (
    <ReportListPage
      statusFilter="pending"
      title="Pending Reports"
      subtitle="Reports submitted by citizens awaiting your review and approval."
      emptyMessage="No pending reports"
    />
  );
}

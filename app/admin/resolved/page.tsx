import { ReportListPage } from "@/components/authority/reports/ReportListPage";

export default function ResolvedReportsPage() {
  return (
    <ReportListPage
      statusFilter="resolved"
      title="Resolved Reports"
      subtitle="Successfully resolved civic issues. A record of completed work."
      emptyMessage="No resolved reports yet"
    />
  );
}

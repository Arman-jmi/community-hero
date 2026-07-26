import { ReportListPage } from "@/components/authority/reports/ReportListPage";

export default function ApprovedReportsPage() {
  return (
    <ReportListPage
      statusFilter="verified"
      title="Approved Reports"
      subtitle="Reports that have been reviewed and approved. Assign them to departments for action."
      emptyMessage="No approved reports"
    />
  );
}

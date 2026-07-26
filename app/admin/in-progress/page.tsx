import { ReportListPage } from "@/components/authority/reports/ReportListPage";

export default function InProgressReportsPage() {
  return (
    <ReportListPage
      statusFilter="in_progress"
      title="In Progress"
      subtitle="Reports actively being worked on by assigned departments."
      emptyMessage="No in-progress reports"
    />
  );
}

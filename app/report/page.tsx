import { ReportForm } from "@/components/report/ReportForm"
import { Navbar } from "@/components/navigation/navbar"
import { PageContainer } from "@/components/layouts/page-container"

export const metadata = {
 title: "Report an Issue | Civic Hero",
 description: "Submit a new civic issue using AI.",
}

export default function ReportPage() {
 return (
 <div className="min-h-screen bg-background">
 <Navbar />
 
 <PageContainer className="pt-24 md:pt-32">
 <div className="max-w-4xl mx-auto text-center mb-12">
 <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-50 dark:to-gray-400">
 Report a Civic Issue
 </h1>
 <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
 Snap a photo and let our AI handle the rest. By reporting issues, you help keep the community safe and earn trust points.
 </p>
 </div>

 <ReportForm />
 </PageContainer>
 </div>
 )
}

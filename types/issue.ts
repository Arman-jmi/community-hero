export interface Location {
  lat: number
  lng: number
  address?: string
}

export interface AIAnalysisResult {
  category: string
  title: string
  description: string
  severity: "Low" | "Medium" | "High" | "Critical"
  confidence: number
  department: string
  repairTime: string
  duplicateReportPossibility: boolean
  error?: string // Optional error message
  errorCode?: string // Optional structured error code
}

export interface IssueReport {
  id?: string
  userId?: string
  reporterName?: string
  reporterEmail?: string
  reporterPhoto?: string
  title: string
  description?: string
  category: string
  severity: "Low" | "Medium" | "High" | "Critical"
  location: Location
  imageUrl: string // This will be the Cloud Storage URL after upload
  aiAnalysis?: AIAnalysisResult
  status: "pending" | "verified" | "in_progress" | "resolved" | "rejected" | "community_verified"
  adminArea?: string
  assignedDepartment?: string
  rejectionReason?: string
  resolutionNote?: string
  resolutionPhotoUrl?: string
  resolvedAt?: Date
  createdAt?: Date
  updatedAt?: Date
  // Community verification tracking (Problem GO)
  verificationCount?: number
  verifiedBy?: string[]
  communityVerified?: boolean
  problemGoVisible?: boolean
}
